# MEJORA CONTINUA — PROPUESTA MAESTRA DE PRODUCTO & ARQUITECTURA (DE CERO)

> **Documento de Fundamentación Estratégica, Diseño de Interacción y Sistema de Pantallas**  
> *Basado en la integración de la biblioteca estratégica de negocio, ciencias del comportamiento, diseño de interfaces e ingeniería de software.*

---

## 1. DIAGNÓSTICO ESTRATÉGICO: QUÉ ES, CUÁL ES EL OBJETIVO Y QUÉ BUSCAS OBTENER

### 1.1. ¿Qué es verdaderamente el Proyecto?
**Mejora Continua** (materializado en **MejoraApp**) no es una simple aplicación de software, ni un curso digital, ni una red social profesional como LinkedIn, ni una consultora corporativa tradicional.

Es un **Hub de Transformación y Acompañamiento Estratégico Continuo** diseñado específicamente para el **dueño de PyME, CEO y líder empresarial de habla hispana** (con foco inicial en Argentina y el ecosistema regional). 

Es un **espejo implacable y una red de confianza**:
1. **Un Espejo Estratégico (*The Mirror*)**: Un artefacto digital que diagnostica en minutos la patología oculta del negocio (saturación operativa, soledad en la cima, invisibilidad de mercado, falta de sistemas).
2. **Un Espacio Seguro entre Pares (*El Muro Anónimo & La Red*)**: Un entorno confidencial donde directores pueden confesar lo que no pueden decirle a sus empleados, a sus socios ni a sus familias, recibiendo respuestas pragmáticas de pares.
3. **Un Copiloto de Inteligencia Directiva (*El Mentor IA*)**: Entrenado con mentalidad gerencial pragmática, disponible 24/7 para desafiar decisiones, filtrar problemas operativos y bajar ideas a tierra.
4. **Una Mesa de Alianzas y Rescate de Crisis (*Círculo Dorado & Botón de Emergencia*)**: La capa de alto valor donde los decisores hacen negocios entre sí y cuentan con respaldo consultivo inmediato ante situaciones críticas.

