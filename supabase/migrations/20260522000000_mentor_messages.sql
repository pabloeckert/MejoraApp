-- ============================================================
-- mentor_messages: tabla de mensajes del Mentor IA
-- Ejecutar en Supabase Dashboard → SQL Editor
-- Fecha: 2026-05-22
-- ============================================================

CREATE TABLE IF NOT EXISTS public.mentor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.mentor_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model_used TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mentor_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own mentor messages"
  ON public.mentor_messages
  FOR ALL
  USING (
    auth.uid() = (
      SELECT user_id FROM public.mentor_conversations
      WHERE id = conversation_id
    )
  )
  WITH CHECK (
    auth.uid() = (
      SELECT user_id FROM public.mentor_conversations
      WHERE id = conversation_id
    )
  );

CREATE INDEX IF NOT EXISTS idx_mentor_messages_conversation_id
  ON public.mentor_messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_mentor_messages_created_at
  ON public.mentor_messages(conversation_id, created_at);
