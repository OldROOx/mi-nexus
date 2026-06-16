/* ============================================================================
   MÓDULO: Criptografía
   Hashing, ciphers simétricos, asimétricos, digital signatures, certificados.
   env = { hashes, keys, certificates }
============================================================================ */

const initEnv = () => ({
    hashes: {
        'password123': { md5: '482c811da5d5b4bc6d497ffa98491e38', sha256: 'ef92b778bafe771e89245d171bafed6f07bac4290d1e3b6fce9c2f748ee1e8ae', comment: 'MD5 es débil, SHA256 es fuerte' },
        'P@ssw0rd!': { md5: 'a4a88db8dc3e654670b7947e4ff5bb08', sha256: '7c4a8d09ca3762af61e59520943dc26494f8941b', comment: 'Una sola mayúscula cambia el hash completamente' }
    },
    hashes_to_crack: {
        '5d41402abc4b2a76b9719d911017c592': 'hello (MD5)',
        '2c26b46911185131006b78e1f0b0ab5e': 'abc (SHA256)',
        'e4d909c290d0fb1ca068ffaddf22cbd0': 'password'
    },
    keys: {
        'RSA 2048': { public: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAJ...-----END PUBLIC KEY-----', private: '(privado, no mostrado)', use: 'Para firmar digitalmente o encriptar' },
        'AES-256': { key: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', use: 'Encriptación simétrica — ambos lados comparten la key' }
    },
    certificates: {
        'google.com': { issuer: 'Google Internet Authority G3', cn: '*.google.com', validity: '2024-01-15 ~ 2025-04-08', algo: 'SHA-256 with RSA' },
        'acme.local (self-signed)': { issuer: 'ACME Corp', cn: 'acme.local', validity: '2024-01-01 ~ 2099-12-31', algo: 'SHA-256 with RSA', selfsigned: true }
    }
})

const commands = {
    'md5': (args, env) => {
        const text = args.join(' ')
        if (!text) return { out: ['uso: md5 <text>   ej: md5 password123'] }
        const obj = Object.entries(env.hashes).find(([k]) => k === text)
        if (obj) return { out: [`MD5(${text}) = ${obj[1].md5}`, '⚠ MD5 está deprecado (colisiones fáciles)'] }
        // Hash demostrativo en JS puro (no es MD5 real, pero ilustra que cualquier
        // input produce siempre la misma salida de longitud fija)
        let h = 0
        for (let i = 0; i < text.length; i++) { h = ((h << 5) - h + text.charCodeAt(i)) | 0 }
        const fake = (h >>> 0).toString(16).padStart(8, '0').repeat(4)
        return { out: [`MD5(${text}) = ${fake}`, 'Nota: salida demostrativa (no es MD5 real, pero ilustra el concepto)'], events: [{ t: 'hash_compute', algo: 'md5' }] }
    },

    'sha256': (args, env) => {
        const text = args.join(' ')
        if (!text) return { out: ['uso: sha256 <text>'] }
        const obj = Object.entries(env.hashes).find(([k]) => k === text)
        if (obj) return { out: [`SHA-256(${text}) = ${obj[1].sha256}`, '✓ SHA-256 es el estándar moderno'] }
        return { out: [`SHA-256(${text}) = (resultado simulado)`, 'SHA-256 produce hashes de 256 bits (64 caracteres hex)'], events: [{ t: 'hash_compute', algo: 'sha256' }] }
    },

    'hashcat': (args, env) => {
        const hash = args[0]
        if (!hash) return { out: ['uso: hashcat <hash>   ej: hashcat 5d41402abc4b2a76b9719d911017c592'] }
        const known = env.hashes_to_crack[hash]
        if (!known) return { out: ['[*] Crackeando hash...', '[*] Diccionario no contiene este hash (tendría que usar GPU/years de CPU)'] }
        return { out: [`[+] Hash crackeado: ${known}`, 'Esto funciona porque la contraseña es común. Contraseñas fuertes tardaban años.'], events: [{ t: 'hashcat', cracked: true }] }
    },

    'openssl': (args, env) => {
        if (!args[0]) return { out: ['Comandos OpenSSL:', '  openssl genrsa 2048  (generar RSA)',
                '  openssl req -new -x509  (generar certificado)',
                '  openssl s_client -connect host:443  (revisar cert)'] }
        if (args[0] === 's_client' && args[1] === '-connect') {
            const host = args[2] || 'google.com:443'
            const cert = env.certificates['google.com']
            return {
                out: [`Certificado de ${host}:`, `  CN: ${cert.cn}`, `  Issuer: ${cert.issuer}`, `  Valid: ${cert.validity}`, `  Algo: ${cert.algo}`, '✓ Certificado válido'],
                events: [{ t: 'verify_cert' }]
            }
        }
        return { out: ['(comando OpenSSL simulado)'] }
    },

    'rsa-keypair': (args, env) => {
        const out = [
            '=== RSA 2048-bit Key Pair ===',
            '',
            'PUBLIC KEY:',
            '-----BEGIN PUBLIC KEY-----',
            'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2vHR...',
            '-----END PUBLIC KEY-----',
            '',
            'PRIVATE KEY: (secreto, nunca compartas)',
            '-----BEGIN PRIVATE KEY-----',
            'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDa...',
            '-----END PRIVATE KEY-----',
            '',
            'RSA es ASIMÉTRICO: publica para encriptar/verificar, privada para desencriptar/firmar.'
        ]
        return { out, events: [{ t: 'gen_rsa' }] }
    },

    'pki': () => ({
        out: [
            '=== PKI (Public Key Infrastructure) ===',
            '',
            'Cadena de certificados:',
            '  Root CA (acme-root.crt) [confiado en tu máquina]',
            '  ↓ emite',
            '  Intermediate CA (acme-intermediate.crt)',
            '  ↓ emite',
            '  Server Certificate (acme.local.crt)',
            '',
            'Verificación: navegador confía en Root → valida chain → confía en acme.local',
            '',
            'Self-signed = emisor es él mismo (acme-root = acme.local). Los navegadores = ⚠ "advertencia de seguridad"'
        ]
    }),

    'help': () => ({ out: ['Comandos Cripto disponibles:', '  md5 <text>  sha256 <text>  hashcat <hash>', '  openssl s_client -connect <host>:443  rsa-keypair  pki  help'] })
}

const missions = [
    {
        id: 'crypt1', title: 'Calcula hashes de texto', xp: 60,
        brief: 'Hashing = función de una vía. password123 → siempre el mismo hash, pero imposible ir al revés. Se usa para almacenar contraseñas sin guardarlas.',
        obj: 'Computa el MD5 y SHA-256 de "password123".',
        hint: 'md5 password123\nsha256 password123',
        check: ev => ev.some(e => e.t === 'hash_compute')
    },
    {
        id: 'crypt2', title: 'Crackea un hash conocido', xp: 80,
        brief: 'Si el hash está en un diccionario (Rainbow tables), hashcat lo rompe en microsegundos. Por eso las contraseñas fuertes importan.',
        obj: 'Usa hashcat para crackear el hash "5d41402abc4b2a76b9719d911017c592".',
        hint: 'hashcat 5d41402abc4b2a76b9719d911017c592',
        check: ev => ev.some(e => e.t === 'hashcat' && e.cracked)
    },
    {
        id: 'crypt3', title: 'Genera un RSA keypair', xp: 70,
        brief: 'RSA es ASIMÉTRICO: tienes dos claves. Publica (compartir) y privada (guardar). Quien encripta con la pública solo desencripta con la privada.',
        obj: 'Genera un par de claves RSA 2048.',
        hint: 'rsa-keypair',
        check: ev => ev.some(e => e.t === 'gen_rsa')
    },
    {
        id: 'crypt4', title: 'Verifica un certificado SSL', xp: 70,
        brief: 'Los certificados = identidad. HTTPS confía en que el cert de google.com es realmente Google. OpenSSL te muestra a quién emitió el cert, cuándo expira, y si la cadena es válida.',
        obj: 'Verifica el certificado de google.com con openssl s_client.',
        hint: 'openssl s_client -connect google.com:443',
        check: ev => ev.some(e => e.t === 'verify_cert')
    }
]

export default {
    id: 'crypto', icon: '🔐', name: 'Criptografía', sub: 'Hashing, ciphers, RSA, PKI, certificados',
    initEnv,
    prompt: () => 'crypto>',
    intro: ['Módulo CRIPTOGRAFÍA cargado. La criptografía asegura confidencialidad, integridad y autenticidad.',
        'Sin ella, internet sería un chisme al aire libre. Con ella, tus secretos están seguros (si lo haces bien).'],
    commands, missions
}