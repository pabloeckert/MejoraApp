/**
 * diagnosticData.ts — Motor canónico del Mirror Estratégico (8 Perfiles PyME)
 * Sincronizado 100% con c:\github\MejoraDiagnostico
 */

export type Area = "personal" | "organizacional" | "comercial" | "empresarial";
export type Scores = Record<Area, number>;

export type RespuestaPosicion = "fundador" | "heredero" | "gerente";

export type PerfilKey =
  | "SATURADO"
  | "LIDER_QUE_NECESITA_APOYO"
  | "INDEPENDIENTE_EN_CRECIMIENTO"
  | "EQUIPO_DESALINEADO"
  | "ESCEPTICO"
  | "NUEVA_GENERACION"
  | "AREA_COMERCIAL_SIN_RESULTADOS"
  | "SIN_PROFESIONALIZAR_LA_EMPRESA";

export interface DiagnosticOption {
  label: string;
  text: string;
  score: number;
}

export interface DiagnosticQuestion {
  id: number;
  title: string;
  sub: string;
  areaDominante: Area;
  areaSecundaria: Area;
  opts: DiagnosticOption[];
}

export interface DiagnosticProfile {
  tag: string;
  ref: string;
  desc: string;
  verdad: string;
  cierreTitulo: string;
  cierreTxt: string;
  cta: string;
  waMsg: string;
  saludo: string;
  // Campos de compatibilidad con vistas y export PDF existentes
  tagline: string;
  color: string;
  mirror: string[];
  symptoms: string[];
  ctaTitle: string;
  ctaText: string;
}

export const NOMBRES_AREA: Record<Area, string> = {
  personal: "Desarrollo Personal",
  organizacional: "Desarrollo Organizacional",
  comercial: "Desarrollo Comercial",
  empresarial: "Desarrollo Empresarial",
};

export function areasParaMostrar(scores: Scores): { nombre: string; porcentaje: number }[] {
  return (Object.keys(scores) as Area[]).map((area) => ({
    nombre: NOMBRES_AREA[area],
    porcentaje: scores[area],
  }));
}

export function zonaColor(p: number): { zona: string; color: string } {
  if (p < 40) return { zona: "Crítico", color: "#E1061E" };
  if (p < 65) return { zona: "En desarrollo", color: "#F7CC13" };
  return { zona: "Sólido", color: "#1A3D84" };
}

export const WA_NUMBER = "5493764223400";

