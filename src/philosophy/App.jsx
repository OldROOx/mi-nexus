import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Scroll, BookOpen, ChevronLeft,
    Lightbulb, RotateCcw, Play, Sparkles, Compass, Waves, Flame,
    CheckCircle2, XCircle, GripVertical, ChevronUp, ChevronDown,
    Brain, Sun, Mountain, Feather, Circle,
} from "lucide-react";

/* ============================================================
   PRIMER LOGOS — Filosofía Primaria (los primeros pensadores)
   Mundo autónomo. Progreso en localStorage (philosophy_progress_v1).
   Estructura: lecciones con teoría (40%) + práctica (60%) +
   animaciones SVG/CSS autocontenidas para explicar cada idea.
   ============================================================ */

const SAVE_KEY = "philosophy_progress_v1";

/* ====================================================================
   ANIMACIONES — cada una es autocontenida, usa CSS/SVG, sin libs.
   Se referencian dentro de la teoría con { anim: "nombre" }.
   ==================================================================== */

/* --- 1. Del mito al logos: de la explicación divina a la razón --- */
function AnimMythToLogos() {
    const [step, setStep] = useState(0);
    const stages = [
        { label: "MITO", desc: "\"Zeus lanza el rayo porque está enojado.\"", icon: "⚡" },
        { label: "OBSERVACIÓN", desc: "Alguien empieza a fijarse en patrones repetidos.", icon: "👁️" },
        { label: "PREGUNTA", desc: "¿Y si hay una causa natural, no un capricho divino?", icon: "❓" },
        { label: "LOGOS", desc: "El rayo es electricidad acumulada en las nubes.", icon: "🧠" },
    ];
    useEffect(() => {
        const t = setInterval(() => setStep((s) => (s + 1) % stages.length), 1400);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="ph-anim">
            <div className="ph-myth-row">
                {stages.map((s, i) => (
                    <React.Fragment key={s.label}>
                        <div className={`ph-myth-node ${step === i ? "active" : ""} ${i < step ? "past" : ""}`}>
                            <span className="ph-myth-icon">{s.icon}</span>
                            <span className="ph-myth-label">{s.label}</span>
                        </div>
                        {i < stages.length - 1 && <div className={`ph-myth-arrow ${i < step ? "past" : ""}`}>→</div>}
                    </React.Fragment>
                ))}
            </div>
            <p className="ph-anim-cap">{stages[step].desc}</p>
        </div>
    );
}

/* --- 2. El mapa de Mileto: los 3 primeros filósofos y su "arché" --- */
function AnimMiletoMap() {
    const thinkers = [
        { name: "Tales", arche: "Agua", color: "#3aa0ff", why: "Todo nace húmedo, se nutre de agua, y el agua puede ser líquida, sólida o vapor: cambia de forma sin dejar de ser ella misma." },
        { name: "Anaximandro", arche: "Ápeiron (lo ilimitado)", color: "#d9a441", why: "Si el origen fuera UNA cosa concreta (agua, fuego), esa cosa no podría dar lugar a su opuesto. Necesita ser algo indefinido, sin límites." },
        { name: "Anaxímenes", arche: "Aire", color: "#4dffa0", why: "El aire se condensa y se vuelve agua, tierra, piedra; se enrarece y se vuelve fuego. Un solo proceso explica toda la transformación." },
    ];
    const [sel, setSel] = useState(0);
    return (
        <div className="ph-anim">
            <div className="ph-mileto-tabs">
                {thinkers.map((t, i) => (
                    <button key={t.name} className={`ph-mileto-tab ${sel === i ? "on" : ""}`}
                            style={sel === i ? { borderColor: t.color, color: t.color } : {}}
                            onClick={() => setSel(i)}>{t.name}</button>
                ))}
            </div>
            <div className="ph-mileto-stage">
                <div className="ph-mileto-badge" style={{ borderColor: thinkers[sel].color, color: thinkers[sel].color }}>
                    arché = {thinkers[sel].arche}
                </div>
                <p className="ph-anim-cap">{thinkers[sel].why}</p>
            </div>
        </div>
    );
}

/* --- 3. El río de Heráclito: todo fluye, nada permanece --- */
function AnimHeraclitusRiver() {
    const [t, setT] = useState(0);
    useEffect(() => {
        const iv = setInterval(() => setT((v) => (v + 1) % 100), 80);
        return () => clearInterval(iv);
    }, []);
    const waves = [0, 1, 2, 3, 4].map((i) => Math.sin((t + i * 20) / 10) * 6);
    return (
        <div className="ph-anim">
            <svg viewBox="0 0 480 140" className="ph-anim-svg">
                <rect x="0" y="0" width="480" height="140" fill="#0c1219" rx="10" />
                {waves.map((w, i) => (
                    <path key={i}
                          d={`M0,${70 + w} Q120,${50 + w} 240,${70 + w} T480,${70 + w}`}
                          stroke="#3aa0ff" strokeWidth="2.5" fill="none" opacity={0.85 - i * 0.12}
                          transform={`translate(0, ${i * 8 - 16})`} />
                ))}
                <text x="240" y="120" textAnchor="middle" fill="#8b9199" fontSize="11" fontFamily="JetBrains Mono, monospace">
                    "Nadie se baña dos veces en el mismo río"
                </text>
            </svg>
            <p className="ph-anim-cap">El agua que tocas YA NO ESTÁ cuando lo dices: ya pasó, ya viene otra. El río conserva su forma, pero su sustancia cambia sin parar. Así es, para Heráclito, toda la realidad.</p>
        </div>
    );
}

/* --- 4. La esfera de Parménides: el Ser inmutable, sin huecos --- */
function AnimParmenidesSphere() {
    const [pulse, setPulse] = useState(false);
    useEffect(() => {
        const iv = setInterval(() => setPulse((p) => !p), 1200);
        return () => clearInterval(iv);
    }, []);
    return (
        <div className="ph-anim">
            <div className="ph-sphere-wrap">
                <div className={`ph-sphere ${pulse ? "pulse" : ""}`} />
            </div>
            <p className="ph-anim-cap">
                El Ser es UNO, eterno, sin huecos, sin partes que cambien: como una esfera perfecta. El "no-ser" no se puede ni pensar ni decir — por eso el cambio (pasar de ser a no-ser) es, para Parménides, una ilusión de los sentidos.
            </p>
        </div>
    );
}

/* --- 5. Heráclito vs Parménides: cambio vs permanencia (la primera gran disputa) --- */
function AnimFluxVsBeing() {
    const [side, setSide] = useState("flux");
    return (
        <div className="ph-anim">
            <div className="ph-vs-row">
                <button className={`ph-vs-col ${side === "flux" ? "on" : ""}`} onClick={() => setSide("flux")}>
                    <Waves size={26} />
                    <span className="ph-vs-tag">Heráclito</span>
                    <span className="ph-vs-sub">TODO CAMBIA</span>
                </button>
                <div className="ph-vs-mid">VS</div>
                <button className={`ph-vs-col ${side === "being" ? "on" : ""}`} onClick={() => setSide("being")}>
                    <Circle size={26} />
                    <span className="ph-vs-tag">Parménides</span>
                    <span className="ph-vs-sub">NADA CAMBIA</span>
                </button>
            </div>
            <p className="ph-anim-cap">
                {side === "flux"
                    ? "Para Heráclito, el cambio es lo único real; lo estable es solo apariencia. El fuego, que transforma todo, es su imagen favorita."
                    : "Para Parménides, el cambio es una ilusión de los sentidos; la razón demuestra que el Ser verdadero no puede nacer ni desaparecer."}
            </p>
        </div>
    );
}

/* --- 6. Los 4 elementos de Empédocles + Amor y Discordia --- */
function AnimFourElements() {
    const els = [
        { n: "Fuego", c: "#ff5a1f" }, { n: "Aire", c: "#9ad6ff" },
        { n: "Agua", c: "#3aa0ff" }, { n: "Tierra", c: "#5cc88a" },
    ];
    const [mode, setMode] = useState("amor");
    return (
        <div className="ph-anim">
            <div className="ph-elem-toggle">
                <button className={`ph-elem-btn ${mode === "amor" ? "on" : ""}`} onClick={() => setMode("amor")}>Amor (une)</button>
                <button className={`ph-elem-btn ${mode === "discordia" ? "on" : ""}`} onClick={() => setMode("discordia")}>Discordia (separa)</button>
            </div>
            <div className={`ph-elem-ring ${mode}`}>
                {els.map((e, i) => (
                    <div key={e.n} className="ph-elem-dot" style={{ background: e.c, "--i": i }}>{e.n}</div>
                ))}
            </div>
            <p className="ph-anim-cap">
                {mode === "amor"
                    ? "La fuerza del Amor (Philia) atrae y mezcla los 4 elementos: así nacen las cosas del mundo."
                    : "La fuerza de la Discordia (Neikos) los separa y dispersa: así las cosas se deshacen y mueren."}
            </p>
        </div>
    );
}

/* --- 7. Átomos y vacío: Demócrito --- */
function AnimAtoms() {
    const [particles, setParticles] = useState(() =>
        Array.from({ length: 14 }, (_, i) => ({
            id: i, x: 30 + Math.random() * 400, y: 20 + Math.random() * 100,
            vx: (Math.random() - 0.5) * 1.6, vy: (Math.random() - 0.5) * 1.6,
        }))
    );
    useEffect(() => {
        const iv = setInterval(() => {
            setParticles((ps) => ps.map((p) => {
                let { x, y, vx, vy } = p;
                x += vx; y += vy;
                if (x < 10 || x > 460) vx *= -1;
                if (y < 10 || y > 130) vy *= -1;
                return { ...p, x, y, vx, vy };
            }));
        }, 50);
        return () => clearInterval(iv);
    }, []);
    return (
        <div className="ph-anim">
            <svg viewBox="0 0 480 140" className="ph-anim-svg">
                <rect x="0" y="0" width="480" height="140" fill="#0c1219" rx="10" />
                {particles.map((p) => (
                    <circle key={p.id} cx={p.x} cy={p.y} r="5" fill="#d9a441" opacity="0.85" />
                ))}
                <text x="240" y="132" textAnchor="middle" fill="#5a6b82" fontSize="10" fontFamily="JetBrains Mono, monospace">
                    átomos (indivisibles) moviéndose en el vacío
                </text>
            </svg>
            <p className="ph-anim-cap">Para Demócrito, TODO —incluida tu mente— son átomos (partículas indivisibles, "a-tomos" = sin partes) chocando y combinándose en el vacío. Nada de dioses: solo materia y movimiento.</p>
        </div>
    );
}

/* --- 8. La mayéutica de Sócrates: preguntas que "dan a luz" ideas --- */
function AnimMaieutic() {
    const steps = [
        "¿Qué es la justicia?",
        '"Dar a cada uno lo que merece"',
        "¿Y si alguien merece algo injusto?",
        '"...entonces no sería justicia dárselo"',
        "Entonces tu primera definición no basta.",
    ];
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((v) => (v + 1) % steps.length), 1500);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="ph-anim">
            <div className="ph-dialog">
                {steps.map((s, idx) => (
                    <div key={idx} className={`ph-dialog-line ${idx === i ? "active" : ""} ${idx < i ? "past" : ""} ${idx % 2 === 0 ? "socrates" : "other"}`}>
                        <span className="ph-dialog-who">{idx % 2 === 0 ? "Sócrates:" : "El otro:"}</span> {s}
                    </div>
                ))}
            </div>
            <p className="ph-anim-cap">Sócrates no "enseña" la respuesta: pregunta hasta que la otra persona descubre que su idea tenía un hueco. Por eso lo llama mayéutica: como una comadrona, "da a luz" ideas que ya estaban ahí, sin imponerlas.</p>
        </div>
    );
}

