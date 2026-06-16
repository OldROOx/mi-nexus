/* ============================================================================
   MÓDULO: Linux Fundamentals
   Cada comando recibe (args, env) y devuelve { out, events?, env? }.
   env = { fs, cwd }
============================================================================ */

/* ---- helpers de rutas ---- */
const splitPath = p => p.split('/').filter(Boolean)
const wildcard = pat =>
    new RegExp('^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$')

function resolvePath(cwd, p) {
    let segs
    if (p === '~' || p === '' || p === undefined) segs = ['home', 'gael']
    else if (p.startsWith('/')) segs = splitPath(p)
    else if (p.startsWith('~')) segs = ['home', 'gael', ...splitPath(p.slice(1))]
    else segs = [...cwd, ...splitPath(p)]
    const out = []
    for (const s of segs) {
        if (s === '.') continue
        else if (s === '..') out.pop()
        else out.push(s)
    }
    return out
}
function getNode(fs, segs) {
    let n = fs
    for (const s of segs) {
        if (!n || n.type !== 'dir' || !n.children[s]) return null
        n = n.children[s]
    }
    return n
}
function pretty(segs) {
    if (segs[0] === 'home' && segs[1] === 'gael')
        return '~' + (segs.length > 2 ? '/' + segs.slice(2).join('/') : '')
    return '/' + segs.join('/')
}

/* ---- sistema de archivos inicial ---- */
const initFS = () => ({
    type: 'dir', perms: 'rwxr-xr-x',
    children: {
        home: { type: 'dir', perms: 'rwxr-xr-x', children: {
                gael: { type: 'dir', perms: 'rwxr-xr-x', children: {
                        'bienvenida.txt': { type: 'file', perms: 'rw-r--r--',
                            content: 'Bienvenido, analista.\nInvestiga este servidor.\nls lista, cat lee. Escribe help si te pierdes.' },
                        '.bash_history': { type: 'file', perms: 'rw-------',
                            content: 'cd /home/gael/secretos\ncat flag.txt\nmysql -u root -p\'P@ssw0rd_2024!\'   <- contraseña filtrada\nclear' },
                        secretos: { type: 'dir', perms: 'rwxr-xr-x', children: {
                                'flag.txt': { type: 'file', perms: 'rw-r--r--',
                                    content: 'FLAG{b1enven1d0_al_l4do_oscuro}\nLo lograste. Sigue cavando.' },
                                'notas.md': { type: 'file', perms: 'rw-r--r--',
                                    content: '# Notas\n- Revisar logs en ~/logs\n- backup.sh no corre, checar permisos.' }
                            }},
                        logs: { type: 'dir', perms: 'rwxr-xr-x', children: {
                                'auth.log': { type: 'file', perms: 'rw-r--r--',
                                    content:
                                        `Oct 14 09:01 srv sshd[201]: Accepted publickey for gael from 10.0.0.5
Oct 14 09:14 srv sshd[244]: Failed password for invalid user admin from 45.33.12.7
Oct 14 09:15 srv sshd[244]: Failed password for invalid user root from 45.33.12.7
Oct 14 09:21 srv app[300]: DEBUG db_password=Sup3rS3cret_db! cargada desde env
Oct 14 09:30 srv sshd[401]: Accepted password for backupuser from 10.0.0.9` },
                                'access.log': { type: 'file', perms: 'rw-r--r--',
                                    content: '10.0.0.5 "GET /index.html" 200\n45.33.12.7 "GET /admin\' OR \'1\'=\'1" 403' }
                            }},
                        scripts: { type: 'dir', perms: 'rwxr-xr-x', children: {
                                'backup.sh': { type: 'file', perms: 'rw-r--r--',
                                    content: '#!/bin/bash\necho "respaldando..."\n# necesita chmod +x' }
                            }}
                    }}
            }},
        etc: { type: 'dir', perms: 'rwxr-xr-x', children: {
                passwd: { type: 'file', perms: 'rw-r--r--',
                    content: 'root:x:0:0:root:/root:/bin/bash\ngael:x:1000:1000:gael:/home/gael:/bin/bash' }
            }}
    }
})

