import React, { useState, useEffect, useRef } from "react";
import {
    Atom, Gauge, Zap, Activity, Flame, Orbit, Sparkles, Route, Infinity as Inf,
    BookOpen, Play, Award, ChevronLeft, ChevronRight, Eye, EyeOff, Check, RotateCcw,
} from "lucide-react";

/* ============================================================
   FÍSICA CON FEYNMAN — de noob a pro
   Tema pizarrón de tiza. Progreso en localStorage (fisica_progress_v1).
   40% teoría (con animaciones explicativas) · 60% práctica (problemas).
   De la hipótesis atómica a la suma de caminos (QED).
   ============================================================ */

const SAVE_KEY = "fisica_progress_v1";

/* ====================================================================
   ANIMACIONES — autocontenidas, solo SVG/CSS.
   ==================================================================== */

/* --- 1. Átomos en movimiento perpetuo --- */
function AnimAtoms() {
    const particles = useRef(
        Array.from({ length: 14 }, () => ({
            x: 10 + Math.random() * 80, y: 10 + Math.random() * 80,
            vx: (Math.random() - 0.5) * 2.6, vy: (Math.random() - 0.5) * 2.6,
        }))
    );
    const [, setF] = useState(0);
    useEffect(() => {
        const t = setInterval(() => {
            for (const p of particles.current) {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 4 || p.x > 96) p.vx *= -1;
                if (p.y < 4 || p.y > 96) p.vy *= -1;
                p.x = Math.max(4, Math.min(96, p.x));
                p.y = Math.max(4, Math.min(96, p.y));
            }
            setF((n) => n + 1);
        }, 40);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="ph-anim">
            <div className="ph-atombox">
                {particles.current.map((p, i) => (
                    <span key={i} className="ph-atom" style={{ left: p.x + "%", top: p.y + "%" }} />
                ))}
            </div>
            <p className="ph-anim-cap">Los átomos nunca están quietos: se mueven, chocan y rebotan sin parar. Más calor = más movimiento. Esa es la hipótesis atómica.</p>
        </div>
    );
}

/* --- 2. Movimiento: velocidad y aceleración --- */
function AnimMotion() {
    const [t, setT] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setT((p) => (p + 1) % 100), 40);
        return () => clearInterval(id);
    }, []);
    const k = t / 100;
    const x = 10 + k * k * 80;       // acelera (x ∝ t²)
    const v = 2 * k * 80 / 100;      // velocidad ∝ t
    return (
        <div className="ph-anim">
            <svg viewBox="0 0 200 90" className="ph-svg">
                <line x1="10" y1="70" x2="190" y2="70" stroke="#3a5446" strokeWidth="1.5" />
                <circle cx={10 + (x / 100) * 180} cy="60" r="8" fill="#f0c14b" />
                <line x1={10 + (x / 100) * 180} y1="60" x2={10 + (x / 100) * 180 + v * 14} y2="60"
                      stroke="#6fb1c9" strokeWidth="3" markerEnd="url(#phArrow)" />
                <defs>
                    <marker id="phArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 Z" fill="#6fb1c9" />
                    </marker>
                </defs>
            </svg>
            <p className="ph-anim-cap">La <code>velocidad</code> (flecha azul) es qué tan rápido cambia la posición. Como acelera, la flecha crece: eso es <code>aceleración</code>.</p>
        </div>
    );
}

/* --- 3. F = ma: misma fuerza, distinta masa --- */
function AnimNewton() {
    const [t, setT] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setT((p) => (p + 1) % 100), 40);
        return () => clearInterval(id);
    }, []);
    const k = t / 100;
    const light = 10 + k * k * 78;       // poca masa: acelera más
    const heavy = 10 + k * k * 40;       // mucha masa: acelera menos
    return (
        <div className="ph-anim">
            <div className="ph-newton">
                <div className="ph-newton-row">
                    <span className="ph-newton-lbl">m pequeña</span>
                    <div className="ph-newton-track"><span className="ph-newton-force">→</span><div className="ph-newton-box sm" style={{ left: light + "%" }}>m</div></div>
                </div>
                <div className="ph-newton-row">
                    <span className="ph-newton-lbl">m grande</span>
                    <div className="ph-newton-track"><span className="ph-newton-force">→</span><div className="ph-newton-box lg" style={{ left: heavy + "%" }}>M</div></div>
                </div>
            </div>
            <p className="ph-anim-cap">Misma fuerza, distinta masa: <code>a = F/m</code>. Cuanta más masa, menos acelera. Ese es el corazón de la segunda ley de Newton.</p>
        </div>
    );
}

/* --- 4. Péndulo: energía cinética ↔ potencial --- */
function AnimPendulum() {
    const [t, setT] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setT((p) => p + 0.06), 30);
        return () => clearInterval(id);
    }, []);
    const ang = Math.cos(t) * 0.7;             // oscila
    const px = 100 + Math.sin(ang) * 70;
    const py = 20 + Math.cos(ang) * 70;
    const pe = Math.pow(Math.cos(ang) * 0.7, 2);   // alto en los extremos
    const ke = 1 - (Math.cos(ang) / Math.cos(0.7)); // alto en el centro
    const peN = Math.abs(ang) / 0.7;               // 0..1 (extremos)
    const keN = 1 - peN;                           // centro
    return (
        <div className="ph-anim">
            <svg viewBox="0 0 200 110" className="ph-svg">
                <line x1="100" y1="20" x2={px} y2={py} stroke="#3a5446" strokeWidth="2" />
                <circle cx="100" cy="20" r="3" fill="#9fb0a3" />
                <circle cx={px} cy={py} r="11" fill="#f0c14b" />
            </svg>
            <div className="ph-bars">
                <div className="ph-bar"><span>cinética</span><div className="ph-bar-track"><i style={{ width: keN * 100 + "%", background: "#f0c14b" }} /></div></div>
                <div className="ph-bar"><span>potencial</span><div className="ph-bar-track"><i style={{ width: peN * 100 + "%", background: "#6fb1c9" }} /></div></div>
            </div>
            <p className="ph-anim-cap">Abajo va rápido (toda cinética); arriba se detiene (toda potencial). La suma nunca cambia: la energía se conserva.</p>
        </div>
    );
}

/* --- 5. Energía en una rampa --- */
function AnimEnergyHill() {
    const [t, setT] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setT((p) => p + 0.05), 30);
        return () => clearInterval(id);
    }, []);
    const k = (Math.sin(t) + 1) / 2;        // 0..1 posición en la U
    const bx = 20 + k * 160;
    const by = 80 - Math.pow((k - 0.5) * 2, 2) * 55; // parábola (U invertida de altura)
    const heightN = Math.pow((k - 0.5) * 2, 2);  // 0 abajo, 1 en extremos
    return (
        <div className="ph-anim">
            <svg viewBox="0 0 200 100" className="ph-svg">
                <path d="M20,25 Q100,135 180,25" fill="none" stroke="#3a5446" strokeWidth="2.5" />
                <circle cx={bx} cy={by} r="9" fill="#f0c14b" />
            </svg>
            <div className="ph-bars">
                <div className="ph-bar"><span>cinética ½mv²</span><div className="ph-bar-track"><i style={{ width: (1 - heightN) * 100 + "%", background: "#f0c14b" }} /></div></div>
                <div className="ph-bar"><span>potencial mgh</span><div className="ph-bar-track"><i style={{ width: heightN * 100 + "%", background: "#6fb1c9" }} /></div></div>
            </div>
            <p className="ph-anim-cap">Al bajar, la potencial (altura) se convierte en cinética (velocidad). Sin fricción, el total <code>KE + PE</code> es constante.</p>
        </div>
    );
}

