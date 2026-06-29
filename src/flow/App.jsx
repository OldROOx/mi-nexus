import React, { useState, useEffect } from "react";
import Course from "../_course/Course.jsx";
import { Brain, Target, Focus, Repeat, Moon, BatteryCharging, Sparkles, Zap } from "lucide-react";

/* ---------- animación custom: el canal del flow (reto vs habilidad) ---------- */
function AnimFlowChannel() {
    const [t, setT] = useState(0);
    useEffect(() => { const id = setInterval(() => setT((p) => (p + 1) % 100), 40); return () => clearInterval(id); }, []);
    const k = t / 100;
    // el punto sube por la diagonal del canal de flow
    const x = 20 + k * 150;
    const y = 100 - k * 80;
    return (
        <div className="cw-anim">
            <svg viewBox="0 0 200 120" className="cw-svg">
                {/* ejes */}
                <line x1="20" y1="110" x2="190" y2="110" stroke="var(--border2)" strokeWidth="1.5" />
                <line x1="20" y1="110" x2="20" y2="10" stroke="var(--border2)" strokeWidth="1.5" />
                {/* zonas */}
                <polygon points="20,110 190,10 190,40" fill="rgba(255,120,120,.12)" />
                <polygon points="20,110 20,80 190,10" fill="rgba(120,160,255,.12)" />
                {/* canal de flow */}
                <line x1="20" y1="110" x2="190" y2="10" stroke="var(--acc)" strokeWidth="2" strokeDasharray="4 3" />
                <circle cx={x} cy={y} r="6" fill="var(--acc2)" />
                <text x="150" y="32" fill="var(--muted)" fontSize="8">ansiedad</text>
                <text x="34" y="98" fill="var(--muted)" fontSize="8">aburrimiento</text>
                <text x="78" y="62" fill="var(--acc)" fontSize="9">FLOW</text>
            </svg>
            <p className="cw-anim-cap">El flow aparece en la diagonal: cuando el <code>reto</code> y tu <code>habilidad</code> suben juntos. Mucho reto y poca habilidad = ansiedad; al revés = aburrimiento.</p>
        </div>
    );
}
const anims = { flow: AnimFlowChannel };

const theme = {
    bg: "#0e0d18", panel: "#16142a", panel2: "#121022", code: "#0b0a16",
    border: "#262340", border2: "#322d52", text: "#e9e7f5", muted: "#a39fc4", dim: "#6f6a96",
    acc: "#7c6cf0", acc2: "#b4a8ff", accGlow: "rgba(124,108,240,.5)", accSoft: "rgba(124,108,240,.10)", onAcc: "#0e0d18",
};

const mods = [
    { name: "El estado", sub: "Qué es el flow y qué lo enciende", icon: Brain },
    { name: "Foco", sub: "Atención profunda y distracciones", icon: Focus },
    { name: "Hábitos", sub: "Automatizar y mejorar", icon: Repeat },
    { name: "Energía", sub: "Sueño, energía y burnout", icon: BatteryCharging },
];
const ranks = [
    { min: 0, name: "Disperso" },
    { min: 300, name: "Aprendiz del foco" },
    { min: 700, name: "Concentrado" },
    { min: 1100, name: "Trabajador profundo" },
    { min: 1500, name: "Maestro del flow" },
];

