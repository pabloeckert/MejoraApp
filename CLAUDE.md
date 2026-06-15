# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

PWA para líderes empresariales argentinos. Stack: React 18 + TypeScript + Vite + Supabase + Tailwind CSS. Versión: **v1.1.0** (2026-05-20).

---

## Comandos frecuentes

```bash
npm run dev             # Dev server → http://localhost:8080
npm run build           # Build de producción → dist/
npm run lint            # ESLint (debe terminar con 0 warnings)
npm run test            # Vitest una sola pasada
npm run test:coverage   # Vitest con reporte de cobertura
npm run test:e2e        # Playwright headless
npx tsc --noEmit        # Type-check sin build
npx vitest run src/test/nombre.test.ts  # Un solo test
npx vercel --prod --yes # Deploy a producción (si CI falla)
```

---

## Arquitectura

```
Pages (7, lazy-loaded)
  └─ Components (~100, por dominio: admin/ auth/ diagnostic/ home/ mentor/ mirror/ muro/ community/ tabs/ ui/)
       └─ Hooks (~17 custom, wrappean servicios con React Query)
            └─ Services (5 módulos: wall / content / diagnostic / business-mirror / tiendup + Repository layer)
                 └─ Supabase (Auth, DB, Realtime, Edge Functions)
```

> `src/services/index.ts` solo barrel-exporta `wallService`, `contentService`, `diagnosticService`. Los servicios `business-mirror.service.ts` y `tiendup.service.ts` se importan directamente desde su archivo.

**Repository layer:** `src/repositories/index.ts` — exports: `wallRepo`, `contentRepo`, `profileRepo`, `diagnosticRepo`, `novedadesRepo`. Abstracción pura sobre Supabase; la lógica de negocio va en `services/`.

**Entry points:**
- `src/main.tsx` — Sentry, PostHog, Service Worker
- `src/App.tsx` — rutas con lazy-loading y `RouteErrorBoundary` por ruta
- `src/components/Providers.tsx` — 6 providers en orden: HelmetProvider → QueryClient → Theme → I18n → Tooltip → Auth

**Páginas:** `/` (Index), `/splash`, `/auth`, `/reset-password`, `/admin`, `/onboarding`, `*` (NotFound).

**`Index.tsx` es la SPA principal** — renderiza tabs por `activeTab` state. Tabs disponibles (no todos en nav): `home`, `contenido`, `diagnostico`, `mirror`, `emergencia`, `eventos`, `circulo`, `red`, `muro`, `comunidad`, `mentor`, `novedades`, `perfil`. Cada tab está envuelta en `<FeatureBoundary feature="...">` para error isolation por tab.

> **Dos features de "mirror" distintas:** `diagnostico` renderiza `<DiagnosticTest>` (Mirror Estratégico — 8 preguntas, el CTA primario), mientras que `mirror` renderiza `<MirrorPage>` (Business Mirror Gamer — tests gamificados). Son completamente separadas.

**Tab inicial:** primera visita del session → `"home"`. Visitas siguientes (via `sessionStorage mc-visits`) → `"red"`. Si viene con `location.state.initialTab`, ese valor tiene prioridad.

**Navegación entre tabs desde código:** `window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "tabId" }))` — escuchado en `Index.tsx`.

**Estado:**
- Server state → React Query (`staleTime: 2min`, `retry: 1`)
- Client state → Contexts (`AuthContext`, `ThemeContext`, `I18nContext`)
- Local state → localStorage

---

## Control de acceso — dos capas independientes

### Capa 1: Nivel de membresía (N0/N1/N2/ADMIN)

El perfil del usuario en Supabase tiene un campo `access_level` con el enum `AccessLevel`:

| Nivel | Descripción |
|-------|-------------|
| `N0`  | Free — usuario registrado sin membresía paga |
| `N1`  | Miembro — ARS 50.000/mes o USD 20/mes |
| `N2`  | Círculo Dorado — ARS 150.000/mes o USD 100/mes |
| `ADMIN` | Administrador — acceso total |

**Hook:** `useAccessLevel(userId)` → `{ level, hasAccess(required), isAdmin, isExpired }` — cachea 5 min.

> **`access_level` vs `membership_level`:** son dos columnas distintas en `profiles`. `access_level` (mayúsculas: `N0/N1/N2/ADMIN`) es la fuente de verdad para RLS y toda la lógica de acceso — es lo que leen `useAccessLevel` y `useMembership`. `membership_level` (minúsculas) es la columna que escribe la Edge Function `sync-tiendup` al sincronizar suscripciones de Tiendup; no se usa para control de acceso directo. No confundirlas.

**Componente:** `<AccessGate required="N1">` — muestra `UpgradePrompt` si el nivel es insuficiente. Acepta `blur` para difuminar el contenido en vez de ocultarlo.

### Capa 2: Feature flags (FeatureId)

`src/lib/plans.ts` define qué features están habilitadas según el plan activo.

**Plan actual:** `CURRENT_PLAN_ID = "all_free"` — todas las features habilitadas, sin fricción.

