import React, { useState, useEffect } from "react";
import {
    Blocks, BookOpen, Play, Award, ChevronLeft, ChevronRight,
    Eye, EyeOff, Check, RotateCcw, Sparkles, Code2, Table2,
    Zap, Server, Network, Boxes, Send, Globe, Coins, Box,
} from "lucide-react";

/* ============================================================
   ROBLOX STUDIO + LUAU — de cero a pro
   Curso autónomo. Progreso en localStorage (roblox_progress_v1).
   40% teoría (con animaciones explicativas) · 60% práctica.
   Meta del alumno: un juego de construir (estilo Minecraft) + survival.
   ============================================================ */

const SAVE_KEY = "roblox_progress_v1";

/* ====================================================================
   ANIMACIONES — autocontenidas, solo SVG/CSS, sin librerías externas.
   Se insertan en la teoría con { anim: "nombre" }.
   ==================================================================== */

/* --- 1. El ecosistema: Studio -> Luau -> tu juego -> jugadores --- */
function AnimEcosystem() {
    const pasos = [
        { n: "Roblox Studio", d: "donde construyes" },
        { n: "Luau", d: "el código que da vida" },
        { n: "Tu juego", d: "lo publicas" },
        { n: "Jugadores", d: "del mundo entero" },
    ];
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((s) => (s + 1) % (pasos.length + 1)), 900);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="rb-anim">
            <div className="rb-eco">
                {pasos.map((p, idx) => (
                    <React.Fragment key={idx}>
                        <div className={`rb-eco-node ${idx < i ? "on" : ""}`}>
                            <div className="rb-eco-n">{p.n}</div>
                            <div className="rb-eco-d">{p.d}</div>
                        </div>
                        {idx < pasos.length - 1 && <span className={`rb-eco-arrow ${idx < i - 1 ? "on" : ""}`}>→</span>}
                    </React.Fragment>
                ))}
            </div>
            <p className="rb-anim-cap">Studio es tu taller, Luau el idioma. Publicas una vez y cualquiera puede jugar desde su celular o PC.</p>
        </div>
    );
}

/* --- 2. El Data Model: árbol de game --- */
function AnimDataModel() {
    const hijos = [
        { n: "Workspace", d: "lo que se ve en 3D" },
        { n: "Players", d: "los jugadores conectados" },
        { n: "ReplicatedStorage", d: "compartido server/cliente" },
        { n: "ServerScriptService", d: "scripts del servidor" },
    ];
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((s) => (s + 1) % (hijos.length + 1)), 850);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="rb-anim">
            <div className="rb-tree">
                <div className="rb-tree-root on">game</div>
                <div className="rb-tree-kids">
                    {hijos.map((h, idx) => (
                        <div key={idx} className={`rb-tree-kid ${idx < i ? "on" : ""}`}>
                            <span className="rb-tree-line" />
                            <div className="rb-tree-box">
                                <div className="rb-tree-n">{h.n}</div>
                                <div className="rb-tree-d">{h.d}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <p className="rb-anim-cap">Todo en Roblox cuelga de <code>game</code>. Cada servicio es una rama con un trabajo distinto.</p>
        </div>
    );
}

/* --- 3. Cliente / Servidor --- */
function AnimClientServer() {
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((s) => (s + 1) % 4), 950);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="rb-anim">
            <div className="rb-cs">
                <div className="rb-cs-clients">
                    <div className={`rb-cs-cli ${i >= 1 ? "on" : ""}`}>Cliente 1</div>
                    <div className={`rb-cs-cli ${i >= 2 ? "on" : ""}`}>Cliente 2</div>
                    <div className={`rb-cs-cli ${i >= 3 ? "on" : ""}`}>Cliente 3</div>
                </div>
                <span className={`rb-cs-link ${i >= 1 ? "on" : ""}`}>⇄</span>
                <div className="rb-cs-server on"><Server size={20} /><span>Servidor</span></div>
            </div>
            <p className="rb-anim-cap">El servidor manda y guarda la verdad del juego. Cada jugador tiene su propio cliente que solo ve y pide cosas.</p>
        </div>
    );
}

/* --- 4. RemoteEvent: flujo cliente -> servidor --- */
function AnimRemote() {
    const fases = ["Cliente: clic", "FireServer()", "RemoteEvent", "OnServerEvent", "Servidor coloca bloque"];
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((s) => (s + 1) % (fases.length + 1)), 800);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="rb-anim">
            <div className="rb-remote">
                {fases.map((f, idx) => (
                    <React.Fragment key={idx}>
                        <div className={`rb-remote-stage ${idx < i ? "on" : ""} ${idx === i - 1 ? "active" : ""}`}>{f}</div>
                        {idx < fases.length - 1 && <span className={`rb-remote-arrow ${idx < i - 1 ? "on" : ""}`}>▸</span>}
                    </React.Fragment>
                ))}
            </div>
            <p className="rb-anim-cap">El cliente nunca toca el mundo directo: le pide al servidor con un RemoteEvent y el servidor decide. Así nadie hace trampa.</p>
        </div>
    );
}

/* ====================================================================
   CONTENIDO — lecciones (teoría breve + 2 ejercicios c/u + quiz)
   ==================================================================== */
