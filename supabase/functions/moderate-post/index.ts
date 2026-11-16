/**
 * moderate-post — Edge Function para moderación de posts del muro
 *
 * Usa middleware compartido para CORS + Auth + Rate Limiting.
 * Cadena IA: Gemini 3.5 Flash Lite → Groq → OpenRouter → auto-aprobado (fail-open).
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { withMiddleware } from "../_shared/middleware.ts";
import { logInfo, logWarn, logError } from "../_shared/log.ts";
import { moderatePostSchema, formatZodError } from "../_shared/schemas.ts";
import { generateAIText } from "../_shared/ai.ts";

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

async function moderateContent(content: string): Promise<{ action: string; reason: string } | null> {
  const res = await generateAIText(
    [
      { role: "system", content: MODERATION_PROMPT },
      { role: "user", content: `Moderá este post del muro anónimo:\n\n"${content}"` },
    ],
    {
      profile: "fast",
      temperature: 0.2,
      maxTokens: 256,
      responseMimeType: "application/json",
      logTag: "moderate-post",
    }
  );

  if (!res) {
    logWarn("moderate-post", "All AI providers failed or unconfigured, auto-approving");
    return null;
  }

  try {
    const match = res.content.match(/\{[\s\S]*?\}/);
    if (match) return JSON.parse(match[0]);
  } catch (e) {
    logWarn("moderate-post", "Failed to parse moderation JSON", { error: String(e) });
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

      const content = parsed.data.content.replace(/<[^>]*>/g, "").trim();
      const postType = parsed.data.post_type;
      if (content.length === 0) {
        return new Response(JSON.stringify({ error: "El contenido no puede estar vacío." }), { status: 400, headers });
      }

      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

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

      let modAction = "approved";
      let modReason = "Auto-aprobado (sin IA configurada)";

      const aiResult = await moderateContent(content);
      if (aiResult) {
        modAction = aiResult.action === "rejected" ? "rejected" : "approved";
        modReason = aiResult.reason || "Moderado por IA";
      }

      const { data: post, error: insertError } = await supabaseAdmin
        .from("wall_posts")
        .insert({ user_id: user.id, content, post_type: postType, status: modAction })
        .select("id, status")
        .single();

      if (insertError) {
        logError("moderate-post", "Insert failed", { error: insertError.message });
        throw new Error("Error al publicar");
      }

      supabaseAdmin
        .from("moderation_log")
        .insert({ post_id: post.id, action: modAction, reason: modReason })
        .then(() => {})
        .catch(() => {});

      logInfo("moderate-post", "Post created", { post_id: post.id, post_type: postType, status: modAction, user_id: user.id });

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
