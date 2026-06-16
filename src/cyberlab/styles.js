/* ============================================================================
   CYBERLAB // estilos compartidos
============================================================================ */
export const css = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');
* { box-sizing: border-box; }
.lab {
  --bg:#070b08; --panel:#0c130d; --line:#16241a; --green:#4dffa0; --green-d:#1e7a4d;
  --cyan:#47bfff; --amber:#ffcf5c; --dim:#5e7466; --txt:#c9f4d8; --red:#ff6b6b;
  position:relative; min-height:100vh; width:100%; background:
    radial-gradient(1200px 600px at 80% -10%, rgba(71,191,255,.07), transparent 60%),
    radial-gradient(900px 500px at 0% 110%, rgba(77,255,160,.06), transparent 55%),
    var(--bg);
  color:var(--txt); font-family:'JetBrains Mono',monospace; padding:18px;
}
.scanlines{ position:fixed; inset:0; pointer-events:none; z-index:50;
  background:repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0, rgba(0,0,0,.18) 1px, transparent 2px, transparent 4px);
  mix-blend-mode:overlay; opacity:.5; }
.hdr{ display:flex; justify-content:space-between; align-items:center; gap:20px;
  flex-wrap:wrap; padding-bottom:16px; border-bottom:1px solid var(--line); margin-bottom:18px; }