export const PREGUNTAS_BASE = [
  {
    id: 1,
    title: "Si no estás, ¿qué se detiene?",
    sub: "Pensá en la última vez que te fuiste de vacaciones o te enfermaste.",
    areaDominante: "organizacional" as Area,
    areaSecundaria: "personal" as Area,
    opts: [
      { label: "D", text: "Todo se para", score: 1 },
      { label: "C", text: "Se complica bastante", score: 2 },
      { label: "B", text: "Hay algunos roces, pero sigue", score: 3 },
      { label: "A", text: "Funciona igual que si estoy", score: 4 },
    ],
  },
  {
    id: 2,
    title: "De tu facturación de este mes, ¿cuánto depende de 1 o 2 clientes grandes?",
    sub: "Si esos dos te dejaran de comprar mañana, ¿qué pasa con la empresa?",
    areaDominante: "comercial" as Area,
    areaSecundaria: "empresarial" as Area,
    opts: [
      { label: "D", text: "Casi todo. Si se van, estamos en problemas serios", score: 1 },
      { label: "C", text: "Una parte grande, me preocupa", score: 2 },
      { label: "B", text: "Algo, pero tengo otros clientes para sostenerme", score: 3 },
      { label: "A", text: "Poco, la cartera está bien repartida", score: 4 },
    ],
  },
  {
    id: 3,
    title: "Cuando un cliente importante pide condiciones que no te convienen, ¿qué hacés?",
    sub: "La negociación real, no la que contás después.",
    areaDominante: "comercial" as Area,
    areaSecundaria: "personal" as Area,
    opts: [
      { label: "D", text: "Cedo, no quiero perderlo", score: 1 },
      { label: "C", text: "Cedo casi siempre, después me arrepiento", score: 2 },
      { label: "B", text: "Negocio, a veces gano, a veces no", score: 3 },
      { label: "A", text: "Tengo criterio claro y lo sostengo", score: 4 },
    ],
  },
  {
    id: 4,
    title: "¿Tu equipo tira para el mismo lado?",
    sub: "No el que querés tener. El que tenés hoy.",
    areaDominante: "organizacional" as Area,
    areaSecundaria: "personal" as Area,
    opts: [
      { label: "D", text: "Cada uno interpreta a su manera", score: 1 },
      { label: "C", text: "Hay roces silenciosos", score: 2 },
      { label: "B", text: "Más o menos", score: 3 },
      { label: "A", text: "Sí, hay alineación real", score: 4 },
    ],
  },
  {
    id: 5,
    title: "¿Cuántas veces resolvés el mismo problema?",
    sub: "Pensá en las últimas dos semanas.",
    areaDominante: "empresarial" as Area,
    areaSecundaria: "organizacional" as Area,
    opts: [
      { label: "D", text: "Siempre los mismos, hay que explicar y volver a explicar", score: 1 },
      { label: "C", text: "Con frecuencia, tranquilo", score: 2 },
      { label: "B", text: "A veces, aprendemos lento", score: 3 },
      { label: "A", text: "Raramente se repiten", score: 4 },
    ],
  },
  {
    id: 6,
    title: "¿Quién maneja la relación comercial con tus clientes principales?",
    sub: "No quién debería. Quién realmente atiende esa llamada.",
    areaDominante: "comercial" as Area,
    areaSecundaria: "empresarial" as Area,
    opts: [
      { label: "D", text: "Yo, siempre yo", score: 1 },
      { label: "C", text: "Yo, pero ya no debería ser así", score: 2 },
      { label: "B", text: "Alguien del equipo, pero recurre a mí seguido", score: 3 },
      { label: "A", text: "Mi equipo, yo ya no intervengo", score: 4 },
    ],
  },
  {
    id: 7,
    title: "¿Ves tu negocio en 3 años?",
    sub: "No la respuesta correcta. La real.",
    areaDominante: "empresarial" as Area,
    areaSecundaria: "personal" as Area,
    opts: [
      { label: "D", text: "Voy viendo sobre la marcha", score: 1 },
      { label: "C", text: "Tengo alguna idea vaga", score: 2 },
      { label: "B", text: "La tengo clara, pero sin ejecutar ni bajarla", score: 3 },
      { label: "A", text: "Tengo un plan concreto, bajado y funcionando", score: 4 },
    ],
  },
  {
    id: 8,
    title: "Si subieras tus precios un 20% mañana, ¿qué pasa?",
    sub: "La respuesta real, no la que te gustaría dar.",
    areaDominante: "comercial" as Area,
    areaSecundaria: "empresarial" as Area,
    opts: [
      { label: "D", text: "Pierdo la mitad de mis clientes", score: 1 },
      { label: "C", text: "Pierdo algunos clientes, me asusta probarlo", score: 2 },
      { label: "B", text: "Algunos clientes se van, pero se compensa", score: 3 },
      { label: "A", text: "Ningún cliente se mueve, ya lo hice antes", score: 4 },
    ],
  },
];

export const BANCO_PREGUNTAS: DiagnosticQuestion[] = PREGUNTAS_BASE;

export const PREGUNTA_POSICION = {
  id: 9,
  title: "¿Quién fundó esta empresa?",
  sub: "La respuesta más simple para contextualizar tu rol de liderazgo.",
  areaDominante: "personal" as Area,
  areaSecundaria: "organizacional" as Area,
  opts: [
    { label: "A", text: "Yo la fundé", valor: "fundador" as RespuestaPosicion, score: 3 },
    { label: "B", text: "La heredé de mi familia (2°, 3° generación o más)", valor: "heredero" as RespuestaPosicion, score: 2 },
    { label: "C", text: "Soy gerente/socio, no la fundé ni la heredé", valor: "gerente" as RespuestaPosicion, score: 2 },
  ],
};

