import React, { useState, useEffect, useMemo } from "react";
import {
    Disc3, Music, Radio, Star, Award, Check, ChevronLeft, ChevronRight,
    Flame, RotateCcw, Mic, Headphones,
} from "lucide-react";

/* ============================================================
   ROCK ROOTS // Historia de la música y el rock
   Mundo autónomo. Progreso guardado en localStorage.
   ── IMÁGENES REALES ──
   Cada era tiene un campo  img: ""  . Pega ahí la URL de una
   imagen (con licencia libre, p.ej. de Wikimedia Commons) y
   aparece automáticamente. Si lo dejas vacío, se muestra un
   vinilo animado hecho con CSS.
   ============================================================ */

const SAVE_KEY = "rock_progress_v1";

const ERAS = [
    {
        id: "raices", decade: "1900–1940s", title: "Las raíces: blues, gospel y country",
        color: "#b5651d", img: "",
        blurb: "El rock no nació de la nada: es hijo del blues afroamericano, el gospel de las iglesias y el country rural de Estados Unidos.",
        body: [
            "A principios del siglo XX, en el sur de Estados Unidos, los afroamericanos crearon el blues a partir de cantos de trabajo, spirituals y la tradición africana. Su estructura de 12 compases y las 'blue notes' son el ADN de casi todo lo que vino después.",
            "El gospel aportó la potencia vocal y la emoción; el country, las guitarras y las historias del campo. Cuando estas corrientes se mezclaron en las ciudades, encendieron la chispa.",
        ],
        hitos: [
            "El blues del Delta del Misisipi (Robert Johnson) define la guitarra expresiva.",
            "El gospel da la fuerza vocal que luego tendrán el soul y el rock.",
            "El country y el rhythm & blues empiezan a cruzarse en la radio.",
        ],
        escena: ["Blues", "Gospel", "Country", "Rhythm & Blues"],
        quiz: { q: "¿Cuál es la base musical directa del rock & roll?", opts: ["La música clásica europea", "El blues y el rhythm & blues", "El jazz de big band", "La música electrónica"], correct: 1, fb: "El rock & roll surge de acelerar y electrificar el rhythm & blues, hijo del blues." },
    },
    {
        id: "rocknroll", decade: "1950s", title: "Nace el rock & roll",
        color: "#e2706f", img: "",
        blurb: "En los años 50 explota el rock & roll: ritmo acelerado, guitarra eléctrica y una juventud que por fin tiene su propia música.",
        body: [
            "A mediados de los 50, artistas mezclaron rhythm & blues con country y crearon algo nuevo, rápido y bailable. La guitarra eléctrica pasó al frente y el backbeat (el golpe en el 2 y el 4) se volvió la firma del género.",
            "Fue también un fenómeno social: por primera vez los adolescentes tenían dinero, radios y una identidad propia. El rock & roll rompió barreras raciales en la música popular y escandalizó a la generación anterior.",
        ],
        hitos: [
            "La guitarra eléctrica se convierte en el instrumento estrella.",
            "El 'backbeat' marca el pulso que define al rock.",
            "Nace la cultura adolescente como mercado y como identidad.",
        ],
        escena: ["Rock & Roll", "Rockabilly", "Doo-wop"],
        quiz: { q: "¿Qué elemento rítmico es la firma del rock & roll?", opts: ["El backbeat (golpe en 2 y 4)", "El vals", "El silencio", "El trémolo lento"], correct: 0, fb: "El backbeat —el acento en los tiempos 2 y 4— es el latido inconfundible del rock." },
    },
    {
        id: "sesenta", decade: "1960s", title: "La invasión británica y los 60s",
        color: "#e6c068", img: "",
        blurb: "Bandas británicas reinterpretan el blues y el rock americano y conquistan el mundo. La canción de 3 minutos se vuelve un arte.",
        body: [
            "A inicios de los 60, grupos del Reino Unido tomaron el rock & roll y el blues estadounidense, los reinventaron y los devolvieron al mundo con una fuerza arrolladora: fue la 'invasión británica'.",
            "El formato de banda (dos guitarras, bajo y batería) se estandarizó. Las letras maduraron, los arreglos se volvieron más ambiciosos y el álbum empezó a importar tanto como el sencillo.",
        ],
        hitos: [
            "Se consolida el formato clásico de banda de rock.",
            "El estudio de grabación se vuelve un instrumento más.",
            "El álbum gana peso artístico frente al sencillo.",
        ],
        escena: ["British Invasion", "Folk Rock", "Surf Rock", "Soul"],
        quiz: { q: "¿Qué fue la 'invasión británica'?", opts: ["Una gira de orquestas", "Bandas del Reino Unido que dominaron el rock mundial en los 60", "Un festival en Londres", "Un sello discográfico"], correct: 1, fb: "Grupos británicos reinterpretaron el rock americano y conquistaron las listas de todo el mundo." },
    },
    {
        id: "psicodelia", decade: "Finales 60s", title: "Psicodelia y contracultura",
        color: "#cf9aff", img: "",
        blurb: "El rock se vuelve experimental: efectos, estructuras largas y un mensaje de paz, protesta y expansión mental.",
        body: [
            "Hacia el final de los 60, el rock psicodélico llevó el sonido a territorios nuevos: distorsión, efectos de estudio, letras surrealistas y canciones que rompían el formato de 3 minutos.",
            "Fue inseparable de la contracultura: protestas contra la guerra, movimientos por los derechos civiles y festivales masivos como símbolo de una generación. La música ya no solo entretenía, también opinaba.",
        ],
        hitos: [
            "La experimentación de estudio se vuelve central.",
            "Los grandes festivales nacen como fenómeno cultural.",
            "El rock se asocia a la protesta y al cambio social.",
        ],
        escena: ["Psicodelia", "Acid Rock", "Protesta", "Blues Rock"],
        quiz: { q: "¿Qué caracteriza al rock psicodélico?", opts: ["Canciones muy cortas y simples", "Experimentación, efectos y letras surrealistas", "Solo instrumentos acústicos", "Ritmos de baile electrónico"], correct: 1, fb: "La psicodelia abrazó la experimentación de estudio, los efectos y las letras expansivas." },
    },
    {
        id: "setenta", decade: "1970s", title: "Hard rock, prog y la furia punk",
        color: "#5fb8ff", img: "",
        blurb: "El rock se ramifica: más pesado (hard rock y metal), más complejo (progresivo) y más crudo y rebelde (punk).",
        body: [
            "Los 70 fueron la gran ramificación. El hard rock y el heavy metal subieron el volumen y la distorsión. El rock progresivo apostó por suites largas, virtuosismo y conceptos ambiciosos.",
            "A mitad de la década, como reacción al exceso, estalló el punk: canciones rápidas, cortas, actitud cruda y el mensaje de que cualquiera podía formar una banda. Tres acordes y mucha energía.",
        ],
        hitos: [
            "Nace el heavy metal y se dispara el volumen.",
            "El rock progresivo explora suites largas y conceptuales.",
            "El punk responde con crudeza y la filosofía 'hazlo tú mismo'.",
        ],
        escena: ["Hard Rock", "Heavy Metal", "Rock Progresivo", "Punk", "Glam"],
        quiz: { q: "¿Cuál fue la idea central del punk de los 70?", opts: ["Virtuosismo y solos largos", "Crudeza, rapidez y 'cualquiera puede tocar'", "Orquestas sinfónicas", "Baladas románticas"], correct: 1, fb: "El punk reaccionó contra el exceso con energía cruda y la actitud do-it-yourself." },
    },
    {
        id: "ochenta", decade: "1980s", title: "Metal, new wave y MTV",
        color: "#5cc88a", img: "",
        blurb: "Los sintetizadores, el video musical y el metal conviven. La imagen se vuelve tan importante como el sonido.",
        body: [
            "En los 80, el metal se diversificó (thrash, glam metal) y el new wave fusionó el punk con sintetizadores y pop. La tecnología —cajas de ritmo, teclados, producción brillante— cambió el sonido.",
            "El video musical, impulsado por la televisión, convirtió la imagen en parte esencial del éxito. Una banda ya no solo se escuchaba: se veía. El espectáculo y el estilo pasaron al primer plano.",
        ],
        hitos: [
            "El sintetizador y la caja de ritmos transforman el sonido.",
            "El video musical vuelve la imagen clave para triunfar.",
            "El metal se ramifica en thrash, glam y más.",
        ],
        escena: ["New Wave", "Glam Metal", "Thrash Metal", "Post-Punk", "Synth-Pop"],
        quiz: { q: "¿Qué tecnología cambió la cara del rock en los 80?", opts: ["El vinilo", "El video musical y los sintetizadores", "La radio AM", "El piano acústico"], correct: 1, fb: "El video musical y los teclados/sintetizadores redefinieron el sonido y la imagen de la década." },
    },
    {
        id: "noventa", decade: "1990s", title: "Grunge y rock alternativo",
        color: "#9aa3b2", img: "",
        blurb: "Como reacción a los excesos de los 80, llega un rock crudo, honesto y emocional: el grunge y lo alternativo.",
        body: [
            "Los 90 trajeron el grunge desde el noroeste de EE.UU.: distorsión sucia, melodías oscuras y letras introspectivas que hablaban de angustia y desencanto. Fue la antítesis del brillo de los 80.",
            "El rock 'alternativo' agrupó decenas de estilos fuera del mainstream que, paradójicamente, se volvieron mainstream. La autenticidad y la actitud anti-pose marcaron el tono de la década.",
        ],
        hitos: [
            "El grunge impone crudeza y honestidad emocional.",
            "Lo 'alternativo' pasa del underground a las listas.",
            "La autenticidad se vuelve el valor más cotizado.",
        ],
        escena: ["Grunge", "Alternativo", "Britpop", "Nu Metal", "Indie"],
        quiz: { q: "El grunge surgió como reacción a...", opts: ["El blues", "El brillo y los excesos del rock de los 80", "La música clásica", "El jazz"], correct: 1, fb: "El grunge contrapuso crudeza y honestidad al exceso estilístico de los 80." },
    },
    {
        id: "moderno", decade: "2000s →", title: "El rock en la era digital",
        color: "#478cbf", img: "",
        blurb: "Internet, el streaming y la fusión de géneros redefinen qué significa 'rock' en el siglo XXI.",
        body: [
            "Con el nuevo milenio llegó el revival del garage e indie rock, el post-punk renovado y un sinfín de fusiones con electrónica, hip-hop y pop. La línea entre géneros se volvió difusa.",
            "El streaming cambió cómo se descubre y consume la música: de comprar discos a tener todo el catálogo de la historia en el bolsillo. El rock dejó de ser el centro absoluto del pop, pero su ADN sigue en casi todo.",
        ],
        hitos: [
            "El streaming reemplaza la compra de discos físicos.",
            "Las fronteras entre géneros casi desaparecen.",
            "El legado del rock sigue presente en el pop actual.",
        ],
        escena: ["Indie", "Post-Punk Revival", "Garage Rock", "Fusión", "Rock Latino"],
        quiz: { q: "¿Qué transformó más el consumo de música en el siglo XXI?", opts: ["El casete", "El streaming digital", "La radio FM", "El vinilo de 45 RPM"], correct: 1, fb: "El streaming puso toda la historia de la música en el bolsillo y cambió cómo se descubre." },
    },
];