/* --- 9. El método socrático como árbol de preguntas --- */
function AnimSocraticTree() {
    const [step, setStep] = useState(0);
    const nodes = [
        { id: 0, label: "Afirmación inicial", x: 240, y: 24 },
        { id: 1, label: "¿Qué quieres decir con...?", x: 120, y: 90 },
        { id: 2, label: "Ejemplo contrario", x: 360, y: 90 },
        { id: 3, label: "Contradicción", x: 240, y: 156 },
    ];
    const edges = [[0, 1], [0, 2], [1, 3], [2, 3]];
    useEffect(() => {
        const t = setInterval(() => setStep((s) => (s + 1) % (nodes.length + 1)), 750);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="ph-anim">
            <svg viewBox="0 0 480 190" className="ph-anim-svg">
                {edges.map(([a, b], i) => {
                    const A = nodes[a], B = nodes[b];
                    const lit = step > a && step > b;
                    return <line key={i} x1={A.x} y1={A.y + 12} x2={B.x} y2={B.y - 12}
                                 stroke={lit ? "#c9a227" : "#1e2a38"} strokeWidth="2" style={{ transition: "stroke .3s" }} />;
                })}
                {nodes.map((n) => {
                    const lit = step > n.id;
                    return (
                        <g key={n.id} style={{ transition: "all .35s" }}>
                            <rect x={n.x - 70} y={n.y - 14} width="140" height="28" rx="8"
                                  fill={lit ? "rgba(201,162,39,.18)" : "#0f1620"}
                                  stroke={lit ? "#c9a227" : "#1e2a38"} strokeWidth="1.5" />
                            <text x={n.x} y={n.y + 4} textAnchor="middle"
                                  fill={lit ? "#f0e0a8" : "#5d708a"} fontSize="10" fontFamily="JetBrains Mono, monospace">{n.label}</text>
                        </g>
                    );
                })}
            </svg>
            <p className="ph-anim-cap">Cada pregunta abre una rama; cada rama puede chocar con otra. Cuando dos ramas se contradicen, la afirmación inicial queda en duda. Así se "purifica" una idea hasta quedarse solo con lo que resiste el examen.</p>
        </div>
    );
}

/* --- 10. La caverna de Platón --- */
function AnimCave() {
    const [phase, setPhase] = useState(0); // 0 = encadenado, 1 = subiendo, 2 = afuera
    return (
        <div className="ph-anim">
            <div className="ph-cave-tabs">
                <button className={`ph-cave-tab ${phase === 0 ? "on" : ""}`} onClick={() => setPhase(0)}>1. Encadenado</button>
                <button className={`ph-cave-tab ${phase === 1 ? "on" : ""}`} onClick={() => setPhase(1)}>2. Sube y sale</button>
                <button className={`ph-cave-tab ${phase === 2 ? "on" : ""}`} onClick={() => setPhase(2)}>3. Ve el Sol</button>
            </div>
            <svg viewBox="0 0 480 160" className="ph-anim-svg">
                <rect x="0" y="0" width="480" height="160" fill="#0c1219" rx="10" />
                {phase === 0 && (
                    <>
                        <circle cx="90" cy="120" r="10" fill="#8b9199" />
                        <line x1="90" y1="130" x2="90" y2="150" stroke="#5a6b82" strokeWidth="3" />
                        <rect x="260" y="40" width="40" height="60" fill="#1e2a38" opacity="0.7" />
                        <circle cx="430" cy="80" r="22" fill="#ff9d3f" opacity="0.5" />
                        <text x="180" y="150" fill="#5a6b82" fontSize="10" fontFamily="JetBrains Mono, monospace">solo ve SOMBRAS en la pared</text>
                    </>
                )}
                {phase === 1 && (
                    <>
                        <circle cx="200" cy="60" r="10" fill="#8b9199" />
                        <line x1="200" y1="70" x2="200" y2="95" stroke="#5a6b82" strokeWidth="3" />
                        <path d="M150,160 L250,30 L350,160" stroke="#3aa0ff" strokeWidth="2" fill="none" opacity="0.5" />
                        <text x="240" y="150" fill="#5a6b82" fontSize="10" fontFamily="JetBrains Mono, monospace">el ascenso duele, ciega</text>
                    </>
                )}
                {phase === 2 && (
                    <>
                        <circle cx="380" cy="40" r="28" fill="#ffce54" />
                        <circle cx="200" cy="110" r="10" fill="#e8ecf3" />
                        <line x1="200" y1="120" x2="200" y2="145" stroke="#e8ecf3" strokeWidth="3" />
                        <text x="220" y="150" fill="#ffce54" fontSize="10" fontFamily="JetBrains Mono, monospace">ve el Sol: la idea del Bien</text>
                    </>
                )}
            </svg>
            <p className="ph-anim-cap">
                {phase === 0 && "Prisioneros encadenados de espaldas a la entrada solo ven sombras proyectadas en la pared, y creen que ESO es toda la realidad."}
                {phase === 1 && "Uno es liberado, sube hacia la salida. Le duele la luz: dejar las ilusiones cómodas es incómodo antes de ser liberador."}
                {phase === 2 && "Al fin ve el Sol: para Platón, la idea más alta (el Bien), la fuente de toda verdad. Volver a contarle esto a los de la cueva es la tarea — y el riesgo— del filósofo."}
            </p>
        </div>
    );
}

/* --- 11. Mundo sensible vs Mundo de las Ideas (Platón) --- */
function AnimTwoWorlds() {
    const [hover, setHover] = useState(null);
    const pairs = [
        { real: "Esta silla de madera", idea: "La Idea de \"Silla\"" },
        { real: "Un círculo dibujado a mano", idea: "La Idea de \"Círculo\" perfecto" },
        { real: "Una persona justa (a veces)", idea: "La Idea de \"Justicia\"" },
    ];
    return (
        <div className="ph-anim">
            <div className="ph-worlds">
                <div className="ph-world-col sensible">
                    <div className="ph-world-h">MUNDO SENSIBLE</div>
                    <div className="ph-world-sub">cambia, es imperfecto, lo percibes con los sentidos</div>
                    {pairs.map((p, i) => (
                        <div key={i} className={`ph-world-item ${hover === i ? "hi" : ""}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>{p.real}</div>
                    ))}
                </div>
                <div className="ph-world-arrowcol">{pairs.map((_, i) => <span key={i} className={`ph-world-arrow ${hover === i ? "hi" : ""}`}>⇢</span>)}</div>
                <div className="ph-world-col ideas">
                    <div className="ph-world-h">MUNDO DE LAS IDEAS</div>
                    <div className="ph-world-sub">eterno, perfecto, lo conoces con la razón</div>
                    {pairs.map((p, i) => (
                        <div key={i} className={`ph-world-item ${hover === i ? "hi" : ""}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>{p.idea}</div>
                    ))}
                </div>
            </div>
            <p className="ph-anim-cap">Cada cosa imperfecta que ves es solo una "copia" o "sombra" de su Idea perfecta, que existe en un plano que solo la razón puede alcanzar. Por eso, para Platón, conocer de verdad es recordar (anamnesis), no solo observar.</p>
        </div>
    );
}

/* --- 12. Las 4 causas de Aristóteles --- */
function AnimFourCauses() {
    const causes = [
        { n: "Material", ex: "El bronce con que está hecha", c: "#8a98a8" },
        { n: "Formal", ex: "La forma de estatua que tiene", c: "#3aa0ff" },
        { n: "Eficiente", ex: "El escultor que la hizo", c: "#ff9d3f" },
        { n: "Final", ex: "El propósito: honrar a un héroe", c: "#5cc88a" },
    ];
    const [sel, setSel] = useState(0);
    return (
        <div className="ph-anim">
            <div className="ph-causes-tabs">
                {causes.map((c, i) => (
                    <button key={c.n} className={`ph-causes-tab ${sel === i ? "on" : ""}`}
                            style={sel === i ? { borderColor: c.c, color: c.c } : {}}
                            onClick={() => setSel(i)}>{c.n}</button>
                ))}
            </div>
            <div className="ph-causes-stage">
                <div className="ph-causes-statue">🗿</div>
                <p className="ph-anim-cap"><strong style={{ color: causes[sel].c }}>Causa {causes[sel].n.toLowerCase()}:</strong> {causes[sel].ex}</p>
            </div>
        </div>
    );
}

/* --- 13. El término medio de Aristóteles (la virtud entre dos vicios) --- */
function AnimGoldenMean() {
    const [pos, setPos] = useState(50);
    const labelFor = (v) => {
        if (v < 30) return { t: "Cobardía (defecto)", c: "#ff6b6b" };
        if (v > 70) return { t: "Temeridad (exceso)", c: "#ff6b6b" };
        return { t: "Valentía (término medio)", c: "#5cc88a" };
    };
    const l = labelFor(pos);
    return (
        <div className="ph-anim">
            <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(Number(e.target.value))} className="ph-slider" />
            <div className="ph-mean-track">
                <span>Defecto</span><span>Término medio</span><span>Exceso</span>
            </div>
            <div className="ph-mean-result" style={{ color: l.c }}>{l.t}</div>
            <p className="ph-anim-cap">Mueve la barra: para Aristóteles, la virtud no es un extremo, sino el punto justo entre dos vicios (uno por defecto, otro por exceso). Ni cobarde ni temerario: valiente.</p>
        </div>
    );
}

/* --- 14. Línea de tiempo: del mito a Aristóteles --- */
function AnimTimeline() {
    const events = [
        { y: "s. VIII a.C.", t: "Homero y Hesíodo: el mito explica el mundo" },
        { y: "~624 a.C.", t: "Tales de Mileto: nace la filosofía (busca el arché)" },
        { y: "~535 a.C.", t: "Heráclito y Parménides: cambio vs. permanencia" },
        { y: "~460 a.C.", t: "Demócrito: átomos y vacío" },
        { y: "470–399 a.C.", t: "Sócrates: el \"conócete a ti mismo\"" },
        { y: "428–347 a.C.", t: "Platón: el Mundo de las Ideas" },
        { y: "384–322 a.C.", t: "Aristóteles: lógica, ciencia y ética" },
    ];
    const [i, setI] = useState(0);
    return (
        <div className="ph-anim">
            <div className="ph-tl-track">
                {events.map((e, idx) => (
                    <button key={idx} className={`ph-tl-dot ${idx === i ? "active" : ""} ${idx < i ? "past" : ""}`} onClick={() => setI(idx)} />
                ))}
            </div>
            <div className="ph-tl-card">
                <div className="ph-tl-year">{events[i].y}</div>
                <div className="ph-tl-text">{events[i].t}</div>
            </div>
            <div className="ph-tl-nav">
                <button onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}>← antes</button>
                <button onClick={() => setI((v) => Math.min(events.length - 1, v + 1))} disabled={i === events.length - 1}>después →</button>
            </div>
        </div>
    );
}

