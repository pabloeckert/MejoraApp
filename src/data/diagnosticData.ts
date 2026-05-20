export interface DiagnosticQuestion {
  id: number;
  title: string;
  sub: string;
  opts: DiagnosticOption[];
}

export interface DiagnosticOption {
  label: string;
  text: string;
  score: number;
}

export interface DiagnosticProfile {
  color: string;
  tagline: string;
  desc: string;
  mirror: string[];
  symptoms: string[];
  ctaTitle: string;
  ctaText: string;
}

export const BANCO_PREGUNTAS: DiagnosticQuestion[] = [
  {
    id: 1,
    title: "Si maÃ±ana no estÃ¡s, Â¿quÃ© pasa con tu negocio?",
    sub: "PensÃ¡ en la Ãºltima vez que te fuiste de vacaciones o estuviste enfermo.",
    opts: [
      { label: "A", text: "Todo sigue funcionando. Mi equipo sabe quÃ© hacer sin mÃ­.", score: 5 },
      { label: "B", text: "Funciona, pero hay decisiones que solo yo puedo tomar.", score: 3 },
      { label: "C", text: "Se genera un caos controlable, pero me llaman para todo.", score: 2 },
      { label: "D", text: "El negocio se paraliza. Sin mÃ­, no hay negocio.", score: 1 },
    ],
  },
  {
    id: 2,
    title: "Â¿CÃ³mo llegan los clientes nuevos a tu negocio?",
    sub: "PensÃ¡ en los Ãºltimos 5 clientes que cerraste.",
    opts: [
      { label: "A", text: "Tengo un sistema claro: publicidad, redes, referidos trabajados. Llegan de forma predecible.", score: 5 },
      { label: "B", text: "Principalmente por recomendaciones. Funciona, pero no es un sistema mÃ­o.", score: 3 },
      { label: "C", text: "De manera irregular. Algunos meses bien, otros preocupantes.", score: 2 },
      { label: "D", text: "No tengo claro de dÃ³nde vienen. Espero que aparezcan y rezo.", score: 1 },
    ],
  },
  {
    id: 3,
    title: "Cuando un prospecto dice \"estÃ¡ caro\", Â¿quÃ© pasa?",
    sub: "Tu reacciÃ³n mÃ¡s honesta, no la mÃ¡s prolija.",
    opts: [
      { label: "A", text: "Defiendo el precio con seguridad. Explico el valor y rara vez descuento.", score: 5 },
      { label: "B", text: "Explico el valor, pero si insisten, termino bajando algo para cerrar.", score: 3 },
      { label: "C", text: "Me cuesta responder. Suelo hacer algÃºn descuento o me quedo sin argumentos.", score: 2 },
      { label: "D", text: "Bajo el precio directamente o pierdo la venta. No sÃ© cÃ³mo manejarlo.", score: 1 },
    ],
  },
  {
    id: 4,
    title: "Â¿Tu equipo tira para el mismo lado que vos?",
    sub: "PensÃ¡ en la semana laboral promedio.",
    opts: [
      { label: "A", text: "SÃ­. Saben para dÃ³nde vamos, tienen iniciativa y confÃ­o en ellos.", score: 5 },
      { label: "B", text: "En general sÃ­, aunque siempre hay alguno que hay que estar empujando.", score: 3 },
      { label: "C", text: "Tengo gente buena, pero falta organizaciÃ³n. Cada uno tira para su lado.", score: 2 },
      { label: "D", text: "Estoy solo o rodeado de personas que no estÃ¡n a la altura.", score: 1 },
    ],
  },
  {
    id: 5,
    title: "Â¿CuÃ¡ntas veces resolvÃ©s el mismo problema en un mes?",
    sub: "Los problemas que deberÃ­an estar resueltos para siempre y siguen volviendo.",
    opts: [
      { label: "A", text: "Casi nunca. Los problemas se procesan una vez y quedan resueltos para siempre.", score: 5 },
      { label: "B", text: "Algunos se repiten pero los manejo rÃ¡pido porque ya sÃ© cÃ³mo.", score: 3 },
      { label: "C", text: "Varios se repiten. Quiero sistematizar pero no tengo tiempo para hacerlo.", score: 2 },
      { label: "D", text: "Vivo apagando incendios. Lo mismo de siempre, todos los meses, sin parar.", score: 1 },
    ],
  },
  {
    id: 6,
    title: "Â¿TenÃ©s asesores o referentes con quienes hablar de tu negocio?",
    sub: "Alguien que te diga la verdad, no solo lo que querÃ©s escuchar.",
    opts: [
      { label: "A", text: "SÃ­. Trabajo con asesores que me aportan perspectiva real y me empujan a mejorar.", score: 5 },
      { label: "B", text: "Tengo algunos contactos del rubro que consulto de vez en cuando.", score: 3 },
      { label: "C", text: "Tuve malas experiencias con asesores. Mucha teorÃ­a, pocos resultados.", score: 2 },
      { label: "D", text: "No tengo a nadie. Las decisiones importantes las tomo solo, sin perspectiva externa.", score: 1 },
    ],
  },
  {
    id: 7,
    title: "Â¿PodÃ©s describir cÃ³mo querÃ©s que sea tu negocio en 3 aÃ±os?",
    sub: "No lo que querÃ©s ganar. CÃ³mo querÃ©s que funcione.",
    opts: [
      { label: "A", text: "SÃ­, tengo una visiÃ³n clara: sÃ© quÃ© empresa quiero ser, quÃ© mercado atacar y cÃ³mo escalar.", score: 5 },
      { label: "B", text: "Tengo ideas generales pero no estÃ¡ definido con claridad ni escrito en ningÃºn lado.", score: 3 },
      { label: "C", text: "Me cuesta proyectarme. El dÃ­a a dÃ­a no me deja pensar en el futuro.", score: 2 },
      { label: "D", text: "Honestamente, no sÃ©. Vivo el presente y que sea lo que Dios quiera.", score: 1 },
    ],
  },
  {
    id: 8,
    title: "Si tuvieras que describir tu momento actual como dueÃ±o, Â¿cuÃ¡l es el mÃ¡s honesto?",
    sub: "La respuesta que no le darÃ­as a tu contador ni a tu familia.",
    opts: [
      { label: "A", text: "Estoy creciendo y disfruto el proceso. El negocio me da energÃ­a.", score: 5 },
      { label: "B", text: "Funciona, pero algo me dice que podrÃ­a ir mucho mejor.", score: 3 },
      { label: "C", text: "Estoy cansado. TrabajÃ© mucho y los resultados no reflejan el esfuerzo.", score: 2 },
      { label: "D", text: "La verdad es que estoy atascado y no sÃ© por dÃ³nde empezar a destrabar esto.", score: 1 },
    ],
  },
];

