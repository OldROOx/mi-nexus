import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Terminal, Database, Lock, Coins, ShieldCheck, Award, Flame, Zap,
  ChevronRight, Check, X, RotateCcw, Code2, GraduationCap, TrendingUp,
  Layers, BookOpen, Brain, ArrowLeft, Trophy, Target, Cpu, FileCheck2,
  Copy, CheckCheck, Activity
} from "lucide-react";

/* ============================================================
   FINSTACK :// De Dev a FinTech Architect
   Plataforma interactiva de aprendizaje — terminal financiera
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=JetBrains+Mono:wght@400;500;700&family=Sora:wght@300;400;500;600&display=swap');

.fs-root{
  --bg:#07090c; --bg2:#0b0f14; --surface:#11161d; --surface2:#161d26;
  --border:#1e2832; --green:#00e676; --green2:#0c9d57; --amber:#ffb020;
  --red:#ff5151; --blue:#3aa0ff; --purple:#b388ff;
  --text:#e6edf3; --muted:#7e8ea2; --muted2:#4d5868;
  --mono:'JetBrains Mono',monospace; --disp:'Bricolage Grotesque',sans-serif; --body:'Sora',system-ui,sans-serif;
  font-family:var(--body); color:var(--text); background:var(--bg);
  min-height:100vh; position:relative; overflow-x:hidden; line-height:1.55;
  -webkit-font-smoothing:antialiased;
}
.fs-root *{box-sizing:border-box;}
.fs-root::before{
  content:""; position:fixed; inset:0; pointer-events:none; z-index:0;
  background:
    radial-gradient(900px 500px at 80% -10%, rgba(0,230,118,.07), transparent 60%),
    radial-gradient(700px 500px at 0% 110%, rgba(255,176,32,.05), transparent 55%),
    linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%);
}
.fs-root::after{
  content:""; position:fixed; inset:0; pointer-events:none; z-index:0; opacity:.35;
  background-image:linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
  background-size:42px 42px;
  -webkit-mask-image:radial-gradient(circle at 50% 30%, #000, transparent 85%);
          mask-image:radial-gradient(circle at 50% 30%, #000, transparent 85%);
}
.fs-wrap{position:relative; z-index:1; max-width:1080px; margin:0 auto; padding:0 18px 90px;}

/* ticker */
.fs-ticker{position:relative; z-index:2; border-bottom:1px solid var(--border); background:rgba(7,9,12,.7); backdrop-filter:blur(6px); overflow:hidden;}
.fs-ticker-track{display:inline-flex; gap:34px; white-space:nowrap; padding:7px 0; animation:fsmarq 38s linear infinite; font-family:var(--mono); font-size:11.5px; letter-spacing:.06em;}
.fs-ticker:hover .fs-ticker-track{animation-play-state:paused;}
.fs-tk{color:var(--muted);}
.fs-tk b{color:var(--green); font-weight:700;}
.fs-tk.dn b{color:var(--red);}
@keyframes fsmarq{from{transform:translateX(0)} to{transform:translateX(-50%)}}

/* topbar */
.fs-top{display:flex; align-items:center; justify-content:space-between; gap:14px; padding:18px 0 14px; flex-wrap:wrap;}
.fs-logo{display:flex; align-items:center; gap:11px; cursor:pointer;}
.fs-logo-mk{width:38px;height:38px;border:1px solid var(--green2);border-radius:9px;display:grid;place-items:center;color:var(--green);background:rgba(0,230,118,.06);box-shadow:0 0 22px rgba(0,230,118,.15) inset;}
.fs-logo h1{font-family:var(--disp); font-weight:800; font-size:21px; letter-spacing:-.02em; margin:0; line-height:1;}
.fs-logo h1 span{color:var(--green);}
.fs-logo small{font-family:var(--mono); font-size:10px; color:var(--muted2); letter-spacing:.18em; text-transform:uppercase;}

