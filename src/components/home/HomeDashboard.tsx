/**
 * HomeDashboard — P03: Centro de mando del líder por nivel de membresía
 *
 * Aplica la regla cromática 80/10/5/5 (superficies blancas/claras al 80%,
 * Azul Marino #1A3D84 al 10%, Rojo #E1061E al 5% y Amarillo #F7CC13 al 5%),
 * integrando el Criterio Medular y el acceso directo al Mirror Estratégico.
 */

import { useState } from "react";
import { useMembership } from "@/hooks/useMembership";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { UpgradeModal } from "@/components/UpgradeModal";
import {
  BookOpen,
  Users,
  MessageSquare,
  Calendar,
  Crown,
  AlertTriangle,
  TrendingUp,
  ClipboardList,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface QuickAction {
  id: string;
  icon: typeof BookOpen;
  label: string;
  sublabel: string;
  tab?: string;
  upgrade?: "n1" | "n2";
}

const ACTIONS_N0: QuickAction[] = [
  {
    id: "diagnostico",
    icon: ClipboardList,
    label: "Mirror Estratégico",
    sublabel: "Evaluar 4 dimensiones",
    tab: "diagnostico",
  },
  {
    id: "ver-comunidad",
    icon: Users,
    label: "Ver la Red →",
    sublabel: "Espacio seguro de pares",
    upgrade: "n1",
  },
  {
    id: "contenido",
    icon: BookOpen,
    label: "Herramientas",
    sublabel: "Procesos y método",
    tab: "contenido",
  },
  {
    id: "subir-nivel",
    icon: ArrowUpRight,
    label: "Subir a Miembro →",
    sublabel: "Desbloquear Muro y Red",
    upgrade: "n1",
  },
];

const ACTIONS_N1: QuickAction[] = [
  {
    id: "muro",
    icon: MessageSquare,
    label: "Muro de Líderes",
    sublabel: "Debate confidencial",
    tab: "muro",
  },
  {
    id: "eventos",
    icon: Calendar,
    label: "Mesas y Eventos",
    sublabel: "Encuentros en vivo",
    tab: "eventos",
  },
  {
    id: "contenido",
    icon: BookOpen,
    label: "Herramientas",
    sublabel: "Método aplicable",
    tab: "contenido",
  },
  {
    id: "comunidad",
    icon: Users,
    label: "Directorio PyME",
    sublabel: "Conectar con pares",
    tab: "comunidad",
  },
];

const ACTIONS_N2: QuickAction[] = [
  {
    id: "circulo",
    icon: Crown,
    label: "Círculo Dorado",
    sublabel: "Directorio C-Level",
    tab: "circulo",
  },
  {
    id: "mesa",
    icon: Users,
    label: "Mesa de Alianzas",
    sublabel: "Oportunidades B2B",
    tab: "circulo",
  },
  {
    id: "emergencia",
    icon: AlertTriangle,
    label: "Botón de Crisis",
    sublabel: "Soporte < 60 min",
    tab: "emergencia",
  },
  {
    id: "diagnostico",
    icon: ClipboardList,
    label: "Mirror Estratégico",
    sublabel: "Recalibrar estructura",
    tab: "diagnostico",
  },
];

const GREETING: Record<string, string> = {
  n0: "El orden empieza midiendo dónde está hoy el cuello de botella de tu estructura.",
  n1: "Tu red de pares está activa. Ningún líder ordena su empresa en soledad.",
  n2: "Círculo Dorado activo. Respaldo estratégico y alianzas de dirección a un toque.",
  admin: "Panel de control y supervisión del ecosistema Mejora Continua.",
};

interface HomeDashboardProps {
  onNavigate: (tab: string) => void;
}

export function HomeDashboard({ onNavigate }: HomeDashboardProps) {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { level, isN2, isAdmin } = useMembership();
  const [upgradeModal, setUpgradeModal] = useState<"n1" | "n2" | null>(null);

  const firstName =
    profile?.nombre ?? profile?.display_name?.split(" ")[0] ?? "";

  const actions = isAdmin
    ? ACTIONS_N1
    : isN2
    ? ACTIONS_N2
    : level === "n1"
    ? ACTIONS_N1
    : ACTIONS_N0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Cabecera de Bienvenida + Norte Compartido */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#1A3D84] dark:text-blue-400 block mb-1">
            Centro de Dirección · Mejora Continua
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
            Hola{firstName ? `, ${firstName}` : ""}.
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
            {GREETING[level] ?? GREETING.n0}
          </p>
        </div>

        {/* Cápsula del Criterio Medular */}
        <div
          className="bg-secondary/60 border-l-4 px-3.5 py-2.5 rounded-r-xl flex items-start gap-2.5"
          style={{ borderLeftColor: "#1A3D84" }}
        >
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#1A3D84] dark:text-blue-400" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Criterio Medular:</strong> La crítica va al proceso y a la falta de sistema, jamás a la persona.
          </p>
        </div>
      </div>

      {/* Mirror Estratégico — Tarjeta Hero Bento (#1A3D84) */}
      <button
        onClick={() => onNavigate("diagnostico")}
        className="w-full rounded-2xl p-5 text-left shadow-md transition-transform active:scale-98 flex items-center justify-between gap-4"
        style={{ backgroundColor: "#1A3D84", minHeight: 104 }}
      >
        <div className="space-y-1">
          <span
            className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: "#F7CC13", color: "#1A1A1A" }}
          >
            Mirror Estratégico · 8 Preguntas
          </span>
          <p className="text-lg font-black text-white leading-snug pt-0.5">
            Diagnosticá la estructura de tu negocio
          </p>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            Detectá con verdad sin maquillaje en qué dimensión se está fugando tu tiempo y rentabilidad.
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <ArrowRight className="w-5 h-5 text-white" />
        </div>
      </button>

      {/* Grilla Bento de Acciones Rápidas */}
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const isUpgrade = !!action.upgrade;
          const isEmergency = action.id === "emergencia";
          return (
            <button
              key={action.id}
              onClick={() => {
                if (action.upgrade) setUpgradeModal(action.upgrade);
                else if (action.tab) onNavigate(action.tab);
              }}
              className="bg-card border border-border hover:border-[#1A3D84]/40 rounded-2xl p-4 text-left shadow-sm transition-all active:scale-95 flex flex-col justify-between gap-3"
              style={{
                minHeight: 96,
                borderColor: isEmergency ? "rgba(225, 6, 30, 0.35)" : undefined,
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: isEmergency
                    ? "rgba(225, 6, 30, 0.1)"
                    : isUpgrade
                    ? "rgba(247, 204, 19, 0.2)"
                    : "rgba(26, 61, 132, 0.08)",
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{
                    color: isEmergency
                      ? "#E1061E"
                      : isUpgrade
                      ? "#B48600"
                      : "#1A3D84",
                  }}
                />
              </div>
              <div>
                <span className="text-sm font-extrabold text-foreground block leading-tight">
                  {action.label}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-0.5">
                  {action.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Puente de Pertenencia N0 → N1 */}
      {level === "n0" && (
        <div
          className="bg-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm border-2"
          style={{ borderColor: "#1A3D84" }}
        >
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1A3D84] dark:text-blue-400 block">
              Paso siguiente · Nivel 1
            </span>
            <p className="text-sm font-black text-foreground">
              Salí de la soledad del líder
            </p>
            <p className="text-xs text-muted-foreground">
              Ingresá al Muro confidencial, Mentor IA y directorio de dueños.
            </p>
          </div>
          <button
            onClick={() => setUpgradeModal("n1")}
            className="text-xs font-extrabold px-4 py-2.5 rounded-xl shrink-0 transition-opacity hover:opacity-90 text-white"
            style={{ backgroundColor: "#1A3D84", minHeight: 48 }}
          >
            Unirme a la Red
          </button>
        </div>
      )}

      {/* Puente de Pertenencia N1 → N2 */}
      {level === "n1" && (
        <div
          className="bg-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm border-2"
          style={{ borderColor: "#F7CC13" }}
        >
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B48600] block">
              Nivel VIP · Círculo Dorado
            </span>
            <p className="text-sm font-black text-foreground">
              Mesa de Alianzas B2B y Rescate de Crisis
            </p>
            <p className="text-xs text-muted-foreground">
              La red privada de decisores C-Level con soporte directo.
            </p>
          </div>
          <button
            onClick={() => setUpgradeModal("n2")}
            className="text-xs font-extrabold px-4 py-2.5 rounded-xl shrink-0 transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#F7CC13",
              color: "#1A1A1A",
              minHeight: 48,
            }}
          >
            Ver Círculo
          </button>
        </div>
      )}

      {/* Acceso de Administración */}
      {isAdmin && (
        <button
          onClick={() => onNavigate("admin")}
          className="w-full flex items-center gap-3 p-4 rounded-2xl text-left bg-card border border-border hover:border-[#1A3D84]/40 shadow-sm transition-transform active:scale-98"
          style={{ minHeight: 64 }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(26, 61, 132, 0.08)" }}
          >
            <TrendingUp className="w-5 h-5 text-[#1A3D84]" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-foreground">
              Panel de Administración
            </p>
            <p className="text-xs text-muted-foreground">
              Gestionar usuarios, moderación y métricas del ecosistema
            </p>
          </div>
        </button>
      )}

      {/* UpgradeModal */}
      {upgradeModal && (
        <UpgradeModal
          targetLevel={upgradeModal}
          isOpen
          onClose={() => setUpgradeModal(null)}
        />
      )}
    </div>
  );
}
