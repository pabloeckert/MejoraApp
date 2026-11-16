/**
 * MentorMessage — Individual message bubble for Mentor chat
 *
 * Supports: user, assistant, system roles
 * Features: timestamp, model badge, GenUI widgets rendering, feedback (helpful true/false)
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Bot, User, ThumbsUp, ThumbsDown } from "lucide-react";
import { parseGenUIWidgets, GenUIWidgetRenderer } from "./GenUIWidget";
import { supabase } from "@/integrations/supabase/client";

interface MentorMessageProps {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  modelUsed?: string;
  createdAt: string;
  isLast?: boolean;
  isStreaming?: boolean;
}

export const MentorMessage = ({
  id,
  role,
  content,
  modelUsed,
  createdAt,
  isLast,
  isStreaming = false,
}: MentorMessageProps) => {
  const isUser = role === "user";
  const isAssistant = role === "assistant";
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const { cleanText, widgets } = parseGenUIWidgets(content);

  const handleFeedback = async (helpful: boolean) => {
    setFeedback(helpful);
    if (!id || id.startsWith("temp-") || id.startsWith("assistant-")) return;
    try {
      await supabase
        .from("mentor_messages")
        .update({ helpful })
        .eq("id", id);
    } catch (err) {
      console.warn("Could not save message feedback:", err);
    }
  };

  const time = new Date(createdAt).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row",
        isLast && "mb-1"
      )}
    >
      {/* Avatar */}
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-mc-dark-blue/10 flex items-center justify-center">
          <User className="w-4 h-4 text-mc-dark-blue" />
        </div>
      )}

      {/* Message Bubble + Widgets Container */}
      <div className="max-w-[85%] sm:max-w-[80%] space-y-2">
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-body",
            isUser
              ? "bg-mc-dark-blue text-white rounded-tr-md"
              : "bg-card border border-border rounded-tl-md shadow-card"
          )}
        >
          <p className="whitespace-pre-wrap break-words">
            {cleanText}
            {isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle animate-[blink_0.8s_step-end_infinite]" />
            )}
          </p>

          {/* Footer: time + model + feedback */}
          {!isStreaming && (
            <div
              className={cn(
                "flex items-center gap-2 mt-2 text-caption pt-1 border-t border-border/40",
                isUser ? "text-white/60 justify-end" : "text-muted-foreground justify-between"
              )}
            >
              <div className="flex items-center gap-1.5">
                <span>{time}</span>
                {isAssistant && modelUsed && modelUsed !== "fallback" && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-medium",
                      "bg-primary/10 text-primary"
                    )}
                  >
                    {modelUsed.split("/").pop()?.split(":")[0] || modelUsed}
                  </span>
                )}
              </div>

              {isAssistant && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleFeedback(true)}
                    className={cn(
                      "p-1 rounded hover:bg-secondary/80 transition-colors",
                      feedback === true && "text-emerald-600 bg-emerald-500/10"
                    )}
                    title="Respuesta útil y alineada al Criterio Medular"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFeedback(false)}
                    className={cn(
                      "p-1 rounded hover:bg-secondary/80 transition-colors",
                      feedback === false && "text-destructive bg-destructive/10"
                    )}
                    title="Respuesta poco clara o genérica"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Generative UI Widgets rendered below message */}
        {widgets.length > 0 && (
          <div className="space-y-2">
            {widgets.map((widget, idx) => (
              <GenUIWidgetRenderer key={idx} widget={widget} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorMessage;
