/**
 * Splash — P01: Pantalla de inmersión cultural al Manifiesto de Mejora Continua
 *
 * Aplica la regla 80/10/5/5 y presenta el Criterio Medular desde el primer contacto.
 * Se muestra una vez por sesión; auto-navega a /auth si ya fue vista.
 */

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Compass } from "lucide-react";
import logoComunidad from "@/assets/logo-comunidad.png";

const SPLASH_SEEN_KEY = "mc-splash-seen";

export default function Splash() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0); // 0=hidden → 1=logo → 2=manifesto → 3=pillars → 4=btns

  const goToAuth = useCallback(
    (replace = true) => {
      sessionStorage.setItem(SPLASH_SEEN_KEY, "true");
      navigate("/auth", { replace });
    },
    [navigate]
  );

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_SEEN_KEY)) {
      navigate("/auth", { replace: true });
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 50);
    const t2 = setTimeout(() => setPhase(2), 200);
    const t3 = setTimeout(() => setPhase(3), 380);
    const t4 = setTimeout(() => setPhase(4), 520);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [navigate]);

  const fade = (show: boolean, extra = "") =>
    `transition-all duration-400 ease-out ${
      show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
    } ${extra}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-md space-y-6">
        {/* Logo + Insignia Institucional */}
        <div className={`flex flex-col items-center text-center gap-3 ${fade(phase >= 1)}`}>
          <img
            src={logoComunidad}
            alt="Mejora Continua"
            className="h-14 object-contain"
          />
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest"
            style={{ backgroundColor: "rgba(26, 61, 132, 0.1)", color: "#1A3D84" }}
          >
            <Compass className="w-3.5 h-3.5" />
            Ecosistema de Dirección PyME
          </span>
        </div>

        {/* Tarjeta Bento del Manifiesto */}
        <div
          className={`rounded-2xl p-6 text-white shadow-md space-y-3 ${fade(phase >= 2)}`}
          style={{ backgroundColor: "#1A3D84" }}
        >
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#F7CC13]">
            El Criterio Medular
          </p>
          <h1 className="font-display text-xl sm:text-2xl font-bold leading-snug text-white">
            “El negocio no puede depender de que estés encima las 24 horas del día.”
          </h1>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            Tus frustraciones operativas no son falta de capacidad personal: son el síntoma de una empresa que creció sin procesos ni estructura.
          </p>
        </div>

        {/* Pilares del Pacto Cultural */}
        <div
          className={`bg-card border border-border rounded-2xl p-4 space-y-2.5 shadow-sm ${fade(
            phase >= 3
          )}`}
        >
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#1A3D84]" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Crítica al proceso, jamás a la persona:</strong> diagnosticamos cuellos de botella reales con verdad sin maquillaje.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#E1061E]" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Fin a la soledad del líder:</strong> una red confidencial de dueños y directivos con método y criterio compartido.
            </p>
          </div>
        </div>

        {/* Botones de Acción (Áreas táctiles >= 48px) */}
        <div className={`flex flex-col gap-3 w-full ${fade(phase >= 4)}`}>
          <button
            onClick={() => goToAuth()}
            className="w-full min-h-[52px] rounded-xl font-black text-sm sm:text-base text-white flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
            style={{ backgroundColor: "#1A3D84" }}
          >
            <span>Crear cuenta gratis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => goToAuth()}
            className="w-full min-h-[48px] rounded-xl font-bold text-sm text-foreground bg-card border border-border hover:bg-secondary/60 flex items-center justify-center transition-colors active:scale-98"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
