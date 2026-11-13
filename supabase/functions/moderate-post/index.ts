/**
 * moderate-post — Edge Function para moderación de posts del muro
 *
 * Usa middleware compartido para CORS + Auth + Rate Limiting.
 * Cadena IA: Gemini → Groq → OpenRouter → auto-aprobado.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { withMiddleware } from "../_shared/middleware.ts";
import { logInfo, logWarn, logError } from "../_shared/log.ts";
import { moderatePostSchema, formatZodError } from "../_shared/schemas.ts";

const MODERATION_PROMPT = `Sos el moderador del Muro de Líderes de Mejora Continua, una comunidad privada de dueños y directivos PyME en Argentina. Tu rol es cuidar el Espacio Seguro y el Criterio Medular.

CRITERIO MEDULAR FUNDAMENTAL:
- La crítica va al sistema, a los procesos y a la falta de estructura, JAMÁS a la persona.

APROBÁS si:
- Comparte un dilema real sobre Finanzas, Socios, Comercial, Equipo o Crisis empresarial
- Hace una pregunta genuina sobre dirección, liderazgo o operación PyME
- Expresa desahogo o frustración real sobre su situación como dueño (la vulnerabilidad entre pares es bienvenida)
- Pide perspectiva o comparte un aprendizaje de negocio con verdad sin maquillaje

RECHAZÁS si:
- Contiene spam, autopromoción, publicidad o intento de captar clientes
- Tiene ataques personales, descalificaciones morales o insultos directos hacia personas o empresas nombradas
- Incluye datos personales identificables (teléfonos, direcciones, emails, CUIT)
- Contiene contenido sexual, violento o discriminatorio
- Es completamente irrelevante al mundo empresarial

SÉ PERMISIVO con el tono coloquial argentino: frustración genuina, ironía y catarsis están permitidas siempre que no ataquen ni expongan a personas o empresas concretas.

Respondé ÚNICAMENTE en formato JSON: {"action": "approved" o "rejected", "reason": "razón breve en español"}`;

async function callAI(prompt: string): Promise<{ action: string; reason: string } | null> {
  // Try Gemini first
  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 256 },
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const match = text.match(/\{[\s\S]*?\}/);
        if (match) return JSON.parse(match[0]);
      }
    } catch (e) {
      logWarn("moderate-post", "Gemini failed, trying fallback", { error: String(e) });
    }
  }

  // Fallback: Groq
  const groqKey = Deno.env.get("GROQ_API_KEY");
  if (groqKey) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: MODERATION_PROMPT },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 256,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "";
        const match = text.match(/\{[\s\S]*?\}/);
        if (match) return JSON.parse(match[0]);
      }
    } catch (e) {
      logWarn("moderate-post", "Groq failed, trying fallback", { error: String(e) });
    }
  }

  // Fallback: OpenRouter
  const orKey = Deno.env.get("OPENROUTER_API_KEY");
  if (orKey) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${orKey}` },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [
            { role: "system", content: MODERATION_PROMPT },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 256,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "";
        const match = text.match(/\{[\s\S]*?\}/);
        if (match) return JSON.parse(match[0]);
      }
    } catch (e) {
      logWarn("moderate-post", "OpenRouter failed", { error: String(e) });
    }
  }

  return null;
}

Deno.serve(
  withMiddleware({ auth: true, rateLimit: 3 }, async (req, ctx) => {
    const headers = { "Content-Type": "application/json" };
    const user = ctx.user!;

    try {
      const rawBody = await req.json().catch(() => null);
      const parsed = moderatePostSchema.safeParse(rawBody);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: formatZodError(parsed.error) }), { status: 400, headers });
      }

      const content = parsed.data.content.replace(/<[^>]*>/g, "").trim(); // Strip HTML tags
      if (content.length === 0) {
        return new Response(JSON.stringify({ error: "El contenido no puede estar vacío." }), { status: 400, headers });
      }

      // Supabase admin client for DB operations
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Additional DB-level rate limit: max 3 posts per minute per user
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
      const { count } = await supabaseAdmin
        .from("wall_posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", oneMinuteAgo);

      if ((count || 0) >= 3) {
        logWarn("moderate-post", "DB rate limit hit", { user_id: user.id });
        return new Response(
          JSON.stringify({ error: "Máximo 3 posts por minuto. Esperá un momento." }),
          { status: 429, headers }
        );
      }

      // AI moderation
      let modAction = "approved";
      let modReason = "Auto-aprobado (sin IA configurada)";

      const aiResult = await callAI(`Moderá este post del muro anónimo:\n\n"${content}"`);
      if (aiResult) {
        modAction = aiResult.action || "approved";
        modReason = aiResult.reason || "Moderado por IA";
      }

      // Insert post with service_role (bypasses RLS)
      const { data: post, error: insertError } = await supabaseAdmin
        .from("wall_posts")
        .insert({ user_id: user.id, content: content.trim(), status: modAction })
        .select("id, status")
        .single();

      if (insertError) {
        logError("moderate-post", "Insert failed", { error: insertError.message });
        throw new Error("Error al publicar");
      }

      // Log moderation (fire-and-forget)
      supabaseAdmin.from("moderation_log").insert({
        post_id: post.id, action: modAction, reason: modReason,
      }).then(() => {}).catch(() => {});

      logInfo("moderate-post", "Post created", { post_id: post.id, status: modAction, user_id: user.id });

      if (modAction === "rejected") {
        return new Response(
          JSON.stringify({
            success: false,
            rejected: true,
            reason: "Tu post no pudo ser publicado porque no cumple con las normas de la comunidad.",
          }),
          { headers }
        );
      }

      return new Response(JSON.stringify({ success: true, post_id: post.id }), { headers });
    } catch (e) {
      logError("moderate-post", "Unhandled error", { error: String(e) });
      return new Response(
        JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
        { status: 500, headers }
      );
    }
  })
);
