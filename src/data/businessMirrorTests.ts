/**
 * Business Mirror Gamer â€” Test Data
 *
 * Los 5 tests iniciales del sistema de gamificaciÃ³n.
 * Cada test tiene su propio game_type, questions, scoring_rules y profiles.
 */

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type GameType = "classic" | "puzzle" | "adventure" | "mental" | "logic";

export interface TestQuestion {
  id: number;
  title: string;
  subtitle?: string;
  options: TestOption[];
  /** Para games tipo "mental": tiempo lÃ­mite en segundos */
  timeLimit?: number;
}

export interface TestOption {
  label: string;
  text: string;
  score: number;
  /** Para adventure: siguiente pregunta (branching) */
  next?: number;
  /** Para puzzle: si es la opciÃ³n Ã³ptima */
  optimal?: boolean;
}

export interface TestProfile {
  key: string;
  title: string;
  tagline: string;
  description: string;
  color: string;
  icon: string;
  traits: string[];
  advice: string;
}

export interface TestDefinition {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  bgColor: string;
  gameType: GameType;
  timeEstimateMin: number;
  questions: TestQuestion[];
  scoringRules: ScoringRule[];
  profiles: Record<string, TestProfile>;
}

export interface ScoringRule {
  profileKey: string;
  /** Function that receives answers and returns a fit score */
  fit: (answers: Record<number, number>, totalTime?: number) => number;
}