Para cambiar a freemium: editar `CURRENT_PLAN_ID = "freemium"` en `plans.ts`.

**Hook:** `useFeatureAccess(featureId)` → `{ hasAccess, trackBlocked, trackUpgradePromptShown }`.

**Componente:** `<FeatureGate feature="diagnostic_pdf">` — usa `hasFeature()` del plan activo.

**Componente:** `<ContentGate>` — combina ambas capas para proteger contenido premium con lógica de blur/paywall.

> **Regla:** usar `<AccessGate>` para restringir por membresía. Usar `<FeatureGate>` para restringir por feature flag. `<ContentGate>` cuando se necesiten ambas. No mezclar ad-hoc.

---

## Red de líderes y Onboarding obligatorio

### Onboarding guard (`/onboarding`)

Usuarios nuevos con `mirror_completed = false` son redirigidos a `/onboarding` desde `Index.tsx` antes de ver cualquier contenido (excepto ADMIN). El guard vive en `src/pages/Index.tsx`, no en el router.

**Flujo:** Diagnóstico Mirror (8 preguntas) → pantalla `red-step` con textareas ofrece/busca → CTA "Entrar a la Red" → UPDATE profiles (`mirror_completed + ofrece + busca`) → navega a `/` con `state: { initialTab: "red" }`.

Archivo: `src/pages/Onboarding.tsx`. Props relevantes de `DiagnosticTest`: `onProgress?(step, currentIdx, total)` para la barra de progreso dinámica.

Usuarios con `has_completed_diagnostic = true` previo a la migración quedan con `mirror_completed = true` automáticamente (ver migración `20260520000000_profile_red_columns.sql`).

### Tab Red (`src/components/tabs/RedTab.tsx`)

Directorio de líderes. Query: `profiles WHERE visible_en_red = true AND mirror_completed = true`. Filtros client-side por texto, sector y empresa_tamano. Cards muestran nombre, empresa, sector (badge), ofrece/busca truncados. Banner suave si el usuario propio tiene ofrece/busca vacíos.

**BottomNav actual (5 tabs):** `home` (Inicio), `red` (Red, ícono Users), `diagnostico` (Mirror — botón circular central), `mentor` (Mentor IA), `perfil`. El Muro y otros tabs son accesibles via código pero no están en la nav principal.

### Columnas nuevas en `profiles` (migración 20260520)

`mirror_completed boolean DEFAULT false`, `ofrece text`, `busca text`, `sector text`, `empresa_tamano text CHECK IN ('1-10','10-50','50-200','200+')`, `visible_en_red boolean DEFAULT true`.

> Para regenerar tipos tras una nueva migración:
> ```bash
> npx supabase gen types typescript --project-id=pwiduojwgkaoxxuautkp > src/integrations/supabase/types.ts
> ```

### Perfil editable — Modal

`MiPerfil.tsx` usa `Dialog` de shadcn para editar. El form incluye los 4 campos nuevos (sector, empresa_tamano, ofrece, busca) como primera sección "Tu presencia en la Red", seguido de los datos personales existentes.

### Seed de demo

`supabase/seed_red.sql` — 6 perfiles ficticios de founders argentinos con todos los campos completos. Contraseña `Demo1234!`. Idempotente via `ON CONFLICT DO UPDATE`. Correr desde SQL Editor de Supabase Dashboard.

---

## Business Mirror Gamer

Feature de diagnósticos gamificados para líderes. Flujo: `BusinessMirrorHub` → selección de test → `GamePlayer` → `GameResult`.

- **Tests:** definidos en `src/data/businessMirrorTests.ts` (array `ALL_TESTS`, función `calculateProfile`). Cada test tiene `slug`, `game_type`, `min_access_level` y preguntas con pesos.
- **Service:** `src/services/business-mirror.service.ts` — fetch de tests, guardado de resultados, historial por usuario. Usa `mirror_game_tests` y `mirror_game_results` en Supabase.
- **Hook:** `useMirrorResults(userId)` — devuelve historial de resultados con join al test.
- **Acceso:** `min_access_level` por test. `GamePlayer` verifica contra `useAccessLevel` antes de mostrar preguntas.

---

## Modo Mentor IA

El chat con el Mentor IA funciona mediante SSE (Server-Sent Events) contra una Edge Function de Supabase.

**Edge Function:** `supabase/functions/mentor-chat-stream` — recibe `{ message, conversationId }`, devuelve un stream SSE con chunks `{ chunk }`, `{ conversationId }` y `{ done, model }`.

**Hook:** `useMentorChat(options?)` en `src/hooks/useMentor.ts`:
- Añade mensajes optimistas al instante
- Consume el stream con `ReadableStream` / `AbortController`
- Persistencia en tablas `mentor_conversations` y `mentor_messages`

**Hook auxiliar:** `useMentorConversations()` — lista el historial (soft-delete con `is_active: false`).

---

## Sistema de diseño (tokens de marca)

Los colores de marca viven en `src/index.css` como variables CSS. **No usar hex hardcodeados en componentes.**

