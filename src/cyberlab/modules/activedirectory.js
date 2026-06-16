/* ============================================================================
   MÓDULO: Active Directory
   Simulador de un dominio AD: usuarios, grupos, SPN, Kerberos, BloodHound.
   env = { domain, users, groups, computers, spns }
============================================================================ */

const initEnv = () => ({
    domain: 'acme.local',
    ip: '10.0.0.30',
    users: {
        'Administrator': { rid: 500, groups: ['Domain Admins', 'Enterprise Admins'], pwd_age: 45, spn: null, kerberoastable: false },
        'gael': { rid: 1106, groups: ['Domain Users'], pwd_age: 120, spn: null, kerberoastable: false },
        'sqlsvc': { rid: 1107, groups: ['Domain Users'], pwd_age: 999, spn: 'MSSQLSvc/db.acme.local:1433', kerberoastable: true, note: 'SPN = Kerberoastable!' },
        'websvc': { rid: 1108, groups: ['Domain Users'], pwd_age: 999, spn: 'HTTP/web.acme.local', kerberoastable: true },
        'backup': { rid: 1109, groups: ['Backup Operators', 'Domain Users'], pwd_age: 30, spn: null, kerberoastable: false }
    },
    groups: {
        'Domain Admins': ['Administrator'],
        'Backup Operators': ['backup'],
        'Domain Users': ['gael', 'sqlsvc', 'websvc', 'backup']
    },
    computers: {
        'DC01': { os: 'Windows Server 2019', ip: '10.0.0.30', role: 'Domain Controller' },
        'WEB01': { os: 'Windows Server 2019', ip: '10.0.0.10', role: 'Web Server' },
        'DB01': { os: 'Windows Server 2019', ip: '10.0.0.20', role: 'Database Server' }
    }
})

const commands = {
    'Get-ADUser': (args, env) => {
        const filter = args.find(a => a.startsWith('-Filter')) ? args[args.indexOf(args.find(a => a.startsWith('-Filter'))) + 1] : null
        const out = ['Name                 PasswordAge  Kerberoastable  SPN']
        Object.entries(env.users).forEach(([name, u]) => {
            if (filter && !name.includes(filter)) return
            const spn = u.spn ? u.spn : '(none)'
            out.push(`${name.padEnd(20)} ${u.pwd_age}d          ${u.kerberoastable ? 'YES ⚠' : 'no'}              ${spn}`)
        })
        return { out, events: [{ t: 'ad_enum', what: 'users' }] }
    },

    'Get-ADGroup': (args, env) => {
        const out = ['Name                 Members']
        Object.entries(env.groups).forEach(([name, members]) => {
            out.push(`${name.padEnd(20)} ${members.join(', ')}`)
        })
        return { out, events: [{ t: 'ad_enum', what: 'groups' }] }
    },

    'Get-ADComputer': (args, env) => {
        const out = ['Name     IP           OS                    Role']
        Object.entries(env.computers).forEach(([name, c]) => {
            out.push(`${name.padEnd(8)} ${c.ip.padEnd(12)} ${c.os.padEnd(21)} ${c.role}`)
        })
        return { out, events: [{ t: 'ad_enum', what: 'computers' }] }
    },

    'Get-ADGroupMember': (args, env) => {
        const group = args[0]
        if (!group || !env.groups[group]) return { out: [`Grupo '${group}' no encontrado.`] }
        const members = env.groups[group]
        return { out: ['Name', ...members], events: [{ t: 'ad_enum', what: 'groupmembers', group }] }
    },

    'Invoke-Kerberoast': (args, env) => {
        const kerberoastable = Object.entries(env.users).filter(([,u]) => u.kerberoastable)
        if (kerberoastable.length === 0) return { out: ['(sin SPNs kerberoastables)'] }
        const out = ['ServicePrincipalName              Hash (comienzo)']
        kerberoastable.forEach(([name, u]) => {
            out.push(`${u.spn.padEnd(32)} $krb5tgs$23$*${name}$...${(Math.random()*1000000|0).toString(16).slice(0,16)}*`)
        })
        out.push('', 'Estos hashes pueden crackearse offline con hashcat.')
        return { out, events: [{ t: 'kerberoast', count: kerberoastable.length }] }
    },

    'Get-BloodHoundData': (args, env) => {
        return {
            out: ['=== BloodHound Graph Summary ===',
                'Nodos: 4 computers, 5 usuarios, 4 grupos',
                '',
                'Camino más corto a Domain Admin:',
                '  gael → Backup Operators → backup (WriteProperty) → DC01',
                '  ^ este usuario está en Backup Operators que tiene WriteDacl en DC01',
                '',
                'SPNs kerberoastables:',
                '  MSSQLSvc/db.acme.local:1433 (sqlsvc)',
                '  HTTP/web.acme.local (websvc)',
                '  → Si crackeas estas contraseñas, tienes acceso a esos servicios.'],
            events: [{ t: 'bloodhound' }]
        }
    },

    'whoami': () => ({ out: ['acme\\gael'] }),

    'help': () => ({ out: ['AD cmdlets disponibles:', '  Get-ADUser  Get-ADGroup  Get-ADGroupMember  Get-ADComputer  Invoke-Kerberoast  Get-BloodHoundData  help  whoami'] })
}

