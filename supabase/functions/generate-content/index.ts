/**
 * generate-content — Edge Function para generación de contenido estratégico con IA
 *
 * Cadena IA: Gemini 3.8 Flash → Groq → OpenRouter.
 */
import { withMiddleware } from "../_shared/middleware.ts";
import { logInfo, logError } from "../_shared/log.ts";
import { generateAIText } from "../_shared/ai.ts";

const SYSTEM_PROMPT = `Sos la voz de Mejora Continua, una comunidad de líderes empresariales argentina. Tu comunicación cumple el Criterio Medular:
- La crítica va al proceso y a la falta de estructura, jamás a la persona.
- DIRECTA: Vas al punto sin preámbulos.
- HONESTA: Verdad sin maquillaje con calidez real.
- ARGENTINA: Usás "vos" y lenguaje ejecutivo claro.
- SIMPLE: Frases cortas, bajada práctica inmediata.

Generá contenido con un título corto y contundente, y contenido en párrafos separados por saltos de línea.

Respondé ÚNICAMENTE en formato JSON: {"titulo": "...", "contenido": "...", "resumen": "..."}`;

const CATEGORY_PROMPTS: Record<string, string> = {
  tip: "un tip práctico y accionable que pueda aplicar hoy mismo. Que sea contundente, en 2-3 párrafos cortos. Que empiece nombrando el cuello de botella y termine con una acción concreta",
  estrategia: "un artículo corto (3-4 párrafos) con una estrategia concreta. Usá la estructura ESPEJO→DOLOR→SALIDA.",
  reflexion: "una reflexión provocadora que lo haga cuestionar su forma de operar. Usá la estructura de CONFRONTACIÓN DIRECTA al proceso, no a la persona.",
  noticia: "un análisis breve de una tendencia o situación actual relevante para negocios. Concreto, útil y con bajada práctica.",
};

Deno.serve(
  withMiddleware({ auth: true, admin: true, rateLimit: 10 }, async (req, ctx) => {
    const headers = { "Content-Type": "application/json" };
    const user = ctx.user!;

    try {
      const body = await req.json().catch(() => ({}));
      const category = typeof body.category === "string" ? body.category : "tip";
      const guidelines = typeof body.guidelines === "string" ? body.guidelines : "";

      const promptType = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS.tip;
      const guidelinesBlock = guidelines ? `\n\nLineamientos del administrador: ${guidelines}` : "";

      const aiRes = await generateAIText(
        [
          { role: "system", content: SYSTEM_PROMPT + guidelinesBlock },
          { role: "user", content: `Generá ${promptType}.` },
        ],
        {
          profile: "reasoning",
          thinkingLevel: "MEDIUM",
          temperature: 0.7,
          maxTokens: 2048,
          responseMimeType: "application/json",
          logTag: "generate-content",
        }
      );

      if (!aiRes) {
        return new Response(
          JSON.stringify({
            error: "No hay proveedores de IA configurados o disponibles (verificá GEMINI_API_KEY o GROQ_API_KEY).",
          }),
          { status: 503, headers }
        );
      }

      let result;
      try {
        const jsonMatch = aiRes.content.match(/\{[\s\S]*?\}/);
        result = jsonMatch
          ? JSON.parse(jsonMatch[0])
          : {
              titulo: "Contenido generado",
              contenido: aiRes.content,
              resumen: aiRes.content.slice(0, 120),
            };
      } catch {
        result = {
          titulo: "Contenido generado",
          contenido: aiRes.content,
          resumen: aiRes.content.slice(0, 120),
        };
      }

      logInfo("generate-content", "Content generated", {
        category,
        model: aiRes.model,
        user_id: user.id,
      });

      return new Response(JSON.stringify({ ...result, model: aiRes.model }), { headers });
    } catch (e) {
      logError("generate-content", "Unhandled error", { error: String(e) });
      return new Response(
        JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
        { status: 500, headers }
      );
    }
  })
);