export const PERFILES: Record<string, DiagnosticProfile> = {
  SATURADO: {
    tag: "Saturado",
    ref: "TRABAJÁS MUCHO. PERO VÁS EN CÍRCULOS.",
    desc: "Tu problema no es el tiempo. Es el foco. Estás tan adentro del ruido que no podés ver el mapa. Vivís apagando incendios, sentís que si no empujás, nada avanza.",
    verdad: "No sabés dónde está el cuello de botella. Y eso es exactamente lo que te tiene corriendo en círculos.",
    cierreTitulo: "EL CAOS NO SE AGUANTA. SE ORDENA.",
    cierreTxt: "¿Te describe? Juntémonos y veamos dónde está ese cuello de botella.",
    cta: "DALE →",
    waMsg: "Hola, hice el diagnóstico en Mejora Continua y soy Saturado. Me gustaría ordenarme.",
    saludo: "[nombre], lo que sentís tiene nombre. Y no es falta de esfuerzo.",
    tagline: "TRABAJÁS MUCHO. PERO VÁS EN CÍRCULOS.",
    color: "#E1061E",
    mirror: [
      '"Si no estoy encima, nada avanza."',
      '"Termino el día agotado y no sé qué hice de estratégico."',
      '"Apagar incendios se volvió mi rutina diaria."',
    ],
    symptoms: [
      "Todo el flujo operativo converge en vos",
      "Dificultad para delegar con predictibilidad",
      "Urgencias constantes desplazan lo importante",
    ],
    ctaTitle: "EL CAOS NO SE AGUANTA. SE ORDENA.",
    ctaText: "El problema no es de capacidad, sino de cuello de botella operativo. Ordenémoslo juntos.",
  },
  LIDER_QUE_NECESITA_APOYO: {
    tag: "El Líder sin Herramientas",
    ref: "TODO PASA POR VOS. Y NO ES PORQUE QUIERAS.",
    desc: "Tenés equipo, tenés estructura. Pero cada decisión, cada problema, cada 'che, esto cómo lo resuelvo' — termina en vos. No es que no confíes. Es que nadie te dio las herramientas para que funcione distinto.",
    verdad: "No te falta carácter. Te falta un sistema y el criterio para usarlo. Eso no se aprende solo, mirando.",
    cierreTitulo: "NO PODÉS SEGUIR SOSTENIENDO TODO SOLO.",
    cierreTxt: "Esto se resuelve con herramientas concretas, no con más esfuerzo de tu parte. Armamos el sistema para que el negocio funcione aunque no estés mirando cada cosa.",
    cta: "QUIERO LAS HERRAMIENTAS →",
    waMsg: "Hola, hice el diagnóstico en Mejora Continua y soy El Líder sin Herramientas. Necesito un sistema para no sostener todo yo.",
    saludo: "[nombre], lo que cargás tiene nombre. Y se resuelve con herramientas, no con más esfuerzo.",
    tagline: "TODO PASA POR VOS. Y NO ES PORQUE QUIERAS.",
    color: "#1A3D84",
    mirror: [
      '"Tengo gente pero igual decido todo yo."',
      '"No tengo tiempo de diseñar procesos."',
      '"Si no controlo, las cosas salen a medias."',
    ],
    symptoms: [
      "Falta de protocolos claros de delegación",
      "Cuello de botella en la toma de decisiones diarias",
      "Desgaste por supervisión microoperativa",
    ],
    ctaTitle: "NO PODÉS SEGUIR SOSTENIENDO TODO SOLO.",
    ctaText: "Armamos el sistema para que tu negocio funcione con autonomía real.",
  },
  INDEPENDIENTE_EN_CRECIMIENTO: {
    tag: "El que Vale Más de lo que Cobra",
    ref: "TU TRABAJO VALE. TU FACTURACIÓN NO LO REFLEJA.",
    desc: "Hacés las cosas bien. Tenés criterio, experiencia, resultados. Pero a la hora de cobrar lo que valés, o de posicionarte como corresponde, algo te frena. Competís por precio sin querer, o esperás que el mercado te reconozca solo.",
    verdad: "No te falta nivel. Te falta el posicionamiento y la estrategia para que ese nivel se refleje en lo que cobrás.",
    cierreTitulo: "TU VALOR EXISTE. FALTA LA ESTRATEGIA PARA COBRARLO.",
    cierreTxt: "Esto se ordena con posicionamiento real y acciones concretas. Vemos cómo te posicionás y cómo eso se traduce en resultados que se notan.",
    cta: "SÍ, QUIERO VERLO →",
    waMsg: "Hola, hice el diagnóstico en Mejora Continua y soy El que Vale Más de lo que Cobra. Quiero trabajar mi posicionamiento.",
    saludo: "[nombre], tu nivel es real. Lo que falta es la estrategia para que se vea — y lo paguen.",
    tagline: "TU TRABAJO VALE. TU FACTURACIÓN NO LO REFLEJA.",
    color: "#F7CC13",
    mirror: [
      '"Sé que entrego valor brutal, pero me da miedo subir precios."',
      '"A veces cedo en presupuestos por no perder clientes."',
      '"El mercado no termina de ver la diferencia de mi servicio."',
    ],
    symptoms: [
      "Precios por debajo del valor real entregado",
      "Falta de blindaje contra objeciones de costo",
      "Captación dependiente de recomendaciones azarosas",
    ],
    ctaTitle: "TU VALOR EXISTE. FALTA LA ESTRATEGIA PARA COBRARLO.",
    ctaText: "Construyamos la propuesta de valor y el posicionamiento que defienda tus márgenes.",
  },
  EQUIPO_DESALINEADO: {
    tag: "El Equipo Desalineado",
    ref: "TRABAJAN, TRABAJAN. PERO NO AVANZAN.",
    desc: "Hay energía, hay compromiso. Pero cada uno interpreta a su manera. El resultado: reuniones que no definen nada, tareas duplicadas, y un desgaste silencioso que se acumula.",
    verdad: "El problema no es tu equipo. Es que les das órdenes, no dirección. Y sin dirección, cada uno arma su propia versión del trabajo.",
    cierreTitulo: "MALA NOTICIA: EL DESORDEN NO ES DEL EQUIPO. ES DE LA DIRECCIÓN.",
    cierreTxt: "Si tu equipo está así, hay algo que tenés que hacer esta semana. Una conversación para encontrar el sentido y los objetivos claros.",
    cta: "QUIERO QUE TIREMOS PARA EL MISMO LADO →",
    waMsg: "Hola, hice el diagnóstico en Mejora Continua y tengo un Equipo Desalineado. Quiero alinearlo.",
    saludo: "[nombre], el problema no es tu equipo. Es que nadie les explicó hacia dónde van.",
    tagline: "TRABAJAN, TRABAJAN. PERO NO AVANZAN.",
    color: "#E1061E",
    mirror: [
      '"Todos trabajan pero reman en direcciones distintas."',
      '"Reuniones eternas donde nada queda resuelto."',
      '"Las órdenes se interpretan de cualquier manera."',
    ],
    symptoms: [
      "Falta de alineación en metas trimestrales",
      "Roces silenciosos y desgaste interáreas",
      "Doble esfuerzo para un mismo resultado",
    ],
    ctaTitle: "EL DESORDEN NO ES DEL EQUIPO. ES DE LA DIRECCIÓN.",
    ctaText: "Instalemos tableros de dirección y reglas de juego claras para todo el equipo.",
  },
  ESCEPTICO: {
    tag: "El Empresario Escéptico",
    ref: "TENÉS GENTE. TENÉS ESTRUCTURA. Y ALGO NO CIERRA.",
    desc: "Pagás por cosas que no estás seguro de que sirvan. Tu entorno opina, pero parece que nunca le pega en el blanco. Sospechás que estás mal informado.",
    verdad: "No es que no sepas decidir. Es que tomás decisiones sin un criterio externo que las contraste — y por eso cada elección se siente como una apuesta.",
    cierreTitulo: "LA SOSPECHA TIENE NOMBRE.",
    cierreTxt: "Si te incomoda, pasa algo. Hablemos francamente. De lo que está pasando, de lo que no te cierra.",
    cta: "QUIERO LA VERDAD →",
    waMsg: "Hola, hice el diagnóstico en Mejora Continua y soy El Empresario Escéptico. Quiero una conversación honesta.",
    saludo: "[nombre], tu instinto de que algo no cierra — es correcto.",
    tagline: "TENÉS GENTE. TENÉS ESTRUCTURA. Y ALGO NO CIERRA.",
    color: "#6B7280",
    mirror: [
      '"Pago sueldos y consultores pero no sé si rinde."',
      '"Tomo decisiones a ciegas o por intuición."',
      '"Nadie en la empresa me dice la verdad sin filtro."',
    ],
    symptoms: [
      "Sensación de aislamiento en la cúpula",
      "Falta de auditoría de procesos reales vs percibidos",
      "Duda sobre la rentabilidad de las inversiones actuales",
    ],
    ctaTitle: "LA SOSPECHA TIENE NOMBRE.",
    ctaText: "Una mirada externa e independiente de pares para auditar la verdad de tu operación.",
  },
  NUEVA_GENERACION: {
    tag: "Carga la Responsabilidad, pero No la Autoridad",
    ref: "RESPONDÉS POR TODO. PERO TODAVÍA NO TE TERMINAN DE ESCUCHAR.",
    desc: "Tenés el cargo, la responsabilidad, las horas puestas. Pero las decisiones importantes siguen pasando por otro lado, o tenés que convencer cada vez que tu criterio vale. Estás en el medio: no te sueltan, pero tampoco te dan el lugar completo.",
    verdad: "Te sobra preparación. Lo que falta es que tu rol pese lo mismo que ya pesa tu trabajo. Y eso se construye, no se espera.",
    cierreTitulo: "NO PEDÍS MÁS DE LO QUE TE CORRESPONDE.",
    cierreTxt: "Esto se trabaja con estrategia de posicionamiento interno — cómo hacer que tu rol pese lo que tu trabajo ya pesa. ¿Lo ordenamos?",
    cta: "SÍ, ORDENEMOSLO →",
    waMsg: "Hola, hice el diagnóstico en Mejora Continua y siento que tengo la responsabilidad pero no la autoridad. Quiero trabajar esto.",
    saludo: "[nombre], tu trabajo ya pesa. Ahora falta que tu rol pese igual.",
    tagline: "RESPONDÉS POR TODO. PERO TODAVÍA NO TE TERMINAN DE ESCUCHAR.",
    color: "#1A3D84",
    mirror: [
      '"Tengo que dar explicaciones de cada innovación que propongo."',
      '"Cargo con los problemas pero las decisiones las frena otro."',
      '"Quiero profesionalizar la empresa y chocan con las costumbres familiares."',
    ],
    symptoms: [
      "Fricción en la transición generacional",
      "Falta de autonomía decisoria formal",
      "Desgaste emocional entre rol familiar y profesional",
    ],
    ctaTitle: "NO PEDÍS MÁS DE LO QUE TE CORRESPONDE.",
    ctaText: "Estrategia de gobierno corporativo y legitimación de liderazgo basada en resultados.",
  },
  AREA_COMERCIAL_SIN_RESULTADOS: {
    tag: "El Área Comercial sin Resultados",
    ref: "PONÉS EL CUERPO. PONÉS EL ALMA. Y LA CAJA NO LO REFLEJA.",
    desc: "Vendés, te movés, intentás, probás. Pero cuando mirás la caja no ves los resultados que esperabas. Vivís en un péndulo: un día convencido, al otro listo para tirar todo.",
    verdad: "No tenés método ni procesos. Te faltan datos para tomar mejores decisiones — pero no sabés cuáles ni cómo obtenerlos.",
    cierreTitulo: "EL ESFUERZO SIN DIRECCIÓN ES DESGASTE.",
    cierreTxt: "Hay algo concreto para ordenar. No es magia, es claridad comercial. ¿Arrancamos?",
    cta: "SÍ, ARRANCAMOS →",
    waMsg: "Hola, hice el diagnóstico en Mejora Continua y soy El Área Comercial sin Resultados. Necesito claridad comercial.",
    saludo: "[nombre], el esfuerzo está. Lo que falta es que ese esfuerzo vaya en la dirección correcta.",
    tagline: "PONÉS EL CUERPO. PONÉS EL ALMA. Y LA CAJA NO LO REFLEJA.",
    color: "#E1061E",
    mirror: [
      '"Nos matamos trabajando pero la cuenta bancaria no sube."',
      '"Las ventas son una montaña rusa impredecible."',
      '"No sé cuál es el costo real de adquisición de clientes."',
    ],
    symptoms: [
      "Ventas artesanales sin pipeline predecible",
      "Dependencia extrema del dueño para cerrar acuerdos",
      "Falta de métricas de conversión comercial",
    ],
    ctaTitle: "EL ESFUERZO SIN DIRECCIÓN ES DESGASTE.",
    ctaText: "Estructuración de embudo comercial y defensa de precios sistemática.",
  },
  SIN_PROFESIONALIZAR_LA_EMPRESA: {
    tag: "La Empresa que Necesita Profesionalizarse",
    ref: "TENÉS TODO PARA DAR EL SALTO. Y AÚN NO LO DISTE.",
    desc: "La empresa funciona, factura, tiene años. Pero sigue operando con la lógica de cuando era más chica: procesos a medio hacer, roles que no están del todo definidos, decisiones que dependen de memoria y costumbre, no de sistema.",
    verdad: "Lo que construiste está bien. Lo que falta es dar el paso de profesionalizarlo, y ese paso lo venís postergando.",
    cierreTitulo: "LO QUE FUNCIONÓ HASTA ACÁ, NO ES SUFICIENTE PARA LO QUE SIGUE.",
    cierreTxt: "Profesionalizar no es complicar todo. Es poner sistema donde hoy hay costumbre. Armamos el plan para dar ese salto sin frenar lo que ya funciona.",
    cta: "QUIERO PROFESIONALIZAR →",
    waMsg: "Hola, hice el diagnóstico en Mejora Continua y necesito profesionalizar mi empresa. Quiero ver el plan.",
    saludo: "[nombre], lo que construiste está bien. Ahora toca el siguiente nivel: profesionalizarlo.",
    tagline: "TENÉS TODO PARA DAR EL SALTO. Y AÚN NO LO DISTE.",
    color: "#F7CC13",
    mirror: [
      '"El negocio creció pero seguimos trabajando como un taller chico."',
      '"Si no pongo sistemas, nos vamos a estrellar con el crecimiento."',
      '"Muchos roles superpuestos y nadie se hace cargo al final."',
    ],
    symptoms: [
      "Falta de manuales de funciones y KPIs objetivos",
      "Decisiones basadas en memoria de empleados antiguos",
      "Techo de escala operativo evidente",
    ],
    ctaTitle: "LO QUE FUNCIONÓ HASTA ACÁ, NO ES SUFICIENTE PARA LO QUE SIGUE.",
    ctaText: "Profesionalización modular de la operación para escalar sin caos.",
  },
  // Shims de compatibilidad para datos históricos guardados
  INVISIBLE: {
    tag: "El que Vale Más de lo que Cobra",
    ref: "TU TRABAJO VALE. TU FACTURACIÓN NO LO REFLEJA.",
    desc: "Tus clientes actuales te valoran, pero el mercado aún no percibe todo lo que valés.",
    verdad: "Te falta posicionamiento estratégico para cobrar lo que realmente vale tu entrega.",
    cierreTitulo: "TU VALOR EXISTE. FALTA LA ESTRATEGIA PARA COBRARLO.",
    cierreTxt: "Ordenemos tu propuesta de valor y tu estrategia comercial.",
    cta: "SÍ, QUIERO VERLO →",
    waMsg: "Hola, quiero ordenar mi posicionamiento comercial.",
    saludo: "[nombre], tu nivel es real. Falta que se pague.",
    tagline: "TU TRABAJO VALE. TU FACTURACIÓN NO LO REFLEJA.",
    color: "#F7CC13",
    mirror: ['"Cobro menos de lo que debería."'],
    symptoms: ["Competencia por precio", "Falta de diferenciación clara"],
    ctaTitle: "TU VALOR EXISTE. FALTA LA ESTRATEGIA PARA COBRARLO.",
    ctaText: "Ordenemos tu propuesta de valor.",
  },
  LIDER_SOLO: {
    tag: "El Líder sin Herramientas",
    ref: "TODO PASA POR VOS. Y NO ES PORQUE QUIERAS.",
    desc: "Cada decisión termina en tu escritorio por falta de herramientas de delegación.",
    verdad: "Se resuelve con sistemas y procesos claros, no con más horas de trabajo.",
    cierreTitulo: "NO PODÉS SEGUIR SOSTENIENDO TODO SOLO.",
    cierreTxt: "Armemos el sistema para que el negocio funcione con predictibilidad.",
    cta: "QUIERO LAS HERRAMIENTAS →",
    waMsg: "Hola, necesito herramientas para delegar efectivamente.",
    saludo: "[nombre], esto se resuelve con procesos.",
    tagline: "TODO PASA POR VOS. Y NO ES PORQUE QUIERAS.",
    color: "#1A3D84",
    mirror: ['"Si no estoy encima, nada sale bien."'],
    symptoms: ["Cuello de botella en dirección"],
    ctaTitle: "NO PODÉS SEGUIR SOSTENIENDO TODO SOLO.",
    ctaText: "Construyamos el sistema para delegar sin perder calidad.",
  },
  DESCONECTADO: {
    tag: "El Empresario Escéptico",
    ref: "TENÉS GENTE. TENÉS ESTRUCTURA. Y ALGO NO CIERRA.",
    desc: "La empresa funciona pero sentís que faltan datos objetivos para la toma de decisiones.",
    verdad: "Falta un tablero y un consejo externo que contraste la realidad con la intuición.",
    cierreTitulo: "LA SOSPECHA TIENE NOMBRE.",
    cierreTxt: "Revisemos con sinceridad los puntos ciegos de tu organización.",
    cta: "QUIERO LA VERDAD →",
    waMsg: "Hola, quiero auditar los puntos ciegos de mi empresa.",
    saludo: "[nombre], tu instinto es correcto.",
    tagline: "TENÉS GENTE. TENÉS ESTRUCTURA. Y ALGO NO CIERRA.",
    color: "#6B7280",
    mirror: ['"Tomo decisiones importantes sin datos claros."'],
    symptoms: ["Aislamiento directivo", "Falta de control real"],
    ctaTitle: "LA SOSPECHA TIENE NOMBRE.",
    ctaText: "Auditemos la salud de tu negocio.",
  },
  ESTANCADO: {
    tag: "La Empresa que Necesita Profesionalizarse",
    ref: "TENÉS TODO PARA DAR EL SALTO. Y AÚN NO LO DISTE.",
    desc: "El negocio creció pero se frenó porque sigue funcionando por costumbre y no por sistema.",
    verdad: "Lo que te trajo hasta acá no te llevará al siguiente nivel.",
    cierreTitulo: "LO QUE FUNCIONÓ HASTA ACÁ, NO ES SUFICIENTE PARA LO QUE SIGUE.",
    cierreTxt: "Profesionalicemos tu empresa sin frenar la facturación actual.",
    cta: "QUIERO PROFESIONALIZAR →",
    waMsg: "Hola, quiero profesionalizar mi negocio para dar el salto.",
    saludo: "[nombre], es momento de profesionalizar.",
    tagline: "TENÉS TODO PARA DAR EL SALTO. Y AÚN NO LO DISTE.",
    color: "#F7CC13",
    mirror: ['"El crecimiento se frenó por falta de estructura."'],
    symptoms: ["Meseta de facturación", "Roles ambiguos"],
    ctaTitle: "LO QUE FUNCIONÓ HASTA ACÁ, NO ES SUFICIENTE PARA LO QUE SIGUE.",
    ctaText: "Armemos el plan de profesionalización.",
  },
  NUEVA_GEN: {
    tag: "Carga la Responsabilidad, pero No la Autoridad",
    ref: "RESPONDÉS POR TODO. PERO TODAVÍA NO TE TERMINAN DE ESCUCHAR.",
    desc: "Cargás con el peso de la operación pero aún no contás con el marco de autoridad para transformar.",
    verdad: "Tu rol debe pesar lo mismo que tu trabajo mediante reglas objetivas.",
    cierreTitulo: "NO PEDÍS MÁS DE LO QUE TE CORRESPONDE.",
    cierreTxt: "Estrategia para consolidar tu liderazgo formal.",
    cta: "SÍ, ORDENEMOSLO →",
    waMsg: "Hola, quiero consolidar mi rol de liderazgo.",
    saludo: "[nombre], tu trabajo ya pesa.",
    tagline: "RESPONDÉS POR TODO. PERO TODAVÍA NO TE TERMINAN DE ESCUCHAR.",
    color: "#1A3D84",
    mirror: ['"Quiero innovar pero no me sueltan las riendas."'],
    symptoms: ["Transición generacional compleja"],
    ctaTitle: "NO PEDÍS MÁS DE LO QUE TE CORRESPONDE.",
    ctaText: "Construyamos tu autoridad sobre resultados.",
  },
};