```css
--brand-azul:    225 31% 44%   /* #495F93 — primary */
--brand-rojo:    2 46% 54%     /* #C64E4A — destructive/accent */
--brand-amarillo:44 74% 60%    /* #E5C34B — accent secundario */
--brand-gris:    0 0% 40%      /* #656565 — muted foreground */
--brand-negro:   0 0% 0%       /* #000000 — foreground */
```

Usarlos en Tailwind como `text-brand-azul`, `bg-brand-rojo`, etc. (definidos en `tailwind.config.ts`).
`src/lib/brand.ts` exporta `brand.*` (valores `hsl(...)`) y `MEMBERSHIP_CONFIG` (labels/precios/beneficios por nivel).

**Tipografía:** Body → `Bw Modelica` (woff2 en `/public/fonts/`). Display/headings → `League Spartan`.

---

## Foco de producto: Mirror Estratégico es el CTA primario

- `HomeDashboard` — hero card azul visible para todos los niveles, lleva a `tab: "diagnostico"`
- `BottomNav` — botón circular central brand-azul para el tab Mirror; indicador rojo si no hay diagnóstico
- Al completar el onboarding (`ProfileCompleteModal.onComplete`) → navega al tab `"diagnostico"`

---

## Variables de entorno

```bash
cp .env.example .env.local
```

Requeridas: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_ENVIRONMENT` (`development` | `staging` | `production`).

Opcionales: `VITE_POSTHOG_KEY` (solo activo en `production`/`staging`), `VITE_SENTRY_DSN`, `VITE_VAPID_PUBLIC_KEY`, `VITE_TIENDUP_N1_URL`, `VITE_TIENDUP_N2_URL`.

---

## Supabase

- Cliente: `src/integrations/supabase/client.ts`
- Tipos auto-generados: `src/integrations/supabase/types.ts` — **no editar a mano**
- Edge Functions: `supabase/functions/` — se despliegan con `deploy-functions.yml`
  - `mentor-chat-stream` (SSE), `mentor-chat`, `generate-content`, `send-diagnostic-email`, `send-onboarding-email`
  - `activate-membership-manual`, `admin-action`, `verify-admin`
  - `tiendup-checkout`, `tiendup-webhook`, `sync-tiendup`
  - `moderate-comment`, `moderate-post`, `send-push-notification`
  - `_shared/` — helpers: `cors.ts`, `log.ts`, `middleware.ts`

Tablas relevantes: `profiles` (access_level, nickname, membership_expires_at, mirror_completed, ofrece, busca, sector, empresa_tamano, visible_en_red), `payments`, `mentor_conversations`, `mentor_messages`, `diagnostic_results`.

---

## Tablas/vistas pendientes de crear

Las siguientes aún no existen en el schema real de Supabase — los hooks devuelven vacío/no-op hasta que se ejecute la migración correspondiente:

- `community_challenges` y `challenge_participants` — usadas por `useChallenges` / `useChallengeParticipation` en `useMembers.ts`
- `community_ranking` (view) — usada por `useRanking`; el hook tiene fallback manual si la vista no existe

---

## Testing

- Unitarios: Vitest + jsdom. Setup en `src/test/setup.ts`. Umbrales: 70% branches, 25% resto.
- E2E: Playwright. Targets: Desktop Chrome + Pixel 5. No en paralelo.

---

## CI/CD y deploy

Deploy: push a `main` → Vercel CI automático → `app.mejoraok.com` (DNS Cloudflare).

El pipeline (`deploy.yml`): tests → build → `npx vercel --prod` → health check en `app.mejoraok.com`. Si CI falla: `npx vercel --prod --yes` desde local.

**Secrets requeridos en GitHub:**

| Secret | Valor |
|--------|-------|
| `VERCEL_TOKEN` | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `team_7IpSKP23kMLFwShzU7WfcsYj` |
| `VERCEL_PROJECT_ID` | `prj_QD34lzAB0hpVuSMBizHJZC87JwaN` |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon key |
| `VITE_SUPABASE_PROJECT_ID` | ID del proyecto |

---

## Convenciones

- Alias `@/` → `src/`. Siempre en imports, nunca rutas relativas largas.
- Validación: **Zod** en todos los formularios (`src/lib/validation.ts`).
- HTML externo: sanitizar con **DOMPurify** (`src/lib/security.ts`).
- Rate limiting: `src/lib/rateLimit.ts`.
- Analytics: `src/lib/analytics.ts` — PostHog solo activo en `production`/`staging`. Usar `trackEvent(name, props?)` para eventos custom; no llamar PostHog directamente en componentes.
- Tipos distribuidos por módulo (no hay `src/types/`): `src/lib/*.ts`, `src/components/*/types.ts`, `src/integrations/supabase/types.ts`.
- Pre-commit: Husky + lint-staged (ESLint en `.ts/.tsx`, Prettier en `.json/.md/.css/.html`).
- **Cero** `@ts-ignore` nuevos. **Cero** `console.error` silenciados.
