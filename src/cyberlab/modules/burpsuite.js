/* ============================================================================
   MÓDULO: Burp Suite / Web Advanced
   Interceptación de tráfico, fuzzing, SQLi scanning, OWASP Top 10 profundo.
   env = { intercepted, payloads, findings }
============================================================================ */

const initEnv = () => ({
    target: 'http://vulnerable-app.local',
    intercepted: [
        { method: 'GET', url: '/login', params: { user: 'admin', pass: 'admin123' }, response_code: 200 },
        { method: 'POST', url: '/search', params: { q: '<script>alert(1)</script>' }, response_code: 200, reflected: true },
        { method: 'GET', url: '/profile?id=1', params: {}, response_code: 200, data: 'admin profile' },
        { method: 'GET', url: '/profile?id=2', params: {}, response_code: 403, data: 'forbidden' }
    ],
    findings: []
})

const commands = {
    'intercept-start': (args, env) => {
        const newEnv = structuredClone(env)
        return {
            out: ['[+] Burp Proxy interceptor iniciado en 127.0.0.1:8080',
                '[*] Configura tu navegador para usar este proxy',
                '[*] Abre http://vulnerable-app.local en el navegador',
                '[*] Las requests aparecerán aquí...'],
            env: newEnv,
            events: [{ t: 'intercept_start' }]
        }
    },

    'intercept-request': (args, env) => {
        const idx = parseInt(args[0]) || 0
        const req = env.intercepted[idx]
        if (!req) return { out: [`Request ${idx} no encontrada`] }
        return {
            out: [
                `[Intercepted] ${req.method} ${req.url}`,
                '',
                'Headers:',
                '  User-Agent: Mozilla/5.0...',
                '  Cookie: JSESSIONID=abc123...',
                '  Content-Type: application/x-www-form-urlencoded',
                '',
                'Body/Params:',
                Object.entries(req.params).map(([k, v]) => `  ${k}=${v}`).join('\n'),
                '',
                'Response: ' + req.response_code
            ],
            events: [{ t: 'intercept_req', idx }]
        }
    },

    'sqli-test': (args, env) => {
        const url = args[0] || '/profile?id='
        const payloads = ["'", "' OR '1'='1", "'; DROP TABLE users; --", "1 UNION SELECT NULL,username,password FROM users--"]
        const out = [`Testing SQLi en ${url}...`, '']
        payloads.forEach((p, i) => {
            const test_url = url + encodeURIComponent(p)
            out.push(`Payload ${i + 1}: ${p}`)
            out.push(`  → GET ${test_url}`)
            if (p.includes('UNION')) {
                out.push('  ✓ VULNERABLE: response contiene columnas inesperadas')
            } else if (p.includes('OR')) {
                out.push('  ⚠ Sospechoso: tiempo de respuesta anormalmente largo')
            }
        })
        const newEnv = structuredClone(env)
        newEnv.findings.push({ type: 'SQLi', url, severity: 'CRITICAL' })
        return { out, env: newEnv, events: [{ t: 'sqli_test' }] }
    },

    'xss-scan': (args, env) => {
        const url = args[0] || '/search?q='
        const out = [`Scanning XSS en ${url}...`, '']
        const payloads = [
            '<script>alert("XSS")</script>',
            '<img src=x onerror=alert(1)>',
            '"><script>alert(String.fromCharCode(88,83,83))</script>',
            '<svg onload=alert(document.domain)>'
        ]
        payloads.forEach((p, i) => {
            const test_url = url + encodeURIComponent(p)
            out.push(`Payload ${i + 1}: ${p}`)
            out.push(`  GET ${test_url}`)
            if (i === 0) {
                out.push('  ✓ VULNERABLE: payload reflejado en respuesta sin sanitizar')
            }
        })
        const newEnv = structuredClone(env)
        newEnv.findings.push({ type: 'XSS Reflected', url, severity: 'HIGH' })
        return { out, env: newEnv, events: [{ t: 'xss_scan' }] }
    },

    'csrf-detect': (args, env) => {
        return {
            out: [
                'CSRF Detection:',
                '',
                'POST /transfer-money',
                '  Form fields: to_account, amount',
                '  CSRF token: (none encontrado) ⚠ VULNERABLE',
                '',
                'Ataque posible:',
                '  1. Víctima logueada en banco.com',
                '  2. Haces click en link malicioso: attacker.com/csrf.html',
                '  3. Page contiene: <form action="banco.com/transfer">',
                '  4. Automáticamente envía dinero a tu cuenta',
                '',
                'Prevención: implementar CSRF tokens únicos por sesión'
            ],
            events: [{ t: 'csrf_detect' }]
        }
    },

    'fuzzer': (args, env) => {
        const path = args[0] || '/admin'
        const wordlist = ['login', 'users', 'config', 'backup', 'secret', 'debug', 'test', 'panel']
        const out = [`Fuzzing: GET ${path}/<wordlist>`, '']
        wordlist.forEach(word => {
            const status = [200, 404, 403, 500][Math.floor(Math.random() * 4)]
            const indicator = status === 200 ? '✓ FOUND' : (status === 403 ? '⚠' : '')
            out.push(`${word.padEnd(15)} → ${status} ${indicator}`)
        })
        out.push('', '⚠ Encontrados directorios: /admin/login (200), /admin/backup (403)')
        return { out, events: [{ t: 'fuzzer' }] }
    },

    'owasp-summary': (args, env) => {
        return {
            out: [
                '=== OWASP Top 10 Check ===',
                '',
                '✓ A01: Broken Access Control',
                '  Encontrado: /profile?id=2 → forbidden aunque no debería serlo (IDOR)',
                '',
                '✓ A02: Cryptographic Failures',
                '  Encontrado: Cookie sin HttpOnly/Secure, datos en URL sin HTTPS',
                '',
                '✓ A03: Injection (SQLi, Command Injection)',
                '  Encontrado: /profile?id= es injectable con UNION',
                '',
                '✓ A04: Insecure Design',
                '  Encontrado: sin CSRF tokens en forms',
                '',
                '✓ A07: Cross-Site Scripting (XSS)',
                '  Encontrado: /search?q= refleja input sin sanitizar',
                '',
                'Severidad general: CRITICAL (múltiples vulnerabilidades)',
                'Recomendación: no deployar a producción sin fixes.'
            ]
        }
    },

    'help': () => ({ out: ['Comandos Burp/Web disponibles:', '  intercept-start  intercept-request <n>  sqli-test <url>', '  xss-scan <url>  csrf-detect  fuzzer <path>  owasp-summary  help'] })
}

