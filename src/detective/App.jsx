import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Eye, Search, Fingerprint, Brain, ScrollText, Scale, Users, ShieldAlert,
  Handshake, MessageSquare, Lock, ChevronLeft, CheckCircle2, XCircle,
  Lightbulb, Award, Flame, Target, BookOpen, FlaskConical, RotateCcw,
  Sparkles, Quote, Gauge, Network, Compass, GripVertical, ChevronUp, ChevronDown
} from "lucide-react";

/* ============================================================
   ACADEMIA DEDUCTIVA — Expediente del Investigador
   Diseño "case-file" noir. 30% teoría / 70% práctica.
   Un solo archivo. Sin librerías externas salvo lucide-react.
   ============================================================ */

const RANKS = [
  { min: 0,    name: "Aspirante",     icon: "🔍" },
  { min: 300,  name: "Observador",    icon: "👁️" },
  { min: 700,  name: "Investigador",  icon: "🗂️" },
  { min: 1100, name: "Analista",      icon: "🧠" },
  { min: 1600, name: "Perfilador",    icon: "🎯" },
  { min: 2100, name: "Mente Maestra", icon: "🎖️" },
];

const ICONS = { Eye, Search, Fingerprint, Brain, ScrollText, Scale, Users, ShieldAlert, Handshake, MessageSquare, Lock, Gauge, Network, Compass };

/* ------------------------------------------------------------
   CONTENIDO  (teoría breve + práctica abundante)
   tipos de ejercicio: "mc" | "multi" | "classify" | "observe"
   ------------------------------------------------------------ */
