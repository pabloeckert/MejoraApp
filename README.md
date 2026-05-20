# Mejora Continua — Mirror Estratégico

**Producción:** [app.mejoraok.com](https://app.mejoraok.com)

PWA para líderes empresariales argentinos. El foco central es el **Mirror Estratégico**: un diagnóstico de 8 preguntas que identifica el freno real del negocio y ofrece un plan de acción personalizado. Incluye Muro anónimo, Contenido de valor, Comunidad, Mentor IA y Panel Admin.

---

## Quick start

```bash
git clone https://github.com/pabloeckert/MejoraApp.git
cd MejoraApp
npm install
cp .env.example .env.local   # completar con tus keys de Supabase
npm run dev                   # → http://localhost:8080
```

---

## Stack

| Capa | Tecnología |
|------|-----------|
| UI | React 18 + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | Supabase (Auth, DB, Realtime, Edge Functions) |
| Build | Vite 5 |
| State | React Query |
| Testing | Vitest (unit) + Playwright (E2E) |
| Deploy | Vercel → app.mejoraok.com |

---

## Deploy en Vercel

Push a `main` → deploy automático. Variables de entorno requeridas en Vercel Dashboard:

| Variable | Descripción |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon key de Supabase |
| `VITE_SUPABASE_PROJECT_ID` | ID del proyecto |

Ver [ARCHITECTURE.md](ARCHITECTURE.md) para detalle técnico completo.

---

© 2026 Mejora Continua — Propietario
