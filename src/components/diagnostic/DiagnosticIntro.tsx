/** DiagnosticIntro — Pantalla de inmersión al Mirror Estratégico con Manifiesto y estética Bento */

import { ArrowRight, ShieldCheck, Layers, Clock, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureGate } from "@/components/FeatureGate";
import { PERFILES, zonaColor } from "@/data/diagnosticData";
import type { DiagnosticHistoryEntry } from "./types";

interface DiagnosticIntroProps {
  history: DiagnosticHistoryEntry[];
  onStart: () => void;
}

export const DiagnosticIntro = ({ history, onStart }: DiagnosticIntroProps) => (
  <div className="max-w-xl mx-auto animate-fade-in space-y-4">
    {/* Cabecera Bento con Manifiesto Central */}
    <div
      className="rounded-2xl px-6 py-7 text-white shadow-md"
      style={{ backgroundColor: "#1A3D84" }}
    >
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-extrabold tracking-widest uppercase text-white/90 mb-3">
        Mirror Estratégico • 4 Dimensiones
      </div>
      <h1 className="text-xl sm:text-2xl font-black leading-snug tracking-tight text-white mb-2">
        “El negocio no puede depender de que estés encima las 24 horas del día.”
      </h1>
      <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-medium">
        Descubrí en menos de 2 minutos dónde está el cuello de botella estructural que hoy frena tu crecimiento.
      </p>
    </div>

    {/* Cuerpo Principal Bento */}
    <div className="bg-card border border-border rounded-2xl shadow-sm p-5 sm:p-6 space-y-5">
      {/* Bloque del Criterio Medular */}
      <div
        className="bg-secondary/60 border-l-4 p-4 rounded-r-xl text-left"
        style={{ borderLeftColor: "#1A3D84" }}
      >
        <p className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-1">
          El Criterio Medular: Verdad sin maquillaje
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Tus frustraciones operativas no son falta de capacidad ni de esfuerzo: son síntomas de procesos que crecieron sin estructura. Respondé por lo que realmente pasa hoy en tu empresa, no por lo que debería pasar.
        </p>
      </div>

      {/* Grilla Bento de Atributos del Diagnóstico */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
        <div className="p-3 rounded-xl bg-secondary/40 border border-border/60 flex flex-col items-center justify-center">
          <Layers className="w-4 h-4 mb-1 text-[#1A3D84] dark:text-blue-400" />
          <div className="text-lg sm:text-xl font-black text-foreground">8</div>
          <div className="text-[11px] font-medium text-muted-foreground leading-tight">
            Preguntas reales
          </div>
        </div>
        <div className="p-3 rounded-xl bg-secondary/40 border border-border/60 flex flex-col items-center justify-center">
          <Clock className="w-4 h-4 mb-1 text-[#E1061E]" />
          <div className="text-lg sm:text-xl font-black text-foreground">&lt; 2m</div>
          <div className="text-[11px] font-medium text-muted-foreground leading-tight">
            Directo al hueso
          </div>
        </div>
        <div className="p-3 rounded-xl bg-secondary/40 border border-border/60 flex flex-col items-center justify-center">
          <ShieldCheck className="w-4 h-4 mb-1 text-[#1A3D84] dark:text-blue-400" />
          <div className="text-lg sm:text-xl font-black text-foreground">100%</div>
          <div className="text-[11px] font-medium text-muted-foreground leading-tight">
            Confidencial
          </div>
        </div>
      </div>

      {/* Botón Principal de Acción (Gate Cero) */}
      <Button
        onClick={onStart}
        className="w-full min-h-[52px] rounded-xl text-white font-black text-sm sm:text-base tracking-wide shadow-sm transition-transform active:scale-98 flex items-center justify-center gap-2"
        style={{ backgroundColor: "#1A3D84" }}
      >
        <span>
          {history.length > 0
            ? "HACER EL MIRROR ESTRATÉGICO DE NUEVO"
            : "HACER EL MIRROR ESTRATÉGICO (GRATIS)"}
        </span>
        <ArrowRight className="w-4 h-4 shrink-0" />
      </Button>

      {/* Historial de Mirrors previos */}
      <FeatureGate feature="diagnostic_history" variant="inline">
        {history.length > 0 && (
          <div className="pt-4 border-t border-border text-left space-y-3">
            <h3 className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Tus evaluaciones anteriores
            </h3>
            <div className="space-y-2">
              {history.map((entry) => {
                const perfilData = PERFILES[entry.perfil];
                const pct = Math.round((entry.puntaje_total / 40) * 100);
                const { color: badgeColor } = zonaColor(pct);
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-secondary/40 border border-border/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: perfilData?.color ?? badgeColor }}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-foreground block truncate">
                          {perfilData?.tagline ?? entry.perfil}
                        </span>
                        <span className="text-[11px] text-muted-foreground block">
                          {new Date(entry.created_at).toLocaleDateString("es-AR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 text-white"
                      style={{
                        backgroundColor: badgeColor,
                        color: pct >= 40 && pct < 65 ? "#1A1A1A" : "#FFFFFF",
                      }}
                    >
                      {entry.puntaje_total}/40 pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </FeatureGate>
    </div>
  </div>
);
