import React, { useState, useEffect } from "react";
import {
    Gamepad2, BookOpen, Play, Award, ChevronLeft, ChevronRight,
    Eye, EyeOff, Check, RotateCcw, History, Cpu, Sigma, Layers,
    Sun, RefreshCw, Wrench, GitBranch, Boxes,
} from "lucide-react";

/* ============================================================
   MOTOR DE VIDEOJUEGOS — C++ & OpenGL (de cero, sin engine)
   Curso autónomo. Progreso en localStorage (motor_progress_v1).
   40% teoría (con animaciones explicativas) · 60% práctica.
   Mismo espíritu que id Tech: tu propio motor a la medida.
   ============================================================ */

const SAVE_KEY = "motor_progress_v1";

/* ====================================================================
   ANIMACIONES — autocontenidas, solo SVG/CSS, sin librerías externas.
   Se insertan en la teoría con { anim: "nombre" }.
   ==================================================================== */

/* --- 1. Línea del tiempo de los motores --- */
function AnimTimeline() {
    const hitos = [
        { y: "1972", t: "Pong", d: "todo a mano" },
        { y: "1993", t: "id Tech / Doom", d: "3D real" },
        { y: "1998", t: "Unreal", d: "motor = producto" },
        { y: "2008", t: "Unity", d: "explosión móvil" },
        { y: "2015+", t: "Vulkan / DX12", d: "control explícito" },
    ];
    const [step, setStep] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setStep((s) => (s + 1) % (hitos.length + 1)), 900);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="me-anim">
            <div className="me-tl">
                {hitos.map((h, i) => {
                    const on = i < step;
                    return (
                        <div key={i} className={`me-tl-node ${on ? "on" : ""}`}>
                            <div className="me-tl-dot" />
                            <div className="me-tl-y">{h.y}</div>
                            <div className="me-tl-t">{h.t}</div>
                            <div className="me-tl-d">{h.d}</div>
                        </div>
                    );
                })}
            </div>
            <p className="me-anim-cap">De juegos monolíticos a motores con control fino del hardware. Tu proyecto vuelve al principio: código a la medida.</p>
        </div>
    );
}

/* --- 2. RAII: vida del objeto atada al scope --- */
function AnimRAII() {
    const [phase, setPhase] = useState(0); // 0 fuera, 1 construye, 2 vive, 3 destruye
    useEffect(() => {
        const t = setInterval(() => setPhase((p) => (p + 1) % 4), 1100);
        return () => clearInterval(t);
    }, []);
    const label = ["// antes del { }", "Constructor → glGenBuffers", "el recurso vive aquí", "Destructor → glDeleteBuffers"][phase];
    const alive = phase === 1 || phase === 2;
    return (
        <div className="me-anim">
            <div className="me-raii">
                <div className="me-raii-brace">{"{"}</div>
                <div className={`me-raii-obj ${alive ? "alive" : ""} ${phase === 1 ? "born" : ""} ${phase === 3 ? "dead" : ""}`}>
                    <Boxes size={22} />
                    <span>GpuBuffer</span>
                </div>
                <div className="me-raii-brace">{"}"}</div>
            </div>
            <p className="me-anim-cap"><code>{label}</code> — al salir del scope, el destructor libera el recurso solo. Cero <code>delete</code> a mano.</p>
        </div>
    );
}

/* --- 3. Espacios de coordenadas: local → mundo → cámara → clip → pantalla --- */
function AnimCoordSpaces() {
    const spaces = ["Local", "Mundo", "Cámara", "Clip", "Pantalla"];
    const mats = ["", "× Model", "× View", "× Projection", "÷ w"];
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((s) => (s + 1) % spaces.length), 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="me-anim">
            <div className="me-spaces">
                {spaces.map((s, idx) => (
                    <React.Fragment key={idx}>
                        <div className={`me-space ${idx === i ? "on" : ""} ${idx < i ? "past" : ""}`}>
                            <div className="me-space-name">{s}</div>
                            {mats[idx] && <div className="me-space-mat">{mats[idx]}</div>}
                        </div>
                        {idx < spaces.length - 1 && <span className="me-space-arrow">→</span>}
                    </React.Fragment>
                ))}
            </div>
            <p className="me-anim-cap">Un mismo vértice se multiplica por matrices hasta caer en la pantalla. Eso es la matriz <code>MVP</code>.</p>
        </div>
    );
}

/* --- 4. Pipeline de render de OpenGL --- */
function AnimPipeline() {
    const stages = ["Vértices", "Vertex Shader", "Rasterizado", "Fragment Shader", "Framebuffer"];
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((s) => (s + 1) % (stages.length + 1)), 850);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="me-anim">
            <div className="me-pipe">
                {stages.map((s, idx) => (
                    <React.Fragment key={idx}>
                        <div className={`me-pipe-stage ${idx < i ? "on" : ""} ${idx === i - 1 ? "active" : ""}`}>{s}</div>
                        {idx < stages.length - 1 && <span className={`me-pipe-arrow ${idx < i - 1 ? "on" : ""}`}>▸</span>}
                    </React.Fragment>
                ))}
            </div>
            <p className="me-anim-cap">Los datos fluyen en una sola dirección: de tus vértices a los píxeles de la pantalla.</p>
        </div>
    );
}

/* --- 5. Iluminación Phong: ambiente + difusa + especular --- */
function AnimPhong() {
    const [n, setN] = useState(1); // 1=ambiente, 2=+difusa, 3=+especular
    useEffect(() => {
        const t = setInterval(() => setN((s) => (s % 3) + 1), 1200);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="me-anim">
            <div className="me-phong">
                <svg viewBox="0 0 160 160" className="me-phong-svg">
                    <defs>
                        <radialGradient id="mePhongG" cx="38%" cy="32%" r="75%">
                            <stop offset="0%" stopColor={n >= 3 ? "#fff" : "#ffd9a0"} />
                            <stop offset={n >= 2 ? "35%" : "0%"} stopColor="#ff9a4d" />
                            <stop offset="100%" stopColor={n >= 1 ? "#5a2c12" : "#3a1c0c"} />
                        </radialGradient>
                    </defs>
                    <circle cx="80" cy="80" r="58" fill="url(#mePhongG)" />
                    {n >= 3 && <circle cx="58" cy="54" r="11" fill="#ffffff" opacity="0.9" />}
                </svg>
                <div className="me-phong-legend">
                    <span className={n >= 1 ? "on" : ""}>ambiente</span>
                    <span className={n >= 2 ? "on" : ""}>+ difusa</span>
                    <span className={n >= 3 ? "on" : ""}>+ especular</span>
                </div>
            </div>
            <p className="me-anim-cap">El color final de cada píxel es la suma de tres luces. Así se ve el volumen.</p>
        </div>
    );
}

/* --- 6. Game loop: input → update → render --- */
function AnimGameLoop() {
    const steps = ["Input", "Update", "Render"];
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((s) => (s + 1) % steps.length), 800);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="me-anim">
            <div className="me-loop">
                {steps.map((s, idx) => (
                    <div key={idx} className={`me-loop-node ${idx === i ? "on" : ""}`}>{s}</div>
                ))}
                <div className="me-loop-back">↻ repite ~60 veces/seg</div>
            </div>
            <p className="me-anim-cap">El motor nunca para: lee entrada, actualiza el mundo, lo dibuja, y vuelve a empezar.</p>
        </div>
    );
}

/* --- 7. Herramientas del ecosistema --- */
function AnimToolchain() {
    const tools = [
        { n: "GLFW", d: "ventana + input" },
        { n: "GLAD", d: "carga funciones GL" },
        { n: "GLM", d: "matemáticas" },
        { n: "Assimp", d: "carga modelos" },
        { n: "CMake", d: "compila todo" },
    ];
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((s) => (s + 1) % (tools.length + 1)), 800);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="me-anim">
            <div className="me-tools">
                {tools.map((t, idx) => (
                    <div key={idx} className={`me-tool ${idx < i ? "on" : ""}`}>
                        <div className="me-tool-n">{t.n}</div>
                        <div className="me-tool-d">{t.d}</div>
                    </div>
                ))}
            </div>
            <p className="me-anim-cap">OpenGL solo dibuja. Estas piezas le ponen ventana, modelos y un build ordenado alrededor.</p>
        </div>
    );
}

