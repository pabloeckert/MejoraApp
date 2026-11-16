/**
 * moderate-comment — Edge Function para moderación de comentarios
 *
 * Cadena IA: Gemini 3.5 Flash Lite → Groq → OpenRouter → auto-aprobado.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { withMiddleware } from "../_shared/middleware.ts";
import { logInfo, logWarn, logError } from "../_shared/log.ts";
import { moderateCommentSchema, formatZodError } from "../_shared/schemas.ts";
import { generateAIText } from "../_shared/ai.ts";

const MODERATION_PROMPT = `Sos el moderador de Mejora Continua, comunidad privada de líderes PyME en Argentina. Cuidás el Criterio Medular: la crítica va al proceso y al sistema, jamás a la persona.
APROBÁS: experiencias, preguntas, consejos pragmáticos, devoluciones respetuosas entre pares.
RECHAZÁS: spam, autopromoción, insultos personales, datos personales (teléfonos, emails, CUIT), contenido irrelevante.
SÉ PERMISIVO con el tono coloquial argentino. Respondé ÚNICAMENTE en JSON: {"action":"approved" o "rejected","reason":"breve razón"}`;

async function moderateComment(content: string): Promise<{ action: string; reason: string } | null> {
  const res = await generateAIText(
    [
      { role: "system", content: MODERATION_PROMPT },
      { role: "user", content: `Moderá este comentario:\n\n"${content}"` },
    ],
    {
      profile: "fast",
      temperature: 0.2,
      maxTokens: 256,
      responseMimeType: "application/json",
      logTag: "moderate-comment",
    }
  );
  if (!res) return null;

  try {
    const match = res.content.match(/\{[\s\S]*?\}/);
    if (match) return JSON.parse(match[0]);
  } catch (e) {
    logWarn("moderate-comment", "Failed to parse moderation JSON", { error: String(e) });
  }
  return null;
}

Deno.serve(
  withMiddleware({ auth: true, rateLimit: 10 }, async (req, ctx) => {
    const headers = { "Content-Type": "application/json" };
    const user = ctx.user!;

    try {
      const rawBody = await req.json().catch(() => null);
      const parsed = moderateCommentSchema.safeParse(rawBody);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: formatZodError(parsed.error) }), { status: 400, headers });
      }

      const post_id = parsed.data.post_id;
      const content = parsed.data.content.replace(/<[^>]*>/g, "").trim();
      if (content.length === 0) {
        return new Response(JSON.stringify({ error: "El contenido no puede estar vacío." }), { status: 400, headers });
      }

      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
      const { count } = await supabaseAdmin
        .from("wall_comments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", oneMinuteAgo);

      if ((count || 0) >= 10) {
        logWarn("moderate-comment", "DB rate limit hit", { user_id: user.id });
        return new Response(
          JSON.stringify({ error: "Máximo 10 comentarios por minuto." }),
          { status: 429, headers }
        );
      }

      let modAction = "approved";
      let modReason = "Auto-aprobado";

      const aiResult = await moderateComment(content);
      if (aiResult) {
        modAction = aiResult.action === "rejected" ? "rejected" : "approved";
        modReason = aiResult.reason || "Moderado por IA";
      }

      const { data: comment, error: insertError } = await supabaseAdmin
        .from("wall_comments")
        .insert({ post_id, user_id: user.id, content, status: modAction })
        .select("id, post_id, content, created_at, user_id, status")
        .single();

      if (insertError) {
        logError("moderate-comment", "Insert failed", { error: insertError.message });
        throw new Error("Error al publicar comentario");
      }

      if (comment) {
        supabaseAdmin
          .from("moderation_comments_log")
          .insert({ comment_id: comment.id, action: modAction, reason: modReason })
          .then(() => {})
          .catch(() => {});
      }

      logInfo("moderate-comment", "Comment created", {
        comment_id: comment?.id,
        status: modAction,
        user_id: user.id,
      });

      if (modAction === "rejected") {
        return new Response(
          JSON.stringify({ success: false, rejected: true, reason: "Tu comentario no cumple con las normas." }),
          { headers }
        );
      }

      return new Response(JSON.stringify({ success: true, comment }), { headers });
    } catch (e) {
      logError("moderate-comment", "Unhandled error", { error: String(e) });
      return new Response(
        JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
        { status: 500, headers }
      );
    }
  })
);
