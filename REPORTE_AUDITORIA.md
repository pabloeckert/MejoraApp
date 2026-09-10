# Reporte de Auditoría — MejoraApp

Fecha: 2026-09-10
Repo: `C:\Github\Negocio\MejoraApp` — remote `pabloeckert/MejoraApp`, rama `main`
Alcance: auditoría de higiene/calidad (parte de la auditoría integral de `C:\Github`). Sesión de continuación tras un corte por rate-limit de un intento previo.

---

## Resumen ejecutivo

El repo está **sano en lo funcional**: typecheck, lint, build y los 276 tests unitarios pasan limpios. No hay secretos reales trackeados actualmente, ni basura de build, ni código comentado grande. El intento anterior (cortado por rate-limit) ya había dejado el `package-lock.json` regenerado — esta sesión completó lo que faltaba: 1 fix no-breaking de vulnerabilidades pendiente, 1 error real de `tsc` (bug de tipos, no de lógica), 1 comentario de código desactualizado, y la actualización de `ARCHITECTURE.md` para reflejar la eliminación confirmada del módulo `AdminCRM`. Ningún cambio fue commiteado — todo queda en el working tree.

**Hallazgo más importante para decisión humana:** el archivo de contenido `src/data/businessMirrorTests.ts` (usado por la feature paga "Business Mirror Gamer") tiene **219 líneas con texto corrupto** (mojibake — UTF-8 mal decodificado: "qué" → "quÃ©", "así" → "asÃ­", "—" → "â€”"). Es contenido real que se le muestra al usuario en un test de diagnóstico premium. No se corrigió automáticamente porque un reemplazo masivo en un archivo de copy de producto sin tests que validen el string exacto es un cambio de contenido no trivial — requiere decisión humana (ver detalle abajo).

---

## Estado previo al arranque de esta sesión (verificado, no repetido)

- 3 commits locales ya existían por delante de `origin/main` (autor: `Pablo <pabloeckert@gmail.com>`, no un agente) — no tocados, no es rol de esta auditoría pushear ni revertir.
- `package-lock.json` ya estaba modificado (working tree) — confirmado que corresponde a un `npm update` ya corrido: `npm outdated` mostraba `Current == Wanted` en casi todo el árbol.
- `node_modules` ya instalado.

## Acciones tomadas en esta sesión

1. **`npm audit` / `npm audit fix`** — confirmado que las 7 vulnerabilidades restantes (6 moderadas, 1 alta: `@vitest/mocker`/`vitest`, `esbuild`/`vite`, `react-router`/`react-router-dom`) **solo tienen fix vía `--force`** (bumps mayores: `vitest` 3→5, `vite` 5→8, `react-router-dom` 6→7 — todos breaking). `npm audit fix` sin `--force` no aplicó nada. No se forzó ningún bump mayor.
2. **`npm update posthog-js`** — quedaba 1 patch pendiente (1.429.1 → 1.429.2) dentro del rango del `package.json`. Aplicado. `npm outdated` queda limpio salvo los majors (todos fuera de rango semver, requieren decisión y trabajo de migración aparte).
3. **`npx tsc --noEmit`** — 1 error real en `src/lib/push.ts:19`: `Uint8Array` no asignable a `BufferSource` (cambio de comportamiento de los tipos genéricos de TypedArray en TS reciente, no un bug de lógica). Corregido tipando el retorno de `urlBase64ToUint8Array` como `Uint8Array<ArrayBuffer>` — es lo que la función ya devolvía en la práctica. Verificado: `tsc --noEmit` limpio, sin cambio de comportamiento.
4. **`npm run lint`** — limpio, 0 warnings, nada que autofixear.
5. **`npm run build`** — OK (34s, bundle principal ~230KB/64KB gzip para `Index`, dentro del límite de 5MB que valida `ci.yml`).
6. **`npm run test`** — 276/276 tests pasando (15 archivos).
7. **Comentario desactualizado en `src/lib/plans.ts`** — el docstring decía "Modo actual: ALL_FREE... cambiar a freemium cuando se defina el modelo de negocio", pero `CURRENT_PLAN_ID` ya está en `"freemium"` (confirmado en `CLAUDE.md`: paywalls activos desde 2026-07-12). Corregido el comentario para reflejar el estado real — sin tocar lógica.
8. **`ARCHITECTURE.md` — hallazgo `AdminCRM` confirmado y corregido.** Ver sección dedicada abajo.

## Hallazgo confirmado: referencia desactualizada a `AdminCRM`

