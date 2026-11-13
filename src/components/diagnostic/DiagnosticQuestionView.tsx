/** DiagnosticQuestionView — Question step with modern Bento styling and haptic motion */

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NOMBRES_AREA, type DiagnosticQuestion } from "@/data/diagnosticData";

interface DiagnosticQuestionViewProps {
  question: DiagnosticQuestion;
  currentIdx: number;
  answers: Record<number, number>;
  progress: number;
  onSelect: (questionId: number, score: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export const DiagnosticQuestionView = ({
  question,
  currentIdx,
  answers,
  progress,
  onSelect,
  onBack,
  onNext,
}: DiagnosticQuestionViewProps) => {
  const labels = ["A", "B", "C", "D"];
  const isLast = currentIdx === 7;
  const hasAnswer = answers[question.id] !== undefined;

  const handleSelect = (score: number) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Safe fail on devices without vibration support
      }
    }
    onSelect(question.id, score);
  };

  const areaName = question.areaDominante ? NOMBRES_AREA[question.areaDominante] : null;

  return (
    <div className="max-w-xl mx-auto animate-fade-in space-y-4">
      {/* Header Card */}
      <div
        className="rounded-2xl p-5 text-white shadow-md transition-all duration-300"
        style={{ backgroundColor: "#1A3D84" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-white/80">
            Pregunta {currentIdx + 1} de 8
          </span>
          {areaName && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white/90">
              {areaName}
            </span>
          )}
        </div>
        <h2 className="text-lg sm:text-xl font-black leading-snug tracking-tight mb-1 text-white">
          {question.title}
        </h2>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
          {question.sub}
        </p>
      </div>

      {/* Progress bar with cubic-bezier */}
      <div className="space-y-1">
        <div
          className="h-2 rounded-full overflow-hidden w-full bg-secondary/80 border border-border/50"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: isLast ? "#E1061E" : "#1A3D84",
              transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
        <div className="flex justify-between items-center px-1 text-[11px] text-muted-foreground font-semibold">
          <span>{currentIdx + 1} de 8 respondidas</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Options Group */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="space-y-2.5" role="radiogroup" aria-label={question.title}>
          {question.opts.map((opt, i) => {
            const isSelected = answers[question.id] === opt.score;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(opt.score)}
                className={cn(
                  "flex items-start gap-3.5 w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-200 min-h-[58px] cursor-pointer",
                  isSelected
                    ? "border-[#1A3D84] bg-blue-50/60 dark:bg-blue-950/25 shadow-sm -translate-y-0.5"
                    : "border-border hover:border-[#1A3D84]/50 hover:bg-secondary/60 hover:-translate-y-0.5"
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 transition-colors",
                    isSelected
                      ? "bg-[#1A3D84] text-white"
                      : "bg-muted text-muted-foreground border border-border"
                  )}
                >
                  {labels[i]}
                </div>
                <span
                  className={cn(
                    "text-sm leading-relaxed transition-colors",
                    isSelected ? "text-foreground font-semibold" : "text-foreground font-normal"
                  )}
                >
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-border mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="text-xs font-semibold px-3 py-2 h-9"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Atrás
          </Button>
          <Button
            onClick={onNext}
            disabled={!hasAnswer}
            size="sm"
            className={cn(
              "text-xs font-bold px-4 py-2 h-9 transition-transform active:scale-95 text-white",
              isLast
                ? "bg-[#E1061E] hover:bg-[#E1061E]/90 shadow-sm"
                : "bg-[#1A3D84] hover:bg-[#1A3D84]/90"
            )}
          >
            {isLast ? "Ver mi Mirror" : "Siguiente"}
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
