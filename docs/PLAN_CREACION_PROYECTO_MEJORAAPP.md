# PLAN MAESTRO DE CREACIÓN Y EJECUCIÓN — MEJORAAPP
> **Guía Técnica y Operativa de Construcción para Project Managers, Arquitectos y Desarrolladores**  
> *Alineado con el Manifiesto Interno, el Criterio Medular y la Filosofía K.I.S.S. de Mejora Continua.*

---

## 1. VISIÓN Y DIRECTRIZ EJECUTIVA

### 1.1. Principio Rector Innegociable
**MejoraApp no es una aplicación transaccional ni un captador aislado de leads.** Es el **vehículo digital de inmersión cultural y vinculación estratégica** de Mejora Continua.

Cada pantalla, copy, interacción de botón y respuesta del copiloto IA debe cumplir mecánicamente los tres pilares del Criterio Medular:
1. **La crítica va al sistema y al proceso, jamás a la persona**: Se erradica la culpa moral del directivo; se demuestra que la sobrecarga y los incendios se deben a la ausencia de métodos y procesos formalizados.
2. **Verdad sin maquillaje con calidez real**: Confrontación lúcida de los síntomas y de la fuga de dinero/tiempo, sin rodeos pero con empatía y dirección táctica inmediata.
3. **Indispensabilidad y pertenencia comunitaria**: Establecer que dentro de Mejora Continua hay orden, método y acompañamiento, mientras que salirse del ecosistema significa regresar al caos y a la soledad del líder.

---

## 2. ESQUEMA DE GOBERNANZA Y RECURSOS (MATRIZ RACI)

| Componente / Hito | PM | Tech Lead / Arq | Frontend Dev | Backend Dev | Dirección Estratégica |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Auditoría de Copies & Criterio Medular** | **A** | I | C | I | **R** |
| **Design System Canónico (80/10/5/5)** | I | C | **R** | I | **A** |
| **Motor de Diagnóstico & Algoritmo Mirror** | **A** | **R** | C | **R** | C |
| **Vistas Interactivas Bento & Motion UI** | I | C | **R** | I | **A** |
| **Muro Anónimo, Moderación & DB** | **A** | **R** | C | **R** | I |
| **Streaming SSE & Context Injection IA** | **A** | **R** | C | **R** | C |
| **Mesa de Alianzas & Botón Emergencia** | **A** | C | **R** | **R** | **A** |
| **Core Web Vitals & Low Data PWA** | **A** | **R** | **R** | C | I |

*Referencias: **R** = Responsable de ejecución; **A** = Aprobador final; **C** = Consultado; **I** = Informado.*

---