const MODULES = [
  {
    id: "obs",
    icon: "Eye",
    title: "Observación",
    tag: "Ver lo que otros miran",
    accent: "#c9a227",
    theory: [
      { h: "Los 5 niveles de observación", p: "No basta con mirar. (1) Notar qué hay. (2) Notar diferencias. (3) Notar patrones. (4) Notar anomalías. (5) Notar lo que falta. El nivel 5 es el más poderoso: el perro que no ladró dice tanto como el que ladra." },
      { h: "Canales sensoriales", p: "Entrena más que la vista: ritmo y pausas en la voz, micro-movimientos (adaptadores y tics), incluso olor (higiene, perfume, químicos) y textura (manos callosas = trabajo manual)." },
      { h: "El ejercicio del café", p: "10 minutos observando a una persona en público: anota 10 detalles físicos, 5 comportamientos y 3 deducciones. Verifica cuando puedas. La precisión sube con repetición — es neuroplasticidad pura." },
    ],
    exercises: [
      {
        type: "observe",
        prompt: "Memoriza la escena 6 segundos. Luego responderás sobre ella.",
        scene: [
          { e: "🕯️", l: "vela" }, { e: "📕", l: "libro rojo" }, { e: "🔑", l: "llave" },
          { e: "🍷", l: "copa" }, { e: "🧤", l: "guante" }, { e: "⌚", l: "reloj" },
        ],
        questions: [
          { q: "¿Cuántos objetos había en la escena?", options: ["5", "6", "7", "8"], answer: 1, exp: "Eran 6 objetos. Contar el total es 'notar qué hay': el nivel 1." },
          { q: "¿Cuál de estos objetos NO estaba presente?", options: ["llave", "copa", "anillo", "reloj"], answer: 2, exp: "El anillo nunca apareció. Detectar lo que falta o lo que se añade es el nivel 5." },
        ],
      },
      {
        type: "mc",
        prompt: "Un hombre entra con zapatos impecables pero los bajos del pantalón salpicados de barro seco. Llueve fuerte desde hace horas. ¿Qué es lo más razonable deducir?",
        options: [
          "Llegó caminando bajo la lluvia hace un momento",
          "Estuvo en exteriores antes de que empezara la lluvia y luego se resguardó",
          "Acaba de lustrarse los zapatos en la entrada",
          "Vino en transporte público abarrotado",
        ],
        answer: 1,
        exp: "Barro SECO con lluvia activa = el barro se formó antes de llover. La anomalía (seco vs. lluvia) reordena la cronología. Eso es nivel 4: notar lo que no encaja.",
      },
      {
        type: "multi",
        prompt: "Observas a una persona en una cafetería. ¿Cuáles de estos son DATOS observables (no interpretaciones)? Selecciona todos.",
        options: [
          "Tiene callos en las yemas de los dedos de la mano izquierda",
          "Está triste por una ruptura",
          "Mira la puerta cada vez que se abre",
          "Es una persona insegura",
          "Lleva una alianza con marca de bronceado más clara debajo",
        ],
        answers: [0, 2, 4],
        exp: "Callos, la mirada a la puerta y la marca del anillo son OBSERVABLES. 'Triste por ruptura' e 'insegura' son interpretaciones que aún no puedes verificar. Separar dato de conclusión es la base del método.",
      },
    ],
  },
  {
    id: "logic",
    icon: "Scale",
    title: "Lógica Deductiva",
    tag: "Del indicio a la conclusión",
    accent: "#7ea8be",
    theory: [
      { h: "Deducción, inducción, abducción", p: "Deducción: de reglas generales a un caso (certeza si las premisas son ciertas). Inducción: de casos a una regla general (probable). Abducción: la mejor explicación disponible (lo que más usa un detective). No las confundas: la abducción nunca da certeza." },
      { h: "Dos reglas que no fallan", p: "Modus Ponens: si A→B y ocurre A, entonces B. Modus Tollens: si A→B y NO ocurre B, entonces NO ocurrió A. La segunda es oro puro para descartar sospechosos." },
      { h: "Falacias = trampas del razonamiento", p: "Ad hominem (atacar a la persona), hombre de paja (distorsionar el argumento), apelación a la autoridad, pendiente resbaladiza, sesgo de confirmación. Detectarlas te protege de ser manipulado." },
    ],
    exercises: [
      {
        type: "mc",
        prompt: "Regla: 'Si el sospechoso estuvo en la escena, sus huellas estarían en el arma.' Las huellas NO están en el arma. ¿Qué se concluye con certeza lógica?",
        options: [
          "El sospechoso es inocente de todo",
          "El sospechoso no estuvo en la escena (según esa regla)",
          "Alguien limpió el arma",
          "Nada se puede concluir",
        ],
        answer: 1,
        exp: "Es Modus Tollens: A→B, no-B, por lo tanto no-A. Ojo: solo es válido DENTRO de esa regla. Que limpiaran el arma rompería la premisa — por eso un buen investigador cuestiona la regla, no solo la lógica.",
      },
      {
        type: "classify",
        prompt: "Clasifica cada frase según la falacia que comete.",
        categories: ["Ad hominem", "Hombre de paja", "Pendiente resbaladiza"],
        items: [
          { text: "'No le creas, siempre ha sido un perdedor.'", cat: 0 },
          { text: "'Si dejamos pasar esto, mañana habrá caos total y el fin del orden.'", cat: 2 },
          { text: "'Dices que revisemos el gasto, o sea que quieres cerrar la empresa.'", cat: 1 },
          { text: "'Su opinión no vale, ni siquiera terminó la escuela.'", cat: 0 },
        ],
        exp: "Ad hominem ataca a la persona; el hombre de paja distorsiona lo que el otro dijo para refutar algo que nunca afirmó; la pendiente resbaladiza inventa una cadena catastrófica sin justificarla.",
      },
      {
        type: "mc",
        prompt: "Tres personas: Ana, Beto, Cris. El culpable miente; los demás dicen la verdad. Ana dice 'Yo no fui'. Beto dice 'Cris fue'. Cris dice 'Beto miente'. ¿Quién es el culpable?",
        options: ["Ana", "Beto", "Cris", "Imposible saberlo"],
        answer: 1,
        exp: "Si Beto fuera inocente diría la verdad, pero acusa a Cris y Cris lo desmiente; alguien miente. Probando: si Beto es el culpable (miente), entonces 'Cris fue' es falso (correcto, no fue Cris), Cris dice la verdad ('Beto miente' ✔) y Ana dice la verdad. Todo encaja solo con Beto culpable.",
      },
    ],
  },
  {
    id: "emo",
    icon: "Brain",
    title: "Emociones y Microexpresiones",
    tag: "El rostro habla primero",
    accent: "#c0796a",
    theory: [
      { h: "Las 7 emociones universales (Ekman)", p: "Felicidad, tristeza, miedo, ira, sorpresa, asco y desprecio se expresan igual en toda cultura. La sorpresa dura un cuarto de segundo y es casi imposible de fingir." },
      { h: "Sonrisa genuina vs. fingida", p: "La sonrisa real (de Duchenne) arruga la zona de los ojos (orbicularis oculi). La fingida solo levanta las comisuras y suele durar 'demasiado'. Mirar los ojos, no la boca, delata la diferencia." },
      { h: "Microexpresiones", p: "Destellos de 1/25 a 1/5 de segundo que filtran la emoción real antes de que el control consciente la oculte. No prueban mentira por sí solas: prueban una emoción que la persona intenta esconder." },
    ],
    exercises: [
      {
        type: "mc",
        prompt: "Cejas internas elevadas, comisuras de la boca hacia abajo, mirada baja. ¿Qué emoción es?",
        options: ["Miedo", "Tristeza", "Desprecio", "Asco"],
        answer: 1,
        exp: "La elevación de las cejas INTERNAS junto con comisuras hacia abajo es la firma de la tristeza. El miedo eleva las cejas completas y abre los ojos.",
      },
      {
        type: "mc",
        prompt: "Una comisura de la boca se eleva solo de un lado (asimetría), con leve tensión. ¿Qué señal es?",
        options: ["Felicidad contenida", "Desprecio", "Sorpresa", "Ira"],
        answer: 1,
        exp: "El desprecio es la única emoción universal asimétrica: una comisura sube de un lado. Suele indicar que la persona se siente superior a lo que observa.",
      },
      {
        type: "classify",
        prompt: "Clasifica cada descripción según si la sonrisa es probablemente GENUINA o FINGIDA.",
        categories: ["Genuina", "Fingida"],
        items: [
          { text: "Arrugas marcadas alrededor de los ojos, aparece y se va en ~1 segundo.", cat: 0 },
          { text: "Boca amplia pero ojos totalmente quietos, se mantiene fija varios segundos.", cat: 1 },
          { text: "Mejillas que suben y empujan el párpado inferior.", cat: 0 },
          { text: "Sonrisa que aparece un instante después de la frase que la 'provoca'.", cat: 1 },
        ],
        exp: "La clave está en los ojos: la sonrisa genuina activa el orbicularis oculi (arrugas, mejillas que suben). El desfase temporal y la duración excesiva delatan la fingida.",
      },
    ],
  },
  {
    id: "lies",
    icon: "Search",
    title: "Detección de Engaños",
    tag: "Señales, no certezas",
    accent: "#b5651d",
    theory: [
      { h: "La verdad incómoda", p: "Nadie detecta mentiras al 100%. Los estudios serios dan 55–65% de acierto — apenas mejor que el azar. No existe 'la señal definitiva'. Quien te promete un truco infalible te está vendiendo humo." },
      { h: "Lo que SÍ funciona", p: "Triangulación: varias señales + contexto + desviación respecto al BASELINE de esa persona. Buscar inconsistencias en la historia y verificarlas con datos externos. Nunca una sola pista." },
      { h: "Cuidado con el falso positivo", p: "Una persona ansiosa, tímida o con estrés postraumático puede 'parecer' que miente. El nerviosismo no es culpa. Por eso se compara contra su normal, no contra un ideal." },
    ],
    exercises: [
      {
        type: "multi",
        prompt: "En una declaración, ¿cuáles son SEÑALES VERBALES asociadas a posible engaño? Selecciona todas.",
        options: [
          "Cambio de pronombre: pasa de 'yo' a 'uno' o a tercera persona",
          "Exceso de detalle en un punto y vacío total en otro",
          "Repetir 'para ser totalmente honesto contigo...'",
          "Responder rápido y con detalles verificables y específicos",
          "No responder la pregunta que se hizo, sino otra parecida",
        ],
        answers: [0, 1, 2, 4],
        exp: "El distanciamiento del pronombre, el desbalance de detalle, los reforzadores de honestidad y la evasión son señales de alerta. La respuesta concreta y verificable (opción 4) suele ir con la verdad.",
      },
      {
        type: "mc",
        prompt: "Un testigo honesto pero con ansiedad social evita el contacto visual y le tiembla la voz. Aplicas la regla 'evitar la mirada = mentira'. ¿Cuál es el error?",
        options: [
          "Ninguno, evitar la mirada siempre indica mentira",
          "Ignoraste el baseline: para esa persona eso es lo normal",
          "Debiste presionar más fuerte",
          "El contacto visual no importa nunca",
        ],
        answer: 1,
        exp: "Es un falso positivo clásico. Sin conocer el comportamiento normal de la persona, confundes ansiedad con engaño. El cambio respecto al baseline informa; el rasgo aislado no.",
      },
      {
        type: "mc",
        prompt: "Tienes 4 señales de alerta verbales + 3 no verbales + una contradicción de horario verificable. ¿Cuál es la conclusión profesional?",
        options: [
          "Es 100% culpable, caso cerrado",
          "Engaño probable: amerita verificación externa antes de afirmar nada",
          "Es inocente porque está nervioso",
          "No se puede concluir nada nunca",
        ],
        answer: 1,
        exp: "La triangulación apunta a engaño PROBABLE, pero la palabra clave es 'verificar'. La contradicción de horario es la pieza más sólida porque es comprobable con datos, no con intuición.",
      },
    ],
  },
  {
    id: "prof",
    icon: "Fingerprint",
    title: "Perfilación (Forense)",
    tag: "Leer la conducta en la escena",
    accent: "#9c6b9c",
    theory: [
      { h: "Organizado vs. desorganizado", p: "Modelo del FBI. El ofensor ORGANIZADO planifica, controla a la víctima, no deja evidencia y suele tener vida estable. El DESORGANIZADO actúa por impulso, deja caos y evidencia. Es un marco académico de análisis, no una etiqueta mágica." },
      { h: "MO vs. firma", p: "El Modus Operandi es lo NECESARIO para cometer el acto (puede mejorar con la práctica). La FIRMA es lo psicológicamente necesario, lo que la persona 'quiere' hacer: no cambia, porque está en su naturaleza. La firma identifica; el MO solo describe." },
      { h: "Victimología", p: "La víctima rara vez es aleatoria: se selecciona por vulnerabilidad y acceso. Estudiar quién era, su rutina y sus puntos débiles revela cómo opera y piensa el ofensor." },
    ],
    exercises: [
      {
        type: "classify",
        prompt: "Clasifica cada rasgo de escena como propio de un ofensor ORGANIZADO o DESORGANIZADO.",
        categories: ["Organizado", "Desorganizado"],
        items: [
          { text: "Trae sus propias herramientas y se las lleva al irse.", cat: 0 },
          { text: "Deja el cuerpo y abundante evidencia en el lugar.", cat: 1 },
          { text: "Selecciona a la víctima con anticipación y vigila su rutina.", cat: 0 },
          { text: "Ataque impulsivo, sin plan ni ruta de escape pensada.", cat: 1 },
        ],
        exp: "Planificación, control y limpieza = organizado. Impulso, caos y evidencia abundante = desorganizado. Muchos casos reales son MIXTOS, así que el marco orienta pero no encajona.",
      },
      {
        type: "classify",
        prompt: "Distingue MO (lo necesario para el acto) de FIRMA (lo psicológicamente deseado).",
        categories: ["MO", "Firma"],
        items: [
          { text: "Usar una ganzúa para entrar sin forzar la puerta.", cat: 0 },
          { text: "Reacomodar siempre los objetos en un orden ritual específico.", cat: 1 },
          { text: "Cambiar de herramienta a una más eficiente con el tiempo.", cat: 0 },
          { text: "Dejar un mismo símbolo personal en cada escena.", cat: 1 },
        ],
        exp: "El MO es táctico y evoluciona. La firma es psicológica y constante: el ritual y el símbolo personal repetidos son lo que conecta casos entre sí.",
      },
      {
        type: "mc",
        prompt: "Estudiando victimología, ¿cuál es la pregunta más reveladora sobre el ofensor?",
        options: [
          "¿La víctima era simpática?",
          "¿Por qué ESTA víctima y no otra? ¿Qué acceso y vulnerabilidad la hicieron alcanzable?",
          "¿Cuánto dinero tenía?",
          "¿Le caía bien a sus vecinos?",
        ],
        answer: 1,
        exp: "El 'por qué esta persona' revela el método de selección, la zona de confort y la psicología del ofensor. La víctima es una ventana hacia quien la eligió.",
      },
    ],
  },
  {
    id: "persuade",
    icon: "Users",
    title: "Persuasión Ética (Cialdini)",
    tag: "Por qué decimos que sí",
    accent: "#5b8c5a",
    theory: [
      { h: "Los 6 principios", p: "Reciprocidad (devolvemos favores), Compromiso y coherencia (sostenemos lo dicho), Prueba social (imitamos a otros), Autoridad (obedecemos al experto), Simpatía (preferimos a quien se nos parece) y Escasez (valoramos lo raro)." },
      { h: "Usar vs. detectar", p: "Conocer estos principios sirve para dos cosas igual de valiosas: comunicar mejor de forma honesta y, sobre todo, RECONOCER cuándo un anuncio o un vendedor los usa contra ti." },
      { h: "Sinergia", p: "Un principio persuade; varios combinados multiplican. 'Recomendado por expertos (autoridad) + miles de clientes (prueba social) + solo por hoy (escasez)' es la receta clásica de la publicidad." },
    ],
    exercises: [
      {
        type: "classify",
        prompt: "Identifica el principio de Cialdini en cada frase.",
        categories: ["Reciprocidad", "Prueba social", "Escasez", "Autoridad"],
        items: [
          { text: "'Te dejo esta muestra gratis para que la pruebes.'", cat: 0 },
          { text: "'9 de cada 10 dentistas lo recomiendan.'", cat: 3 },
          { text: "'Más de un millón de personas ya lo usan.'", cat: 1 },
          { text: "'Quedan solo 3 unidades, la oferta cierra hoy.'", cat: 2 },
        ],
        exp: "Muestra gratis = reciprocidad. El experto = autoridad. La multitud = prueba social. 'Solo hoy / últimas unidades' = escasez. Reconocerlos te vuelve un consumidor difícil de manipular.",
      },
      {
        type: "mc",
        prompt: "Te piden primero firmar una pequeña petición (fácil), y días después una donación grande 'para ser coherente'. ¿Qué principio explota esto?",
        options: ["Escasez", "Compromiso y coherencia", "Autoridad", "Reciprocidad"],
        answer: 1,
        exp: "Es la técnica del 'pie en la puerta': un sí pequeño crea presión por mantenerse coherente con un sí mayor. Detectarla te permite evaluar la petición grande por sí misma.",
      },
      {
        type: "mc",
        prompt: "Desde la ÉTICA, ¿cuál es el uso correcto de estos principios?",
        options: [
          "Para que la gente compre lo que no necesita",
          "Para comunicar con claridad algo verdaderamente útil y para defenderte de quien te manipula",
          "Para ganar siempre cualquier discusión",
          "Para ocultar información incómoda",
        ],
        answer: 1,
        exp: "La persuasión ética informa y respeta la decisión libre del otro. Si requiere ocultar o engañar, ya cruzó la línea de la manipulación.",
      },
    ],
  },
  {
    id: "voss",
    icon: "MessageSquare",
    title: "Negociación (Voss)",
    tag: "Empatía táctica del FBI",
    accent: "#4f9d9d",
    theory: [
      { h: "Etiquetar emociones (labeling)", p: "Nombrar lo que el otro siente: 'Parece que esto te frustra'. Si aciertas, baja la guardia; si fallas, te corrige y revela su emoción real. Ganas en ambos casos." },
      { h: "Preguntas calibradas", p: "Abiertas, que empiezan con 'cómo' o 'qué' y ponen el problema en sus manos: en vez de '¿bajas el arma?' (sí/no), '¿cómo podemos resolver esto sin que nadie salga herido?'" },
      { h: "'Así es' vs. 'Tienes razón'", p: "'Tienes razón' suele significar 'cállate ya'. 'Así es' es acuerdo real: lo logras reflejando la perspectiva del otro hasta que se sienta entendido. Primero entender, luego proponer." },
    ],
    exercises: [
      {
        type: "mc",
        prompt: "Quieres reducir la tensión con alguien muy enojado. ¿Cuál es una buena ETIQUETA emocional?",
        options: [
          "'Cálmate de una vez.'",
          "'Parece que sientes que nadie te ha escuchado en todo esto.'",
          "'Estás exagerando.'",
          "'No es para tanto.'",
        ],
        answer: 1,
        exp: "Etiquetar valida la emoción sin darle la razón a una acción. Las otras tres niegan el sentimiento y suben la defensa.",
      },
      {
        type: "mc",
        prompt: "Convierte esta pregunta cerrada en CALIBRADA: '¿Vas a aceptar el trato?'",
        options: [
          "'¿Aceptas sí o no?'",
          "'¿Qué necesitarías para que este trato funcione para ti?'",
          "'¿Por qué siempre dices que no?'",
          "'¿No te parece obvio que es bueno?'",
        ],
        answer: 1,
        exp: "Empieza con 'qué', es abierta y traslada el problema al otro, que ahora colabora en la solución en lugar de defenderse de una exigencia.",
      },
      {
        type: "mc",
        prompt: "Antes de pedir un aumento haces una 'auditoría de acusación': listas lo malo que tu jefe podría pensar de ti. ¿Para qué sirve?",
        options: [
          "Para humillarte",
          "Para desactivar esas objeciones nombrándolas tú primero, antes de exponer tu caso",
          "Para no pedir nada al final",
          "Para acusar a tu jefe",
        ],
        answer: 1,
        exp: "Al decir 'seguramente piensas que solo quiero dinero...', le quitas munición a la objeción y bajas las defensas. Después tu argumento se escucha sin resistencia.",
      },
    ],
  },
  {
    id: "carnegie",
    icon: "Handshake",
    title: "Relaciones (Carnegie)",
    tag: "Influir sin manipular",
    accent: "#c9a227",
    theory: [
      { h: "No critiques, condena ni te quejes", p: "La crítica genera defensa, no cambio. Primero empatía ('entiendo por qué lo hiciste'), después la sugerencia. La gente cambia cuando no tiene que defenderse." },
      { h: "Interés genuino y aprecio sincero", p: "Pregunta por el otro y escucha más de lo que hablas. El aprecio funciona cuando es específico y verdadero; el halago vacío se detecta y resiente." },
      { h: "Que la idea sea suya", p: "Defendemos más lo propio que lo impuesto. En vez de 'haz esto', pregunta '¿cómo lo mejorarías?'. Despierta en el otro el deseo, no la obligación." },
    ],
    exercises: [
      {
        type: "mc",
        prompt: "Un compañero entregó un trabajo con errores. Según Carnegie, ¿cuál es la mejor apertura?",
        options: [
          "'Esto está mal hecho.'",
          "'Esta parte está muy bien lograda; si ajustamos este punto, queda redonda.'",
          "'Siempre te equivocas.'",
          "'Cualquiera lo habría hecho mejor.'",
        ],
        answer: 1,
        exp: "Empezar con aprecio honesto y señalar el error de forma indirecta abre la receptividad. El cambio llega sin herir el ego.",
      },
      {
        type: "mc",
        prompt: "Quieres que tu equipo adopte una idea tuya. ¿Qué enfoque es más efectivo?",
        options: [
          "Imponerla porque eres el jefe",
          "Plantear el problema y preguntar cómo lo resolverían, guiando hacia la idea",
          "Repetirla hasta cansarlos",
          "Decir que es idea de la dirección",
        ],
        answer: 1,
        exp: "Si sienten que la solución es suya, la defenderán con energía. Influir bien es hacer que el otro QUIERA, no obligarlo.",
      },
      {
        type: "multi",
        prompt: "¿Cuáles de estas conductas construyen relaciones según Carnegie? Selecciona todas.",
        options: [
          "Recordar el nombre y detalles de la persona",
          "Hablar en términos de los intereses del otro",
          "Ganar todas las discusiones",
          "Admitir tus errores rápido cuando te equivocas",
          "Corregir en público para que aprenda",
        ],
        answers: [0, 1, 3],
        exp: "Recordar nombres, hablar de lo que al otro le importa y admitir errores construyen confianza. Ganar discusiones y humillar en público destruyen la relación aunque 'tengas razón'.",
      },
    ],
  },
  {
    id: "defense",
    icon: "ShieldAlert",
    title: "Defensa: Reconocer Manipulación",
    tag: "Protégete y protege a otros",
    accent: "#c0392b",
    theory: [
      { h: "Por qué este módulo es defensivo", p: "Aquí NO se enseña a manipular, sino a RECONOCER tácticas dañinas para defenderte y ayudar a quien las sufre. El conocimiento es un escudo, no un arma." },
      { h: "Banderas rojas frecuentes", p: "Aislamiento (te alejan de tus apoyos), bombardeo de amor seguido de retirada de afecto, refuerzo intermitente (premio y castigo impredecibles) y negar tu realidad para que dudes de ti mismo." },
      { h: "Qué hacer", p: "Si reconoces varias de estas señales en una relación, busca apoyo en personas de confianza y, si hace falta, en profesionales. No estás obligado a 'ganarle' al manipulador: estás autorizado a salir." },
    ],
    exercises: [
      {
        type: "classify",
        prompt: "Identifica la táctica de manipulación descrita en cada caso (para poder reconocerla).",
        categories: ["Aislamiento", "Negar tu realidad", "Premio/castigo impredecible"],
        items: [
          { text: "'Tus amigos no te entienden, solo yo te quiero de verdad.'", cat: 0 },
          { text: "'Eso nunca pasó, te lo estás inventando, estás mal de la cabeza.'", cat: 1 },
          { text: "Un día es cariñosísimo y al siguiente frío sin razón aparente, una y otra vez.", cat: 2 },
          { text: "'No vayas a esa reunión familiar, te llenan la cabeza.'", cat: 0 },
        ],
        exp: "Aislar = cortarte de tus apoyos. Negar tu realidad busca que dejes de confiar en tu memoria. El refuerzo intermitente crea una dependencia parecida a la de una máquina tragamonedas. Reconocerlas es el primer paso para protegerte.",
      },
      {
        type: "mc",
        prompt: "Reconoces varias de estas banderas rojas en una relación cercana. ¿Cuál es la respuesta más sana?",
        options: [
          "Intentar manipular de vuelta para 'ganar'",
          "Buscar apoyo en personas de confianza o profesionales y poner límites claros",
          "Aislarte aún más para evitar conflictos",
          "Ignorarlo y esperar a que cambie solo",
        ],
        answer: 1,
        exp: "La meta no es vencer al manipulador en su juego, sino recuperar tu red de apoyo y tu criterio. Pedir ayuda es fortaleza, no debilidad.",
      },
      {
        type: "mc",
        prompt: "¿Cuál es el límite ético al estudiar estas técnicas?",
        options: [
          "Usarlas para conseguir lo que quieras de otros",
          "Usarlas solo para defenderte y entender, nunca para dañar o controlar a alguien",
          "Probarlas con tus amigos sin que lo sepan",
          "No hay límites si funciona",
        ],
        answer: 1,
        exp: "Estudiar la oscuridad para no caer en ella ni reproducirla es el único uso legítimo. Quien usa estas tácticas para controlar a otros se convierte en el problema.",
      },
    ],
  },
  {
    id: "neuro",
    icon: "Gauge",
    title: "Neurociencia y Sesgos",
    tag: "Cómo nos engaña la mente",
    accent: "#6c8ea4",
    theory: [
      { h: "Sistema 1 vs. Sistema 2 (Kahneman)", p: "El Sistema 1 es rápido, automático y emocional ('eso da mala espina'). El Sistema 2 es lento, lógico y cuesta esfuerzo ('analicemos por qué'). El experto automatiza el 1; el analista usa el 2 para corregir sus impulsos." },
      { h: "Sesgos que te manipulan", p: "Anclaje (el primer número condiciona todo), confirmación (solo ves lo que ya creías), costo hundido ('ya invertí tanto que sigo'), efecto halo (un rasgo bueno te hace asumir que todo es bueno) y disponibilidad (lo reciente parece más probable)." },
      { h: "Estrés: amígdala vs. córtex", p: "Bajo estrés, la amígdala (emoción, lucha/huida) se impone y el córtex prefrontal (razón, control) se debilita. Por eso el estrés vuelve a la gente impulsiva y delata más de lo que cree." },
    ],
    exercises: [
      {
        type: "classify",
        prompt: "Identifica el sesgo cognitivo en cada situación (reconocerlo es defenderte).",
        categories: ["Anclaje", "Costo hundido", "Confirmación", "Efecto halo"],
        items: [
          { text: "El vendedor dice '$2000' primero, y los $1400 finales te parecen baratos.", cat: 0 },
          { text: "Llevas 3 años en un proyecto fallido y sigues 'porque ya invertiste mucho'.", cat: 1 },
          { text: "Crees que alguien miente y solo registras los gestos que lo confirman.", cat: 2 },
          { text: "Como va bien vestido, asumes que también es honesto y competente.", cat: 3 },
        ],
        exp: "El anclaje fija una referencia inicial; el costo hundido te ata al pasado; la confirmación filtra la evidencia; el halo extiende un rasgo a todo lo demás. Nombrarlos en el momento te permite frenar y usar el Sistema 2.",
      },
      {
        type: "mc",
        prompt: "Confrontas a un sospechoso con una contradicción y de pronto suda, respira rápido y le tiembla la voz. Neurológicamente, ¿qué está pasando?",
        options: [
          "Su córtex prefrontal tomó el control total",
          "Se activó la respuesta de estrés (amígdala): por eso el autocontrol baja y filtra más señales",
          "Es prueba absoluta de que es culpable del crimen",
          "Nada relevante para el análisis",
        ],
        answer: 1,
        exp: "El estrés activa el sistema simpático y la amígdala domina, debilitando el control racional. Eso explica las señales fisiológicas — pero indica estrés, no necesariamente culpabilidad de ESE crimen.",
      },
      {
        type: "mc",
        prompt: "Quieres tomar una decisión importante sin dejarte llevar por la primera impresión. ¿Qué haces?",
        options: [
          "Confiar siempre en el instinto del Sistema 1",
          "Pausar y activar el Sistema 2: buscar evidencia que CONTRADIGA tu corazonada antes de decidir",
          "Pedirle a alguien que decida por ti",
          "Decidir lo más rápido posible para no pensar de más",
        ],
        answer: 1,
        exp: "Buscar deliberadamente lo que refuta tu intuición desactiva el sesgo de confirmación. Es la herramienta central contra el autoengaño.",
      },
    ],
  },
  {
    id: "nlp",
    icon: "Network",
    title: "PNL Aplicada (Ética)",
    tag: "Rapport, anclaje y reencuadre",
    accent: "#8e7cc3",
    theory: [
      { h: "Sistemas representacionales", p: "La gente procesa el mundo distinto: VISUAL ('lo veo claro', 'mira'), AUDITIVO ('me suena', 'escucha'), KINESTÉSICO ('lo siento', 'me pesa'). Hablar en su mismo canal mejora muchísimo la comprensión y el rapport." },
      { h: "Anclaje y reencuadre", p: "Anclaje: asociar un gesto a un estado (apretar el puño al recordar tu mayor confianza, para reactivarla antes de un examen). Reencuadre: cambiar el marco de un hecho para cambiar la emoción — 'fallé' se vuelve 'ya sé qué reforzar'." },
      { h: "Pacing & leading + ética", p: "Primero acompasas (igualas ritmo y postura para crear sintonía) y luego guías (cambias tú y el otro te sigue). Úsalo para autorregularte y comunicar mejor, jamás para engañar: si requiere ocultar la verdad, dejó de ser ético." },
    ],
    exercises: [
      {
        type: "classify",
        prompt: "Clasifica cada frase según el sistema representacional que delata.",
        categories: ["Visual", "Auditivo", "Kinestésico"],
        items: [
          { text: "'Ya veo claro a dónde vas con esto.'", cat: 0 },
          { text: "'Eso me suena raro, no me cuadra el tono.'", cat: 1 },
          { text: "'Tengo la sensación de que algo no encaja, me pesa.'", cat: 2 },
          { text: "'Muéstrame el panorama completo.'", cat: 0 },
        ],
        exp: "Las palabras que la gente elige revelan su canal dominante: 'ver/mostrar' (visual), 'sonar/escuchar/tono' (auditivo), 'sentir/pesar/encajar' (kinestésico). Responder en su mismo canal hace que se sientan entendidos.",
      },
      {
        type: "mc",
        prompt: "Reprobaste un examen y te sientes inútil. ¿Cuál es un REENCUADRE sano (no un autoengaño)?",
        options: [
          "'Soy un fracaso, nunca podré con esto.'",
          "'El examen me mostró exactamente qué temas reforzar para el próximo.'",
          "'El examen no significa nada, da igual.'",
          "'La culpa es del profesor.'",
        ],
        answer: 1,
        exp: "El buen reencuadre cambia el significado sin negar la realidad: convierte el fallo en información accionable. Negarlo o culpar a otros no es reencuadre, es evasión.",
      },
      {
        type: "mc",
        prompt: "Quieres crear rapport con alguien tenso usando pacing & leading de forma ética. ¿Cuál es el orden correcto?",
        options: [
          "Guiar primero: imponer tu ritmo para que se calme",
          "Acompasar primero (igualar su ritmo y energía) y, ya en sintonía, bajar gradualmente el tuyo para que te siga",
          "Contradecir todo lo que diga",
          "Hablar mucho más rápido que la persona",
        ],
        answer: 1,
        exp: "Primero acompasas para generar sintonía; recién entonces lideras con cambios sutiles. Hacerlo al revés rompe el rapport en lugar de construirlo.",
      },
    ],
  },
  {
    id: "case",
    icon: "Compass",
    title: "Caso Integrado",
    tag: "Aplica todo el método",
    accent: "#c9a227",
    theory: [
      { h: "El método, paso a paso", p: "Un análisis serio sigue un orden: observar sin interpretar → generar varias hipótesis → buscar qué confirma y qué descarta cada una → hacer preguntas dirigidas → actualizar probabilidades → concluir con un NIVEL DE CONFIANZA, nunca con certeza absoluta." },
      { h: "Árbol de decisión deductivo", p: "Para cada hipótesis pregúntate: ¿qué la confirmaría? ¿qué la refutaría? ¿cuál es hoy la más probable? Vas eliminando la más débil, como en un diagnóstico diferencial. Lo que queda, aunque sea improbable, merece atención." },
      { h: "El gran riesgo: enamorarte de tu teoría", p: "El error más común es el sesgo de confirmación: elegir un culpable y luego solo ver lo que lo incrimina. El profesional ataca su propia hipótesis con la misma fuerza con que la defiende." },
    ],
    exercises: [
      {
        type: "order",
        prompt: "Ordena las fases del método de análisis deductivo, de la primera a la última.",
        items: [
          "Observar los hechos sin interpretarlos todavía",
          "Generar varias hipótesis posibles",
          "Buscar qué evidencia confirma o descarta cada una",
          "Hacer preguntas dirigidas para conseguir datos que falten",
          "Actualizar las probabilidades y descartar las hipótesis débiles",
          "Concluir indicando un nivel de confianza, no certeza",
        ],
        exp: "El orden importa: si interpretas antes de observar, contaminas todo el análisis con tu primera corazonada. La conclusión siempre se entrega con un margen de confianza.",
      },
      {
        type: "mc",
        prompt: "Caso ficticio: entran a una casa sin forzar nada, la persona fue vigilada por semanas, no se dejó ninguna evidencia y el lugar quedó ordenado. ¿Qué perfil sugiere y por qué?",
        options: [
          "Desorganizado: actuó por impulso",
          "Organizado: hubo planificación, control y cuidado por no dejar rastro",
          "Imposible decir absolutamente nada",
          "Organizado, y por tanto sabemos con certeza quién es",
        ],
        answer: 1,
        exp: "Vigilancia previa, entrada limpia y escena ordenada son marcadores claros de un ofensor organizado. Pero 'organizado' es un rango de probabilidades sobre su perfil, no la identidad exacta de nadie.",
      },
      {
        type: "order",
        prompt: "Negociación de crisis (escalera de cambio de conducta de Voss): ordena los pasos desde el primer contacto hasta la acción final.",
        items: [
          "Lograr que la persona te escuche por primera vez",
          "Construir entendimiento etiquetando lo que siente",
          "Conseguir que acepte seguir hablando y negociar",
          "Obtener un pequeño compromiso concreto",
          "Llegar a la acción final acordada",
        ],
        exp: "No se salta de la nada a la acción: se sube peldaño a peldaño. Cada paso debe ser tan razonable que sea difícil decir que no. La empatía táctica abre la puerta que la exigencia cierra.",
      },
    ],
  },
];