```
       ┌────────────────────────────────────────────────────────┐
       │             MEJORA CONTINUA (El Ecosistema)            │
       └───────────────────────────┬────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   DIAGNÓSTICO    │     │    COMUNIDAD     │     │    MENTORÍA      │
│     (MIRROR)     │     │    (LA RED)      │     │  (IA + C-LEVEL)  │
│ Revela el freno  │     │ Rompe la soledad │     │ Desbloqueo y     │
│ real del negocio │     │ del líder        │     │ planes de acción │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

### 1.2. ¿Cuál es el Objetivo Principal?
El objetivo primordial es **desbloquear al líder para que el negocio deje de ser una trampa y pase a ser una empresa escalable y autónoma**.

En palabras de **Peter Drucker** (*La gerencia de empresas*):  
> *"La efectividad directiva no consiste en hacer muchas cosas, sino en hacer las cosas correctas. La mayoría de los líderes fracasan no por falta de capacidad técnica, sino porque quedan atrapados en las urgencias de la máquina que ellos mismos crearon."*

El proyecto busca resolver el dilema del **"Dueño-Cuello de Botella"**:
- Erradicar la operación desordenada y la extinción de incendios cotidiana.
- Construir sistemas repetibles para venta, delegación y control.
- Dotar al líder de una brújula estratégica clara para los próximos 3 años.
- Proveerle respaldo en tiempo real cuando surgen crisis operativas o comerciales.

---

### 1.3. ¿Qué piensas obtener tú (El Creador / Negocio)?
Como fundador y estratega, tu modelo persigue cuatro metas medibles e interconectadas:

1. **Un Embudo Predecible de Adquisición de Alto Valor (High-Ticket Pipeline)**:
   - **N0 (Freemium)**: El diagnóstico gratuito atrae al líder escéptico tocando su dolor más profundo (sin venderle nada de entrada).
   - **N1 ($50.000 ARS/mes - Miembro)**: Monetización recurrente de baja fricción que genera caja mensual constante (*MRR*) y retención comunitaria.
   - **N2 ($150.000 ARS/mes - Círculo Dorado)**: Segmento VIP de alto margen que reúne a decisores con alto poder adquisitivo y capacidad de contratación de servicios de consultoría integral.
   - **Consultoría Directa / Transformación Integral**: Clientes calificados que, tras ver el valor en la app, contratan a Mejora Continua para intervenir directamente sus empresas.

2. **Category Design (Play Bigger)**:
   - No competir con agencias de marketing ni con coaches ontológicos. Crear y liderar la categoría: **"Sistemas de Mirroring y Desbloqueo Empresarial para Líderes PyME"**.

3. **Efecto de Red y Moat Defensivo (Network Effects)**:
   - Conforme más CEOs y dueños interactúan en el Muro y en la Mesa de Alianzas, mayor es el valor del ecosistema. Una comunidad de líderes de confianza no se puede copiar fácilmente con software.

4. **Escalabilidad Desacoplada de tu Tiempo Personal**:
   - Pasar de vender "horas hombre de asesoría" a poseer una plataforma tecnológica y una comunidad que generan valor e ingresos de forma autónoma 24/7.

---

## 2. FUNDAMENTACIÓN CONCEPTUAL: EL PUENTE CON LA BIBLIOTECA

Cada decisión de producto, arquitectura e interfaz está anclada en los principios fundamentales de tus libros de cabecera:

| Dominio | Obra & Autor | Principio Aplicado en MejoraApp |
| :--- | :--- | :--- |
| **Estrategia & Negocio** | *Business Model Generation & Value Proposition Design* (Osterwalder) | Mapeo riguroso de dolores (*Pains*), ganancias (*Gains*) y tareas críticas (*Jobs-to-be-done*) del líder. La app no ofrece "features", ofrece "aliviadores de frustración". |
| **Estrategia & Negocio** | *La estrategia del océano azul* (Kim & Mauborgne) | Matriz ERIC: Eliminar reportes teóricos de 200 páginas; reducir costos de consultoría de entrada; incrementar inmediatez y honestidad; crear el Muro Anónimo confidencial y el Mirror interactivo. |
| **Estrategia & Negocio** | *Play Bigger* (Al Ramadan et al.) | Diseño de la categoría "Mirroring Estratégico". Definir el problema con tanta precisión que el usuario asume que solo tú tienes la solución. |
| **Estrategia & Negocio** | *Cruzando el abismo* (Geoffrey Moore) | El líder PyME tradicional es un *pragmático*. Exige una "solución completa" (*Whole Product*): software + diagnóstico + red de confianza + soporte humano directo ante emergencias. |
| **Comportamiento & Hábitos** | *Hooked: Cómo crear productos formadores de hábitos* (Nir Eyal) | Bucle de 4 pasos: **Disparador** (estrés dominical, caída de ventas) → **Acción** (abrir app, lanzar consulta en el Muro) → **Recompensa Variable** (respuestas lúcidas de pares o Mentor) → **Inversión** (guardar caso, completar test, subir nivel). |
| **Comportamiento & Psicología** | *Predictably Irrational* (Dan Ariely) | Efecto anclaje, poder del "gratis" (*Free*) para bajar las defensas cognitivas y contraste visual de precios entre Miembro ($50k) y Círculo Dorado ($150k). |
| **Comportamiento & Viralidad** | *Contagious: Why Things Catch On* (Jonah Berger) | **STEPPS**: *Social Currency* (el arquetipo de negocio como insignia de estatus), *Triggers* (el inicio de semana como disparador de revisión), *Practical Value* (plantillas y soluciones ya probadas por otros). |
| **Comportamiento & Crecimiento** | *Jab, Jab, Jab, Right Hook* (Gary Vaynerchuk) | Aportar valor real de forma desinteresada y continua (Mirror + Contenido de Valor + Respuestas) antes de solicitar la suscripción paga. |
| **Diseño UI & UX** | *Don't Make Me Think* (Steve Krug) & *The Design of Everyday Things* (Norman) | Claridad implacable. Cero ambigüedad. El líder lee rápido en su móvil mientras atiende llamadas; cada botón debe explicitar su función y su beneficio. |
| **Diseño UI & UX** | *Refactoring UI* (Wathan & Schoger) & *Sistema de Retículas* (Müller-Brockmann) | Jerarquías estrictas con retícula modular de 8px, Dark Mode ejecutivo premium (#0B0C10, acento azul de autoridad, rojo para fricciones, dorado para C-Level) y tipografía con jerarquía semántica. |
| **Diseño UI & UX** | *Atomic Design* (Brad Frost) | Arquitectura modular de interfaces: Tokens (Colores/Espaciados) → Átomos (Badges, Buttons) → Moléculas (PostCards, Metrics) → Organismos (Muro, Diagnostic Flow) → Templates → Pages. |
| **Ingeniería de Software** | *Clean Architecture* (Robert C. Martin) & *Domain-Driven Design* (Eric Evans) | Lenguaje ubicuo de negocio (`PerfilMirror`, `NivelMembresia`, `ConsultaMuro`, `MesaAlianzas`). Desacoplamiento total entre la lógica del negocio y Supabase/Vercel. |
| **Ingeniería de Software** | *The Mythical Man-Month* (Fred Brooks) | **Integridad conceptual**: Menos es más. En lugar de un CRM desbordado y confuso, un producto afilado donde cada módulo sirve al objetivo principal del negocio. |

---

## 3. ARQUITECTURA DE LA SOLUCIÓN REPLANTEADA DESDE CERO

Para lograr la máxima calidad y conversión, la nueva arquitectura se simplifica y robustece eliminando la grasa operativa y enfocándose en **5 Pilares Maestros**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      NIVELES DE ACCESO & MEMBRESÍA                      │
├───────────────────┬─────────────────────────┬───────────────────────────┤
│ N0: VISITANTE     │ N1: MIEMBRO DE LA RED   │ N2: CÍRCULO DORADO        │
│ (Freemium)        │ ($50.000 ARS / $20 USD) │ ($150.000 ARS / $100 USD) │
├───────────────────┼─────────────────────────┼───────────────────────────┤
│ • Mirror 8 Preg.  │ • Muro Interactivo      │ • Red Privada C-Level     │
│ • Diagnóstico     │ • Respuestas de Pares   │ • Mesa de Alianzas        │
│ • Contenido Base  │ • Directorio Completo   │ • BOTÓN DE EMERGENCIA     │
│ • Vista Solo-Lectura│ • Mentor IA Ilimitado │ • Eventos VIP Presenciales│
│   del Muro        │ • Biblioteca Premium    │ • Sesión 1a1 Trimestral   │
└───────────────────┴─────────────────────────┴───────────────────────────┘
```