/* ---- comandos ---- */
const commands = {
    whoami: () => ({ out: ['gael'] }),

    pwd: (a, env) => ({ out: ['/' + env.cwd.join('/')], events: [{ t: 'pwd' }] }),

    ls: (args, env) => {
        const flags = args.filter(x => x.startsWith('-'))
        const ops = args.filter(x => !x.startsWith('-'))
        const target = ops[0] ? resolvePath(env.cwd, ops[0]) : env.cwd
        const node = getNode(env.fs, target)
        if (!node) return { out: [`ls: no existe '${ops[0]}'`] }
        if (node.type === 'file') return { out: [ops[0]] }
        const all = flags.some(f => f.includes('a'))
        const long = flags.some(f => f.includes('l'))
        let names = Object.keys(node.children).filter(n => all || !n.startsWith('.')).sort()
        const out = names.length === 0 ? ['(vacío)']
            : long ? names.map(n => {
                    const c = node.children[n]
                    return `${c.type === 'dir' ? 'd' : '-'}${c.perms}  gael  ${c.type === 'dir' ? n + '/' : n}`
                })
                : [names.map(n => (node.children[n].type === 'dir' ? n + '/' : n)).join('   ')]
        return { out, events: [{ t: 'ls' }] }
    },

    cd: (args, env) => {
        if (!args[0]) return { out: [], env: { ...env, cwd: ['home', 'gael'] } }
        const target = resolvePath(env.cwd, args[0])
        const node = getNode(env.fs, target)
        if (!node) return { out: [`cd: no existe '${args[0]}'`] }
        if (node.type !== 'dir') return { out: [`cd: '${args[0]}' no es un directorio`] }
        return { out: [], env: { ...env, cwd: target }, events: [{ t: 'cd', path: '/' + target.join('/') }] }
    },

    cat: (args, env) => {
        if (!args[0]) return { out: ['cat: falta archivo'] }
        const target = resolvePath(env.cwd, args[0])
        const node = getNode(env.fs, target)
        if (!node) return { out: [`cat: ${args[0]}: no existe`] }
        if (node.type === 'dir') return { out: [`cat: ${args[0]}: es un directorio`] }
        return { out: node.content.split('\n'), events: [{ t: 'read', path: '/' + target.join('/') }] }
    },

    grep: (args, env) => {
        const ops = args.filter(x => !x.startsWith('-'))
        if (ops.length < 2) return { out: ['uso: grep <patrón> <archivo>'] }
        const target = resolvePath(env.cwd, ops[1])
        const node = getNode(env.fs, target)
        if (!node || node.type !== 'file') return { out: [`grep: ${ops[1]}: no es un archivo`] }
        const matches = node.content.split('\n').filter(l => l.toLowerCase().includes(ops[0].toLowerCase()))
        return {
            out: matches.length ? matches : ['(sin coincidencias)'],
            events: [{ t: 'grep', pattern: ops[0], path: '/' + target.join('/'), matched: matches.length > 0 }]
        }
    },

    find: (args, env) => {
        const start = args[0] && !args[0].startsWith('-') ? resolvePath(env.cwd, args[0]) : env.cwd
        const ni = args.indexOf('-name')
        const pat = ni >= 0 ? args[ni + 1] : '*'
        const re = wildcard(pat)
        const node = getNode(env.fs, start)
        if (!node) return { out: [`find: ruta inválida`] }
        const found = []
        const walk = (n, path) => {
            const base = path[path.length - 1] || ''
            if (re.test(base)) found.push('/' + path.join('/'))
            if (n.type === 'dir') Object.keys(n.children).forEach(c => walk(n.children[c], [...path, c]))
        }
        walk(node, start)
        return { out: found.length ? found : ['(nada encontrado)'], events: [{ t: 'find', name: pat, results: found }] }
    },

    chmod: (args, env) => {
        if (args.length < 2) return { out: ['uso: chmod <modo> <archivo>   (ej: chmod +x backup.sh)'] }
        const target = resolvePath(env.cwd, args[1])
        const fs = structuredClone(env.fs)
        const node = getNode(fs, target)
        if (!node) return { out: [`chmod: ${args[1]}: no existe`] }
        let perms = node.perms.split('')
        if (args[0] === '+x') [2, 5, 8].forEach(i => (perms[i] = 'x'))
        else if (args[0] === '-x') [2, 5, 8].forEach(i => (perms[i] = '-'))
        else if (/^[0-7]{3}$/.test(args[0])) {
            const map = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx']
            perms = args[0].split('').map(d => map[+d]).join('').split('')
        } else return { out: [`chmod: modo inválido '${args[0]}'`] }
        node.perms = perms.join('')
        return { out: [`permisos de ${args[1]} → ${node.perms}`], env: { ...env, fs }, events: [{ t: 'chmod', path: '/' + target.join('/'), perms: node.perms }] }
    },

    echo: (args, env) => {
        const ri = args.indexOf('>')
        if (ri < 0) return { out: [args.join(' ')] }
        const text = args.slice(0, ri).join(' ')
        const target = resolvePath(env.cwd, args[ri + 1])
        const fs = structuredClone(env.fs)
        const parent = getNode(fs, target.slice(0, -1))
        if (!parent || parent.type !== 'dir') return { out: ['echo: ruta inválida'] }
        parent.children[target[target.length - 1]] = { type: 'file', perms: 'rw-r--r--', content: text }
        return { out: [], env: { ...env, fs }, events: [{ t: 'write' }] }
    },

    mkdir: (args, env) => {
        if (!args[0]) return { out: ['mkdir: falta nombre'] }
        const target = resolvePath(env.cwd, args[0])
        const fs = structuredClone(env.fs)
        const parent = getNode(fs, target.slice(0, -1))
        if (!parent || parent.type !== 'dir') return { out: ['mkdir: ruta inválida'] }
        parent.children[target[target.length - 1]] = { type: 'dir', perms: 'rwxr-xr-x', children: {} }
        return { out: [], env: { ...env, fs } }
    },

    rm: (args, env) => {
        if (!args[0]) return { out: ['rm: falta archivo'] }
        const target = resolvePath(env.cwd, args[0])
        const fs = structuredClone(env.fs)
        const parent = getNode(fs, target.slice(0, -1))
        const nm = target[target.length - 1]
        if (!parent || !parent.children[nm]) return { out: [`rm: ${args[0]}: no existe`] }
        delete parent.children[nm]
        return { out: [], env: { ...env, fs } }
    },

    tree: (a, env) => {
        const out = ['.']
        const start = getNode(env.fs, env.cwd)
        const draw = (n, prefix) => {
            const keys = Object.keys(n.children).filter(k => !k.startsWith('.')).sort()
            keys.forEach((k, i) => {
                const last = i === keys.length - 1
                out.push(prefix + (last ? '└── ' : '├── ') + k)
                if (n.children[k].type === 'dir') draw(n.children[k], prefix + (last ? '    ' : '│   '))
            })
        }
        if (start) draw(start, '')
        return { out }
    },

    man: args => {
        const docs = {
            ls: 'ls — lista archivos. -l detalle, -a incluye ocultos.',
            cd: 'cd — cambia de carpeta. cd .. sube, cd ~ va a tu home.',
            cat: 'cat — muestra el contenido de un archivo.',
            grep: 'grep <patrón> <archivo> — busca texto dentro de un archivo.',
            find: 'find <ruta> -name <patrón> — busca por nombre (* es comodín).',
            chmod: 'chmod — cambia permisos. +x da ejecución, o usa números (755, 644).',
            pwd: 'pwd — muestra en qué carpeta estás.'
        }
        return { out: [docs[args[0]] || `man: sin página para '${args[0] || ''}'`] }
    },

    sudo: () => ({ out: ['gael no está en el sudoers file. Este incidente será reportado. 🚨'] })
}