const L = [
    /* ===================== INTRODUCCIÓN ===================== */
    {
        id: "rb_intro", mod: "Introducción", icon: Sparkles, mins: "10 min",
        title: "¿Qué es Roblox Studio y por qué Luau?",
        intro: "Antes de escribir código conviene saber qué tienes entre manos: una de las plataformas con más jugadores del mundo y un lenguaje hecho para que tus juegos sean rápidos y seguros.",
        theory: [
            { anim: "ecosystem" },
            { p: "Roblox no es 'un juego': es una plataforma donde tú creas juegos (los llaman 'experiences') y millones de personas los juegan desde celular, PC, consola o VR. Tú construyes una vez y Roblox se encarga de distribuirlo." },
            { p: "Roblox Studio es el programa gratuito (Windows/Mac) donde armas tu mundo: pones piezas en 3D, escribes el código y pruebas el juego sin salir de ahí. Es editor de niveles, editor de código y servidor de pruebas, todo junto." },
            { h: "Luau: el lenguaje de Roblox" },
            { p: "Luau es la versión de Roblox del lenguaje Lua. Es ligero, fácil de leer y se diseñó para correr rápido en miles de jugadores a la vez. Si vienes de otros lenguajes, lo más raro al principio es que los índices de las listas empiezan en 1, no en 0." },
            { list: [
                    "Gratis: Studio y publicar no cuestan nada.",
                    "Multiplataforma: tu juego corre en celular y PC sin que hagas nada extra.",
                    "Multijugador de fábrica: la red servidor/cliente ya viene resuelta.",
                    "Economía propia: puedes ganar Robux y convertirlos a dinero real.",
                ] },
            { tip: { icon: "🎯", text: "Tu meta (un juego de construir estilo Minecraft + survival) es perfecta para Roblox: construir con bloques y mecánicas de supervivencia son justo el tipo de cosas que Luau y el sistema de Parts hacen fácil." } },
        ],
        practice: [
            { title: "Instala Studio y crea tu primer lugar", goal: "Deja listo el entorno para todo el curso.",
                steps: ["Entra a create.roblox.com y descarga Roblox Studio", "Inicia sesión con tu cuenta de Roblox", "Crea un lugar nuevo con la plantilla 'Baseplate'"],
                solution: `-- No es codigo: son pasos en Studio.
-- 1. create.roblox.com  ->  "Start Creating"  ->  descargar Studio
-- 2. Abrir Studio  ->  "New"  ->  plantilla "Baseplate"
-- 3. Boton "Play" (F5) para probar  ->  "Stop" (Shift+F5) para volver a editar
-- Ya tienes un piso, un personaje y el cielo. Eso es tu lienzo.`, file: "pasos.txt" },
            { title: "Tu primer print", goal: "Confirma que el código corre.",
                steps: ["En el Explorer, clic derecho en ServerScriptService -> Insert Object -> Script", "Borra lo que trae y escribe el print", "Play y revisa la ventana Output (View -> Output)"],
                solution: `print("Hola desde Luau, soy Gael")`, file: "Script.luau" },
        ],
        quiz: [
            { q: "¿Qué es Roblox Studio?", opts: ["Una consola de videojuegos", "El programa gratuito donde creas y pruebas tus juegos", "Una red social", "Un lenguaje de programación"], correct: 1, fb: "Studio es editor de niveles, de código y servidor de pruebas en uno solo." },
            { q: "¿En qué se basa Luau?", opts: ["En Python", "En el lenguaje Lua", "En JavaScript", "En C++"], correct: 1, fb: "Luau es la variante de Roblox del lenguaje Lua, optimizada para correr rápido." },
            { q: "¿Desde qué número empiezan los índices de una lista en Luau?", opts: ["Desde 0", "Desde 1", "Desde -1", "Depende"], correct: 1, fb: "Ojo: en Luau las listas empiezan en 1, no en 0 como en muchos lenguajes." },
        ],
    },

    /* ===================== LUAU ===================== */
    {
        id: "rb_vars", mod: "Luau", icon: Code2, mins: "20 min",
        title: "Variables, tipos y print",
        intro: "Las variables son cajitas donde guardas datos. Con saber cuatro tipos básicos ya puedes hacer casi todo en un juego.",
        theory: [
            { p: "Una variable se declara con la palabra local seguida de un nombre. Casi siempre vas a usar local: hace que la variable solo viva donde la necesitas y el juego corra más rápido." },
            { code: { file: "variables.luau", code: `local nombre = "Gael"      -- string (texto)
local vida = 100           -- number (numero)
local estaVivo = true      -- boolean (true/false)
local objetivo = nil       -- nil (vacio, "no hay nada")

print(nombre, vida, estaVivo)  -- imprime: Gael 100 true` } },
            { h: "Los 4 tipos que más usarás" },
            { table: { head: ["Tipo", "Para qué", "Ejemplo"], rows: [
                        ["string", "texto", '"madera", "menu"'],
                        ["number", "números (enteros o decimales)", "100, 3.5, -7"],
                        ["boolean", "verdadero o falso", "true, false"],
                        ["nil", "ausencia de valor", "nil"],
                    ] } },
            { p: "Para unir texto se usa dos puntos seguidos: .. (se llama concatenación). Y los comentarios empiezan con dos guiones --: el código los ignora, son notas para ti." },
            { code: { file: "concatenar.luau", code: `local jugador = "Gael"
local puntos = 50
-- unimos texto + numero con ..
print("El jugador " .. jugador .. " tiene " .. puntos .. " puntos")
-- imprime: El jugador Gael tiene 50 puntos` } },
            { tip: { icon: "💡", text: "Usa nombres claros: vidaJugador es mil veces mejor que v o x. En tres meses tú mismo agradecerás leer código que se entiende solo." } },
        ],
        practice: [
            { title: "La ficha del jugador", goal: "Crea variables para un personaje de tu juego de survival y muéstralas.",
                steps: ["Variables: nombre (string), vida (number), hambre (number), vivo (boolean)", "Imprime una línea legible con .."],
                solution: `local nombre = "Gael"
local vida = 100
local hambre = 80
local vivo = true

print(nombre .. " | Vida: " .. vida .. " | Hambre: " .. hambre .. " | Vivo: " .. tostring(vivo))
-- tostring() convierte el boolean a texto para poder unirlo`, file: "ficha.luau" },
            { title: "Cambia un valor", goal: "Simula que el jugador recibe daño.",
                steps: ["Parte de vida = 100", "Réstale 30 y vuelve a imprimir"],
                solution: `local vida = 100
print("Vida inicial: " .. vida)

vida = vida - 30   -- recibe 30 de dano
print("Despues del golpe: " .. vida)  -- 70`, file: "dano.luau" },
        ],
        quiz: [
            { q: "¿Qué palabra usas para declarar una variable normal?", opts: ["var", "let", "local", "dim"], correct: 2, fb: "local hace que la variable viva solo donde la necesitas y el juego sea más rápido." },
            { q: "¿Con qué se une (concatena) texto en Luau?", opts: ["El signo +", "Dos puntos seguidos ..", "El signo &", "La coma"], correct: 1, fb: 'El operador .. une textos: "Hola " .. nombre.' },
            { q: "¿Qué significa el valor nil?", opts: ["Cero", "Falso", "Que no hay ningún valor", "Un error"], correct: 2, fb: "nil representa la ausencia de valor: 'aquí no hay nada'." },
        ],
    },
    {
        id: "rb_tables", mod: "Luau", icon: Table2, mins: "30 min",
        title: "Tablas, bucles y condicionales",
        intro: "Las tablas son LA estructura de Luau: sirven como listas y como diccionarios. Con tablas + bucles + if armas el inventario, el mapa de bloques y casi todo lo demás.",
        theory: [
            { p: "Una tabla con corchetes {} puede ser una lista (valores en orden) o un diccionario (pares clave = valor). Recuerda: como lista, el primer elemento es el índice 1." },
            { code: { file: "tablas.luau", code: `-- como LISTA (inventario)
local inventario = {"madera", "piedra", "comida"}
print(inventario[1])   -- madera  (el primero es 1, no 0)
print(#inventario)     -- 3  (el # cuenta cuantos hay)

-- como DICCIONARIO (datos del jugador)
local jugador = {
  nombre = "Gael",
  vida = 100,
  nivel = 3,
}
print(jugador.nombre)  -- Gael
jugador.vida = 80      -- cambiar un campo` } },
            { h: "Recorrer con bucles" },
            { p: "Para repetir cosas usas for. Para listas, ipairs te da el índice y el valor. Un for numérico (for i = 1, 10) repite un número fijo de veces." },
            { code: { file: "bucles.luau", code: `local inventario = {"madera", "piedra", "comida"}

-- recorrer una lista
for indice, item in ipairs(inventario) do
  print(indice .. ": " .. item)
end

-- repetir N veces (colocar 5 bloques, por ejemplo)
for i = 1, 5 do
  print("Bloque numero " .. i)
end` } },
            { h: "Decidir con if" },
            { code: { file: "condicionales.luau", code: `local vida = 25

if vida <= 0 then
  print("Game over")
elseif vida < 30 then
  print("Cuidado, poca vida!")
else
  print("Todo bien")
end
-- imprime: Cuidado, poca vida!` } },
            { tip: { icon: "🧱", text: "En tu juego de bloques, todo el mundo puede ser una tabla: una lista de bloques colocados, cada uno con su posición y su tipo. Tablas dentro de tablas." } },
        ],
        practice: [
            { title: "Inventario con conteo", goal: "Usa una tabla diccionario para llevar cuántos bloques de cada tipo tiene el jugador.",
                steps: ["Tabla con madera, piedra, comida y su cantidad", "Recórrela con pairs e imprime cada una"],
                solution: `local inventario = {
  madera = 12,
  piedra = 5,
  comida = 3,
}

-- pairs sirve para diccionarios (clave, valor)
for tipo, cantidad in pairs(inventario) do
  print(tipo .. " x" .. cantidad)
end`, file: "inventario.luau" },
            { title: "Chequeo de supervivencia", goal: "Decide el estado del jugador según vida y hambre.",
                steps: ["Variables vida y hambre", "if/elseif/else que imprima el estado"],
                solution: `local vida = 100
local hambre = 15

if hambre <= 0 then
  print("Te estas muriendo de hambre, pierdes vida")
elseif hambre < 20 then
  print("Tienes mucha hambre, come algo")
elseif vida < 30 then
  print("Estas herido, busca un lugar seguro")
else
  print("Sobreviviendo sin problema")
end`, file: "survival.luau" },
        ],
        quiz: [
            { q: "¿Cómo cuentas cuántos elementos tiene una lista?", opts: ["count(lista)", "lista.length", "El operador #lista", "len(lista)"], correct: 2, fb: "#miLista devuelve la cantidad de elementos." },
            { q: "¿Qué bucle usas para recorrer una lista con índice y valor?", opts: ["for i in pairs", "for i, v in ipairs(lista)", "while lista", "foreach"], correct: 1, fb: "ipairs recorre listas en orden; pairs es para diccionarios." },
            { q: "¿Qué palabra cierra un bloque if en Luau?", opts: ["endif", "}", "end", "fi"], correct: 2, fb: "Casi todos los bloques en Luau (if, for, function) cierran con end." },
        ],
    },
    {
        id: "rb_func", mod: "Luau", icon: Zap, mins: "30 min",
        title: "Funciones y eventos",
        intro: "Una función es código que guardas con nombre para usarlo cuando quieras. Los eventos son funciones que Roblox dispara solo cuando pasa algo (un clic, un jugador entra, etc.). Esto es el corazón de la programación en juegos.",
        theory: [
            { anim: "remote" },
            { p: "Defines una función con function, le pones parámetros (datos que recibe) y opcionalmente devuelve un valor con return. Así no repites código." },
            { code: { file: "funciones.luau", code: `-- recibe dos numeros y devuelve el dano final
local function calcularDano(base, multiplicador)
  return base * multiplicador
end

local golpe = calcularDano(10, 1.5)
print(golpe)  -- 15

-- una funcion sin return, solo hace algo
local function saludar(nombre)
  print("Bienvenido, " .. nombre)
end

saludar("Gael")  -- Bienvenido, Gael` } },
            { h: "Eventos: reaccionar a lo que pasa" },
            { p: "Roblox dispara eventos todo el tiempo. Te 'conectas' a uno con :Connect(funcion). Cuando el evento ocurre, tu función corre. El parámetro suele traer info útil (qué jugador, qué objeto)." },
            { code: { file: "eventos.luau", code: `local Players = game:GetService("Players")

-- se ejecuta CADA VEZ que alguien entra al juego
Players.PlayerAdded:Connect(function(jugador)
  print(jugador.Name .. " entro al juego")
end)

-- detectar cuando tocan una pieza
local trampa = workspace.Trampa
trampa.Touched:Connect(function(parte)
  print("Algo toco la trampa: " .. parte.Name)
end)` } },
            { tip: { icon: "⚡", text: "Casi todo tu juego serán funciones conectadas a eventos: 'cuando el jugador hace clic, coloca un bloque', 'cuando toca lava, pierde vida'. Aprende bien :Connect y tienes el 70% ganado." } },
        ],
        practice: [
            { title: "Función de daño con tope", goal: "La vida nunca debe bajar de 0.",
                steps: ["Función que recibe vida y daño", "Resta, pero usa math.max para no pasar de 0", "Devuelve la vida nueva"],
                solution: `local function recibirDano(vida, dano)
  local nueva = vida - dano
  -- math.max devuelve el mayor: nunca menos de 0
  return math.max(0, nueva)
end

print(recibirDano(100, 30))  -- 70
print(recibirDano(20, 50))   -- 0  (no -30)`, file: "dano.luau" },
            { title: "Saludo al entrar", goal: "Conéctate al evento de jugador que entra y salúdalo por su nombre.",
                steps: ["GetService('Players')", "Conéctate a PlayerAdded", "Imprime un saludo con jugador.Name"],
                solution: `local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(jugador)
  print("Hola " .. jugador.Name .. ", sobrevive lo que puedas!")
end)`, file: "bienvenida.luau" },
        ],
        quiz: [
            { q: "¿Para qué sirve return en una función?", opts: ["Para imprimir", "Para devolver un valor a quien la llamó", "Para terminar el juego", "Para crear una variable"], correct: 1, fb: "return entrega un resultado que puedes guardar o usar." },
            { q: "¿Cómo reaccionas a que un jugador entre al juego?", opts: ["con un for", "Players.PlayerAdded:Connect(...)", "con un if", "game.start()"], correct: 1, fb: ":Connect engancha tu función al evento PlayerAdded." },
            { q: "¿Qué hace math.max(0, vida)?", opts: ["Multiplica", "Devuelve el mayor de los dos, evitando negativos", "Redondea", "Da un número al azar"], correct: 1, fb: "math.max(0, x) nunca deja que el resultado baje de 0." },
        ],
    },

    /* ===================== STUDIO ===================== */
    {
        id: "rb_datamodel", mod: "Studio", icon: Boxes, mins: "25 min",
        title: "El Data Model: game, Workspace y Services",
        intro: "Todo lo que existe en tu juego vive en un árbol que cuelga de game. Entender este árbol es entender dónde poner cada cosa y cómo encontrarla desde el código.",
        theory: [
            { anim: "datamodel" },
            { p: "El objeto raíz se llama game. De él cuelgan los Services (servicios), cada uno con un rol. A los servicios los pides con game:GetService('Nombre')." },
            { table: { head: ["Servicio", "Qué guarda"], rows: [
                        ["Workspace", "todo lo físico que se ve en 3D (Parts, modelos, el mapa)"],
                        ["Players", "cada jugador conectado"],
                        ["ReplicatedStorage", "cosas que ven servidor Y clientes (RemoteEvents, módulos)"],
                        ["ServerScriptService", "scripts del servidor (el jugador no los ve)"],
                        ["StarterGui", "la interfaz que recibe cada jugador"],
                    ] } },
            { p: "Todo dentro del árbol es un Instance (una instancia). Cada Instance tiene un Name, un Parent (su padre en el árbol) y propiedades. Navegas con punto: workspace.Casa.Puerta llega a la Puerta dentro de Casa." },
            { code: { file: "navegar.luau", code: `-- pedir servicios
local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")

-- llegar a un objeto del Workspace por su nombre
local piso = workspace.Baseplate
print(piso.Name)        -- Baseplate
print(piso.Parent.Name) -- Workspace

-- WaitForChild: espera a que el objeto exista (mas seguro)
local mapa = workspace:WaitForChild("Mapa")` } },
            { tip: { icon: "🌳", text: "Usa :WaitForChild('Nombre') en vez de .Nombre cuando el objeto puede tardar en cargar (sobre todo del lado del cliente). Evita el clásico error 'X is not a valid member of Y'." } },
        ],
        practice: [
            { title: "Explora el árbol", goal: "Imprime el nombre de los hijos del Workspace.",
                steps: ["GetChildren() devuelve una lista de los hijos", "Recórrela con ipairs e imprime cada Name"],
                solution: `for _, hijo in ipairs(workspace:GetChildren()) do
  print(hijo.Name)
end
-- _ es "no me importa el indice"; solo quiero el valor`, file: "explorar.luau" },
            { title: "Cuenta jugadores", goal: "Muestra cuántos jugadores hay conectados.",
                steps: ["GetService('Players')", "GetPlayers() da la lista", "Imprime cuántos con #"],
                solution: `local Players = game:GetService("Players")
local lista = Players:GetPlayers()
print("Jugadores conectados: " .. #lista)`, file: "contar.luau" },
        ],
        quiz: [
            { q: "¿De qué objeto cuelga todo en Roblox?", opts: ["workspace", "game", "script", "Players"], correct: 1, fb: "game es la raíz; los servicios cuelgan de él." },
            { q: "¿Dónde pones lo físico que se ve en 3D?", opts: ["ServerScriptService", "Workspace", "ReplicatedStorage", "StarterGui"], correct: 1, fb: "El Workspace contiene todo lo visible: Parts, modelos, el mapa." },
            { q: "¿Para qué sirve :WaitForChild('X')?", opts: ["Crea X", "Espera a que X exista antes de usarlo", "Borra X", "Renombra X"], correct: 1, fb: "Evita errores cuando el objeto todavía no terminó de cargar." },
        ],
    },
    {
        id: "rb_parts", mod: "Studio", icon: Box, mins: "30 min",
        title: "Crear y manipular Parts por código",
        intro: "Una Part es un bloque: la pieza básica de todo en Roblox. Vas a aprender a crearlas desde el código, que es justo lo que necesita un juego de construcción.",
        theory: [
            { p: "Creas cualquier objeto con Instance.new('Tipo'). Para que aparezca en el mundo, hay que ponerle Parent = workspace. Mientras no tenga Parent, existe pero nadie lo ve." },
            { code: { file: "crear_part.luau", code: `local bloque = Instance.new("Part")
bloque.Size = Vector3.new(4, 4, 4)        -- 4x4x4 studs
bloque.Position = Vector3.new(0, 10, 0)   -- x, y, z (y es altura)
bloque.Anchored = true                    -- no se cae con la gravedad
bloque.BrickColor = BrickColor.new("Bright green")
bloque.Material = Enum.Material.Wood
bloque.Parent = workspace                 -- ahora SI aparece` } },
            { h: "Propiedades clave de una Part" },
            { table: { head: ["Propiedad", "Qué controla"], rows: [
                        ["Size", "tamaño (Vector3)"],
                        ["Position", "dónde está (Vector3: x, y, z)"],
                        ["Anchored", "true = fija en el aire; false = le afecta la gravedad"],
                        ["BrickColor / Color", "color"],
                        ["Material", "madera, piedra, neón, etc."],
                        ["Transparency", "0 = sólido, 1 = invisible"],
                    ] } },
            { p: "Vector3 representa un punto o tamaño en 3D: Vector3.new(x, y, z). El eje Y es la altura. Súbele la Y a un bloque para que flote más alto." },
            { tip: { icon: "🧱", text: "Para tu juego estilo Minecraft: si los bloques siempre miden 4x4x4 y los colocas en posiciones múltiplos de 4, encajan en una cuadrícula perfecta. Ese truco (la grilla) es lo que hace que se vea ordenado." } },
        ],
        practice: [
            { title: "Genera una torre de bloques", goal: "Crea 5 bloques apilados con un bucle.",
                steps: ["for i = 1, 5", "Cada bloque sube 4 studs en Y respecto al anterior", "Anchored = true para que no se caigan"],
                solution: `for i = 1, 5 do
  local bloque = Instance.new("Part")
  bloque.Size = Vector3.new(4, 4, 4)
  -- i*4 sube cada bloque encima del anterior
  bloque.Position = Vector3.new(0, i * 4, 0)
  bloque.Anchored = true
  bloque.BrickColor = BrickColor.new("Brown")
  bloque.Material = Enum.Material.Wood
  bloque.Parent = workspace
end`, file: "torre.luau" },
            { title: "Función colocarBloque", goal: "Una función reutilizable que crea un bloque en una posición y color dados.",
                steps: ["Parámetros: posición (Vector3) y color (string)", "Crea la Part con esos valores", "Devuélvela por si la necesitas"],
                solution: `local function colocarBloque(posicion, color)
  local b = Instance.new("Part")
  b.Size = Vector3.new(4, 4, 4)
  b.Position = posicion
  b.Anchored = true
  b.BrickColor = BrickColor.new(color)
  b.Parent = workspace
  return b
end

-- usarla:
colocarBloque(Vector3.new(0, 4, 0), "Bright blue")
colocarBloque(Vector3.new(4, 4, 0), "Bright red")`, file: "colocar.luau" },
        ],
        quiz: [
            { q: "¿Con qué creas un objeto nuevo desde código?", opts: ["new Part()", "Instance.new('Part')", "create('Part')", "Part.new()"], correct: 1, fb: "Instance.new('Tipo') crea cualquier objeto de Roblox." },
            { q: "¿Qué falta para que una Part recién creada se vea?", opts: ["Darle un Name", "Asignarle Parent = workspace", "Ponerle color", "Nada, ya se ve"], correct: 1, fb: "Sin Parent, el objeto existe pero no está en el mundo." },
            { q: "¿Qué hace Anchored = true?", opts: ["La hace invisible", "Evita que la gravedad la mueva o tire", "La borra", "La hace más grande"], correct: 1, fb: "Anchored la fija en su lugar, ignorando la física." },
        ],
    },

    /* ===================== CLIENTE Y SERVIDOR ===================== */
    {
        id: "rb_clientserver", mod: "Cliente y Servidor", icon: Network, mins: "25 min",
        title: "Script vs LocalScript: servidor y cliente",
        intro: "Este es el concepto que separa a un principiante de alguien que sabe hacer juegos multijugador. Hay dos lados: el servidor (uno, manda) y los clientes (uno por jugador). Dónde corre tu código lo cambia todo.",
        theory: [
            { anim: "clientserver" },
            { p: "El servidor es una computadora de Roblox que tiene la 'verdad' del juego: las vidas reales, el mapa, las puntuaciones. Cada jugador tiene su cliente (su celular o PC) que muestra el juego y manda peticiones." },
            { h: "Dos tipos de script" },
            { table: { head: ["Tipo", "Dónde corre", "Dónde va"], rows: [
                        ["Script", "en el SERVIDOR", "ServerScriptService, Workspace"],
                        ["LocalScript", "en el CLIENTE (un jugador)", "StarterPlayerScripts, StarterGui"],
                    ] } },
            { p: "Regla de oro: lo importante (vida, daño, dar objetos, guardar datos) va en el SERVIDOR con un Script. La interfaz, detectar el clic del mouse o el input del teclado va en el CLIENTE con un LocalScript." },
            { code: { file: "donde_corre.luau", code: `-- Script (servidor): da la verdad
-- archivo en ServerScriptService
local Players = game:GetService("Players")
Players.PlayerAdded:Connect(function(jugador)
  print(jugador.Name .. " entro (esto lo ve el servidor)")
end)

-- LocalScript (cliente): solo este jugador
-- archivo en StarterPlayerScripts
local jugadorLocal = game.Players.LocalPlayer
print("Soy " .. jugadorLocal.Name .. " y esto corre en MI cliente")` } },
            { tip: { icon: "🛡️", text: "¿Por qué importa? Si dejas que el cliente decida cuánta vida tiene, un tramposo puede ponerse vida infinita. Si lo decide el servidor, no puede. Por eso la lógica seria SIEMPRE va en el servidor." } },
        ],
        practice: [
            { title: "¿Servidor o cliente?", goal: "Clasifica estas tareas y justifica.",
                steps: ["Tareas: a) restar vida al recibir daño, b) detectar el clic del mouse, c) guardar el progreso, d) mover la cámara del jugador"],
                solution: `a) Restar vida          -> SERVIDOR (es la verdad, evita trampas)
b) Detectar clic mouse  -> CLIENTE  (el input vive en cada jugador)
c) Guardar progreso     -> SERVIDOR (solo el servidor toca DataStore)
d) Mover la camara      -> CLIENTE  (es cosa visual de ese jugador)

Regla: lo que afecta a todos -> servidor.
       lo que es solo "lo que veo/toco yo" -> cliente.`, file: "respuesta.txt" },
            { title: "LocalPlayer", goal: "Desde un LocalScript, imprime el nombre del jugador local.",
                steps: ["game.Players.LocalPlayer solo existe en LocalScripts", "Imprime su Name"],
                solution: `-- esto va en un LocalScript (ej. StarterPlayerScripts)
local jugador = game.Players.LocalPlayer
print("Mi nombre es: " .. jugador.Name)`, file: "LocalScript.luau" },
        ],
        quiz: [
            { q: "¿Dónde debe correr la lógica de la vida y el daño?", opts: ["En el cliente", "En el servidor", "En los dos", "En el StarterGui"], correct: 1, fb: "En el servidor, para que un tramposo no pueda alterarla." },
            { q: "¿Qué script corre en el cliente de cada jugador?", opts: ["Script", "LocalScript", "ModuleScript", "ServerScript"], correct: 1, fb: "El LocalScript corre del lado del cliente." },
            { q: "¿Dónde existe game.Players.LocalPlayer?", opts: ["En cualquier Script", "Solo en LocalScripts (lado cliente)", "En el servidor", "En ReplicatedStorage"], correct: 1, fb: "LocalPlayer solo tiene sentido en el cliente del jugador." },
        ],
    },
    {
        id: "rb_remote", mod: "Cliente y Servidor", icon: Send, mins: "30 min",
        title: "RemoteEvents: comunicación segura",
        intro: "El cliente y el servidor no pueden hablarse directo. El puente entre ellos es el RemoteEvent. Esto es lo que te permite que un clic del jugador (cliente) coloque un bloque real (servidor).",
        theory: [
            { anim: "remote" },
            { p: "Un RemoteEvent es un objeto que pones en ReplicatedStorage (lo ven ambos lados). El cliente lo dispara con :FireServer(...) y el servidor escucha con .OnServerEvent:Connect(...). El servidor recibe automáticamente quién lo disparó." },
            { code: { file: "cliente.luau", code: `-- LADO CLIENTE (LocalScript)
local RS = game:GetService("ReplicatedStorage")
local colocarRemote = RS:WaitForChild("ColocarBloque")

-- cuando el jugador hace clic, AVISA al servidor
local mouse = game.Players.LocalPlayer:GetMouse()
mouse.Button1Down:Connect(function()
  -- le mando al servidor la posicion donde apunta el mouse
  colocarRemote:FireServer(mouse.Hit.Position)
end)` } },
            { code: { file: "servidor.luau", code: `-- LADO SERVIDOR (Script en ServerScriptService)
local RS = game:GetService("ReplicatedStorage")
local colocarRemote = RS:WaitForChild("ColocarBloque")

-- el primer parametro SIEMPRE es el jugador que disparo
colocarRemote.OnServerEvent:Connect(function(jugador, posicion)
  local b = Instance.new("Part")
  b.Size = Vector3.new(4, 4, 4)
  b.Position = posicion
  b.Anchored = true
  b.Parent = workspace
  print(jugador.Name .. " coloco un bloque")
end)` } },
            { tip: { icon: "⚠️", text: "NUNCA confíes ciegamente en lo que manda el cliente. Un tramposo puede enviar cualquier cosa por FireServer. En el servidor valida: ¿la posición está cerca del jugador? ¿tiene materiales? Si no validas, te hackean el juego." } },
        ],
        practice: [
            { title: "Prepara el RemoteEvent", goal: "Deja listo el objeto puente antes de usarlo.",
                steps: ["En el Explorer: clic derecho en ReplicatedStorage", "Insert Object -> RemoteEvent", "Renómbralo a 'ColocarBloque'"],
                solution: `-- Esto se hace en el Explorer, no por codigo, pero
-- tambien puedes crearlo asi en un Script del servidor:
local RS = game:GetService("ReplicatedStorage")
local remote = Instance.new("RemoteEvent")
remote.Name = "ColocarBloque"
remote.Parent = RS`, file: "setup.luau" },
            { title: "Validación básica en el servidor", goal: "Rechaza posiciones demasiado lejos del jugador (anti-trampa).",
                steps: ["En OnServerEvent recibe jugador y posición", "Calcula la distancia al personaje", "Si pasa de 50 studs, ignóralo"],
                solution: `colocarRemote.OnServerEvent:Connect(function(jugador, posicion)
  local char = jugador.Character
  if not char then return end
  local raiz = char:FindFirstChild("HumanoidRootPart")
  if not raiz then return end

  -- distancia entre el jugador y donde quiere construir
  local dist = (raiz.Position - posicion).Magnitude
  if dist > 50 then
    return  -- demasiado lejos: posible trampa, ignorar
  end

  local b = Instance.new("Part")
  b.Size = Vector3.new(4, 4, 4)
  b.Position = posicion
  b.Anchored = true
  b.Parent = workspace
end)`, file: "validacion.luau" },
        ],
        quiz: [
            { q: "¿Dónde se suele guardar un RemoteEvent?", opts: ["Workspace", "ReplicatedStorage", "StarterGui", "ServerStorage"], correct: 1, fb: "En ReplicatedStorage, porque cliente y servidor lo necesitan ver." },
            { q: "¿Con qué dispara el cliente un RemoteEvent?", opts: [":OnServerEvent", ":FireServer(...)", ":Connect()", ":Invoke()"], correct: 1, fb: "El cliente usa :FireServer(); el servidor escucha con .OnServerEvent." },
            { q: "¿Cuál es el primer parámetro que recibe OnServerEvent?", opts: ["La posición", "El jugador que lo disparó", "El RemoteEvent", "nil"], correct: 1, fb: "Roblox pasa automáticamente el jugador como primer argumento." },
        ],
    },

    /* ===================== TU PRIMER JUEGO ===================== */
    {
        id: "rb_juego", mod: "Tu primer juego", icon: Blocks, mins: "45 min",
        title: "Construir estilo Minecraft + survival",
        intro: "Juntamos todo: bloques en una grilla (construir), vida y hambre que bajan con el tiempo (survival) y RemoteEvents para que sea seguro. Este es el esqueleto de TU juego.",
        theory: [
            { p: "La idea: el cliente detecta dónde apunta el mouse y avisa al servidor; el servidor 'redondea' la posición a una cuadrícula de 4 studs y coloca el bloque ahí. Así todo encaja como en Minecraft." },
            { code: { file: "grilla.luau", code: `-- redondea una posicion a la grilla de 4 studs
local GRID = 4
local function alaGrilla(pos)
  return Vector3.new(
    math.round(pos.X / GRID) * GRID,
    math.round(pos.Y / GRID) * GRID,
    math.round(pos.Z / GRID) * GRID
  )
end` } },
            { h: "El servidor: colocar en la grilla" },
            { code: { file: "construir_servidor.luau", code: `local RS = game:GetService("ReplicatedStorage")
local remote = RS:WaitForChild("ColocarBloque")
local GRID = 4

local function alaGrilla(pos)
  return Vector3.new(
    math.round(pos.X / GRID) * GRID,
    math.round(pos.Y / GRID) * GRID,
    math.round(pos.Z / GRID) * GRID
  )
end

remote.OnServerEvent:Connect(function(jugador, posCruda)
  local pos = alaGrilla(posCruda)
  local b = Instance.new("Part")
  b.Size = Vector3.new(GRID, GRID, GRID)
  b.Position = pos
  b.Anchored = true
  b.Material = Enum.Material.Wood
  b.BrickColor = BrickColor.new("Brown")
  b.Parent = workspace
end)` } },
            { h: "Survival: vida y hambre que bajan" },
            { p: "Usamos un bucle con task.wait(): cada cierto tiempo le baja el hambre al jugador, y si el hambre llega a 0, empieza a perder vida. Esto corre en el servidor." },
            { code: { file: "survival_servidor.luau", code: `local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(jugador)
  jugador.CharacterAdded:Connect(function(char)
    local humanoid = char:WaitForChild("Humanoid")
    local hambre = 100

    -- bucle de supervivencia
    task.spawn(function()
      while humanoid.Health > 0 do
        task.wait(3)              -- cada 3 segundos
        hambre = math.max(0, hambre - 5)
        if hambre <= 0 then
          humanoid.Health -= 2    -- sin comida, pierdes vida
        end
        print(jugador.Name .. " hambre: " .. hambre)
      end
    end)
  end)
end)` } },
            { tip: { icon: "🚀", text: "Este esqueleto ya es jugable. A partir de aquí solo agregas capas: tipos de bloque, comida que sube el hambre, enemigos de noche, guardar el mundo con DataStore. Empieza simple y crece." } },
        ],
        practice: [
            { title: "Comida que cura el hambre", goal: "Crea un RemoteEvent 'Comer' que suba el hambre.",
                steps: ["El cliente dispara Comer cuando el jugador come", "El servidor sube el hambre con tope de 100", "Como hambre vive en el survival, exponla o usa un atributo"],
                solution: `-- En el servidor, usando un Atributo del jugador para el hambre:
local Players = game:GetService("Players")
local RS = game:GetService("ReplicatedStorage")
local comer = RS:WaitForChild("Comer")

Players.PlayerAdded:Connect(function(jugador)
  jugador:SetAttribute("Hambre", 100)
end)

comer.OnServerEvent:Connect(function(jugador, cuanto)
  local actual = jugador:GetAttribute("Hambre") or 0
  -- math.min mantiene el tope en 100
  jugador:SetAttribute("Hambre", math.min(100, actual + cuanto))
  print(jugador.Name .. " comio, hambre: " .. jugador:GetAttribute("Hambre"))
end)`, file: "comer.luau" },
            { title: "Romper bloques", goal: "Un RemoteEvent 'Romper' que destruye el bloque que el jugador toca.",
                steps: ["El cliente manda el bloque apuntado", "El servidor valida que sea una Part del workspace", "Lo destruye con :Destroy()"],
                solution: `local RS = game:GetService("ReplicatedStorage")
local romper = RS:WaitForChild("Romper")

romper.OnServerEvent:Connect(function(jugador, objetivo)
  -- valida: que exista, sea Part y este en el workspace
  if objetivo and objetivo:IsA("Part") and objetivo.Parent == workspace then
    -- no dejes romper el piso base
    if objetivo.Name ~= "Baseplate" then
      objetivo:Destroy()
    end
  end
end)`, file: "romper.luau" },
        ],
        quiz: [
            { q: "¿Para qué redondeamos la posición a una grilla?", opts: ["Para que el juego corra más rápido", "Para que los bloques encajen ordenados como en Minecraft", "Para gastar menos memoria", "Por seguridad"], correct: 1, fb: "Redondear a múltiplos de 4 hace que los bloques formen una cuadrícula perfecta." },
            { q: "¿Qué usas para pausar dentro de un bucle del servidor?", opts: ["sleep()", "task.wait(segundos)", "delay()", "pause()"], correct: 1, fb: "task.wait(n) espera n segundos sin congelar el juego." },
            { q: "¿Por qué validar el objetivo antes de :Destroy()?", opts: ["Por estética", "Para que un tramposo no destruya cosas que no debe", "Para ir más rápido", "No hace falta"], correct: 1, fb: "Validar en el servidor evita que el cliente borre lo que quiera." },
        ],
    },
    {
        id: "rb_publicar", mod: "Tu primer juego", icon: Globe, mins: "20 min",
        title: "Publicar y monetizar",
        intro: "Ya tienes juego: ahora hay que sacarlo al mundo y, si quieres, ganar Robux. Publicar es gratis y toma un par de clics.",
        theory: [
            { p: "Para publicar: en Studio vas a File -> Publish to Roblox. Le pones nombre, descripción y un ícono. Luego en la web (create.roblox.com) cambias el juego a público para que cualquiera entre." },
            { h: "Formas de ganar Robux" },
            { table: { head: ["Método", "Qué es"], rows: [
                        ["Game Pass", "compra única que da un beneficio permanente (ej: skin, doble salto)"],
                        ["Developer Product", "se compra muchas veces (ej: 100 monedas, revivir)"],
                        ["Premium Payouts", "Roblox te paga según el tiempo que juegan usuarios Premium"],
                    ] } },
            { p: "Para cobrar un Developer Product desde código se usa MarketplaceService. El servidor le pide a Roblox que muestre la ventana de compra al jugador." },
            { code: { file: "comprar.luau", code: `local MPS = game:GetService("MarketplaceService")

-- ID del producto que creaste en la web del juego
local PRODUCTO_MONEDAS = 123456789

-- pedir al jugador que compre (desde el servidor)
local function venderMonedas(jugador)
  MPS:PromptProductPurchase(jugador, PRODUCTO_MONEDAS)
end

-- cuando la compra se completa, entrega el premio
MPS.ProcessReceipt = function(info)
  local jugador = game.Players:GetPlayerByUserId(info.PlayerId)
  if jugador and info.ProductId == PRODUCTO_MONEDAS then
    -- aqui le das sus monedas...
    print(jugador.Name .. " compro monedas")
    return Enum.ProductPurchaseDecision.PurchaseGranted
  end
  return Enum.ProductPurchaseDecision.NotProcessedYet
end` } },
            { tip: { icon: "💰", text: "No metas monetización el día uno. Primero haz que el juego sea divertido y que la gente se quede. Cuando tengas jugadores, agregar un Game Pass o producto toma 10 minutos. La diversión primero, los Robux después." } },
        ],
        practice: [
            { title: "Checklist de publicación", goal: "Deja tu juego listo para que otros entren.",
                steps: ["Publica con File -> Publish to Roblox", "En create.roblox.com pon el juego en 'Public'", "Pruébalo desde la app de Roblox con tu cuenta"],
                solution: `1. Studio  ->  File  ->  Publish to Roblox  ->  nombre + icono
2. create.roblox.com  ->  tu juego  ->  Configure  ->  Permissions: Public
3. Abre Roblox (app/web), busca tu juego y entra como jugador normal
4. Comparte el link con amigos para probar el multijugador real`, file: "checklist.txt" },
            { title: "Idea de Game Pass", goal: "Diseña un Game Pass que tenga sentido para un juego de survival.",
                steps: ["Escribe qué da, por qué alguien lo compraría, y por qué NO rompe el balance"],
                solution: `Game Pass: "Mochila grande"
- Da: +20 espacios de inventario permanentes.
- Por que se compra: comodidad, no tener que tirar materiales.
- Por que NO rompe el balance: no da poder de combate ni recursos
  gratis, solo conveniencia. El que no paga sigue jugando bien.

Regla de oro: vende COMODIDAD y ESTETICA, no VICTORIAS.
"Pay to win" espanta jugadores; "pay for comfort" los mantiene.`, file: "gamepass.txt" },
        ],
        quiz: [
            { q: "¿Cuánto cuesta publicar un juego en Roblox?", opts: ["10 USD", "Es gratis", "100 Robux", "Una suscripción"], correct: 1, fb: "Publicar es gratis; Roblox gana una comisión solo si tú vendes algo." },
            { q: "¿Qué servicio usas para cobrar compras dentro del juego?", opts: ["DataStoreService", "MarketplaceService", "Players", "HttpService"], correct: 1, fb: "MarketplaceService maneja Game Passes y Developer Products." },
            { q: "¿Cuál es el mejor enfoque de monetización para empezar?", opts: ["Vender victorias (pay to win)", "Vender comodidad y estética sin romper el balance", "Cobrar por entrar", "No publicar hasta tenerlo perfecto"], correct: 1, fb: "Pay-to-win ahuyenta jugadores; la comodidad y la estética los retienen." },
        ],
    },
];