const RANKS = [
    { min: 0, name: "Oyente" },
    { min: 120, name: "Coleccionista" },
    { min: 300, name: "Melómano" },
    { min: 500, name: "Crítico" },
    { min: 800, name: "Historiador del Rock" },
];
const rankFor = (xp) => RANKS.filter((r) => xp >= r.min).pop();

const load = () => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
.rk{ position:relative; min-height:100vh; width:100%; font-family:'Inter',system-ui,sans-serif; color:#f2ece4; overflow-x:hidden;
  background:
    radial-gradient(900px 500px at 85% -10%, rgba(226,112,111,.14), transparent 60%),
    radial-gradient(800px 500px at 0% 110%, rgba(207,154,255,.10), transparent 55%),
    #0e0c10; }
.rk *{ box-sizing:border-box; }
.rk-wrap{ max-width:1000px; margin:0 auto; padding:40px 22px 80px; position:relative; z-index:1; }
.rk-head{ text-align:center; margin-bottom:6px; }
.rk-kick{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:5px; color:#7a7080; }
.rk-title{ font-family:'Anton',sans-serif; font-size:64px; letter-spacing:1px; line-height:.95; margin:8px 0; text-transform:uppercase; }
.rk-title .r{ color:#e2706f; text-shadow:0 0 30px rgba(226,112,111,.4); }
.rk-sub{ color:#9a92a0; font-size:16px; max-width:560px; margin:0 auto; }
.rk-rank{ display:flex; gap:16px; align-items:center; justify-content:center; margin:24px auto 8px; flex-wrap:wrap; }
.rk-rbox{ display:flex; align-items:center; gap:11px; border:1px solid #2a2530; background:#16131a; border-radius:12px; padding:11px 16px; }
.rk-rl{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:2px; color:#7a7080; }
.rk-rn{ font-size:17px; font-weight:700; }
.rk-bar{ width:200px; height:8px; border-radius:99px; background:#16131a; border:1px solid #2a2530; overflow:hidden; }
.rk-bar i{ display:block; height:100%; background:linear-gradient(90deg,#e2706f,#e6c068); transition:width .6s; }
.rk-time{ margin-top:30px; display:flex; flex-direction:column; gap:12px; }
.rk-era{ display:flex; align-items:center; gap:18px; cursor:pointer; border:1px solid #221e28; border-radius:16px;
  padding:16px 18px; background:linear-gradient(180deg,#16131b,#110f15); transition:.18s; text-align:left; }
.rk-era:hover{ transform:translateX(5px); border-color:var(--c); }
.rk-vinyl{ width:60px; height:60px; border-radius:50%; flex:none; position:relative;
  background:repeating-radial-gradient(circle at 50% 50%, #0a090c 0 2px, #18151c 2px 4px); border:1px solid #2a2530; }
.rk-vinyl::after{ content:''; position:absolute; inset:0; margin:auto; width:18px; height:18px; border-radius:50%;
  background:var(--c); box-shadow:0 0 12px var(--c); }
.rk-era.done .rk-vinyl::before{ content:'✓'; position:absolute; top:-4px; right:-4px; width:20px; height:20px; border-radius:50%;
  background:#5cc88a; color:#0e0c10; font-size:12px; font-weight:700; display:grid; place-items:center; z-index:2; }
.rk-em{ flex:1; min-width:0; }
.rk-edec{ font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--c); letter-spacing:1px; }
.rk-et{ font-size:18px; font-weight:700; margin:2px 0; }
.rk-eb{ font-size:13px; color:#9a92a0; }
.rk-epct{ font-family:'JetBrains Mono',monospace; font-size:12px; color:#7a7080; flex:none; }

/* vista de era */
.rk-back{ display:inline-flex; align-items:center; gap:6px; background:none; border:none; color:#9a92a0;
  font-family:'JetBrains Mono',monospace; font-size:12px; cursor:pointer; padding:6px 0; margin-bottom:8px; }
.rk-back:hover{ color:#e2706f; }
.rk-hero{ display:flex; gap:24px; align-items:center; margin:6px 0 18px; flex-wrap:wrap; }
.rk-disc{ width:170px; height:170px; flex:none; border-radius:50%; position:relative; overflow:hidden;
  background:repeating-radial-gradient(circle at 50% 50%, #0a090c 0 3px, #1a161f 3px 6px);
  border:1px solid #2a2530; box-shadow:0 14px 40px rgba(0,0,0,.5); animation:spin 7s linear infinite; }
.rk-disc.photo{ animation:none; background-size:cover; background-position:center; }
.rk-disc::after{ content:''; position:absolute; inset:0; margin:auto; width:46px; height:46px; border-radius:50%;
  background:var(--c); box-shadow:0 0 22px var(--c); }
.rk-disc.photo::after{ display:none; }
@keyframes spin{ to{ transform:rotate(360deg); } }
.rk-htxt{ flex:1; min-width:240px; }
.rk-htxt .dec{ font-family:'JetBrains Mono',monospace; color:var(--c); letter-spacing:2px; font-size:13px; }
.rk-htxt h2{ font-family:'Anton',sans-serif; font-size:40px; line-height:1; margin:6px 0 10px; text-transform:uppercase; }
.rk-htxt p{ color:#bcb4c2; font-size:15px; line-height:1.55; margin:0; }
.rk-card{ border:1px solid #221e28; border-radius:16px; padding:22px; background:#13111a; margin:16px 0; }
.rk-card p{ font-size:15px; line-height:1.7; color:#d8d2dd; margin:0 0 12px; }
.rk-lab{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:2px; color:var(--c); margin:6px 0 12px; display:flex; align-items:center; gap:8px; }
.rk-hitos{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:9px; }
.rk-hitos li{ display:flex; gap:10px; font-size:14.5px; color:#d8d2dd; }
.rk-hitos li b{ color:var(--c); }
.rk-chips{ display:flex; flex-wrap:wrap; gap:8px; margin-top:6px; }
.rk-chip{ font-family:'JetBrains Mono',monospace; font-size:12px; padding:6px 12px; border-radius:99px;
  border:1px solid var(--c); color:var(--c); background:rgba(255,255,255,.02); }
.rk-quiz{ border:1px solid #2a2530; border-radius:16px; padding:20px; background:#16131a; margin:16px 0; }
.rk-q{ font-size:16px; font-weight:600; margin-bottom:12px; }
.rk-opt{ display:block; width:100%; text-align:left; background:#1b1822; border:1px solid #2a2530; color:#f2ece4;
  padding:12px 15px; border-radius:10px; margin:7px 0; font-size:14.5px; cursor:pointer; transition:.14s; font-family:inherit; }
.rk-opt:hover{ border-color:var(--c); }
.rk-opt.ok{ background:rgba(92,200,138,.14); border-color:#5cc88a; color:#aef0c6; }
.rk-opt.no{ background:rgba(226,112,111,.14); border-color:#e2706f; color:#f0aeb2; }
.rk-fb{ font-size:13.5px; margin-top:10px; line-height:1.5; }
.rk-nav{ display:flex; justify-content:space-between; gap:10px; margin-top:22px; }
.rk-btn{ font-family:'JetBrains Mono',monospace; font-size:13px; padding:11px 18px; border-radius:10px; cursor:pointer;
  border:1px solid #2a2530; background:#1b1822; color:#f2ece4; display:inline-flex; align-items:center; gap:7px; }
.rk-btn:hover:not(:disabled){ border-color:var(--c); } .rk-btn:disabled{ opacity:.35; cursor:default; }
.rk-btn.main{ background:var(--c); color:#0e0c10; border-color:var(--c); font-weight:700; }
.rk-foot{ text-align:center; margin-top:36px; }
.rk-reset{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#e2706f; background:transparent;
  border:1px solid rgba(226,112,111,.3); border-radius:8px; padding:8px 14px; cursor:pointer; }
.rk-reset:hover{ background:rgba(226,112,111,.1); }
@media(max-width:560px){ .rk-title{ font-size:46px; } .rk-htxt h2{ font-size:30px; } }
`;

export default function App() {
    const saved = load();
    const [open, setOpen] = useState(null);           // índice de era abierta o null
    const [read, setRead] = useState(saved.read || {});
    const [quiz, setQuiz] = useState(saved.quiz || {});
    const [picked, setPicked] = useState(null);

    useEffect(() => {
        try { localStorage.setItem(SAVE_KEY, JSON.stringify({ read, quiz })); } catch {}
    }, [read, quiz]);

    const isDone = (i) => read[ERAS[i].id] && quiz[ERAS[i].id];
    const completas = ERAS.filter((_, i) => isDone(i)).length;
    const xp = completas * 100 + Object.keys(quiz).length * 20;
    const rank = rankFor(xp);
    const next = RANKS.find((r) => xp < r.min);
    const pct = next ? Math.min(100, ((xp - rank.min) / (next.min - rank.min)) * 100) : 100;

    const openEra = (i) => {
        setOpen(i); setPicked(quiz[ERAS[i].id] ? ERAS[i].quiz.correct : null);
        setRead((r) => ({ ...r, [ERAS[i].id]: true }));
        window.scrollTo(0, 0);
    };

    /* ---------- vista de era ---------- */
    if (open != null) {
        const e = ERAS[open];
        const answered = quiz[e.id] != null || picked != null;
        const choose = (k) => {
            if (picked != null) return;
            setPicked(k);
            if (k === e.quiz.correct) setQuiz((q) => ({ ...q, [e.id]: true }));
        };
        return (
            <div className="rk" style={{ "--c": e.color }}>
                <style>{CSS}</style>
                <div className="rk-wrap">
                    <button className="rk-back" onClick={() => setOpen(null)}><ChevronLeft size={15} /> TODAS LAS ERAS</button>

                    <div className="rk-hero">
                        <div className={`rk-disc ${e.img ? "photo" : ""}`} style={e.img ? { backgroundImage: `url(${e.img})` } : {}} />
                        <div className="rk-htxt">
                            <div className="dec">{e.decade}</div>
                            <h2>{e.title}</h2>
                            <p>{e.blurb}</p>
                        </div>
                    </div>

                    <div className="rk-card">
                        {e.body.map((p, i) => <p key={i}>{p}</p>)}
                    </div>

                    <div className="rk-card">
                        <div className="rk-lab"><Flame size={13} /> HITOS CLAVE</div>
                        <ul className="rk-hitos">
                            {e.hitos.map((h, i) => <li key={i}><b>▸</b> {h}</li>)}
                        </ul>
                        <div className="rk-lab" style={{ marginTop: 18 }}><Headphones size={13} /> ESCENA Y GÉNEROS</div>
                        <div className="rk-chips">{e.escena.map((s) => <span key={s} className="rk-chip">{s}</span>)}</div>
                    </div>

                    <div className="rk-quiz">
                        <div className="rk-lab"><Music size={13} /> QUIZ</div>
                        <div className="rk-q">{e.quiz.q}</div>
                        {e.quiz.opts.map((o, k) => {
                            let cls = "rk-opt";
                            if (answered) { if (k === e.quiz.correct) cls += " ok"; else if (k === picked) cls += " no"; }
                            return <button key={k} className={cls} onClick={() => choose(k)}>{o}</button>;
                        })}
                        {answered && (
                            <div className="rk-fb" style={{ color: (quiz[e.id] || picked === e.quiz.correct) ? "#5cc88a" : "#e2706f" }}>
                                {(quiz[e.id] || picked === e.quiz.correct) ? "✓ " : "✗ "}{e.quiz.fb}
                            </div>
                        )}
                    </div>

                    <div className="rk-nav">
                        <button className="rk-btn" disabled={open === 0} onClick={() => openEra(open - 1)}>
                            <ChevronLeft size={15} /> Anterior
                        </button>
                        <button className="rk-btn main" disabled={open === ERAS.length - 1} onClick={() => openEra(open + 1)}>
                            Siguiente <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ---------- mapa / línea de tiempo ---------- */
    return (
        <div className="rk">
            <style>{CSS}</style>
            <div className="rk-wrap">
                <div className="rk-head">
                    <div className="rk-kick">// EVOLUTIVE</div>
                    <h1 className="rk-title">HISTORIA DEL <span className="r">ROCK</span></h1>
                    <p className="rk-sub">Del blues del Delta al streaming: recorre cada era, escucha su contexto y demuestra lo aprendido.</p>
                </div>

                <div className="rk-rank">
                    <div className="rk-rbox">
                        <Disc3 size={20} color="#e6c068" />
                        <div>
                            <div className="rk-rl">RANGO</div>
                            <div className="rk-rn">{rank.name}</div>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#7a7080", marginBottom: 5 }}>
                            <span>{xp} XP · {completas}/{ERAS.length} eras</span>
                            <span>{next ? `→ ${next.name}` : "MÁX"}</span>
                        </div>
                        <div className="rk-bar"><i style={{ width: pct + "%" }} /></div>
                    </div>
                </div>

                <div className="rk-time">
                    {ERAS.map((e, i) => {
                        const done = isDone(i);
                        const p = (read[e.id] ? 50 : 0) + (quiz[e.id] ? 50 : 0);
                        return (
                            <div key={e.id} className={`rk-era ${done ? "done" : ""}`} style={{ "--c": e.color }} onClick={() => openEra(i)}>
                                <div className="rk-vinyl" />
                                <div className="rk-em">
                                    <div className="rk-edec">{e.decade}</div>
                                    <div className="rk-et">{e.title}</div>
                                    <div className="rk-eb">{e.blurb}</div>
                                </div>
                                <div className="rk-epct">{p}%</div>
                            </div>
                        );
                    })}
                </div>

                <div className="rk-foot">
                    <button className="rk-reset" onClick={() => {
                        if (window.confirm("¿Reiniciar el progreso de Historia del Rock?")) { setRead({}); setQuiz({}); }
                    }}>
                        <RotateCcw size={11} style={{ verticalAlign: "-1px", marginRight: 5 }} /> Reiniciar progreso
                    </button>
                </div>
            </div>
        </div>
    );
}