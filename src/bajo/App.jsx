import React, { useState, useEffect } from "react";
import Course from "../_course/Course.jsx";
import { Guitar, Music, Hand, Activity, Clock, Waves, Flame, Target, Zap } from "lucide-react";

/* ====================== animaciones custom ====================== */

/* 1) bajo etiquetado (partes) */
function AnimBass() {
    return (
        <div className="cw-anim">
            <svg viewBox="0 0 360 150" className="cw-svg">
                {/* cuerpo */}
                <path d="M250,55 q40,-20 70,5 q20,25 0,45 q-30,30 -70,5 z" fill="var(--accSoft)" stroke="var(--acc)" strokeWidth="2" />
                {/* mástil */}
                <rect x="60" y="62" width="200" height="22" rx="3" fill="var(--code)" stroke="var(--border2)" strokeWidth="1.5" />
                {/* clavijero */}
                <rect x="28" y="52" width="34" height="42" rx="5" fill="var(--code)" stroke="var(--acc)" strokeWidth="1.5" />
                {[60, 72, 84].map((y, i) => <circle key={i} cx="40" cy={y} r="3" fill="var(--acc2)" />)}
                {/* trastes */}
                {[90, 120, 150, 180, 210, 240].map((x, i) => <line key={i} x1={x} y1="62" x2={x} y2="84" stroke="var(--border2)" strokeWidth="1.5" />)}
                {/* cuerdas */}
                {[66, 72, 78, 83].map((y, i) => <line key={i} x1="40" y1={y} x2="300" y2={y - 5} stroke="var(--acc)" strokeWidth={1 + i * 0.4} opacity=".8" />)}
                {/* pastillas */}
                <rect x="268" y="58" width="10" height="34" rx="2" fill="var(--acc)" />
                {/* etiquetas */}
                <text x="30" y="112" fill="var(--muted)" fontSize="9">clavijero</text>
                <text x="120" y="112" fill="var(--muted)" fontSize="9">trastes</text>
                <text x="255" y="112" fill="var(--muted)" fontSize="9">pastilla</text>
                <text x="295" y="135" fill="var(--muted)" fontSize="9">cuerpo</text>
            </svg>
            <p className="cw-anim-cap">Las partes de tu bajo: clavijero (afinas aquí), mástil con trastes (pisas las notas), las 4 cuerdas y las pastillas que convierten la vibración en sonido.</p>
        </div>
    );
}

/* 2) las 4 cuerdas E-A-D-G, vibran una por una */
function AnimStrings() {
    const NAMES = [["G", "Sol — la más fina"], ["D", "Re"], ["A", "La"], ["E", "Mi — la más gruesa"]];
    const [act, setAct] = useState(0);
    const [ph, setPh] = useState(0);
    useEffect(() => {
        const a = setInterval(() => setAct((p) => (p + 1) % 4), 1100);
        const b = setInterval(() => setPh((p) => p + 0.6), 40);
        return () => { clearInterval(a); clearInterval(b); };
    }, []);
    const wave = (y, on) => {
        if (!on) return `M30,${y} L330,${y}`;
        let d = `M30,${y}`;
        for (let x = 30; x <= 330; x += 10) {
            const amp = 5 * Math.sin((x - 30) / 28 + ph) * (1 - Math.abs(x - 180) / 200);
            d += ` L${x},${(y + amp).toFixed(1)}`;
        }
        return d;
    };
    return (
        <div className="cw-anim">
            <svg viewBox="0 0 360 120" className="cw-svg">
                {NAMES.map(([n], i) => {
                    const y = 20 + i * 28; const on = act === i;
                    return (
                        <g key={i}>
                            <path d={wave(y, on)} fill="none" stroke={on ? "var(--acc2)" : "var(--border2)"} strokeWidth={on ? 2.5 : 1.5} />
                            <text x="8" y={y + 4} fill={on ? "var(--acc)" : "var(--dim)"} fontSize="13" fontWeight="700">{n}</text>
                        </g>
                    );
                })}
            </svg>
            <p className="cw-anim-cap">Las 4 cuerdas al aire, de la más grave a la más aguda: <code>E A D G</code> (Mi · La · Re · Sol). Truco para recordar: "<b>E</b>l <b>A</b>migo <b>D</b>el <b>G</b>ato".</p>
        </div>
    );
}