/* --- 6. Órbita: gravitación --- */
function AnimOrbit() {
    const [t, setT] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setT((p) => p + 0.03), 30);
        return () => clearInterval(id);
    }, []);
    const cx = 100, cy = 55;
    const px = cx + Math.cos(t) * 64;
    const py = cy + Math.sin(t) * 36;
    return (
        <div className="ph-anim">
            <svg viewBox="0 0 200 110" className="ph-svg">
                <ellipse cx={cx} cy={cy} rx="64" ry="36" fill="none" stroke="#2a4034" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx={cx} cy={cy} r="13" fill="#f0c14b" />
                <line x1={px} y1={py} x2={cx} y2={cy} stroke="#6fb1c9" strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx={px} cy={py} r="7" fill="#6fb1c9" />
            </svg>
            <p className="ph-anim-cap">La gravedad jala al planeta hacia el sol (línea azul), pero su velocidad lo hace "caer de lado" para siempre. <code>F = G·m₁·m₂ / r²</code>.</p>
        </div>
    );
}

/* --- 7. Simetría → conservación --- */
function AnimSymmetry() {
    const pairs = [
        { s: "Las leyes son iguales hoy y mañana", c: "se conserva la ENERGÍA" },
        { s: "Las leyes son iguales aquí y allá", c: "se conserva el MOMENTO" },
        { s: "Las leyes son iguales en toda dirección", c: "se conserva el MOMENTO ANGULAR" },
    ];
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((s) => (s + 1) % pairs.length), 1600);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="ph-anim">
            <div className="ph-sym">
                {pairs.map((p, idx) => (
                    <div key={idx} className={`ph-sym-row ${idx === i ? "on" : ""}`}>
                        <span className="ph-sym-s">{p.s}</span>
                        <span className="ph-sym-arrow">→</span>
                        <span className="ph-sym-c">{p.c}</span>
                    </div>
                ))}
            </div>
            <p className="ph-anim-cap">Cada simetría de la naturaleza esconde una ley de conservación. Esa es una de las ideas más profundas de la física.</p>
        </div>
    );
}

/* --- 8. Principio de mínima acción --- */
function AnimLeastAction() {
    const [t, setT] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setT((p) => (p + 1) % 100), 35);
        return () => clearInterval(id);
    }, []);
    const k = t / 100;
    const real = { x: 20 + k * 160, y: 70 - Math.sin(k * Math.PI) * 44 };
    return (
        <div className="ph-anim">
            <svg viewBox="0 0 200 90" className="ph-svg">
                {/* caminos posibles (tenues) */}
                <path d="M20,70 Q100,10 180,70" fill="none" stroke="#2a4034" strokeWidth="1.5" />
                <path d="M20,70 Q100,70 180,70" fill="none" stroke="#2a4034" strokeWidth="1.5" />
                <path d="M20,70 Q100,45 180,70" fill="none" stroke="#2a4034" strokeWidth="1.5" />
                {/* camino real (mínima acción) */}
                <path d="M20,70 Q100,26 180,70" fill="none" stroke="#f0c14b" strokeWidth="2.5" />
                <circle cx="20" cy="70" r="5" fill="#9fb0a3" />
                <circle cx="180" cy="70" r="5" fill="#9fb0a3" />
                <circle cx={real.x} cy={real.y} r="7" fill="#f0c14b" />
            </svg>
            <p className="ph-anim-cap">De todos los caminos posibles entre dos puntos (grises), la naturaleza toma justo uno: el de <code>acción mínima</code> (amarillo).</p>
        </div>
    );
}

/* --- 9. QED: suma de caminos (flechas que giran) --- */
function AnimPaths() {
    const [t, setT] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setT((p) => p + 0.05), 40);
        return () => clearInterval(id);
    }, []);
    const arrows = Array.from({ length: 7 }, (_, i) => i - 3); // -3..3
    return (
        <div className="ph-anim">
            <div className="ph-phasors">
                {arrows.map((d) => {
                    const ang = t + d * d * 0.6; // los del centro casi alineados, los lejanos desfasados
                    return (
                        <svg key={d} viewBox="0 0 40 40" className="ph-phasor">
                            <line x1="20" y1="20" x2={20 + Math.cos(ang) * 14} y2={20 + Math.sin(ang) * 14}
                                  stroke={Math.abs(d) <= 1 ? "#f0c14b" : "#6fb1c9"} strokeWidth="2.5" markerEnd="url(#phA2)" />
                            <defs>
                                <marker id="phA2" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                                    <path d="M0,0 L5,3 L0,6 Z" fill={Math.abs(d) <= 1 ? "#f0c14b" : "#6fb1c9"} />
                                </marker>
                            </defs>
                        </svg>
                    );
                })}
            </div>
            <p className="ph-anim-cap">En cuántica la partícula toma TODOS los caminos. Cada uno aporta una flecha que gira; las del centro se alinean y se refuerzan, el resto se cancela. Así nace el camino clásico.</p>
        </div>
    );
}

/* ====================================================================
   CONTENIDO
   ==================================================================== */