## 3. ROADMAP TÉCNICO DE EJECUCIÓN (45 DÍAS / 3 SPRINTS)

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CRONOGRAMA DE EJECUCIÓN (45 DÍAS)                    │
├─────────────────────┬──────────────────────┬───────────────────────────┤
│ SPRINT 1 (DÍAS 1-15)│ SPRINT 2 (DÍAS 16-30)│ SPRINT 3 (DÍAS 31-45)     │
├─────────────────────┼──────────────────────┼───────────────────────────┤
│ • Cimientos & Copies│ • Muro Anónimo (N1)  │ • Mesa Alianzas N2        │
│ • Design System     │ • Mentor IA Context  │ • Botón de Emergencia     │
│ • The Mirror (8 Qs) │ • Pagos Tiendup/MP   │ • Hardening & Seguridad   │
│ • Arquetipos & Bento│ • Low Data UX & PWA  │ • QA E2E & Deploy Final   │
└─────────────────────┴──────────────────────┴───────────────────────────┘
```

---

### SPRINT 1: EL ESPEJO Y LA INMERSIÓN CULTURAL (Días 1 a 15)
**Meta del Sprint:** Desplegar el embudo de captación N0 libre de fricción, con el diagnóstico *The Mirror*, cálculo de arquetipo dominante y visualización Bento Grid de las 4 Dimensiones.

#### Tareas Técnicas Detalladas:

1. **Saneamiento de Datos y Verificación del Criterio Medular (Días 1-3)**
   - Corregir de forma quirúrgica las 219 líneas de *mojibake* en `src/data/businessMirrorTests.ts` (restaurar tildes, signos y comillas correctas).
   - Auditar cada texto de `src/data/diagnosticData.ts` para asegurar que ningún enunciado culpe al líder personalmente ("*tu negocio creció sin estructura*" en vez de "*no supiste organizarte*").

2. **Design Tokens & Sistema Visual Canónico (Días 4-6)**
   - Configurar en `tailwind.config.ts` e `index.css` la regla estricta **80/10/5/5**:
     - `80%`: Blanco Puro (`#FFFFFF`) / Fondo elevado (`#F8FAFC`).
     - `10%`: Azul Marino Institucional (`#1A3D84`) en botones de acción primaria y cabeceras.
     - `5%`: Rojo Acento (`#E1061E`) exclusivamente para cuellos de botella y alertas críticas.
     - `5%`: Amarillo Cálido (`#F7CC13`) para advertencias intermedias e insignias.
   - Habilitar el Dark Mode Ejecutivo secundario bajo atributo `data-theme="dark"`.
   - Incorporar tipografías oficiales: `League Spartan` para titulares e insignias de autoridad; `Bw Modelica` / `Inter` para cuerpos de texto y datos.

3. **Motor del Mirror Estratégico (8 Preguntas) (Días 7-10)**
   - Implementar el algoritmo de asignación por síntoma dominante: `mcDetectarPerfil(r, total)`.
   - Estructurar el cuestionario con escala obligatoria `5 - 3 - 2 - 1` (A: 5 pts, B: 3 pts, C: 2 pts, D: 1 pt).
   - Flujo de interacción: al seleccionar una respuesta, elevación sutil de 2px, barra superior con aceleración cúbica (`cubic-bezier(0.4, 0, 0.2, 1)`) y transición fluida a la siguiente pregunta.

4. **Pantalla de Resultados "El Espejo Brutal" & Bento Grid (Días 11-15)**
   - Tarjeta de arquetipo dominante con titular contundente en League Spartan y síntesis del freno operativo.
   - Radar Bento de las 4 Dimensiones con semáforo de barras:
     - Rojo (`#E1061E`): 0% - 39% (Zona Crítica).
     - Amarillo (`#F7CC13`): 40% - 64% (Fricción Operativa).
     - Azul (`#1A3D84`): 65% - 100% (Sólido / En Crecimiento).
   - Puente de conversión N1: Directivas inmediatas de salida y botón de acción: `DESBLOQUEAR MI PLAN EN LA RED DE LÍDERES →`.

---

### SPRINT 2: EL ESPACIO SEGURO Y EL HÁBITO SEMANAL (Días 16 a 30)
**Meta del Sprint:** Habilitar la comunidad interactiva protegida (Muro de Líderes N1), el copiloto Mentor IA con memoria de diagnóstico y la sincronización de suscripciones recurrentes.

#### Tareas Técnicas Detalladas:

1. **El Muro de Líderes Anónimo (Días 16-20)**
   - Tablas `muro_casos` y `muro_soluciones` con políticas RLS para lectura pública y escritura exclusiva para N1/N2.
   - Generación de seudónimos corporativos protegidos (ej. *"Director Consumo Masivo, 80 colaboradores"*).
   - Categorías fijas de debate: `Finanzas`, `Socios`, `Comercial`, `Equipo`, `Crisis`.
   - Moderación automática mediante Edge Function con IA para preservar el Criterio Medular y la altura profesional del debate.