/* --- 15. Los 3 grandes interrogantes que abren la filosofía --- */
function AnimBigQuestions() {
    const qs = [
        { q: "¿De qué está hecho TODO?", branch: "Física / Metafísica", icon: "🌍" },
        { q: "¿Cómo sé que algo es verdad?", branch: "Epistemología (teoría del conocimiento)", icon: "🔍" },
        { q: "¿Cómo debo vivir? ¿Qué es lo bueno?", branch: "Ética", icon: "⚖️" },
    ];
    const [sel, setSel] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setSel((s) => (s + 1) % qs.length), 1800);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="ph-anim">
            <div className="ph-bq-row">
                {qs.map((q, i) => (
                    <div key={i} className={`ph-bq-card ${sel === i ? "active" : ""}`}>
                        <span className="ph-bq-icon">{q.icon}</span>
                        <span className="ph-bq-q">{q.q}</span>
                        <span className="ph-bq-branch">{q.branch}</span>
                    </div>
                ))}
            </div>
            <p className="ph-anim-cap">Toda la filosofía posterior —incluida la ciencia moderna— nace de tirar de estos 3 hilos que los primeros griegos se atrevieron a jalar sin recurrir a los dioses.</p>
        </div>
    );
}

const ANIM_MAP = {
    mythlogos: AnimMythToLogos,
    miletomap: AnimMiletoMap,
    river: AnimHeraclitusRiver,
    sphere: AnimParmenidesSphere,
    fluxvsbeing: AnimFluxVsBeing,
    fourelements: AnimFourElements,
    atoms: AnimAtoms,
    maieutic: AnimMaieutic,
    socratictree: AnimSocraticTree,
    cave: AnimCave,
    twoworlds: AnimTwoWorlds,
    fourcauses: AnimFourCauses,
    goldenmean: AnimGoldenMean,
    timeline: AnimTimeline,
    bigquestions: AnimBigQuestions,
};

/* ------------------------------------------------------------
   CONTENIDO — módulos con teoría (40%) y práctica (60%)
   tipos de ejercicio: "mc" | "multi" | "classify" | "order"
   ------------------------------------------------------------ */
const RANKS = [
    { min: 0,    name: "Curioso",        icon: "🌱" },
    { min: 300,  name: "Aprendiz",       icon: "📜" },
    { min: 700,  name: "Discípulo",      icon: "🏛️" },
    { min: 1100, name: "Pensador",       icon: "🦉" },
    { min: 1600, name: "Filósofo",       icon: "🧠" },
    { min: 2100, name: "Sabio (Sophos)", icon: "✨" },
];

const ICONS = { Scroll, Compass, Waves, Flame, Brain, Sun, Mountain, Feather, BookOpen };

