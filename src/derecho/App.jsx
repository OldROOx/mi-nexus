import React, { useState, useEffect } from "react";
import Course from "../_course/Course.jsx";
import { Scale, Gavel, Landmark, BookText, ShieldCheck, FileSignature, Users, ScrollText } from "lucide-react";

/* ---------- animación custom: balanza de la justicia ---------- */
function AnimScales() {
    const [t, setT] = useState(0);
    useEffect(() => { const id = setInterval(() => setT((p) => p + 0.05), 40); return () => clearInterval(id); }, []);
    const tilt = Math.sin(t) * 9; // grados
    return (
        <div className="cw-anim">
            <svg viewBox="0 0 200 120" className="cw-svg">
                <line x1="100" y1="15" x2="100" y2="95" stroke="var(--acc)" strokeWidth="3" />
                <rect x="80" y="95" width="40" height="8" rx="2" fill="var(--acc)" />
                <g transform={`rotate(${tilt} 100 25)`}>
                    <line x1="40" y1="25" x2="160" y2="25" stroke="var(--acc)" strokeWidth="3" />
                    <line x1="40" y1="25" x2="40" y2="50" stroke="var(--acc2)" strokeWidth="1.5" />
                    <path d="M28,50 a12,8 0 0,0 24,0 z" fill="none" stroke="var(--acc2)" strokeWidth="2" />
                    <line x1="160" y1="25" x2="160" y2="50" stroke="var(--acc2)" strokeWidth="1.5" />
                    <path d="M148,50 a12,8 0 0,0 24,0 z" fill="none" stroke="var(--acc2)" strokeWidth="2" />
                    <circle cx="100" cy="25" r="4" fill="var(--acc2)" />
                </g>
            </svg>
            <p className="cw-anim-cap">El derecho pesa argumentos y pruebas de ambos lados hasta inclinar la balanza hacia la decisión más justa y fundada.</p>
        </div>
    );
}
const anims = { scales: AnimScales };

const theme = {
    bg: "#0c1018", panel: "#141a26", panel2: "#101521", code: "#0a0e16",
    border: "#222c3e", border2: "#2c384e", text: "#e9e7df", muted: "#9aa3b5", dim: "#69728a",
    acc: "#c9a227", acc2: "#ecd27a", accGlow: "rgba(201,162,39,.5)", accSoft: "rgba(201,162,39,.10)", onAcc: "#0c1018",
};

const mods = [
    { name: "Fundamentos", sub: "Qué es el derecho y cómo se lee", icon: BookText },
    { name: "Ramas", sub: "Constitucional, civil, penal, procesal", icon: Landmark },
    { name: "Práctica", sub: "Contratos y argumentación", icon: FileSignature },
    { name: "Garantías", sub: "Derechos humanos y jurisprudencia", icon: ShieldCheck },
];
const ranks = [
    { min: 0, name: "Estudiante" },
    { min: 300, name: "Pasante" },
    { min: 700, name: "Abogado junior" },
    { min: 1100, name: "Litigante" },
    { min: 1500, name: "Jurista" },
];

