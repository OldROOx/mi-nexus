import React, { useState, useEffect } from "react";
import Course from "../_course/Course.jsx";
import { Fingerprint, HardDrive, Network, FileSearch, MemoryStick, ScrollText, Bug, ShieldAlert } from "lucide-react";

/* ---------- animación custom: carving / recuperación en hex ---------- */
function AnimHex() {
    const HEX = ["FF", "D8", "FF", "E0", "00", "10", "4A", "46", "49", "46", "00", "01",
        "7A", "3C", "9B", "2D", "E1", "04", "B7", "55", "00", "FF", "D9", "1A"];
    const [t, setT] = useState(0);
    useEffect(() => { const id = setInterval(() => setT((p) => (p + 1) % (HEX.length + 6)), 160); return () => clearInterval(id); }, []);
    return (
        <div className="cw-anim">
            <div className="cw-hex">
                {HEX.map((h, i) => {
                    const recovered = i < t;
                    const isHeader = i < 4; // FF D8 FF E0 = cabecera JPG
                    return <span key={i} className={`cw-hexcell ${recovered ? "on" : ""} ${isHeader && recovered ? "sig" : ""}`}>{h}</span>;
                })}
            </div>
            <p className="cw-anim-cap">Un archivo "borrado" sigue en el disco hasta que se sobrescribe. Buscando su firma (aquí <code>FF D8 FF</code> = JPG) se puede recuperar byte a byte. Eso es <code>carving</code>.</p>
        </div>
    );
}
const anims = { hex: AnimHex };

const theme = {
    bg: "#0a0f0c", panel: "#101a14", panel2: "#0d1610", code: "#070d09",
    border: "#193024", border2: "#21402f", text: "#dcefe2", muted: "#8db8a0", dim: "#5d8270",
    acc: "#34d399", acc2: "#8af0c4", accGlow: "rgba(52,211,153,.5)", accSoft: "rgba(52,211,153,.10)", onAcc: "#06120c",
};

const mods = [
    { name: "Bases", sub: "SO, sistemas de archivos y redes", icon: HardDrive },
    { name: "Adquisición", sub: "Evidencia y cadena de custodia", icon: Fingerprint },
    { name: "Análisis", sub: "Discos, RAM, logs y malware", icon: FileSearch },
    { name: "Reporte", sub: "Informe pericial", icon: ScrollText },
];
const ranks = [
    { min: 0, name: "Aprendiz" },
    { min: 300, name: "Analista junior" },
    { min: 700, name: "Investigador forense" },
    { min: 1100, name: "Perito" },
    { min: 1500, name: "Perito senior" },
];

