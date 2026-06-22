import React, { useState, useEffect, useMemo } from "react";
import {
  Shield, TrendingUp, Search, Cpu, ArrowLeft, Lock, Star,
  Sparkles, Trophy, RotateCcw, Box, Disc3, Smartphone, Bot, Cloud, Scroll,
} from "lucide-react";

/* ============================================================
   NEXUS // Hub de mundos — Evolutive
   Une CyberLab, Wall Street Academy, Academia Deductiva y FinStack.
   Cada tema es un "mundo". El progreso de cada mundo se guarda solo.
   ============================================================ */

/* --- shim de window.storage (lo usa FinStack) respaldado en localStorage --- */
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    get: async (k) => { const v = localStorage.getItem(k); return v == null ? null : { value: v }; },
    set: async (k, v) => { localStorage.setItem(k, v); return { value: v }; },
    delete: async (k) => { localStorage.removeItem(k); return { deleted: true }; },
    list: async (p = "") => {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(p)) keys.push(key);
      }
      return { keys };
    },
  };
}

/* --- carga perezosa de cada mundo (cada uno vive en su carpeta) --- */
import CyberLab from "./cyberlab/App.jsx";
import WallStreet from "./wallstreet/App.jsx";
import Detective from "./detective/App.jsx";
import FinStack from "./finstack/App.jsx";
import Godot from "./godot/App.jsx";
import Rock from "./rock/App.jsx";
import Flutter from "./flutter/App.jsx";
import Robotica from "./robotica/App.jsx";
import IoTCloud from "./iotcloud/App.jsx";
import Philosophy from "./philosophy/App.jsx";

const HUB_KEY = "nexus_hub_v1";

/* lectura segura de localStorage */
const read = (k) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch { return null; } };

/* progreso por mundo (lo que se puede leer de cada storage) */
function statCyberlab() {
  const d = read("cyberlab_progress_v1");
  const xp = d?.xp || 0;
  const misiones = Array.isArray(d?.done) ? d.done.length : 0;
  return { xp, label: `${xp} XP · ${misiones} misiones` };
}
function statWallStreet() {
  const d = read("wsa_progress") || {};
  const done = Object.keys(d).length;
  return { xp: done * 100, label: `${done}/11 módulos` };
}
function statFinstack() {
  const d = read("finstack:v1");
  const xp = d?.xp || 0;
  const leidas = d?.read ? Object.keys(d.read).length : 0;
  return { xp, label: `${xp} XP · ${leidas} lecciones` };
}
function statDetective() {
  const d = read("deductiva_progress_v1");
  const xp = d?.xp || 0;
  const pruebas = d?.done ? Object.keys(d.done).length : 0;
  return { xp, label: `${xp} XP · ${pruebas} pruebas` };
}
function statGodot() {
  const d = read("godot3d_progress_v1");
  if (!d || !Array.isArray(d.done)) return { xp: 0, label: "sin empezar" };
  const lecciones = d.done.filter(Boolean).length;
  return { xp: lecciones * 50, label: `${lecciones} lecciones` };
}
function statRock() {
  const d = read("rock_progress_v1");
  const eras = d?.quiz ? Object.keys(d.quiz).length : 0;
  return { xp: eras * 100, label: eras ? `${eras} eras` : "sin empezar" };
}
function statFlutter() {
  const d = read("flutter_progress_v1");
  if (!d || !d.read) return { xp: 0, label: "sin empezar" };
  const leidas = Object.keys(d.read).length;
  return { xp: leidas * 100, label: `${leidas} lecciones` };
}
function statRobotica() {
  const d = read("robotica_progress_v1");
  if (!d || !d.read) return { xp: 0, label: "sin empezar" };
  const leidas = Object.keys(d.read).length;
  return { xp: leidas * 100, label: `${leidas} lecciones` };
}
function statIoTCloud() {
  const d = read("iotcloud_progress_v1");
  if (!d || !d.read) return { xp: 0, label: "sin empezar" };
  const leidas = Object.keys(d.read).length;
  return { xp: leidas * 100, label: `${leidas} lecciones` };
}
function statPhilosophy() {
  const d = read("philosophy_progress_v1");
  const xp = d?.xp || 0;
  const pruebas = d?.done ? Object.keys(d.done).length : 0;
  return { xp, label: `${xp} XP · ${pruebas} ejercicios` };
}