const L = [
    /* ===================== CÓMO PENSAR ===================== */
    {
        id: "f_atom", mod: "Cómo pensar", icon: Atom, mins: "20 min",
        title: "La hipótesis atómica y pensar como físico",
        intro: "Feynman dijo que si una catástrofe destruyera todo el conocimiento científico y solo pudiéramos salvar una frase, debería ser: que todas las cosas están hechas de átomos.",
        theory: [
            { anim: "atoms" },
            { p: "La hipótesis atómica: todo está hecho de átomos, partículas pequeñas en movimiento perpetuo que se atraen a corta distancia pero se repelen al apretarlas. Con esa sola idea explicas el calor, los estados de la materia, la presión y muchísimo más." },
            { h: "El método: observar, modelar, predecir, comprobar" },
            { p: "La física no es memorizar fórmulas; es entender por qué. Se construye un modelo, se predice algo y se comprueba contra la realidad. Si falla, el modelo se cambia. Como decía Feynman: 'lo que no puedo crear, no lo entiendo'." },
            { h: "La técnica Feynman para aprender" },
            { list: [
                    "Explica el tema como si se lo enseñaras a un niño",
                    "Detecta dónde te trabas: ahí está el hueco real",
                    "Simplifica y usa analogías hasta que fluya",
                    "Si no lo puedes explicar simple, todavía no lo entiendes",
                ] },
            { tip: { icon: "🧠", text: "El truco de Feynman: el examen de verdad no es resolver el problema, es poder explicárselo a alguien que no sabe nada y que lo entienda." } },
        ],
        practice: [
            { title: "Aplica la hipótesis atómica", goal: "Explica con átomos por qué un charco se evapora.",
                steps: ["Piensa en los átomos del agua moviéndose", "¿Qué les pasa a los más rápidos en la superficie?"],
                solution: `Los átomos del agua se mueven a distintas velocidades.
Los más rápidos en la superficie escapan al aire (se evaporan).
Al irse los rápidos, queda el agua un poco más fría.
// Por eso sudar enfría: se van los átomos más energéticos.`, file: "respuesta.txt" },
            { title: "Técnica Feynman", goal: "Explica 'por qué el cielo es azul' en lenguaje simple.",
                steps: ["No uses jerga", "Usa una analogía", "3-4 frases máximo"],
                solution: `La luz del sol trae todos los colores mezclados.
Al chocar con el aire, el color azul se dispersa (rebota)
mucho más que los demás en todas direcciones.
// Por eso vemos azul por todo el cielo. (Dispersión de Rayleigh)`, file: "respuesta.txt" },
        ],
        quiz: [
            { q: "Según Feynman, ¿qué frase salvaría más conocimiento?", opts: ["E=mc²", "Todo está hecho de átomos en movimiento", "La Tierra gira", "F=ma"], correct: 1, fb: "La hipótesis atómica condensa una cantidad enorme de física." },
            { q: "¿Cuál es la prueba real de que entendiste algo (técnica Feynman)?", opts: ["Memorizar la fórmula", "Poder explicarlo simple a alguien que no sabe", "Resolver rápido", "Leerlo muchas veces"], correct: 1, fb: "Si no lo puedes explicar simple, aún no lo entiendes." },
            { q: "¿Qué les pasa a los átomos cuando algo se calienta?", opts: ["Se quedan quietos", "Se mueven más rápido", "Desaparecen", "Se hacen más grandes"], correct: 1, fb: "Más calor = más movimiento de los átomos." },
        ],
    },

    /* ===================== MECÁNICA ===================== */
    {
        id: "f_motion", mod: "Mecánica", icon: Gauge, mins: "25 min",
        title: "Movimiento: velocidad y aceleración",
        intro: "Antes de las fuerzas hay que describir el movimiento. Velocidad es qué tan rápido cambia la posición; aceleración, qué tan rápido cambia la velocidad.",
        theory: [
            { anim: "motion" },
            { p: "Velocidad = cambio de posición entre cambio de tiempo. Aceleración = cambio de velocidad entre cambio de tiempo. Si vas en línea recta y tu velocidad sube, estás acelerando." },
            { code: { file: "pizarra", code: `v = Δx / Δt      // velocidad = distancia / tiempo
a = Δv / Δt      // aceleración = cambio de velocidad / tiempo
// caída libre cerca de la Tierra:
g = 9.8 m/s²     // todo cae con esta aceleración (sin aire)
d = ½ · g · t²   // distancia caída en un tiempo t` } },
            { p: "Feynman insistía en el cálculo: la velocidad instantánea es la pendiente de la curva de posición. El cálculo es, literalmente, el lenguaje del cambio." },
            { tip: { icon: "📐", text: "Cuida siempre las unidades. Si mezclas km/h con m/s, el resultado no significa nada. 100 km/h ≈ 27.8 m/s." } },
        ],
        practice: [
            { title: "Aceleración de un coche", goal: "Un coche pasa de 0 a 100 km/h en 5 s. ¿Su aceleración?",
                steps: ["Convierte 100 km/h a m/s", "a = Δv / Δt"],
                solution: `100 km/h = 100 / 3.6 = 27.8 m/s
a = Δv / Δt = 27.8 / 5 = 5.56 m/s²
// Cada segundo gana 5.56 m/s de velocidad.`, file: "solucion.txt" },
            { title: "Caída libre", goal: "¿Cuánto cae un objeto en 3 segundos (sin aire)?",
                steps: ["Usa d = ½ g t²", "g = 9.8 m/s²"],
                solution: `d = ½ · g · t²
d = ½ · 9.8 · (3)²
d = ½ · 9.8 · 9 = 44.1 m
// En 3 s cae unos 44 metros.`, file: "solucion.txt" },
        ],
        quiz: [
            { q: "¿Qué es la aceleración?", opts: ["La posición", "Qué tan rápido cambia la velocidad", "La distancia total", "La masa"], correct: 1, fb: "Aceleración = cambio de velocidad / tiempo." },
            { q: "¿Con qué aceleración caen los objetos cerca de la Tierra (sin aire)?", opts: ["1 m/s²", "9.8 m/s²", "100 m/s²", "0"], correct: 1, fb: "g ≈ 9.8 m/s², igual para todos los objetos." },
            { q: "Una pluma y un martillo en el vacío, ¿cuál cae más rápido?", opts: ["El martillo", "La pluma", "Caen igual", "Ninguno cae"], correct: 2, fb: "Sin aire, todos caen con la misma g (lo probaron en la Luna)." },
        ],
    },
    {
        id: "f_newton", mod: "Mecánica", icon: Zap, mins: "30 min",
        title: "Las leyes de Newton: F = ma",
        intro: "Las tres leyes de Newton explican cómo las fuerzas cambian el movimiento. La segunda, F = ma, es el corazón de toda la mecánica.",
        theory: [
            { anim: "newton" },
            { p: "Primera ley (inercia): un objeto sigue como está —quieto o en movimiento recto— hasta que una fuerza lo cambie. Segunda ley: F = m·a, la fuerza es masa por aceleración. Tercera ley: a toda acción corresponde una reacción igual y opuesta." },
            { code: { file: "pizarra", code: `F = m · a            // fuerza = masa × aceleración
a = F / m            // despejando: a más masa, menos aceleración
W = m · g            // peso = masa × gravedad
// La fuerza NETA es la suma de todas las fuerzas.` } },
            { p: "Feynman subraya que la segunda ley no es solo una fórmula: define qué hace una fuerza. Si conoces las fuerzas sobre algo y su masa, conoces su futuro movimiento." },
            { tip: { icon: "⚖️", text: "Masa y peso no son lo mismo: la masa es cuánta materia hay (kg); el peso es la fuerza con que la gravedad te jala (N). En la Luna pesas menos, pero tu masa es igual." } },
        ],
        practice: [
            { title: "Calcula la aceleración", goal: "Empujas una caja de 10 kg con una fuerza de 50 N. ¿Aceleración?",
                steps: ["Usa a = F / m"],
                solution: `a = F / m = 50 N / 10 kg = 5 m/s²
// La caja gana 5 m/s de velocidad cada segundo.`, file: "solucion.txt" },
            { title: "Peso vs masa", goal: "¿Cuánto pesa una persona de 70 kg en la Tierra?",
                steps: ["Peso W = m · g", "g = 9.8 m/s²"],
                solution: `W = m · g = 70 · 9.8 = 686 N
// Su MASA es 70 kg en todas partes;
// su PESO sería distinto en la Luna (g menor).`, file: "solucion.txt" },
        ],
        quiz: [
            { q: "¿Qué dice la segunda ley de Newton?", opts: ["F = m/a", "F = m·a", "F = a/m", "F = m+a"], correct: 1, fb: "Fuerza = masa × aceleración." },
            { q: "Si aplicas la misma fuerza a una masa mayor, la aceleración…", opts: ["Aumenta", "Disminuye", "No cambia", "Se vuelve cero"], correct: 1, fb: "a = F/m: a más masa, menos aceleración." },
            { q: "Cuando empujas una pared, la pared…", opts: ["No hace nada", "Te empuja a ti con igual fuerza", "Se mueve", "Desaparece"], correct: 1, fb: "Tercera ley: acción y reacción iguales y opuestas." },
        ],
    },

    /* ===================== ENERGÍA ===================== */
    {
        id: "f_energy", mod: "Energía", icon: Activity, mins: "30 min",
        title: "Conservación de la energía",
        intro: "Hay un número en la naturaleza que nunca cambia, pase lo que pase: la energía total. Feynman lo explicó con los bloques de un niño travieso.",
        theory: [
            { anim: "pendulum" },
            { p: "Feynman imaginó a un niño con 28 bloques. La mamá cuenta 28 cada noche. Un día faltan: pero uno está en una caja (que pesa de más), otros en el agua sucia (que subió de nivel). Si sumas TODO con cuidado, siempre hay 28. La energía es así: cambia de forma, se esconde, pero el total se conserva." },
            { h: "Por qué es tan profundo" },
            { p: "Lo curioso es que no sabemos 'qué es' la energía: es una cantidad abstracta. Solo sabemos que, si la calculas bien en todas sus formas (movimiento, altura, calor, etc.), el número total nunca cambia." },
            { tip: { icon: "🧾", text: "Pensar en energía es contabilidad: cuando algo 'pierde' energía, busca a dónde se fue (calor por fricción, sonido, deformación). No se destruye, se transfiere." } },
        ],
        practice: [
            { title: "El péndulo", goal: "Un péndulo se suelta desde una altura h. ¿Su velocidad en el punto más bajo?",
                steps: ["Toda la PE arriba se vuelve KE abajo", "mgh = ½mv² → despeja v"],
                solution: `Arriba: energía potencial = m·g·h
Abajo: energía cinética = ½·m·v²
Se conservan iguales:  m·g·h = ½·m·v²
=> v = √(2·g·h)
// La masa se cancela: ¡no importa qué tan pesado sea!`, file: "solucion.txt" },
            { title: "Contabilidad de energía", goal: "Una pelota cae y rebota cada vez más bajo. ¿A dónde se fue la energía?",
                steps: ["Identifica las formas de energía", "¿Qué aparece en cada rebote?"],
                solution: `Cada rebote es más bajo porque parte de la energía
se convierte en CALOR y SONIDO al impactar
(y un poco al rozar el aire).
// La energía no se perdió: se transformó y se dispersó.`, file: "respuesta.txt" },
        ],
        quiz: [
            { q: "En la analogía de Feynman, ¿qué representan los 28 bloques?", opts: ["Átomos", "La energía total, que siempre se conserva", "Planetas", "Fuerzas"], correct: 1, fb: "Aunque cambien de lugar/forma, el total es constante." },
            { q: "¿Sabemos exactamente 'qué es' la energía?", opts: ["Sí, es una sustancia", "No: es una cantidad abstracta que se conserva", "Es calor", "Es masa"], correct: 1, fb: "Solo sabemos que el total nunca cambia." },
            { q: "Cuando frenas una bici, la energía de movimiento se convierte sobre todo en…", opts: ["Luz", "Calor (en los frenos)", "Masa", "Nada, se destruye"], correct: 1, fb: "La fricción de los frenos la convierte en calor." },
        ],
    },
    {
        id: "f_kepe", mod: "Energía", icon: Flame, mins: "25 min",
        title: "Energía cinética y potencial",
        intro: "Las dos formas mecánicas más importantes: la cinética (del movimiento) y la potencial (de la posición o altura). Constantemente se transforman una en otra.",
        theory: [
            { anim: "energyhill" },
            { code: { file: "pizarra", code: `KE = ½ · m · v²      // cinética: depende de la velocidad
PE = m · g · h       // potencial (gravitatoria): depende de la altura
W  = F · d           // trabajo = fuerza × distancia
// Sin fricción:  KE + PE = constante` } },
            { p: "Al subir, ganas potencial y pierdes cinética (frenas). Al bajar, al revés. El trabajo es cómo se transfiere energía: una fuerza actuando a lo largo de una distancia." },
            { tip: { icon: "🎢", text: "Una montaña rusa no puede tener una colina más alta que la primera: no le alcanzaría la energía. Toda su 'gasolina' es la altura inicial." } },
        ],
        practice: [
            { title: "Energía cinética", goal: "¿Cuánta energía cinética tiene una masa de 2 kg que va a 3 m/s?",
                steps: ["KE = ½ m v²"],
                solution: `KE = ½ · m · v² = ½ · 2 · (3)²
KE = ½ · 2 · 9 = 9 Joules`, file: "solucion.txt" },
            { title: "Montaña rusa", goal: "Un carro parte del reposo desde 20 m de alto. ¿Su velocidad abajo (sin fricción)?",
                steps: ["Toda la PE se vuelve KE", "v = √(2gh)"],
                solution: `m·g·h = ½·m·v²   =>   v = √(2·g·h)
v = √(2 · 9.8 · 20) = √392 ≈ 19.8 m/s
// ~71 km/h, sin importar la masa del carro.`, file: "solucion.txt" },
        ],
        quiz: [
            { q: "¿De qué depende la energía cinética?", opts: ["De la altura", "De la velocidad (½mv²)", "Del color", "Del tiempo"], correct: 1, fb: "KE = ½mv²: crece con el cuadrado de la velocidad." },
            { q: "¿De qué depende la energía potencial gravitatoria?", opts: ["De la altura (mgh)", "De la velocidad", "De la temperatura", "De nada"], correct: 0, fb: "PE = mgh: más alto, más potencial." },
            { q: "Si duplicas la velocidad, la energía cinética…", opts: ["Se duplica", "Se cuadruplica", "No cambia", "Se reduce"], correct: 1, fb: "Va con v²: doble velocidad = cuádruple energía." },
        ],
    },

    /* ===================== LAS LEYES ===================== */
    {
        id: "f_grav", mod: "Las leyes", icon: Orbit, mins: "30 min",
        title: "Gravitación universal",
        intro: "Newton se dio cuenta de que la misma fuerza que hace caer una manzana mantiene a la Luna en órbita. Una sola ley para el cielo y la Tierra.",
        theory: [
            { anim: "orbit" },
            { p: "Toda masa atrae a toda otra masa. La fuerza crece con las masas y cae con el cuadrado de la distancia: si te alejas al doble, la fuerza baja a la cuarta parte." },
            { code: { file: "pizarra", code: `F = G · m₁ · m₂ / r²     // ley de gravitación universal
// G = constante gravitatoria (muy pequeña)
// r = distancia entre los centros
// 'inverso del cuadrado': doble distancia -> 1/4 de fuerza` } },
            { p: "Feynman explicaba la órbita así: la Luna SÍ está cayendo hacia la Tierra todo el tiempo, pero va tan rápido de lado que la Tierra 'se curva' debajo de ella. Cae eternamente sin chocar. Eso es una órbita." },
            { tip: { icon: "🪐", text: "La misma ecuación predice la caída de una manzana y el movimiento de los planetas. Esa unificación —cielo y tierra con una sola ley— fue revolucionaria." } },
        ],
        practice: [
            { title: "Inverso del cuadrado", goal: "Si la distancia entre dos cuerpos se triplica, ¿cómo cambia la fuerza?",
                steps: ["F ∝ 1/r²", "Sustituye r → 3r"],
                solution: `F ∝ 1 / r²
Con 3r:  1 / (3r)² = 1 / 9r²
=> la fuerza se vuelve 1/9 de la original.
// Triplicar la distancia = nueve veces menos fuerza.`, file: "solucion.txt" },
            { title: "Por qué orbita sin caer", goal: "Explica con palabras por qué la Luna no choca con la Tierra.",
                steps: ["¿Hacia dónde la jala la gravedad?", "¿Qué hace su velocidad lateral?"],
                solution: `La gravedad jala a la Luna hacia la Tierra (cae).
Pero la Luna se mueve muy rápido DE LADO.
Mientras cae, la Tierra se curva debajo de ella.
// Resultado: cae para siempre sin acercarse = órbita.`, file: "respuesta.txt" },
        ],
        quiz: [
            { q: "La fuerza de gravedad entre dos cuerpos, ¿cómo cambia con la distancia?", opts: ["Crece con r", "Cae con r²", "No cambia", "Cae con r"], correct: 1, fb: "Inverso del cuadrado: F ∝ 1/r²." },
            { q: "Según Newton, la fuerza que hace caer la manzana y la que mueve la Luna…", opts: ["Son distintas", "Son la misma ley", "No existen", "Solo aplica en la Tierra"], correct: 1, fb: "La gravitación es universal: una sola ley." },
            { q: "¿Por qué la Luna no choca con la Tierra?", opts: ["No hay gravedad allá", "Cae, pero su velocidad lateral la mantiene en órbita", "La empuja el Sol", "Está pegada"], correct: 1, fb: "Cae eternamente mientras la Tierra se curva debajo." },
        ],
    },
    {
        id: "f_sym", mod: "Las leyes", icon: Sparkles, mins: "30 min",
        title: "El carácter de la ley física: simetría y conservación",
        intro: "En sus charlas 'El carácter de la ley física', Feynman mostró una idea bellísima: detrás de cada cantidad que se conserva hay una simetría de la naturaleza.",
        theory: [
            { anim: "symmetry" },
            { p: "Una simetría es algo que NO cambia bajo una transformación. Si haces un experimento hoy o mañana y da igual, hay una simetría en el tiempo. Si lo haces aquí o un metro más allá y da igual, hay simetría en el espacio." },
            { h: "Cada simetría → una conservación" },
            { p: "Este es el resultado profundo (teorema de Noether): la simetría en el tiempo implica que se conserva la energía; la simetría en el espacio, el momento; la simetría rotacional, el momento angular. La belleza no es decoración: es estructura." },
            { tip: { icon: "✨", text: "Regla de oro del físico moderno: cuando veas que algo se conserva, pregunta '¿qué simetría hay detrás?'. Casi siempre encuentras una." } },
        ],
        practice: [
            { title: "Empareja simetría y conservación", goal: "¿Qué se conserva si 'las leyes son iguales hoy que mañana'?",
                steps: ["Piensa: simetría en el tiempo → ¿qué cantidad?"],
                solution: `Simetría en el TIEMPO  ->  se conserva la ENERGÍA
Simetría en el ESPACIO ->  se conserva el MOMENTO
Simetría ROTACIONAL    ->  se conserva el MOMENTO ANGULAR
// (Teorema de Noether)`, file: "respuesta.txt" },
            { title: "Conservación del momento", goal: "Dos patinadores en hielo se empujan. ¿Qué se conserva?",
                steps: ["Momento p = m·v", "El total antes = el total después"],
                solution: `El momento total se conserva (p = m·v).
Antes del empujón: ambos quietos, momento total = 0.
Después: uno va a la izquierda, otro a la derecha,
de modo que los momentos se cancelan: total sigue = 0.
// Por eso retroceden en direcciones opuestas.`, file: "respuesta.txt" },
        ],
        quiz: [
            { q: "¿Qué es una simetría en física?", opts: ["Una figura bonita", "Algo que no cambia bajo una transformación", "Una fuerza", "Un tipo de energía"], correct: 1, fb: "Simetría = invariancia bajo alguna transformación." },
            { q: "La simetría en el tiempo implica la conservación de…", opts: ["El momento", "La energía", "La carga", "La masa"], correct: 1, fb: "Tiempo → energía (teorema de Noether)." },
            { q: "Si algo se conserva, un físico moderno busca…", opts: ["Una fórmula nueva", "La simetría detrás", "Más fuerza", "Un error"], correct: 1, fb: "Detrás de cada conservación suele haber una simetría." },
        ],
    },

    /* ===================== LO PROFUNDO ===================== */
    {
        id: "f_action", mod: "Lo profundo", icon: Route, mins: "35 min",
        title: "El principio de mínima acción",
        intro: "Hay otra forma de ver TODA la física, distinta a F=ma y que a Feynman le fascinó desde niño: la naturaleza elige el camino que minimiza una cantidad llamada 'acción'.",
        theory: [
            { anim: "leastaction" },
            { p: "En vez de calcular fuerzas paso a paso, puedes preguntar: de todos los caminos posibles entre el punto A y el B, ¿cuál toma el objeto? Resulta que toma el que hace mínima una cantidad llamada acción. Y da exactamente el mismo resultado que Newton." },
            { p: "La luz hace algo parecido (principio de Fermat): entre dos puntos toma el camino que recorre en el menor tiempo. Por eso se 'dobla' al pasar del aire al agua: ajusta el camino para tardar menos." },
            { p: "Que dos formulaciones tan distintas —fuerzas locales vs. minimizar algo global— den la misma física es una de las cosas más hermosas y misteriosas de la naturaleza." },
            { tip: { icon: "🔦", text: "Misma física, otra ventana. Y no es casualidad: esta forma 'de los caminos' es justo la que conecta con la mecánica cuántica de la siguiente lección." } },
        ],
        practice: [
            { title: "Por qué la luz se refracta", goal: "Explica por qué la luz cambia de dirección al entrar al agua.",
                steps: ["La luz va más lento en el agua", "Busca el camino de MENOR tiempo, no de menor distancia"],
                solution: `La luz viaja más lento en el agua que en el aire.
Para tardar lo MENOS posible, le conviene recorrer
más tramo en el aire (rápido) y menos en el agua (lento).
Por eso 'quiebra' su dirección al entrar.
// Principio de Fermat: camino de tiempo mínimo.`, file: "respuesta.txt" },
            { title: "Dos ventanas, misma física", goal: "Explica por qué 'mínima acción' es tan potente como F=ma.",
                steps: ["¿Qué calcula cada enfoque?", "¿Dan el mismo resultado?"],
                solution: `F = ma calcula el movimiento paso a paso (local).
Mínima acción mira el camino COMPLETO y elige el óptimo (global).
Ambos predicen exactamente la misma trayectoria.
// Tener dos vistas del mismo fenómeno da más comprensión.`, file: "respuesta.txt" },
        ],
        quiz: [
            { q: "Según el principio de mínima acción, la naturaleza toma el camino que…", opts: ["Es más largo", "Minimiza la 'acción'", "Es aleatorio", "Tiene más fuerza"], correct: 1, fb: "De todos los caminos posibles, el de acción mínima." },
            { q: "El principio de Fermat dice que la luz toma el camino de…", opts: ["Menor distancia", "Menor tiempo", "Mayor brillo", "Menor energía"], correct: 1, fb: "Tiempo mínimo: por eso se refracta." },
            { q: "Mínima acción y F=ma…", opts: ["Se contradicen", "Dan la misma física, vista distinto", "Son de temas distintos", "Solo una es correcta"], correct: 1, fb: "Son formulaciones equivalentes de la mecánica." },
        ],
    },
    {
        id: "f_qed", mod: "Lo profundo", icon: Inf, mins: "35 min",
        title: "QED: la suma de todos los caminos",
        intro: "El aporte estrella de Feynman, por el que ganó el Nobel. En el mundo cuántico, una partícula no toma un camino: toma todos a la vez.",
        theory: [
            { anim: "paths" },
            { p: "En mecánica cuántica, para ir de A a B una partícula no elige una trayectoria: explora TODAS al mismo tiempo. A cada camino se le asigna una pequeña flecha (una amplitud) que gira según ese camino." },
            { p: "Para saber qué pasa, sumas todas las flechas punta con punta. Los caminos cercanos al de mínima acción tienen flechas casi alineadas y se refuerzan; los caminos 'locos' apuntan en direcciones revueltas y se cancelan entre sí. Por eso, a gran escala, vemos solo el camino clásico." },
            { p: "Con esta idea Feynman construyó la electrodinámica cuántica (QED): la teoría de cómo interactúan luz y materia, y la más precisa jamás comprobada. Aquí conecta todo: la mínima acción es por qué los caminos cercanos a ella ganan." },
            { tip: { icon: "♾️", text: "El mundo clásico que ves es el promedio de infinitas posibilidades cuánticas. Lo 'normal' emerge de que casi todo lo raro se cancela." } },
        ],
        practice: [
            { title: "Por qué la luz parece ir recta", goal: "Si la luz toma todos los caminos, ¿por qué la vemos viajar derecho?",
                steps: ["Piensa en las flechas (fases)", "¿Cuáles se refuerzan?"],
                solution: `Cada camino aporta una flecha que gira.
Los caminos cercanos al recto tienen flechas casi iguales:
se SUMAN y refuerzan.
Los caminos muy curvos tienen flechas revueltas:
se CANCELAN entre sí.
// Lo que sobrevive es el camino recto = lo que vemos.`, file: "respuesta.txt" },
            { title: "Técnica Feynman: explica QED", goal: "Explica la suma de caminos a un niño en 3 frases.",
                steps: ["Sin jerga", "Una imagen simple"],
                solution: `1) La luz prueba todos los caminos posibles a la vez.
2) Cada camino es como una flechita que gira.
3) Al juntarlas, casi todas se cancelan y solo
   queda el camino que vemos.
// Eso es, en pequeñito, la idea de QED.`, file: "respuesta.txt" },
        ],
        quiz: [
            { q: "En la suma de caminos de Feynman, una partícula cuántica…", opts: ["Toma un solo camino", "Toma todos los caminos a la vez", "No se mueve", "Elige el más largo"], correct: 1, fb: "Explora todas las trayectorias; se suman sus amplitudes." },
            { q: "¿Por qué emerge el camino clásico?", opts: ["Es el único permitido", "Los caminos cercanos a la mínima acción se refuerzan y el resto se cancela", "Por la gravedad", "Por azar"], correct: 1, fb: "Las flechas cercanas al óptimo se alinean y dominan." },
            { q: "¿Qué teoría formuló Feynman con esta idea?", opts: ["La relatividad", "La electrodinámica cuántica (QED)", "La gravedad", "La termodinámica"], correct: 1, fb: "QED, la teoría más precisa jamás comprobada." },
        ],
    },
];

