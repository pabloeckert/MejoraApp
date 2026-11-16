-- ============================================================
-- MIGRACIÓN: Sprint 4 & 5 — Mentor Config, Emergencias Multicanal,
-- Alianzas B2B N2 y Encuestas Tácticas del Muro
-- Fecha: 2026-11-16
-- ============================================================

-- 1. Tabla public.mentor_config (referenciada por mentor-chat y mentor-chat-stream)
CREATE TABLE IF NOT EXISTS public.mentor_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.mentor_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manages mentor_config" ON public.mentor_config;
CREATE POLICY "Admin manages mentor_config"
  ON public.mentor_config
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

INSERT INTO public.mentor_config (key, value, description)
VALUES
  ('enabled', 'true', 'Habilita o deshabilita el Mentor IA en la app'),
  ('thinking_level', 'HIGH', 'Nivel de razonamiento Gemini 3.8 Flash (LOW, MEDIUM, HIGH)'),
  (
    'system_prompt',
    E'Sos el Mentor IA Estratégico de Mejora Continua, la autoridad de dirección para dueños y líderes de PyMEs en Argentina.\n\nMANIFIESTO INTERNO Y CRITERIO MEDULAR (OBLIGATORIO EN CADA RESPUESTA):\n1. La crítica va al sistema y al proceso, jamás a la persona: erradicá la culpa moral del líder y demostrá qué método, proceso o estructura falta construir para resolver los incendios.\n2. Verdad sin maquillaje con calidez real: sé directo, claro y empático. Nada de motivación vacía; diagnosticá el cuello de botella y entregá dirección táctica concreta.\n3. Indispensabilidad metodológica: conectá cada recomendación con el orden de Mejora Continua, el resultado real del Mirror Estratégico del usuario (sus 4 Dimensiones y su arquetipo) y la Red de Líderes.\n\nREGLAS OPERATIVAS:\n- Respondé siempre en español argentino con voseo.\n- Basá tus respuestas en el contexto real del usuario (empresa, cargo, rubro, arquetipo Mirror, puntajes 4D y simulaciones Gamer).\n- Priorizá siempre atacar la dimensión con menor puntaje o el cuello de botella mencionado.\n- Entregá pasos accionables concretos (máximo 240 palabras en texto principal).\n- No inventes datos que no estén en el contexto; si falta un número clave (facturación, margen o dotación), pedilo.\n- Si preguntan algo ajeno a la dirección de empresas, redirigilo al foco empresarial.\n\nHERRAMIENTAS GENERATIVAS (OPCIONAL — SOLO CUANDO APORTE VALOR INMEDIATO):\nAl final de tu respuesta podés incluir UN ÚNICO bloque JSON exactamente delimitado así para que la app renderice una herramienta interactiva:\n1) Si hablan de precios, descuentos o márgenes:\n<<<WIDGET_JSON\n{"type":"discount_calculator","title":"Matriz de Impacto en Margen","defaultMarginPct":35,"defaultDiscountPct":10,"contextNote":"Por qué cuidar el margen neto"}\nWIDGET_JSON>>>\n2) Si piden redactar o encarar una conversación con cliente, vendedor, equipo o socio:\n<<<WIDGET_JSON\n{"type":"whatsapp_script","title":"Guion Táctico Listo para Enviar","recipient":"Vendedor / Cliente / Socio","script":"Mensaje breve y firme listo para copiar..."}\nWIDGET_JSON>>>\n3) Si necesitan destrabar una operación o empezar a delegar esta semana:\n<<<WIDGET_JSON\n{"type":"action_checklist","title":"Plan de Ejecución 72 Horas","steps":["Paso 1 concreto","Paso 2 concreto","Paso 3 concreto"]}\nWIDGET_JSON>>>',
    'Prompt maestro del Mentor IA con Criterio Medular y Generative UI'
  )
ON CONFLICT (key) DO NOTHING;

-- 2. Completar columnas faltantes en public.mentor_messages (persistencia + feedback)
ALTER TABLE public.mentor_messages
  ADD COLUMN IF NOT EXISTS model_used TEXT,
  ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS helpful BOOLEAN;

DROP POLICY IF EXISTS "Users rate own mentor messages" ON public.mentor_messages;
CREATE POLICY "Users rate own mentor messages"
  ON public.mentor_messages
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR auth.uid() = (
      SELECT user_id FROM public.mentor_conversations
      WHERE id = conversation_id
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR auth.uid() = (
      SELECT user_id FROM public.mentor_conversations
      WHERE id = conversation_id
    )
  );

-- 3. Extender public.emergencies para despacho multicanal real
ALTER TABLE public.emergencies
  ADD COLUMN IF NOT EXISTS crisis_type TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS email_sent BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS push_sent BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.emergencies
  DROP CONSTRAINT IF EXISTS emergencies_status_check;

