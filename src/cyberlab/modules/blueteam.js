/* ============================================================================
   MÓDULO: Blue Team / SIEM
   Simulador de Splunk/Wazuh: análisis de logs, detección de patrones,
   threat hunting, incident response. env = { logs, alerts, incidents }
============================================================================ */

const initEnv = () => ({
    logs: [
        { timestamp: '2024-01-14 09:15:23', source: 'web-srv', level: 'INFO', msg: 'GET /index.html 200' },
        { timestamp: '2024-01-14 09:15:24', source: 'web-srv', level: 'INFO', msg: 'GET /admin\' OR \'1\'=\'1 403' },
        { timestamp: '2024-01-14 09:15:25', source: 'web-srv', level: 'INFO', msg: 'GET /admin\' OR \'1\'=\'1 403' },
        { timestamp: '2024-01-14 09:15:26', source: 'web-srv', level: 'INFO', msg: 'GET /admin\' OR \'1\'=\'1 403' },
        { timestamp: '2024-01-14 09:20:11', source: 'dc-01', level: 'WARNING', msg: 'Event 4625: Failed logon for user=backup-svc from 192.168.1.100 (5 attempts in 10 sec)' },
        { timestamp: '2024-01-14 09:20:15', source: 'dc-01', level: 'WARNING', msg: 'Event 4625: Failed logon for user=backup-svc from 192.168.1.100' },
        { timestamp: '2024-01-14 09:21:45', source: 'db-srv', level: 'ERROR', msg: 'Connection refused on port 3306 (brute force detector activated)' },
        { timestamp: '2024-01-14 10:30:00', source: 'kali', level: 'CRITICAL', msg: 'Port scan detected: nmap signature on ports 22,80,443,3306,445' },
        { timestamp: '2024-01-14 10:31:22', source: 'dc-01', level: 'CRITICAL', msg: 'Event 4688: Powershell.exe launched with encoded command (obfuscation detected)' },
        { timestamp: '2024-01-14 10:32:00', source: 'file-srv', level: 'WARNING', msg: 'Lateral movement: admin share accessed from 10.0.0.5 (unusual source)' }
    ]
})

const commands = {
    'Get-Logs': (args, env) => {
        const source = args.find(a => a.startsWith('-Source='))?.split('=')[1]
        const level = args.find(a => a.startsWith('-Level='))?.split('=')[1]
        const out = ['Timestamp              Source     Level       Message']
        let filtered = env.logs
        if (source) filtered = filtered.filter(l => l.source.includes(source))
        if (level) filtered = filtered.filter(l => l.level.includes(level))
        filtered.forEach(log => {
            out.push(`${log.timestamp}  ${log.source.padEnd(10)} ${log.level.padEnd(11)} ${log.msg}`)
        })
        return { out, events: [{ t: 'log_search', source, level }] }
    },

    'Search-Anomaly': (args, env) => {
        const pattern = args[0]
        if (!pattern) return { out: ['uso: Search-Anomaly <patrón>  ej: "SQLi" o "brute" o "nmap"'] }
        const matches = env.logs.filter(l => l.msg.toLowerCase().includes(pattern.toLowerCase()))
        if (matches.length === 0) return { out: [`(sin coincidencias para '${pattern}')`, 'Pero eso no significa que no pasó — pudo estar ofuscado o en un log que aún no filtramos.'] }
        const out = [`Encontrados ${matches.length} eventos sospechosos:\n`]
        matches.forEach(m => out.push(`[${m.level}] ${m.timestamp} ${m.source}: ${m.msg}`))
        return { out, events: [{ t: 'threat_hunt', pattern, found: matches.length }] }
    },

    'Detect-BruteForce': (a, env) => {
        const brute_events = env.logs.filter(l => l.msg.includes('4625') || l.msg.includes('Failed logon') || l.msg.includes('brute'))
        if (brute_events.length === 0) return { out: ['(sin intentos de fuerza bruta detectados)'] }
        const out = ['=== Brute Force Detected ===\n']
        brute_events.forEach(e => out.push(`${e.timestamp} ${e.source}: ${e.msg}`))
        out.push('', '⚠ Acción recomendada: bloquear la IP atacante e investigar la cuenta comprometida.')
        return { out, events: [{ t: 'detect_brute' }] }
    },

    'Detect-Lateral': (a, env) => {
        const lateral = env.logs.filter(l => l.msg.includes('Lateral movement') || l.msg.includes('admin share') || l.msg.includes('unusual source'))
        if (lateral.length === 0) return { out: ['(sin movimiento lateral detectado)'] }
        const out = ['=== Lateral Movement Detected ===\n']
        lateral.forEach(e => out.push(`${e.timestamp} ${e.source}: ${e.msg}`))
        out.push('', '⚠ Acción: aislamiento de red, captura de tráfico, análisis de memoria.')
        return { out, events: [{ t: 'detect_lateral' }] }
    },

    'Detect-Recon': (a, env) => {
        const recon = env.logs.filter(l => l.msg.includes('nmap') || l.msg.includes('Port scan') || l.msg.includes('connection refused'))
        if (recon.length === 0) return { out: ['(sin reconocimiento detectado)'] }
        const out = ['=== Reconnaissance Activity Detected ===\n']
        recon.forEach(e => out.push(`${e.timestamp} ${e.source}: ${e.msg}`))
        out.push('', '⚠ Patrones: escaneo de puertos, enumeración de servicios. Fase PRE-ataque.')
        return { out, events: [{ t: 'detect_recon' }] }
    },

    'Incident-Summary': (a, env) => {
        const out = [
            '=== Incident Summary ===',
            '',
            '1. [CRITICAL] Reconnaissance phase: nmap scan desde 10.0.0.5',
            '   → Atacante mapeando la red (puertos abiertos)',
            '',
            '2. [HIGH] SQL Injection attempts en web-srv',
            '   → Múltiples intentos de bypass de login (403 blocked)',
            '',
            '3. [HIGH] Brute force contra backup-svc en DC-01',
            '   → 5 intentos fallidos en 10 segundos → patrón bot',
            '',
            '4. [CRITICAL] Lateral movement detectado',
            '   → Admin share accedido desde IP inusual (10.0.0.5)',
            '',
            '5. [CRITICAL] Powershell obfuscated en DC-01',
            '   → Ejecución de comando codificado = Phase 2 del ataque (ejecución)',
            '',
            'VERDICT: Compromiso probable. Recomendación: Incident Response Tier-1 inmediato.',
            'Isolate affected systems. Capture memory. Review last 7 days of logs.'
        ]
        return { out, events: [{ t: 'incident_summary' }] }
    },

    'help': () => ({ out: ['Comandos SIEM disponibles:', '  Get-Logs [-Source=X] [-Level=Y]  Search-Anomaly <patrón>', '  Detect-BruteForce  Detect-Lateral  Detect-Recon  Incident-Summary  help'] })
}

