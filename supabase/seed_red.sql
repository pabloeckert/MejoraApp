-- ============================================================
-- Seed: 6 perfiles de líderes argentinos para la Red
-- ============================================================
-- Cómo correr:
--   1. Supabase Dashboard → SQL Editor → pegar y ejecutar
--   2. O: supabase db execute --file supabase/seed_red.sql
--
-- Crea usuarios en auth.users + sus perfiles.
-- Contraseña de todos: Demo1234!
-- Requiere pgcrypto (habilitado por defecto en Supabase).
-- ============================================================

BEGIN;

-- ── Usuarios en auth.users ──────────────────────────────────

INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'carlos.mendoza@demo.mejoraok.com',
    crypt('Demo1234!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', false,
    '', '', '', ''
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'florencia.vidal@demo.mejoraok.com',
    crypt('Demo1234!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', false,
    '', '', '', ''
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'martin.aguirre@demo.mejoraok.com',
    crypt('Demo1234!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', false,
    '', '', '', ''
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'patricia.luna@demo.mejoraok.com',
    crypt('Demo1234!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', false,
    '', '', '', ''
  ),
  (
    'a0000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'diego.romero@demo.mejoraok.com',
    crypt('Demo1234!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', false,
    '', '', '', ''
  ),
  (
    'a0000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'cecilia.herrera@demo.mejoraok.com',
    crypt('Demo1234!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}', false,
    '', '', '', ''
  )
ON CONFLICT (id) DO NOTHING;

-- ── Perfiles en profiles ────────────────────────────────────

INSERT INTO profiles (
  user_id, nombre, apellido, empresa, cargo,
  sector, empresa_tamano, ofrece, busca,
  mirror_completed, visible_en_red, access_level,
  has_completed_diagnostic
)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'Carlos', 'Mendoza',
    'Mendoza Agro Exportaciones', 'CEO',
    'Agro / Alimentos', '50-200',
    'Red de contactos en mercados de Brasil y Chile. Acceso a financiamiento agroindustrial y logística de exportación.',
    'Socios estratégicos para industrializar producción primaria. Contactos en retail internacional.',
    true, true, 'N1', true
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'Florencia', 'Vidal',
    'Vidal & Asociados RRHH', 'Directora',
    'Consultoría', '10-50',
    'Expertise en cultura organizacional y gestión del talento. Metodologías ágiles aplicadas a PyMEs.',
    'Empresas en proceso de escalar que necesiten estructurar su área de personas.',
    true, true, 'N1', true
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'Martín', 'Aguirre',
    'TechFlow Solutions', 'Founder',
    'Tecnología', '10-50',
    'Desarrollo de software a medida y automatización de procesos. Experiencia en fintech y healthtech.',
    'Inversores ángel o fondos seed. Empresas tradicionales que quieran digitalizarse.',
    true, true, 'N2', true
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'Patricia', 'Luna',
    'Grupo Costruire', 'Gerente General',
    'Construcción / Real Estate', '200+',
    'Acceso a proyectos de infraestructura pública y privada en Mendoza y San Juan. Red de proveedores calificados.',
    'Arquitectos e inversores para desarrollo de proyectos residenciales premium.',
    true, true, 'N1', true
  ),
  (
    'a0000000-0000-0000-0000-000000000005',
    'Diego', 'Romero',
    'Romero Capital', 'Director de Inversiones',
    'Finanzas / Inversiones', '1-10',
    'Evaluación de proyectos de inversión. Acceso a family offices y fondos de la región.',
    'Startups con tracción buscando Serie A. Proyectos en agroindustria con potencial exportador.',
    true, true, 'N2', true
  ),
  (
    'a0000000-0000-0000-0000-000000000006',
    'Cecilia', 'Herrera',
    'Instituto de Liderazgo Empresarial', 'Directora Académica',
    'Educación', '10-50',
    'Programas de formación ejecutiva y coaching de liderazgo. Red de +500 egresados de C-level.',
    'Empresas para sponsorear programas de formación. Speakers internacionales para eventos.',
    true, true, 'N1', true
  )
ON CONFLICT (user_id) DO UPDATE SET
  nombre            = EXCLUDED.nombre,
  apellido          = EXCLUDED.apellido,
  empresa           = EXCLUDED.empresa,
  cargo             = EXCLUDED.cargo,
  sector            = EXCLUDED.sector,
  empresa_tamano    = EXCLUDED.empresa_tamano,
  ofrece            = EXCLUDED.ofrece,
  busca             = EXCLUDED.busca,
  mirror_completed  = EXCLUDED.mirror_completed,
  visible_en_red    = EXCLUDED.visible_en_red;

COMMIT;