const lessons = [
    {
        id: "der_tgd", mod: "Fundamentos", icon: BookText, mins: "25 min",
        title: "Teoría general del derecho",
        intro: "Antes de cualquier ley concreta hay conceptos base: qué es una norma, una sanción, un derecho y una obligación. Son los ladrillos de todo lo demás.",
        theory: [
            { pairs: [
                    { a: "Norma jurídica", b: "regla de conducta obligatoria" },
                    { a: "Sanción", b: "consecuencia por incumplir" },
                    { a: "Derecho subjetivo", b: "facultad que la ley te da" },
                    { a: "Obligación", b: "deber jurídico de hacer/no hacer" },
                ], cap: "El derecho regula conductas con normas: si las incumples, hay una consecuencia (sanción)." },
            { p: "El derecho se distingue de la moral en que es coercible: el Estado puede hacerlo cumplir por la fuerza legítima. Una norma tiene supuesto (si pasa X) y consecuencia (entonces Y)." },
            { tip: { icon: "⚖️", text: "Toda norma se puede leer como un 'si… entonces…': si se da el supuesto de hecho, se produce la consecuencia jurídica." } },
        ],
        practice: [
            { title: "Estructura de la norma", goal: "Identifica supuesto y consecuencia en: 'quien daña la propiedad ajena debe repararla'.",
                steps: ["Separa el 'si' del 'entonces'"],
                solution: `Supuesto: 'quien daña la propiedad ajena'
Consecuencia: 'debe repararla'
// Si se cumple el supuesto -> nace la obligación.` },
            { title: "Derecho vs moral", goal: "¿Por qué 'no mentir' es moral pero 'no estafar' es jurídico?",
                steps: ["Piensa en la coercibilidad"],
                solution: `Ambas son reglas de conducta, pero solo la jurídica
es COERCIBLE: el Estado puede sancionar la estafa
por la fuerza (multa, cárcel). La mentira simple no.
// El derecho se puede hacer cumplir; la moral, no.` },
        ],
        quiz: [
            { q: "¿Qué distingue al derecho de la moral?", opts: ["Es más antiguo", "Es coercible (el Estado lo hace cumplir)", "No tiene reglas", "Es opcional"], correct: 1, fb: "La coercibilidad es nota distintiva del derecho." },
            { q: "Una norma jurídica tiene…", opts: ["Solo castigo", "Un supuesto y una consecuencia", "Solo derechos", "Nada fijo"], correct: 1, fb: "Si pasa X (supuesto), entonces Y (consecuencia)." },
            { q: "La 'sanción' es…", opts: ["Un permiso", "La consecuencia por incumplir la norma", "Un derecho", "Un contrato"], correct: 1, fb: "Es la reacción del orden jurídico ante el incumplimiento." },
        ],
    },
    {
        id: "der_interp", mod: "Fundamentos", icon: BookText, mins: "25 min",
        title: "Interpretación de las leyes",
        intro: "Las leyes se escriben en palabras, y las palabras se interpretan. Saber leer una ley es tan importante como conocerla.",
        theory: [
            { seq: ["Literal", "Sistemática", "Histórica", "Teleológica"], cap: "Métodos de interpretación: del sentido de las palabras al fin que persigue la norma." },
            { list: [
                    "Literal/gramatical: qué dicen las palabras",
                    "Sistemática: cómo encaja con el resto del ordenamiento",
                    "Histórica: qué quiso el legislador al crearla",
                    "Teleológica: para qué fin existe la norma",
                ] },
            { tip: { icon: "📖", text: "Cuando la letra es clara, se aplica; cuando es ambigua o absurda, se busca el fin de la norma (teleológica). Ninguna interpretación debe llevar al absurdo." } },
        ],
        practice: [
            { title: "Elige el método", goal: "Una norma prohíbe 'vehículos' en el parque. ¿Aplica a una ambulancia en emergencia?",
                steps: ["¿Letra o finalidad?"],
                solution: `Literalmente, una ambulancia es un 'vehículo'.
Pero la FINALIDAD (teleológica) de la norma es la seguridad
de los visitantes, no impedir salvar una vida.
=> Interpretación teleológica: la ambulancia SÍ puede entrar.` },
            { title: "Interpretación sistemática", goal: "¿Por qué no se interpreta un artículo aislado del resto del código?",
                steps: ["Piensa en coherencia"],
                solution: `Porque el ordenamiento es un sistema coherente:
un artículo se entiende en relación con los demás
y con la Constitución. Leerlo solo puede dar
un sentido contradictorio con el conjunto.` },
        ],
        quiz: [
            { q: "La interpretación teleológica busca…", opts: ["Las palabras exactas", "El fin que persigue la norma", "La fecha de la ley", "El autor"], correct: 1, fb: "Telos = fin/propósito de la norma." },
            { q: "Cuando la letra de la ley lleva a un absurdo…", opts: ["Se aplica igual", "Se busca su finalidad", "Se ignora la ley", "Se inventa otra"], correct: 1, fb: "Ninguna interpretación válida conduce al absurdo." },
            { q: "Interpretar 'sistemáticamente' significa…", opts: ["Leer rápido", "Relacionar la norma con todo el ordenamiento", "Solo el título", "Adivinar"], correct: 1, fb: "El sistema jurídico debe ser coherente." },
        ],
    },
    {
        id: "der_const", mod: "Ramas", icon: Landmark, mins: "30 min",
        title: "Derecho constitucional",
        intro: "La Constitución es la norma suprema: todas las demás leyes deben respetarla. Organiza el poder y reconoce los derechos fundamentales.",
        theory: [
            { p: "Existe una jerarquía de normas (pirámide de Kelsen): en la cima la Constitución, debajo las leyes, luego los reglamentos. Una norma inferior que contradiga a una superior es inválida." },
            { cycle: ["Constitución", "Tratados/Leyes", "Reglamentos", "Actos"], note: "jerarquía normativa", cap: "Pirámide de Kelsen: cada nivel debe respetar al de arriba. La Constitución manda sobre todo." },
            { h: "Qué hace una Constitución" },
            { list: ["Divide el poder (ejecutivo, legislativo, judicial)", "Reconoce derechos fundamentales", "Establece cómo se crean las leyes", "Es la base de validez de todo el sistema"] },
            { tip: { icon: "🏛️", text: "El control de constitucionalidad permite anular leyes que violen la Constitución. Por eso es la 'norma de normas'." } },
        ],
        practice: [
            { title: "Conflicto de normas", goal: "Una ley contradice un derecho de la Constitución. ¿Cuál prevalece?",
                steps: ["Recuerda la jerarquía"],
                solution: `Prevalece la CONSTITUCIÓN (norma suprema).
La ley que la contradiga es inconstitucional y
puede ser invalidada por el control de constitucionalidad.` },
            { title: "División de poderes", goal: "¿Por qué el poder se divide en tres?",
                steps: ["Piensa en el abuso de poder"],
                solution: `Para que ningún órgano concentre todo el poder:
- Legislativo hace las leyes
- Ejecutivo las aplica
- Judicial las interpreta y resuelve conflictos
// Se controlan entre sí (pesos y contrapesos).` },
        ],
        quiz: [
            { q: "¿Cuál es la norma suprema?", opts: ["El reglamento", "La Constitución", "El contrato", "La costumbre"], correct: 1, fb: "Todas las demás normas le deben respeto." },
            { q: "En la pirámide de Kelsen, una norma inferior que contradice a una superior es…", opts: ["Válida", "Inválida", "Superior", "Opcional"], correct: 1, fb: "No puede contradecir a la norma de mayor jerarquía." },
            { q: "La división de poderes evita…", opts: ["Las elecciones", "La concentración y el abuso de poder", "Los impuestos", "Las leyes"], correct: 1, fb: "Pesos y contrapesos entre los tres poderes." },
        ],
    },
    {
        id: "der_civil", mod: "Ramas", icon: FileSignature, mins: "30 min",
        title: "Derecho civil y contratos",
        intro: "El derecho civil regula las relaciones entre particulares: personas, bienes, familia y, sobre todo, los contratos que organizan la vida diaria.",
        theory: [
            { p: "Un contrato es un acuerdo de voluntades que crea obligaciones. Para ser válido necesita ciertos elementos: sin ellos, es nulo." },
            { list: [
                    "Consentimiento: acuerdo libre de las partes",
                    "Objeto: la cosa o conducta sobre la que se pacta (lícita y posible)",
                    "Causa/fin: el motivo lícito del acuerdo",
                    "Forma: a veces la ley exige forma escrita",
                ] },
            { tip: { icon: "✍️", text: "El consentimiento debe ser libre: si hubo error, dolo (engaño) o violencia, el contrato puede anularse. La voluntad viciada no obliga igual." } },
        ],
        practice: [
            { title: "¿Contrato válido?", goal: "Firmas una venta bajo amenaza. ¿Es válida?",
                steps: ["Revisa el consentimiento"],
                solution: `No: el consentimiento estuvo viciado por VIOLENCIA.
Sin voluntad libre, el contrato es anulable.
// La amenaza destruye el consentimiento real.` },
            { title: "Elementos del contrato", goal: "Enumera qué necesita un contrato para ser válido.",
                steps: ["Lista los elementos esenciales"],
                solution: `1. Consentimiento (acuerdo libre)
2. Objeto lícito y posible
3. Causa/fin lícito
4. Forma (si la ley la exige)
// Falta uno -> el contrato puede ser nulo.` },
        ],
        quiz: [
            { q: "Un contrato es…", opts: ["Una ley", "Un acuerdo de voluntades que crea obligaciones", "Una sanción", "Un delito"], correct: 1, fb: "Acuerdo que obliga a las partes." },
            { q: "Si firmas bajo engaño (dolo), el contrato…", opts: ["Es perfecto", "Puede anularse (consentimiento viciado)", "Es penal", "No existe el dolo"], correct: 1, fb: "El vicio del consentimiento permite anularlo." },
            { q: "¿Cuál NO es elemento del contrato?", opts: ["Consentimiento", "Objeto lícito", "Causa lícita", "Que sea famoso"], correct: 3, fb: "La fama no es requisito; sí lo son consentimiento, objeto y causa." },
        ],
    },
    {
        id: "der_penal", mod: "Ramas", icon: Gavel, mins: "30 min",
        title: "Derecho penal",
        intro: "El derecho penal define qué conductas son delitos y qué penas les corresponden. Para condenar, deben cumplirse varios filtros en orden.",
        theory: [
            { seq: ["Conducta", "Tipicidad", "Antijuridicidad", "Culpabilidad", "Pena"], cap: "Teoría del delito: una conducta solo es delito si pasa todos los filtros, en orden." },
            { list: [
                    "Tipicidad: la conducta encaja en un delito descrito en la ley",
                    "Antijuridicidad: es contraria al derecho (sin causa que la justifique, p. ej. legítima defensa)",
                    "Culpabilidad: el autor podía comprender y actuar de otro modo",
                ] },
            { tip: { icon: "⚖️", text: "Principio de legalidad: 'no hay delito ni pena sin ley previa'. Nadie puede ser castigado por algo que no era delito cuando lo hizo." } },
        ],
        practice: [
            { title: "Aplica los filtros", goal: "Alguien mata a otro para defender su vida de una agresión real. ¿Es delito?",
                steps: ["Revisa la antijuridicidad"],
                solution: `La conducta es típica (matar encaja en homicidio),
PERO hay legítima defensa: una causa de justificación.
=> No es antijurídica -> NO hay delito.
// Falla un filtro -> no se condena.` },
            { title: "Principio de legalidad", goal: "¿Se puede castigar a alguien por una conducta que se volvió delito después?",
                steps: ["Piensa en 'ley previa'"],
                solution: `No. 'No hay delito ni pena sin ley previa'.
La ley penal no se aplica retroactivamente en perjuicio.
// Solo cuenta lo que YA era delito al momento del hecho.` },
        ],
        quiz: [
            { q: "Para que haya delito, la conducta debe ser…", opts: ["Solo típica", "Típica, antijurídica y culpable", "Famosa", "Antigua"], correct: 1, fb: "Los tres filtros en orden." },
            { q: "La legítima defensa elimina la…", opts: ["Tipicidad", "Antijuridicidad", "Pena del juez", "Ley"], correct: 1, fb: "Es una causa de justificación: la conducta deja de ser antijurídica." },
            { q: "El principio de legalidad dice…", opts: ["Toda conducta es delito", "No hay delito ni pena sin ley previa", "El juez decide solo", "Las leyes son retroactivas"], correct: 1, fb: "Nullum crimen sine lege: ley previa." },
        ],
    },
    {
        id: "der_proc", mod: "Ramas", icon: Gavel, mins: "25 min",
        title: "Derecho procesal",
        intro: "Tener la razón no basta: hay que probarla siguiendo un proceso. El derecho procesal son las reglas del 'cómo' se resuelve un conflicto ante un juez.",
        theory: [
            { seq: ["Demanda", "Contestación", "Pruebas", "Alegatos", "Sentencia"], cap: "Las etapas básicas de un juicio. Cada parte tiene su momento para actuar." },
            { p: "El proceso garantiza el debido proceso: que ambas partes sean oídas, puedan presentar pruebas y haya un juez imparcial. Quien afirma, debe probar (carga de la prueba)." },
            { tip: { icon: "🧾", text: "'A quien afirma, le toca probar'. No basta con tener razón: hay que acreditarla con pruebas válidas dentro del proceso." } },
        ],
        practice: [
            { title: "Carga de la prueba", goal: "Demandas a alguien por una deuda. ¿Quién debe probar que existe?",
                steps: ["Recuerda 'quien afirma, prueba'"],
                solution: `Tú, que AFIRMAS que existe la deuda, debes probarla
(con el contrato, recibos, etc.).
// La carga recae en quien hace la afirmación.` },
            { title: "Debido proceso", goal: "¿Por qué un juicio sin oír a una parte es nulo?",
                steps: ["Piensa en las garantías"],
                solution: `Porque viola el DEBIDO PROCESO: toda parte tiene
derecho a ser oída y a defenderse.
Una sentencia dictada sin escuchar a alguien es nula.` },
        ],
        quiz: [
            { q: "El derecho procesal regula…", opts: ["Qué es delito", "Cómo se tramita y resuelve un conflicto", "Los contratos", "La Constitución"], correct: 1, fb: "Es el 'cómo' del proceso." },
            { q: "La carga de la prueba recae en…", opts: ["El juez", "Quien afirma un hecho", "El público", "Nadie"], correct: 1, fb: "Quien afirma debe probar." },
            { q: "El debido proceso exige…", opts: ["Resolver rápido sin oír", "Que ambas partes sean oídas ante juez imparcial", "Solo una parte", "Pagar más"], correct: 1, fb: "Audiencia, defensa e imparcialidad." },
        ],
    },
    {
        id: "der_arg", mod: "Práctica", icon: Scale, mins: "30 min",
        title: "Argumentación jurídica",
        intro: "Un buen abogado no solo conoce la ley: la usa para construir argumentos convincentes y bien fundados. Argumentar es pesar razones.",
        theory: [
            { anim: "scales" },
            { p: "El esquema clásico es el silogismo jurídico: una premisa mayor (la norma), una premisa menor (los hechos) y una conclusión (la consecuencia). Si las premisas son sólidas, la conclusión se impone." },
            { seq: ["Premisa mayor (norma)", "Premisa menor (hechos)", "Conclusión"], cap: "Silogismo jurídico: aplicar la norma general al caso concreto para llegar a la decisión." },
            { tip: { icon: "🗣️", text: "Un argumento fuerte conecta hechos probados con la norma correcta. Si el adversario discute los hechos o la interpretación, ahí está la batalla." } },
        ],
        practice: [
            { title: "Arma un silogismo", goal: "Norma: 'el que daña debe reparar'. Hecho: 'Juan rompió la ventana de Ana'. Conclusión?",
                steps: ["Mayor + menor → conclusión"],
                solution: `Premisa mayor: quien daña la propiedad ajena debe repararla.
Premisa menor: Juan dañó la ventana de Ana.
Conclusión: Juan debe reparar la ventana de Ana.` },
            { title: "Ataca el argumento", goal: "¿Cómo refutaría el abogado de Juan ese silogismo?",
                steps: ["Ataca una premisa"],
                solution: `Dos vías:
1. Negar los HECHOS (premisa menor): "Juan no la rompió".
2. Discutir la NORMA/interpretación: "fue caso fortuito,
   no hay responsabilidad".
// Se ataca una premisa para tumbar la conclusión.` },
        ],
        quiz: [
            { q: "El silogismo jurídico parte de…", opts: ["Una sola idea", "Premisa mayor (norma) + menor (hechos)", "El azar", "La opinión"], correct: 1, fb: "Norma + hechos → conclusión." },
            { q: "Para refutar un argumento, atacas…", opts: ["Al juez", "Una de las premisas (hechos o norma)", "El edificio", "Nada"], correct: 1, fb: "Si cae una premisa, cae la conclusión." },
            { q: "Un argumento fuerte conecta…", opts: ["Emoción y volumen", "Hechos probados con la norma correcta", "Solo opiniones", "Datos falsos"], correct: 1, fb: "Hechos + norma adecuada = solidez." },
        ],
    },
    {
        id: "der_ddhh", mod: "Garantías", icon: ShieldCheck, mins: "25 min",
        title: "Derechos humanos y jurisprudencia",
        intro: "Los derechos humanos son el piso mínimo que ningún poder puede cruzar. La jurisprudencia es cómo los tribunales los van precisando caso a caso.",
        theory: [
            { pairs: [
                    { a: "1ª generación", b: "civiles y políticos (libertad, voto)" },
                    { a: "2ª generación", b: "sociales (salud, educación, trabajo)" },
                    { a: "3ª generación", b: "colectivos (ambiente, paz)" },
                ], cap: "Los derechos humanos suelen agruparse en generaciones, según el momento histórico en que se reconocieron." },
            { p: "Son universales (de todos), inalienables (no se renuncian) e interdependientes. La jurisprudencia —el conjunto de criterios reiterados de los tribunales— les da contenido concreto y, cuando es obligatoria, vincula a casos futuros." },
            { tip: { icon: "🕊️", text: "Un precedente importante puede cambiar la interpretación de un derecho para todos. Por eso la jurisprudencia es fuente viva del derecho." } },
        ],
        practice: [
            { title: "Clasifica el derecho", goal: "Ubica la generación: libertad de expresión; derecho a la salud; derecho a un ambiente sano.",
                steps: ["1ª, 2ª o 3ª generación"],
                solution: `Libertad de expresión   -> 1ª generación (civil/político)
Derecho a la salud      -> 2ª generación (social)
Ambiente sano           -> 3ª generación (colectivo)` },
            { title: "Función de la jurisprudencia", goal: "¿Por qué un fallo de un tribunal superior puede afectar casos futuros?",
                steps: ["Piensa en el precedente"],
                solution: `Porque sienta un PRECEDENTE: el criterio reiterado u
obligatorio guía cómo deben resolverse casos parecidos.
Da certeza y trato igual a situaciones iguales.` },
        ],
        quiz: [
            { q: "Los derechos humanos son…", opts: ["Solo para algunos", "Universales e inalienables", "Renunciables", "Temporales"], correct: 1, fb: "De todos, irrenunciables e interdependientes." },
            { q: "El derecho a la educación es de…", opts: ["1ª generación", "2ª generación (social)", "Ninguna", "4ª generación"], correct: 1, fb: "Derechos sociales = segunda generación." },
            { q: "La jurisprudencia es…", opts: ["Una ley nueva del Congreso", "Los criterios reiterados de los tribunales", "Un contrato", "Una multa"], correct: 1, fb: "Da contenido a la ley y puede vincular casos futuros." },
        ],
    },
];

export default function App() {
    return (
        <Course
            storageKey="derecho_progress_v1"
            kick="// EVOLUTIVE · DERECHO"
            title="DERECHO" titleHi="DE CERO A JURISTA"
            subtitle="De la teoría general a los derechos humanos: fundamentos, ramas, práctica y garantías. Con esquemas visuales, casos resueltos y quiz por lección."
            HeaderIcon={Scale}
            theme={theme} mods={mods} ranks={ranks} lessons={lessons} anims={anims}
        />
    );
}