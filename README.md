# Mejora Continua — Mirror Estratégico & Comunidad Empresarial

**Producción:** [app.mejoraok.com](https://app.mejoraok.com)

PWA estratégica para líderes y dueños de PyMEs bajo el **Criterio Medular** y el sistema de diseño **80/10/5/5** de Mejora Continua.

### Módulos principales
- **Mirror Estratégico (`N0`)**: diagnóstico de 8 preguntas que calcula el arquetipo dominante y el semáforo Bento de **4 Dimensiones** (*Estructura*, *Comercial*, *Equipo*, *Visión*).
- **Muro Anónimo de Líderes (`N1`)**: debate entre directivos con seudónimo corporativo protegido, categorías fijas (`Finanzas`, `Socios`, `Comercial`, `Equipo`, `Crisis`) y moderación IA.
- **Mentor IA 24/7 (`N1`/`N2`)**: copiloto por streaming SSE con inyección del contexto 4D del último Mirror del usuario.
- **Círculo Dorado & Mesa de Alianzas B2B (`N2`)**: publicación y articulación de acuerdos estratégicos (distribución, capacidad instalada, inversión conjunta y proveedores B2B) con conexión bilateral mediada.
- **Botón de Emergencia Empresarial (`< 60 min SLA`)**: protocolo de guardia de 3 campos con trazabilidad en DB y despacho directo multicanal.

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
