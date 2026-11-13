/**
 * mentor-chat — Edge Function para el Modo Mentor IA
 *
 * Usa middleware compartido para CORS + Auth + Rate Limiting.
 * Cadena IA: Gemini → Groq → OpenRouter → fallback.
 * Inyecta contexto del usuario (perfil + diagnóstico + historial).
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { withMiddleware } from "../_shared/middleware.ts";
import { jsonHeaders } from "../_shared/cors.ts";
import { logInfo, logWarn, logError } from "../_shared/log.ts";
import { mentorChatSchema, formatZodError } from "../_shared/schemas.ts";

// ── AI Call Chain ───────────────────────────────────────────────

interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AIResponse {
  content: string;
  model: string;
  tokensUsed: number;
}

async function callGemini(messages: AIMessage[]): Promise<AIResponse | null> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) return null;

  try {
    // Build prompt from messages
    const systemMsg = messages.find((m) => m.role === "system")?.content || "";
    const conversationMsgs = messages.filter((m) => m.role !== "system");
    const prompt = `${systemMsg}\n\n${conversationMsgs.map((m) => `${m.role === "user" ? "Usuario" : "Mentor"}: ${m.content}`).join("\n")}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
        }),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const tokens = data.usageMetadata?.totalTokenCount || 0;

    return text ? { content: text, model: "gemini-2.0-flash", tokensUsed: tokens } : null;
  } catch (e) {
    logWarn("mentor-chat", "Gemini failed", { error: String(e) });
    return null;
  }
}

async function callGroq(messages: AIMessage[]): Promise<AIResponse | null> {
  const key = Deno.env.get("GROQ_API_KEY");
  if (!key) return null;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";
    const tokens = data.usage?.total_tokens || 0;

    return text ? { content: text, model: "llama-3.3-70b-versatile", tokensUsed: tokens } : null;
  } catch (e) {
    logWarn("mentor-chat", "Groq failed", { error: String(e) });
    return null;
  }
}

async function callOpenRouter(messages: AIMessage[]): Promise<AIResponse | null> {
  const key = Deno.env.get("OPENROUTER_API_KEY");
  if (!key) return null;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages,
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";
    const tokens = data.usage?.total_tokens || 0;

    return text ? { content: text, model: "deepseek-v3", tokensUsed: tokens } : null;
  } catch (e) {
    logWarn("mentor-chat", "OpenRouter failed", { error: String(e) });
    return null;
  }
}

async function callAI(messages: AIMessage[]): Promise<AIResponse> {
  const result = (await callGemini(messages)) ||
    (await callGroq(messages)) ||
    (await callOpenRouter(messages));

  if (result) return result;

  // Ultimate fallback: generic helpful response
  return {
    content: "Disculpá, tuve un problema técnico. ¿Podés reformular tu consulta? Si el problema persiste, contactá al soporte de Mejora Continua.",
    model: "fallback",
    tokensUsed: 0,
  };
}

// ── Context Builder ─────────────────────────────────────────────

const DIMENSION_QUESTIONS: Array<{
  id: number;
  dom: "personal" | "organizacional" | "comercial" | "empresarial";
  sec: "personal" | "organizacional" | "comercial" | "empresarial";
}> = [
  { id: 1, dom: "organizacional", sec: "personal" },
  { id: 2, dom: "comercial", sec: "empresarial" },
  { id: 3, dom: "comercial", sec: "personal" },
  { id: 4, dom: "organizacional", sec: "personal" },
  { id: 5, dom: "empresarial", sec: "organizacional" },
  { id: 6, dom: "comercial", sec: "empresarial" },
  { id: 7, dom: "empresarial", sec: "personal" },
  { id: 8, dom: "comercial", sec: "empresarial" },
];

function computeFourDimensions(respuestas: unknown): string | null {
  if (!respuestas || typeof respuestas !== "object") return null;
  const scores = { personal: 0, organizacional: 0, comercial: 0, empresarial: 0 };
  const maxPorArea = { personal: 0, organizacional: 0, comercial: 0, empresarial: 0 };
  const record = respuestas as Record<string, number>;

  DIMENSION_QUESTIONS.forEach((q, idx) => {
    const raw = Array.isArray(respuestas) ? respuestas[idx] : record[String(q.id)];
    const val = typeof raw === "number" ? raw : 3;
    scores[q.dom] += val * 0.7;
    scores[q.sec] += val * 0.3;
    maxPorArea[q.dom] += 5 * 0.7;
    maxPorArea[q.sec] += 5 * 0.3;
  });

  const dims = (Object.keys(scores) as Array<keyof typeof scores>).map((area) => {
    const pct = Math.round((scores[area] / (maxPorArea[area] || 1)) * 100);
    return `${area}: ${pct}%`;
  });
  return dims.join(", ");
}

async function buildUserContext(supabase: ReturnType<typeof createClient>, userId: string): Promise<string> {
  try {
    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("empresa, cargo, phone, industry")
      .eq("user_id", userId)
      .maybeSingle();

    // Get latest diagnostic result
    const { data: diagnostic } = await supabase
      .from("diagnostic_results")
      .select("puntaje_total, perfil, respuestas")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get user badges
    const { data: badges } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", userId);

    const parts: string[] = [];

    if (profile?.empresa) parts.push(`Empresa: ${profile.empresa}`);
    if (profile?.cargo) parts.push(`Cargo: ${profile.cargo}`);
    if (profile?.industry) parts.push(`Industria: ${profile.industry}`);
    if (diagnostic?.perfil) {
      parts.push(`Perfil Mirror: ${diagnostic.perfil} (${diagnostic.puntaje_total ?? 0}/40 puntos)`);
      const dimsSummary = computeFourDimensions(diagnostic.respuestas);
      if (dimsSummary) {
        parts.push(`Dimensiones 4D: ${dimsSummary}`);
      }
    }
    if (badges?.length) parts.push(`Badges: ${badges.map((b) => b.badge_id).join(", ")}`);

    return parts.length > 0 ? parts.join("\n") : "Sin perfil completado aún.";
  } catch (e) {
    logWarn("mentor-chat", "Failed to build user context", { error: String(e) });
    return "Contexto no disponible.";
  }
}

async function getConversationHistory(
  supabase: ReturnType<typeof createClient>,
  conversationId: string,
  limit: number
): Promise<AIMessage[]> {
  try {
    const { data } = await supabase
      .from("mentor_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(limit);

    return (data || []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
  } catch {
    return [];
  }
}

async function getSystemPrompt(supabase: ReturnType<typeof createClient>): Promise<string> {
  try {
    const { data } = await supabase
      .from("mentor_config")
      .select("value")
      .eq("key", "system_prompt")
      .maybeSingle();

    return data?.value || getDefaultSystemPrompt();
  } catch {
    return getDefaultSystemPrompt();
  }
}

function getDefaultSystemPrompt(): string {
  return `Sos el Mentor IA Estratégico de Mejora Continua, la autoridad de dirección para dueños y líderes de PyMEs en Argentina.

MANIFIESTO INTERNO Y CRITERIO MEDULAR (OBLIGATORIO EN CADA RESPUESTA):
1. La crítica va al sistema y al proceso, jamás a la persona: erradicá la culpa moral del líder y demostrá qué método, proceso o estructura falta construir para resolver los incendios.
2. Verdad sin maquillaje con calidez real: sé directo, claro y empático. Nada de motivación vacía; diagnosticá el cuello de botella y entregá dirección táctica concreta.
3. Indispensabilidad metodológica: conectá cada recomendación con el orden de Mejora Continua, el resultado real del Mirror Estratégico del usuario (sus 4 Dimensiones y su arquetipo) y la Red de Líderes.

REGLAS OPERATIVAS:
- Respondé siempre en español argentino con voseo.
- Basá tus respuestas en el contexto real del usuario (empresa, cargo, industria, arquetipo Mirror y porcentajes en sus 4 Dimensiones: Personal, Organizacional, Comercial y Empresarial).
- Priorizá siempre atacar la dimensión con menor puntaje o el cuello de botella mencionado.
- Entregá pasos accionables concretos (máximo 220 palabras para mantener el chat ágil).
- No inventes datos que no estén en el contexto; si falta un número clave (facturación, margen o dotación), pedilo.
- Si preguntan algo ajeno a la dirección de empresas, redirigilo al foco empresarial.`;
}

// ── Handler ─────────────────────────────────────────────────────

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

      // Check if mentor is enabled
      const { data: config } = await supabase
        .from("mentor_config")
        .select("value")
        .eq("key", "enabled")
        .maybeSingle();

      if (config?.value === "false") {
        return new Response(JSON.stringify({ error: "El Mentor IA no está disponible en este momento" }), {
          status: 503,
          headers,
        });
      }

      // Get or create conversation
      let activeConversationId = conversationId;

      if (activeConversationId) {
        // Ownership check — sin esto, cualquier usuario autenticado podría pasar
        // el conversationId de otro usuario y leer/contaminar su historial (IDOR).
        const { data: existingConv } = await supabase
          .from("mentor_conversations")
          .select("user_id")
          .eq("id", activeConversationId)
          .maybeSingle();

        if (!existingConv || existingConv.user_id !== userId) {
          logWarn("mentor-chat", "conversationId no pertenece al usuario, se crea una nueva", {
            userId,
            conversationId: activeConversationId,
          });
          activeConversationId = null;
        }
      }

      if (!activeConversationId) {
        // Create new conversation
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

      // Build context
      const [userContext, systemPrompt, history] = await Promise.all([
        buildUserContext(supabase, userId),
        getSystemPrompt(supabase),
        getConversationHistory(supabase, activeConversationId, 10),
      ]);

      // Save user message
      await supabase.from("mentor_messages").insert({
        conversation_id: activeConversationId,
        user_id: userId,
        role: "user",
        content: message.trim(),
      });

      // Build messages array for AI
      const systemWithContext = systemPrompt
        .replace("{user_context}", userContext)
        .replace("{conversation_history}", history.length > 0 ? history.map((m) => `${m.role === "user" ? "Usuario" : "Mentor"}: ${m.content}`).join("\n") : "Primera interacción.");

      const messages: AIMessage[] = [
        { role: "system", content: systemWithContext },
        ...history,
        { role: "user", content: message.trim() },
      ];

      // Call AI
      const aiResponse = await callAI(messages);

      // Save assistant message
      await supabase.from("mentor_messages").insert({
        conversation_id: activeConversationId,
        user_id: userId,
        role: "assistant",
        content: aiResponse.content,
        tokens_used: aiResponse.tokensUsed,
        model_used: aiResponse.model,
      });

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
