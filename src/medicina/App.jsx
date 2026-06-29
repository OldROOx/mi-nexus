import React, { useState, useEffect } from "react";
import Course from "../_course/Course.jsx";
import { Stethoscope, HeartPulse, Activity, Pill, Microscope, FlaskConical, Siren, ShieldPlus, ClipboardList } from "lucide-react";

/* ---------- animación custom: trazo de ECG ---------- */
function AnimECG() {
    const [t, setT] = useState(0);
    useEffect(() => { const id = setInterval(() => setT((p) => (p + 2) % 200), 30); return () => clearInterval(id); }, []);
    // patrón PQRST repetido
    const wave = "M0,30 L20,30 L24,28 L28,32 L34,30 L40,30 L44,10 L48,50 L52,30 L70,30 L76,24 L82,30 L100,30";
    return (
        <div className="cw-anim">
            <svg viewBox="0 0 200 60" className="cw-svg" style={{ background: "var(--code)", borderRadius: 10 }}>
                <path d={wave} fill="none" stroke="var(--acc)" strokeWidth="2" transform="translate(0,0)" />
                <path d={wave} fill="none" stroke="var(--acc)" strokeWidth="2" transform="translate(100,0)" />
                <circle cx={t} cy="30" r="3" fill="var(--acc2)" />
            </svg>
            <p className="cw-anim-cap">El corazón late con un patrón eléctrico (P-QRS-T). Leer un electrocardiograma es reconocer cuándo ese ritmo se altera.</p>
        </div>
    );
}
const anims = { ecg: AnimECG };

const theme = {
    bg: "#0c1413", panel: "#11201d", panel2: "#0e1a18", code: "#081210",
    border: "#1b322d", border2: "#23413a", text: "#e6efec", muted: "#93b0a8", dim: "#5f7a73",
    acc: "#16c79a", acc2: "#7ff0d4", accGlow: "rgba(22,199,154,.5)", accSoft: "rgba(22,199,154,.10)", onAcc: "#06120f",
};

const mods = [
    { name: "Bases", sub: "Cómo está hecho y cómo funciona", icon: HeartPulse },
    { name: "Clínica", sub: "Leer al paciente", icon: Stethoscope },
    { name: "Terapéutica", sub: "Tratar con evidencia", icon: Pill },
    { name: "Práctica", sub: "Urgencias y prevención", icon: Siren },
];
const ranks = [
    { min: 0, name: "Estudiante de 1er año" },
    { min: 300, name: "Estudiante clínico" },
    { min: 700, name: "Interno" },
    { min: 1100, name: "Médico general" },
    { min: 1500, name: "Clínico experto" },
];

