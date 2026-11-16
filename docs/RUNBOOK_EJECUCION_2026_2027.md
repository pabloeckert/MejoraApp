# RUNBOOK INTERNO DE EJECUCIÓN AUTÓNOMA (2026–2027) — MEJORAAPP

> **Documento Maestro Operativo para Continuidad Autonóma hasta Producción Definitiva**  
> **Modelo objetivo sugerido:** `Gemini 3.8` (Esfuerzo `HIGH` / `thinkingLevel: "HIGH"`)  
> **Fecha de actualización:** 16 de Noviembre de 2026  
> **Baseline verificado:** Commit `478f907` en `origin/main` · App live en [`https://app.mejoraok.com`](https://app.mejoraok.com) · Supabase Ref `pwiduojwgkaoxxuautkp`

---

## 1. CONTEXTO INNEGOCIABLE Y REGLAS DEL ECOSISTEMA

Cualquier agente o desarrollador que retome este repositorio debe respetar de forma estricta estos 4 pilares antes de escribir una sola línea de código:

1. **Criterio Medular (Copy, Prompts IA y UI):**
   - **Crítica al sistema/proceso, jamás a la persona:** nunca culpar moralmente al dueño PyME ni usar frases acusatorias. Todo cuello de botella se explica por ausencia de método o estructura.
   - **Verdad sin maquillaje con calidez real:** claridad táctica directa al dolor financiero, comercial u operativo, sin motivación vacía.
   - **Indispensabilidad comunitaria:** dentro del ecosistema hay orden, método y respaldo; afuera persisten la soledad del líder y la operación reactiva.
2. **Design System Canónico `80/10/5/5`:**
   - **80%** Superficies blancas/claras (`#FFFFFF` / `#F8FAFC`).
   - **10%** Azul Marino Institucional (`#1A3D84`) para autoridad, botones primarios, Mirror y cabeceras.
   - **5%** Rojo Acento (`#E1061E`) reservado estrictamente a alertas críticas, zonas rojas del Mirror y Botón de Emergencia (`< 60 min SLA`).
   - **5%** Amarillo Cálido (`#F7CC13`) para fricción operativa, insignias y acentos Círculo Dorado (`N2`).
   - Tipografías: `League Spartan` (`font-display`) para titulares de autoridad y `Bw Modelica` / `Inter` (`font-sans`) para cuerpo y lectura móvil. Áreas táctiles mínimas `44x44px` (`48px` en CTAs críticos).
3. **Arquitectura Limpia y Fronteras:**
   - Flujo obligatorio en frontend: `UI Component` ➔ `Hook` ➔ `Service` ➔ `Supabase Client`.
   - Validación con **Zod + DOMPurify** (`src/lib/validation.ts`) en toda frontera de entrada y en Edge Functions (`supabase/functions/_shared/schemas.ts`).
   - Entorno local: Windows 11 + PowerShell (`c:\github\MejoraApp`). **En PowerShell 5.1 no usar `&&`; encadenar con `; if ($LASTEXITCODE -eq 0) { ... }`.**
4. **Reglas de Despliegue Supabase CLI:**
   - Proyecto vinculado: `pwiduojwgkaoxxuautkp` (`us-east-2`).
   - Deploy Edge Functions sin Docker local: `npx supabase functions deploy <slug> --use-api --yes`.
   - Push de migraciones: `npx supabase db push --remote --include-all --yes`.

---

## 2. AUDITORÍA TÉCNICA DEL ESTADO ACTUAL (VERIFICADO EN CÓDIGO)

### 2.1. Lo que ya está construido y operando (Sprints 1–3)
* **Frontend & PWA v6 (`Vercel`):** Desplegado en `https://app.mejoraok.com` con headers CSP/HSTS (`vercel.json`), Service Worker `"mejoraapp-v6"` (`public/sw.js`), página offline en 80/10/5/5 con puente de emergencia WhatsApp (`public/offline.html`) y shortcuts PWA en `public/manifest.json` (`/?tab=diagnostico`, `/?tab=mentor`, `/?tab=emergencia`).
* **Módulos Funcionales:** *Splash* (`Splash.tsx`), *Onboarding* (`Onboarding.tsx`), *Home* (`HomeDashboard.tsx`), *Mirror Estratégico 4D* (`DiagnosticTest.tsx`, `DiagnosticResultView.tsx`), *Business Mirror Gamer* (`MirrorPage.tsx` con `businessMirrorTests.ts` libre de mojibake), *Muro Anónimo N1* (`Muro.tsx`), *Mentor IA SSE* (`Mentor.tsx`, `useMentor.ts`), *Círculo Dorado N2* (`CirculoDorado.tsx`), *Botón de Emergencia* (`Emergencia.tsx`), *Red / Comunidad* (`RedTab.tsx`, `Comunidad.tsx`), *Contenido*, *Eventos* y *Admin* (`Admin.tsx`).
* **Base de Datos & Seguridad (`pwiduojwgkaoxxuautkp`):** 27 migraciones SQL aplicadas en remoto, RLS activo y trigger anti-escalación `prevent_client_tier_escalation()` en `public.profiles` (`20260615000000_sprint3_rls_hardening.sql`).
* **Edge Functions Desplegadas (14/14 activas):** `moderate-post`, `moderate-comment`, `generate-content`, `verify-admin`, `admin-action`, `sync-tiendup`, `activate-membership-manual`, `mentor-chat-stream`, `mentor-chat`, `send-diagnostic-email`, `send-onboarding-email`, `tiendup-webhook`, `tiendup-checkout` y `send-push-notification` (corregida a `npm:web-push@3.6.7`).
* **Calidad Local Actual:** `tsc --noEmit` (0 errores), `npm run lint` (0 errores), `npm test` (16 suites / 288 tests pasando), `npm run build` (exitoso).

### 2.2. Brechas Críticas y Deuda Técnica Real Detectada (Bloqueantes para Producción Total)

| # | Severidad | Hallazgo Real Verificado en Código | Archivos Afectados |
| :-: | :---: | :--- | :--- |
| **B1** | 🚨 **CRÍTICO** | **Modelo Gemini Apagado (`gemini-2.0-flash`):** Las 5 Edge Functions de IA llaman a `gemini-2.0-flash`, modelo dado de baja el **1 de junio de 2026** (devuelve 404). Además falta `GEMINI_API_KEY` / `GROQ_API_KEY` en secrets remotos. | `supabase/functions/mentor-chat-stream/index.ts:151`<br>`supabase/functions/mentor-chat/index.ts:38`<br>`supabase/functions/moderate-post/index.ts:40`<br>`supabase/functions/moderate-comment/index.ts:22`<br>`supabase/functions/generate-content/index.ts:33` |
| **B2** | 🚨 **CRÍTICO** | **Gateway `verify_jwt: true` bloquea Webhooks y Triggers:** `supabase/config.toml` solo declara `project_id`. En remoto, `tiendup-webhook`, `send-diagnostic-email`, `send-onboarding-email` y `send-push-notification` tienen `verify_jwt: true`, rechazando llamadas sin JWT de usuario antes de llegar a la función. | `supabase/config.toml`<br>`supabase/functions/tiendup-webhook/index.ts` |
| **B3** | 🚨 **CRÍTICO** | **Tabla `public.mentor_config` inexistente en DB:** `mentor-chat` y `mentor-chat-stream` consultan `mentor_config` (`enabled`, `system_prompt`), pero la tabla no existe en migraciones (`PGRST205`). Tampoco hay UI en `AdminIA.tsx` para editar el prompt o encender/apagar el Mentor. | `supabase/functions/mentor-chat-stream/index.ts:352,477`<br>`supabase/functions/mentor-chat/index.ts:247,303`<br>`src/components/admin/AdminIA.tsx` |
| **B4** | 🚨 **CRÍTICO** | **Checkout Tiendup desconectado y API Key expuesta en Cliente:**<br>1. `UpgradeModal.tsx:30` depende solo de `VITE_TIENDUP_N1_URL` / `N2_URL` (no llama a `openCheckout` ni hace fallback a WhatsApp si falta URL).<br>2. `MiPerfil.tsx:313` abre `https://wa.me/?text=...` sin `WA_NUMBER`.<br>3. `src/services/contactosService.ts:14-17` embebe una API key literal (`'a87936c0...'`) en el bundle JS público. | `src/components/UpgradeModal.tsx`<br>`src/components/tabs/MiPerfil.tsx:303-314`<br>`src/services/contactosService.ts:14-17`<br>`.env.example` |
| **B5** | ⚠️ **ALTO** | **Despacho Multicanal Incompleto en Emergencia y Modelo Plano en Alianzas N2:**<br>1. `Emergencia.tsx` inserta en `emergencies` y abre `wa.me`, pero no dispara correo de alerta vía `RESEND_API_KEY` ni push al equipo de guardia (`tickets_emergencia` / despacho server-side).<br>2. `CirculoDorado.tsx` sobreescribe `profiles.ofrece`/`busca` (1 sola propuesta por miembro), sin tabla dedicada `alliances` / `alliance_interests`. | `src/components/tabs/Emergencia.tsx:155-171`<br>`src/components/tabs/CirculoDorado.tsx:236-243` |
| **B6** | ⚠️ **ALTO** | **Bundle Inicial > 100 kB, Duplicidad de Módulos y Contexto IA Incompleto:**<br>1. `Index.tsx` importa estáticamente 13 tabs (`Index-*.js` = **311.72 kB** + `index-*.js` = **184.58 kB**).<br>2. Coexisten módulos legacy y v2: `AccessGate` vs `ContentGate`, `UpgradePrompt` vs `UpgradeModal`, `useAccessLevel` vs `useMembership`, `Comunidad` vs `RedTab`.<br>3. `mentor-chat-stream` inyecta `diagnostic_results` pero ignora `business_mirror_results` (tests Gamer) y no tiene UI Generativa. | `src/pages/Index.tsx:6-19`<br>`src/components/AccessGate.tsx`<br>`src/components/UpgradePrompt.tsx`<br>`src/hooks/useAccessLevel.ts` |
| **B7** | ⚠️ **MEDIO** | **CI/CD ausente y E2E/Majors pendientes:** El directorio `.github/workflows/` fue eliminado en un refactor previo (`ea7f883`), aunque `ARCHITECTURE.md` y `REPORTE_AUDITORIA.md` lo referencian. Faltan navegadores Playwright locales/CI, `supabase gen types` actualizado y evaluación de upgrades (`react` 19, `vite` 6+, `tailwindcss` 4, `zod` 4) / 7 vulnerabilidades de `npm audit`. | `.github/workflows/` (ausente)<br>`src/integrations/supabase/types.ts`<br>`package.json` |

---

## 3. ACTUALIZACIÓN A TENDENCIAS TECNOLÓGICAS Y DE PRODUCTO (2026–2027)

Para que MejoraApp opere con estándar competitivo **2026–2027** manteniendo la filosofía **K.I.S.S.** (máximo impacto sin inflar complejidad), todas las decisiones de Sprint 4 y Sprint 5 adoptan estas cinco líneas:

| Tendencia 2026–2027 | Aplicación Práctica en MejoraApp | Beneficio Directo al Negocio |
| :--- | :--- | :--- |
| **1. Modelos Gemini 3.8 Flash con `thinkingLevel` Adaptativo** | Migrar de `gemini-2.0-flash` a `gemini-3.8-flash` (`thinkingLevel: "HIGH"` en estrategia/precios/socios en Mentor; `"MEDIUM"` por defecto) y `gemini-3.5-flash-lite` en moderación rápida (`moderate-post`, `moderate-comment`). Incluir helper compartido `_shared/ai.ts` para no duplicar lógica entre 5 funciones. | Respuestas estratégicas con profundidad real de consultor senior, latencia sub-segundo en moderación y resiliencia multi-proveedor (`Gemini ➔ Groq ➔ OpenRouter`). |
| **2. Generative UI (GenUI) & Agentic UX en el Mentor IA** | Evolucionar el stream SSE (`mentor-chat-stream`) para soportar eventos JSON estructurados opcionales (`data: {"widget": ...}`) que rendericen componentes interactivos en `80/10/5/5` dentro de `MentorMessage.tsx`: **Calculadora de Impacto de Descuentos**, **Guion WhatsApp 1-Click** y **Checklist Táctico 72hs**. Agregar botones contextuales *"Analizar con el Mentor"* desde `DiagnosticResultView` y `Muro`. | Pasa de "chat de texto genérico" a herramienta operativa viva que el dueño usa mientras negocia o delega. |
| **3. PWA Native-Like Fluidity (`View Transitions API`, INP `< 100ms`, Bundle `< 100 kB` & Offline Sync Queue)** | Lazy-load estricto de todas las tabs en `Index.tsx`; envolver transiciones de tab en `document.startViewTransition()` respetando `prefers-reduced-motion`; cola local de resiliencia (*Outbox*) para que diagnósticos y borradores no se pierdan en rutas con conectividad inestable (3G/interior del país). | Velocidad instantánea en móviles gama media en Argentina y sensación de app nativa instalada. |
| **4. Autenticación Biométrica Zero-Friction (Passkeys / OTP)** | Sumar flujo de inicio rápido con **Magic Link / Código OTP 6 dígitos** y soporte de **Passkeys (WebAuthn)** cuando esté habilitado en Supabase Auth, priorizando acceso en 1 toque sobre contraseñas olvidadas. | Reduce drásticamente la tasa de abandono al volver desde notificaciones Push o shortcuts PWA. |
| **5. Zero-Trust Frontend & B2B Matchmaking Semántico** | Eliminar API keys de cliente (`contactosService.ts` ➔ Edge Function `sync-contactos`); configurar `verify_jwt = false` solo donde corresponde en `supabase/config.toml`; tabla dedicada `alliances` en Círculo Dorado `N2` con sugerencia semántica `ofrece ↔ busca` asistida por IA y despacho multicanal real en `Emergencia` (WhatsApp + Resend email de alta prioridad + Push admin). | Seguridad auditable sin secretos en el navegador, conversión de pagos sin fricción y ROI tangible para miembros VIP N2. |

---

## 4. PLAN MAESTRO DE EJECUCIÓN AUTÓNOMA (SPRINTS 4 Y 5)

El agente ejecutor (`Gemini 3.8` esfuerzo `HIGH`) debe trabajar en orden secuencial estricto por fases, validando los criterios de aceptación antes de avanzar a la siguiente fase.

---

### SPRINT 4 — ESTABILIZACIÓN CRÍTICA DE PRODUCCIÓN, IA GEMINI 3.8, SEGURIDAD Y PAGOS

> **Meta del Sprint:** Resolver todos los bloqueantes `B1`–`B5` para que IA, Webhooks Tiendup, Emergencia multicanal y Contacto CRM operen en producción con seguridad real.

#### Fase 4.1 — Capa Compartida de IA Gemini 3.8 + Tabla `mentor_config`
1. **Crear helper unificado `supabase/functions/_shared/ai.ts`:**
   - Centralizar llamadas a proveedores en cadena:
     - **Razonamiento estratégico (`mentor-chat-stream`, `mentor-chat`, `generate-content`):** Modelo principal `gemini-3.8-flash` (`v1beta/models/gemini-3.8-flash:streamGenerateContent?alt=sse` y `:generateContent`), header `x-goog-api-key`, `generationConfig: { temperature, maxOutputTokens, thinkingConfig: { thinkingLevel: "HIGH" | "MEDIUM" } }`. *Nota técnica crítica: NO enviar `thinkingLevel: "MINIMAL"` en `gemini-3.8-flash` (solo acepta `"LOW"`, `"MEDIUM"`, `"HIGH"`).*
     - **Clasificación / Moderación rápida (`moderate-post`, `moderate-comment`):** Modelo rápido `gemini-3.5-flash-lite` (o `gemini-3.8-flash` con `thinkingLevel: "LOW"`), con fallback automático a Groq (`llama-3.3-70b-versatile`) y OpenRouter.
   - Soportar orden configurable mediante variable de entorno opcional `AI_PRIMARY_PROVIDER` (`gemini` por defecto).
2. **Refactorizar las 5 Edge Functions de IA** (`mentor-chat-stream`, `mentor-chat`, `moderate-post`, `moderate-comment`, `generate-content`) para usar `_shared/ai.ts` y eliminar las URLs obsoletas `gemini-2.0-flash`.
3. **Enriquecer contexto del Mentor IA (`mentor-chat-stream` & `mentor-chat`):**
   - Leer además los últimos 3 registros de `business_mirror_results` (con título de `business_mirror_tests`) junto a `diagnostic_results` y `profiles` para inyectar el perfil gamer completo en `{user_context}`.
4. **Crear migración SQL `supabase/migrations/20261116000000_sprint4_mentor_config_and_alliances.sql`:**
   - Crear tabla `public.mentor_config` (`key TEXT PRIMARY KEY`, `value TEXT NOT NULL`, `description TEXT`, `updated_at TIMESTAMPTZ DEFAULT now()`, `updated_by UUID`).
   - Habilitar RLS: lectura para `service_role` / `admin`; escritura exclusiva para `public.is_admin(auth.uid())`.
   - Seed idempotente (`ON CONFLICT (key) DO NOTHING`) para `enabled = 'true'`, `thinking_level = 'HIGH'`, `system_prompt` (alineado con Criterio Medular).
   - Conectar `src/components/admin/AdminIA.tsx` para permitir probar IA, activar/desactivar el Mentor y editar el `system_prompt` y `thinking_level` (`LOW` / `MEDIUM` / `HIGH`) desde el panel Admin.

#### Fase 4.2 — Configuración Gateway `supabase/config.toml` & Proxy Seguro de Contactos
1. **Actualizar `supabase/config.toml`:**
   - Configurar explícitamente las políticas de verificación JWT del Gateway para que funciones con firma HMAC o triggers de sistema no devuelvan HTTP 401:
     ```toml
     project_id = "pwiduojwgkaoxxuautkp"

     [functions.tiendup-webhook]
     verify_jwt = false

     [functions.send-diagnostic-email]
     verify_jwt = false

     [functions.send-onboarding-email]
     verify_jwt = false

     [functions.send-push-notification]
     verify_jwt = false
     ```
   - Verificar que `tiendup-webhook` mantiene validación HMAC-SHA256 estricta (*fail-closed* si falta `TIENDUP_WEBHOOK_SECRET`), y que `send-diagnostic-email`, `send-onboarding-email` y `send-push-notification` validen un secreto compartido `INTERNAL_SERVICE_SECRET` o token `service_role` cuando corresponda o mantengan rate-limiting + validación estricta de origen/payload (revisar `send-push-notification` para que solo pueda ser invocada por usuarios autenticados o service role y NO anónimamente sin verificación!).
2. **Eliminar API Key del Bundle Cliente (`B4.3`):**
   - Crear Edge Function `supabase/functions/sync-contactos/index.ts` (autenticada o protegida por JWT de usuario / origin check + Zod schema) que lea `CONTACTOS_API_URL` y `CONTACTOS_API_KEY` exclusivamente desde `Deno.env.get(...)`.
   - Actualizar `src/services/contactosService.ts` para invocar `supabase.functions.invoke("sync-contactos", { body })` manteniendo intacto el comportamiento *Fail-Soft* (`sincronizarUsuarioBestEffort`) y eliminando el string literal `'a87936c05a3b39471007488850ec9ee568ded426f245e7c87f4d63a74483917b'` del código fuente cliente.
   - Actualizar `src/services/__tests__/contactosService.test.ts` acorde al nuevo transporte manteniendo cobertura del 100%.

#### Fase 4.3 — Unificación de Flujo de Pagos Tiendup (`UpgradeModal`, `MiPerfil`, `.env.example`)
1. **Reparar `src/components/UpgradeModal.tsx`:**
   - Implementar la misma cadena resiliente de 3 pasos para el botón `"Activar membresía ahora →"`:
     1. Si existe `VITE_TIENDUP_N1_URL` / `VITE_TIENDUP_N2_URL`, abrir checkout directo.
     2. Si existe `VITE_TIENDUP_PRODUCT_N1` / `VITE_TIENDUP_PRODUCT_N2`, invocar `openCheckout(productId)` (Edge Function `tiendup-checkout`) mostrando spinner.
     3. Fallback garantizado: abrir WhatsApp institucional (`WA_NUMBER`) con mensaje prellenado solicitando alta en `N1` o `N2`, más toast explicativo. **Nunca dejar un botón mudo sin acción.**
2. **Reparar `src/components/tabs/MiPerfil.tsx`:**
   - Usar `WA_NUMBER` en el fallback WhatsApp (línea 313), usar `VITE_TIENDUP_N1_URL` si existe antes de `openCheckout`, e integrar el componente unificado `UpgradeModal` en lugar de duplicar UI.
3. **Documentar variables completas en `.env.example` y `.env.staging.example`:**
   - Añadir `VITE_TIENDUP_N1_URL`, `VITE_TIENDUP_N2_URL`, `VITE_TIENDUP_PRODUCT_N1`, `VITE_TIENDUP_PRODUCT_N2` y quitar `VITE_CONTACTOS_API_KEY` del frontend.

#### Fase 4.4 — Despacho Multicanal Real de Emergencia (`< 60 min SLA`)
1. **Crear Edge Function `supabase/functions/dispatch-emergency/index.ts` (`verify_jwt = true`):**
   - Valida JWT de usuario y schema Zod (`crisisType`, `message`, `contactPhone`).
   - Verifica en servidor el nivel de acceso del usuario (`profiles.access_level`) y el límite semanal de `N1` (3/semana) / ilimitado `N2` para impedir bypass client-side.
   - Inserta el registro en `public.emergencies` (con `status`, `crisis_type`, `contact_phone`).
   - Despacha correo de alta prioridad vía **Resend (`RESEND_API_KEY`)** a la casilla de guardia (`EMERGENCY_ALERT_EMAIL` o fallback institucional) con datos del usuario, empresa, último perfil Mirror y teléfono directo.
   - Dispara Push Notification a los usuarios `ADMIN` suscritos en `push_subscriptions`.
   - Devuelve `{ ticketId, emailDispatched, pushDispatched, whatsappUrl }`.
2. **Conectar `src/components/tabs/Emergencia.tsx`:**
   - Reemplazar el `insert` directo por invocación a `dispatch-emergency` (con fallback local a `wa.me` si fallara la red, aplicando *Fail-Soft*).
   - Mostrar badge real de canal despachado (`Email Guardia + WhatsApp`).

#### Fase 4.5 — Base de Datos B2B Real para Círculo Dorado (`alliances` + `alliance_interests`)
1. **Ampliar migración `20261116000000_sprint4_mentor_config_and_alliances.sql`:**
   - Crear tabla `public.alliances` (`id`, `user_id`, `axis` IN (`'Distribución'`, `'Capacidad Instalada'`, `'Inversión Conjunta'`, `'Proveedores B2B'`), `title`, `ofrece`, `busca`, `region`, `status` IN (`'active'`, `'paused'`, `'closed'`), `created_at`, `updated_at`).
   - Crear tabla `public.alliance_interests` (`id`, `alliance_id`, `requester_user_id`, `note`, `status` IN (`'pending'`, `'accepted'`, `'declined'`), `created_at`) con `UNIQUE(alliance_id, requester_user_id)`.
   - RLS multi-tenant: solo miembros `N2` o `ADMIN` activos (`membership_expires_at` vigente) leen y publican en `alliances`; cada usuario gestiona únicamente sus propias oportunidades e intereses.
2. **Crear `src/services/alliances.service.ts` y conectar `CirculoDorado.tsx`:**
   - Permitir publicar múltiples oportunidades B2B independientes sin sobreescribir el perfil del usuario.
   - Mantener compatibilidad visual mostrando también perfiles `N2` visibles en red.
   - Añadir botón **"Solicitar Conexión Bilateral"** que registre la intención en `alliance_interests` + abra canal mediado WhatsApp/notificación.

#### Fase 4.6 — Sincronización de Tipos Supabase & Cierre Sprint 4
1. Ejecutar `npx supabase gen types typescript --linked > src/integrations/supabase/types.ts` (o actualizar tipos tras pushear migraciones).
2. Desplegar Edge Functions modificadas con `npx supabase functions deploy --use-api --yes`.
3. Ejecutar batería completa de verificación (`tsc`, `lint`, `test`, `build`).

---

### SPRINT 5 — MODERNIZACIÓN UX/PRODUCTO 2026–2027, GENERATIVE UI, PERFORMANCE `< 100 kB` Y CI/CD

> **Meta del Sprint:** Llevar MejoraApp a experiencia nativa 2026–2027 (GenUI en Mentor, View Transitions, bundle inicial `< 100 kB`, consolidación de deuda técnica, CI/CD + Lighthouse automatizado).

#### Fase 5.1 — Performance `< 100 kB` (Low-Data UX) & Consolidación de Código Duplicado
1. **Lazy-Loading Total de Tabs en `src/pages/Index.tsx`:**
   - Convertir los 13 imports estáticos de tabs en `React.lazy(() => import(...))` envueltos en `<Suspense fallback={<PageLoadingSkeleton />}>`.
   - Separar chunks pesados (`recharts`, `jspdf`, `lucide-react` / `framer` si aplica) en `vite.config.ts` para asegurar que el bundle crítico inicial de boot sea **< 100 kB gzip**.
2. **Consolidar Componentes Duplicados:**
   - Deprecar/eliminar `AccessGate.tsx` y `UpgradePrompt.tsx` migrando `Eventos.tsx` (y cualquier otro consumidor) hacia `ContentGate.tsx` y `UpgradeModal.tsx` (que ya cumplen `80/10/5/5` y *Criterio Medular*).
   - Unificar `useAccessLevel` sobre `useMembership` (manteniendo un único contrato tipado `AccessLevel` / `MembershipLevel` con verificación consistente de `membership_expires_at`).
   - Revisar `Comunidad.tsx` vs `RedTab.tsx`: unificar la experiencia en la tab `Red` sin pantallas huérfanas duplicadas.

#### Fase 5.2 — Generative UI (GenUI) & Deep Context en Mentor IA
1. **Protocolo de Widgets Estructurados en `mentor-chat-stream`:**
   - Permitir que el system prompt instruya a `gemini-3.8-flash` a emitir opcionalmente un bloque estructurado delimitado (ej. `<<<WIDGET_JSON ... WIDGET_JSON>>>`) al final de la respuesta cuando detecte intención cuantitativa o táctica:
     - `discount_calculator`: calculadora interactiva de impacto en margen/volumen por porcentaje de descuento (con sliders en vivo).
     - `whatsapp_script`: guion táctico editable con botones **"Copiar texto"** y **"Abrir WhatsApp"**.
     - `action_checklist`: plan de 3 pasos accionables en 72 horas con checkboxes persistidos en localStorage/DB.
   - Parsear el bloque en `useMentor.ts` y renderizar tarjetas `GenUIWidget.tsx` limpias bajo `80/10/5/5` dentro de `MentorMessage.tsx`.
2. **Acciones Agénticas Cross-Módulo (Context Deep-Linking):**
   - En `DiagnosticResultView.tsx`: botón **"Trabajar mi dimensión más débil con el Mentor IA →"** que abre la tab `mentor` con un prompt pre-cargado de alta precisión.
   - En `PostCard.tsx` (`Muro.tsx`): acción opcional **"Pedir perspectiva metodológica al Mentor"** sobre un dilema anónimo.
   - En `MentorMessage.tsx`: feedback rápido `👍 Útil / 👎 Mejorar` guardado en `mentor_messages` para medir calidad real.

#### Fase 5.3 — Native-Like PWA Fluidity (View Transitions, Offline Outbox & Auth Sin Fricción)
1. **View Transitions API (`src/pages/Index.tsx` y CSS):**
   - Envolver `setActiveTab(tab)` en un helper `runViewTransition(() => setActiveTab(tab))` que use `document.startViewTransition` si está soportado y respete `@media (prefers-reduced-motion: reduce)`.
2. **Cola Offline de Resiliencia (`src/lib/offlineQueue.ts` + `public/sw.js` v7):**
   - Si el usuario completa un diagnóstico (`diagnostic_results`) o redacta una respuesta sin conexión, persistir en outbox y sincronizar automáticamente al dispararse el evento `window.addEventListener('online', ...)`, notificando con toast no intrusivo.
3. **Auth Biométrica / Zero-Friction (`src/pages/Auth.tsx`, `LoginForm.tsx`):**
   - Añadir botón prominente **"Ingresar sin contraseña (Magic Link / Código por Email)"** (`supabase.auth.signInWithOtp`) junto a Google OAuth.
   - Preparar soporte progresivo de **Passkeys / WebAuthn** compatible con Supabase Auth para dispositivos móviles instalados como PWA.

#### Fase 5.4 — Home Ejecutivo Inteligente, Peer Polls en el Muro & Matchmaking N2
1. **HomeDashboard con Estado Vivo:**
   - Mostrar el último arquetipo y score 4D del usuario directamente en la tarjeta Hero del Home (si ya completó el Mirror) con indicador de la dimensión prioritaria de la semana.
   - Para miembros `N2`, mostrar acceso rápido al widget rojo `#E1061E` de Emergencia y resumen de actividad reciente en Mesa de Alianzas.
2. **Encuestas Tácticas en el Muro (`wall_posts`):**
   - Agregar soporte ligero de votación entre pares (2–3 opciones, ej. *"¿Trasladan costos a lista o renegocian plazos?"*) como sugería el wireframe maestro de `PROPUESTA_MAESTRA`.
3. **B2B Matchmaker en `CirculoDorado.tsx`:**
   - Botón **"Sugerir alianzas compatibles con IA"** que llama a una Edge Function ligera usando `gemini-3.8-flash` para cruzar `ofrece` y `busca` de `alliances` vigentes y devolver Top 3 matches explicando el encaje comercial.

#### Fase 5.5 — Restauración de CI/CD, E2E Real, Lighthouse & Auditoría Final
1. **Restaurar `.github/workflows/ci.yml` y `lighthouse.yml`:**
   - Pipeline en PR/Push a `main`: `npm ci` ➔ `npx tsc --noEmit` ➔ `npm run lint` ➔ `npm test` ➔ `npx playwright install --with-deps chromium` ➔ `npm run test:e2e` (sin `continue-on-error`) ➔ `npm run build` ➔ verificación de presupuesto de bundle (`< 100 kB` chunk inicial crítico, `< 3 MB` total) ➔ Lighthouse CI (`accessibility >= 0.90`, `performance >= 0.90`).
2. **Limpiar inconsistencias de Seguridad, Docs y Dependencias:**
   - Unificar CSP (`index.html` vs `vercel.json`) y validar que no haya secretos ni llaves en cliente.
   - Corregir `docs/INSTRUCTIVO_DESPLIEGUE.md` (documenta `SENTRY_DSN` / `POSTHOG_KEY` cuando Vite requiere `VITE_SENTRY_DSN` / `VITE_POSTHOG_KEY`) y sincronizar atribución UTM/AEO entre `landing/index.html` (`mejoraok.com`) y `index.html` (`app.mejoraok.com`).
   - Configurar umbrales mínimos de cobertura en `vitest.config.ts` y optimizar assets estáticos a WebP (ej. `src/assets/logo-comunidad.png`).
   - Evaluar y ejecutar actualizaciones seguras dentro del rango semver (y planificar upgrade controlado de `vite`, `vitest`, `react-router-dom` si resuelve las 7 vulnerabilidades de `npm audit` sin regresiones).
   - Actualizar `ARCHITECTURE.md`, `CHANGELOG.md` (v2.1.0 / v3.0.0) y `REPORTE_AUDITORIA.md`.

---

## 5. CHECKLIST DE PRODUCCIÓN FINAL (GO-LIVE CONFIABLE)

Antes de declarar el proyecto **100% terminado en producción**, verificar punto por punto:

### A. Secrets en Supabase (`pwiduojwgkaoxxuautkp`)
Verificar con `npx supabase secrets list`:
- [ ] `GEMINI_API_KEY` (activa, probada contra `gemini-3.8-flash` y `gemini-3.5-flash-lite`)
- [ ] `GROQ_API_KEY` (opcional recomendado, fallback ultrarrápido `llama-3.3-70b-versatile`)
- [ ] `RESEND_API_KEY` (ya configurada; verificar dominio remitente en Resend para `hola@mejoraok.com`)
- [ ] `EMERGENCY_ALERT_EMAIL` (casilla receptora de alertas de guardia `< 60 min SLA`)
- [ ] `CONTACTOS_API_URL` & `CONTACTOS_API_KEY` (movidos desde frontend a Edge Function `sync-contactos`)
- [ ] `TIENDUP_API_KEY`, `TIENDUP_WEBHOOK_SECRET`, `TIENDUP_PRODUCT_N1_ID`, `TIENDUP_PRODUCT_N2_ID`
- [ ] `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (ya configuradas)

### B. Variables en Vercel (`app.mejoraok.com`)
- [ ] `VITE_SUPABASE_URL` & `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_VAPID_PUBLIC_KEY`
- [ ] `VITE_TIENDUP_N1_URL`, `VITE_TIENDUP_N2_URL`, `VITE_TIENDUP_PRODUCT_N1`, `VITE_TIENDUP_PRODUCT_N2`
- [ ] `VITE_POSTHOG_KEY` & `VITE_POSTHOG_HOST` (funnel `N0 ➔ Mirror ➔ N1 ➔ N2`)
- [ ] `VITE_SENTRY_DSN` (monitoreo de errores en producción)
- [ ] `VITE_ENVIRONMENT=production`

### C. Gates de Validación Automatizados (Todos en Verde)
Ejecutar en PowerShell al cerrar cada Sprint:
```powershell
npx tsc --noEmit
if ($LASTEXITCODE -eq 0) { npm run lint }
if ($LASTEXITCODE -eq 0) { npm test }
if ($LASTEXITCODE -eq 0) { npm run build }
if ($LASTEXITCODE -eq 0) { npx playwright test }
```
Y verificar despliegue remoto:
```powershell
npx supabase migration list --remote
npx supabase functions list
```

### D. Pruebas End-to-End en Vivo (`https://app.mejoraok.com`)
- [ ] Registro/Ingreso (Google + OTP/Password) ➔ Splash ➔ Onboarding Mirror ➔ HomeDashboard.
- [ ] Consulta al Mentor IA ➔ streaming real con `gemini-3.8-flash`, lectura de contexto 4D y render de widget GenUI.
- [ ] Publicación en el Muro Anónimo ➔ moderación real IA bajo Criterio Medular ➔ aparición de alias corporativo protegido y comentario en Realtime.
- [ ] Simulación/Prueba de Webhook Tiendup (`tiendup-webhook`) con firma HMAC válida ➔ promoción automática `N0 ➔ N1/N2` sin bloqueo JWT `401`.
- [ ] Activación del Botón de Emergencia (`N2`) ➔ ticket en `emergencies`, correo Resend recibido y canal WhatsApp operativo.
- [ ] Publicación e interés en Mesa de Alianzas B2B (`N2` / `alliances`).
- [ ] Lighthouse mobile score $\ge 90$ en Performance, Accesibilidad, Best Practices y SEO, más modo offline PWA funcionando.

---

## 6. PROMPT DE ARRANQUE PARA CONTINUAR CON GEMINI 3.8 (HIGH EFFORT)

> *Copiá o referenciá este bloque al iniciar la próxima sesión autónoma:*  
> **"Leé `docs/RUNBOOK_EJECUCION_2026_2027.md` y ejecutá de forma autónoma el Sprint 4 completo (Fases 4.1 a 4.6) primero, validando cada gate técnico (`tsc`, `lint`, `test`, `build`, migraciones y Edge Functions en Supabase). Luego continuá con el Sprint 5 (Fases 5.1 a 5.5). Trabajá respetando estrictamente el Criterio Medular, la paleta 80/10/5/5 y las reglas de PowerShell."**
