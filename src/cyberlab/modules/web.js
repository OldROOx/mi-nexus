/* ============================================================================
   MÓDULO: Seguridad Web (OWASP)
   Simulador de un servidor web vulnerable accedido con curl.
   Cubre: recon, SQL Injection, IDOR (Broken Access Control) y XSS reflejado.
============================================================================ */

const HOST = 'http://10.0.0.10'

/* normaliza un string para detectar payloads aunque varíe el espaciado/mayúsculas */
const norm = s => decodeURIComponent(s || '').toLowerCase().replace(/\s+/g, '')

/* parsea "http://host/ruta?a=1&b=2" -> { path, query:{a,b} } */
function parseUrl(raw) {
    let u = raw.replace(/^https?:\/\/[^/]+/, '') || '/'
    const [path, qs] = u.split('?')
    const query = {}
    if (qs) qs.split('&').forEach(kv => {
        const i = kv.indexOf('=')
        if (i >= 0) query[kv.slice(0, i)] = kv.slice(i + 1)
        else query[kv] = ''
    })
    return { path: path || '/', query }
}

function route({ path, query }) {
    /* --- home --- */
    if (path === '/' || path === '/index.html') {
        return ['<html> ACME Corp </html>', 'Enlaces visibles:', '  /login?user=&pass=', '  /account?id=1   (tu perfil)', '  /search?q=', '  /product?id=1']
    }

    /* --- login: vulnerable a SQL injection --- */
    if (path === '/login') {
        const u = norm(query.user)
        const sqli = u.includes("'or'1'='1") || u.includes("'or1=1") || u.includes("'or'1'='1'--") || /'or'?.+=.+/.test(u)
        if (sqli) {
            return ['HTTP/1.1 200 OK', '', 'Login correcto. Bienvenido, admin.',
                "La consulta era:  SELECT * FROM users WHERE user='"+ (query.user||'') +"' AND pass='...'",
                'Tu input cerró la comilla y agregó OR 1=1 → la condición SIEMPRE es verdadera.',
                'FLAG{sqli_byp4ss_l0gin}']
        }
        if (query.user) return ['HTTP/1.1 401 Unauthorized', '', 'Usuario o contraseña inválidos.']
        return ['HTTP/1.1 200 OK', '', 'Formulario de login. Manda user= y pass=.']
    }

    /* --- account: vulnerable a IDOR --- */
    if (path === '/account') {
        const id = query.id
        const users = {
            '1': ['id=1  user=gael  rol=user', 'Nada interesante en tu propia cuenta.'],
            '2': ['id=2  user=admin  rol=ADMIN', 'api_key=AK-9f2c...  hash=$2y$10$abc...',
                'Cambiaste el id a 2 y viste datos de OTRO usuario sin permiso. Eso es IDOR.',
                'FLAG{idor_4cc3ss_pwn3d}'],
            '3': ['id=3  user=backup  rol=service', 'cuenta de servicio.']
        }
        if (!id) return ['HTTP/1.1 400', '', 'Falta ?id=']
        return ['HTTP/1.1 200 OK', '', ...(users[id] || [`id=${id}: usuario no encontrado.`])]
    }

    /* --- search: vulnerable a XSS reflejado --- */
    if (path === '/search') {
        const q = decodeURIComponent(query.q || '')
        const out = ['HTTP/1.1 200 OK', '', `Resultados para: ${q}`]
        if (/<script|onerror=|<img|<svg|alert\(/i.test(q)) {
            out.push('', '⚠ Tu input se reflejó SIN sanitizar dentro del HTML.',
                'Un navegador real EJECUTARÍA ese código → XSS reflejado confirmado.',
                'FLAG{xss_r3fl3ct3d}')
        }
        return out
    }

    /* --- product --- */
    if (path === '/product') {
        return ['HTTP/1.1 200 OK', '', `Producto #${query.id || '?'}: Router ACME X1 — $899`, 'Tip: prueba a manipular otros parámetros del sitio.']
    }

    return ['HTTP/1.1 404 Not Found', '', `La ruta ${path} no existe.`]
}

const commands = {
    whoami: () => ({ out: ['attacker@kali'] }),

    curl: args => {
        const url = args.find(x => !x.startsWith('-'))
        if (!url) return { out: ['uso: curl "<url>"   ej: curl "http://10.0.0.10/"'] }
        const parsed = parseUrl(url)
        const out = route(parsed)
        const ev = { t: 'http', path: parsed.path, query: parsed.query }
        // marca explotaciones para las misiones
        if (out.some(l => l.includes('FLAG{sqli'))) ev.sqli = true
        if (out.some(l => l.includes('FLAG{idor'))) ev.idor = true
        if (out.some(l => l.includes('FLAG{xss'))) ev.xss = true
        return { out, events: [ev] }
    },

    man: args => {
        const docs = {
            curl: 'curl "<url>" — hace una petición HTTP y muestra la respuesta. Mete payloads en los parámetros (?param=...).',
        }
        return { out: [docs[args[0]] || `man: sin página para '${args[0] || ''}'`] }
    }
}

const missions = [
    { id: 'wb1', title: 'Reconocimiento web', xp: 50,
        brief: 'Nunca ataques a ciegas. Primero lee la página: qué rutas y parámetros expone. La superficie de ataque son todos los puntos donde puedes meter datos.',
        obj: 'Haz una petición a la raíz del sitio 10.0.0.10.',
        hint: 'curl "http://10.0.0.10/"',
        check: ev => ev.some(e => e.t === 'http' && e.path === '/') },
    { id: 'wb2', title: 'SQL Injection', xp: 110,
        brief: 'El login arma una consulta SQL pegando tu texto directo. Si cierras la comilla y agregas OR \'1\'=\'1\', la condición siempre es verdadera y entras sin contraseña. #1 del OWASP por años.',
        obj: 'Burla el login del sitio inyectando SQL en el parámetro user.',
        hint: 'curl "http://10.0.0.10/login?user=admin\' OR \'1\'=\'1&pass=x"',
        check: ev => ev.some(e => e.sqli) },
    { id: 'wb3', title: 'IDOR — Broken Access Control', xp: 100,
        brief: 'Muchas apps muestran datos según un id en la URL pero NO revisan si ese dato es tuyo. Cambias id=1 por id=2 y ves la cuenta de otro. Suena tonto, pero es de los bugs más comunes y caros.',
        obj: 'Accede a la cuenta del usuario id=2 (que no es tuya).',
        hint: 'curl "http://10.0.0.10/account?id=2"',
        check: ev => ev.some(e => e.idor) },
    { id: 'wb4', title: 'XSS reflejado', xp: 100,
        brief: 'Si el sitio te devuelve tu propio texto dentro del HTML sin limpiarlo, puedes inyectar <script> y el navegador de la víctima lo ejecuta. Sirve para robar sesiones. La sanitización de entradas lo evita.',
        obj: 'Inyecta un <script> en el buscador y confirma que se refleja.',
        hint: 'curl "http://10.0.0.10/search?q=<script>alert(1)</script>"',
        check: ev => ev.some(e => e.xss) }
]

export default {
    id: 'web', icon: '🕷️', name: 'Seguridad Web', sub: 'OWASP: SQLi, IDOR, XSS',
    initEnv: () => ({ host: HOST }),
    prompt: () => 'attacker@kali:~$',
    intro: ['Módulo WEB cargado. Objetivo: ' + HOST,
        'Herramienta: curl. Mete payloads en los parámetros de la URL. help para más.'],
    commands, missions
}