/* --- 8. Concurrencia: hilo de GL + worker --- */
function AnimThreads() {
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((s) => (s + 1) % 4), 900);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="me-anim">
            <div className="me-threads">
                <div className="me-thread">
                    <div className="me-thread-tag">Hilo principal (GL)</div>
                    <div className="me-thread-track">
                        <div className={`me-thread-blk gl ${i >= 0 ? "on" : ""}`}>render</div>
                        <div className={`me-thread-blk gl ${i >= 3 ? "on" : ""}`}>sube a GPU</div>
                    </div>
                </div>
                <div className="me-thread">
                    <div className="me-thread-tag">Worker</div>
                    <div className="me-thread-track">
                        <div className={`me-thread-blk wk ${i >= 1 ? "on" : ""}`}>lee archivo</div>
                        <div className={`me-thread-blk wk ${i >= 2 ? "on" : ""}`}>decodifica</div>
                    </div>
                </div>
            </div>
            <p className="me-anim-cap">El worker carga el asset en segundo plano; solo el hilo principal habla con OpenGL.</p>
        </div>
    );
}

/* ====================================================================
   CONTENIDO — lecciones (teoría breve + 2 ejercicios c/u + quiz)
   ==================================================================== */
const L = [
    /* ===================== HISTORIA ===================== */
    {
        id: "m_historia", mod: "Historia", icon: History, mins: "10 min",
        title: "De Pong a tu propio motor",
        intro: "Entender de dónde vienen los motores explica por qué tomarás ciertas decisiones de diseño en el tuyo.",
        theory: [
            { anim: "timeline" },
            { p: "En los 70s y 80s no existía el 'motor': cada juego era un programa monolítico. En Pong (1972) y Space Invaders (1978) la lógica, el render y el sonido estaban entrelazados, sin intención de reutilizar nada." },
            { p: "Cuando los estudios notaron que resolvían los mismos problemas una y otra vez (dibujar sprites, colisiones, leer el teclado), nació la idea de separar el código reutilizable del contenido del juego: el germen del motor." },
            { h: "id Tech y la revolución 3D (1993–96)" },
            { p: "id Tech, detrás de Doom y Quake, masificó el texturizado, la iluminación en tiempo real y los modelos poligonales. Pero ese motor era código específico para ese juego; licenciarlo a otros vino después." },
            { h: "Unreal: el motor como producto" },
            { p: "Epic convirtió su motor en algo que otros estudios podían licenciar. Con Unreal Engine 2 el modelo de 'motor como producto' quedó establecido y define la industria hasta hoy." },
            { h: "Unity, Godot y el control explícito" },
            { p: "Tras el iPhone (2008), Unity bajó la barrera de entrada y democratizó el desarrollo indie, el mismo espacio donde hoy vive Godot. En paralelo, la industria migró de APIs 'automáticas' como OpenGL hacia APIs de control explícito como Vulkan y DirectX 12." },
            { tip: { icon: "🎯", text: "Tu proyecto (motor desde cero con C++ y OpenGL) es justo el espíritu de id Tech: código a la medida de lo que TÚ quieres construir, no una solución genérica." } },
        ],
        practice: [
            { title: "Ordena la historia", goal: "Pon estos hitos en orden cronológico y di qué aportó cada uno.",
                steps: ["Hitos: Unity, Doom (id Tech), Pong, Vulkan/DX12, Unreal", "Para cada uno escribe su aporte en una línea"],
                solution: `Pong (1972)        -> juego monolitico, todo a mano
Doom/id Tech (1993)-> 3D real: texturas, luz, poligonos
Unreal (1998)      -> el motor como producto licenciable
Unity (2008)       -> barrera baja, explosion movil/indie
Vulkan/DX12 (2015+)-> control explicito de memoria e hilos`, file: "respuesta.txt" },
            { title: "Tu decisión de diseño", goal: "Justifica por qué harás tu motor desde cero en vez de usar Godot/Unity.",
                steps: ["Escribe 2-3 razones honestas para TU caso", "Incluye al menos una desventaja que aceptas"],
                solution: `Por que desde cero:
1. Aprender lo que un engine esconde (memoria, pipeline, mates).
2. Control total: solo el codigo que mi juego necesita.
3. Es el objetivo del proyecto, no entregar un juego rapido.

Desventaja que acepto:
- Tardare mucho mas en ver resultados que con Godot.`, file: "respuesta.txt" },
        ],
        quiz: [
            { q: "¿Por qué los primeros juegos no tenían 'motor'?", opts: ["No existía C++", "Cada juego era monolítico, sin código reutilizable", "Eran demasiado simples", "No había computadoras"], correct: 1, fb: "La lógica, el render y el sonido estaban entrelazados sin intención de reutilizarse." },
            { q: "¿Qué hizo Epic Games con Unreal que marcó a la industria?", opts: ["Inventó el 3D", "Convirtió el motor en un producto licenciable a otros estudios", "Creó OpenGL", "Hizo el primer juego móvil"], correct: 1, fb: "El modelo 'motor como producto' define la industria hasta hoy." },
            { q: "¿Hacia qué tipo de API migró la industria desde OpenGL?", opts: ["APIs más automáticas", "APIs de control explícito como Vulkan y DX12", "Solo software, sin GPU", "Ninguna, OpenGL sigue igual"], correct: 1, fb: "Vulkan y DirectX 12 exponen control fino sobre memoria y multihilo." },
        ],
    },

    /* ===================== FUNDAMENTOS ===================== */
    {
        id: "m_cpp", mod: "Fundamentos", icon: Cpu, mins: "30 min",
        title: "C++ para gráficos: memoria y RAII",
        intro: "En gráficos de bajo nivel un error de memoria no tira un mensaje claro: la pantalla se pone negra o el programa truena sin explicación. Por eso C++ es la base de todo.",
        theory: [
            { anim: "raii" },
            { p: "Un puntero guarda una dirección de memoria; una referencia es un alias a algo que ya existe. El problema clásico es pedir memoria con new y olvidar liberarla con delete: eso es una fuga." },
            { code: { file: "crudo.cpp", code: `// Frágil: tú tienes que acordarte de liberar
Textura* t = new Textura("piso.png");
// ... si algo lanza una excepción aquí, NUNCA se libera
delete t;  // fácil de olvidar` } },
            { h: "RAII: el recurso vive con el objeto" },
            { p: "RAII (Resource Acquisition Is Initialization) ata un recurso a la vida de un objeto: lo pides en el constructor y lo sueltas en el destructor. Al salir del scope se libera solo, incluso si hay una excepción." },
            { code: { file: "gpu_buffer.cpp", code: `class GpuBuffer {
  unsigned int id = 0;
public:
  GpuBuffer()  { glGenBuffers(1, &id); }   // adquiere
  ~GpuBuffer() { glDeleteBuffers(1, &id); } // libera solo
  unsigned int handle() const { return id; }
};` } },
            { tip: { icon: "🔑", text: "Regla práctica: evita new/delete crudos. Usa std::unique_ptr (un dueño) y std::shared_ptr (dueños compartidos), o clases RAII como la de arriba." } },
        ],
        practice: [
            { title: "De crudo a smart pointer", goal: "Reescribe este código para que no necesite delete manual.",
                steps: ["Incluye <memory>", "Cambia new/delete por std::unique_ptr", "Crea con std::make_unique"],
                solution: `#include <memory>

auto t = std::make_unique<Textura>("piso.png");
// se libera solo al salir del scope, aunque haya excepción
t->bind();`, file: "solucion.cpp" },
            { title: "Tu propia clase RAII", goal: "Escribe una clase que abra un archivo en el constructor y lo cierre en el destructor.",
                steps: ["Guarda un FILE* como miembro", "Ábrelo en el constructor", "Ciérralo en el destructor si no es nulo"],
                solution: `#include <cstdio>

class Archivo {
  FILE* f = nullptr;
public:
  explicit Archivo(const char* ruta) { f = std::fopen(ruta, "rb"); }
  ~Archivo() { if (f) std::fclose(f); }
  FILE* raw() const { return f; }
};`, file: "solucion.cpp" },
        ],
        quiz: [
            { q: "¿Qué problema resuelve RAII?", opts: ["Hace el código más corto", "Libera recursos automáticamente al salir del scope", "Acelera la GPU", "Evita usar clases"], correct: 1, fb: "El destructor libera el recurso aunque haya una excepción de por medio." },
            { q: "¿Cuál usarías para un recurso con UN solo dueño?", opts: ["shared_ptr", "unique_ptr", "new crudo", "una variable global"], correct: 1, fb: "unique_ptr modela propiedad única y se libera al salir del scope." },
            { q: "¿Por qué C++ crudo es peligroso en gráficos?", opts: ["Es lento", "Un error de memoria suele dar pantalla negra o crash sin mensaje claro", "No compila", "No tiene punteros"], correct: 1, fb: "En bajo nivel los errores de memoria no avisan con un mensaje legible." },
        ],
    },
    {
        id: "m_mate", mod: "Fundamentos", icon: Sigma, mins: "35 min",
        title: "Matemáticas de gráficos: vectores, matrices y espacios",
        intro: "Vectores, matrices y transformaciones son el idioma en el que piensa todo motor 3D. GLM ayuda con la implementación, pero hay que entender qué hace cada operación.",
        theory: [
            { anim: "coordspaces" },
            { p: "Un vector puede ser una posición (un punto) o una dirección. El producto punto mide qué tan alineados están dos vectores (clave en iluminación); el producto cruz da un vector perpendicular a ambos (clave para normales)." },
            { code: { file: "vectores.cpp", code: `#include <glm/glm.hpp>
glm::vec3 a(1, 0, 0), b(0, 1, 0);
float d  = glm::dot(a, b);    // 0 -> perpendiculares
glm::vec3 c = glm::cross(a, b); // (0,0,1) -> perpendicular` } },
            { h: "Matrices: trasladar, rotar, escalar" },
            { p: "Una matriz 4x4 codifica una transformación. La matriz Model lleva un objeto de su espacio local al mundo; View pone el mundo frente a la cámara; Projection lo aplasta a la pantalla. Juntas forman la MVP." },
            { code: { file: "mvp.cpp", code: `glm::mat4 model = glm::translate(glm::mat4(1.0f), pos);
model = glm::rotate(model, angulo, glm::vec3(0,1,0));
model = glm::scale(model, glm::vec3(escala));
glm::mat4 mvp = proj * view * model; // orden importa` } },
            { tip: { icon: "⚠️", text: "El orden de multiplicación importa: proj * view * model, no al revés. Y los quaternions evitan el 'gimbal lock' que sufren las rotaciones por ángulos de Euler." } },
        ],
        practice: [
            { title: "Dot y cross a mano", goal: "Implementa el producto punto y cruz de dos vec3 sin usar GLM.",
                steps: ["dot = ax*bx + ay*by + az*bz", "cross según la fórmula estándar"],
                solution: `struct Vec3 { float x, y, z; };

float dot(Vec3 a, Vec3 b) {
  return a.x*b.x + a.y*b.y + a.z*b.z;
}

Vec3 cross(Vec3 a, Vec3 b) {
  return {
    a.y*b.z - a.z*b.y,
    a.z*b.x - a.x*b.z,
    a.x*b.y - a.y*b.x
  };
}`, file: "solucion.cpp" },
            { title: "Arma la matriz MVP", goal: "Con GLM, construye una cámara y la transformación de un objeto.",
                steps: ["proj con glm::perspective", "view con glm::lookAt", "model con translate", "multiplica en el orden correcto"],
                solution: `glm::mat4 proj = glm::perspective(glm::radians(45.0f),
                                  1280.0f/720.0f, 0.1f, 100.0f);
glm::mat4 view = glm::lookAt(glm::vec3(0,0,5),  // cámara
                             glm::vec3(0,0,0),  // mira a
                             glm::vec3(0,1,0)); // arriba
glm::mat4 model = glm::translate(glm::mat4(1.0f), glm::vec3(2,0,0));
glm::mat4 mvp = proj * view * model;`, file: "solucion.cpp" },
        ],
        quiz: [
            { q: "¿Para qué sirve el producto punto en gráficos?", opts: ["Para rotar", "Para medir cuánto se alinean dos vectores (iluminación)", "Para escalar", "Para nada"], correct: 1, fb: "N·L (normal con la luz) es la base del término difuso." },
            { q: "¿Qué hace la matriz Model?", opts: ["Lleva el objeto de su espacio local al mundo", "Aplasta a la pantalla", "Coloca la cámara", "Calcula colisiones"], correct: 0, fb: "Model: local → mundo. View: mundo → cámara. Projection: → pantalla." },
            { q: "¿Por qué se usan quaternions para rotar?", opts: ["Son más rápidos de escribir", "Evitan el gimbal lock de los ángulos de Euler", "OpenGL los exige", "Ocupan menos memoria siempre"], correct: 1, fb: "Los quaternions rotan sin el bloqueo de ejes (gimbal lock)." },
        ],
    },

    /* ===================== RENDER ===================== */
    {
        id: "m_pipeline", mod: "Render", icon: Layers, mins: "35 min",
        title: "El pipeline de render de OpenGL",
        intro: "Cómo un puñado de números (vértices) termina siendo píxeles de colores en la pantalla. Este es el corazón del motor.",
        theory: [
            { anim: "pipeline" },
            { p: "Tus datos de vértices viven en buffers en la GPU. El VBO (Vertex Buffer Object) guarda los datos; el VAO (Vertex Array Object) recuerda CÓMO leerlos; el EBO/IBO guarda índices para reutilizar vértices y no repetirlos." },
            { code: { file: "buffers.cpp", code: `unsigned int vao, vbo;
glGenVertexArrays(1, &vao);
glGenBuffers(1, &vbo);

glBindVertexArray(vao);
glBindBuffer(GL_ARRAY_BUFFER, vbo);
glBufferData(GL_ARRAY_BUFFER, sizeof(verts), verts, GL_STATIC_DRAW);

// atributo 0: posición (3 floats por vértice)
glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3*sizeof(float), 0);
glEnableVertexAttribArray(0);` } },
            { h: "Shaders: programas que corren en la GPU" },
            { p: "El vertex shader transforma cada vértice (aquí entra la MVP). El fragment shader decide el color de cada píxel. Se escriben en GLSL. El z-buffer se encarga de que lo cercano tape a lo lejano." },
            { code: { file: "shader.glsl", code: `// --- vertex shader ---
#version 330 core
layout(location = 0) in vec3 aPos;
uniform mat4 uMVP;
void main() { gl_Position = uMVP * vec4(aPos, 1.0); }

// --- fragment shader ---
#version 330 core
out vec4 FragColor;
void main() { FragColor = vec4(1.0, 0.4, 0.2, 1.0); }` } },
            { tip: { icon: "💡", text: "El VAO es tu mejor amigo: guarda toda la config de atributos. Lo dejas listo una vez y antes de dibujar solo haces glBindVertexArray(vao)." } },
        ],
        practice: [
            { title: "Datos de un triángulo", goal: "Define los 3 vértices de un triángulo y súbelos a un VBO.",
                steps: ["Arreglo de 9 floats (3 vértices × xyz)", "glGenBuffers + glBindBuffer + glBufferData"],
                solution: `float verts[] = {
  -0.5f, -0.5f, 0.0f,  // abajo-izq
   0.5f, -0.5f, 0.0f,  // abajo-der
   0.0f,  0.5f, 0.0f   // arriba
};
unsigned int vbo;
glGenBuffers(1, &vbo);
glBindBuffer(GL_ARRAY_BUFFER, vbo);
glBufferData(GL_ARRAY_BUFFER, sizeof(verts), verts, GL_STATIC_DRAW);`, file: "solucion.cpp" },
            { title: "Fragment shader por coordenada", goal: "Escribe un fragment shader que pinte según la posición de pantalla.",
                steps: ["Recibe gl_FragCoord", "Normaliza y úsalo como color"],
                solution: `#version 330 core
out vec4 FragColor;
uniform vec2 uResolucion;
void main() {
  vec2 uv = gl_FragCoord.xy / uResolucion; // 0..1
  FragColor = vec4(uv.x, uv.y, 0.5, 1.0);
}`, file: "solucion.glsl" },
        ],
        quiz: [
            { q: "¿Qué guarda el VAO?", opts: ["Los píxeles", "Cómo leer los atributos de los vértices", "Las texturas", "El sonido"], correct: 1, fb: "El VAO recuerda la configuración de atributos; lo enlazas y listo." },
            { q: "¿Qué hace el fragment shader?", opts: ["Mueve la cámara", "Decide el color de cada píxel/fragmento", "Carga modelos", "Lee el teclado"], correct: 1, fb: "El vertex shader transforma vértices; el fragment shader colorea fragmentos." },
            { q: "¿Para qué sirve el z-buffer?", opts: ["Para el sonido 3D", "Para que lo cercano tape a lo lejano (profundidad)", "Para guardar índices", "Para rotar"], correct: 1, fb: "El z-buffer resuelve qué fragmento queda visible según su profundidad." },
        ],
    },
    {
        id: "m_luz", mod: "Render", icon: Sun, mins: "25 min",
        title: "Iluminación: el modelo Phong",
        intro: "El color final de una superficie es la suma de tres componentes de luz. Phong (y su variante Blinn-Phong) es el modelo clásico para dar volumen.",
        theory: [
            { anim: "phong" },
            { p: "Ambiente: una luz base constante para que nada quede 100% negro. Difusa: depende del ángulo entre la normal y la luz (N·L), da la forma. Especular: el brillo puntual que depende de dónde está la cámara." },
            { code: { file: "phong.frag", code: `#version 330 core
in vec3 Normal;
in vec3 FragPos;
out vec4 FragColor;
uniform vec3 luzPos, luzColor, camPos, objColor;

void main() {
  vec3 N = normalize(Normal);
  vec3 L = normalize(luzPos - FragPos);

  vec3 ambiente = 0.1 * luzColor;
  float dif = max(dot(N, L), 0.0);
  vec3 difusa = dif * luzColor;

  vec3 V = normalize(camPos - FragPos);
  vec3 R = reflect(-L, N);
  float esp = pow(max(dot(V, R), 0.0), 32.0);
  vec3 especular = 0.5 * esp * luzColor;

  FragColor = vec4((ambiente + difusa + especular) * objColor, 1.0);
}` } },
            { tip: { icon: "⚠️", text: "Normaliza SIEMPRE las normales en el shader (normalize). Si interpolan sin normalizar, la iluminación sale mal. Blinn-Phong usa el 'halfway vector' en vez de reflect: es más barato y suave." } },
        ],
        practice: [
            { title: "Completa el término difuso", goal: "Dada la normal N y la dirección a la luz L, calcula la componente difusa.",
                steps: ["Normaliza N y L", "dif = max(dot(N,L), 0.0)", "multiplica por el color de la luz"],
                solution: `vec3 N = normalize(Normal);
vec3 L = normalize(luzPos - FragPos);
float dif = max(dot(N, L), 0.0);
vec3 difusa = dif * luzColor;`, file: "solucion.glsl" },
            { title: "Agrega el brillo especular", goal: "Suma el término especular usando la posición de la cámara.",
                steps: ["V = dirección a la cámara", "R = reflejo de la luz sobre N", "esp = pow(max(dot(V,R),0), shininess)"],
                solution: `vec3 V = normalize(camPos - FragPos);
vec3 R = reflect(-L, N);
float esp = pow(max(dot(V, R), 0.0), 32.0); // 32 = brillo
vec3 especular = 0.5 * esp * luzColor;`, file: "solucion.glsl" },
        ],
        quiz: [
            { q: "¿Qué componente da la FORMA del objeto según el ángulo de la luz?", opts: ["Ambiente", "Difusa (N·L)", "Especular", "Ninguna"], correct: 1, fb: "La difusa depende de dot(N, L): caras de frente a la luz brillan más." },
            { q: "¿De qué depende la componente especular?", opts: ["Solo de la luz", "De dónde está la cámara (el brillo se mueve con la vista)", "Del z-buffer", "Del VAO"], correct: 1, fb: "El brillo especular cambia según la posición del observador." },
            { q: "¿Qué hay que hacer siempre con las normales en el shader?", opts: ["Sumarlas", "Normalizarlas", "Ignorarlas", "Multiplicarlas por 2"], correct: 1, fb: "Sin normalizar, la interpolación rompe la iluminación." },
        ],
    },

    /* ===================== ARQUITECTURA ===================== */
    {
        id: "m_loop", mod: "Arquitectura", icon: RefreshCw, mins: "30 min",
        title: "El game loop: update y render separados",
        intro: "El motor es, en el fondo, un bucle infinito que se repite decenas de veces por segundo. La clave es separar la lógica (update) del dibujo (render).",
        theory: [
            { anim: "gameloop" },
            { p: "Cada vuelta del bucle: lees la entrada, actualizas el estado del mundo y lo dibujas. El 'delta time' (cuánto tardó el frame anterior) hace que el movimiento sea igual de rápido sin importar los FPS." },
            { code: { file: "loop.cpp", code: `float ultimo = ahora();
while (!ventana.cerrada()) {
  float t = ahora();
  float dt = t - ultimo;   // delta time en segundos
  ultimo = t;

  procesarInput();
  actualizar(dt);          // mover con dt, no por frame
  render();
  ventana.swapBuffers();
}` } },
            { h: "Fixed timestep: física estable" },
            { p: "Si la física avanza con un dt variable, en máquinas lentas se vuelve inestable. La solución es acumular el tiempo y avanzar la física en pasos fijos (p. ej. 1/60 s), aunque el render vaya a otra velocidad." },
            { code: { file: "fixed.cpp", code: `const float PASO = 1.0f / 60.0f;
float acumulador = 0.0f;
while (!ventana.cerrada()) {
  acumulador += deltaTime();
  while (acumulador >= PASO) {
    fisica(PASO);          // siempre el mismo paso
    acumulador -= PASO;
  }
  render();                // render libre
}` } },
            { tip: { icon: "🔑", text: "Nunca acoples la física a los FPS. Si lo haces, tu juego corre distinto en cada PC. Update usa dt; la física pesada usa pasos fijos." } },
        ],
        practice: [
            { title: "Loop con delta time", goal: "Escribe un game loop que mueva un objeto usando delta time.",
                steps: ["Calcula dt cada frame", "Mueve: pos += velocidad * dt", "Dibuja y repite"],
                solution: `float ultimo = ahora();
float x = 0.0f;
const float vel = 200.0f; // px por segundo
while (!ventana.cerrada()) {
  float t = ahora();
  float dt = t - ultimo;
  ultimo = t;

  x += vel * dt;   // misma velocidad real en cualquier PC
  render(x);
  ventana.swapBuffers();
}`, file: "solucion.cpp" },
            { title: "Fixed timestep", goal: "Implementa el acumulador que avanza la física en pasos fijos.",
                steps: ["PASO = 1/60", "Acumula el delta time", "while acumulador >= PASO: fisica(PASO)"],
                solution: `const float PASO = 1.0f / 60.0f;
float acum = 0.0f;
while (!ventana.cerrada()) {
  acum += deltaTime();
  while (acum >= PASO) {
    fisica(PASO);
    acum -= PASO;
  }
  render();
}`, file: "solucion.cpp" },
        ],
        quiz: [
            { q: "¿Para qué sirve el delta time?", opts: ["Para contar vidas", "Para que el movimiento sea igual sin importar los FPS", "Para cargar texturas", "Para rotar la cámara"], correct: 1, fb: "Multiplicar por dt desacopla la velocidad real del framerate." },
            { q: "¿Por qué usar fixed timestep para la física?", opts: ["Es más bonito", "Mantiene la simulación estable y determinista", "OpenGL lo exige", "Ahorra memoria"], correct: 1, fb: "Pasos fijos evitan que la física se rompa con dt variable." },
            { q: "¿Qué NO debes acoplar a los FPS?", opts: ["El color", "La física / lógica del juego", "El nombre de la ventana", "Los shaders"], correct: 1, fb: "Si la física depende del framerate, el juego corre distinto en cada PC." },
        ],
    },
    {
        id: "m_tools", mod: "Arquitectura", icon: Wrench, mins: "30 min",
        title: "Herramientas: GLFW, GLAD y CMake",
        intro: "OpenGL solo dibuja: no abre ventanas ni lee el teclado por sí solo. Necesitas un ecosistema de piezas alrededor.",
        theory: [
            { anim: "toolchain" },
            { p: "GLFW (o SDL2) crea la ventana, el contexto de OpenGL y maneja el input. GLAD (o GLEW) carga los punteros a las funciones de OpenGL de tu driver. GLM da las matemáticas, Assimp carga modelos 3D, y CMake compila todo de forma ordenada y multiplataforma." },
            { code: { file: "main.cpp", code: `#include <glad/glad.h>
#include <GLFW/glfw3.h>

int main() {
  glfwInit();
  GLFWwindow* win = glfwCreateWindow(1280, 720, "Motor", nullptr, nullptr);
  glfwMakeContextCurrent(win);

  // GLAD se carga DESPUÉS de tener contexto
  gladLoadGLLoader((GLADloadproc)glfwGetProcAddress);

  while (!glfwWindowShouldClose(win)) {
    glClearColor(0.1f, 0.12f, 0.15f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);
    glfwSwapBuffers(win);
    glfwPollEvents();
  }
  glfwTerminate();
}` } },
            { h: "CMake: el que arma el proyecto" },
            { code: { file: "CMakeLists.txt", code: `cmake_minimum_required(VERSION 3.16)
project(MiMotor)
set(CMAKE_CXX_STANDARD 17)

add_executable(motor src/main.cpp src/glad.c)
target_include_directories(motor PRIVATE include)
target_link_libraries(motor glfw)` } },
            { tip: { icon: "⚠️", text: "Error clásico: llamar a gladLoadGLLoader ANTES de glfwMakeContextCurrent. GLAD necesita un contexto activo o todo truena con pantalla negra." } },
        ],
        practice: [
            { title: "Abre una ventana y límpiala", goal: "Escribe el main que abre una ventana GLFW y la pinta de un color cada frame.",
                steps: ["glfwInit + crear ventana + makeContextCurrent", "Cargar GLAD", "Loop con glClear + swapBuffers + pollEvents"],
                solution: `#include <glad/glad.h>
#include <GLFW/glfw3.h>
int main() {
  glfwInit();
  GLFWwindow* w = glfwCreateWindow(800, 600, "Hola", nullptr, nullptr);
  glfwMakeContextCurrent(w);
  gladLoadGLLoader((GLADloadproc)glfwGetProcAddress);
  while (!glfwWindowShouldClose(w)) {
    glClearColor(0.2f, 0.3f, 0.4f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);
    glfwSwapBuffers(w);
    glfwPollEvents();
  }
  glfwTerminate();
}`, file: "solucion.cpp" },
            { title: "CMakeLists mínimo", goal: "Escribe un CMakeLists.txt que compile tu main y enlace GLFW.",
                steps: ["cmake_minimum_required + project", "C++17", "add_executable + link a glfw"],
                solution: `cmake_minimum_required(VERSION 3.16)
project(MiMotor)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(motor src/main.cpp src/glad.c)
target_include_directories(motor PRIVATE include)
target_link_libraries(motor glfw)`, file: "CMakeLists.txt" },
        ],
        quiz: [
            { q: "¿Qué hace GLFW?", opts: ["Carga modelos 3D", "Crea la ventana, el contexto y maneja el input", "Calcula la iluminación", "Compila el proyecto"], correct: 1, fb: "OpenGL no abre ventanas; GLFW (o SDL2) sí." },
            { q: "¿Para qué sirve GLAD/GLEW?", opts: ["Para el sonido", "Para cargar los punteros a las funciones de OpenGL", "Para la física", "Para abrir archivos"], correct: 1, fb: "Cargan las funciones de OpenGL del driver en tiempo de ejecución." },
            { q: "¿Cuándo debe cargarse GLAD?", opts: ["Antes de crear la ventana", "Después de tener un contexto OpenGL activo", "Al final del programa", "Nunca"], correct: 1, fb: "GLAD necesita un contexto vigente; si no, falla." },
        ],
    },

    /* ===================== AVANZADO ===================== */
    {
        id: "m_conc", mod: "Avanzado", icon: GitBranch, mins: "30 min",
        title: "Concurrencia: hilos en el motor",
        intro: "Las llamadas a OpenGL deben venir de un solo hilo, pero el resto del motor no. Esto se aprende DESPUÉS de tener el render básico funcionando en un solo hilo.",
        theory: [
            { anim: "threads" },
            { p: "El contexto de OpenGL está atado a un hilo: solo el hilo principal puede llamar funciones GL. Pero cargar assets, decodificar imágenes, pathfinding, generación procedural, audio y networking SÍ pueden ir en hilos aparte." },
            { code: { file: "carga_async.cpp", code: `#include <thread>
#include <queue>
#include <mutex>

std::queue<Imagen> listas;
std::mutex mtx;

void cargarEnFondo(std::string ruta) {
  Imagen img = leerYDecodificar(ruta); // pesado, en worker
  std::lock_guard<std::mutex> lock(mtx);
  listas.push(std::move(img));         // se la paso al main
}

// En el hilo principal, cada frame:
void subirPendientes() {
  std::lock_guard<std::mutex> lock(mtx);
  while (!listas.empty()) {
    subirTexturaAGPU(listas.front());  // ESTO sí es GL: va en main
    listas.pop();
  }
}` } },
            { h: "Doble buffer: lógica y render a la vez" },
            { p: "Para que el hilo de lógica y el de render no se pisen, se usan buffers dobles o triples: la lógica escribe en uno mientras el render lee el otro, y al terminar el frame se intercambian." },
            { tip: { icon: "⚠️", text: "Regla de oro: NUNCA llames a una función de OpenGL desde un worker thread. El worker prepara datos en RAM; el hilo principal los sube a la GPU." } },
        ],
        practice: [
            { title: "Carga en segundo plano", goal: "Lanza la lectura de un archivo en un hilo y entrega el resultado al main por una cola protegida.",
                steps: ["std::thread para la lectura", "std::mutex + cola para pasar el dato", "El main consume la cola"],
                solution: `#include <thread>
#include <queue>
#include <mutex>

std::queue<std::vector<char>> cola;
std::mutex mtx;

void worker(const std::string& ruta) {
  auto datos = leerArchivo(ruta);          // pesado
  std::lock_guard<std::mutex> lock(mtx);
  cola.push(std::move(datos));
}

int main() {
  std::thread t(worker, "modelo.obj");
  // ... el main sigue renderizando ...
  t.join();
  std::lock_guard<std::mutex> lock(mtx);
  if (!cola.empty()) usar(cola.front());
}`, file: "solucion.cpp" },
            { title: "Doble buffer de estado", goal: "Implementa el intercambio de dos buffers de estado de juego.",
                steps: ["Dos copias del estado", "La lógica escribe en 'atras'", "Al terminar, swap con 'frente'"],
                solution: `struct Estado { /* posiciones, etc. */ };

Estado bufA, bufB;
Estado* frente = &bufA; // lo lee el render
Estado* atras  = &bufB; // lo escribe la lógica

void finDeFrame() {
  std::swap(frente, atras); // intercambio barato (punteros)
}`, file: "solucion.cpp" },
        ],
        quiz: [
            { q: "¿Desde qué hilo puedes llamar funciones de OpenGL?", opts: ["Desde cualquiera", "Solo desde el hilo que tiene el contexto (el principal)", "Solo desde workers", "Desde ninguno"], correct: 1, fb: "El contexto GL está atado a un hilo; las llamadas van ahí." },
            { q: "¿Qué SÍ conviene mandar a un worker thread?", opts: ["glDrawArrays", "Cargar y decodificar assets en RAM", "glClear", "Crear la ventana"], correct: 1, fb: "El trabajo pesado de CPU (cargar/decodificar) va en hilos aparte." },
            { q: "¿Para qué sirve el doble buffer entre lógica y render?", opts: ["Para ahorrar disco", "Para que ambos hilos trabajen sin pisarse", "Para más FPS gratis", "Para iluminar"], correct: 1, fb: "Uno escribe mientras el otro lee, y se intercambian al final del frame." },
        ],
    },
];

