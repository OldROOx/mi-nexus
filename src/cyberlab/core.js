/* ============================================================================
   CYBERLAB // core — rangos, XP y utilidades del motor
============================================================================ */

/* Rangos por XP acumulada */
export const ranks = [
    { min: 0,    name: 'Script Kiddie' },
    { min: 100,  name: 'Junior Analyst' },
    { min: 250,  name: 'SOC Analyst I' },
    { min: 450,  name: 'SOC Analyst II' },
    { min: 700,  name: 'Security Analyst' },
    { min: 1000, name: 'Red Teamer' },
    { min: 1400, name: 'Senior / Lead' }
]
export const rankFor = xp => ranks.filter(r => xp >= r.min).pop()
export const nextRank = xp => ranks.find(r => xp < r.min)

/* Tokenizer que respeta comillas simples y dobles.
   Permite payloads con espacios, ej:  curl "http://x/login?user=admin' OR '1'='1" */
export function tokenize(line) {
    const tokens = []
    let cur = '', quote = null
    for (const ch of line) {
        if (quote) {
            if (ch === quote) quote = null
            else cur += ch
        } else if (ch === '"' || ch === "'") {
            quote = ch
        } else if (ch === ' ') {
            if (cur) { tokens.push(cur); cur = '' }
        } else cur += ch
    }
    if (cur) tokens.push(cur)
    return tokens
}