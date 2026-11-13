/**
 * MentorWelcome — Welcome screen for Mentor IA with 4D Mirror Context Card
 *
 * Shows: greeting, active 4D Mirror bottleneck summary, quick tactical actions
 * Adapts to user context (has diagnostic? 4D bottleneck? profile?)
 */

import {
  Bot,
  Lightbulb,
  BarChart3,
  Target,
  Handshake,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PERFILES,
  NOMBRES_AREA,
  calcularScores,
  zonaColor,
  type Area,
} from "@/data/diagnosticData";

export interface DiagnosticContextSummary {
  perfil: string;
  puntajeTotal: number;
  respuestas?: Record<number, number>;
}

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  prompt: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "diagnostic",
    icon: <BarChart3 className="w-4 h-4" />,
    label: "Auditar mi cuello de botella (Mirror)",
    prompt:
      "Con base en mi resultado del Mirror Estratégico y mis 4 Dimensiones, ¿qué proceso tengo que ordenar primero esta semana?",
  },
  {
    id: "strategy",
    icon: <Lightbulb className="w-4 h-4" />,
    label: "Dejar de apagar incendios y delegar",
    prompt:
      "Mi empresa depende demasiado de que esté encima todo el día. Dame un método concreto en 3 pasos para empezar a delegar sin que se caiga la calidad.",
  },
  {
    id: "goals",
    icon: <Target className="w-4 h-4" />,
    label: "Blindar margen y defender precios",
    prompt:
      "Necesito defender precios y rentabilidad sin ceder descuentos por miedo a perder clientes. Armame un guion y criterio comercial.",
  },
  {
    id: "problem",
    icon: <Handshake className="w-4 h-4" />,
    label: "Destrabar un conflicto con socios o equipo",
    prompt:
      "Tengo una fricción operativa con mi equipo o socios y quiero abordarla atacando la falta de proceso y roles, nunca a la persona. ¿Cómo la encaro?",
  },
];

interface MentorWelcomeProps {
  userName?: string;
  hasDiagnostic?: boolean;
  diagnosticSummary?: DiagnosticContextSummary | null;
  onQuickAction: (prompt: string) => void;
}

export const MentorWelcome = ({
  userName,
  hasDiagnostic,
  diagnosticSummary,
  onQuickAction,
}: MentorWelcomeProps) => {
  const greeting = userName ? `Hola, ${userName}.` : "Hola.";

  const perfilInfo = diagnosticSummary ? PERFILES[diagnosticSummary.perfil] : undefined;
  const totalPct = diagnosticSummary
    ? Math.round((diagnosticSummary.puntajeTotal / 40) * 100)
    : 0;
  const scoreBadge = zonaColor(totalPct);

  let weakestArea: Area | null = null;
  let weakestPct = 101;
  if (diagnosticSummary?.respuestas) {
    const scores = calcularScores(diagnosticSummary.respuestas);
    for (const area of Object.keys(scores) as Area[]) {
      if (scores[area] < weakestPct) {
        weakestPct = scores[area];
        weakestArea = area;
      }
    }
  }

  return (
    <div className="flex flex-col items-center px-4 py-6 max-w-md mx-auto space-y-5">
      {/* Avatar + Saludo */}
      <div className="text-center space-y-2">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-sm"
          style={{ backgroundColor: "#1A3D84" }}
        >
          <Bot className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-black text-foreground">{greeting}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
          Soy tu <strong className="text-foreground">Mentor IA de Mejora Continua</strong>. Acá atacamos la falta de estructura y proceso, jamás a la persona.
        </p>
      </div>

      {/* Tarjeta Bento: Contexto Activo del Mirror Estratégico */}
      {diagnosticSummary && (
        <div className="w-full bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1A3D84] dark:text-blue-400">
              Contexto Activo · Mirror 4D
            </span>
            <span
              className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: scoreBadge.color,
                color: totalPct >= 40 && totalPct < 65 ? "#1A1A1A" : "#FFFFFF",
              }}
            >
              {diagnosticSummary.puntajeTotal}/40 pts · {scoreBadge.zona}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-black text-foreground leading-snug">
              {perfilInfo?.tagline ?? diagnosticSummary.perfil}
            </p>
            {weakestArea && (
              <p className="text-xs text-muted-foreground">
                Dimensión más comprometida:{" "}
                <strong className="text-[#E1061E]">
                  {NOMBRES_AREA[weakestArea]} ({weakestPct}%)
                </strong>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              onQuickAction(
                weakestArea
                  ? `Mi Mirror Estratégico marcó ${diagnosticSummary.puntajeTotal}/40 y el cuello de botella principal en ${NOMBRES_AREA[weakestArea]} (${weakestPct}%). Dame un plan de acción directo para destrabarlo esta semana.`
                  : "Analizá mi resultado del Mirror Estratégico y decime cuál es el primer proceso que debo ordenar esta semana."
              )
            }
            className="w-full min-h-[44px] rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1A3D84" }}
          >
            <span>Atacar este cuello de botella ahora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="w-full space-y-2.5">
        <p className="text-[11px] text-muted-foreground font-extrabold uppercase tracking-widest text-center">
          Consultas tácticas frecuentes
        </p>
        {QUICK_ACTIONS.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className={cn(
              "w-full justify-start gap-3 h-auto min-h-[48px] py-3 px-3.5 rounded-xl",
              "text-xs sm:text-sm font-medium text-left whitespace-normal",
              "bg-card border-border hover:border-[#1A3D84]/40 hover:bg-secondary/40",
              "transition-all duration-200"
            )}
            onClick={() => onQuickAction(action.prompt)}
          >
            <span
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(26, 61, 132, 0.08)", color: "#1A3D84" }}
            >
              {action.icon}
            </span>
            <span className="leading-snug">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Nota para usuarios sin Mirror completado */}
      {!hasDiagnostic && !diagnosticSummary && (
        <div
          className="w-full bg-secondary/60 border-l-4 p-3 rounded-r-xl flex items-start gap-2.5"
          style={{ borderLeftColor: "#1A3D84" }}
        >
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#1A3D84] dark:text-blue-400" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Completá primero tu <strong className="text-foreground">Mirror Estratégico</strong> para que el Mentor IA cargue tus 4 Dimensiones automáticamente en cada consejo.
          </p>
        </div>
      )}
    </div>
  );
};

export default MentorWelcome;
