/**
 * match-alliances — Matchmaking Semántico B2B para Círculo Dorado (N2)
 *
 * Usa Gemini 3.8 Flash para cruzar oferta/demanda de la tabla public.alliances
 * y devolver las 3 oportunidades más compatibles con justificación táctica.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { withMiddleware } from "../_shared/middleware.ts";
import { jsonHeaders } from "../_shared/cors.ts";
import { logInfo, logWarn, logError } from "../_shared/log.ts";
import { generateAIText } from "../_shared/ai.ts";

interface AllianceRow {
  id: string;
  user_id: string;
  axis: string;
  title: string;
  ofrece: string | null;
  busca: string | null;
  region: string | null;
}

Deno.serve(
  withMiddleware({ auth: true, rateLimit: 10 }, async (req, ctx) => {
    const headers = { ...jsonHeaders(ctx.origin) };

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
    }

    const user = ctx.user!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    try {
      const { data: callerProfile } = await supabase
        .from("profiles")
        .select("access_level, membership_expires_at, empresa, sector, ofrece, busca")
        .eq("user_id", user.id)
        .maybeSingle();

      const level = (callerProfile?.access_level ?? "N0").toUpperCase();
      const expires = callerProfile?.membership_expires_at ? new Date(callerProfile.membership_expires_at) : null;
      const isN2OrAdmin =
        level === "ADMIN" ||
        (level === "N2" && (!expires || expires > new Date()));

      if (!isN2OrAdmin) {
        return new Response(
          JSON.stringify({ error: "Matchmaking exclusivo para Círculo Dorado (N2)." }),
          { status: 403, headers }
        );
      }

      const { data: alliances } = await supabase
        .from("alliances")
        .select("id, user_id, axis, title, ofrece, busca, region")
        .eq("status", "active")
        .neq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(25);

      const candidates = (alliances ?? []) as AllianceRow[];
      if (candidates.length === 0) {
        return new Response(JSON.stringify({ matches: [] }), { status: 200, headers });
      }

      // Include user's own alliances if any
      const { data: ownAlliances } = await supabase
        .from("alliances")
        .select("axis, title, ofrece, busca, region")
        .eq("user_id", user.id)
        .eq("status", "active")
        .limit(3);

      const userSummary = {
        empresa: callerProfile?.empresa ?? "Mi empresa",
        sector: callerProfile?.sector ?? "No especificado",
        perfil_ofrece: callerProfile?.ofrece ?? "",
        perfil_busca: callerProfile?.busca ?? "",
        mis_publicaciones: ownAlliances ?? [],
      };

      const aiRes = await generateAIText(
        [
          {
            role: "system",
            content:
              "Sos el Director de Articulación B2B del Círculo Dorado de Mejora Continua. Cruzá oferta y demanda entre empresas y devolvé ÚNICAMENTE JSON válido con este formato: {\"matches\":[{\"allianceId\":\"uuid\",\"score\":92,\"reason\":\"1 frase táctica clara en español argentino sobre por qué hay sinergia\"}]}. Máximo 3 matches, ordenados por score descendente.",
          },
          {
            role: "user",
            content: `PERFIL DEL DECISOR:\n${JSON.stringify(userSummary)}\n\nOPORTUNIDADES DISPONIBLES:\n${JSON.stringify(candidates)}`,
          },
        ],
        {
          profile: "reasoning",
          thinkingLevel: "MEDIUM",
          temperature: 0.3,
          maxTokens: 600,
          responseMimeType: "application/json",
          logTag: "match-alliances",
        }
      );

      let matches: Array<{ allianceId: string; score: number; reason: string }> = [];

      if (aiRes) {
        try {
          const jsonMatch = aiRes.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsed.matches)) {
              const validIds = new Set(candidates.map((c) => c.id));
              matches = parsed.matches
                .filter((m: { allianceId?: string }) => m.allianceId && validIds.has(m.allianceId))
                .slice(0, 3);
            }
          }
        } catch (err) {
          logWarn("match-alliances", "Failed parsing AI matches JSON", { error: String(err) });
        }
      }

      // Deterministic lexical fallback when AI keys aren't set yet
      if (matches.length === 0) {
        const keywords = `${userSummary.perfil_ofrece} ${userSummary.perfil_busca} ${userSummary.sector} ${(ownAlliances ?? []).map((a) => `${a.ofrece ?? ""} ${a.busca ?? ""}`).join(" ")}`
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 3);

        matches = candidates
          .map((c) => {
            const haystack = `${c.title} ${c.axis} ${c.ofrece ?? ""} ${c.busca ?? ""}`.toLowerCase();
            const hits = keywords.reduce((acc, kw) => acc + (haystack.includes(kw) ? 1 : 0), 0);
            return {
              allianceId: c.id,
              score: Math.min(95, 65 + hits * 8),
              reason: `Afinidad en eje ${c.axis}${c.region ? ` (${c.region})` : ""}: complementariedad potencial con tu perfil operativo.`,
            };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
      }

      logInfo("match-alliances", "Matches computed", { userId: user.id, count: matches.length });
      return new Response(JSON.stringify({ matches }), { status: 200, headers });
    } catch (e) {
      logError("match-alliances", "Unhandled error", { error: String(e) });
      return new Response(JSON.stringify({ error: "Error calculando afinidades" }), { status: 500, headers });
    }
  })
);