// â”€â”€ Test 1: Mirror EstratÃ©gico (Classic) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const mirrorEstrategico: TestDefinition = {
  slug: "mirror-estrategico",
  title: "Mirror EstratÃ©gico",
  subtitle: "DescubrÃ­ tu perfil de empresario",
  description:
    "8 preguntas que reflejan cÃ³mo estÃ¡ tu negocio hoy. No es un test de conocimiento â€” es un espejo honesto de tu realidad como dueÃ±o.",
  category: "diagnostico",
  icon: "Mirror",
  color: "hsl(var(--brand-azul))",
  bgColor: "bg-blue-50 dark:bg-blue-950/30",
  gameType: "classic",
  timeEstimateMin: 2,
  questions: [
    {
      id: 1,
      title: "Si maÃ±ana no estÃ¡s, Â¿quÃ© pasa con tu negocio?",
      subtitle: "PensÃ¡ en la Ãºltima vez que te fuiste de vacaciones o estuviste enfermo.",
      options: [
        { label: "A", text: "Todo sigue funcionando. Mi equipo sabe quÃ© hacer sin mÃ­.", score: 5 },
        { label: "B", text: "Funciona, pero hay decisiones que solo yo puedo tomar.", score: 3 },
        { label: "C", text: "Se genera un caos controlable, pero me llaman para todo.", score: 2 },
        { label: "D", text: "El negocio se paraliza. Sin mÃ­, no hay negocio.", score: 1 },
      ],
    },
    {
      id: 2,
      title: 'Â¿CÃ³mo llegan los clientes nuevos a tu negocio?',
      subtitle: "PensÃ¡ en los Ãºltimos 5 clientes que cerraste.",
      options: [
        { label: "A", text: "Tengo un sistema claro: publicidad, redes, referidos trabajados. Llegan de forma predecible.", score: 5 },
        { label: "B", text: "Principalmente por recomendaciones. Funciona, pero no es un sistema mÃ­o.", score: 3 },
        { label: "C", text: "De manera irregular. Algunos meses bien, otros preocupantes.", score: 2 },
        { label: "D", text: "No tengo claro de dÃ³nde vienen. Espero que aparezcan y rezo.", score: 1 },
      ],
    },
    {
      id: 3,
      title: 'Cuando un prospecto dice "estÃ¡ caro", Â¿quÃ© pasa?',
      subtitle: "Tu reacciÃ³n mÃ¡s honesta, no la mÃ¡s prolija.",
      options: [
        { label: "A", text: "Defiendo el precio con seguridad. Explico el valor y rara vez descuento.", score: 5 },
        { label: "B", text: "Explico el valor, pero si insisten, termino bajando algo para cerrar.", score: 3 },
        { label: "C", text: "Me cuesta responder. Suelo hacer algÃºn descuento o me quedo sin argumentos.", score: 2 },
        { label: "D", text: "Bajo el precio directamente o pierdo la venta. No sÃ© cÃ³mo manejarlo.", score: 1 },
      ],
    },
    {
      id: 4,
      title: "Â¿Tu equipo tira para el mismo lado que vos?",
      subtitle: "PensÃ¡ en la semana laboral promedio.",
      options: [
        { label: "A", text: "SÃ­. Saben para dÃ³nde vamos, tienen iniciativa y confÃ­o en ellos.", score: 5 },
        { label: "B", text: "En general sÃ­, aunque siempre hay alguno que hay que estar empujando.", score: 3 },
        { label: "C", text: "Tengo gente buena, pero falta organizaciÃ³n. Cada uno tira para su lado.", score: 2 },
        { label: "D", text: "Estoy solo o rodeado de personas que no estÃ¡n a la altura.", score: 1 },
      ],
    },
    {
      id: 5,
      title: "Â¿CuÃ¡ntas veces resolvÃ©s el mismo problema en un mes?",
      subtitle: "Los problemas que deberÃ­an estar resueltos para siempre y siguen volviendo.",
      options: [
        { label: "A", text: "Casi nunca. Los problemas se procesan una vez y quedan resueltos para siempre.", score: 5 },
        { label: "B", text: "Algunos se repiten pero los manejo rÃ¡pido porque ya sÃ© cÃ³mo.", score: 3 },
        { label: "C", text: "Varios se repiten. Quiero sistematizar pero no tengo tiempo para hacerlo.", score: 2 },
        { label: "D", text: "Vivo apagando incendios. Lo mismo de siempre, todos los meses, sin parar.", score: 1 },
      ],
    },
    {
      id: 6,
      title: "Â¿TenÃ©s asesores o referentes con quienes hablar de tu negocio?",
      subtitle: "Alguien que te diga la verdad, no solo lo que querÃ©s escuchar.",
      options: [
        { label: "A", text: "SÃ­. Trabajo con asesores que me aportan perspectiva real y me empujan a mejorar.", score: 5 },
        { label: "B", text: "Tengo algunos contactos del rubro que consulto de vez en cuando.", score: 3 },
        { label: "C", text: "Tuve malas experiencias con asesores. Mucha teorÃ­a, pocos resultados.", score: 2 },
        { label: "D", text: "No tengo a nadie. Las decisiones importantes las tomo solo, sin perspectiva externa.", score: 1 },
      ],
    },
    {
      id: 7,
      title: "Â¿PodÃ©s describir cÃ³mo querÃ©s que sea tu negocio en 3 aÃ±os?",
      subtitle: "No lo que querÃ©s ganar. CÃ³mo querÃ©s que funcione.",
      options: [
        { label: "A", text: "SÃ­, tengo una visiÃ³n clara: sÃ© quÃ© empresa quiero ser, quÃ© mercado atacar y cÃ³mo escalar.", score: 5 },
        { label: "B", text: "Tengo ideas generales pero no estÃ¡ definido con claridad ni escrito en ningÃºn lado.", score: 3 },
        { label: "C", text: "Me cuesta proyectarme. El dÃ­a a dÃ­a no me deja pensar en el futuro.", score: 2 },
        { label: "D", text: "Honestamente, no sÃ©. Vivo el presente y que sea lo que Dios quiera.", score: 1 },
      ],
    },
    {
      id: 8,
      title: "Si tuvieras que describir tu momento actual como dueÃ±o, Â¿cuÃ¡l es el mÃ¡s honesto?",
      subtitle: "La respuesta que no le darÃ­as a tu contador ni a tu familia.",
      options: [
        { label: "A", text: "Estoy creciendo y disfruto el proceso. El negocio me da energÃ­a.", score: 5 },
        { label: "B", text: "Funciona, pero algo me dice que podrÃ­a ir mucho mejor.", score: 3 },
        { label: "C", text: "Estoy cansado. TrabajÃ© mucho y los resultados no reflejan el esfuerzo.", score: 2 },
        { label: "D", text: "La verdad es que estoy atascado y no sÃ© por dÃ³nde empezar a destrabar esto.", score: 1 },
      ],
    },
  ],
  scoringRules: [
    { profileKey: "SATURADO", fit: (a) => (a[1] <= 2 ? 3 : 0) + (a[5] <= 2 ? 3 : 0) + (a[4] <= 2 ? 1 : 0) + (a[8] <= 2 ? 1 : 0) },
    { profileKey: "EQUIPO_DESALINEADO", fit: (a) => (a[4] <= 2 ? 3 : 0) + (a[1] >= 3 ? 1 : 0) + (a[5] >= 3 ? 1 : 0) + (a[7] >= 3 ? 1 : 0) },
    { profileKey: "VENDEDOR_SIN_RESULTADOS", fit: (a) => (a[2] <= 2 ? 2 : 0) + (a[3] <= 2 ? 2 : 0) + (a[8] <= 2 ? 2 : 0) },
    { profileKey: "INVISIBLE", fit: (a) => (a[2] <= 2 ? 2 : 0) + (a[3] <= 2 ? 2 : 0) + (a[6] <= 2 ? 1 : 0) },
    { profileKey: "LIDER_SOLO", fit: (a) => (a[7] >= 3 ? 2 : 0) + (a[1] <= 2 ? 2 : 0) + (a[4] <= 2 ? 2 : 0) + (a[5] >= 3 ? 1 : 0) },
    { profileKey: "DESCONECTADO", fit: (a) => (a[1] >= 3 ? 1 : 0) + (a[7] <= 2 ? 2 : 0) + (a[6] <= 2 ? 2 : 0) },
    { profileKey: "ESTANCADO", fit: (a) => (a[2] <= 3 ? 1 : 0) + (a[7] <= 2 ? 1 : 0) + (a[8] <= 3 ? 1 : 0) + (a[1] >= 3 ? 1 : 0) + (a[5] >= 3 ? 1 : 0) },
    { profileKey: "NUEVA_GEN", fit: (a) => (a[8] >= 3 ? 2 : 0) + (a[7] >= 2 ? 1 : 0) + (a[6] <= 2 ? 1 : 0) + (a[2] <= 3 ? 1 : 0) },
  ],
  profiles: {
    SATURADO: {
      key: "SATURADO",
      title: "Saturado",
      tagline: "TrabajÃ¡s el doble. GanÃ¡s la mitad de lo que deberÃ­as.",
      description: "El negocio creciÃ³ sin estructura y ahora todo pasa por vos. Cada decisiÃ³n, cada problema, cada incendio.",
      color: "hsl(var(--brand-rojo))",
      icon: "Flame",
      traits: ["Operativo crÃ³nico", "DelegaciÃ³n nula", "Procesos repetitivos"],
      advice: "NecesitÃ¡s construir sistemas que funcionen sin vos. EmpezÃ¡ por documentar los 3 procesos que mÃ¡s te consumen tiempo.",
    },
    INVISIBLE: {
      key: "INVISIBLE",
      title: "Invisible",
      tagline: "Sos muy bueno en lo que hacÃ©s. El problema es que nadie lo sabe.",
      description: "Tus clientes actuales te valoran, pero los que no te conocen no tienen forma de distinguirte.",
      color: "hsl(var(--brand-azul))",
      icon: "EyeOff",
      traits: ["ComunicaciÃ³n dÃ©bil", "Precio sin defensa", "DiferenciaciÃ³n ausente"],
      advice: "ConstruÃ­ tu argumento de valor. Â¿Por quÃ© vos y no otro? Si no podÃ©s responder eso en 2 frases, tenÃ©s trabajo por hacer.",
    },
    LIDER_SOLO: {
      key: "LIDER_SOLO",
      title: "LÃ­der Solo",
      tagline: "TenÃ©s la visiÃ³n. Falta el equipo que la ejecute sin que estÃ©s encima.",
      description: "Ves claramente para dÃ³nde va el negocio. Pero esa visiÃ³n existe solo en tu cabeza.",
      color: "hsl(var(--brand-azul))",
      icon: "UserX",
      traits: ["Micro-management", "DelegaciÃ³n fallida", "VisiÃ³n sin ejecuciÃ³n"],
      advice: "DelegÃ¡ resultados, no tareas. DefinÃ­ quÃ© esperÃ¡s como resultado y dale a tu equipo la autonomÃ­a para llegar.",
    },
    DESCONECTADO: {
      key: "DESCONECTADO",
      title: "Desconectado",
      tagline: "Tu negocio funciona. Vos ya no sabÃ©s hacia dÃ³nde lo llevÃ¡s.",
      description: "Lograste una operaciÃ³n que corre sola. Pero te desconectaste del rol estratÃ©gico.",
      color: "hsl(var(--brand-amarillo))",
      icon: "Unplug",
      traits: ["Estrategia ausente", "Decisiones sin perspectiva", "Inercia operativa"],
      advice: "ReservÃ¡ 2 horas por semana para pensar en el negocio, no en el negocio. Sin laptop, sin telÃ©fono, solo vos y una libreta.",
    },
    ESTANCADO: {
      key: "ESTANCADO",
      title: "Estancado",
      tagline: "Funciona. Pero sabÃ©s que deberÃ­a estar yendo mucho mejor.",
      description: "No estÃ¡s en crisis. Pero tampoco estÃ¡s creciendo. Lo que te trajo hasta acÃ¡ no es lo que te va a llevar al siguiente nivel.",
      color: "hsl(var(--brand-gris))",
      icon: "Pause",
      traits: ["Crecimiento frenado", "Sin canal propio", "Estrategia difusa"],
      advice: "El estancamiento no se rompe con mÃ¡s esfuerzo. Se rompe cambiando algo. IdentificÃ¡ quÃ© te trajo hasta acÃ¡ y quÃ© necesitÃ¡s cambiar.",
    },
    NUEVA_GEN: {
      key: "NUEVA_GEN",
      title: "Nueva GeneraciÃ³n",
      tagline: "TenÃ©s el motor encendido. NecesitÃ¡s la estructura que lo sostenga.",
      description: "TenÃ©s energÃ­a, visiÃ³n y movimiento. El negocio corre por impulso, no por sistema.",
      color: "hsl(var(--brand-azul))",
      icon: "Rocket",
      traits: ["Alta energÃ­a", "Sin estructura", "Potencial sin techo"],
      advice: "Los que ponen estructura ahora escalan. Los que no, llegan a un techo en 2 aÃ±os y no saben por quÃ©.",
    },
    EQUIPO_DESALINEADO: {
      key: "EQUIPO_DESALINEADO",
      title: "Equipo Desalineado",
      tagline: "Tu equipo quiere avanzar. Pero nadie sabe hacia dÃ³nde.",
      description: "No es que tu equipo sea malo. Es que no tienen un marco comÃºn.",
      color: "hsl(var(--brand-amarillo))",
      icon: "Users",
      traits: ["Roles difusos", "Reuniones improductivas", "Conflictos silenciosos"],
      advice: "Sentate con tu equipo y definan juntos: Â¿QuÃ© es prioridad? Â¿QuiÃ©n hace quÃ©? Â¿CÃ³mo medimos el Ã©xito?",
    },
    VENDEDOR_SIN_RESULTADOS: {
      key: "VENDEDOR_SIN_RESULTADOS",
      title: "Vendedor Sin Resultados",
      tagline: "PonÃ©s el cuerpo todos los dÃ­as. Pero la caja no lo refleja.",
      description: "TrabajÃ¡s mÃ¡s que la mayorÃ­a. Pero el esfuerzo no se traduce en resultados porque no hay estrategia detrÃ¡s.",
      color: "hsl(var(--brand-rojo))",
      icon: "TrendingDown",
      traits: ["Ventas sin proceso", "Ingresos irregulares", "Desgaste emocional"],
      advice: "DejÃ¡ de vender por impulso. DefinÃ­ un proceso claro: prospectar â†’ calificar â†’ presentar â†’ cerrar â†’ seguir.",
    },
  },
};

