/* ============================================================================
   MÓDULO: Windows
   Simulador de administración Windows: usuarios, servicios, permisos NTFS,
   PowerShell, Event Viewer. env = { users, services, files, registry }
============================================================================ */

const initEnv = () => ({
    users: {
        Administrator: { rid: 500, groups: ['Administrators'], enabled: true, locked: false },
        Guest: { rid: 501, groups: ['Guests'], enabled: false, locked: false },
        gael: { rid: 1000, groups: ['Users'], enabled: true, locked: false },
        'backup-svc': { rid: 1001, groups: ['Users'], enabled: true, locked: false, note: 'servicio sin privilegios' }
    },
    services: {
        'sshd': { status: 'Running', starttype: 'Automatic', user: 'LocalSystem', perms: 'dangerous' },
        'mysql': { status: 'Running', starttype: 'Automatic', user: 'gael', perms: 'ok' },
        'webs': { status: 'Stopped', starttype: 'Disabled', user: 'NetworkService' }
    },
    files: [
        { path: 'C:\\Users\\Administrator\\Desktop\\flag.txt', owner: 'Administrator', perms: 'NTFS: (F) Administrators', content: 'FLAG{4dm1n_s3cr3t_f0und}' },
        { path: 'C:\\Users\\gael\\Documents\\notes.txt', owner: 'gael', perms: 'NTFS: (F) gael, (R) Everyone', content: 'contraseña del db en ..\\..\\AppData\\Local\\backup.txt' },
        { path: 'C:\\Windows\\System32\\drivers\\etc\\hosts', owner: 'SYSTEM', perms: 'NTFS: (F) SYSTEM, (R) Administrators', content: '127.0.0.1 localhost\n# spoofing: 10.0.0.1 malicioushost' }
    ]
})

const commands = {
    whoami: () => ({ out: ['DESKTOP-ABC\\gael'] }),

    'Get-LocalUser': (args, env) => {
        const out = ['Name                 Enabled  Locked']
        Object.entries(env.users).forEach(([name, u]) => {
            out.push(`${name.padEnd(20)} ${u.enabled ? 'True' : 'False'}   ${u.locked ? 'True' : 'False'}`)
        })
        return { out, events: [{ t: 'enum', what: 'users' }] }
    },

    'Get-Service': (args, env) => {
        const filter = args[0]
        const out = ['Status   Name          DisplayName']
        Object.entries(env.services).forEach(([name, svc]) => {
            if (filter && !name.includes(filter)) return
            out.push(`${svc.status.padEnd(8)} ${name.padEnd(13)} ${name}`)
        })
        return { out, events: [{ t: 'enum', what: 'services' }] }
    },

    'icacls': (args, env) => {
        const path = args[0]
        if (!path) return { out: ['uso: icacls <path>'] }
        const file = env.files.find(f => f.path.toLowerCase() === path.toLowerCase())
        if (!file) return { out: [`${path}: no existe`] }
        return { out: [`${path}`, `Owner: ${file.owner}`, file.perms], events: [{ t: 'check_perms', path }] }
    },

    'type': (args, env) => {
        const path = args[0]
        if (!path) return { out: ['uso: type <archivo>'] }
        const file = env.files.find(f => f.path.toLowerCase() === path.toLowerCase())
        if (!file) return { out: [`no existe '${path}'`] }
        return { out: file.content.split('\n'), events: [{ t: 'read_file', path }] }
    },

    'Get-EventLog': (args, env) => {
        const logname = args[0] || 'System'
        if (logname === 'Security') {
            return {
                out: ['Index Time          Source         Event ID Message',
                    '  101  09:14  Security       4625     Failed logoff: user=backup-svc (brute force attempt)',
                    '  102  09:15  Security       4688     New process: sshd.exe running as LocalSystem (!!)',
                    '  103  10:22  Security       4720     User created: unknown_user (SUSPICIOUS)'],
                events: [{ t: 'check_logs', log: 'Security' }]
            }
        }
        return { out: [`Get-EventLog: log '${logname}' no encontrado`] }
    },

    'cmd': (args, env) => {
        return { out: ['C:\\Users\\gael>', 'PowerShell para Windows. Pero estás en un simulador, así que solo ciertos cmdlets funcionan.'] }
    },

    'help': () => ({ out: ['Cmdlets Windows disponibles:', '  Get-LocalUser  Get-Service  icacls  type  Get-EventLog  help  whoami'] })
}

const missions = [
    {
        id: 'win1', title: 'Enumera usuarios locales', xp: 60,
        brief: 'En Windows, el administrador empieza enumerando quién tiene acceso. Get-LocalUser te lista todos.',
        obj: 'Ejecuta Get-LocalUser y observa qué cuentas existen.',
        hint: 'Get-LocalUser',
        check: ev => ev.some(e => e.t === 'enum' && e.what === 'users')
    },
    {
        id: 'win2', title: 'Descubre servicios peligrosos', xp: 80,
        brief: 'Los servicios corren con privilegios. Si uno corre como SYSTEM y es modificable, es RCE. sshd corriendo como LocalSystem es sospechoso.',
        obj: 'Lista los servicios y nota cuál está configurado de forma peligrosa.',
        hint: 'Get-Service',
        check: ev => ev.some(e => e.t === 'enum' && e.what === 'services')
    },
    {
        id: 'win3', title: 'Explora permisos NTFS', xp: 70,
        brief: 'NTFS es el sistema de permisos de Windows. (F)=Full, (M)=Modify, (R)=Read. Si un archivo crítico tiene (M) para Everyone, es vulnerable.',
        obj: 'Revisa los permisos de C:\\Users\\Administrator\\Desktop\\flag.txt con icacls.',
        hint: 'icacls "C:\\Users\\Administrator\\Desktop\\flag.txt"',
        check: ev => ev.some(e => e.t === 'check_perms' && e.path.toLowerCase().includes('flag.txt'))
    },
    {
        id: 'win4', title: 'Lee archivos en carpetas del usuario', xp: 70,
        brief: 'Los usuarios guardan secretos en sus carpetas. AppData es donde se sincronizan credenciales y backups de aplicaciones.',
        obj: 'Lee C:\\Users\\gael\\Documents\\notes.txt y descubre dónde está la verdadera contraseña.',
        hint: 'type "C:\\Users\\gael\\Documents\\notes.txt"',
        check: ev => ev.some(e => e.t === 'read_file' && e.path.toLowerCase().includes('notes.txt'))
    },
    {
        id: 'win5', title: 'Analiza Security Event Log', xp: 100,
        brief: 'El Security log es tu fuente de verdad: quién falló, qué proceso se ejecutó indebidamente, si hubo escalada. Aquí está TODO.',
        obj: 'Abre Get-EventLog Security y nota los intentos fallidos y el proceso sospechoso.',
        hint: 'Get-EventLog Security',
        check: ev => ev.some(e => e.t === 'check_logs' && e.log === 'Security')
    }
]

export default {
    id: 'windows', icon: '🪟', name: 'Windows Administration', sub: 'PowerShell, servicios, NTFS, Event Viewer',
    initEnv,
    prompt: () => 'PS C:\\Users\\gael>',
    intro: ['Módulo WINDOWS cargado. Estás en una máquina Windows con PowerShell.', 'Cmdlets clave: Get-LocalUser, Get-Service, icacls, Get-EventLog. Usa type <archivo> para leer archivos.'],
    commands, missions
}