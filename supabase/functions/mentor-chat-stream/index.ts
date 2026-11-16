/**
 * mentor-chat-stream — Streaming SSE version of Mentor IA (Gemini 3.8 + GenUI)
 *
 * SSE protocol:
 *   data: {"conversationId":"..."}\n\n
 *   data: {"chunk":"texto..."}\n\n
 *   data: {"done":true,"conversationId":"...","model":"..."}\n\n
 *   data: {"error":"mensaje"}\n\n
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { getCorsHeaders } from "../_shared/cors.ts";
import { logInfo, logWarn, logError } from "../_shared/log.ts";
import { mentorChatSchema, formatZodError } from "../_shared/schemas.ts";
import { streamAIText, type AIMessage, type StreamChunkCallback } from "../_shared/ai.ts";
import {
  buildUserContext,
  getMentorConfig,
  getConversationHistory,
} from "../_shared/mentorContext.ts";

async function verifyJwt(token: string): Promise<{ id: string; email?: string } | null> {
  try {
    const res = await fetch(`${Deno.env.get("SUPABASE_URL")!}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      },
    });
    if (!res.ok) return null;
    const user = await res.json();
    return { id: user.id, email: user.email };
  } catch {
    return null;
  }
}

const rlMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, limit: number): boolean {
  const now = Date.now();
  const entry = rlMap.get(key);
  if (!entry || now > entry.resetAt) {
    rlMap.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

Deno.serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get("Origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing authorization" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const user = await verifyJwt(authHeader.replace("Bearer ", ""));
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!checkRateLimit(user.id, 20)) {
    return new Response(JSON.stringify({ error: "Demasiados mensajes. Esperá un momento." }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const rawBody = await req.json().catch(() => null);
  const parsed = mentorChatSchema.safeParse(rawBody);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: formatZodError(parsed.error) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const message = parsed.data.message.trim();
  const conversationId = parsed.data.conversationId ?? null;

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const enc = new TextEncoder();

  const send = async (payload: Record<string, unknown>) => {
    await writer.write(enc.encode(`data: ${JSON.stringify(payload)}\n\n`));
  };

  (async () => {
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const mentorConfig = await getMentorConfig(supabase);
      if (!mentorConfig.enabled) {
        await send({ error: "El Mentor IA no está disponible en este momento" });
        return;
      }

      let activeConversationId = conversationId;
      if (activeConversationId) {
        const { data: existingConv } = await supabase
          .from("mentor_conversations")
          .select("user_id")
          .eq("id", activeConversationId)
          .maybeSingle();

        if (!existingConv || existingConv.user_id !== user.id) {
          logWarn("mentor-chat-stream", "conversationId no pertenece al usuario, creando nueva", {
            userId: user.id,
            conversationId: activeConversationId,
          });
          activeConversationId = null;
        }
      }

      if (!activeConversationId) {
        const { data: newConv, error: convError } = await supabase
          .from("mentor_conversations")
          .insert({
            user_id: user.id,
            title: message.substring(0, 80) + (message.length > 80 ? "..." : ""),
          })
          .select("id")
          .single();

        if (convError) {
          logError("mentor-chat-stream", "Failed to create conversation", {
            error: convError.message,
          });
          await send({ error: "Error al crear conversación" });
          return;
        }

        activeConversationId = newConv.id;
        await send({ conversationId: activeConversationId });
      }

      const [userContext, history] = await Promise.all([
        buildUserContext(supabase, user.id),
        getConversationHistory(supabase, activeConversationId!, 10),
      ]);

      const { error: userMsgErr } = await supabase.from("mentor_messages").insert({
        conversation_id: activeConversationId,
        user_id: user.id,
        role: "user",
        content: message,
      });
      if (userMsgErr) {
        logWarn("mentor-chat-stream", "User message insert failed", { error: userMsgErr.message });
      }

      const systemWithContext = `${mentorConfig.systemPrompt
        .replace("{user_context}", userContext)
        .replace(
          "{conversation_history}",
          history.length > 0
            ? history.map((m) => `${m.role === "user" ? "Usuario" : "Mentor"}: ${m.content}`).join("\n")
            : "Primera interacción."
        )}\n\nCONTEXTO DEL LÍDER:\n${userContext}`;

      const aiMessages: AIMessage[] = [
        { role: "system", content: systemWithContext },
        ...history,
        { role: "user", content: message },
      ];

      const onChunk: StreamChunkCallback = (chunk) => send({ chunk });

      const result = await streamAIText(aiMessages, onChunk, {
        thinkingLevel: mentorConfig.thinkingLevel,
        temperature: 0.7,
        maxTokens: 900,
        logTag: "mentor-chat-stream",
      });

      let finalContent: string;
      let finalModel: string;

      if (result) {
        finalContent = result.content;
        finalModel = result.model;
      } else {
        finalContent =
          "Disculpá, en este momento no logré conectar con el motor del Mentor IA. Podés reformular tu consulta en unos segundos o escribirnos directo por el canal de soporte.";
        await send({ chunk: finalContent });
        finalModel = "fallback";
      }

      const { error: assistantErr } = await supabase.from("mentor_messages").insert({
        conversation_id: activeConversationId,
        user_id: user.id,
        role: "assistant",
        content: finalContent,
        model_used: finalModel,
        tokens_used: result?.tokensUsed ?? 0,
      });
      if (assistantErr) {
        logWarn("mentor-chat-stream", "Assistant message insert failed", { error: assistantErr.message });
      }

      await supabase
        .from("mentor_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", activeConversationId);

      logInfo("mentor-chat-stream", "Stream complete", {
        userId: user.id,
        conversationId: activeConversationId,
        model: finalModel,
      });

      await send({
        done: true,
        conversationId: activeConversationId,
        model: finalModel,
      });
    } catch (e) {
      logError("mentor-chat-stream", "Unhandled stream error", { error: String(e) });
      try {
        await send({ error: "Error interno del servidor" });
      } catch {
        // stream already closed
      }
    } finally {
      try {
        await writer.close();
      } catch {
        // already closed
      }
    }
  })();

  return new Response(readable, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
});