/* ---- misiones ---- */
const missions = [
    { id: 'lx1', title: 'Reconoce el terreno', xp: 40,
        brief: 'Antes de hackear nada, sé dónde estás parado. Como entrar a una casa a oscuras: primero tanteas las paredes.',
        obj: 'Usa pwd para ver tu ubicación y ls para listar.',
        hint: 'pwd\nls',
        check: ev => ev.some(e => e.t === 'pwd') && ev.some(e => e.t === 'ls') },
    { id: 'lx2', title: 'Sigue las migajas', xp: 60,
        brief: 'Hay una carpeta "secretos". Entra y lee la flag. Las flags son tu trofeo en cualquier CTF.',
        obj: 'Entra a secretos y lee flag.txt.',
        hint: 'cd secretos\ncat flag.txt',
        check: ev => ev.some(e => e.t === 'read' && e.path === '/home/gael/secretos/flag.txt') },
    { id: 'lx3', title: 'Archivos fantasma', xp: 60,
        brief: 'Los archivos que empiezan con punto están ocultos. Los atacantes esconden cosas ahí.',
        obj: 'Lista los ocultos de tu home y lee .bash_history.',
        hint: 'cd ~\nls -a\ncat .bash_history',
        check: ev => ev.some(e => e.t === 'read' && e.path === '/home/gael/.bash_history') },
    { id: 'lx4', title: 'El soplón en los logs', xp: 80,
        brief: 'Los logs son las cámaras del sistema. Alguien dejó una contraseña tirada en auth.log.',
        obj: 'Usa grep para buscar "password" en ~/logs/auth.log.',
        hint: 'cd ~/logs\ngrep password auth.log',
        check: ev => ev.some(e => e.t === 'grep' && e.path === '/home/gael/logs/auth.log' && e.matched) },
    { id: 'lx5', title: 'Cacería', xp: 70,
        brief: 'No siempre sabes DÓNDE está un archivo. find lo rastrea por todo el sistema, como un sabueso.',
        obj: 'Encuentra backup.sh empezando desde tu home (~).',
        hint: 'find ~ -name backup.sh',
        check: ev => ev.some(e => e.t === 'find' && e.results.some(r => r.endsWith('/backup.sh'))) },
    { id: 'lx6', title: 'Permisos peligrosos', xp: 90,
        brief: 'En Linux un archivo solo se ejecuta si tiene permiso "x". Mal configurado = puerta abierta.',
        obj: 'Dale ejecución a scripts/backup.sh con chmod.',
        hint: 'cd ~/scripts\nchmod +x backup.sh',
        check: (ev, env) => { const n = getNode(env.fs, ['home', 'gael', 'scripts', 'backup.sh']); return n && n.perms.includes('x') } }
]

export default {
    id: 'linux', icon: '🐧', name: 'Linux Fundamentals', sub: 'Terminal, permisos, logs',
    initEnv: () => ({ fs: initFS(), cwd: ['home', 'gael'] }),
    prompt: env => `gael@cyberlab:${pretty(env.cwd)}$`,
    intro: ['Módulo LINUX cargado. Eres gael@cyberlab.', "Escribe 'help' para los comandos. Misión actual a la izquierda."],
    commands, missions
}