const lessons = [
    {
        id: "for_so", mod: "Bases", icon: HardDrive, mins: "25 min",
        title: "Sistemas operativos y de archivos",
        intro: "El análisis forense empieza por entender dónde vive la información. Cada sistema operativo y sistema de archivos guarda rastros distintos.",
        theory: [
            { p: "El sistema operativo gestiona procesos, memoria y archivos, y deja rastros por todas partes: registro de Windows, logs, archivos temporales, papelera, prefetch. El sistema de archivos (NTFS, ext4, FAT, APFS) organiza cómo se guardan los datos en el disco." },
            { pairs: [
                    { a: "NTFS (Windows)", b: "MFT, journaling, ADS" },
                    { a: "ext4 (Linux)", b: "inodos, journaling" },
                    { a: "FAT32 (USB)", b: "simple, sin permisos" },
                    { a: "APFS (macOS)", b: "snapshots, cifrado" },
                ], cap: "Cada sistema de archivos guarda metadatos distintos (fechas, dueños, journal) que son oro para el perito." },
            { tip: { icon: "🗂️", text: "Las marcas de tiempo (MAC times: Modificación, Acceso, Creación) son clave: cuentan cuándo se tocó cada archivo. Pero ojo, se pueden manipular." } },
        ],
        practice: [
            { title: "Dónde buscar rastros", goal: "En Windows, ¿dónde buscarías evidencia de programas ejecutados?",
                steps: ["Piensa en artefactos del SO"],
                solution: `Artefactos típicos en Windows:
- Prefetch (programas ejecutados)
- Registro de Windows (configuración, MRU)
- Logs de eventos (.evtx)
- Papelera de reciclaje y archivos temporales` },
            { title: "MAC times", goal: "¿Qué significan las marcas de tiempo MAC y por qué importan?",
                steps: ["Modificación, Acceso, Creación"],
                solution: `M = Modificación (último cambio de contenido)
A = Acceso (última lectura)
C = Creación / cambio de metadatos
// Reconstruyen la línea de tiempo... pero pueden falsificarse,
// hay que corroborar con otras fuentes.` },
        ],
        quiz: [
            { q: "El sistema de archivos de Windows moderno es…", opts: ["ext4", "NTFS", "APFS", "FAT16"], correct: 1, fb: "NTFS, con su MFT y journaling." },
            { q: "Las MAC times se refieren a…", opts: ["Computadoras Apple", "Marcas de Modificación, Acceso y Creación", "Direcciones de red", "Malware"], correct: 1, fb: "Tiempos clave para la línea temporal." },
            { q: "¿Dónde NO buscarías programas ejecutados en Windows?", opts: ["Prefetch", "Registro", "El logo de inicio", "Logs de eventos"], correct: 2, fb: "El logo no guarda rastros de ejecución." },
        ],
    },
    {
        id: "for_red", mod: "Bases", icon: Network, mins: "25 min",
        title: "Redes (TCP/IP)",
        intro: "Mucha evidencia viaja por la red. Entender TCP/IP te permite leer tráfico, rastrear conexiones e identificar exfiltración de datos.",
        theory: [
            { seq: ["SYN", "SYN-ACK", "ACK"], cap: "El 'three-way handshake' de TCP: así dos máquinas establecen una conexión confiable antes de enviar datos." },
            { p: "El modelo TCP/IP tiene capas: aplicación (HTTP, DNS), transporte (TCP/UDP), internet (IP) y enlace. Una dirección IP identifica un host; un puerto, un servicio. Capturar tráfico (con herramientas tipo Wireshark) revela quién habló con quién." },
            { tip: { icon: "🌐", text: "Conexiones a IPs o dominios raros, en puertos inusuales o a horas extrañas, son señales de alarma: posible malware llamando a casa (C2) o exfiltración." } },
        ],
        practice: [
            { title: "Lee una conexión", goal: "Ves tráfico saliente a una IP desconocida en el puerto 4444 a las 3am. ¿Qué sospechas?",
                steps: ["IP rara + puerto raro + hora rara"],
                solution: `Puerto 4444 es típico de herramientas de control remoto
(Metasploit/backdoors). Salida a IP desconocida de madrugada
sugiere malware comunicándose con su servidor (C2)
o exfiltración de datos. Hay que investigar esa IP.` },
            { title: "Handshake TCP", goal: "Ordena los pasos para abrir una conexión TCP.",
                steps: ["Tres pasos"],
                solution: `1. Cliente -> SYN        (quiero conectarme)
2. Servidor -> SYN-ACK   (ok, y yo también)
3. Cliente -> ACK        (confirmado)
// Conexión establecida: ahora fluyen los datos.` },
        ],
        quiz: [
            { q: "El three-way handshake de TCP es…", opts: ["ACK, SYN, FIN", "SYN, SYN-ACK, ACK", "GET, POST, PUT", "PING, PONG"], correct: 1, fb: "Tres pasos para establecer la conexión." },
            { q: "Una dirección IP identifica…", opts: ["Un servicio", "Un host en la red", "Un archivo", "Un usuario"], correct: 1, fb: "El host; el puerto identifica el servicio." },
            { q: "Tráfico a un puerto raro hacia una IP desconocida sugiere…", opts: ["Todo normal", "Posible malware/exfiltración a investigar", "Mejor rendimiento", "Nada"], correct: 1, fb: "Es una señal de alarma típica." },
        ],
    },
    {
        id: "for_evidencia", mod: "Adquisición", icon: Fingerprint, mins: "30 min",
        title: "Evidencia digital y cadena de custodia",
        intro: "Una prueba digital solo vale en un juicio si puedes demostrar que no se alteró desde que se recogió. Eso es la cadena de custodia.",
        theory: [
            { seq: ["Identificar", "Recolectar", "Documentar", "Trasladar", "Almacenar"], cap: "Cadena de custodia: cada paso se registra (quién, cuándo, cómo) para probar que la evidencia es íntegra." },
            { p: "La evidencia digital es frágil y fácil de alterar. Cada vez que cambia de manos debe quedar registrado. Si se rompe la cadena, la prueba puede ser desechada por un tribunal, aunque sea verdadera." },
            { h: "El hash: la huella digital del dato" },
            { p: "Se calcula un hash (ej. SHA-256) de la evidencia al recolectarla. Si el más mínimo bit cambia, el hash cambia por completo. Comparar hashes prueba que la copia es idéntica al original y que nada se modificó." },
            { tip: { icon: "🔒", text: "Regla número uno: nunca trabajes sobre la evidencia original. Haces una copia forense, verificas su hash, y analizas la copia." } },
        ],
        practice: [
            { title: "Verifica integridad", goal: "El hash de tu copia no coincide con el del original. ¿Qué significa?",
                steps: ["Piensa qué prueba el hash"],
                solution: `Significa que la copia NO es idéntica al original:
algo cambió (error de copia o alteración).
La copia no es válida como evidencia hasta lograr
un hash idéntico al del original.` },
            { title: "Cadena de custodia", goal: "¿Por qué se desecha una prueba si se rompe la cadena de custodia?",
                steps: ["Integridad y confianza"],
                solution: `Porque ya no se puede garantizar que la prueba
no fue alterada o sustituida en el camino.
Sin esa garantía, el tribunal no puede confiar en ella,
aunque el contenido fuera real.` },
        ],
        quiz: [
            { q: "La cadena de custodia documenta…", opts: ["El precio de la prueba", "Quién, cuándo y cómo se manejó la evidencia", "El clima", "Nada"], correct: 1, fb: "Prueba la integridad de extremo a extremo." },
            { q: "Un hash sirve para…", opts: ["Cifrar contraseñas siempre", "Verificar que un dato no cambió (huella única)", "Acelerar el disco", "Borrar archivos"], correct: 1, fb: "Si cambia un bit, cambia todo el hash." },
            { q: "La regla de oro al adquirir evidencia es…", opts: ["Trabajar sobre el original", "Trabajar sobre una copia forense verificada", "Borrar y empezar", "No documentar"], correct: 1, fb: "Nunca se altera el original." },
        ],
    },
    {
        id: "for_adq", mod: "Adquisición", icon: HardDrive, mins: "25 min",
        title: "Adquisición forense",
        intro: "Adquirir es hacer una copia exacta, bit a bit, de la evidencia sin alterarla. La técnica cambia según si el equipo está encendido o apagado.",
        theory: [
            { seq: ["Aislar", "Bloquear escritura", "Imagen bit a bit", "Hash", "Verificar"], cap: "Adquisición ordenada: se aísla el equipo, se evita escribir en él y se copia todo, verificando con hash." },
            { p: "Se usa un 'write blocker' (bloqueador de escritura) para leer el disco sin modificarlo. Se crea una imagen forense (copia bit a bit, no archivo por archivo) que incluye hasta el espacio 'vacío'. Existe el orden de volatilidad: lo más volátil (RAM, conexiones) se captura primero porque desaparece al apagar." },
            { tip: { icon: "⚡", text: "Orden de volatilidad: primero la RAM y las conexiones de red (se pierden al apagar), luego el disco. Si apagas de golpe, pierdes la memoria para siempre." } },
        ],
        practice: [
            { title: "Orden de volatilidad", goal: "Llegas a una escena con la PC encendida. ¿Qué capturas primero?",
                steps: ["Lo más volátil primero"],
                solution: `Primero lo VOLÁTIL (se pierde al apagar):
1. Memoria RAM y procesos en ejecución
2. Conexiones de red activas
Después: la imagen del disco (es persistente).
// Apagar de golpe destruiría la RAM.` },
            { title: "Imagen forense", goal: "¿Por qué se copia 'bit a bit' y no solo los archivos?",
                steps: ["Piensa en lo borrado"],
                solution: `Copiar archivo por archivo deja fuera lo borrado,
el espacio no asignado y los metadatos.
La imagen bit a bit copia TODO el disco, permitiendo
recuperar archivos eliminados (carving) y rastros ocultos.` },
        ],
        quiz: [
            { q: "Un 'write blocker' sirve para…", opts: ["Acelerar la copia", "Leer el disco sin modificarlo", "Borrar datos", "Cifrar"], correct: 1, fb: "Evita escribir en la evidencia original." },
            { q: "Una imagen forense es…", opts: ["Una foto del monitor", "Copia bit a bit de todo el disco", "Solo los documentos", "Un hash"], correct: 1, fb: "Incluye espacio libre y borrado." },
            { q: "Según el orden de volatilidad, primero capturas…", opts: ["El disco", "La RAM y conexiones (lo volátil)", "El teclado", "La impresora"], correct: 1, fb: "Lo que desaparece al apagar va primero." },
        ],
    },
    {
        id: "for_disco", mod: "Análisis", icon: FileSearch, mins: "30 min",
        title: "Análisis de discos",
        intro: "Sobre la imagen del disco se busca evidencia: archivos, fragmentos borrados y rastros ocultos. Aquí brilla la recuperación de datos.",
        theory: [
            { anim: "hex" },
            { p: "Cuando borras un archivo, no se elimina: solo se marca su espacio como 'reutilizable'. Hasta que algo lo sobrescriba, sigue ahí. El 'file carving' busca las firmas de archivo (magic numbers) en el espacio no asignado para reconstruirlos." },
            { pairs: [
                    { a: "JPG", b: "empieza con FF D8 FF" },
                    { a: "PNG", b: "empieza con 89 50 4E 47" },
                    { a: "PDF", b: "empieza con 25 50 44 46 (%PDF)" },
                    { a: "ZIP", b: "empieza con 50 4B 03 04 (PK)" },
                ], cap: "Cada tipo de archivo tiene una firma (magic number) al inicio. El carving la busca para recuperar archivos sin tabla." },
            { tip: { icon: "🔎", text: "Si necesitas que algo se borre de verdad (o detectar que alguien lo intentó), busca herramientas de 'wiping': sobrescriben el espacio para impedir el carving." } },
        ],
        practice: [
            { title: "Identifica por firma", goal: "Encuentras bytes que empiezan con FF D8 FF en el espacio libre. ¿Qué es?",
                steps: ["Compara con las firmas"],
                solution: `FF D8 FF -> es la cabecera de un archivo JPG.
Hay una imagen (quizá borrada) que puede recuperarse
con carving, buscando desde esa firma hasta su fin (FF D9).` },
            { title: "Por qué se recupera lo borrado", goal: "Explica por qué un archivo borrado a veces se puede recuperar.",
                steps: ["Marcar vs sobrescribir"],
                solution: `Borrar solo MARCA el espacio como libre; los datos
siguen físicamente en el disco hasta que algo los
SOBRESCRIBA. Mientras tanto, el carving los reconstruye.
// Por eso 'borrar' no es 'destruir'.` },
        ],
        quiz: [
            { q: "Cuando borras un archivo…", opts: ["Se destruye al instante", "Se marca su espacio como libre, pero sigue ahí", "Se cifra", "Se duplica"], correct: 1, fb: "Permanece hasta ser sobrescrito." },
            { q: "El 'file carving' recupera archivos buscando…", opts: ["Su color", "Sus firmas (magic numbers)", "Su nombre", "Su tamaño"], correct: 1, fb: "Las firmas marcan dónde empieza cada tipo." },
            { q: "FF D8 FF es la firma de…", opts: ["PNG", "JPG", "PDF", "ZIP"], correct: 1, fb: "Cabecera típica de un JPG." },
        ],
    },
    {
        id: "for_ram", mod: "Análisis", icon: MemoryStick, mins: "25 min",
        title: "Análisis de memoria RAM",
        intro: "La RAM contiene lo que estaba pasando justo en ese momento: procesos, contraseñas, claves de cifrado y malware que nunca tocó el disco.",
        theory: [
            { p: "Un volcado de memoria (RAM dump) captura el estado vivo del sistema. Ahí puedes encontrar tesoros que no están en disco: procesos en ejecución, conexiones de red, comandos escritos, contraseñas en texto claro y malware 'fileless' que solo vive en memoria." },
            { list: [
                    "Procesos activos y ocultos",
                    "Conexiones de red en curso",
                    "Claves de cifrado y contraseñas en claro",
                    "Malware que nunca se escribió al disco (fileless)",
                ] },
            { tip: { icon: "🧠", text: "La RAM es volátil: se borra al apagar. Por eso se captura primero. Herramientas como Volatility analizan el volcado para listar procesos, conexiones y código inyectado." } },
        ],
        practice: [
            { title: "Por qué la RAM es oro", goal: "Un malware no aparece en el disco pero el equipo está infectado. ¿Dónde lo buscas?",
                steps: ["Piensa en fileless"],
                solution: `En la MEMORIA RAM: hay malware 'fileless' que solo
vive en memoria y nunca se escribe al disco.
Un volcado de RAM + análisis (p. ej. Volatility)
revela el proceso malicioso y sus conexiones.` },
            { title: "Qué se pierde al apagar", goal: "¿Por qué apagar el equipo puede arruinar la investigación?",
                steps: ["Volatilidad"],
                solution: `Al apagar se borra la RAM y con ella: procesos vivos,
conexiones, claves y malware fileless.
Esa evidencia es irrecuperable después.
// Por eso se captura la RAM antes de apagar.` },
        ],
        quiz: [
            { q: "Un volcado de RAM puede contener…", opts: ["Solo imágenes", "Procesos, conexiones, contraseñas en claro y malware fileless", "Nada útil", "El BIOS"], correct: 1, fb: "Es el estado vivo del sistema." },
            { q: "El malware 'fileless' vive…", opts: ["En el disco", "Solo en la memoria RAM", "En la impresora", "En la nube siempre"], correct: 1, fb: "Por eso no aparece en el disco." },
            { q: "La RAM se captura primero porque…", opts: ["Es más grande", "Es volátil: se borra al apagar", "Es más lenta", "No importa"], correct: 1, fb: "Su contenido desaparece sin energía." },
        ],
    },
    {
        id: "for_logs", mod: "Análisis", icon: Bug, mins: "30 min",
        title: "Análisis de logs y malware",
        intro: "Los logs son el diario del sistema: cuentan qué pasó y cuándo. Combinados con el análisis de malware, reconstruyen el ataque completo.",
        theory: [
            { p: "Los registros (logs) graban inicios de sesión, ejecuciones, errores y accesos. Correlacionar logs de varias fuentes (sistema, red, aplicaciones) por tiempo arma la línea temporal del incidente: cómo entró el atacante, qué tocó y cuándo." },
            { h: "Análisis de malware: dos enfoques" },
            { pairs: [
                    { a: "Análisis estático", b: "examinar sin ejecutar (firmas, strings)" },
                    { a: "Análisis dinámico", b: "ejecutar en sandbox y observar" },
                ], cap: "Estático (mirar el archivo) y dinámico (correrlo en un entorno aislado) se complementan para entender qué hace el malware." },
            { tip: { icon: "🧪", text: "Nunca ejecutes malware en tu equipo real. Se usa una máquina virtual aislada (sandbox) para observar qué archivos crea, qué conexiones abre y qué IOCs (indicadores de compromiso) deja." } },
        ],
        practice: [
            { title: "Construye la línea de tiempo", goal: "¿Cómo usas los logs para saber cómo entró un atacante?",
                steps: ["Correlación por tiempo"],
                solution: `Reúnes logs de varias fuentes (accesos, red, sistema)
y los ordenas por marca de tiempo.
Buscas el primer evento anómalo (login raro, ejecución)
y sigues la cadena: entrada -> movimiento -> acción.
// La correlación temporal reconstruye el ataque.` },
            { title: "Estático vs dinámico", goal: "Quieres saber qué hace un .exe sospechoso sin arriesgar tu equipo.",
                steps: ["Combina ambos enfoques"],
                solution: `Estático: revisa strings, firmas y estructura SIN ejecutarlo.
Dinámico: córrelo en una SANDBOX aislada (VM) y observa
qué archivos crea, qué conexiones abre, qué IOCs deja.
// Nunca en tu máquina real.` },
        ],
        quiz: [
            { q: "Los logs sirven para…", opts: ["Decorar", "Reconstruir qué pasó y cuándo (línea temporal)", "Acelerar la red", "Borrar pruebas"], correct: 1, fb: "Son el diario del sistema." },
            { q: "El análisis dinámico de malware consiste en…", opts: ["Mirarlo sin ejecutar", "Ejecutarlo en una sandbox aislada y observar", "Borrarlo", "Renombrarlo"], correct: 1, fb: "Se corre en entorno aislado para ver su comportamiento." },
            { q: "¿Dónde se ejecuta malware para analizarlo?", opts: ["En tu PC real", "En una máquina virtual aislada (sandbox)", "En el servidor de la empresa", "En el celular"], correct: 1, fb: "Aislamiento para no infectar nada real." },
        ],
    },
    {
        id: "for_informe", mod: "Reporte", icon: ScrollText, mins: "25 min",
        title: "Elaboración de informes periciales",
        intro: "El mejor análisis no sirve de nada si no se explica con claridad. El informe pericial traduce hallazgos técnicos a algo que un juez pueda entender y confiar.",
        theory: [
            { p: "Un informe pericial debe ser claro, objetivo y reproducible: cualquier otro perito, siguiendo tus pasos, debería llegar a lo mismo. Se separan los hechos (lo que se encontró) de las conclusiones (su interpretación)." },
            { list: [
                    "Objeto y alcance: qué se pidió analizar",
                    "Metodología: herramientas y pasos (reproducibles)",
                    "Hallazgos: la evidencia encontrada, con hashes",
                    "Conclusiones: interpretación fundada en los hallazgos",
                    "Anexos: cadena de custodia y evidencia de respaldo",
                ] },
            { tip: { icon: "📝", text: "Escribe para alguien sin conocimientos técnicos. Evita la jerga o explícala. Un hallazgo que el juez no entiende es un hallazgo que no existe para el caso." } },
        ],
        practice: [
            { title: "Hechos vs conclusiones", goal: "Clasifica: 'se halló un JPG borrado con hash X' y 'el usuario descargó la imagen el 3 de mayo'.",
                steps: ["Lo observado vs lo interpretado"],
                solution: `'se halló un JPG borrado con hash X' -> HECHO (observado)
'el usuario descargó la imagen el 3 de mayo' -> CONCLUSIÓN
   (interpretación que debe estar fundada en hechos)
// Nunca mezcles lo que viste con lo que deduces.` },
            { title: "Reproducibilidad", goal: "¿Por qué tu informe debe permitir que otro perito repita tu análisis?",
                steps: ["Piensa en la confianza del tribunal"],
                solution: `Porque la prueba pericial debe ser verificable:
si otro experto, con tus mismos pasos y herramientas,
obtiene el mismo resultado, el tribunal puede confiar.
Un análisis irreproducible no tiene valor probatorio.` },
        ],
        quiz: [
            { q: "Un informe pericial debe ser…", opts: ["Confuso y técnico", "Claro, objetivo y reproducible", "Subjetivo", "Secreto"], correct: 1, fb: "Otro perito debería poder repetirlo." },
            { q: "En el informe se deben separar…", opts: ["Las fotos de los textos", "Los hechos de las conclusiones", "Nada", "Los colores"], correct: 1, fb: "Lo observado vs lo interpretado." },
            { q: "¿Para quién se escribe el informe?", opts: ["Solo para expertos", "Para que un juez sin perfil técnico lo entienda", "Para nadie", "Para el atacante"], correct: 1, fb: "La claridad para el tribunal es esencial." },
        ],
    },
];

export default function App() {
    return (
        <Course
            storageKey="forense_progress_v1"
            kick="// EVOLUTIVE · FORENSE"
            title="FORENSE" titleHi="COMPUTACIONAL"
            subtitle="Investiga la evidencia digital como un perito: del sistema de archivos a la RAM, el malware y el informe. Con esquemas visuales, casos y quiz por lección."
            HeaderIcon={Fingerprint}
            theme={theme} mods={mods} ranks={ranks} lessons={lessons} anims={anims}
        />
    );
}