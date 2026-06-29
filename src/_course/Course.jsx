import React, { useState, useEffect, useRef } from "react";
import {
    BookOpen, Play, Award, ChevronLeft, ChevronRight, Eye, EyeOff, Check, RotateCcw,
} from "lucide-react";

/* ============================================================
   MOTOR DE CURSO COMPARTIDO (NEXUS)
   Un solo componente que renderiza cualquier "mundo de curso":
   home + lección, progreso en localStorage, XP, rangos, quiz.
   El tema (colores) se inyecta por variables CSS, así que el
   mismo CSS sirve para todos los mundos.

   Cada mundo solo aporta DATOS: { storageKey, title, kick, subtitle,
   HeaderIcon, theme, mods, ranks, lessons, anims }.

   Bloques de teoría soportados:
   { p }, { h }, { code:{file,code} }, { list:[...] }, { tip:{icon,text} },
   { seq:[...], cap }, { pairs:[{a,b}], cap }, { cycle:[...], cap },
   { particles:true, cap }, { anim:"nombre" }  (custom del mundo)
   ============================================================ */

/* ---------- animaciones reutilizables (temáticas por var(--acc)) ---------- */
function Sequence({ steps, cap }) {
    const [i, setI] = useState(0);
    useEffect(() => { const t = setInterval(() => setI((s) => (s + 1) % (steps.length + 1)), 850); return () => clearInterval(t); }, [steps.length]);
    return (
        <div className="cw-anim">
            <div className="cw-seq">
                {steps.map((s, idx) => (
                    <React.Fragment key={idx}>
                        <div className={`cw-seq-step ${idx < i ? "on" : ""} ${idx === i - 1 ? "active" : ""}`}>{s}</div>
                        {idx < steps.length - 1 && <span className={`cw-seq-arrow ${idx < i - 1 ? "on" : ""}`}>▸</span>}
                    </React.Fragment>
                ))}
            </div>
            {cap && <p className="cw-anim-cap">{cap}</p>}
        </div>
    );
}

function PairMap({ pairs, cap }) {
    const [i, setI] = useState(0);
    useEffect(() => { const t = setInterval(() => setI((s) => (s + 1) % pairs.length), 1500); return () => clearInterval(t); }, [pairs.length]);
    return (
        <div className="cw-anim">
            <div className="cw-pairs">
                {pairs.map((p, idx) => (
                    <div key={idx} className={`cw-pair ${idx === i ? "on" : ""}`}>
                        <span className="cw-pair-a">{p.a}</span>
                        <span className="cw-pair-arrow">→</span>
                        <span className="cw-pair-b">{p.b}</span>
                    </div>
                ))}
            </div>
            {cap && <p className="cw-anim-cap">{cap}</p>}
        </div>
    );
}

function Cycle({ nodes, note, cap }) {
    const [i, setI] = useState(0);
    useEffect(() => { const t = setInterval(() => setI((s) => (s + 1) % nodes.length), 850); return () => clearInterval(t); }, [nodes.length]);
    return (
        <div className="cw-anim">
            <div className="cw-cycle">
                {nodes.map((n, idx) => (
                    <React.Fragment key={idx}>
                        <div className={`cw-cycle-node ${idx === i ? "on" : ""}`}>{n}</div>
                        {idx < nodes.length - 1 && <span className="cw-cycle-arrow">→</span>}
                    </React.Fragment>
                ))}
                <span className="cw-cycle-loop">↻ {note || "se repite"}</span>
            </div>
            {cap && <p className="cw-anim-cap">{cap}</p>}
        </div>
    );
}

function Particles({ cap }) {
    const parts = useRef(Array.from({ length: 13 }, () => ({
        x: 10 + Math.random() * 80, y: 10 + Math.random() * 80,
        vx: (Math.random() - 0.5) * 2.4, vy: (Math.random() - 0.5) * 2.4,
    })));
    const [, setF] = useState(0);
    useEffect(() => {
        const t = setInterval(() => {
            for (const p of parts.current) {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 4 || p.x > 96) p.vx *= -1;
                if (p.y < 4 || p.y > 96) p.vy *= -1;
                p.x = Math.max(4, Math.min(96, p.x)); p.y = Math.max(4, Math.min(96, p.y));
            }
            setF((n) => n + 1);
        }, 40);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="cw-anim">
            <div className="cw-particles">
                {parts.current.map((p, i) => <span key={i} className="cw-particle" style={{ left: p.x + "%", top: p.y + "%" }} />)}
            </div>
            {cap && <p className="cw-anim-cap">{cap}</p>}
        </div>
    );
}