const lessons = [
    {
        id: "med_anat", mod: "Bases", icon: HeartPulse, mins: "25 min",
        title: "Anatomía: el mapa del cuerpo",
        intro: "La anatomía es el lenguaje base de la medicina: dónde está cada cosa y cómo se nombra. Sin este mapa, nada de lo demás tiene referencia.",
        theory: [
            { pairs: [
                    { a: "Sistema cardiovascular", b: "corazón, arterias, venas" },
                    { a: "Sistema respiratorio", b: "vías aéreas, pulmones" },
                    { a: "Sistema nervioso", b: "cerebro, médula, nervios" },
                    { a: "Sistema digestivo", b: "boca → estómago → intestinos" },
                ], cap: "Cada órgano pertenece a un sistema con una función. Aprende a agruparlos, no a memorizarlos sueltos." },
            { p: "La anatomía se organiza por sistemas y por regiones. Se usa una posición de referencia (anatómica) y planos (sagital, frontal, transversal) para describir ubicaciones sin ambigüedad." },
            { h: "Términos de posición" },
            { list: ["Proximal / distal: cerca / lejos del tronco", "Medial / lateral: hacia el centro / hacia afuera", "Anterior / posterior: adelante / atrás", "Superior / inferior: arriba / abajo"] },
            { tip: { icon: "🧭", text: "Estudia anatomía con función en mente: no memorices el nervio, pregunta qué músculo mueve y qué pasa si se lesiona. Así se queda." } },
        ],
        practice: [
            { title: "Ubica con términos correctos", goal: "Describe la posición de la rodilla respecto a la cadera y al tobillo.",
                steps: ["Usa proximal/distal"],
                solution: `La rodilla es DISTAL a la cadera (más lejos del tronco)
y PROXIMAL al tobillo (más cerca del tronco).
// Los términos son relativos: siempre respecto a algo.` },
            { title: "Agrupa por sistema", goal: "Clasifica: tráquea, aorta, fémur, neurona.",
                steps: ["Asigna cada uno a su sistema"],
                solution: `tráquea -> sistema respiratorio
aorta   -> sistema cardiovascular
fémur   -> sistema musculoesquelético
neurona -> sistema nervioso` },
        ],
        quiz: [
            { q: "¿Qué significa 'distal'?", opts: ["Cerca del tronco", "Más lejos del tronco", "Hacia el centro", "Arriba"], correct: 1, fb: "Distal = más alejado del punto de referencia/tronco." },
            { q: "El corazón pertenece al sistema…", opts: ["Respiratorio", "Cardiovascular", "Digestivo", "Nervioso"], correct: 1, fb: "Es el motor del sistema cardiovascular." },
            { q: "¿Cuál es la mejor forma de estudiar anatomía?", opts: ["Memorizar listas sueltas", "Relacionar estructura con función", "Solo ver imágenes", "Ignorar la posición"], correct: 1, fb: "Estructura + función se retiene mucho mejor." },
        ],
    },
    {
        id: "med_fisio", mod: "Bases", icon: Activity, mins: "30 min",
        title: "Fisiología: cómo funciona en equilibrio",
        intro: "La fisiología explica cómo el cuerpo mantiene constante su medio interno (homeostasis) pese a que todo afuera cambie.",
        theory: [
            { anim: "ecg" },
            { p: "Homeostasis: el cuerpo regula temperatura, pH, glucosa, presión y más dentro de rangos estrechos. Lo hace con asas de retroalimentación: un sensor detecta el cambio, un centro lo compara con el valor ideal y un efector corrige." },
            { cycle: ["Estímulo", "Sensor", "Centro integrador", "Efector", "Corrección"], note: "retroalimentación negativa", cap: "La mayoría de los controles del cuerpo son de retroalimentación negativa: corrigen para volver al equilibrio." },
            { tip: { icon: "⚖️", text: "Casi toda la fisiología es 'mantener algo constante'. Si entiendes el asa de retroalimentación, entiendes el 80% de los mecanismos." } },
        ],
        practice: [
            { title: "Identifica el asa", goal: "En el control de la glucosa, ¿qué hace la insulina cuando sube el azúcar?",
                steps: ["Piensa en sensor-centro-efector"],
                solution: `Sube la glucosa (estímulo) -> el páncreas la detecta ->
libera INSULINA (efector) -> las células captan glucosa ->
la glucosa baja a su valor normal.
// Retroalimentación negativa clásica.` },
            { title: "Temperatura", goal: "¿Cómo recupera el cuerpo su temperatura si tienes frío?",
                steps: ["Nombra al menos 2 efectores"],
                solution: `Sensor: detecta baja temperatura.
Efectores: temblar (genera calor) y
vasoconstricción (conserva calor).
// Resultado: la temperatura vuelve a ~37°C.` },
        ],
        quiz: [
            { q: "¿Qué es la homeostasis?", opts: ["Una enfermedad", "Mantener constante el medio interno", "Un órgano", "Un fármaco"], correct: 1, fb: "Es el equilibrio interno regulado del cuerpo." },
            { q: "La retroalimentación negativa sirve para…", opts: ["Amplificar el cambio", "Corregir y volver al valor ideal", "Detener el corazón", "Nada"], correct: 1, fb: "Contrarresta la desviación para restaurar el equilibrio." },
            { q: "Si sube la glucosa, el páncreas libera…", opts: ["Glucagón", "Insulina", "Adrenalina", "Nada"], correct: 1, fb: "La insulina baja la glucosa metiéndola a las células." },
        ],
    },
    {
        id: "med_fisiopato", mod: "Bases", icon: Activity, mins: "25 min",
        title: "Fisiopatología: cuando el equilibrio se rompe",
        intro: "Si la fisiología es cómo funciona sano, la fisiopatología es qué se descompone y por qué aparecen los síntomas.",
        theory: [
            { seq: ["Salud", "Agente/noxa", "Daño celular", "Respuesta", "Enfermedad"], cap: "La enfermedad es una cadena: una causa daña, el cuerpo responde, y de esa respuesta nacen los signos y síntomas." },
            { p: "Entender la fisiopatología te dice por qué un paciente tiene cierto síntoma. Ejemplo: en la insuficiencia cardíaca el corazón bombea mal → se acumula líquido → aparece falta de aire y edema." },
            { tip: { icon: "🔗", text: "No memorices síntomas: dedúcelos del mecanismo. Si entiendes qué falla, predices qué se va a ver en el paciente." } },
        ],
        practice: [
            { title: "Del mecanismo al síntoma", goal: "En la anemia hay pocos glóbulos rojos. ¿Por qué da cansancio y palidez?",
                steps: ["Piensa qué transportan los glóbulos rojos"],
                solution: `Pocos glóbulos rojos -> menos oxígeno a los tejidos ->
cansancio y dificultad para esfuerzos (hipoxia).
Menos hemoglobina (pigmento rojo) -> palidez.
// El síntoma se deduce del mecanismo.` },
            { title: "Cadena causal", goal: "Ordena: edema, corazón bombea mal, acumulación de líquido.",
                steps: ["De causa a efecto"],
                solution: `corazón bombea mal -> acumulación de líquido -> edema
// Una causa desencadena la siguiente.` },
        ],
        quiz: [
            { q: "La fisiopatología estudia…", opts: ["El cuerpo sano", "Cómo y por qué se produce la enfermedad", "Solo los huesos", "Los fármacos"], correct: 1, fb: "Es el mecanismo del enfermar." },
            { q: "¿Por qué la anemia causa cansancio?", opts: ["Por fiebre", "Llega menos oxígeno a los tejidos", "Por exceso de azúcar", "Por infección"], correct: 1, fb: "Menos glóbulos rojos = menos transporte de oxígeno." },
            { q: "La mejor forma de recordar síntomas es…", opts: ["Memorizar listas", "Deducirlos del mecanismo", "Adivinar", "Ignorarlos"], correct: 1, fb: "Del mecanismo se predicen los hallazgos." },
        ],
    },
    {
        id: "med_semio", mod: "Clínica", icon: Stethoscope, mins: "30 min",
        title: "Semiología y diagnóstico diferencial",
        intro: "La semiología es el arte de interrogar y explorar para recoger datos; el diagnóstico diferencial es la lista ordenada de posibles causas.",
        theory: [
            { seq: ["Síntoma", "Signo", "Síndrome", "Diagnóstico"], cap: "Del dato aislado (síntoma) se construye el cuadro (síndrome) y de ahí el diagnóstico más probable." },
            { p: "Síntoma = lo que el paciente refiere (dolor). Signo = lo que tú observas o mides (fiebre, soplo). Un buen interrogatorio (anamnesis) aporta el 70-80% del diagnóstico antes de cualquier estudio." },
            { h: "Diagnóstico diferencial" },
            { p: "Ante un cuadro, listas las causas posibles ordenadas por probabilidad y por gravedad. Primero descartas lo que mata (lo grave aunque sea raro), luego confirmas lo más probable." },
            { tip: { icon: "🩺", text: "Regla de oro: 'lo común es común'. Pero nunca dejes de descartar lo grave aunque sea poco probable." } },
        ],
        practice: [
            { title: "Síntoma vs signo", goal: "Clasifica: dolor de cabeza, fiebre de 39°C, mareo, presión 180/110.",
                steps: ["¿Lo refiere el paciente o lo mides tú?"],
                solution: `Síntomas (los refiere el paciente): dolor de cabeza, mareo
Signos (los mides/observas): fiebre 39°C, presión 180/110` },
            { title: "Arma un diferencial", goal: "Joven con dolor en fosa ilíaca derecha. Da 3 causas posibles.",
                steps: ["Ordena por probabilidad/gravedad"],
                solution: `Diferencial de dolor en fosa ilíaca derecha:
1. Apendicitis (descartar primero: grave y común)
2. Cólico/infección urinaria
3. Causa ginecológica (si aplica)
// Primero lo grave, luego lo probable.` },
        ],
        quiz: [
            { q: "Un 'signo' es…", opts: ["Lo que el paciente siente", "Lo que el médico observa o mide", "Un fármaco", "Un examen"], correct: 1, fb: "Signo = objetivo (medible); síntoma = subjetivo." },
            { q: "¿Qué aporta más al diagnóstico?", opts: ["Los estudios caros", "Una buena historia clínica (anamnesis)", "El azar", "La intuición sola"], correct: 1, fb: "La anamnesis bien hecha orienta la mayoría de los casos." },
            { q: "En un diferencial, ¿qué descartas primero?", opts: ["Lo más raro", "Lo más grave (aunque sea poco probable)", "Nada", "Lo más barato"], correct: 1, fb: "Primero lo que pone en peligro la vida." },
        ],
    },
    {
        id: "med_lab", mod: "Clínica", icon: FlaskConical, mins: "25 min",
        title: "Interpretación de laboratorios",
        intro: "Un análisis no se 'lee', se interpreta en contexto. El mismo número significa cosas distintas según el paciente.",
        theory: [
            { p: "Cada prueba tiene un rango de referencia (valores normales). Un valor fuera de rango no siempre es enfermedad, y uno dentro de rango no siempre la descarta. Siempre se interpreta junto a la clínica." },
            { table: { head: ["Prueba", "Valor normal aprox.", "Si está alto sugiere"], rows: [
                        ["Glucosa (ayunas)", "70–100 mg/dL", "diabetes / estrés"],
                        ["Hemoglobina", "12–16 g/dL", "(bajo) anemia"],
                        ["Leucocitos", "4,000–11,000", "infección / inflamación"],
                        ["Creatinina", "0.6–1.2 mg/dL", "falla renal"],
                    ] } },
            { tip: { icon: "🧪", text: "No trates el papel, trata al paciente. Un resultado anormal sin síntomas puede ser variación normal, error de toma o necesitar repetición." } },
        ],
        practice: [
            { title: "Interpreta en contexto", goal: "Leucocitos en 15,000 con fiebre y tos. ¿Qué sugiere?",
                steps: ["Compara con el rango y la clínica"],
                solution: `Leucocitos 15,000 (alto, normal 4,000–11,000)
+ fiebre + tos -> sugiere INFECCIÓN (probable respiratoria).
// El número cobra sentido junto a los síntomas.` },
            { title: "Valor aislado", goal: "Glucosa 105 en ayunas en alguien sin síntomas. ¿Conducta?",
                steps: ["¿Confirmar o alarmar?"],
                solution: `105 mg/dL está levemente sobre 100: NO es diagnóstico por sí solo.
Conducta: repetir/confirmar y valorar factores de riesgo,
no diagnosticar diabetes con una sola cifra limítrofe.` },
        ],
        quiz: [
            { q: "Un valor fuera de rango…", opts: ["Siempre es enfermedad", "Se interpreta con la clínica, no aislado", "Se ignora", "Es error siempre"], correct: 1, fb: "El contexto clínico manda." },
            { q: "Leucocitos altos suelen indicar…", opts: ["Anemia", "Infección o inflamación", "Diabetes", "Nada"], correct: 1, fb: "La leucocitosis acompaña infecciones/inflamación." },
            { q: "Creatinina elevada sugiere problema…", opts: ["Del hígado", "Renal", "Pulmonar", "Óseo"], correct: 1, fb: "La creatinina evalúa función renal." },
        ],
    },
    {
        id: "med_farma", mod: "Terapéutica", icon: Pill, mins: "30 min",
        title: "Farmacología: cómo actúan los medicamentos",
        intro: "Un fármaco hace dos viajes: lo que el cuerpo le hace (cómo se absorbe y elimina) y lo que él le hace al cuerpo (su mecanismo).",
        theory: [
            { cycle: ["Absorción", "Distribución", "Metabolismo", "Excreción"], note: "ADME", cap: "Farmacocinética (ADME): el camino del fármaco por el cuerpo, desde que entra hasta que se elimina." },
            { pairs: [
                    { a: "Analgésico (ibuprofeno)", b: "bloquea la inflamación" },
                    { a: "Antibiótico", b: "mata o frena bacterias" },
                    { a: "Antihipertensivo", b: "baja la presión" },
                    { a: "Insulina", b: "baja la glucosa" },
                ], cap: "Farmacodinamia: qué le hace el fármaco al cuerpo. Cada uno actúa sobre un blanco (receptor, enzima)." },
            { tip: { icon: "💊", text: "Dosis correcta, vía correcta, paciente correcto, momento correcto. La diferencia entre medicina y veneno suele ser la dosis." } },
        ],
        practice: [
            { title: "Cinética vs dinámica", goal: "Clasifica: 'el hígado metaboliza el fármaco' y 'el fármaco bloquea un receptor'.",
                steps: ["¿Qué le hace el cuerpo al fármaco vs al revés?"],
                solution: `'el hígado metaboliza el fármaco' -> farmacoCINÉTICA (ADME)
'el fármaco bloquea un receptor' -> farmacoDINAMIA (efecto)` },
            { title: "Vía y velocidad", goal: "¿Por qué una inyección intravenosa actúa más rápido que una pastilla?",
                steps: ["Piensa en la 'A' de ADME"],
                solution: `La pastilla debe ABSORBERSE desde el intestino (toma tiempo).
La vía intravenosa entra directo a la sangre: sin paso de
absorción, el efecto es casi inmediato.` },
        ],
        quiz: [
            { q: "ADME se refiere a…", opts: ["Tipos de cirugía", "Absorción, Distribución, Metabolismo, Excreción", "Una bacteria", "Un órgano"], correct: 1, fb: "Es el recorrido del fármaco (farmacocinética)." },
            { q: "Que el fármaco bloquee un receptor es…", opts: ["Farmacocinética", "Farmacodinamia", "Anatomía", "Semiología"], correct: 1, fb: "Es lo que el fármaco le hace al cuerpo." },
            { q: "¿Qué diferencia medicina de veneno frecuentemente?", opts: ["El color", "La dosis", "El nombre", "El precio"], correct: 1, fb: "La dosis define el efecto terapéutico o tóxico." },
        ],
    },
    {
        id: "med_mbe", mod: "Terapéutica", icon: Microscope, mins: "25 min",
        title: "Medicina basada en evidencia",
        intro: "Tratar no es por costumbre ni por opinión: es integrar la mejor evidencia disponible con la experiencia clínica y los valores del paciente.",
        theory: [
            { seq: ["Pregunta", "Buscar evidencia", "Evaluar calidad", "Aplicar al paciente"], cap: "El método de la MBE: convierte una duda clínica en una pregunta, busca estudios, los evalúa y los aplica con criterio." },
            { h: "La pirámide de la evidencia" },
            { list: [
                    "Más fuerte: revisiones sistemáticas y metaanálisis",
                    "Ensayos clínicos aleatorizados",
                    "Estudios de cohortes y casos-controles",
                    "Más débil: opinión de experto / reporte de caso",
                ] },
            { tip: { icon: "📊", text: "No toda evidencia pesa igual. Un metaanálisis vale más que una anécdota, aunque la anécdota suene convincente." } },
        ],
        practice: [
            { title: "Jerarquiza evidencia", goal: "Ordena de más a menos fuerte: opinión de experto, ensayo aleatorizado, metaanálisis.",
                steps: ["Recuerda la pirámide"],
                solution: `1. Metaanálisis / revisión sistemática (más fuerte)
2. Ensayo clínico aleatorizado
3. Opinión de experto (más débil)` },
            { title: "Formula una pregunta", goal: "Convierte 'sirve el ejercicio para la diabetes' en una pregunta tipo PICO.",
                steps: ["Paciente, Intervención, Comparación, Outcome"],
                solution: `En pacientes con diabetes tipo 2 (P),
¿el ejercicio regular (I) comparado con no hacerlo (C)
mejora el control de glucosa (O)?
// Pregunta PICO: clara y buscable.` },
        ],
        quiz: [
            { q: "La MBE integra evidencia, experiencia clínica y…", opts: ["El precio", "Los valores del paciente", "La moda", "El horario"], correct: 1, fb: "Las tres patas: evidencia, clínica y paciente." },
            { q: "¿Qué evidencia es más fuerte?", opts: ["Opinión de experto", "Metaanálisis", "Anécdota", "Publicidad"], correct: 1, fb: "Lo más alto de la pirámide." },
            { q: "Una pregunta PICO sirve para…", opts: ["Cobrar", "Buscar evidencia de forma estructurada", "Diagnosticar sin datos", "Nada"], correct: 1, fb: "Estructura la búsqueda: Paciente, Intervención, Comparación, Outcome." },
        ],
    },
    {
        id: "med_urg", mod: "Práctica", icon: Siren, mins: "30 min",
        title: "Urgencias médicas y prevención",
        intro: "En una urgencia el orden salva vidas: se atiende primero lo que mata más rápido. Y la mejor medicina sigue siendo evitar que pase.",
        theory: [
            { seq: ["A · vía aérea", "B · respiración", "C · circulación", "D · neurológico", "E · exposición"], cap: "El ABCDE: el orden universal para evaluar a un paciente grave. Se resuelve cada letra antes de pasar a la siguiente." },
            { p: "La idea es tratar lo que primero mata: una vía aérea obstruida mata en minutos; por eso es la 'A'. Solo cuando A está asegurada se pasa a B, y así." },
            { h: "Prevención: tres niveles" },
            { pairs: [
                    { a: "Primaria", b: "evitar que aparezca (vacunas)" },
                    { a: "Secundaria", b: "detectar temprano (tamizaje)" },
                    { a: "Terciaria", b: "evitar complicaciones" },
                ], cap: "Prevenir es más eficiente que curar. Cada nivel actúa en un momento distinto de la enfermedad." },
            { tip: { icon: "🚑", text: "Regla mental en urgencias: '¿qué es lo que lo mata en los próximos minutos?'. Eso se atiende primero, siempre en orden ABCDE." } },
        ],
        practice: [
            { title: "Aplica el ABCDE", goal: "Paciente inconsciente que no respira bien. ¿Por dónde empiezas?",
                steps: ["Recuerda el orden"],
                solution: `Empiezas por A: asegurar la VÍA AÉREA (abrirla, despejarla).
Sin vía aérea no hay respiración (B) ni circulación útil (C).
// Nunca saltes letras: A antes que B.` },
            { title: "Clasifica prevención", goal: "Ubica el nivel: vacuna contra el tétanos; mamografía de tamizaje; rehabilitación tras un infarto.",
                steps: ["Primaria/secundaria/terciaria"],
                solution: `Vacuna del tétanos      -> prevención PRIMARIA
Mamografía de tamizaje  -> prevención SECUNDARIA
Rehabilitación post-infarto -> prevención TERCIARIA` },
        ],
        quiz: [
            { q: "En el ABCDE, ¿qué se atiende primero?", opts: ["La circulación", "La vía aérea (A)", "La piel", "El dolor"], correct: 1, fb: "A: una vía aérea obstruida mata en minutos." },
            { q: "Una vacuna es prevención…", opts: ["Primaria", "Secundaria", "Terciaria", "Ninguna"], correct: 0, fb: "Evita que la enfermedad aparezca." },
            { q: "El tamizaje (detección temprana) es prevención…", opts: ["Primaria", "Secundaria", "Terciaria", "Curativa"], correct: 1, fb: "Detecta la enfermedad antes de que dé síntomas." },
        ],
    },
];

export default function App() {
    return (
        <Course
            storageKey="medicina_progress_v1"
            kick="// EVOLUTIVE · MEDICINA"
            title="MEDICINA" titleHi="DE CERO A CLÍNICO"
            subtitle="De la anatomía a las urgencias: bases, clínica, terapéutica y práctica. Teoría con apoyos visuales, casos resueltos y quiz por lección."
            HeaderIcon={Stethoscope}
            theme={theme} mods={mods} ranks={ranks} lessons={lessons} anims={anims}
        />
    );
}