export type Area = "personal" | "organizacional" | "comercial" | "empresarial";
export type Scores = Record<Area, number>;

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
  color: string;
  tagline: string;
  desc: string;
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

export function zonaColor(p: number): { zona: string; color: string } {
  if (p < 40) return { zona: "Crítico", color: "#E1061E" };
  if (p < 65) return { zona: "En desarrollo", color: "#F7CC13" };
  return { zona: "Sólido", color: "#1A3D84" };
}

export const BANCO_PREGUNTAS: DiagnosticQuestion[] = [
  {
    id: 1,
    title: "Si no estás, ¿qué se detiene en tu negocio?",
    sub: "Pensá en la última vez que te fuiste de vacaciones o te enfermaste.",
    areaDominante: "organizacional",
    areaSecundaria: "personal",
    opts: [
      { label: "A", text: "Funciona igual que si estoy. Mi equipo sabe qué hacer sin mí.", score: 5 },
      { label: "B", text: "Hay algunos roces, pero sigue. Decisiones que solo yo tomo.", score: 3 },
      { label: "C", text: "Se complica bastante. Me llaman por casi todo.", score: 2 },
      { label: "D", text: "Todo se para. Sin mí no hay negocio.", score: 1 },
    ],
  },
  {
    id: 2,
    title: "De tu facturación de este mes, ¿cuánto depende de 1 o 2 clientes grandes?",
    sub: "Si esos dos te dejaran de comprar mañana, ¿qué pasa con la empresa?",
    areaDominante: "comercial",
    areaSecundaria: "empresarial",
    opts: [
      { label: "A", text: "Poco, la cartera está bien repartida y tenemos captación constante.", score: 5 },
      { label: "B", text: "Algo, pero tengo otros clientes para sostenerme.", score: 3 },
      { label: "C", text: "Una parte grande, me preocupa seriamente.", score: 2 },
      { label: "D", text: "Casi todo. Si se van, estamos en problemas críticos.", score: 1 },
    ],
  },
  {
    id: 3,
    title: "Cuando un cliente importante pide condiciones que no te convienen o dice 'está caro', ¿qué hacés?",
    sub: "La negociación real, no la que contás después.",
    areaDominante: "comercial",
    areaSecundaria: "personal",
    opts: [
      { label: "A", text: "Defiendo el precio y las condiciones con criterio claro. Rara vez cedo.", score: 5 },
      { label: "B", text: "Negocio, a veces gano y a veces concedo para cerrar.", score: 3 },
      { label: "C", text: "Cedo casi siempre para no perderlo, aunque después me arrepienta.", score: 2 },
      { label: "D", text: "Cedo de inmediato o pierdo la cuenta. No tengo margen de maniobra.", score: 1 },
    ],
  },
  {
    id: 4,
    title: "¿Tu equipo tira para el mismo lado?",
    sub: "No el equipo ideal que querés tener. El que tenés hoy.",
    areaDominante: "organizacional",
    areaSecundaria: "personal",
    opts: [
      { label: "A", text: "Sí, hay alineación real, objetivos claros y confío en ellos.", score: 5 },
      { label: "B", text: "Más o menos, la mayoría responde pero siempre hay que estar empujando.", score: 3 },
      { label: "C", text: "Hay roces silenciosos y falta de organización en el día a día.", score: 2 },
      { label: "D", text: "Cada uno interpreta las cosas a su manera. Reina el desorden.", score: 1 },
    ],
  },
  {
    id: 5,
    title: "¿Cuántas veces resolvés el mismo problema en un mes?",
    sub: "Pensá en las últimas dos semanas.",
    areaDominante: "empresarial",
    areaSecundaria: "organizacional",
    opts: [
      { label: "A", text: "Raramente se repiten. Los problemas se procesan y quedan estandarizados.", score: 5 },
      { label: "B", text: "A veces, aprendemos y vamos mejorando poco a poco.", score: 3 },
      { label: "C", text: "Con frecuencia. Queremos sistematizar pero falta tiempo.", score: 2 },
      { label: "D", text: "Siempre los mismos. Vivimos apagando incendios cotidianos.", score: 1 },
    ],
  },
  {
    id: 6,
    title: "¿Quién maneja la relación comercial con tus clientes principales y decisiones estratégicas?",
    sub: "No quién debería. Quién realmente atiende esa llamada.",
    areaDominante: "comercial",
    areaSecundaria: "empresarial",
    opts: [
      { label: "A", text: "Mi equipo capacitado y con criterio; yo ya no intervengo operativamente.", score: 5 },
      { label: "B", text: "Alguien del equipo, pero recurre a mí cuando se complica.", score: 3 },
      { label: "C", text: "Yo en gran medida, aunque sé que ya no debería ser así.", score: 2 },
      { label: "D", text: "Yo, siempre yo. Si no estoy encima de cada cliente, no se vende.", score: 1 },
    ],
  },
  {
    id: 7,
    title: "¿Ves con claridad cómo querés que funcione tu negocio en 3 años?",
    sub: "No la respuesta correcta ni lo que querés facturar. El plan real.",
    areaDominante: "empresarial",
    areaSecundaria: "personal",
    opts: [
      { label: "A", text: "Tengo un plan concreto, bajado a procesos y funcionando.", score: 5 },
      { label: "B", text: "La tengo clara en la cabeza, pero falta bajarla y ejecutarla con el equipo.", score: 3 },
      { label: "C", text: "Tengo ideas vagas; el día a día no me deja proyectarme.", score: 2 },
      { label: "D", text: "Voy viendo sobre la marcha. La coyuntura me come.", score: 1 },
    ],
  },
  {
    id: 8,
    title: "Si subieras tus precios un 20% mañana o defendieras tu valor real, ¿qué pasaría?",
    sub: "La respuesta honesta, no la que te gustaría dar.",
    areaDominante: "comercial",
    areaSecundaria: "empresarial",
    opts: [
      { label: "A", text: "Ningún cliente clave se iría; reconocen el valor diferencial de nuestro trabajo.", score: 5 },
      { label: "B", text: "Algunos clientes se irían, pero el margen compensaría.", score: 3 },
      { label: "C", text: "Perdería varios clientes y me asusta mucho probarlo.", score: 2 },
      { label: "D", text: "Perdería casi todos mis clientes. Compito exclusivamente por precio.", score: 1 },
    ],
  },
];

