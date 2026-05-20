-- Perfil productivo para la Red de líderes
-- Lanzamiento founders Junio 2026

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS mirror_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS ofrece text,
  ADD COLUMN IF NOT EXISTS busca text,
  ADD COLUMN IF NOT EXISTS sector text,
  ADD COLUMN IF NOT EXISTS empresa_tamano text CHECK (empresa_tamano IN ('1-10','10-50','50-200','200+')),
  ADD COLUMN IF NOT EXISTS visible_en_red boolean DEFAULT true;

-- Usuarios existentes con diagnóstico ya hecho no vuelven a ver el onboarding
UPDATE profiles
  SET mirror_completed = true
  WHERE has_completed_diagnostic = true;