/* ------------------------------------------------------------ */
const totalExercises = MODULES.reduce((s, m) => s + m.exercises.length, 0);

function rankFor(xp) {
  let r = RANKS[0];
  for (const x of RANKS) if (xp >= x.min) r = x;
  return r;
}
function nextRank(xp) {
  for (const x of RANKS) if (xp < x.min) return x;
  return null;
}
function uid(mId, i) { return `${mId}:${i}`; }

/* ============================ APP ============================ */
export default function App() {
  const [view, setView] = useState("home"); // home | module
  const [activeId, setActiveId] = useState(null);
  const [done, setDone] = useState({}); // {uid: true}
  const [xp, setXp] = useState(0);

  const completedCount = Object.keys(done).length;
  const rank = rankFor(xp);
  const nxt = nextRank(xp);
  const active = MODULES.find((m) => m.id === activeId);

  function award(id, points) {
    if (done[id]) return;
    setDone((d) => ({ ...d, [id]: true }));
    setXp((v) => v + points);
  }
  function moduleProgress(m) {
    const c = m.exercises.filter((_, i) => done[uid(m.id, i)]).length;
    return { c, t: m.exercises.length };
  }
  function resetAll() {
    setDone({}); setXp(0); setView("home"); setActiveId(null);
  }

  return (
      <div style={styles.root}>
        <StyleInjector />
        <div className="grain" />
        <div style={styles.frame}>
          <Header xp={xp} rank={rank} nxt={nxt} completedCount={completedCount} onReset={resetAll} onHome={() => { setView("home"); setActiveId(null); }} />
          {view === "home" && (
              <Home
                  done={done}
                  moduleProgress={moduleProgress}
                  onOpen={(id) => { setActiveId(id); setView("module"); }}
              />
          )}
          {view === "module" && active && (
              <ModuleView
                  key={active.id}
                  module={active}
                  done={done}
                  onBack={() => { setView("home"); setActiveId(null); }}
                  onSolve={(i) => award(uid(active.id, i), 60)}
              />
          )}
          <footer style={styles.footer}>
            ACADEMIA DEDUCTIVA · expediente confidencial · {completedCount}/{totalExercises} pruebas resueltas
          </footer>
        </div>
      </div>
  );
}