export const PERFILES: Record<string, DiagnosticProfile> = {
  SATURADO: {
    color: "hsl(var(--brand-rojo))",
    tagline: "TrabajÃ¡s el doble. GanÃ¡s la mitad de lo que deberÃ­as.",
    desc: "Empezaste esto para tener libertad. Y terminaste siendo el empleado mÃ¡s exigido de tu propia empresa. No porque seas desorganizado â€” sino porque el negocio creciÃ³ sin estructura y ahora todo pasa por vos. Cada decisiÃ³n, cada problema, cada incendio. SabÃ©s que algo tiene que cambiar, pero no encontrÃ¡s el momento para sentarte a cambiarlo. Eso tambiÃ©n es parte del problema.",
    mirror: [
      '"Si yo no empujo, nada avanza."',
      '"Estoy en mil cosas a la vez y ninguna la termino bien."',
      '"SÃ© que podrÃ­a estar mejor, pero no sÃ© por dÃ³nde empezar."',
      '"No tengo tiempo para ordenar â€” tengo que seguir trabajando."',
    ],
    symptoms: [
      "ResolvÃ©s los mismos problemas todos los meses â€” nunca quedan cerrados",
      "Si parÃ¡s 3 dÃ­as, el negocio lo nota. Y eso te pesa mÃ¡s que el trabajo",
      "LlegÃ¡s al viernes sin haber avanzado en lo que realmente importaba",
      "TenÃ©s ideas para crecer pero nunca hay tiempo para ejecutarlas",
    ],
    ctaTitle: "No es falta de esfuerzo. Es falta de sistema.",
    ctaText: "El problema tiene nombre y tiene soluciÃ³n concreta. En 45 minutos te mostramos exactamente cÃ³mo salir de la rueda.",
  },
  INVISIBLE: {
    color: "hsl(var(--brand-azul))",
    tagline: "Sos muy bueno en lo que hacÃ©s. El problema es que nadie lo sabe.",
    desc: "Tus clientes actuales te valoran â€” los que ya llegaron, saben lo que valÃ©s. Pero los que todavÃ­a no te conocen no tienen forma de distinguirte. No tenÃ©s un argumento construido para defender tu precio. No porque no lo merezcas, sino porque nunca nadie te ayudÃ³ a armarlo. El resultado: cobrÃ¡s menos de lo que deberÃ­as y competÃ­s en un terreno que no te representa.",
    mirror: [
      '"SÃ© que soy bueno, pero no sÃ© cÃ³mo explicarlo sin sonar soberbio."',
      '"No sÃ© cÃ³mo diferenciarme â€” siento que soy uno mÃ¡s del montÃ³n."',
      '"Cuando dicen que estÃ¡ caro, no sÃ© quÃ© responder."',
      '"PodrÃ­a cobrar mÃ¡s, pero me da miedo perder clientes."',
    ],
    symptoms: [
      "Casi todos tus clientes llegaron por recomendaciÃ³n â€” no por un sistema tuyo",
      "Ante la objeciÃ³n de precio, terminÃ¡s bajando o perdiendo la venta",
      "No tenÃ©s un mensaje claro que explique por quÃ© vos y no otro",
      "Tu nivel real no se refleja en lo que cobrÃ¡s ni en cÃ³mo te presentÃ¡s",
    ],
    ctaTitle: "No te falta talento. Te falta visibilidad estratÃ©gica.",
    ctaText: "El problema no es lo que sabÃ©s hacer. Es cÃ³mo lo estÃ¡s comunicando al mercado. Eso tiene soluciÃ³n en una sesiÃ³n.",
  },
  LIDER_SOLO: {
    color: "hsl(var(--brand-azul))",
    tagline: "TenÃ©s la visiÃ³n. Falta el equipo que la ejecute sin que estÃ©s encima.",
    desc: "Ves claramente para dÃ³nde va el negocio. El problema es que esa visiÃ³n existe sÃ³lo en tu cabeza y en tus manos. Cada vez que delegÃ¡s algo importante, termina saliendo mal o lo terminÃ¡s rehaciendo vos. No porque tu equipo sea malo â€” sino porque nunca construiste el sistema que les permita ejecutar a tu nivel sin supervisiÃ³n constante.",
    mirror: [
      '"Yo pensÃ© que si delegaba me liberaba â€” pero termino controlando todo igual."',
      '"No entiendo por quÃ© es tan difÃ­cil que las cosas salgan como yo las imagino."',
      '"Si no estoy encima, algo siempre se complica."',
      '"SÃ© exactamente lo que quiero pero no encuentro quiÃ©n lo lleve a cabo."',
    ],
    symptoms: [
      "Sos el primer filtro de todas las decisiones, aunque sean pequeÃ±as",
      "DelegÃ¡s, pero termina saliendo mal o lo rehacÃ©s vos",
      "Cada vez que te ausentÃ¡s, algo se complica o se frena",
      "El negocio creciÃ³ en facturaciÃ³n pero no en autonomÃ­a real",
    ],
    ctaTitle: "Tu negocio no escala mÃ¡s si seguÃ­s siendo el cuello de botella.",
    ctaText: "El prÃ³ximo paso es construir el sistema que permite delegar con resultados reales. En 45 minutos lo definimos juntos.",
  },
  DESCONECTADO: {
    color: "hsl(var(--brand-amarillo))",
    tagline: "Tu negocio funciona. Vos ya no sabÃ©s hacia dÃ³nde lo llevÃ¡s.",
    desc: "Lograste algo que muchos no logran: una operaciÃ³n que corre sola. Pero en algÃºn punto te desconectaste del rol estratÃ©gico. No porque hayas fallado â€” sino porque estabas ejecutando. Ahora el negocio avanza, pero sin que nadie lo estÃ© llevando. Las decisiones grandes las tomÃ¡s solo, sin perspectiva externa, sin visiÃ³n clara de largo plazo. Y eso tiene un costo que todavÃ­a no ves.",
    mirror: [
      '"Estoy pagando por cosas que no sÃ© si sirven."',
      '"No sÃ© si me estÃ¡n diciendo la verdad o lo que quiero escuchar."',
      '"El negocio funciona, pero siento que algo grande se me estÃ¡ escapando."',
      '"Tomo decisiones importantes y en el fondo no sÃ© si son las correctas."',
    ],
    symptoms: [
      "El negocio funciona pero no tenÃ©s claro cuÃ¡l es el prÃ³ximo paso grande",
      "TomÃ¡s las decisiones importantes solo, sin perspectiva externa real",
      "No tenÃ©s una visiÃ³n concreta de adÃ³nde va el negocio en 3 aÃ±os",
      "SentÃ­s que el negocio te lleva a vos, en vez de vos llevarlo a Ã©l",
    ],
    ctaTitle: "Es momento de recuperar el rol estratÃ©gico.",
    ctaText: "Un negocio sin timÃ³n no cae de golpe â€” se desvÃ­a lentamente. Hoy es el momento de corregir el rumbo con criterio externo.",
  },
  ESTANCADO: {
    color: "hsl(var(--brand-gris))",
    tagline: "Funciona. Pero sabÃ©s que deberÃ­a estar yendo mucho mejor.",
    desc: "No estÃ¡s en crisis. Eso estÃ¡ bien. Pero tampoco estÃ¡s creciendo â€” y eso lo sabÃ©s. Hubo una Ã©poca en que el negocio avanzaba casi solo. Hoy se sostiene por inercia y referidos. Lo que te trajo hasta acÃ¡ no es lo mismo que te va a llevar al siguiente nivel. Y en algÃºn lugar de tu cabeza, eso te estÃ¡ molestando hace un tiempo.",
    mirror: [
      '"Funciona, pero algo me dice que podrÃ­a ir mucho mejor."',
      '"No entiendo por quÃ© no despega si estoy haciendo todo bien."',
      '"Los referidos no alcanzan para crecer â€” necesito otra cosa, pero no sÃ© quÃ©."',
      '"Siento que trabajo mucho y los resultados no reflejan el esfuerzo."',
    ],
    symptoms: [
      "Los resultados son estables pero el crecimiento se frenÃ³ hace tiempo",
      "No tenÃ©s claro quÃ© hay que cambiar exactamente para romper el techo",
      "DependÃ©s de referidos â€” no tenÃ©s un canal de adquisiciÃ³n que sea tuyo",
      "Hay una visiÃ³n de crecimiento, pero nunca pasa del pensamiento al plan",
    ],
    ctaTitle: "El estancamiento no es un problema de esfuerzo. Es de estrategia.",
    ctaText: "Identificamos exactamente dÃ³nde estÃ¡ el freno y cuÃ¡l es la palanca para moverlo. Sin rodeos, sin humo.",
  },
  NUEVA_GEN: {
    color: "hsl(var(--brand-azul))",
    tagline: "TenÃ©s el motor encendido. NecesitÃ¡s la estructura que lo sostenga.",
    desc: "TenÃ©s energÃ­a, tenÃ©s visiÃ³n y tenÃ©s movimiento. El problema no es la falta de ganas â€” es que el negocio todavÃ­a corre por impulso, no por sistema. En esta etapa, eso es normal. Pero tambiÃ©n es la etapa que define todo: los que ponen la estructura ahora escalan. Los que no la ponen, llegan a un techo en 2 aÃ±os y no saben por quÃ©.",
    mirror: [
      '"Hago un montÃ³n de cosas pero no siempre sÃ© cuÃ¡l es la prioridad real."',
      '"Quiero crecer, pero nadie me muestra el mapa claro."',
      '"No tengo a quiÃ©n consultar cuando tomo decisiones difÃ­ciles."',
      '"Siento que algo falta para despegar, pero no sÃ© exactamente quÃ©."',
    ],
    symptoms: [
      "HacÃ©s muchas cosas â€” pero no siempre estÃ¡ claro quÃ© mueve el negocio de verdad",
      "No tenÃ©s a quiÃ©n consultar cuando las decisiones se ponen difÃ­ciles",
      "El negocio creciÃ³, pero sin un plan detrÃ¡s â€” creciÃ³ como pudo",
      "SentÃ­s que algo falta para despegar, pero no podÃ©s nombrarlo con precisiÃ³n",
    ],
    ctaTitle: "Con la estructura correcta ahora, el crecimiento se multiplica.",
    ctaText: "Esta es la etapa donde se decide el techo de tu negocio. Hablemos antes de que ese techo se construya solo.",
  },
  EQUIPO_DESALINEADO: {
    color: "hsl(var(--brand-amarillo))",
    tagline: "Tu equipo quiere avanzar. Pero nadie sabe hacia dÃ³nde.",
    desc: "No es que tu equipo sea malo. Es que no tienen un marco comÃºn. Las prioridades cambian cada semana, las reuniones no producen decisiones, y los conflictos se acumulan en silencio. Cada uno interpreta su rol a su manera porque nadie se sentÃ³ a definirlo con claridad. El resultado: mucha energÃ­a desperdiciada y poca tracciÃ³n real.",
    mirror: [
      '"Tengo gente buena pero cada uno tira para su lado."',
      '"Las reuniones no sirven â€” hablamos mucho y decidimos poco."',
      '"No sÃ© si el problema soy yo como lÃ­der o el equipo."',
      '"Hay tensiones que nadie nombra pero todos sienten."',
    ],
    symptoms: [
      "Los roles no estÃ¡n claros â€” hay superposiciones y huecos",
      "Las prioridades cambian cada semana sin criterio definido",
      "Las reuniones terminan sin decisiones concretas ni responsables",
      "Los conflictos se acumulan en silencio hasta que explotan",
    ],
    ctaTitle: "No estÃ¡n desmotivados. EstÃ¡n desordenados.",
    ctaText: "Un equipo sin marco comÃºn gasta mÃ¡s energÃ­a en coordinarse que en producir. Eso se resuelve con claridad, no con motivaciÃ³n.",
  },
  VENDEDOR_SIN_RESULTADOS: {
    color: "hsl(var(--brand-rojo))",
    tagline: "PonÃ©s el cuerpo todos los dÃ­as. Pero la caja no lo refleja.",
    desc: "No es que no trabajes â€” trabajÃ¡s mÃ¡s que la mayorÃ­a. El problema es que el esfuerzo no se traduce en resultados porque no hay una estrategia detrÃ¡s. VendÃ©s por impulso, reaccionÃ¡s a lo que aparece, y al final del mes los nÃºmeros no cierran. Y eso te genera un pÃ©ndulo emocional entre la euforia de un buen dÃ­a y la angustia de una semana vacÃ­a.",
    mirror: [
      '"Trabajo un montÃ³n pero la plata no aparece."',
      '"Un mes bien, otro mal â€” no hay regularidad."',
      '"ProbÃ© de todo: redes, publicidad, cursosâ€¦ nada funciona de verdad."',
      '"A veces pienso que el problema soy yo."',
    ],
    symptoms: [
      "Los ingresos son irregulares â€” no podÃ©s predecir el mes que viene",
      "No tenÃ©s un proceso de venta definido, vendÃ©s como podÃ©s",
      "Invertiste en soluciones que prometÃ­an resultados mÃ¡gicos y no funcionaron",
      "El desgaste emocional es tan grande como el esfuerzo fÃ­sico",
    ],
    ctaTitle: "No te falta esfuerzo. Te falta estrategia.",
    ctaText: "El problema no es cuÃ¡nto trabajÃ¡s sino cÃ³mo lo hacÃ©s. En 45 minutos te mostramos dÃ³nde estÃ¡ la fuga y cÃ³mo taparla.",
  },
};

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Vectorized profile detection.
 * Each profile is defined by score signatures across 3 axes:
 *   - operativo: v1 (dependency) + v5 (processes)
 *   - comercial: v2 (acquisition) + v3 (pricing)
 *   - estratÃ©gico: v6 (advisors) + v7 (vision)
 *   - equipo: v4 (team alignment)
 *   - emocional: v8 (owner state)
 *
 * Instead of nested if/else, we compute a "fit score" for each profile
 * and pick the best match. More maintainable and testable.
 */