const MODS = [
    { name: "Introducción", sub: "Qué es Roblox y Luau", icon: Sparkles, color: "#ff4d4d" },
    { name: "Luau", sub: "El lenguaje, de cero", icon: Code2, color: "#00a3ff" },
    { name: "Studio", sub: "El editor y el Data Model", icon: Boxes, color: "#00cf6a" },
    { name: "Cliente y Servidor", sub: "Multijugador seguro", icon: Network, color: "#b15dff" },
    { name: "Tu primer juego", sub: "Construir + survival + publicar", icon: Blocks, color: "#ffb02e" },
];

const RANKS = [
    { min: 0, name: "Novato" },
    { min: 300, name: "Builder" },
    { min: 700, name: "Scripter" },
    { min: 1100, name: "Game Dev" },
    { min: 1600, name: "Roblox Pro" },
];
const rankFor = (xp) => RANKS.filter((r) => xp >= r.min).pop();
const loadSave = () => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } };

/* ---------- componentes de UI ---------- */
function CodeBlock({ code, file }) {
    return (
        <div className="rb-term">
            <div className="rb-term-h">
                <span className="d r" /><span className="d y" /><span className="d g" />
                {file && <span className="rb-file">{file}</span>}
            </div>
            <pre>{code.split("\n").map((line, i) => {
                // comentarios de Luau: empiezan con --
                const ci = line.indexOf("--");
                if (ci >= 0) {
                    return <div key={i}><span>{line.slice(0, ci)}</span><span className="cmt">{line.slice(ci)}</span></div>;
                }
                return <div key={i}>{line || "\u00A0"}</div>;
            })}</pre>
        </div>
    );
}