const missions = [
    {
        id: 'ad1', title: 'Enumera usuarios del dominio', xp: 70,
        brief: 'En un dominio AD, Get-ADUser lista TODOS los usuarios. Busca cuál tiene SPN (Service Principal Name) — eso significa es kerberoastable.',
        obj: 'Ejecuta Get-ADUser y nota quién tiene SPN.',
        hint: 'Get-ADUser',
        check: ev => ev.some(e => e.t === 'ad_enum' && e.what === 'users')
    },
    {
        id: 'ad2', title: 'Mapea grupos y pertenencias', xp: 70,
        brief: 'Los grupos son tu mapa del poder. "Backup Operators" tiene permisos especiales. "Domain Admins" es lo máximo. Saber quién está dónde = tu camino al admin.',
        obj: 'Lista los grupos con Get-ADGroup.',
        hint: 'Get-ADGroup',
        check: ev => ev.some(e => e.t === 'ad_enum' && e.what === 'groups')
    },
    {
        id: 'ad3', title: 'Descubre SPNs kerberoastables', xp: 100,
        brief: 'Un SPN (Service Principal Name) vinculado a un usuario = Kerberoasting. Pides un ticket TGS al DC, lo crackeás offline y robas la contraseña del servicio. Es uno de los ataques más comunes en AD.',
        obj: 'Ejecuta Get-ADUser, identifica los SPNs y luego Invoke-Kerberoast para obtener los hashes.',
        hint: 'Get-ADUser\nInvoke-Kerberoast',
        check: ev => ev.some(e => e.t === 'kerberoast')
    },
    {
        id: 'ad4', title: 'Analiza la gráfica con BloodHound', xp: 90,
        brief: 'BloodHound es la herramienta que convierte AD en una gráfica de ataque. Te muestra automáticamente el camino más corto hacia Domain Admin aprovechando permisos débiles y relaciones entre objetos.',
        obj: 'Corre Get-BloodHoundData y analiza el camino de escalada sugerido.',
        hint: 'Get-BloodHoundData',
        check: ev => ev.some(e => e.t === 'bloodhound')
    },
    {
        id: 'ad5', title: 'Identifica el Backup Operator en riesgo', xp: 80,
        brief: 'El usuario "backup" está en "Backup Operators", que es un grupo peligroso porque puede leer y restaurar datos. Si puedes tomar control de "backup", puedes escalar a Domain Admin.',
        obj: 'Usa Get-ADGroupMember para ver quién es miembro de Backup Operators.',
        hint: 'Get-ADGroupMember -Identity "Backup Operators"',
        check: ev => ev.some(e => e.t === 'ad_enum' && e.what === 'groupmembers' && e.group === 'Backup Operators')
    }
]

export default {
    id: 'activedirectory', icon: '🔓', name: 'Active Directory', sub: 'Kerberos, LDAP, Kerberoasting, BloodHound',
    initEnv,
    prompt: () => 'PS C:\\Users\\gael> (acme.local)\\',
    intro: ['Módulo ACTIVE DIRECTORY cargado. Te conectaste al dominio acme.local (DC: 10.0.0.30).', 'Aquí está el corazón de una red corporativa: usuarios, grupos, servicios, permisos. Kerberos governa todo.'],
    commands, missions
}