export const PERFILES: Record<string, DiagnosticProfile> = {
  SATURADO: {
    color: "hsl(var(--brand-rojo))",
    tagline: "Trabajás el doble. Ganás la mitad de lo que deberías.",
    desc: "Empezaste esto para tener libertad. Y terminaste siendo el empleado más exigido de tu propia empresa. No porque seas desorganizado — sino porque el negocio creció sin estructura y ahora todo pasa por vos. Cada decisión, cada problema, cada incendio. Sabés que algo tiene que cambiar, pero no encontrás el momento para sentarte a cambiarlo. Eso también es parte de la falta de sistema.",
    mirror: [
      '"Si yo no empujo, nada avanza."',
      '"Estoy en mil cosas a la vez y ninguna la termino bien."',
      '"Sé que podría estar mejor, pero no sé por dónde empezar."',
      '"No tengo tiempo para ordenar — tengo que seguir trabajando."',
    ],
    symptoms: [
      "Resolvés los mismos problemas todos los meses — nunca quedan cerrados",
      "Si parás 3 días, el negocio lo nota. Y eso te pesa más que el trabajo",
      "Llegás al viernes sin haber avanzado en lo que realmente importaba",
      "Tenés ideas para crecer pero nunca hay tiempo para ejecutarlas",
    ],
    ctaTitle: "No es falta de esfuerzo. Es falta de sistema.",
    ctaText: "El problema tiene nombre y tiene solución concreta. En 45 minutos te mostramos exactamente cómo salir de la rueda.",
  },
  INVISIBLE: {
    color: "hsl(var(--brand-azul))",
    tagline: "Sos muy bueno en lo que hacés. El problema es que nadie lo sabe.",
    desc: "Tus clientes actuales te valoran — los que ya llegaron, saben lo que valés. Pero los que todavía no te conocen no tienen forma de distinguirte. No tenés un argumento construido para defender tu precio. No porque no lo merezcas, sino porque nunca nadie te ayudó a armar un proceso comercial claro. El resultado: cobrás menos de lo que deberías y competís en un terreno que no te representa.",
    mirror: [
      '"Sé que soy bueno, pero no sé cómo explicarlo sin sonar soberbio."',
      '"No sé cómo diferenciarme — siento que soy uno más del montón."',
      '"Cuando dicen que está caro, no sé qué responder."',
      '"Podría cobrar más, pero me da miedo perder clientes."',
    ],
    symptoms: [
      "Casi todos tus clientes llegaron por recomendación — no por un sistema tuyo",
      "Ante la objeción de precio, terminás bajando o perdiendo la venta",
      "No tenés un mensaje claro que explique por qué vos y no otro",
      "Tu nivel real no se refleja en lo que cobrás ni en cómo te presentás",
    ],
    ctaTitle: "No te falta talento. Te falta visibilidad estratégica.",
    ctaText: "El problema no es lo que sabés hacer. Es cómo lo estás comunicando al mercado. Eso tiene solución con método.",
  },
  LIDER_SOLO: {
    color: "hsl(var(--brand-azul))",
    tagline: "Tenés la visión. Falta el equipo que la ejecute sin que estés encima.",
    desc: "Ves claramente para dónde va el negocio. El problema es que esa visión existe sólo en tu cabeza y en tus manos. Cada vez que delegás algo importante, termina saliendo mal o lo terminás rehaciendo vos. No porque tu equipo sea malo — sino porque nunca construiste el sistema que les permita ejecutar a tu nivel sin supervisión constante.",
    mirror: [
      '"Yo pensé que si delegaba me liberaba — pero termino controlando todo igual."',
      '"No entiendo por qué es tan difícil que las cosas salgan como yo las imagino."',
      '"Si no estoy encima, algo siempre se complica."',
      '"Sé exactamente lo que quiero pero no encuentro quién lo lleve a cabo."',
    ],
    symptoms: [
      "Sos el primer filtro de todas las decisiones, aunque sean pequeñas",
      "Delegás, pero termina saliendo mal o lo rehacés vos",
      "Cada vez que te ausentás, algo se complica o se frena",
      "El negocio creció en facturación pero no en autonomía real",
    ],
    ctaTitle: "Tu negocio no escala más si seguís siendo el cuello de botella.",
    ctaText: "El próximo paso es construir el sistema que permite delegar con resultados reales. En 45 minutos lo definimos juntos.",
  },
  DESCONECTADO: {
    color: "hsl(var(--brand-amarillo))",
    tagline: "Tu negocio funciona. Vos ya no sabés hacia dónde lo llevás.",
    desc: "Lograste algo que muchos no logran: una operación que corre sola. Pero en algún punto te desconectaste del rol estratégico. No porque hayas fallado — sino porque estabas ejecutando. Ahora el negocio avanza, pero sin que nadie lo esté llevando. Las decisiones grandes las tomás solo, sin perspectiva externa, sin visión clara de largo plazo. Y eso tiene un costo que todavía no ves.",
    mirror: [
      '"Estoy pagando por cosas que no sé si sirven."',
      '"No sé si me están diciendo la verdad o lo que quiero escuchar."',
      '"El negocio funciona, pero siento que algo grande se me está escapando."',
      '"Tomo decisiones importantes y en el fondo no sé si son las correctas."',
    ],
    symptoms: [
      "El negocio funciona pero no tenés claro cuál es el próximo paso grande",
      "Tomás las decisiones importantes solo, sin perspectiva externa real",
      "No tenés una visión concreta de adónde va el negocio en 3 años",
      "Sentís que el negocio te lleva a vos, en vez de vos llevarlo a él",
    ],
    ctaTitle: "Es momento de recuperar el rol estratégico.",
    ctaText: "Un negocio sin timón no cae de golpe — se desvía lentamente. Hoy es el momento de corregir el rumbo con criterio externo.",
  },
  ESTANCADO: {
    color: "hsl(var(--brand-gris))",
    tagline: "Funciona. Pero sabés que debería estar yendo mucho mejor.",
    desc: "No estás en crisis. Eso está bien. Pero tampoco estás creciendo — y eso lo sabés. Hubo una época en que el negocio avanzaba casi solo. Hoy se sostiene por inercia y referidos. Lo que te trajo hasta acá no es lo mismo que te va a llevar al siguiente nivel. Y en algún lugar de tu cabeza, eso te está molestando hace un tiempo.",
    mirror: [
      '"Funciona, pero algo me dice que podría ir mucho mejor."',
      '"No entiendo por qué no despega si estoy haciendo todo bien."',
      '"Los referidos no alcanzan para crecer — necesito otra cosa, pero no sé qué."',
      '"Siento que trabajo mucho y los resultados no reflejan el esfuerzo."',
    ],
    symptoms: [
      "Los resultados son estables pero el crecimiento se frenó hace tiempo",
      "No tenés claro qué hay que cambiar exactamente para romper el techo",
      "Dependés de referidos — no tenés un canal de adquisición que sea tuyo",
      "Hay una visión de crecimiento, pero nunca pasa del pensamiento al plan",
    ],
    ctaTitle: "El estancamiento no es un problema de esfuerzo. Es de estrategia.",
    ctaText: "Identificamos exactamente dónde está el freno y cuál es la palanca para moverlo. Sin rodeos, sin humo.",
  },
  NUEVA_GEN: {
    color: "hsl(var(--brand-azul))",
    tagline: "Tenés el motor encendido. Necesitás la estructura que lo sostenga.",
    desc: "Tenés energía, tenés visión y tenés movimiento. El problema no es la falta de ganas — es que el negocio todavía corre por impulso, no por sistema. En esta etapa, eso es normal. Pero también es la etapa que define todo: los que ponen la estructura ahora escalan. Los que no la ponen, llegan a un techo en 2 años y no saben por qué.",
    mirror: [
      '"Hago un montón de cosas pero no siempre sé cuál es la prioridad real."',
      '"Quiero crecer, pero nadie me muestra el mapa claro."',
      '"No tengo a quién consultar cuando tomo decisiones difíciles."',
      '"Siento que algo falta para despegar, pero no sé exactamente qué."',
    ],
    symptoms: [
      "Hacés muchas cosas — pero no siempre está claro qué mueve el negocio de verdad",
      "No tenés a quién consultar cuando las decisiones se ponen difíciles",
      "El negocio creció, pero sin un plan detrás — creció como pudo",
      "Sentís que algo falta para despegar, pero no podés nombrarlo con precisión",
    ],
    ctaTitle: "Con la estructura correcta ahora, el crecimiento se multiplica.",
    ctaText: "Esta es la etapa donde se decide el techo de tu negocio. Hablemos antes de que ese techo se construya solo.",
  },
  EQUIPO_DESALINEADO: {
    color: "hsl(var(--brand-amarillo))",
    tagline: "Tu equipo quiere avanzar. Pero nadie sabe hacia dónde.",
    desc: "No es que tu equipo sea malo. Es que no tienen un marco común. Las prioridades cambian cada semana, las reuniones no producen decisiones, y los conflictos se acumulan en silencio. Cada uno interpreta su rol a su manera porque nadie se sentó a definirlo con claridad. El resultado: mucha energía desperdiciada y poca tracción real.",
    mirror: [
      '"Tengo gente buena pero cada uno tira para su lado."',
      '"Las reuniones no sirven — hablamos mucho y decidimos poco."',
      '"No sé si el problema soy yo como líder o el equipo."',
      '"Hay tensiones que nadie nombra pero todos sienten."',
    ],
    symptoms: [
      "Los roles no están claros — hay superposiciones y huecos",
      "Las prioridades cambian cada semana sin criterio definido",
      "Las reuniones terminan sin decisiones concretas ni responsables",
      "Los conflictos se acumulan en silencio hasta que explotan",
    ],
    ctaTitle: "No están desmotivados. Están desordenados.",
    ctaText: "Un equipo sin marco común gasta más energía en coordinarse que en producir. Eso se resuelve con claridad, no con motivación.",
  },
  VENDEDOR_SIN_RESULTADOS: {
    color: "hsl(var(--brand-rojo))",
    tagline: "Ponés el cuerpo todos los días. Pero la caja no lo refleja.",
    desc: "No es que no trabajes — trabajás más que la mayoría. El problema es que el esfuerzo no se traduce en resultados porque no hay una estrategia detrás. Vendés por impulso, reaccionás a lo que aparece, y al final del mes los números no cierran. Y eso te genera un péndulo emocional entre la euforia de un buen día y la angustia de una semana vacía.",
    mirror: [
      '"Trabajo un montón pero la plata no aparece."',
      '"Un mes bien, otro mal — no hay regularidad."',
      '"Probé de todo: redes, publicidad, cursos... nada funciona de verdad."',
      '"A veces pienso que el problema soy yo."',
    ],
    symptoms: [
      "Los ingresos son irregulares — no podés predecir el mes que viene",
      "No tenés un proceso de venta definido, vendés como podés",
      "Invertiste en soluciones que prometían resultados mágicos y no funcionaron",
      "El desgaste emocional es tan grande como el esfuerzo físico",
    ],
    ctaTitle: "No te falta esfuerzo. Te falta estrategia.",
    ctaText: "El problema no es cuánto trabajás sino cómo lo hacés. En 45 minutos te mostramos dónde está la fuga y cómo taparla.",
  },
};

export function calcularScores(respuestas: Record<number, number> | number[]): Scores {
  const scores: Scores = { personal: 0, organizacional: 0, comercial: 0, empresarial: 0 };
  const maxPorArea: Scores = { personal: 0, organizacional: 0, comercial: 0, empresarial: 0 };

  BANCO_PREGUNTAS.forEach((p, i) => {
    const val = Array.isArray(respuestas) ? (respuestas[i] ?? 3) : (respuestas[p.id] ?? 3);
    const dom = p.areaDominante;
    const sec = p.areaSecundaria;
    scores[dom] += val * 0.7;
    scores[sec] += val * 0.3;
    maxPorArea[dom] += 5 * 0.7;
    maxPorArea[sec] += 5 * 0.3;
  });

  const normalizado: Scores = { personal: 0, organizacional: 0, comercial: 0, empresarial: 0 };
  for (const area of Object.keys(scores) as Area[]) {
    normalizado[area] = Math.round((scores[area] / (maxPorArea[area] || 1)) * 100);
  }
  return normalizado;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PROFILE_RULES: Array<{
  key: string;
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