/* 3) metrónomo */
function AnimMetronome() {
    const [t, setT] = useState(0);
    useEffect(() => { const id = setInterval(() => setT((p) => p + 0.09), 30); return () => clearInterval(id); }, []);
    const ang = Math.sin(t) * 26;
    const beat = Math.sin(t) > 0.97 || Math.sin(t) < -0.97;
    return (
        <div className="cw-anim">
            <svg viewBox="0 0 200 130" className="cw-svg" style={{ maxWidth: 220 }}>
                <polygon points="100,18 70,118 130,118" fill="var(--panel)" stroke="var(--border2)" strokeWidth="2" />
                <g transform={`rotate(${ang} 100 115)`}>
                    <line x1="100" y1="115" x2="100" y2="35" stroke="var(--acc)" strokeWidth="3" />
                    <rect x="93" y="55" width="14" height="10" rx="2" fill="var(--acc2)" />
                </g>
                <circle cx="100" cy="115" r="4" fill="var(--acc)" />
                <circle cx="100" cy="128" r={beat ? 6 : 3} fill={beat ? "var(--acc2)" : "var(--dim)"} />
            </svg>
            <p className="cw-anim-cap">El metrónomo marca el pulso. Tocar a tiempo es el 80% de sonar bien en el bajo: tú eres el reloj de la banda.</p>
        </div>
    );
}

const anims = { bass: AnimBass, strings: AnimStrings, metro: AnimMetronome };

/* ====================== tema ====================== */
const theme = {
    bg: "#120a10", panel: "#1e1019", panel2: "#170c13", code: "#0c0508",
    border: "#33202c", border2: "#45293a", text: "#f3e6ee", muted: "#c69cb2", dim: "#8c647a",
    acc: "#ec5fa8", acc2: "#ff9dd0", accGlow: "rgba(236,95,168,.5)", accSoft: "rgba(236,95,168,.10)", onAcc: "#120a10",
};

const mods = [
    { name: "El instrumento", sub: "Conoce y afina tu bajo", icon: Guitar },
    { name: "Técnica", sub: "Tus dos manos", icon: Hand },
    { name: "Música", sub: "Ritmo, notas y groove", icon: Music },
    { name: "Estilos", sub: "Rock, walking y funk", icon: Flame },
];
const ranks = [
    { min: 0, name: "Primer contacto" },
    { min: 300, name: "Dedos sueltos" },
    { min: 700, name: "Bajista de garaje" },
    { min: 1100, name: "En la banda" },
    { min: 1500, name: "Maestro del groove" },
];

