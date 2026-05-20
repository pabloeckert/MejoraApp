# CLAUDE.md — MejoraApp

Guía de referencia rápida para Claude Code. Versión actual: **v1.0.0** (2026-05-19).

---

## Comandos frecuentes

```bash
npm run dev             # Dev server → http://localhost:8080
npm run build           # Build de producción → dist/
npm run lint            # ESLint (debe terminar con 0 warnings)
npm run test            # Vitest una sola pasada (276 tests)
npm run test:coverage   # Vitest con reporte de cobertura
npm run test:e2e        # Playwright headless
npx tsc --noEmit        # Type-check sin build
npx vercel --prod --yes # Deploy a producción (si CI falla)
```

---

## Arquitectura

PWA para líderes empresariales argentinos. Stack: React 18 + TypeScript + Vite + Supabase + Tailwind CSS.

```
Pages (6, lazy-loaded)
  └─ Components (~100, por dominio: admin/ auth/ diagnostic/ home/ mentor/ mirror/ muro/ community/ tabs/ ui/)
       └─ Hooks (16 custom, wrappean servicios con React Query)
            └─ Services (5 módulos: wall / content / diagnostic / business-mirror / tiendup)
                 └─ Supabase (Auth, DB, Realtime, Edge Functions)
```

**Entry points:**
- `src/main.tsx` — Sentry, PostHog, Service Worker
- `src/App.tsx` — rutas con lazy-loading
- `src/components/Providers.tsx` — 7+ providers

**Páginas:** `/` (Index), `/splash`, `/auth`, `/reset-password`, `/admin`, `*` (NotFound).

**Estado:**
- Server state → React Query (`staleTime: 2min`, `retry: 1`)
- Client state → Contexts (AuthContext, ThemeContext, I18nContext)
- Local state → localStorage

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
O en inline styles: `hsl(var(--brand-azul))`.

Los semánticos (`--primary`, `--accent`, `--destructive`, `--foreground`, `--muted-foreground`) apuntan a los brand tokens.

**Archivo:** `src/lib/brand.ts` exporta `brand.*` y `MEMBERSHIP_CONFIG`.

**Logo:** `src/assets/logo.svg` (isotipo Miró-esque).

**Tipografía:**
- Body: `Bw Modelica` (woff2 en `/public/fonts/`)
- Display/headings: `League Spartan`

---

## Foco de producto: Mirror Estratégico es el CTA primario

- `HomeDashboard` — tiene una hero card azul visible para todos los niveles que lleva a `tab: "diagnostico"`
- `BottomNav` — botón circular central brand-azul para el tab Mirror; muestra indicador rojo si el usuario no hizo diagnóstico
- Al completar el onboarding (`ProfileCompleteModal.onComplete`) → navega al tab `"diagnostico"`

---

## Variables de entorno

```bash
cp .env.example .env.local
```

Requeridas:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_ENVIRONMENT` (`development` | `staging` | `production`)

Opcionales: `VITE_POSTHOG_KEY`, `VITE_SENTRY_DSN`, `VITE_VAPID_PUBLIC_KEY`.

---

## Supabase

- Cliente: `src/integrations/supabase/client.ts`
- Tipos auto-generados: `src/integrations/supabase/types.ts` — **no editar a mano**
- Edge Functions: `supabase/functions/` — se despliegan con `deploy-functions.yml`

---

## Testing

- Unitarios: Vitest + jsdom. Setup en `src/test/setup.ts`. Umbrales: 70% branches, 25% resto.
- E2E: Playwright. Targets: Desktop Chrome + Pixel 5. No en paralelo.
- Un test: `npx vitest run src/test/nombre.test.ts`

---

## CI/CD y deploy

### GitHub Actions (`deploy.yml`)
Push a `main` → corre tests → build → `npx vercel --prod`.

**Requiere estos secrets en GitHub** (Settings → Secrets → Actions):

| Secret | Valor |
|--------|-------|
| `VERCEL_TOKEN` | Crear en vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `team_7IpSKP23kMLFwShzU7WfcsYj` |
| `VERCEL_PROJECT_ID` | `prj_QD34lzAB0hpVuSMBizHJZC87JwaN` |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon key |
| `VITE_SUPABASE_PROJECT_ID` | ID del proyecto |

> ⚠️ Hasta que `VERCEL_TOKEN` esté configurado, el CI falla en el paso de deploy.
> Workaround: `npx vercel --prod --yes` desde local (ya estás autenticado).

### Deploy manual
```bash
npx vercel --prod --yes
```

### Producción
- URL: `https://app.mejoraok.com`
- `mejoraapp.vercel.app` → redirige 308 a `app.mejoraok.com` (configurado en `vercel.json`)

---

## Estructura de archivos notables

```
/
├── src/
│   ├── assets/logo.svg          # Isotipo de marca
│   ├── index.css                # Variables CSS de marca (--brand-*)
│   ├── lib/brand.ts             # Constantes de marca y MEMBERSHIP_CONFIG
│   ├── components/
│   │   ├── BottomNav.tsx        # Nav con tab Mirror central
│   │   ├── home/HomeDashboard   # Hero card Mirror Estratégico
│   │   └── ProfileCompleteModal # Onboarding → redirige a diagnóstico
│   └── data/
│       ├── diagnosticData.ts    # Perfiles del Mirror (PERFILES, PREGUNTAS)
│       └── businessMirrorTests.ts # Tests del Business Mirror Game
├── public/
│   ├── manifest.json            # PWA: name "Mejora Continua"
│   ├── sw.js                    # Service Worker v5
│   ├── offline.html             # Fallback offline
│   └── favicon.svg              # Ícono actualizado con marca
├── docs/                        # Documentación interna (no código)
│   ├── CLAUDE.md                # Versión anterior (archivada)
│   ├── CTO-SESSION.md           # Historial de decisiones
│   └── ...
├── vercel.json                  # Headers seguridad + redirect mejoraapp.vercel.app
└── CLAUDE.md                    # Este archivo
```

---

## Convenciones

- Alias `@/` → `src/`. Siempre en imports, nunca rutas relativas largas.
- Validación: **Zod** en todos los formularios (`src/lib/validation.ts`).
- HTML externo: sanitizar con **DOMPurify** (`src/lib/security.ts`).
- Rate limiting: `src/lib/rateLimit.ts`.
- Tipos globales: `src/types/`.
- Pre-commit: Husky + lint-staged (ESLint en `.ts/.tsx`, Prettier en `.json/.md/.css/.html`).
- **Cero** `@ts-ignore` nuevos. **Cero** `console.error` silenciados.
