/** DiagnosticResultView — Results display with recommendations and CTAs */

import { useMemo } from "react";
import { MessageCircle, BookOpen, Download, Lightbulb, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useContentRecommendations } from "@/hooks/useContentRecommendations";
import { FeatureGate } from "@/components/FeatureGate";
import {
  WA_NUMBER,
  calcularScores,
  NOMBRES_AREA,
  generarPlanAccion72h,
  type Area,
  type RespuestaPosicion,
  type PerfilKey,
} from "@/data/diagnosticData";
import { AreaBar } from "@/components/diagnostic/AreaBar";
import { GaugeGlobal } from "@/components/diagnostic/GaugeGlobal";
import {
  trackShareDiagnosticWA,
  trackDiagnosticCTAPerfil,
  trackDiagnosticPDFExport,
  trackContentRecommendationClick,
  trackFunnelStep,
} from "@/lib/analytics";

// Lazy-load PDF export (heavy: jsPDF ~400KB)
const exportDiagnosticPDF = (...args: Parameters<typeof import("@/lib/pdfExport").exportDiagnosticPDF>) =>
  import("@/lib/pdfExport").then((m) => m.exportDiagnosticPDF(...args));

interface PerfilData {
  tagline: string;
  desc: string;
  color: string;
  mirror: string[];
  symptoms: string[];
  ctaTitle: string;
  ctaText: string;
}

interface DiagnosticResultViewProps {
  perfil: string;
  perfilData: PerfilData;
  puntaje: number;
  answers?: Record<number, number>;
  posicion?: RespuestaPosicion;
  onComplete: () => void;
  userName?: string;
}

