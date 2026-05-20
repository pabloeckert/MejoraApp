# Instructivo de Despliegue — MejoraApp

Deploy en **Vercel** → `app.mejoraok.com`

---

## Requisitos

- Cuenta en [Vercel](https://vercel.com) con acceso al proyecto `mejoraapp`
- Variables de entorno configuradas en el dashboard de Vercel (ver sección Variables)

---

## Deploy automático (recomendado)

Cada push a `main` dispara un deploy automático en Vercel. No requiere ninguna acción manual.

```
git push origin main
```

Vercel construye la app con `npm run build` y la publica en `https://app.mejoraok.com`.

---

## Deploy manual desde Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Variables de entorno

Configurarlas en **Vercel Dashboard → Project → Settings → Environment Variables**.  
Nunca escribirlas en archivos del repo ni en la CLI.

| Variable | Entornos | Descripción |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Production, Preview | URL del proyecto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Production, Preview | Anon key de Supabase |
| `VITE_SUPABASE_PROJECT_ID` | Production, Preview | ID del proyecto Supabase |
| `SENTRY_DSN` | Production | DSN de Sentry para error tracking |
| `POSTHOG_KEY` | Production | API key de PostHog |

---

## Verificar el deploy

1. Abrir `https://app.mejoraok.com`
2. Confirmar que carga el logo y la navegación
3. Probar en desktop y móvil

---

## Troubleshooting

| Síntoma | Causa probable | Solución |
|---------|---------------|---------|
| Pantalla en blanco | Error de build | Revisar logs en Vercel Dashboard → Deployments |
| Error 404 en rutas | Configuración SPA | `vercel.json` ya incluye el rewrite correcto |
| No conecta a Supabase | Variables faltantes | Verificar env vars en Vercel Dashboard |
| Build falla en CI | Dependencias | Correr `npm ci` localmente para reproducir |

---

*MejoraApp — app.mejoraok.com*
