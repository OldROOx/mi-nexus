/* ============================================================================
   MÓDULO: OSINT (Open Source Intelligence)
   Google Dorking, WHOIS, Shodan, Recon-ng. env = { targets, results }
============================================================================ */

const initEnv = () => ({
    company: 'acme.com',
    results: []
})

const commands = {
    'google-dork': (args, env) => {
        const query = args.join(' ')
        if (!query) return { out: ['uso: google-dork <query>', 'Ejemplos:', '  site:acme.com filetype:pdf', '  inurl:admin acme.com', '  "acme.com" intext:password'] }
        const dorks = {
            'site:acme.com filetype:pdf': ['internal-report-q3-2023.pdf', 'employee-handbook.pdf', 'financial-projections.pdf (⚠ sensible)'],
            'inurl:admin acme.com': ['acme.com/admin/login', 'acme.com/admin/users', 'acme.com/admin/logs (⚠ no protegido)'],
            '"acme.com" intext:password': ['Forum post: "forgot acme.com password"', 'GitHub commit: "password=xyz for acme.com"'],
            'site:linkedin.com acme.com': ['Empleados enumerados: 247 conexiones', 'CTO, 5 ingenieros, 3 especialistas en seguridad']
        }
        const hits = Object.entries(dorks).filter(([k]) => k.toLowerCase() === query.toLowerCase())
        if (hits.length === 0) return { out: ['(sin resultados relevantes)'] }
        const out = [`Dorking: "${query}"`]
        hits[0][1].forEach(r => out.push(`  - ${r}`))
        return { out, events: [{ t: 'osint_dork', query }] }
    },

    'whois': (args, env) => {
        const domain = args[0] || 'acme.com'
        return {
            out: [
                `WHOIS info para ${domain}:`,
                '  Registrar: GoDaddy',
                '  Registrant: ACME Corp (privado)',
                '  Admin Email: admin@acme.com',
                '  Name Servers: ns1.acme.com, ns2.acme.com',
                '  Created: 2010-03-15',
                '  Expires: 2025-03-15',
                '  Status: Active'
            ],
            events: [{ t: 'osint_whois', domain }]
        }
    },

    'shodan': (args, env) => {
        const query = args.join(' ') || 'acme.com'
        if (!query) return { out: ['uso: shodan <query>  ej: shodan "acme.com"'] }
        return {
            out: [
                `Shodan results para "${query}":`,
                '',
                'IP: 104.21.45.67 (web.acme.com)',
                '  → Apache 2.4.49 (vulnerable CVE-2021-41773)',
                '  → OpenSSH 8.2p1',
                '  → GeoIP: USA',
                '',
                'IP: 10.0.0.20 (db.acme.com)  - probablemente interno',
                '  → MySQL 5.7.38',
                '',
                'IP: 10.0.0.30 (dc.acme.com)  - controlador de dominio',
                '  → Windows Server 2019',
                '  → SMB/Kerberos activos',
                '',
                '⚠ 3 hosts encontrados. Los 2 internos sugieren mala segmentación de red.'
            ],
            events: [{ t: 'osint_shodan', query }]
        }
    },

    'dns-enum': (args, env) => {
        const domain = args[0] || 'acme.com'
        return {
            out: [
                `DNS Enumeration para ${domain}:`,
                '',
                'A Records:',
                '  acme.com              → 104.21.45.67 (web)',
                '  www.acme.com          → 104.21.45.67',
                '  mail.acme.com         → 104.21.45.68 (mailserver)',
                '  ftp.acme.com          → 104.21.45.69 (FTP, deprecated)',
                '',
                'MX Records:',
                '  mail.acme.com (priority 10)',
                '',
                'CNAME Records:',
                '  blog.acme.com         → acme.wordpress.com (WordPress blog)',
                '',
                'SPF: v=spf1 include:_spf.google.com ~all',
                'DMARC: (no encontrado - riesgo de spoofing)',
                '',
                '⚠ Encontramos: servidor FTP deprecado, DMARC no configurado.'
            ],
            events: [{ t: 'osint_dns', domain }]
        }
    },

    'email-enum': (args, env) => {
        const domain = args[0] || 'acme.com'
        return {
            out: [
                `Email Enumeration para ${domain}:`,
                '',
                'Emails enumerados (fuentes públicas):',
                '  john.smith@acme.com (LinkedIn)',
                '  admin@acme.com (WHOIS)',
                '  noreply@acme.com (website)',
                '  support@acme.com (contact form)',
                '  careers@acme.com (jobs page)',
                '  security@acme.com (inferred)',
                '',
                'Patrón detectado: firstname.lastname@acme.com',
                '⚠ Potencial diccionario de usuarios para phishing o fuerza bruta.'
            ],
            events: [{ t: 'osint_emails', domain }]
        }
    },

    'recon-summary': (args, env) => {
        return {
            out: [
                '=== OSINT Reconnaissance Summary ===',
                '',
                'Empresa: ACME Corp',
                'Dominio principal: acme.com',
                'Empleados públicos: 247 (LinkedIn)',
                '',
                'Infrastructure:',
                '  - Hosting: GoDaddy (shared IP 104.21.45.67)',
                '  - Web server: Apache 2.4.49 (vulnerable)',
                '  - DNS: ns1/ns2.acme.com (autodns)',
                '  - Mail: mail.acme.com',
                '  - Blog: WordPress (acme.wordpress.com)',
                '',
                'Vulnerabilidades encontradas:',
                '  1. Apache 2.4.49 (CVE-2021-41773) - RCE posible',
                '  2. FTP server activo (protocolo antiguo sin encriptación)',
                '  3. DMARC no configurado - riesgo de spoofing de email',
                '  4. WHOIS privado pero admin@acme.com expuesto',
                '',
                'Recomendación: Pasar a Red Team phase (actual explotación).'
            ]
        }
    },

    'help': () => ({ out: ['Comandos OSINT disponibles:', '  google-dork <query>  whois <domain>  shodan <query>', '  dns-enum <domain>  email-enum <domain>  recon-summary  help'] })
}

