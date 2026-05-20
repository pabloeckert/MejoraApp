# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

PWA para líderes empresariales argentinos. Stack: React 18 + TypeScript + Vite + Supabase + Tailwind CSS. Versión: **v1.0.0** (2026-05-19).

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
Pages (6, lazy-loaded)
  └─ Components (~100, por dominio: admin/ auth/ diagnostic/ home/ mentor/ mirror/ muro/ community/ tabs/ ui/)
       └─ Hooks (17 custom, wrappean servicios con React Query)
            └─ Services (5 módulos: wall / content / diagnostic / business-mirror / tiendup)
                 └─ Supabase (Auth, DB, Realtime, Edge Functions)
```

**Entry points:**
- `src/main.tsx` — Sentry, PostHog, Service Worker
- `src/App.tsx` — rutas con lazy-loading y `RouteErrorBoundary` por ruta
- `src/components/Providers.tsx` — 7+ providers (Auth, Query, Theme, I18n, etc.)

**Páginas:** `/` (Index), `/splash`, `/auth`, `/reset-password`, `/admin`, `*` (NotFound).

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

**Componente:** `<AccessGate required="N1">` — muestra `UpgradePrompt` si el nivel es insuficiente. Acepta `blur` para difuminar el contenido en vez de ocultarlo.

### Capa 2: Feature flags (FeatureId)

`src/lib/plans.ts` define qué features están habilitadas según el plan activo.

**Plan actual:** `CURRENT_PLAN_ID = "all_free"` — todas las features habilitadas, sin fricción.

Para cambiar a freemium: editar `CURRENT_PLAN_ID = "freemium"` en `plans.ts`.

**Hook:** `useFeatureAccess(featureId)` → `{ hasAccess, trackBlocked, trackUpgradePromptShown }`.

**Componente:** `<FeatureGate feature="diagnostic_pdf">` — usa `hasFeature()` del plan activo.

> **Regla:** usar `<AccessGate>` para restringir por membresía. Usar `<FeatureGate>` para restringir por feature flag. No mezclar.

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

Opcionales: `VITE_POSTHOG_KEY`, `VITE_SENTRY_DSN`, `VITE_VAPID_PUBLIC_KEY`.

---

## Supabase

- Cliente: `src/integrations/supabase/client.ts`
- Tipos auto-generados: `src/integrations/supabase/types.ts` — **no editar a mano**
- Edge Functions: `supabase/functions/` — se despliegan con `deploy-functions.yml`

Tablas relevantes: `profiles` (access_level, nickname, membership_expires_at), `payments`, `mentor_conversations`, `mentor_messages`.

---

## Testing

- Unitarios: Vitest + jsdom. Setup en `src/test/setup.ts`. Umbrales: 70% branches, 25% resto.
- E2E: Playwright. Targets: Desktop Chrome + Pixel 5. No en paralelo.

---

## CI/CD y deploy

Push a `main` → tests → build → `npx vercel --prod` (GitHub Actions `deploy.yml`).

**Secrets requeridos en GitHub:**

| Secret | Valor |
|--------|-------|
| `VERCEL_TOKEN` | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `team_7IpSKP23kMLFwShzU7WfcsYj` |
| `VERCEL_PROJECT_ID` | `prj_QD34lzAB0hpVuSMBizHJZC87JwaN` |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon key |
| `VITE_SUPABASE_PROJECT_ID` | ID del proyecto |

> ⚠️ Sin `VERCEL_TOKEN`, el CI falla en deploy. Workaround: `npx vercel --prod --yes` desde local.

**Producción:** `https://app.mejoraok.com` (`mejoraapp.vercel.app` redirige 308 a ese dominio via `vercel.json`).

---

## Convenciones

- Alias `@/` → `src/`. Siempre en imports, nunca rutas relativas largas.
- Validación: **Zod** en todos los formularios (`src/lib/validation.ts`).
- HTML externo: sanitizar con **DOMPurify** (`src/lib/security.ts`).
- Rate limiting: `src/lib/rateLimit.ts`.
- Tipos globales: `src/types/`.
- Pre-commit: Husky + lint-staged (ESLint en `.ts/.tsx`, Prettier en `.json/.md/.css/.html`).
- **Cero** `@ts-ignore` nuevos. **Cero** `console.error` silenciados.
