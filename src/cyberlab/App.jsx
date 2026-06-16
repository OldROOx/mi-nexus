import { useState, useRef, useEffect, useCallback } from 'react'
import { css } from './styles'
import { ranks, rankFor, nextRank, tokenize } from './core'
import allModules from './modules'

/* ============================================================================
   CYBERLAB // Evolutive — shell modular
   Carga los módulos de ./modules y corre la terminal contra el módulo activo.
   Persiste progreso (xp, misiones completadas, módulo activo, historial) en
   localStorage. Se restaura al recargar la página.
============================================================================ */

const STORAGE_KEY = 'cyberlab_progress_v1'

// Carga el progreso guardado, o retorna defaults si no hay nada / hay error
const loadProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    // Validar que el módulo activo aún exista (en caso de cambios de versión)
    const activeExists = allModules.some(m => m.id === data.activeId)
    return {
      activeId: activeExists ? data.activeId : allModules[0].id,
      xp: typeof data.xp === 'number' ? data.xp : 0,
      done: Array.isArray(data.done) ? new Set(data.done) : new Set(),
      hist: Array.isArray(data.hist) ? data.hist.slice(-50) : [] // limitar a 50
    }
  } catch (e) {
    console.warn('Error cargando progreso, empezando limpio:', e)
    return null
  }
}

// Guarda el progreso actual
const saveProgress = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      activeId: state.activeId,
      xp: state.xp,
      done: Array.from(state.done),
      hist: state.hist.slice(-50), // últimos 50 comandos
      savedAt: Date.now()
    }))
  } catch (e) {
    console.warn('Error guardando progreso:', e)
  }
}