const MODS = [
    { name: "Cómo pensar", sub: "El método y la hipótesis atómica", icon: Atom },
    { name: "Mecánica", sub: "Movimiento y las leyes de Newton", icon: Gauge },
    { name: "Energía", sub: "Conservación, cinética y potencial", icon: Activity },
    { name: "Las leyes", sub: "Gravedad, simetría y conservación", icon: Orbit },
    { name: "Lo profundo", sub: "Mínima acción y QED", icon: Inf },
];

const RANKS = [
    { min: 0, name: "Curioso" },
    { min: 300, name: "Estudiante" },
    { min: 700, name: "Físico aficionado" },
    { min: 1200, name: "Pensador" },
    { min: 1800, name: "Al nivel de Feynman" },
];
const rankFor = (xp) => RANKS.filter((r) => xp >= r.min).pop();
const loadSave = () => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } };

/* ---------- componentes de UI ---------- */
function CodeBlock({ code, file }) {
    return (
        <div className="ph-term">
            <div className="ph-term-h">
                <span className="d r" /><span className="d y" /><span className="d g" />
                {file && <span className="ph-file">{file}</span>}
            </div>
            <pre>{code.split("\n").map((line, i) => {
                const ci = line.indexOf("//");
                if (ci >= 0) return <div key={i}><span>{line.slice(0, ci)}</span><span className="cmt">{line.slice(ci)}</span></div>;
                return <div key={i}>{line || "\u00A0"}</div>;
            })}</pre>
        </div>
    );
}