2. **Mentor IA Estratégico con Inyección de Contexto (Días 21-25)**
   - Pipeline de enriquecimiento de prompt en Edge Function:
     - Último informe del Mirror del usuario (puntajes por dimensión y arquetipo).
     - Historial de consultas y dilemas abordados en la plataforma.
     - System Prompt con el Manifiesto de Mejora Continua (calidez con verdad, foco en el proceso).
   - Conexión vía Server-Sent Events (SSE) para streaming continuo de respuestas en la interfaz.
   - Generación dinámica de componentes (UI Generativa): matrices de descuento interactivas y guiones de negociación listos para WhatsApp.

3. **Monetización Recurrente y Sincronización Tiendup / MercadoPago (Días 26-28)**
   - Configuración de webhooks para activación inmediata de nivel (`N1` $50.000 ARS, `N2` $150.000 ARS).
   - Edge Function `sync-tiendup` para verificación automática de pagos activos y caducidad.
   - Componentes de gating no intrusivos (`ContentGate`, `UpgradeModal`).

4. **Low Data UX y Capacidades Offline PWA (Días 29-30)**
   - Service Worker optimizado: Cache-first para el cuestionario del Mirror e informe local.
   - Presupuesto estricto de assets: Bundle inicial `< 100 kB`.

---

### SPRINT 3: LA INDISPENSABILIDAD Y RESCATE DE CRISIS (Días 31 a 45)
**Meta del Sprint:** Consolidar el segmento VIP Círculo Dorado (N2), implementar el protocolo de emergencia empresarial, auditoría de seguridad y despliegue general.

#### Tareas Técnicas Detalladas:

1. **Círculo Dorado y Mesa de Alianzas B2B (Días 31-35)**
   - Módulo exclusivo para miembros N2: publicación y postulación a alianzas comerciales estratégicas (distribución, capacidad instalada, inversión conjunta).
   - Directorio verificado de decisores C-Level con contacto bilateral mediado.

2. **Botón de Emergencia Empresarial (< 60 min SLA) (Días 36-39)**
   - Tarjeta destacada con borde rojo `#E1061E` en el Home de miembros N2.
   - Flujo de activación de crisis: formulario de tres campos (Tipo de crisis, impacto actual, teléfono directo).
   - Despacho inmediato multicanal (WhatsApp al consultor de guardia + correo de alta prioridad vía Resend) y registro en tabla `tickets_emergencia`.

3. **Auditoría de Seguridad, RLS y Rendimiento (Días 40-42)**
   - Verificación de Row Level Security en todas las tablas de Supabase.
   - Sanitización de inputs y prevención de inyección XSS con Zod schemas en todas las fronteras de datos.
   - Auditoría Lighthouse: Score $\ge 95$ en Performance, Accesibilidad (WCAG 2.1 AA), Best Practices y SEO.

4. **Despliegue a Producción, Telemetría y Capacitación (Días 43-45)**
   - Deploy automático en Vercel sobre dominio institucional (`app.mejoraok.com`).
   - Verificación de variables de entorno y secrets en Supabase y Vercel.
   - Telemetría de eventos con PostHog (funnel de conversión N0 $\rightarrow$ N1 $\rightarrow$ N2) y Sentry para monitoreo de excepciones.

---

## 4. CRITERIOS DE ACEPTACIÓN NORMATIVOS (DEFINITION OF DONE)

Para que cualquier feature o pantalla se considere terminada y apta para producción, debe cumplir:
1. **Validación del Criterio Medular**: Cero juicios a la persona; toda recomendación ataca la falta de método y estructura.
2. **Fidelidad al Sistema de Diseño**: Respeto a la regla 80% Blanco, 10% Azul Marino, 5% Rojo, 5% Amarillo.
3. **Prueba en Dispositivos Reales**: Fluidez total en pantallas móviles de gama media bajo simulación de red 3G inestable.
4. **Cobertura de Pruebas**: Mantener el 100% de la suite de tests unitarios verde (mínimo 276 tests) y pruebas E2E en flujos críticos.
5. **Accesibilidad**: Contraste superior a 11.5:1 en texto principal y áreas táctiles mínimas de 48x48px.