export const DiagnosticResultView = ({
  perfil,
  perfilData,
  puntaje,
  answers = {},
  posicion,
  onComplete,
  userName,
}: DiagnosticResultViewProps) => {
  const { recommendations, loading: loadingRecs } = useContentRecommendations(perfil, 3);
  const { toast } = useToast();

  const scores = useMemo(() => calcularScores(answers), [answers]);
  const plan72h = useMemo(() => {
    if (!scores) return null;
    try {
      return generarPlanAccion72h({
        perfil: perfil as PerfilKey,
        scores,
        posicion,
      });
    } catch {
      return null;
    }
  }, [perfil, scores, posicion]);
  const areaList = useMemo(() => {
    if (!scores) return [];
    return (Object.keys(scores) as Area[]).map((area) => ({
      key: area,
      nombre: NOMBRES_AREA[area],
      porcentaje: scores[area],
    }));
  }, [scores]);

  const puntajeGlobalPorcentaje = useMemo(() => {
    if (!scores) return Math.round((puntaje / 40) * 100);
    const vals = Object.values(scores);
    return Math.round(vals.reduce((a, b) => a + b, 0) / (vals.length || 1));
  }, [scores, puntaje]);

  const weakestArea = useMemo(() => {
    if (!areaList || areaList.length === 0) return null;
    return [...areaList].sort((a, b) => a.porcentaje - b.porcentaje)[0];
  }, [areaList]);

  const waMsg = encodeURIComponent(
    `Hola, hice el Mirror de Mejora Continua. Mi Mirror es: "${perfilData.tagline}". Quiero hablar.`
  );
  const waLink = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  const handleExportPDF = async () => {
    try {
      await exportDiagnosticPDF({
        perfil,
        puntaje,
        respuestas: {},
        fecha: new Date().toLocaleDateString("es-AR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        userName,
      });
      trackDiagnosticPDFExport(perfil);
      toast({ title: "PDF descargado", description: "Tu Mirror se guardó como PDF." });
    } catch (err) {
      console.error("PDF export error:", err);
      toast({ title: "Error", description: "No se pudo generar el PDF.", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in space-y-5">
      <div
        className="text-title font-black text-center text-white py-5 px-5 rounded-xl leading-tight"
        style={{ backgroundColor: perfilData.color }}
      >
        {perfilData.tagline}
      </div>

      <div className="bg-secondary border-l-4 border-mc-diag-blue p-4 rounded-r-xl">
        <p className="text-sm text-foreground leading-relaxed">{perfilData.desc}</p>
      </div>

      {/* Bento Grid: 4 Dimensiones & Madurez Estructural */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-foreground">
              Madurez en las 4 Dimensiones
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Evaluación estructural del sistema de negocio
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary text-foreground">
            {puntaje} / 40 pts
          </span>
        </div>

        {/* Gauge de madurez global */}
        <GaugeGlobal value={puntajeGlobalPorcentaje} size="sm" />

        {/* 4 Dimensiones con AreaBar */}
        <div className="pt-1">
          {areaList.map((area, idx) => (
            <AreaBar
              key={area.key}
              nombre={area.nombre}
              porcentaje={area.porcentaje}
              delay={idx * 150}
            />
          ))}
        </div>
      </div>

      {/* Plan Accionable Primeras 72 Horas */}
      {plan72h && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#1A3D84] dark:text-blue-400">
                Plan de Acción Inmediato · 72 Horas
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Foco en resolver la traba estructural prioritaria
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="text-xs font-bold gap-1.5 h-8 border-border"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </Button>
          </div>
          <p className="text-sm text-foreground leading-relaxed font-medium">
            {plan72h.lecturaOrigen}
          </p>
          <p className="text-xs text-muted-foreground italic border-l-2 border-[#1A3D84] pl-3 py-1 bg-secondary/30 rounded-r-lg">
            {plan72h.enfoqueRol}
          </p>
          <div className="space-y-3 pt-1">
            {plan72h.pasos.map((paso, idx) => (
              <div
                key={idx}
                className="bg-secondary/40 rounded-xl p-3.5 border border-border/70 space-y-1.5"
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1A3D84] dark:text-blue-400">
                  {paso.dia}
                </span>
                <h4 className="text-sm font-bold text-foreground">{paso.titulo}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{paso.accion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-caption font-bold tracking-widest text-muted-foreground uppercase mb-3">
          Lo que te dijiste esta semana
        </h3>
        <div className="space-y-2">
          {perfilData.mirror.map((m, i) => (
            <div
              key={i}
              className="py-2.5 px-4 bg-card border border-border rounded-r-xl italic text-sm text-foreground leading-relaxed"
              style={{ borderLeftWidth: 3, borderLeftColor: perfilData.color }}
            >
              {m}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-caption font-bold tracking-widest text-muted-foreground uppercase mb-3">
          Lo que tu negocio está mostrando
        </h3>
        <div className="border border-border rounded-xl overflow-hidden">
          {perfilData.symptoms.map((s, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 p-3",
                i < perfilData.symptoms.length - 1 && "border-b border-border"
              )}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-caption font-bold flex-shrink-0 mt-0.5"
                style={{
                  borderWidth: 2,
                  borderColor: perfilData.color,
                  color: perfilData.color,
                  backgroundColor: `${perfilData.color}15`,
                }}
              >
                !
              </div>
              <span className="text-sm text-foreground leading-snug">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA de consultoría */}
      <div className="bg-mc-diag-blue rounded-xl p-6 text-center text-white">
        <h3 className="text-base font-extrabold mb-2">{perfilData.ctaTitle}</h3>
        <p className="text-xs opacity-80 mb-4 leading-relaxed">{perfilData.ctaText}</p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackShareDiagnosticWA(puntaje);
            trackDiagnosticCTAPerfil(perfil, puntaje);
            trackFunnelStep("diagnostic_whatsapp_cta", { perfil, puntaje });
          }}
          className="inline-flex items-center gap-2 bg-mc-diag-red hover:bg-mc-diag-red/90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Quiero hablar con un especialista →
        </a>
      </div>

      {/* Recomendaciones de contenido */}
      <FeatureGate feature="content_recommendations" variant="inline">
        <div className="space-y-2">
          <h3 className="text-caption font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            Contenido recomendado para tu perfil
          </h3>
          {loadingRecs ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-2">
              {recommendations.map((rec) => (
                <Card
                  key={rec.id}
                  className="hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => {
                    trackContentRecommendationClick(rec.id, perfil);
                    onComplete();
                  }}
                >
                  <CardContent className="p-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground line-clamp-1">
                        {rec.titulo}
                      </p>
                      <p className="text-caption text-muted-foreground line-clamp-2 mt-0.5">
                        {rec.resumen || rec.contenido?.slice(0, 100)}
                      </p>
                      {rec.content_categories && (
                        <span className="text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded mt-1 inline-block">
                          {rec.content_categories.nombre}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </FeatureGate>

      {/* Deep-linking Mentor IA con la dimensión más débil */}
      {weakestArea && (
        <div className="bg-[#1A3D84]/5 border-2 border-[#1A3D84]/20 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1A3D84] dark:text-blue-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F7CC13]" />
              Plan de Acción con Mentor IA
            </span>
            <p className="text-xs font-bold text-foreground">
              Tu área con mayor margen de mejora: <span className="text-[#E1061E]">{weakestArea.nombre} ({weakestArea.porcentaje}%)</span>
            </p>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Abrí una sesión guiada con el Mentor para trazar un plan táctico de 72 horas y destrabar esta dimensión.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("navigate-tab", {
                  detail: "mentor",
                })
              );
            }}
            className="text-white text-xs font-black rounded-xl shrink-0 gap-1.5 min-h-[38px]"
            style={{ backgroundColor: "#1A3D84" }}
          >
            <span>Trabajar con Mentor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <FeatureGate feature="diagnostic_pdf">
          <Button onClick={handleExportPDF} variant="outline" className="flex-1 py-3 gap-2">
            <Download className="w-4 h-4" />
            Descargar PDF
          </Button>
        </FeatureGate>
        <Button
          onClick={onComplete}
          className="flex-1 bg-mc-dark-blue hover:bg-mc-dark-blue/90 text-white py-3 gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Ver contenido
        </Button>
      </div>
    </div>
  );
};