/* ---------------------------- HEADER ---------------------------- */
function Header({ xp, rank, nxt, completedCount, onReset, onHome }) {
  const span = nxt ? nxt.min - (rank.min) : 1;
  const into = nxt ? xp - rank.min : 1;
  const pct = nxt ? Math.min(100, Math.round((into / span) * 100)) : 100;
  return (
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={onHome}>
          <div style={styles.seal}><Fingerprint size={26} color="#1a1714" /></div>
          <div>
            <div className="display" style={styles.brand}>ACADEMIA DEDUCTIVA</div>
            <div className="mono" style={styles.brandSub}>OBSERVA · DEDUCE · COMPRENDE</div>
          </div>
        </div>
        <div style={styles.rankBox}>
          <div style={{ textAlign: "right" }}>
            <div className="mono" style={{ fontSize: 11, color: "#8a8178", letterSpacing: 1 }}>RANGO</div>
            <div className="display" style={{ fontSize: 18, color: "#e8dcc4" }}>{rank.icon} {rank.name}</div>
          </div>
          <div style={{ minWidth: 150 }}>
            <div style={styles.xpBarTrack}>
              <div style={{ ...styles.xpBarFill, width: `${pct}%` }} />
            </div>
            <div className="mono" style={{ fontSize: 10.5, color: "#8a8178", marginTop: 4, display: "flex", justifyContent: "space-between" }}>
              <span>{xp} XP</span>
              <span>{nxt ? `→ ${nxt.name}` : "MÁXIMO"}</span>
            </div>
          </div>
          <button onClick={onReset} title="Reiniciar progreso" style={styles.resetBtn}><RotateCcw size={15} /></button>
        </div>
      </header>
  );
}

