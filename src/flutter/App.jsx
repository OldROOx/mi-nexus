import React, { useState, useEffect } from "react";
import {
    Smartphone, BookOpen, Terminal, Lightbulb, Check, ChevronLeft, ChevronRight,
    Eye, EyeOff, Award, Zap, Layers, GitBranch,
    Hash, Shield, Radio, Box, Code, RotateCcw, Play, Workflow, RefreshCw,
    LayoutGrid, FormInput, Pause,
} from "lucide-react";

/* ============================================================
   FLUTTER + DART — Examen edition
   Curso autónomo. Progreso en localStorage (flutter_progress_v1).
   Enfocado en los temas de evaluación + animaciones explicativas
   integradas en cada lección.
   ── En el código Dart, \${...} es interpolación (se ve como ${...}).
   ============================================================ */

const SAVE_KEY = "flutter_progress_v1";

/* ====================================================================
   COMPONENTES DE ANIMACIÓN — cada uno es autocontenido, usa CSS/SVG,
   no requiere librerías externas. Se usan dentro de los bloques de
   teoría con { anim: "nombre" }.
   ==================================================================== */

/* --- 1. Árbol de Widgets: muestra cómo un widget contiene a otros --- */
function AnimWidgetTree() {
    const [step, setStep] = useState(0);
    const nodes = [
        { id: 0, label: "MaterialApp", x: 200, y: 20 },
        { id: 1, label: "Scaffold", x: 200, y: 80 },
        { id: 2, label: "AppBar", x: 90, y: 140 },
        { id: 3, label: "Column", x: 310, y: 140 },
        { id: 4, label: "Text", x: 240, y: 200 },
        { id: 5, label: "Button", x: 380, y: 200 },
    ];
    const edges = [[0,1],[1,2],[1,3],[3,4],[3,5]];
    useEffect(() => {
        const t = setInterval(() => setStep((s) => (s + 1) % (nodes.length + 1)), 700);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="fl-anim">
            <svg viewBox="0 0 480 240" className="fl-anim-svg">
                {edges.map(([a, b], i) => {
                    const A = nodes[a], B = nodes[b];
                    const litA = step > a, litB = step > b;
                    return (
                        <line key={i} x1={A.x} y1={A.y + 12} x2={B.x} y2={B.y - 12}
                              stroke={litA && litB ? "#42A5F5" : "#1e2a38"} strokeWidth="2"
                              style={{ transition: "stroke .3s" }} />
                    );
                })}
                {nodes.map((n) => {
                    const lit = step > n.id;
                    return (
                        <g key={n.id} style={{ transition: "all .35s" }}>
                            <rect x={n.x - 48} y={n.y - 14} width="96" height="28" rx="8"
                                  fill={lit ? "rgba(66,165,245,.18)" : "#0f1620"}
                                  stroke={lit ? "#42A5F5" : "#1e2a38"} strokeWidth="1.5"
                                  style={{ transition: "all .35s" }} />
                            <text x={n.x} y={n.y + 4} textAnchor="middle"
                                  fill={lit ? "#aee0ff" : "#5d708a"} fontSize="11" fontFamily="JetBrains Mono, monospace"
                                  style={{ transition: "fill .35s" }}>{n.label}</text>
                        </g>
                    );
                })}
            </svg>
            <p className="fl-anim-cap">Cada widget es una caja que contiene a otras cajas. Así se construye TODA la pantalla: un árbol de widgets anidados.</p>
        </div>
    );
}

/* --- 2. Stateless vs Stateful: comparación de rebuild --- */
function AnimStatelessVsStateful() {
    const [tick, setTick] = useState(0);
    const [running, setRunning] = useState(true);
    useEffect(() => {
        if (!running) return;
        const t = setInterval(() => setTick((s) => s + 1), 1100);
        return () => clearInterval(t);
    }, [running]);
    const pulseKey = tick;
    return (
        <div className="fl-anim">
            <div className="fl-svs-row">
                <div className="fl-svs-col">
                    <div className="fl-svs-tag">StatelessWidget</div>
                    <div className="fl-svs-box static">
                        <Box size={26} />
                        <span>Texto fijo: "Hola"</span>
                    </div>
                    <div className="fl-svs-note">No cambia. Se construye una vez y ya.</div>
                </div>
                <div className="fl-svs-col">
                    <div className="fl-svs-tag">StatefulWidget</div>
                    <div key={pulseKey} className="fl-svs-box dynamic">
                        <RefreshCw size={26} className="fl-spin-once" />
                        <span>Contador: {tick}</span>
                    </div>
                    <div className="fl-svs-note">Se redibuja cada vez que su estado cambia (setState).</div>
                </div>
            </div>
            <button className="fl-anim-btn" onClick={() => setRunning((r) => !r)}>
                {running ? <Pause size={13} /> : <Play size={13} />} {running ? "Pausar" : "Reanudar"}
            </button>
        </div>
    );
}

/* --- 3. Ciclo de vida de StatefulWidget --- */
function AnimLifecycle() {
    const stages = ["createState()", "initState()", "build()", "setState() → build()", "dispose()"];
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((v) => (v + 1) % stages.length), 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="fl-anim">
            <div className="fl-life-track">
                {stages.map((s, idx) => (
                    <React.Fragment key={s}>
                        <div className={`fl-life-node ${idx === i ? "active" : ""} ${idx < i ? "past" : ""}`}>
                            <span className="fl-life-dot" />
                            <span className="fl-life-label">{s}</span>
                        </div>
                        {idx < stages.length - 1 && <div className={`fl-life-line ${idx < i ? "past" : ""}`} />}
                    </React.Fragment>
                ))}
            </div>
            <p className="fl-anim-cap">
                {i === 0 && "Flutter crea el objeto State (la memoria del widget)."}
                {i === 1 && "initState() corre UNA vez: ideal para inicializar datos."}
                {i === 2 && "build() dibuja la UI por primera vez."}
                {i === 3 && "Cada setState() vuelve a llamar build() — así se actualiza la pantalla."}
                {i === 4 && "dispose() limpia todo cuando el widget se destruye (sale de pantalla)."}
            </p>
        </div>
    );
}

/* --- 4. Layout: Row / Column / Stack / Expanded en vivo --- */
function AnimLayout() {
    const [mode, setMode] = useState("row");
    const modes = ["row", "column", "stack", "expanded"];
    const boxes = ["#42A5F5", "#5cc88a", "#ffbd2e"];
    return (
        <div className="fl-anim">
            <div className="fl-layout-tabs">
                {modes.map((m) => (
                    <button key={m} className={`fl-layout-tab ${mode === m ? "on" : ""}`} onClick={() => setMode(m)}>{m}</button>
                ))}
            </div>
            <div className="fl-layout-stage">
                {mode === "row" && (
                    <div className="fl-row-demo">
                        {boxes.map((c, i) => <div key={i} className="fl-demo-box" style={{ background: c }}>{i + 1}</div>)}
                    </div>
                )}
                {mode === "column" && (
                    <div className="fl-col-demo">
                        {boxes.map((c, i) => <div key={i} className="fl-demo-box" style={{ background: c }}>{i + 1}</div>)}
                    </div>
                )}
                {mode === "stack" && (
                    <div className="fl-stack-demo">
                        {boxes.map((c, i) => (
                            <div key={i} className="fl-demo-box stacked" style={{ background: c, top: i * 14, left: i * 14, opacity: 1 - i * 0.12, zIndex: 3 - i }}>{i + 1}</div>
                        ))}
                    </div>
                )}
                {mode === "expanded" && (
                    <div className="fl-row-demo">
                        <div className="fl-demo-box" style={{ background: boxes[0], flex: "none", width: 50 }}>fijo</div>
                        <div className="fl-demo-box expanded-flex" style={{ background: boxes[1] }}>Expanded</div>
                        <div className="fl-demo-box" style={{ background: boxes[2], flex: "none", width: 50 }}>fijo</div>
                    </div>
                )}
            </div>
            <p className="fl-anim-cap">
                {mode === "row" && "Row pone a sus hijos en fila, uno junto al otro (horizontal)."}
                {mode === "column" && "Column pone a sus hijos uno debajo del otro (vertical)."}
                {mode === "stack" && "Stack los apila, uno ENCIMA del otro (como capas de Photoshop)."}
                {mode === "expanded" && "Expanded hace que un hijo de Row/Column estire para llenar el espacio sobrante."}
            </p>
        </div>
    );
}