---

## 4. SISTEMA VISUAL Y GUÍA DE ESTILO EJECUTIVA

Siguiendo las pautas de **Josef Müller-Brockmann**, **Refactoring UI** y la identidad de **Mejora Continua**:

### 4.1. Paleta Cromática Institucional
```
Fondo Principal:       #0A0A0F  (Deep Obsidian - Máxima sobriedad y descanso visual)
Superficie Tarjetas:   #12121A  (Elevated Dark Slate)
Bordes & Separadores:  #1F1F2E  (Subtle Contrast)
Borde Activo / Hover:  #2E2E44

Color Primario (Poder):#1C4D8C  (Azul Estratégico - Certeza, Rigor, Método)
Acento Alerta / Dolor: #D9383A  (Rojo Diagnóstico - Fricción, Urgencia, Riesgo)
Acento C-Level / VIP:  #F2BB16  (Oro Círculo Dorado - Prestigio, Alianzas, Éxito)
Texto Principal:       #F9FAFB  (Blanco puro 98%)
Texto Secundario:      #9CA3AF  (Gris Slate equilibrado)
```

### 4.2. Tipografía & Retícula
- **Titulares Ejecutivos**: `League Spartan` (Firmeza, peso geométrico y autoridad).
- **Lectura & Datos**: `Bw Modelica` / `Inter` (Legibilidad técnica perfecta en pantallas móviles).
- **Retícula**: Base 8pt con márgenes laterales de 16px/20px en móvil y contenedores de lectura de ancho máximo de 680px para evitar fatiga cognitiva.

---

## 5. DOCUMENTO DE DISEÑO DE PANTALLAS (WIREFRAMES DE ALTA FIDELIDAD)