const lessons = [
    {
        id: "fl_teoria", mod: "El estado", icon: Brain, mins: "20 min",
        title: "Teoría del flow",
        intro: "El flow es ese estado en el que te absorbes tanto en una tarea que el tiempo desaparece y rindes al máximo. No es magia: tiene condiciones que puedes provocar.",
        theory: [
            { anim: "flow" },
            { p: "El psicólogo Csíkszentmihályi describió el flow como el equilibrio entre el reto de la tarea y tu habilidad. Si el reto supera mucho tu nivel, sientes ansiedad; si es muy fácil, aburrimiento. En el punto justo: flow." },
            { h: "Condiciones del flow" },
            { list: ["Metas claras: sabes exactamente qué hacer", "Retroalimentación inmediata: ves si vas bien", "Equilibrio reto/habilidad en el límite de lo que puedes", "Concentración sin interrupciones"] },
            { tip: { icon: "🌊", text: "Para entrar en flow, ajusta la dificultad: si te aburres, sube el reto; si te frustras, baja un poco o practica la subhabilidad que falla." } },
        ],
        practice: [
            { title: "Diagnostica el estado", goal: "Te sientes ansioso al estudiar algo. ¿Qué ajustas?",
                steps: ["Reto vs habilidad"],
                solution: `Ansiedad = el reto supera tu habilidad actual.
Ajuste: baja el reto (divide la tarea en pasos pequeños)
o practica primero la subhabilidad que te traba.
// Acércate al canal de flow.` },
            { title: "Diseña una tarea con flow", goal: "Convierte 'estudiar para el examen' en una tarea con metas claras y feedback.",
                steps: ["Meta concreta + feedback"],
                solution: `En vez de "estudiar":
Meta clara: "resolver 10 ejercicios del tema 3 en 40 min".
Feedback: revisar respuestas al terminar cada bloque.
// Concreto + medible = entra el foco.` },
        ],
        quiz: [
            { q: "El flow ocurre cuando…", opts: ["La tarea es muy fácil", "El reto y la habilidad están equilibrados en el límite", "No hay metas", "Hay muchas distracciones"], correct: 1, fb: "Equilibrio reto/habilidad en el borde de lo que puedes." },
            { q: "Mucho reto y poca habilidad produce…", opts: ["Flow", "Ansiedad", "Aburrimiento", "Sueño"], correct: 1, fb: "El desbalance hacia el reto genera ansiedad." },
            { q: "¿Cuál NO es condición del flow?", opts: ["Metas claras", "Feedback inmediato", "Interrupciones constantes", "Concentración"], correct: 2, fb: "Las interrupciones rompen el flow." },
        ],
    },
    {
        id: "fl_motiv", mod: "El estado", icon: Sparkles, mins: "25 min",
        title: "Motivación intrínseca y dopamina",
        intro: "Hay dos motores: hacer algo por recompensa externa o por el gusto mismo de hacerlo. El segundo sostiene el esfuerzo a largo plazo.",
        theory: [
            { pairs: [
                    { a: "Motivación extrínseca", b: "premio/castigo externo" },
                    { a: "Motivación intrínseca", b: "el gusto y sentido propios" },
                ], cap: "La intrínseca dura más y predice mejor el flow: haces la tarea porque te importa, no solo por el premio." },
            { p: "La dopamina no es la molécula del 'placer' sino la de la anticipación y la motivación: te empuja a buscar. Los picos rápidos (redes, azúcar, notificaciones) la disparan y luego dejan vacío, haciendo más difícil el esfuerzo sostenido." },
            { h: "Las 3 palancas de la motivación intrínseca" },
            { list: ["Autonomía: sentir que tú decides", "Maestría: progresar y mejorar", "Propósito: que importe para algo mayor"] },
            { tip: { icon: "🔋", text: "Si dependes de recompensas rápidas (scroll, dulces), tu cerebro se acostumbra y las tareas valiosas se sienten aburridas. Bajar esos picos hace que lo importante vuelva a motivar." } },
        ],
        practice: [
            { title: "Identifica el tipo", goal: "Estudias solo por la nota vs estudias porque el tema te fascina. ¿Cuál sostiene más?",
                steps: ["Extrínseca vs intrínseca"],
                solution: `Solo por la nota -> extrínseca (se apaga al quitar el premio).
Porque te fascina -> intrínseca (se sostiene sola).
// Conecta la tarea con tu interés real para durar.` },
            { title: "Aplica autonomía/maestría/propósito", goal: "Haz más intrínseca la tarea 'practicar programación'.",
                steps: ["Toca las 3 palancas"],
                solution: `Autonomía: elige TÚ un proyecto que te interese.
Maestría: lleva registro de tu progreso semana a semana.
Propósito: que el proyecto resuelva algo que te importe.
// Así dejas de necesitar premios externos.` },
        ],
        quiz: [
            { q: "La motivación intrínseca es…", opts: ["Por premio externo", "Por el gusto/sentido propios de la tarea", "Por castigo", "Por dinero"], correct: 1, fb: "Nace del interior; sostiene el esfuerzo." },
            { q: "La dopamina se asocia sobre todo con…", opts: ["El placer puro", "La anticipación y la búsqueda/motivación", "El sueño", "El dolor"], correct: 1, fb: "Es la molécula del 'querer', no solo del 'gustar'." },
            { q: "¿Cuál NO es palanca de la motivación intrínseca?", opts: ["Autonomía", "Maestría", "Propósito", "Castigo"], correct: 3, fb: "Las tres son autonomía, maestría y propósito." },
        ],
    },
    {
        id: "fl_deep", mod: "Foco", icon: Focus, mins: "25 min",
        title: "Atención profunda (Deep Work)",
        intro: "El trabajo profundo es concentrarse sin distracción en una tarea cognitivamente exigente. Es donde se produce lo valioso y lo que más se está perdiendo hoy.",
        theory: [
            { p: "Cal Newport contrasta el 'deep work' (foco total, alto valor) con el 'shallow work' (tareas superficiales, fáciles de interrumpir). El profundo es el que crea habilidades y resultados difíciles de replicar." },
            { h: "El costo de cambiar de tarea" },
            { p: "Cada vez que te interrumpes, dejas un 'residuo de atención': parte de tu mente sigue en lo anterior. Por eso multitarea = peor rendimiento en todo. Recuperar el foco tras una interrupción puede tomar varios minutos." },
            { tip: { icon: "🎯", text: "Bloquea sesiones de foco (p. ej. 60-90 min) sin notificaciones. La profundidad no se logra en ratos de 5 minutos entre avisos." } },
        ],
        practice: [
            { title: "Clasifica el trabajo", goal: "Ordena en profundo/superficial: escribir código nuevo; responder chats; diseñar un algoritmo; revisar notificaciones.",
                steps: ["¿Exige foto total o es superficial?"],
                solution: `Profundo: escribir código nuevo, diseñar un algoritmo
Superficial: responder chats, revisar notificaciones
// Protege el tiempo profundo; agrupa el superficial.` },
            { title: "Diseña una sesión", goal: "Arma una sesión de deep work de 90 minutos.",
                steps: ["Quita distracciones, define salida"],
                solution: `1. Una sola tarea clara y exigente.
2. Teléfono en otra habitación, notificaciones off.
3. 90 min de foco, luego 15 de descanso real.
4. Define qué entregable sale al final.` },
        ],
        quiz: [
            { q: "El 'deep work' es…", opts: ["Tareas fáciles", "Foco total en algo exigente", "Multitarea", "Revisar el celular"], correct: 1, fb: "Concentración profunda y de alto valor." },
            { q: "El 'residuo de atención' aparece cuando…", opts: ["Duermes", "Cambias de tarea/te interrumpes", "Comes", "Hay silencio"], correct: 1, fb: "Parte de tu mente queda en la tarea anterior." },
            { q: "La multitarea suele…", opts: ["Mejorar todo", "Empeorar el rendimiento en todas las tareas", "No tener efecto", "Crear flow"], correct: 1, fb: "Dividir la atención degrada el desempeño." },
        ],
    },
    {
        id: "fl_distr", mod: "Foco", icon: Zap, mins: "20 min",
        title: "Eliminación de distracciones",
        intro: "No tienes poca fuerza de voluntad: tienes un entorno diseñado para robarte la atención. La solución es ambiental, no heroica.",
        theory: [
            { p: "Las apps están diseñadas para capturar tu atención (notificaciones, scroll infinito, recompensas variables). Pelear con voluntad pura cansa; es mucho más efectivo cambiar el entorno para que lo distractor sea difícil de alcanzar." },
            { seq: ["Detectar", "Aumentar fricción", "Reemplazar", "Revisar"], cap: "En vez de resistir cada impulso, ponle obstáculos a la distracción y un sustituto mejor a la mano." },
            { tip: { icon: "🚧", text: "Regla de fricción: haz lo distractor 20 segundos más difícil (cerrar sesión, sacar la app de la pantalla) y lo valioso 20 segundos más fácil. El entorno decide más que la voluntad." } },
        ],
        practice: [
            { title: "Aplica fricción", goal: "Te distraes con una red social al estudiar. ¿Qué cambias en el entorno?",
                steps: ["Súbele la fricción"],
                solution: `- Cierra sesión y borra la app de la pantalla principal.
- Deja el teléfono en otra habitación durante el estudio.
- Usa un bloqueador de apps por tiempo.
// Cada obstáculo extra reduce el impulso automático.` },
            { title: "Sustituye, no solo prohíbas", goal: "¿Por qué conviene tener un reemplazo para el hábito distractor?",
                steps: ["Piensa en el vacío que deja"],
                solution: `Quitar una distracción deja un hueco que el cerebro
quiere llenar. Si pones un sustituto mejor a la mano
(un libro, una pausa para caminar), no recaes
en lo de siempre.` },
        ],
        quiz: [
            { q: "La mejor estrategia contra las distracciones es…", opts: ["Pura fuerza de voluntad", "Cambiar el entorno (fricción)", "Ignorarlas", "Más notificaciones"], correct: 1, fb: "El entorno pesa más que la voluntad." },
            { q: "'Aumentar la fricción' significa…", opts: ["Hacer la distracción más difícil de alcanzar", "Trabajar más rápido", "Comprar apps", "Dormir menos"], correct: 0, fb: "Pones obstáculos al impulso distractor." },
            { q: "Al quitar un hábito distractor conviene…", opts: ["Dejar el vacío", "Poner un sustituto mejor", "Castigarte", "Nada"], correct: 1, fb: "El reemplazo evita recaer." },
        ],
    },
    {
        id: "fl_habit", mod: "Hábitos", icon: Repeat, mins: "25 min",
        title: "Formación de hábitos",
        intro: "La fuerza de voluntad se agota; los hábitos no. Un hábito es una conducta automatizada que ya no te cuesta decidir.",
        theory: [
            { cycle: ["Señal", "Anhelo", "Rutina", "Recompensa"], note: "bucle del hábito", cap: "Todo hábito sigue este bucle. Para crear uno bueno, diseña cada parte; para romper uno malo, ataca la señal o la recompensa." },
            { p: "Para instalar un hábito: hazlo obvio (señal visible), atractivo, fácil (reduce la fricción) y satisfactorio (recompensa inmediata). La constancia importa más que la intensidad: pequeño y diario gana." },
            { tip: { icon: "🔁", text: "Encadena el hábito nuevo a uno existente: 'después de [lavarme los dientes], haré [10 min de repaso]'. La rutina vieja se vuelve la señal de la nueva." } },
        ],
        practice: [
            { title: "Identifica el bucle", goal: "Cada vez que suena una notificación revisas el teléfono. Nombra señal, rutina y recompensa.",
                steps: ["Mapea el bucle"],
                solution: `Señal: el sonido de la notificación.
Rutina: tomar el teléfono y revisarlo.
Recompensa: la novedad/dopamina de ver algo nuevo.
// Para romperlo: silencia la SEÑAL (notificaciones off).` },
            { title: "Diseña un hábito nuevo", goal: "Quieres estudiar 20 min diarios. Diséñalo con el bucle.",
                steps: ["Obvio, fácil, satisfactorio"],
                solution: `Señal: dejar el libro abierto sobre el escritorio (obvio).
Rutina: 20 min después de desayunar (encadenado).
Fácil: empieza con solo 1 página si no hay ánimo.
Recompensa: marca una ✓ en un calendario visible.` },
        ],
        quiz: [
            { q: "El bucle del hábito es…", opts: ["Señal → rutina → recompensa", "Solo voluntad", "Premio → castigo", "Azar"], correct: 0, fb: "Señal, anhelo, rutina y recompensa." },
            { q: "Para instalar un hábito conviene hacerlo…", opts: ["Difícil y raro", "Obvio, fácil y satisfactorio", "Invisible", "Una vez al mes"], correct: 1, fb: "Reducir fricción y dar recompensa inmediata." },
            { q: "¿Qué vence más a largo plazo?", opts: ["Intensidad ocasional", "Constancia pequeña y diaria", "Fuerza de voluntad pura", "Suerte"], correct: 1, fb: "Pequeño y diario gana a grande y esporádico." },
        ],
    },
    {
        id: "fl_practica", mod: "Hábitos", icon: Target, mins: "25 min",
        title: "Práctica deliberada",
        intro: "Repetir no es mejorar. La práctica deliberada es entrenar justo en el límite de lo que no dominas, con feedback y corrección.",
        theory: [
            { seq: ["Objetivo específico", "Foco en el límite", "Feedback", "Corregir"], cap: "No es 'practicar más', es practicar lo correcto: trabajar la parte débil, no repetir lo que ya dominas." },
            { p: "La diferencia entre 10,000 horas inútiles y útiles es la atención: practicar en piloto automático no mejora. Hay que elegir una subhabilidad concreta, salir de la zona de confort y corregir cada error." },
            { tip: { icon: "🎯", text: "Aísla tu punto débil y entrénalo solo. Un guitarrista no toca la canción entera mil veces: repite el compás que falla hasta dominarlo." } },
        ],
        practice: [
            { title: "Diseña práctica deliberada", goal: "Quieres mejorar resolviendo exámenes pero siempre fallas los problemas de cierto tipo.",
                steps: ["Aísla la debilidad"],
                solution: `No resuelvas exámenes completos al azar.
1. Aísla el TIPO de problema que fallas.
2. Haz 10 seguidos solo de ese tipo.
3. Revisa cada error y entiende por qué.
4. Repite hasta que deje de fallar.` },
            { title: "Por qué repetir no basta", goal: "¿Por qué alguien puede manejar 20 años y no mejorar?",
                steps: ["Piensa en piloto automático"],
                solution: `Porque maneja en piloto automático: repite sin
buscar mejorar ni recibir feedback correctivo.
La repetición sin atención ni objetivo no es
práctica deliberada: solo mantiene el nivel.` },
        ],
        quiz: [
            { q: "La práctica deliberada entrena…", opts: ["Lo que ya dominas", "El límite de lo que no dominas, con feedback", "Nada en especial", "Solo teoría"], correct: 1, fb: "Trabaja la debilidad con corrección." },
            { q: "¿Por qué repetir mucho no garantiza mejorar?", opts: ["Porque cansa", "Porque sin atención ni feedback es piloto automático", "Porque es caro", "Sí garantiza"], correct: 1, fb: "La repetición sin objetivo no produce mejora." },
            { q: "Lo primero en la práctica deliberada es…", opts: ["Hacer todo a la vez", "Definir un objetivo específico / debilidad", "Descansar", "Competir"], correct: 1, fb: "Aislar qué subhabilidad mejorar." },
        ],
    },
    {
        id: "fl_sueno", mod: "Energía", icon: Moon, mins: "25 min",
        title: "Sueño, recuperación y energía",
        intro: "El rendimiento no es solo trabajar más, sino recuperarte bien. El sueño y la gestión de energía son la base de todo lo anterior.",
        theory: [
            { p: "Durante el sueño el cerebro consolida lo aprendido y se 'limpia'. Dormir poco destruye foco, memoria y autocontrol: el cerebro privado de sueño rinde como uno intoxicado. No es opcional, es mantenimiento." },
            { h: "Gestiona energía, no solo tiempo" },
            { p: "Tu energía sube y baja en ciclos durante el día (ritmos ultradianos, ~90 min). Trabaja las tareas duras en tus picos de energía y descansa de verdad en los valles, en vez de forzar parejo todo el día." },
            { tip: { icon: "😴", text: "Protege el sueño como protegerías una reunión importante: horario fijo, sin pantallas antes de dormir. Es la inversión de mayor retorno para tu cerebro." } },
        ],
        practice: [
            { title: "Ubica tu tarea dura", goal: "Tu pico de concentración es en la mañana. ¿Cuándo agendas lo más difícil?",
                steps: ["Energía, no solo horario"],
                solution: `Agenda la tarea más exigente en la MAÑANA (tu pico).
Deja lo superficial (correos, trámites) para los valles
de energía de la tarde.
// Alinea la dificultad con tu energía.` },
            { title: "Higiene de sueño", goal: "Da 3 hábitos para dormir mejor.",
                steps: ["Pensar en rutina y entorno"],
                solution: `1. Horario fijo para dormir y despertar.
2. Sin pantallas 30-60 min antes (la luz retrasa el sueño).
3. Cuarto oscuro, fresco y silencioso.
// El sueño regular mejora foco, memoria y ánimo.` },
        ],
        quiz: [
            { q: "Durante el sueño el cerebro…", opts: ["No hace nada", "Consolida aprendizaje y se limpia", "Solo descansa el cuerpo", "Pierde memoria a propósito"], correct: 1, fb: "Es mantenimiento esencial del cerebro." },
            { q: "'Gestionar energía' significa…", opts: ["Trabajar parejo todo el día", "Poner lo difícil en tus picos y descansar en los valles", "No descansar", "Dormir de día"], correct: 1, fb: "Alinea esfuerzo con tus ritmos de energía." },
            { q: "Dormir poco afecta sobre todo…", opts: ["El color de ojos", "Foco, memoria y autocontrol", "La estatura", "Nada"], correct: 1, fb: "El déficit de sueño degrada el rendimiento cognitivo." },
        ],
    },
    {
        id: "fl_burnout", mod: "Energía", icon: BatteryCharging, mins: "20 min",
        title: "Burnout y recuperación",
        intro: "El burnout es el agotamiento por exigencia sostenida sin recuperación. Reconocerlo a tiempo evita que la productividad se desplome.",
        theory: [
            { seq: ["Señales tempranas", "Agotamiento", "Cinismo", "Bajo rendimiento"], cap: "El burnout escala. Atender las señales tempranas (cansancio crónico, irritabilidad) evita llegar al colapso." },
            { p: "No se cura con 'echarle más ganas': eso lo empeora. Se recupera bajando la carga, restaurando el descanso, recuperando el sentido de la tarea y, si hace falta, pidiendo apoyo. Prevenir es alternar esfuerzo con recuperación real." },
            { tip: { icon: "🔋", text: "El descanso real no es 'scroll' agotado: es algo que recarga (dormir, naturaleza, movimiento, gente que quieres). El esfuerzo sostenible necesita valles de verdad, no solo pausas falsas." } },
        ],
        practice: [
            { title: "Detecta señales", goal: "Llevas semanas cansado, irritable y todo te da igual. ¿Qué puede ser?",
                steps: ["Relaciona con las fases"],
                solution: `Señales clásicas de burnout temprano:
agotamiento crónico + irritabilidad + cinismo (todo da igual).
Acción: reducir carga y restaurar descanso YA,
antes de que caiga el rendimiento.` },
            { title: "Plan de recuperación", goal: "Da 3 acciones para recuperarte del agotamiento.",
                steps: ["Carga, descanso, sentido"],
                solution: `1. Bajar la carga (decir que no, posponer lo no urgente).
2. Restaurar descanso real (sueño, naturaleza, desconexión).
3. Reconectar con el porqué de lo que haces, o pedir apoyo.
// 'Más ganas' empeora el burnout; recuperar, no.` },
        ],
        quiz: [
            { q: "El burnout es…", opts: ["Pereza", "Agotamiento por exigencia sostenida sin recuperación", "Falta de talento", "Un premio"], correct: 1, fb: "Es agotamiento crónico, no falta de voluntad." },
            { q: "¿Cómo NO se cura el burnout?", opts: ["Bajando la carga", "Echándole más ganas", "Descansando de verdad", "Pidiendo apoyo"], correct: 1, fb: "Forzar más lo empeora." },
            { q: "El descanso que recarga es…", opts: ["Scroll agotado", "Sueño, naturaleza, movimiento, vínculos", "Trabajar más", "Saltarse comidas"], correct: 1, fb: "Recuperación real, no pausas falsas." },
        ],
    },
];

export default function App() {
    return (
        <Course
            storageKey="flow_progress_v1"
            kick="// EVOLUTIVE · FLOW"
            title="ESTADO DE" titleHi="FLOW"
            subtitle="Aprende a concentrarte y rendir como nunca: el estado de flow, el foco profundo, los hábitos y la energía. Con esquemas visuales, ejercicios y quiz por lección."
            HeaderIcon={Brain}
            theme={theme} mods={mods} ranks={ranks} lessons={lessons} anims={anims}
        />
    );
}