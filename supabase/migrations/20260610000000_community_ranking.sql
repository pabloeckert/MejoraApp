-- community_ranking view + missing tables guard
-- 2026-06-10

-- Vista: community_ranking
-- Agrega actividad de cada usuario en la comunidad para el ranking.
-- Usada por useRanking() en useMembers.ts (fallback manual si no existe).
CREATE OR REPLACE VIEW public.community_ranking AS
SELECT
  p.user_id                                                     AS id,
  COALESCE(p.display_name, p.nombre, 'Anónimo')                 AS display_name,
  p.avatar_url,
  p.empresa,
  p.sector,
  COALESCE(post_counts.post_count, 0)::INTEGER                  AS post_count,
  COALESCE(like_counts.total_likes, 0)::INTEGER                 AS total_likes,
  COALESCE(comment_counts.comment_count, 0)::INTEGER            AS comment_count,
  (
    COALESCE(post_counts.post_count, 0) * 3
    + COALESCE(like_counts.total_likes, 0)
    + COALESCE(comment_counts.comment_count, 0) * 2
  )::INTEGER                                                     AS score
FROM public.profiles p
LEFT JOIN (
  SELECT user_id, COUNT(*) AS post_count
  FROM public.wall_posts
  WHERE status = 'approved'
  GROUP BY user_id
) post_counts ON post_counts.user_id = p.user_id
LEFT JOIN (
  SELECT wp.user_id, COUNT(wl.id) AS total_likes
  FROM public.wall_likes wl
  JOIN public.wall_posts wp ON wp.id = wl.post_id
  GROUP BY wp.user_id
) like_counts ON like_counts.user_id = p.user_id
LEFT JOIN (
  SELECT wc.user_id, COUNT(*) AS comment_count
  FROM public.wall_comments wc
  GROUP BY wc.user_id
) comment_counts ON comment_counts.user_id = p.user_id
ORDER BY score DESC;

GRANT SELECT ON public.community_ranking TO authenticated;

-- community_challenges (idempotente)
CREATE TABLE IF NOT EXISTS public.community_challenges (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  description      TEXT,
  challenge_type   TEXT NOT NULL DEFAULT 'weekly',
  start_date       TIMESTAMPTZ NOT NULL,
  end_date         TIMESTAMPTZ NOT NULL,
  participant_count INTEGER NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'community_challenges' AND policyname = 'Authenticated users read active challenges'
  ) THEN
    CREATE POLICY "Authenticated users read active challenges"
      ON public.community_challenges FOR SELECT
      USING (auth.role() = 'authenticated' AND is_active = true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'community_challenges' AND policyname = 'Admin manages challenges'
  ) THEN
    CREATE POLICY "Admin manages challenges"
      ON public.community_challenges FOR ALL
      USING (public.is_admin(auth.uid()))
      WITH CHECK (public.is_admin(auth.uid()));
  END IF;
END $$;

-- challenge_participants (idempotente)
CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.community_challenges(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'challenge_participants' AND policyname = 'Authenticated users read participants'
  ) THEN
    CREATE POLICY "Authenticated users read participants"
      ON public.challenge_participants FOR SELECT
      USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'challenge_participants' AND policyname = 'Users manage own participation'
  ) THEN
    CREATE POLICY "Users manage own participation"
      ON public.challenge_participants FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Trigger para actualizar participant_count (idempotente)
CREATE OR REPLACE FUNCTION update_challenge_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_challenges
    SET participant_count = participant_count + 1
    WHERE id = NEW.challenge_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_challenges
    SET participant_count = GREATEST(participant_count - 1, 0)
    WHERE id = OLD.challenge_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_challenge_participant_count ON public.challenge_participants;
CREATE TRIGGER trg_challenge_participant_count
  AFTER INSERT OR DELETE ON public.challenge_participants
  FOR EACH ROW EXECUTE FUNCTION update_challenge_participant_count();