const ANIM_MAP = {
    ecosystem: AnimEcosystem,
    datamodel: AnimDataModel,
    clientserver: AnimClientServer,
    remote: AnimRemote,
};

function Theory({ blocks }) {
    return blocks.map((b, i) => {
        if (b.p) return <p key={i} className="rb-p">{b.p}</p>;
        if (b.h) return <h3 key={i} className="rb-h3">{b.h}</h3>;
        if (b.code) return <CodeBlock key={i} {...b.code} />;
        if (b.anim) {
            const Comp = ANIM_MAP[b.anim];
            return Comp ? <Comp key={i} /> : null;
        }
        if (b.tip) return (
            <div key={i} className="rb-tip"><span className="rb-tip-i">{b.tip.icon}</span><span>{b.tip.text}</span></div>
        );
        if (b.list) return (
            <ul key={i} className="rb-list">{b.list.map((x, j) => <li key={j}>{x}</li>)}</ul>
        );
        if (b.table) return (
            <div key={i} className="rb-tablewrap"><table className="rb-table">
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
        <div className="rb-ex">
            <div className="rb-ex-top"><span className="rb-ex-n">{n}</span><strong>{ex.title}</strong></div>
            <p className="rb-ex-goal">{ex.goal}</p>
            {ex.steps && <ul className="rb-steps">{ex.steps.map((s, i) => <li key={i}>{s}</li>)}</ul>}
            <button className="rb-reveal" onClick={() => setOpen((o) => !o)}>
                {open ? <EyeOff size={13} /> : <Eye size={13} />} {open ? "Ocultar solución" : "Ver solución"}
            </button>
            {open && <CodeBlock code={ex.solution} file={ex.file || "Script.luau"} />}
        </div>
    );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
.rb{ min-height:100vh; width:100%; font-family:'Space Grotesk',system-ui,sans-serif; color:#1a1d2e;
  background:
    radial-gradient(720px 480px at 8% -8%, rgba(255,77,77,.20), transparent 60%),
    radial-gradient(680px 460px at 95% 0%, rgba(0,163,255,.20), transparent 60%),
    radial-gradient(700px 520px at 100% 100%, rgba(177,93,255,.18), transparent 60%),
    radial-gradient(720px 520px at 0% 100%, rgba(0,207,106,.16), transparent 60%),
    radial-gradient(600px 420px at 50% 50%, rgba(255,176,46,.10), transparent 70%),
    #eef1fb; }
.rb *{ box-sizing:border-box; }
.rb-wrap{ max-width:880px; margin:0 auto; padding:38px 22px 90px; }
.rb-head{ text-align:center; margin-bottom:8px; }
.rb-kick{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:4px; color:#6b73a0; }
.rb-title{ font-family:'Baloo 2',system-ui,sans-serif; font-size:48px; font-weight:800; letter-spacing:-1px; margin:6px 0; color:#1a1d2e; }
.rb-title b{ font-weight:800;
  background:linear-gradient(90deg,#ff4d4d,#ffb02e,#00cf6a,#00a3ff,#b15dff);
  -webkit-background-clip:text; background-clip:text; color:transparent; }
.rb-sub{ color:#535a82; font-size:15px; max-width:580px; margin:0 auto; }
.rb-rank{ display:flex; gap:14px; align-items:center; justify-content:center; margin:22px auto; flex-wrap:wrap; }
.rb-rbox{ display:flex; align-items:center; gap:10px; border:2px solid #fff; background:#fff; border-radius:16px; padding:10px 16px;
  box-shadow:0 8px 22px rgba(60,70,140,.12); }
.rb-rl{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:2px; color:#8a90b8; }
.rb-rn{ font-size:17px; font-weight:700; font-family:'Baloo 2',sans-serif; color:#1a1d2e; }
.rb-bar{ width:200px; height:12px; border-radius:99px; background:#fff; border:2px solid #fff; overflow:hidden; box-shadow:0 4px 12px rgba(60,70,140,.12); }
.rb-bar i{ display:block; height:100%; border-radius:99px;
  background:linear-gradient(90deg,#ff4d4d,#ffb02e,#00cf6a,#00a3ff,#b15dff); transition:width .6s; }
.rb-modh{ font-family:'Baloo 2',sans-serif; font-size:15px; letter-spacing:.3px; color:var(--mc,#ff4d4d);
  margin:32px 0 12px; display:flex; align-items:center; gap:9px; font-weight:700; }
.rb-modh .ms{ color:#8a90b8; letter-spacing:0; font-size:13px; font-weight:500; font-family:'Space Grotesk',sans-serif; }
.rb-list-lessons{ display:flex; flex-direction:column; gap:11px; }
.rb-lcard{ display:flex; align-items:center; gap:15px; cursor:pointer; border:2px solid #fff; border-radius:18px;
  padding:15px 17px; background:#fff; transition:.16s; text-align:left; width:100%; color:inherit; font-family:inherit;
  box-shadow:0 6px 18px rgba(60,70,140,.08); border-left:6px solid var(--mc,#ff4d4d); }
.rb-lcard:hover{ transform:translateY(-3px); box-shadow:0 12px 26px rgba(60,70,140,.16); }
.rb-lico{ width:46px; height:46px; border-radius:14px; flex:none; display:grid; place-items:center;
  background:var(--mc,#ff4d4d); color:#fff; box-shadow:0 6px 14px color-mix(in srgb, var(--mc,#ff4d4d) 40%, transparent); }
.rb-lcard.done .rb-lico{ background:#00cf6a; box-shadow:0 6px 14px rgba(0,207,106,.4); }
.rb-lm{ flex:1; min-width:0; }
.rb-lt{ font-size:16px; font-weight:700; font-family:'Baloo 2',sans-serif; color:#1a1d2e; }
.rb-li{ font-size:13px; color:#6b73a0; margin-top:1px; }
.rb-lmeta{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#8a90b8; flex:none; }
.rb-back{ display:inline-flex; align-items:center; gap:6px; background:none; border:none; color:#6b73a0;
  font-family:'JetBrains Mono',monospace; font-size:12px; cursor:pointer; padding:6px 0; margin-bottom:6px; }
.rb-back:hover{ color:var(--mc,#ff4d4d); }
.rb-lhead h2{ font-family:'Baloo 2',sans-serif; font-size:31px; font-weight:800; letter-spacing:-.5px; margin:4px 0 8px; color:#1a1d2e; }
.rb-badge{ display:inline-block; font-family:'JetBrains Mono',monospace; font-size:11px; color:#fff;
  background:var(--mc,#ff4d4d); padding:4px 12px; border-radius:99px; font-weight:600; }
.rb-intro{ background:#fff; border-left:6px solid var(--mc,#ff4d4d); border-radius:6px 16px 16px 6px;
  padding:15px 18px; margin:16px 0; color:#3a4066; font-size:15px; line-height:1.6; box-shadow:0 6px 18px rgba(60,70,140,.08); }
.rb-secl{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:var(--mc,#ff4d4d);
  margin:26px 0 10px; display:flex; align-items:center; gap:8px; text-transform:uppercase; font-weight:600; }
.rb-p{ font-size:15px; line-height:1.7; color:#3a4066; margin:12px 0; }
.rb-h3{ font-family:'Baloo 2',sans-serif; font-size:19px; font-weight:700; margin:22px 0 4px; color:#1a1d2e; }
.rb-term{ background:#0f1426; border:2px solid #1c2440; border-radius:14px; overflow:hidden; margin:14px 0; box-shadow:0 8px 22px rgba(20,26,55,.18); }
.rb-term-h{ background:rgba(255,255,255,.04); padding:9px 13px; border-bottom:1px solid #1c2440; display:flex; gap:7px; align-items:center; }
.rb-term-h .d{ width:11px; height:11px; border-radius:50%; } .d.r{ background:#ff5f56; } .d.y{ background:#ffbd2e; } .d.g{ background:#27c93f; }
.rb-file{ margin-left:8px; font-family:'JetBrains Mono',monospace; font-size:11px; color:#7c87b8; }
.rb-term pre{ margin:0; padding:16px; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.6;
  color:#e6ebff; overflow-x:auto; } .rb-term pre .cmt{ color:#7c87b8; font-style:italic; }
.rb-tip{ background:#fff; border-left:6px solid #ffb02e; border-radius:6px 14px 14px 6px;
  padding:13px 16px; margin:16px 0; display:flex; gap:12px; align-items:flex-start; font-size:14px; line-height:1.55; color:#3a4066;
  box-shadow:0 6px 18px rgba(60,70,140,.08); }
.rb-tip-i{ font-size:18px; flex:none; }
.rb-list{ margin:12px 0; padding-left:4px; list-style:none; display:flex; flex-direction:column; gap:7px; }
.rb-list li{ font-size:14.5px; color:#3a4066; padding-left:20px; position:relative; line-height:1.5; }
.rb-list li::before{ content:'▪'; position:absolute; left:0; color:var(--mc,#ff4d4d); font-size:16px; top:-1px; }
.rb-tablewrap{ overflow-x:auto; border:2px solid #fff; border-radius:14px; margin:16px 0; background:#fff; box-shadow:0 6px 18px rgba(60,70,140,.08); }
.rb-table{ width:100%; border-collapse:collapse; font-size:13.5px; }
.rb-table th{ background:var(--mc,#ff4d4d); color:#fff; text-align:left; padding:10px 14px; font-size:11px;
  text-transform:uppercase; letter-spacing:1px; }
.rb-table td{ padding:10px 14px; border-bottom:1px solid #eef0f8; color:#3a4066; }
.rb-table tr:last-child td{ border-bottom:none; }
.rb-ex{ background:#fff; border:2px solid #fff; border-radius:18px; padding:18px; margin:12px 0; box-shadow:0 6px 18px rgba(60,70,140,.08); }
.rb-ex-top{ display:flex; align-items:center; gap:10px; }
.rb-ex-n{ background:var(--mc,#ff4d4d); color:#fff; width:26px; height:26px; border-radius:50%; display:grid;
  place-items:center; font-size:13px; font-weight:800; flex:none; font-family:'Baloo 2',sans-serif; }
.rb-ex-top strong{ font-family:'Baloo 2',sans-serif; font-size:16px; color:#1a1d2e; }
.rb-ex-goal{ font-size:14.5px; color:#3a4066; margin:10px 0; line-height:1.55; }
.rb-steps{ margin:8px 0; padding-left:18px; } .rb-steps li{ font-size:13.5px; color:#6b73a0; margin:4px 0; }
.rb-reveal{ display:inline-flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:12px;
  color:#fff; background:var(--mc,#ff4d4d); border:none; border-radius:10px; padding:8px 14px; cursor:pointer; margin-top:6px; font-weight:600;
  box-shadow:0 4px 12px color-mix(in srgb, var(--mc,#ff4d4d) 35%, transparent); }
.rb-reveal:hover{ filter:brightness(1.08); transform:translateY(-1px); }
.rb-quiz{ border:2px solid #fff; border-radius:18px; padding:18px; background:#fff; margin:12px 0; box-shadow:0 6px 18px rgba(60,70,140,.08); }
.rb-q{ font-family:'Baloo 2',sans-serif; font-size:16px; font-weight:700; margin-bottom:11px; color:#1a1d2e; }
.rb-opt{ display:block; width:100%; text-align:left; background:#f4f6fc; border:2px solid #e7eaf5; color:#1a1d2e;
  padding:12px 15px; border-radius:12px; margin:7px 0; font-size:14px; cursor:pointer; transition:.14s; font-family:inherit; font-weight:500; }
.rb-opt:hover{ border-color:var(--mc,#ff4d4d); background:#fff; }
.rb-opt.ok{ background:rgba(0,207,106,.14); border-color:#00cf6a; color:#0a7a44; }
.rb-opt.no{ background:rgba(255,77,77,.12); border-color:#ff4d4d; color:#c42a2a; }
.rb-fb{ font-size:13.5px; margin-top:9px; line-height:1.5; }
.rb-nav{ display:flex; justify-content:space-between; gap:10px; margin-top:26px; }
.rb-btn{ font-family:'JetBrains Mono',monospace; font-size:13px; padding:12px 18px; border-radius:12px; cursor:pointer;
  border:2px solid #e7eaf5; background:#fff; color:#1a1d2e; display:inline-flex; align-items:center; gap:7px; font-weight:600; }
.rb-btn:hover:not(:disabled){ border-color:var(--mc,#ff4d4d); } .rb-btn:disabled{ opacity:.4; cursor:default; }
.rb-btn.main{ background:var(--mc,#ff4d4d); color:#fff; border-color:var(--mc,#ff4d4d);
  box-shadow:0 6px 16px color-mix(in srgb, var(--mc,#ff4d4d) 35%, transparent); }
.rb-foot{ text-align:center; margin-top:34px; }
.rb-reset{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#c42a2a; background:#fff;
  border:2px solid rgba(196,42,42,.25); border-radius:10px; padding:9px 15px; cursor:pointer; font-weight:600; }
.rb-reset:hover{ background:rgba(255,77,77,.08); }
.rb-done-tag{ display:inline-flex; align-items:center; gap:6px; color:#0a7a44; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600; }
@media(max-width:560px){ .rb-title{ font-size:36px; } .rb-lhead h2{ font-size:25px; } }

/* ===== Animaciones ===== */
.rb-anim{ background:#fff; border:2px solid #fff; border-radius:18px; padding:18px 18px 14px; margin:16px 0; box-shadow:0 6px 18px rgba(60,70,140,.08); }
.rb-anim-cap{ font-size:13px; color:#535a82; line-height:1.55; margin:14px 0 2px; text-align:center; }
.rb-anim-cap code{ background:#f0f2fb; padding:1px 6px; border-radius:6px; font-family:'JetBrains Mono',monospace; font-size:12px; color:#b15dff; }

/* Ecosystem */
.rb-eco{ display:flex; align-items:stretch; justify-content:center; gap:6px; flex-wrap:wrap; }
.rb-eco-node{ flex:1; min-width:90px; padding:13px 10px; border-radius:14px; text-align:center;
  border:2px solid #eef0f8; background:#f7f9ff; opacity:.45; transition:all .4s; }
.rb-eco-node.on{ opacity:1; border-color:#00a3ff; background:#fff; box-shadow:0 6px 16px rgba(0,163,255,.22); }
.rb-eco-n{ font-size:13px; font-weight:700; color:#1a1d2e; font-family:'Baloo 2',sans-serif; }
.rb-eco-d{ font-size:11px; color:#8a90b8; margin-top:3px; }
.rb-eco-arrow{ align-self:center; color:#cfd5ea; font-size:20px; transition:color .4s; }
.rb-eco-arrow.on{ color:#00a3ff; }

/* Data model tree */
.rb-tree{ display:flex; flex-direction:column; align-items:flex-start; gap:8px; }
.rb-tree-root{ font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:700; color:#fff;
  background:#00cf6a; border-radius:10px; padding:7px 16px; box-shadow:0 5px 14px rgba(0,207,106,.3); }
.rb-tree-kids{ display:flex; flex-direction:column; gap:8px; padding-left:22px; width:100%; }
.rb-tree-kid{ display:flex; align-items:center; gap:8px; opacity:.35; transition:all .4s; }
.rb-tree-kid.on{ opacity:1; }
.rb-tree-line{ width:16px; height:3px; border-radius:2px; background:#cfd5ea; flex:none; }
.rb-tree-kid.on .rb-tree-line{ background:#00cf6a; }
.rb-tree-box{ border:2px solid #eef0f8; background:#f7f9ff; border-radius:12px; padding:8px 13px; flex:1; }
.rb-tree-kid.on .rb-tree-box{ border-color:#d6f5e6; background:#fff; }
.rb-tree-n{ font-family:'JetBrains Mono',monospace; font-size:13px; color:#1a1d2e; font-weight:600; }
.rb-tree-d{ font-size:11px; color:#8a90b8; margin-top:1px; }

/* Client / server */
.rb-cs{ display:flex; align-items:center; justify-content:center; gap:16px; flex-wrap:wrap; }
.rb-cs-clients{ display:flex; flex-direction:column; gap:8px; }
.rb-cs-cli{ font-family:'JetBrains Mono',monospace; font-size:12px; padding:9px 15px; border-radius:11px;
  border:2px solid #eef0f8; background:#f7f9ff; color:#a7adcf; opacity:.5; transition:all .4s; font-weight:600; }
.rb-cs-cli.on{ opacity:1; color:#0073c4; border-color:#00a3ff; background:rgba(0,163,255,.1); }
.rb-cs-link{ font-size:28px; color:#cfd5ea; transition:color .4s; }
.rb-cs-link.on{ color:#b15dff; }
.rb-cs-server{ display:flex; flex-direction:column; align-items:center; gap:5px; padding:18px 22px; border-radius:16px;
  border:none; background:#ff4d4d; color:#fff; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600;
  box-shadow:0 8px 20px rgba(255,77,77,.35); }

/* Remote flow */
.rb-remote{ display:flex; align-items:center; justify-content:center; gap:5px; flex-wrap:wrap; }
.rb-remote-stage{ padding:10px 12px; border-radius:11px; font-size:11.5px; font-family:'JetBrains Mono',monospace;
  border:2px solid #eef0f8; background:#f7f9ff; color:#a7adcf; opacity:.5; transition:all .35s; text-align:center; font-weight:600; }
.rb-remote-stage.on{ opacity:1; color:#3a4066; border-color:#e7eaf5; background:#fff; }
.rb-remote-stage.active{ border-color:#b15dff; color:#7d2fcc; background:rgba(177,93,255,.1); box-shadow:0 5px 14px rgba(177,93,255,.25); }
.rb-remote-arrow{ color:#cfd5ea; font-size:14px; transition:color .35s; }
.rb-remote-arrow.on{ color:#b15dff; }
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
        const mc = MODS.find((m) => m.name === les.mod)?.color || "#ff4d4d";
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
            <div className="rb" style={{ "--mc": mc }}>
                <style>{CSS}</style>
                <div className="rb-wrap">
                    <button className="rb-back" onClick={() => setOpen(null)}><ChevronLeft size={15} /> TODAS LAS LECCIONES</button>
                    <div className="rb-lhead">
                        <span className="rb-badge">{les.mod} · {les.mins}</span>
                        <h2>{les.title}</h2>
                    </div>
                    <div className="rb-intro">{les.intro}</div>

                    <div className="rb-secl"><BookOpen size={13} /> TEORÍA</div>
                    <Theory blocks={les.theory} />

                    <div className="rb-secl"><Play size={13} /> PRÁCTICA</div>
                    {les.practice.map((ex, i) => <Exercise key={i} ex={ex} n={i + 1} />)}

                    <div className="rb-secl"><Award size={13} /> QUIZ</div>
                    {les.quiz.map((q, qi) => {
                        const picked = answers[qi];
                        const done = picked != null;
                        return (
                            <div className="rb-quiz" key={qi}>
                                <div className="rb-q">{q.q}</div>
                                {q.opts.map((o, oi) => {
                                    let cls = "rb-opt";
                                    if (done) { if (oi === q.correct) cls += " ok"; else if (oi === picked) cls += " no"; }
                                    return <button key={oi} className={cls} onClick={() => answer(qi, oi)}>{o}</button>;
                                })}
                                {done && (
                                    <div className="rb-fb" style={{ color: picked === q.correct ? "#5cc88a" : "#ff7b72" }}>
                                        {picked === q.correct ? "✓ " : "✗ "}{q.fb}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {isDone(les) && (
                        <div style={{ textAlign: "center", marginTop: 18 }}>
                            <span className="rb-done-tag"><Check size={15} /> ¡Lección completada! +100 XP</span>
                        </div>
                    )}

                    <div className="rb-nav">
                        <button className="rb-btn" disabled={open === 0} onClick={() => openLesson(open - 1)}>
                            <ChevronLeft size={15} /> Anterior
                        </button>
                        <button className="rb-btn main" disabled={open === L.length - 1} onClick={() => openLesson(open + 1)}>
                            Siguiente <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ---------- home ---------- */
    return (
        <div className="rb">
            <style>{CSS}</style>
            <div className="rb-wrap">
                <div className="rb-head">
                    <div className="rb-kick">// EVOLUTIVE · ROBLOX</div>
                    <h1 className="rb-title">ROBLOX <b>Studio &amp; Luau</b></h1>
                    <p className="rb-sub">De cero a pro: aprende a programar en Luau y construye tu propio juego de bloques con supervivencia. Teoría con animaciones, práctica con soluciones y un quiz por lección.</p>
                </div>

                <div className="rb-rank">
                    <div className="rb-rbox">
                        <Blocks size={20} color="#ff4d4d" />
                        <div><div className="rb-rl">RANGO</div><div className="rb-rn">{rank.name}</div></div>
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#7c8698", marginBottom: 5 }}>
                            <span>{xp} XP · {completas}/{L.length} lecciones</span>
                            <span>{next ? `→ ${next.name}` : "MÁX"}</span>
                        </div>
                        <div className="rb-bar"><i style={{ width: pct + "%" }} /></div>
                    </div>
                </div>

                {MODS.map((m) => {
                    const lessons = L.map((l, i) => ({ l, i })).filter(({ l }) => l.mod === m.name);
                    return (
                        <div key={m.name} style={{ "--mc": m.color }}>
                            <div className="rb-modh"><m.icon size={14} /> {m.name} <span className="ms">— {m.sub}</span></div>
                            <div className="rb-list-lessons">
                                {lessons.map(({ l, i }) => {
                                    const done = isDone(l);
                                    const Ico = l.icon;
                                    return (
                                        <button key={l.id} className={`rb-lcard ${done ? "done" : ""}`} onClick={() => openLesson(i)}>
                                            <div className="rb-lico">{done ? <Check size={20} /> : <Ico size={20} />}</div>
                                            <div className="rb-lm">
                                                <div className="rb-lt">{l.title}</div>
                                                <div className="rb-li">{l.intro.slice(0, 72)}…</div>
                                            </div>
                                            <div className="rb-lmeta">{l.mins}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                <div className="rb-foot">
                    <button className="rb-reset" onClick={() => {
                        if (window.confirm("¿Reiniciar el progreso de Roblox Studio & Luau?")) { setRead({}); setQuiz({}); }
                    }}>
                        <RotateCcw size={11} style={{ verticalAlign: "-1px", marginRight: 5 }} /> Reiniciar progreso
                    </button>
                </div>
            </div>
        </div>
    );
}