export function calcularScores(respuestas: Record<number, number> | number[]): Scores {
  const scores: Scores = { personal: 0, organizacional: 0, comercial: 0, empresarial: 0 };
  const maxPorArea: Scores = { personal: 0, organizacional: 0, comercial: 0, empresarial: 0 };

  const rArr: number[] = Array.isArray(respuestas)
    ? respuestas
    : [1, 2, 3, 4, 5, 6, 7, 8].map((id) => respuestas[id] ?? 2);

  PREGUNTAS_BASE.forEach((p, i) => {
    const valor = rArr[i] ?? 2;
    const dom = p.areaDominante;
    const sec = p.areaSecundaria;
    scores[dom] += valor * 0.7;
    scores[sec] += valor * 0.3;
    maxPorArea[dom] += 4 * 0.7;
    maxPorArea[sec] += 4 * 0.3;
  });

  const normalizado: Scores = { personal: 0, organizacional: 0, comercial: 0, empresarial: 0 };
  for (const area of Object.keys(scores) as Area[]) {
    normalizado[area] = Math.round((scores[area] / (maxPorArea[area] || 1)) * 100);
  }
  return normalizado;
}

export function areasMasDebiles(scores: Scores): [Area, Area] {
  const ordenado = (Object.entries(scores) as [Area, number][]).sort((a, b) => a[1] - b[1]);
  return [ordenado[0][0], ordenado[1][0]];
}

