import { useState, useMemo, useEffect } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  TrendingUp, TrendingDown, Brain, BookOpen, Target, Shield, Layers, Globe,
  Bitcoin, Percent, Award, ChevronRight, Check, X, AlertTriangle, Calculator,
  Lightbulb, Eye, Zap, DollarSign, Lock, Landmark, Scale, FlaskConical, Coins,
} from "lucide-react";

/* ============================================================
   WALL STREET ACADEMY — "De cero a Michael Burry"
   Una sola pieza. 30% teoría / 70% práctica. Español MX.
   NOTA: Esto es material EDUCATIVO, no asesoría financiera ni
   fiscal. Las cifras de impuestos son ilustrativas y pueden
   cambiar: confírmalas con un contador.
   ============================================================ */

const C = {
  bg: "#0b0d10", panel: "#14181d", panel2: "#1b2026", border: "#2a313a",
  text: "#e9e6dd", muted: "#8b9199", gold: "#d9a441", goldSoft: "#3a3017",
  green: "#36c08c", red: "#e5564e", blue: "#6aa6dd",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,500&family=JetBrains+Mono:wght@400;500;700&family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500&display=swap');
* { box-sizing: border-box; }
.wsa { background:${C.bg}; color:${C.text}; min-height:100vh; font-family:'Newsreader',Georgia,serif;
  background-image: radial-gradient(circle at 15% -10%, #15212a55, transparent 45%), radial-gradient(circle at 90% 0%, #2a210f55, transparent 40%); }
.wsa .mono { font-family:'JetBrains Mono',monospace; }
.wsa .disp { font-family:'Fraunces',serif; }
.wsa h1,.wsa h2,.wsa h3 { font-family:'Fraunces',serif; margin:0; }
.wsa::-webkit-scrollbar{width:10px} .wsa::-webkit-scrollbar-thumb{background:${C.border};border-radius:8px}

/* ticker */
.tick { overflow:hidden; border-bottom:1px solid ${C.border}; background:#070809; white-space:nowrap; }
.tick-track { display:inline-block; padding:7px 0; animation:scroll 38s linear infinite; }
.tick-item { font-family:'JetBrains Mono',monospace; font-size:12px; margin:0 22px; letter-spacing:.5px; }
@keyframes scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }

.layout { display:flex; align-items:flex-start; }
.side { width:264px; flex:none; border-right:1px solid ${C.border}; min-height:100vh; padding:18px 14px;
  position:sticky; top:0; max-height:100vh; overflow-y:auto; background:#0c0f13; }
.main { flex:1; padding:34px 40px 90px; max-width:960px; }
@media(max-width:880px){ .layout{flex-direction:column} .side{width:100%;position:static;min-height:auto;
  display:flex;flex-wrap:wrap;gap:6px;border-right:none;border-bottom:1px solid ${C.border}} .main{padding:24px 18px 80px} }

.navbtn { display:flex; align-items:center; gap:10px; width:100%; text-align:left; padding:9px 11px; border-radius:9px;
  background:transparent; border:1px solid transparent; color:${C.muted}; cursor:pointer; font-family:'JetBrains Mono',monospace;
  font-size:12.5px; transition:.15s; margin-bottom:3px; }
.navbtn:hover { background:${C.panel}; color:${C.text}; }
.navbtn.on { background:${C.panel2}; color:${C.gold}; border-color:${C.border}; }
.navnum { font-size:10px; opacity:.6; min-width:18px; }

.card { background:${C.panel}; border:1px solid ${C.border}; border-radius:14px; padding:22px; margin:18px 0; }
.callout { border-left:3px solid ${C.gold}; background:${C.goldSoft}33; padding:14px 18px; border-radius:0 10px 10px 0; margin:16px 0; }
.warn { border-left:3px solid ${C.red}; background:#e5564e15; padding:13px 16px; border-radius:0 10px 10px 0; margin:14px 0; font-size:14.5px; }
.tag { display:inline-flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:11px;
  padding:4px 10px; border-radius:20px; border:1px solid ${C.border}; color:${C.muted}; }
.btn { font-family:'JetBrains Mono',monospace; font-size:13px; padding:10px 18px; border-radius:9px; cursor:pointer;
  border:1px solid ${C.gold}; background:${C.gold}; color:#1a1206; font-weight:700; transition:.15s; }
.btn:hover{ filter:brightness(1.08) } .btn:disabled{ opacity:.4; cursor:default }
.btn.ghost { background:transparent; color:${C.gold}; }
.ipt { width:100%; background:#0c0f13; border:1px solid ${C.border}; color:${C.text}; padding:9px 11px; border-radius:8px;
  font-family:'JetBrains Mono',monospace; font-size:14px; }
.lbl { font-family:'JetBrains Mono',monospace; font-size:11px; color:${C.muted}; text-transform:uppercase; letter-spacing:1px; }
.row { display:flex; gap:14px; flex-wrap:wrap; }
.stat { background:#0c0f13; border:1px solid ${C.border}; border-radius:11px; padding:14px 16px; flex:1; min-width:130px; }
.statbig { font-family:'JetBrains Mono',monospace; font-size:22px; font-weight:700; }
input[type=range]{ -webkit-appearance:none; height:5px; border-radius:5px; background:${C.border}; outline:none; }
input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none; width:17px;height:17px;border-radius:50%;background:${C.gold};cursor:pointer;border:2px solid ${C.bg} }
.opt { text-align:left; width:100%; padding:13px 16px; border-radius:10px; border:1px solid ${C.border}; background:${C.panel2};
  color:${C.text}; cursor:pointer; margin:7px 0; font-family:'Newsreader',serif; font-size:15px; transition:.12s; }
.opt:hover{ border-color:${C.gold} }
.opt.correct{ border-color:${C.green}; background:#36c08c22 }
.opt.wrong{ border-color:${C.red}; background:#e5564e22 }
.fade { animation:fade .5s ease both; }
@keyframes fade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
.grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
@media(max-width:620px){ .grid2{grid-template-columns:1fr} }
.flip { background:${C.panel2}; border:1px solid ${C.border}; border-radius:11px; padding:15px; cursor:pointer; transition:.15s; }
.flip:hover{ border-color:${C.gold}; transform:translateY(-2px) }
`;

/* ---------- helpers ---------- */
const fmt = (n) => Math.round(n).toLocaleString("es-MX");
const money = (n, c = "$") => c + fmt(n);
const pct = (n) => `${n.toFixed(1)}%`;

const Stat = ({ label, value, color = C.text, sub }) => (
    <div className="stat">
      <div className="lbl">{label}</div>
      <div className="statbig" style={{ color }}>{value}</div>
      {sub && <div className="mono" style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
);

const Field = ({ label, value, set, min = 0, max = 100, step = 1, suffix = "" }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span className="lbl">{label}</span>
        <span className="mono" style={{ fontSize: 13, color: C.gold }}>{fmt(value)}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
             onChange={(e) => set(Number(e.target.value))} style={{ width: "100%" }} />
    </div>
);

/* ---------- QUIZ ---------- */
function Quiz({ questions, onDone }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[i];

  const choose = (idx) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.correct) setScore((s) => s + 1);
  };
  const next = () => {
    if (i + 1 >= questions.length) { setDone(true); onDone && onDone(score + (picked === q.correct ? 0 : 0)); }
    else { setI(i + 1); setPicked(null); }
  };

  if (done) {
    const ok = score >= Math.ceil(questions.length * 0.6);
    return (
        <div className="card fade" style={{ textAlign: "center" }}>
          <Award size={34} color={ok ? C.gold : C.muted} />
          <h2 style={{ fontSize: 26, margin: "10px 0" }}>{score} / {questions.length}</h2>
          <p style={{ color: C.muted }}>{ok ? "Aprobado. Módulo desbloqueado en tu cabeza, no en una cuenta de banco. Sigue." : "Casi. Relee la teoría y vuelve a intentar — repetir es gratis, equivocarte con dinero real no."}</p>
          <button className="btn ghost" style={{ marginTop: 10 }}
                  onClick={() => { setI(0); setPicked(null); setScore(0); setDone(false); }}>Reintentar</button>
        </div>
    );
  }
  return (
      <div className="card fade">
        <div className="lbl" style={{ marginBottom: 8 }}>Pregunta {i + 1} / {questions.length}</div>
        <h3 style={{ fontSize: 19, marginBottom: 6 }}>{q.q}</h3>
        {q.options.map((o, idx) => {
          let cls = "opt";
          if (picked !== null) { if (idx === q.correct) cls += " correct"; else if (idx === picked) cls += " wrong"; }
          return <button key={idx} className={cls} onClick={() => choose(idx)}>{o}</button>;
        })}
        {picked !== null && (
            <div className="callout fade" style={{ marginTop: 12 }}>
              <strong style={{ color: C.gold }} className="disp">Por qué:</strong> {q.explain}
            </div>
        )}
        {picked !== null && <button className="btn" style={{ marginTop: 12 }} onClick={next}>
          {i + 1 >= questions.length ? "Ver resultado" : "Siguiente"}</button>}
      </div>
  );
}

/* ============================================================
   HERRAMIENTAS INTERACTIVAS (la parte "70% práctica")
   ============================================================ */

/* 1. Interés compuesto + inflación */
function CompoundTool() {
  const [ini, setIni] = useState(10000);
  const [mes, setMes] = useState(2000);
  const [ret, setRet] = useState(12);
  const [yrs, setYrs] = useState(25);
  const [inf, setInf] = useState(4);

  const data = useMemo(() => {
    const arr = []; let bal = ini, aport = ini;
    for (let y = 0; y <= yrs; y++) {
      arr.push({ y, bal: Math.round(bal), aport: Math.round(aport), real: Math.round(bal / Math.pow(1 + inf / 100, y)) });
      for (let m = 0; m < 12; m++) { bal = bal * (1 + ret / 100 / 12) + mes; }
      aport += mes * 12;
    }
    return arr;
  }, [ini, mes, ret, yrs, inf]);
  const last = data[data.length - 1];

  return (
      <div className="card">
        <h3 style={{ fontSize: 20, marginBottom: 4 }}>Máquina de interés compuesto</h3>
        <p style={{ color: C.muted, fontSize: 14, marginTop: 0 }}>La 8ª maravilla del mundo (Einstein, supuestamente). El que la entiende, la cobra. El que no, la paga.</p>
        <div className="grid2" style={{ marginTop: 14 }}>
          <div>
            <Field label="Inversión inicial $" value={ini} set={setIni} max={500000} step={5000} />
            <Field label="Aporte mensual $" value={mes} set={setMes} max={50000} step={500} />
            <Field label="Rendimiento anual" value={ret} set={setRet} max={25} suffix="%" />
            <Field label="Años" value={yrs} set={setYrs} min={1} max={45} />
            <Field label="Inflación anual" value={inf} set={setInf} max={15} suffix="%" />
          </div>
          <div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <AreaChart data={data}>
                  <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
                  <XAxis dataKey="y" stroke={C.muted} fontSize={11} />
                  <YAxis stroke={C.muted} fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8 }}
                           formatter={(v) => money(v)} labelFormatter={(l) => `Año ${l}`} />
                  <Area dataKey="aport" stroke={C.muted} fill={C.muted} fillOpacity={0.12} name="Lo que pusiste" />
                  <Area dataKey="bal" stroke={C.gold} fill={C.gold} fillOpacity={0.18} name="Valor nominal" />
                  <Area dataKey="real" stroke={C.green} fill={C.green} fillOpacity={0.1} name="Poder de compra real" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <Stat label="Valor final" value={money(last.bal)} color={C.gold} />
          <Stat label="Tú aportaste" value={money(last.aport)} color={C.muted} />
          <Stat label="Generó el interés" value={money(last.bal - last.aport)} color={C.green} />
          <Stat label="Poder de compra real" value={money(last.real)} color={C.blue} sub="ajustado por inflación" />
        </div>
        <div className="warn" style={{ marginTop: 14 }}>
          Fíjate en la línea azul: la inflación se come tu dinero en silencio. Por eso "guardar bajo el colchón" es perder garantizado.
        </div>
      </div>
  );
}

/* 2. Calculadora de ratios / P/E */
function RatioTool() {
  const [precio, setPrecio] = useState(150);
  const [eps, setEps] = useState(6);
  const [book, setBook] = useState(40);
  const [util, setUtil] = useState(50);
  const [equity, setEquity] = useState(300);
  const [deuda, setDeuda] = useState(120);
  const pe = precio / eps, pb = precio / book, roe = (util / equity) * 100, de = deuda / equity;
  const verdict = (v, good, bad) => v <= good ? C.green : v >= bad ? C.red : C.gold;
  return (
      <div className="card">
        <h3 style={{ fontSize: 20 }}>Laboratorio de ratios</h3>
        <p style={{ color: C.muted, fontSize: 14, marginTop: 2 }}>Mueve los valores de una empresa imaginaria y mira cómo cambian los números que de verdad importan.</p>
        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <Field label="Precio acción $" value={precio} set={setPrecio} max={600} step={5} />
            <Field label="Ganancia por acción (EPS) $" value={eps} set={setEps} min={1} max={40} />
            <Field label="Valor en libros / acción $" value={book} set={setBook} min={1} max={200} />
            <Field label="Utilidad neta (M) $" value={util} set={setUtil} max={500} step={5} />
            <Field label="Capital contable (M) $" value={equity} set={setEquity} min={10} max={2000} step={10} />
            <Field label="Deuda total (M) $" value={deuda} set={setDeuda} max={2000} step={10} />
          </div>
          <div>
            <div className="row" style={{ flexDirection: "column" }}>
              <Stat label="P/E (precio/ganancia)" value={pe.toFixed(1)} color={verdict(pe, 15, 35)} sub="<15 barata · >35 cara" />
              <Stat label="P/B (precio/libros)" value={pb.toFixed(2)} color={verdict(pb, 1.5, 4)} sub="<1.5 = valor de Burry" />
              <Stat label="ROE (rentabilidad)" value={pct(roe)} color={roe >= 15 ? C.green : C.gold} sub=">15% = buena máquina" />
              <Stat label="Deuda/Capital" value={de.toFixed(2)} color={verdict(de, 0.6, 1.5)} sub="<1 saludable · >2 riesgo" />
            </div>
          </div>
        </div>
        <div className="callout">
          Ningún ratio significa nada solo. Una P/E de 8 puede ser una ganga... o una "trampa de valor" (la empresa va a morir). El número te dice *dónde mirar*, no *qué hacer*.
        </div>
      </div>
  );
}

/* 3. DCF */
function DCFTool() {
  const [fcf, setFcf] = useState(100);
  const [g, setG] = useState(8);
  const [disc, setDisc] = useState(10);
  const [tg, setTg] = useState(3);
  const [acc, setAcc] = useState(1000);
  const [precio, setPrecio] = useState(120);

  const calc = useMemo(() => {
    let pvSum = 0, f = fcf; const bars = [];
    for (let y = 1; y <= 10; y++) {
      f = y === 1 ? fcf : f * (1 + g / 100);
      const pv = f / Math.pow(1 + disc / 100, y);
      pvSum += pv; bars.push({ y, pv: Math.round(pv) });
    }
    const tv = (f * (1 + tg / 100)) / ((disc - tg) / 100);
    const pvTv = tv / Math.pow(1 + disc / 100, 10);
    const total = pvSum + pvTv;
    const fair = (total * 1000) / (acc * 1000000) * 1000000; // total en M, acc en M de acciones
    const fairPrice = (total / acc) * 1000;
    return { bars, fairPrice, pvTv: Math.round(pvTv), total: Math.round(total) };
  }, [fcf, g, disc, tg, acc]);

  const up = ((calc.fairPrice - precio) / precio) * 100;
  return (
      <div className="card">
        <h3 style={{ fontSize: 20 }}>DCF — el cuchillo suizo de Wall Street</h3>
        <p style={{ color: C.muted, fontSize: 14, marginTop: 2 }}>Descuenta los flujos futuros a hoy. Suena místico; es álgebra. Esto es lo que separa al inversionista del apostador.</p>
        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <Field label="Flujo de caja libre año 1 (M) $" value={fcf} set={setFcf} min={10} max={500} step={5} />
            <Field label="Crecimiento anual" value={g} set={setG} max={20} suffix="%" />
            <Field label="Tasa de descuento (WACC)" value={disc} set={setDisc} min={5} max={18} suffix="%" />
            <Field label="Crecimiento perpetuo" value={tg} set={setTg} max={5} suffix="%" />
            <Field label="Acciones (M)" value={acc} set={setAcc} min={50} max={5000} step={50} />
            <Field label="Precio de mercado actual $" value={precio} set={setPrecio} max={600} step={5} />
          </div>
          <div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer>
                <BarChart data={calc.bars}>
                  <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
                  <XAxis dataKey="y" stroke={C.muted} fontSize={11} />
                  <YAxis stroke={C.muted} fontSize={10} />
                  <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}` }} formatter={(v) => money(v) + "M"} />
                  <Bar dataKey="pv" fill={C.gold} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="stat" style={{ marginTop: 10, textAlign: "center", border: `1px solid ${up > 0 ? C.green : C.red}` }}>
              <div className="lbl">Valor justo estimado</div>
              <div className="statbig" style={{ color: C.gold }}>{money(calc.fairPrice)}</div>
              <div className="mono" style={{ fontSize: 13, color: up > 0 ? C.green : C.red, marginTop: 4 }}>
                {up > 0 ? "▲ INFRAVALORADA" : "▼ SOBREVALORADA"} {pct(Math.abs(up))} vs mercado
              </div>
            </div>
          </div>
        </div>
        <div className="warn">
          Regla de oro de Burry: cambia el crecimiento de 8% a 12% y mira cómo el "valor justo" se dispara. Por eso los analistas mienten con sus modelos — basta inflar un supuesto. **Sé pesimista en tus supuestos.**
        </div>
      </div>
  );
}

/* 4. Portafolio + simulador de crash */
function PortfolioTool() {
  const [acc, setAcc] = useState(50);
  const [bond, setBond] = useState(25);
  const [cash, setCash] = useState(15);
  const [cry, setCry] = useState(10);
  const total = acc + bond + cash + cry;
  const data = [
    { name: "Acciones", v: acc, c: C.gold, crash: -0.45 },
    { name: "Bonos", v: bond, c: C.blue, crash: 0.05 },
    { name: "Efectivo", v: cash, c: C.muted, crash: 0 },
    { name: "Cripto", v: cry, c: C.green, crash: -0.7 },
  ];
  const drawdown = data.reduce((s, d) => s + (d.v / 100) * d.crash, 0) * 100;
  return (
      <div className="card">
        <h3 style={{ fontSize: 20 }}>Constructor de portafolio + simulador de pánico</h3>
        <p style={{ color: C.muted, fontSize: 14, marginTop: 2 }}>Arma tu mezcla y mira qué le pasaría en una crisis estilo 2008. Diversificar no es para "ganar más"; es para no quebrar.</p>
        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <Field label="Acciones" value={acc} set={setAcc} suffix="%" />
            <Field label="Bonos / CETES" value={bond} set={setBond} suffix="%" />
            <Field label="Efectivo" value={cash} set={setCash} suffix="%" />
            <Field label="Cripto" value={cry} set={setCry} suffix="%" />
            <div className="mono" style={{ fontSize: 13, color: total === 100 ? C.green : C.red }}>
              Total: {total}% {total !== 100 && "(ajusta a 100%)"}
            </div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="v" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {data.map((d, i) => <Cell key={i} fill={d.c} />)}
                </Pie>
                <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}` }} formatter={(v) => v + "%"} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="row" style={{ marginTop: 6 }}>
          <Stat label="Caída en crisis simulada" value={pct(drawdown)} color={C.red}
                sub="acciones -45% · cripto -70% · bonos +5%" />
          <Stat label="$100,000 quedarían en" value={money(100000 * (1 + drawdown / 100))} color={C.gold} />
        </div>
        <div className="callout">
          ¿Aguantarías ver tu cuenta caer ese porcentaje sin vender en pánico? Si la respuesta es no, tienes demasiado riesgo. La tolerancia al dolor es tu verdadero límite, no las matemáticas.
        </div>
      </div>
  );
}

/* 5. Impacto de comisiones (truco de Wall Street) */
function FeeTool() {
  const [years, setYears] = useState(30);
  const ini = 100000, ret = 9;
  const data = useMemo(() => {
    const arr = [];
    for (let y = 0; y <= years; y++) {
      arr.push({
        y,
        index: Math.round(ini * Math.pow(1 + (ret - 0.1) / 100, y)),
        fondo: Math.round(ini * Math.pow(1 + (ret - 2) / 100, y)),
      });
    }
    return arr;
  }, [years]);
  const last = data[data.length - 1];
  const robado = last.index - last.fondo;
  return (
      <div className="card">
        <h3 style={{ fontSize: 20 }}>El robo silencioso: comisiones</h3>
        <p style={{ color: C.muted, fontSize: 14, marginTop: 2 }}>Mismo rendimiento bruto (9%). Un fondo indexado cobra ~0.1%. Un fondo "administrado" cobra ~2%. Mira el daño a largo plazo.</p>
        <Field label="Años" value={years} set={setYears} min={5} max={40} />
        <div style={{ height: 210 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="y" stroke={C.muted} fontSize={11} />
              <YAxis stroke={C.muted} fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}` }} formatter={(v) => money(v)} />
              <Line dataKey="index" stroke={C.green} strokeWidth={2.5} dot={false} name="Indexado (0.1%)" />
              <Line dataKey="fondo" stroke={C.red} strokeWidth={2.5} dot={false} name="Fondo activo (2%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="row">
          <Stat label="Indexado" value={money(last.index)} color={C.green} />
          <Stat label="Fondo con comisión" value={money(last.fondo)} color={C.red} />
          <Stat label="Te 'cobraron'" value={money(robado)} color={C.gold} sub="por una comisión de 2%" />
        </div>
        <div className="warn">El secreto que el asesor de tu banco no te dice: en 30 años una comisión del 2% se puede comer la mitad de tu fortuna. No por mala suerte — por diseño.</div>
      </div>
  );
}

/* 6. Estimador de impuestos México (ILUSTRATIVO) */
function TaxTool() {
  const [ganAcc, setGanAcc] = useState(50000);
  const [retAcc, setRetAcc] = useState(10);
  const [div, setDiv] = useState(20000);
  const [retDiv, setRetDiv] = useState(10);
  const [ganCry, setGanCry] = useState(30000);
  const [isrMarg, setIsrMarg] = useState(30);
  const impAcc = ganAcc * retAcc / 100;
  const impDiv = div * retDiv / 100;
  const impCry = ganCry * isrMarg / 100;
  const totalImp = impAcc + impDiv + impCry;
  const totalGan = ganAcc + div + ganCry;
  return (
      <div className="card">
        <h3 style={{ fontSize: 20 }}>Estimador de impuestos (México · SAT)</h3>
        <div className="warn">⚠️ EDUCATIVO. Las tasas son aproximadas y cambian. Esto NO es asesoría fiscal — confirma TODO con un contador antes de declarar.</div>
        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <Field label="Ganancia venta acciones BMV $" value={ganAcc} set={setGanAcc} max={500000} step={5000} />
            <Field label="Retención acciones" value={retAcc} set={setRetAcc} max={20} suffix="%" />
            <Field label="Dividendos recibidos $" value={div} set={setDiv} max={300000} step={5000} />
            <Field label="Retención dividendos" value={retDiv} set={setRetDiv} max={20} suffix="%" />
            <Field label="Ganancia cripto $" value={ganCry} set={setGanCry} max={500000} step={5000} />
            <Field label="Tu tasa ISR marginal" value={isrMarg} set={setIsrMarg} min={2} max={35} suffix="%" />
          </div>
          <div>
            <Stat label="ISR acciones (retención)" value={money(impAcc)} color={C.red} />
            <Stat label="ISR dividendos" value={money(impDiv)} color={C.red} />
            <Stat label="ISR cripto (acumulable)" value={money(impCry)} color={C.red} sub="se suma a tus demás ingresos" />
            <div className="stat" style={{ marginTop: 8, border: `1px solid ${C.gold}` }}>
              <div className="lbl">Impuesto total estimado</div>
              <div className="statbig" style={{ color: C.gold }}>{money(totalImp)}</div>
              <div className="mono" style={{ fontSize: 11, color: C.muted }}>tasa efectiva ≈ {pct(totalGan ? totalImp / totalGan * 100 : 0)}</div>
            </div>
          </div>
        </div>
        <div className="callout">
          <strong className="disp" style={{ color: C.gold }}>Cómo se DEDUCE legalmente (en general):</strong> las <em>pérdidas</em> en venta de acciones pueden compensar ganancias del mismo tipo; gastos de comisiones del intermediario suelen restarse de la ganancia; aportar a un plan de retiro (Afore voluntaria / PPR) puede ser deducible hasta cierto tope. La clave: <strong>guarda TODOS los comprobantes</strong> y declara — el SAT ya cruza datos con los brokers.
        </div>
      </div>
  );
}

/* 7. Detector de burbujas */
function BubbleTool() {
  const signals = [
    { t: "Tu taxi/peluquero te recomienda la inversión", w: 3 },
    { t: "P/E mayor a 50 sin crecimiento que lo justifique", w: 3 },
    { t: "\"Esta vez es diferente\" se repite en todos lados", w: 3 },
    { t: "FOMO masivo en redes / influencers pagados", w: 2 },
    { t: "Precio subió +100% en menos de 6 meses", w: 2 },
    { t: "Salen a bolsa empresas sin ganancias y se disparan", w: 2 },
    { t: "Volumen de compra explota anormalmente", w: 1 },
    { t: "Apalancamiento / créditos para invertir de moda", w: 2 },
  ];
  const [checked, setChecked] = useState({});
  const score = signals.reduce((s, sig, i) => s + (checked[i] ? sig.w : 0), 0);
  const max = signals.reduce((s, sig) => s + sig.w, 0);
  const lvl = score >= 9 ? { t: "🚨 BURBUJA PROBABLE — protégete", c: C.red } : score >= 5 ? { t: "⚠️ Cuidado, recalentado", c: C.gold } : { t: "✓ Sin señales extremas", c: C.green };
  return (
      <div className="card">
        <h3 style={{ fontSize: 20 }}>Detector de burbujas</h3>
        <p style={{ color: C.muted, fontSize: 14, marginTop: 2 }}>Marca lo que veas en un activo "de moda" hoy. Burry no predijo 2008 por magia: contó señales que todos ignoraban.</p>
        <div style={{ marginTop: 10 }}>
          {signals.map((s, i) => (
              <label key={i} className="flip" style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 7,
                borderColor: checked[i] ? C.gold : C.border }}
                     onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}>
                <div style={{ width: 20, height: 20, borderRadius: 5, border: `1px solid ${C.border}`, background: checked[i] ? C.gold : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  {checked[i] && <Check size={14} color="#1a1206" />}
                </div>
                <span style={{ fontSize: 14.5 }}>{s.t}</span>
              </label>
          ))}
        </div>
        <div className="stat" style={{ textAlign: "center", border: `1px solid ${lvl.c}`, marginTop: 10 }}>
          <div className="statbig" style={{ color: lvl.c }}>{score} / {max}</div>
          <div className="mono" style={{ color: lvl.c, fontSize: 14 }}>{lvl.t}</div>
        </div>
      </div>
  );
}