const missions = [
    {
        id: 'blue1', title: 'Búsqueda de anomalías', xp: 60,
        brief: 'La detección empieza viendo qué se ve raro. Un patrón = muchos eventos del mismo tipo en poco tiempo, o eventos que "huelen" a ataque (SQLi, nmap, etc).',
        obj: 'Busca eventos anómalos: usa Search-Anomaly con "SQLi" o "nmap".',
        hint: 'Search-Anomaly "nmap"',
        check: ev => ev.some(e => e.t === 'threat_hunt')
    },
    {
        id: 'blue2', title: 'Detecta ataque de fuerza bruta', xp: 80,
        brief: 'Event 4625 = failed logon en Windows. Si ves 5+ en segundos desde la misma IP, es brute force automático. Es uno de los indicadores (IoCs) más confiables.',
        obj: 'Corre Detect-BruteForce para identificar intentos de login fallidos.',
        hint: 'Detect-BruteForce',
        check: ev => ev.some(e => e.t === 'detect_brute')
    },
    {
        id: 'blue3', title: 'Identifica movimiento lateral', xp: 100,
        brief: 'Lateral movement = el atacante ya entró (estuvo en la red) y ahora se mueve entre máquinas. "Admin share access from unusual IP" es el clásico tell.',
        obj: 'Ejecuta Detect-Lateral para ver dónde se propaga el atacante.',
        hint: 'Detect-Lateral',
        check: ev => ev.some(e => e.t === 'detect_lateral')
    },
    {
        id: 'blue4', title: 'Mapea la cadena de ataque (Kill Chain)', xp: 100,
        brief: 'MITRE ATT&CK: Recon (nmap) → Initial Access (SQLi) → Execution (Powershell) → Lateral Movement. Cada etapa te muestra dónde intervenir.',
        obj: 'Ejecuta Detect-Recon para ver el inicio, luego Incident-Summary para la línea de tiempo completa.',
        hint: 'Detect-Recon\nIncident-Summary',
        check: ev => ev.some(e => e.t === 'incident_summary')
    }
]

export default {
    id: 'blueteam', icon: '🛡️', name: 'Blue Team / SIEM', sub: 'Log analysis, threat hunting, IR',
    initEnv,
    prompt: () => 'splunk>',
    intro: ['Módulo BLUE TEAM cargado. Eres SOC Analyst. Tienes logs de toda la red en tu SIEM.',
        'Tu trabajo: detectar anomalías, reconstruir el ataque, detener al intrusor. Los comandos te ayudan a buscar.'],
    commands, missions
}