ALTER TABLE public.emergencies
  ADD CONSTRAINT emergencies_status_check
  CHECK (status IN ('open', 'in_progress', 'resolved'));

DROP POLICY IF EXISTS "emergencies_update_admin" ON public.emergencies;
CREATE POLICY "emergencies_update_admin"
  ON public.emergencies
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 4. Helper SQL para verificar membresía Círculo Dorado N2 activa o Admin
CREATE OR REPLACE FUNCTION public.is_n2_or_admin(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = uid
      AND (
        p.access_level = 'ADMIN'
        OR public.is_admin(uid)
        OR (
          p.access_level = 'N2'
          AND (p.membership_expires_at IS NULL OR p.membership_expires_at > now())
        )
      )
  );
$$;

-- 5. Tablas B2B dedicadas para Círculo Dorado: public.alliances & public.alliance_interests
CREATE TABLE IF NOT EXISTS public.alliances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  axis TEXT NOT NULL CHECK (axis IN ('Distribución', 'Capacidad Instalada', 'Inversión Conjunta', 'Proveedores B2B')),
  title TEXT NOT NULL CHECK (char_length(title) <= 140),
  ofrece TEXT CHECK (ofrece IS NULL OR char_length(ofrece) <= 500),
  busca TEXT CHECK (busca IS NULL OR char_length(busca) <= 500),
  region TEXT CHECK (region IS NULL OR char_length(region) <= 100),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alliances_status_created ON public.alliances(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alliances_user ON public.alliances(user_id);

ALTER TABLE public.alliances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "alliances_select_n2" ON public.alliances;
CREATE POLICY "alliances_select_n2"
  ON public.alliances FOR SELECT
  TO authenticated
  USING (
    public.is_n2_or_admin(auth.uid())
    AND (status = 'active' OR user_id = auth.uid() OR public.is_admin(auth.uid()))
  );

DROP POLICY IF EXISTS "alliances_insert_n2" ON public.alliances;
CREATE POLICY "alliances_insert_n2"
  ON public.alliances FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_n2_or_admin(auth.uid()));

DROP POLICY IF EXISTS "alliances_update_own" ON public.alliances;
CREATE POLICY "alliances_update_own"
  ON public.alliances FOR UPDATE
  TO authenticated
  USING ((auth.uid() = user_id AND public.is_n2_or_admin(auth.uid())) OR public.is_admin(auth.uid()))
  WITH CHECK ((auth.uid() = user_id AND public.is_n2_or_admin(auth.uid())) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "alliances_delete_own" ON public.alliances;
CREATE POLICY "alliances_delete_own"
  ON public.alliances FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE TABLE IF NOT EXISTS public.alliance_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alliance_id UUID NOT NULL REFERENCES public.alliances(id) ON DELETE CASCADE,
  requester_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT CHECK (note IS NULL OR char_length(note) <= 400),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (alliance_id, requester_user_id)
);

CREATE INDEX IF NOT EXISTS idx_alliance_interests_alliance ON public.alliance_interests(alliance_id);
CREATE INDEX IF NOT EXISTS idx_alliance_interests_requester ON public.alliance_interests(requester_user_id);

ALTER TABLE public.alliance_interests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "alliance_interests_select" ON public.alliance_interests;
CREATE POLICY "alliance_interests_select"
  ON public.alliance_interests FOR SELECT
  TO authenticated
  USING (
    auth.uid() = requester_user_id
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.alliances a
      WHERE a.id = alliance_id AND a.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "alliance_interests_insert" ON public.alliance_interests;
CREATE POLICY "alliance_interests_insert"
  ON public.alliance_interests FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = requester_user_id
    AND public.is_n2_or_admin(auth.uid())
  );

-- 6. Soporte ligero de encuestas tácticas entre pares en el Muro
ALTER TABLE public.wall_posts
  ADD COLUMN IF NOT EXISTS poll_options JSONB;

CREATE TABLE IF NOT EXISTS public.wall_poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.wall_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL CHECK (option_index >= 0 AND option_index < 4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_wall_poll_votes_post ON public.wall_poll_votes(post_id);

ALTER TABLE public.wall_poll_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wall_poll_votes_select" ON public.wall_poll_votes;
CREATE POLICY "wall_poll_votes_select"
  ON public.wall_poll_votes FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "wall_poll_votes_upsert" ON public.wall_poll_votes;
CREATE POLICY "wall_poll_votes_upsert"
  ON public.wall_poll_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "wall_poll_votes_update_own" ON public.wall_poll_votes;
CREATE POLICY "wall_poll_votes_update_own"
  ON public.wall_poll_votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