A continuación se presenta la suite completa de las 7 pantallas críticas del sistema, diseñadas con especificación de layout, componentes atómicos, jerarquía visual y microcopys persuasivos.

---

### PANTALLA 1: ONBOARDING / ACCESO & POSICIONAMIENTO
**Objetivo**: Establecer la categoría inmediatamente. El líder debe sentir que llegó a un lugar profesional y confidencial, no a otra app de autoayuda.

```
┌────────────────────────────────────────────────────────┐
│ [12:00]                                     📶 🔋 100% │
├────────────────────────────────────────────────────────┤
│                                                        │
│                     [ M C ]                            │
│                 MEJORA CONTINUA                        │
│                                                        │
│   ──────────────────────────────────────────────────   │
│                                                        │
│        "EL NEGOCIO NO PUEDE DEPENDER DE QUE            │
│         ESTÉS ENCIMA LAS 24 HORAS DEL DÍA."            │
│                                                        │
│   La plataforma estratégica confidencial para CEOs     │
│   y dueños de empresas que buscan autonomía, orden     │
│   y crecimiento real.                                  │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │ ⚡ DESCUBRÍ TU FRENO REAL EN 3 MINUTOS         │   │
│   │                                                │   │
│   │ [ HACER EL MIRROR ESTRATÉGICO (GRATIS) → ]     │   │
│   └────────────────────────────────────────────────┘   │
│                                                        │
│   ─────────────── o si ya sos miembro ──────────────   │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │ [ Iniciar Sesión con Google ]                  │   │
│   └────────────────────────────────────────────────┘   │
│   ┌────────────────────────────────────────────────┐   │
│   │ [ Ingresar con Correo y Contraseña ]           │   │
│   └────────────────────────────────────────────────┘   │
│                                                        │
│   🔒 Acceso encriptado de punta a punta.               │
│      Confidencialidad garantizada para decisores.      │
│                                                        │
└────────────────────────────────────────────────────────┘
```
**Componentes Clave**:
- **Manifiesto de Apertura**: Frase contundente que interpela la vulnerabilidad operativa del dueño.
- **Acción Primaria Libre de Fricción**: Acceso directo al diagnóstico antes de obligar a registrarse (principio de *Dan Ariely* y *Gary Vaynerchuk*).

---

### PANTALLA 2: EL MIRROR ESTRATÉGICO (DIAGNÓSTICO INTERACTIVO)
**Objetivo**: 8 preguntas quirúrgicas que desmantelan las justificaciones del líder y calculan con exactitud el cuello de botella.