.brand{ display:flex; align-items:center; gap:14px; }
.logo{ font-size:34px; color:var(--green); text-shadow:0 0 18px var(--green-d); line-height:1; }
.hdr h1{ font-family:'Space Mono',monospace; font-size:26px; margin:0; letter-spacing:2px; color:var(--txt); }
.hdr .cy{ color:var(--cyan); text-shadow:0 0 14px rgba(71,191,255,.5); }
.tag{ margin:2px 0 0; font-size:11px; color:var(--dim); letter-spacing:1px; }
.stats{ display:flex; align-items:center; gap:18px; flex-wrap:wrap; }
.rankbox{ display:flex; flex-direction:column; align-items:flex-end; }
.rlabel{ font-size:9px; color:var(--dim); letter-spacing:2px; }
.rname{ font-size:15px; color:var(--amber); font-weight:700; text-shadow:0 0 12px rgba(255,207,92,.3); }
.xpwrap{ width:200px; }
.xprow{ display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px; }
.dim{ color:var(--dim); }
.xpbar{ height:8px; background:#0a1410; border:1px solid var(--line); border-radius:6px; overflow:hidden; }
.xpfill{ height:100%; background:linear-gradient(90deg,var(--green-d),var(--green)); box-shadow:0 0 12px var(--green-d); transition:width .6s cubic-bezier(.2,.8,.2,1); }
.grid{ display:grid; grid-template-columns:340px 1fr; gap:18px; align-items:start; }
@media(max-width:860px){ .grid{ grid-template-columns:1fr; } }
.panel{ background:var(--panel); border:1px solid var(--line); border-radius:12px; padding:16px; }
.ptitle{ font-size:11px; letter-spacing:3px; color:var(--dim); margin:0 0 10px; border-left:3px solid var(--green); padding-left:8px; }
.mods{ display:flex; flex-direction:column; gap:6px; margin-bottom:20px; }
.mod{ display:flex; align-items:center; gap:10px; padding:9px 10px; border:1px solid var(--line); border-radius:8px; background:#0a110b; transition:.15s; }
.mod.unlocked{ cursor:pointer; }
.mod.unlocked:hover{ border-color:var(--green-d); }
.mod.on{ border-color:var(--green); box-shadow:inset 0 0 0 1px rgba(77,255,160,.2); }
.mod.lock{ opacity:.4; }
.micon{ font-size:18px; }
.mtxt{ display:flex; flex-direction:column; flex:1; min-width:0; }
.mname{ font-size:13px; color:var(--txt); }
.msub{ font-size:10px; color:var(--dim); }
.mcount{ font-size:11px; color:var(--green); font-weight:700; }
.mission{ background:#0a130d; border:1px solid var(--line); border-radius:10px; padding:14px; margin-bottom:14px; }
.mission.win{ border-color:var(--amber); }
.mtag{ font-size:9px; letter-spacing:2px; color:var(--green); background:rgba(77,255,160,.08); padding:3px 7px; border-radius:4px; }
.mission h3{ margin:10px 0 6px; font-size:16px; color:var(--txt); }
.brief{ font-size:12px; line-height:1.6; color:#9fc7ad; margin:0 0 10px; }
.objbox{ font-size:12px; color:var(--cyan); background:rgba(71,191,255,.07); border:1px solid rgba(71,191,255,.2); border-radius:6px; padding:8px 10px; margin-bottom:10px; }
.hintbtn{ font-family:inherit; font-size:11px; color:var(--amber); background:transparent; border:1px solid rgba(255,207,92,.3); border-radius:6px; padding:5px 10px; cursor:pointer; transition:.2s; }
.hintbtn:hover{ background:rgba(255,207,92,.1); }
.hint{ margin-top:8px; font-size:12px; }
.hint code{ background:#06100a; color:var(--green); padding:6px 9px; border-radius:5px; display:block; border:1px dashed var(--green-d); white-space:pre-wrap; }
.checklist{ display:flex; flex-direction:column; gap:5px; }
.citem{ font-size:12px; color:var(--dim); display:flex; align-items:center; gap:8px; }
.citem.cdone{ color:var(--green); }
.cbox{ font-weight:700; }
.termwrap{ border:1px solid var(--line); border-radius:12px; overflow:hidden; background:#050805; box-shadow:0 0 40px rgba(0,0,0,.5); min-height:520px; display:flex; flex-direction:column; }
.tbar{ display:flex; align-items:center; gap:7px; padding:10px 14px; background:#0a110b; border-bottom:1px solid var(--line); }
.dot{ width:11px; height:11px; border-radius:50%; }
.dot.r{ background:#ff5f56; } .dot.y{ background:#ffbd2e; } .dot.g{ background:#27c93f; }
.ttitle{ font-size:11px; color:var(--dim); margin-left:8px; }
.term{ flex:1; padding:16px; overflow-y:auto; font-size:13.5px; line-height:1.65; max-height:62vh; }
.ln{ white-space:pre-wrap; word-break:break-word; }
.ln.sys{ color:var(--cyan); }
.ln.out{ color:#a8d6b8; }
.ln.flag{ color:var(--amber); font-weight:700; }
.ln.err{ color:var(--red); }
.prompt{ color:var(--green); font-weight:500; }
.inputline{ display:flex; align-items:center; }
.tin{ flex:1; background:transparent; border:none; outline:none; color:var(--txt); font-family:inherit; font-size:13.5px; padding:0 0 0 7px; caret-color:transparent; }
.cursor{ color:var(--green); animation:blink 1.1s steps(1) infinite; margin-left:-4px; }
@keyframes blink{ 50%{ opacity:0; } }
.toast{ position:fixed; bottom:24px; right:24px; z-index:60; display:flex; gap:12px; align-items:center;
  background:#0a130d; border:1px solid var(--green-d); border-radius:10px; padding:14px 18px;
  box-shadow:0 0 30px rgba(77,255,160,.25); animation:slidein .4s cubic-bezier(.2,.8,.2,1); }
@keyframes slidein{ from{ transform:translateX(120%); opacity:0; } to{ transform:translateX(0); opacity:1; } }
.ticon{ font-size:22px; color:var(--green); }
.toast b{ color:var(--txt); } .toast div{ font-size:13px; }
.tplus{ color:var(--green); font-weight:700; font-size:12px; }

/* ── Botón Reset Progreso ────────────────────────────────────────── */
.resetbtn{
  font-family:inherit; font-size:11px; color:var(--red);
  background:transparent; border:1px solid rgba(255,107,107,.3);
  border-radius:6px; padding:6px 12px; cursor:pointer; transition:.2s;
  letter-spacing:1px;
}
.resetbtn:hover{ background:rgba(255,107,107,.1); border-color:var(--red); }

/* ── Modal de confirmación ──────────────────────────────────────── */
.modal-overlay{
  position:fixed; inset:0; z-index:100; display:flex; align-items:center; justify-content:center;
  background:rgba(0,0,0,.75); backdrop-filter:blur(4px);
  animation:fadein .2s ease-out;
}
@keyframes fadein{ from{ opacity:0; } to{ opacity:1; } }
.modal{
  background:#0a130d; border:1px solid var(--red); border-radius:12px;
  padding:24px 28px; max-width:420px; width:90%;
  box-shadow:0 0 50px rgba(255,107,107,.25);
  animation:popin .3s cubic-bezier(.2,.8,.2,1);
}
@keyframes popin{ from{ transform:scale(.92); opacity:0; } to{ transform:scale(1); opacity:1; } }
.modal h3{ margin:0 0 12px; font-size:18px; color:var(--red); }
.modal p{ font-size:13px; line-height:1.6; color:#9fc7ad; margin:8px 0; }
.modal ul{ margin:8px 0 12px 0; padding-left:20px; font-size:13px; color:var(--cyan); }
.modal ul li{ margin:3px 0; }
.modal-warn{
  color:var(--amber); font-size:12px; font-style:italic;
  background:rgba(255,207,92,.05); padding:8px 10px; border-radius:6px;
  border-left:3px solid var(--amber); margin:12px 0 16px;
}
.modal-actions{ display:flex; gap:10px; justify-content:flex-end; margin-top:16px; }
.btn-cancel, .btn-danger{
  font-family:inherit; font-size:12px; padding:8px 16px; border-radius:6px;
  cursor:pointer; transition:.2s; letter-spacing:.5px;
}
.btn-cancel{
  background:transparent; color:var(--txt); border:1px solid var(--line);
}
.btn-cancel:hover{ border-color:var(--green-d); }
.btn-danger{
  background:var(--red); color:#1a0606; border:1px solid var(--red);
  font-weight:700;
}
.btn-danger:hover{ box-shadow:0 0 18px rgba(255,107,107,.5); }
`