const lessons = [
    {
        id: "bj_conoce", mod: "El instrumento", icon: Guitar, mins: "20 min",
        title: "Conoce tu bajo",
        intro: "Antes de tocar, hay que saber qué tienes en las manos. El bajo eléctrico se ve como una guitarra grande, pero hace un trabajo distinto: marca las notas graves que sostienen toda la canción.",
        theory: [
            { anim: "bass" },
            { p: "Un bajo estándar tiene 4 cuerdas (las más gruesas y graves de la familia de la guitarra). Sus partes clave: el clavijero (donde afinas con las clavijas), el mástil con los trastes (las barritas de metal que dividen las notas), las cuerdas y las pastillas (los imanes que captan la vibración y la mandan al amplificador)." },
            { h: "Lo que necesitas para empezar" },
            { list: [
                    "Tu bajo y un cable",
                    "Un amplificador (o audífonos con interfaz/pedal) — el bajo sin amplificar casi no se oye",
                    "Un afinador (app gratis en el celular sirve perfecto)",
                    "Paciencia: al inicio las yemas de los dedos duelen; es normal, salen callos en 1-2 semanas",
                ] },
            { tip: { icon: "🎸", text: "El bajo no busca lucirse con notas rápidas: su trabajo es el groove y el ritmo. Una sola nota bien colocada vale más que mil mal puestas." } },
        ],
        practice: [
            { title: "Ubica las partes", goal: "Mira tu bajo y localiza: clavijero, trastes, pastillas y el control de volumen.",
                steps: ["Tócalos uno por uno"],
                solution: `Clavijero: arriba del todo, con las 4 clavijas.
Trastes: las barritas metálicas a lo largo del mástil.
Pastillas: los rectángulos bajo las cuerdas, cerca del cuerpo.
Volumen/tono: las perillas en el cuerpo.
// Conócelas: las usarás todo el tiempo.` },
            { title: "Cuenta tus trastes", goal: "¿Cuántos trastes tiene tu bajo? La mayoría trae 20-24.",
                steps: ["Cuéntalos desde la cejuela"],
                solution: `Cuenta desde el primero (junto al clavijero) hacia el cuerpo.
La mayoría de bajos tienen 20, 21 o 24 trastes.
El traste 12 está justo a la mitad: repite las notas del aire
una octava más agudo.` },
        ],
        quiz: [
            { q: "¿Cuántas cuerdas tiene un bajo estándar?", opts: ["6", "4", "5", "3"], correct: 1, fb: "El bajo clásico tiene 4 cuerdas (también hay de 5 y 6)." },
            { q: "¿Para qué sirven las pastillas?", opts: ["Para afinar", "Captar la vibración y mandarla al amplificador", "Sostener el mástil", "Decorar"], correct: 1, fb: "Son los imanes que convierten la vibración en señal." },
            { q: "El papel principal del bajo en una banda es…", opts: ["Tocar lo más rápido posible", "Marcar el ritmo y las notas graves (groove)", "Cantar", "Hacer solos siempre"], correct: 1, fb: "Sostiene la canción junto a la batería." },
        ],
    },
    {
        id: "bj_afinar", mod: "El instrumento", icon: Activity, mins: "20 min",
        title: "Afinación: E A D G",
        intro: "Un bajo desafinado suena mal aunque toques bien. Afinar es lo primero que harás cada vez que agarres el instrumento.",
        theory: [
            { anim: "strings" },
            { p: "Las 4 cuerdas al aire (sin pisar nada) se afinan, de la más gruesa a la más fina, en: E (Mi), A (La), D (Re), G (Sol). La gruesa arriba (la más cercana a tu cara) es el Mi grave; la fina abajo es el Sol." },
            { h: "Cómo afinar con un afinador" },
            { list: [
                    "Abre una app de afinador (o usa el del ampli)",
                    "Toca una cuerda al aire y mira la nota que detecta",
                    "Gira la clavija: si la nota está baja, tensa; si está alta, afloja",
                    "Busca que marque la letra correcta y la aguja al centro",
                ] },
            { tip: { icon: "🎯", text: "Afina siempre subiendo hacia la nota (tensando), no aflojando. Así la cuerda 'asienta' mejor y se desafina menos." } },
        ],
        practice: [
            { title: "Afina las 4 cuerdas", goal: "Afina tu bajo entero usando un afinador, cuerda por cuerda.",
                steps: ["De la más gruesa (E) a la más fina (G)"],
                solution: `Orden de afinación (grueso -> fino):
E (Mi)  ->  A (La)  ->  D (Re)  ->  G (Sol)
Toca al aire, mira el afinador, ajusta la clavija.
// Re-revisa: al tensar una, las otras pueden moverse un poco.` },
            { title: "Memoriza el truco", goal: "Aprende una frase para recordar el orden E-A-D-G.",
                steps: ["Inventa la tuya si quieres"],
                solution: `"El Amigo Del Gato"  =  E  A  D  G
o en notas:  Mi - La - Re - Sol
// De la cuerda más gruesa a la más fina.` },
        ],
        quiz: [
            { q: "¿Cuál es la afinación estándar (grueso a fino)?", opts: ["G D A E", "E A D G", "A D G C", "E B G D"], correct: 1, fb: "E-A-D-G: Mi, La, Re, Sol." },
            { q: "La cuerda más gruesa es…", opts: ["El Sol (G)", "El Mi (E) grave", "El Re (D)", "El La (A)"], correct: 1, fb: "La más gruesa y grave es el Mi (E)." },
            { q: "Si la nota suena baja, debes…", opts: ["Aflojar la clavija", "Tensar la clavija", "Cambiar la cuerda", "No hacer nada"], correct: 1, fb: "Tensar sube el tono hacia la nota." },
        ],
    },
    {
        id: "bj_postura", mod: "Técnica", icon: Hand, mins: "20 min",
        title: "Postura y las dos manos",
        intro: "La técnica empieza por cómo te paras y dónde pones las manos. Una buena postura evita dolores y hace que todo lo demás sea más fácil.",
        theory: [
            { p: "Puedes tocar sentado o de pie. Sentado, apoya el cuerpo del bajo en tu pierna; de pie, usa correa y ajústala para que el bajo quede más o menos a la misma altura que sentado. El mástil apunta ligeramente hacia arriba, no colgando a las rodillas." },
            { pairs: [
                    { a: "Mano derecha (pulsar)", b: "hace sonar las cuerdas" },
                    { a: "Mano izquierda (pisar)", b: "elige la nota en el traste" },
                ], cap: "Cada mano tiene un trabajo. Las dos coordinadas = una nota limpia." },
            { tip: { icon: "🧘", text: "Hombros relajados y muñecas lo más rectas posible. Si sientes tensión o dolor, para: estás forzando. La técnica relajada suena mejor y dura más." } },
        ],
        practice: [
            { title: "Encuentra tu postura", goal: "Acomódate sentado y de pie. Que el bajo quede estable sin que tengas que sostenerlo con la mano izquierda.",
                steps: ["El bajo no debe 'caerse' si sueltas el mástil"],
                solution: `Sentado: cuerpo del bajo sobre el muslo, mástil algo arriba.
De pie: correa ajustada a la MISMA altura que sentado.
Prueba: suelta la mano izquierda; el bajo debe quedarse quieto.
// Así la izquierda toca libre, sin cargar el peso.` },
            { title: "Posición de manos", goal: "Pon la mano izquierda en el mástil con un dedo por traste y la derecha lista sobre las cuerdas.",
                steps: ["Pulgar izquierdo detrás del mástil"],
                solution: `Izquierda: pulgar detrás del mástil (no encima),
dedos curvados, uno por traste.
Derecha: pulgar apoyado en la pastilla, índice y medio
listos para pulsar.
// Relajado, sin apretar de más.` },
        ],
        quiz: [
            { q: "¿Qué hace la mano que pulsa (derecha en diestros)?", opts: ["Elige la nota", "Hace sonar las cuerdas", "Afina", "Sostiene el bajo"], correct: 1, fb: "Ataca/pulsa las cuerdas para que suenen." },
            { q: "Al pasar de sentado a de pie conviene…", opts: ["Bajar mucho el bajo", "Ajustar la correa a la misma altura que sentado", "Subirlo al cuello", "Quitar la correa"], correct: 1, fb: "Misma altura = misma técnica." },
            { q: "Si sientes dolor o tensión al tocar…", opts: ["Aprieta más", "Relaja: estás forzando la técnica", "Toca más rápido", "Ignóralo"], correct: 1, fb: "La tensión es señal de mala postura." },
        ],
    },
    {
        id: "bj_derecha", mod: "Técnica", icon: Zap, mins: "25 min",
        title: "Mano derecha: pulsar con los dedos",
        intro: "El sonido del bajo nace en cómo atacas la cuerda. La técnica más usada es alternar índice y medio: te da velocidad y un sonido parejo.",
        theory: [
            { seq: ["Índice", "Medio", "Índice", "Medio"], cap: "Alterna los dos dedos (i-m-i-m) en vez de usar solo uno. Es como caminar: pie izquierdo, pie derecho." },
            { p: "Técnica de apoyo (rest-stroke): pulsas la cuerda y tu dedo descansa sobre la cuerda de al lado. Eso da un tono gordo y controlado. El pulgar se apoya en la pastilla (o en la cuerda E) como ancla." },
            { tip: { icon: "👆", text: "No 'jales' la cuerda hacia afuera: empújala suave hacia el cuerpo del bajo. Menos esfuerzo, mejor sonido y menos ruido de trastes." } },
        ],
        practice: [
            { title: "Alternancia i-m al aire", goal: "Toca la cuerda E al aire alternando índice y medio, parejo y lento.",
                steps: ["Cuenta 1-2-3-4 con el metrónomo lento (60 bpm)"],
                solution: `G|------------------|
D|------------------|
A|------------------|
E|-0--0--0--0-------|
   i  m  i  m
// Que las dos pulsaciones suenen IGUAL de fuertes.` },
            { title: "Recorre las 4 cuerdas", goal: "Toca dos veces cada cuerda al aire, de E a G, alternando dedos.",
                steps: ["Sin parar el i-m-i-m"],
                solution: `E|-0--0-------------|
A|-------0--0-------|
D|-------------0--0-|
G|-----------------0|... sigue
   i  m  i  m ...
// El patrón i-m no se detiene aunque cambies de cuerda.` },
        ],
        quiz: [
            { q: "La técnica de dedos más común alterna…", opts: ["Pulgar y meñique", "Índice y medio", "Solo el índice", "Los 4 dedos"], correct: 1, fb: "i-m-i-m da velocidad y uniformidad." },
            { q: "En el 'rest-stroke' (apoyo), tras pulsar el dedo…", opts: ["Se levanta al aire", "Descansa en la cuerda de al lado", "Jala fuerte", "No toca nada"], correct: 1, fb: "Descansa en la cuerda vecina: tono gordo y control." },
            { q: "El pulgar de la mano derecha normalmente…", opts: ["Queda colgando", "Se apoya como ancla (en la pastilla o cuerda E)", "Pulsa también", "Afina"], correct: 1, fb: "Sirve de ancla y referencia." },
        ],
    },
    {
        id: "bj_izquierda", mod: "Técnica", icon: Hand, mins: "25 min",
        title: "Mano izquierda: pisar las notas",
        intro: "La mano izquierda elige la nota presionando la cuerda contra un traste. Hacerlo bien es la diferencia entre una nota limpia y un zumbido feo.",
        theory: [
            { p: "Regla de oro: presiona JUSTO detrás del traste, no encima ni en medio del espacio. Ahí la nota suena limpia con el mínimo esfuerzo. Si pisas en medio, zumba; si pisas sobre el traste, se apaga." },
            { h: "Un dedo por traste" },
            { p: "Asigna cada dedo a un traste: índice (1), medio (2), anular (3), meñique (4). Esto cubre 4 trastes sin mover la mano y entrena independencia de dedos, que es lo que más cuesta al principio." },
            { tip: { icon: "💪", text: "Si la nota zumba, casi siempre es por una de tres: pisas lejos del traste, no presionas suficiente, o tocas sin querer otra cuerda. Revisa en ese orden." } },
        ],
        practice: [
            { title: "Ejercicio 1-2-3-4 (la araña)", goal: "En la cuerda E, pisa trastes 1-2-3-4 con los dedos 1-2-3-4, una nota cada uno.",
                steps: ["Lento y limpio, con metrónomo a 60"],
                solution: `G|------------------|
D|------------------|
A|------------------|
E|-1--2--3--4-------|
   1  2  3  4   (dedos)
// Mantén los dedos cerca del mástil. Este ejercicio es ORO
// para soltar la mano. Hazlo en todas las cuerdas.` },
            { title: "Caza el zumbido", goal: "Toca una nota pisada (ej. E traste 3 = G) y haz que suene perfectamente limpia.",
                steps: ["Ajusta hasta que no zumbe"],
                solution: `Pisa la cuerda E en el traste 3 (nota Sol/G), JUSTO detrás
de la barrita. Pulsa con la derecha.
Si zumba: acércate al traste y presiona un poco más.
Si se apaga: estás encima del traste, recórrete atrás.` },
        ],
        quiz: [
            { q: "¿Dónde se presiona para una nota limpia?", opts: ["Encima del traste", "Justo detrás del traste", "En medio entre trastes", "En la cejuela"], correct: 1, fb: "Detrás del traste: limpio y con poco esfuerzo." },
            { q: "El sistema 'un dedo por traste' usa…", opts: ["Solo el índice", "Cada dedo en un traste (1-2-3-4)", "Pulgar incluido", "Dos dedos"], correct: 1, fb: "Cubre 4 trastes y entrena independencia." },
            { q: "Si la nota zumba, lo más probable es que…", opts: ["El bajo esté roto", "Pises lejos del traste o sin fuerza suficiente", "La cuerda sea mágica", "Toques muy bien"], correct: 1, fb: "Posición o presión: revisa eso primero." },
        ],
    },
    {
        id: "bj_diapason", mod: "Música", icon: Target, mins: "30 min",
        title: "El diapasón: encuentra las notas",
        intro: "El mástil parece un misterio, pero sigue un patrón simple. Si aprendes pocas referencias, encuentras cualquier nota.",
        theory: [
            { p: "Cada traste sube la nota un semitono (medio tono). El abecedario musical es A B C D E F G y vuelve a A, pero ojo: entre B-C y entre E-F NO hay traste de por medio (no hay sostenido). En el traste 12 de cada cuerda vuelves a la nota del aire, una octava más arriba." },
            { pairs: [
                    { a: "Cuerda E, traste 0/12", b: "Mi (E)" },
                    { a: "Cuerda E, traste 3", b: "Sol (G)" },
                    { a: "Cuerda E, traste 5", b: "La (A) = cuerda A al aire" },
                    { a: "Cuerda A, traste 5", b: "Re (D) = cuerda D al aire" },
                ], cap: "El traste 5 de una cuerda suele dar la misma nota que la siguiente cuerda al aire. ¡Sirve hasta para afinar de oído!" },
            { tip: { icon: "🗺️", text: "No memorices las 80 notas de golpe. Aprende primero las notas naturales de las cuerdas E y A: con eso ya tocas la mayoría de las canciones." } },
        ],
        practice: [
            { title: "Notas en la cuerda E", goal: "Encuentra y di en voz alta: E(0) F(1) G(3) A(5) B(7) C(8) D(10) E(12).",
                steps: ["Recuerda: B-C y E-F están pegadas"],
                solution: `E |0=E  1=F  3=G  5=A  7=B  8=C  10=D  12=E
Fíjate: de F a G hay 2 trastes, pero de E a F y de B a C
solo 1 (no hay nota intermedia).
// Dilas en voz alta mientras las tocas: se memoriza rápido.` },
            { title: "Confirma una octava", goal: "Toca E al aire y E en el traste 12. Deben ser la misma nota, más aguda.",
                steps: ["Compara el sonido"],
                solution: `E al aire (0) y E en traste 12 = misma nota, una OCTAVA arriba.
Esto pasa en las 4 cuerdas: el traste 12 'reinicia' el ciclo.
// La octava es tu mejor amiga para construir líneas de bajo.` },
        ],
        quiz: [
            { q: "Cada traste cambia la nota en…", opts: ["Una octava", "Un semitono (medio tono)", "Un tono entero", "Nada"], correct: 1, fb: "Traste a traste = semitono." },
            { q: "En el traste 12 obtienes…", opts: ["Otra nota distinta", "La misma nota del aire, una octava más arriba", "Silencio", "La cuerda de al lado"], correct: 1, fb: "El traste 12 es la octava del aire." },
            { q: "Entre las notas B-C y E-F…", opts: ["Hay un traste extra", "No hay traste intermedio (están pegadas)", "Hay dos trastes", "No existen"], correct: 1, fb: "No hay sostenido entre ellas: están a un semitono." },
        ],
    },
    {
        id: "bj_ritmo", mod: "Música", icon: Clock, mins: "25 min",
        title: "Ritmo y tempo",
        intro: "En el bajo, el ritmo manda. Puedes tocar las notas correctas, pero si no es a tiempo, no funciona. Tú y la batería son el motor de la canción.",
        theory: [
            { anim: "metro" },
            { p: "El tempo se mide en BPM (pulsos por minuto). Las figuras dividen ese pulso: una negra = 1 pulso, dos corcheas = medio pulso cada una. La mayoría de canciones está en compás de 4/4: cuentas 1-2-3-4 y repites." },
            { cycle: ["1", "2", "3", "4"], note: "compás de 4/4", cap: "Cuenta en voz alta 1-2-3-4 mientras tocas. Tu pie también puede marcar el pulso." },
            { tip: { icon: "🕒", text: "El metrónomo no es opcional: es tu mejor maestro. Empieza LENTO (60 bpm), toca limpio, y sube de 5 en 5. La velocidad llega sola cuando la limpieza ya está." } },
        ],
        practice: [
            { title: "Negras a 60 bpm", goal: "Toca la cuerda E al aire una vez por pulso, justo con el clic del metrónomo.",
                steps: ["Una nota por clic, sin adelantarte"],
                solution: `Metrónomo a 60 bpm.
E|-0---0---0---0---|
   1   2   3   4
Una nota EXACTAMENTE con cada clic.
// Si te adelantas o atrasas, baja el tempo. Cuadrar > correr.` },
            { title: "Corcheas (el doble)", goal: "Ahora toca dos notas por pulso (1-y-2-y-3-y-4-y).",
                steps: ["Alterna i-m, parejo"],
                solution: `E|-0-0-0-0-0-0-0-0-|
   1 + 2 + 3 + 4 +
Dos notas iguales por cada clic.
// Cuenta "uno-y-dos-y..." en voz alta para no perder el lugar.` },
        ],
        quiz: [
            { q: "El tempo se mide en…", opts: ["Decibeles", "BPM (pulsos por minuto)", "Hertz", "Trastes"], correct: 1, fb: "BPM = qué tan rápido va el pulso." },
            { q: "En 4/4 cuentas…", opts: ["1-2-3", "1-2-3-4 y repites", "1-2", "1 al 8 siempre"], correct: 1, fb: "Cuatro pulsos por compás." },
            { q: "La mejor forma de ganar velocidad es…", opts: ["Tocar rápido desde el día 1", "Empezar lento y limpio, subir de a poco", "Saltarte el metrónomo", "Apretar más"], correct: 1, fb: "Limpieza primero; la velocidad llega sola." },
        ],
    },
    {
        id: "bj_escalas", mod: "Música", icon: Waves, mins: "30 min",
        title: "Escalas y tu primera línea de bajo",
        intro: "Las escalas son los ladrillos de las melodías y las líneas de bajo. Con dos patrones movibles ya puedes acompañar muchísimas canciones.",
        theory: [
            { p: "Una línea de bajo casi siempre gira alrededor de la nota raíz (root): la nota que da nombre al acorde. Si la banda toca un acorde de Sol (G), tú estás seguro tocando G. A partir de la raíz, la octava y la quinta son tus apoyos más útiles." },
            { h: "La pentatónica menor: tu navaja suiza" },
            { p: "Es una escala de 5 notas que suena bien en rock, blues y funk. Su 'caja' es movible: aprendes la forma una vez y la mueves para cambiar de tono. Aquí, la de La menor (raíz en E, traste 5):" },
            { tip: { icon: "🎵", text: "Patrón raíz–quinta–octava: pon un dedo en la raíz, y casi sin mover la mano tienes la quinta (cuerda de al lado, 2 trastes adelante) y la octava (2 cuerdas adelante, 2 trastes). Suena en MILES de canciones." } },
        ],
        practice: [
            { title: "Raíz, quinta y octava", goal: "Desde G en la cuerda E (traste 3), toca su quinta y su octava.",
                steps: ["Aprende esta forma compacta"],
                solution: `Raíz G  -> E, traste 3
Quinta D -> A, traste 5
Octava G -> D, traste 5
G|------------------|
D|-------------5----|
A|--------5---------|
E|-3----------------|
// Esta forma se MUEVE: cámbiala de traste y cambias de tono.` },
            { title: "Pentatónica menor de La", goal: "Toca la caja de La menor pentatónica (raíz en E, traste 5).",
                steps: ["Subiendo nota por nota"],
                solution: `A menor pentatónica (La):
G|-------------5--7-|
D|--------5--7------|
A|-5--7------------|
E|-5--8------------|
// Empieza despacio. Esta caja sirve para improvisar en rock/blues.` },
        ],
        quiz: [
            { q: "La nota 'raíz' (root) de una línea de bajo es…", opts: ["La más aguda", "La que da nombre al acorde", "Siempre el Mi", "Al azar"], correct: 1, fb: "Sobre la raíz construyes con seguridad." },
            { q: "La pentatónica menor tiene…", opts: ["7 notas", "5 notas", "12 notas", "3 notas"], correct: 1, fb: "'Penta' = cinco; ideal para rock/blues/funk." },
            { q: "Una 'caja' o patrón movible sirve para…", opts: ["Solo un tono", "Tocar en cualquier tono moviéndola de traste", "Afinar", "Nada"], correct: 1, fb: "Aprendes la forma una vez y la trasladas." },
        ],
    },
    {
        id: "bj_estilos", mod: "Estilos", icon: Flame, mins: "30 min",
        title: "Estilos: rock, walking y funk",
        intro: "Ya tienes las bases. Ahora, tres sabores clásicos del bajo para que empieces a sonar como en las canciones de verdad, y un plan para seguir creciendo.",
        theory: [
            { pairs: [
                    { a: "Rock", b: "raíz en corcheas, firme y constante" },
                    { a: "Walking (jazz)", b: "una negra por pulso, caminando entre notas" },
                    { a: "Funk", b: "síncopa, silencios y slap" },
                ], cap: "Cada estilo es una forma distinta de colocar las notas en el tiempo. Mismo bajo, groove diferente." },
            { h: "Slap & pop (la base del funk)" },
            { p: "El slap (T) es golpear la cuerda con el lado del pulgar contra el mástil; el pop (P) es jalar una cuerda fina con el índice para que rebote. Juntos dan ese sonido percusivo del funk. Requiere práctica, pero es divertidísimo." },
            { tip: { icon: "🔥", text: "Cómo seguir creciendo: 1) toca encima de canciones que te gusten (es lo que más enseña), 2) aprende líneas de bajos famosos sacando la TAB, 3) graba y escúchate, 4) toca con otra gente en cuanto puedas." } },
        ],
        practice: [
            { title: "Groove de rock", goal: "Toca una línea de rock en corcheas sobre la raíz G.",
                steps: ["Constante, a 80 bpm"],
                solution: `Rock en G (raíz, corcheas):
G|------------------|
D|------------------|
A|------------------|
E|-3-3-3-3-3-3-3-3--|
   1 + 2 + 3 + 4 +
// Firme y parejo: así suena medio rock clásico.` },
            { title: "Tu primer slap", goal: "Haz un slap (T) en la cuerda E y un pop (P) en la cuerda G.",
                steps: ["Pulgar golpea, índice jala"],
                solution: `T = slap con el pulgar (golpe contra el mástil) en E
P = pop jalando la cuerda G con el índice
G|----------0--P----|
E|--0--T------------|
// Alterna T y P lento. Al inicio sonará raro: es normal.` },
        ],
        quiz: [
            { q: "Una línea de rock típica usa…", opts: ["Silencios largos", "La raíz en corcheas, firme y constante", "Solo slap", "Notas al azar"], correct: 1, fb: "Raíz constante = base sólida de rock." },
            { q: "El 'slap' se hace con…", opts: ["El índice jalando", "El pulgar golpeando la cuerda contra el mástil", "Una púa", "El meñique"], correct: 1, fb: "Slap (T) = golpe de pulgar; pop (P) = jalón de índice." },
            { q: "¿Qué es lo que MÁS te hará mejorar?", opts: ["Leer teoría sin tocar", "Tocar encima de canciones reales y con otra gente", "Comprar más bajos", "Mirar videos sin practicar"], correct: 1, fb: "Tocar de verdad, mucho y con otros, es lo que enseña." },
        ],
    },
];

export default function App() {
    return (
        <Course
            storageKey="bajo_progress_v1"
            kick="// EVOLUTIVE · BAJO"
            title="BAJO" titleHi="ELÉCTRICO"
            subtitle="De cero a tocar tu groove: conoce y afina el bajo, domina las dos manos, encuentra las notas y arranca con rock, walking y funk. Con tablaturas y ejercicios para practicar con tu bajo en la mano."
            HeaderIcon={Guitar}
            theme={theme} mods={mods} ranks={ranks} lessons={lessons} anims={anims}
        />
    );
}