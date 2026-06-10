import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Users, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileComplete } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { trackOnboardingCompleted } from "@/lib/analytics";
import DiagnosticTest from "@/components/DiagnosticTest";
import { type Step } from "@/components/diagnostic";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Progress {
  step: Step | "";
  currentIdx: number;
  total: number;
}

type Phase = "diagnostic" | "red-step";

const Onboarding = () => {
  const { user, loading } = useAuth();
  const { isLoading: profileLoading, profile } = useProfileComplete(user?.id);
  const [progress, setProgress] = useState<Progress>({ step: "", currentIdx: 0, total: 8 });
  const [phase, setPhase] = useState<Phase>("diagnostic");
  const [ofrece, setOfrece] = useState("");
  const [busca, setBusca] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-mc-dark-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (profile?.mirror_completed) return <Navigate to="/" replace />;

  // DiagnosticTest termina → mostrar paso extra antes de guardar
  const handleDiagnosticComplete = () => {
    setPhase("red-step");
  };

  const handleProgress = (step: Step, currentIdx: number, total: number) => {
    setProgress({ step, currentIdx, total: total || 8 });
  };

  // CTA final: guarda todo junto y entra a la Red
  const handleEnterRed = async () => {
    setSaving(true);
    if (user) {
      await supabase.from("profiles")
        .update({
          mirror_completed: true,
          ofrece: ofrece.trim() || null,
          busca: busca.trim() || null,
        })
        .eq("user_id", user.id);
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      trackOnboardingCompleted(!!ofrece.trim(), !!busca.trim());
    }
    navigate("/", { state: { initialTab: "red" }, replace: true });
  };

  const inQuestion = progress.step === "question";
  const inResult = progress.step === "result" || progress.step === "loading";
  const questionNumber = Math.min(progress.currentIdx + 1, progress.total);
  const progressPercent =
    phase === "red-step" ? 100
    : inResult ? 100
    : inQuestion ? Math.round((questionNumber / progress.total) * 100)
    : 0;

  const headerLabel =
    phase === "red-step"
      ? "Un paso más"
      : "Antes de entrar, conocemos tu negocio";

  const showBar = inQuestion || inResult || phase === "red-step";

  return (
    <div className="min-h-screen bg-background pb-8">
      <SEOHead
        title="Diagnóstico inicial — MejoraApp"
        description="Antes de entrar, conocemos tu negocio"
      />

      {/* Header fijo con barra de progreso */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground text-center uppercase tracking-wide">
          {headerLabel}
        </p>

        {showBar && (
          <div className="mt-2.5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-muted-foreground">
                {phase === "red-step"
                  ? "Completá tu perfil"
                  : inResult
                  ? "Analizando tu perfil…"
                  : `Paso ${questionNumber} de ${progress.total}`}
              </span>
              <span className="text-xs font-semibold text-brand-azul">{progressPercent}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: "hsl(var(--brand-azul))",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {phase === "diagnostic" && (
        <div className="max-w-lg mx-auto px-4 py-4">
          <DiagnosticTest onComplete={handleDiagnosticComplete} onProgress={handleProgress} />
        </div>
      )}

      {phase === "red-step" && (
        <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "hsl(var(--brand-azul) / 0.12)" }}>
              <Users className="w-7 h-7" style={{ color: "hsl(var(--brand-azul))" }} />
            </div>
            <h2 className="text-lg font-bold text-foreground">Completá tu perfil en la Red</h2>
            <p className="text-sm text-muted-foreground">
              Ayudá a otros líderes a encontrarte. Podés editarlo después.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>¿Qué podés aportar a la Red?</Label>
              <Textarea
                value={ofrece}
                onChange={(e) => setOfrece(e.target.value.slice(0, 300))}
                rows={4}
                className="resize-none text-sm"
                placeholder="Ej: Experiencia en finanzas corporativas, contactos en el sector agro..."
              />
              <p className="text-xs text-muted-foreground text-right">{ofrece.length}/300</p>
            </div>

            <div className="space-y-2">
              <Label>¿Qué estás buscando?</Label>
              <Textarea
                value={busca}
                onChange={(e) => setBusca(e.target.value.slice(0, 300))}
                rows={4}
                className="resize-none text-sm"
                placeholder="Ej: Potenciales socios para expandir a Brasil, clientes en retail..."
              />
              <p className="text-xs text-muted-foreground text-right">{busca.length}/300</p>
            </div>
          </div>

          <Button
            className="w-full gap-2 h-11 text-base"
            onClick={handleEnterRed}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
            Entrar a la Red
          </Button>

          <button
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleEnterRed}
            disabled={saving}
          >
            Saltar por ahora
          </button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