/* ----------------------------- HOME ----------------------------- */
function Home({ moduleProgress, onOpen }) {
  return (
      <main style={{ padding: "4px 0 8px" }}>
        <section style={styles.hero}>
          <div className="mono" style={styles.fileTab}>EXPEDIENTE · FORMACIÓN DEL INVESTIGADOR</div>
          <h1 className="display" style={styles.heroTitle}>Aprende a leer<br /><span style={{ color: "#c9a227" }}>lo que nadie más ve.</span></h1>
          <p style={styles.heroP}>
            Un programa práctico de observación, lógica, lenguaje corporal, perfilación y persuasión ética —
            inspirado en los métodos reales de Ekman, Navarro, Cialdini, Carnegie y los negociadores del FBI.
            <strong style={{ color: "#e8dcc4" }}> 30% teoría, 70% práctica.</strong>
          </p>
          <div style={styles.oathBox}>
            <Quote size={16} color="#c9a227" style={{ flexShrink: 0, marginTop: 2 }} />
            <span><strong>Código de honor.</strong> Estas habilidades sirven para entender, conectar y protegerte —
          nunca para manipular o dañar a nadie. El verdadero dominio empieza por la ética.</span>
          </div>
        </section>

        <div style={styles.gridLabel} className="mono">▸ MÓDULOS DEL CASO</div>
        <div style={styles.grid}>
          {MODULES.map((m, idx) => {
            const Icon = ICONS[m.icon];
            const { c, t } = moduleProgress(m);
            const complete = c === t;
            return (
                <button key={m.id} onClick={() => onOpen(m.id)} className="card" style={styles.card}>
                  <div style={{ ...styles.cardStripe, background: m.accent }} />
                  <div style={styles.cardTop}>
                    <div style={{ ...styles.cardIcon, borderColor: m.accent, color: m.accent }}>
                      <Icon size={22} />
                    </div>
                    <span className="mono" style={styles.caseNo}>CASO {String(idx + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="display" style={styles.cardTitle}>{m.title}</div>
                  <div style={styles.cardTag}>{m.tag}</div>
                  <div style={styles.cardFoot}>
                    <div style={styles.dots}>
                      {m.exercises.map((_, i) => (
                          <span key={i} style={{ ...styles.dot, background: i < c ? m.accent : "rgba(255,255,255,.14)" }} />
                      ))}
                    </div>
                    <span className="mono" style={{ fontSize: 11, color: complete ? "#5b8c5a" : "#8a8178" }}>
                  {complete ? "✓ RESUELTO" : `${c}/${t}`}
                </span>
                  </div>
                </button>
            );
          })}
        </div>
      </main>
  );
}

/* -------------------------- MODULE VIEW -------------------------- */
function ModuleView({ module: m, done, onBack, onSolve }) {
  const Icon = ICONS[m.icon];
  const [tab, setTab] = useState("theory"); // theory | practice
  const solvedInModule = m.exercises.filter((_, i) => done[uid(m.id, i)]).length;

  return (
      <main style={{ paddingBottom: 10 }}>
        <button onClick={onBack} style={styles.backBtn} className="mono"><ChevronLeft size={16} /> VOLVER AL EXPEDIENTE</button>

        <div style={{ ...styles.moduleHead, borderColor: m.accent }}>
          <div style={{ ...styles.cardIcon, borderColor: m.accent, color: m.accent, width: 48, height: 48 }}><Icon size={26} /></div>
          <div style={{ flex: 1 }}>
            <h2 className="display" style={{ margin: 0, fontSize: 30, color: "#f0e6d2" }}>{m.title}</h2>
            <div className="mono" style={{ fontSize: 12, color: "#9a9082", letterSpacing: 1 }}>{m.tag.toUpperCase()}</div>
          </div>
        </div>

        <div style={styles.tabs}>
          <Tab active={tab === "theory"} onClick={() => setTab("theory")} icon={<BookOpen size={15} />} label="TEORÍA · 30%" accent={m.accent} />
          <Tab active={tab === "practice"} onClick={() => setTab("practice")} icon={<FlaskConical size={15} />} label={`PRÁCTICA · ${solvedInModule}/${m.exercises.length}`} accent={m.accent} />
        </div>

        {tab === "theory" && (
            <section style={{ display: "grid", gap: 14, marginTop: 16 }}>
              {m.theory.map((t, i) => (
                  <div key={i} style={styles.theoryCard}>
                    <div className="mono" style={{ ...styles.theoryNum, color: m.accent, borderColor: m.accent }}>{String(i + 1).padStart(2, "0")}</div>
                    <div>
                      <h3 className="display" style={styles.theoryH}>{t.h}</h3>
                      <p style={styles.theoryP}>{t.p}</p>
                    </div>
                  </div>
              ))}
              <button onClick={() => setTab("practice")} style={{ ...styles.bigBtn, background: m.accent }}>
                <FlaskConical size={17} /> Ir a la práctica
              </button>
            </section>
        )}

        {tab === "practice" && (
            <section style={{ display: "grid", gap: 18, marginTop: 16 }}>
              {m.exercises.map((ex, i) => (
                  <Exercise
                      key={i}
                      index={i}
                      data={ex}
                      accent={m.accent}
                      already={!!done[uid(m.id, i)]}
                      onSolve={() => onSolve(i)}
                  />
              ))}
            </section>
        )}
      </main>
  );
}

function Tab({ active, onClick, icon, label, accent }) {
  return (
      <button onClick={onClick} className="mono" style={{
        ...styles.tab,
        color: active ? "#1a1714" : "#c9bfae",
        background: active ? accent : "transparent",
        borderColor: active ? accent : "rgba(255,255,255,.14)",
      }}>
        {icon} {label}
      </button>
  );
}

/* --------------------------- EXERCISES --------------------------- */
function Exercise({ index, data, accent, already, onSolve }) {
  if (data.type === "observe") return <ObserveExercise index={index} data={data} accent={accent} already={already} onSolve={onSolve} />;
  if (data.type === "classify") return <ClassifyExercise index={index} data={data} accent={accent} already={already} onSolve={onSolve} />;
  if (data.type === "order") return <OrderExercise index={index} data={data} accent={accent} already={already} onSolve={onSolve} />;
  return <ChoiceExercise index={index} data={data} accent={accent} already={already} onSolve={onSolve} />;
}

function ExerciseShell({ index, accent, badge, children }) {
  return (
      <div style={styles.exCard}>
        <div style={{ ...styles.exStripe, background: accent }} />
        <div style={styles.exHead}>
          <span className="mono" style={{ ...styles.exNo, color: accent, borderColor: accent }}>PRUEBA {String(index + 1).padStart(2, "0")}</span>
          <span className="mono" style={styles.exBadge}>{badge}</span>
        </div>
        {children}
      </div>
  );
}

/* single + multi choice */
function ChoiceExercise({ index, data, accent, already, onSolve }) {
  const multi = data.type === "multi";
  const [sel, setSel] = useState([]);
  const [checked, setChecked] = useState(already);
  const answers = multi ? data.answers : [data.answer];

  const correct = useMemo(() => {
    if (!checked) return false;
    if (sel.length !== answers.length) return false;
    return answers.every((a) => sel.includes(a));
  }, [checked, sel, answers]);

  function toggle(i) {
    if (checked) return;
    if (multi) setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
    else setSel([i]);
  }
  function check() {
    if (sel.length === 0) return;
    setChecked(true);
    const ok = sel.length === answers.length && answers.every((a) => sel.includes(a));
    if (ok) onSolve();
  }
  function retry() { setChecked(false); setSel([]); }

  return (
      <ExerciseShell index={index} accent={accent} badge={multi ? "SELECCIÓN MÚLTIPLE" : "OPCIÓN ÚNICA"}>
        <p style={styles.exPrompt}>{data.prompt}</p>
        {multi && <div className="mono" style={styles.hintLine}>Selecciona TODAS las que apliquen.</div>}
        <div style={{ display: "grid", gap: 9, marginTop: 4 }}>
          {data.options.map((opt, i) => {
            const isSel = sel.includes(i);
            const isAns = answers.includes(i);
            let bg = "rgba(255,255,255,.03)", bd = "rgba(255,255,255,.12)", icon = null;
            if (checked) {
              if (isAns) { bg = "rgba(91,140,90,.16)"; bd = "#5b8c5a"; icon = <CheckCircle2 size={17} color="#7bbf79" />; }
              else if (isSel) { bg = "rgba(192,57,43,.16)"; bd = "#c0392b"; icon = <XCircle size={17} color="#e07a6e" />; }
            } else if (isSel) { bg = `${hexA(accent, .14)}`; bd = accent; }
            return (
                <button key={i} onClick={() => toggle(i)} disabled={checked} style={{ ...styles.opt, background: bg, borderColor: bd }}>
                  <span style={{ ...styles.optMark, borderColor: isSel || (checked && isAns) ? bd : "rgba(255,255,255,.25)", background: isSel ? bd : "transparent", borderRadius: multi ? 5 : 20 }} />
                  <span style={{ flex: 1 }}>{opt}</span>
                  {icon}
                </button>
            );
          })}
        </div>
        <ActionRow checked={checked} correct={correct} canCheck={sel.length > 0} accent={accent} onCheck={check} onRetry={retry} exp={data.exp} />
      </ExerciseShell>
  );
}

/* classify: assign each item to a category */
function ClassifyExercise({ index, data, accent, already, onSolve }) {
  const [assign, setAssign] = useState({}); // itemIndex -> catIndex
  const [checked, setChecked] = useState(already);
  const allAssigned = data.items.every((_, i) => assign[i] !== undefined);
  const correct = checked && data.items.every((it, i) => assign[i] === it.cat);

  function pick(itemI, catI) { if (!checked) setAssign((a) => ({ ...a, [itemI]: catI })); }
  function check() {
    if (!allAssigned) return;
    setChecked(true);
    if (data.items.every((it, i) => assign[i] === it.cat)) onSolve();
  }
  function retry() { setChecked(false); setAssign({}); }

  return (
      <ExerciseShell index={index} accent={accent} badge="CLASIFICACIÓN">
        <p style={styles.exPrompt}>{data.prompt}</p>
        <div className="mono" style={styles.hintLine}>Toca una categoría para cada ficha.</div>
        <div style={{ display: "grid", gap: 11, marginTop: 4 }}>
          {data.items.map((it, i) => {
            const chosen = assign[i];
            const isOk = checked && chosen === it.cat;
            const isBad = checked && chosen !== undefined && chosen !== it.cat;
            return (
                <div key={i} style={{
                  ...styles.clItem,
                  borderColor: isOk ? "#5b8c5a" : isBad ? "#c0392b" : "rgba(255,255,255,.12)",
                  background: isOk ? "rgba(91,140,90,.1)" : isBad ? "rgba(192,57,43,.1)" : "rgba(255,255,255,.03)",
                }}>
                  <div style={styles.clText}>
                    {it.text}
                    {checked && isBad && <div className="mono" style={styles.clFix}>→ correcto: {data.categories[it.cat]}</div>}
                  </div>
                  <div style={styles.clCats}>
                    {data.categories.map((cat, ci) => {
                      const on = chosen === ci;
                      return (
                          <button key={ci} onClick={() => pick(i, ci)} disabled={checked} className="mono" style={{
                            ...styles.clCatBtn,
                            background: on ? accent : "transparent",
                            color: on ? "#1a1714" : "#c9bfae",
                            borderColor: on ? accent : "rgba(255,255,255,.18)",
                          }}>{cat}</button>
                      );
                    })}
                  </div>
                </div>
            );
          })}
        </div>
        <ActionRow checked={checked} correct={correct} canCheck={allAssigned} accent={accent} onCheck={check} onRetry={retry} exp={data.exp} />
      </ExerciseShell>
  );
}

/* observe: flash a scene, then quiz */
function ObserveExercise({ index, data, accent, already, onSolve }) {
  const [phase, setPhase] = useState(already ? "quiz" : "idle"); // idle | show | quiz
  const [count, setCount] = useState(6);
  const [sel, setSel] = useState({}); // qIndex -> optIndex
  const [checked, setChecked] = useState(already);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  function start() {
    setPhase("show"); setCount(6);
    timer.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) { clearInterval(timer.current); setPhase("quiz"); return 0; }
        return c - 1;
      });
    }, 1000);
  }
  const allAnswered = data.questions.every((_, i) => sel[i] !== undefined);
  const correct = checked && data.questions.every((q, i) => sel[i] === q.answer);

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    if (data.questions.every((q, i) => sel[i] === q.answer)) onSolve();
  }
  function retry() { setChecked(false); setSel({}); setPhase("idle"); }

  return (
      <ExerciseShell index={index} accent={accent} badge="OBSERVACIÓN">
        <p style={styles.exPrompt}>{data.prompt}</p>

        {phase === "idle" && (
            <button onClick={start} style={{ ...styles.bigBtn, background: accent, marginTop: 4 }}>
              <Eye size={17} /> Mostrar la escena
            </button>
        )}

        {phase === "show" && (
            <div>
              <div className="mono" style={{ textAlign: "center", color: accent, fontSize: 13, marginBottom: 8 }}>MEMORIZA · {count}s</div>
              <div style={styles.scene}>
                {data.scene.map((o, i) => (
                    <div key={i} style={styles.sceneItem}>
                      <span style={{ fontSize: 30 }}>{o.e}</span>
                    </div>
                ))}
              </div>
            </div>
        )}

        {phase === "quiz" && (
            <div style={{ display: "grid", gap: 16, marginTop: 4 }}>
              {data.questions.map((q, qi) => (
                  <div key={qi}>
                    <div style={styles.obsQ}>{q.q}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                      {q.options.map((opt, oi) => {
                        const isSel = sel[qi] === oi;
                        const isAns = q.answer === oi;
                        let bg = "rgba(255,255,255,.03)", bd = "rgba(255,255,255,.12)";
                        if (checked) {
                          if (isAns) { bg = "rgba(91,140,90,.16)"; bd = "#5b8c5a"; }
                          else if (isSel) { bg = "rgba(192,57,43,.16)"; bd = "#c0392b"; }
                        } else if (isSel) { bg = hexA(accent, .14); bd = accent; }
                        return (
                            <button key={oi} onClick={() => !checked && setSel((s) => ({ ...s, [qi]: oi }))} disabled={checked}
                                    style={{ ...styles.opt, background: bg, borderColor: bd, justifyContent: "center", textAlign: "center" }}>
                              {opt}
                            </button>
                        );
                      })}
                    </div>
                    {checked && <div style={styles.obsExp}><Lightbulb size={14} color={accent} /> {q.exp}</div>}
                  </div>
              ))}
              {!checked && (
                  <button onClick={check} disabled={!allAnswered} style={{ ...styles.checkBtn, opacity: allAnswered ? 1 : .4, borderColor: accent, color: accent }}>
                    Comprobar respuestas
                  </button>
              )}
              {checked && (
                  <div style={{ ...styles.verdict, borderColor: correct ? "#5b8c5a" : "#c0392b" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {correct ? <CheckCircle2 size={18} color="#7bbf79" /> : <XCircle size={18} color="#e07a6e" />}
                      <strong style={{ color: correct ? "#7bbf79" : "#e07a6e" }}>{correct ? "Observación impecable (+60 XP)" : "Algo se te escapó"}</strong>
                    </div>
                    <button onClick={retry} className="mono" style={styles.retryBtn}><RotateCcw size={13} /> REINTENTAR</button>
                  </div>
              )}
            </div>
        )}
      </ExerciseShell>
  );
}

/* order: drag (o flechas) para ordenar en la secuencia correcta */
function OrderExercise({ index, data, accent, already, onSolve }) {
  const makeShuffled = () => {
    const a = data.items.map((text, idx) => ({ idx, text }));
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (a.every((x, i) => x.idx === i)) { a.push(a.shift()); } // evita salir ya ordenado
    return a;
  };
  const [arr, setArr] = useState(already ? data.items.map((text, idx) => ({ idx, text })) : makeShuffled);
  const [checked, setChecked] = useState(already);
  const [dragI, setDragI] = useState(null);

  const correct = checked && arr.every((x, i) => x.idx === i);

  function move(from, to) {
    if (checked || to < 0 || to >= arr.length) return;
    setArr((prev) => {
      const next = [...prev];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });
  }
  function check() {
    setChecked(true);
    if (arr.every((x, i) => x.idx === i)) onSolve();
  }
  function retry() { setChecked(false); setArr(makeShuffled()); }

  return (
      <ExerciseShell index={index} accent={accent} badge="ORDENAR · ARRASTRA">
        <p style={styles.exPrompt}>{data.prompt}</p>
        <div className="mono" style={styles.hintLine}>Arrastra las fichas o usa las flechas para ordenarlas.</div>
        <div style={{ display: "grid", gap: 9, marginTop: 4 }}>
          {arr.map((it, i) => {
            const ok = checked && it.idx === i;
            const bad = checked && it.idx !== i;
            return (
                <div
                    key={it.idx}
                    draggable={!checked}
                    onDragStart={() => setDragI(i)}
                    onDragOver={(e) => { e.preventDefault(); }}
                    onDrop={() => { if (dragI !== null) move(dragI, i); setDragI(null); }}
                    onDragEnd={() => setDragI(null)}
                    style={{
                      ...styles.orderItem,
                      borderColor: ok ? "#5b8c5a" : bad ? "#c0392b" : (dragI === i ? accent : "rgba(255,255,255,.12)"),
                      background: ok ? "rgba(91,140,90,.1)" : bad ? "rgba(192,57,43,.1)" : "rgba(255,255,255,.03)",
                      opacity: dragI === i ? .5 : 1,
                      cursor: checked ? "default" : "grab",
                    }}
                >
                  <span className="mono" style={{ ...styles.orderNum, background: accent }}>{i + 1}</span>
                  {!checked && <GripVertical size={16} color="#7d7361" style={{ flexShrink: 0 }} />}
                  <span style={{ flex: 1, fontSize: 14.5, lineHeight: 1.4, color: "#e4d9c1" }}>{it.text}</span>
                  {!checked ? (
                      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <button onClick={() => move(i, i - 1)} disabled={i === 0} style={styles.orderArrow}><ChevronUp size={15} /></button>
                  <button onClick={() => move(i, i + 1)} disabled={i === arr.length - 1} style={styles.orderArrow}><ChevronDown size={15} /></button>
                </span>
                  ) : (
                      ok ? <CheckCircle2 size={17} color="#7bbf79" /> : <XCircle size={17} color="#e07a6e" />
                  )}
                </div>
            );
          })}
        </div>
        <ActionRow checked={checked} correct={correct} canCheck={true} accent={accent} onCheck={check} onRetry={retry} exp={data.exp} />
      </ExerciseShell>
  );
}

/* shared action row for choice/classify */
function ActionRow({ checked, correct, canCheck, accent, onCheck, onRetry, exp }) {
  return (
      <div>
        {!checked && (
            <button onClick={onCheck} disabled={!canCheck} style={{ ...styles.checkBtn, opacity: canCheck ? 1 : .4, borderColor: accent, color: accent }}>
              Comprobar
            </button>
        )}
        {checked && (
            <div style={{ ...styles.verdict, borderColor: correct ? "#5b8c5a" : "#c0392b", flexDirection: "column", alignItems: "stretch" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {correct ? <CheckCircle2 size={18} color="#7bbf79" /> : <XCircle size={18} color="#e07a6e" />}
                  <strong style={{ color: correct ? "#7bbf79" : "#e07a6e" }}>{correct ? "Correcto (+60 XP)" : "Revisa de nuevo"}</strong>
                </div>
                {!correct && <button onClick={onRetry} className="mono" style={styles.retryBtn}><RotateCcw size={13} /> REINTENTAR</button>}
              </div>
              <div style={styles.expBox}><Lightbulb size={15} color={accent} style={{ flexShrink: 0, marginTop: 1 }} /><span>{exp}</span></div>
            </div>
        )}
      </div>
  );
}

/* ---------------------- helpers + styles ---------------------- */
function hexA(hex, a) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function StyleInjector() {
  return (
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=Special+Elite&family=Spectral:wght@400;500&display=swap');
      .display{font-family:'Playfair Display',Georgia,serif;}
      .mono{font-family:'Special Elite','Courier New',monospace;}
      *{box-sizing:border-box;}
      .card{transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;}
      .card:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(0,0,0,.5);}
      button{cursor:pointer;font-family:inherit;}
      button:disabled{cursor:default;}
      .grain{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:.5;mix-blend-mode:overlay;
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");}
      @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
    `}</style>
  );
}

const paper = "#15120f";
const styles = {
  root: {
    minHeight: "100vh",
    background: "radial-gradient(1200px 700px at 70% -10%, #2a2218 0%, #14110d 45%, #0c0a08 100%)",
    color: "#d9cdb8",
    fontFamily: "'Spectral', Georgia, serif",
    position: "relative",
    padding: "26px 16px 40px",
  },
  frame: { maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 2 },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap",
    paddingBottom: 18, borderBottom: "1px solid rgba(201,162,39,.25)", marginBottom: 22,
  },
  seal: {
    width: 46, height: 46, borderRadius: "50%",
    display: "grid", placeItems: "center", boxShadow: "0 0 0 3px rgba(201,162,39,.2)",
    backgroundImage: "linear-gradient(135deg,#e8cf86,#b5872c)",
  },
  brand: { fontSize: 22, fontWeight: 900, color: "#f0e6d2", letterSpacing: .5, lineHeight: 1 },
  brandSub: { fontSize: 10.5, color: "#9a8d6f", letterSpacing: 2, marginTop: 3 },
  rankBox: { display: "flex", alignItems: "center", gap: 14 },
  xpBarTrack: { height: 7, background: "rgba(255,255,255,.08)", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)" },
  xpBarFill: { height: "100%", background: "linear-gradient(90deg,#b5872c,#e8cf86)", transition: "width .5s ease" },
  resetBtn: { width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(255,255,255,.15)", background: "transparent", color: "#9a8d6f", display: "grid", placeItems: "center" },

  hero: { marginBottom: 26, animation: "fadeUp .5s ease" },
  fileTab: { display: "inline-block", fontSize: 11, letterSpacing: 2, color: "#1a1714", background: "#c9a227", padding: "5px 12px", borderRadius: "3px 3px 0 0", marginBottom: 14 },
  heroTitle: { fontSize: 46, lineHeight: 1.04, margin: "0 0 14px", color: "#f4ead6", fontWeight: 900 },
  heroP: { fontSize: 16.5, lineHeight: 1.6, color: "#c2b69c", maxWidth: 720, margin: 0 },
  oathBox: {
    marginTop: 18, display: "flex", gap: 10, alignItems: "flex-start",
    background: "rgba(201,162,39,.07)", border: "1px solid rgba(201,162,39,.3)",
    borderLeft: "3px solid #c9a227", padding: "13px 16px", borderRadius: 6, fontSize: 14.5, color: "#cabd9f", maxWidth: 720,
  },

  gridLabel: { fontSize: 12, letterSpacing: 2, color: "#9a8d6f", margin: "8px 0 14px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 },
  card: {
    position: "relative", textAlign: "left", overflow: "hidden",
    background: "linear-gradient(180deg,#1c1813,#171410)", border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 12, padding: "18px 18px 16px", color: "#d9cdb8",
  },
  cardStripe: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  cardTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  cardIcon: { width: 42, height: 42, borderRadius: 10, border: "1.5px solid", display: "grid", placeItems: "center", background: "rgba(0,0,0,.25)" },
  caseNo: { fontSize: 11, letterSpacing: 1.5, color: "#7d7361" },
  cardTitle: { fontSize: 21, color: "#f0e6d2", lineHeight: 1.1, marginBottom: 5, fontWeight: 700 },
  cardTag: { fontSize: 13.5, color: "#a99d83", minHeight: 36 },
  cardFoot: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  dots: { display: "flex", gap: 5 },
  dot: { width: 9, height: 9, borderRadius: "50%" },

  backBtn: { background: "transparent", border: "none", color: "#9a8d6f", fontSize: 12, letterSpacing: 1.5, display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 0", marginBottom: 6 },
  moduleHead: { display: "flex", alignItems: "center", gap: 16, padding: "16px 0 18px", borderBottom: "1px solid rgba(255,255,255,.1)" },
  tabs: { display: "flex", gap: 10, marginTop: 16 },
  tab: { flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 12px", border: "1px solid", borderRadius: 9, fontSize: 12.5, letterSpacing: 1 },

  theoryCard: { display: "flex", gap: 14, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 11, padding: "16px 18px", animation: "fadeUp .4s ease" },
  theoryNum: { fontSize: 16, width: 38, height: 38, flexShrink: 0, border: "1.5px solid", borderRadius: 9, display: "grid", placeItems: "center" },
  theoryH: { margin: "0 0 6px", fontSize: 18, color: "#f0e6d2" },
  theoryP: { margin: 0, fontSize: 15, lineHeight: 1.6, color: "#bdb196" },
  bigBtn: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, padding: "13px 18px", border: "none", borderRadius: 10, color: "#1a1714", fontSize: 15, fontWeight: 700, fontFamily: "'Spectral',serif", marginTop: 4, width: "100%" },

  exCard: { position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#1b1712,#161310)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 13, padding: "18px 20px 20px", animation: "fadeUp .4s ease" },
  exStripe: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  exHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  exNo: { fontSize: 11, letterSpacing: 1.5, border: "1px solid", padding: "3px 9px", borderRadius: 5 },
  exBadge: { fontSize: 10.5, letterSpacing: 1.5, color: "#7d7361" },
  exPrompt: { fontSize: 16, lineHeight: 1.55, color: "#e4d9c1", margin: "0 0 10px" },
  hintLine: { fontSize: 11, color: "#8a8178", letterSpacing: 1, marginBottom: 8 },
  opt: { display: "flex", alignItems: "center", gap: 11, textAlign: "left", padding: "12px 14px", border: "1px solid", borderRadius: 9, color: "#d9cdb8", fontSize: 14.5, lineHeight: 1.4, background: "transparent" },
  optMark: { width: 17, height: 17, flexShrink: 0, border: "2px solid" },

  clItem: { border: "1px solid", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 },
  clText: { fontSize: 14.5, color: "#e4d9c1", lineHeight: 1.45 },
  clFix: { fontSize: 11, color: "#7bbf79", marginTop: 5, letterSpacing: .5 },
  clCats: { display: "flex", gap: 8, flexWrap: "wrap" },
  clCatBtn: { padding: "7px 13px", border: "1px solid", borderRadius: 7, fontSize: 12, letterSpacing: .5 },

  checkBtn: { marginTop: 14, width: "100%", padding: "12px", background: "transparent", border: "1.5px solid", borderRadius: 10, fontSize: 14.5, fontWeight: 700, letterSpacing: .5, fontFamily: "'Spectral',serif" },
  verdict: { marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 14px", border: "1px solid", borderRadius: 10, background: "rgba(0,0,0,.2)" },
  retryBtn: { background: "transparent", border: "1px solid rgba(255,255,255,.2)", color: "#cabd9f", fontSize: 11, letterSpacing: 1, padding: "6px 10px", borderRadius: 7, display: "inline-flex", alignItems: "center", gap: 5 },
  expBox: { display: "flex", gap: 9, marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.1)", fontSize: 14, lineHeight: 1.55, color: "#c2b69c" },

  scene: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, padding: 12, background: "rgba(0,0,0,.3)", border: "1px dashed rgba(201,162,39,.4)", borderRadius: 10 },
  sceneItem: { aspectRatio: "1", display: "grid", placeItems: "center", background: "rgba(255,255,255,.04)", borderRadius: 8 },
  obsQ: { fontSize: 15, color: "#e4d9c1", marginBottom: 8, fontWeight: 500 },
  obsExp: { display: "flex", gap: 8, marginTop: 8, fontSize: 13.5, lineHeight: 1.5, color: "#c2b69c" },

  orderItem: { display: "flex", alignItems: "center", gap: 11, border: "1px solid", borderRadius: 9, padding: "10px 12px" },
  orderNum: { width: 24, height: 24, flexShrink: 0, borderRadius: 6, color: "#1a1714", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700 },
  orderArrow: { width: 24, height: 18, display: "grid", placeItems: "center", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 5, color: "#cabd9f", padding: 0 },

  footer: { textAlign: "center", marginTop: 34, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.08)", fontSize: 11, letterSpacing: 1.5, color: "#6e6657", fontFamily: "'Special Elite',monospace" },
};