.fs-stats{display:flex; align-items:center; gap:10px; flex-wrap:wrap;}
.fs-chip{display:flex; align-items:center; gap:7px; padding:7px 12px; border:1px solid var(--border); border-radius:9px; background:var(--surface); font-family:var(--mono); font-size:12.5px;}
.fs-chip .v{color:var(--text); font-weight:700;}
.fs-chip.flame{color:var(--amber);} .fs-chip.flame.cold{color:var(--muted2);}
.fs-level{min-width:220px;}
.fs-level .row{display:flex; justify-content:space-between; align-items:baseline; margin-bottom:5px;}
.fs-level .ttl{font-family:var(--mono); font-size:11px; color:var(--amber); letter-spacing:.05em;}
.fs-level .xp{font-family:var(--mono); font-size:11px; color:var(--muted);}
.fs-bar{height:7px; border-radius:99px; background:#0c141b; border:1px solid var(--border); overflow:hidden;}
.fs-bar i{display:block; height:100%; background:linear-gradient(90deg,var(--green2),var(--green)); box-shadow:0 0 12px rgba(0,230,118,.5); transition:width .6s cubic-bezier(.2,.7,.3,1);}

/* nav */
.fs-nav{display:flex; gap:8px; margin:6px 0 26px; flex-wrap:wrap;}
.fs-nav button{font-family:var(--mono); font-size:12px; letter-spacing:.04em; padding:9px 14px; border-radius:9px; border:1px solid var(--border); background:var(--surface); color:var(--muted); cursor:pointer; display:flex; align-items:center; gap:7px; transition:.18s;}
.fs-nav button:hover{color:var(--text); border-color:#2c3a47;}
.fs-nav button.on{color:#07090c; background:var(--green); border-color:var(--green); font-weight:700;}

/* hero */
.fs-hero{border:1px solid var(--border); border-radius:16px; padding:26px; background:linear-gradient(135deg, var(--surface), rgba(11,15,20,.4)); position:relative; overflow:hidden; margin-bottom:26px;}
.fs-hero .tag{font-family:var(--mono); font-size:11px; color:var(--green); letter-spacing:.16em; text-transform:uppercase;}
.fs-hero h2{font-family:var(--disp); font-weight:800; font-size:clamp(26px,4.5vw,40px); margin:9px 0 8px; letter-spacing:-.025em; line-height:1.04;}
.fs-hero p{color:var(--muted); max-width:620px; margin:0 0 18px; font-size:14.5px;}
.fs-hero .meta{display:flex; gap:22px; flex-wrap:wrap; font-family:var(--mono); font-size:12px; color:var(--muted);}
.fs-hero .meta b{color:var(--text);}
.fs-cta{display:inline-flex; align-items:center; gap:9px; font-family:var(--mono); font-weight:700; font-size:13px; padding:12px 18px; border-radius:10px; background:var(--green); color:#07090c; border:none; cursor:pointer; transition:.18s; box-shadow:0 8px 24px rgba(0,230,118,.18);}
.fs-cta:hover{transform:translateY(-1px); box-shadow:0 12px 30px rgba(0,230,118,.28);}

/* phase grid */
.fs-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(310px,1fr)); gap:16px;}
.fs-card{border:1px solid var(--border); border-radius:14px; padding:18px; background:var(--surface); cursor:pointer; transition:.2s; position:relative; overflow:hidden;}
.fs-card:hover{transform:translateY(-3px); border-color:var(--ac,#2c3a47); box-shadow:0 14px 34px rgba(0,0,0,.4);}
.fs-card .ph-top{display:flex; align-items:center; gap:11px; margin-bottom:12px;}
.fs-card .ph-ic{width:40px;height:40px;border-radius:10px;display:grid;place-items:center; color:var(--ac); background:color-mix(in srgb, var(--ac) 12%, transparent); border:1px solid color-mix(in srgb, var(--ac) 30%, transparent);}
.fs-card .ph-no{font-family:var(--mono); font-size:10.5px; color:var(--muted2); letter-spacing:.1em; text-transform:uppercase;}
.fs-card h3{font-family:var(--disp); font-weight:700; font-size:17px; margin:1px 0 0; letter-spacing:-.01em;}
.fs-card .ph-tl{color:var(--muted); font-size:13px; margin:0 0 14px;}
.fs-card .ph-bar{height:6px; border-radius:99px; background:#0c141b; overflow:hidden; border:1px solid var(--border);}
.fs-card .ph-bar i{display:block; height:100%; background:var(--ac); box-shadow:0 0 10px color-mix(in srgb, var(--ac) 60%, transparent); transition:width .6s;}
.fs-card .ph-meta{display:flex; justify-content:space-between; margin-top:9px; font-family:var(--mono); font-size:11px; color:var(--muted);}
.fs-card .done-badge{position:absolute; top:14px; right:14px; color:var(--ac);}

/* overview extras */
.fs-extras{display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:16px; margin-top:18px;}
.fs-xcard{border:1px solid var(--border); border-top:2px solid var(--ac); border-radius:14px; padding:18px; background:var(--surface);}
.fs-xcard .xc-head{display:flex; align-items:center; gap:9px; font-family:var(--disp); font-weight:700; font-size:15px; color:var(--ac);}
.fs-xcard .xc-sub{font-size:12px; color:var(--muted); margin:6px 0 14px;}
.fs-chips-x{list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px;}
.fs-chips-x li{display:flex; align-items:center; gap:8px; font-family:var(--mono); font-size:12px; color:var(--text); padding:8px 11px; border:1px solid var(--border); border-radius:8px; background:var(--bg2);}
.fs-chips-x li svg{color:var(--ac); flex:none;}

/* lesson list */
.fs-back{display:inline-flex; align-items:center; gap:7px; font-family:var(--mono); font-size:12px; color:var(--muted); background:none; border:none; cursor:pointer; padding:6px 0; margin-bottom:14px;}
.fs-back:hover{color:var(--green);}
.fs-phead{display:flex; align-items:center; gap:14px; margin-bottom:6px;}
.fs-phead .ic{width:46px;height:46px;border-radius:11px;display:grid;place-items:center;color:var(--ac);background:color-mix(in srgb,var(--ac) 12%,transparent);border:1px solid color-mix(in srgb,var(--ac) 30%,transparent);}
.fs-phead h2{font-family:var(--disp); font-weight:800; font-size:25px; margin:0; letter-spacing:-.02em;}
.fs-phead .sub{font-family:var(--mono); font-size:11px; color:var(--muted); letter-spacing:.08em; text-transform:uppercase;}

.fs-lessons{display:flex; flex-direction:column; gap:9px; margin-top:18px;}
.fs-lrow{display:flex; align-items:center; gap:13px; padding:14px 16px; border:1px solid var(--border); border-radius:11px; background:var(--surface); cursor:pointer; transition:.16s;}
.fs-lrow:hover{border-color:#2c3a47; transform:translateX(3px);}
.fs-lrow .n{font-family:var(--mono); font-size:12px; color:var(--muted2); width:26px;}
.fs-lrow .ck{width:26px;height:26px;border-radius:7px;border:1px solid var(--border);display:grid;place-items:center;flex:none; color:var(--muted2);}
.fs-lrow.done .ck{background:var(--ac); border-color:var(--ac); color:#07090c;}
.fs-lrow .t{flex:1; font-size:14.5px; font-weight:500;}
.fs-lrow .q{font-family:var(--mono); font-size:10px; color:var(--muted2); border:1px solid var(--border); border-radius:6px; padding:3px 7px;}
.fs-lrow .q.passed{color:var(--green); border-color:color-mix(in srgb,var(--green) 35%,transparent);}

/* project + certs panel */
.fs-panel{margin-top:22px; display:grid; grid-template-columns:1.4fr 1fr; gap:14px;}
.fs-pan{border:1px solid var(--border); border-radius:12px; padding:16px; background:var(--surface);}
.fs-pan .lab{font-family:var(--mono); font-size:10.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted2); display:flex; align-items:center; gap:7px; margin-bottom:10px;}
.fs-pan .proj{font-family:var(--disp); font-weight:700; font-size:16px; color:var(--amber); margin:0 0 6px;}
.fs-pan .certs{display:flex; flex-direction:column; gap:7px;}
.fs-pan .cert{display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text);}
.fs-pan .cert svg{color:var(--blue); flex:none;}

/* lesson view */
.fs-lesson{}
.fs-lesson .crumb{font-family:var(--mono); font-size:11px; color:var(--muted2); letter-spacing:.05em; margin-bottom:6px;}
.fs-lesson h2{font-family:var(--disp); font-weight:800; font-size:clamp(22px,3.6vw,30px); letter-spacing:-.02em; margin:0 0 14px; line-height:1.1;}
.fs-body{font-size:15px; color:#d4dde6;}
.fs-body p{margin:0 0 14px;}
.fs-section-lab{font-family:var(--mono); font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--green); display:flex; align-items:center; gap:8px; margin:26px 0 12px;}
.fs-points{list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:9px;}
.fs-points li{display:flex; gap:11px; align-items:flex-start; font-size:14px; color:#cdd7e1;}
.fs-points li span{color:var(--green); margin-top:3px; flex:none;}
.fs-points li b{color:var(--amber); font-weight:600;}

/* code block */
.fs-code{border:1px solid var(--border); border-radius:12px; overflow:hidden; background:#0a0e13; margin:4px 0 4px;}
.fs-code .head{display:flex; align-items:center; gap:8px; padding:9px 13px; border-bottom:1px solid var(--border); background:#0c1117;}
.fs-code .dots{display:flex; gap:6px;}
.fs-code .dots i{width:10px;height:10px;border-radius:99px;display:block;}
.fs-code .fn{font-family:var(--mono); font-size:11px; color:var(--muted); margin-left:4px;}
.fs-code .cp{margin-left:auto; font-family:var(--mono); font-size:10.5px; color:var(--muted); background:none; border:1px solid var(--border); border-radius:6px; padding:4px 9px; cursor:pointer; display:flex; align-items:center; gap:5px; transition:.15s;}
.fs-code .cp:hover{color:var(--green); border-color:var(--green2);}
.fs-code pre{margin:0; padding:15px 16px; overflow-x:auto; font-family:var(--mono); font-size:12.5px; line-height:1.65; color:#cfe8d8; tab-size:2;}
.fs-code pre .k{color:#ff7edb;} .fs-code pre .s{color:#ffd479;} .fs-code pre .c{color:#5d6b78; font-style:italic;} .fs-code pre .f{color:#69c0ff;} .fs-code pre .n{color:#ffb86c;}

/* quiz */
.fs-quiz{border:1px solid var(--border); border-radius:13px; padding:20px; background:linear-gradient(135deg,var(--surface),rgba(11,15,20,.3)); margin-top:14px;}
.fs-quiz .ql{font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--amber); margin-bottom:14px; display:flex; align-items:center; gap:8px;}
.fs-q{margin-bottom:18px;}
.fs-q .qt{font-weight:600; font-size:15px; margin-bottom:11px;}
.fs-opt{display:flex; align-items:center; gap:10px; padding:11px 14px; border:1px solid var(--border); border-radius:9px; margin-bottom:8px; cursor:pointer; font-size:14px; transition:.14s; background:var(--surface);}
.fs-opt:hover{border-color:#2c3a47;}
.fs-opt .mk{width:20px;height:20px;border-radius:5px;border:1px solid var(--muted2);display:grid;place-items:center;flex:none; font-family:var(--mono); font-size:10px; color:var(--muted);}
.fs-opt.sel{border-color:var(--green); background:rgba(0,230,118,.06);}
.fs-opt.correct{border-color:var(--green); background:rgba(0,230,118,.1);} .fs-opt.correct .mk{background:var(--green);border-color:var(--green);color:#07090c;}
.fs-opt.wrong{border-color:var(--red); background:rgba(255,81,81,.08);} .fs-opt.wrong .mk{background:var(--red);border-color:var(--red);color:#fff;}
.fs-exp{font-size:13px; color:var(--muted); border-left:2px solid var(--green2); padding:8px 0 8px 13px; margin-top:6px; background:rgba(0,230,118,.03);}
.fs-quiz-foot{display:flex; align-items:center; gap:14px; margin-top:6px;}
.fs-btn{font-family:var(--mono); font-weight:700; font-size:13px; padding:11px 18px; border-radius:9px; border:none; cursor:pointer; transition:.16s; display:inline-flex; align-items:center; gap:8px;}
.fs-btn.green{background:var(--green); color:#07090c;} .fs-btn.green:hover{transform:translateY(-1px); box-shadow:0 8px 22px rgba(0,230,118,.25);}
.fs-btn.ghost{background:var(--surface); color:var(--text); border:1px solid var(--border);} .fs-btn.ghost:hover{border-color:#2c3a47;}
.fs-btn:disabled{opacity:.4; cursor:not-allowed;}
.fs-result{font-family:var(--mono); font-size:13px;}
.fs-result.ok{color:var(--green);} .fs-result.no{color:var(--amber);}

/* practice / reto */
.fs-btn.sm{font-size:12px; padding:8px 13px;}
.fs-practice{border:1px solid color-mix(in srgb,var(--amber) 30%,var(--border)); border-left:3px solid var(--amber); border-radius:13px; padding:20px; background:linear-gradient(135deg,rgba(255,176,32,.05),rgba(11,15,20,.3)); margin-top:14px;}
.fs-practice .pr-lab{font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--amber); display:flex; align-items:center; gap:8px; margin-bottom:12px;}
.fs-practice .pr-done{margin-left:auto; color:var(--green); display:inline-flex; align-items:center; gap:5px; letter-spacing:.04em;}
.fs-practice .pr-task{font-size:14.5px; line-height:1.62; color:var(--text); margin:0 0 14px;}
.fs-practice .pr-task b{color:var(--amber); font-weight:600;}
.fs-practice .pr-task code{font-family:var(--mono); font-size:.88em; background:var(--bg2); border:1px solid var(--border); border-radius:5px; padding:1px 6px; color:var(--green);}
.fs-practice .pr-actions{display:flex; gap:10px; flex-wrap:wrap;}
.fs-practice .pr-hint{margin-top:12px; font-size:13.5px; line-height:1.6; color:var(--muted); border-left:2px solid var(--amber); padding:8px 0 8px 13px; background:rgba(255,176,32,.04);}
.fs-practice .pr-hint code{font-family:var(--mono); font-size:.88em; color:var(--green);}

.fs-lfoot{display:flex; justify-content:space-between; align-items:center; gap:12px; margin-top:30px; padding-top:18px; border-top:1px solid var(--border); flex-wrap:wrap;}

/* flashcards / review */
.fs-review{max-width:640px; margin:0 auto;}
.fs-rev-head{text-align:center; margin-bottom:8px;}
.fs-rev-head h2{font-family:var(--disp); font-weight:800; font-size:26px; margin:0 0 4px;}
.fs-rev-head p{color:var(--muted); font-size:14px; margin:0;}
.fs-rev-stats{display:flex; justify-content:center; gap:10px; margin:18px 0 22px; flex-wrap:wrap;}
.fs-flip{perspective:1400px; height:300px; margin-bottom:18px; cursor:pointer;}
.fs-flip-in{position:relative; width:100%; height:100%; transition:transform .55s cubic-bezier(.2,.7,.3,1); transform-style:preserve-3d;}
.fs-flip.flipped .fs-flip-in{transform:rotateY(180deg);}
.fs-face{position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; border:1px solid var(--border); border-radius:16px; padding:28px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; background:linear-gradient(135deg,var(--surface),var(--bg2));}
.fs-face.back{transform:rotateY(180deg); background:linear-gradient(135deg,#10261b,var(--bg2)); border-color:var(--green2);}
.fs-face .lab{font-family:var(--mono); font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:var(--muted2); position:absolute; top:18px; left:0; right:0;}
.fs-face .q{font-family:var(--disp); font-weight:700; font-size:22px; line-height:1.25;}
.fs-face .a{font-size:15px; color:#d4dde6; line-height:1.5;}
.fs-face .hint{position:absolute; bottom:16px; left:0; right:0; font-family:var(--mono); font-size:10.5px; color:var(--muted2);}
.fs-rev-actions{display:flex; gap:10px;}
.fs-rev-actions button{flex:1; padding:14px; border-radius:11px; font-family:var(--mono); font-weight:700; font-size:13px; cursor:pointer; border:1px solid var(--border); transition:.16s; display:flex; align-items:center; justify-content:center; gap:8px;}
.fs-rev-actions .again{background:rgba(255,81,81,.08); color:var(--red); border-color:color-mix(in srgb,var(--red) 30%,transparent);}
.fs-rev-actions .know{background:rgba(0,230,118,.08); color:var(--green); border-color:var(--green2);}
.fs-rev-actions button:hover{transform:translateY(-1px);}
.fs-rev-pick{display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-bottom:22px;}
.fs-rev-pick button{font-family:var(--mono); font-size:11px; padding:7px 12px; border-radius:8px; border:1px solid var(--border); background:var(--surface); color:var(--muted); cursor:pointer;}
.fs-rev-pick button.on{color:#07090c; background:var(--amber); border-color:var(--amber); font-weight:700;}
.fs-empty{text-align:center; padding:50px 20px; color:var(--muted);}
.fs-empty .big{color:var(--green); margin-bottom:14px;}

/* stats */
.fs-statgrid{display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:14px; margin-bottom:22px;}
.fs-stat{border:1px solid var(--border); border-radius:13px; padding:18px; background:var(--surface);}
.fs-stat .k{font-family:var(--mono); font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted2);}
.fs-stat .v{font-family:var(--disp); font-weight:800; font-size:30px; margin-top:4px; color:var(--text);}
.fs-stat .v small{font-size:15px; color:var(--muted); font-family:var(--mono); font-weight:400;}
.fs-stat.green .v{color:var(--green);} .fs-stat.amber .v{color:var(--amber);} .fs-stat.blue .v{color:var(--blue);}
.fs-phase-prog{display:flex; flex-direction:column; gap:12px;}
.fs-pp{display:flex; align-items:center; gap:14px;}
.fs-pp .nm{flex:none; width:200px; font-size:13.5px; font-weight:500;}
.fs-pp .nm small{display:block; font-family:var(--mono); font-size:10px; color:var(--muted2);}
.fs-pp .bar{flex:1; height:8px; border-radius:99px; background:#0c141b; border:1px solid var(--border); overflow:hidden;}
.fs-pp .bar i{display:block; height:100%; background:var(--ac); transition:width .6s;}
.fs-pp .pct{font-family:var(--mono); font-size:12px; color:var(--muted); width:42px; text-align:right;}
.fs-reset{font-family:var(--mono); font-size:11.5px; color:var(--red); background:none; border:1px solid color-mix(in srgb,var(--red) 30%,transparent); border-radius:8px; padding:9px 14px; cursor:pointer; margin-top:8px;}
.fs-reset:hover{background:rgba(255,81,81,.08);}

.fs-foot{text-align:center; font-family:var(--mono); font-size:11px; color:var(--muted2); margin-top:40px; letter-spacing:.04em;}

@media(max-width:680px){
  .fs-panel{grid-template-columns:1fr;}
  .fs-pp .nm{width:130px;}
  .fs-level{min-width:160px;}
}
`;

/* ---------- syntax highlight (lightweight) ---------- */
function hl(code) {
  const esc = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc
    .replace(/(\/\/[^\n]*|#[^\n]*)/g, '<span class="c">$1</span>')
    .replace(/(&quot;[^&]*?&quot;|'[^']*?'|"[^"]*?")/g, '<span class="s">$1</span>')
    .replace(/\b(async|await|def|class|return|returns|import|from|if|else|elif|for|while|try|except|finally|with|as|in|not|and|or|None|True|False|raise|yield|lambda|self|pragma|solidity|function|contract|interface|library|using|is|mapping|require|revert|assert|public|private|internal|external|view|pure|payable|virtual|override|event|emit|indexed|uint|uint256|int|bool|string|bytes32|address|memory|storage|calldata|constructor|modifier|immutable|new|const|let|var|await)\b/g, '<span class="k">$1</span>')
    .replace(/\b([A-Z][a-zA-Z0-9_]+)\b/g, '<span class="f">$1</span>');
}

/* ============================================================
   DATA
   ============================================================ */
const PHASES = [
  {
    id: "f1", icon: Terminal, ac: "#00e676",
    title: "Nivelación Backend (Python)",
    months: "Meses 1–3",
    tagline: "La base de todo: Python sólido + APIs + datos.",
    project: "Wallet API con transacciones atómicas",
    certs: ["AWS Cloud Practitioner", "Python PCEP / PCAP", "Docker Foundations"],
    lessons: [
      {
        title: "Python esencial: tipos, estructuras, OOP y excepciones",
        body: "Python es el lenguaje base del backend financiero por su legibilidad y ecosistema. Antes de tocar finanzas necesitas dominar lo fundamental: la diferencia entre objetos inmutables (int, str, tuple) y mutables (list, dict, set), las estructuras de datos y su costo, las funciones como ciudadanos de primera clase, y la Programación Orientada a Objetos. El manejo de excepciones con try/except/finally es lo que evita que un error de red tumbe una transacción a medias.",
        points: [
          "Inmutables: <b>int, float, str, tuple, bytes</b>. Mutables: <b>list, dict, set</b>.",
          "Conoce el Big-O: buscar en <b>dict/set</b> es O(1), en <b>list</b> es O(n).",
          "POO: <b>__init__</b>, herencia, <b>@property</b> y dunder methods (<b>__repr__</b>, <b>__eq__</b>).",
          "Excepciones personalizadas heredan de <b>Exception</b> y comunican fallos de dominio."
        ],
        code: {
          lang: "python", fn: "wallet.py",
          src: `class SaldoInsuficiente(Exception):
    """Error de dominio: no hay fondos."""

class Cuenta:
    def __init__(self, titular, saldo=0):
        self.titular = titular
        self._saldo = saldo

    @property
    def saldo(self):
        return self._saldo

    def retirar(self, monto):
        if monto > self._saldo:
            raise SaldoInsuficiente(f"Faltan {monto - self._saldo}")
        self._saldo -= monto
        return self._saldo

try:
    c = Cuenta("Gael", 100)
    c.retirar(150)
except SaldoInsuficiente as e:
    print("Rechazado:", e)`
        },
        practice: {
          task: "Crea una clase <code>Cuenta</code> con saldo en centavos y un método <code>depositar(monto)</code> que rechace montos negativos lanzando <code>ValueError</code>.",
          hint: "Usa <code>raise ValueError(...)</code> cuando <code>monto &lt;= 0</code> y suma al atributo solo si pasa la validación.",
          solution: { lang: "python", fn: "wallet_reto.py", src: `class Cuenta:
    def __init__(self, centavos=0):
        self.centavos = centavos

    def depositar(self, monto):
        if monto <= 0:
            raise ValueError("monto invalido")
        self.centavos += monto
        return self.centavos` }
        },
        quiz: [
          { q: "¿Cuál de estas estructuras es INMUTABLE en Python?", options: ["list", "dict", "tuple", "set"], a: 2, exp: "Las tuplas no se pueden modificar tras crearse; por eso sirven como claves de dict y para datos fijos." },
          { q: "¿Para qué sirve definir una excepción personalizada como SaldoInsuficiente?", options: ["Acelerar el código", "Comunicar un fallo de dominio específico y capturarlo con precisión", "Reemplazar los logs", "Evitar usar try/except"], a: 1, exp: "Las excepciones de dominio hacen el código legible y permiten manejar cada tipo de error de forma distinta." }
        ],
        cards: [
          { front: "¿Mutable vs inmutable?", back: "Inmutable no cambia tras crearse (int, str, tuple). Mutable sí (list, dict, set)." },
          { front: "¿Qué es @property?", back: "Decorador que expone un método como si fuera un atributo de solo lectura/controlado." }
        ]
      },
      {
        title: "Programación asíncrona: asyncio y await",
        body: "Un servidor financiero atiende miles de peticiones I/O-bound al mismo tiempo: consultas a base de datos, llamadas a APIs externas, lectura de colas. asyncio permite concurrencia en un solo hilo: mientras una operación espera la red, el event loop atiende otra. Es el motor que hace que FastAPI escale. La regla: usa async para I/O (esperar red/disco), NO para cálculo pesado de CPU.",
        points: [
          "<b>async def</b> define una corrutina; <b>await</b> cede el control mientras espera.",
          "<b>asyncio.gather()</b> ejecuta varias corrutinas en paralelo lógico.",
          "Úsalo para I/O-bound (DB, HTTP). Para CPU-bound usa procesos/hilos.",
          "Una sola operación bloqueante (ej. <b>time.sleep</b>) congela todo el event loop."
        ],
        code: {
          lang: "python", fn: "async_fx.py",
          src: `import asyncio

async def precio(simbolo):
    await asyncio.sleep(0.5)   # simula llamada a API
    return f"{simbolo}: 1.0842"

async def main():
    # 3 llamadas concurrentes, no secuenciales
    res = await asyncio.gather(
        precio("EURUSD"),
        precio("GBPUSD"),
        precio("USDMXN"),
    )
    print(res)

asyncio.run(main())`
        },
        practice: {
          task: "Escribe una corrutina <code>obtener_todas(ids)</code> que consulte muchas tasas de cambio en paralelo con <code>asyncio.gather</code> en vez de una por una.",
          hint: "<code>asyncio.gather(*[obtener(i) for i in ids])</code> lanza todas a la vez y espera a que terminen.",
          solution: { lang: "python", fn: "async_reto.py", src: `import asyncio

async def obtener(id):
    await asyncio.sleep(0.1)   # simula I/O de red
    return id, 1.0

async def obtener_todas(ids):
    # en paralelo, no en serie
    return await asyncio.gather(*[obtener(i) for i in ids])` }
        },
        quiz: [
          { q: "asyncio es ideal para tareas...", options: ["CPU-bound (cálculo pesado)", "I/O-bound (esperar red, disco, DB)", "Renderizado 3D", "Compilación"], a: 1, exp: "async brilla cuando el cuello de botella es ESPERAR I/O; para CPU intensivo se necesita multiprocessing." },
          { q: "¿Qué hace asyncio.gather()?", options: ["Bloquea el hilo", "Ejecuta varias corrutinas concurrentemente y espera todas", "Crea un nuevo proceso", "Cierra el event loop"], a: 1, exp: "gather lanza las corrutinas juntas y devuelve sus resultados cuando todas terminan." }
        ],
        cards: [
          { front: "¿Cuándo usar async/await?", back: "Para operaciones I/O-bound: esperar base de datos, APIs o disco sin bloquear el hilo." },
          { front: "¿Qué congela el event loop?", back: "Cualquier llamada bloqueante síncrona dentro de una corrutina (ej. time.sleep, requests sin async)." }
        ]
      },
      {
        title: "Tipado estático: type hints y mypy",
        body: "En sistemas financieros un bug de tipos puede costar dinero real. Los type hints documentan qué espera y devuelve cada función, y mypy los verifica ANTES de ejecutar, atrapando errores en tiempo de desarrollo. No cambian el comportamiento en runtime, pero hacen el código autoexplicativo y permiten autocompletado e IDE inteligente.",
        points: [
          "Anota parámetros y retorno: <b>def cobrar(monto: float) -> bool</b>.",
          "Tipos compuestos: <b>list[int]</b>, <b>dict[str, float]</b>, <b>Optional[str]</b>.",
          "<b>mypy</b> revisa el tipado de forma estática, sin ejecutar el programa.",
          "Pydantic y FastAPI usan los type hints para validar datos automáticamente."
        ],
        code: {
          lang: "python", fn: "types.py",
          src: `from typing import Optional

def aplicar_comision(monto: float, tasa: float = 0.025) -> float:
    return round(monto * (1 + tasa), 2)

def buscar_cuenta(id: int) -> Optional[str]:
    cuentas: dict[int, str] = {1: "Gael", 2: "Ana"}
    return cuentas.get(id)   # str | None

# $ mypy types.py  -> detecta si pasas un str donde va float`
        },
        practice: {
          task: "Tipa la función <code>promedio(nums)</code>: recibe una lista de <code>float</code> y regresa un <code>float</code>. Que mypy no se queje.",
          hint: "Importa <code>List</code> de <code>typing</code> (o usa <code>list[float]</code> en 3.9+) y anota el retorno con <code>-&gt; float</code>.",
          solution: { lang: "python", fn: "types_reto.py", src: `def promedio(nums: list[float]) -> float:
    return sum(nums) / len(nums)` }
        },
        quiz: [
          { q: "¿Cuándo verifica los tipos mypy?", options: ["En runtime", "Estáticamente, antes de ejecutar", "Solo en producción", "Nunca"], a: 1, exp: "mypy es análisis estático: revisa el código sin correrlo, atrapando errores temprano." }
        ],
        cards: [
          { front: "¿Los type hints cambian el runtime?", back: "No. Python los ignora al ejecutar; sirven para herramientas (mypy, IDE, Pydantic)." },
          { front: "¿Optional[str] significa...?", back: "El valor es str o None (equivalente a str | None)." }
        ]
      },
      {
        title: "Entornos y dependencias: pip y Poetry",
        body: "Cada proyecto necesita su propio entorno aislado para que las versiones de librerías no choquen. pip + venv es lo clásico; Poetry es la herramienta moderna que gestiona dependencias, entornos virtuales y publicación con un solo archivo (pyproject.toml) y bloqueo reproducible (poetry.lock). En finanzas, builds reproducibles = auditoría y seguridad.",
        points: [
          "<b>venv</b> aísla las dependencias por proyecto.",
          "<b>requirements.txt</b> lista versiones; <b>poetry.lock</b> las congela exactas.",
          "Poetry separa dependencias de producción y de desarrollo.",
          "Builds reproducibles evitan el clásico 'en mi máquina sí funciona'."
        ],
        code: {
          lang: "bash", fn: "setup.sh",
          src: `# Clásico
python -m venv .venv
source .venv/bin/activate
pip install fastapi "uvicorn[standard]"
pip freeze > requirements.txt

# Moderno con Poetry
poetry init
poetry add fastapi uvicorn
poetry add --group dev pytest mypy
poetry install   # usa poetry.lock`
        },
        practice: {
          task: "Con Poetry: inicia un proyecto, agrega <b>fastapi</b> y <b>uvicorn</b> como dependencias y agrega <b>pytest</b> solo para desarrollo.",
          hint: "Las dependencias de desarrollo van con la bandera <code>--group dev</code> (o <code>--dev</code> en versiones viejas).",
          solution: { lang: "bash", fn: "poetry_reto.sh", src: `poetry init -n
poetry add fastapi uvicorn
poetry add --group dev pytest
poetry install` }
        },
        quiz: [
          { q: "¿Qué garantiza el archivo poetry.lock (o requirements con versiones fijas)?", options: ["Mayor velocidad de ejecución", "Builds reproducibles con versiones exactas", "Menos uso de RAM", "Tipado estático"], a: 1, exp: "Fijar versiones exactas asegura que todos instalen lo mismo: clave para auditoría y seguridad." }
        ],
        cards: [
          { front: "¿Para qué sirve un entorno virtual?", back: "Aislar las dependencias de un proyecto para que no choquen con otras versiones del sistema." }
        ]
      },
      {
        title: "Diseño de APIs REST: versioning, paginación y errores",
        body: "Una buena API REST es predecible. Usa sustantivos en las rutas (/cuentas/123), los métodos HTTP correctos (GET lee, POST crea, PUT/PATCH actualiza, DELETE borra) y códigos de estado coherentes (2xx éxito, 4xx error del cliente, 5xx error del servidor). El versionado (/v1/) te deja evolucionar sin romper clientes, y la paginación evita devolver millones de registros de golpe.",
        points: [
          "Rutas = recursos en plural: <b>/v1/transacciones/{id}</b>.",
          "Códigos: <b>200</b> ok, <b>201</b> creado, <b>400</b> input malo, <b>401</b> no auth, <b>404</b> no existe, <b>409</b> conflicto, <b>500</b> error servidor.",
          "Paginación con <b>limit/offset</b> o cursores para listas grandes.",
          "Errores con cuerpo JSON consistente: código, mensaje y detalle."
        ],
        code: {
          lang: "python", fn: "rest.py",
          src: `from fastapi import FastAPI, HTTPException, Query

app = FastAPI()

@app.get("/v1/transacciones")
def listar(limit: int = Query(20, le=100), offset: int = 0):
    return {"limit": limit, "offset": offset, "items": [...]}

@app.get("/v1/transacciones/{tx_id}")
def detalle(tx_id: int):
    if tx_id not in DB:
        raise HTTPException(404, detail="Transacción no encontrada")
    return DB[tx_id]`
        },
        practice: {
          task: "Diseña el endpoint para <b>cancelar</b> una transferencia con id. Elige el verbo y la ruta REST correctos y responde 404 si no existe.",
          hint: "Cancelar modifica un recurso existente: usa <code>POST</code> a una sub-acción o <code>DELETE</code>. Aquí marcamos estado, no borramos.",
          solution: { lang: "python", fn: "rest_reto.py", src: `from fastapi import FastAPI, HTTPException
app = FastAPI()

@app.post("/transferencias/{id}/cancelar")
def cancelar(id: int):
    tx = db.get(id)
    if tx is None:
        raise HTTPException(404, "no existe")
    tx["estado"] = "cancelada"
    return tx` }
        },
        quiz: [
          { q: "¿Qué código HTTP devuelves al crear un recurso exitosamente?", options: ["200", "201", "204", "404"], a: 1, exp: "201 Created indica que se creó un nuevo recurso; 200 es éxito genérico." },
          { q: "¿Para qué versionar la API con /v1/?", options: ["Mejorar el rendimiento", "Evolucionar la API sin romper a los clientes existentes", "Reducir el tamaño del JSON", "Cifrar las rutas"], a: 1, exp: "El versionado permite lanzar cambios incompatibles en /v2 mientras /v1 sigue funcionando." }
        ],
        cards: [
          { front: "¿401 vs 403?", back: "401 = no autenticado (no sé quién eres). 403 = autenticado pero sin permiso." },
          { front: "¿Por qué paginar?", back: "Para no devolver datasets enormes de golpe: ahorra memoria, ancho de banda y tiempo." }
        ]
      },
      {
        title: "Autenticación: JWT y OAuth2",
        body: "JWT (JSON Web Token) es un token firmado que el cliente envía en cada petición; el servidor verifica la firma sin guardar sesión (stateless). OAuth2 es el protocolo de autorización (el famoso 'Iniciar sesión con Google') basado en flujos y scopes. En fintech esto es crítico: un token comprometido = acceso a dinero, por eso se usan expiraciones cortas y refresh tokens.",
        points: [
          "Un JWT tiene 3 partes: <b>header.payload.signature</b> (base64).",
          "El servidor verifica la firma; si es válida, confía en el payload (claims).",
          "Access token corto (minutos) + refresh token largo para renovar.",
          "OAuth2 usa <b>scopes</b> para limitar qué puede hacer cada token."
        ],
        code: {
          lang: "python", fn: "auth.py",
          src: `from datetime import datetime, timedelta
import jwt   # PyJWT

SECRET = "no-lo-pongas-en-el-codigo"

def crear_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "scope": "wallet:read wallet:write",
        "exp": datetime.utcnow() + timedelta(minutes=15),
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")

def verificar(token: str) -> dict:
    return jwt.decode(token, SECRET, algorithms=["HS256"])`
        },
        practice: {
          task: "Escribe <code>crear_token(uid)</code> que firme un JWT con <b>expiración de 15 minutos</b> y el <code>sub</code> igual al uid.",
          hint: "Pon en el payload un campo <code>exp</code> con <code>datetime.utcnow() + timedelta(minutes=15)</code> y firma con <code>jwt.encode</code>.",
          solution: { lang: "python", fn: "jwt_reto.py", src: `import jwt
from datetime import datetime, timedelta

SECRET = "cambia-esto"

def crear_token(uid):
    payload = {
        "sub": str(uid),
        "exp": datetime.utcnow() + timedelta(minutes=15),
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")` }
        },
        quiz: [
          { q: "¿Qué significa que JWT sea 'stateless'?", options: ["El servidor guarda cada sesión en memoria", "El servidor no guarda sesión: la verificación se hace con la firma del token", "El token nunca expira", "Solo funciona con HTTP"], a: 1, exp: "El servidor no necesita almacenar sesiones; verifica la firma del token en cada petición." },
          { q: "¿Por qué usar access tokens de corta duración?", options: ["Ahorrar espacio", "Limitar el daño si un token es robado", "Hacer la API más rápida", "Evitar OAuth2"], a: 1, exp: "Si lo roban, expira pronto. El refresh token (mejor protegido) renueva el acceso." }
        ],
        cards: [
          { front: "¿Las 3 partes de un JWT?", back: "header.payload.signature — codificadas en base64 y unidas por puntos." },
          { front: "¿Access vs refresh token?", back: "Access: corto, se manda en cada petición. Refresh: largo, solo para obtener nuevos access tokens." }
        ]
      },
      {
        title: "Validación con Pydantic, middleware y rate limiting",
        body: "Nunca confíes en el input del cliente. Pydantic valida y convierte datos entrantes a modelos tipados: si el JSON no cumple, FastAPI rechaza con un 422 automático. El middleware intercepta cada petición/respuesta (logging, auth, CORS). El rate limiting protege contra abuso y ataques de fuerza bruta limitando peticiones por IP/usuario.",
        points: [
          "Un <b>BaseModel</b> de Pydantic define forma y reglas del input.",
          "Validadores: <b>gt=0</b>, <b>max_length</b>, <b>EmailStr</b>, custom validators.",
          "Middleware corre en cada request: ideal para logs, métricas, CORS.",
          "Rate limiting (ej. <b>slowapi</b>) frena abuso y fuerza bruta."
        ],
        code: {
          lang: "python", fn: "models.py",
          src: `from pydantic import BaseModel, Field, field_validator

class Transferencia(BaseModel):
    origen: int
    destino: int
    monto: float = Field(gt=0, le=1_000_000)

    @field_validator("destino")
    @classmethod
    def no_misma_cuenta(cls, v, info):
        if v == info.data.get("origen"):
            raise ValueError("Origen y destino iguales")
        return v`
        },
        practice: {
          task: "Crea un modelo Pydantic <code>Transferencia</code> que valide que <b>monto sea mayor a 0</b> y que <code>moneda</code> sea exactamente 3 letras.",
          hint: "Usa <code>Field(gt=0)</code> para el monto y <code>min_length=3, max_length=3</code> para la moneda.",
          solution: { lang: "python", fn: "pydantic_reto.py", src: `from pydantic import BaseModel, Field

class Transferencia(BaseModel):
    monto: int = Field(gt=0)
    moneda: str = Field(min_length=3, max_length=3)
    destino: str` }
        },
        quiz: [
          { q: "Si un cliente envía un JSON que no cumple el modelo Pydantic, FastAPI responde con...", options: ["200 OK", "422 Unprocessable Entity automáticamente", "500 siempre", "Nada, lo acepta"], a: 1, exp: "Pydantic + FastAPI rechazan input inválido con 422 y un detalle de qué falló." },
          { q: "¿Qué protege el rate limiting?", options: ["Contra abuso y ataques de fuerza bruta", "Contra errores de tipado", "Contra caídas de la base de datos", "Contra fugas de memoria"], a: 0, exp: "Limita cuántas peticiones puede hacer un cliente en un tiempo dado." }
        ],
        cards: [
          { front: "¿Qué es un middleware?", back: "Código que intercepta cada request/response: ideal para logging, auth, CORS o métricas." },
          { front: "¿Por qué validar el input del cliente?", back: "Nunca es confiable: validar previene datos corruptos, inyecciones y errores costosos." }
        ]
      },
      {
        title: "Documentación automática: OpenAPI y Swagger",
        body: "FastAPI genera documentación interactiva sola, a partir de tus type hints y modelos Pydantic. OpenAPI es el estándar (un JSON que describe toda tu API); Swagger UI y ReDoc lo renderizan como páginas navegables donde puedes probar endpoints en vivo. Esto vale oro: la documentación nunca se desactualiza porque sale del código real.",
        points: [
          "OpenAPI = especificación estándar de la API en JSON/YAML.",
          "Swagger UI vive en <b>/docs</b>; ReDoc en <b>/redoc</b>.",
          "Se genera desde tus modelos y type hints: siempre sincronizada.",
          "Permite probar endpoints sin escribir código de cliente."
        ],
        code: {
          lang: "python", fn: "docs.py",
          src: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Wallet API", version="1.0.0")

class Saldo(BaseModel):
    cuenta: int
    monto: float

@app.get("/v1/saldo/{cuenta}", response_model=Saldo, tags=["wallet"])
def saldo(cuenta: int):
    """Devuelve el saldo actual de una cuenta."""
    return Saldo(cuenta=cuenta, monto=1500.0)
# -> abre http://localhost:8000/docs`
        },
        practice: {
          task: "Agrega a un endpoint un <b>resumen</b>, una <b>descripción</b> y un <b>tag</b> para que se vean ordenados en el Swagger autogenerado.",
          hint: "FastAPI acepta <code>summary=</code>, <code>description=</code> y <code>tags=[...]</code> en el decorador de la ruta.",
          solution: { lang: "python", fn: "openapi_reto.py", src: `@app.get(
    "/saldo/{cuenta}",
    summary="Consultar saldo",
    description="Devuelve el saldo actual de la cuenta.",
    tags=["cuentas"],
)
def saldo(cuenta: int):
    return {"cuenta": cuenta, "saldo": 0}` }
        },
        quiz: [
          { q: "¿De dónde sale la documentación de FastAPI?", options: ["Se escribe a mano en un wiki", "Se genera automáticamente desde type hints y modelos", "De la base de datos", "No existe"], a: 1, exp: "Al estar generada desde el código, la doc nunca se desincroniza." }
        ],
        cards: [
          { front: "¿Qué es OpenAPI?", back: "Un estándar para describir APIs REST en un documento JSON/YAML, que Swagger/ReDoc renderizan." }
        ]
      },
      {
        title: "PostgreSQL: modelado relacional, índices y transacciones",
        body: "PostgreSQL es la base de datos predilecta en fintech por su robustez y soporte transaccional. Modelar bien (normalización, claves foráneas) mantiene la integridad del dinero. Los índices aceleran las búsquedas drásticamente (de O(n) a O(log n)). Y las transacciones agrupan operaciones en un todo-o-nada: si algo falla a mitad, se revierte completo (ROLLBACK).",
        points: [
          "Normaliza para evitar duplicación; usa <b>FOREIGN KEY</b> para integridad.",
          "Un índice (B-tree) convierte un escaneo lento en búsqueda rápida.",
          "<b>BEGIN ... COMMIT</b> agrupa operaciones; <b>ROLLBACK</b> deshace todo.",
          "Sin transacciones, una transferencia puede restar de una cuenta y no sumar en otra."
        ],
        code: {
          lang: "sql", fn: "transfer.sql",
          src: `CREATE TABLE cuentas (
  id SERIAL PRIMARY KEY,
  titular TEXT NOT NULL,
  saldo NUMERIC(14,2) NOT NULL DEFAULT 0
);
CREATE INDEX idx_titular ON cuentas (titular);

BEGIN;
  UPDATE cuentas SET saldo = saldo - 500 WHERE id = 1;
  UPDATE cuentas SET saldo = saldo + 500 WHERE id = 2;
COMMIT;   -- todo o nada`
        },
        practice: {
          task: "Escribe una transacción SQL que <b>reste</b> de una cuenta y <b>sume</b> a otra. Debe ser todo-o-nada (atomicidad ACID).",
          hint: "Envuelve ambos UPDATE entre <code>BEGIN;</code> y <code>COMMIT;</code>. Si algo falla, <code>ROLLBACK</code>.",
          solution: { lang: "sql", fn: "acid_reto.sql", src: `BEGIN;
  UPDATE cuentas SET saldo = saldo - 15000 WHERE id = 1;
  UPDATE cuentas SET saldo = saldo + 15000 WHERE id = 2;
COMMIT;
-- si cualquier paso falla: ROLLBACK; (nadie pierde dinero)` }
        },
        quiz: [
          { q: "¿Qué pasa si una transacción falla a la mitad?", options: ["Se guarda lo que alcanzó", "Se hace ROLLBACK y se revierte todo", "El servidor se reinicia", "Se duplican los datos"], a: 1, exp: "La atomicidad garantiza todo-o-nada: si falla, se revierte por completo." },
          { q: "¿Para qué sirve un índice en PostgreSQL?", options: ["Cifrar datos", "Acelerar las búsquedas (de escaneo lineal a logarítmico)", "Hacer backups", "Validar tipos"], a: 1, exp: "Un índice B-tree evita escanear toda la tabla, acelerando consultas enormemente." }
        ],
        cards: [
          { front: "¿Por qué usar NUMERIC y no FLOAT para dinero?", back: "FLOAT tiene errores de redondeo binario. NUMERIC/DECIMAL es exacto: obligatorio para finanzas." },
          { front: "¿Qué es una transacción de BD?", back: "Un grupo de operaciones que se aplican todas juntas o ninguna (atomicidad)." }
        ]
      },
      {
        title: "SQLAlchemy y Alembic: ORM y migraciones",
        body: "SQLAlchemy es el ORM que te deja trabajar con la base de datos usando objetos Python en vez de SQL crudo, manteniendo la seguridad y el control. Alembic gestiona las migraciones: cada cambio al esquema (nueva columna, tabla) queda versionado, igual que Git para tu base de datos. En equipos financieros, esto hace los cambios de esquema auditables y reversibles.",
        points: [
          "El ORM mapea clases Python a tablas SQL.",
          "Evita inyección SQL y centraliza el modelo de datos.",
          "<b>Alembic</b> versiona el esquema: <b>upgrade</b> y <b>downgrade</b>.",
          "Cada migración es un paso reversible y auditable."
        ],
        code: {
          lang: "python", fn: "orm.py",
          src: `from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Numeric

class Base(DeclarativeBase): ...

class Cuenta(Base):
    __tablename__ = "cuentas"
    id: Mapped[int] = mapped_column(primary_key=True)
    titular: Mapped[str]
    saldo: Mapped[float] = mapped_column(Numeric(14, 2), default=0)

# $ alembic revision --autogenerate -m "add cuentas"
# $ alembic upgrade head`
        },
        practice: {
          task: "Con SQLAlchemy, consulta todas las transacciones de una cuenta <b>ordenadas por fecha descendente</b> y limita a 10.",
          hint: "Encadena <code>.filter_by(...)</code>, <code>.order_by(Tx.fecha.desc())</code> y <code>.limit(10)</code>.",
          solution: { lang: "python", fn: "sqlalchemy_reto.py", src: `from sqlalchemy import select

stmt = (
    select(Tx)
    .where(Tx.cuenta_id == cuenta_id)
    .order_by(Tx.fecha.desc())
    .limit(10)
)
ultimas = session.execute(stmt).scalars().all()` }
        },
        quiz: [
          { q: "¿Qué es Alembic respecto a la base de datos?", options: ["Un servidor web", "Un sistema de migraciones (control de versiones del esquema)", "Un cache", "Un lenguaje"], a: 1, exp: "Alembic versiona el esquema con upgrade/downgrade, como Git para tu base de datos." }
        ],
        cards: [
          { front: "¿Qué problema resuelve un ORM?", back: "Trabajar con la BD usando objetos en vez de SQL crudo, reduciendo errores e inyección SQL." }
        ]
      },
      {
        title: "Redis: caché, sesiones y pub/sub",
        body: "Redis es una base de datos en memoria, ultrarrápida. Sus tres usos clave: caché (guardar resultados costosos para no recalcularlos), sesiones (estado temporal de usuarios) y pub/sub (mensajería en tiempo real entre servicios). En fintech se usa para rate limiting, locks distribuidos y feeds de precios en vivo. Como vive en RAM, responde en microsegundos.",
        points: [
          "Estructuras: strings, hashes, lists, sets, sorted sets.",
          "<b>TTL</b> (time-to-live) expira claves automáticamente: ideal para caché.",
          "Pub/Sub permite notificar eventos en tiempo real entre servicios.",
          "Útil para rate limiting, locks distribuidos y leaderboards."
        ],
        code: {
          lang: "python", fn: "cache.py",
          src: `import redis
r = redis.Redis(decode_responses=True)

# Caché con expiración de 60s
def precio_cacheado(simbolo):
    key = f"precio:{simbolo}"
    cached = r.get(key)
    if cached:
        return cached
    valor = consultar_api_lenta(simbolo)
    r.set(key, valor, ex=60)   # TTL
    return valor`
        },
        practice: {
          task: "Implementa un cache-aside: si el saldo está en Redis úsalo; si no, léelo de la BD, guárdalo con <b>TTL de 60s</b> y regrésalo.",
          hint: "Lee con <code>r.get(clave)</code>; al traer de BD usa <code>r.setex(clave, 60, valor)</code> para que expire solo.",
          solution: { lang: "python", fn: "redis_reto.py", src: `def saldo(cuenta):
    clave = "saldo:" + str(cuenta)
    cache = r.get(clave)
    if cache is not None:
        return int(cache)
    valor = db_saldo(cuenta)          # miss: va a la BD
    r.setex(clave, 60, valor)         # TTL 60s
    return valor` }
        },
        quiz: [
          { q: "¿Por qué Redis es tan rápido?", options: ["Usa muchos discos SSD", "Guarda los datos en memoria (RAM)", "Comprime todo", "Usa GPU"], a: 1, exp: "Al estar en RAM, las operaciones son de microsegundos, ideal para caché y tiempo real." },
          { q: "¿Qué es el TTL en Redis?", options: ["Un tipo de dato", "El tiempo tras el cual una clave expira sola", "Un protocolo de red", "Un índice"], a: 1, exp: "TTL (time-to-live) hace que las claves se borren automáticamente: perfecto para caché." }
        ],
        cards: [
          { front: "¿Tres usos clave de Redis?", back: "Caché, manejo de sesiones y mensajería pub/sub en tiempo real." }
        ]
      },
      {
        title: "Propiedades ACID aplicadas a finanzas",
        body: "ACID es el contrato que garantiza que el dinero nunca 'desaparezca'. Atomicidad: todo o nada. Consistencia: la BD pasa de un estado válido a otro (los saldos cuadran). Aislamiento: transacciones concurrentes no se pisan. Durabilidad: una vez confirmada, sobrevive a apagones. En un banco, violar ACID significa dinero perdido o duplicado: no es negociable.",
        points: [
          "<b>A</b>tomicidad: la operación se aplica completa o no se aplica.",
          "<b>C</b>onsistencia: las reglas (ej. saldo ≥ 0) siempre se respetan.",
          "<b>I</b>solation: niveles como <b>SERIALIZABLE</b> evitan condiciones de carrera.",
          "<b>D</b>urabilidad: lo confirmado persiste aunque se caiga el servidor."
        ],
        quiz: [
          { q: "Dos personas transfieren al mismo tiempo y se pisan los saldos. ¿Qué propiedad ACID falló?", options: ["Atomicidad", "Aislamiento (Isolation)", "Durabilidad", "Consistencia"], a: 1, exp: "El aislamiento evita que transacciones concurrentes interfieran entre sí." },
          { q: "Confirmas una transacción y se va la luz. Sigue guardada. ¿Qué propiedad lo garantiza?", options: ["Durabilidad", "Atomicidad", "Aislamiento", "Velocidad"], a: 0, exp: "La durabilidad asegura que lo confirmado (COMMIT) sobrevive a fallos." }
        ],
        cards: [
          { front: "¿Qué significa ACID?", back: "Atomicidad, Consistencia, Aislamiento (Isolation) y Durabilidad: garantías de las transacciones." },
          { front: "¿Por qué ACID importa en finanzas?", back: "Garantiza que el dinero no se pierda ni se duplique ante fallos o concurrencia." }
        ]
      },
      {
        title: "Docker y docker-compose",
        body: "Docker empaqueta tu app con todas sus dependencias en un contenedor que corre igual en cualquier máquina: adiós al 'en mi máquina funciona'. docker-compose orquesta varios contenedores juntos (tu API + PostgreSQL + Redis) con un solo archivo YAML. Es la base del despliegue moderno y de Kubernetes que verás en la Fase 3.",
        points: [
          "Una <b>imagen</b> es la plantilla; un <b>contenedor</b> es la instancia corriendo.",
          "El <b>Dockerfile</b> define cómo construir la imagen.",
          "docker-compose levanta múltiples servicios con <b>docker compose up</b>.",
          "Contenedores = entornos idénticos en dev, staging y producción."
        ],
        code: {
          lang: "yaml", fn: "docker-compose.yml",
          src: `services:
  api:
    build: .
    ports: ["8000:8000"]
    depends_on: [db, cache]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
  cache:
    image: redis:7`
        },
        practice: {
          task: "Agrega un servicio <b>postgres</b> al compose con una variable de entorno para la contraseña y un volumen para que los datos persistan.",
          hint: "Usa la imagen <code>postgres:16</code>, <code>environment:</code> con <code>POSTGRES_PASSWORD</code> y un <code>volumes:</code> mapeando a <code>/var/lib/postgresql/data</code>.",
          solution: { lang: "yaml", fn: "compose_reto.yml", src: `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secreto
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
volumes:
  pgdata:` }
        },
        quiz: [
          { q: "¿Cuál es la diferencia entre imagen y contenedor?", options: ["Son lo mismo", "Imagen = plantilla; contenedor = instancia ejecutándose de esa imagen", "Imagen corre, contenedor no", "Ninguna existe en Docker"], a: 1, exp: "La imagen es la plantilla inmutable; el contenedor es una ejecución viva de ella." }
        ],
        cards: [
          { front: "¿Qué resuelve Docker?", back: "El 'en mi máquina funciona': empaqueta app + dependencias para correr igual en todos lados." },
          { front: "¿Para qué docker-compose?", back: "Orquestar varios contenedores (API, DB, cache) juntos desde un solo YAML." }
        ]
      },
      {
        title: "Producción: Uvicorn, Gunicorn y logging en JSON",
        body: "En desarrollo usas Uvicorn (servidor ASGI rápido). En producción lo combinas con Gunicorn como gestor de procesos: varios workers Uvicorn aprovechan todos los núcleos del CPU. Y el logging estructurado en JSON convierte tus logs en datos consultables (por usuario, por error, por latencia) que herramientas como Grafana/ELK pueden analizar: imprescindible para auditar sistemas financieros.",
        points: [
          "Uvicorn corre tu app ASGI; Gunicorn gestiona varios workers.",
          "Más workers = más peticiones concurrentes (≈ 2×núcleos + 1).",
          "Logs en JSON = consultables y agregables, no texto plano.",
          "Incluye siempre: timestamp, nivel, request_id y usuario."
        ],
        code: {
          lang: "bash", fn: "run.sh",
          src: `# Desarrollo
uvicorn main:app --reload

# Producción
gunicorn main:app \\
  -k uvicorn.workers.UvicornWorker \\
  -w 4 --bind 0.0.0.0:8000

# Log estructurado (concepto)
# {"ts":"...","level":"INFO","request_id":"abc","user":42,"msg":"transfer ok"}`
        },
        practice: {
          task: "Lanza la API en producción con Gunicorn usando workers Uvicorn y <b>4 procesos</b>.",
          hint: "La clase de worker es <code>uvicorn.workers.UvicornWorker</code> y el número de procesos va con <code>-w</code>.",
          solution: { lang: "bash", fn: "gunicorn_reto.sh", src: `gunicorn main:app \\
  -k uvicorn.workers.UvicornWorker \\
  -w 4 \\
  -b 0.0.0.0:8000` }
        },
        quiz: [
          { q: "¿Por qué loguear en JSON y no en texto plano?", options: ["Ocupa menos", "Es consultable y agregable por máquinas (buscar por usuario, error, latencia)", "Es más bonito", "Cifra los logs"], a: 1, exp: "El JSON estructurado permite filtrar y analizar logs con herramientas como Grafana o ELK." }
        ],
        cards: [
          { front: "¿Uvicorn vs Gunicorn?", back: "Uvicorn ejecuta la app ASGI; Gunicorn gestiona múltiples workers Uvicorn en producción." }
        ]
      }
    ]
  },
  {
    id: "f2", icon: Database, ac: "#ffb020",
    title: "BankTech",
    months: "Meses 4–6",
    tagline: "Cómo se mueve el dinero de verdad: tarjetas, SWIFT y core banking.",
    project: "Simulador de procesador de pagos ISO 8583",
    certs: ["AWS Solutions Architect Associate", "SWIFT Fundamentals"],
    lessons: [
      {
        title: "ISO 8583: el estándar detrás de cada swipe de tarjeta",
        body: "Cada vez que pasas una tarjeta, viaja un mensaje ISO 8583 entre el comercio, el adquirente, la red (Visa/Mastercard) y el banco emisor. Es un formato binario con un MTI (tipo de mensaje), bitmaps que indican qué campos vienen, y data elements numerados (DE2 = número de tarjeta, DE4 = monto, DE39 = código de respuesta). Entender este formato es entender la fontanería de los pagos con tarjeta.",
        points: [
          "<b>MTI</b> (Message Type Indicator): ej. 0100 = autorización, 0200 = financiero.",
          "El <b>bitmap</b> indica qué data elements están presentes en el mensaje.",
          "Campos clave: <b>DE2</b> PAN, <b>DE4</b> monto, <b>DE39</b> response code.",
          "<b>DE39 = 00</b> significa aprobado; otros códigos = rechazo o error."
        ],
        code: {
          lang: "python", fn: "iso8583.py",
          src: `# Mensaje 0100 (autorización) simplificado
mensaje = {
    "MTI": "0100",          # solicitud de autorización
    "DE2": "411111******1111",  # PAN enmascarado
    "DE4": "000000015000",  # monto: $150.00
    "DE7": "0601120000",    # fecha/hora
    "DE39": None,           # response code (lo llena el emisor)
}

# Respuesta del emisor: 0110
respuesta = {**mensaje, "MTI": "0110", "DE39": "00"}  # 00 = aprobado`
        },
        practice: {
          task: "Escribe <code>aprobado(msg)</code> que reciba un mensaje ISO 8583 y regrese <code>True</code> solo si el <b>DE39</b> es exactamente <code>'00'</code>.",
          hint: "Solo compara <code>msg.get('DE39') == '00'</code>; cualquier otro código es rechazo.",
          solution: { lang: "python", fn: "iso_reto.py", src: `def aprobado(msg):
    return msg.get("DE39") == "00"

# ejemplo
print(aprobado({"MTI": "0110", "DE39": "00"}))   # True
print(aprobado({"MTI": "0110", "DE39": "51"}))   # False` }
        },
        quiz: [
          { q: "En ISO 8583, ¿qué indica un DE39 igual a '00'?", options: ["Tarjeta vencida", "Transacción aprobada", "Fondos insuficientes", "Error de red"], a: 1, exp: "DE39 = 00 es el código de respuesta de aprobación; cualquier otro valor indica rechazo o error." },
          { q: "¿Para qué sirve el bitmap en un mensaje ISO 8583?", options: ["Cifrar el mensaje", "Indicar qué data elements (campos) están presentes", "Comprimir el monto", "Firmar la transacción"], a: 1, exp: "El bitmap es un mapa de bits que señala qué campos vienen en el mensaje." }
        ],
        cards: [
          { front: "¿Qué es el MTI en ISO 8583?", back: "Message Type Indicator: un código de 4 dígitos que define el tipo de mensaje (ej. 0100 = autorización)." },
          { front: "¿Qué campo ISO 8583 lleva el monto?", back: "DE4 (Data Element 4), normalmente en centavos sin punto decimal." }
        ]
      },
      {
        title: "SWIFT: MT vs MX (ISO 20022)",
        body: "SWIFT es la red de mensajería que conecta bancos del mundo para transferencias internacionales. Los mensajes MT (ej. MT103 para un pago) son el formato legacy de texto plano. ISO 20022 (formato MX, basado en XML) es el reemplazo moderno: más rico, estructurado y legible por máquinas. La banca mundial está migrando de MT a MX, una transición masiva con fecha límite.",
        points: [
          "SWIFT no mueve dinero: mueve <b>instrucciones</b> de pago entre bancos.",
          "<b>MT103</b> = pago de cliente individual (formato legacy).",
          "<b>ISO 20022 / MX</b> usa XML, con datos más ricos y estructurados.",
          "La migración MT → MX moderniza la mensajería financiera global."
        ],
        quiz: [
          { q: "¿Qué hace exactamente SWIFT?", options: ["Mueve el dinero físicamente", "Transmite instrucciones de pago seguras entre bancos", "Emite tarjetas", "Cifra discos duros"], a: 1, exp: "SWIFT es una red de mensajería: el dinero se mueve por las cuentas corresponsales, SWIFT solo da las órdenes." },
          { q: "ISO 20022 (MX) se diferencia de los mensajes MT porque...", options: ["Es más viejo", "Usa XML estructurado con datos más ricos", "No tiene formato", "Solo funciona en México"], a: 1, exp: "ISO 20022 es el estándar moderno basado en XML que reemplaza al formato MT de texto plano." }
        ],
        cards: [
          { front: "¿Qué es un MT103?", back: "El mensaje SWIFT clásico para un pago de cliente individual (transferencia internacional)." },
          { front: "¿MT vs MX?", back: "MT = formato legacy de texto. MX = ISO 20022 en XML, moderno y estructurado." }
        ]
      },
      {
        title: "ACH, SPEI y transferencias en tiempo real",
        body: "No todas las transferencias son iguales. ACH (en EE.UU.) procesa pagos en lotes, lento pero barato. SPEI (en México) es el sistema del Banco de México para transferencias electrónicas casi instantáneas. Los sistemas RTP (real-time payments) liquidan en segundos, 24/7. Como ingeniero fintech vas a integrar estos rieles: cada uno con su formato, horarios y reglas de liquidación.",
        points: [
          "<b>ACH</b>: por lotes (batch), económico pero tarda horas/días.",
          "<b>SPEI</b>: el riel interbancario de México, casi en tiempo real.",
          "<b>RTP</b>: liquidación en segundos, disponible 24/7/365.",
          "Cada riel tiene sus propios formatos, cut-off times y comisiones."
        ],
        quiz: [
          { q: "¿Cuál es la principal diferencia de ACH frente a un sistema en tiempo real?", options: ["ACH es instantáneo", "ACH procesa por lotes (más lento, más barato)", "ACH solo existe en México", "ACH no usa bancos"], a: 1, exp: "ACH agrupa pagos en lotes; los sistemas RTP/SPEI liquidan casi al instante." }
        ],
        cards: [
          { front: "¿Qué es SPEI?", back: "El Sistema de Pagos Electrónicos Interbancarios de Banxico: transferencias en México casi en tiempo real." }
        ]
      },
      {
        title: "Ciclos de liquidación: T+0, T+1, T+2",
        body: "Cuando se ejecuta una operación (un pago, una compra de acciones), la liquidación (settlement) —el movimiento real del dinero/activo— puede ocurrir el mismo día o días después. T+0 = mismo día. T+1 = un día hábil después. T+2 = dos días. Entender esto es clave: durante ese lapso existe riesgo de contraparte y de liquidez. Los mercados van migrando a ciclos más cortos para reducir riesgo.",
        points: [
          "T = trade date (día de la operación). El número = días hábiles hasta liquidar.",
          "<b>T+0</b>: liquidación inmediata, el mismo día.",
          "Durante el ciclo existe <b>riesgo de contraparte</b> (que la otra parte falle).",
          "La tendencia global es acortar ciclos (de T+2 a T+1) para reducir riesgo."
        ],
        quiz: [
          { q: "Si una operación liquida en 'T+2', ¿cuándo se mueve el dinero?", options: ["Inmediatamente", "Dos días hábiles después de la operación", "Dos meses después", "Nunca"], a: 1, exp: "T+2 significa que la liquidación ocurre dos días hábiles tras la fecha de operación (T)." }
        ],
        cards: [
          { front: "¿Qué significa T+1?", back: "La liquidación (movimiento real de dinero/activo) ocurre un día hábil después de la operación." }
        ]
      },
      {
        title: "Arquitectura mainframe y COBOL (conceptual)",
        body: "El corazón de muchos bancos sigue corriendo en mainframes IBM con código COBOL escrito hace décadas. Son máquinas extremadamente confiables que procesan millones de transacciones batch. No necesitas escribir COBOL, pero sí entender el paradigma: procesamiento por lotes nocturno, archivos de longitud fija, y por qué migrar de ahí es tan delicado. Este conocimiento te hace valioso: pocos jóvenes lo entienden.",
        points: [
          "Los mainframes priorizan <b>confiabilidad y throughput</b>, no elegancia.",
          "COBOL es verboso pero estable; mueve billones de dólares diarios.",
          "Procesamiento <b>batch</b>: grandes lotes corren de noche (end-of-day).",
          "Migrar de mainframe es riesgoso: por eso existe el strangler fig pattern."
        ],
        code: {
          lang: "cobol", fn: "interes.cob",
          src: `* COBOL conceptual: calcular interés simple
COMPUTE INTERES = CAPITAL * TASA * TIEMPO
ADD INTERES TO SALDO GIVING SALDO-NUEVO.
DISPLAY "Nuevo saldo: " SALDO-NUEVO.`
        },
        practice: {
          task: "Un sistema legacy calcula interés simple. Replica la lógica en Python: <code>interes(capital, tasa, anios)</code> con <b>aritmética de centavos</b> (enteros, sin floats).",
          hint: "Trabaja en centavos enteros: multiplica y al final divide; evita <code>float</code> para no perder precisión monetaria.",
          solution: { lang: "python", fn: "interes_reto.py", src: `def interes(capital_cent, tasa_pct, anios):
    # todo en enteros para no perder centavos
    return capital_cent * tasa_pct * anios // 100

print(interes(100000, 5, 2))   # $1000 * 5% * 2 = 10000 cent = $100` }
        },
        quiz: [
          { q: "¿Por qué los bancos siguen usando mainframes con COBOL?", options: ["Porque son baratos de mantener", "Por su altísima confiabilidad y capacidad de procesar enormes volúmenes batch", "Porque son fáciles de programar", "Porque son nuevos"], a: 1, exp: "Son extremadamente estables y procesan volúmenes masivos; reemplazarlos es lento y riesgoso." }
        ],
        cards: [
          { front: "¿Qué es procesamiento batch?", back: "Procesar grandes lotes de transacciones juntos, típicamente de noche (end-of-day), no en tiempo real." }
        ]
      },
      {
        title: "Strangler Fig Pattern: migrar lo legacy sin morir",
        body: "No puedes apagar el mainframe de un banco y prenderlo de nuevo como microservicios. El patrón Strangler Fig (higuera estranguladora) consiste en construir lo nuevo ALREDEDOR de lo viejo, redirigiendo poco a poco el tráfico funcionalidad por funcionalidad, hasta que el sistema legacy queda 'estrangulado' y se puede retirar. Reduce el riesgo: cada paso es pequeño y reversible.",
        points: [
          "Se migra <b>incrementalmente</b>, no de un solo golpe (big bang).",
          "Una capa de enrutamiento decide: ¿esto va al sistema nuevo o al viejo?",
          "Cada funcionalidad migrada se valida antes de la siguiente.",
          "El legacy se retira solo cuando ya nada depende de él."
        ],
        quiz: [
          { q: "El Strangler Fig Pattern propone migrar un sistema legacy...", options: ["De golpe en una sola noche", "Incrementalmente, redirigiendo tráfico función por función", "Borrándolo y empezando de cero", "Sin tocarlo nunca"], a: 1, exp: "Se construye lo nuevo alrededor de lo viejo y se migra poco a poco, reduciendo riesgo." }
        ],
        cards: [
          { front: "¿Qué es el Strangler Fig Pattern?", back: "Migrar un sistema legacy gradualmente, envolviéndolo y redirigiendo tráfico hasta poder retirarlo." }
        ]
      },
      {
        title: "Core banking: Temenos, Finacle y Mambu",
        body: "El core banking es el sistema central que gestiona cuentas, depósitos, préstamos y el libro mayor del banco. Temenos y Finacle son los gigantes tradicionales (on-premise, robustos). Mambu representa la nueva ola: core banking cloud-native, en la nube, vía API, ideal para neobancos. Como ingeniero, integrarás tu fintech con uno de estos cores mediante sus APIs.",
        points: [
          "El core banking lleva el <b>libro mayor</b>, cuentas, depósitos y préstamos.",
          "<b>Temenos / Finacle</b>: cores tradicionales, robustos, on-premise.",
          "<b>Mambu</b>: core cloud-native vía API, para neobancos modernos.",
          "Tu fintech rara vez construye el core: lo integra por APIs."
        ],
        quiz: [
          { q: "¿Qué distingue a Mambu de cores como Temenos o Finacle?", options: ["Es más viejo", "Es cloud-native y API-first, pensado para neobancos", "No maneja cuentas", "Solo funciona offline"], a: 1, exp: "Mambu es un core bancario en la nube, orientado a APIs, popular entre fintechs y neobancos." }
        ],
        cards: [
          { front: "¿Qué es un sistema core banking?", back: "El sistema central del banco: gestiona cuentas, depósitos, préstamos y el libro mayor (ledger)." }
        ]
      },
      {
        title: "Resiliencia: Circuit Breaker y retry con backoff",
        body: "En sistemas distribuidos, los servicios fallan. El Circuit Breaker actúa como un fusible: si un servicio externo empieza a fallar mucho, 'abre el circuito' y deja de llamarlo un rato, evitando colapsar todo en cascada. El retry con backoff exponencial reintenta operaciones fallidas esperando cada vez más (1s, 2s, 4s...) más un jitter aleatorio, para no saturar al servicio que se está recuperando.",
        points: [
          "<b>Circuit breaker</b>: estados cerrado → abierto → medio-abierto.",
          "Cuando está abierto, falla rápido sin llamar al servicio caído.",
          "Backoff <b>exponencial</b>: espera 1s, 2s, 4s, 8s entre reintentos.",
          "Añade <b>jitter</b> (azar) para evitar que todos reintenten a la vez."
        ],
        code: {
          lang: "python", fn: "resilience.py",
          src: `import time, random

def retry_backoff(fn, intentos=5):
    for i in range(intentos):
        try:
            return fn()
        except Exception:
            if i == intentos - 1:
                raise
            espera = (2 ** i) + random.uniform(0, 1)  # backoff + jitter
            time.sleep(espera)`
        },
        practice: {
          task: "Implementa un <b>retry con backoff exponencial</b>: reintenta hasta 3 veces esperando 1s, 2s, 4s antes de rendirse.",
          hint: "Espera <code>2 ** intento</code> segundos dentro de un bucle <code>for intento in range(3)</code>; relanza la excepción en el último intento.",
          solution: { lang: "python", fn: "retry_reto.py", src: `import time

def con_retry(fn):
    for intento in range(3):
        try:
            return fn()
        except Exception:
            if intento == 2:
                raise          # ultimo intento: propaga
            time.sleep(2 ** intento)   # 1s, 2s, 4s` }
        },
        quiz: [
          { q: "¿Qué hace un Circuit Breaker cuando un servicio falla repetidamente?", options: ["Sigue llamándolo sin parar", "'Abre el circuito' y deja de llamarlo un tiempo para evitar el colapso en cascada", "Reinicia el servidor", "Borra los logs"], a: 1, exp: "Como un fusible: corta las llamadas al servicio caído para proteger al resto del sistema." },
          { q: "¿Por qué usar backoff EXPONENCIAL en los reintentos?", options: ["Para reintentar más rápido", "Para dar tiempo creciente al servicio de recuperarse y no saturarlo", "Para ahorrar memoria", "Para cifrar la petición"], a: 1, exp: "Esperar cada vez más (1s,2s,4s) evita martillar a un servicio que intenta recuperarse." }
        ],
        cards: [
          { front: "¿Qué es el patrón Circuit Breaker?", back: "Un 'fusible' que corta las llamadas a un servicio que falla mucho, evitando fallos en cascada." },
          { front: "¿Qué es el jitter en los reintentos?", back: "Un retardo aleatorio añadido al backoff para que muchos clientes no reintenten exactamente a la vez." }
        ]
      },
      {
        title: "Saga Pattern: transacciones distribuidas",
        body: "Cuando una operación abarca varios microservicios (debitar cuenta, reservar inventario, notificar), no hay una transacción ACID única que los cubra a todos. El Saga Pattern coordina una secuencia de transacciones locales; si una falla, ejecuta transacciones de compensación que deshacen las anteriores. Es la forma de mantener consistencia (eventual) en arquitecturas distribuidas.",
        points: [
          "Una saga = secuencia de transacciones locales en distintos servicios.",
          "Si un paso falla, se ejecutan <b>compensaciones</b> que revierten lo hecho.",
          "Dos estilos: <b>coreografía</b> (eventos) u <b>orquestación</b> (un coordinador).",
          "Da consistencia <b>eventual</b>, no ACID instantánea."
        ],
        code: {
          lang: "python", fn: "saga.py",
          src: `# Saga simplificada con compensaciones
def transferir_saga():
    try:
        debitar(origen, 500)          # paso 1
        try:
            acreditar(destino, 500)   # paso 2
        except Exception:
            reembolsar(origen, 500)   # compensa paso 1
            raise
    except Exception:
        notificar_fallo()`
        },
        practice: {
          task: "Diseña una saga de 2 pasos (cobrar, enviar). Si <b>enviar falla</b>, ejecuta la compensación que <b>reembolsa</b> el cobro.",
          hint: "Tras cobrar, intenta enviar dentro de un <code>try</code>; en el <code>except</code> llama a <code>reembolsar()</code>.",
          solution: { lang: "python", fn: "saga_reto.py", src: `def saga(pago):
    cobrar(pago)
    try:
        enviar(pago)
    except Exception:
        reembolsar(pago)   # compensacion: deshace el cobro
        raise` }
        },
        quiz: [
          { q: "En una Saga, si un paso falla a la mitad, ¿qué ocurre?", options: ["Se ignora", "Se ejecutan transacciones de compensación que deshacen los pasos previos", "Se reinicia el sistema", "Se duplica la operación"], a: 1, exp: "Las compensaciones revierten lo ya hecho para mantener consistencia eventual." }
        ],
        cards: [
          { front: "¿Qué resuelve el Saga Pattern?", back: "Mantener consistencia en operaciones que cruzan varios microservicios, usando compensaciones si algo falla." }
        ]
      },
      {
        title: "Idempotency keys: evitar cobros duplicados",
        body: "Imagina que el usuario presiona 'Pagar' y la red se cae sin respuesta. ¿Reintenta? ¿Le cobraste ya? La idempotencia resuelve esto: el cliente envía una clave única (idempotency key) con la petición; si el servidor recibe la misma clave dos veces, devuelve el resultado original sin volver a ejecutar. Una sola petición real, sin importar cuántas veces se reintente. Crítico en pagos.",
        points: [
          "Una operación idempotente da el mismo resultado si se repite.",
          "El cliente manda un header <b>Idempotency-Key</b> único por intento.",
          "El servidor guarda el resultado asociado a esa clave.",
          "Reintentos con la misma clave NO duplican el cobro."
        ],
        code: {
          lang: "python", fn: "idempotency.py",
          src: `from fastapi import Header, HTTPException

procesadas = {}  # en producción: Redis

@app.post("/v1/pagos")
def pagar(monto: float, idempotency_key: str = Header(...)):
    if idempotency_key in procesadas:
        return procesadas[idempotency_key]   # devuelve original
    resultado = cobrar(monto)
    procesadas[idempotency_key] = resultado
    return resultado`
        },
        practice: {
          task: "Usa una <b>idempotency key</b>: si la misma llave ya se procesó, regresa el resultado guardado en vez de cobrar otra vez.",
          hint: "Guarda <code>key -&gt; resultado</code> en un dict/Redis; si la key existe, regresa lo almacenado sin reejecutar.",
          solution: { lang: "python", fn: "idem_reto.py", src: `vistos = {}

def cobrar_idem(key, pago):
    if key in vistos:
        return vistos[key]      # ya se proceso: no cobra de nuevo
    res = cobrar(pago)
    vistos[key] = res
    return res` }
        },
        quiz: [
          { q: "¿Qué garantiza una idempotency key en un pago?", options: ["Que el pago sea más rápido", "Que reintentar la misma petición no genere un cobro duplicado", "Que el monto sea menor", "Que se cifre la tarjeta"], a: 1, exp: "Misma clave = el servidor devuelve el resultado original sin ejecutar de nuevo: un solo cobro." }
        ],
        cards: [
          { front: "¿Qué es una operación idempotente?", back: "Una que produce el mismo resultado aunque se ejecute varias veces (clave para reintentos seguros)." }
        ]
      },
      {
        title: "SLA, SLO, SLI, RPO y RTO",
        body: "Estas siglas definen la confiabilidad que prometes y mides. SLI (indicador): la métrica real (ej. % de uptime). SLO (objetivo): la meta interna (ej. 99.9%). SLA (acuerdo): el contrato con el cliente y sus penalizaciones. Para desastres: RPO (cuánto dato puedes perder, medido en tiempo) y RTO (cuánto puedes tardar en recuperarte). En finanzas, estos números se negocian y se auditan.",
        points: [
          "<b>SLI</b> = lo que mides. <b>SLO</b> = tu objetivo. <b>SLA</b> = el contrato (con multas).",
          "99.9% de uptime = ~8.7 horas de caída al año.",
          "<b>RPO</b>: máximo de datos que toleras perder (ej. 'últimos 5 min').",
          "<b>RTO</b>: tiempo máximo para volver a operar tras un desastre."
        ],
        quiz: [
          { q: "¿Cuál es el SLA?", options: ["La métrica real medida", "El objetivo interno", "El contrato con el cliente que incluye penalizaciones si no se cumple", "El tiempo de recuperación"], a: 2, exp: "El SLA es el acuerdo formal con el cliente; el SLO es la meta interna y el SLI la métrica." },
          { q: "RPO de '5 minutos' significa que...", options: ["Te recuperas en 5 minutos", "Puedes perder como máximo los últimos 5 minutos de datos", "El sistema cae cada 5 minutos", "Haces backup cada 5 horas"], a: 1, exp: "RPO (Recovery Point Objective) mide cuánto dato, en tiempo, toleras perder ante un fallo." }
        ],
        cards: [
          { front: "¿SLI vs SLO vs SLA?", back: "SLI = métrica real. SLO = objetivo interno. SLA = contrato con el cliente y sus penalizaciones." },
          { front: "¿RTO vs RPO?", back: "RTO = cuánto tardas en recuperarte. RPO = cuánto dato puedes perder (ambos en tiempo)." }
        ]
      },
      {
        title: "TLS y mTLS entre servicios financieros",
        body: "TLS cifra la conexión entre cliente y servidor (el candado de HTTPS): protege los datos en tránsito y verifica la identidad del servidor. mTLS (mutual TLS) va más allá: ambas partes presentan certificados, así el servidor también verifica que el cliente es legítimo. Entre microservicios financieros, mTLS asegura que solo servicios autorizados puedan hablar entre sí.",
        points: [
          "<b>TLS</b>: cifra en tránsito y el cliente verifica al servidor.",
          "<b>mTLS</b>: verificación mutua, ambos lados presentan certificado.",
          "Evita que un servicio impostor se conecte a tus APIs internas.",
          "Es la base de las arquitecturas zero-trust en banca."
        ],
        code: {
          lang: "yaml", fn: "mtls-concept.yaml",
          src: `# Concepto: cada servicio tiene su par de certificados
service-pagos:
  tls:
    cert: /certs/pagos.crt      # se identifica
    key:  /certs/pagos.key
    ca:   /certs/ca.crt         # valida al otro lado
  require_client_cert: true     # <- esto es mTLS`
        },
        practice: {
          task: "Explica en 1-2 líneas por qué en <b>mTLS</b> un atacante dentro de la red no puede hacerse pasar por el servicio de pagos. Luego revela el modelo.",
          hint: "Piensa en qué prueba cada lado y qué necesitaría el atacante para suplantar al servicio.",
          solution: { lang: "text", fn: "mtls_reto.txt", src: `En mTLS ambos lados presentan certificado firmado por una CA de confianza.
El atacante puede ALCANZAR el servicio por red, pero no tiene el
certificado/clave privada valido -> el handshake mutuo falla y la
llamada se rechaza. La ubicacion en la red no otorga confianza (zero-trust).` }
        },
        quiz: [
          { q: "¿Qué añade mTLS frente a TLS normal?", options: ["Mayor velocidad", "El servidor también verifica la identidad del cliente (autenticación mutua)", "Compresión", "Menos cifrado"], a: 1, exp: "En mTLS ambas partes presentan certificados: cliente y servidor se autentican mutuamente." }
        ],
        cards: [
          { front: "¿TLS vs mTLS?", back: "TLS: el cliente verifica al servidor. mTLS: ambos se verifican con certificados (mutuo)." }
        ]
      },
      {
        title: "HSM y tokenización de tarjetas",
        body: "Las llaves criptográficas que protegen el dinero no pueden vivir en un archivo cualquiera. Un HSM (Hardware Security Module) es un dispositivo físico blindado donde se generan y guardan las llaves; nunca salen de ahí. La tokenización reemplaza el número real de tarjeta (PAN) por un token sin valor fuera de su contexto: si te roban el token, no sirve. Así Apple Pay y los comercios reducen su exposición a PCI-DSS.",
        points: [
          "<b>HSM</b>: hardware blindado donde viven las llaves reales; no salen nunca.",
          "<b>Tokenización</b>: cambia el PAN por un token sin valor reutilizable.",
          "El token solo se 'des-tokeniza' en un entorno seguro y controlado.",
          "Reduce el alcance de PCI-DSS: menos sistemas tocan datos reales."
        ],
        quiz: [
          { q: "¿Cuál es la idea central de la tokenización de tarjetas?", options: ["Cifrar el monto", "Reemplazar el número real de tarjeta por un token inútil fuera de contexto", "Borrar la tarjeta", "Acelerar el pago"], a: 1, exp: "El token sustituye al PAN; si lo roban, no tiene valor: reduce el riesgo y el alcance de PCI." },
          { q: "¿Dónde viven las llaves criptográficas más sensibles?", options: ["En un archivo .env", "En un HSM (hardware blindado del que no salen)", "En el navegador", "En texto plano en la BD"], a: 1, exp: "El HSM genera y custodia las llaves sin que abandonen el dispositivo físico." }
        ],
        cards: [
          { front: "¿Qué es un HSM?", back: "Hardware Security Module: dispositivo físico blindado que genera y guarda llaves criptográficas." },
          { front: "¿Qué es tokenización?", back: "Sustituir el dato real de tarjeta (PAN) por un token sin valor fuera de su sistema." }
        ]
      },
      {
        title: "3DS2: autenticación fuerte del cliente (SCA)",
        body: "3D Secure 2 es la capa de autenticación que añade un paso de verificación en pagos online (el código que te llega, biometría, o aprobación en la app del banco). Implementa la SCA (Strong Customer Authentication) exigida por regulaciones como PSD2 en Europa. Reduce el fraude y traslada la responsabilidad (liability shift): si el banco aprobó vía 3DS2 y hubo fraude, el comercio queda más protegido.",
        points: [
          "3DS2 añade verificación: OTP, biometría o aprobación en la app.",
          "Cumple la <b>SCA</b> (autenticación fuerte) exigida por PSD2.",
          "Usa señales del dispositivo para un flujo 'frictionless' cuando hay bajo riesgo.",
          "<b>Liability shift</b>: traslada la responsabilidad del fraude al emisor."
        ],
        quiz: [
          { q: "¿Qué busca principalmente 3DS2 / SCA en los pagos online?", options: ["Acelerar la compra", "Autenticar con fuerza al cliente para reducir el fraude", "Bajar el precio", "Eliminar bancos"], a: 1, exp: "3DS2 implementa autenticación fuerte del cliente (SCA), reduciendo fraude y trasladando responsabilidad." }
        ],
        cards: [
          { front: "¿Qué es el liability shift en 3DS2?", back: "Si el emisor autenticó el pago vía 3DS y hay fraude, la responsabilidad recae en él, no en el comercio." }
        ]
      }
    ]
  },
  {
    id: "f3", icon: Cpu, ac: "#3aa0ff",
    title: "FinTech",
    months: "Meses 7–10",
    tagline: "Microservicios, eventos y open finance: la arquitectura de las fintech modernas.",
    project: "Plataforma KYC con biometría facial",
    certs: ["CKAD", "Confluent Kafka Developer", "AWS Developer Associate"],
    lessons: [
      {
        title: "Domain-Driven Design aplicado a finanzas",
        body: "DDD propone modelar el software alrededor del dominio de negocio, no de la base de datos. En finanzas defines un lenguaje ubicuo (los mismos términos que usa el negocio: 'Cuenta', 'Asiento', 'Liquidación') y delimitas bounded contexts: Pagos, Cumplimiento y Contabilidad pueden tener su propio modelo de 'Transacción' sin pisarse. Las entidades tienen identidad (una Cuenta), los value objects no (un Monto con moneda), y los aggregates agrupan invariantes que deben cambiar juntas y de forma transaccional.",
        points: [
          "<b>Lenguaje ubicuo</b>: el código habla igual que el negocio.",
          "<b>Bounded context</b>: cada subdominio tiene su propio modelo aislado.",
          "<b>Aggregate</b>: grupo de entidades que respeta sus invariantes como una unidad.",
          "<b>Value object</b> (un Monto) no tiene identidad; una <b>Entidad</b> (una Cuenta) sí."
        ],
        code: {
          lang: "python", fn: "domain.py",
          src: `from dataclasses import dataclass

# Value object: sin identidad, inmutable, se compara por valor
@dataclass(frozen=True)
class Dinero:
    centavos: int
    moneda: str = "MXN"
    def sumar(self, otro):
        if otro.moneda != self.moneda:
            raise ValueError("Monedas distintas")
        return Dinero(self.centavos + otro.centavos, self.moneda)

# Aggregate root: protege su invariante (saldo nunca negativo)
class Cuenta:
    def __init__(self, id, saldo):
        self.id = id
        self._saldo = saldo
    def retirar(self, monto):
        if self._saldo.centavos < monto.centavos:
            raise ValueError("Saldo insuficiente")
        self._saldo = Dinero(self._saldo.centavos - monto.centavos)`
        },
        practice: {
          task: "Modela un value object <code>Dinero</code> inmutable que <b>rechace sumar monedas distintas</b>.",
          hint: "Usa <code>@dataclass(frozen=True)</code> y en <code>sumar</code> lanza error si <code>otro.moneda != self.moneda</code>.",
          solution: { lang: "python", fn: "ddd_reto.py", src: `from dataclasses import dataclass

@dataclass(frozen=True)
class Dinero:
    centavos: int
    moneda: str = "MXN"

    def sumar(self, otro):
        if otro.moneda != self.moneda:
            raise ValueError("monedas distintas")
        return Dinero(self.centavos + otro.centavos, self.moneda)` }
        },
        quiz: [
          { q: "En DDD, ¿qué es un bounded context?", options: ["Una tabla SQL", "Una frontera donde un modelo de dominio tiene un significado único y consistente", "Un endpoint REST", "Un servidor físico"], a: 1, exp: "Un bounded context delimita dónde un término del modelo (ej. 'Transacción') tiene un significado preciso, evitando ambigüedad entre subdominios." },
          { q: "Un 'Monto con moneda' que se compara por su valor y es inmutable es...", options: ["Una entidad", "Un value object", "Un aggregate root", "Un repositorio"], a: 1, exp: "Los value objects no tienen identidad propia: dos montos iguales son intercambiables." }
        ],
        cards: [
          { front: "¿Entidad vs Value Object?", back: "Entidad tiene identidad propia (una Cuenta #123). Value object se define solo por su valor (un Monto de $50 MXN)." },
          { front: "¿Qué protege un Aggregate?", back: "Sus invariantes de negocio: las reglas que deben cumplirse siempre, modificadas como una unidad transaccional." }
        ]
      },
      {
        title: "API Gateway: Kong y AWS API Gateway",
        body: "Cuando tienes decenas de microservicios, no quieres que el cliente conozca a cada uno. Un API Gateway es la puerta de entrada única: enruta peticiones, centraliza autenticación, aplica rate limiting, hace logging y transforma respuestas. Kong (open source, sobre Nginx) y AWS API Gateway (gestionado) son los dos clásicos. El gateway saca responsabilidades transversales (cross-cutting concerns) de cada servicio para no duplicarlas.",
        points: [
          "Punto de entrada <b>único</b> a todos tus microservicios.",
          "Centraliza auth, <b>rate limiting</b>, logging y transformación.",
          "<b>Kong</b> = open source sobre Nginx; <b>AWS API Gateway</b> = gestionado.",
          "Evita duplicar lógica transversal en cada servicio."
        ],
        quiz: [
          { q: "¿Cuál es el principal beneficio de un API Gateway?", options: ["Acelerar la base de datos", "Centralizar auth, ruteo y rate limiting en un solo punto de entrada", "Reemplazar Kubernetes", "Cifrar el disco"], a: 1, exp: "El gateway concentra las preocupaciones transversales y oculta la topología interna de microservicios al cliente." }
        ],
        cards: [
          { front: "¿Qué es un API Gateway?", back: "La puerta de entrada única a tus microservicios: ruteo, autenticación, rate limiting y observabilidad centralizados." }
        ]
      },
      {
        title: "gRPC para comunicación interna",
        body: "Entre tus propios microservicios, REST/JSON es pesado. gRPC usa HTTP/2 y Protocol Buffers (un formato binario compacto) para llamadas remotas tipadas y rápidas. Defines el contrato en un archivo .proto y generas el código cliente y servidor en cualquier lenguaje. Soporta streaming bidireccional. Regla práctica: gRPC hacia adentro (servicio↔servicio), REST/GraphQL hacia afuera (clientes).",
        points: [
          "<b>HTTP/2 + Protobuf</b>: binario, compacto y rápido.",
          "El contrato vive en un archivo <b>.proto</b> y genera código tipado.",
          "Soporta <b>streaming</b> en ambas direcciones.",
          "Ideal para comunicación <b>interna</b>; REST/GraphQL para el cliente."
        ],
        code: {
          lang: "proto", fn: "pagos.proto",
          src: `syntax = "proto3";

service Pagos {
  rpc Autorizar (SolicitudPago) returns (RespuestaPago);
}

message SolicitudPago {
  string cuenta_id = 1;
  int64  centavos  = 2;
  string moneda    = 3;
}

message RespuestaPago {
  bool   aprobado = 1;
  string codigo   = 2;
}`
        },
        practice: {
          task: "Agrega al servicio gRPC un RPC <code>ConsultarSaldo</code> que reciba una <code>cuenta_id</code> y devuelva los <code>centavos</code>.",
          hint: "Define dos <code>message</code> (request y response) y declara el <code>rpc</code> dentro del bloque <code>service</code>.",
          solution: { lang: "proto", fn: "saldo_reto.proto", src: `service Pagos {
  rpc ConsultarSaldo (SolicitudSaldo) returns (RespuestaSaldo);
}

message SolicitudSaldo {
  string cuenta_id = 1;
}

message RespuestaSaldo {
  int64 centavos = 1;
}` }
        },
        quiz: [
          { q: "¿Qué dos tecnologías usa gRPC por debajo?", options: ["HTTP/1.1 y XML", "HTTP/2 y Protocol Buffers", "FTP y CSV", "WebSocket y YAML"], a: 1, exp: "gRPC se apoya en HTTP/2 para el transporte y en Protobuf para serializar mensajes de forma binaria y compacta." }
        ],
        cards: [
          { front: "¿gRPC hacia dónde conviene?", back: "Comunicación interna entre microservicios (rápida y tipada). Para clientes externos se prefiere REST o GraphQL." }
        ]
      },
      {
        title: "GraphQL para APIs orientadas al cliente",
        body: "Con REST, el cliente suele recibir de más (over-fetching) o tener que hacer varias llamadas (under-fetching). GraphQL expone un solo endpoint y un esquema tipado donde el cliente pide exactamente los campos que necesita en una sola query. Tiene queries (lectura), mutations (escritura) y subscriptions (tiempo real). Ojo con el N+1 y con limitar la complejidad de queries para no exponerte a abusos.",
        points: [
          "Un <b>solo endpoint</b>; el cliente pide exactamente los campos que quiere.",
          "Resuelve el <b>over/under-fetching</b> típico de REST.",
          "<b>query</b> (leer), <b>mutation</b> (escribir), <b>subscription</b> (tiempo real).",
          "Cuida el problema <b>N+1</b> y limita la complejidad de las queries."
        ],
        code: {
          lang: "graphql", fn: "schema.graphql",
          src: `type Cuenta {
  id: ID!
  saldoCentavos: Int!
  movimientos: [Movimiento!]!
}

type Movimiento {
  id: ID!
  monto: Int!
  fecha: String!
}

type Query {
  cuenta(id: ID!): Cuenta
}`
        },
        practice: {
          task: "Agrega al esquema una <b>mutation</b> <code>transferir</code> que reciba origen, destino y monto, y devuelva un <code>Movimiento</code>.",
          hint: "Las escrituras van bajo <code>type Mutation</code>; los argumentos se declaran entre paréntesis con su tipo.",
          solution: { lang: "graphql", fn: "mutation_reto.graphql", src: `type Mutation {
  transferir(
    origen: ID!
    destino: ID!
    monto: Int!
  ): Movimiento!
}` }
        },
        quiz: [
          { q: "¿Qué problema de REST resuelve principalmente GraphQL?", options: ["La latencia de red física", "El over-fetching y under-fetching: pides justo los campos que necesitas", "El cifrado TLS", "Las migraciones de base de datos"], a: 1, exp: "GraphQL deja que el cliente especifique exactamente qué datos quiere, evitando traer de más o hacer múltiples llamadas." }
        ],
        cards: [
          { front: "¿query, mutation y subscription en GraphQL?", back: "query = lectura, mutation = escritura, subscription = datos en tiempo real (push)." }
        ]
      },
      {
        title: "Apache Kafka: tópicos, particiones y consumer groups",
        body: "Kafka es un log distribuido de eventos: los productores escriben mensajes en tópicos y los consumidores los leen. Cada tópico se divide en particiones (la unidad de paralelismo y orden: el orden solo se garantiza dentro de una partición). Un consumer group reparte las particiones entre sus consumidores para escalar horizontalmente. Cada consumidor lleva un offset que marca hasta dónde leyó. Es la espina dorsal de los sistemas event-driven.",
        points: [
          "<b>Tópico</b> = canal de eventos; se divide en <b>particiones</b>.",
          "El <b>orden</b> solo se garantiza dentro de una partición.",
          "Un <b>consumer group</b> reparte particiones para escalar.",
          "El <b>offset</b> marca hasta qué punto leyó cada consumidor."
        ],
        code: {
          lang: "python", fn: "consumer.py",
          src: `from confluent_kafka import Consumer

c = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "motor-fraude",      # consumer group
    "auto.offset.reset": "earliest",
})
c.subscribe(["transacciones"])       # topico

while True:
    msg = c.poll(1.0)
    if msg is None:
        continue
    if msg.error():
        continue
    procesar(msg.value())            # evento de transaccion
    c.commit(msg)                    # avanza el offset`
        },
        practice: {
          task: "Del lado productor, publica un evento <code>transaccion</code> en Kafka usando como <b>key</b> el id de cuenta (para que todas las de una cuenta caigan en la misma partición y conserven orden).",
          hint: "Pasa <code>key=</code> en <code>producer.produce(topico, key=..., value=...)</code>; misma key = misma partición.",
          solution: { lang: "python", fn: "producer_reto.py", src: `from confluent_kafka import Producer

p = Producer({"bootstrap.servers": "localhost:9092"})

def publicar(cuenta_id, evento):
    p.produce("transacciones",
              key=str(cuenta_id),     # ordena por cuenta
              value=evento)
    p.flush()` }
        },
        quiz: [
          { q: "En Kafka, ¿dónde se garantiza el orden de los mensajes?", options: ["En todo el tópico", "Dentro de una misma partición", "En el consumer group", "En ningún lado"], a: 1, exp: "El orden total solo está garantizado dentro de cada partición; entre particiones no hay orden global." },
          { q: "¿Para qué sirve un consumer group?", options: ["Cifrar mensajes", "Repartir las particiones entre varios consumidores para escalar", "Borrar el tópico", "Crear índices"], a: 1, exp: "Un consumer group distribuye las particiones de un tópico entre sus miembros, permitiendo procesamiento paralelo." }
        ],
        cards: [
          { front: "¿Qué es el offset en Kafka?", back: "Un puntero que indica hasta qué mensaje ha leído un consumidor dentro de una partición." },
          { front: "¿Partición en Kafka?", back: "La unidad de paralelismo y de orden de un tópico. El orden solo se garantiza dentro de cada partición." }
        ]
      },
      {
        title: "Event Sourcing: el estado como secuencia de eventos",
        body: "En lugar de guardar solo el estado actual (saldo = $100), event sourcing guarda la secuencia inmutable de eventos que llevaron a él (Depósito $150, Retiro $50). El estado se reconstruye reproduciendo los eventos. Te da una auditoría perfecta —clave en finanzas—, la capacidad de viajar en el tiempo y de calcular nuevas proyecciones del pasado. El precio: más complejidad y necesidad de snapshots para no reproducir millones de eventos.",
        points: [
          "Guardas <b>eventos inmutables</b>, no solo el estado final.",
          "El estado se <b>reconstruye</b> reproduciendo los eventos.",
          "Auditoría perfecta y 'viaje en el tiempo' (ideal en finanzas).",
          "Usa <b>snapshots</b> para no reproducir todo el historial siempre."
        ],
        code: {
          lang: "python", fn: "event_sourcing.py",
          src: `eventos = [
    {"tipo": "Deposito", "centavos": 15000},
    {"tipo": "Retiro",   "centavos": 5000},
]

def reconstruir(eventos):
    saldo = 0
    for e in eventos:
        if e["tipo"] == "Deposito":
            saldo += e["centavos"]
        elif e["tipo"] == "Retiro":
            saldo -= e["centavos"]
    return saldo

print(reconstruir(eventos))  # 10000 -> $100.00`
        },
        practice: {
          task: "Agrega soporte para un evento <code>Comision</code> que <b>resta</b> al saldo, y reconstruye el saldo final desde la lista de eventos.",
          hint: "Añade un <code>elif e['tipo'] == 'Comision'</code> que reste, igual que Retiro.",
          solution: { lang: "python", fn: "es_reto.py", src: `def reconstruir(eventos):
    saldo = 0
    for e in eventos:
        if e["tipo"] == "Deposito":
            saldo += e["centavos"]
        elif e["tipo"] in ("Retiro", "Comision"):
            saldo -= e["centavos"]
    return saldo` }
        },
        quiz: [
          { q: "¿Qué guarda event sourcing como fuente de verdad?", options: ["Solo el estado actual", "La secuencia inmutable de eventos que produjeron el estado", "Un backup diario", "Solo logs de error"], a: 1, exp: "La verdad es la lista de eventos; el estado se deriva reproduciéndolos. Esto da auditoría total." }
        ],
        cards: [
          { front: "¿Por qué event sourcing encaja en finanzas?", back: "Porque produce una auditoría inmutable y completa: puedes reconstruir cualquier saldo en cualquier instante del pasado." },
          { front: "¿Qué es un snapshot en event sourcing?", back: "Una foto del estado en un punto, para no tener que reproducir todos los eventos desde el inicio." }
        ]
      },
      {
        title: "CQRS: separar lecturas de escrituras",
        body: "CQRS (Command Query Responsibility Segregation) separa el modelo que escribe (commands: 'transferir dinero') del modelo que lee (queries: 'dame el estado de cuenta'). Así puedes optimizar cada lado por separado: la escritura prioriza consistencia e invariantes; la lectura usa vistas desnormalizadas rápidas. Combina muy bien con event sourcing: los comandos generan eventos y las proyecciones de lectura se actualizan a partir de ellos.",
        points: [
          "<b>Command</b> = cambia el estado; <b>Query</b> = solo lee.",
          "Cada lado se optimiza por separado (consistencia vs velocidad).",
          "Las lecturas usan <b>vistas desnormalizadas</b> rápidas.",
          "Encaja naturalmente con <b>event sourcing</b>."
        ],
        quiz: [
          { q: "¿Qué separa exactamente CQRS?", options: ["Frontend de backend", "El modelo de escritura (commands) del modelo de lectura (queries)", "Producción de desarrollo", "Kafka de PostgreSQL"], a: 1, exp: "CQRS divide responsabilidades: un modelo para mutar estado y otro, distinto, para consultarlo." }
        ],
        cards: [
          { front: "¿Qué significa CQRS?", back: "Command Query Responsibility Segregation: separar el modelo de escritura del de lectura para optimizar cada uno." }
        ]
      },
      {
        title: "Outbox pattern: consistencia entre BD y eventos",
        body: "Problema clásico: guardas una transacción en PostgreSQL y luego publicas un evento en Kafka. Si el proceso muere entre ambos pasos, quedan inconsistentes (dual-write problem). El outbox pattern lo resuelve: dentro de la MISMA transacción de base de datos, escribes el cambio y un registro en una tabla 'outbox'. Un proceso aparte (o CDC con Debezium) lee la outbox y publica a Kafka. Así el evento se publica si y solo si la transacción hizo commit.",
        points: [
          "Evita el <b>dual-write problem</b> entre BD y broker de eventos.",
          "Escribes el cambio y el evento en la <b>misma transacción</b>.",
          "Un relay (o <b>Debezium/CDC</b>) publica la outbox a Kafka.",
          "El evento sale <b>solo si</b> el commit ocurrió: consistencia garantizada."
        ],
        code: {
          lang: "python", fn: "outbox.py",
          src: `async with conn.transaction():
    # 1) cambio de negocio
    await conn.execute(
        "UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2",
        monto, cuenta_id,
    )
    # 2) evento en la MISMA transaccion
    await conn.execute(
        "INSERT INTO outbox (tipo, payload) VALUES ($1, $2)",
        "DineroRetirado", payload,
    )
# Un relay aparte lee 'outbox' y publica a Kafka`
        },
        practice: {
          task: "Escribe la tabla <code>outbox</code> mínima para el patrón: id, tipo de evento, payload JSON, marca de procesado y fecha.",
          hint: "Una bandera <code>procesado BOOLEAN DEFAULT false</code> permite que el relay sepa qué falta publicar.",
          solution: { lang: "sql", fn: "outbox_reto.sql", src: `CREATE TABLE outbox (
  id        BIGSERIAL PRIMARY KEY,
  tipo      TEXT NOT NULL,
  payload   JSONB NOT NULL,
  procesado BOOLEAN NOT NULL DEFAULT false,
  creado    TIMESTAMPTZ NOT NULL DEFAULT now()
);` }
        },
        quiz: [
          { q: "¿Qué problema resuelve el outbox pattern?", options: ["El N+1 de GraphQL", "El dual-write: que la BD y el evento queden inconsistentes si algo falla", "La latencia de TLS", "El rate limiting"], a: 1, exp: "Al escribir el evento en la misma transacción que el cambio, evitas que uno ocurra sin el otro." }
        ],
        cards: [
          { front: "¿Cómo garantiza consistencia el outbox?", back: "Escribe el evento en una tabla outbox dentro de la misma transacción del cambio; un relay lo publica después. Si no hubo commit, no hay evento." }
        ]
      },
      {
        title: "Open Finance: PSD2, LATAM y agregadores (Plaid, Belvo)",
        body: "Las regulaciones de open banking obligan a los bancos a exponer APIs para que terceros, con consentimiento del usuario, accedan a sus datos y muevan dinero. PSD2 es la directiva europea; en LATAM avanza el Open Finance (México con su Ley Fintech, Brasil con Open Finance). Como integrar banco por banco es inviable, surgen agregadores: Plaid (EE.UU.), Belvo y Finerio Connect (LATAM) ofrecen una sola API para conectarte a cientos de instituciones.",
        points: [
          "Open banking obliga a exponer APIs con <b>consentimiento</b> del usuario.",
          "<b>PSD2</b> en Europa; Open Finance creciendo en LATAM.",
          "Los <b>agregadores</b> unifican cientos de bancos tras una sola API.",
          "<b>Plaid</b> (EE.UU.), <b>Belvo</b> y <b>Finerio Connect</b> (LATAM)."
        ],
        quiz: [
          { q: "¿Qué hacen agregadores como Belvo o Plaid?", options: ["Emiten tarjetas físicas", "Ofrecen una sola API para conectarse a muchos bancos a la vez", "Minan criptomonedas", "Reemplazan a SWIFT"], a: 1, exp: "Abstraen la fragmentación: en vez de integrar cada banco, te conectas a uno y llegas a cientos de instituciones." }
        ],
        cards: [
          { front: "¿Qué es PSD2?", back: "La directiva europea de open banking que obliga a los bancos a abrir APIs a terceros autorizados, con consentimiento del cliente." },
          { front: "¿Plaid vs Belvo?", back: "Agregadores de open finance: Plaid es fuerte en EE.UU.; Belvo está enfocado en LATAM." }
        ]
      },
      {
        title: "OAuth2 con PKCE para consentimiento",
        body: "PKCE (Proof Key for Code Exchange) es la extensión de OAuth2 que asegura el flujo Authorization Code en clientes públicos (apps móviles, SPAs) que no pueden guardar un secreto. El cliente genera un code_verifier aleatorio, envía su hash (code_challenge) al pedir autorización, y al canjear el code presenta el verifier original. Así, aunque alguien intercepte el authorization code, no puede canjearlo sin el verifier. Hoy PKCE se recomienda para TODO flujo Authorization Code.",
        points: [
          "Protege el flujo <b>Authorization Code</b> en apps móviles y SPAs.",
          "<b>code_verifier</b> secreto + <b>code_challenge</b> (su hash) público.",
          "Un code robado es inútil sin el <b>verifier</b> original.",
          "Recomendado hoy para <b>todo</b> Authorization Code, no solo clientes públicos."
        ],
        code: {
          lang: "python", fn: "pkce.py",
          src: `import os, hashlib, base64

# 1) el cliente genera un verifier secreto
verifier = base64.urlsafe_b64encode(os.urandom(32)).rstrip(b"=")

# 2) y manda solo su hash (challenge) al autorizar
digest = hashlib.sha256(verifier).digest()
challenge = base64.urlsafe_b64encode(digest).rstrip(b"=")

# 3) al canjear el 'code' presenta el verifier original
#    el servidor recalcula el hash y verifica que coincida`
        },
        practice: {
          task: "Del lado servidor, escribe <code>verificar(verifier, challenge)</code> que recompute el hash del verifier y confirme que coincide con el challenge recibido.",
          hint: "Recalcula <code>base64url(sha256(verifier))</code> y compáralo con el challenge que llegó al inicio.",
          solution: { lang: "python", fn: "pkce_reto.py", src: `import hashlib, base64

def calc_challenge(verifier):
    d = hashlib.sha256(verifier).digest()
    return base64.urlsafe_b64encode(d).rstrip(b"=")

def verificar(verifier, challenge):
    return calc_challenge(verifier) == challenge` }
        },
        quiz: [
          { q: "¿Para qué sirve PKCE en OAuth2?", options: ["Cifrar la base de datos", "Asegurar el Authorization Code en clientes que no pueden guardar un secreto", "Generar tarjetas virtuales", "Comprimir tokens"], a: 1, exp: "PKCE evita que un authorization code interceptado pueda canjearse sin el code_verifier original." }
        ],
        cards: [
          { front: "¿code_verifier vs code_challenge?", back: "El verifier es el secreto aleatorio que guarda el cliente; el challenge es su hash SHA-256, que se envía al pedir autorización." }
        ]
      },
      {
        title: "Biometría facial con OpenCV: liveness detection",
        body: "Para KYC remoto necesitas confirmar que es una persona real y no una foto o un video (presentation attack). El liveness detection distingue a un humano vivo: liveness pasivo analiza textura, profundidad y reflejos de una sola imagen; el activo pide acciones (parpadea, gira la cabeza). OpenCV detecta y alinea el rostro, y un modelo verifica vivacidad antes de comparar la cara con la del documento. Nunca compares caras sin antes pasar liveness.",
        points: [
          "Evita ataques de <b>presentación</b>: fotos, videos o máscaras.",
          "<b>Liveness pasivo</b>: textura/profundidad de una imagen.",
          "<b>Liveness activo</b>: pide acciones (parpadear, girar).",
          "Primero <b>liveness</b>, luego comparas el rostro con el del documento."
        ],
        code: {
          lang: "python", fn: "liveness.py",
          src: `import cv2

# detecta el rostro antes de cualquier verificacion
detector = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
gris = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
caras = detector.detectMultiScale(gris, 1.3, 5)

if len(caras) == 1:
    # pasar el recorte a un modelo de liveness/antispoofing
    vivo = modelo_liveness.predecir(recorte_rostro(frame, caras[0]))
    if vivo:
        comparar_con_documento(frame)`
        },
        practice: {
          task: "Antes de comparar rostros, rechaza la imagen si OpenCV detecta <b>cero o más de un rostro</b>. Solo continúa con exactamente uno.",
          hint: "Valida <code>len(caras) == 1</code>; si no, regresa un rechazo y no llames al liveness.",
          solution: { lang: "python", fn: "liveness_reto.py", src: `def validar_un_rostro(caras):
    if len(caras) == 0:
        return "rechazo: sin rostro"
    if len(caras) > 1:
        return "rechazo: multiples rostros"
    return "ok"   # exactamente uno -> seguir a liveness` }
        },
        quiz: [
          { q: "¿Por qué es esencial el liveness detection en KYC remoto?", options: ["Para acelerar la cámara", "Para asegurar que es una persona viva y no una foto o video", "Para cifrar el video", "Para reducir el tamaño del archivo"], a: 1, exp: "Sin liveness, un atacante podría pasar el KYC mostrando una foto o un deepfake del titular." }
        ],
        cards: [
          { front: "¿Liveness pasivo vs activo?", back: "Pasivo analiza textura/profundidad de una imagen sin pedir nada. Activo pide acciones al usuario (parpadear, mover la cabeza)." }
        ]
      },
      {
        title: "OCR de documentos: INE y pasaporte",
        body: "El KYC necesita leer el documento de identidad automáticamente. El OCR extrae texto de la credencial (INE) o pasaporte. En pasaportes, la zona MRZ (las dos líneas de abajo con '<<<') está diseñada para máquinas y trae dígitos de control que validan la lectura. El reto real no es el OCR sino la calidad: reflejos, blur y recortes. Tras extraer, validas formato (CURP, fechas) y cruzas con la foto vía la biometría facial.",
        points: [
          "Extrae datos de <b>INE</b> y pasaporte automáticamente.",
          "La <b>MRZ</b> del pasaporte trae dígitos de control verificables.",
          "El reto es la <b>calidad</b>: reflejos, desenfoque, encuadre.",
          "Después: validar <b>CURP/fechas</b> y cruzar con el rostro."
        ],
        code: {
          lang: "python", fn: "ocr_ine.py",
          src: `import pytesseract, cv2

img = cv2.imread("ine.jpg")
gris = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# binarizar mejora mucho la lectura del OCR
_, th = cv2.threshold(gris, 0, 255,
                      cv2.THRESH_BINARY + cv2.THRESH_OTSU)

texto = pytesseract.image_to_string(th, lang="spa")
# luego: extraer CURP, nombre y fechas con regex y validarlos`
        },
        practice: {
          task: "Tras el OCR, extrae la <b>CURP</b> del texto con una expresión regular (18 caracteres alfanuméricos en mayúsculas).",
          hint: "El patrón base es <code>[A-Z0-9]{18}</code>; usa <code>re.search</code> sobre el texto en mayúsculas.",
          solution: { lang: "python", fn: "curp_reto.py", src: `import re

def extraer_curp(texto):
    m = re.search(r"[A-Z]{4}\\d{6}[A-Z0-9]{8}", texto.upper())
    return m.group(0) if m else None` }
        },
        quiz: [
          { q: "¿Qué tiene de especial la zona MRZ de un pasaporte?", options: ["Está cifrada con RSA", "Está diseñada para lectura por máquina e incluye dígitos de control", "Solo es decorativa", "Contiene la huella digital"], a: 1, exp: "La MRZ es legible por máquina y sus dígitos de control permiten verificar que la lectura del OCR fue correcta." }
        ],
        cards: [
          { front: "¿Qué es la MRZ?", back: "Machine Readable Zone: las líneas con '<<<' de un pasaporte, legibles por máquina y con dígitos de control." }
        ]
      },
      {
        title: "Kubernetes: deployments, services e ingress",
        body: "Kubernetes orquesta tus contenedores: los despliega, escala y reinicia si fallan. Un Pod es la unidad mínima (uno o más contenedores). Un Deployment declara cuántas réplicas quieres y mantiene ese número (self-healing). Como los Pods son efímeros y cambian de IP, un Service les da una dirección estable y balancea entre ellos. El Ingress expone servicios HTTP al exterior con reglas por host/ruta. Tú declaras el estado deseado y K8s lo hace realidad.",
        points: [
          "<b>Pod</b> = unidad mínima; <b>Deployment</b> mantiene N réplicas (self-healing).",
          "<b>Service</b> da una IP estable y balancea entre Pods efímeros.",
          "<b>Ingress</b> expone HTTP al exterior con reglas por host/ruta.",
          "Modelo <b>declarativo</b>: defines el estado deseado, K8s reconcilia."
        ],
        code: {
          lang: "yaml", fn: "deployment.yaml",
          src: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: wallet-api
spec:
  replicas: 3            # K8s mantiene 3 siempre
  selector:
    matchLabels: { app: wallet-api }
  template:
    metadata:
      labels: { app: wallet-api }
    spec:
      containers:
        - name: api
          image: wallet-api:1.0
          ports:
            - containerPort: 8000`
        },
        practice: {
          task: "Escribe el <b>Service</b> de Kubernetes que exponga el Deployment <code>wallet-api</code> (selector app=wallet-api) en el puerto 80 hacia el 8000 del contenedor.",
          hint: "Tipo <code>ClusterIP</code>, <code>selector</code> que coincida con las labels del pod, y <code>port</code>/<code>targetPort</code>.",
          solution: { lang: "yaml", fn: "service_reto.yaml", src: `apiVersion: v1
kind: Service
metadata:
  name: wallet-api
spec:
  selector:
    app: wallet-api
  ports:
    - port: 80
      targetPort: 8000` }
        },
        quiz: [
          { q: "Si un Pod muere, ¿qué hace su Deployment?", options: ["Nada, queda caído", "Crea uno nuevo para mantener el número de réplicas deseado", "Apaga el clúster", "Borra el Service"], a: 1, exp: "El Deployment reconcilia el estado: si faltan réplicas frente a las deseadas, levanta nuevas (self-healing)." },
          { q: "¿Por qué necesitas un Service frente a Pods?", options: ["Para cifrar el tráfico", "Porque los Pods cambian de IP; el Service da una dirección estable y balancea", "Para guardar logs", "Para compilar el código"], a: 1, exp: "Los Pods son efímeros y su IP cambia; el Service ofrece un punto de acceso estable con balanceo." }
        ],
        cards: [
          { front: "¿Pod vs Deployment?", back: "El Pod es la unidad que corre tus contenedores; el Deployment declara y mantiene cuántas réplicas de ese Pod deben existir." },
          { front: "¿Qué hace un Ingress?", back: "Expone servicios HTTP/HTTPS al exterior, enrutando por host y ruta hacia los Services correctos." }
        ]
      },
      {
        title: "CI/CD con GitHub Actions",
        body: "CI/CD automatiza el camino de tu código a producción. CI (Integración Continua): en cada push se corren tests y linters para detectar errores temprano. CD (Entrega/Despliegue Continuo): si todo pasa, se construye la imagen y se despliega. En GitHub Actions defines workflows en YAML dentro de .github/workflows: eventos (on: push) disparan jobs con steps. En finanzas además metes escaneo de seguridad y aprobaciones manuales para producción.",
        points: [
          "<b>CI</b>: tests y linters automáticos en cada push.",
          "<b>CD</b>: build y despliegue automáticos si CI pasa.",
          "Workflows en <b>YAML</b> bajo <b>.github/workflows</b>.",
          "En banca: añade escaneo de seguridad y aprobaciones manuales."
        ],
        code: {
          lang: "yaml", fn: "ci.yml",
          src: `name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt
      - run: pytest -q          # falla -> bloquea el merge`
        },
        practice: {
          task: "Agrega al workflow un paso que corra <b>ruff</b> (linter) y que <b>falle el build</b> si hay errores de estilo.",
          hint: "Un <code>run: ruff check .</code> que retorne código distinto de 0 ya rompe el job automáticamente.",
          solution: { lang: "yaml", fn: "lint_reto.yml", src: `      - run: pip install ruff
      - run: ruff check .       # si falla, bloquea el merge` }
        },
        quiz: [
          { q: "¿Qué hace la parte 'CI' de un pipeline?", options: ["Despliega a producción", "Corre tests y linters automáticamente para detectar errores temprano", "Cifra la base de datos", "Crea usuarios"], a: 1, exp: "La Integración Continua valida automáticamente cada cambio (tests, lint) antes de integrarlo." }
        ],
        cards: [
          { front: "¿Dónde viven los workflows de GitHub Actions?", back: "En archivos YAML dentro de la carpeta .github/workflows del repositorio." }
        ]
      },
      {
        title: "Observabilidad: Prometheus, Grafana y OpenTelemetry",
        body: "Observabilidad es poder entender qué pasa dentro del sistema desde sus salidas. Tres pilares: métricas (números en el tiempo: RPS, latencia, errores), logs (eventos discretos) y traces (el viaje de una petición entre microservicios). Prometheus recolecta métricas; Grafana las grafica en dashboards y dispara alertas; OpenTelemetry es el estándar abierto para instrumentar y exportar métricas, logs y traces sin atarte a un proveedor. En finanzas, observar latencia y tasa de error es crítico para los SLO.",
        points: [
          "Tres pilares: <b>métricas</b>, <b>logs</b> y <b>traces</b>.",
          "<b>Prometheus</b> recolecta métricas; <b>Grafana</b> las grafica y alerta.",
          "<b>OpenTelemetry</b>: estándar abierto, sin lock-in de proveedor.",
          "Los <b>traces</b> siguen una petición a través de microservicios."
        ],
        code: {
          lang: "python", fn: "metrics.py",
          src: `from prometheus_client import Counter, Histogram

pagos = Counter("pagos_total", "Pagos procesados", ["estado"])
latencia = Histogram("pago_segundos", "Latencia de un pago")

@latencia.time()
def procesar_pago(req):
    ok = autorizar(req)
    pagos.labels(estado="ok" if ok else "rechazado").inc()
    return ok`
        },
        practice: {
          task: "Agrega un contador Prometheus de <b>logins fallidos</b> etiquetado por método (password, biometria) e incrementa según el caso.",
          hint: "Define <code>Counter('logins_fallidos_total', ..., ['metodo'])</code> y usa <code>.labels(metodo=...).inc()</code>.",
          solution: { lang: "python", fn: "metrics_reto.py", src: `from prometheus_client import Counter

fallidos = Counter("logins_fallidos_total",
                   "Logins fallidos", ["metodo"])

def login_fallido(metodo):
    fallidos.labels(metodo=metodo).inc()` }
        },
        quiz: [
          { q: "¿Cuáles son los tres pilares de la observabilidad?", options: ["CPU, RAM y disco", "Métricas, logs y traces", "Frontend, backend y BD", "Dev, staging y prod"], a: 1, exp: "Métricas (tendencias numéricas), logs (eventos) y traces (recorrido de una petición) dan visibilidad completa." },
          { q: "¿Qué rol cumple OpenTelemetry?", options: ["Es una base de datos", "Es el estándar abierto para instrumentar y exportar telemetría sin lock-in", "Reemplaza a Kubernetes", "Es un lenguaje de programación"], a: 1, exp: "OTel estandariza cómo se generan y exportan métricas, logs y traces, evitando atarte a un proveedor concreto." }
        ],
        cards: [
          { front: "¿Prometheus vs Grafana?", back: "Prometheus recolecta y almacena métricas; Grafana las visualiza en dashboards y gestiona alertas." },
          { front: "¿Qué es un trace?", back: "El registro del recorrido completo de una petición a través de varios servicios, útil para ubicar cuellos de botella." }
        ]
      },
      {
        title: "Gestión de secretos: Vault y AWS Secrets Manager",
        body: "Jamás pongas contraseñas, llaves de API o certificados en el código o en variables de entorno en texto plano. Un gestor de secretos los guarda cifrados y los entrega solo a quien está autorizado, con auditoría de cada acceso. HashiCorp Vault (open source) y AWS Secrets Manager (gestionado) permiten además secretos dinámicos (credenciales de BD que se generan al vuelo y expiran) y rotación automática. La regla de oro: el secreto se pide en runtime, nunca se versiona en Git.",
        points: [
          "Nunca pongas secretos en el código ni en Git.",
          "Se guardan <b>cifrados</b> y se entregan con <b>auditoría</b> de acceso.",
          "<b>Vault</b> (open source) y <b>AWS Secrets Manager</b> (gestionado).",
          "<b>Secretos dinámicos</b> + <b>rotación automática</b> reducen el riesgo."
        ],
        quiz: [
          { q: "¿Dónde NO debe vivir un secreto (contraseña, API key)?", options: ["En un gestor de secretos cifrado", "Hardcodeado en el código o commiteado en Git", "Pedido en runtime con auditoría", "Rotado automáticamente"], a: 1, exp: "Los secretos en el código o en el repositorio quedan expuestos para siempre en el historial; deben pedirse en runtime a un gestor." }
        ],
        cards: [
          { front: "¿Qué es un secreto dinámico?", back: "Una credencial generada al momento (ej. usuario de BD temporal) que expira sola, reduciendo la ventana de exposición." }
        ]
      }
    ]
  },
  {
    id: "f4", icon: Coins, ac: "#b388ff",
    title: "Blockchain",
    months: "Meses 11–14",
    tagline: "Cripto de verdad: firmas, Solidity seguro, DeFi y activos tokenizados.",
    project: "Protocolo de préstamos colateralizados en Solidity",
    certs: ["CBDE", "Alchemy University Bootcamp", "Chainlink Developer Expert"],
    lessons: [
      {
        title: "Firmas digitales: RSA, ECDSA y Ed25519",
        body: "Una firma digital prueba que un mensaje viene de quien dice y que no fue alterado, usando criptografía asimétrica: firmas con tu clave privada y cualquiera verifica con tu clave pública. RSA es el clásico, pero sus llaves son grandes. La criptografía de curva elíptica (ECC) logra la misma seguridad con llaves mucho más pequeñas: ECDSA (secp256k1) es la que usan Bitcoin y Ethereum; Ed25519 es más moderna, rápida y resistente a ciertos errores de implementación. En blockchain, tu cuenta ES un par de llaves.",
        points: [
          "Firmas con la <b>clave privada</b>; se verifica con la <b>pública</b>.",
          "<b>RSA</b>: seguro pero con llaves grandes.",
          "<b>ECDSA</b> (secp256k1) lo usan Bitcoin y Ethereum, con llaves pequeñas.",
          "<b>Ed25519</b>: moderna, rápida y más robusta ante errores."
        ],
        quiz: [
          { q: "¿Con qué llave se FIRMA y con cuál se VERIFICA?", options: ["Se firma con la pública, se verifica con la privada", "Se firma con la privada, se verifica con la pública", "Ambas con la pública", "Ambas con la privada"], a: 1, exp: "La privada (secreta) genera la firma; la pública (compartible) permite a cualquiera verificarla." },
          { q: "¿Qué curva de firma usan Bitcoin y Ethereum?", options: ["RSA-2048", "ECDSA sobre secp256k1", "Ed25519", "SHA-256"], a: 1, exp: "Ambas redes firman transacciones con ECDSA sobre la curva secp256k1." }
        ],
        cards: [
          { front: "¿Por qué ECC en vez de RSA en blockchain?", back: "La criptografía de curva elíptica da la misma seguridad con llaves y firmas mucho más pequeñas, ideal para almacenar en cadena." },
          { front: "En una blockchain, ¿qué es tu 'cuenta'?", back: "Un par de llaves: la privada controla los fondos, la dirección pública se deriva de la llave pública." }
        ]
      },
      {
        title: "Hashing y Merkle trees: SHA-256 y Keccak-256",
        body: "Una función hash convierte cualquier dato en una huella de tamaño fijo, determinista e irreversible: el mismo input da el mismo hash, y un cambio mínimo lo transforma por completo (efecto avalancha). Bitcoin usa SHA-256; Ethereum usa Keccak-256 (a veces llamado 'SHA-3'). Un Merkle tree organiza muchos hashes en pares hasta una sola raíz (Merkle root): basta comparar raíces para saber si dos conjuntos de datos son idénticos, y un Merkle proof demuestra que un dato pertenece al conjunto sin revelarlo todo.",
        points: [
          "Hash = huella <b>determinista</b>, de tamaño fijo e <b>irreversible</b>.",
          "<b>Efecto avalancha</b>: un cambio mínimo altera todo el hash.",
          "Bitcoin usa <b>SHA-256</b>; Ethereum usa <b>Keccak-256</b>.",
          "Un <b>Merkle proof</b> prueba pertenencia sin revelar todo el árbol."
        ],
        code: {
          lang: "python", fn: "hashing.py",
          src: `import hashlib

def sha256(x):
    return hashlib.sha256(x).hexdigest()

print(sha256(b"hola"))   # huella fija de 64 hex
print(sha256(b"holA"))   # cambia 1 letra -> hash totalmente distinto

# nodo de un Merkle tree: hash de la concatenacion de hijos
def nodo(izq, der):
    return sha256(bytes.fromhex(izq) + bytes.fromhex(der))`
        },
        practice: {
          task: "Calcula la <b>Merkle root</b> de 4 hojas: combina pares con SHA-256 hasta quedar una sola raíz.",
          hint: "Hashea de dos en dos: nivel1 = [h(0,1), h(2,3)], luego raiz = h(nivel1[0], nivel1[1]).",
          solution: { lang: "python", fn: "merkle_reto.py", src: `import hashlib

def h(a, b):
    return hashlib.sha256((a + b).encode()).hexdigest()

def merkle_root(hojas):
    nivel = hojas
    while len(nivel) > 1:
        nivel = [h(nivel[i], nivel[i+1])
                 for i in range(0, len(nivel), 2)]
    return nivel[0]` }
        },
        quiz: [
          { q: "¿Qué hash usa Ethereum?", options: ["SHA-256", "Keccak-256", "MD5", "RSA"], a: 1, exp: "Ethereum usa Keccak-256 (frecuentemente llamado SHA-3) para direcciones, IDs de transacción y más." },
          { q: "¿Qué permite un Merkle proof?", options: ["Cifrar datos", "Demostrar que un dato pertenece a un conjunto sin revelarlo entero", "Firmar transacciones", "Acelerar la red"], a: 1, exp: "Con solo unos pocos hashes del camino a la raíz, pruebas que un elemento está en el árbol sin dar todo el conjunto." }
        ],
        cards: [
          { front: "¿Qué es el efecto avalancha?", back: "Cambiar un solo bit del input transforma por completo el hash de salida; hace inviable adivinar el input." },
          { front: "¿Qué es el Merkle root?", back: "El hash único en la cima de un Merkle tree: resume e identifica todo el conjunto de datos de abajo." }
        ]
      },
      {
        title: "Zero-Knowledge Proofs",
        body: "Una prueba de conocimiento cero (ZKP) permite demostrar que algo es cierto SIN revelar la información que lo respalda. Ejemplo: probar que eres mayor de edad sin mostrar tu fecha de nacimiento, o que tienes saldo suficiente sin revelar el monto. Las dos familias prácticas son zk-SNARKs (pruebas diminutas, verificación rápida, requieren un setup de confianza) y zk-STARKs (sin setup de confianza, resistentes a cuántica, pruebas más grandes). En finanzas habilitan privacidad y cumplimiento a la vez, y los rollups ZK escalan Ethereum.",
        points: [
          "Demuestras que algo es <b>verdad</b> sin revelar los datos.",
          "Ej.: 'soy mayor de edad' sin enseñar tu fecha de nacimiento.",
          "<b>zk-SNARK</b>: prueba diminuta, pero requiere trusted setup.",
          "<b>zk-STARK</b>: sin trusted setup y resistente a cuántica."
        ],
        quiz: [
          { q: "¿Qué logra una Zero-Knowledge Proof?", options: ["Cifrar un disco", "Probar que una afirmación es cierta sin revelar la información subyacente", "Minar bloques más rápido", "Firmar con RSA"], a: 1, exp: "El verificador queda convencido de la verdad de la afirmación sin aprender nada más sobre los datos secretos." }
        ],
        cards: [
          { front: "¿zk-SNARK vs zk-STARK?", back: "SNARK: pruebas pequeñas pero con trusted setup. STARK: sin trusted setup y resistente a cuántica, pero pruebas más grandes." }
        ]
      },
      {
        title: "Solidity: tipos, funciones, modificadores y eventos",
        body: "Solidity es el lenguaje de los contratos inteligentes de Ethereum. Es tipado estático y compila a bytecode de la EVM. Tipos clave: uint256, address, bool, mapping (tabla clave→valor). Las funciones llevan visibilidad (public/external/internal/private) y mutabilidad (view = solo lee, pure = ni lee ni escribe; sin nada = puede modificar estado y cuesta gas). Los modificadores reutilizan precondiciones (ej. onlyOwner). Los eventos emiten registros que las apps fuera de la cadena escuchan. Cada escritura cuesta gas: el código eficiente es código barato.",
        points: [
          "Tipos: <b>uint256</b>, <b>address</b>, <b>bool</b>, <b>mapping</b> (clave→valor).",
          "Visibilidad: <b>public/external/internal/private</b>.",
          "<b>view</b> solo lee, <b>pure</b> no toca estado; escribir cuesta <b>gas</b>.",
          "<b>modifier</b> reutiliza precondiciones; <b>event</b> notifica al exterior."
        ],
        code: {
          lang: "solidity", fn: "Banco.sol",
          src: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Banco {
    mapping(address => uint256) public saldo;
    address public owner;

    event Deposito(address indexed quien, uint256 monto);

    constructor() { owner = msg.sender; }

    modifier soloOwner() {
        require(msg.sender == owner, "no autorizado");
        _;
    }

    function depositar() external payable {
        saldo[msg.sender] += msg.value;
        emit Deposito(msg.sender, msg.value);
    }

    function verSaldo(address quien) external view returns (uint256) {
        return saldo[quien];
    }
}`
        },
        practice: {
          task: "Agrega al contrato una función <code>retirar(uint256 monto)</code> que valide saldo suficiente y emita un evento <code>Retiro</code>.",
          hint: "Usa <code>require(saldo[msg.sender] &gt;= monto, ...)</code>, resta y luego <code>emit</code>.",
          solution: { lang: "solidity", fn: "Retiro_reto.sol", src: `event Retiro(address indexed quien, uint256 monto);

function retirar(uint256 monto) external {
    require(saldo[msg.sender] >= monto, "insuficiente");
    saldo[msg.sender] -= monto;
    emit Retiro(msg.sender, monto);
}` }
        },
        quiz: [
          { q: "Una función marcada como 'view' en Solidity...", options: ["Puede modificar el estado", "Solo lee el estado, no lo modifica", "Borra el contrato", "Siempre cuesta mucho gas"], a: 1, exp: "view garantiza que la función solo lee; no escribe estado y por eso no consume gas si se llama externamente." },
          { q: "¿Para qué sirve un modifier como onlyOwner?", options: ["Para emitir eventos", "Para reutilizar una precondición (ej. validar quién llama) en varias funciones", "Para cifrar datos", "Para crear tokens"], a: 1, exp: "Los modificadores encapsulan checks reutilizables que se ejecutan antes del cuerpo de la función." }
        ],
        cards: [
          { front: "¿Qué es gas en Ethereum?", back: "El costo de ejecutar operaciones en la EVM. Escribir estado cuesta gas; leer con view (externamente) no." },
          { front: "¿Para qué sirven los events en Solidity?", back: "Para emitir registros en los logs de la cadena que las aplicaciones off-chain pueden escuchar e indexar." }
        ]
      },
      {
        title: "Seguridad: reentrancy guard y checks-effects-interactions",
        body: "El ataque de reentrada hundió The DAO: si tu contrato envía ETH a otro contrato ANTES de actualizar su propio estado, el receptor puede volver a llamarte (reentrar) y retirar de nuevo con el saldo viejo, en bucle. Dos defensas: (1) el patrón checks-effects-interactions —primero validas, luego actualizas tu estado, y solo al final interactúas con el exterior—; (2) un reentrancy guard, un candado (modifier nonReentrant) que impide reentrar mientras la función corre. En finanzas on-chain, esto no es opcional.",
        points: [
          "<b>Reentrada</b>: el receptor te re-llama antes de que actualices tu estado.",
          "<b>Checks-Effects-Interactions</b>: valida → actualiza estado → interactúa.",
          "Actualiza tu saldo <b>antes</b> de enviar fondos, nunca después.",
          "Un <b>reentrancy guard</b> (nonReentrant) bloquea el reingreso."
        ],
        code: {
          lang: "solidity", fn: "Retiro.sol",
          src: `// patron correcto: Checks-Effects-Interactions
function retirar(uint256 monto) external {
    require(saldo[msg.sender] >= monto, "insuficiente"); // CHECK
    saldo[msg.sender] -= monto;                          // EFFECT (antes!)
    (bool ok, ) = msg.sender.call{value: monto}("");     // INTERACTION
    require(ok, "fallo el envio");
}

// guard simple
bool private locked;
modifier nonReentrant() {
    require(!locked, "reentrada");
    locked = true;
    _;
    locked = false;
}`
        },
        practice: {
          task: "Toma una función vulnerable que envía ETH <b>antes</b> de actualizar el saldo y <b>reordénala</b> al patrón checks-effects-interactions.",
          hint: "Mueve la resta del saldo ANTES del <code>.call{value:...}</code>. El estado se actualiza primero, la interacción al final.",
          solution: { lang: "solidity", fn: "guard_reto.sol", src: `function retirar(uint256 monto) external {
    require(saldo[msg.sender] >= monto, "insuficiente"); // CHECK
    saldo[msg.sender] -= monto;                          // EFFECT
    (bool ok, ) = msg.sender.call{value: monto}("");     // INTERACTION
    require(ok, "fallo envio");
}` }
        },
        quiz: [
          { q: "¿Cómo evita la reentrada el patrón checks-effects-interactions?", options: ["Cifra el ETH", "Actualiza el estado ANTES de interactuar con el exterior", "Emite un evento", "Aumenta el gas"], a: 1, exp: "Al restar el saldo antes de enviar fondos, una re-llamada ya encuentra el saldo actualizado y no puede drenar de más." },
          { q: "¿Qué hace un modifier nonReentrant?", options: ["Hace la función más rápida", "Pone un candado que impide volver a entrar mientras la función se ejecuta", "Cobra una comisión", "Crea un token"], a: 1, exp: "El guard marca un flag de bloqueo al entrar y lo libera al salir, rechazando cualquier reingreso intermedio." }
        ],
        cards: [
          { front: "¿En qué orden va checks-effects-interactions?", back: "1) Checks (validaciones), 2) Effects (actualizar tu estado), 3) Interactions (llamadas externas). En ese orden estricto." },
          { front: "¿Qué ataque famoso explotó la reentrada?", back: "El hackeo de The DAO en Ethereum (2016), que drenó millones y motivó el hard fork." }
        ]
      },
      {
        title: "Tokens fungibles: el estándar ERC-20",
        body: "ERC-20 es la interfaz estándar para tokens fungibles (intercambiables entre sí, como dinero): stablecoins, tokens de gobernanza, etc. Define funciones que todo token debe implementar: totalSupply, balanceOf, transfer, approve y transferFrom. El par approve + transferFrom habilita el patrón de 'permiso': autorizas a un contrato (ej. un exchange) a mover una cantidad de tus tokens en tu nombre. Gracias a este estándar, cualquier wallet o DEX puede manejar tu token sin conocerlo de antemano.",
        points: [
          "<b>Fungible</b>: cada unidad es idéntica e intercambiable (como dinero).",
          "Funciones clave: <b>balanceOf</b>, <b>transfer</b>, <b>approve</b>, <b>transferFrom</b>.",
          "<b>approve + transferFrom</b> = dar permiso a un contrato para gastar.",
          "El estándar hace que wallets y DEXs manejen cualquier token."
        ],
        code: {
          lang: "solidity", fn: "Token.sol",
          src: `// nucleo de un ERC-20 (simplificado)
mapping(address => uint256) public balanceOf;
mapping(address => mapping(address => uint256)) public allowance;

event Transfer(address indexed de, address indexed a, uint256 valor);

function transfer(address a, uint256 valor) external returns (bool) {
    require(balanceOf[msg.sender] >= valor, "saldo bajo");
    balanceOf[msg.sender] -= valor;
    balanceOf[a] += valor;
    emit Transfer(msg.sender, a, valor);
    return true;
}

function approve(address gastador, uint256 valor) external returns (bool) {
    allowance[msg.sender][gastador] = valor;  // permiso
    return true;
}`
        },
        practice: {
          task: "Implementa <code>transferFrom</code> de un ERC-20: debe respetar el <b>allowance</b> y descontarlo.",
          hint: "Valida balance y <code>allowance[de][msg.sender]</code>, resta ambos y suma al destino; emite <code>Transfer</code>.",
          solution: { lang: "solidity", fn: "transferfrom_reto.sol", src: `function transferFrom(address de, address a, uint256 v)
    external returns (bool)
{
    require(balanceOf[de] >= v, "saldo bajo");
    require(allowance[de][msg.sender] >= v, "sin permiso");
    allowance[de][msg.sender] -= v;
    balanceOf[de] -= v;
    balanceOf[a]  += v;
    emit Transfer(de, a, v);
    return true;
}` }
        },
        quiz: [
          { q: "¿Qué significa que un token sea 'fungible'?", options: ["Que es único e irrepetible", "Que cada unidad es idéntica e intercambiable, como el dinero", "Que no se puede transferir", "Que vive fuera de la cadena"], a: 1, exp: "Fungible = una unidad vale exactamente igual que otra; lo opuesto a un NFT, que es único." },
          { q: "El par approve + transferFrom sirve para...", options: ["Quemar tokens", "Autorizar a otro contrato a mover tus tokens en tu nombre", "Emitir eventos", "Cifrar el balance"], a: 1, exp: "Primero apruebas un límite (allowance) y luego ese tercero usa transferFrom hasta ese monto: base de los DEX." }
        ],
        cards: [
          { front: "¿Qué es ERC-20?", back: "El estándar de tokens fungibles en Ethereum: define la interfaz mínima (transfer, balanceOf, approve...) que toda wallet y DEX entiende." }
        ]
      },
      {
        title: "ERC-721 y ERC-4626: NFTs y vaults tokenizados",
        body: "No todo es fungible. ERC-721 define tokens NO fungibles (NFTs): cada uno tiene un tokenId único e indivisible; sirve para representar algo único, como la escritura de una propiedad tokenizada o una factura. ERC-4626 estandariza los 'tokenized vaults': bóvedas donde depositas un activo (ej. un stablecoin) y recibes shares que representan tu parte, que crece con el rendimiento. Unifica cómo los protocolos de DeFi manejan depósitos que generan yield, haciendo todo componible.",
        points: [
          "<b>ERC-721</b>: tokens no fungibles, cada <b>tokenId</b> es único.",
          "Útil para activos únicos: propiedades, facturas, coleccionables.",
          "<b>ERC-4626</b>: estandariza bóvedas que generan rendimiento.",
          "Depositas un activo y recibes <b>shares</b> de la bóveda."
        ],
        quiz: [
          { q: "¿Cuál es la diferencia clave entre ERC-20 y ERC-721?", options: ["Ninguna", "ERC-20 es fungible (unidades idénticas); ERC-721 es no fungible (cada token es único)", "ERC-721 es más barato", "ERC-20 no se puede transferir"], a: 1, exp: "ERC-20 representa cantidades intercambiables; ERC-721 representa ítems únicos identificados por tokenId." },
          { q: "¿Qué estandariza ERC-4626?", options: ["Imágenes de NFT", "Bóvedas tokenizadas que generan rendimiento (depósito → shares)", "El precio del gas", "Las firmas digitales"], a: 1, exp: "ERC-4626 define una interfaz común para vaults con yield, haciendo los protocolos DeFi componibles entre sí." }
        ],
        cards: [
          { front: "¿Qué representa un ERC-721?", back: "Un token no fungible: un ítem único e indivisible identificado por su tokenId (un NFT)." },
          { front: "¿Qué son las 'shares' en un ERC-4626?", back: "Tokens que representan tu participación en una bóveda; su valor crece a medida que la bóveda genera rendimiento." }
        ]
      },
      {
        title: "Testing con Hardhat o Foundry",
        body: "En blockchain un bug puede costar millones y los contratos suelen ser inmutables tras desplegarse: testear no es opcional. Hardhat es un entorno en JavaScript/TypeScript donde escribes tests con Ethers.js y Chai. Foundry es la alternativa en Rust: escribes los tests EN Solidity (más rápidos) y trae fuzzing integrado (prueba con miles de entradas aleatorias para hallar casos límite). Buenas prácticas: cubrir casos felices y de fallo, simular ataques de reentrada y medir consumo de gas.",
        points: [
          "Los contratos suelen ser <b>inmutables</b>: un bug es permanente.",
          "<b>Hardhat</b>: tests en JS/TS con Ethers.js + Chai.",
          "<b>Foundry</b>: tests en Solidity, muy rápidos y con <b>fuzzing</b>.",
          "Prueba casos felices, de fallo, ataques y consumo de <b>gas</b>."
        ],
        code: {
          lang: "javascript", fn: "Banco.test.js",
          src: `const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Banco", function () {
  it("registra el deposito", async function () {
    const Banco = await ethers.getContractFactory("Banco");
    const banco = await Banco.deploy();
    await banco.depositar({ value: ethers.parseEther("1") });

    const [yo] = await ethers.getSigners();
    expect(await banco.verSaldo(yo.address))
      .to.equal(ethers.parseEther("1"));
  });
});`
        },
        practice: {
          task: "Escribe un test que verifique que <code>retirar</code> con saldo insuficiente <b>revierte</b> (la transacción debe fallar).",
          hint: "Con Hardhat/Chai usa <code>await expect(tx).to.be.reverted</code> o <code>.revertedWith('insuficiente')</code>.",
          solution: { lang: "javascript", fn: "test_reto.js", src: `it("revierte si no hay saldo", async function () {
  const Banco = await ethers.getContractFactory("Banco");
  const banco = await Banco.deploy();
  await expect(
    banco.retirar(ethers.parseEther("1"))
  ).to.be.revertedWith("insuficiente");
});` }
        },
        quiz: [
          { q: "¿Qué ventaja distintiva ofrece Foundry?", options: ["Tests en Python", "Escribir tests en Solidity con fuzzing integrado", "Despliega gratis", "Es un wallet"], a: 1, exp: "Foundry corre tests escritos en Solidity (rápidos) e incluye fuzzing para descubrir entradas que rompen el contrato." }
        ],
        cards: [
          { front: "¿Por qué testear contratos es crítico?", back: "Porque tras desplegarse suelen ser inmutables y manejan dinero real: un error no se puede 'parchear' fácilmente." },
          { front: "¿Qué es el fuzzing?", back: "Probar una función con miles de entradas aleatorias para descubrir casos límite y vulnerabilidades." }
        ]
      },
      {
        title: "DeFi: oráculos Chainlink, AMMs y stablecoins",
        body: "La blockchain no conoce el mundo exterior: no sabe el precio del dólar. Un oráculo como Chainlink trae datos externos (precios, tasas) a la cadena de forma descentralizada y resistente a manipulación. Un AMM (Automated Market Maker) como Uniswap reemplaza el libro de órdenes por pools de liquidez y una fórmula (x·y=k): el precio sale de la proporción de tokens en el pool. Una stablecoin mantiene su valor estable: colateralizada en fiat (USDC), en cripto sobre-colateralizada (DAI) o —peligrosamente— algorítmica (el colapso de UST).",
        points: [
          "Un <b>oráculo</b> (Chainlink) trae datos del mundo real a la cadena.",
          "Un <b>AMM</b> usa pools y una fórmula (x·y=k), no libro de órdenes.",
          "El precio en un AMM sale de la <b>proporción</b> de tokens del pool.",
          "<b>Stablecoins</b>: fiat (USDC), cripto sobre-colateral (DAI) o algorítmica."
        ],
        quiz: [
          { q: "¿Por qué se necesitan oráculos como Chainlink?", options: ["Para minar más rápido", "Porque la blockchain no puede acceder por sí sola a datos externos como precios", "Para cifrar transacciones", "Para crear NFTs"], a: 1, exp: "Los contratos están aislados del exterior; el oráculo les provee datos off-chain (precios, tasas) de forma confiable." },
          { q: "En un AMM, ¿de dónde sale el precio de un token?", options: ["De un banco central", "De la proporción entre los tokens del pool de liquidez (fórmula x·y=k)", "De Chainlink siempre", "De un libro de órdenes"], a: 1, exp: "El AMM fija el precio según el ratio de reservas del pool; cada trade altera esa proporción y mueve el precio." }
        ],
        cards: [
          { front: "¿Qué es un AMM?", back: "Automated Market Maker: un exchange sin libro de órdenes que usa pools de liquidez y una fórmula matemática para fijar precios." },
          { front: "¿Tipos de stablecoin?", back: "Colateralizada en fiat (USDC), sobre-colateralizada en cripto (DAI) y algorítmica (riesgosa, como el fallido UST)." }
        ]
      },
      {
        title: "Conectar con la cadena: Ethers.js y Web3.py",
        body: "Para que tu app hable con la blockchain necesitas una librería y un nodo (un proveedor RPC como Infura o Alchemy). Ethers.js (JavaScript) y Web3.py (Python) te dejan leer estado (gratis, no cambia la cadena) y enviar transacciones firmadas (cuestan gas y deben minarse). El flujo típico: conectas un proveedor, cargas el contrato con su dirección y ABI (su interfaz), y llamas funciones. Leer es instantáneo; escribir requiere firmar con una llave privada y esperar confirmación.",
        points: [
          "Necesitas una librería + un <b>nodo RPC</b> (Infura, Alchemy).",
          "<b>Ethers.js</b> (JS) y <b>Web3.py</b> (Python) son las clásicas.",
          "Leer estado es gratis; <b>enviar tx</b> cuesta gas y se debe firmar.",
          "Cargas el contrato con su <b>dirección</b> y su <b>ABI</b>."
        ],
        code: {
          lang: "python", fn: "leer_saldo.py",
          src: `from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://eth.rpc-ejemplo"))
contrato = w3.eth.contract(address=DIRECCION, abi=ABI)

# leer estado: gratis, no modifica la cadena
saldo = contrato.functions.verSaldo(MI_DIRECCION).call()
print(saldo)

# escribir: construir, firmar y enviar (cuesta gas)
# tx = contrato.functions.depositar().build_transaction({...})
# firmada = w3.eth.account.sign_transaction(tx, LLAVE_PRIVADA)
# w3.eth.send_raw_transaction(firmada.rawTransaction)`
        },
        practice: {
          task: "Con Web3.py, lee el <b>balance en ETH</b> de una dirección (la red entrega wei: conviértelo).",
          hint: "<code>w3.eth.get_balance(addr)</code> regresa wei; usa <code>w3.from_wei(wei, 'ether')</code>.",
          solution: { lang: "python", fn: "web3_reto.py", src: `from web3 import Web3
w3 = Web3(Web3.HTTPProvider("https://eth.rpc-ejemplo"))

def saldo_eth(addr):
    wei = w3.eth.get_balance(addr)
    return w3.from_wei(wei, "ether")` }
        },
        quiz: [
          { q: "Para cargar un contrato y llamar sus funciones necesitas su dirección y...", options: ["Su código fuente completo", "Su ABI (la descripción de su interfaz)", "Su llave privada", "Su archivo .proto"], a: 1, exp: "El ABI describe las funciones y tipos del contrato; con dirección + ABI, la librería sabe cómo codificar las llamadas." }
        ],
        cards: [
          { front: "¿Leer vs escribir en la cadena?", back: "Leer (call) es gratis e instantáneo. Escribir (transacción) cuesta gas, requiere firma con llave privada y esperar confirmación." },
          { front: "¿Qué es un proveedor RPC?", back: "Un nodo (Infura, Alchemy) a través del cual tu app envía consultas y transacciones a la blockchain." }
        ]
      },
      {
        title: "CBDC: monedas digitales de banco central",
        body: "Una CBDC es dinero digital emitido directamente por el banco central: a diferencia de una stablecoin privada, es pasivo del propio banco central, tan seguro como el efectivo. Hay dos modelos: minorista (para el público, como el e-CNY chino o el futuro euro digital) y mayorista (solo entre bancos, para liquidación). Las decisiones de diseño son enormes: ¿cuánta privacidad?, ¿offline?, ¿con o sin intermediarios bancarios? México explora el tema; es un campo donde tu perfil técnico-financiero es muy valioso.",
        points: [
          "Dinero digital emitido por el <b>banco central</b> (no un privado).",
          "Es <b>pasivo del banco central</b>: tan seguro como el efectivo.",
          "<b>Minorista</b> (público) vs <b>mayorista</b> (solo entre bancos).",
          "Diseño clave: privacidad, soporte offline e intermediación."
        ],
        quiz: [
          { q: "¿Qué distingue a una CBDC de una stablecoin privada?", options: ["Nada", "La CBDC la emite el banco central y es su pasivo directo", "La CBDC siempre es anónima", "La stablecoin es más segura"], a: 1, exp: "Una CBDC es dinero soberano emitido por la autoridad monetaria; una stablecoin privada depende del respaldo de su emisor." }
        ],
        cards: [
          { front: "¿CBDC minorista vs mayorista?", back: "Minorista: para uso del público general. Mayorista: restringida a bancos e instituciones para liquidación interbancaria." }
        ]
      },
      {
        title: "RWA: tokenización de activos reales y rampas fiat",
        body: "La tokenización de RWA (Real World Assets) representa activos del mundo real —bonos, inmuebles, facturas, oro— como tokens en la blockchain. Beneficios: fraccionamiento (comprar 1% de un edificio), liquidez 24/7 y liquidación casi instantánea. El reto es el puente legal: el token debe tener respaldo y custodia verificables off-chain. Para entrar y salir del ecosistema están las rampas: on-ramp convierte fiat→cripto (depositas pesos, recibes tokens) y off-ramp hace lo inverso; aquí es donde se concentran el KYC/AML y la regulación.",
        points: [
          "<b>RWA</b>: bonos, inmuebles o facturas representados como tokens.",
          "Permite <b>fraccionar</b>, liquidez 24/7 y liquidación rápida.",
          "El reto es el respaldo legal y la <b>custodia</b> off-chain.",
          "<b>On-ramp</b> fiat→cripto y <b>off-ramp</b> cripto→fiat (foco de KYC/AML)."
        ],
        quiz: [
          { q: "¿Qué hace un 'on-ramp' fiat-cripto?", options: ["Convierte cripto en cripto", "Convierte dinero fiat (ej. pesos) en cripto para entrar al ecosistema", "Tokeniza inmuebles", "Mina bloques"], a: 1, exp: "El on-ramp es la puerta de entrada: depositas moneda tradicional y recibes cripto; el off-ramp hace el camino inverso." },
          { q: "¿Cuál es el principal reto de tokenizar un activo real (RWA)?", options: ["El precio del gas", "Garantizar el respaldo y la custodia legal del activo fuera de la cadena", "La velocidad de la red", "El color del token"], a: 1, exp: "El token solo vale si su activo subyacente está realmente respaldado y custodiado, lo que exige un puente legal sólido." }
        ],
        cards: [
          { front: "¿Qué es la tokenización de RWA?", back: "Representar activos del mundo real (inmuebles, bonos, facturas) como tokens en cadena, permitiendo fraccionarlos y darles liquidez." },
          { front: "¿Por qué importan las rampas (on/off-ramp) en cumplimiento?", back: "Son el punto de contacto entre el dinero fiat y la cripto, donde se concentran las obligaciones de KYC y AML." }
        ]
      }
    ]
  },
  {
    id: "f5", icon: ShieldCheck, ac: "#ff5151",
    title: "Cumplimiento y AML",
    months: "Meses 15–18",
    tagline: "Lo que separa una fintech seria de una multa: PCI, AML, fraude y privacidad.",
    project: "Motor de detección de fraude y reporte AML",
    certs: ["CAMS", "PCIP", "CISSP (largo plazo)"],
    lessons: [
      {
        title: "PCI-DSS: los 12 requerimientos",
        body: "Si tu sistema toca datos de tarjeta, PCI-DSS es obligatorio. Son 12 requerimientos agrupados en 6 objetivos: construir y mantener redes seguras (firewalls, sin contraseñas por defecto), proteger los datos del titular (cifrado en reposo y en tránsito), gestionar vulnerabilidades (antivirus, software actualizado), control de acceso fuerte (need-to-know, IDs únicos, acceso físico), monitorear y testear redes (logs, pruebas) y mantener una política de seguridad. La mejor estrategia es reducir el alcance: si no almacenas el PAN, gran parte del estándar deja de aplicarte.",
        points: [
          "Obligatorio si <b>almacenas, procesas o transmites</b> datos de tarjeta.",
          "12 requerimientos en <b>6 objetivos</b> (redes, datos, acceso, monitoreo...).",
          "Cifrado del titular en <b>reposo y tránsito</b>, acceso <b>need-to-know</b>.",
          "Estrategia clave: <b>reducir el alcance</b> (scope) para simplificar."
        ],
        quiz: [
          { q: "¿Cuándo aplica PCI-DSS a tu sistema?", options: ["Solo si eres un banco", "Si almacenas, procesas o transmites datos de tarjetas de pago", "Solo en Europa", "Nunca a una fintech"], a: 1, exp: "Cualquier entidad que maneje datos del titular de la tarjeta cae bajo PCI-DSS, sin importar su tamaño." },
          { q: "¿Cuál es la mejor estrategia para simplificar el cumplimiento PCI?", options: ["Guardar más datos", "Reducir el alcance: no almacenar el PAN si no es imprescindible", "Apagar los logs", "Usar contraseñas por defecto"], a: 1, exp: "Si tokenizas o tercerizas el manejo del PAN, reduces el scope y muchos requerimientos dejan de aplicarte." }
        ],
        cards: [
          { front: "¿Qué es PCI-DSS?", back: "El estándar de seguridad de datos para la industria de tarjetas de pago: 12 requerimientos obligatorios para quien maneja datos de tarjeta." },
          { front: "¿Qué es 'reducir el scope' en PCI?", back: "Minimizar los sistemas que tocan datos de tarjeta (ej. no guardar el PAN) para que menos componentes queden bajo auditoría." }
        ]
      },
      {
        title: "Segmentación de red para sistemas de pago",
        body: "La segmentación divide la red en zonas aisladas para que un atacante que entra a una no llegue a todas. El entorno de datos de tarjeta (CDE) se aísla del resto con firewalls y VLANs: así el sistema de marketing no puede tocar el de pagos. Beneficios: limita el alcance de PCI-DSS (lo no segmentado entra en auditoría), contiene el radio de explosión de una brecha y aplica el principio de mínimo privilegio entre zonas. Es defensa en profundidad: varias capas, no un solo muro.",
        points: [
          "Divide la red en <b>zonas aisladas</b> con firewalls y VLANs.",
          "Aísla el <b>CDE</b> (entorno de datos de tarjeta) del resto.",
          "Contiene el <b>radio de explosión</b> de una brecha.",
          "Reduce el alcance de PCI y aplica <b>mínimo privilegio</b>."
        ],
        quiz: [
          { q: "¿Para qué sirve segmentar la red en un sistema de pagos?", options: ["Para ir más rápido", "Para aislar el entorno de datos de tarjeta y contener el daño de una brecha", "Para ahorrar electricidad", "Para evitar logs"], a: 1, exp: "Aislar el CDE limita por dónde puede moverse un atacante y reduce qué sistemas quedan bajo PCI." }
        ],
        cards: [
          { front: "¿Qué es el 'radio de explosión' (blast radius)?", back: "El alcance del daño que puede causar una brecha. La segmentación lo reduce conteniendo al atacante en una sola zona." }
        ]
      },
      {
        title: "Tokenización vs cifrado de datos de tarjeta",
        body: "Dos formas de proteger un PAN, distintas en esencia. El cifrado transforma el número con una llave: es reversible, así que si roban la llave, recuperan el dato (matemáticamente reversible). La tokenización reemplaza el PAN por un token aleatorio sin relación matemática con el original; el mapeo vive en una bóveda segura aparte. Si roban tu base con tokens, no hay nada que descifrar: los tokens son inútiles fuera del sistema. Por eso la tokenización es la favorita para sacar el PAN de tus sistemas y achicar el scope PCI.",
        points: [
          "<b>Cifrado</b>: reversible con la llave; si roban la llave, exponen el dato.",
          "<b>Tokenización</b>: token aleatorio <b>sin relación matemática</b> con el PAN.",
          "El mapeo token↔PAN vive en una <b>bóveda</b> separada y protegida.",
          "Tokens robados son <b>inútiles</b> fuera del sistema: ideal para PCI."
        ],
        quiz: [
          { q: "¿Diferencia esencial entre tokenizar y cifrar un PAN?", options: ["Son lo mismo", "El cifrado es reversible con la llave; el token es un valor aleatorio sin relación matemática con el original", "La tokenización es más lenta siempre", "El cifrado no usa llaves"], a: 1, exp: "Un dato cifrado se recupera con la llave; un token no se puede 'descifrar' porque no deriva del PAN, solo se mapea en una bóveda." }
        ],
        cards: [
          { front: "¿Por qué la tokenización reduce mejor el riesgo que el cifrado?", back: "Porque si roban la base de tokens no hay llave que comprometer: los tokens no tienen relación matemática con el PAN real." }
        ]
      },
      {
        title: "Logs de auditoría inmutables",
        body: "En finanzas debes poder demostrar qué pasó y que el registro no fue alterado. Un log de auditoría inmutable encadena los registros: cada entrada incluye el hash de la anterior, formando una cadena (igual que una blockchain). Si alguien modifica o borra un registro intermedio, todos los hashes posteriores dejan de cuadrar y el fraude queda en evidencia. Se complementa con almacenamiento WORM (Write Once Read Many) y control de acceso estricto. Esto soporta auditorías, investigaciones AML y disputas.",
        points: [
          "Cada entrada guarda el <b>hash de la anterior</b>: forma una cadena.",
          "Alterar un registro <b>rompe</b> todos los hashes siguientes.",
          "Se refuerza con almacenamiento <b>WORM</b> (escribir una vez).",
          "Sostiene auditorías, investigaciones AML y <b>disputas</b>."
        ],
        code: {
          lang: "python", fn: "audit_log.py",
          src: `import hashlib, json

def agregar(cadena, evento):
    prev = cadena[-1]["hash"] if cadena else "0" * 64
    cuerpo = json.dumps(evento, sort_keys=True) + prev
    h = hashlib.sha256(cuerpo.encode()).hexdigest()
    cadena.append({"evento": evento, "prev": prev, "hash": h})
    return cadena

def integro(cadena):
    prev = "0" * 64
    for reg in cadena:
        cuerpo = json.dumps(reg["evento"], sort_keys=True) + prev
        if hashlib.sha256(cuerpo.encode()).hexdigest() != reg["hash"]:
            return False          # alguien manipulo el log
        prev = reg["hash"]
    return True`
        },
        practice: {
          task: "Escribe <code>fue_manipulado(cadena)</code> que detecte si alguien alteró un registro del log encadenado por hashes.",
          hint: "Recorre la cadena recomputando cada hash con el evento + el hash previo; si uno no cuadra, fue manipulado.",
          solution: { lang: "python", fn: "audit_reto.py", src: `import hashlib, json

def fue_manipulado(cadena):
    prev = "0" * 64
    for reg in cadena:
        cuerpo = json.dumps(reg["evento"], sort_keys=True) + prev
        h = hashlib.sha256(cuerpo.encode()).hexdigest()
        if h != reg["hash"]:
            return True       # cadena rota -> alguien edito
        prev = reg["hash"]
    return False` }
        },
        quiz: [
          { q: "¿Cómo detecta manipulación un log encadenado por hashes?", options: ["Cifra todo", "Cada registro incluye el hash del anterior; alterar uno rompe la cadena de hashes posteriores", "Borra los registros viejos", "Usa contraseñas"], a: 1, exp: "Como cada hash depende del registro previo, modificar cualquier entrada invalida todas las que le siguen." }
        ],
        cards: [
          { front: "¿Qué es almacenamiento WORM?", back: "Write Once Read Many: se escribe una sola vez y ya no se puede modificar ni borrar, ideal para logs de auditoría." }
        ]
      },
      {
        title: "Tipologías AML: structuring, smurfing y layering",
        body: "El lavado de dinero suele tener tres fases: colocación (meter el efectivo ilícito al sistema), estratificación o layering (moverlo en muchas transacciones para romper el rastro) e integración (reintroducirlo como dinero 'limpio'). Tipologías concretas: structuring es fragmentar montos para quedar bajo el umbral de reporte (ej. depositar $9,900 varias veces para evitar el reporte de $10,000); smurfing es lo mismo repartido entre muchas personas ('pitufos'). Reconocer estos patrones es el corazón del monitoreo AML.",
        points: [
          "Tres fases: <b>colocación</b> → <b>layering</b> → <b>integración</b>.",
          "<b>Structuring</b>: fraccionar montos para quedar bajo el umbral de reporte.",
          "<b>Smurfing</b>: lo mismo repartido entre muchas personas ('pitufos').",
          "<b>Layering</b>: muchísimos movimientos para ocultar el origen."
        ],
        quiz: [
          { q: "¿Qué es 'structuring' en lavado de dinero?", options: ["Invertir en bolsa", "Fraccionar transacciones para mantenerse bajo el umbral de reporte obligatorio", "Pagar impuestos", "Cifrar cuentas"], a: 1, exp: "Es dividir un monto grande en varios pequeños para evitar disparar los reportes automáticos por umbral." },
          { q: "¿Cuál es el orden de las fases del lavado?", options: ["Integración, layering, colocación", "Colocación, layering (estratificación), integración", "Layering, colocación, integración", "Solo hay una fase"], a: 1, exp: "Primero se coloca el efectivo, luego se mueve en capas para perder el rastro, y al final se integra como dinero limpio." }
        ],
        cards: [
          { front: "¿Structuring vs smurfing?", back: "Structuring fracciona montos bajo el umbral; smurfing hace lo mismo pero repartiendo las operaciones entre muchas personas." },
          { front: "¿Qué es el layering?", back: "La fase de estratificación: mover el dinero en numerosas transacciones para ocultar su origen ilícito." }
        ]
      },
      {
        title: "Transaction monitoring: reglas y ML",
        body: "El monitoreo de transacciones busca actividad sospechosa de forma continua. El enfoque por reglas codifica patrones conocidos (ej. 'más de X operaciones bajo el umbral en 24h', 'transferencia a país de alto riesgo'): es explicable y fácil de auditar, pero genera muchos falsos positivos y no atrapa lo nuevo. El enfoque con ML aprende patrones anómalos y se adapta, atrapando esquemas que ninguna regla previó, pero exige explicabilidad para los reguladores. Lo profesional es híbrido: reglas para lo conocido, ML para lo emergente, y un equipo que investiga las alertas.",
        points: [
          "<b>Reglas</b>: explicables y auditables, pero con muchos falsos positivos.",
          "<b>ML</b>: detecta anomalías nuevas, pero necesita explicabilidad.",
          "Lo profesional es <b>híbrido</b>: reglas + ML + analistas.",
          "Toda alerta relevante debe poder <b>justificarse</b> al regulador."
        ],
        code: {
          lang: "python", fn: "monitoreo.py",
          src: `from datetime import timedelta

UMBRAL = 10000_00  # $10,000 en centavos

def alerta_structuring(tx_recientes, ahora):
    ventana = [t for t in tx_recientes
               if ahora - t["fecha"] <= timedelta(hours=24)]
    bajo_umbral = [t for t in ventana if t["centavos"] < UMBRAL]
    total = sum(t["centavos"] for t in bajo_umbral)
    # muchas operaciones pequenas que suman mucho => sospechoso
    if len(bajo_umbral) >= 5 and total >= UMBRAL:
        return "Posible structuring: revisar"
    return None`
        },
        practice: {
          task: "Escribe una regla AML que marque a un cliente si <b>recibe de 4+ personas distintas</b> y luego saca casi todo en 24h (patrón de smurfing).",
          hint: "Cuenta remitentes únicos de entradas y compara la salida total contra lo recibido en la ventana.",
          solution: { lang: "python", fn: "monitoreo_reto.py", src: `def alerta_smurfing(entradas, salidas):
    remitentes = {e["de"] for e in entradas}
    recibido = sum(e["centavos"] for e in entradas)
    sacado = sum(s["centavos"] for s in salidas)
    if len(remitentes) >= 4 and sacado >= recibido * 0.9:
        return "Posible smurfing: revisar"
    return None` }
        },
        quiz: [
          { q: "¿Ventaja del enfoque por reglas frente al de ML en AML?", options: ["Atrapa todo lo nuevo", "Es explicable y fácil de auditar ante un regulador", "No genera falsos positivos", "No necesita datos"], a: 1, exp: "Las reglas son transparentes: se sabe exactamente por qué saltó una alerta, algo clave para auditorías." },
          { q: "¿Por qué se usa un enfoque híbrido (reglas + ML)?", options: ["Por moda", "Las reglas cubren patrones conocidos y el ML detecta esquemas nuevos y anómalos", "Para gastar más", "Para eliminar a los analistas"], a: 1, exp: "Combinar ambos cubre tanto lo conocido y auditable como lo emergente que ninguna regla anticipó." }
        ],
        cards: [
          { front: "¿Reglas vs ML en transaction monitoring?", back: "Reglas: explicables, pero muchos falsos positivos. ML: detecta lo nuevo, pero requiere explicabilidad. Lo mejor es combinarlos." }
        ]
      },
      {
        title: "Listas de sanciones: OFAC, ONU y PEPs",
        body: "Antes de operar con un cliente debes cribarlo (screening) contra listas: OFAC (sanciones de EE.UU.), las listas de la ONU y la UE prohíben hacer negocios con ciertas personas y entidades. Los PEP (Personas Expuestas Políticamente) no están prohibidos, pero por su cargo implican mayor riesgo de corrupción y exigen due diligence reforzada. El reto técnico es el fuzzy matching: los nombres llegan con variaciones, alfabetos y errores, así que el screening usa coincidencia aproximada, lo que obliga a gestionar falsos positivos.",
        points: [
          "<b>Screening</b> del cliente contra OFAC, ONU y UE antes de operar.",
          "Estar en una lista de sanciones <b>prohíbe</b> hacer negocios.",
          "<b>PEP</b>: no prohibido, pero exige <b>due diligence reforzada</b>.",
          "Reto técnico: <b>fuzzy matching</b> de nombres y sus variaciones."
        ],
        quiz: [
          { q: "¿Qué es un PEP en cumplimiento?", options: ["Un tipo de tarjeta", "Una Persona Expuesta Políticamente, que implica mayor riesgo y due diligence reforzada", "Una lista de sanciones", "Un protocolo de red"], a: 1, exp: "Por su posición de poder, un PEP conlleva mayor riesgo de corrupción; operar con él no se prohíbe pero exige controles extra." },
          { q: "¿Por qué el screening de nombres usa fuzzy matching?", options: ["Para ir más lento", "Porque los nombres llegan con variaciones, errores y distintos alfabetos", "Para cifrarlos", "Porque las listas no tienen nombres"], a: 1, exp: "Una coincidencia exacta dejaría pasar variantes; el matching aproximado las detecta, a costa de generar falsos positivos." }
        ],
        cards: [
          { front: "¿Qué es OFAC?", back: "La oficina de control de activos extranjeros de EE.UU., que publica listas de sanciones; operar con sus listados está prohibido." },
          { front: "¿Por qué los PEP requieren más controles?", back: "Su exposición política eleva el riesgo de corrupción y lavado, así que exigen due diligence reforzada y monitoreo continuo." }
        ]
      },
      {
        title: "STR/SAR: reportes de operaciones sospechosas",
        body: "Cuando el monitoreo detecta algo que no cuadra, la institución presenta un reporte de operación sospechosa (STR, o SAR en EE.UU.) ante la autoridad financiera (en México, la UIF vía la CNBV). Dos reglas críticas: el deber de reportar es obligatorio cuando hay sospecha razonable, y rige el 'tipping off': está prohibido avisarle al cliente que fue reportado. Técnicamente, tu sistema debe capturar la evidencia, generar el reporte en el formato regulatorio y mantener trazabilidad completa de cada decisión.",
        points: [
          "<b>STR/SAR</b>: reporte a la autoridad (en México, la <b>UIF</b>).",
          "Reportar es <b>obligatorio</b> ante sospecha razonable.",
          "<b>Tipping off</b>: prohibido avisarle al cliente que fue reportado.",
          "El sistema debe capturar <b>evidencia</b> y trazabilidad de la decisión."
        ],
        quiz: [
          { q: "¿Qué prohíbe la regla de 'tipping off'?", options: ["Reportar a la autoridad", "Avisarle al cliente que ha sido objeto de un reporte de sospecha", "Guardar logs", "Cobrar comisiones"], a: 1, exp: "Alertar al cliente podría arruinar la investigación; por eso el aviso (tipping off) está expresamente prohibido." }
        ],
        cards: [
          { front: "¿Qué es un STR/SAR?", back: "Un reporte de operación sospechosa que la institución presenta a la autoridad financiera cuando detecta posible lavado o fraude." },
          { front: "¿Quién recibe los reportes en México?", back: "La UIF (Unidad de Inteligencia Financiera), normalmente canalizados a través de la CNBV." }
        ]
      },
      {
        title: "Graph analysis para redes de lavado",
        body: "El lavado rara vez es una sola cuenta: es una red de cuentas, empresas fantasma y personas moviendo dinero en círculos. El análisis de grafos modela cuentas como nodos y transacciones como aristas, revelando patrones invisibles en tablas: ciclos (el dinero vuelve al origen), cuentas 'puente' que conectan grupos, o estructuras estrella (muchos pitufos hacia un centro). Bases de datos de grafos (Neo4j) y algoritmos como detección de comunidades y centralidad destapan estas redes que una consulta SQL plana jamás vería.",
        points: [
          "Modela cuentas como <b>nodos</b> y transacciones como <b>aristas</b>.",
          "Revela <b>ciclos</b> (el dinero regresa) y cuentas <b>puente</b>.",
          "Detecta estructuras <b>estrella</b> típicas del smurfing.",
          "Usa grafos (<b>Neo4j</b>) y algoritmos de comunidad y centralidad."
        ],
        quiz: [
          { q: "¿Qué ventaja da el análisis de grafos contra el lavado?", options: ["Cifra las cuentas", "Revela relaciones y patrones de red (ciclos, puentes) invisibles en tablas planas", "Acelera los pagos", "Elimina los reportes"], a: 1, exp: "Modelar el dinero como una red expone estructuras de lavado (ciclos, intermediarios) que una consulta tabular no detecta." }
        ],
        cards: [
          { front: "¿Qué es una cuenta 'puente' en análisis de grafos?", back: "Un nodo que conecta grupos que de otro modo estarían separados; suele ser clave en una red de lavado." }
        ]
      },
      {
        title: "mTLS entre microservicios",
        body: "TLS normal autentica solo al servidor (como tu navegador verifica al banco). El TLS mutuo (mTLS) hace que AMBAS partes presenten certificado: el cliente también prueba quién es. En una arquitectura de microservicios financieros esto implementa zero-trust: ningún servicio confía en otro solo por estar en la misma red; cada llamada interna se autentica y cifra mutuamente. Service meshes como Istio o Linkerd lo automatizan, rotando certificados sin que cambies tu código. Así, aunque un atacante entre a la red, no puede suplantar a un servicio.",
        points: [
          "<b>mTLS</b>: ambas partes presentan certificado, no solo el servidor.",
          "Implementa <b>zero-trust</b>: ningún servicio confía por estar en la red.",
          "Cada llamada interna queda <b>autenticada y cifrada</b>.",
          "Un <b>service mesh</b> (Istio, Linkerd) lo automatiza y rota certificados."
        ],
        quiz: [
          { q: "¿Qué añade mTLS frente a TLS normal?", options: ["Más velocidad", "Que el cliente también se autentica con certificado, no solo el servidor", "Compresión de datos", "Menos seguridad"], a: 1, exp: "En mTLS ambas partes verifican su identidad con certificados, base del modelo zero-trust entre servicios." }
        ],
        cards: [
          { front: "¿Qué es zero-trust entre microservicios?", back: "El principio de no confiar en ningún servicio solo por su ubicación de red: cada llamada se autentica (p. ej. con mTLS)." }
        ]
      },
      {
        title: "Fraud detection: velocidad, geo y device fingerprinting",
        body: "El fraude se detecta en tiempo real combinando señales. Velocity checks: demasiadas operaciones o montos en poco tiempo. Geo/imposible viaje: un login en México y otro en Asia con minutos de diferencia es físicamente imposible. Device fingerprinting: identifica el dispositivo por su huella (navegador, resolución, fuentes) para detectar uno nuevo o usado en muchas cuentas. Cada señal suma a un score de riesgo; si supera un umbral, bloqueas, pides 3DS2 o mandas a revisión manual. Equilibrio clave: frenar el fraude sin frustrar al cliente legítimo (fricción).",
        points: [
          "<b>Velocity</b>: muchas operaciones/montos en poco tiempo.",
          "<b>Viaje imposible</b>: ubicaciones incompatibles en minutos.",
          "<b>Device fingerprinting</b>: huella del dispositivo para detectar anomalías.",
          "Las señales suman a un <b>score de riesgo</b> que dispara la acción."
        ],
        code: {
          lang: "python", fn: "fraude.py",
          src: `def score_riesgo(tx, perfil):
    score = 0
    # velocidad: muchas tx en la ultima hora
    if perfil["tx_ultima_hora"] > 10:
        score += 40
    # viaje imposible
    if perfil["km_desde_ultimo_login"] > 3000 \\
       and perfil["minutos_desde_ultimo"] < 60:
        score += 50
    # dispositivo nuevo
    if tx["device_id"] not in perfil["dispositivos"]:
        score += 20
    return score   # > 70 => bloquear o pedir 3DS2`
        },
        practice: {
          task: "Agrega al score de riesgo una señal: <b>+30</b> si la transacción es a un país de una lista de alto riesgo.",
          hint: "Mantén un set <code>PAISES_RIESGO</code> y suma 30 si <code>tx['pais'] in PAISES_RIESGO</code>.",
          solution: { lang: "python", fn: "fraude_reto.py", src: `PAISES_RIESGO = {"XX", "YY"}

def señal_pais(tx, score):
    if tx["pais"] in PAISES_RIESGO:
        score += 30
    return score` }
        },
        quiz: [
          { q: "¿Qué detecta una regla de 'viaje imposible'?", options: ["Un pago grande", "Accesos desde ubicaciones físicamente incompatibles en muy poco tiempo", "Un dispositivo viejo", "Una tarjeta vencida"], a: 1, exp: "Si el tiempo entre dos logins es menor al que tomaría viajar esa distancia, una de las sesiones es sospechosa." },
          { q: "¿Cuál es el equilibrio clave en fraud detection?", options: ["Bloquear a todos", "Frenar el fraude sin añadir demasiada fricción al cliente legítimo", "Eliminar el cifrado", "Aprobar todo"], a: 1, exp: "Demasiados bloqueos espantan clientes buenos; muy pocos dejan pasar fraude. El score busca ese balance." }
        ],
        cards: [
          { front: "¿Qué es device fingerprinting?", back: "Identificar un dispositivo por su huella (navegador, resolución, fuentes, etc.) para detectar equipos nuevos o reutilizados en fraude." },
          { front: "¿Qué es un velocity check?", back: "Una regla que marca como sospechosas demasiadas transacciones o montos acumulados en una ventana de tiempo corta." }
        ]
      },
      {
        title: "Threat modeling con STRIDE",
        body: "El threat modeling busca las amenazas de un sistema en la fase de diseño, antes de programar. STRIDE es un acrónimo que te recuerda seis categorías a revisar: Spoofing (suplantar identidad), Tampering (alterar datos), Repudiation (negar haber hecho algo), Information disclosure (fuga de datos), Denial of service (tirar el servicio) y Elevation of privilege (ganar permisos que no te tocan). Para cada componente y flujo de datos te preguntas qué STRIDE aplica y qué control lo mitiga. En finanzas, modelar amenazas temprano evita rediseños y brechas caras.",
        points: [
          "Busca amenazas en el <b>diseño</b>, antes de codificar.",
          "<b>S</b>poofing, <b>T</b>ampering, <b>R</b>epudiation...",
          "...<b>I</b>nfo disclosure, <b>D</b>enial of service, <b>E</b>levation of privilege.",
          "Por cada flujo: ¿qué amenaza aplica y qué control la mitiga?"
        ],
        quiz: [
          { q: "En STRIDE, ¿qué representa la 'E'?", options: ["Encryption", "Elevation of privilege: obtener permisos que no corresponden", "Endpoint", "Error handling"], a: 1, exp: "La E es Elevation of Privilege: un atacante gana accesos superiores a los que debería tener." },
          { q: "¿Cuándo se hace idealmente el threat modeling?", options: ["Tras el lanzamiento", "En la fase de diseño, antes de programar", "Solo si hay una brecha", "Nunca"], a: 1, exp: "Modelar amenazas temprano permite incorporar controles desde el diseño y evitar rediseños costosos." }
        ],
        cards: [
          { front: "¿Qué significa STRIDE?", back: "Spoofing, Tampering, Repudiation, Information disclosure, Denial of service y Elevation of privilege: seis categorías de amenazas." }
        ]
      },
      {
        title: "Privacidad: GDPR y LFPDPPP en México",
        body: "Manejar datos personales tiene reglas. El GDPR (Europa) es el marco de referencia mundial: exige base legal para tratar datos, consentimiento claro, y reconoce derechos como acceso, rectificación y borrado ('derecho al olvido'); sus multas llegan a millones. En México aplica la LFPDPPP, con principios similares (licitud, consentimiento, finalidad, proporcionalidad) y el aviso de privacidad como pieza central, supervisada por el organismo correspondiente. Para fintech, los principios técnicos clave son minimización de datos (recoge solo lo necesario), propósito limitado y privacy by design.",
        points: [
          "<b>GDPR</b> (Europa): referencia mundial, multas millonarias.",
          "Derechos: acceso, rectificación y <b>borrado</b> ('derecho al olvido').",
          "En México aplica la <b>LFPDPPP</b> y el <b>aviso de privacidad</b>.",
          "Principios técnicos: <b>minimización</b>, propósito limitado, privacy by design."
        ],
        quiz: [
          { q: "¿Qué reconoce el 'derecho al olvido' del GDPR?", options: ["Guardar datos para siempre", "El derecho de una persona a que se borren sus datos personales", "Vender datos libremente", "Ignorar el consentimiento"], a: 1, exp: "El titular puede solicitar la eliminación de sus datos cuando ya no exista base legítima para conservarlos." },
          { q: "¿Qué es la 'minimización de datos'?", options: ["Comprimir archivos", "Recolectar solo los datos estrictamente necesarios para la finalidad", "Borrar todos los logs", "Cifrar el disco"], a: 1, exp: "Recoger lo mínimo indispensable reduce el riesgo y es un principio central de las leyes de privacidad." }
        ],
        cards: [
          { front: "¿Qué ley de privacidad aplica en México?", back: "La LFPDPPP (Ley Federal de Protección de Datos Personales en Posesión de los Particulares), con el aviso de privacidad como pieza clave." },
          { front: "¿Qué es 'privacy by design'?", back: "Incorporar la protección de datos desde el diseño del sistema, no como un añadido posterior." }
        ]
      }
    ]
  }
];

/* ============================================================
   GAMIFICATION
   ============================================================ */
const LEVELS = [
  { min: 0, t: "Becario" },
  { min: 200, t: "Junior Backend" },
  { min: 500, t: "Backend Engineer" },
  { min: 950, t: "FinTech Engineer" },
  { min: 1500, t: "Solutions Architect" },
  { min: 2200, t: "Blockchain Engineer" },
  { min: 3000, t: "Compliance Lead" },
  { min: 4000, t: "FinTech CTO" },
];
const XP_READ = 25;
const XP_QUIZ = 75;
const XP_PRACTICE = 60;

function levelFor(xp) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) idx = i;
  const cur = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const span = next ? next.min - cur.min : 1;
  const into = next ? xp - cur.min : 1;
  return { idx, title: cur.t, next, pct: next ? Math.min(100, (into / span) * 100) : 100, xp };
}

const lid = (p, i) => `${p}-${i}`;
const cid = (p, li, ci) => `${p}-${li}-c${ci}`;

const DEFAULT = { read: {}, quiz: {}, cards: {}, practice: {}, xp: 0, streak: { count: 0, last: null } };

function todayStr() { return new Date().toISOString().slice(0, 10); }

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [progress, setProgress] = useState(DEFAULT);
  const loaded = useRef(false);
  const [view, setView] = useState("overview"); // overview | phase | lesson | review | stats
  const [activePhase, setActivePhase] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  // load
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("finstack:v1");
        if (r && r.value) setProgress({ ...DEFAULT, ...JSON.parse(r.value) });
      } catch (e) { /* in-memory fallback */ }
      loaded.current = true;
    })();
  }, []);
  // save
  useEffect(() => {
    if (!loaded.current) return;
    (async () => { try { await window.storage.set("finstack:v1", JSON.stringify(progress)); } catch (e) {} })();
  }, [progress]);

  const touchStreak = (st) => {
    const t = todayStr();
    if (st.last === t) return st;
    const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const count = st.last === yest ? st.count + 1 : 1;
    return { count, last: t };
  };

  const markRead = (id) => setProgress(p => {
    if (p.read[id]) return p;
    return { ...p, read: { ...p.read, [id]: true }, xp: p.xp + XP_READ, streak: touchStreak(p.streak) };
  });
  const markQuiz = (id, pct) => setProgress(p => {
    const already = p.quiz[id] != null;
    return { ...p, quiz: { ...p.quiz, [id]: pct }, xp: p.xp + (already ? 0 : XP_QUIZ), streak: touchStreak(p.streak) };
  });
  const markPractice = (id) => setProgress(p => {
    const done = (p.practice || {});
    if (done[id]) return p;
    return { ...p, practice: { ...done, [id]: true }, xp: p.xp + XP_PRACTICE, streak: touchStreak(p.streak) };
  });
  const setCardBox = (id, box) => setProgress(p => {
    const prev = p.cards[id] || 0;
    const reachedMastery = box >= 4 && prev < 4;
    return { ...p, cards: { ...p.cards, [id]: box }, xp: p.xp + (reachedMastery ? 10 : 0) };
  });

  const lvl = useMemo(() => levelFor(progress.xp), [progress.xp]);

  const phaseProgress = (ph) => {
    const total = ph.lessons.length;
    let done = 0;
    ph.lessons.forEach((_, i) => { if (progress.read[lid(ph.id, i)]) done++; });
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  };

  const allCards = useMemo(() => {
    const arr = [];
    PHASES.forEach(ph => ph.lessons.forEach((l, li) =>
      (l.cards || []).forEach((c, ci) => arr.push({ ...c, id: cid(ph.id, li, ci), phase: ph.id, ac: ph.ac }))));
    return arr;
  }, []);

  const totalLessons = PHASES.reduce((a, p) => a + p.lessons.length, 0);
  const readCount = Object.keys(progress.read).length;
  const quizCount = Object.keys(progress.quiz).length;
  const mastered = Object.values(progress.cards).filter(b => b >= 4).length;
  const practiceCount = Object.keys(progress.practice || {}).length;
  const totalPractices = useMemo(() => PHASES.reduce((n, ph) => n + ph.lessons.filter(l => l.practice).length, 0), []);

  const openPhase = (ph) => { setActivePhase(ph); setView("phase"); window.scrollTo(0, 0); };
  const openLesson = (ph, li) => { setActivePhase(ph); setActiveLesson(li); setView("lesson"); window.scrollTo(0, 0); };

  // find a sensible "continue" target
  const continueTarget = useMemo(() => {
    for (const ph of PHASES) {
      for (let i = 0; i < ph.lessons.length; i++) {
        if (!progress.read[lid(ph.id, i)]) return { ph, i };
      }
    }
    return { ph: PHASES[0], i: 0 };
  }, [progress.read]);

  return (
    <div className="fs-root">
      <style>{CSS}</style>

      {/* ticker */}
      <div className="fs-ticker">
        <div className="fs-ticker-track">
          {[...Array(2)].map((_, k) => (
            <React.Fragment key={k}>
              <span className="fs-tk">PYTHON <b>▲ async</b></span>
              <span className="fs-tk">POSTGRES <b>ACID ▲</b></span>
              <span className="fs-tk dn">LEGACY <b>COBOL ▼</b></span>
              <span className="fs-tk">ISO-8583 <b>▲ swipe</b></span>
              <span className="fs-tk">SPEI <b>T+0 ▲</b></span>
              <span className="fs-tk">KAFKA <b>▲ events</b></span>
              <span className="fs-tk">SOLIDITY <b>▲ 0.8.x</b></span>
              <span className="fs-tk dn">REENTRANCY <b>▼ guard</b></span>
              <span className="fs-tk">AML <b>STR/SAR ▲</b></span>
              <span className="fs-tk">PCI-DSS <b>v4 ▲</b></span>
              <span className="fs-tk">K8S <b>▲ pods</b></span>
              <span className="fs-tk">JWT <b>HS256 ▲</b></span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="fs-wrap">
        {/* topbar */}
        <div className="fs-top">
          <div className="fs-logo" onClick={() => setView("overview")}>
            <div className="fs-logo-mk"><TrendingUp size={20} /></div>
            <div>
              <h1>FIN<span>STACK</span></h1>
              <small>:// dev → fintech architect</small>
            </div>
          </div>
          <div className="fs-stats">
            <div className={`fs-chip flame ${progress.streak.count ? "" : "cold"}`}>
              <Flame size={15} /><span className="v">{progress.streak.count}</span> días
            </div>
            <div className="fs-chip"><Zap size={15} color="#ffb020" /><span className="v">{progress.xp}</span> XP</div>
            <div className="fs-level">
              <div className="row">
                <span className="ttl">◆ {lvl.title}</span>
                <span className="xp">{lvl.next ? `${progress.xp}/${lvl.next.min}` : "MAX"}</span>
              </div>
              <div className="fs-bar"><i style={{ width: `${lvl.pct}%` }} /></div>
            </div>
          </div>
        </div>

        {/* nav */}
        <div className="fs-nav">
          <button className={view === "overview" || view === "phase" || view === "lesson" ? "on" : ""} onClick={() => setView("overview")}>
            <Layers size={14} /> ROADMAP
          </button>
          <button className={view === "review" ? "on" : ""} onClick={() => { setView("review"); window.scrollTo(0, 0); }}>
            <Brain size={14} /> REPASO ({allCards.length})
          </button>
          <button className={view === "stats" ? "on" : ""} onClick={() => { setView("stats"); window.scrollTo(0, 0); }}>
            <Activity size={14} /> PROGRESO
          </button>
        </div>

        {/* ===== OVERVIEW ===== */}
        {view === "overview" && (
          <>
            <div className="fs-hero">
              <span className="tag">◆ Ruta de 18 meses · 5 fases · {totalLessons} lecciones</span>
              <h2>De desarrollador full-stack<br />a arquitecto FinTech.</h2>
              <p>Software de Wall Street: pagos, core banking, blockchain y cumplimiento. Lee, practica con código real y fija el conocimiento con repaso espaciado. Tu progreso se guarda solo.</p>
              <button className="fs-cta" onClick={() => openLesson(continueTarget.ph, continueTarget.i)}>
                {readCount === 0 ? "Empezar Fase 1" : "Continuar donde quedaste"} <ChevronRight size={16} />
              </button>
              <div className="meta" style={{ marginTop: 18 }}>
                <span>Leídas <b>{readCount}/{totalLessons}</b></span>
                <span>Retos <b>{practiceCount}/{totalPractices}</b></span>
                <span>Tarjetas dominadas <b>{mastered}/{allCards.length}</b></span>
              </div>
            </div>

            <div className="fs-grid">
              {PHASES.map((ph, idx) => {
                const pp = phaseProgress(ph);
                const Icon = ph.icon;
                return (
                  <div key={ph.id} className="fs-card" style={{ "--ac": ph.ac }} onClick={() => openPhase(ph)}>
                    {pp.pct === 100 && <Trophy size={18} className="done-badge" />}
                    <div className="ph-top">
                      <div className="ph-ic"><Icon size={20} /></div>
                      <div>
                        <div className="ph-no">Fase {idx + 1} · {ph.months}</div>
                        <h3>{ph.title}</h3>
                      </div>
                    </div>
                    <p className="ph-tl">{ph.tagline}</p>
                    <div className="ph-bar"><i style={{ width: `${pp.pct}%` }} /></div>
                    <div className="ph-meta">
                      <span>{pp.done}/{pp.total} lecciones</span>
                      <span>{pp.pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="fs-extras">
              <div className="fs-xcard" style={{ "--ac": "#ffb020" }}>
                <div className="xc-head"><Award size={16} /> Certificados transversales</div>
                <p className="xc-sub">Validan tu perfil en cualquier fase de la ruta.</p>
                <ul className="fs-chips-x">
                  {["AWS Solutions Architect Professional", "Google Professional Cloud Architect", "Certified Fintech Professional (CFtP)", "HashiCorp Vault Associate", "Terraform Associate"].map((c) => (
                    <li key={c}><GraduationCap size={12} /> {c}</li>
                  ))}
                </ul>
              </div>
              <div className="fs-xcard" style={{ "--ac": "#3aa0ff" }}>
                <div className="xc-head"><FileCheck2 size={16} /> Proyectos extra para GitHub</div>
                <p className="xc-sub">Portafolio que demuestra lo aprendido a reclutadores.</p>
                <ul className="fs-chips-x">
                  {["Clon simplificado de SPEI", "Scoring crediticio con ML", "Dashboard de observabilidad con Grafana", "Pasarela que unifica Stripe + Conekta", "Bot de arbitraje DeFi entre DEXs"].map((c) => (
                    <li key={c}><Target size={12} /> {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* ===== PHASE ===== */}
        {view === "phase" && activePhase && (() => {
          const ph = activePhase; const Icon = ph.icon; const idx = PHASES.indexOf(ph);
          return (
            <>
              <button className="fs-back" onClick={() => setView("overview")}><ArrowLeft size={14} /> ROADMAP</button>
              <div className="fs-phead">
                <div className="ic" style={{ "--ac": ph.ac }}><Icon size={24} /></div>
                <div>
                  <div className="sub">Fase {idx + 1} · {ph.months}</div>
                  <h2>{ph.title}</h2>
                </div>
              </div>
              <p style={{ color: "var(--muted)", maxWidth: 620, marginTop: 4 }}>{ph.tagline}</p>

              <div className="fs-lessons">
                {ph.lessons.map((l, i) => {
                  const done = !!progress.read[lid(ph.id, i)];
                  const qs = progress.quiz[lid(ph.id, i)];
                  return (
                    <div key={i} className={`fs-lrow ${done ? "done" : ""}`} style={{ "--ac": ph.ac }} onClick={() => openLesson(ph, i)}>
                      <span className="n">{String(i + 1).padStart(2, "0")}</span>
                      <span className="ck">{done ? <Check size={15} /> : ""}</span>
                      <span className="t">{l.title}</span>
                      {qs != null && <span className={`q ${qs >= 100 ? "passed" : ""}`}>QUIZ {qs}%</span>}
                      <ChevronRight size={16} color="var(--muted2)" />
                    </div>
                  );
                })}
              </div>

              <div className="fs-panel">
                <div className="fs-pan">
                  <div className="lab"><Target size={13} /> PROYECTO DE LA FASE</div>
                  <div className="proj">{ph.project}</div>
                  <p style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>Constrúyelo para tu portafolio de GitHub. Es la prueba real de que dominaste la fase.</p>
                </div>
                <div className="fs-pan">
                  <div className="lab"><FileCheck2 size={13} /> CERTIFICACIONES</div>
                  <div className="certs">
                    {ph.certs.map((c, i) => <div key={i} className="cert"><GraduationCap size={15} /> {c}</div>)}
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {/* ===== LESSON ===== */}
        {view === "lesson" && activePhase && activeLesson != null && (
          <LessonView
            ph={activePhase}
            li={activeLesson}
            progress={progress}
            onRead={markRead}
            onQuiz={markQuiz}
            onPractice={markPractice}
            onBack={() => setView("phase")}
            onNext={() => {
              const ph = activePhase;
              if (activeLesson < ph.lessons.length - 1) openLesson(ph, activeLesson + 1);
              else setView("phase");
            }}
          />
        )}

        {/* ===== REVIEW ===== */}
        {view === "review" && (
          <ReviewView cards={allCards} progress={progress} setCardBox={setCardBox} />
        )}

        {/* ===== STATS ===== */}
        {view === "stats" && (
          <>
            <div className="fs-phead" style={{ marginBottom: 18 }}>
              <div className="ic" style={{ "--ac": "#3aa0ff" }}><Activity size={24} /></div>
              <div><div className="sub">Dashboard</div><h2>Tu progreso</h2></div>
            </div>
            <div className="fs-statgrid">
              <div className="fs-stat green"><div className="k">Nivel</div><div className="v" style={{ fontSize: 22 }}>{lvl.title}</div></div>
              <div className="fs-stat amber"><div className="k">XP total</div><div className="v">{progress.xp}</div></div>
              <div className="fs-stat"><div className="k">Lecciones</div><div className="v">{readCount}<small>/{totalLessons}</small></div></div>
              <div className="fs-stat blue"><div className="k">Quizzes hechos</div><div className="v">{quizCount}</div></div>
              <div className="fs-stat amber"><div className="k">Retos resueltos</div><div className="v">{practiceCount}<small>/{totalPractices}</small></div></div>
              <div className="fs-stat green"><div className="k">Tarjetas dominadas</div><div className="v">{mastered}<small>/{allCards.length}</small></div></div>
              <div className="fs-stat amber"><div className="k">Racha</div><div className="v">{progress.streak.count}<small>días</small></div></div>
            </div>

            <div className="fs-section-lab"><Layers size={14} /> AVANCE POR FASE</div>
            <div className="fs-phase-prog">
              {PHASES.map((ph, idx) => {
                const pp = phaseProgress(ph);
                return (
                  <div key={ph.id} className="fs-pp" style={{ "--ac": ph.ac }}>
                    <div className="nm">{ph.title}<small>Fase {idx + 1} · {ph.months}</small></div>
                    <div className="bar"><i style={{ width: `${pp.pct}%` }} /></div>
                    <div className="pct">{pp.pct}%</div>
                  </div>
                );
              })}
            </div>

            <button className="fs-reset" onClick={() => {
              if (confirm("¿Reiniciar TODO tu progreso? Esto no se puede deshacer.")) setProgress(DEFAULT);
            }}>
              <RotateCcw size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} /> Reiniciar progreso
            </button>
          </>
        )}

        <div className="fs-foot">FINSTACK :// construido para Gael · tu progreso se guarda automáticamente</div>
      </div>
    </div>
  );
}

/* ---------- Code block ---------- */
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText(code.src); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch (e) {}
  };
  return (
    <div className="fs-code">
      <div className="head">
        <div className="dots"><i style={{ background: "#ff5f56" }} /><i style={{ background: "#ffbd2e" }} /><i style={{ background: "#27c93f" }} /></div>
        <span className="fn">{code.fn}</span>
        <button className="cp" onClick={copy}>{copied ? <><CheckCheck size={12} /> copiado</> : <><Copy size={12} /> copiar</>}</button>
      </div>
      <pre dangerouslySetInnerHTML={{ __html: hl(code.src) }} />
    </div>
  );
}

/* ---------- Lesson view ---------- */
function Practice({ practice, done, onDone }) {
  const [showHint, setShowHint] = useState(false);
  const [showSol, setShowSol] = useState(false);
  return (
    <div className="fs-practice">
      <div className="pr-lab">
        <Zap size={14} /> RETO PRÁCTICO
        {done && <span className="pr-done"><CheckCheck size={12} /> resuelto</span>}
      </div>
      <p className="pr-task" dangerouslySetInnerHTML={{ __html: practice.task }} />
      <div className="pr-actions">
        {practice.hint && (
          <button className="fs-btn ghost sm" onClick={() => setShowHint(h => !h)}>
            <Brain size={13} /> {showHint ? "Ocultar pista" : "Ver pista"}
          </button>
        )}
        <button className="fs-btn ghost sm" onClick={() => setShowSol(s => !s)}>
          <Code2 size={13} /> {showSol ? "Ocultar solución" : "Ver solución"}
        </button>
      </div>
      {showHint && practice.hint && <div className="pr-hint" dangerouslySetInnerHTML={{ __html: practice.hint }} />}
      {showSol && <div style={{ marginTop: 12 }}><CodeBlock code={practice.solution} /></div>}
      {!done && (
        <button className="fs-btn green sm" style={{ marginTop: 14 }} onClick={onDone}>
          <Check size={14} /> Marcar reto resuelto (+{XP_PRACTICE} XP)
        </button>
      )}
    </div>
  );
}

function LessonView({ ph, li, progress, onRead, onQuiz, onPractice, onBack, onNext }) {
  const l = ph.lessons[li];
  const id = lid(ph.id, li);
  const Icon = ph.icon;
  const wasRead = !!progress.read[id];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(progress.quiz[id] != null);

  useEffect(() => { setAnswers({}); setSubmitted(progress.quiz[id] != null); }, [id]);

  const quiz = l.quiz || [];
  const allAnswered = quiz.length > 0 && quiz.every((_, qi) => answers[qi] != null);
  const score = submitted && quiz.length
    ? Math.round((quiz.filter((q, qi) => answers[qi] === q.a).length / quiz.length) * 100)
    : null;

  const submit = () => {
    setSubmitted(true);
    const s = Math.round((quiz.filter((q, qi) => answers[qi] === q.a).length / quiz.length) * 100);
    onQuiz(id, s);
    if (!wasRead) onRead(id);
  };

  return (
    <div className="fs-lesson" style={{ "--ac": ph.ac }}>
      <button className="fs-back" onClick={onBack}><ArrowLeft size={14} /> {ph.title}</button>
      <div className="crumb">FASE {PHASES.indexOf(ph) + 1} · LECCIÓN {String(li + 1).padStart(2, "0")} / {String(ph.lessons.length).padStart(2, "0")}</div>
      <h2>{l.title}</h2>

      <div className="fs-body">
        {l.body.split("\n").map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <div className="fs-section-lab"><Target size={14} /> CLAVES PARA RECORDAR</div>
      <ul className="fs-points">
        {l.points.map((pt, i) => (
          <li key={i}><span>▸</span><span dangerouslySetInnerHTML={{ __html: pt }} /></li>
        ))}
      </ul>

      {l.code && (<>
        <div className="fs-section-lab"><Code2 size={14} /> CÓDIGO {`<${l.code.lang}>`}</div>
        <CodeBlock code={l.code} />
      </>)}

      {l.practice && (
        <Practice
          practice={l.practice}
          done={!!(progress.practice && progress.practice[id])}
          onDone={() => onPractice(id)}
        />
      )}

      {!wasRead && (
        <button className="fs-btn ghost" style={{ marginTop: 18 }} onClick={() => onRead(id)}>
          <Check size={15} /> Marcar como leída (+{XP_READ} XP)
        </button>
      )}

      {quiz.length > 0 && (
        <div className="fs-quiz">
          <div className="ql"><BookOpen size={14} /> QUIZ — comprueba tu retención</div>
          {quiz.map((q, qi) => (
            <div className="fs-q" key={qi}>
              <div className="qt">{qi + 1}. {q.q}</div>
              {q.options.map((opt, oi) => {
                let cls = "fs-opt";
                if (!submitted && answers[qi] === oi) cls += " sel";
                if (submitted) {
                  if (oi === q.a) cls += " correct";
                  else if (answers[qi] === oi) cls += " wrong";
                }
                return (
                  <div key={oi} className={cls} onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: oi }))}>
                    <span className="mk">{submitted && oi === q.a ? <Check size={12} /> : submitted && answers[qi] === oi ? <X size={12} /> : String.fromCharCode(65 + oi)}</span>
                    {opt}
                  </div>
                );
              })}
              {submitted && <div className="fs-exp">{answers[qi] === q.a ? "✓ Correcto. " : "✗ "}{q.exp}</div>}
            </div>
          ))}
          <div className="fs-quiz-foot">
            {!submitted ? (
              <button className="fs-btn green" disabled={!allAnswered} onClick={submit}>
                Enviar respuestas
              </button>
            ) : (
              <>
                <span className={`fs-result ${score >= 70 ? "ok" : "no"}`}>
                  {score >= 70 ? "✓" : "○"} {score}% — {score >= 70 ? "¡Bien!" : "Repasa y reintenta"}
                </span>
                <button className="fs-btn ghost" onClick={() => { setAnswers({}); setSubmitted(false); }}>
                  <RotateCcw size={13} /> Reintentar
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="fs-lfoot">
        <button className="fs-btn ghost" onClick={onBack}><ArrowLeft size={14} /> Volver</button>
        <button className="fs-btn green" onClick={onNext}>
          {li < ph.lessons.length - 1 ? "Siguiente lección" : "Terminar fase"} <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ---------- Review (flashcards, Leitner-lite) ---------- */
function ReviewView({ cards, progress, setCardBox }) {
  const [filter, setFilter] = useState("all"); // all | f1.. | due
  const [flipped, setFlipped] = useState(false);
  const [idx, setIdx] = useState(0);

  const deck = useMemo(() => {
    let d = cards;
    if (filter === "due") d = cards.filter(c => (progress.cards[c.id] || 0) < 4);
    else if (filter !== "all") d = cards.filter(c => c.phase === filter);
    return d;
  }, [cards, filter, progress.cards]);

  useEffect(() => { setIdx(0); setFlipped(false); }, [filter]);

  const masteredCount = cards.filter(c => (progress.cards[c.id] || 0) >= 4).length;

  if (deck.length === 0) {
    return (
      <div className="fs-review">
        <div className="fs-rev-head"><h2>Repaso</h2><p>Tarjetas para fijar conceptos con repetición espaciada.</p></div>
        <RevFilters filter={filter} setFilter={setFilter} />
        <div className="fs-empty">
          <Trophy size={40} className="big" />
          <div style={{ fontFamily: "var(--mono)", color: "var(--green)" }}>¡Todo dominado en este filtro!</div>
          <p style={{ fontSize: 13 }}>Cambia de filtro o sigue avanzando en el roadmap.</p>
        </div>
      </div>
    );
  }

  const card = deck[idx % deck.length];
  const box = progress.cards[card.id] || 0;

  const advance = () => { setFlipped(false); setTimeout(() => setIdx(i => (i + 1) % deck.length), 120); };
  const know = () => { setCardBox(card.id, Math.min(4, box + 1)); advance(); };
  const again = () => { setCardBox(card.id, 0); advance(); };

  return (
    <div className="fs-review">
      <div className="fs-rev-head">
        <h2>Repaso</h2>
        <p>Toca la tarjeta para girarla · {deck.length} en este mazo</p>
      </div>

      <div className="fs-rev-stats">
        <div className="fs-chip"><Brain size={14} color="#ffb020" /> Dominadas <span className="v" style={{ marginLeft: 4 }}>{masteredCount}/{cards.length}</span></div>
        <div className="fs-chip">Caja <span className="v" style={{ marginLeft: 4 }}>{box}/4</span></div>
      </div>

      <RevFilters filter={filter} setFilter={setFilter} />

      <div className={`fs-flip ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(f => !f)} style={{ "--ac": card.ac }}>
        <div className="fs-flip-in">
          <div className="fs-face">
            <div className="lab">CONCEPTO</div>
            <div className="q">{card.front}</div>
            <div className="hint">toca para ver la respuesta ↺</div>
          </div>
          <div className="fs-face back">
            <div className="lab" style={{ color: "var(--green)" }}>RESPUESTA</div>
            <div className="a">{card.back}</div>
            <div className="hint">¿lo sabías?</div>
          </div>
        </div>
      </div>

      <div className="fs-rev-actions">
        <button className="again" onClick={again}><RotateCcw size={15} /> Repasar de nuevo</button>
        <button className="know" onClick={know}><Check size={15} /> Lo sé</button>
      </div>
    </div>
  );
}

function RevFilters({ filter, setFilter }) {
  return (
    <div className="fs-rev-pick">
      <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>TODAS</button>
      <button className={filter === "due" ? "on" : ""} onClick={() => setFilter("due")}>POR DOMINAR</button>
      {PHASES.map((ph, i) => (
        <button key={ph.id} className={filter === ph.id ? "on" : ""} onClick={() => setFilter(ph.id)}>F{i + 1}</button>
      ))}
    </div>
  );
}