// â”€â”€ Test 2: MisiÃ³n Rescate (Puzzle) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const misionRescate: TestDefinition = {
  slug: "mision-rescate",
  title: "MisiÃ³n Rescate",
  subtitle: "Â¿CÃ³mo reaccionÃ¡s ante una crisis?",
  description:
    "Tu negocio estÃ¡ en crisis. TenÃ©s 5 situaciones de emergencia y debÃ©s priorizar. No hay tiempo para pensar de mÃ¡s â€” solo para actuar.",
  category: "puzzle",
  icon: "Siren",
  color: "#DC2626",
  bgColor: "bg-red-50 dark:bg-red-950/30",
  gameType: "puzzle",
  timeEstimateMin: 3,
  questions: [
    {
      id: 1,
      title: "ðŸš¨ Lunes 8am: tu mayor cliente amenaza con irse.",
      subtitle: "Representa el 35% de tu facturaciÃ³n. Te da 48hs para mejorar.",
      options: [
        { label: "A", text: "AgendÃ¡s reuniÃ³n presencial hoy mismo para entender quÃ© pasa y ofrecer una soluciÃ³n concreta.", score: 5, optimal: true },
        { label: "B", text: "Le mandÃ¡s un email con un descuento del 15% para retenerlo.", score: 2 },
        { label: "C", text: "Lo pensÃ¡s un par de dÃ­as para armar una propuesta completa.", score: 1 },
      ],
    },
    {
      id: 2,
      title: "ðŸš¨ Tu empleado clave renuncia sin aviso.",
      subtitle: "Es el Ãºnico que maneja el sistema de facturaciÃ³n y tiene clientes asignados.",
      options: [
        { label: "A", text: "PedÃ­s una reuniÃ³n de transferencia de conocimiento antes de que se vaya. Mientras tanto, buscÃ¡s reemplazo.", score: 5, optimal: true },
        { label: "B", text: "Lo dejÃ¡s ir y asumÃ­s vos temporalmente sus tareas.", score: 2 },
        { label: "C", text: "Le ofrecÃ©s mÃ¡s plata para que se quede.", score: 1 },
      ],
    },
    {
      id: 3,
      title: "ðŸš¨ Se corta el suministro de tu proveedor principal.",
      subtitle: "TenÃ©s stock para 5 dÃ­as. Tus clientes esperan entregas esta semana.",
      options: [
        { label: "A", text: "ContactÃ¡s proveedores alternativos ya. ComunicÃ¡s el posible retraso a clientes con un plan de contingencia.", score: 5, optimal: true },
        { label: "B", text: "EsperÃ¡s a ver si el proveedor resuelve en 2-3 dÃ­as.", score: 1 },
        { label: "C", text: "CancelÃ¡s los pedidos y ofrecÃ©s reembolsos.", score: 2 },
      ],
    },
    {
      id: 4,
      title: "ðŸš¨ Un cliente publica una reseÃ±a negativa viral en redes.",
      subtitle: "Tiene 200+ compartidos. Los comentarios se multiplican.",
      options: [
        { label: "A", text: "RespondÃ©s pÃºblicamente con empatÃ­a, asumÃ­s el error y ofrecÃ©s resolverlo por privado. Luego contactÃ¡s al cliente.", score: 5, optimal: true },
        { label: "B", text: "IgnorÃ¡s esperando que paje. Cuanto mÃ¡s atenciÃ³n, peor.", score: 1 },
        { label: "C", text: "PedÃ­s que la reseÃ±a sea eliminada por la plataforma.", score: 2 },
      ],
    },
    {
      id: 5,
      title: "ðŸš¨ Hacienda te notifica una inspecciÃ³n para maÃ±ana.",
      subtitle: "TenÃ©s algunos papeles atrasados y una factura sin registrar.",
      options: [
        { label: "A", text: "OrganizÃ¡s lo que tenÃ©s, preparÃ¡s la documentaciÃ³n disponible y contactÃ¡s a tu contador para estar acompaÃ±ado.", score: 5, optimal: true },
        { label: "B", text: "IntentÃ¡s pedir postergaciÃ³n de la inspecciÃ³n.", score: 2 },
        { label: "C", text: "Te ponÃ©s nervioso y no sabÃ©s por dÃ³nde empezar. DejÃ¡s que pase lo que tenga que pasar.", score: 1 },
      ],
    },
  ],
  scoringRules: [
    { profileKey: "ESTRATEGA", fit: (a) => Object.values(a).filter((v) => v === 5).length },
    { profileKey: "BOMBERO", fit: (a) => Object.values(a).filter((v) => v === 2).length * 2 },
    { profileKey: "PARALIZADO", fit: (a) => Object.values(a).filter((v) => v === 1).length * 3 },
  ],
  profiles: {
    ESTRATEGA: {
      key: "ESTRATEGA",
      title: "Estratega",
      tagline: "Bajo presiÃ³n, priorizÃ¡s con claridad y ejecutÃ¡s con precisiÃ³n.",
      description: "Cuando la crisis golpea, no te congelÃ¡s â€” actuÃ¡s. PensÃ¡s en el problema, no en el pÃ¡nico.",
      color: "#059669",
      icon: "Target",
      traits: ["Claridad bajo presiÃ³n", "PriorizaciÃ³n natural", "ComunicaciÃ³n proactiva"],
      advice: "Tu fortaleza es tomar decisiones bajo presiÃ³n. Asegurate de que tu equipo tambiÃ©n tenga herramientas para hacerlo.",
    },
    BOMBERO: {
      key: "BOMBERO",
      title: "Bombero",
      tagline: "ApagÃ¡s el incendio, pero no siempre elegÃ­s el mejor extintor.",
      description: "ReaccionÃ¡s rÃ¡pido, pero a veces la urgencia te lleva a soluciones parche en vez de soluciones reales.",
      color: "#F59E0B",
      icon: "Flame",
      traits: ["ReacciÃ³n rÃ¡pida", "Soluciones parche", "EnergÃ­a alta"],
      advice: "Tu velocidad es una ventaja, pero necesitÃ¡s un framework de decisiÃ³n. Preguntate: Â¿esto resuelve el problema o solo lo posterga?",
    },
    PARALIZADO: {
      key: "PARALIZADO",
      title: "Paralizado",
      tagline: "La crisis te frena cuando mÃ¡s necesitÃ¡s actuar.",
      description: "No es que no te importe â€” es que la presiÃ³n te bloquea. NecesitÃ¡s estructura para actuar cuando el instinto te dice que te quedes quieto.",
      color: "#6B7280",
      icon: "ShieldAlert",
      traits: ["AnÃ¡lisis excesivo", "EvitaciÃ³n de conflicto", "Respuesta tardÃ­a"],
      advice: "CreÃ¡ un protocolo de crisis antes de que lo necesitÃ©s. Cuando llegue la crisis, seguÃ­ el protocolo, no tu instinto.",
    },
  },
};

