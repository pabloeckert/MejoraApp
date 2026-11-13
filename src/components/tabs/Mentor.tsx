/**
 * Mentor — Main tab component for Modo Mentor IA
 *
 * Features:
 * - Welcome screen with quick actions & active 4D Mirror context card
 * - Chat interface with AI mentor
 * - Conversation history sidebar
 * - Personalized context from user profile + diagnostic (4D)
 */

import { useState, useEffect, useCallback } from "react";
import { Bot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useMentorChat } from "@/hooks/useMentor";
import { MentorWelcome, type DiagnosticContextSummary } from "@/components/mentor/MentorWelcome";
import { MentorChat } from "@/components/mentor/MentorChat";
import { MentorHistory } from "@/components/mentor/MentorHistory";
import { trackMentorQuickAction, trackMentorNewConversation } from "@/lib/analytics";

const Mentor = () => {
  const { user } = useAuth();
  const [userName, setUserName] = useState<string | undefined>();
  const [hasDiagnostic, setHasDiagnostic] = useState(false);
  const [diagnosticSummary, setDiagnosticSummary] = useState<DiagnosticContextSummary | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const {
    messages,
    sending,
    streamingContent,
    error,
    conversationId,
    sendMessage,
    startNewConversation,
    loadConversation,
    clearError,
  } = useMentorChat();

  // Load user context + latest 4D Mirror diagnostic
  useEffect(() => {
    if (!user) return;

    const loadContext = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("nombre, empresa, cargo")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile?.nombre || profile?.empresa) {
        setUserName(profile.nombre || user.user_metadata?.nombre || user.email?.split("@")[0]);
      }

      const { data: diagnostic } = await supabase
        .from("diagnostic_results")
        .select("id, perfil, puntaje_total, respuestas")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setHasDiagnostic(!!diagnostic);
      if (diagnostic) {
        setDiagnosticSummary({
          perfil: diagnostic.perfil,
          puntajeTotal: diagnostic.puntaje_total ?? 0,
          respuestas:
            diagnostic.respuestas &&
            typeof diagnostic.respuestas === "object" &&
            !Array.isArray(diagnostic.respuestas)
              ? (diagnostic.respuestas as Record<number, number>)
              : undefined,
        });
      }
    };

    loadContext();
  }, [user]);

  // Switch to chat view when conversation starts
  useEffect(() => {
    if (messages.length > 0 || conversationId) {
      setShowWelcome(false);
    }
  }, [messages, conversationId]);

  const handleQuickAction = useCallback(
    async (prompt: string) => {
      trackMentorQuickAction(prompt.substring(0, 50));
      setShowWelcome(false);
      await sendMessage(prompt);
    },
    [sendMessage]
  );

  const handleNewConversation = useCallback(() => {
    trackMentorNewConversation();
    startNewConversation();
    setShowWelcome(true);
  }, [startNewConversation]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      loadConversation(id);
      setShowWelcome(false);
    },
    [loadConversation]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Bento 80/10/5/5 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#1A3D84" }}
          >
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-foreground">Mentor IA Estratégico</h2>
            <p className="text-[11px] text-muted-foreground">
              Criterio Medular · Dirección con Contexto 4D
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!showWelcome && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewConversation}
              aria-label="Nueva conversación"
            >
              <Plus className="w-5 h-5" />
            </Button>
          )}
          <MentorHistory
            currentConversationId={conversationId}
            onSelect={handleSelectConversation}
            onNew={handleNewConversation}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" aria-live="polite">
        {showWelcome && messages.length === 0 ? (
          <MentorWelcome
            userName={userName}
            hasDiagnostic={hasDiagnostic}
            diagnosticSummary={diagnosticSummary}
            onQuickAction={handleQuickAction}
          />
        ) : (
          <MentorChat
            messages={messages}
            sending={sending}
            streamingContent={streamingContent}
            error={error}
            onSend={sendMessage}
            onClearError={clearError}
          />
        )}
      </div>
    </div>
  );
};

export default Mentor;