function estanParejas(scores: Scores, umbral = 12): boolean {
  const valores = Object.values(scores);
  return Math.max(...valores) - Math.min(...valores) <= umbral;
}

const PARES_AMBIGUOS: [Area, Area][] = [
  ["personal", "organizacional"],
  ["comercial", "personal"],
  ["personal", "comercial"],
];

export function requierePosicion(scores: Scores): boolean {
  if (estanParejas(scores)) return false;
  const [dom, sec] = areasMasDebiles(scores);
  return PARES_AMBIGUOS.some(([a, b]) => a === dom && b === sec);
}

export function detectarPerfil(
  scoresOrAnswers: Scores | Record<number, number> | number[],
  posicion?: RespuestaPosicion
): PerfilKey {
  let scores: Scores;
  if ("personal" in scoresOrAnswers && "organizacional" in scoresOrAnswers) {
    scores = scoresOrAnswers as Scores;
  } else {
    scores = calcularScores(scoresOrAnswers as Record<number, number>);
  }

  if (estanParejas(scores)) {
    const promedio = Object.values(scores).reduce((a, b) => a + b, 0) / 4;
    return promedio < 50 ? "SIN_PROFESIONALIZAR_LA_EMPRESA" : "ESCEPTICO";
  }

  const [dom, sec] = areasMasDebiles(scores);

  if (dom === "empresarial" && sec === "personal") return "SATURADO";
  if (dom === "organizacional" && sec === "personal") return "EQUIPO_DESALINEADO";

  if (dom === "personal" && sec === "organizacional") {
    if (posicion === "fundador") return "LIDER_QUE_NECESITA_APOYO";
    return "NUEVA_GENERACION";
  }

  if ((dom === "comercial" && sec === "personal") || (dom === "personal" && sec === "comercial")) {
    if (posicion === "fundador" || posicion === "heredero") return "AREA_COMERCIAL_SIN_RESULTADOS";
    return "INDEPENDIENTE_EN_CRECIMIENTO";
  }

  if (dom === "comercial") return "AREA_COMERCIAL_SIN_RESULTADOS";
  if (dom === "empresarial") return "SIN_PROFESIONALIZAR_LA_EMPRESA";
  return "EQUIPO_DESALINEADO";
}

