/**
 * mentor-chat — Unary Edge Function for Mentor IA (Gemini 3.8 Flash + 4D Context)
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { withMiddleware } from "../_shared/middleware.ts";
import { jsonHeaders } from "../_shared/cors.ts";
import { logInfo, logWarn, logError } from "../_shared/log.ts";
import { mentorChatSchema, formatZodError } from "../_shared/schemas.ts";
import { generateAIText, type AIMessage } from "../_shared/ai.ts";
import {
  buildUserContext,
  getMentorConfig,
  getConversationHistory,
} from "../_shared/mentorContext.ts";

Deno.serve(
  withMiddleware({ auth: true, rateLimit: 20 }, async (req, ctx) => {
    const headers = { ...jsonHeaders(ctx.origin) };

    try {
      const rawBody = await req.json().catch(() => null);
      const parsed = mentorChatSchema.safeParse(rawBody);

      if (!parsed.success) {
        return new Response(JSON.stringify({ error: formatZodError(parsed.error) }), {
          status: 400,
          headers,
        });
      }

      const { message, conversationId } = parsed.data;

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const userId = ctx.user!.id;
      const mentorConfig = await getMentorConfig(supabase);

      if (!mentorConfig.enabled) {
        return new Response(JSON.stringify({ error: "El Mentor IA no está disponible en este momento" }), {
          status: 503,
          headers,
        });
      }

      let activeConversationId = conversationId ?? null;

      if (activeConversationId) {
        const { data: existingConv } = await supabase
          .from("mentor_conversations")
          .select("user_id")
          .eq("id", activeConversationId)
          .maybeSingle();

        if (!existingConv || existingConv.user_id !== userId) {
          logWarn("mentor-chat", "conversationId no pertenece al usuario, creando nueva", {
            userId,
            conversationId: activeConversationId,
          });
          activeConversationId = null;
        }
      }

      if (!activeConversationId) {
        const { data: newConv, error: convError } = await supabase
          .from("mentor_conversations")
          .insert({
            user_id: userId,
            title: message.substring(0, 80) + (message.length > 80 ? "..." : ""),
          })
          .select("id")
          .single();

        if (convError) {
          logError("mentor-chat", "Failed to create conversation", { error: convError.message });
          return new Response(JSON.stringify({ error: "Error al crear conversación" }), {
            status: 500,
            headers,
          });
        }

        activeConversationId = newConv.id;
      }

      const [userContext, history] = await Promise.all([
        buildUserContext(supabase, userId),
        getConversationHistory(supabase, activeConversationId, 10),
      ]);

      await supabase.from("mentor_messages").insert({
        conversation_id: activeConversationId,
        user_id: userId,
        role: "user",
        content: message.trim(),
      });

      const systemWithContext = `${mentorConfig.systemPrompt
        .replace("{user_context}", userContext)
        .replace(
          "{conversation_history}",
          history.length > 0
            ? history.map((m) => `${m.role === "user" ? "Usuario" : "Mentor"}: ${m.content}`).join("\n")
            : "Primera interacción."
        )}\n\nCONTEXTO DEL LÍDER:\n${userContext}`;

      const messages: AIMessage[] = [
        { role: "system", content: systemWithContext },
        ...history,
        { role: "user", content: message.trim() },
      ];

      const aiResponse = (await generateAIText(messages, {
        profile: "reasoning",
        thinkingLevel: mentorConfig.thinkingLevel,
        temperature: 0.7,
        maxTokens: 900,
        logTag: "mentor-chat",
      })) ?? {
        content:
          "Disculpá, tuve un problema técnico al conectar con el motor de IA. ¿Podés reformular tu consulta en un momento?",
        model: "fallback",
        tokensUsed: 0,
      };

      await supabase.from("mentor_messages").insert({
        conversation_id: activeConversationId,
        user_id: userId,
        role: "assistant",
        content: aiResponse.content,
        tokens_used: aiResponse.tokensUsed,
        model_used: aiResponse.model,
      });

      await supabase
        .from("mentor_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", activeConversationId);

      logInfo("mentor-chat", "Response generated", {
        userId,
        conversationId: activeConversationId,
        model: aiResponse.model,
        tokens: aiResponse.tokensUsed,
      });

      return new Response(
        JSON.stringify({
          response: aiResponse.content,
          conversationId: activeConversationId,
          model: aiResponse.model,
        }),
        { status: 200, headers }
      );
    } catch (e) {
      logError("mentor-chat", "Unhandled error", { error: String(e) });
      return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
        status: 500,
        headers,
      });
    }
  })
);