const PROFILE_RULES: Array<{
  key: string;
  /** Weighted score function: higher = better fit */
  fit: (answers: Record<number, number>) => number;
}> = [
  {
    key: "SATURADO",
    fit: (a) => (a[1] <= 2 ? 3 : 0) + (a[5] <= 2 ? 3 : 0) + (a[4] <= 2 ? 1 : 0) + (a[8] <= 2 ? 1 : 0),
  },
  {
    key: "EQUIPO_DESALINEADO",
    fit: (a) => (a[4] <= 2 ? 3 : 0) + (a[1] >= 3 ? 1 : 0) + (a[5] >= 3 ? 1 : 0) + (a[7] >= 3 ? 1 : 0),
  },
  {
    key: "VENDEDOR_SIN_RESULTADOS",
    fit: (a) => (a[2] <= 2 ? 2 : 0) + (a[3] <= 2 ? 2 : 0) + (a[8] <= 2 ? 2 : 0),
  },
  {
    key: "INVISIBLE",
    fit: (a) => (a[2] <= 2 ? 2 : 0) + (a[3] <= 2 ? 2 : 0) + (a[6] <= 2 ? 1 : 0),
  },
  {
    key: "LIDER_SOLO",
    fit: (a) => (a[7] >= 3 ? 2 : 0) + (a[1] <= 2 ? 2 : 0) + (a[4] <= 2 ? 2 : 0) + (a[5] >= 3 ? 1 : 0),
  },
  {
    key: "DESCONECTADO",
    fit: (a) => (a[1] >= 3 ? 1 : 0) + (a[7] <= 2 ? 2 : 0) + (a[6] <= 2 ? 2 : 0),
  },
  {
    key: "ESTANCADO",
    fit: (a) => (a[2] <= 3 ? 1 : 0) + (a[7] <= 2 ? 1 : 0) + (a[8] <= 3 ? 1 : 0) + (a[1] >= 3 ? 1 : 0) + (a[5] >= 3 ? 1 : 0),
  },
  {
    key: "NUEVA_GEN",
    fit: (a) => (a[8] >= 3 ? 2 : 0) + (a[7] >= 2 ? 1 : 0) + (a[6] <= 2 ? 1 : 0) + (a[2] <= 3 ? 1 : 0),
  },
];

export function detectarPerfil(answers: Record<number, number>): string {
  // Default neutral scores for unanswered questions
  const a: Record<number, number> = {};
  for (let i = 1; i <= 8; i++) {
    a[i] = answers[i] ?? 3;
  }

  let bestKey = "ESTANCADO";
  let bestScore = -1;

  for (const rule of PROFILE_RULES) {
    const score = rule.fit(a);
    if (score > bestScore) {
      bestScore = score;
      bestKey = rule.key;
    }
  }

  return bestKey;
}

export const WA_NUMBER = "543764358152";