export interface Paso72h {
  dia: string;
  titulo: string;
  accion: string;
}

export interface PlanAccion72h {
  lecturaOrigen: string;
  enfoqueRol: string;
  pasos: Paso72h[];
}

const DIAGNOSTICO_ORIGEN_DIMENSION: Record<Area, string> = {
  personal:
    "tu tiempo de dirección está absorbido por urgencias operativas que deberían resolverse sin vos",
  organizacional:
    "las responsabilidades dentro del equipo no tienen reglas claras de decisión y todo sube a tu escritorio",
  comercial:
    "el esfuerzo comercial depende de empuje individual o concesiones de precio, sin método repetible",
  empresarial:
    "el negocio creció apoyado en criterio artesanal y hoy exige estructura de procesos para sostenerse",
};

const ACCIONES_POR_AREA: Record<Area, [Paso72h, Paso72h]> = {
  personal: [
    {
      dia: "Primeras 24h",
      titulo: "Auditar interrupciones repetitivas",
      accion:
        "Anotá durante un día cada consulta operativa que te llega. Marcá cuáles ya explicaste más de dos veces: ese es tu primer proceso faltante, no una falla de voluntad.",
    },
    {
      dia: "48 a 72h",
      titulo: "Fijar ventana protegida de criterio",
      accion:
        "Bloqueá 90 minutos sin teléfono ni escritorio abierto para revisar indicadores y definir una sola decisión de orden para la semana.",
    },
  ],
  organizacional: [
    {
      dia: "Primeras 24h",
      titulo: "Separar tarea de responsabilidad",
      accion:
        "Elegí los 3 frentes que hoy vuelven siempre a vos y asigná un único responsable explícito con criterio claro de qué puede resolver solo y qué escala.",
    },
    {
      dia: "48 a 72h",
      titulo: "Instalar reunión breve de alineación",
      accion:
        "Reemplazá el seguimiento informal de pasillo por una revisión de 20 minutos con 3 datos visibles: qué se comprometió, qué trabó y qué cambia.",
    },
  ],
  comercial: [
    {
      dia: "Primeras 24h",
      titulo: "Medir concentración y margen real",
      accion:
        "Listá tus últimos 10 presupuestos o clientes principales. Identificá dónde cediste condiciones por miedo a perder la venta y cuánto depende tu caja de 1 o 2 cuentas.",
    },
    {
      dia: "48 a 72h",
      titulo: "Definir piso comercial no negociable",
      accion:
        "Escribí en media hoja tus 3 criterios mínimos de precio, plazo y alcance para que vender deje de ser una apuesta caso por caso.",
    },
  ],
  empresarial: [
    {
      dia: "Primeras 24h",
      titulo: "Mapear el cuello de botella recurrente",
      accion:
        "Elegí el problema operativo que se repitió en las últimas dos semanas y escribí el paso a paso mínimo para que cualquiera del equipo lo ejecute igual.",
    },
    {
      dia: "48 a 72h",
      titulo: "Bajar un tablero mínimo de control",
      accion:
        "Definí 4 números semanales (caja, ventas cerradas, entregas a tiempo y reclamos) para dirigir con datos reales y no por sensación del día.",
    },
  ],
};