const ANIM_MAP = {
    atoms: AnimAtoms, motion: AnimMotion, newton: AnimNewton, pendulum: AnimPendulum,
    energyhill: AnimEnergyHill, orbit: AnimOrbit, symmetry: AnimSymmetry,
    leastaction: AnimLeastAction, paths: AnimPaths,
};

function Theory({ blocks }) {
    return blocks.map((b, i) => {
        if (b.p) return <p key={i} className="ph-p">{b.p}</p>;
        if (b.h) return <h3 key={i} className="ph-h3">{b.h}</h3>;
        if (b.code) return <CodeBlock key={i} {...b.code} />;
        if (b.anim) { const C = ANIM_MAP[b.anim]; return C ? <C key={i} /> : null; }
        if (b.tip) return <div key={i} className="ph-tip"><span className="ph-tip-i">{b.tip.icon}</span><span>{b.tip.text}</span></div>;
        if (b.list) return <ul key={i} className="ph-list">{b.list.map((x, j) => <li key={j}>{x}</li>)}</ul>;
        return null;
    });
}

function Exercise({ ex, n }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="ph-ex">
            <div className="ph-ex-top"><span className="ph-ex-n">{n}</span><strong>{ex.title}</strong></div>
            <p className="ph-ex-goal">{ex.goal}</p>
            {ex.steps && <ul className="ph-steps">{ex.steps.map((s, i) => <li key={i}>{s}</li>)}</ul>}
            <button className="ph-reveal" onClick={() => setOpen((o) => !o)}>
                {open ? <EyeOff size={13} /> : <Eye size={13} />} {open ? "Ocultar solución" : "Ver solución"}
            </button>
            {open && <CodeBlock code={ex.solution} file={ex.file || "solucion.txt"} />}
        </div>
    );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