// â”€â”€ Test 3: El Camino (Adventure) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const elCamino: TestDefinition = {
  slug: "el-camino",
  title: "El Camino",
  subtitle: "Tu estilo de negociaciÃ³n",
  description:
    "Una narrativa ramificada donde cada decisiÃ³n revela cÃ³mo negociÃ¡s, tomÃ¡s decisiones y manejÃ¡s los conflictos.",
  category: "aventura",
  icon: "Route",
  color: "#7C3AED",
  bgColor: "bg-violet-50 dark:bg-violet-950/30",
  gameType: "adventure",
  timeEstimateMin: 4,
  questions: [
    {
      id: 1,
      title: "LlegÃ¡s a una encrucijada en tu negocio.",
      subtitle: "TenÃ©s que elegir un camino. No hay vuelta atrÃ¡s.",
      options: [
        { label: "A", text: "TomÃ¡s el camino seguro: crecimiento lento pero sostenible.", score: 3, next: 2 },
        { label: "B", text: "TomÃ¡s el camino arriesgado: crecimiento rÃ¡pido pero incierto.", score: 5, next: 3 },
        { label: "C", text: "Buscas un mapa antes de elegir: investigÃ¡s todas las opciones.", score: 2, next: 4 },
      ],
    },
    {
      id: 2,
      title: "El camino seguro tiene un obstÃ¡culo: un competidor grande bloquea tu paso.",
      subtitle: "TenÃ©s menos recursos que Ã©l.",
      options: [
        { label: "A", text: "Lo enfrentÃ¡s directamente con una propuesta diferenciada.", score: 5 },
        { label: "B", text: "Buscas un nicho que Ã©l no estÃ¡ atacando.", score: 4 },
        { label: "C", text: "EsperÃ¡s a que se vaya o cometa un error.", score: 1 },
      ],
    },
    {
      id: 3,
      title: "El camino arriesgado te lleva a una oportunidad grande pero con un socio complicado.",
      subtitle: "El socio tiene contactos pero es difÃ­cil de manejar.",
      options: [
        { label: "A", text: "AceptÃ¡s, pero ponÃ©s reglas claras desde el dÃ­a uno.", score: 5 },
        { label: "B", text: "AceptÃ¡s y vas viendo sobre la marcha.", score: 2 },
        { label: "C", text: "RechazÃ¡s. PreferÃ­s crecer mÃ¡s lento pero mantener el control.", score: 4 },
      ],
    },
    {
      id: 4,
      title: "Mientras investigÃ¡s, descubrÃ­s que tu producto tiene un defecto que nadie notÃ³.",
      subtitle: "Corregirlo cuesta plata y tiempo. No corregirlo es un riesgo latente.",
      options: [
        { label: "A", text: "ParÃ¡s todo y corregÃ­s. La reputaciÃ³n es lo primero.", score: 5 },
        { label: "B", text: "Lo corregÃ­s en silencio en la prÃ³xima versiÃ³n, sin decir nada.", score: 3 },
        { label: "C", text: "Lo ignorÃ¡s por ahora. Si nadie se quejÃ³, Â¿para quÃ© alarmar?", score: 1 },
      ],
    },
    {
      id: 5,
      title: "DespuÃ©s de tu elecciÃ³n, un empleado te pide una reuniÃ³n urgente.",
      subtitle: "Parece nervioso. Dice que tiene algo importante que contarte.",
      options: [
        { label: "A", text: "Lo escuchÃ¡s ahora mismo. Si tiene algo importante, no puede esperar.", score: 5 },
        { label: "B", text: "Le decÃ­s que agende para maÃ±ana. TenÃ©s cosas mÃ¡s urgentes.", score: 2 },
        { label: "C", text: "Le pedÃ­s que te lo mande por email primero para evaluar.", score: 3 },
      ],
    },
  ],
  scoringRules: [
    { profileKey: "DIPLOMATICO", fit: (a) => (a[1] === 3 ? 2 : 0) + (a[3] === 5 ? 2 : 0) + (a[5] === 5 ? 2 : 0) + (a[2] === 4 ? 1 : 0) + (a[4] === 5 ? 1 : 0) },
    { profileKey: "AGRESIVO", fit: (a) => (a[1] === 5 ? 2 : 0) + (a[2] === 5 ? 2 : 0) + (a[3] === 2 ? 1 : 0) + (a[4] === 1 ? 2 : 0) },
    { profileKey: "EVITADOR", fit: (a) => (a[1] === 2 ? 2 : 0) + (a[2] === 1 ? 2 : 0) + (a[3] === 4 ? 1 : 0) + (a[4] === 3 ? 1 : 0) + (a[5] === 2 ? 1 : 0) },
  ],
  profiles: {
    DIPLOMATICO: {
      key: "DIPLOMATICO",
      title: "DiplomÃ¡tico",
      tagline: "NegociÃ¡s con inteligencia emocional. CerrÃ¡s acuerdos que duran.",
      description: "No buscÃ¡s ganar â€” buscÃ¡s que funcione para todos. Tu fortaleza es leer la situaciÃ³n y adaptar tu estrategia.",
      color: "#059669",
      icon: "Handshake",
      traits: ["EmpatÃ­a estratÃ©gica", "Acuerdos duraderos", "ComunicaciÃ³n asertiva"],
      advice: "Tu estilo construye relaciones. Cuidado con ser tan diplomÃ¡tico que evitÃ¡s los conflictos necesarios.",
    },
    AGRESIVO: {
      key: "AGRESIVO",
      title: "Directo",
      tagline: "Vas al grano. CerrÃ¡s rÃ¡pido. A veces dejÃ¡s cosas en el camino.",
      description: "No perdÃ©s tiempo. SabÃ©s lo que querÃ©s y vas por ello. El riesgo es que a veces la velocidad te hace perder detalles importantes.",
      color: "#DC2626",
      icon: "Zap",
      traits: ["DecisiÃ³n rÃ¡pida", "Orientado a resultados", "Impaciente con rodeos"],
      advice: "Tu velocidad es poderosa, pero aprendÃ© a pausar antes de decisiones grandes. 5 minutos de reflexiÃ³n pueden salvarte 5 meses de problemas.",
    },
    EVITADOR: {
      key: "EVITADOR",
      title: "Evitador",
      tagline: "PreferÃ­s la paz. Pero a veces la paz es estancamiento disfrazado.",
      description: "No te gustan los conflictos ni las decisiones irreversibles. Tu prudencia es una virtud hasta que se convierte en parÃ¡lisis.",
      color: "#6B7280",
      icon: "Shield",
      traits: ["Prudente", "AnÃ¡lisis excesivo", "Evita confrontaciÃ³n"],
      advice: "La evitaciÃ³n no es paz â€” es deuda. Cada conflicto evitado hoy es un problema mayor maÃ±ana. PracticÃ¡ tener conversaciones difÃ­ciles.",
    },
  },
};