const WORLDS = [
  { id: "cyber",  name: "CyberLab",          sub: "Hackea aprendiendo",        icon: Shield,      color: "#4dffa0", glow: "rgba(77,255,160,.5)",  Comp: CyberLab,  stat: statCyberlab },
  { id: "wall",   name: "Wall Street",       sub: "De cero a Michael Burry",   icon: TrendingUp,  color: "#d9a441", glow: "rgba(217,164,65,.5)",  Comp: WallStreet, stat: statWallStreet },
  { id: "deduc",  name: "Academia Deductiva",sub: "Observa · deduce · lee",    icon: Search,      color: "#c9a227", glow: "rgba(201,162,39,.5)",  Comp: Detective, stat: statDetective },
  { id: "fin",    name: "FinStack",          sub: "Dev → FinTech Architect",   icon: Cpu,         color: "#3aa0ff", glow: "rgba(58,160,255,.5)",  Comp: FinStack,  stat: statFinstack },
  { id: "godot",  name: "Godot 3D",          sub: "De cero a experto en 3D",   icon: Box,         color: "#478cbf", glow: "rgba(71,140,191,.5)",  Comp: Godot,     stat: statGodot },
  { id: "rock",   name: "Historia del Rock",  sub: "Del blues al streaming",    icon: Disc3,       color: "#e2706f", glow: "rgba(226,112,111,.5)", Comp: Rock,      stat: statRock },
  { id: "flutter", name: "Flutter + Dart",     sub: "De cero a app móvil",       icon: Smartphone,  color: "#42A5F5", glow: "rgba(66,165,245,.5)",  Comp: Flutter,   stat: statFlutter },
  { id: "robotica", name: "Robótica & IoT",    sub: "De cero a tu araña robot",  icon: Bot,         color: "#ff5a1f", glow: "rgba(255,90,31,.5)",   Comp: Robotica,  stat: statRobotica },
  { id: "iotcloud", name: "IoT en la Nube",    sub: "Nivel profesional / CV",    icon: Cloud,       color: "#22d3ee", glow: "rgba(34,211,238,.5)",  Comp: IoTCloud,  stat: statIoTCloud },
  { id: "philosophy", name: "Primer Logos",    sub: "Filosofía: del mito al logos", icon: Scroll,   color: "#9c6b9c", glow: "rgba(156,107,156,.5)", Comp: Philosophy, stat: statPhilosophy },
];

const RANKS = [
  { min: 0, name: "Explorador" },
  { min: 300, name: "Cartógrafo" },
  { min: 700, name: "Navegante" },
  { min: 1200, name: "Pionero" },
  { min: 2000, name: "Maestro de Mundos" },
];
const rankFor = (xp) => RANKS.filter((r) => xp >= r.min).pop();

