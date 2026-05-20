import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileComplete } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import DiagnosticTest from "@/components/DiagnosticTest";
import { type Step } from "@/components/diagnostic";
import { SEOHead } from "@/components/SEOHead";

interface Progress {
  step: Step | "";
  currentIdx: number;
  total: number;
}

const Onboarding = () => {
  const { user, loading } = useAuth();
  const { isLoading: profileLoading, profile } = useProfileComplete(user?.id);
  const [progress, setProgress] = useState<Progress>({ step: "", currentIdx: 0, total: 8 });
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

  const handleComplete = async () => {
    if (user) {
      await supabase
        .from("profiles")
        .update({ mirror_completed: true })
        .eq("user_id", user.id);
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    }
    navigate("/", { state: { initialTab: "red" }, replace: true });
  };

  const handleProgress = (step: Step, currentIdx: number, total: number) => {
    setProgress({ step, currentIdx, total: total || 8 });
  };

  const inQuestion = progress.step === "question";
  const inResult = progress.step === "result" || progress.step === "loading";
  const questionNumber = Math.min(progress.currentIdx + 1, progress.total);
  const progressPercent = inResult ? 100 : inQuestion ? Math.round((questionNumber / progress.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background pb-8">
      <SEOHead
        title="Diagnóstico inicial — MejoraApp"
        description="Antes de entrar, conocemos tu negocio"
      />

      {/* Header fijo con barra de progreso */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground text-center uppercase tracking-wide">
          Antes de entrar, conocemos tu negocio
        </p>

        {(inQuestion || inResult) && (
          <div className="mt-2.5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-muted-foreground">
                {inResult ? "Analizando tu perfil…" : `Paso ${questionNumber} de ${progress.total}`}
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

      <div className="max-w-lg mx-auto px-4 py-4">
        <DiagnosticTest onComplete={handleComplete} onProgress={handleProgress} />
      </div>
    </div>
  );
};

export default Onboarding;