// â”€â”€ Test 4: Mind Lab (Mental) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const mindLab: TestDefinition = {
  slug: "mind-lab",
  title: "Mind Lab",
  subtitle: "Tu patrÃ³n de comunicaciÃ³n",
  description:
    "10 preguntas rÃ¡pidas. Cada una mide cÃ³mo respondÃ©s ante situaciones laborales y emocionales. No pensÃ©s de mÃ¡s â€” dejÃ¡ que tu instinto hable.",
  category: "mental",
  icon: "Brain",
  color: "#0891B2",
  bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
  gameType: "mental",
  timeEstimateMin: 3,
  questions: [
    {
      id: 1,
      title: "Un cliente te manda un audio de 5 minutos quejÃ¡ndose.",
      timeLimit: 15,
      options: [
        { label: "A", text: "Lo escuchÃ¡s completo y respondÃ©s con calma.", score: 4 },
        { label: "B", text: "LeÃ©s el resumen y respondÃ©s directo al punto.", score: 5 },
        { label: "C", text: "Te da ansiedad y lo dejÃ¡s para despuÃ©s.", score: 1 },
      ],
    },
    {
      id: 2,
      title: "En una reuniÃ³n, alguien dice algo incorrecto sobre tu rubro.",
      timeLimit: 15,
      options: [
        { label: "A", text: "Lo corregÃ­s en el momento, con datos.", score: 5 },
        { label: "B", text: "Lo dejÃ¡s pasar para no generar conflicto.", score: 2 },
        { label: "C", text: "Lo corregÃ­s despuÃ©s, en privado.", score: 3 },
      ],
    },
    {
      id: 3,
      title: "Tu equipo estÃ¡ discutiendo y las voces se elevan.",
      timeLimit: 15,
      options: [
        { label: "A", text: "IntervenÃ­s y ponÃ©s orden. Hay que bajar la temperatura.", score: 4 },
        { label: "B", text: "Los dejÃ¡s resolver solos. Son adultos.", score: 2 },
        { label: "C", text: "CambiÃ¡s el tema y lo hablan en otro momento.", score: 3 },
      ],
    },
    {
      id: 4,
      title: "Te llega un mensaje de un contacto que no hablÃ¡s hace 2 aÃ±os pidiÃ©ndote un favor.",
      timeLimit: 15,
      options: [
        { label: "A", text: "RespondÃ©s rÃ¡pido y ayudÃ¡s. Las redes se cuidan.", score: 4 },
        { label: "B", text: "RespondÃ©s cuando puedÃ¡s, sin urgencia.", score: 3 },
        { label: "C", text: "Lo ignorÃ¡s. Si no hablÃ³ en 2 aÃ±os, Â¿por quÃ© ahora?", score: 1 },
      ],
    },
    {
      id: 5,
      title: "TenÃ©s que dar feedback negativo a alguien de tu equipo.",
      timeLimit: 15,
      options: [
        { label: "A", text: "Lo hacÃ©s en privado, con ejemplos concretos y un plan de mejora.", score: 5 },
        { label: "B", text: "Se lo decÃ©s rÃ¡pido para no prolongar la incomodidad.", score: 2 },
        { label: "C", text: "Se lo dejÃ¡s por escrito para evitar la cara.", score: 1 },
      ],
    },
    {
      id: 6,
      title: "Un proveedor te aumenta un 30% sin aviso.",
      timeLimit: 15,
      options: [
        { label: "A", text: "LlamÃ¡s y negociÃ¡s. Si no cede, buscÃ¡s alternativas.", score: 5 },
        { label: "B", text: "Lo aceptÃ¡s porque no tenÃ©s tiempo de buscar otro.", score: 1 },
        { label: "C", text: "Le mandÃ¡s un mensaje enojado.", score: 2 },
      ],
    },
    {
      id: 7,
      title: "EstÃ¡s agotado y llega un pedido urgente de un cliente importante.",
      timeLimit: 15,
      options: [
        { label: "A", text: "Lo hacÃ©s, pero marcÃ¡s que la prÃ³xima vez necesitÃ¡s mÃ¡s tiempo.", score: 4 },
        { label: "B", text: "Lo hacÃ©s sin decir nada. Es tu trabajo.", score: 2 },
        { label: "C", text: "Le decÃ­s que no podÃ©s y lo reprogramÃ¡s.", score: 5 },
      ],
    },
    {
      id: 8,
      title: "Alguien de tu red publica un logro profesional grande.",
      timeLimit: 15,
      options: [
        { label: "A", text: "Le escribÃ­s una felicitaciÃ³n genuina.", score: 5 },
        { label: "B", text: "Le das like y listo.", score: 3 },
        { label: "C", text: "SentÃ­s envidia y scrolleÃ¡s.", score: 1 },
      ],
    },
    {
      id: 9,
      title: "TenÃ©s 3 prioridades urgentes y solo tiempo para 1.",
      timeLimit: 15,
      options: [
        { label: "A", text: "ElegÃ­s la que mÃ¡s impacto tiene en el negocio.", score: 5 },
        { label: "B", text: "ElegÃ­s la mÃ¡s fÃ¡cil de resolver.", score: 2 },
        { label: "C", text: "TratÃ¡s de hacer las 3 a medias.", score: 1 },
      ],
    },
    {
      id: 10,
      title: "DespuÃ©s de un dÃ­a difÃ­cil, Â¿quÃ© hacÃ©s?",
      timeLimit: 15,
      options: [
        { label: "A", text: "DesconectÃ¡s: deporte, familia, algo que no sea trabajo.", score: 5 },
        { label: "B", text: "SeguÃ­s revisando emails hasta dormir.", score: 1 },
        { label: "C", text: "RepasÃ¡s mentalmente todo lo que saliÃ³ mal.", score: 2 },
      ],
    },
  ],
  scoringRules: [
    { profileKey: "CONECTOR", fit: (a) => (a[1] >= 4 ? 2 : 0) + (a[3] >= 4 ? 2 : 0) + (a[4] >= 4 ? 2 : 0) + (a[5] >= 4 ? 1 : 0) + (a[8] >= 4 ? 1 : 0) },
    { profileKey: "TECNICO", fit: (a) => (a[2] >= 4 ? 2 : 0) + (a[5] >= 4 ? 2 : 0) + (a[6] >= 4 ? 2 : 0) + (a[9] >= 4 ? 1 : 0) },
    { profileKey: "CAOTICO", fit: (a) => (a[1] <= 2 ? 2 : 0) + (a[3] <= 2 ? 2 : 0) + (a[7] <= 2 ? 2 : 0) + (a[9] <= 2 ? 2 : 0) + (a[10] <= 2 ? 1 : 0) },
  ],
  profiles: {
    CONECTOR: {
      key: "CONECTOR",
      title: "Conector",
      tagline: "Tu inteligencia emocional es tu mayor activo comercial.",
      description: "LeÃ©s las personas, construÃ­s relaciones y mantenÃ©s redes. La gente confÃ­a en vos.",
      color: "#059669",
      icon: "Heart",
      traits: ["EmpatÃ­a alta", "Redes fuertes", "ComunicaciÃ³n fluida"],
      advice: "Tu fortaleza es relacional. Cuidado con absorber las emociones de todos â€” ponÃ© lÃ­mites sanos.",
    },
    TECNICO: {
      key: "TECNICO",
      title: "TÃ©cnico",
      tagline: "Sos claro, directo y eficiente. Pero a veces faltÃ¡ calidez.",
      description: "PriorizÃ¡s la eficiencia sobre la empatÃ­a. Tus respuestas son correctas, pero no siempre las mÃ¡s humanas.",
      color: "#2563EB",
      icon: "Cpu",
      traits: ["Eficiente", "Directo", "Orientado a datos"],
      advice: "Tu claridad es una ventaja. SumÃ¡ una dosis de empatÃ­a y vas a ser imparable. Las personas no recuerdan quÃ© dijiste, sino cÃ³mo las hiciste sentir.",
    },
    CAOTICO: {
      key: "CAOTICO",
      title: "CaÃ³tico",
      tagline: "Tus respuestas son inconsistentes. A veces brillante, a veces desastroso.",
      description: "Tu comunicaciÃ³n depende de tu estado de Ã¡nimo. Un dÃ­a sos el mejor lÃ­der, al siguiente generÃ¡s conflicto sin querer.",
      color: "#F59E0B",
      icon: "Tornado",
      traits: ["Inconsistente", "Emocional", "Impredecible"],
      advice: "La consistencia es la base de la confianza. CreÃ¡ rutinas de comunicaciÃ³n: agendas, templates, checklists. ReducÃ­ la dependencia de tu humor.",
    },
  },
};