/* --- error boundary: si un mundo falla, el mapa sigue vivo --- */
class WorldBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (this.state.err) {
      return (
          <div style={{ padding: 40, color: "#e6edf3", fontFamily: "system-ui", textAlign: "center" }}>
            <h2>Este mundo tronó al cargar 😅</h2>
            <p style={{ color: "#8b9199", fontSize: 14 }}>Revisa que la carpeta del mundo y sus imports estén completos.</p>
            <pre style={{ color: "#ff6b6b", fontSize: 12, whiteSpace: "pre-wrap" }}>{String(this.state.err)}</pre>
          </div>
      );
    }
    return this.props.children;
  }
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
.nx{ position:relative; min-height:100vh; width:100%; overflow-x:hidden;
  font-family:'Space Grotesk',system-ui,sans-serif; color:#e8ecf3;
  background:
    radial-gradient(1100px 600px at 80% -10%, rgba(58,160,255,.12), transparent 60%),
    radial-gradient(900px 500px at 0% 110%, rgba(77,255,160,.10), transparent 55%),
    #06080d;
}
.nx *{ box-sizing:border-box; }
.nx-stars{ position:fixed; inset:0; pointer-events:none; z-index:0;
  background-image:
    radial-gradient(1px 1px at 20% 30%, #fff6, transparent),
    radial-gradient(1px 1px at 70% 60%, #fff5, transparent),
    radial-gradient(1px 1px at 40% 80%, #fff4, transparent),
    radial-gradient(1px 1px at 90% 20%, #fff5, transparent),
    radial-gradient(1px 1px at 55% 15%, #fff4, transparent);
  background-size:cover; opacity:.7; }
.nx-wrap{ position:relative; z-index:1; max-width:1080px; margin:0 auto; padding:42px 22px 80px; }
.nx-head{ text-align:center; margin-bottom:8px; }
.nx-badge{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:4px; color:#5a6b82; }
.nx-title{ font-size:46px; font-weight:700; letter-spacing:-1.5px; margin:6px 0; }
.nx-title .g{ background:linear-gradient(90deg,#4dffa0,#3aa0ff,#d9a441); -webkit-background-clip:text; background-clip:text; color:transparent; }
.nx-sub{ color:#8b9199; font-size:16px; max-width:560px; margin:0 auto; }
.nx-rank{ display:flex; align-items:center; justify-content:center; gap:16px; margin:26px auto 6px; flex-wrap:wrap; }
.nx-rankbox{ border:1px solid #1e2a3a; background:#0b1018; border-radius:12px; padding:12px 18px; display:flex; align-items:center; gap:12px; }
.nx-rankbox .rl{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:2px; color:#5a6b82; }
.nx-rankbox .rn{ font-size:18px; font-weight:600; color:#e8ecf3; }
.nx-bar{ width:200px; height:8px; border-radius:99px; background:#0c141b; border:1px solid #1e2a3a; overflow:hidden; }
.nx-bar i{ display:block; height:100%; background:linear-gradient(90deg,#3aa0ff,#4dffa0); transition:width .6s; }
.nx-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:18px; margin-top:34px; }
.nx-card{ position:relative; cursor:pointer; border:1px solid #1c2533; border-radius:18px; padding:24px;
  background:linear-gradient(180deg,#0c1220,#090d15); transition:.2s; overflow:hidden; text-align:left; }
.nx-card:hover{ transform:translateY(-5px); border-color:var(--c); box-shadow:0 18px 50px rgba(0,0,0,.5); }
.nx-card .ring{ position:absolute; top:-40px; right:-40px; width:130px; height:130px; border-radius:50%;
  background:radial-gradient(circle, var(--glow), transparent 70%); opacity:.6; }
.nx-ic{ width:54px; height:54px; border-radius:14px; display:grid; place-items:center;
  color:var(--c); border:1px solid var(--c); background:rgba(255,255,255,.03); box-shadow:0 0 24px var(--glow) inset; }
.nx-card h3{ margin:16px 0 2px; font-size:21px; font-weight:600; }
.nx-card .cs{ color:#8b9199; font-size:13.5px; margin:0 0 16px; }
.nx-stat{ display:flex; align-items:center; gap:7px; font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--c); }
.nx-enter{ position:absolute; bottom:22px; right:22px; font-family:'JetBrains Mono',monospace; font-size:11px;
  letter-spacing:1px; color:#5a6b82; }
.nx-foot{ text-align:center; margin-top:40px; font-family:'JetBrains Mono',monospace; font-size:11px; color:#3f4a5c; }
.nx-reset{ margin-top:14px; font-family:'JetBrains Mono',monospace; font-size:11px; color:#ff6b6b;
  background:transparent; border:1px solid rgba(255,107,107,.3); border-radius:8px; padding:8px 14px; cursor:pointer; }
.nx-reset:hover{ background:rgba(255,107,107,.1); }
/* botón flotante para volver al mapa desde un mundo */
.nx-back{ position:fixed; top:14px; left:14px; z-index:9999; display:flex; align-items:center; gap:7px;
  font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:1px; color:#06080d;
  background:#e8ecf3; border:none; border-radius:10px; padding:9px 14px; cursor:pointer; box-shadow:0 6px 20px rgba(0,0,0,.4); }
.nx-back:hover{ background:#fff; }
@media(max-width:680px){ .nx-title{ font-size:34px; } }
`;

export default function App() {
  const [active, setActive] = useState(null);   // id del mundo abierto o null = mapa
  const [tick, setTick] = useState(0);           // fuerza re-lectura del progreso

  // estado del hub (qué mundos visitaste)
  const [hub, setHub] = useState(() => read(HUB_KEY) || { visited: {} });
  useEffect(() => { try { localStorage.setItem(HUB_KEY, JSON.stringify(hub)); } catch {} }, [hub]);

  // al volver al mapa, re-leemos el progreso de cada mundo
  useEffect(() => { if (!active) setTick((t) => t + 1); }, [active]);

  const stats = useMemo(() => {
    const m = {};
    WORLDS.forEach((w) => { m[w.id] = w.stat(); });
    return m;
  }, [tick]);

  const totalXp = useMemo(() => Object.values(stats).reduce((s, x) => s + x.xp, 0), [stats]);
  const rank = rankFor(totalXp);
  const next = RANKS.find((r) => totalXp < r.min);
  const pct = next ? Math.min(100, ((totalXp - rank.min) / (next.min - rank.min)) * 100) : 100;

  const open = (w) => { setActive(w.id); setHub((h) => ({ ...h, visited: { ...h.visited, [w.id]: true } })); window.scrollTo(0, 0); };

  if (active) {
    const w = WORLDS.find((x) => x.id === active);
    const World = w.Comp;
    return (
        <>
          <button className="nx-back" onClick={() => setActive(null)}>
            <ArrowLeft size={14} /> MAPA
          </button>
          <WorldBoundary key={w.id}>
            <World />
          </WorldBoundary>
          <style>{`.nx-back{position:fixed;top:14px;left:14px;z-index:99999;display:flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:1px;color:#06080d;background:#e8ecf3;border:none;border-radius:10px;padding:9px 14px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.4);} .nx-back:hover{background:#fff;}`}</style>
        </>
    );
  }

  return (
      <div className="nx">
        <style>{CSS}</style>
        <div className="nx-stars" />
        <div className="nx-wrap">
          <div className="nx-head">
            <div className="nx-badge">// EVOLUTIVE</div>
            <h1 className="nx-title">NEXUS <span className="g">de Mundos</span></h1>
            <p className="nx-sub">Cada tema es un mundo. Entra, aprende y tu progreso se guarda solo en cada uno.</p>
          </div>

          <div className="nx-rank">
            <div className="nx-rankbox">
              <Star size={18} color="#d9a441" />
              <div>
                <div className="rl">RANGO GLOBAL</div>
                <div className="rn">{rank.name}</div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#5a6b82", marginBottom: 5 }}>
                <span>{totalXp} XP</span><span>{next ? `→ ${next.name}` : "MÁX"}</span>
              </div>
              <div className="nx-bar"><i style={{ width: pct + "%" }} /></div>
            </div>
          </div>

          <div className="nx-grid">
            {WORLDS.map((w) => {
              const Icon = w.icon;
              const s = stats[w.id];
              return (
                  <div key={w.id} className="nx-card" style={{ "--c": w.color, "--glow": w.glow }} onClick={() => open(w)}>
                    <div className="ring" />
                    <div className="nx-ic"><Icon size={26} /></div>
                    <h3>{w.name}</h3>
                    <p className="cs">{w.sub}</p>
                    <div className="nx-stat"><Sparkles size={13} /> {s.label}</div>
                    <span className="nx-enter">ENTRAR →</span>
                  </div>
              );
            })}
          </div>

          <div className="nx-foot">
            NEXUS · construido para Gael · el progreso de cada mundo se guarda por separado
            <br />
            <button className="nx-reset" onClick={() => {
              if (window.confirm("¿Borrar TODO el progreso de TODOS los mundos? No se puede deshacer.")) {
                ["cyberlab_progress_v1", "wsa_progress", "finstack:v1", "deductiva_progress_v1", "godot3d_progress_v1", "rock_progress_v1", "flutter_progress_v1", "robotica_progress_v1", "iotcloud_progress_v1", "philosophy_progress_v1", HUB_KEY].forEach((k) => localStorage.removeItem(k));
                setHub({ visited: {} }); setTick((t) => t + 1);
              }
            }}>
              <RotateCcw size={11} style={{ verticalAlign: "-1px", marginRight: 5 }} /> Reiniciar todo
            </button>
          </div>
        </div>
      </div>
  );
}