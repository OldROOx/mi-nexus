/* ============================================================================
   MÓDULO: Redes
   Simulador de descubrimiento de red. env = { ip, subnet, hosts }
   Enseña: IP/subred, barrido de red, escaneo de puertos, fingerprint de servicios.
============================================================================ */

const HOSTS = {
    '10.0.0.1':  { name: 'gateway', os: 'Linux (router)', ports: {
            53: { svc: 'domain', ver: 'dnsmasq 2.80' }, 80: { svc: 'http', ver: 'lighttpd (panel router)' } } },
    '10.0.0.5':  { name: 'kali (tú)', os: 'Kali Linux', ports: {} },
    '10.0.0.10': { name: 'web-srv', os: 'Ubuntu 20.04', ports: {
            22: { svc: 'ssh', ver: 'OpenSSH 8.2p1' },
            80: { svc: 'http', ver: 'Apache 2.4.49  ⚠ versión con CVE conocido' },
            443:{ svc: 'https', ver: 'Apache 2.4.49' } } },
    '10.0.0.20': { name: 'db-srv', os: 'Debian 11', ports: {
            3306: { svc: 'mysql', ver: 'MySQL 5.7.38' } } },
    '10.0.0.30': { name: 'dc01', os: 'Windows Server 2019', ports: {
            88: { svc: 'kerberos', ver: 'Microsoft Windows Kerberos' },
            135:{ svc: 'msrpc', ver: 'Microsoft Windows RPC' },
            445:{ svc: 'microsoft-ds', ver: 'SMB (Active Directory)' },
            3389:{ svc: 'ms-wbt-server', ver: 'Microsoft Terminal Services / RDP' } } }
}

const isAlive = ip => !!HOSTS[ip]

const commands = {
    whoami: () => ({ out: ['analyst@kali'] }),

    ip: (args, env) => {
        if (args[0] && args[0] !== 'a' && args[0] !== 'addr')
            return { out: [`uso: ip a`] }
        return {
            out: [`eth0: inet ${env.ip}/24  (red ${env.subnet})`, 'Estás en una /24 → 254 hosts posibles (.1 a .254).'],
            events: [{ t: 'ipinfo' }]
        }
    },
    ifconfig: (a, env) => ({
        out: [`eth0  inet ${env.ip}  netmask 255.255.255.0  (red ${env.subnet})`],
        events: [{ t: 'ipinfo' }]
    }),

    ping: args => {
        const ip = args.find(x => !x.startsWith('-'))
        if (!ip) return { out: ['uso: ping <ip>'] }
        if (isAlive(ip)) return { out: [`64 bytes desde ${ip}: icmp_seq=1 ttl=64 tiempo=0.4 ms`, `${ip} está VIVO.`], events: [{ t: 'ping', ip, alive: true }] }
        return { out: [`Destino ${ip} inalcanzable (sin respuesta).`], events: [{ t: 'ping', ip, alive: false }] }
    },

    nmap: (args, env) => {
        const sv = args.includes('-sV')
        const target = args.find(x => !x.startsWith('-'))
        if (!target) return { out: ['uso: nmap [-sV] <ip|red/24>   ej: nmap 10.0.0.0/24'] }

        // barrido de red
        if (target.includes('/')) {
            const alive = Object.keys(HOSTS)
            const out = ['Iniciando barrido de red...', '']
            alive.forEach(ip => out.push(`Host ${ip} ACTIVO  (${HOSTS[ip].name})`))
            out.push('', `${alive.length} hosts vivos en ${target}.`)
            return { out, events: [{ t: 'nmap', target, subnet: true }] }
        }

        // escaneo de host
        if (!isAlive(target)) return { out: [`nmap: ${target} parece caído (0 hosts up).`], events: [{ t: 'nmap', target, alive: false }] }
        const h = HOSTS[target]
        const ports = Object.keys(h.ports)
        const out = [`Reporte de escaneo para ${target} (${h.name})`, `OS aproximado: ${h.os}`, '']
        if (ports.length === 0) out.push('Todos los puertos cerrados/filtrados.')
        else {
            out.push('PUERTO     ESTADO  SERVICIO' + (sv ? '      VERSIÓN' : ''))
            ports.forEach(p => {
                const info = h.ports[p]
                out.push(`${(p + '/tcp').padEnd(11)}open    ${info.svc.padEnd(13)}${sv ? info.ver : ''}`)
            })
        }
        return { out, events: [{ t: 'nmap', target, sv, ports }] }
    },

    man: args => {
        const docs = {
            nmap: 'nmap — escáner de red. nmap red/24 descubre hosts; nmap <ip> escanea puertos; -sV detecta versiones.',
            ping: 'ping <ip> — comprueba si un host responde (capa 3, ICMP).',
            ip: 'ip a — muestra tu dirección IP y tu subred.'
        }
        return { out: [docs[args[0]] || `man: sin página para '${args[0] || ''}'`] }
    }
}