// â”€â”€ Test 5: Logic Gate (Logic) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const logicGate: TestDefinition = {
  slug: "logic-gate",
  title: "Logic Gate",
  subtitle: "Tu pensamiento sistÃ©mico",
  description:
    "5 escenarios de negocio con mÃºltiples variables. ElegÃ­s la mejor estrategia. No hay trampa â€” solo lÃ³gica.",
  category: "logica",
  icon: "CircuitBoard",
  color: "#4F46E5",
  bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
  gameType: "logic",
  timeEstimateMin: 4,
  questions: [
    {
      id: 1,
      title: "Tu negocio tiene 3 productos. El A da 60% de ganancia pero se vende lento. El B da 20% pero se vende rÃ¡pido. El C da 40% y tiene demanda estable.",
      subtitle: "TenÃ©s presupuesto para promocionar solo uno este mes.",
      options: [
        { label: "A", text: "Promociono A: mayor margen, mayor impacto si despega.", score: 3 },
        { label: "B", text: "Promociono B: volumen alto = flujo de caja seguro.", score: 2 },
        { label: "C", text: "Promociono C: equilibrio entre margen y volumen. Menor riesgo.", score: 5 },
      ],
    },
    {
      id: 2,
      title: "TenÃ©s 2 canales de venta: online (crece 15%/mes) y presencial (crece 3%/mes). El online requiere inversiÃ³n tech. El presencial ya funciona.",
      subtitle: "TenÃ©s $100 para distribuir entre ambos.",
      options: [
        { label: "A", text: "$80 online, $20 presencial. Apostar al crecimiento.", score: 3 },
        { label: "B", text: "$50 y $50. Equilibrar riesgo y crecimiento.", score: 2 },
        { label: "C", text: "$60 online, $40 presencial. Crecer online sin matar presencial.", score: 5 },
      ],
    },
    {
      id: 3,
      title: "Un competidor baja precios un 25%. Tu margen actual es del 30%.",
      subtitle: "Si bajÃ¡s, perdÃ©s margen. Si no bajÃ¡s, podÃ©s perder clientes.",
      options: [
        { label: "A", text: "No bajo. Me diferencio en calidad y servicio.", score: 5 },
        { label: "B", text: "Bajo un 15% para no perder volumen.", score: 2 },
        { label: "C", text: "Bajo un 25% para igualarlo. Guerra de precios.", score: 1 },
      ],
    },
    {
      id: 4,
      title: "Tu equipo de 5 personas tiene 2 personas top y 3 promedio. TenÃ©s presupuesto para capacitar a todos o contratar a 1 persona top mÃ¡s.",
      subtitle: "La capacitaciÃ³n cuesta lo mismo que 1 contrataciÃ³n.",
      options: [
        { label: "A", text: "Capacito a los 5. Elevo el piso del equipo.", score: 3 },
        { label: "B", text: "Contrato 1 top. Sumo fuerza donde mÃ¡s necesito.", score: 2 },
        { label: "C", text: "Capacito a los 3 promedio y delego a los 2 top para que lideren.", score: 5 },
      ],
    },
    {
      id: 5,
      title: "Tu facturaciÃ³n crece 20% mensual pero tu flujo de caja es negativo hace 3 meses.",
      subtitle: "EstÃ¡s creciendo, pero gastando mÃ¡s de lo que entra.",
      options: [
        { label: "A", text: "Sigo creciendo. El crecimiento se paga solo eventualmente.", score: 1 },
        { label: "B", text: "Freno el crecimiento y mejoro mÃ¡rgenes antes de seguir.", score: 5 },
        { label: "C", text: "Busco financiamiento para bancar el crecimiento.", score: 3 },
      ],
    },
  ],
  scoringRules: [
    { profileKey: "ARQUITECTO", fit: (a) => Object.values(a).filter((v) => v === 5).length * 3 },
    { profileKey: "INTUITIVO", fit: (a) => Object.values(a).filter((v) => v === 3).length * 2 },
    { profileKey: "IMPROVISADOR", fit: (a) => Object.values(a).filter((v) => v <= 2).length * 2 },
  ],
  profiles: {
    ARQUITECTO: {
      key: "ARQUITECTO",
      title: "Arquitecto",
      tagline: "PensÃ¡s en sistemas. Cada decisiÃ³n tiene un porquÃ©.",
      description: "No improvisÃ¡s â€” diseÃ±Ã¡s. Tu fortaleza es ver las conexiones entre las decisiones y sus consecuencias.",
      color: "#4F46E5",
      icon: "Layers",
      traits: ["Pensamiento sistÃ©mico", "PlanificaciÃ³n", "VisiÃ³n de largo plazo"],
      advice: "Tu pensamiento es tu ventaja competitiva. Cuidado con el anÃ¡lisis paralysis â€” a veces hay que actuar con 80% de informaciÃ³n.",
    },
    INTUITIVO: {
      key: "INTUITIVO",
      title: "Intuitivo",
      tagline: "Tu instinto es bueno. Pero no siempre sabÃ©s por quÃ©.",
      description: "TomÃ¡s decisiones razonables sin un framework explÃ­cito. Tu intuiciÃ³n es experiencia acumulada, pero a veces te falla.",
      color: "#7C3AED",
      icon: "Lightbulb",
      traits: ["Instinto agudo", "Adaptabilidad", "Decisiones rÃ¡pidas"],
      advice: "Tu intuiciÃ³n es valiosa â€” pero documentala. Cuando aciertÃ¡s, escribÃ­ por quÃ©. Eso convierte tu instinto en un sistema replicable.",
    },
    IMPROVISADOR: {
      key: "IMPROVISADOR",
      title: "Improvisador",
      tagline: "ResolvÃ©s sobre la marcha. A veces funciona, a veces no.",
      description: "No tenÃ©s un framework de decisiÃ³n. ElegÃ­s lo que parece mejor en el momento, sin evaluar todas las variables.",
      color: "#F59E0B",
      icon: "Dice5",
      traits: ["Reactividad", "Sin framework", "Resultados variables"],
      advice: "Antes de cada decisiÃ³n grande, hacete 3 preguntas: Â¿QuÃ© puede salir mal? Â¿CuÃ¡l es el costo de no hacer nada? Â¿QuÃ© harÃ­a alguien que sabe mÃ¡s que yo?",
    },
  },
};

// â”€â”€ Export all tests â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const ALL_TESTS: TestDefinition[] = [
  mirrorEstrategico,
  misionRescate,
  elCamino,
  mindLab,
  logicGate,
];

export function getTestBySlug(slug: string): TestDefinition | undefined {
  return ALL_TESTS.find((t) => t.slug === slug);
}

export function calculateProfile(
  test: TestDefinition,
  answers: Record<number, number>,
  totalTime?: number
): string {
  let bestKey = "";
  let bestScore = -1;

  for (const rule of test.scoringRules) {
    const score = rule.fit(answers, totalTime);
    if (score > bestScore) {
      bestScore = score;
      bestKey = rule.profileKey;
    }
  }

  return bestKey || Object.keys(test.profiles)[0];
}