const MODULES = [
    {
        id: "origen",
        icon: "Scroll",
        title: "Del mito al logos",
        tag: "Cómo nació la filosofía",
        accent: "#c9a227",
        theory: [
            { h: "Antes de la filosofía: el mito", p: "Durante siglos, los griegos explicaban el mundo con mitos: el rayo es la furia de Zeus, el mar es Poseidón, las estaciones son la tristeza de Demeter. El mito da respuestas, pero no se pueden cuestionar: son relatos heredados, no argumentos." },
            { anim: "mythlogos" },
            { h: "El gran giro: el logos", p: "Hacia el siglo VI a.C., en las ciudades griegas de Jonia (costa de la actual Turquía), algunos pensadores empezaron a buscar explicaciones naturales, basadas en la observación y el razonamiento (logos), no en la voluntad de un dios. Ese giro —de la autoridad del mito a la pregunta abierta— ES el nacimiento de la filosofía." },
            { h: "¿Por qué en Grecia y por qué entonces?", p: "Ciudades comerciantes en contacto con muchas culturas (egipcia, babilónica, fenicia) veían que distintos pueblos tenían distintos mitos para lo mismo. Eso siembra la duda: si cada pueblo cuenta una historia distinta, ¿cuál es la VERDADERA? Esa pregunta exige un método mejor que 'porque lo dice la tradición': la razón." },
            { anim: "bigquestions" },
            { tip: { icon: "💡", text: "Filosofía viene del griego philos (amor) + sophia (sabiduría): 'amor a la sabiduría'. No es tener todas las respuestas, sino el AMOR por seguir preguntando con rigor." } },
        ],
        exercises: [
            {
                type: "mc",
                prompt: "¿Cuál es la diferencia clave entre una explicación MÍTICA y una FILOSÓFICA del mismo fenómeno (ej. un terremoto)?",
                options: [
                    "El mito es más antiguo, nada más",
                    "El mito apela a la voluntad de un dios; la filosofía busca una causa natural que se pueda razonar y cuestionar",
                    "La filosofía siempre tiene razón y el mito siempre se equivoca",
                    "No hay ninguna diferencia real",
                ],
                answer: 1,
                exp: "El contenido puede coincidir (algo se mueve violentamente), pero el MÉTODO cambia: de 'porque Poseidón golpea el suelo' a 'busquemos una causa natural que podamos examinar y discutir'.",
            },
            {
                type: "mc",
                prompt: "¿Por qué el contacto entre culturas distintas ayudó a que naciera la filosofía en las ciudades griegas comerciantes?",
                options: [
                    "Porque copiaron los mitos de otros pueblos sin cambiar nada",
                    "Porque ver mitos distintos para el mismo fenómeno hizo dudar de cuál era 'el verdadero', empujando a buscar un método más confiable que la tradición",
                    "Porque el comercio no tiene relación con las ideas",
                    "Porque dejaron de creer en cualquier tipo de explicación",
                ],
                answer: 1,
                exp: "La diversidad de relatos sembró la duda razonable: si cada pueblo cuenta algo distinto, la autoridad de 'siempre se ha dicho así' deja de ser suficiente.",
            },
            {
                type: "multi",
                prompt: "¿Cuáles de estas son preguntas típicamente FILOSÓFICAS (logos), a diferencia de simplemente aceptar un mito? Selecciona todas.",
                options: [
                    "¿De qué está hecho realmente el universo?",
                    "Zeus se enojó, por eso truena",
                    "¿Cómo sé si lo que percibo con mis sentidos es verdadero?",
                    "¿Qué es lo bueno y cómo debo vivir?",
                    "Así ha sido siempre, no hay que preguntar más",
                ],
                answers: [0, 2, 3],
                exp: "Las preguntas filosóficas abren un examen racional sin cerrarlo con una autoridad o una tradición. 'Zeus se enojó' y 'así ha sido siempre' son formas de CERRAR la pregunta, no de abrirla.",
            },
        ],
    },
    {
        id: "mileto",
        icon: "Waves",
        title: "Los de Mileto y el arché",
        tag: "¿De qué está hecho todo?",
        accent: "#3aa0ff",
        theory: [
            { h: "La primera gran pregunta", p: "Los primeros filósofos —llamados presocráticos, porque vivieron antes de Sócrates— se hicieron una pregunta enorme: ¿hay UNA sola sustancia (arché, 'principio' u 'origen') de la que todo lo demás está hecho o deriva? Buscaban la unidad detrás de la diversidad del mundo." },
            { anim: "miletomap" },
            { h: "Tales de Mileto: el agua", p: "Considerado el primer filósofo (~624–546 a.C.). Propuso que el arché es el AGUA: todo nace húmedo, la vida depende de ella, y puede cambiar de estado (sólido, líquido, vapor) sin dejar de ser agua. Es la primera vez que alguien propone una explicación natural y unificada del cosmos." },
            { h: "Anaximandro: el ápeiron", p: "Discípulo de Tales. Notó un problema: si el origen fuera 'agua' (algo concreto y con cualidades), ¿cómo explicar su opuesto, el fuego seco? Propuso el ápeiron: algo ilimitado e indefinido, sin cualidades fijas, del que SÍ pueden surgir todos los opuestos." },
            { h: "Anaxímenes: el aire", p: "Propuso el AIRE como arché, pero con una idea nueva clave: el mecanismo del cambio. El aire, al condensarse, se vuelve niebla, agua, tierra, piedra; al enrarecerse (expandirse), se vuelve fuego. Un solo proceso (condensación/rarefacción) explica toda la variedad del mundo." },
            { tip: { icon: "🏛️", text: "Los tres vivieron en Mileto, una ciudad portuaria y comercial de Jonia. No es casualidad: era un lugar de intercambio de ideas, mapas y rutas, ideal para mentes que se atrevían a preguntar distinto." } },
        ],
        exercises: [
            {
                type: "classify",
                prompt: "Relaciona a cada filósofo de Mileto con el arché (principio) que propuso.",
                categories: ["Agua", "Ápeiron (lo ilimitado)", "Aire"],
                items: [
                    { text: "Tales de Mileto", cat: 0 },
                    { text: "Anaximandro", cat: 1 },
                    { text: "Anaxímenes", cat: 2 },
                ],
                exp: "Tales: agua. Anaximandro: ápeiron (algo indefinido, sin cualidades fijas). Anaxímenes: aire, con el mecanismo de condensación/rarefacción.",
            },
            {
                type: "mc",
                prompt: "¿Por qué Anaximandro rechazó que el arché fuera algo concreto como el agua o el fuego?",
                options: [
                    "Porque no le gustaba Tales",
                    "Porque algo con cualidades fijas y concretas no podría explicar también a su propio opuesto",
                    "Porque el agua no existe",
                    "Porque quería inventar una palabra nueva nada más",
                ],
                answer: 1,
                exp: "Si el origen de todo fuera, por ejemplo, lo húmedo, ¿de dónde saldría lo seco? Anaximandro necesitaba algo previo a los opuestos: indefinido, sin tomar partido por ninguna cualidad.",
            },
            {
                type: "mc",
                prompt: "El aporte más importante de Anaxímenes, más allá de elegir 'el aire', fue...",
                options: [
                    "Decir que todo es agua también",
                    "Proponer un MECANISMO (condensación y rarefacción) que explica cómo una sola sustancia se transforma en todas las demás",
                    "Negar que exista un arché",
                    "Inventar la palabra 'filosofía'",
                ],
                answer: 1,
                exp: "No basta con señalar una sustancia; Anaxímenes explica el PROCESO de transformación. Es un paso hacia explicaciones más completas y mecánicas del cambio.",
            },
            {
                type: "multi",
                prompt: "¿Qué tienen en común los tres filósofos de Mileto? Selecciona todas las que apliquen.",
                options: [
                    "Buscaban una sola sustancia o principio que explicara todo el cosmos",
                    "Vivieron en la misma ciudad, Mileto, un puerto comercial",
                    "Recurrían a los dioses del Olimpo como causa última",
                    "Se les considera los primeros filósofos de la historia occidental",
                ],
                answers: [0, 1, 3],
                exp: "Su gran innovación fue precisamente DEJAR FUERA a los dioses como explicación y buscar una causa natural y unificada.",
            },
        ],
    },
    {
        id: "cambio",
        icon: "Flame",
        title: "Heráclito y Parménides",
        tag: "Cambio vs. permanencia",
        accent: "#e2706f",
        theory: [
            { h: "El problema del cambio", p: "Si todo cambia constantemente, ¿cómo podemos conocer algo de forma segura? Y si nada cambia nunca, ¿por qué el mundo PARECE cambiar todo el tiempo? Esta tensión entre cambio y permanencia es uno de los problemas más fértiles de toda la filosofía." },
            { h: "Heráclito de Éfeso: el devenir", p: "Famoso por la imagen del río: 'nadie se baña dos veces en el mismo río', porque el agua ya cambió. Para Heráclito, el cambio (devenir) es lo único permanente; lo fijo es solo apariencia. Su elemento favorito es el fuego, que transforma todo lo que toca." },
            { anim: "river" },
            { h: "El logos de Heráclito", p: "Aunque todo cambia, Heráclito no cree que el mundo sea un caos total: hay un orden o razón (logos) detrás del cambio, una lógica de opuestos que se equilibran (el día se vuelve noche, la vida se vuelve muerte y viceversa). El cambio tiene una estructura, aunque la estructura misma no sea una 'cosa fija'." },
            { h: "Parménides de Elea: el Ser inmutable", p: "Argumentó justo lo contrario: el verdadero Ser es UNO, eterno, indivisible e inmutable. El cambio implicaría que algo pasa del 'ser' al 'no-ser' (o viceversa), pero el no-ser ni se puede pensar ni se puede decir: es una contradicción. Por tanto, el cambio que vemos es solo apariencia de los sentidos, no la verdad de la razón." },
            { anim: "sphere" },
            { anim: "fluxvsbeing" },
            { tip: { icon: "⚖️", text: "Esta disputa —cambio vs. permanencia— reaparece toda la historia de la filosofía y hasta en la física moderna: ¿el universo es proceso puro, o hay leyes/estructuras inmutables detrás del cambio? Sigue sin cerrarse del todo." } },
        ],
        exercises: [
            {
                type: "mc",
                prompt: "La famosa frase 'nadie se baña dos veces en el mismo río' de Heráclito quiere decir que...",
                options: [
                    "Los ríos son peligrosos",
                    "El agua del río cambia constantemente, así que el río 'mismo' nunca es idéntico a sí mismo de un instante a otro",
                    "Hay que bañarse solo una vez en la vida",
                    "Los ríos no existen realmente",
                ],
                answer: 1,
                exp: "Es la imagen perfecta del devenir: conserva su forma y nombre ('el río'), pero su sustancia (el agua) fluye y cambia sin cesar.",
            },
            {
                type: "mc",
                prompt: "¿Cuál es el argumento central de Parménides para negar que el cambio sea real?",
                options: [
                    "Que el cambio duele",
                    "Que el cambio implicaría pasar del ser al no-ser, y el no-ser es impensable e indecible: una contradicción",
                    "Que nadie ha visto cambiar nada",
                    "Que los dioses prohíben el cambio",
                ],
                answer: 1,
                exp: "Para Parménides, hablar de 'lo que no es' ya es una contradicción lógica. Si el Ser es lo único pensable, no puede surgir del no-ser ni convertirse en él: por tanto no puede cambiar.",
            },
            {
                type: "classify",
                prompt: "Clasifica cada idea según si pertenece a Heráclito o a Parménides.",
                categories: ["Heráclito", "Parménides"],
                items: [
                    { text: "El cambio es lo único permanente; todo fluye.", cat: 0 },
                    { text: "El Ser es uno, eterno e inmutable; el cambio es ilusión de los sentidos.", cat: 1 },
                    { text: "El fuego es la imagen perfecta de la transformación constante.", cat: 0 },
                    { text: "El no-ser no se puede pensar ni decir.", cat: 1 },
                ],
                exp: "Heráclito defiende el devenir (todo cambia); Parménides defiende el Ser inmutable (nada cambia de verdad). Es la primera gran polaridad filosófica de Occidente.",
            },
            {
                type: "mc",
                prompt: "¿Por qué se dice que esta disputa entre Heráclito y Parménides sigue siendo 'fértil' hoy?",
                options: [
                    "Porque ya se resolvió hace siglos y no importa",
                    "Porque la pregunta de si la realidad es proceso puro o hay estructuras estables detrás del cambio sigue abierta, incluso en la ciencia",
                    "Porque ninguno de los dos tenía razón en nada",
                    "Porque solo es relevante para historiadores",
                ],
                answer: 1,
                exp: "La tensión entre 'todo cambia' y 'hay leyes/estructuras permanentes' reaparece en física, biología evolutiva y filosofía de la ciencia hasta hoy.",
            },
        ],
    },
    {
        id: "pluralistas",
        icon: "Mountain",
        title: "Empédocles y Demócrito",
        tag: "Elementos, átomos y vacío",
        accent: "#5cc88a",
        theory: [
            { h: "De UNA sustancia a VARIAS", p: "Tras Heráclito y Parménides, otros pensadores buscaron una salida intermedia: tal vez no hay un único arché, sino VARIOS principios básicos que se combinan. Esto permite explicar el cambio (las combinaciones cambian) sin negar que haya algo permanente (los principios básicos no cambian)." },
            { h: "Empédocles: los 4 elementos", p: "Propuso que todo está hecho de 4 elementos básicos —fuego, aire, agua y tierra— que ni se crean ni se destruyen, solo se mezclan y separan. Dos fuerzas cósmicas mueven ese proceso: el Amor (Philia), que une y mezcla, y la Discordia (Neikos), que separa y dispersa." },
            { anim: "fourelements" },
            { h: "Demócrito: átomos y vacío", p: "Junto con su maestro Leucipo, propuso que la realidad está hecha de átomos (del griego 'a-tomos': sin partes, indivisibles), partículas diminutas, eternas e indestructibles, que se mueven en el vacío y se combinan de formas distintas para formar todas las cosas, incluida el alma." },
            { anim: "atoms" },
            { h: "Por qué esto es revolucionario", p: "Demócrito propone una explicación puramente MATERIALISTA y MECÁNICA del universo: sin propósito divino, sin fuerzas mágicas, solo átomos chocando según ciertas reglas. Es, en muchos sentidos, un antepasado directo de la física atómica moderna —¡más de 2000 años antes de que existiera un microscopio!" },
            { tip: { icon: "🔬", text: "La palabra 'átomo' que usamos hoy en química viene literalmente de esta idea griega, aunque ahora sabemos que el átomo SÍ tiene partes (protones, neutrones, electrones). La intuición de 'unidades básicas combinables' resultó profética." } },
        ],
        exercises: [
            {
                type: "mc",
                prompt: "¿Qué problema busca resolver Empédocles al proponer 4 elementos en vez de uno solo?",
                options: [
                    "Quería que su teoría fuera más complicada por gusto",
                    "Explicar la diversidad del mundo y el cambio sin negar que algo permanezca (los elementos no se crean ni destruyen, solo se combinan)",
                    "Demostrar que Tales estaba equivocado sobre el agua específicamente",
                    "Inventar nuevos dioses",
                ],
                answer: 1,
                exp: "Con varios principios fijos que se mezclan en proporciones distintas, se puede explicar tanto la variedad de cosas que existen como el hecho de que haya algo estable detrás de esa variedad.",
            },
            {
                type: "classify",
                prompt: "Para Empédocles, clasifica cada fuerza según lo que hace.",
                categories: ["Amor (Philia)", "Discordia (Neikos)"],
                items: [
                    { text: "Une y mezcla los elementos para formar cosas nuevas", cat: 0 },
                    { text: "Separa y dispersa los elementos, causando la destrucción", cat: 1 },
                    { text: "Es la fuerza que explica el nacimiento de algo", cat: 0 },
                    { text: "Es la fuerza que explica la muerte o descomposición de algo", cat: 1 },
                ],
                exp: "Amor y Discordia son las dos fuerzas cósmicas opuestas que mueven el ciclo eterno de unión y separación de los 4 elementos.",
            },
            {
                type: "mc",
                prompt: "¿Qué significa literalmente la palabra griega 'átomo' (a-tomos) que usó Demócrito?",
                options: [
                    "Lo más pequeño visible al ojo",
                    "Sin partes, indivisible",
                    "Hecho de fuego",
                    "Que se mueve rápido",
                ],
                answer: 1,
                exp: "'A-' (sin) + 'tomos' (partes, corte): algo que no se puede dividir más. Para Demócrito, el átomo es la unidad última e indestructible de toda la realidad.",
            },
            {
                type: "mc",
                prompt: "¿Por qué se considera la teoría atomista de Demócrito una explicación 'materialista' del universo?",
                options: [
                    "Porque dice que solo existe la materia (átomos) en movimiento, sin necesidad de dioses ni propósitos divinos",
                    "Porque solo habla de cosas caras y materiales",
                    "Porque Demócrito era muy rico",
                    "Porque rechaza que existan los átomos",
                ],
                answer: 0,
                exp: "Es materialista porque reduce toda la realidad —incluyendo el alma— a combinaciones de átomos y vacío, sin recurrir a fuerzas espirituales o voluntades divinas.",
            },
        ],
    },
    {
        id: "socrates",
        icon: "Brain",
        title: "Sócrates",
        tag: "Conócete a ti mismo",
        accent: "#c9a227",
        theory: [
            { h: "El giro hacia el ser humano", p: "Los presocráticos preguntaban '¿de qué está hecho el cosmos?'. Sócrates (470–399 a.C.) gira la pregunta hacia el ser humano: '¿qué es la virtud? ¿qué es la justicia? ¿cómo debo vivir?'. Con él nace con fuerza la ÉTICA como rama central de la filosofía." },
            { h: "\"Solo sé que no sé nada\"", p: "Sócrates no escribió libros ni dejó un sistema cerrado; su método era hablar en las plazas de Atenas, cuestionando a quienes afirmaban tener certezas (políticos, sabios, jóvenes). Su frase más famosa expresa una ironía profunda: reconocer la propia ignorancia es el primer paso hacia la sabiduría real, no la falsa seguridad de creer que ya se sabe todo." },
            { h: "La mayéutica: 'dar a luz' ideas", p: "Su madre era comadrona (partera), y Sócrates comparó su método con eso: él no implanta ideas ajenas, sino que con preguntas bien dirigidas ayuda a que la otra persona 'dé a luz' un conocimiento que, en cierto sentido, ya tenía dentro pero no había examinado." },
            { anim: "maieutic" },
            { h: "El método socrático (elenchos)", p: "Consiste en pedir una definición (ej. '¿qué es el valor?'), aceptarla provisionalmente, y luego buscar un contraejemplo o consecuencia absurda que la haga tambalear. El objetivo no es humillar, sino purificar la idea hasta quedarse solo con lo que resiste el examen crítico." },
            { anim: "socratictree" },
            { h: "Su muerte y su legado", p: "Fue acusado de corromper a la juventud e introducir nuevos dioses, condenado a muerte por un tribunal ateniense, y aceptó la sentencia (cicuta) en vez de huir, por respeto a las leyes de su ciudad. Su discípulo más importante, Platón, registró sus diálogos y los convirtió en la base de toda la filosofía posterior." },
            { tip: { icon: "🗣️", text: "Casi todo lo que sabemos de Sócrates viene de los escritos de OTROS (sobre todo Platón), no de él mismo. Por eso es difícil saber con certeza dónde termina 'Sócrates' y empieza 'Platón hablando a través de Sócrates'." } },
        ],
        exercises: [
            {
                type: "mc",
                prompt: "¿En qué consiste el giro filosófico que introduce Sócrates respecto a los presocráticos?",
                options: [
                    "Sigue preguntando de qué está hecho el cosmos, igual que ellos",
                    "Desplaza el centro de la pregunta filosófica hacia el ser humano: la virtud, la justicia, cómo vivir bien",
                    "Inventa una nueva religión",
                    "Rechaza por completo el uso de la razón",
                ],
                answer: 1,
                exp: "Con Sócrates, la filosofía 'baja' del cosmos al ser humano: lo central pasa a ser la ética y el autoconocimiento, no la física del universo.",
            },
            {
                type: "mc",
                prompt: "La frase 'solo sé que no sé nada' es mejor entendida como...",
                options: [
                    "Una confesión literal de que Sócrates era ignorante de todo",
                    "Una forma irónica de señalar que reconocer los límites del propio saber es más sabio que la falsa certeza de quien cree saberlo todo",
                    "Una broma sin ningún contenido filosófico",
                    "Una crítica a la escritura",
                ],
                answer: 1,
                exp: "Es la 'ironía socrática': frente a quienes presumían sabiduría sin examinarla, Sócrates mostraba que el verdadero primer paso es admitir cuánto desconocemos.",
            },
            {
                type: "order",
                prompt: "Ordena los pasos típicos del método socrático (elenchos), del primero al último.",
                items: [
                    "Se pide una definición de un concepto (ej. '¿qué es la justicia?')",
                    "Se acepta la definición de forma provisional",
                    "Se busca un ejemplo o consecuencia que contradiga esa definición",
                    "La contradicción obliga a revisar o abandonar la definición inicial",
                    "Se busca una definición mejor, más resistente al examen",
                ],
                exp: "El método no busca 'ganar' una discusión, sino purificar las ideas: cada vuelta del ciclo descarta definiciones débiles y acerca (sin garantía de llegar del todo) a una comprensión más sólida del concepto.",
            },
            {
                type: "mc",
                prompt: "¿Por qué Sócrates compara su método con la labor de una comadrona (mayéutica)?",
                options: [
                    "Porque literalmente ayudaba a dar a luz bebés",
                    "Porque no impone ideas desde fuera, sino que ayuda a que la otra persona 'dé a luz' (descubra) un conocimiento mediante preguntas, no respuestas impuestas",
                    "Porque odiaba dar explicaciones directas por pereza",
                    "Porque era una metáfora sin relación con su filosofía",
                ],
                answer: 1,
                exp: "La metáfora capta lo esencial de su método: el conocimiento se 'extrae' mediante el diálogo crítico, no se entrega como un paquete cerrado.",
            },
        ],
    },
    {
        id: "platon",
        icon: "Sun",
        title: "Platón",
        tag: "El Mundo de las Ideas",
        accent: "#3aa0ff",
        theory: [
            { h: "El alumno que sistematizó", p: "Platón (428–347 a.C.) fue discípulo de Sócrates y fundó la Academia en Atenas, una de las primeras instituciones educativas de la historia. A diferencia de su maestro, Platón SÍ escribió, principalmente en forma de diálogos donde Sócrates suele ser el personaje principal." },
            { h: "El problema que hereda", p: "Platón quiere resolver la disputa entre Heráclito (todo cambia) y Parménides (nada cambia): propone que hay DOS niveles de realidad. El mundo que percibimos con los sentidos SÍ cambia y es imperfecto (como decía Heráclito); pero detrás de él hay un Mundo de las Ideas, perfecto e inmutable (como pedía Parménides)." },
            { h: "Las Ideas (o Formas)", p: "Cada cosa que existe en el mundo sensible (una silla, un círculo, un acto justo) es solo una copia imperfecta de su Idea correspondiente, que existe en un plano eterno al que solo se accede con la razón, no con los sentidos. La Idea de \"Belleza\" o de \"Justicia\" es más real, para Platón, que cualquier objeto bello o acto justo concreto." },
            { anim: "twoworlds" },
            { h: "El mito de la caverna", p: "Su alegoría más famosa: unos prisioneros encadenados en una cueva solo ven sombras proyectadas en la pared y creen que esa es toda la realidad. Uno escapa, asciende con dolor, y al fin ve el sol (la idea más alta: el Bien). El relato describe el proceso —incómodo y arriesgado— de educarse filosóficamente y luego intentar explicarlo a quienes siguen mirando solo sombras." },
            { anim: "cave" },
            { h: "El alma y el conocimiento como recuerdo", p: "Platón cree que el alma existía antes de nacer y ya conocía las Ideas; al nacer las 'olvida', y aprender es en realidad RECORDAR (anamnesis) lo que el alma ya sabía. Por eso confía tanto en el razonamiento puro: la verdad ya está, en cierto sentido, dentro de nosotros." },
            { tip: { icon: "🏛️", text: "La Academia de Platón funcionó durante casi 900 años (hasta el 529 d.C., cuando fue cerrada). Es, probablemente, la institución educativa de mayor duración en la historia." } },
        ],
        exercises: [
            {
                type: "mc",
                prompt: "¿Qué problema filosófico previo intenta resolver Platón con su teoría de los dos mundos?",
                options: [
                    "La disputa entre los dioses del Olimpo",
                    "La tensión entre Heráclito (todo cambia) y Parménides (nada cambia), dando un lugar a cada postura en un nivel de realidad distinto",
                    "El problema de cómo cocinar mejor",
                    "Ninguno, es una idea completamente original sin relación con lo anterior",
                ],
                answer: 1,
                exp: "El mundo sensible cambia (como decía Heráclito); el Mundo de las Ideas es inmutable (como pedía Parménides). Platón intenta dar la razón a ambos, cada uno en su nivel.",
            },
            {
                type: "classify",
                prompt: "Clasifica cada elemento según si pertenece al Mundo Sensible o al Mundo de las Ideas, según Platón.",
                categories: ["Mundo Sensible", "Mundo de las Ideas"],
                items: [
                    { text: "Una silla concreta de madera, que se puede romper", cat: 0 },
                    { text: "La Idea perfecta y eterna de \"Silla\"", cat: 1 },
                    { text: "Se conoce con los sentidos; es imperfecto y cambia", cat: 0 },
                    { text: "Se conoce con la razón; es perfecto e inmutable", cat: 1 },
                ],
                exp: "Para Platón, lo que vemos y tocamos son copias imperfectas y cambiantes; las Ideas (Formas) son los modelos perfectos y eternos de los que esas copias participan.",
            },
            {
                type: "order",
                prompt: "Ordena las fases del mito de la caverna, de la primera a la última.",
                items: [
                    "Los prisioneros, encadenados, solo ven sombras en la pared y creen que es toda la realidad",
                    "Uno de ellos es liberado y obligado a girarse hacia la luz",
                    "Asciende hacia la salida de la cueva; el proceso es doloroso y desorientador",
                    "Al salir, ve el mundo real iluminado por el sol (la idea del Bien)",
                    "Vuelve a la cueva para contarle a los demás lo que vio, con el riesgo de no ser creído",
                ],
                exp: "La alegoría describe un proceso educativo y filosófico completo: desde la ilusión cómoda hasta la verdad incómoda, y el riesgo de querer compartirla con quienes siguen atrapados en las sombras.",
            },
            {
                type: "mc",
                prompt: "Según Platón, ¿por qué aprender es en realidad 'recordar' (anamnesis)?",
                options: [
                    "Porque todos tenemos mala memoria",
                    "Porque el alma, antes de nacer, ya conocía las Ideas; nacer hace que las olvidemos, y aprender es traer ese conocimiento de vuelta",
                    "Porque la educación no aporta nada nuevo jamás",
                    "Porque solo se puede aprender leyendo libros antiguos",
                ],
                answer: 1,
                exp: "Esta idea explica la enorme confianza de Platón en la razón pura: si la verdad ya está, en cierto sentido, dentro del alma, el razonamiento bien dirigido puede 'desenterrarla'.",
            },
        ],
    },
    {
        id: "aristoteles",
        icon: "Feather",
        title: "Aristóteles",
        tag: "Lógica, ciencia y la vida buena",
        accent: "#d9a441",
        theory: [
            { h: "El alumno que discrepó", p: "Aristóteles (384–322 a.C.) fue alumno de Platón en la Academia durante casi 20 años, pero terminó construyendo un sistema filosófico muy distinto: mucho más anclado en la OBSERVACIÓN del mundo natural que en un mundo separado de Ideas puras." },
            { h: "\"Las Ideas no están en otro mundo, están AQUÍ\"", p: "Para Aristóteles, la forma de una cosa (lo que la hace ser lo que es) no vive en un plano separado, sino DENTRO de la cosa misma, unida a su materia. No hay un \"Caballo\" perfecto flotando en otro mundo: hay caballos concretos, y la \"forma de caballo\" está en cada uno de ellos." },
            { h: "Las 4 causas: para explicar cualquier cosa", p: "Propuso que para entender completamente algo hay que identificar 4 tipos de causa: la MATERIAL (de qué está hecho), la FORMAL (qué forma o estructura tiene), la EFICIENTE (quién o qué lo produjo) y la FINAL (para qué existe, su propósito o telos)." },
            { anim: "fourcauses" },
            { h: "El padre de la lógica formal", p: "Aristóteles inventó el primer sistema formal de razonamiento válido: el silogismo. Ejemplo: 'Todos los humanos son mortales; Sócrates es humano; por lo tanto, Sócrates es mortal.' Si las premisas son ciertas y la forma es correcta, la conclusión es necesariamente cierta. Esto es la base de toda la lógica occidental posterior." },
            { h: "Ética: la felicidad como el bien supremo", p: "En su Ética a Nicómaco, sostiene que el fin último de toda acción humana es la eudaimonía (felicidad o 'florecimiento'). Esta no se logra con placer momentáneo, sino viviendo según la virtud: actuando con excelencia y razón a lo largo de toda una vida." },
            { h: "El término medio (justo medio)", p: "Cada virtud es un punto de equilibrio entre dos vicios: uno por defecto, otro por exceso. La valentía está entre la cobardía (defecto) y la temeridad (exceso). La generosidad está entre la avaricia y el derroche. La virtud no es un extremo: es la medida justa, que además depende de la situación concreta." },
            { anim: "goldenmean" },
            { tip: { icon: "🔬", text: "Aristóteles también clasificó cientos de especies de animales y plantas observando directamente la naturaleza: es, junto con su filosofía, uno de los primeros grandes naturalistas/biólogos de la historia." } },
        ],
        exercises: [
            {
                type: "mc",
                prompt: "¿Cuál es la diferencia clave entre cómo entienden la 'forma' Platón y Aristóteles?",
                options: [
                    "Para Platón, la Idea/Forma existe en un mundo separado y perfecto; para Aristóteles, la forma existe DENTRO de cada cosa concreta, unida a su materia",
                    "No hay ninguna diferencia, pensaban exactamente lo mismo",
                    "Aristóteles cree en un mundo de Ideas todavía más separado que Platón",
                    "Platón rechazaba por completo la existencia de las formas",
                ],
                answer: 0,
                exp: "Este es uno de los grandes quiebres filosóficos: Aristóteles 'trae de vuelta a la Tierra' lo que para Platón flotaba en un mundo aparte, ancorando la forma en las cosas mismas.",
            },
            {
                type: "classify",
                prompt: "Para una estatua de bronce que representa a un héroe, identifica cada una de las 4 causas de Aristóteles.",
                categories: ["Causa material", "Causa formal", "Causa eficiente", "Causa final"],
                items: [
                    { text: "El bronce del que está hecha", cat: 0 },
                    { text: "La forma o figura de héroe que tiene", cat: 1 },
                    { text: "El escultor que la fabricó", cat: 2 },
                    { text: "El propósito de honrar la memoria del héroe", cat: 3 },
                ],
                exp: "Las 4 causas dan una explicación COMPLETA de cualquier cosa: de qué está hecha, qué forma tiene, quién/qué la produjo, y para qué existe.",
            },
            {
                type: "mc",
                prompt: "En el silogismo 'Todos los humanos son mortales; Sócrates es humano; por lo tanto, Sócrates es mortal', ¿qué hace que la conclusión sea válida?",
                options: [
                    "Que Sócrates era una persona famosa",
                    "Que la estructura lógica garantiza la conclusión SI las dos premisas son verdaderas",
                    "Que la frase suena convincente",
                    "Que el silogismo siempre es verdadero sin importar las premisas",
                ],
                answer: 1,
                exp: "La validez lógica depende de la FORMA del argumento, no de su contenido específico: si las premisas son ciertas y la estructura es correcta, la conclusión se sigue necesariamente.",
            },
            {
                type: "mc",
                prompt: "Según Aristóteles, la virtud de la generosidad es el término medio entre...",
                options: [
                    "La pereza y el trabajo excesivo",
                    "La avaricia (defecto: dar muy poco) y el derroche (exceso: dar de forma descontrolada)",
                    "La valentía y la cobardía",
                    "La tristeza y la alegría",
                ],
                answer: 1,
                exp: "Cada virtud se ubica entre dos vicios opuestos. La generosidad evita tanto la mezquindad de no dar nada como el descontrol de gastar/dar sin medida.",
            },
            {
                type: "mc",
                prompt: "Para Aristóteles, la eudaimonía (felicidad/florecimiento) se alcanza principalmente mediante...",
                options: [
                    "El placer momentáneo e inmediato",
                    "Vivir y actuar de acuerdo con la virtud y la razón, a lo largo de toda una vida",
                    "Acumular la mayor riqueza posible",
                    "Evitar por completo cualquier dificultad",
                ],
                answer: 1,
                exp: "No es un estado de ánimo pasajero, sino el resultado de una vida bien vivida, guiada por la excelencia (areté) y la razón práctica.",
            },
        ],
    },
    {
        id: "sintesis",
        icon: "Compass",
        title: "Síntesis: el mapa completo",
        tag: "Une todo lo aprendido",
        accent: "#9c6b9c",
        theory: [
            { h: "De Mileto a Aristóteles: un solo hilo", p: "En apenas dos siglos (~VI–IV a.C.), el pensamiento griego pasó de explicar el mundo con dioses, a buscar UNA sustancia (Mileto), a debatir si el cambio es real (Heráclito/Parménides), a proponer varios principios combinables (Empédocles/Demócrito), a centrarse en el ser humano y la ética (Sócrates), a construir un sistema metafísico completo (Platón), y finalmente a sistematizar la lógica, la ciencia y la ética en un solo edificio (Aristóteles)." },
            { anim: "timeline" },
            { h: "Las ramas que se abrieron", p: "De estas primeras preguntas nacieron las grandes ramas de la filosofía que siguen vivas hoy: la METAFÍSICA (¿qué hay, en el fondo, en la realidad?), la EPISTEMOLOGÍA (¿cómo conocemos, y cómo distinguimos verdad de error?) y la ÉTICA (¿cómo debemos vivir, qué es lo bueno?)." },
            { anim: "bigquestions" },
            { h: "Por qué importa hoy", p: "No es solo historia: el método de cuestionar con argumentos en vez de aceptar por autoridad, la lógica formal de Aristóteles, la pregunta por si la realidad cambia o permanece, y la idea de que la ética requiere razón y no solo costumbre, son la base de la ciencia, el derecho y el pensamiento crítico moderno." },
            { tip: { icon: "🧭", text: "La próxima vez que alguien te pida 'definir bien tus términos' antes de discutir algo, está usando —sin saberlo— el método que Sócrates inventó hace 2400 años." } },
        ],
        exercises: [
            {
                type: "order",
                prompt: "Ordena estos hitos del pensamiento griego en su secuencia histórica correcta, del más antiguo al más reciente.",
                items: [
                    "Los mitos de Homero y Hesíodo explican el mundo mediante los dioses",
                    "Tales de Mileto busca el arché y propone el agua",
                    "Heráclito y Parménides debaten si el cambio es real o ilusorio",
                    "Empédocles y Demócrito proponen varios principios combinables (elementos, átomos)",
                    "Sócrates desplaza la pregunta filosófica hacia la ética y el ser humano",
                    "Platón propone el Mundo de las Ideas para conciliar cambio y permanencia",
                    "Aristóteles sistematiza la lógica, la ciencia natural y la ética",
                ],
                exp: "Cada etapa responde, en parte, a un problema que dejó abierto la anterior: el arché único no explicaba bien los opuestos, lo que lleva al ápeiron y luego a varios principios; el problema cambio/permanencia lleva a la solución de los dos mundos de Platón; y Aristóteles intenta resolver las tensiones que deja Platón con un sistema más anclado en la observación.",
            },
            {
                type: "classify",
                prompt: "Clasifica cada pregunta filosófica según la rama principal de la filosofía a la que pertenece.",
                categories: ["Metafísica", "Epistemología", "Ética"],
                items: [
                    { text: "¿De qué está hecha realmente la realidad última?", cat: 0 },
                    { text: "¿Cómo puedo estar seguro de que mi conocimiento es verdadero?", cat: 1 },
                    { text: "¿Qué es la justicia y cómo debo tratar a los demás?", cat: 2 },
                    { text: "¿El Ser es uno e inmutable, o todo cambia constantemente?", cat: 0 },
                ],
                exp: "Metafísica pregunta por lo que hay (el ser, la realidad última); epistemología pregunta por cómo conocemos y validamos el conocimiento; ética pregunta por cómo vivir y actuar bien. Estas tres ramas nacen, en germen, con los primeros filósofos griegos.",
            },
            {
                type: "mc",
                prompt: "¿Cuál de las siguientes describe MEJOR el método que comparten todos los filósofos vistos en este mundo, más allá de sus diferentes conclusiones?",
                options: [
                    "Todos estaban de acuerdo en las mismas respuestas",
                    "Todos defendían sus ideas con argumentos razonados, abiertos a ser cuestionados, en vez de apelar solo a la tradición o la autoridad divina",
                    "Todos rechazaban por completo usar la razón",
                    "Todos basaban sus teorías únicamente en experimentos de laboratorio",
                ],
                answer: 1,
                exp: "Lo que define a la filosofía, desde Mileto hasta Aristóteles, no es llegar a la MISMA conclusión, sino el compromiso compartido de argumentar y aceptar ser refutado por una razón mejor.",
            },
            {
                type: "mc",
                prompt: "¿Qué relación hay entre el método socrático (cuestionar definiciones con contraejemplos) y el pensamiento crítico que se valora hoy en ciencia y derecho?",
                options: [
                    "Ninguna relación, son cosas completamente distintas",
                    "Es prácticamente el mismo principio: poner a prueba una afirmación con preguntas, ejemplos y contraejemplos antes de aceptarla como válida",
                    "El pensamiento crítico moderno prohíbe hacer preguntas",
                    "Sócrates inventó la ciencia experimental moderna directamente",
                ],
                answer: 1,
                exp: "La exigencia de definir bien los términos, buscar contraejemplos y no aceptar una afirmación solo por autoridad es, en esencia, una versión moderna y formalizada del método socrático.",
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
            <div className="ph-grain" />
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
                    PRIMER LOGOS · de Mileto a Aristóteles · {completedCount}/{totalExercises} ejercicios resueltos
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
                <div style={styles.seal}><Scroll size={24} color="#1a1714" /></div>
                <div>
                    <div className="display" style={styles.brand}>PRIMER LOGOS</div>
                    <div className="mono" style={styles.brandSub}>FILOSOFÍA PRIMARIA · LOS PRIMEROS PENSADORES</div>
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
                <div className="mono" style={styles.fileTab}>ROLLO · ORIGEN DEL PENSAMIENTO OCCIDENTAL</div>
                <h1 className="display" style={styles.heroTitle}>Antes de la ciencia,<br /><span style={{ color: "#c9a227" }}>hubo una pregunta.</span></h1>
                <p style={styles.heroP}>
                    Recorre el nacimiento de la filosofía: del mito al logos, los primeros que buscaron de qué está hecho
                    el cosmos, la gran disputa entre el cambio y la permanencia, y los tres gigantes —Sócrates, Platón
                    y Aristóteles— que sentaron las bases del pensamiento occidental.
                    <strong style={{ color: "#e8dcc4" }}> 40% teoría, 60% práctica, con animaciones para cada idea.</strong>
                </p>
                <div style={styles.oathBox}>
                    <Sparkles size={16} color="#c9a227" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span><strong>Filosofía</strong> = philos (amor) + sophia (sabiduría). No es tener todas las
                    respuestas: es el amor por seguir preguntando con rigor, incluso cuando incomoda.</span>
                </div>
            </section>

            <div style={styles.gridLabel} className="mono">▸ MÓDULOS DEL ROLLO</div>
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
                                <span className="mono" style={styles.caseNo}>ROLLO {String(idx + 1).padStart(2, "0")}</span>
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
            <button onClick={onBack} style={styles.backBtn} className="mono"><ChevronLeft size={16} /> VOLVER AL ROLLO</button>

            <div style={{ ...styles.moduleHead, borderColor: m.accent }}>
                <div style={{ ...styles.cardIcon, borderColor: m.accent, color: m.accent, width: 48, height: 48 }}><Icon size={26} /></div>
                <div style={{ flex: 1 }}>
                    <h2 className="display" style={{ margin: 0, fontSize: 30, color: "#f0e6d2" }}>{m.title}</h2>
                    <div className="mono" style={{ fontSize: 12, color: "#9a9082", letterSpacing: 1 }}>{m.tag.toUpperCase()}</div>
                </div>
            </div>

            <div style={styles.tabs}>
                <Tab active={tab === "theory"} onClick={() => setTab("theory")} icon={<BookOpen size={15} />} label="TEORÍA · 40%" accent={m.accent} />
                <Tab active={tab === "practice"} onClick={() => setTab("practice")} icon={<Play size={15} />} label={`PRÁCTICA · ${solvedInModule}/${m.exercises.length}`} accent={m.accent} />
            </div>

            {tab === "theory" && (
                <section style={{ display: "grid", gap: 14, marginTop: 16 }}>
                    {m.theory.map((t, i) => {
                        if (t.anim) {
                            const Comp = ANIM_MAP[t.anim];
                            return Comp ? <Comp key={i} /> : null;
                        }
                        if (t.tip) {
                            return (
                                <div key={i} style={{ ...styles.tipBox, borderColor: m.accent }}>
                                    <span style={{ fontSize: 18 }}>{t.tip.icon}</span>
                                    <span>{t.tip.text}</span>
                                </div>
                            );
                        }
                        return (
                            <div key={i} style={styles.theoryCard}>
                                <div className="mono" style={{ ...styles.theoryNum, color: m.accent, borderColor: m.accent }}>{String(i + 1).padStart(2, "0")}</div>
                                <div>
                                    <h3 className="display" style={styles.theoryH}>{t.h}</h3>
                                    <p style={styles.theoryP}>{t.p}</p>
                                </div>
                            </div>
                        );
                    })}
                    <button onClick={() => setTab("practice")} style={{ ...styles.bigBtn, background: m.accent }}>
                        <Play size={17} /> Ir a la práctica
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
    if (data.type === "classify") return <ClassifyExercise index={index} data={data} accent={accent} already={already} onSolve={onSolve} />;
    if (data.type === "order") return <OrderExercise index={index} data={data} accent={accent} already={already} onSolve={onSolve} />;
    return <ChoiceExercise index={index} data={data} accent={accent} already={already} onSolve={onSolve} />;
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
        <div style={styles.exCard}>
            <div style={{ ...styles.exStripe, background: accent }} />
            <div style={styles.exHead}>
                <span className="mono" style={{ ...styles.exNo, color: accent, borderColor: accent }}>EJERCICIO {String(index + 1).padStart(2, "0")}</span>
                <span className="mono" style={styles.exBadge}>{multi ? "SELECCIÓN MÚLTIPLE" : "OPCIÓN ÚNICA"}</span>
            </div>
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
        </div>
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
        <div style={styles.exCard}>
            <div style={{ ...styles.exStripe, background: accent }} />
            <div style={styles.exHead}>
                <span className="mono" style={{ ...styles.exNo, color: accent, borderColor: accent }}>EJERCICIO {String(index + 1).padStart(2, "0")}</span>
                <span className="mono" style={styles.exBadge}>CLASIFICACIÓN</span>
            </div>
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
        </div>
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
        <div style={styles.exCard}>
            <div style={{ ...styles.exStripe, background: accent }} />
            <div style={styles.exHead}>
                <span className="mono" style={{ ...styles.exNo, color: accent, borderColor: accent }}>EJERCICIO {String(index + 1).padStart(2, "0")}</span>
                <span className="mono" style={styles.exBadge}>ORDENAR · ARRASTRA</span>
            </div>
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
        </div>
    );
}

/* shared action row for choice/classify/order */
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
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=EB+Garamond:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');
      .display{font-family:'Playfair Display',Georgia,serif;}
      .mono{font-family:'JetBrains Mono',monospace;}
      *{box-sizing:border-box;}
      .card{transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;}
      .card:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(0,0,0,.5);}
      button{cursor:pointer;font-family:inherit;}
      button:disabled{cursor:default;}
      .ph-grain{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:.4;mix-blend-mode:overlay;
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");}
      @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}

      /* ===== bloque de animaciones (compartido por todos los .ph-anim) ===== */
      .ph-anim{ background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.09); border-radius:13px; padding:18px 18px 14px; margin:4px 0; animation:fadeUp .4s ease; }
      .ph-anim-svg{ width:100%; height:auto; display:block; }
      .ph-anim-cap{ font-size:13.5px; color:#bdb196; line-height:1.55; margin:12px 0 2px; text-align:center; }
      .ph-slider{ width:100%; }

      /* mito -> logos */
      .ph-myth-row{ display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:4px; }
      .ph-myth-node{ display:flex; flex-direction:column; align-items:center; gap:5px; padding:8px 10px; opacity:.4; transition:opacity .3s; min-width:80px; }
      .ph-myth-node.active{ opacity:1; }
      .ph-myth-node.past{ opacity:.7; }
      .ph-myth-icon{ font-size:22px; }
      .ph-myth-label{ font-family:'JetBrains Mono',monospace; font-size:10px; color:#c9bfae; letter-spacing:1px; text-align:center; }
      .ph-myth-node.active .ph-myth-label{ color:#e8dcc4; font-weight:700; }
      .ph-myth-arrow{ color:#7d7361; font-size:16px; transition:color .3s; }
      .ph-myth-arrow.past{ color:#c9a227; }

      /* mileto */
      .ph-mileto-tabs{ display:flex; gap:6px; justify-content:center; flex-wrap:wrap; margin-bottom:14px; }
      .ph-mileto-tab{ font-family:'JetBrains Mono',monospace; font-size:11.5px; padding:7px 13px; border-radius:8px;
        border:1px solid rgba(255,255,255,.15); background:rgba(255,255,255,.03); color:#c9bfae; }
      .ph-mileto-tab.on{ background:rgba(255,255,255,.06); }
      .ph-mileto-stage{ text-align:center; }
      .ph-mileto-badge{ display:inline-block; font-family:'JetBrains Mono',monospace; font-size:13px; padding:8px 16px; border:1.5px solid; border-radius:20px; margin-bottom:8px; }

      /* río de heráclito */
      .ph-vs-row{ display:flex; align-items:center; justify-content:center; gap:18px; }
      .ph-vs-col{ flex:1; max-width:160px; display:flex; flex-direction:column; align-items:center; gap:6px;
        background:rgba(255,255,255,.03); border:1.5px solid rgba(255,255,255,.12); border-radius:12px; padding:16px 10px; color:#c9bfae; transition:.2s; }
      .ph-vs-col.on{ border-color:#c9a227; background:rgba(201,162,39,.08); color:#f0e0a8; }
      .ph-vs-tag{ font-size:14px; font-weight:700; }
      .ph-vs-sub{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:1px; color:#8a8178; }
      .ph-vs-mid{ font-family:'JetBrains Mono',monospace; font-size:13px; color:#7d7361; }

      /* esfera de parménides */
      .ph-sphere-wrap{ display:flex; justify-content:center; padding:10px 0; }
      .ph-sphere{ width:90px; height:90px; border-radius:50%; background:radial-gradient(circle at 35% 30%, #e8dcc4, #b5872c 70%, #6b4f1a);
        box-shadow:0 0 30px rgba(201,162,39,.3); transition:transform 1.2s ease, box-shadow 1.2s ease; }
      .ph-sphere.pulse{ transform:scale(1.08); box-shadow:0 0 46px rgba(201,162,39,.55); }

      /* 4 elementos */
      .ph-elem-toggle{ display:flex; gap:8px; justify-content:center; margin-bottom:14px; }
      .ph-elem-btn{ font-family:'JetBrains Mono',monospace; font-size:12px; padding:7px 14px; border-radius:8px;
        border:1px solid rgba(255,255,255,.15); background:rgba(255,255,255,.03); color:#c9bfae; }
      .ph-elem-btn.on{ background:rgba(201,162,39,.14); border-color:#c9a227; color:#f0e0a8; }
      .ph-elem-ring{ position:relative; width:160px; height:160px; margin:0 auto 6px; }
      .ph-elem-dot{ position:absolute; width:54px; height:54px; border-radius:50%; display:flex; align-items:center; justify-content:center;
        font-family:'JetBrains Mono',monospace; font-size:10px; color:#1a1714; font-weight:700; transition:all 1s ease; }
      .ph-elem-ring.amor .ph-elem-dot{ top:53px; left:53px; transform: rotate(calc(var(--i) * 90deg)) translate(0, -65px) rotate(calc(var(--i) * -90deg)); }
      .ph-elem-ring.discordia .ph-elem-dot{ top:53px; left:53px; transform: rotate(calc(var(--i) * 90deg)) translate(0, -110px) rotate(calc(var(--i) * -90deg)); }

      /* mayéutica diálogo */
      .ph-dialog{ display:flex; flex-direction:column; gap:8px; }
      .ph-dialog-line{ font-size:13.5px; line-height:1.5; padding:9px 13px; border-radius:9px; opacity:.35; transition:opacity .3s;
        background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); }
      .ph-dialog-line.active{ opacity:1; border-color:#c9a227; background:rgba(201,162,39,.08); }
      .ph-dialog-line.past{ opacity:.65; }
      .ph-dialog-who{ font-weight:700; color:#c9a227; margin-right:5px; }
      .ph-dialog-line.other .ph-dialog-who{ color:#7ea8be; }

      /* término medio (slider) */
      .ph-mean-track{ display:flex; justify-content:space-between; font-family:'JetBrains Mono',monospace; font-size:10.5px; color:#8a8178; margin-top:4px; }
      .ph-mean-result{ text-align:center; font-weight:700; font-size:15px; margin-top:10px; }

      /* timeline */
      .ph-tl-track{ display:flex; justify-content:center; gap:6px; margin-bottom:14px; }
      .ph-tl-dot{ width:11px; height:11px; border-radius:50%; border:none; background:rgba(255,255,255,.15); cursor:pointer; transition:.2s; }
      .ph-tl-dot.active{ background:#c9a227; transform:scale(1.3); }
      .ph-tl-dot.past{ background:#5b8c5a; }
      .ph-tl-card{ text-align:center; padding:8px 0 4px; }
      .ph-tl-year{ font-family:'JetBrains Mono',monospace; font-size:12px; color:#c9a227; letter-spacing:1px; }
      .ph-tl-text{ font-size:15px; color:#e4d9c1; margin-top:6px; line-height:1.4; }
      .ph-tl-nav{ display:flex; justify-content:space-between; margin-top:14px; }
      .ph-tl-nav button{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#c9bfae; background:rgba(255,255,255,.04);
        border:1px solid rgba(255,255,255,.14); border-radius:7px; padding:7px 12px; }
      .ph-tl-nav button:disabled{ opacity:.3; }

      /* preguntas grandes */
      .ph-bq-row{ display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
      .ph-bq-card{ flex:1; min-width:140px; max-width:180px; display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center;
        background:rgba(255,255,255,.03); border:1.5px solid rgba(255,255,255,.1); border-radius:12px; padding:14px 10px; transition:.3s; }
      .ph-bq-card.active{ border-color:#c9a227; background:rgba(201,162,39,.08); transform:translateY(-3px); }
      .ph-bq-icon{ font-size:22px; }
      .ph-bq-q{ font-size:13px; color:#e4d9c1; line-height:1.3; }
      .ph-bq-branch{ font-family:'JetBrains Mono',monospace; font-size:9.5px; color:#8a8178; letter-spacing:.5px; }

      /* mundos de platón */
      .ph-worlds{ display:flex; align-items:stretch; gap:6px; }
      .ph-world-col{ flex:1; display:flex; flex-direction:column; gap:7px; padding:10px; border-radius:10px; }
      .ph-world-col.sensible{ background:rgba(226,112,111,.06); border:1px solid rgba(226,112,111,.25); }
      .ph-world-col.ideas{ background:rgba(58,160,255,.06); border:1px solid rgba(58,160,255,.25); }
      .ph-world-h{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:1px; color:#c9bfae; text-align:center; }
      .ph-world-sub{ font-size:10.5px; color:#8a8178; text-align:center; margin-bottom:4px; line-height:1.3; }
      .ph-world-item{ font-size:12px; color:#d9cdb8; background:rgba(255,255,255,.03); border-radius:7px; padding:7px 9px; transition:.2s; }
      .ph-world-item.hi{ background:rgba(201,162,39,.15); }
      .ph-world-arrowcol{ display:flex; flex-direction:column; justify-content:flex-end; gap:7px; padding-top:38px; }
      .ph-world-arrow{ font-size:13px; color:#5d544a; opacity:.7; transition:.2s; height: 33px; display:flex; align-items:center; }
      .ph-world-arrow.hi{ color:#c9a227; opacity:1; }

      /* caverna */
      .ph-cave-tabs{ display:flex; gap:6px; justify-content:center; margin-bottom:10px; flex-wrap:wrap; }
      .ph-cave-tab{ font-family:'JetBrains Mono',monospace; font-size:10.5px; padding:6px 11px; border-radius:8px;
        border:1px solid rgba(255,255,255,.15); background:rgba(255,255,255,.03); color:#c9bfae; }
      .ph-cave-tab.on{ background:rgba(201,162,39,.14); border-color:#c9a227; color:#f0e0a8; }

      /* 4 causas */
      .ph-causes-tabs{ display:flex; gap:6px; justify-content:center; margin-bottom:10px; flex-wrap:wrap; }
      .ph-causes-tab{ font-family:'JetBrains Mono',monospace; font-size:11px; padding:7px 12px; border-radius:8px;
        border:1px solid rgba(255,255,255,.15); background:rgba(255,255,255,.03); color:#c9bfae; }
      .ph-causes-tab.on{ background:rgba(255,255,255,.06); }
      .ph-causes-stage{ text-align:center; }
      .ph-causes-statue{ font-size:46px; margin-bottom:4px; }
    `}</style>
    );
}

const styles = {
    root: {
        minHeight: "100vh",
        background: "radial-gradient(1200px 700px at 70% -10%, #221d2a 0%, #14111d 45%, #0c0a10 100%)",
        color: "#d9cdb8",
        fontFamily: "'EB Garamond', Georgia, serif",
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
    brandSub: { fontSize: 10, color: "#9a8d6f", letterSpacing: 1.5, marginTop: 3 },
    rankBox: { display: "flex", alignItems: "center", gap: 14 },
    xpBarTrack: { height: 7, background: "rgba(255,255,255,.08)", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)" },
    xpBarFill: { height: "100%", background: "linear-gradient(90deg,#9c6b9c,#e8cf86)", transition: "width .5s ease" },
    resetBtn: { width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(255,255,255,.15)", background: "transparent", color: "#9a8d6f", display: "grid", placeItems: "center" },

    hero: { marginBottom: 26, animation: "fadeUp .5s ease" },
    fileTab: { display: "inline-block", fontSize: 11, letterSpacing: 2, color: "#1a1714", background: "#c9a227", padding: "5px 12px", borderRadius: "3px 3px 0 0", marginBottom: 14 },
    heroTitle: { fontSize: 44, lineHeight: 1.06, margin: "0 0 14px", color: "#f4ead6", fontWeight: 900 },
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
        background: "linear-gradient(180deg,#1c1825,#17131f)", border: "1px solid rgba(255,255,255,.1)",
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
    tipBox: { display: "flex", gap: 10, alignItems: "flex-start", background: "rgba(255,255,255,.03)", border: "1px solid", borderRadius: 10, padding: "13px 16px", fontSize: 14, lineHeight: 1.55, color: "#cabd9f" },
    bigBtn: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, padding: "13px 18px", border: "none", borderRadius: 10, color: "#1a1714", fontSize: 15, fontWeight: 700, fontFamily: "'EB Garamond',serif", marginTop: 4, width: "100%" },

    exCard: { position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#1b1722,#16121d)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 13, padding: "18px 20px 20px", animation: "fadeUp .4s ease" },
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

    checkBtn: { marginTop: 14, width: "100%", padding: "12px", background: "transparent", border: "1.5px solid", borderRadius: 10, fontSize: 14.5, fontWeight: 700, letterSpacing: .5, fontFamily: "'EB Garamond',serif" },
    verdict: { marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 14px", border: "1px solid", borderRadius: 10, background: "rgba(0,0,0,.2)" },
    retryBtn: { background: "transparent", border: "1px solid rgba(255,255,255,.2)", color: "#cabd9f", fontSize: 11, letterSpacing: 1, padding: "6px 10px", borderRadius: 7, display: "inline-flex", alignItems: "center", gap: 5 },
    expBox: { display: "flex", gap: 9, marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.1)", fontSize: 14, lineHeight: 1.55, color: "#c2b69c" },

    orderItem: { display: "flex", alignItems: "center", gap: 11, border: "1px solid", borderRadius: 9, padding: "10px 12px" },
    orderNum: { width: 24, height: 24, flexShrink: 0, borderRadius: 6, color: "#1a1714", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700 },
    orderArrow: { width: 24, height: 18, display: "grid", placeItems: "center", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 5, color: "#cabd9f", padding: 0 },

    footer: { textAlign: "center", marginTop: 34, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.08)", fontSize: 11, letterSpacing: 1.5, color: "#6e6657", fontFamily: "'JetBrains Mono',monospace" },
};