`ARCHITECTURE.md` (línea 48, antes de este fix) documentaba `src/components/admin/AdminCRM.tsx` y una carpeta `admin/crm/` como parte del árbol de directorios actual. **Ninguno de los dos existe en el código.**

Confirmado con historial de git: el módulo se eliminó deliberadamente en el commit `refactor(fase-1): eliminar CRM, NPS, badges, referrals, onboarding, AB testing, funnel` (y su duplicado inmediato). Los componentes admin reales hoy son: `AdminCobranza.tsx`, `AdminContenido.tsx`, `AdminIA.tsx`, `AdminMuro.tsx`, `AdminNovedades.tsx`, `AdminSecurityMFA.tsx`, `AdminSeguridad.tsx`, `AdminUsuarios.tsx`.

**Acción tomada:** se corrigió el árbol de directorios en `ARCHITECTURE.md` para reflejar los componentes reales y se dejó una nota explicando que `AdminCRM` fue eliminado en ese refactor.

**Relacionado, no tocado:** `docs/MEJORAS-APLICADAS.md:345` también menciona `"CRM/Lifecycle | 7 | AdminCRM present"` — es una tabla histórica de scoring (snapshot de un review puntual) que en conjunto quedó desactualizada no solo en esa fila sino en varias otras (NPS, A/B testing, referrals, onboarding — todos eliminados en el mismo refactor). No se editó porque reescribir una tabla de snapshot histórico completa es un cambio de alcance mayor al pedido puntual; queda para decisión humana si conviene actualizarla o marcarla explícitamente como histórica.

## Hallazgos de seguridad

- **Sin secretos trackeados actualmente.** `git ls-files` no tiene `.env*` reales (solo `.env.example` y `.env.staging.example`, con placeholders). Scan de patrones de credenciales (AWS keys, private keys, tokens de GitHub, `service_role`) sobre archivos trackeados: todas las referencias a `SUPABASE_SERVICE_ROLE_KEY` son vía `Deno.env.get(...)` en Edge Functions o `secrets.*` en workflows — ninguna hardcodeada.
- **Credenciales FTP en historial de git (ya mitigado, no reescribible).** El `CHANGELOG.md` (v1.0.0) documenta que se sacaron credenciales FTP del tracking ("historial pendiente de rotación"). Verificado en `git log`: existen commits posteriores (`security: remove credentials, binaries and doc artifacts from repo`, `security+chore(repo): limpiar credenciales FTP...`) que ya sacaron el archivo del tracking. Los valores siguen recuperables en commits viejos del historial (no reescribible por regla de esta auditoría). **Pendiente de decisión humana:** confirmar si esas credenciales FTP fueron rotadas — si el deploy es Vercel-only hoy (como dice el propio changelog), probablemente ya no son válidas, pero vale confirmarlo.
- **CSP inconsistente entre `index.html` (meta tag) y `vercel.json` (header HTTP).** El meta tag en `index.html`/`dist/index.html` incluye `'unsafe-eval'` en `script-src` y una directiva `frame-ancestors 'none'`, mientras que el header real en `vercel.json` (el que efectivamente aplica el browser, más estricto: sin `unsafe-eval`) no la tiene. Nota técnica: `frame-ancestors` se **ignora por spec cuando se entrega vía `<meta>`** — solo es válido vía header HTTP, así que esa directiva en el meta tag no hace nada (el header de `vercel.json` sí la aplica correctamente). No es una vulnerabilidad activa, pero es una config confusa/redundante que vale limpiar. No se tocó porque el área ya tuvo cambios de seguridad en la sesión de git inmediatamente anterior. **Pendiente de decisión humana.**

## Hallazgo de contenido (no corregido — requiere decisión)

`src/data/businessMirrorTests.ts` — **219 líneas con mojibake** (texto con codificación rota), visible al usuario en preguntas/resultados del test "Business Mirror Gamer" (contenido premium). El archivo hermano `src/data/diagnosticData.ts` tiene contenido temáticamente similar pero con codificación correcta — sugiere que `businessMirrorTests.ts` se generó o pegó desde una fuente con un problema de encoding y nunca se corrigió. Última modificación real de contenido: commit `fix: agregar minAccessLevel por test en BusinessMirror` (2026-05-28); hubo un "Auto-commit: Sincronizacion de espacio de trabajo - Antigravity" posterior que pudo haber reintroducido o mantenido el problema.

No se aplicó una corrección automática masiva porque es contenido de producto real sin test que valide el string exacto, y un script de reemplazo agresivo podría corromper casos límite sin que nada lo detecte.

