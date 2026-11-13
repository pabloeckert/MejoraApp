import { X, Check, ShieldCheck } from "lucide-react";
import { MEMBERSHIP_CONFIG } from "@/lib/brand";
import { trackCheckoutOpened } from "@/lib/analytics";

interface UpgradeModalProps {
  targetLevel: "n1" | "n2";
  isOpen: boolean;
  onClose: () => void;
}

const CHECKOUT_URLS: Record<"n1" | "n2", string> = {
  n1: import.meta.env.VITE_TIENDUP_N1_URL ?? "",
  n2: import.meta.env.VITE_TIENDUP_N2_URL ?? "",
};

const SOCIAL_PROOF: Record<"n1" | "n2", string> = {
  n1: "Salirse del caos operativo empieza adoptando método y rodeándote de pares.",
  n2: "Un solo acuerdo B2B o crisis destrabada en el Círculo Dorado repaga años de membresía.",
};

export function UpgradeModal({ targetLevel, isOpen, onClose }: UpgradeModalProps) {
  if (!isOpen) return null;

  const config = MEMBERSHIP_CONFIG[targetLevel];
  const isN2 = targetLevel === "n2";
  const accentColor = isN2 ? "#F7CC13" : "#1A3D84";
  const checkoutUrl = CHECKOUT_URLS[targetLevel];

  const handlePay = () => {
    if (checkoutUrl) {
      trackCheckoutOpened(targetLevel);
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-sm bg-card text-foreground rounded-2xl p-6 flex flex-col gap-4 shadow-elevated border-2"
        style={{ borderColor: accentColor }}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg"
          aria-label="Cerrar"
          style={{ minHeight: 44, minWidth: 44 }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pr-8 space-y-1">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: isN2 ? "rgba(247, 204, 19, 0.2)" : "rgba(26, 61, 132, 0.1)",
              color: isN2 ? "#9A7000" : "#1A3D84",
            }}
          >
            <ShieldCheck className="w-3 h-3" />
            Pacto de Indispensabilidad
          </span>
          <h2 className="text-xl font-black text-foreground">{config.label}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{config.tagline}</p>
        </div>

        {/* Benefits */}
        <ul className="flex flex-col gap-2 bg-secondary/40 rounded-xl p-3.5 border border-border/60">
          {config.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
              <Check
                className="w-4 h-4 mt-0.5 shrink-0"
                style={{ color: isN2 ? "#B48600" : "#1A3D84" }}
              />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        {/* Precio */}
        <div className="flex items-baseline gap-2">
          {config.priceARS && (
            <>
              <span className="text-2xl font-black text-foreground">
                ARS {config.priceARS.toLocaleString("es-AR")}
              </span>
              {config.priceUSD && (
                <span className="text-xs font-semibold text-muted-foreground">
                  · USD {config.priceUSD}
                </span>
              )}
              <span className="text-xs text-muted-foreground">/mes</span>
            </>
          )}
        </div>

        {/* Social proof */}
        <p className="text-xs text-muted-foreground italic leading-relaxed">
          {SOCIAL_PROOF[targetLevel]}
        </p>

        {/* CTA principal */}
        <button
          onClick={handlePay}
          className="w-full min-h-[48px] rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 active:scale-98 shadow-sm"
          style={{
            backgroundColor: accentColor,
            color: isN2 ? "#1A1A1A" : "#FFFFFF",
          }}
        >
          Activar membresía ahora →
        </button>

        {/* Nota post-pago */}
        <p className="text-[11px] text-center text-muted-foreground">
          Después de abonar, volvé y tocá{" "}
          <strong className="text-foreground">"Verificar membresía"</strong> en tu perfil.
        </p>

        {/* Botón secundario */}
        <button
          onClick={onClose}
          className="w-full min-h-[44px] rounded-xl text-xs font-bold text-muted-foreground border border-border hover:bg-secondary/60 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