/* --- 5. Flujo de estado: Evento → setState/notify → rebuild → UI --- */
function AnimStateFlow() {
    const [active, setActive] = useState(0);
    const steps = ["Usuario toca el botón", "setState() / notifyListeners()", "Flutter reconstruye (build)", "La UI se actualiza"];
    useEffect(() => {
        const t = setInterval(() => setActive((a) => (a + 1) % steps.length), 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="fl-anim">
            <div className="fl-flow">
                {steps.map((s, i) => (
                    <React.Fragment key={i}>
                        <div className={`fl-flow-node ${active === i ? "active" : ""}`}>{s}</div>
                        {i < steps.length - 1 && <div className="fl-flow-arrow">→</div>}
                    </React.Fragment>
                ))}
            </div>
            <p className="fl-anim-cap">Este ciclo se repite cada vez que algo cambia. Sin notificar el cambio (setState/notifyListeners), la UI se queda congelada con datos viejos.</p>
        </div>
    );
}

/* --- 6. Null Safety: caja vacía vs llena --- */
function AnimNullSafety() {
    const [val, setVal] = useState(null);
    const toggle = () => setVal((v) => (v ? null : "Hola"));
    return (
        <div className="fl-anim">
            <div className="fl-null-row">
                <div className={`fl-null-box ${val ? "filled" : "empty"}`}>
                    <span className="fl-null-label">String?</span>
                    <span className="fl-null-val">{val ?? "null"}</span>
                </div>
                <button className="fl-anim-btn" onClick={toggle}>
                    {val ? "Vaciar" : "Asignar valor"}
                </button>
            </div>
            <div className="fl-null-result">
                <span>nombre ?? 'Anónimo' → </span>
                <strong style={{ color: val ? "#5cc88a" : "#ffbd2e" }}>{val ?? "Anónimo"}</strong>
            </div>
            <p className="fl-anim-cap">Cuando la caja está vacía (null), el operador <code>??</code> entrega un valor de respaldo en su lugar, evitando que la app truene.</p>
        </div>
    );
}

/* --- 7. Formulario con validación en vivo --- */
function AnimFormValidation() {
    const [email, setEmail] = useState("");
    const valid = /\S+@\S+\.\S+/.test(email);
    const touched = email.length > 0;
    return (
        <div className="fl-anim">
            <div className="fl-form-demo">
                <label className="fl-form-label">Correo electrónico</label>
                <input
                    className={`fl-form-input ${touched ? (valid ? "ok" : "bad") : ""}`}
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {touched && (
                    <div className={`fl-form-msg ${valid ? "ok" : "bad"}`}>
                        {valid ? "✓ Correo válido" : "✗ Falta un formato válido (algo@algo.com)"}
                    </div>
                )}
            </div>
            <p className="fl-anim-cap">Escribe arriba: así se ve un validator() en vivo. TextFormField revisa el patrón y muestra el error ANTES de enviar el formulario.</p>
        </div>
    );
}

/* --- 8. Gestores de estado: comparación visual de "quién mueve el dato" --- */
function AnimStateManagers() {
    const opts = [
        { name: "setState", desc: "El widget se actualiza A SÍ MISMO. Simple, pero solo sirve localmente.", color: "#8a98a8" },
        { name: "Provider", desc: "Un ChangeNotifier centraliza el dato; las pantallas lo escuchan (watch/read).", color: "#42A5F5" },
        { name: "Riverpod", desc: "Como Provider, pero sin BuildContext y con más seguridad en compilación.", color: "#5cc88a" },
        { name: "Bloc", desc: "Eventos entran → Bloc procesa → emite nuevos Estados. Muy estructurado.", color: "#ffbd2e" },
        { name: "GetX", desc: "Variables 'reactivas' (.obs) que actualizan la UI solas al cambiar.", color: "#ff7b72" },
    ];
    const [sel, setSel] = useState(1);
    return (
        <div className="fl-anim">
            <div className="fl-mgr-tabs">
                {opts.map((o, i) => (
                    <button key={o.name} className={`fl-mgr-tab ${sel === i ? "on" : ""}`}
                            style={sel === i ? { borderColor: o.color, color: o.color } : {}}
                            onClick={() => setSel(i)}>{o.name}</button>
                ))}
            </div>
            <div className="fl-mgr-stage">
                <div className="fl-mgr-flow">
                    <div className="fl-mgr-box" style={{ borderColor: opts[sel].color }}>UI</div>
                    <div className="fl-mgr-arrow" style={{ color: opts[sel].color }}>⇄</div>
                    <div className="fl-mgr-box" style={{ borderColor: opts[sel].color, background: `${opts[sel].color}22` }}>{opts[sel].name}</div>
                </div>
                <p className="fl-anim-cap">{opts[sel].desc}</p>
            </div>
        </div>
    );
}

/* --- 9. setState en acción: contador con caja que "tiembla" al actualizar --- */
function AnimSetStateCounter() {
    const [n, setN] = useState(0);
    const [pulse, setPulse] = useState(false);
    const bump = () => {
        setN((x) => x + 1);
        setPulse(true);
        setTimeout(() => setPulse(false), 280);
    };
    return (
        <div className="fl-anim">
            <div className="fl-counter-row">
                <div className={`fl-counter-box ${pulse ? "pulse" : ""}`}>{n}</div>
                <button className="fl-anim-btn" onClick={bump}><Zap size={13} /> setState(() =&gt; n++)</button>
            </div>
            <p className="fl-anim-cap">Cada clic llama setState(): Flutter marca el widget como "sucio" y vuelve a correr build() con el nuevo valor.</p>
        </div>
    );
}

/* --- 10. App completa: navegación entre pantallas (organización) --- */
function AnimAppFlow() {
    const screens = ["Login", "Home", "Detalle", "Perfil"];
    const [cur, setCur] = useState(0);
    return (
        <div className="fl-anim">
            <div className="fl-app-row">
                {screens.map((s, i) => (
                    <React.Fragment key={s}>
                        <button className={`fl-app-screen ${cur === i ? "on" : ""}`} onClick={() => setCur(i)}>
                            <Smartphone size={16} />{s}
                        </button>
                        {i < screens.length - 1 && <span className="fl-app-arrow">→</span>}
                    </React.Fragment>
                ))}
            </div>
            <p className="fl-anim-cap">Cada pantalla es una Route. Navigator.push() avanza, Navigator.pop() regresa. Los datos (usuario, carrito) viven en un gestor de estado compartido entre todas.</p>
        </div>
    );
}
const L = [
    /* ===================== MÓDULO DART (base esencial) ===================== */
    {
        id: "d_intro", mod: "Dart", icon: Terminal, mins: "15 min",
        title: "Tu primer programa en Dart",
        intro: "Dart es el idioma que habla Flutter. Antes de hacer apps bonitas, hay que aprender a 'hablar' con la máquina.",
        theory: [
            { p: "Todo programa de Dart necesita un punto de partida llamado main(). Es como la puerta de entrada de una casa." },
            { code: { file: "hola.dart", code: `void main() {
  print('Hola, Flutter!');
}` } },
            { list: [
                    "void main() → la función donde arranca TODO. Siempre va.",
                    "{ } → las llaves encierran el bloque de código que se ejecuta.",
                    "print(...) → muestra algo en la consola.",
                    "; → cada instrucción termina con punto y coma.",
                ] },
            { tip: { icon: "💡", text: "Practica en dartpad.dev — escribes Dart y lo corres al instante, sin instalar nada." } },
        ],
        practice: [
            { title: "Tu propio Hola Mundo", goal: "Modifica el mensaje para que salude con TU nombre.",
                steps: ["Crea void main()", "Dentro, usa print() con tu nombre"],
                solution: `void main() {
  print('Hola, soy Gael y estoy aprendiendo Dart!');
}` },
        ],
        quiz: [
            { q: "¿Qué función es el punto de entrada obligatorio de todo programa Dart?", opts: ["start()", "main()", "init()", "run()"], correct: 1, fb: "main() es por donde la computadora empieza a ejecutar tu programa." },
            { q: "¿Con qué símbolo termina cada instrucción en Dart?", opts: ["Una coma ,", "Dos puntos :", "Punto y coma ;", "Nada"], correct: 2, fb: "El punto y coma ; cierra cada instrucción." },
        ],
    },
    {
        id: "d_vars", mod: "Dart", icon: Hash, mins: "25 min",
        title: "Variables, tipos de datos y seguridad de tipos",
        intro: "Una variable es una cajita con nombre donde guardas un dato. El 'tipo' es qué clase de dato cabe en esa cajita. Dart es 'fuertemente tipado': no puedes meter un texto donde se espera un número sin convertirlo, y eso evita muchísimos errores.",
        theory: [
            { code: { file: "variables.dart", code: `// Tipo explícito (tú dices qué guarda)
int edad = 20;          // número entero
double precio = 9.99;   // número con decimales
String nombre = 'Ana';  // texto (entre comillas)
bool activo = true;     // verdadero o falso

// Inferencia: Dart adivina el tipo solo
var ciudad = 'Guadalajara'; // sabe que es String

// Constantes (no cambian)
const pi = 3.14159;` } },
            { h: "Los tipos más usados" },
            { table: {
                    head: ["Tipo", "Ejemplo", "Para qué"],
                    rows: [
                        ["int", "42", "Números enteros"],
                        ["double", "3.14", "Números con decimales"],
                        ["String", "'hola'", "Texto"],
                        ["bool", "true / false", "Sí o no"],
                        ["List", "[1, 2, 3]", "Una lista de cosas"],
                        ["Map", "{'k': v}", "Pares clave→valor"],
                    ] } },
            { h: "Seguridad de tipos (type safety)" },
            { p: "Como Dart conoce el tipo de cada variable desde que la escribes, el compilador te avisa de errores ANTES de correr la app. Si int edad = 'veinte'; eso ni siquiera compila: te ahorra un bug en producción." },
            { h: "var vs final vs const" },
            { tip: { icon: "🔑", text: "var puede cambiar después · final se asigna UNA vez y ya · const es un valor fijo conocido desde el inicio (como pi)." } },
            { code: { file: "interpolacion.dart", code: `var nombre = 'Carlos';
var edad = 22;
print('Soy $nombre');
print('En 10 años tendré \${edad + 10}');` } },
        ],
        practice: [
            { title: "Perfil de usuario", goal: "Declara tus datos con tipos explícitos e imprime un resumen.",
                steps: ["Declara nombre (String), edad (int), altura (double), esEstudiante (bool)", "Usa var para la ciudad", "Imprime todo con interpolación ($variable)"],
                solution: `void main() {
  String nombre = 'Gael';
  int edad = 22;
  double altura = 1.75;
  bool esEstudiante = true;
  var ciudad = 'Tuxtla';
  print('$nombre, $edad años, mide $altura m.');
  print('Ciudad: $ciudad. ¿Estudiante? $esEstudiante');
}` },
        ],
        quiz: [
            { q: "¿Qué tipo usarías para guardar un precio como 9.99?", opts: ["int", "double", "String", "bool"], correct: 1, fb: "double guarda números con decimales." },
            { q: "¿Cuál puede cambiar de valor después de crearse?", opts: ["const", "final", "var", "Ninguna"], correct: 2, fb: "var puede reasignarse; final y const no." },
            { q: "¿Qué ventaja da la seguridad de tipos (type safety) de Dart?", opts: ["Hace la app más bonita", "Detecta errores de tipo ANTES de ejecutar, en tiempo de compilación", "Borra variables automáticamente", "No tiene ninguna ventaja"], correct: 1, fb: "El compilador atrapa errores de tipo antes de que la app corra." },
        ],
    },
    {
        id: "d_null", mod: "Dart", icon: Shield, mins: "30 min",
        title: "Null Safety: ?, ??, late y prevención de errores",
        intro: "null significa 'vacío, sin valor'. El error más famoso de la programación es usar algo vacío y que la app truene. Dart te protege de eso DESDE el compilador, antes de que la app corra.",
        theory: [
            { anim: "nullsafety" },
            { p: "Por default, en Dart una variable NUNCA puede ser null. Si quieres permitirlo, tienes que avisarle a Dart agregando un ? después del tipo: ahí declaras una variable 'nullable'." },
            { code: { file: "null.dart", code: `// Normal: NUNCA puede ser null
String nombre = 'Ana';

// Nullable: SÍ puede estar vacía (lleva ?)
String? apellido;  // ahora vale null y está bien` } },
            { h: "Los operadores de null (memorízalos, los usarás siempre)" },
            { code: { file: "operadores_null.dart", code: `String? nombre;

// ??  → valor por defecto si está vacío
var n = nombre ?? 'Anónimo';

// ?.  → acceso seguro (no truena si está vacío)
var largo = nombre?.length;

// !   → "confía en mí, no está vacío" (¡cuidado!)
var largo2 = nombre!.length;

// ??= → asigna SOLO si está vacío
String? ciudad;
ciudad ??= 'Tuxtla';  // se pone Tuxtla
ciudad ??= 'CDMX';    // NO cambia, ya tenía valor` } },
            { h: "late: 'prometo que le pongo valor antes de usarla'" },
            { p: "A veces sabes que una variable NO será null cuando la uses, pero no puedes darle valor justo al declararla (ej. depende de initState() en Flutter). Ahí usas late: le dices a Dart 'confía, llegará el valor antes de que la lea'." },
            { code: { file: "late.dart", code: `class Pantalla {
  late String titulo; // se asignará después, no al declarar

  void iniciar() {
    titulo = 'Bienvenido'; // aquí SÍ se le da valor
  }
}` } },
            { tip: { icon: "⚠️", text: "Si usas late y lees la variable ANTES de asignarle algo, la app truena en tiempo de ejecución. El ! es igual de peligroso: úsalo solo si estás 100% seguro." } },
        ],
        practice: [
            { title: "Null Safety en práctica", goal: "Juega con una variable que puede estar vacía.",
                steps: ["Declara String? apodo sin valor", "Usa ??= para ponerle 'Sin apodo' si está vacío", "Imprime su longitud de forma segura con ?."],
                solution: `void main() {
  String? apodo;
  apodo ??= 'Sin apodo';
  print('Apodo: $apodo');
  print('Largo: \${apodo?.length}');
}` },
        ],
        quiz: [
            { q: "¿Qué hace el operador ?? en  'var x = a ?? b'?", opts: ["Suma a y b", "Usa b si a está vacío (null)", "Compara a con b", "Borra a"], correct: 1, fb: "?? da un valor de respaldo cuando el primero es null." },
            { q: "¿Qué significa el ? en  String? nombre;", opts: ["Que es una pregunta", "Que la variable PUEDE ser null", "Que es secreta", "Que es constante"], correct: 1, fb: "El ? marca la variable como nullable." },
            { q: "¿Para qué sirve la palabra late?", opts: ["Para borrar una variable", "Para prometer que se le asignará valor antes de usarla, aunque no al declararla", "Para hacerla constante", "Para volverla privada"], correct: 1, fb: "late retrasa la inicialización, pero exige que tenga valor antes del primer uso." },
        ],
    },
    {
        id: "d_flow", mod: "Dart", icon: GitBranch, mins: "20 min",
        title: "Decisiones y bucles",
        intro: "El código corre de arriba a abajo. Ahora le enseñamos a TOMAR DECISIONES (if) y a REPETIR cosas (bucles).",
        theory: [
            { h: "Decisiones: if / else" },
            { code: { file: "decisiones.dart", code: `if (nota >= 90) {
  print('A');
} else if (nota >= 80) {
  print('B');
} else {
  print('Reprobado');
}

var estado = nota >= 70 ? 'Aprobado' : 'Reprobado';` } },
            { h: "Bucles: repetir sin copiar y pegar" },
            { code: { file: "bucles.dart", code: `for (var i = 0; i < 5; i++) {
  print(i); // 0,1,2,3,4
}

var frutas = ['manzana', 'pera'];
for (var f in frutas) {
  print(f);
}` } },
        ],
        practice: [
            { title: "Tabla de multiplicar", goal: "Imprime la tabla del 7 con un bucle for.",
                steps: ["Define int tabla = 7", "Con un for del 1 al 12, imprime cada producto"],
                solution: `void main() {
  int tabla = 7;
  for (var i = 1; i <= 12; i++) {
    print('$tabla x $i = \${tabla * i}');
  }
}` },
        ],
        quiz: [
            { q: "El ternario  'a >= 70 ? \"sí\" : \"no\"'  es una forma corta de...", opts: ["un bucle", "un if/else", "una función", "un switch"], correct: 1, fb: "El ternario es un if/else comprimido en una sola línea." },
        ],
    },
    {
        id: "d_func", mod: "Dart", icon: Code, mins: "20 min",
        title: "Funciones",
        intro: "Una función es una 'receta' con nombre: un bloque de código que haces una vez y reutilizas cuantas veces quieras.",
        theory: [
            { code: { file: "funciones.dart", code: `int sumar(int a, int b) {
  return a + b;
}

// Arrow function: si es una sola línea
int multiplicar(int a, int b) => a * b;` } },
            { p: "int sumar(...) significa: la función se llama sumar, recibe dos int, y devuelve (return) un int." },
            { h: "Funciones anónimas y métodos de lista" },
            { code: { file: "lambdas.dart", code: `var numeros = [1, 2, 3, 4, 5];
var pares = numeros.where((n) => n % 2 == 0);
var cuadrados = numeros.map((n) => n * n).toList();` } },
        ],
        practice: [
            { title: "FizzBuzz con funciones", goal: "El clásico ejercicio, encapsulado en una función.",
                steps: ["Crea función String fizzBuzz(int n)", "Múltiplo de 3 y 5 → 'FizzBuzz', de 3 → 'Fizz', de 5 → 'Buzz', si no, el número"],
                solution: `String fizzBuzz(int n) {
  if (n % 3 == 0 && n % 5 == 0) return 'FizzBuzz';
  if (n % 3 == 0) return 'Fizz';
  if (n % 5 == 0) return 'Buzz';
  return '$n';
}

void main() {
  for (var i = 1; i <= 15; i++) {
    print(fizzBuzz(i));
  }
}` },
        ],
        quiz: [
            { q: "En  'int sumar(int a, int b)', ¿qué significa el primer int?", opts: ["Que recibe un texto", "El tipo de dato que la función DEVUELVE", "Que es privada", "Nada"], correct: 1, fb: "El tipo antes del nombre es lo que la función entrega con return." },
        ],
    },
    {
        id: "d_coll", mod: "Dart", icon: Layers, mins: "20 min",
        title: "Colecciones: List, Set y Map",
        intro: "Una variable guarda un dato. Las colecciones guardan MUCHOS datos juntos.",
        theory: [
            { h: "List — una lista ordenada (permite repetidos)" },
            { code: { file: "list.dart", code: `List<int> nums = [1, 2, 3];
nums.add(4);
print(nums.length); // 4
print(nums[0]);     // 1` } },
            { h: "Map — pares clave → valor (como un diccionario)" },
            { code: { file: "map.dart", code: `Map<String, dynamic> alumno = {
  'nombre': 'Laura',
  'edad': 20,
};

print(alumno['nombre']); // Laura
alumno['semestre'] = 3;
alumno.forEach((k, v) => print('$k: $v'));` } },
            { tip: { icon: "✓", text: "List = fila ordenada. Set = bolsa sin duplicados. Map = etiquetas con su valor. El Map es clave para leer JSON." } },
        ],
        practice: [
            { title: "Agenda de contactos", goal: "Guarda y consulta contactos con un Map.",
                steps: ["Crea Map<String, String> con 3 nombre→teléfono", "Recórrelo con forEach", "Busca un contacto e imprime su teléfono"],
                solution: `void main() {
  Map<String, String> agenda = {
    'Ana': '555-1111',
    'Luis': '555-2222',
  };
  agenda.forEach((nombre, tel) => print('$nombre: $tel'));
  print('Tel de Luis: \${agenda['Luis'] ?? "No encontrado"}');
}` },
        ],
        quiz: [
            { q: "Para guardar pares como 'nombre': 'Laura', usas un...", opts: ["List", "Set", "Map", "int"], correct: 2, fb: "Map guarda parejas clave→valor." },
        ],
    },
    {
        id: "d_oop", mod: "Dart", icon: Box, mins: "25 min",
        title: "Clases y objetos (POO)",
        intro: "Una clase es un MOLDE. Un objeto es algo hecho con ese molde. Esto es la base de TODOS los widgets de Flutter: cada widget es una clase.",
        theory: [
            { code: { file: "clase.dart", code: `class Persona {
  String nombre;
  int edad;

  Persona(this.nombre, this.edad); // constructor

  void presentarse() {
    print('Soy $nombre, tengo $edad años');
  }

  bool get esMayor => edad >= 18; // getter
}

void main() {
  var p = Persona('Ana', 21);
  p.presentarse();
  print(p.esMayor);
}` } },
            { tip: { icon: "🔑", text: "this.nombre en el constructor es un atajo: toma lo que te pasan y lo guarda en la propiedad automáticamente." } },
        ],
        practice: [
            { title: "Clase Rectángulo", goal: "Diseña una clase con propiedades y métodos.",
                steps: ["class Rectangulo con double ancho y alto", "Métodos area() y perimetro()"],
                solution: `class Rectangulo {
  double ancho;
  double alto;
  Rectangulo(this.ancho, this.alto);

  double area() => ancho * alto;
  double perimetro() => 2 * (ancho + alto);
}

void main() {
  var r = Rectangulo(4, 4);
  print('Área: \${r.area()}');
}` },
        ],
        quiz: [
            { q: "¿Qué es una clase?", opts: ["Un objeto ya creado", "Un molde para crear objetos", "Una variable", "Un bucle"], correct: 1, fb: "La clase es el molde; los objetos se fabrican con ese molde." },
        ],
    },
    /* ===================== MÓDULO FLUTTER (temas de examen) ===================== */
    {
        id: "f_widgets", mod: "Flutter", icon: Box, mins: "25 min",
        title: "Widgets: qué son, tipos y cómo funcionan",
        intro: "En Flutter, TODO es un widget: un texto, un botón, un espacio en blanco, hasta la pantalla completa. Entender esto es la base de todo lo demás.",
        theory: [
            { p: "Un widget es una pieza de interfaz descrita como una clase de Dart (¿recuerdas POO?). Cada widget tiene un método build() que describe CÓMO se debe ver, y Flutter usa esa descripción para dibujar píxeles en pantalla." },
            { anim: "widgettree" },
            { h: "Tipos de widgets" },
            { table: {
                    head: ["Tipo", "Ejemplos", "Característica"],
                    rows: [
                        ["Estructurales", "Scaffold, AppBar, Column, Row", "Organizan otros widgets"],
                        ["Visuales", "Text, Icon, Image, Container", "Muestran algo en pantalla"],
                        ["Interactivos", "Button, TextField, GestureDetector", "Reaccionan al usuario"],
                        ["De estado", "StatelessWidget, StatefulWidget", "Definen si cambian o no"],
                    ] } },
            { h: "Cómo funcionan: el árbol de widgets" },
            { p: "Cada widget puede contener a otros widgets como 'hijos' (child o children). Así se forma un árbol: MaterialApp contiene un Scaffold, que contiene un AppBar y un body, que contiene más widgets... Flutter recorre ese árbol completo y lo convierte en píxeles." },
            { code: { file: "widget_basico.dart", code: `class MiSaludo extends StatelessWidget {
  const MiSaludo({super.key});

  @override
  Widget build(BuildContext context) {
    return const Text('¡Hola, Flutter!');
  }
}` } },
            { tip: { icon: "💡", text: "Regla de oro: si necesitas algo en pantalla, hay un widget para eso. Flutter no tiene 'HTML+CSS aparte'; todo, incluso el espaciado, es un widget (Padding, SizedBox)." } },
        ],
        practice: [
            { title: "Identifica los widgets", goal: "Piensa en la pantalla de inicio de cualquier app (ej. Instagram). Lista 5 widgets que probablemente la componen y clasifícalos (estructural/visual/interactivo).",
                steps: ["Imagina la pantalla", "Anota 5 elementos visuales", "Clasifica cada uno"],
                solution: `// Ejemplo de respuesta:
// Scaffold       → estructural (contenedor base de la pantalla)
// AppBar         → estructural (barra superior)
// Image          → visual (foto de perfil/post)
// IconButton     → interactivo (like, comentar)
// ListView       → estructural (lista de posts que se puede scrollear)` },
        ],
        quiz: [
            { q: "¿Qué método describe CÓMO se ve un widget?", opts: ["init()", "build()", "create()", "render()"], correct: 1, fb: "build() devuelve la descripción de la UI; Flutter la usa para dibujar." },
            { q: "¿Cómo se organiza la UI completa de una app Flutter?", opts: ["En una sola clase gigante", "Como un árbol de widgets anidados unos dentro de otros", "En archivos HTML separados", "No se organiza, es automático"], correct: 1, fb: "Todo widget puede contener otros widgets, formando un árbol." },
            { q: "¿Cuál de estos es un widget INTERACTIVO?", opts: ["Text", "Container", "GestureDetector", "Padding"], correct: 2, fb: "GestureDetector reacciona a toques, arrastres, etc." },
        ],
    },
    {
        id: "f_stateless", mod: "Flutter", icon: Lightbulb, mins: "25 min",
        title: "StatelessWidget: características y uso",
        intro: "Un StatelessWidget es un widget que NO cambia una vez dibujado. Si la pantalla necesita verse distinto, Flutter tiene que crear un widget nuevo, no 'editar' el viejo.",
        theory: [
            { anim: "svs" },
            { h: "Características" },
            { list: [
                    "Es inmutable: sus propiedades se asignan una vez (final) y no cambian.",
                    "No tiene memoria propia entre redibujados.",
                    "Se reconstruye solo si su PADRE cambia y le pasa nuevos datos.",
                    "Es más ligero y rápido: ideal para UI que no necesita reaccionar a eventos.",
                ] },
            { code: { file: "stateless.dart", code: `class Tarjeta extends StatelessWidget {
  final String titulo; // dato final: no cambia

  const Tarjeta({super.key, required this.titulo});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Text(titulo),
      ),
    );
  }
}` } },
            { h: "¿Cuándo usarlo?" },
            { p: "Úsalo para todo lo que sea puramente visual y no interactivo por sí mismo: títulos, iconos, tarjetas de presentación, separadores. Si el contenido viene de afuera (por parámetros) y nunca cambia DESDE DENTRO del widget, es candidato a Stateless." },
            { h: "Diferencias con StatefulWidget" },
            { table: {
                    head: ["", "StatelessWidget", "StatefulWidget"],
                    rows: [
                        ["¿Tiene memoria interna?", "No", "Sí (un objeto State)"],
                        ["¿Se puede redibujar solo?", "No, solo si el padre cambia", "Sí, con setState()"],
                        ["Uso típico", "Texto, iconos, tarjetas estáticas", "Formularios, contadores, animaciones"],
                        ["Costo de rendimiento", "Más ligero", "Un poco más pesado (gestiona estado)"],
                    ] } },
        ],
        practice: [
            { title: "Tarjeta de perfil", goal: "Construye un StatelessWidget reutilizable con parámetros.",
                steps: ["class TarjetaPerfil con nombre y cargo (String, final)", "build() que devuelva una Column con dos Text"],
                solution: `class TarjetaPerfil extends StatelessWidget {
  final String nombre;
  final String cargo;
  const TarjetaPerfil({super.key, required this.nombre, required this.cargo});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(nombre, style: const TextStyle(fontWeight: FontWeight.bold)),
        Text(cargo),
      ],
    );
  }
}` },
        ],
        quiz: [
            { q: "¿Por qué un StatelessWidget no puede redibujarse solo?", opts: ["Porque está roto", "Porque no tiene memoria interna (estado) que rastrear", "Porque es muy lento", "Sí puede, usando setState"], correct: 1, fb: "No guarda estado propio; solo cambia si el padre le pasa nuevos datos." },
            { q: "¿Cuál es un buen caso de uso para StatelessWidget?", opts: ["Un formulario con validación en tiempo real", "Un contador que sube al tocar un botón", "Una tarjeta de texto fijo que no reacciona a nada", "Una animación infinita"], correct: 2, fb: "Contenido puramente visual sin lógica interna de cambio." },
        ],
    },
    {
        id: "f_stateful", mod: "Flutter", icon: RefreshCw, mins: "30 min",
        title: "StatefulWidget: estado, ciclo de vida y cambios dinámicos",
        intro: "Un StatefulWidget SÍ puede cambiar lo que muestra, porque carga con un objeto 'State' que actúa como su memoria. Cuando ese estado cambia, Flutter vuelve a dibujar.",
        theory: [
            { p: "En realidad son DOS clases trabajando juntas: el Widget (la configuración, inmutable) y el State (la memoria, mutable). El Widget se reconstruye seguido, pero el State sobrevive entre reconstrucciones." },
            { code: { file: "stateful.dart", code: `class Contador extends StatefulWidget {
  const Contador({super.key});
  @override
  State<Contador> createState() => _ContadorState();
}

class _ContadorState extends State<Contador> {
  int _cuenta = 0; // ESTO es el estado: vive en el objeto State

  void _incrementar() {
    setState(() {       // avisa a Flutter: "algo cambió, redibuja"
      _cuenta++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Cuenta: $_cuenta'),
        ElevatedButton(onPressed: _incrementar, child: const Text('+1')),
      ],
    );
  }
}` } },
            { anim: "setstate" },
            { h: "Ciclo de vida de un StatefulWidget" },
            { anim: "lifecycle" },
            { list: [
                    "createState() → Flutter crea el objeto State asociado.",
                    "initState() → corre UNA sola vez, ideal para inicializar datos o suscribirse a algo.",
                    "build() → dibuja la UI; se vuelve a llamar cada vez que el estado cambia.",
                    "setState() → tú lo llamas cuando algo cambió; dispara un nuevo build().",
                    "dispose() → limpia recursos (timers, controllers) cuando el widget se destruye.",
                ] },
            { tip: { icon: "⚠️", text: "Error común: modificar una variable de estado SIN envolverla en setState(). Si haces eso, el dato cambia en memoria pero la pantalla NO se actualiza." } },
        ],
        practice: [
            { title: "Interruptor de luz", goal: "Crea un StatefulWidget que cambie de texto/color al tocarlo.",
                steps: ["bool _encendido = false en el State", "Un GestureDetector que invierta el valor con setState", "Muestra 'Encendido' o 'Apagado' según el booleano"],
                solution: `class Interruptor extends StatefulWidget {
  const Interruptor({super.key});
  @override
  State<Interruptor> createState() => _InterruptorState();
}

class _InterruptorState extends State<Interruptor> {
  bool _encendido = false;

  void _alternar() {
    setState(() {
      _encendido = !_encendido;
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _alternar,
      child: Text(_encendido ? 'Encendido' : 'Apagado'),
    );
  }
}` },
        ],
        quiz: [
            { q: "¿Qué método ejecutas para avisar que algo cambió y la UI debe redibujarse?", opts: ["initState()", "setState()", "dispose()", "build()"], correct: 1, fb: "setState() marca el widget como 'sucio' y dispara un nuevo build()." },
            { q: "¿Qué pasa si cambias una variable de estado SIN usar setState()?", opts: ["La app truena de inmediato", "El dato cambia pero la pantalla no se actualiza", "Funciona exactamente igual", "Se ejecuta dispose()"], correct: 1, fb: "Flutter no se entera del cambio si no se lo notificas con setState()." },
            { q: "¿Qué método del ciclo de vida corre solo UNA vez, al crear el widget?", opts: ["build()", "setState()", "initState()", "dispose()"], correct: 2, fb: "initState() es perfecto para inicializar datos una sola vez." },
        ],
    },
    {
        id: "f_state_mgmt", mod: "Flutter", icon: Radio, mins: "30 min",
        title: "Gestión de estado: qué es y comparación de gestores",
        intro: "El 'estado' es cualquier dato que puede cambiar y que afecta lo que se ve en pantalla (un contador, si el usuario inició sesión, los items de un carrito). Gestionarlo bien es EL tema central de Flutter en producción.",
        theory: [
            { p: "Cuando el estado es pequeño y local a un solo widget, setState() basta. Pero cuando MUCHAS pantallas necesitan el mismo dato (usuario logueado, carrito de compras), pasarlo a mano por cada constructor ('prop drilling') se vuelve un dolor. Ahí entran los gestores de estado." },
            { anim: "managers" },
            { h: "Comparación de los gestores más usados" },
            { table: {
                    head: ["Gestor", "Idea central", "Cuándo conviene"],
                    rows: [
                        ["setState", "El propio widget guarda y actualiza su dato", "Estado simple, local, una sola pantalla"],
                        ["Provider", "Un ChangeNotifier centraliza el dato; las pantallas hacen watch/read", "Apps medianas, curva de aprendizaje suave"],
                        ["Riverpod", "Como Provider, pero sin BuildContext y verificado en compilación", "Apps que quieren más seguridad y testing fácil"],
                        ["Bloc", "Eventos entran, el Bloc los procesa y emite Estados (muy formal)", "Apps grandes en equipo, lógica de negocio compleja"],
                        ["GetX", "Variables reactivas (.obs) que la UI escucha automáticamente", "Desarrollo rápido, apps pequeñas/medianas"],
                    ] } },
            { h: "Provider en código (el más usado en la materia)" },
            { code: { file: "provider.dart", code: `class CarritoProvider with ChangeNotifier {
  final List<String> _items = [];
  List<String> get items => _items;

  void agregar(String item) {
    _items.add(item);
    notifyListeners(); // avisa a todos los que escuchan
  }
}

// En main():
ChangeNotifierProvider(
  create: (_) => CarritoProvider(),
  child: const MyApp(),
);

// En cualquier pantalla:
final items = context.watch<CarritoProvider>().items; // escucha
context.read<CarritoProvider>().agregar('Pan');        // ejecuta acción` } },
            { tip: { icon: "💡", text: "Regla simple: watch para MOSTRAR datos (se redibuja al cambiar), read para EJECUTAR acciones como en un botón (no se suscribe)." } },
        ],
        practice: [
            { title: "Tu primer ChangeNotifier", goal: "Crea un modelo de estado simple con Provider.",
                steps: ["class TemaProvider with ChangeNotifier", "bool _oscuro = false y su getter", "Método alternar() que invierta el valor y notifique"],
                solution: `class TemaProvider with ChangeNotifier {
  bool _oscuro = false;
  bool get oscuro => _oscuro;

  void alternar() {
    _oscuro = !_oscuro;
    notifyListeners(); // sin esto, la UI no se entera
  }
}` },
        ],
        quiz: [
            { q: "¿Qué es 'el estado' en Flutter?", opts: ["El país donde corre la app", "Cualquier dato que puede cambiar y afecta lo que se ve en pantalla", "Un tipo de widget", "Un archivo de configuración"], correct: 1, fb: "Estado = datos mutables que la UI debe reflejar." },
            { q: "¿Qué línea en Provider avisa a la UI que el dato cambió?", opts: ["setState()", "notifyListeners()", "build()", "initState()"], correct: 1, fb: "notifyListeners() despierta a todos los widgets que escuchan ese provider." },
            { q: "¿Qué caracteriza a Bloc frente a los demás?", opts: ["No usa Dart", "Flujo formal: Eventos entran, el Bloc emite Estados", "Es el más simple de todos", "Solo sirve para animaciones"], correct: 1, fb: "Bloc separa estrictamente eventos de entrada y estados de salida." },
            { q: "¿Cuál gestor usa variables 'reactivas' con .obs?", opts: ["Provider", "Riverpod", "Bloc", "GetX"], correct: 3, fb: "GetX usa .obs para que la UI reaccione automáticamente a cambios." },
        ],
    },
    {
        id: "f_layout", mod: "Flutter", icon: LayoutGrid, mins: "30 min",
        title: "Widgets de Layout: Row, Column, Stack, Expanded y más",
        intro: "Los widgets de layout no muestran contenido por sí mismos: ORGANIZAN a sus hijos en el espacio. Son el 'CSS' de Flutter.",
        theory: [
            { anim: "layout" },
            { h: "Los layouts esenciales" },
            { table: {
                    head: ["Widget", "Qué hace"],
                    rows: [
                        ["Container", "Una caja: le puedes dar color, tamaño, bordes, padding, margin"],
                        ["Row", "Pone a sus hijos en fila (horizontal)"],
                        ["Column", "Pone a sus hijos uno debajo del otro (vertical)"],
                        ["Stack", "Apila widgets uno encima del otro (capas)"],
                        ["Expanded", "Hace que un hijo de Row/Column llene el espacio sobrante"],
                        ["Padding", "Agrega espacio interno alrededor de un widget"],
                        ["Center", "Centra a su único hijo dentro del espacio disponible"],
                        ["ListView", "Una columna que se puede scrollear, ideal para listas largas"],
                    ] } },
            { code: { file: "layouts.dart", code: `// Row con Expanded: una caja fija y otra que llena el resto
Row(
  children: [
    Container(width: 50, color: Colors.blue),
    Expanded(
      child: Container(color: Colors.green),
    ),
  ],
)

// Stack: superponer un texto sobre una imagen
Stack(
  children: [
    Image.network('https://...'),
    const Positioned(
      bottom: 10, left: 10,
      child: Text('Texto encima', style: TextStyle(color: Colors.white)),
    ),
  ],
)

// ListView: lista scrolleable de muchos elementos
ListView.builder(
  itemCount: productos.length,
  itemBuilder: (context, i) => ListTile(title: Text(productos[i])),
)` } },
            { tip: { icon: "⚠️", text: "Error típico: usar Column sin Expanded cuando el contenido es más alto que la pantalla → 'overflow' (la franja amarilla/negra de error). La solución casi siempre es ListView o Expanded." } },
        ],
        practice: [
            { title: "Tarjeta con layout combinado", goal: "Combina Container, Row, Expanded y Padding.",
                steps: [
                    "Un Container con padding de 12",
                    "Dentro, un Row con un ícono fijo a la izquierda",
                    "Y un Expanded con un Column de título + subtítulo a la derecha",
                ],
                solution: `Container(
  padding: const EdgeInsets.all(12),
  child: Row(
    children: [
      const Icon(Icons.person, size: 40),
      const SizedBox(width: 12),
      Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Gael', style: TextStyle(fontWeight: FontWeight.bold)),
            Text('Software Engineering'),
          ],
        ),
      ),
    ],
  ),
)` },
        ],
        quiz: [
            { q: "¿Qué widget pone a sus hijos uno ENCIMA del otro (capas)?", opts: ["Row", "Column", "Stack", "Padding"], correct: 2, fb: "Stack superpone widgets, como capas en un editor de imágenes." },
            { q: "¿Para qué sirve Expanded?", opts: ["Para centrar un widget", "Para que un hijo de Row/Column llene el espacio sobrante", "Para darle color a una caja", "Para hacer scroll"], correct: 1, fb: "Expanded reparte el espacio disponible entre los hijos marcados." },
            { q: "Tienes una lista de 200 elementos. ¿Qué widget usas para mostrarla sin que truene por overflow?", opts: ["Column normal", "Row", "ListView", "Center"], correct: 2, fb: "ListView permite scroll y solo dibuja lo visible: ideal para listas largas." },
        ],
    },
    {
        id: "f_ui_design", mod: "Flutter", icon: Smartphone, mins: "25 min",
        title: "Diseño de interfaces UI en Flutter",
        intro: "Diseñar una pantalla en Flutter es decidir QUÉ widgets usar y CÓMO anidarlos para lograr la estructura visual que quieres, partiendo siempre de Scaffold.",
        theory: [
            { p: "Scaffold es el esqueleto estándar de una pantalla: te da appBar (la barra superior), body (el contenido principal), y floatingActionButton (un botón flotante), entre otros espacios ya definidos por Material Design." },
            { code: { file: "pantalla.dart", code: `class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Inicio')),
      body: const Center(
        child: Text('Bienvenido'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.add),
      ),
    );
  }
}` } },
            { h: "Proceso típico para armar una pantalla" },
            { list: [
                    "1. Empieza por el Scaffold (el esqueleto).",
                    "2. Decide la estructura general: ¿una Column de secciones? ¿una ListView?",
                    "3. Ve agregando widgets visuales (Text, Image, Icon) dentro de esa estructura.",
                    "4. Usa Padding/SizedBox para dar 'aire' entre elementos.",
                    "5. Conecta los widgets interactivos a funciones (onPressed, onChanged).",
                ] },
            { anim: "appflow" },
            { tip: { icon: "💡", text: "Una buena práctica es dividir pantallas grandes en widgets más pequeños y con nombre (ej. _buildHeader(), o una clase aparte), igual que divides un programa en funciones." } },
        ],
        practice: [
            { title: "Pantalla de bienvenida", goal: "Construye una pantalla completa con Scaffold.",
                steps: ["AppBar con título 'Mi App'", "body con Column centrada: un ícono grande y un texto de bienvenida", "Un botón debajo que diga 'Continuar'"],
                solution: `class Bienvenida extends StatelessWidget {
  const Bienvenida({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mi App')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.waving_hand, size: 64),
            const SizedBox(height: 16),
            const Text('¡Bienvenido!'),
            const SizedBox(height: 24),
            ElevatedButton(onPressed: () {}, child: const Text('Continuar')),
          ],
        ),
      ),
    );
  }
}` },
        ],
        quiz: [
            { q: "¿Qué widget da el esqueleto estándar de una pantalla (appBar, body, etc.)?", opts: ["Container", "Scaffold", "MaterialApp", "Column"], correct: 1, fb: "Scaffold organiza las zonas típicas de una pantalla Material Design." },
            { q: "¿Por qué conviene dividir una pantalla grande en widgets más pequeños?", opts: ["Para que corra más lento", "Para mantener el código organizado y reutilizable, igual que con funciones", "Es obligatorio, si no la app no compila", "No tiene ninguna ventaja"], correct: 1, fb: "Mejora legibilidad y reutilización, igual que dividir lógica en funciones." },
        ],
    },
    {
        id: "f_forms", mod: "Flutter", icon: FormInput, mins: "30 min",
        title: "Formularios: TextField, validaciones y botones",
        intro: "Casi toda app real pide datos al usuario: login, registro, búsqueda. Flutter da herramientas específicas para capturar y VALIDAR esos datos antes de usarlos.",
        theory: [
            { h: "TextField vs TextFormField" },
            { p: "TextField es la caja de texto básica. TextFormField es lo mismo, pero pensado para vivir DENTRO de un Form, con soporte directo para reglas de validación (validator)." },
            { code: { file: "textfield.dart", code: `final controller = TextEditingController();

TextField(
  controller: controller,
  decoration: const InputDecoration(
    labelText: 'Correo electrónico',
    border: OutlineInputBorder(),
  ),
  onChanged: (valor) => print('Escribiendo: $valor'),
)` } },
            { anim: "formvalidation" },
            { h: "Form + validación + botón: una Register Page típica" },
            { code: { file: "register_page.dart", code: `class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});
  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Registro')),
      body: Form(
        key: _formKey,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              TextFormField(
                controller: _emailCtrl,
                decoration: const InputDecoration(labelText: 'Correo'),
                validator: (valor) {
                  if (valor == null || !valor.contains('@')) {
                    return 'Ingresa un correo válido';
                  }
                  return null; // null = sin error
                },
              ),
              TextFormField(
                controller: _passCtrl,
                obscureText: true, // oculta el texto (contraseña)
                decoration: const InputDecoration(labelText: 'Contraseña'),
                validator: (valor) {
                  if (valor == null || valor.length < 6) {
                    return 'Mínimo 6 caracteres';
                  }
                  return null;
                },
              ),
              ElevatedButton(
                onPressed: () {
                  // valida TODOS los campos del Form a la vez
                  if (_formKey.currentState!.validate()) {
                    print('Formulario válido, registrando...');
                  }
                },
                child: const Text('Registrarse'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailCtrl.dispose(); // limpia los controllers
    _passCtrl.dispose();
    super.dispose();
  }
}` } },
            { tip: { icon: "⚠️", text: "validator debe devolver null si el campo está bien, o un String con el mensaje de error si está mal. _formKey.currentState!.validate() revisa TODOS los campos del Form de un solo golpe." } },
        ],
        practice: [
            { title: "Validador de edad", goal: "Escribe solo la función validator para un campo de edad.",
                steps: ["Recibe un String? valor", "Si está vacío o no es número o es menor a 18, regresa un mensaje", "Si está bien, regresa null"],
                solution: `String? validarEdad(String? valor) {
  if (valor == null || valor.isEmpty) {
    return 'Ingresa tu edad';
  }
  final edad = int.tryParse(valor);
  if (edad == null) {
    return 'Debe ser un número';
  }
  if (edad < 18) {
    return 'Debes ser mayor de edad';
  }
  return null; // sin error
}` },
        ],
        quiz: [
            { q: "¿Qué debe devolver una función validator cuando el campo está CORRECTO?", opts: ["true", "Un String vacío ''", "null", "false"], correct: 2, fb: "null significa 'sin error'; cualquier String se muestra como mensaje de error." },
            { q: "¿Qué propiedad de TextFormField oculta el texto (para contraseñas)?", opts: ["hidden: true", "obscureText: true", "secure: true", "password: true"], correct: 1, fb: "obscureText: true convierte los caracteres en puntos." },
            { q: "¿Qué hace _formKey.currentState!.validate()?", opts: ["Envía el formulario a un servidor", "Ejecuta el validator de TODOS los campos del Form a la vez", "Borra el formulario", "Crea un nuevo TextField"], correct: 1, fb: "Corre todas las reglas de validación del Form y regresa true/false." },
        ],
    },
    {
        id: "f_build_app", mod: "Flutter", icon: Workflow, mins: "25 min",
        title: "Construcción de apps: organización, datos e interacción",
        intro: "Para cerrar: cómo se ven TODOS estos temas trabajando juntos en una app real, de principio a fin.",
        theory: [
            { anim: "appflow" },
            { h: "Organización de pantallas (navegación)" },
            { code: { file: "navegacion.dart", code: `// Ir a otra pantalla
Navigator.push(
  context,
  MaterialPageRoute(builder: (_) => const DetallePage()),
);

// Regresar
Navigator.pop(context);` } },
            { h: "Manejo de datos" },
            { p: "Los datos suelen venir de una API (JSON → factory fromJson, como vimos en Dart), se guardan en un gestor de estado (Provider, Riverpod, Bloc...) y de ahí las pantallas los leen con watch/read o equivalentes." },
            { h: "Interacción usuario-app: el ciclo completo" },
            { list: [
                    "1. El usuario toca un botón (widget interactivo).",
                    "2. Se llama una función (onPressed) que cambia el estado.",
                    "3. setState() / notifyListeners() avisa del cambio.",
                    "4. Flutter llama build() de nuevo con los datos actualizados.",
                    "5. La pantalla se ve distinta — el usuario ve el resultado.",
                ] },
            { tip: { icon: "✓", text: "Este ciclo (widgets → estado → reconstrucción → UI) es el corazón de TODO lo visto en este curso. Si lo entiendes, entiendes Flutter." } },
        ],
        practice: [
            { title: "Diseña el flujo de una mini app", goal: "Piensa una app de 'Lista de tareas' y describe (en comentarios) su organización.",
                steps: ["¿Qué pantallas tiene?", "¿Dónde vive el estado (la lista de tareas)?", "¿Qué pasa paso a paso cuando el usuario agrega una tarea?"],
                solution: `// Pantallas: HomePage (lista) y AddTaskPage (formulario)
// Estado: TareasProvider (ChangeNotifier) con List<Tarea>
//
// Flujo al agregar una tarea:
// 1. Usuario llena un TextFormField en AddTaskPage y toca "Guardar"
// 2. onPressed valida el Form y llama
//    context.read<TareasProvider>().agregar(nuevaTarea)
// 3. Eso modifica la lista interna y llama notifyListeners()
// 4. HomePage, que hace context.watch<TareasProvider>().tareas,
//    se reconstruye sola mostrando la nueva tarea
// 5. Navigator.pop(context) regresa a HomePage` },
        ],
        quiz: [
            { q: "¿Qué función de Navigator lleva a una nueva pantalla?", opts: ["Navigator.pop()", "Navigator.push()", "Navigator.go()", "Navigator.open()"], correct: 1, fb: "push() agrega una nueva ruta encima de la pila de navegación." },
            { q: "En el ciclo de interacción usuario-app, ¿qué pasa justo DESPUÉS de setState()/notifyListeners()?", opts: ["Se cierra la app", "Flutter vuelve a llamar build() con los datos actualizados", "Se borra el estado", "Nada, hay que reiniciar la app"], correct: 1, fb: "Notificar el cambio dispara una nueva reconstrucción de la UI." },
        ],
    },
];
const MODS = [
    { name: "Dart", sub: "El lenguaje base", icon: Code },
    { name: "Flutter", sub: "Widgets, estado y UI (temas de examen)", icon: Smartphone },
];

const RANKS = [
    { min: 0, name: "Aprendiz" },
    { min: 300, name: "Junior Dev" },
    { min: 700, name: "Mobile Dev" },
    { min: 1100, name: "Flutter Dev" },
    { min: 1500, name: "Senior" },
];
const rankFor = (xp) => RANKS.filter((r) => xp >= r.min).pop();
const loadSave = () => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } };

/* ---------- componentes de UI ---------- */
function CodeBlock({ code, file }) {
    return (
        <div className="fl-term">
            <div className="fl-term-h">
                <span className="d r" /><span className="d y" /><span className="d g" />
                {file && <span className="fl-file">{file}</span>}
            </div>
            <pre>{code.split("\n").map((line, i) => {
                const ci = line.indexOf("//");
                if (ci >= 0) {
                    return <div key={i}><span>{line.slice(0, ci)}</span><span className="cmt">{line.slice(ci)}</span></div>;
                }
                return <div key={i}>{line || "\u00A0"}</div>;
            })}</pre>
        </div>
    );
}

const ANIM_MAP = {
    widgettree: AnimWidgetTree,
    svs: AnimStatelessVsStateful,
    lifecycle: AnimLifecycle,
    layout: AnimLayout,
    stateflow: AnimStateFlow,
    nullsafety: AnimNullSafety,
    formvalidation: AnimFormValidation,
    managers: AnimStateManagers,
    setstate: AnimSetStateCounter,
    appflow: AnimAppFlow,
};

function Theory({ blocks }) {
    return blocks.map((b, i) => {
        if (b.p) return <p key={i} className="fl-p">{b.p}</p>;
        if (b.h) return <h3 key={i} className="fl-h3">{b.h}</h3>;
        if (b.code) return <CodeBlock key={i} {...b.code} />;
        if (b.anim) {
            const Comp = ANIM_MAP[b.anim];
            return Comp ? <Comp key={i} /> : null;
        }
        if (b.tip) return (
            <div key={i} className="fl-tip"><span className="fl-tip-i">{b.tip.icon}</span><span>{b.tip.text}</span></div>
        );
        if (b.list) return (
            <ul key={i} className="fl-list">{b.list.map((x, j) => <li key={j}>{x}</li>)}</ul>
        );
        if (b.table) return (
            <div key={i} className="fl-tablewrap"><table className="fl-table">
                <thead><tr>{b.table.head.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
                <tbody>{b.table.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody>
            </table></div>
        );
        return null;
    });
}

function Exercise({ ex, n }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="fl-ex">
            <div className="fl-ex-top"><span className="fl-ex-n">{n}</span><strong>{ex.title}</strong></div>
            <p className="fl-ex-goal">{ex.goal}</p>
            {ex.steps && <ul className="fl-steps">{ex.steps.map((s, i) => <li key={i}>{s}</li>)}</ul>}
            <button className="fl-reveal" onClick={() => setOpen((o) => !o)}>
                {open ? <EyeOff size={13} /> : <Eye size={13} />} {open ? "Ocultar solución" : "Ver solución"}
            </button>
            {open && <CodeBlock code={ex.solution} file="solucion.dart" />}
        </div>
    );
}
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
.fl{ min-height:100vh; width:100%; font-family:'Inter',system-ui,sans-serif; color:#e8eef6;
  background:radial-gradient(900px 500px at 80% -10%, rgba(66,165,245,.13), transparent 60%), #0b1016; }
.fl *{ box-sizing:border-box; }
.fl-wrap{ max-width:880px; margin:0 auto; padding:38px 22px 90px; }
.fl-head{ text-align:center; margin-bottom:8px; }
.fl-kick{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:4px; color:#5d708a; }
.fl-title{ font-size:42px; font-weight:800; letter-spacing:-1px; margin:6px 0; }
.fl-title b{ color:#42A5F5; }
.fl-sub{ color:#8a98a8; font-size:15px; max-width:560px; margin:0 auto; }
.fl-rank{ display:flex; gap:14px; align-items:center; justify-content:center; margin:22px auto; flex-wrap:wrap; }
.fl-rbox{ display:flex; align-items:center; gap:10px; border:1px solid #1e2a38; background:#0f1620; border-radius:12px; padding:10px 15px; }
.fl-rl{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:2px; color:#5d708a; }
.fl-rn{ font-size:16px; font-weight:700; }
.fl-bar{ width:200px; height:8px; border-radius:99px; background:#0f1620; border:1px solid #1e2a38; overflow:hidden; }
.fl-bar i{ display:block; height:100%; background:linear-gradient(90deg,#42A5F5,#80d0ff); transition:width .6s; }
.fl-modh{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:#42A5F5;
  margin:30px 0 12px; display:flex; align-items:center; gap:9px; text-transform:uppercase; }
.fl-modh .ms{ color:#5d708a; letter-spacing:0; text-transform:none; font-size:12px; }
.fl-list-lessons{ display:flex; flex-direction:column; gap:10px; }
.fl-lcard{ display:flex; align-items:center; gap:15px; cursor:pointer; border:1px solid #1a2533; border-radius:14px;
  padding:15px 17px; background:linear-gradient(180deg,#10171f,#0c1219); transition:.16s; text-align:left; width:100%; color:inherit; font-family:inherit; }
.fl-lcard:hover{ transform:translateX(4px); border-color:#42A5F5; }
.fl-lico{ width:42px; height:42px; border-radius:11px; flex:none; display:grid; place-items:center;
  background:rgba(66,165,245,.1); border:1px solid #1e2a38; color:#42A5F5; }
.fl-lcard.done .fl-lico{ background:rgba(92,200,138,.13); border-color:#5cc88a; color:#5cc88a; }
.fl-lm{ flex:1; min-width:0; }
.fl-lt{ font-size:15.5px; font-weight:700; }
.fl-li{ font-size:13px; color:#8a98a8; margin-top:2px; }
.fl-lmeta{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#5d708a; flex:none; }
.fl-back{ display:inline-flex; align-items:center; gap:6px; background:none; border:none; color:#8a98a8;
  font-family:'JetBrains Mono',monospace; font-size:12px; cursor:pointer; padding:6px 0; margin-bottom:6px; }
.fl-back:hover{ color:#42A5F5; }
.fl-lhead h2{ font-size:30px; font-weight:800; letter-spacing:-.5px; margin:4px 0 8px; }
.fl-badge{ display:inline-block; font-family:'JetBrains Mono',monospace; font-size:11px; color:#42A5F5;
  background:rgba(66,165,245,.1); border:1px solid #1e2a38; padding:3px 10px; border-radius:99px; }
.fl-intro{ background:#0f1620; border-left:4px solid #42A5F5; border-radius:4px 12px 12px 4px;
  padding:15px 18px; margin:16px 0; color:#bcc8d6; font-size:15px; line-height:1.6; }
.fl-secl{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:#5d708a;
  margin:26px 0 10px; display:flex; align-items:center; gap:8px; text-transform:uppercase; }
.fl-p{ font-size:15px; line-height:1.7; color:#cdd6e0; margin:12px 0; }
.fl-h3{ font-size:17px; font-weight:700; margin:22px 0 4px; color:#e8eef6; }
.fl-term{ background:#070b10; border:1px solid #1a2533; border-radius:12px; overflow:hidden; margin:14px 0; }
.fl-term-h{ background:rgba(255,255,255,.03); padding:9px 13px; border-bottom:1px solid #1a2533; display:flex; gap:7px; align-items:center; }
.fl-term-h .d{ width:11px; height:11px; border-radius:50%; } .d.r{ background:#ff5f56; } .d.y{ background:#ffbd2e; } .d.g{ background:#27c93f; }
.fl-file{ margin-left:8px; font-family:'JetBrains Mono',monospace; font-size:11px; color:#5d708a; }
.fl-term pre{ margin:0; padding:16px; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.6;
  color:#d6e0ea; overflow-x:auto; } .fl-term pre .cmt{ color:#5d708a; font-style:italic; }
.fl-tip{ background:rgba(66,165,245,.06); border-left:4px solid #42A5F5; border-radius:4px 10px 10px 4px;
  padding:13px 16px; margin:16px 0; display:flex; gap:12px; align-items:flex-start; font-size:14px; line-height:1.55; color:#cdd6e0; }
.fl-tip-i{ font-size:18px; flex:none; }
.fl-list{ margin:12px 0; padding-left:4px; list-style:none; display:flex; flex-direction:column; gap:7px; }
.fl-list li{ font-size:14.5px; color:#cdd6e0; padding-left:18px; position:relative; line-height:1.5; }
.fl-list li::before{ content:'▸'; position:absolute; left:0; color:#42A5F5; }
.fl-tablewrap{ overflow-x:auto; border:1px solid #1a2533; border-radius:10px; margin:16px 0; }
.fl-table{ width:100%; border-collapse:collapse; font-size:13.5px; }
.fl-table th{ background:#0f1620; color:#42A5F5; text-align:left; padding:10px 14px; font-size:11px;
  text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #1a2533; }
.fl-table td{ padding:10px 14px; border-bottom:1px solid #141d28; color:#cdd6e0; }
.fl-ex{ background:#0f1620; border:1px solid #1a2533; border-radius:14px; padding:18px; margin:12px 0; }
.fl-ex-top{ display:flex; align-items:center; gap:10px; }
.fl-ex-n{ background:#42A5F5; color:#07111c; width:24px; height:24px; border-radius:50%; display:grid;
  place-items:center; font-size:13px; font-weight:800; flex:none; }
.fl-ex-goal{ font-size:14.5px; color:#cdd6e0; margin:10px 0; line-height:1.55; }
.fl-steps{ margin:8px 0; padding-left:18px; } .fl-steps li{ font-size:13.5px; color:#9fadbd; margin:4px 0; }
.fl-reveal{ display:inline-flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:12px;
  color:#42A5F5; background:rgba(66,165,245,.08); border:1px solid #1e2a38; border-radius:8px; padding:7px 13px; cursor:pointer; margin-top:6px; }
.fl-reveal:hover{ background:rgba(66,165,245,.15); }
.fl-quiz{ border:1px solid #1e2a38; border-radius:14px; padding:18px; background:#0f1620; margin:12px 0; }
.fl-q{ font-size:15.5px; font-weight:600; margin-bottom:11px; }
.fl-opt{ display:block; width:100%; text-align:left; background:#0c1219; border:1px solid #1a2533; color:#e8eef6;
  padding:11px 14px; border-radius:10px; margin:6px 0; font-size:14px; cursor:pointer; transition:.14s; font-family:inherit; }
.fl-opt:hover{ border-color:#42A5F5; }
.fl-opt.ok{ background:rgba(92,200,138,.13); border-color:#5cc88a; color:#aef0c6; }
.fl-opt.no{ background:rgba(255,95,86,.12); border-color:#ff5f56; color:#ffb3ae; }
.fl-fb{ font-size:13.5px; margin-top:9px; line-height:1.5; }
.fl-nav{ display:flex; justify-content:space-between; gap:10px; margin-top:26px; }
.fl-btn{ font-family:'JetBrains Mono',monospace; font-size:13px; padding:11px 17px; border-radius:10px; cursor:pointer;
  border:1px solid #1e2a38; background:#0f1620; color:#e8eef6; display:inline-flex; align-items:center; gap:7px; }
.fl-btn:hover:not(:disabled){ border-color:#42A5F5; } .fl-btn:disabled{ opacity:.3; cursor:default; }
.fl-btn.main{ background:#42A5F5; color:#07111c; border-color:#42A5F5; font-weight:700; }
.fl-foot{ text-align:center; margin-top:34px; }
.fl-reset{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#ff7b72; background:transparent;
  border:1px solid rgba(255,123,114,.3); border-radius:8px; padding:8px 14px; cursor:pointer; }
.fl-reset:hover{ background:rgba(255,123,114,.1); }
.fl-done-tag{ display:inline-flex; align-items:center; gap:6px; color:#5cc88a; font-family:'JetBrains Mono',monospace; font-size:12px; }
@media(max-width:560px){ .fl-title{ font-size:32px; } .fl-lhead h2{ font-size:24px; } }

/* ===== Bloque de animaciones ===== */
.fl-anim{ background:#0c1219; border:1px solid #1a2533; border-radius:14px; padding:18px 18px 14px; margin:16px 0; }
.fl-anim-svg{ width:100%; height:auto; display:block; }
.fl-anim-cap{ font-size:13px; color:#9fadbd; line-height:1.55; margin:12px 0 2px; text-align:center; }
.fl-anim-cap code{ background:#0f1620; padding:1px 6px; border-radius:5px; font-family:'JetBrains Mono',monospace; font-size:12px; color:#80d0ff; }
.fl-anim-btn{ display:inline-flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:12px;
  color:#42A5F5; background:rgba(66,165,245,.08); border:1px solid #1e2a38; border-radius:8px; padding:7px 13px; cursor:pointer; }
.fl-anim-btn:hover{ background:rgba(66,165,245,.15); }

/* Stateless vs Stateful */
.fl-svs-row{ display:flex; gap:14px; flex-wrap:wrap; justify-content:center; }
.fl-svs-col{ flex:1; min-width:160px; display:flex; flex-direction:column; align-items:center; gap:8px; }
.fl-svs-tag{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#5d708a; letter-spacing:1px; }
.fl-svs-box{ width:100%; min-height:74px; border-radius:12px; display:flex; flex-direction:column; align-items:center;
  justify-content:center; gap:6px; font-size:13px; font-weight:600; }
.fl-svs-box.static{ background:rgba(138,152,168,.08); border:1.5px solid #2a3644; color:#bcc8d6; }
.fl-svs-box.dynamic{ background:rgba(66,165,245,.1); border:1.5px solid #42A5F5; color:#aee0ff; }
.fl-spin-once{ animation: fl-spin .6s ease; }
@keyframes fl-spin{ from{ transform:rotate(0deg);} to{ transform:rotate(360deg);} }
.fl-svs-note{ font-size:12px; color:#5d708a; text-align:center; line-height:1.4; }

/* Lifecycle */
.fl-life-track{ display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:0; }
.fl-life-node{ display:flex; flex-direction:column; align-items:center; gap:6px; padding:6px 8px; opacity:.45; transition:opacity .3s; }
.fl-life-node.active{ opacity:1; }
.fl-life-node.past{ opacity:.75; }
.fl-life-dot{ width:14px; height:14px; border-radius:50%; background:#1e2a38; border:2px solid #2a3644; transition:all .3s; }
.fl-life-node.active .fl-life-dot{ background:#42A5F5; border-color:#42A5F5; box-shadow:0 0 0 5px rgba(66,165,245,.18); }
.fl-life-node.past .fl-life-dot{ background:#5cc88a; border-color:#5cc88a; }
.fl-life-label{ font-family:'JetBrains Mono',monospace; font-size:10.5px; color:#9fadbd; text-align:center; max-width:100px; }
.fl-life-node.active .fl-life-label{ color:#aee0ff; font-weight:700; }
.fl-life-line{ width:22px; height:2px; background:#1e2a38; margin:0 2px 22px; transition:background .3s; }
.fl-life-line.past{ background:#5cc88a; }

/* Layout demo */
.fl-layout-tabs{ display:flex; gap:6px; justify-content:center; flex-wrap:wrap; margin-bottom:14px; }
.fl-layout-tab{ font-family:'JetBrains Mono',monospace; font-size:11.5px; padding:6px 12px; border-radius:8px;
  border:1px solid #1e2a38; background:#0f1620; color:#9fadbd; cursor:pointer; }
.fl-layout-tab.on{ border-color:#42A5F5; color:#aee0ff; background:rgba(66,165,245,.1); }
.fl-layout-stage{ min-height:110px; display:flex; align-items:center; justify-content:center; padding:10px; }
.fl-row-demo{ display:flex; gap:10px; align-items:stretch; width:100%; }
.fl-col-demo{ display:flex; flex-direction:column; gap:8px; align-items:center; width:100%; max-width:160px; margin:0 auto; }
.fl-stack-demo{ position:relative; width:140px; height:100px; margin:0 auto; }
.fl-demo-box{ flex:1; min-height:60px; border-radius:10px; display:flex; align-items:center; justify-content:center;
  color:#07111c; font-weight:700; font-size:13px; transition:all .35s; }
.fl-demo-box.stacked{ position:absolute; width:90px; height:60px; transition:all .35s; }
.fl-demo-box.expanded-flex{ flex:3; }
.fl-col-demo .fl-demo-box{ width:100%; min-height:34px; }

/* State flow */
.fl-flow{ display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:6px; }
.fl-flow-node{ font-family:'JetBrains Mono',monospace; font-size:11.5px; padding:9px 12px; border-radius:10px;
  border:1px solid #1e2a38; background:#0f1620; color:#8a98a8; text-align:center; transition:all .3s; max-width:140px; }
.fl-flow-node.active{ border-color:#42A5F5; background:rgba(66,165,245,.13); color:#aee0ff; transform:scale(1.05); }
.fl-flow-arrow{ color:#5d708a; font-size:14px; }

/* Null safety */
.fl-null-row{ display:flex; align-items:center; justify-content:center; gap:16px; flex-wrap:wrap; }
.fl-null-box{ width:140px; height:64px; border-radius:12px; display:flex; flex-direction:column; align-items:center;
  justify-content:center; gap:2px; transition:all .3s; }
.fl-null-box.empty{ background:rgba(255,189,46,.08); border:1.5px dashed #ffbd2e; }
.fl-null-box.filled{ background:rgba(92,200,138,.12); border:1.5px solid #5cc88a; }
.fl-null-label{ font-family:'JetBrains Mono',monospace; font-size:10px; color:#5d708a; }
.fl-null-val{ font-size:14px; font-weight:700; color:#e8eef6; }
.fl-null-result{ text-align:center; font-family:'JetBrains Mono',monospace; font-size:13px; color:#9fadbd; margin-top:14px; }

/* Form validation */
.fl-form-demo{ max-width:320px; margin:0 auto; }
.fl-form-label{ display:block; font-size:12px; color:#9fadbd; margin-bottom:6px; font-family:'JetBrains Mono',monospace; }
.fl-form-input{ width:100%; padding:10px 12px; border-radius:10px; border:1.5px solid #1e2a38; background:#0f1620;
  color:#e8eef6; font-size:14px; outline:none; transition:border-color .2s; }
.fl-form-input:focus{ border-color:#42A5F5; }
.fl-form-input.ok{ border-color:#5cc88a; }
.fl-form-input.bad{ border-color:#ff5f56; }
.fl-form-msg{ font-size:12px; margin-top:6px; }
.fl-form-msg.ok{ color:#5cc88a; }
.fl-form-msg.bad{ color:#ff7b72; }

/* State managers */
.fl-mgr-tabs{ display:flex; gap:6px; justify-content:center; flex-wrap:wrap; margin-bottom:14px; }
.fl-mgr-tab{ font-family:'JetBrains Mono',monospace; font-size:11.5px; padding:6px 12px; border-radius:8px;
  border:1px solid #1e2a38; background:#0f1620; color:#9fadbd; cursor:pointer; transition:all .2s; }
.fl-mgr-tab.on{ background:rgba(66,165,245,.1); }
.fl-mgr-stage{ display:flex; flex-direction:column; align-items:center; gap:10px; }
.fl-mgr-flow{ display:flex; align-items:center; gap:14px; }
.fl-mgr-box{ padding:12px 18px; border-radius:10px; border:1.5px solid #1e2a38; font-family:'JetBrains Mono',monospace;
  font-size:13px; color:#e8eef6; background:#0f1620; transition:all .3s; }
.fl-mgr-arrow{ font-size:18px; transition:color .3s; }

/* setState counter */
.fl-counter-row{ display:flex; align-items:center; justify-content:center; gap:16px; }
.fl-counter-box{ width:64px; height:64px; border-radius:14px; background:rgba(66,165,245,.1); border:1.5px solid #42A5F5;
  display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800; color:#aee0ff; transition:transform .15s; }
.fl-counter-box.pulse{ transform:scale(1.18); background:rgba(92,200,138,.18); border-color:#5cc88a; color:#aef0c6; }

/* App flow */
.fl-app-row{ display:flex; align-items:center; justify-content:center; gap:6px; flex-wrap:wrap; }
.fl-app-screen{ display:flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:11.5px;
  padding:8px 12px; border-radius:9px; border:1px solid #1e2a38; background:#0f1620; color:#9fadbd; cursor:pointer; transition:all .2s; }
.fl-app-screen.on{ border-color:#42A5F5; background:rgba(66,165,245,.13); color:#aee0ff; }
.fl-app-arrow{ color:#5d708a; }
`;
export default function App() {
    const saved = loadSave();
    const [open, setOpen] = useState(null);
    const [read, setRead] = useState(saved.read || {});
    const [quiz, setQuiz] = useState(saved.quiz || {}); // { lessonId: [idxElegido,...] }

    useEffect(() => {
        try { localStorage.setItem(SAVE_KEY, JSON.stringify({ read, quiz })); } catch {}
    }, [read, quiz]);

    const quizPassed = (les) => {
        const a = quiz[les.id]; if (!a) return false;
        return les.quiz.every((q, i) => a[i] === q.correct);
    };
    const isDone = (les) => read[les.id] && quizPassed(les);
    const completas = L.filter(isDone).length;
    const xp = completas * 100 + L.reduce((s, les) => s + ((quiz[les.id] || []).filter((a, i) => a === les.quiz[i]?.correct).length) * 10, 0);
    const rank = rankFor(xp);
    const next = RANKS.find((r) => xp < r.min);
    const pct = next ? Math.min(100, ((xp - rank.min) / (next.min - rank.min)) * 100) : 100;

    const openLesson = (idx) => {
        setOpen(idx);
        setRead((r) => ({ ...r, [L[idx].id]: true }));
        window.scrollTo(0, 0);
    };

    /* ---------- vista lección ---------- */
    if (open != null) {
        const les = L[open];
        const answers = quiz[les.id] || [];
        const answer = (qi, oi) => {
            setQuiz((prev) => {
                const cur = [...(prev[les.id] || [])];
                if (cur[qi] != null) return prev; // ya respondió
                cur[qi] = oi;
                return { ...prev, [les.id]: cur };
            });
        };
        return (
            <div className="fl">
                <style>{CSS}</style>
                <div className="fl-wrap">
                    <button className="fl-back" onClick={() => setOpen(null)}><ChevronLeft size={15} /> TODAS LAS LECCIONES</button>
                    <div className="fl-lhead">
                        <span className="fl-badge">{les.mod} · {les.mins}</span>
                        <h2>{les.title}</h2>
                    </div>
                    <div className="fl-intro">{les.intro}</div>

                    <div className="fl-secl"><BookOpen size={13} /> TEORÍA</div>
                    <Theory blocks={les.theory} />

                    <div className="fl-secl"><Play size={13} /> PRÁCTICA</div>
                    {les.practice.map((ex, i) => <Exercise key={i} ex={ex} n={i + 1} />)}

                    <div className="fl-secl"><Award size={13} /> QUIZ</div>
                    {les.quiz.map((q, qi) => {
                        const picked = answers[qi];
                        const done = picked != null;
                        return (
                            <div className="fl-quiz" key={qi}>
                                <div className="fl-q">{q.q}</div>
                                {q.opts.map((o, oi) => {
                                    let cls = "fl-opt";
                                    if (done) { if (oi === q.correct) cls += " ok"; else if (oi === picked) cls += " no"; }
                                    return <button key={oi} className={cls} onClick={() => answer(qi, oi)}>{o}</button>;
                                })}
                                {done && (
                                    <div className="fl-fb" style={{ color: picked === q.correct ? "#5cc88a" : "#ff7b72" }}>
                                        {picked === q.correct ? "✓ " : "✗ "}{q.fb}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {isDone(les) && (
                        <div style={{ textAlign: "center", marginTop: 18 }}>
                            <span className="fl-done-tag"><Check size={15} /> ¡Lección completada! +100 XP</span>
                        </div>
                    )}

                    <div className="fl-nav">
                        <button className="fl-btn" disabled={open === 0} onClick={() => openLesson(open - 1)}>
                            <ChevronLeft size={15} /> Anterior
                        </button>
                        <button className="fl-btn main" disabled={open === L.length - 1} onClick={() => openLesson(open + 1)}>
                            Siguiente <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ---------- home ---------- */
    return (
        <div className="fl">
            <style>{CSS}</style>
            <div className="fl-wrap">
                <div className="fl-head">
                    <div className="fl-kick">// EVOLUTIVE · MÓVIL</div>
                    <h1 className="fl-title">FLUTTER + <b>DART</b></h1>
                    <p className="fl-sub">De cero a tu examen. Teoría con animaciones explicativas, práctica con soluciones y un quiz por lección.</p>
                </div>

                <div className="fl-rank">
                    <div className="fl-rbox">
                        <Smartphone size={20} color="#42A5F5" />
                        <div><div className="fl-rl">RANGO</div><div className="fl-rn">{rank.name}</div></div>
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#5d708a", marginBottom: 5 }}>
                            <span>{xp} XP · {completas}/{L.length} lecciones</span>
                            <span>{next ? `→ ${next.name}` : "MÁX"}</span>
                        </div>
                        <div className="fl-bar"><i style={{ width: pct + "%" }} /></div>
                    </div>
                </div>

                {MODS.map((m) => {
                    const lessons = L.map((l, i) => ({ l, i })).filter(({ l }) => l.mod === m.name);
                    return (
                        <div key={m.name}>
                            <div className="fl-modh"><m.icon size={14} /> {m.name} <span className="ms">— {m.sub}</span></div>
                            <div className="fl-list-lessons">
                                {lessons.map(({ l, i }) => {
                                    const done = isDone(l);
                                    const Ico = l.icon;
                                    return (
                                        <button key={l.id} className={`fl-lcard ${done ? "done" : ""}`} onClick={() => openLesson(i)}>
                                            <div className="fl-lico">{done ? <Check size={20} /> : <Ico size={20} />}</div>
                                            <div className="fl-lm">
                                                <div className="fl-lt">{l.title}</div>
                                                <div className="fl-li">{l.intro.slice(0, 70)}…</div>
                                            </div>
                                            <div className="fl-lmeta">{l.mins}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                <div className="fl-foot">
                    <button className="fl-reset" onClick={() => {
                        if (window.confirm("¿Reiniciar el progreso de Flutter + Dart?")) { setRead({}); setQuiz({}); }
                    }}>
                        <RotateCcw size={11} style={{ verticalAlign: "-1px", marginRight: 5 }} /> Reiniciar progreso
                    </button>
                </div>
            </div>
        </div>
    );
}