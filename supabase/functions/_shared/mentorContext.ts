/**
 * Shared Mentor Context & Config Loader
 *
 * Unifica la inyección de contexto 4D + Business Mirror Gamer, historial de mensajes
 * y lectura dinámica de public.mentor_config para mentor-chat y mentor-chat-stream.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import type { AIMessage, ThinkingLevel } from "./ai.ts";

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

export function computeFourDimensions(respuestas: unknown): string | null {
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

export async function buildUserContext(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<string> {
  try {
    const [
      { data: profile },
      { data: diagnostic },
      { data: mirrorResults },
      { data: badges },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("empresa, cargo, industry, sector, empresa_tamano, ofrece, busca")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("diagnostic_results")
        .select("puntaje_total, perfil, respuestas")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("business_mirror_results")
        .select("profile, score, business_mirror_tests(title, category)")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(3),
      supabase.from("user_badges").select("badge_id").eq("user_id", userId),
    ]);

    const parts: string[] = [];
    if (profile?.empresa) parts.push(`Empresa: ${profile.empresa}`);
    if (profile?.cargo) parts.push(`Cargo: ${profile.cargo}`);
    if (profile?.sector || profile?.industry) {
      parts.push(`Rubro/Industria: ${profile.sector || profile.industry}`);
    }
    if (profile?.empresa_tamano) parts.push(`Dotación: ${profile.empresa_tamano} colaboradores`);
    if (profile?.ofrece) parts.push(`Capacidad que aporta: ${profile.ofrece}`);
    if (profile?.busca) parts.push(`Búsqueda actual: ${profile.busca}`);

    if (diagnostic?.perfil) {
      parts.push(`Perfil Mirror 4D: ${diagnostic.perfil} (${diagnostic.puntaje_total ?? 0}/40 puntos)`);
      const dimsSummary = computeFourDimensions(diagnostic.respuestas);
      if (dimsSummary) {
        parts.push(`Dimensiones 4D: ${dimsSummary}`);
      }
    }

    if (mirrorResults && mirrorResults.length > 0) {
      const gamerSummary = mirrorResults
        .map((r: Record<string, unknown>) => {
          const test = r.business_mirror_tests as { title?: string; category?: string } | null;
          const title = test?.title ?? "Simulación Mirror";
          return `${title}: perfil "${r.profile ?? "N/A"}" (${r.score ?? 0} pts)`;
        })
        .join(" | ");
      parts.push(`Tests Business Mirror Gamer recientes: ${gamerSummary}`);
    }

    if (badges?.length) parts.push(`Badges: ${badges.map((b) => b.badge_id).join(", ")}`);

    return parts.length > 0 ? parts.join("\n") : "Sin perfil completado aún.";
  } catch {
    return "Contexto no disponible.";
  }
}

export interface MentorRuntimeConfig {
  enabled: boolean;
  systemPrompt: string;
  thinkingLevel: ThinkingLevel;
}

export async function getMentorConfig(
  supabase: ReturnType<typeof createClient>
): Promise<MentorRuntimeConfig> {
  try {
    const { data } = await supabase
      .from("mentor_config")
      .select("key, value")
      .in("key", ["enabled", "system_prompt", "thinking_level"]);

    const map = new Map<string, string>();
    for (const row of data ?? []) {
      map.set(row.key, row.value);
    }

    const rawThinking = (map.get("thinking_level") ?? "HIGH").toUpperCase();
    const thinkingLevel: ThinkingLevel =
      rawThinking === "LOW" || rawThinking === "MEDIUM" || rawThinking === "HIGH"
        ? rawThinking
        : "HIGH";

    return {
      enabled: map.get("enabled") !== "false",
      systemPrompt: map.get("system_prompt") || getDefaultSystemPrompt(),
      thinkingLevel,
    };
  } catch {
    return {
      enabled: true,
      systemPrompt: getDefaultSystemPrompt(),
      thinkingLevel: "HIGH",
    };
  }
}

export function getDefaultSystemPrompt(): string {
  return `Sos el Mentor IA Estratégico de Mejora Continua, la autoridad de dirección para dueños y líderes de PyMEs en Argentina.

MANIFIESTO INTERNO Y CRITERIO MEDULAR (OBLIGATORIO EN CADA RESPUESTA):
1. La crítica va al sistema y al proceso, jamás a la persona: erradicá la culpa moral del líder y demostrá qué método, proceso o estructura falta construir para resolver los incendios.
2. Verdad sin maquillaje con calidez real: sé directo, claro y empático. Nada de motivación vacía; diagnosticá el cuello de botella y entregá dirección táctica concreta.
3. Indispensabilidad metodológica: conectá cada recomendación con el orden de Mejora Continua, el resultado real del Mirror Estratégico del usuario (sus 4 Dimensiones y su arquetipo) y la Red de Líderes.

REGLAS OPERATIVAS:
- Respondé siempre en español argentino con voseo.
- Basá tus respuestas en el contexto real del usuario (empresa, cargo, rubro, arquetipo Mirror, puntajes 4D y simulaciones Gamer).
- Priorizá siempre atacar la dimensión con menor puntaje o el cuello de botella mencionado.
- Entregá pasos accionables concretos (máximo 240 palabras en texto principal).
- No inventes datos que no estén en el contexto; si falta un número clave (facturación, margen o dotación), pedilo.
- Si preguntan algo ajeno a la dirección de empresas, redirigilo al foco empresarial.

HERRAMIENTAS GENERATIVAS (OPCIONAL — SOLO CUANDO APORTE VALOR INMEDIATO):
Al final de tu respuesta podés incluir UN ÚNICO bloque JSON exactamente delimitado así para que la app renderice una herramienta interactiva:
1) Si hablan de precios, descuentos o márgenes:
<<<WIDGET_JSON
{"type":"discount_calculator","title":"Matriz de Impacto en Margen","defaultMarginPct":35,"defaultDiscountPct":10,"contextNote":"Por qué cuidar el margen neto"}
WIDGET_JSON>>>
2) Si piden redactar o encarar una conversación con cliente, vendedor, equipo o socio:
<<<WIDGET_JSON
{"type":"whatsapp_script","title":"Guion Táctico Listo para Enviar","recipient":"Vendedor / Cliente / Socio","script":"Mensaje breve y firme listo para copiar..."}
WIDGET_JSON>>>
3) Si necesitan destrabar una operación o empezar a delegar esta semana:
<<<WIDGET_JSON
{"type":"action_checklist","title":"Plan de Ejecución 72 Horas","steps":["Paso 1 concreto","Paso 2 concreto","Paso 3 concreto"]}
WIDGET_JSON>>>`;
}

export async function getConversationHistory(
  supabase: ReturnType<typeof createClient>,
  conversationId: string,
  limit = 10
): Promise<AIMessage[]> {
  try {
    const { data } = await supabase
      .from("mentor_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(limit);

    return (data ?? [])
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
  } catch {
    return [];
  }
}