export default function App() {
  // Cargar progreso al iniciar (una sola vez)
  const saved = typeof window !== 'undefined' ? loadProgress() : null
  const initialMod = saved ? allModules.find(m => m.id === saved.activeId) : allModules[0]

  const [activeId, setActiveId] = useState(initialMod.id)
  const [env, setEnv] = useState(() => initialMod.initEnv())
  const [lines, setLines] = useState(() => {
    const intro = initialMod.intro.map(text => ({ type: 'sys', text }))
    if (saved && saved.xp > 0) {
      return [
        { type: 'sys', text: '🔁 Progreso restaurado (' + saved.xp + ' XP, ' + saved.done.size + ' misiones completadas)' },
        { type: 'sys', text: '' },
        ...intro
      ]
    }
    return intro
  })
  const [input, setInput] = useState('')
  const [hist, setHist] = useState(saved?.hist || [])
  const [histIdx, setHistIdx] = useState(-1)
  const [events, setEvents] = useState([])
  const [done, setDone] = useState(saved?.done || new Set())
  const [xp, setXp] = useState(saved?.xp || 0)
  const [showHint, setShowHint] = useState(false)
  const [toast, setToast] = useState(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const outRef = useRef(null)
  const inRef = useRef(null)

  const mod = allModules.find(m => m.id === activeId)
  const missions = mod.missions
  const current = missions.find(m => !done.has(m.id))

  // Guardar progreso cuando cambia xp, done, activeId o hist
  useEffect(() => {
    saveProgress({ activeId, xp, done, hist })
  }, [activeId, xp, done, hist])

  // Reset total - limpia localStorage y reinicia todo
  const handleFullReset = () => {
    try { localStorage.removeItem(STORAGE_KEY) } catch (e) {}
    setActiveId(allModules[0].id)
    setEnv(allModules[0].initEnv())
    setLines([
      { type: 'sys', text: '🗑️ Progreso eliminado completamente. Empezando de cero.' },
      { type: 'sys', text: '' },
      ...allModules[0].intro.map(text => ({ type: 'sys', text }))
    ])
    setInput('')
    setHist([])
    setHistIdx(-1)
    setEvents([])
    setDone(new Set())
    setXp(0)
    setShowHint(false)
    setShowResetConfirm(false)
    setTimeout(() => inRef.current?.focus(), 0)
  }

  useEffect(() => { if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight }, [lines])

  /* módulo i desbloqueado si es el primero o si el anterior está 100% completo */
  const isUnlocked = idx => {
    if (idx === 0) return true
    const prev = allModules[idx - 1]
    return prev.missions.length > 0 && prev.missions.every(m => done.has(m.id))
  }

  const switchModule = (m, idx) => {
    if (m.id === activeId || !isUnlocked(idx)) return
    setActiveId(m.id)
    setEnv(m.initEnv())
    setEvents([])
    setShowHint(false)
    setLines(m.intro.map(text => ({ type: 'sys', text })))
    setInput(''); setHistIdx(-1)
    setTimeout(() => inRef.current?.focus(), 0)
  }

  const checkMissions = useCallback((allEvents, curEnv) => {
    missions.forEach(m => {
      if (!done.has(m.id) && m.check(allEvents, curEnv)) {
        setDone(prev => new Set(prev).add(m.id))
        setXp(prev => prev + m.xp)
        setToast({ title: m.title, xp: m.xp })
        setTimeout(() => setToast(null), 3200)
      }
    })
  }, [missions, done])

  const execute = (line, curEnv) => {
    const tokens = tokenize(line)
    const cmd = tokens[0] || ''
    const args = tokens.slice(1)
    if (cmd === '') return { out: [] }
    if (cmd === 'help') {
      const list = Object.keys(mod.commands).sort().join('  ')
      return { out: [
          'Comandos de este módulo:',
          '  ' + list,
          '',
          'Comandos globales:',
          '  help     - esta ayuda',
          '  clear    - limpiar terminal',
          '  reset    - reiniciar módulo actual (env + progreso de este módulo)',
          '  history  - ver historial de comandos',
          '',
          'Tip: flechas up/down reusan comandos. Las comillas agrupan ("...").'
        ] }
    }
    if (cmd === 'history') return { out: hist.length ? hist : ['(vacío)'] }
    if (cmd === 'reset') {
      return { out: ['__RESET__'], reset: true }
    }
    const fn = mod.commands[cmd]
    if (!fn) return { out: [cmd + ": comando no encontrado. 'help' para la lista."], err: true }
    return fn(args, curEnv)
  }

  const handleReset = () => {
    setEnv(mod.initEnv())
    setEvents([])
    setShowHint(false)
    setLines([
      { type: 'sys', text: '🔄 Módulo reiniciado. Estado limpio.' },
      { type: 'sys', text: '' },
      ...mod.intro.map(text => ({ type: 'sys', text }))
    ])
    setInput('')
    setHistIdx(-1)
  }

  const submit = () => {
    const line = input
    if (line.trim() === 'clear') {
      setLines([]); setInput(''); if (line.trim()) setHist(h => [...h, line]); setHistIdx(-1); return
    }
    if (line.trim() === 'reset') {
      if (line.trim()) setHist(h => [...h, line])
      handleReset()
      return
    }
    const newLines = [...lines, { type: 'cmd', text: line, prompt: mod.prompt(env) }]
    const res = execute(line, env)
    ;(res.out || []).forEach(o => {
      let type = 'out'
      if (typeof o === 'string' && o.includes('FLAG{')) type = 'flag'
      else if (res.err) type = 'err'
      newLines.push({ type, text: o })
    })
    setLines(newLines)
    const nextEnv = res.env || env
    if (res.env) setEnv(res.env)
    if (line.trim()) { setHist(h => [...h, line]); setHistIdx(-1) }
    setInput('')
    const all = res.events ? [...events, ...res.events] : events
    if (res.events) setEvents(all)
    checkMissions(all, nextEnv)
  }

  const onKey = e => {
    if (e.key === 'Enter') submit()
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!hist.length) return
      const i = histIdx < 0 ? hist.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(i); setInput(hist[i])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx < 0) return
      const i = histIdx + 1
      if (i >= hist.length) { setHistIdx(-1); setInput('') }
      else { setHistIdx(i); setInput(hist[i]) }
    }
  }

  const rank = rankFor(xp)
  const nxt = nextRank(xp)
  const progPct = nxt ? Math.min(100, ((xp - rank.min) / (nxt.min - rank.min)) * 100) : 100

  return (
      <>
        <style>{css}</style>
        <div className="lab">
          <div className="scanlines" aria-hidden="true" />

          <header className="hdr">
            <div className="brand">
              <span className="logo">&#9626;</span>
              <div>
                <h1>CYBER<span className="cy">LAB</span></h1>
                <p className="tag">// by Evolutive &middot; aprende hackeando</p>
              </div>
            </div>
            <div className="stats">
              <div className="rankbox">
                <span className="rlabel">RANGO</span>
                <span className="rname">{rank.name}</span>
              </div>
              <div className="xpwrap">
                <div className="xprow">
                  <span>{xp} XP</span>
                  <span className="dim">{nxt ? '\u2192 ' + nxt.name + ' (' + nxt.min + ')' : 'MAX'}</span>
                </div>
                <div className="xpbar"><div className="xpfill" style={{ width: progPct + '%' }} /></div>
              </div>
              <button
                  className="resetbtn"
                  onClick={() => setShowResetConfirm(true)}
                  title="Reiniciar todo el progreso (XP, misiones, módulo activo)">
                🗑️ Reset
              </button>
            </div>
          </header>

          <main className="grid">
            <aside className="panel">
              <h2 className="ptitle">MODULOS</h2>
              <div className="mods">
                {allModules.map((m, idx) => {
                  const unlocked = isUnlocked(idx)
                  const total = m.missions.length
                  const comp = m.missions.filter(x => done.has(x.id)).length
                  return (
                      <div key={m.id}
                           className={`mod ${m.id === activeId ? 'on' : ''} ${unlocked ? 'unlocked' : 'lock'}`}
                           onClick={() => switchModule(m, idx)}>
                        <span className="micon">{unlocked ? m.icon : '\uD83D\uDD12'}</span>
                        <div className="mtxt">
                          <span className="mname">{m.name}</span>
                          <span className="msub">{m.sub}</span>
                        </div>
                        {total > 0 && unlocked && <span className="mcount">{comp}/{total}</span>}
                      </div>
                  )
                })}
              </div>

              <h2 className="ptitle">MISION ACTUAL</h2>
              {current ? (
                  <div className="mission">
                    <span className="mtag">OBJETIVO &middot; +{current.xp} XP</span>
                    <h3>{current.title}</h3>
                    <p className="brief">{current.brief}</p>
                    <div className="objbox">&#9656; {current.obj}</div>
                    <button className="hintbtn" onClick={() => setShowHint(s => !s)}>
                      {showHint ? '\u2715 ocultar pista' : '\uD83D\uDCA1 ver pista'}
                    </button>
                    {showHint && <div className="hint"><code>{current.hint}</code></div>}
                  </div>
              ) : (
                  <div className="mission win">
                    <h3>&#127942; Modulo completado!</h3>
                    <p className="brief">Dominaste <b>{mod.name}</b>. Se desbloqueo el siguiente modulo arriba: haz clic para entrar.</p>
                  </div>
              )}

              <div className="checklist">
                {missions.map(m => (
                    <div key={m.id} className={`citem ${done.has(m.id) ? 'cdone' : ''}`}>
                      <span className="cbox">{done.has(m.id) ? '\u2713' : '\u25CB'}</span>{m.title}
                    </div>
                ))}
              </div>
            </aside>

            <section className="termwrap" onClick={() => inRef.current?.focus()}>
              <div className="tbar">
                <span className="dot r" /><span className="dot y" /><span className="dot g" />
                <span className="ttitle">{mod.prompt(env)}</span>
              </div>
              <div className="term" ref={outRef}>
                {lines.map((l, i) => {
                  if (l.type === 'cmd')
                    return <div key={i} className="ln"><span className="prompt">{l.prompt}</span> {l.text}</div>
                  return <div key={i} className={`ln ${l.type}`}>{l.text || '\u00A0'}</div>
                })}
                <div className="ln inputline">
                  <span className="prompt">{mod.prompt(env)}</span>
                  <input
                      ref={inRef} value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={onKey}
                      autoFocus spellCheck="false" autoComplete="off" className="tin" />
                  <span className="cursor">&#9611;</span>
                </div>
              </div>
            </section>
          </main>

          {toast && (
              <div className="toast">
                <span className="ticon">&#10003;</span>
                <div><b>Mision completada:</b> {toast.title}<br /><span className="tplus">+{toast.xp} XP</span></div>
              </div>
          )}

          {showResetConfirm && (
              <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                  <h3>⚠️ ¿Reiniciar todo el progreso?</h3>
                  <p>Esto eliminará permanentemente:</p>
                  <ul>
                    <li>{xp} XP acumulado</li>
                    <li>{done.size} misiones completadas</li>
                    <li>Historial de comandos</li>
                    <li>Módulo activo</li>
                  </ul>
                  <p className="modal-warn">No hay forma de recuperar el progreso después de hacer esto.</p>
                  <div className="modal-actions">
                    <button className="btn-cancel" onClick={() => setShowResetConfirm(false)}>
                      Cancelar
                    </button>
                    <button className="btn-danger" onClick={handleFullReset}>
                      Sí, eliminar todo
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </>
  )
}