**Recomendación:** revisar si existe una versión previa sin corromper en el historial, o re-pegar el contenido desde la fuente original con encoding UTF-8 correcto, y agregar una verificación simple que falle si detecta el patrón `Ã` en archivos de `src/data/`.

## Basura / higiene general

- Sin `.DS_Store`, sin logs trackeados, sin `dist/`/`build/` trackeado.
- `.gitignore` prolijo: env vars, lockfiles alternativos, artifacts, `playwright-report/`, `coverage/`, `.vercel`.
- Sin bloques grandes de código comentado (barrido de 6+ líneas consecutivas: cero resultados).
- Sin TODO/FIXME/XXX/HACK reales en comentarios (el barrido inicial dio 49 falsos positivos — todos la palabra española "todo/todos" en strings de UI).
- Sin `dangerouslySetInnerHTML` en `src/` (solo mencionado en un comentario). Sin `console.log` sueltos en código de producto.
- **Curiosidad menor de git, sin acción:** los 2 commits más recientes (`07af5af` y `05de11c`) tienen mensaje idéntico, 65 segundos de diferencia, mismo autor real (`Pablo`). Probablemente doble-commit accidental, no algo de un agente. No tocado.
- `CONTRIBUTING.md` — sano; solo un ejemplo de convención (`crm_` prefix) referencia el dominio eliminado, pero es ilustrativo, no amerita cambio.
- `CHANGELOG.md` — **muy desactualizado**: última entrada real v1.0.0 (2026-05-19), pero el código actual (v1.1.0 según `CLAUDE.md`) tiene meses de trabajo no documentado (Red de líderes, Onboarding, Business Mirror Gamer, Mentor IA SSE, freemium, fixes de seguridad, suite E2E). No se redactaron las entradas faltantes — es curaduría editorial del dueño del proyecto. **Pendiente de decisión humana.**

## Husky / CI

- `.husky/pre-commit` corre `npx lint-staged` — funcional.
- `.github/workflows/`: `ci.yml`, `deploy.yml`, `deploy-staging.yml`, `deploy-functions.yml`, `lighthouse.yml`, `onboarding-emails.yml` — todos presentes. `ci.yml` corre audit (solo `--audit-level=critical`), typecheck, lint, tests con cobertura, E2E, build, y valida bundle <5MB.
- `ci.yml` tiene un comentario propio: *"Sacar `continue-on-error` después de la primera corrida verde en CI"* sobre el step de E2E — los commits recientes dicen "suite E2E verde", pero no hay acceso a GitHub Actions desde este entorno para confirmar una corrida real. **Pendiente de decisión humana.**

## Edge Functions vs `CLAUDE.md`

Confirmado (re-verificado): las 14 Edge Functions listadas en `CLAUDE.md` coinciden exactamente con las 14 carpetas reales en `supabase/functions/` (excluyendo `_shared/`). Sin acción necesaria.

## Pendientes que requieren decisión humana (resumen)

1. **`src/data/businessMirrorTests.ts`** — 219 líneas de mojibake en contenido premium visible al usuario.
2. **7 vulnerabilidades de `npm audit`** — solo fix vía `--force` (bumps mayores de vitest/vite/react-router-dom). No aplicados.
3. **CSP inconsistente** entre `index.html` (meta) y `vercel.json` (header real). No explotable hoy, vale limpiar.
4. **Credenciales FTP en historial de git** — ya sacadas del tracking, recuperables en commits viejos. Confirmar rotación.
5. **`CHANGELOG.md` desactualizado** desde v1.0.0.
6. **`docs/MEJORAS-APLICADAS.md`** — tabla de scoring histórica con varias filas desactualizadas más allá de `AdminCRM`.
7. **`ci.yml`** — decidir si sacar `continue-on-error` del step de E2E si hay corrida verde confirmada.
8. Majors disponibles sin aplicar (`react` 18→19, `zod` 3→4, `typescript` 5→7, `tailwindcss` 3→4, etc.) — fuera de rango semver, requieren migración dedicada.

## Archivos modificados en esta sesión (sin commitear)

- `package-lock.json` — `npm update posthog-js` (patch).
- `src/lib/push.ts` — fix de tipo, sin cambio de comportamiento.
- `src/lib/plans.ts` — comentario corregido.
- `ARCHITECTURE.md` — árbol de `admin/` corregido, referencia a `AdminCRM` eliminada con nota.

Nada fue commiteado ni pusheado. Todo queda en el working tree para revisión del usuario.
