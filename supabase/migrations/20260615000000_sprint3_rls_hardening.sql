-- ============================================================
-- MIGRACIÓN: Sprint 3 — Multi-Tenant & RLS Security Hardening
-- Fecha: 2026-06-15
-- Descripción:
--   1. Trigger anti-escalación de nivel/membresía en profiles
--   2. Restricción de longitud en emergencies.message
--   3. Verificación explícita de políticas RLS en profiles y emergencies
-- ============================================================

-- 1. Trigger BEFORE UPDATE en public.profiles para impedir que clientes
--    no administradores manipulen columnas sensibles de membresía o billing.
CREATE OR REPLACE FUNCTION public.prevent_client_tier_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (
    current_setting('role', true) = 'authenticated'
    OR (auth.uid() IS NOT NULL AND current_setting('role', true) IS DISTINCT FROM 'service_role')
  ) AND NOT public.is_admin(auth.uid()) THEN
    IF NEW.access_level IS DISTINCT FROM OLD.access_level
       OR NEW.membership_level IS DISTINCT FROM OLD.membership_level
       OR NEW.membership_expires_at IS DISTINCT FROM OLD.membership_expires_at
       OR NEW.tiendup_customer_id IS DISTINCT FROM OLD.tiendup_customer_id
       OR NEW.tiendup_subscription_id IS DISTINCT FROM OLD.tiendup_subscription_id THEN
      RAISE EXCEPTION 'Insufficient privileges to modify membership or access tier fields';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_client_tier_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_client_tier_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_client_tier_escalation();

-- 2. Restricción defensiva de tamaño en tickets de emergencia
ALTER TABLE public.emergencies
  DROP CONSTRAINT IF EXISTS emergencies_message_length_check;

ALTER TABLE public.emergencies
  ADD CONSTRAINT emergencies_message_length_check
  CHECK (message IS NULL OR char_length(message) <= 1000);

-- 3. Verificación explícita de políticas RLS multi-tenant en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read member directory" ON public.profiles;
CREATE POLICY "Authenticated users can read member directory"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR public.is_admin(auth.uid())
    OR (auth.role() = 'authenticated' AND visible_en_red = true)
  );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- 4. Verificación explícita de políticas RLS multi-tenant en emergencies
ALTER TABLE public.emergencies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "emergencies_select_own" ON public.emergencies;
CREATE POLICY "emergencies_select_own"
  ON public.emergencies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "emergencies_insert" ON public.emergencies;
CREATE POLICY "emergencies_insert"
  ON public.emergencies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