/* 8. Decodificador de jerga */
function JargonTool() {
  const terms = [
    { t: "Bullish / Bearish", d: "Optimista (toro, embiste hacia arriba) / Pesimista (oso, manotea hacia abajo). Es 'creo que sube/baja' con corbata." },
    { t: "Liquidez", d: "Qué tan rápido conviertes algo en efectivo sin perder valor. Tu cuenta es líquida; tu casa, no." },
    { t: "Short / vender en corto", d: "Apostar a que algo BAJA. Pides prestada una acción, la vendes cara, la recompras barata y te quedas la diferencia. Lo que hizo Burry contra el mercado hipotecario." },
    { t: "Hedge", d: "Un seguro. Pagas un poco para protegerte si todo sale mal. 'Hedge fund' = fondo que (supuestamente) se cubre." },
    { t: "Dividendo", d: "Parte de las ganancias que la empresa te reparte por ser dueño. Dinero que cae solo." },
    { t: "Spread (bid-ask)", d: "La diferencia entre lo que alguien paga y lo que otro pide. Ahí gana el intermediario, en silencio." },
    { t: "Apalancamiento (leverage)", d: "Invertir con dinero prestado. Multiplica ganancias Y pérdidas. La forma #1 de quebrar rápido." },
    { t: "Volatilidad", d: "Cuánto se mueve el precio. Alta volatilidad = montaña rusa. No es lo mismo que riesgo, aunque te lo vendan así." },
    { t: "Payment for order flow", d: "El broker 'gratis' vende tus órdenes a terceros que se adelantan a ti. Si no pagas por el producto, el producto eres tú." },
    { t: "Dollar-cost averaging (DCA)", d: "Invertir la misma cantidad cada mes, pase lo que pase. Aburrido y casi imbatible para el inversionista normal." },
    { t: "Market cap", d: "Valor total de la empresa = precio × número de acciones. Una acción de $5 puede valer más que una de $500." },
    { t: "FCF (flujo de caja libre)", d: "El dinero REAL que sobra después de gastos e inversiones. Las ganancias se maquillan; el efectivo no tanto." },
  ];
  const [open, setOpen] = useState(null);
  return (
      <div className="card">
        <h3 style={{ fontSize: 20 }}>Decodificador anti-jerga</h3>
        <p style={{ color: C.muted, fontSize: 14, marginTop: 2 }}>Wall Street complica el lenguaje a propósito para que sientas que necesitas un intermediario. Aquí está en cristiano. Toca para revelar.</p>
        <div className="grid2" style={{ marginTop: 12 }}>
          {terms.map((t, i) => (
              <div key={i} className="flip" onClick={() => setOpen(open === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong className="mono" style={{ color: C.gold, fontSize: 13.5 }}>{t.t}</strong>
                  {open === i ? <Eye size={15} color={C.muted} /> : <Lock size={14} color={C.muted} />}
                </div>
                {open === i && <p className="fade" style={{ margin: "8px 0 0", fontSize: 14, color: C.text }}>{t.d}</p>}
              </div>
          ))}
        </div>
      </div>
  );
}

/* 9. Clasificador de Moat */
function MoatTool() {
  const cases = [
    { e: "Apple: la gente paga el doble por el logo de la manzana", a: "Marca" },
    { e: "Windows: cambiar de sistema operativo en una empresa es un infierno", a: "Costos de cambio" },
    { e: "Visa: aceptada en todos lados, más comercios = más usuarios", a: "Efecto de red" },
    { e: "Walmart: compra tan barato que nadie puede competir en precio", a: "Ventaja de costo" },
    { e: "Pfizer: patente que prohíbe copiar su medicina por años", a: "Patente" },
  ];
  const opts = ["Marca", "Costos de cambio", "Efecto de red", "Ventaja de costo", "Patente"];
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const c = cases[i];
  return (
      <div className="card">
        <h3 style={{ fontSize: 20 }}>¿Qué tipo de "foso" (moat) protege a esta empresa?</h3>
        <p style={{ color: C.muted, fontSize: 14, marginTop: 2 }}>Un moat es la barrera que impide que los competidores te coman. Burry/Buffett solo compran empresas con foso ancho.</p>
        <div className="callout" style={{ fontSize: 16 }}>{c.e}</div>
        <div className="grid2">
          {opts.map((o) => {
            let cls = "opt";
            if (pick !== null) { if (o === c.a) cls += " correct"; else if (o === pick) cls += " wrong"; }
            return <button key={o} className={cls} onClick={() => pick === null && setPick(o)}>{o}</button>;
          })}
        </div>
        {pick !== null && (
            <button className="btn" style={{ marginTop: 12 }}
                    onClick={() => { setI((i + 1) % cases.length); setPick(null); }}>Siguiente caso</button>
        )}
      </div>
  );
}

/* ============================================================
   CONTENIDO DE LOS MÓDULOS
   ============================================================ */
const MODULES = [
  {
    id: "mente", num: "01", title: "Mentalidad & Dinero", icon: Brain,
    intro: "Antes de tocar una sola acción: por qué el 90% pierde y qué es el dinero de verdad.",
    theory: [
      { h: "¿Qué es el dinero?", p: "El dinero no tiene valor real. Es un acuerdo colectivo, una historia que todos decidimos creer. Entiende esto y dejas de tratarlo con miedo o codicia: es una herramienta, no una identidad." },
      { h: "Por qué pierde el 90%", p: "No por falta de inteligencia, sino de temperamento. Compran cuando hay euforia (caro) y venden en pánico (barato). El mercado transfiere dinero del impaciente al paciente." },
      { h: "La regla de Burry", p: "Pensar por ti mismo. Si tu tesis depende de que otros estén de acuerdo, no es tuya. Estar solo y tener razón es donde se hace el dinero — y donde más duele esperar." },
    ],
    callout: "Tu mayor enemigo en la inversión no es el mercado ni Wall Street. Eres tú: tus emociones, tu impaciencia, tu necesidad de tener razón rápido.",
    tool: null,
    quiz: [
      { q: "¿Por qué pierde dinero la mayoría de los inversionistas?", options: ["Por no ser suficientemente inteligentes", "Por su temperamento: compran caro y venden en pánico", "Porque el mercado está amañado contra ellos", "Por mala suerte"], correct: 1, explain: "El éxito en inversión es 80% psicología. La inteligencia importa poco si no controlas tus emociones." },
      { q: "Según la filosofía de Burry, una buena tesis de inversión...", options: ["Debe ser aprobada por expertos", "Está de moda en redes", "Es tuya aunque estés solo en ella", "La recomienda tu banco"], correct: 2, explain: "El valor se encuentra donde la multitud NO está mirando. Si todos ya lo saben, ya está en el precio." },
      { q: "El dinero, en esencia, es...", options: ["Oro físico", "Un acuerdo colectivo de confianza", "Algo con valor intrínseco", "Creado solo por los gobiernos"], correct: 1, explain: "El dinero vale porque colectivamente creemos que vale. Es una herramienta de intercambio, nada más." },
    ],
  },
  {
    id: "acciones", num: "02", title: "Acciones & Mercados", icon: TrendingUp,
    intro: "Qué es realmente una acción, cómo se forma un precio y dónde compras en México.",
    theory: [
      { h: "Una acción = un pedazo de empresa", p: "No es un boleto de lotería con un ticker. Eres dueño de una fracción de un negocio real, con fábricas, empleados y ganancias. Si piensas como dueño, no como apostador, ya ganaste la mitad." },
      { h: "¿Quién pone el precio?", p: "Nadie y todos. El precio es el último acuerdo entre un comprador y un vendedor. Por eso fluctúa cada segundo: refleja emoción a corto plazo y valor a largo plazo." },
      { h: "Dónde invertir desde México", p: "La Bolsa Mexicana de Valores (BMV, índice IPC) o mercados globales (S&P 500, NASDAQ) vía brokers como GBM, Kuspit o casas internacionales. Empieza con poco, entiende comisiones y horarios." },
    ],
    callout: "Benjamin Graham: 'A corto plazo el mercado es una máquina de votar; a largo plazo, una de pesar.' La emoción manda hoy; los fundamentos, en una década.",
    tool: "ratios",
    quiz: [
      { q: "Comprar una acción significa...", options: ["Apostar a un número", "Ser dueño de una fracción de la empresa", "Prestarle dinero a la empresa", "Comprar deuda"], correct: 1, explain: "Eres copropietario del negocio. Esa mentalidad cambia todo cómo decides." },
      { q: "¿Qué determina el precio de una acción en cualquier instante?", options: ["El gobierno", "El último acuerdo entre comprador y vendedor", "El valor en libros", "El CEO"], correct: 1, explain: "El precio es solo el punto donde la oferta y la demanda se cruzan ahora mismo. No es 'la verdad' sobre la empresa." },
    ],
  },
  {
    id: "compuesto", num: "03", title: "Interés Compuesto & Inflación", icon: Percent,
    intro: "La fuerza más poderosa de las finanzas. Si solo entiendes un módulo, que sea este.",
    theory: [
      { h: "El efecto bola de nieve", p: "Tus ganancias generan ganancias. Al principio parece insignificante; después de 15-20 años se vuelve absurdo. El tiempo es tu mayor activo, no el capital." },
      { h: "La inflación: el ladrón invisible", p: "Si tu dinero crece 4% pero la inflación es 5%, te empobreces aunque tu cuenta diga 'más'. Invertir no es opcional: es defensa contra la erosión silenciosa." },
    ],
    callout: "Empezar a los 20 con poco le gana a empezar a los 35 con mucho. El interés compuesto premia brutalmente al que empieza temprano y no se sale.",
    tool: "compound",
    quiz: [
      { q: "¿Por qué empezar temprano es tan poderoso?", options: ["Porque las acciones suben más en la juventud", "Porque el interés compuesto necesita TIEMPO para explotar", "Porque pagas menos impuestos", "No importa cuándo empieces"], correct: 1, explain: "La magia del compuesto está en los últimos años. Sin tiempo, no hay bola de nieve." },
      { q: "Si tu inversión rinde 4% y la inflación es 5%, tú...", options: ["Ganas 4%", "Ganas 1%", "Pierdes poder de compra real", "Estás igual"], correct: 2, explain: "El rendimiento real es nominal menos inflación: -1%. Tu dinero compra menos cada año." },
    ],
  },
  {
    id: "dcf", num: "04", title: "Análisis Fundamental & DCF", icon: Calculator,
    intro: "Cómo poner precio a una empresa de verdad. El arma secreta que parece magia y es álgebra.",
    theory: [
      { h: "Los 3 estados financieros", p: "Balance (qué tiene y debe), Estado de resultados (cuánto gana) y Flujo de efectivo (cuánto dinero real entra). El tercero es el más difícil de falsear: síguelo." },
      { h: "DCF en una frase", p: "El valor de una empresa = todo el dinero que generará en el futuro, traído a valor de hoy. Proyectas flujos, los 'descuentas' por el tiempo y el riesgo, y comparas con el precio de mercado." },
      { h: "Margen de seguridad", p: "Nunca compres al valor justo exacto. Compra solo cuando el precio está MUY por debajo de tu estimación. Ese colchón te protege de tus propios errores de cálculo." },
    ],
    callout: "Un modelo financiero es tan bueno como sus supuestos. Cambia el crecimiento 3 puntos y el 'valor justo' cambia 50%. Por eso debes ser conservador hasta ser aburrido.",
    tool: "dcf",
    quiz: [
      { q: "¿Cuál estado financiero es el más difícil de manipular?", options: ["Balance general", "Estado de resultados", "Flujo de efectivo", "El reporte anual"], correct: 2, explain: "Las ganancias contables se maquillan con trucos legales. El efectivo que entra y sale es mucho más crudo y real." },
      { q: "¿Qué es el 'margen de seguridad'?", options: ["Comprar al precio exacto del DCF", "Comprar muy por debajo del valor estimado", "Diversificar mucho", "Usar stop loss"], correct: 1, explain: "Es el colchón entre el precio y tu estimación de valor. Te protege cuando (no si) te equivocas en los supuestos." },
      { q: "Si subes el supuesto de crecimiento en un DCF, el valor justo...", options: ["Baja", "No cambia", "Sube mucho", "Se vuelve negativo"], correct: 2, explain: "Pequeños cambios en supuestos = grandes cambios en el resultado. Por eso los analistas inflan modelos para justificar precios altos." },
    ],
  },
  {
    id: "moat", num: "05", title: "Moat & Ventaja Competitiva", icon: Shield,
    intro: "Por qué algunas empresas ganan dinero por décadas y otras mueren. El 'foso' del castillo.",
    theory: [
      { h: "¿Qué es un moat?", p: "La barrera que impide que la competencia te robe las ganancias: marca, costos de cambio, efecto de red, ventaja de costo, patentes o escala. Sin foso, las ganancias atraen depredadores que las destruyen." },
      { h: "El moat justifica el precio", p: "Una empresa con foso fuerte merece una P/E más alta. Una sin foso con P/E baja suele ser una trampa: barata porque va a desaparecer." },
    ],
    callout: "Buffett: 'Busco castillos económicos protegidos por fosos imposibles de cruzar.' El precio importa, pero la durabilidad del negocio importa más.",
    tool: "moat",
    quiz: [
      { q: "¿Qué tipo de moat tiene Facebook/WhatsApp?", options: ["Patente", "Efecto de red (más usuarios = más valioso)", "Ventaja de costo", "Marca"], correct: 1, explain: "Cada usuario nuevo hace la red más útil para todos. Por eso es casi imposible competir contra una red ya establecida." },
      { q: "Una empresa con P/E muy baja y SIN moat probablemente es...", options: ["Una ganga segura", "Una trampa de valor", "La mejor inversión", "Un negocio con foso oculto"], correct: 1, explain: "Está barata por una razón: el mercado anticipa que va a deteriorarse. Barato no es igual a buena inversión." },
    ],
  },
  {
    id: "ciclos", num: "06", title: "Ciclos, Crisis & Burbujas", icon: AlertTriangle,
    intro: "El mercado respira: euforia y pánico se repiten. Aprende a leer el ciclo como lo hizo Burry.",
    theory: [
      { h: "Las 4 fases", p: "Expansión → Pico → Contracción → Valle, y vuelta a empezar. Las mayores oportunidades nacen en el valle (cuando todos huyen) y los mayores riesgos en el pico (cuando todos celebran)." },
      { h: "Anatomía de una burbuja", p: "Innovación real → entusiasmo → especulación pura ('esta vez es diferente') → pico → pánico → caída del 70-90%. Siempre el mismo guion, distintos protagonistas: tulipanes, puntocom, hipotecas, criptos, acciones meme." },
      { h: "La jugada de Burry (2008)", p: "Leyó miles de contratos hipotecarios que nadie quería leer. Vio que daban créditos a gente sin ingresos. Apostó contra el sistema y aguantó 2 años de pérdidas y burlas antes de ganar $700M. Convicción + paciencia." },
    ],
    callout: "Howard Marks: 'No puedes predecir, pero puedes prepararte.' No sabrás cuándo revienta la burbuja, pero sí puedes saber que estás en una.",
    tool: "bubble",
    quiz: [
      { q: "¿En qué fase del ciclo están las mejores oportunidades de compra?", options: ["En el pico de euforia", "En el valle, cuando todos venden en pánico", "En la expansión", "Nunca hay buen momento"], correct: 1, explain: "Compra cuando hay sangre en las calles. El pánico ajeno crea precios irracionales a tu favor." },
      { q: "La frase '¡esta vez es diferente!' suele indicar...", options: ["Una nueva era de prosperidad", "Una señal clásica de burbuja", "Que debes comprar más", "Análisis fundamental sólido"], correct: 1, explain: "Es la frase más cara de la historia financiera. Casi nunca es diferente." },
      { q: "¿Qué hizo especial a Burry en 2008?", options: ["Tuvo suerte", "Leyó la letra chica que nadie más leía y aguantó la presión", "Recibió información privilegiada", "Siguió a la multitud"], correct: 1, explain: "Hizo el trabajo aburrido que nadie quería hacer y tuvo el temperamento de aguantar 2 años en pérdida defendiendo su tesis." },
    ],
  },
  {
    id: "psico", num: "07", title: "Psicología & Sesgos", icon: Eye,
    intro: "Tu cerebro está programado para perder dinero. Conoce a tus enemigos internos.",
    theory: [
      { h: "Los sesgos que te cuestan caro", p: "Aversión a la pérdida (aguantas perdedores y vendes ganadores), FOMO (compras en el tope por miedo a quedarte fuera), sesgo de confirmación (solo escuchas lo que ya creías) y exceso de confianza." },
      { h: "El antídoto: reglas escritas", p: "Las emociones no se vencen con fuerza de voluntad en el momento del pánico. Se vencen con un plan escrito de antemano: cuándo comprar, cuándo vender, cuánto arriesgar. Y se obedece." },
    ],
    callout: "Escribe tu tesis ANTES de comprar. Cuando el precio caiga 30% y tu cerebro grite '¡vende!', relee tu plan. Si la tesis sigue intacta, no pasó nada.",
    tool: null,
    quiz: [
      { q: "Vendes rápido tus ganadores pero aguantas tus perdedores eternamente. Es...", options: ["FOMO", "Aversión a la pérdida", "Sesgo de confirmación", "Buena estrategia"], correct: 1, explain: "Odiamos materializar pérdidas, así que las cargamos esperando 'recuperar', mientras cortamos ganancias por miedo. Exactamente al revés de lo óptimo." },
      { q: "El mejor antídoto contra las decisiones emocionales es...", options: ["Tener más fuerza de voluntad", "Un plan escrito de antemano y obedecerlo", "Revisar el precio cada hora", "Seguir a un influencer"], correct: 1, explain: "En el momento del pánico tu cerebro racional se apaga. Solo un plan hecho en frío te salva." },
      { q: "Comprar algo solo porque 'está subiendo y no me quiero quedar fuera' es...", options: ["Análisis técnico", "FOMO — y suele marcar el tope", "Buena señal de momentum", "Diversificación"], correct: 1, explain: "Cuando el FOMO te empuja, el precio ya subió. Sueles comprar justo el pico." },
    ],
  },
  {
    id: "portafolio", num: "08", title: "Portafolio & Riesgo", icon: Layers,
    intro: "Cómo armar tu mezcla para no quebrar y dormir tranquilo en la próxima crisis.",
    theory: [
      { h: "Diversificación inteligente", p: "No pongas todo en una sola apuesta. Reparte entre clases de activos (acciones, bonos, efectivo, algo de cripto) y geografías. El objetivo no es maximizar ganancia: es sobrevivir a lo inesperado." },
      { h: "Tamaño de posición", p: "Ninguna apuesta debería poder arruinarte. Regla común: no más del 5% en una sola acción cuando empiezas. Vivir para invertir otro día vale más que un golazo." },
      { h: "Rebalanceo", p: "Una o dos veces al año, regresa a tus porcentajes objetivo. Esto te obliga a vender lo que subió (caro) y comprar lo que bajó (barato). Disciplina automática contra la emoción." },
    ],
    callout: "La primera regla no es ganar mucho: es no perderlo todo. El que sobrevive a 3 crisis le gana al genio que quebró en la primera.",
    tool: "portfolio",
    quiz: [
      { q: "¿Cuál es el objetivo principal de diversificar?", options: ["Maximizar ganancias", "Sobrevivir a lo inesperado sin quebrar", "Pagar menos impuestos", "Seguir al mercado"], correct: 1, explain: "Diversificar reduce el riesgo de ruina, no necesariamente aumenta el retorno. Es defensa, no ataque." },
      { q: "El rebalanceo te obliga a...", options: ["Comprar lo que sube y vender lo que baja", "Vender lo que subió (caro) y comprar lo que bajó (barato)", "No hacer nada", "Vender todo en crisis"], correct: 1, explain: "Es disciplina contrarian automática: te hace actuar al revés de tus emociones." },
    ],
  },
  {
    id: "mexico", num: "09", title: "México: SAT & Impuestos", icon: Landmark,
    intro: "Lo que sí o sí debes saber para invertir desde México sin meterte en problemas con Hacienda.",
    theory: [
      { h: "Ganancias en bolsa", p: "Al vender acciones en la BMV vía un intermediario, suele haber una retención de ISR sobre la ganancia (frecuentemente ~10% para personas físicas). El broker normalmente retiene y reporta — pero tú sigues siendo responsable de declarar." },
      { h: "Dividendos y cripto", p: "Los dividendos también tienen retención. Las ganancias en cripto el SAT las trata como ingreso acumulable: se suman a tus demás ingresos y pagan según tu tarifa de ISR. Esta área cambia seguido — verifica cada año." },
      { h: "Cómo se deduce (legalmente)", p: "Las pérdidas pueden compensar ganancias del mismo tipo; las comisiones del intermediario suelen restarse; aportar a un plan personal de retiro (PPR) puede ser deducible hasta cierto tope anual. Guarda TODO comprobante." },
    ],
    callout: "⚠️ Las tasas y reglas fiscales cambian y dependen de tu caso. Este módulo es educativo: antes de declarar, paga una consulta con un contador. Sale más barato que una multa del SAT.",
    tool: "tax",
    quiz: [
      { q: "Las ganancias por cripto en México el SAT las trata, en general, como...", options: ["Exentas de impuestos", "Ingreso acumulable que paga ISR según tu tarifa", "Solo 1% fijo", "Igual que el oro"], correct: 1, explain: "Se acumulan a tus demás ingresos. No están exentas, aunque mucha gente cree que sí. Verifica el detalle con un contador." },
      { q: "¿Qué puede ayudarte a reducir legalmente tu base gravable?", options: ["No declarar", "Compensar con pérdidas y deducir aportaciones a un PPR", "Sacar el dinero en efectivo", "Usar la cuenta de otra persona"], correct: 1, explain: "Las pérdidas compensables y los planes de retiro deducibles son herramientas legales. Lo otro es evasión: ilegal y peligroso." },
    ],
  },
  {
    id: "cripto", num: "10", title: "Criptos sin Arruinarte", icon: Bitcoin,
    intro: "Qué es real, qué es humo, y cómo no perder todo en el casino más volátil del mundo.",
    theory: [
      { h: "Blockchain en simple", p: "Un libro de cuentas público que nadie controla y nadie puede borrar. Bitcoin es 'oro digital escaso'; Ethereum es una plataforma para construir aplicaciones. El 95% del resto es ruido o estafa." },
      { h: "Custodia: tus llaves, tu dinero", p: "'Hot wallet' (en línea, cómoda, hackeable) vs 'cold wallet' (offline, segura, como un Ledger). Regla cripto: si no controlas las llaves privadas, no es tuyo de verdad — es una promesa del exchange." },
      { h: "Gestión del riesgo", p: "La cripto puede multiplicar o irse a cero. Regla de oro: invierte solo lo que estés dispuesto a perder por completo (5-10% del portafolio máximo) y nunca con dinero prestado." },
    ],
    callout: "El 90% de los proyectos cripto morirán. La volatilidad de 50-80% es normal, no excepcional. Si no aguantas eso, este no es tu activo — y está bien.",
    tool: null,
    quiz: [
      { q: "'Si no controlas las llaves privadas...'", options: ["No pasa nada", "...no es realmente tuyo, es una promesa del exchange", "Es más seguro", "El gobierno te protege"], correct: 1, explain: "Quiebras de exchanges (FTX, etc.) dejaron a miles sin nada. Una cold wallet te da custodia real." },
      { q: "¿Cuánto del portafolio es prudente en cripto para alguien que empieza?", options: ["Todo", "50%", "5-10% máximo, solo lo que puedas perder", "Lo que te preste el banco"], correct: 2, explain: "Es un activo de altísimo riesgo. Posición pequeña, nunca apalancada, solo capital que puedas perder sin afectar tu vida." },
    ],
  },
  {
    id: "trucos", num: "11", title: "Trucos de Wall Street & Reddit", icon: Zap,
    intro: "Los 'secretos' que la industria complica a propósito — y las verdades aburridas que sí funcionan.",
    theory: [
      { h: "Por qué lo hacen difícil", p: "Si entendieras que un fondo indexado barato le gana al 90% de los gestores 'profesionales', no pagarías sus comisiones del 2%. La complejidad es el producto que te venden — y casi nunca la necesitas." },
      { h: "Las verdades aburridas (las que funcionan)", p: "1) Invierte constante cada mes (DCA). 2) Comisiones bajas. 3) No toques tu dinero por décadas. 4) No intentes adivinar el momento perfecto. 5) Reinvierte dividendos. Aburrido, sí. Imbatible para el 99%." },
      { h: "Lo que aprendió Reddit a las malas", p: "Las 'acciones meme' enriquecen a quien entra temprano y arruinan al último. El apalancamiento y las opciones son aceleradores hacia la quiebra. 'Diamond hands' sin tesis es solo terquedad disfrazada de estrategia." },
    ],
    callout: "El mejor truco no es un truco: gasta menos de lo que ganas, invierte la diferencia en activos baratos y diversificados, y déjalo crecer 20 años. La industria odia esto porque no le deja comisiones.",
    tool: "fee",
    quiz: [
      { q: "¿Por qué Wall Street complica el lenguaje y los productos?", options: ["Porque es necesario", "Para justificar comisiones y que dependas de intermediarios", "Por transparencia", "Para protegerte"], correct: 1, explain: "La complejidad vende. Si supieras lo simple que puede ser, no pagarías sus honorarios." },
      { q: "En 30 años, una comisión anual del 2% puede...", options: ["Ser irrelevante", "Comerse cerca de la mitad de tu fortuna final", "Aumentar tu rendimiento", "Solo afectar el primer año"], correct: 1, explain: "El interés compuesto también funciona sobre las comisiones, en tu contra. Es el robo más silencioso de las finanzas." },
      { q: "La estrategia más confiable para el inversionista normal es...", options: ["Day trading agresivo", "Acciones meme con apalancamiento", "Invertir constante en índices baratos por décadas", "Adivinar el momento perfecto"], correct: 2, explain: "Aburrido, constante, barato y a largo plazo. Le gana a la mayoría de los 'genios' que intentan ser listos." },
    ],
  },
];

const TOOLS = { compound: CompoundTool, ratios: RatioTool, dcf: DCFTool, portfolio: PortfolioTool, fee: FeeTool, tax: TaxTool, bubble: BubbleTool, jargon: JargonTool, moat: MoatTool };

/* ============================================================
   DATOS EN VIVO DEL TICKER
   - Cripto y USD/MXN funcionan SIN configurar nada (APIs gratuitas).
   - Para ver acciones/índices, consigue una key gratis en finnhub.io
     y pégala aquí abajo. Si la dejas vacía, solo se muestran cripto + FX.
   ============================================================ */
const FINNHUB_KEY = "d8eesghr01qth3ch0l1gd8eesghr01qth3ch0l20"; // <- opcional: "tu_key_gratis_de_finnhub"

const FALLBACK_TICKER = [
  { label: "BTC", price: 64000, chg: -3.4 },
  { label: "ETH", price: 3100, chg: 1.2 },
  { label: "USD/MXN", price: 17.2, chg: null },
  { label: "S&P 500", price: 5200, chg: 0.6 },
  { label: "AAPL", price: 190, chg: 0.9 },
];

const fmtPrice = (n) => n >= 100 ? n.toLocaleString("es-MX", { maximumFractionDigits: 0 }) : n.toFixed(2);

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [view, setView] = useState("inicio");
  // Progreso persistente: se guarda en el navegador (funciona en tu proyecto Vite).
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wsa_progress") || "{}"); }
    catch { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem("wsa_progress", JSON.stringify(done)); } catch {}
  }, [done]);

  // ---- Ticker en vivo ----
  const [ticker, setTicker] = useState(null); // null = datos de ejemplo
  const [live, setLive] = useState(false);
  useEffect(() => {
    let alive = true;
    async function load() {
      const items = [];
      // Cripto (gratis, sin key)
      try {
        const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true");
        const d = await r.json();
        [["BTC", "bitcoin"], ["ETH", "ethereum"], ["SOL", "solana"]].forEach(([sym, id]) => {
          if (d[id]) items.push({ label: sym, price: d[id].usd, chg: d[id].usd_24h_change });
        });
      } catch {}
      // Tipo de cambio (gratis, sin key)
      try {
        const r = await fetch("https://open.er-api.com/v6/latest/USD");
        const d = await r.json();
        if (d?.rates?.MXN) items.push({ label: "USD/MXN", price: d.rates.MXN, chg: null });
        if (d?.rates?.EUR && d?.rates?.MXN) items.push({ label: "EUR/MXN", price: d.rates.MXN / d.rates.EUR, chg: null });
      } catch {}
      // Acciones / índices (opcional, requiere key de Finnhub)
      if (FINNHUB_KEY) {
        for (const [label, sym] of [["S&P 500", "SPY"], ["NASDAQ", "QQQ"], ["AAPL", "AAPL"]]) {
          try {
            const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${FINNHUB_KEY}`);
            const d = await r.json();
            if (d?.c) items.push({ label, price: d.c, chg: d.dp });
          } catch {}
        }
      }
      if (alive && items.length) { setTicker(items); setLive(true); }
    }
    load();
    const iv = setInterval(load, 60000); // refresca cada minuto
    return () => { alive = false; clearInterval(iv); };
  }, []);
  const tickerData = ticker || FALLBACK_TICKER;
  const completeCount = Object.keys(done).length;
  const xp = completeCount * 100 + (view !== "inicio" ? 0 : 0);
  const progress = Math.round((completeCount / MODULES.length) * 100);

  const mod = MODULES.find((m) => m.id === view);

  return (
      <div className="wsa">
        <style>{CSS}</style>

        {/* ticker en vivo */}
        <div className="tick">
          <div className="tick-track">
            {[...Array(2)].map((_, k) => (
                <span key={k}>
              <span className="tick-item" style={{ color: live ? C.green : C.muted }}>
                {live ? "● EN VIVO" : "○ ejemplo"}
              </span>
                  {tickerData.map((t, i) => (
                      <span key={i} className="tick-item"
                            style={{ color: t.chg > 0 ? C.green : t.chg < 0 ? C.red : C.gold }}>
                  {t.label} {fmtPrice(t.price)}
                        {t.chg != null && ` ${t.chg > 0 ? "▲" : "▼"}${Math.abs(t.chg).toFixed(1)}%`}
                </span>
                  ))}
                  <span className="tick-item" style={{ color: C.muted }}>
                "Sé temeroso cuando otros son codiciosos" — Buffett
              </span>
            </span>
            ))}
          </div>
        </div>

        <div className="layout">
          {/* SIDEBAR */}
          <aside className="side">
            <div style={{ padding: "0 6px 14px", borderBottom: `1px solid ${C.border}`, marginBottom: 14, width: "100%" }}>
              <h2 className="disp" style={{ fontSize: 21, lineHeight: 1.05 }}>Wall Street<br /><span style={{ color: C.gold }}>Academy</span></h2>
              <div className="mono" style={{ fontSize: 10, color: C.muted, marginTop: 6, letterSpacing: 1 }}>DE CERO A MICHAEL BURRY</div>
            </div>

            <div style={{ padding: "0 6px 12px", width: "100%" }}>
              <div className="lbl">Progreso · {completeCount}/{MODULES.length}</div>
              <div style={{ height: 7, background: C.border, borderRadius: 6, marginTop: 6, overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: C.gold, transition: ".4s" }} />
              </div>
              <div className="mono" style={{ fontSize: 11, color: C.gold, marginTop: 6 }}>{xp} XP</div>
              {completeCount > 0 && (
                  <button onClick={() => { if (window.confirm("¿Reiniciar todo tu progreso?")) setDone({}); }}
                          style={{ marginTop: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.muted,
                            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: "4px 8px", borderRadius: 6, cursor: "pointer" }}>
                    ↺ Reiniciar progreso
                  </button>
              )}
            </div>

            <button className={`navbtn ${view === "inicio" ? "on" : ""}`} onClick={() => setView("inicio")}>
              <BookOpen size={15} /> Inicio
            </button>
            <button className={`navbtn ${view === "jerga" ? "on" : ""}`} onClick={() => setView("jerga")}>
              <FlaskConical size={15} /> Decodificador de jerga
            </button>
            <div className="lbl" style={{ margin: "14px 6px 6px" }}>Módulos</div>
            {MODULES.map((m) => {
              const Icon = m.icon;
              return (
                  <button key={m.id} className={`navbtn ${view === m.id ? "on" : ""}`} onClick={() => setView(m.id)}>
                    <span className="navnum mono">{m.num}</span>
                    <Icon size={15} />
                    <span style={{ flex: 1 }}>{m.title}</span>
                    {done[m.id] && <Check size={14} color={C.green} />}
                  </button>
              );
            })}
          </aside>

          {/* MAIN */}
          <main className="main">
            {view === "inicio" && (
                <div className="fade">
                  <div className="tag" style={{ marginBottom: 16 }}><Scale size={13} /> 30% TEORÍA · 70% PRÁCTICA</div>
                  <h1 className="disp" style={{ fontSize: 46, lineHeight: 1.02, letterSpacing: -1 }}>
                    Aprende lo que Wall Street<br /><span style={{ color: C.gold, fontStyle: "italic" }}>complica a propósito.</span>
                  </h1>
                  <p style={{ fontSize: 18, color: C.muted, maxWidth: 620, marginTop: 16, lineHeight: 1.5 }}>
                    Desde qué es el dinero hasta valuar empresas con DCF como Michael Burry, manejar criptos, declarar al SAT
                    y esquivar las comisiones que se comen tu fortuna. Sin humo, con calculadoras de verdad.
                  </p>

                  <div className="row" style={{ marginTop: 26 }}>
                    <Stat label="Módulos" value={MODULES.length} color={C.gold} />
                    <Stat label="Herramientas interactivas" value="9" color={C.green} />
                    <Stat label="Costo de empezar" value="$0" sub="tu cabeza, no tu cuenta" color={C.blue} />
                  </div>

                  <div className="card" style={{ marginTop: 24 }}>
                    <h3 className="disp" style={{ fontSize: 22, marginBottom: 10 }}>El camino</h3>
                    <div className="grid2">
                      {MODULES.map((m) => {
                        const Icon = m.icon;
                        return (
                            <div key={m.id} className="flip" onClick={() => setView(m.id)}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <Icon size={18} color={C.gold} />
                                <span className="mono" style={{ fontSize: 11, color: C.muted }}>{m.num}</span>
                                <strong className="disp" style={{ fontSize: 16 }}>{m.title}</strong>
                                {done[m.id] && <Check size={15} color={C.green} style={{ marginLeft: "auto" }} />}
                              </div>
                              <p style={{ margin: "8px 0 0", fontSize: 13.5, color: C.muted }}>{m.intro}</p>
                            </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="warn" style={{ marginTop: 20 }}>
                    <strong className="disp">Aviso:</strong> esto es material educativo, NO asesoría financiera ni fiscal. Antes de invertir o declarar dinero real, consulta a un profesional. Invertir implica riesgo de pérdida.
                  </div>

                  <button className="btn" style={{ marginTop: 18, fontSize: 14 }} onClick={() => setView("mente")}>
                    Empezar por el Módulo 01 →
                  </button>
                </div>
            )}

            {view === "jerga" && <div className="fade"><JargonTool /></div>}

            {mod && (
                <div className="fade" key={mod.id}>
                  <div className="tag" style={{ marginBottom: 14 }}><mod.icon size={13} /> MÓDULO {mod.num}</div>
                  <h1 className="disp" style={{ fontSize: 36, letterSpacing: -0.5 }}>{mod.title}</h1>
                  <p style={{ fontSize: 17, color: C.muted, marginTop: 8, maxWidth: 640 }}>{mod.intro}</p>

                  {/* TEORÍA (30%) */}
                  <div className="card">
                    <div className="tag" style={{ marginBottom: 14, borderColor: C.gold, color: C.gold }}><BookOpen size={12} /> TEORÍA</div>
                    {mod.theory.map((t, i) => (
                        <div key={i} style={{ marginBottom: 18 }}>
                          <h3 className="disp" style={{ fontSize: 19, color: C.text, marginBottom: 4 }}>{t.h}</h3>
                          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#cfccc2", margin: 0 }}>{t.p}</p>
                        </div>
                    ))}
                    <div className="callout"><Lightbulb size={15} color={C.gold} style={{ verticalAlign: -2, marginRight: 6 }} />{mod.callout}</div>
                  </div>

                  {/* PRÁCTICA (70%) */}
                  <div className="tag" style={{ margin: "8px 0 0", borderColor: C.green, color: C.green }}><Target size={12} /> PRÁCTICA</div>
                  {mod.tool && TOOLS[mod.tool] && (() => { const T = TOOLS[mod.tool]; return <T />; })()}

                  {/* QUIZ */}
                  <div className="tag" style={{ margin: "20px 0 0" }}><Award size={12} /> EVALUACIÓN</div>
                  <Quiz questions={mod.quiz} onDone={() => setDone((d) => ({ ...d, [mod.id]: true }))} />

                  {/* nav */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                    {(() => {
                      const idx = MODULES.findIndex((m) => m.id === mod.id);
                      return (
                          <>
                            <button className="btn ghost" disabled={idx === 0} onClick={() => setView(MODULES[idx - 1].id)}>← Anterior</button>
                            <button className="btn" disabled={idx === MODULES.length - 1} onClick={() => setView(MODULES[idx + 1].id)}>Siguiente →</button>
                          </>
                      );
                    })()}
                  </div>
                </div>
            )}
          </main>
        </div>
      </div>
  );
}