const missions = [
    {
        id: 'osint1', title: 'Google Dorking', xp: 60,
        brief: 'Google es una base de datos gigante de índices. Con operadores especiales (site:, filetype:, intext:), encuentras secretos: PDFs privados, paneles admin, etc.',
        obj: 'Usa google-dork para buscar archivos PDF en el sitio de acme.com.',
        hint: 'google-dork site:acme.com filetype:pdf',
        check: ev => ev.some(e => e.t === 'osint_dork')
    },
    {
        id: 'osint2', title: 'WHOIS Lookup', xp: 50,
        brief: 'WHOIS te dice quién registró un dominio, cuándo expira, y a veces emails de contacto. A menudo hay detalles que no querían publicar.',
        obj: 'Revisa WHOIS de acme.com.',
        hint: 'whois acme.com',
        check: ev => ev.some(e => e.t === 'osint_whois')
    },
    {
        id: 'osint3', title: 'Shodan Scanning', xp: 70,
        brief: 'Shodan crawlea internet buscando servidores, routers, cámaras con puertos abiertos. Te muestra versiones de software expuestas y direcciones IP de infraestructura.',
        obj: 'Busca en Shodan para encontrar los hosts de acme.com.',
        hint: 'shodan acme.com',
        check: ev => ev.some(e => e.t === 'osint_shodan')
    },
    {
        id: 'osint4', title: 'Enumeración DNS', xp: 70,
        brief: 'DNS enumeration revela subredes, mailservers, CNAME aliases, DMARC/SPF status. Te da un mapa completo sin tocar un servidor.',
        obj: 'Enumera los registros DNS de acme.com.',
        hint: 'dns-enum acme.com',
        check: ev => ev.some(e => e.t === 'osint_dns')
    }
]

export default {
    id: 'osint', icon: '🔎', name: 'OSINT', sub: 'Google Dorking, WHOIS, Shodan, DNS enum',
    initEnv,
    prompt: () => 'osint>',
    intro: ['Módulo OSINT cargado. OSINT = Open Source INTelligence: información pública.',
        'No necesitas hackear nada. Simplemente recolectas datos públicos que ya están disponibles.'],
    commands, missions
}