const ENFOQUE_POSICION: Record<RespuestaPosicion, string> = {
  fundador:
    "Como fundador, el desafío no es trabajar más horas: es convertir tu criterio personal en sistema para que la empresa no dependa de tu presencia física.",
  heredero:
    "En transición generacional, ordenar procesos objetivos es la única forma de que tu autoridad se apoye en resultados medibles y no en discusiones personales.",
  gerente:
    "Desde un rol directivo sin propiedad total, el orden metodológico respalda tus decisiones con hechos concretos frente a socios y equipo.",
};

export function generarPlanAccion72h(params: {
  perfil: PerfilKey;
  scores: Scores;
  posicion?: RespuestaPosicion;
}): PlanAccion72h {
  const [debil1, debil2] = areasMasDebiles(params.scores);

  const lecturaOrigen = `Tus respuestas muestran que la traba principal no es capacidad personal, sino diseño operativo: ${DIAGNOSTICO_ORIGEN_DIMENSION[debil1]}.`;

  const enfoqueRol = params.posicion
    ? ENFOQUE_POSICION[params.posicion]
    : "El problema nunca sos vos ni las personas: cuando el proceso no existe, el negocio te cobra cada decisión con desgaste diario.";

  const [p1, p2] = ACCIONES_POR_AREA[debil1];
  const [sec1] = ACCIONES_POR_AREA[debil2];

  const pasos: Paso72h[] = [
    p1,
    {
      dia: "Día 2 · Dimensión crítica secundaria",
      titulo: sec1.titulo,
      accion: sec1.accion,
    },
    p2,
  ];

  return { lecturaOrigen, enfoqueRol, pasos };
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