.ph{ min-height:100vh; width:100%; font-family:'Inter',system-ui,sans-serif; color:#e9e7d6;
  background:radial-gradient(900px 520px at 80% -10%, rgba(240,193,75,.10), transparent 60%), #11211a; }
.ph *{ box-sizing:border-box; }
.ph-wrap{ max-width:880px; margin:0 auto; padding:38px 22px 90px; }
.ph-head{ text-align:center; margin-bottom:8px; }
.ph-kick{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:4px; color:#6f8478; }
.ph-title{ font-size:42px; font-weight:800; letter-spacing:-1px; margin:6px 0; }
.ph-title b{ color:#f0c14b; }
.ph-sub{ color:#9fb0a3; font-size:15px; max-width:580px; margin:0 auto; }
.ph-rank{ display:flex; gap:14px; align-items:center; justify-content:center; margin:22px auto; flex-wrap:wrap; }
.ph-rbox{ display:flex; align-items:center; gap:10px; border:1px solid #25402f; background:#16291f; border-radius:12px; padding:10px 15px; }
.ph-rl{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:2px; color:#6f8478; }
.ph-rn{ font-size:16px; font-weight:700; }
.ph-bar2{ width:200px; height:8px; border-radius:99px; background:#16291f; border:1px solid #25402f; overflow:hidden; }
.ph-bar2 i{ display:block; height:100%; background:linear-gradient(90deg,#f0c14b,#ffe39a); transition:width .6s; }
.ph-modh{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:#f0c14b;
  margin:30px 0 12px; display:flex; align-items:center; gap:9px; text-transform:uppercase; }
.ph-modh .ms{ color:#6f8478; letter-spacing:0; text-transform:none; font-size:12px; }
.ph-list-lessons{ display:flex; flex-direction:column; gap:10px; }
.ph-lcard{ display:flex; align-items:center; gap:15px; cursor:pointer; border:1px solid #1c3326; border-radius:14px;
  padding:15px 17px; background:linear-gradient(180deg,#16291f,#122019); transition:.16s; text-align:left; width:100%; color:inherit; font-family:inherit; }
.ph-lcard:hover{ transform:translateX(4px); border-color:#f0c14b; }
.ph-lico{ width:42px; height:42px; border-radius:11px; flex:none; display:grid; place-items:center;
  background:rgba(240,193,75,.1); border:1px solid #25402f; color:#f0c14b; }
.ph-lcard.done .ph-lico{ background:rgba(120,200,120,.14); border-color:#7ec87e; color:#7ec87e; }
.ph-lm{ flex:1; min-width:0; }
.ph-lt{ font-size:15.5px; font-weight:700; }
.ph-li{ font-size:13px; color:#9fb0a3; margin-top:2px; }
.ph-lmeta{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#6f8478; flex:none; }
.ph-back{ display:inline-flex; align-items:center; gap:6px; background:none; border:none; color:#9fb0a3;
  font-family:'JetBrains Mono',monospace; font-size:12px; cursor:pointer; padding:6px 0; margin-bottom:6px; }
.ph-back:hover{ color:#f0c14b; }
.ph-lhead h2{ font-size:29px; font-weight:800; letter-spacing:-.5px; margin:4px 0 8px; }
.ph-badge{ display:inline-block; font-family:'JetBrains Mono',monospace; font-size:11px; color:#f0c14b;
  background:rgba(240,193,75,.1); border:1px solid #25402f; padding:3px 10px; border-radius:99px; }
.ph-intro{ background:#16291f; border-left:4px solid #f0c14b; border-radius:4px 12px 12px 4px;
  padding:15px 18px; margin:16px 0; color:#d7d3bf; font-size:15px; line-height:1.6; }
.ph-secl{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:#6f8478;
  margin:26px 0 10px; display:flex; align-items:center; gap:8px; text-transform:uppercase; }
.ph-p{ font-size:15px; line-height:1.7; color:#cfd0bd; margin:12px 0; }
.ph-h3{ font-size:17px; font-weight:700; margin:22px 0 4px; color:#e9e7d6; }
.ph-term{ background:#0c1812; border:1px solid #1c3326; border-radius:12px; overflow:hidden; margin:14px 0; }
.ph-term-h{ background:rgba(255,255,255,.03); padding:9px 13px; border-bottom:1px solid #1c3326; display:flex; gap:7px; align-items:center; }
.ph-term-h .d{ width:11px; height:11px; border-radius:50%; } .d.r{ background:#ff5f56; } .d.y{ background:#ffbd2e; } .d.g{ background:#27c93f; }
.ph-file{ margin-left:8px; font-family:'JetBrains Mono',monospace; font-size:11px; color:#6f8478; }
.ph-term pre{ margin:0; padding:16px; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.6;
  color:#dfe0c8; overflow-x:auto; } .ph-term pre .cmt{ color:#6f8478; font-style:italic; }
.ph-tip{ background:rgba(240,193,75,.06); border-left:4px solid #f0c14b; border-radius:4px 10px 10px 4px;
  padding:13px 16px; margin:16px 0; display:flex; gap:12px; align-items:flex-start; font-size:14px; line-height:1.55; color:#cfd0bd; }
.ph-tip-i{ font-size:18px; flex:none; }
.ph-list{ margin:12px 0; padding-left:4px; list-style:none; display:flex; flex-direction:column; gap:7px; }
.ph-list li{ font-size:14.5px; color:#cfd0bd; padding-left:18px; position:relative; line-height:1.5; }
.ph-list li::before{ content:'▸'; position:absolute; left:0; color:#f0c14b; }
.ph-ex{ background:#16291f; border:1px solid #1c3326; border-radius:14px; padding:18px; margin:12px 0; }
.ph-ex-top{ display:flex; align-items:center; gap:10px; }
.ph-ex-n{ background:#f0c14b; color:#11211a; width:24px; height:24px; border-radius:50%; display:grid;
  place-items:center; font-size:13px; font-weight:800; flex:none; }
.ph-ex-goal{ font-size:14.5px; color:#cfd0bd; margin:10px 0; line-height:1.55; }
.ph-steps{ margin:8px 0; padding-left:18px; } .ph-steps li{ font-size:13.5px; color:#9fb0a3; margin:4px 0; }
.ph-reveal{ display:inline-flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:12px;
  color:#f0c14b; background:rgba(240,193,75,.08); border:1px solid #25402f; border-radius:8px; padding:7px 13px; cursor:pointer; margin-top:6px; }
.ph-reveal:hover{ background:rgba(240,193,75,.15); }
.ph-quiz{ border:1px solid #25402f; border-radius:14px; padding:18px; background:#16291f; margin:12px 0; }
.ph-q{ font-size:15.5px; font-weight:600; margin-bottom:11px; }
.ph-opt{ display:block; width:100%; text-align:left; background:#122019; border:1px solid #1c3326; color:#e9e7d6;
  padding:11px 14px; border-radius:10px; margin:6px 0; font-size:14px; cursor:pointer; transition:.14s; font-family:inherit; }
.ph-opt:hover{ border-color:#f0c14b; }
.ph-opt.ok{ background:rgba(120,200,120,.14); border-color:#7ec87e; color:#cdeccd; }
.ph-opt.no{ background:rgba(255,95,86,.12); border-color:#ff5f56; color:#ffb3ae; }
.ph-fb{ font-size:13.5px; margin-top:9px; line-height:1.5; }
.ph-nav{ display:flex; justify-content:space-between; gap:10px; margin-top:26px; }
.ph-btn{ font-family:'JetBrains Mono',monospace; font-size:13px; padding:11px 17px; border-radius:10px; cursor:pointer;
  border:1px solid #25402f; background:#16291f; color:#e9e7d6; display:inline-flex; align-items:center; gap:7px; }
.ph-btn:hover:not(:disabled){ border-color:#f0c14b; } .ph-btn:disabled{ opacity:.3; cursor:default; }
.ph-btn.main{ background:#f0c14b; color:#11211a; border-color:#f0c14b; font-weight:700; }
.ph-foot{ text-align:center; margin-top:34px; }
.ph-reset{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#ff7b72; background:transparent;
  border:1px solid rgba(255,123,114,.3); border-radius:8px; padding:8px 14px; cursor:pointer; }
.ph-reset:hover{ background:rgba(255,123,114,.1); }
.ph-done-tag{ display:inline-flex; align-items:center; gap:6px; color:#7ec87e; font-family:'JetBrains Mono',monospace; font-size:12px; }
@media(max-width:560px){ .ph-title{ font-size:32px; } .ph-lhead h2{ font-size:23px; } }

/* ===== Animaciones ===== */
.ph-anim{ background:#122019; border:1px solid #1c3326; border-radius:14px; padding:18px; margin:16px 0; }
.ph-anim-cap{ font-size:13px; color:#9fb0a3; line-height:1.55; margin:14px 0 2px; text-align:center; }
.ph-anim-cap code{ background:#16291f; padding:1px 6px; border-radius:5px; font-family:'JetBrains Mono',monospace; font-size:12px; color:#ffe39a; }
.ph-svg{ width:100%; max-width:360px; height:auto; display:block; margin:0 auto; }

/* atoms */
.ph-atombox{ position:relative; width:100%; max-width:300px; height:150px; margin:0 auto; border:1.5px solid #25402f; border-radius:10px; background:#0c1812; overflow:hidden; }
.ph-atom{ position:absolute; width:11px; height:11px; border-radius:50%; background:#f0c14b; transform:translate(-50%,-50%); box-shadow:0 0 7px rgba(240,193,75,.5); }

/* motion / newton */
.ph-newton{ display:flex; flex-direction:column; gap:14px; max-width:340px; margin:0 auto; }
.ph-newton-row{ display:flex; align-items:center; gap:10px; }
.ph-newton-lbl{ font-family:'JetBrains Mono',monospace; font-size:10px; color:#6f8478; width:64px; flex:none; }
.ph-newton-track{ position:relative; flex:1; height:34px; border-bottom:1.5px solid #25402f; }
.ph-newton-force{ position:absolute; left:-2px; top:6px; color:#6fb1c9; font-size:16px; font-weight:700; }
.ph-newton-box{ position:absolute; top:4px; display:grid; place-items:center; color:#11211a; font-weight:800; border-radius:5px; transform:translateX(-50%); }
.ph-newton-box.sm{ width:22px; height:22px; background:#f0c14b; font-size:12px; }
.ph-newton-box.lg{ width:30px; height:30px; background:#f0c14b; font-size:14px; }

/* bars (energy) */
.ph-bars{ display:flex; flex-direction:column; gap:8px; max-width:320px; margin:10px auto 0; }
.ph-bar{ display:flex; align-items:center; gap:10px; }
.ph-bar span{ font-family:'JetBrains Mono',monospace; font-size:10.5px; color:#9fb0a3; width:110px; flex:none; text-align:right; }
.ph-bar-track{ flex:1; height:12px; border-radius:99px; background:#0c1812; border:1px solid #25402f; overflow:hidden; }
.ph-bar-track i{ display:block; height:100%; border-radius:99px; transition:width .1s linear; }

/* symmetry */
.ph-sym{ display:flex; flex-direction:column; gap:8px; }
.ph-sym-row{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:9px 12px; border-radius:10px;
  border:1px solid #1c3326; background:#0c1812; opacity:.5; transition:all .35s; }
.ph-sym-row.on{ opacity:1; border-color:#f0c14b; background:rgba(240,193,75,.07); }
.ph-sym-s{ font-size:12.5px; color:#cfd0bd; flex:1; min-width:140px; }
.ph-sym-arrow{ color:#6f8478; }
.ph-sym-c{ font-family:'JetBrains Mono',monospace; font-size:11.5px; color:#ffe39a; }

/* phasors */
.ph-phasors{ display:flex; align-items:center; justify-content:center; gap:2px; flex-wrap:wrap; }
.ph-phasor{ width:42px; height:42px; }
`;

export default function App() {
    const saved = loadSave();
    const [open, setOpen] = useState(null);
    const [read, setRead] = useState(saved.read || {});
    const [quiz, setQuiz] = useState(saved.quiz || {});

    useEffect(() => {
        try { localStorage.setItem(SAVE_KEY, JSON.stringify({ read, quiz })); } catch {}
    }, [read, quiz]);

    const quizPassed = (les) => {
        const a = quiz[les.id]; if (!a) return false;
        return les.quiz.every((q, i) => a[i] === q.correct);
    };
    const isDone = (les) => read[les.id] && quizPassed(les);
    const completas = L.filter(isDone).length;
    const xp = completas * 100 + L.reduce((s, les) => s + ((quiz[les.id] || []).filter((a, i) => a === les.quiz[i]?.correct).length) * 10, 0);
    const rank = rankFor(xp);
    const next = RANKS.find((r) => xp < r.min);
    const pct = next ? Math.min(100, ((xp - rank.min) / (next.min - rank.min)) * 100) : 100;

    const openLesson = (idx) => {
        setOpen(idx);
        setRead((r) => ({ ...r, [L[idx].id]: true }));
        window.scrollTo(0, 0);
    };

    if (open != null) {
        const les = L[open];
        const answers = quiz[les.id] || [];
        const answer = (qi, oi) => {
            setQuiz((prev) => {
                const cur = [...(prev[les.id] || [])];
                if (cur[qi] != null) return prev;
                cur[qi] = oi;
                return { ...prev, [les.id]: cur };
            });
        };
        return (
            <div className="ph">
                <style>{CSS}</style>
                <div className="ph-wrap">
                    <button className="ph-back" onClick={() => setOpen(null)}><ChevronLeft size={15} /> TODAS LAS LECCIONES</button>
                    <div className="ph-lhead">
                        <span className="ph-badge">{les.mod} · {les.mins}</span>
                        <h2>{les.title}</h2>
                    </div>
                    <div className="ph-intro">{les.intro}</div>

                    <div className="ph-secl"><BookOpen size={13} /> TEORÍA</div>
                    <Theory blocks={les.theory} />

                    <div className="ph-secl"><Play size={13} /> PRÁCTICA</div>
                    {les.practice.map((ex, i) => <Exercise key={i} ex={ex} n={i + 1} />)}

                    <div className="ph-secl"><Award size={13} /> QUIZ</div>
                    {les.quiz.map((q, qi) => {
                        const picked = answers[qi];
                        const done = picked != null;
                        return (
                            <div className="ph-quiz" key={qi}>
                                <div className="ph-q">{q.q}</div>
                                {q.opts.map((o, oi) => {
                                    let cls = "ph-opt";
                                    if (done) { if (oi === q.correct) cls += " ok"; else if (oi === picked) cls += " no"; }
                                    return <button key={oi} className={cls} onClick={() => answer(qi, oi)}>{o}</button>;
                                })}
                                {done && (
                                    <div className="ph-fb" style={{ color: picked === q.correct ? "#7ec87e" : "#ff7b72" }}>
                                        {picked === q.correct ? "✓ " : "✗ "}{q.fb}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {isDone(les) && (
                        <div style={{ textAlign: "center", marginTop: 18 }}>
                            <span className="ph-done-tag"><Check size={15} /> ¡Lección completada! +100 XP</span>
                        </div>
                    )}

                    <div className="ph-nav">
                        <button className="ph-btn" disabled={open === 0} onClick={() => openLesson(open - 1)}><ChevronLeft size={15} /> Anterior</button>
                        <button className="ph-btn main" disabled={open === L.length - 1} onClick={() => openLesson(open + 1)}>Siguiente <ChevronRight size={15} /></button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ph">
            <style>{CSS}</style>
            <div className="ph-wrap">
                <div className="ph-head">
                    <div className="ph-kick">// EVOLUTIVE · FÍSICA</div>
                    <h1 className="ph-title">FÍSICA CON <b>FEYNMAN</b></h1>
                    <p className="ph-sub">De noob a pro: de la hipótesis atómica y las leyes de Newton a la mínima acción y la suma de caminos. Teoría con animaciones, problemas resueltos y quiz por lección.</p>
                </div>

                <div className="ph-rank">
                    <div className="ph-rbox">
                        <Atom size={20} color="#f0c14b" />
                        <div><div className="ph-rl">RANGO</div><div className="ph-rn">{rank.name}</div></div>
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6f8478", marginBottom: 5 }}>
                            <span>{xp} XP · {completas}/{L.length} lecciones</span>
                            <span>{next ? `→ ${next.name}` : "MÁX"}</span>
                        </div>
                        <div className="ph-bar2"><i style={{ width: pct + "%" }} /></div>
                    </div>
                </div>

                {MODS.map((m) => {
                    const lessons = L.map((l, i) => ({ l, i })).filter(({ l }) => l.mod === m.name);
                    return (
                        <div key={m.name}>
                            <div className="ph-modh"><m.icon size={14} /> {m.name} <span className="ms">— {m.sub}</span></div>
                            <div className="ph-list-lessons">
                                {lessons.map(({ l, i }) => {
                                    const done = isDone(l);
                                    const Ico = l.icon;
                                    return (
                                        <button key={l.id} className={`ph-lcard ${done ? "done" : ""}`} onClick={() => openLesson(i)}>
                                            <div className="ph-lico">{done ? <Check size={20} /> : <Ico size={20} />}</div>
                                            <div className="ph-lm">
                                                <div className="ph-lt">{l.title}</div>
                                                <div className="ph-li">{l.intro.slice(0, 72)}…</div>
                                            </div>
                                            <div className="ph-lmeta">{l.mins}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                <div className="ph-foot">
                    <button className="ph-reset" onClick={() => {
                        if (window.confirm("¿Reiniciar el progreso de Física con Feynman?")) { setRead({}); setQuiz({}); }
                    }}>
                        <RotateCcw size={11} style={{ verticalAlign: "-1px", marginRight: 5 }} /> Reiniciar progreso
                    </button>
                </div>
            </div>
        </div>
    );
}