const missions = [
    { id: 'rd1', title: '¿Quién soy en la red?', xp: 50,
        brief: 'Todo equipo tiene una IP (su dirección en la red) y una máscara que define su "vecindario" (la subred). Una /24 son 254 vecinos posibles.',
        obj: 'Muestra tu IP y subred.',
        hint: 'ip a',
        check: ev => ev.some(e => e.t === 'ipinfo') },
    { id: 'rd2', title: 'Barrido de red', xp: 70,
        brief: 'Antes de atacar algo, hay que saber QUÉ existe. Un barrido pregunta "¿quién está vivo aquí?" a todas las IPs del vecindario.',
        obj: 'Descubre los hosts vivos de tu red con nmap.',
        hint: 'nmap 10.0.0.0/24',
        check: ev => ev.some(e => e.t === 'nmap' && e.subnet) },
    { id: 'rd3', title: 'Toca los puertos', xp: 70,
        brief: 'Cada host abre "puertas" (puertos) para sus servicios: 22=SSH, 80=web, 3306=MySQL. Escanear puertos te dice qué corre ahí.',
        obj: 'Escanea los puertos del servidor web 10.0.0.10.',
        hint: 'nmap 10.0.0.10',
        check: ev => ev.some(e => e.t === 'nmap' && e.target === '10.0.0.10' && e.ports && e.ports.length) },
    { id: 'rd4', title: 'Huella de servicios', xp: 90,
        brief: 'Saber que el puerto 80 está abierto no basta: necesitas la VERSIÓN del software. Una versión vieja = vulnerabilidad conocida. -sV hace ese fingerprint.',
        obj: 'Detecta versiones en 10.0.0.10 y fíjate en la versión de Apache.',
        hint: 'nmap -sV 10.0.0.10',
        check: ev => ev.some(e => e.t === 'nmap' && e.target === '10.0.0.10' && e.sv) },
    { id: 'rd5', title: 'Objetivo de alto valor', xp: 100,
        brief: 'En una red corporativa, la joya de la corona es el Domain Controller (Windows): controla todas las cuentas. Se delata por sus puertos 88 (Kerberos), 445 (SMB) y 3389 (RDP). Lo verás a fondo en el módulo de Active Directory.',
        obj: 'Escanea con versiones el host 10.0.0.30 e identifica que es un Windows DC.',
        hint: 'nmap -sV 10.0.0.30',
        check: ev => ev.some(e => e.t === 'nmap' && e.target === '10.0.0.30' && e.sv) }
]

export default {
    id: 'redes', icon: '🌐', name: 'Redes', sub: 'OSI, TCP/IP, nmap, escaneo',
    initEnv: () => ({ ip: '10.0.0.5', subnet: '10.0.0.0/24', hosts: HOSTS }),
    prompt: () => 'analyst@kali:~$',
    intro: ['Módulo REDES cargado. Estás en una Kali con IP 10.0.0.5.',
        'Comandos clave: ip a, ping, nmap. Escribe help para todo.'],
    commands, missions
}