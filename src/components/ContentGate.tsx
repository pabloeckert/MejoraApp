import { useState, type ReactNode } from "react";
import { ShieldCheck, Lock } from "lucide-react";
import { useMembership } from "@/hooks/useMembership";
import { UpgradeModal } from "@/components/UpgradeModal";
import { MEMBERSHIP_CONFIG, type MembershipLevel } from "@/lib/brand";

interface ContentGateProps {
  requiredLevel: MembershipLevel;
  preview?: ReactNode;
  children: ReactNode;
  context?: string;
}

const GATE_COPY: Record<"n1" | "n2", { badge: string; headline: string; sub: string }> = {
  n1: {
    badge: "Nivel 1 · Red de Líderes",
    headline: "Salí de la soledad del líder. Ordená tu empresa entre pares.",
    sub: "Accedé al Muro confidencial, Mentor IA con memoria 4D y directorio completo.",
  },
  n2: {
    badge: "Nivel 2 · Círculo Dorado VIP",
    headline: "La Mesa de Alianzas C-Level y respaldo directo ante crisis.",
    sub: "Exclusivo para dueños y directores: acuerdos B2B, Silla de la Verdad y SLA < 60 min.",
  },
};

export function ContentGate({
  requiredLevel,
  preview,
  children,
  context: _context,
}: ContentGateProps) {
  const { canAccess } = useMembership();
  const [modalOpen, setModalOpen] = useState(false);

  if (canAccess(requiredLevel)) return <>{children}</>;

  const gateLevel = (requiredLevel === "n0" ? "n1" : requiredLevel) as "n1" | "n2";
  const config = MEMBERSHIP_CONFIG[gateLevel];
  const copy = GATE_COPY[gateLevel];
  const isN2Gate = gateLevel === "n2";

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl">
        {/* Preview borroso */}
        {preview && (
          <div className="blur-md pointer-events-none select-none" aria-hidden>
            {preview}
          </div>
        )}

        {/* Tarjeta Bento de desbloqueo sobre el preview */}
        <div
          className={
            preview
              ? "absolute inset-0 flex items-center justify-center p-4 bg-background/60 backdrop-blur-[2px]"
              : ""
          }
        >
          <div
            className="w-full max-w-md bg-card rounded-2xl p-6 shadow-elevated flex flex-col gap-3.5 border-2"
            style={{ borderColor: isN2Gate ? "#F7CC13" : "#1A3D84" }}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: isN2Gate ? "rgba(247, 204, 19, 0.2)" : "rgba(26, 61, 132, 0.1)",
                  color: isN2Gate ? "#9A7000" : "#1A3D84",
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {copy.badge}
              </span>
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="space-y-1">
              <p className="text-foreground font-black text-base sm:text-lg leading-snug">
                {copy.headline}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {copy.sub}
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="min-h-[48px] rounded-xl text-sm font-extrabold transition-opacity hover:opacity-90 active:scale-98 flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: isN2Gate ? "#F7CC13" : "#1A3D84",
                color: isN2Gate ? "#1A1A1A" : "#FFFFFF",
              }}
            >
              {config.cta} →
            </button>
          </div>
        </div>
      </div>

      <UpgradeModal
        targetLevel={gateLevel}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