```
┌────────────────────────────────────────────────────────┐
│ [← Atrás]          MIRROR ESTRATÉGICO         Paso 3/8 │
├────────────────────────────────────────────────────────┤
│ [████████████████░░░░░░░░░░░░░░░░░░░░░░] 37% completado│
├────────────────────────────────────────────────────────┤
│                                                        │
│ PREGUNTA 03                                            │
│                                                        │
│ Cuando un cliente importante te dice:                  │
│ "Está muy caro, haceme un descuento",                  │
│ ¿qué es lo que realmente sucede?                       │
│                                                        │
│ Tu respuesta más honesta, no la más prolija:           │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [A] Defiendo el precio con seguridad y argumentos. │ │
│ │     Rara vez cedo; no regalo nuestro trabajo.      │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [B] Explico el valor, pero si insisten termino     │ │
│ │     bajando el margen para no perder la cuenta.    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [C] Siento inseguridad. Suelo dar descuentos       │ │
│ │     rápidamente porque temo que se vayan con otro. │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [D] No tenemos política clara de precios ni valor  │ │
│ │     diferencial. Cobramos lo que podemos pelear.   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ 💡 Tus respuestas son estrictamente anónimas.          │
│                                                        │
└────────────────────────────────────────────────────────┘
```
**Dinámica de UX**:
- Opciones formateadas con etiquetas de claridad inmediata.
- Retroalimentación háptica al seleccionar.
- Sin distracciones visuales: foco absoluto en la introspección del directivo (*Don't Make Me Think*).

---

### PANTALLA 3: RESULTADOS DEL MIRROR — EL ESPEJO BRUTAL
**Objetivo**: Provocar el momento "Aha!" del usuario. Revelar el arquetipo, el costo de no actuar y la puerta de entrada a la solución.

```
┌────────────────────────────────────────────────────────┐
│ [ Compartir ]     INFORME DE DIAGNÓSTICO     [ Guardar]│
├────────────────────────────────────────────────────────┤
│                                                        │
│   RESULTADO DE TU DIAGNÓSTICO:                         │
│   ┌────────────────────────────────────────────────┐   │
│   │ 🔴 ARQUETIPO: "LÍDER SATURADO"                 │   │
│   │                                                │   │
│   │ "Trabajás el doble que cualquiera, pero ganás  │   │
│   │  la mitad de lo que tu empresa debería darte." │   │
│   └────────────────────────────────────────────────┘   │
│                                                        │
│   EL ESPEJO DE TU REALIDAD ACTUAL:                     │
│   • "Si mañana te ausentás 15 días, el negocio cae     │
│      en un caos operativo que te obliga a volver."     │
│   • "Tus decisiones comerciales se basan en urgencias │
│      de caja y no en rentabilidad proyectada."         │
│   • "Tu equipo depende de tu visto bueno hasta para    │
│      resolver tareas elementales."                     │
│                                                        │
│   PUNTOS CRÍTICOS DETECTADOS:                          │
│   [ Autonomía: 22% ] [ Ventas: 48% ] [ Equipo: 35% ]   │
│                                                        │
│   ──────────────────────────────────────────────────   │
│                                                        │
│   TU PLAN DE SALIDA INMEDIATO:                         │
│   1. Protocolizar la toma de decisiones secundarias.   │
│   2. Eliminar el descuento automático por objeción.    │
│   3. Integrarte a una mesa de líderes que ya pasaron   │
│      por este cuello de botella y lo resolvieron.      │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │ ⭐ DESBLOQUEÁ TU PLAN COMPLETO EN LA RED       │   │
│   │                                                │   │
│   │ Unite hoy como Miembro N1 ($50.000 ARS/mes)    │   │
│   │ y consultá directamente tu caso en el Muro VIP.│   │
│   │                                                │   │
│   │ [ ACCEDER A LA RED DE LÍDERES AHORA → ]        │   │
│   └────────────────────────────────────────────────┘   │
│                                                        │
└────────────────────────────────────────────────────────┘
```
**Estrategia Psicológica**:
- El diagnóstico no es un castigo, es un alivio: le da nombre a lo que el líder sentía en silencio.
- La membresía se presenta no como un gasto, sino como la **solución natural al freno detectado** (*Value Proposition Design*).

---

### PANTALLA 4: HOME DASHBOARD EJECUTIVO (EL CENTRO DE COMANDO)
**Objetivo**: El punto de contacto diario. Muestra el estado del negocio, alertas relevantes y acceso directo a las herramientas según el nivel de membresía.

```
┌────────────────────────────────────────────────────────┐
│ 👤 [Foto] Carlos Benítez        [🔔 2]   [N1 MIEMBRO ⭐]│
├────────────────────────────────────────────────────────┤
│                                                        │
│ Buen día, Carlos.                                      │
│ Foco estratégico de esta semana: Delegación Comercial. │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🎯 TU ESTADO ACTUAL: LÍDER SATURADO                │ │
│ │ Meta activa: Reducir 5 horas operativas por semana │ │
│ │ [ Ver evolución de métricas → ]                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ACCIONES RÁPIDAS DEL LÍDER                             │
│ ┌───────────────┐ ┌───────────────┐ ┌────────────────┐ │
│ │ 💬            │ │ 🤖            │ │ 🏛️             │ │
│ │ Nueva         │ │ Mentor IA     │ │ Directorio     │ │
│ │ Consulta Muro │ │ Estratégico   │ │ de Miembros    │ │
│ └───────────────┘ └───────────────┘ └────────────────┘ │
│                                                        │
│ ────────────────────────────────────────────────────── │
│ DISCUSIONES CANDENTES EN EL MURO (HOY)                 │
│                                                        │
│ 🔒 Anónimo #418 • Hace 2 horas                         │
│ "¿Cómo lidian con un gerente clave que no quiere       │
│  adaptarse a la digitalización de los procesos?"       │
│ 💬 14 respuestas de directores • 💡 3 soluciones       │
│ [ Leer y participar → ]                                │
│                                                        │
│ 🔒 Anónimo #412 • Hace 5 horas                         │
│ "Estrategias reales para cobrar a 30 días cuando las   │
│  grandes cadenas te imponen 90 días de pago."          │
│ 💬 22 respuestas de pares                              │
│                                                        │
│ ────────────────────────────────────────────────────── │
│ UPGRADE DISPONIBLE:                                    │
│ 👑 ¿Necesitás alianzas directas con CEOs?              │
│ [ Descubrí el Círculo Dorado N2 ]                      │
│                                                        │
├────────────────────────────────────────────────────────┤
│ [🏠 Inicio]  [💬 Muro]  [🤖 Mentor]  [👑 Círculo] [👤 Perfil]
└────────────────────────────────────────────────────────┘
```
**Arquitectura de Navegación**:
- Barra de navegación inferior persistente de 5 iconos (*BottomNav*).
- Acceso prioritario al Muro y al Mentor.
- Anclaje constante a la membresía activa y ruta de upgrade contextual.

---

### PANTALLA 5: EL MURO DE LÍDERES (ESPACIO CONFIDENCIAL ANÓNIMO)
**Objetivo**: Generar el efecto de comunidad y hábito (*Hooked*). Los usuarios plantean problemas reales sin temor a dañar la reputación de sus marcas.

```
┌────────────────────────────────────────────────────────┐
│ EL MURO DE LÍDERES           [🔍 Buscar] [ + Consultar]│
├────────────────────────────────────────────────────────┤
│ [ Todos ]  [ Finanzas ]  [ Equipo ]  [ Comercial ] [ Crisis ]
├────────────────────────────────────────────────────────┤
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 👤 CEO Industria Metalúrgica (PBA) • N2            │ │
│ │ Hace 45 min • 🏷️ Conflictos de Socios              │ │
│ │                                                    │ │
│ │ "Somos 3 socios igualitarios. Uno de ellos dejó de │ │
│ │  aportar operativamente hace 8 meses pero sigue    │ │
│ │  retirando el mismo dividendo. La tensión está     │ │
│ │  destruyendo el clima. ¿Cómo encararon ustedes una │ │
│ │  salida sin quebrar la sociedad?"                  │ │
│ │                                                    │ │
│ │ 💬 8 Respuestas de Socios Fundadores               │ │
│ │ 🛡️ Caso moderado por Comité Estratégico             │ │
│ │                                                    │ │
│ │ [ Ver Respuestas / Aportar Solución → ]            │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 👤 Director Distribuidora Consumo Masivo • N1      │ │
│ │ Hace 3 horas • 🏷️ Presión Fiscal & Precios          │ │
│ │                                                    │ │
│ │ "Aumento del 18% en costos logísticos esta semana. │ │
│ │  ¿Trasladan todo a lista o absorben parte para no  │ │
│ │  perder volumen en el canal mayorista?"            │ │
│ │                                                    │ │
│ │ 💬 19 Respuestas • 📊 Votación de pares:           │ │
│ │    • 65% Traslada directo                          │ │
│ │    • 35% Renegocia con proveedores                 │ │
│ │                                                    │ │
│ │ [ Ver Análisis Completo → ]                        │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
├────────────────────────────────────────────────────────┤
│ [🏠 Inicio]  [💬 Muro]  [🤖 Mentor]  [👑 Círculo] [👤 Perfil]
└────────────────────────────────────────────────────────┘
```
**Reglas del Muro**:
- Moderación automática vía Edge Function con IA para garantizar el tono profesional y constructivo.
- Identidad anónima protegida por alias ejecutivo verificado (ej. "Director Logística, 120 empleados").
- Respuestas de alto calibre sin ruido publicitario ni venta encubierta.

---

### PANTALLA 6: MENTOR IA ESTRATÉGICO (EL COPILOTO EJECUTIVO)
**Objetivo**: Brindar asesoría táctica inmediata basada en el perfil de diagnóstico del usuario, libros clave de gestión y marcos probados.

```
┌────────────────────────────────────────────────────────┐
│ [←]               MENTOR ESTRATÉGICO            [⚙️ Info]│
│ Contexto activo: Carlos B. | Perfil: Saturado | Nivel 1│
├────────────────────────────────────────────────────────┤
│                                                        │
│ 🤖 MENTOR IA                                   10:14 AM│
│ Carlos, según tu último Mirror, tu principal fuga de   │
│ tiempo está en la aprobación de presupuestos de venta. │
│ ¿Querés que armemos una matriz de delegación con      │
│ límites de descuento para que tus vendedores no te     │
│ consulten cada operación?                              │
│                                                        │
│ 👤 CARLOS B.                                   10:15 AM│
│ Sí, justamente tengo una vendedora que me pide         │
│ autorización para bajar 12% en una cuenta grande.      │
│ No sé si dárselo.                                      │
│                                                        │
│ 🤖 MENTOR IA                                   10:15 AM│
│ No lo apruebes todavía. Apliquemos el principio de     │
│ valor de Osterwalder y la regla de negociación:        │
│                                                        │
│ 1. Si bajas 12% de precio, necesitás vender un 28% más │
│    de volumen para mantener la misma ganancia bruta.   │
│ 2. En lugar de bajar precio, ofrecé mejorar el plazo   │
│    de entrega o sumar un servicio complementario sin   │
│    costo marginal para vos.                            │
│ 3. Preguntale al cliente: "¿Qué necesitarían además    │
│    del precio para cerrar la operación hoy mismo?"     │
│                                                        │
│ ¿Querés que te redacte el mensaje exacto de WhatsApp   │
│ para responderle a tu vendedora?                       │
│                                                        │
├────────────────────────────────────────────────────────┤
│ [ Escribí tu consulta ejecutiva aquí...          ] [↑] │
├────────────────────────────────────────────────────────┤
│ [🏠 Inicio]  [💬 Muro]  [🤖 Mentor]  [👑 Círculo] [👤 Perfil]
└────────────────────────────────────────────────────────┘
```
**Diferenciales de la IA**:
- No es un ChatGPT genérico: tiene memoria del diagnóstico del usuario (*Context Injection*).
- Respuestas directas, concisas y orientadas a la acción (Mentalidad Sun Tzu / Drucker).
- Streaming en tiempo real vía Server-Sent Events (SSE).

---

### PANTALLA 7: CÍRCULO DORADO & MESA DE ALIANZAS (N2 EXCLUSIVO)
**Objetivo**: Justificar el ticket de $150.000 ARS/mes. Networking directo entre decisores de alto calibre y botón de auxilio inmediato.

```
┌────────────────────────────────────────────────────────┐
│ 👑 CÍRCULO DORADO                [ Nivel N2 Activo ⭐ ]│
├────────────────────────────────────────────────────────┤
│ La Red Privada de CEOs y Directores Generales          │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🚨 BOTÓN DE EMERGENCIA EMPRESARIAL                 │ │
│ │                                                    │ │
│ │ ¿Crisis operativa, fiscal o de socios inminente?   │ │
│ │ Activá un llamado urgente directo con un consultor │ │
│ │ senior del equipo de Mejora Continua en < 60 min.  │ │
│ │                                                    │ │
│ │ [ ACTIVAR ASISTENCIA DE EMERGENCIA ]               │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ MESA DE ALIANZAS C-LEVEL                               │
│ Oportunidades estratégicas validadas entre pares:      │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🤝 Búsqueda de Alianza de Distribución             │ │
│ │ Fabricante de Maquinaria Agro • Facturación Cat. 4 │ │
│ │ "Buscamos socio logístico con depósitos en Rosario │ │
│ │  y Córdoba para optimizar entregas de repuestos."  │ │
│ │ [ Solicitar Conexión Directa → ]                   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🤝 Ronda de Inversión Privada / Joint Venture      │ │
│ │ Empresa de Soluciones SaaS B2B • EBITDA Positivo   │ │
│ │ "Buscamos socio estratégico del rubro retail."     │ │
│ │ [ Ver Ficha Confidencial → ]                       │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ PRÓXIMO ENCUENTRO PRESENCIAL EXCLUSIVO                 │
│ 📅 Cena de Trabajo Círculo Dorado: "Proyecciones 2027"│
│ 📍 Hotel Alvear, CABA • 28 de Noviembre • Cupo: 20 CEOs│
│ [ Confirmar Asistencia VIP ]                           │
│                                                        │
├────────────────────────────────────────────────────────┤
│ [🏠 Inicio]  [💬 Muro]  [🤖 Mentor]  [👑 Círculo] [👤 Perfil]
└────────────────────────────────────────────────────────┘
```
**Valor Incomparable**:
- El botón de emergencia actúa como un seguro para el negocio.
- La Mesa de Alianzas genera retorno de inversión inmediato: una sola alianza cerrada paga años de suscripción.

---

## 6. ARQUITECTURA TÉCNICA LIMPIA (CLEAN ARCHITECTURE + SUPABASE)

Siguiendo a **Uncle Bob Martin** y **Eric Evans**:

```
┌──────────────────────────────────────────────────────────────────┐
│                           UI LAYER                               │
│  React 18 + Tailwind + shadcn/ui + Framer Motion (Transiciones) │
│  (Vistas puramente declarativas, desacopladas de la persistencia)│
└─────────────────────────────────┬────────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────────┐
│                       APPLICATION LAYER                          │
│  Hooks Personalizados (`useMembership`, `useMirror`, `useWall`)  │
│  Validación de Frontera con Zod (`diagnosticSchema`, etc.)      │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────────┐
│                         DOMAIN LAYER                             │
│  Modelos Puros y Reglas de Negocio (Sin dependencias externas)   │
│  `DiagnosticProfile`, `MembershipLevel`, `WallPost`, `Alliance` │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────────┐
│                     INFRASTRUCTURE LAYER                         │
│  Supabase (PostgreSQL, Auth PKCE, Realtime, Storage)             │
│  Edge Functions Deno (Moderación IA, Tiendup Sync, Webhooks)     │
│  Vercel Edge Network (Deploy PWA global)                         │
└──────────────────────────────────────────────────────────────────┘
```

### 6.1. Esquema de Base de Datos Optimizado
1. `profiles`: Datos de usuario, `access_level` (`N0`, `N1`, `N2`, `ADMIN`), empresa, rubro, antigüedad y perfil Mirror.
2. `diagnostic_submissions`: Histórico de diagnósticos con cálculo de puntajes por dimensión (Autonomía, Ventas, Equipo, Visión).
3. `wall_posts`: Consultas del muro con soporte para anonimato, etiquetas de industria y estado de moderación.
4. `wall_comments`: Respuestas e hilos colaborativos con insignias de jerarquía directiva.
5. `alliances`: Solicitudes y ofertas de alianzas estratégicas para el Círculo Dorado.
6. `emergency_tickets`: Registro y auditoría de alertas activadas por el botón de emergencia.

---

## 7. PLAN DE IMPLEMENTACIÓN Y TRANSICIÓN ÓPTIMA

```
FASE 1: CONSOLIDACIÓN DEL CORE (Días 1 a 15)
├── Corregir mojibake y pulir copies del Mirror Estratégico (src/data/)
├── Desplegar el nuevo flujo visual de 8 preguntas con microanimaciones
└── Implementar reporte interactivo de resultados con CTA de membresía

FASE 2: LA RED & CONVERSIÓN (Días 16 a 30)
├── Habilitar el Muro Anónimo con categorización temática
├── Sincronizar pasarela de pago Tiendup (Webhooks de N1 y N2)
└── Configurar el Mentor IA con inyección de contexto de diagnóstico

FASE 3: CÍRCULO DORADO & ALTO VALOR (Días 31 a 45)
├── Lanzar la Mesa de Alianzas exclusiva N2
├── Implementar el Botón de Emergencia con notificación directa
└── Organizar el primer evento de networking de alto impacto
```

---

## 8. CONCLUSIÓN: LA PROPUESTA DE VALOR DEFINITIVA

Esta propuesta no improvisa: toma la sabiduría acumulada de los mayores estrategas del mundo empresarial (Drucker, Kim & Mauborgne, Moore, Osterwalder, Cagan) y los principios más depurados del desarrollo de software y diseño visual (Uncle Bob, Brad Frost, Wathan & Schoger, Don Norman).

El resultado es un **producto con alma, con modelo de negocio incuestionable y con una experiencia que cautiva a los líderes desde el primer segundo**.