const MODS = [
    { name: "Historia", sub: "De dónde vienen los motores", icon: History },
    { name: "Fundamentos", sub: "C++ y matemáticas, la base", icon: Cpu },
    { name: "Render", sub: "OpenGL: del vértice al píxel", icon: Layers },
    { name: "Arquitectura", sub: "Game loop y herramientas", icon: RefreshCw },
    { name: "Avanzado", sub: "Concurrencia", icon: GitBranch },
];

const RANKS = [
    { min: 0, name: "Curioso" },
    { min: 300, name: "Aprendiz de gráficos" },
    { min: 700, name: "Programador de render" },
    { min: 1100, name: "Arquitecto de motor" },
    { min: 1600, name: "Engine Dev" },
];
const rankFor = (xp) => RANKS.filter((r) => xp >= r.min).pop();
const loadSave = () => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } };

/* ---------- componentes de UI ---------- */
function CodeBlock({ code, file }) {
    return (
        <div className="me-term">
            <div className="me-term-h">
                <span className="d r" /><span className="d y" /><span className="d g" />
                {file && <span className="me-file">{file}</span>}
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
    timeline: AnimTimeline,
    raii: AnimRAII,
    coordspaces: AnimCoordSpaces,
    pipeline: AnimPipeline,
    phong: AnimPhong,
    gameloop: AnimGameLoop,
    toolchain: AnimToolchain,
    threads: AnimThreads,
};

function Theory({ blocks }) {
    return blocks.map((b, i) => {
        if (b.p) return <p key={i} className="me-p">{b.p}</p>;
        if (b.h) return <h3 key={i} className="me-h3">{b.h}</h3>;
        if (b.code) return <CodeBlock key={i} {...b.code} />;
        if (b.anim) {
            const Comp = ANIM_MAP[b.anim];
            return Comp ? <Comp key={i} /> : null;
        }
        if (b.tip) return (
            <div key={i} className="me-tip"><span className="me-tip-i">{b.tip.icon}</span><span>{b.tip.text}</span></div>
        );
        if (b.list) return (
            <ul key={i} className="me-list">{b.list.map((x, j) => <li key={j}>{x}</li>)}</ul>
        );
        if (b.table) return (
            <div key={i} className="me-tablewrap"><table className="me-table">
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
        <div className="me-ex">
            <div className="me-ex-top"><span className="me-ex-n">{n}</span><strong>{ex.title}</strong></div>
            <p className="me-ex-goal">{ex.goal}</p>
            {ex.steps && <ul className="me-steps">{ex.steps.map((s, i) => <li key={i}>{s}</li>)}</ul>}
            <button className="me-reveal" onClick={() => setOpen((o) => !o)}>
                {open ? <EyeOff size={13} /> : <Eye size={13} />} {open ? "Ocultar solución" : "Ver solución"}
            </button>
            {open && <CodeBlock code={ex.solution} file={ex.file || "solucion.cpp"} />}
        </div>
    );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
.me{ min-height:100vh; width:100%; font-family:'Space Grotesk',system-ui,sans-serif; color:#ece6df;
  background:radial-gradient(900px 520px at 82% -10%, rgba(255,122,69,.13), transparent 60%),
             radial-gradient(700px 420px at 0% 110%, rgba(120,180,255,.08), transparent 55%), #0a0908; }
.me *{ box-sizing:border-box; }
.me-wrap{ max-width:880px; margin:0 auto; padding:38px 22px 90px; }
.me-head{ text-align:center; margin-bottom:8px; }
.me-kick{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:4px; color:#9a7a5c; }
.me-title{ font-size:42px; font-weight:700; letter-spacing:-1px; margin:6px 0; }
.me-title b{ color:#ff7a45; }
.me-sub{ color:#a89684; font-size:15px; max-width:580px; margin:0 auto; }
.me-rank{ display:flex; gap:14px; align-items:center; justify-content:center; margin:22px auto; flex-wrap:wrap; }
.me-rbox{ display:flex; align-items:center; gap:10px; border:1px solid #2a2018; background:#140f0b; border-radius:12px; padding:10px 15px; }
.me-rl{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:2px; color:#9a7a5c; }
.me-rn{ font-size:16px; font-weight:700; }
.me-bar{ width:200px; height:8px; border-radius:99px; background:#140f0b; border:1px solid #2a2018; overflow:hidden; }
.me-bar i{ display:block; height:100%; background:linear-gradient(90deg,#ff7a45,#ffb27a); transition:width .6s; }
.me-modh{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:#ff7a45;
  margin:30px 0 12px; display:flex; align-items:center; gap:9px; text-transform:uppercase; }
.me-modh .ms{ color:#9a7a5c; letter-spacing:0; text-transform:none; font-size:12px; }
.me-list-lessons{ display:flex; flex-direction:column; gap:10px; }
.me-lcard{ display:flex; align-items:center; gap:15px; cursor:pointer; border:1px solid #261d15; border-radius:14px;
  padding:15px 17px; background:linear-gradient(180deg,#161009,#100b07); transition:.16s; text-align:left; width:100%; color:inherit; font-family:inherit; }
.me-lcard:hover{ transform:translateX(4px); border-color:#ff7a45; }
.me-lico{ width:42px; height:42px; border-radius:11px; flex:none; display:grid; place-items:center;
  background:rgba(255,122,69,.1); border:1px solid #2a2018; color:#ff7a45; }
.me-lcard.done .me-lico{ background:rgba(92,200,138,.13); border-color:#5cc88a; color:#5cc88a; }
.me-lm{ flex:1; min-width:0; }
.me-lt{ font-size:15.5px; font-weight:600; }
.me-li{ font-size:13px; color:#a89684; margin-top:2px; }
.me-lmeta{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#9a7a5c; flex:none; }
.me-back{ display:inline-flex; align-items:center; gap:6px; background:none; border:none; color:#a89684;
  font-family:'JetBrains Mono',monospace; font-size:12px; cursor:pointer; padding:6px 0; margin-bottom:6px; }
.me-back:hover{ color:#ff7a45; }
.me-lhead h2{ font-size:29px; font-weight:700; letter-spacing:-.5px; margin:4px 0 8px; }
.me-badge{ display:inline-block; font-family:'JetBrains Mono',monospace; font-size:11px; color:#ff7a45;
  background:rgba(255,122,69,.1); border:1px solid #2a2018; padding:3px 10px; border-radius:99px; }
.me-intro{ background:#140f0b; border-left:4px solid #ff7a45; border-radius:4px 12px 12px 4px;
  padding:15px 18px; margin:16px 0; color:#d4c6b6; font-size:15px; line-height:1.6; }
.me-secl{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:#9a7a5c;
  margin:26px 0 10px; display:flex; align-items:center; gap:8px; text-transform:uppercase; }
.me-p{ font-size:15px; line-height:1.7; color:#cfc2b3; margin:12px 0; }
.me-h3{ font-size:17px; font-weight:600; margin:22px 0 4px; color:#ece6df; }
.me-term{ background:#070605; border:1px solid #261d15; border-radius:12px; overflow:hidden; margin:14px 0; }
.me-term-h{ background:rgba(255,255,255,.03); padding:9px 13px; border-bottom:1px solid #261d15; display:flex; gap:7px; align-items:center; }
.me-term-h .d{ width:11px; height:11px; border-radius:50%; } .d.r{ background:#ff5f56; } .d.y{ background:#ffbd2e; } .d.g{ background:#27c93f; }
.me-file{ margin-left:8px; font-family:'JetBrains Mono',monospace; font-size:11px; color:#9a7a5c; }
.me-term pre{ margin:0; padding:16px; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.6;
  color:#e2d6c8; overflow-x:auto; } .me-term pre .cmt{ color:#9a7a5c; font-style:italic; }
.me-tip{ background:rgba(255,122,69,.06); border-left:4px solid #ff7a45; border-radius:4px 10px 10px 4px;
  padding:13px 16px; margin:16px 0; display:flex; gap:12px; align-items:flex-start; font-size:14px; line-height:1.55; color:#cfc2b3; }
.me-tip-i{ font-size:18px; flex:none; }
.me-list{ margin:12px 0; padding-left:4px; list-style:none; display:flex; flex-direction:column; gap:7px; }
.me-list li{ font-size:14.5px; color:#cfc2b3; padding-left:18px; position:relative; line-height:1.5; }
.me-list li::before{ content:'▸'; position:absolute; left:0; color:#ff7a45; }
.me-tablewrap{ overflow-x:auto; border:1px solid #261d15; border-radius:10px; margin:16px 0; }
.me-table{ width:100%; border-collapse:collapse; font-size:13.5px; }
.me-table th{ background:#140f0b; color:#ff7a45; text-align:left; padding:10px 14px; font-size:11px;
  text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #261d15; }
.me-table td{ padding:10px 14px; border-bottom:1px solid #1a130d; color:#cfc2b3; }
.me-ex{ background:#140f0b; border:1px solid #261d15; border-radius:14px; padding:18px; margin:12px 0; }
.me-ex-top{ display:flex; align-items:center; gap:10px; }
.me-ex-n{ background:#ff7a45; color:#1a0d05; width:24px; height:24px; border-radius:50%; display:grid;
  place-items:center; font-size:13px; font-weight:700; flex:none; }
.me-ex-goal{ font-size:14.5px; color:#cfc2b3; margin:10px 0; line-height:1.55; }
.me-steps{ margin:8px 0; padding-left:18px; } .me-steps li{ font-size:13.5px; color:#a89684; margin:4px 0; }
.me-reveal{ display:inline-flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:12px;
  color:#ff7a45; background:rgba(255,122,69,.08); border:1px solid #2a2018; border-radius:8px; padding:7px 13px; cursor:pointer; margin-top:6px; }
.me-reveal:hover{ background:rgba(255,122,69,.15); }
.me-quiz{ border:1px solid #2a2018; border-radius:14px; padding:18px; background:#140f0b; margin:12px 0; }
.me-q{ font-size:15.5px; font-weight:600; margin-bottom:11px; }
.me-opt{ display:block; width:100%; text-align:left; background:#100b07; border:1px solid #261d15; color:#ece6df;
  padding:11px 14px; border-radius:10px; margin:6px 0; font-size:14px; cursor:pointer; transition:.14s; font-family:inherit; }
.me-opt:hover{ border-color:#ff7a45; }
.me-opt.ok{ background:rgba(92,200,138,.13); border-color:#5cc88a; color:#aef0c6; }
.me-opt.no{ background:rgba(255,95,86,.12); border-color:#ff5f56; color:#ffb3ae; }
.me-fb{ font-size:13.5px; margin-top:9px; line-height:1.5; }
.me-nav{ display:flex; justify-content:space-between; gap:10px; margin-top:26px; }
.me-btn{ font-family:'JetBrains Mono',monospace; font-size:13px; padding:11px 17px; border-radius:10px; cursor:pointer;
  border:1px solid #2a2018; background:#140f0b; color:#ece6df; display:inline-flex; align-items:center; gap:7px; }
.me-btn:hover:not(:disabled){ border-color:#ff7a45; } .me-btn:disabled{ opacity:.3; cursor:default; }
.me-btn.main{ background:#ff7a45; color:#1a0d05; border-color:#ff7a45; font-weight:700; }
.me-foot{ text-align:center; margin-top:34px; }
.me-reset{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#ff7b72; background:transparent;
  border:1px solid rgba(255,123,114,.3); border-radius:8px; padding:8px 14px; cursor:pointer; }
.me-reset:hover{ background:rgba(255,123,114,.1); }
.me-done-tag{ display:inline-flex; align-items:center; gap:6px; color:#5cc88a; font-family:'JetBrains Mono',monospace; font-size:12px; }
@media(max-width:560px){ .me-title{ font-size:32px; } .me-lhead h2{ font-size:23px; } }

/* ===== Animaciones ===== */
.me-anim{ background:#100b07; border:1px solid #261d15; border-radius:14px; padding:18px 18px 14px; margin:16px 0; }
.me-anim-cap{ font-size:13px; color:#a89684; line-height:1.55; margin:14px 0 2px; text-align:center; }
.me-anim-cap code{ background:#140f0b; padding:1px 6px; border-radius:5px; font-family:'JetBrains Mono',monospace; font-size:12px; color:#ffb27a; }

/* Timeline */
.me-tl{ display:flex; align-items:flex-start; justify-content:space-between; gap:4px; flex-wrap:wrap; }
.me-tl-node{ flex:1; min-width:88px; text-align:center; opacity:.4; transition:opacity .4s; padding:4px; }
.me-tl-node.on{ opacity:1; }
.me-tl-dot{ width:13px; height:13px; border-radius:50%; background:#2a2018; border:2px solid #3a2c1f; margin:0 auto 8px; transition:all .4s; }
.me-tl-node.on .me-tl-dot{ background:#ff7a45; border-color:#ff7a45; box-shadow:0 0 0 5px rgba(255,122,69,.16); }
.me-tl-y{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#ffb27a; }
.me-tl-t{ font-size:12.5px; font-weight:600; color:#ece6df; margin-top:2px; }
.me-tl-d{ font-size:11px; color:#a89684; margin-top:1px; }

/* RAII */
.me-raii{ display:flex; align-items:center; justify-content:center; gap:18px; font-family:'JetBrains Mono',monospace; }
.me-raii-brace{ font-size:40px; color:#9a7a5c; }
.me-raii-obj{ display:flex; flex-direction:column; align-items:center; gap:6px; padding:16px 22px; border-radius:14px;
  border:1.5px dashed #3a2c1f; color:#5c4a38; transition:all .35s; }
.me-raii-obj span{ font-size:12px; }
.me-raii-obj.alive{ border-style:solid; border-color:#ff7a45; color:#ffb27a; background:rgba(255,122,69,.1); }
.me-raii-obj.born{ box-shadow:0 0 0 6px rgba(255,122,69,.14); }
.me-raii-obj.dead{ border-color:#ff5f56; color:#ff7b72; background:rgba(255,95,86,.08); }

/* Coord spaces */
.me-spaces{ display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:4px; }
.me-space{ display:flex; flex-direction:column; align-items:center; gap:3px; padding:10px 12px; border-radius:11px;
  border:1px solid #261d15; background:#140f0b; transition:all .3s; min-width:74px; }
.me-space.on{ border-color:#ff7a45; background:rgba(255,122,69,.13); transform:scale(1.06); }
.me-space.past{ border-color:#5cc88a; }
.me-space-name{ font-size:12.5px; font-weight:600; color:#ece6df; }
.me-space-mat{ font-family:'JetBrains Mono',monospace; font-size:10px; color:#ffb27a; }
.me-space-arrow{ color:#9a7a5c; font-size:14px; }

/* Pipeline */
.me-pipe{ display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:5px; }
.me-pipe-stage{ font-family:'JetBrains Mono',monospace; font-size:11.5px; padding:9px 12px; border-radius:10px;
  border:1px solid #261d15; background:#140f0b; color:#a89684; transition:all .3s; text-align:center; }
.me-pipe-stage.on{ border-color:#ff7a45; background:rgba(255,122,69,.1); color:#ffb27a; }
.me-pipe-stage.active{ box-shadow:0 0 0 4px rgba(255,122,69,.16); }
.me-pipe-arrow{ color:#3a2c1f; font-size:13px; transition:color .3s; }
.me-pipe-arrow.on{ color:#ff7a45; }

/* Phong */
.me-phong{ display:flex; flex-direction:column; align-items:center; gap:10px; }
.me-phong-svg{ width:130px; height:130px; }
.me-phong-legend{ display:flex; gap:12px; font-family:'JetBrains Mono',monospace; font-size:11.5px; }
.me-phong-legend span{ color:#5c4a38; transition:color .3s; }
.me-phong-legend span.on{ color:#ffb27a; }

/* Game loop */
.me-loop{ display:flex; align-items:center; justify-content:center; gap:10px; flex-wrap:wrap; }
.me-loop-node{ font-family:'JetBrains Mono',monospace; font-size:13px; padding:12px 18px; border-radius:12px;
  border:1px solid #261d15; background:#140f0b; color:#a89684; transition:all .3s; }
.me-loop-node.on{ border-color:#ff7a45; background:rgba(255,122,69,.13); color:#ffb27a; transform:scale(1.08); }
.me-loop-back{ width:100%; text-align:center; font-family:'JetBrains Mono',monospace; font-size:11px; color:#9a7a5c; margin-top:6px; }

/* Toolchain */
.me-tools{ display:flex; align-items:stretch; justify-content:center; flex-wrap:wrap; gap:8px; }
.me-tool{ flex:1; min-width:96px; padding:11px 10px; border-radius:11px; border:1px solid #261d15; background:#140f0b;
  text-align:center; opacity:.45; transition:all .35s; }
.me-tool.on{ opacity:1; border-color:#ff7a45; background:rgba(255,122,69,.09); }
.me-tool-n{ font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:600; color:#ffb27a; }
.me-tool-d{ font-size:11px; color:#a89684; margin-top:3px; }

/* Threads */
.me-threads{ display:flex; flex-direction:column; gap:12px; }
.me-thread-tag{ font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:1px; color:#9a7a5c; margin-bottom:5px; }
.me-thread-track{ display:flex; gap:8px; }
.me-thread-blk{ flex:1; padding:11px 8px; border-radius:9px; text-align:center; font-size:12px; font-family:'JetBrains Mono',monospace;
  border:1px solid #261d15; background:#140f0b; color:#5c4a38; transition:all .35s; }
.me-thread-blk.gl.on{ border-color:#ff7a45; background:rgba(255,122,69,.12); color:#ffb27a; }
.me-thread-blk.wk.on{ border-color:#7ab2ff; background:rgba(120,180,255,.12); color:#aed0ff; }
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
            <div className="me">
                <style>{CSS}</style>
                <div className="me-wrap">
                    <button className="me-back" onClick={() => setOpen(null)}><ChevronLeft size={15} /> TODAS LAS LECCIONES</button>
                    <div className="me-lhead">
                        <span className="me-badge">{les.mod} · {les.mins}</span>
                        <h2>{les.title}</h2>
                    </div>
                    <div className="me-intro">{les.intro}</div>

                    <div className="me-secl"><BookOpen size={13} /> TEORÍA</div>
                    <Theory blocks={les.theory} />

                    <div className="me-secl"><Play size={13} /> PRÁCTICA</div>
                    {les.practice.map((ex, i) => <Exercise key={i} ex={ex} n={i + 1} />)}

                    <div className="me-secl"><Award size={13} /> QUIZ</div>
                    {les.quiz.map((q, qi) => {
                        const picked = answers[qi];
                        const done = picked != null;
                        return (
                            <div className="me-quiz" key={qi}>
                                <div className="me-q">{q.q}</div>
                                {q.opts.map((o, oi) => {
                                    let cls = "me-opt";
                                    if (done) { if (oi === q.correct) cls += " ok"; else if (oi === picked) cls += " no"; }
                                    return <button key={oi} className={cls} onClick={() => answer(qi, oi)}>{o}</button>;
                                })}
                                {done && (
                                    <div className="me-fb" style={{ color: picked === q.correct ? "#5cc88a" : "#ff7b72" }}>
                                        {picked === q.correct ? "✓ " : "✗ "}{q.fb}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {isDone(les) && (
                        <div style={{ textAlign: "center", marginTop: 18 }}>
                            <span className="me-done-tag"><Check size={15} /> ¡Lección completada! +100 XP</span>
                        </div>
                    )}

                    <div className="me-nav">
                        <button className="me-btn" disabled={open === 0} onClick={() => openLesson(open - 1)}>
                            <ChevronLeft size={15} /> Anterior
                        </button>
                        <button className="me-btn main" disabled={open === L.length - 1} onClick={() => openLesson(open + 1)}>
                            Siguiente <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ---------- home ---------- */
    return (
        <div className="me">
            <style>{CSS}</style>
            <div className="me-wrap">
                <div className="me-head">
                    <div className="me-kick">// EVOLUTIVE · ENGINE</div>
                    <h1 className="me-title">MOTOR <b>C++ &amp; OpenGL</b></h1>
                    <p className="me-sub">Construye tu propio motor desde cero, sin Unity ni Godot por debajo. Teoría con animaciones, práctica con soluciones y un quiz por lección.</p>
                </div>

                <div className="me-rank">
                    <div className="me-rbox">
                        <Gamepad2 size={20} color="#ff7a45" />
                        <div><div className="me-rl">RANGO</div><div className="me-rn">{rank.name}</div></div>
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#9a7a5c", marginBottom: 5 }}>
                            <span>{xp} XP · {completas}/{L.length} lecciones</span>
                            <span>{next ? `→ ${next.name}` : "MÁX"}</span>
                        </div>
                        <div className="me-bar"><i style={{ width: pct + "%" }} /></div>
                    </div>
                </div>

                {MODS.map((m) => {
                    const lessons = L.map((l, i) => ({ l, i })).filter(({ l }) => l.mod === m.name);
                    return (
                        <div key={m.name}>
                            <div className="me-modh"><m.icon size={14} /> {m.name} <span className="ms">— {m.sub}</span></div>
                            <div className="me-list-lessons">
                                {lessons.map(({ l, i }) => {
                                    const done = isDone(l);
                                    const Ico = l.icon;
                                    return (
                                        <button key={l.id} className={`me-lcard ${done ? "done" : ""}`} onClick={() => openLesson(i)}>
                                            <div className="me-lico">{done ? <Check size={20} /> : <Ico size={20} />}</div>
                                            <div className="me-lm">
                                                <div className="me-lt">{l.title}</div>
                                                <div className="me-li">{l.intro.slice(0, 72)}…</div>
                                            </div>
                                            <div className="me-lmeta">{l.mins}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                <div className="me-foot">
                    <button className="me-reset" onClick={() => {
                        if (window.confirm("¿Reiniciar el progreso del Motor de Videojuegos?")) { setRead({}); setQuiz({}); }
                    }}>
                        <RotateCcw size={11} style={{ verticalAlign: "-1px", marginRight: 5 }} /> Reiniciar progreso
                    </button>
                </div>
            </div>
        </div>
    );
}