const missions = [
    {
        id: 'web1', title: 'Intercepta una request HTTP', xp: 60,
        brief: 'Burp actúa como man-in-the-middle: captura requests entre navegador y servidor. Así ves exactamente qué se envía (headers, cookies, params).',
        obj: 'Inicia el interceptor y revisa una request.',
        hint: 'intercept-start\nintercept-request 0',
        check: ev => ev.some(e => e.t === 'intercept_req')
    },
    {
        id: 'web2', title: 'Escanea SQLi con payloads', xp: 100,
        brief: 'SQLi es injection: si un parámetro entra directo a la query SQL sin validación, puedes robar datos o borrar tablas. Burp te automatiza testing de payloads.',
        obj: 'Corre sqli-test en /profile?id= para detectar la vulnerabilidad.',
        hint: 'sqli-test /profile?id=',
        check: ev => ev.some(e => e.t === 'sqli_test')
    },
    {
        id: 'web3', title: 'Detecta XSS Reflected', xp: 90,
        brief: 'XSS = si un parámetro se refleja en la respuesta sin sanitizar, puedes inyectar JavaScript que corre en la máquina de la víctima.',
        obj: 'Escanea XSS en /search?q=',
        hint: 'xss-scan /search?q=',
        check: ev => ev.some(e => e.t === 'xss_scan')
    },
    {
        id: 'web4', title: 'Identifica CSRF', xp: 70,
        brief: 'CSRF = Cross-Site Request Forgery. Sin tokens únicos, atacante puede hacer que víctima haga acciones en un sitio mientras está logueada en otro.',
        obj: 'Detecta vulnerabilidad CSRF en forms.',
        hint: 'csrf-detect',
        check: ev => ev.some(e => e.t === 'csrf_detect')
    }
]

export default {
    id: 'burpsuite', icon: '🕷️', name: 'Burp Suite / Web Advanced', sub: 'Interceptación, fuzzing, OWASP Top 10',
    initEnv,
    prompt: () => 'burp>',
    intro: ['Módulo BURP SUITE cargado. Burp es el estándar de la industria para web pentesting.',
        'Intercepta, modifica, fuzza requests. Encuentras vulnerabilidades que otros herramientas automáticas no ven.'],
    commands, missions
}