/* ---------- UI ---------- */
function CodeBlock({ code, file }) {
    return (
        <div className="cw-term">
            <div className="cw-term-h">
                <span className="d r" /><span className="d y" /><span className="d g" />
                {file && <span className="cw-file">{file}</span>}
            </div>
            <pre>{code.split("\n").map((line, i) => {
                const ci = line.indexOf("//");
                if (ci >= 0) return <div key={i}><span>{line.slice(0, ci)}</span><span className="cmt">{line.slice(ci)}</span></div>;
                return <div key={i}>{line || "\u00A0"}</div>;
            })}</pre>
        </div>
    );
}

function Theory({ blocks, anims }) {
    return blocks.map((b, i) => {
        if (b.p) return <p key={i} className="cw-p">{b.p}</p>;
        if (b.h) return <h3 key={i} className="cw-h3">{b.h}</h3>;
        if (b.code) return <CodeBlock key={i} {...b.code} />;
        if (b.seq) return <Sequence key={i} steps={b.seq} cap={b.cap} />;
        if (b.pairs) return <PairMap key={i} pairs={b.pairs} cap={b.cap} />;
        if (b.cycle) return <Cycle key={i} nodes={b.cycle} note={b.note} cap={b.cap} />;
        if (b.particles) return <Particles key={i} cap={b.cap} />;
        if (b.anim && anims && anims[b.anim]) { const C = anims[b.anim]; return <C key={i} />; }
        if (b.tip) return <div key={i} className="cw-tip"><span className="cw-tip-i">{b.tip.icon}</span><span>{b.tip.text}</span></div>;
        if (b.list) return <ul key={i} className="cw-list">{b.list.map((x, j) => <li key={j}>{x}</li>)}</ul>;
        if (b.table) return (
            <div key={i} className="cw-tablewrap"><table className="cw-table">
                <thead><tr>{b.table.head.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
                <tbody>{b.table.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody>
            </table></div>
        );
        return null;
    });
}

function Exercise({ ex, n }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="cw-ex">
            <div className="cw-ex-top"><span className="cw-ex-n">{n}</span><strong>{ex.title}</strong></div>
            <p className="cw-ex-goal">{ex.goal}</p>
            {ex.steps && <ul className="cw-steps">{ex.steps.map((s, i) => <li key={i}>{s}</li>)}</ul>}
            <button className="cw-reveal" onClick={() => setOpen((o) => !o)}>
                {open ? <EyeOff size={13} /> : <Eye size={13} />} {open ? "Ocultar solución" : "Ver solución"}
            </button>
            {open && <CodeBlock code={ex.solution} file={ex.file || "respuesta.txt"} />}
        </div>
    );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
.cw{ min-height:100vh; width:100%; font-family:'Inter',system-ui,sans-serif; color:var(--text);
  background:radial-gradient(900px 520px at 80% -10%, var(--accSoft), transparent 60%), var(--bg); }
.cw *{ box-sizing:border-box; }
.cw-wrap{ max-width:880px; margin:0 auto; padding:38px 22px 90px; }
.cw-head{ text-align:center; margin-bottom:8px; }
.cw-kick{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:4px; color:var(--dim); }
.cw-title{ font-size:42px; font-weight:800; letter-spacing:-1px; margin:6px 0; }
.cw-title b{ color:var(--acc); }
.cw-sub{ color:var(--muted); font-size:15px; max-width:600px; margin:0 auto; }
.cw-rank{ display:flex; gap:14px; align-items:center; justify-content:center; margin:22px auto; flex-wrap:wrap; }
.cw-rbox{ display:flex; align-items:center; gap:10px; border:1px solid var(--border2); background:var(--panel); border-radius:12px; padding:10px 15px; }
.cw-rl{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:2px; color:var(--dim); }
.cw-rn{ font-size:16px; font-weight:700; }
.cw-bar{ width:200px; height:8px; border-radius:99px; background:var(--panel); border:1px solid var(--border2); overflow:hidden; }
.cw-bar i{ display:block; height:100%; background:linear-gradient(90deg,var(--acc),var(--acc2)); transition:width .6s; }
.cw-modh{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:var(--acc);
  margin:30px 0 12px; display:flex; align-items:center; gap:9px; text-transform:uppercase; }
.cw-modh .ms{ color:var(--dim); letter-spacing:0; text-transform:none; font-size:12px; }
.cw-list-lessons{ display:flex; flex-direction:column; gap:10px; }
.cw-lcard{ display:flex; align-items:center; gap:15px; cursor:pointer; border:1px solid var(--border); border-radius:14px;
  padding:15px 17px; background:var(--panel); transition:.16s; text-align:left; width:100%; color:inherit; font-family:inherit; }
.cw-lcard:hover{ transform:translateX(4px); border-color:var(--acc); }
.cw-lico{ width:42px; height:42px; border-radius:11px; flex:none; display:grid; place-items:center;
  background:var(--accSoft); border:1px solid var(--border2); color:var(--acc); }
.cw-lcard.done .cw-lico{ background:rgba(120,200,130,.14); border-color:#7ec88a; color:#7ec88a; }
.cw-lm{ flex:1; min-width:0; }
.cw-lt{ font-size:15.5px; font-weight:700; }
.cw-li{ font-size:13px; color:var(--muted); margin-top:2px; }
.cw-lmeta{ font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--dim); flex:none; }
.cw-back{ display:inline-flex; align-items:center; gap:6px; background:none; border:none; color:var(--muted);
  font-family:'JetBrains Mono',monospace; font-size:12px; cursor:pointer; padding:6px 0; margin-bottom:6px; }
.cw-back:hover{ color:var(--acc); }
.cw-lhead h2{ font-size:29px; font-weight:800; letter-spacing:-.5px; margin:4px 0 8px; }
.cw-badge{ display:inline-block; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--acc);
  background:var(--accSoft); border:1px solid var(--border2); padding:3px 10px; border-radius:99px; }
.cw-intro{ background:var(--panel); border-left:4px solid var(--acc); border-radius:4px 12px 12px 4px;
  padding:15px 18px; margin:16px 0; color:var(--text); font-size:15px; line-height:1.6; }
.cw-secl{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:var(--dim);
  margin:26px 0 10px; display:flex; align-items:center; gap:8px; text-transform:uppercase; }
.cw-p{ font-size:15px; line-height:1.7; color:var(--text); margin:12px 0; opacity:.92; }
.cw-h3{ font-size:17px; font-weight:700; margin:22px 0 4px; color:var(--text); }
.cw-term{ background:var(--code); border:1px solid var(--border); border-radius:12px; overflow:hidden; margin:14px 0; }
.cw-term-h{ background:rgba(255,255,255,.03); padding:9px 13px; border-bottom:1px solid var(--border); display:flex; gap:7px; align-items:center; }
.cw-term-h .d{ width:11px; height:11px; border-radius:50%; } .d.r{ background:#ff5f56; } .d.y{ background:#ffbd2e; } .d.g{ background:#27c93f; }
.cw-file{ margin-left:8px; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--dim); }
.cw-term pre{ margin:0; padding:16px; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.6;
  color:var(--text); overflow-x:auto; } .cw-term pre .cmt{ color:var(--dim); font-style:italic; }
.cw-tip{ background:var(--accSoft); border-left:4px solid var(--acc); border-radius:4px 10px 10px 4px;
  padding:13px 16px; margin:16px 0; display:flex; gap:12px; align-items:flex-start; font-size:14px; line-height:1.55; color:var(--text); }
.cw-tip-i{ font-size:18px; flex:none; }
.cw-list{ margin:12px 0; padding-left:4px; list-style:none; display:flex; flex-direction:column; gap:7px; }
.cw-list li{ font-size:14.5px; color:var(--text); opacity:.92; padding-left:18px; position:relative; line-height:1.5; }
.cw-list li::before{ content:'▸'; position:absolute; left:0; color:var(--acc); }
.cw-tablewrap{ overflow-x:auto; border:1px solid var(--border); border-radius:10px; margin:16px 0; }
.cw-table{ width:100%; border-collapse:collapse; font-size:13.5px; }
.cw-table th{ background:var(--panel); color:var(--acc); text-align:left; padding:10px 14px; font-size:11px;
  text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid var(--border); }
.cw-table td{ padding:10px 14px; border-bottom:1px solid var(--border); color:var(--text); opacity:.92; }
.cw-ex{ background:var(--panel); border:1px solid var(--border); border-radius:14px; padding:18px; margin:12px 0; }
.cw-ex-top{ display:flex; align-items:center; gap:10px; }
.cw-ex-n{ background:var(--acc); color:var(--onAcc); width:24px; height:24px; border-radius:50%; display:grid;
  place-items:center; font-size:13px; font-weight:800; flex:none; }
.cw-ex-goal{ font-size:14.5px; color:var(--text); opacity:.92; margin:10px 0; line-height:1.55; }
.cw-steps{ margin:8px 0; padding-left:18px; } .cw-steps li{ font-size:13.5px; color:var(--muted); margin:4px 0; }
.cw-reveal{ display:inline-flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:12px;
  color:var(--acc); background:var(--accSoft); border:1px solid var(--border2); border-radius:8px; padding:7px 13px; cursor:pointer; margin-top:6px; }
.cw-quiz{ border:1px solid var(--border2); border-radius:14px; padding:18px; background:var(--panel); margin:12px 0; }
.cw-q{ font-size:15.5px; font-weight:600; margin-bottom:11px; }
.cw-opt{ display:block; width:100%; text-align:left; background:var(--code); border:1px solid var(--border); color:var(--text);
  padding:11px 14px; border-radius:10px; margin:6px 0; font-size:14px; cursor:pointer; transition:.14s; font-family:inherit; }
.cw-opt:hover{ border-color:var(--acc); }
.cw-opt.ok{ background:rgba(120,200,130,.14); border-color:#7ec88a; color:#cdeccf; }
.cw-opt.no{ background:rgba(255,95,86,.12); border-color:#ff5f56; color:#ffb3ae; }
.cw-fb{ font-size:13.5px; margin-top:9px; line-height:1.5; }
.cw-nav{ display:flex; justify-content:space-between; gap:10px; margin-top:26px; }
.cw-btn{ font-family:'JetBrains Mono',monospace; font-size:13px; padding:11px 17px; border-radius:10px; cursor:pointer;
  border:1px solid var(--border2); background:var(--panel); color:var(--text); display:inline-flex; align-items:center; gap:7px; }
.cw-btn:hover:not(:disabled){ border-color:var(--acc); } .cw-btn:disabled{ opacity:.3; cursor:default; }
.cw-btn.main{ background:var(--acc); color:var(--onAcc); border-color:var(--acc); font-weight:700; }
.cw-foot{ text-align:center; margin-top:34px; }
.cw-reset{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#ff7b72; background:transparent;
  border:1px solid rgba(255,123,114,.3); border-radius:8px; padding:8px 14px; cursor:pointer; }
.cw-done-tag{ display:inline-flex; align-items:center; gap:6px; color:#7ec88a; font-family:'JetBrains Mono',monospace; font-size:12px; }
@media(max-width:560px){ .cw-title{ font-size:32px; } .cw-lhead h2{ font-size:23px; } }

/* ===== animaciones reutilizables ===== */
.cw-anim{ background:var(--panel2); border:1px solid var(--border); border-radius:14px; padding:18px; margin:16px 0; }
.cw-anim-cap{ font-size:13px; color:var(--muted); line-height:1.55; margin:14px 0 2px; text-align:center; }
.cw-anim-cap code{ background:var(--panel); padding:1px 6px; border-radius:5px; font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--acc2); }
.cw-seq, .cw-cycle{ display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:5px; }
.cw-seq-step, .cw-cycle-node{ font-family:'JetBrains Mono',monospace; font-size:11.5px; padding:9px 12px; border-radius:9px;
  border:1px solid var(--border2); background:var(--code); color:var(--muted); transition:all .3s; text-align:center; }
.cw-seq-step.on, .cw-cycle-node.on{ border-color:var(--acc); background:var(--accSoft); color:var(--acc2); }
.cw-seq-step.active{ box-shadow:0 0 0 4px var(--accSoft); }
.cw-seq-arrow, .cw-cycle-arrow{ color:var(--dim); font-size:13px; transition:color .3s; }
.cw-seq-arrow.on{ color:var(--acc); }
.cw-cycle-loop{ width:100%; text-align:center; font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--dim); margin-top:6px; }
.cw-pairs{ display:flex; flex-direction:column; gap:8px; }
.cw-pair{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:9px 12px; border-radius:10px;
  border:1px solid var(--border); background:var(--code); opacity:.5; transition:all .35s; }
.cw-pair.on{ opacity:1; border-color:var(--acc); background:var(--accSoft); }
.cw-pair-a{ font-size:13px; color:var(--text); flex:1; min-width:120px; font-weight:600; }
.cw-pair-arrow{ color:var(--dim); }
.cw-pair-b{ font-family:'JetBrains Mono',monospace; font-size:11.5px; color:var(--acc2); flex:1; min-width:120px; }
.cw-particles{ position:relative; width:100%; max-width:300px; height:150px; margin:0 auto; border:1.5px solid var(--border2); border-radius:10px; background:var(--code); overflow:hidden; }
.cw-particle{ position:absolute; width:11px; height:11px; border-radius:50%; background:var(--acc); transform:translate(-50%,-50%); box-shadow:0 0 7px var(--accGlow); }
.cw-svg{ width:100%; max-width:360px; height:auto; display:block; margin:0 auto; }
`;

const DEFAULT_THEME = {
    bg: "#0f1115", panel: "#171a20", panel2: "#13161b", code: "#0c0e12",
    border: "#23272f", border2: "#2c313a", text: "#e7e9ee", muted: "#9aa3b0", dim: "#6b7280",
    acc: "#6ea8fe", acc2: "#a9caff", accGlow: "rgba(110,168,254,.5)", accSoft: "rgba(110,168,254,.10)", onAcc: "#0f1115",
};

export default function Course({ storageKey, title, titleHi, kick, subtitle, HeaderIcon, theme, mods, ranks, lessons, anims }) {
    const t = { ...DEFAULT_THEME, ...(theme || {}) };
    const rootVars = {
        "--bg": t.bg, "--panel": t.panel, "--panel2": t.panel2, "--code": t.code,
        "--border": t.border, "--border2": t.border2, "--text": t.text, "--muted": t.muted, "--dim": t.dim,
        "--acc": t.acc, "--acc2": t.acc2, "--accGlow": t.accGlow, "--accSoft": t.accSoft, "--onAcc": t.onAcc,
    };

    const load = () => { try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { return {}; } };
    const saved = load();
    const [open, setOpen] = useState(null);
    const [read, setRead] = useState(saved.read || {});
    const [quiz, setQuiz] = useState(saved.quiz || {});

    useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify({ read, quiz })); } catch {} }, [read, quiz, storageKey]);

    const passed = (les) => { const a = quiz[les.id]; if (!a) return false; return les.quiz.every((q, i) => a[i] === q.correct); };
    const isDone = (les) => read[les.id] && passed(les);
    const completas = lessons.filter(isDone).length;
    const xp = completas * 100 + lessons.reduce((s, les) => s + ((quiz[les.id] || []).filter((a, i) => a === les.quiz[i]?.correct).length) * 10, 0);
    const rankFor = (x) => ranks.filter((r) => x >= r.min).pop();
    const rank = rankFor(xp);
    const next = ranks.find((r) => xp < r.min);
    const pct = next ? Math.min(100, ((xp - rank.min) / (next.min - rank.min)) * 100) : 100;

    const openLesson = (idx) => { setOpen(idx); setRead((r) => ({ ...r, [lessons[idx].id]: true })); window.scrollTo(0, 0); };

    if (open != null) {
        const les = lessons[open];
        const answers = quiz[les.id] || [];
        const answer = (qi, oi) => setQuiz((prev) => {
            const cur = [...(prev[les.id] || [])];
            if (cur[qi] != null) return prev;
            cur[qi] = oi; return { ...prev, [les.id]: cur };
        });
        return (
            <div className="cw" style={rootVars}>
                <style>{CSS}</style>
                <div className="cw-wrap">
                    <button className="cw-back" onClick={() => setOpen(null)}><ChevronLeft size={15} /> TODAS LAS LECCIONES</button>
                    <div className="cw-lhead">
                        <span className="cw-badge">{les.mod} · {les.mins}</span>
                        <h2>{les.title}</h2>
                    </div>
                    <div className="cw-intro">{les.intro}</div>

                    <div className="cw-secl"><BookOpen size={13} /> TEORÍA</div>
                    <Theory blocks={les.theory} anims={anims} />

                    <div className="cw-secl"><Play size={13} /> PRÁCTICA</div>
                    {les.practice.map((ex, i) => <Exercise key={i} ex={ex} n={i + 1} />)}

                    <div className="cw-secl"><Award size={13} /> QUIZ</div>
                    {les.quiz.map((q, qi) => {
                        const picked = answers[qi]; const done = picked != null;
                        return (
                            <div className="cw-quiz" key={qi}>
                                <div className="cw-q">{q.q}</div>
                                {q.opts.map((o, oi) => {
                                    let cls = "cw-opt";
                                    if (done) { if (oi === q.correct) cls += " ok"; else if (oi === picked) cls += " no"; }
                                    return <button key={oi} className={cls} onClick={() => answer(qi, oi)}>{o}</button>;
                                })}
                                {done && <div className="cw-fb" style={{ color: picked === q.correct ? "#7ec88a" : "#ff7b72" }}>{picked === q.correct ? "✓ " : "✗ "}{q.fb}</div>}
                            </div>
                        );
                    })}

                    {isDone(les) && <div style={{ textAlign: "center", marginTop: 18 }}><span className="cw-done-tag"><Check size={15} /> ¡Lección completada! +100 XP</span></div>}

                    <div className="cw-nav">
                        <button className="cw-btn" disabled={open === 0} onClick={() => openLesson(open - 1)}><ChevronLeft size={15} /> Anterior</button>
                        <button className="cw-btn main" disabled={open === lessons.length - 1} onClick={() => openLesson(open + 1)}>Siguiente <ChevronRight size={15} /></button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cw" style={rootVars}>
            <style>{CSS}</style>
            <div className="cw-wrap">
                <div className="cw-head">
                    <div className="cw-kick">{kick}</div>
                    <h1 className="cw-title">{title} <b>{titleHi}</b></h1>
                    <p className="cw-sub">{subtitle}</p>
                </div>

                <div className="cw-rank">
                    <div className="cw-rbox">
                        {HeaderIcon && <HeaderIcon size={20} color={t.acc} />}
                        <div><div className="cw-rl">RANGO</div><div className="cw-rn">{rank.name}</div></div>
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: t.dim, marginBottom: 5 }}>
                            <span>{xp} XP · {completas}/{lessons.length} lecciones</span>
                            <span>{next ? `→ ${next.name}` : "MÁX"}</span>
                        </div>
                        <div className="cw-bar"><i style={{ width: pct + "%" }} /></div>
                    </div>
                </div>

                {mods.map((m) => {
                    const ls = lessons.map((l, i) => ({ l, i })).filter(({ l }) => l.mod === m.name);
                    return (
                        <div key={m.name}>
                            <div className="cw-modh">{m.icon && <m.icon size={14} />} {m.name} <span className="ms">— {m.sub}</span></div>
                            <div className="cw-list-lessons">
                                {ls.map(({ l, i }) => {
                                    const done = isDone(l); const Ico = l.icon;
                                    return (
                                        <button key={l.id} className={`cw-lcard ${done ? "done" : ""}`} onClick={() => openLesson(i)}>
                                            <div className="cw-lico">{done ? <Check size={20} /> : (Ico ? <Ico size={20} /> : null)}</div>
                                            <div className="cw-lm">
                                                <div className="cw-lt">{l.title}</div>
                                                <div className="cw-li">{l.intro.slice(0, 72)}…</div>
                                            </div>
                                            <div className="cw-lmeta">{l.mins}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                <div className="cw-foot">
                    <button className="cw-reset" onClick={() => { if (window.confirm("¿Reiniciar el progreso de este mundo?")) { setRead({}); setQuiz({}); } }}>
                        <RotateCcw size={11} style={{ verticalAlign: "-1px", marginRight: 5 }} /> Reiniciar progreso
                    </button>
                </div>
            </div>
        </div>
    );
}