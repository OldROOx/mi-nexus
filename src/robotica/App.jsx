import React, { useState, useEffect } from "react";
import {
    Bot, BookOpen, Check, ChevronLeft, ChevronRight, Eye, EyeOff, Award, Star,
    Zap, Lightbulb, Wrench, Cpu, Code, ToggleLeft, Gauge, Radio, Compass,
    Cog, Settings, Battery, Globe, Wifi, Server, Rocket, RotateCcw, Play,
} from "lucide-react";

/* ============================================================
   STARK LAB — Robótica & IoT, de cero a tu propia araña robot
   Curso autónomo. Progreso en localStorage (robotica_progress_v1).
   Microcontrolador base: ESP32 (Arduino + WiFi). Balance teoría/práctica.
   ============================================================ */

const SAVE_KEY = "robotica_progress_v1";

const L = [
    /* ===================== MÓDULO 1: ELECTRÓNICA ===================== */
    {
        id: "rb_elec", mod: "Electrónica", icon: Zap, mins: "25 min",
        title: "¿Qué es la electricidad?",
        intro: "Antes de mover un robot hay que entender qué lo mueve: la electricidad. Suena difícil, pero con la analogía del agua se vuelve facilísimo.",
        theory: [
            { h: "La analogía del agua (la clave para entender TODO)" },
            { p: "Imagina una tubería con agua. La electricidad funciona igual: en vez de agua, fluyen electrones por un cable." },
            { table: {
                    head: ["Concepto", "En el agua", "Se mide en"],
                    rows: [
                        ["Voltaje (V)", "La PRESIÓN del agua que empuja", "Voltios (V)"],
                        ["Corriente (I)", "La CANTIDAD de agua que pasa", "Amperios (A)"],
                        ["Resistencia (R)", "Lo angosto del tubo (estorba el paso)", "Ohmios (Ω)"],
                    ] } },
            { h: "La Ley de Ohm: la fórmula que usarás siempre" },
            { p: "Estas tres cosas están conectadas por una fórmula sencilla. Si conoces dos, sacas la tercera:" },
            { code: { file: "ley_de_ohm.txt", code: `V = I × R     (Voltaje = Corriente × Resistencia)

De ahí salen las otras dos:
I = V / R     (Corriente = Voltaje / Resistencia)
R = V / I     (Resistencia = Voltaje / Corriente)` } },
            { tip: { icon: "⚡", text: "Más voltaje = más empuje. Más resistencia = menos corriente pasa. Por eso una resistencia 'frena' la electricidad y protege a tus componentes de quemarse." } },
            { h: "Corriente directa (DC) vs alterna (AC)" },
            { p: "Las baterías y tus robots usan corriente DIRECTA (DC): fluye siempre en un sentido, de + a −. El enchufe de la pared usa corriente ALTERNA (AC). En robótica casi todo es DC, y por eso es más seguro: trabajarás con voltajes bajitos (3.3V, 5V, hasta 12V), no con los 127V del enchufe." },
        ],
        practice: [
            {
                title: "Calcula la corriente",
                goal: "Tienes una batería de 5V y una resistencia de 250Ω. ¿Cuánta corriente fluye?",
                steps: ["Usa I = V / R", "Sustituye los valores"],
                solution: `I = V / R
I = 5V / 250Ω
I = 0.02 A   (o sea, 20 mA)

// mA = miliamperios = milésimas de amperio.
// 0.02 A × 1000 = 20 mA` },
            {
                title: "Calcula la resistencia",
                goal: "Quieres que por un componente de 3V pasen solo 0.01A. ¿Qué resistencia necesitas?",
                steps: ["Usa R = V / I"],
                solution: `R = V / I
R = 3V / 0.01A
R = 300Ω` },
        ],
        quiz: [
            { q: "En la analogía del agua, el VOLTAJE es...", opts: ["La cantidad de agua", "La presión que empuja el agua", "Lo angosto del tubo", "La temperatura"], correct: 1, fb: "El voltaje es la presión/empuje. La corriente es la cantidad que fluye." },
            { q: "Según la Ley de Ohm, si subes la resistencia (y dejas el voltaje igual), la corriente...", opts: ["Sube", "Baja", "No cambia", "Se vuelve negativa"], correct: 1, fb: "I = V/R: más resistencia abajo de la división → menos corriente." },
            { q: "Tus robots funcionan con corriente...", opts: ["Alterna (AC), como el enchufe", "Directa (DC), como las baterías", "Ninguna", "Ambas a la vez"], correct: 1, fb: "Robótica = DC, con voltajes bajos y seguros (3.3V, 5V, 12V)." },
        ],
    },
    {
        id: "rb_comp", mod: "Electrónica", icon: Lightbulb, mins: "20 min",
        title: "Componentes y la protoboard",
        intro: "Estos son los 'ladrillos' con los que construirás. Conocerlos y saber armar sin soldar (con una protoboard) es el primer súper poder del maker.",
        theory: [
            { h: "Los componentes que verás siempre" },
            { table: {
                    head: ["Componente", "Qué hace"],
                    rows: [
                        ["Resistencia", "Frena la corriente para proteger cosas"],
                        ["LED", "Se enciende (foquito). ¡Tiene polaridad!"],
                        ["Cable / jumper", "Conecta unas cosas con otras"],
                        ["Protoboard", "Tablero para armar circuitos SIN soldar"],
                        ["Diodo", "Deja pasar corriente en un solo sentido"],
                        ["Capacitor", "Guarda energía un instante (estabiliza)"],
                    ] } },
            { h: "El LED tiene lados: ¡ojo con esto!" },
            { p: "Un LED solo enciende si lo conectas en el sentido correcto. La patita LARGA es el positivo (+, ánodo) y va hacia el voltaje. La patita CORTA es el negativo (−, cátodo) y va hacia tierra (GND). Si lo pones al revés, no enciende (pero no se daña)." },
            { h: "La protoboard: cómo está conectada por dentro" },
            { p: "La protoboard tiene huequitos conectados entre sí por dentro. Entender esas conexiones invisibles es lo que evita el 90% de los errores de principiante:" },
            { code: { file: "protoboard.txt", code: `LÍNEAS ROJAS y AZULES (los bordes):
  → corren a lo LARGO (horizontal). Son para
    alimentación: roja = + (voltaje), azul = − (GND).

FILAS DEL CENTRO (los números):
  → cada fila de 5 huecos está conectada en VERTICAL,
    pero el canal del centro las separa en dos mitades.

      +  - | a b c d e   f g h i j | +  -
      .  . | o-o-o-o-o   o-o-o-o-o | .  .   ← fila conectada
                       ↑ canal central separa izq/der` } },
            { tip: { icon: "💡", text: "Regla de oro: los componentes se cruzan SOBRE el canal central. Las patas de un mismo lado nunca deben ir en la misma fila vertical (se tocarían)." } },
        ],
        practice: [
            {
                title: "Identifica el positivo del LED",
                goal: "Tienes un LED en la mano. ¿Cómo sabes cuál pata va al + ?",
                steps: ["Observa las dos patitas"],
                solution: `La pata LARGA = positivo (+, ánodo) → va al voltaje.
La pata CORTA = negativo (−, cátodo) → va a GND.

Truco extra: el borde plano del LED también
marca el lado NEGATIVO.` },
        ],
        quiz: [
            { q: "En un LED, la patita LARGA es el...", opts: ["Negativo (GND)", "Positivo (+)", "No importa", "El que se quema"], correct: 1, fb: "Pata larga = positivo (ánodo). Pata corta = negativo (cátodo)." },
            { q: "Las líneas roja y azul de los bordes de la protoboard sirven para...", opts: ["Decoración", "Alimentación (+ y GND)", "Sujetar cables", "Nada"], correct: 1, fb: "Son los rieles de alimentación: roja al voltaje, azul a tierra (GND)." },
        ],
    },
    {
        id: "rb_circ", mod: "Electrónica", icon: Wrench, mins: "25 min",
        title: "Tu primer circuito (LED + resistencia)",
        intro: "Vamos a encender un LED sin quemarlo. Aquí juntas todo lo anterior: Ley de Ohm para elegir la resistencia correcta, y la protoboard para armarlo.",
        theory: [
            { h: "¿Por qué el LED necesita una resistencia?" },
            { p: "Un LED solo 'aguanta' cierta corriente (normalmente 20 mA = 0.02 A). Si le das más, se quema. La resistencia limita la corriente al valor seguro. Sin ella, el LED brilla un segundo... y muere." },
            { h: "La fórmula para elegir la resistencia del LED" },
            { code: { file: "resistencia_led.txt", code: `R = (Voltaje fuente − Voltaje del LED) / Corriente del LED

Ejemplo con ESP32 (que da 3.3V):
- Voltaje fuente = 3.3V
- Voltaje del LED ≈ 2V (un LED rojo típico)
- Corriente deseada = 0.02 A (20 mA)

R = (3.3 − 2) / 0.02
R = 1.3 / 0.02
R = 65 Ω  → usa la más cercana hacia arriba: 100Ω o 220Ω` } },
            { tip: { icon: "✓", text: "En la práctica, una resistencia de 220Ω funciona casi siempre para un LED. Si no tienes la exacta, usa una un poco MÁS grande: el LED brillará un poquito menos, pero estará seguro." } },
            { h: "Serie vs paralelo (en 10 segundos)" },
            { list: [
                    "EN SERIE: componentes uno tras otro, en fila. La misma corriente pasa por todos. Si uno se rompe, se corta todo (como foquitos viejos de navidad).",
                    "EN PARALELO: componentes en ramas separadas. Cada uno recibe el voltaje completo. Si uno falla, los demás siguen.",
                ] },
        ],
        practice: [
            {
                title: "Calcula TU resistencia",
                goal: "Vas a encender un LED azul (consume ~3V) desde un pin de ESP32 (3.3V), con 20 mA. ¿Qué resistencia usas?",
                steps: ["Usa R = (Vfuente − Vled) / I"],
                solution: `R = (3.3 − 3) / 0.02
R = 0.3 / 0.02
R = 15 Ω

// Es muy poquita: el LED azul casi usa todo el voltaje.
// En la práctica usa 100Ω para ir seguro.
// (Con LEDs azules/blancos a veces conviene
//  alimentar a 5V para que brillen bien.)` },
            {
                title: "Arma el circuito (mental)",
                goal: "Describe el camino de la corriente para encender un LED con ESP32.",
                steps: ["Piensa: de dónde sale el voltaje, por dónde pasa, a dónde regresa"],
                solution: `CAMINO DE LA CORRIENTE:

Pin GPIO del ESP32 (sale 3.3V cuando lo activamos)
   → resistencia de 220Ω
   → pata LARGA del LED (+)
   → pata CORTA del LED (−)
   → pin GND del ESP32 (regresa)

// La corriente SIEMPRE necesita un camino completo:
// sale del +, hace su trabajo, y vuelve al −.
// Si el círculo no se cierra, no pasa nada.` },
        ],
        quiz: [
            { q: "¿Por qué un LED necesita una resistencia en serie?", opts: ["Para que brille más", "Para limitar la corriente y que no se queme", "Para que cambie de color", "No la necesita"], correct: 1, fb: "Sin resistencia, pasa demasiada corriente y el LED se destruye." },
            { q: "En un circuito EN SERIE, si un componente se rompe...", opts: ["Los demás siguen funcionando", "Se corta toda la corriente", "Aumenta el voltaje", "No pasa nada"], correct: 1, fb: "En serie todo va en fila: si se rompe el camino, se corta todo." },
        ],
    },

    /* ===================== MÓDULO 2: EL CEREBRO ===================== */
    {
        id: "rb_micro", mod: "El cerebro", icon: Cpu, mins: "25 min",
        title: "¿Qué es un microcontrolador? (conoce el ESP32)",
        intro: "El microcontrolador es el cerebro del robot: una computadora chiquita que lee sensores, piensa y mueve motores. Vamos a usar el ESP32, el favorito para robots con WiFi.",
        theory: [
            { h: "¿Qué es y para qué sirve?" },
            { p: "Un microcontrolador es una mini-computadora en un solo chip. No tiene pantalla ni teclado: su trabajo es leer entradas (sensores, botones), ejecutar tu programa, y controlar salidas (LEDs, motores). Es el puente entre tu código y el mundo físico." },
            { h: "Arduino vs ESP32: ¿por qué ESP32?" },
            { table: {
                    head: ["", "Arduino Uno", "ESP32"],
                    rows: [
                        ["Dificultad", "Muy fácil", "Igual de fácil"],
                        ["WiFi / Bluetooth", "❌ No trae", "✅ Integrado"],
                        ["Velocidad", "Lento", "Mucho más rápido"],
                        ["Voltaje de pines", "5V", "3.3V"],
                        ["Precio", "Similar", "Más barato y potente"],
                    ] } },
            { tip: { icon: "🤖", text: "Para tu araña controlada por celular, el ESP32 es perfecto: ya trae WiFi, así que no necesitas piezas extra para conectarte. Se programa con el mismo Arduino IDE." } },
            { h: "Los pines GPIO (por donde 'habla' con el mundo)" },
            { p: "GPIO significa 'Entrada/Salida de Propósito General'. Son los pines a los que conectas todo. Cada pin puede ser:" },
            { list: [
                    "ENTRADA (input): lee algo del mundo (¿el botón está presionado? ¿qué tan lejos hay un obstáculo?).",
                    "SALIDA (output): manda una señal (enciende un LED, mueve un servo).",
                    "Digital: solo dos estados → encendido (HIGH/3.3V) o apagado (LOW/0V).",
                    "Analógico: lee un rango de valores (ej. un sensor de luz de 0 a 4095).",
                ] },
            { tip: { icon: "⚠️", text: "Los pines del ESP32 trabajan a 3.3V, NO a 5V. Conectarle 5V directo a un pin puede dañarlo. Lo veremos al usar sensores que funcionan a 5V." } },
        ],
        practice: [
            {
                title: "Clasifica las tareas",
                goal: "Di si cada tarea es ENTRADA o SALIDA del microcontrolador.",
                steps: ["1) Encender un LED", "2) Leer un botón", "3) Mover un servo", "4) Medir distancia con un sensor"],
                solution: `1) Encender un LED      → SALIDA (output)
2) Leer un botón        → ENTRADA (input)
3) Mover un servo       → SALIDA (output)
4) Medir distancia      → ENTRADA (input)

// Regla simple: si el robot RECIBE info del mundo = entrada.
// Si el robot ACTÚA sobre el mundo = salida.` },
        ],
        quiz: [
            { q: "¿Por qué elegimos ESP32 para un robot controlado por celular?", opts: ["Porque es más caro", "Porque trae WiFi y Bluetooth integrados", "Porque no necesita código", "Porque tiene pantalla"], correct: 1, fb: "Su WiFi integrado te deja controlarlo desde el celular sin piezas extra." },
            { q: "Un pin configurado como SALIDA (output) sirve para...", opts: ["Leer un sensor", "Mandar una señal (encender algo, mover algo)", "Cargar la batería", "Conectarse a internet"], correct: 1, fb: "Salida = el micro actúa sobre el mundo. Entrada = el micro lee el mundo." },
            { q: "Los pines del ESP32 trabajan a...", opts: ["127V", "12V", "3.3V", "1.5V"], correct: 2, fb: "3.3V. Meterle 5V directo a un pin puede dañarlo." },
        ],
    },
    {
        id: "rb_blink", mod: "El cerebro", icon: Code, mins: "30 min",
        title: "Tu primer código: parpadear un LED",
        intro: "El 'Hola Mundo' de la electrónica se llama Blink: hacer parpadear un LED. Con esto aprendes la estructura de TODO programa de Arduino/ESP32.",
        theory: [
            { h: "Los dos bloques que tiene todo programa" },
            { code: { file: "estructura.ino", code: `void setup() {
  // Se ejecuta UNA SOLA VEZ al encender.
  // Aquí preparas las cosas (configurar pines).
}

void loop() {
  // Se repite POR SIEMPRE, una y otra vez.
  // Aquí va lo que el robot hace constantemente.
}` } },
            { p: "setup() es como prepararte antes de salir (ponerte los zapatos: lo haces una vez). loop() es caminar: das un paso, otro, otro... sin parar mientras el robot esté encendido." },
            { h: "El código completo de Blink" },
            { code: { file: "blink.ino", code: `int led = 2; // GPIO 2 (LED integrado en muchos ESP32)

void setup() {
  pinMode(led, OUTPUT); // configuramos el pin como SALIDA
}

void loop() {
  digitalWrite(led, HIGH); // enciende (manda 3.3V)
  delay(1000);             // espera 1000 ms = 1 segundo
  digitalWrite(led, LOW);  // apaga (manda 0V)
  delay(1000);             // espera otro segundo
}` } },
            { h: "Las 3 instrucciones clave" },
            { list: [
                    "pinMode(pin, OUTPUT) → le dices al pin si será entrada o salida. Va en setup().",
                    "digitalWrite(pin, HIGH/LOW) → enciende (HIGH) o apaga (LOW) un pin de salida.",
                    "delay(ms) → pausa el programa. 1000 ms = 1 segundo.",
                ] },
            { tip: { icon: "💡", text: "Para subir el código: instala el Arduino IDE (gratis), añade el soporte de ESP32, conecta la placa por USB, elige tu placa y puerto, y dale al botón de Subir (→). ¡Verás el LED parpadear!" } },
        ],
        practice: [
            {
                title: "Parpadeo rápido (SOS)",
                goal: "Modifica el Blink para que parpadee rápido: encendido y apagado cada 200 ms.",
                steps: ["Parte del código de Blink", "Cambia los delay(1000) a delay(200)"],
                solution: `int led = 2;

void setup() {
  pinMode(led, OUTPUT);
}

void loop() {
  digitalWrite(led, HIGH);
  delay(200);   // ← más corto = parpadeo más rápido
  digitalWrite(led, LOW);
  delay(200);
}` },
            {
                title: "Dos LEDs alternados",
                goal: "Haz que dos LEDs (en GPIO 2 y GPIO 4) parpadeen tipo patrulla: cuando uno enciende, el otro se apaga.",
                steps: ["Configura los dos pines en setup()", "En loop(), enciende uno y apaga el otro, luego invierte"],
                solution: `int led1 = 2;
int led2 = 4;

void setup() {
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
}

void loop() {
  digitalWrite(led1, HIGH);
  digitalWrite(led2, LOW);
  delay(300);

  digitalWrite(led1, LOW);
  digitalWrite(led2, HIGH);
  delay(300);
}` },
        ],
        quiz: [
            { q: "¿Qué bloque se ejecuta UNA sola vez al encender?", opts: ["loop()", "setup()", "main()", "delay()"], correct: 1, fb: "setup() corre una vez (preparación). loop() se repite por siempre." },
            { q: "digitalWrite(led, HIGH) hace que el pin...", opts: ["Se apague", "Se encienda (mande 3.3V)", "Lea un sensor", "Se conecte a WiFi"], correct: 1, fb: "HIGH = encendido (3.3V). LOW = apagado (0V)." },
            { q: "delay(1000) pausa el programa durante...", opts: ["1000 segundos", "1 segundo (1000 ms)", "1 minuto", "Nada"], correct: 1, fb: "delay usa milisegundos: 1000 ms = 1 segundo." },
        ],
    },
    {
        id: "rb_input", mod: "El cerebro", icon: ToggleLeft, mins: "25 min",
        title: "Leer el mundo: botones (entradas digitales)",
        intro: "Hasta ahora el robot solo 'habla' (enciende LEDs). Ahora va a 'escuchar': leer un botón. Esta es la base de cómo el robot reacciona a su entorno.",
        theory: [
            { h: "Leer una entrada digital" },
            { p: "Un botón solo tiene dos estados: presionado o no. Lo leemos con digitalRead(pin), que nos devuelve HIGH o LOW." },
            { h: "El truco del INPUT_PULLUP (evita errores fantasma)" },
            { p: "Si dejas un pin de entrada 'al aire' (sin presionar nada), su valor flota al azar y el robot enloquece. La solución es usar una resistencia interna llamada pull-up, que el ESP32 ya trae. Con ella, el pin vale HIGH cuando NO se presiona, y LOW cuando SÍ (queda al revés, pero es lo estándar y más cómodo)." },
            { code: { file: "boton.ino", code: `int boton = 15; // GPIO donde conectamos el botón
int led = 2;

void setup() {
  pinMode(boton, INPUT_PULLUP); // entrada con resistencia interna
  pinMode(led, OUTPUT);
}

void loop() {
  // Con PULLUP: LOW = presionado, HIGH = suelto
  if (digitalRead(boton) == LOW) {
    digitalWrite(led, HIGH); // botón presionado → LED encendido
  } else {
    digitalWrite(led, LOW);  // botón suelto → LED apagado
  }
}` } },
            { tip: { icon: "🔌", text: "Conexión del botón con PULLUP: una pata del botón al GPIO 15, la otra pata directo a GND. ¡Así de simple! La resistencia ya está adentro del ESP32." } },
        ],
        practice: [
            {
                title: "Botón que enciende dos LEDs",
                goal: "Cuando presiones el botón, enciende DOS LEDs a la vez (GPIO 2 y 4).",
                steps: ["Configura botón con INPUT_PULLUP y dos LEDs como OUTPUT", "Si el botón está en LOW, enciende ambos"],
                solution: `int boton = 15;
int led1 = 2;
int led2 = 4;

void setup() {
  pinMode(boton, INPUT_PULLUP);
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
}

void loop() {
  if (digitalRead(boton) == LOW) {  // presionado
    digitalWrite(led1, HIGH);
    digitalWrite(led2, HIGH);
  } else {
    digitalWrite(led1, LOW);
    digitalWrite(led2, LOW);
  }
}` },
        ],
        quiz: [
            { q: "¿Qué instrucción LEE el estado de un botón?", opts: ["digitalWrite()", "digitalRead()", "pinMode()", "delay()"], correct: 1, fb: "digitalRead(pin) te devuelve HIGH o LOW. digitalWrite ESCRIBE." },
            { q: "¿Para qué sirve INPUT_PULLUP?", opts: ["Para que el pin brille", "Para que el pin no 'flote' y dé lecturas al azar", "Para conectarse a WiFi", "Para mover servos"], correct: 1, fb: "Usa una resistencia interna que estabiliza el pin cuando el botón está suelto." },
        ],
    },

    /* ===================== MÓDULO 3: LOS SENTIDOS ===================== */
    {
        id: "rb_analog", mod: "Los sentidos", icon: Gauge, mins: "25 min",
        title: "Señales analógicas (potenciómetro y luz)",
        intro: "El botón solo dice sí/no. Pero el mundo real tiene grados: un poquito de luz, media distancia... Eso son señales analógicas, y se leen distinto.",
        theory: [
            { h: "Digital vs analógico" },
            { p: "Digital = interruptor: encendido o apagado, nada en medio. Analógico = perilla de volumen: un rango continuo de valores. Un sensor de luz no dice '¿hay luz sí o no?', dice 'hay TANTA luz'." },
            { h: "analogRead: leer ese rango" },
            { p: "El ESP32 convierte el voltaje de un pin en un número del 0 al 4095 (eso son 12 bits de resolución). 0 = 0V, 4095 = 3.3V. A esto se le llama ADC (Conversor Analógico-Digital)." },
            { code: { file: "potenciometro.ino", code: `int pin = 34; // GPIO 34 (uno de los pines de entrada analógica)

void setup() {
  Serial.begin(115200); // abre la consola para ver valores
}

void loop() {
  int valor = analogRead(pin); // un número de 0 a 4095
  Serial.println(valor);       // imprímelo en la consola
  delay(200);
}` } },
            { h: "map(): traducir rangos" },
            { p: "Casi siempre quieres convertir ese 0–4095 a algo útil, como un porcentaje (0–100) o un ángulo de servo (0–180). Para eso existe map():" },
            { code: { file: "map.ino", code: `int valor = analogRead(34);        // 0 a 4095
int porcentaje = map(valor, 0, 4095, 0, 100); // → 0 a 100

// map(dato, minViejo, maxViejo, minNuevo, maxNuevo)` } },
            { tip: { icon: "🔆", text: "Un sensor de luz barato se llama LDR (fotorresistencia): cambia su resistencia según la luz. Conectado al ESP32, te deja medir qué tan iluminado está el ambiente." } },
        ],
        practice: [
            {
                title: "Convierte luz a porcentaje",
                goal: "Lee un sensor de luz en GPIO 34 y muéstralo como 0–100% en la consola.",
                steps: ["Lee con analogRead", "Convierte con map a 0–100", "Imprime con Serial.println"],
                solution: `int sensor = 34;

void setup() {
  Serial.begin(115200);
}

void loop() {
  int valor = analogRead(sensor);
  int luz = map(valor, 0, 4095, 0, 100);
  Serial.print("Luz: ");
  Serial.print(luz);
  Serial.println("%");
  delay(300);
}` },
        ],
        quiz: [
            { q: "Una señal ANALÓGICA es como...", opts: ["Un interruptor (sí/no)", "Una perilla de volumen (un rango de valores)", "Un cable roto", "Un LED"], correct: 1, fb: "Analógico = rango continuo. Digital = solo dos estados." },
            { q: "analogRead en ESP32 te devuelve un número entre...", opts: ["0 y 1", "0 y 100", "0 y 4095", "0 y 999999"], correct: 2, fb: "El ADC de 12 bits del ESP32 da valores de 0 a 4095." },
            { q: "¿Para qué sirve map()?", opts: ["Para hacer mapas", "Para convertir un valor de un rango a otro", "Para encender LEDs", "Para conectarse a WiFi"], correct: 1, fb: "map() traduce, por ejemplo, 0–4095 a 0–180 grados de servo." },
        ],
    },
    {
        id: "rb_ultra", mod: "Los sentidos", icon: Radio, mins: "30 min",
        title: "Medir distancia: el sensor ultrasónico",
        intro: "Para que tu araña no choque, necesita 'ver'. El sensor ultrasónico HC-SR04 mide distancias rebotando sonido, igual que un murciélago o un sonar. Es el sensor estrella de la robótica.",
        theory: [
            { h: "¿Cómo mide distancia con sonido?" },
            { p: "El sensor lanza un pulso de ultrasonido (que no oímos), este rebota en el objeto y regresa. El sensor mide cuánto TIEMPO tardó en volver. Como sabemos la velocidad del sonido, calculamos la distancia." },
            { code: { file: "formula.txt", code: `distancia = (tiempo × velocidad del sonido) / 2

// Se divide entre 2 porque el sonido va Y regresa
// (recorre la distancia dos veces).
// En código se simplifica a: distancia_cm = tiempo / 58` } },
            { h: "Sus 4 pines" },
            { table: {
                    head: ["Pin", "Para qué"],
                    rows: [
                        ["VCC", "Alimentación (5V)"],
                        ["Trig", "Le dices '¡dispara el sonido!'"],
                        ["Echo", "Te avisa cuándo volvió el eco"],
                        ["GND", "Tierra"],
                    ] } },
            { tip: { icon: "⚠️", text: "El HC-SR04 funciona a 5V y su pin Echo devuelve 5V, pero el ESP32 solo aguanta 3.3V. Pon un divisor de voltaje (dos resistencias) en el pin Echo, o usa un sensor versión 3.3V. ¡Esto protege tu placa!" } },
            { h: "El código para medir" },
            { code: { file: "ultrasonico.ino", code: `int trig = 5;
int echo = 18;

void setup() {
  Serial.begin(115200);
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);
}

long medirDistancia() {
  // 1. Mandamos un pulso corto por Trig
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  // 2. Medimos cuánto tarda el eco en volver
  long tiempo = pulseIn(echo, HIGH);

  // 3. Convertimos a centímetros
  return tiempo / 58;
}

void loop() {
  long cm = medirDistancia();
  Serial.print(cm);
  Serial.println(" cm");
  delay(200);
}` } },
        ],
        practice: [
            {
                title: "Alarma de proximidad",
                goal: "Enciende un LED (GPIO 2) si hay un obstáculo a menos de 20 cm.",
                steps: ["Usa la función medirDistancia()", "Si cm < 20, enciende el LED; si no, apágalo"],
                solution: `int trig = 5, echo = 18, led = 2;

void setup() {
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);
  pinMode(led, OUTPUT);
}

long medirDistancia() {
  digitalWrite(trig, LOW); delayMicroseconds(2);
  digitalWrite(trig, HIGH); delayMicroseconds(10);
  digitalWrite(trig, LOW);
  return pulseIn(echo, HIGH) / 58;
}

void loop() {
  long cm = medirDistancia();
  if (cm < 20) {
    digitalWrite(led, HIGH); // ¡obstáculo cerca!
  } else {
    digitalWrite(led, LOW);
  }
  delay(100);
}` },
        ],
        quiz: [
            { q: "¿Cómo mide la distancia el sensor ultrasónico?", opts: ["Con una cámara", "Midiendo el tiempo que tarda un eco de sonido en volver", "Con GPS", "Con luz láser"], correct: 1, fb: "Lanza ultrasonido, mide cuánto tarda en rebotar y regresar, y calcula la distancia." },
            { q: "¿Por qué hay que tener cuidado con el pin Echo en el ESP32?", opts: ["Porque no funciona", "Porque devuelve 5V y el ESP32 solo aguanta 3.3V", "Porque es muy caro", "Porque consume mucha batería"], correct: 1, fb: "Necesita un divisor de voltaje para bajar los 5V del Echo a 3.3V seguros." },
        ],
    },
    {
        id: "rb_imu", mod: "Los sentidos", icon: Compass, mins: "20 min",
        title: "Equilibrio y orientación (el sensor IMU)",
        intro: "Para caminar sin caerse, tu araña necesita un sentido del equilibrio, igual que tu oído interno. Eso lo da un sensor IMU como el MPU6050.",
        theory: [
            { h: "¿Qué es una IMU?" },
            { p: "IMU = Unidad de Medición Inercial. Es un chip que combina dos sensores: un acelerómetro (mide inclinación y movimiento) y un giroscopio (mide qué tan rápido gira). Juntos le dicen al robot: '¿estoy derecho o inclinado? ¿me estoy cayendo?'." },
            { table: {
                    head: ["Sensor", "Qué mide", "Para qué sirve"],
                    rows: [
                        ["Acelerómetro", "Inclinación y aceleración", "Saber si el robot está derecho"],
                        ["Giroscopio", "Velocidad de giro", "Detectar giros y estabilizar"],
                    ] } },
            { tip: { icon: "🧭", text: "El MPU6050 se conecta por un protocolo llamado I2C, que usa solo 2 cables de datos (SDA y SCL). Con una librería listo, lees la inclinación en pocas líneas." } },
            { h: "¿Para qué lo usa tu araña?" },
            { p: "Para caminar en terreno disparejo sin volcarse: si la IMU detecta que se está inclinando de más, el robot puede ajustar las patas para recuperar el equilibrio. Para tu primera araña no es obligatorio, pero es lo que separa un robot que 'se arrastra' de uno que camina de verdad." },
        ],
        practice: [
            {
                title: "Decide qué sensor usar",
                goal: "Para cada situación, ¿necesitas acelerómetro o giroscopio?",
                steps: ["1) Saber si el robot está inclinado/parado derecho", "2) Detectar qué tan rápido está girando sobre sí mismo"],
                solution: `1) ¿Está derecho o inclinado?  → ACELERÓMETRO
   (mide la inclinación respecto a la gravedad)

2) ¿Qué tan rápido gira?       → GIROSCOPIO
   (mide la velocidad de rotación)

// En la práctica se combinan ambos (sensor fusion)
// para una lectura estable. La IMU MPU6050 trae los dos.` },
        ],
        quiz: [
            { q: "Una IMU (como el MPU6050) combina...", opts: ["Cámara y micrófono", "Acelerómetro y giroscopio", "GPS y WiFi", "Dos motores"], correct: 1, fb: "Acelerómetro (inclinación) + giroscopio (giro) = sentido del equilibrio." },
            { q: "¿Para qué le sirve la IMU a tu araña?", opts: ["Para conectarse a internet", "Para mantener el equilibrio y no volcarse al caminar", "Para medir distancia", "Para cargar la batería"], correct: 1, fb: "Le da equilibrio: detecta inclinación y ayuda a no caerse." },
        ],
    },

    /* ===================== MÓDULO 4: LOS MÚSCULOS ===================== */
    {
        id: "rb_motors", mod: "Los músculos", icon: Cog, mins: "20 min",
        title: "Tipos de motores (DC, servo, stepper)",
        intro: "Los motores son los músculos del robot. Hay tres tipos principales y elegir el correcto es media batalla. Para una araña, el protagonista será el servo.",
        theory: [
            { table: {
                    head: ["Motor", "Qué hace", "Ideal para"],
                    rows: [
                        ["DC", "Gira rápido y sin parar", "Ruedas, ventiladores"],
                        ["Servo", "Gira a un ÁNGULO exacto (0–180°)", "Patas, brazos, articulaciones"],
                        ["Stepper", "Gira en pasos precisos", "Impresoras 3D, CNC"],
                    ] } },
            { h: "¿Por qué servos para una araña?" },
            { p: "Una pata de araña necesita moverse a posiciones exactas: 'levanta 45°, adelanta, baja'. El servo es perfecto porque le dices el ÁNGULO y él va justo ahí. Un motor DC solo gira sin control de posición; no sirve para una articulación." },
            { h: "¿Cuántos servos necesita una araña?" },
            { p: "Depende de cuántas 'articulaciones' (grados de libertad) tenga cada pata:" },
            { list: [
                    "Araña sencilla: 2 servos por pata × 4 patas = 8 servos.",
                    "Hexápodo básico: 2 servos × 6 patas = 12 servos.",
                    "Araña avanzada: 3 servos por pata (más realista) = 12 a 18 servos.",
                ] },
            { tip: { icon: "💪", text: "Empieza simple: un cuadrúpedo (4 patas) con 2 servos por pata = 8 servos. Ya camina y es mucho más fácil de controlar y alimentar que un hexápodo de 18." } },
        ],
        practice: [
            {
                title: "Elige el motor correcto",
                goal: "¿Qué tipo de motor usarías para cada parte?",
                steps: ["1) Las patas de la araña", "2) Las ruedas de un carrito", "3) El eje de una impresora 3D"],
                solution: `1) Patas de araña     → SERVO
   (necesitan ángulos exactos para cada paso)

2) Ruedas de carrito  → MOTOR DC
   (giran continuo para avanzar)

3) Eje de impresora   → STEPPER
   (pasos precisos para exactitud milimétrica)` },
        ],
        quiz: [
            { q: "¿Qué motor es ideal para las patas de una araña?", opts: ["Motor DC", "Servomotor", "Stepper", "Ninguno"], correct: 1, fb: "El servo va a ángulos exactos: perfecto para articulaciones." },
            { q: "Un motor DC se diferencia del servo en que...", opts: ["Gira a un ángulo exacto", "Gira continuo sin control de posición", "No se mueve", "Necesita WiFi"], correct: 1, fb: "El DC gira y gira; el servo va a una posición precisa." },
        ],
    },
    {
        id: "rb_servo", mod: "Los músculos", icon: Settings, mins: "30 min",
        title: "Servomotores a fondo (las patas de tu araña)",
        intro: "El servo es la pieza más importante de tu robot araña. Aquí aprendes cómo funciona y cómo controlarlo con código. Domina esto y ya puedes mover patas.",
        theory: [
            { h: "¿Cómo se controla un servo? (PWM)" },
            { p: "Al servo le mandas una señal especial llamada PWM (pulsos rápidos de encendido/apagado). La 'anchura' de cada pulso le dice a qué ángulo ir. Suena complejo, pero una librería lo hace por ti: tú solo dices el ángulo." },
            { h: "Sus 3 cables" },
            { table: {
                    head: ["Cable (color típico)", "Para qué"],
                    rows: [
                        ["Café/Negro", "GND (tierra)"],
                        ["Rojo", "Alimentación (5V)"],
                        ["Naranja/Amarillo", "Señal (al pin del ESP32)"],
                    ] } },
            { h: "Código para mover UN servo" },
            { code: { file: "servo.ino", code: `#include <ESP32Servo.h> // librería para servos en ESP32

Servo miServo;

void setup() {
  miServo.attach(13); // el servo está en GPIO 13
}

void loop() {
  miServo.write(0);    // ir a 0 grados
  delay(1000);
  miServo.write(90);   // ir al centro (90°)
  delay(1000);
  miServo.write(180);  // ir al otro extremo
  delay(1000);
}` } },
            { tip: { icon: "📦", text: "Instala la librería 'ESP32Servo' desde el Arduino IDE (Gestor de librerías). En Arduino Uno se usa 'Servo.h', pero el ESP32 necesita la versión ESP32Servo." } },
            { h: "Mover VARIOS servos (como las patas)" },
            { code: { file: "varios_servos.ino", code: `#include <ESP32Servo.h>

Servo pata1;
Servo pata2;

void setup() {
  pata1.attach(13);
  pata2.attach(12);
}

void loop() {
  // Mueve las dos patas a la vez
  pata1.write(45);
  pata2.write(135);
  delay(500);

  pata1.write(135);
  pata2.write(45);
  delay(500);
}` } },
            { tip: { icon: "⚠️", text: "Muy importante: NO alimentes los servos desde el pin 5V del ESP32. Varios servos consumen mucha corriente y reiniciarían (o dañarían) tu placa. Eso lo resolvemos en la siguiente lección." } },
        ],
        practice: [
            {
                title: "Barrido suave de servo",
                goal: "Haz que un servo se mueva GRADO POR GRADO de 0 a 180 y regrese (movimiento suave, no de golpe).",
                steps: ["Usa un bucle for para subir de 0 a 180", "Otro for para bajar de 180 a 0", "delay corto entre cada grado"],
                solution: `#include <ESP32Servo.h>
Servo s;

void setup() {
  s.attach(13);
}

void loop() {
  // sube grado por grado
  for (int a = 0; a <= 180; a++) {
    s.write(a);
    delay(15);
  }
  // baja grado por grado
  for (int a = 180; a >= 0; a--) {
    s.write(a);
    delay(15);
  }
}` },
        ],
        quiz: [
            { q: "¿Qué tipo de señal controla la posición de un servo?", opts: ["WiFi", "PWM (pulsos)", "Sonido", "Luz"], correct: 1, fb: "El servo entiende PWM: el ancho del pulso define el ángulo." },
            { q: "En ESP32, ¿qué librería usas para servos?", opts: ["Servo.h", "ESP32Servo.h", "WiFi.h", "Wire.h"], correct: 1, fb: "El ESP32 usa ESP32Servo.h (Servo.h es para Arduino Uno)." },
            { q: "Para mover un servo a la mitad de su recorrido escribes...", opts: ["miServo.write(0)", "miServo.write(90)", "miServo.write(180)", "miServo.off()"], correct: 1, fb: "0–180 es el rango; 90 es el centro." },
        ],
    },
    {
        id: "rb_power", mod: "Los músculos", icon: Battery, mins: "25 min",
        title: "Energía: baterías, voltaje y drivers",
        intro: "Aquí mueren muchos robots de principiante: la alimentación. Si los motores y el cerebro comparten mal la energía, todo se reinicia o se quema. Vamos a hacerlo bien.",
        theory: [
            { h: "El error #1: alimentar motores desde el ESP32" },
            { p: "El ESP32 puede dar muy poca corriente por sus pines. Un solo servo pequeño ya pide más de lo que el pin aguanta cómodamente, y 8 servos lo tumban al instante. Los motores SIEMPRE se alimentan de una fuente aparte (una batería dedicada)." },
            { h: "La regla del GND común" },
            { p: "Si usas dos fuentes (una para el ESP32 y otra para los servos), DEBES unir sus tierras (GND). Si no, las señales no tienen una referencia común y nada funciona. Es el error silencioso más típico." },
            { code: { file: "conexion_energia.txt", code: `        BATERÍA SERVOS (ej. 5–6V, buena corriente)
           │ +            │ −
           ▼              ▼
        VCC servos     GND servos ──┐
                                    │ ← GND COMÚN
        ESP32 GND ──────────────────┘
        ESP32 (alimentado por USB o su propia batería)
           │
           └── pin señal ──► cable naranja del servo

// + de la batería  →  alimentación de los servos
// − de la batería  →  GND de los servos Y GND del ESP32 (unidos)
// pin del ESP32     →  solo el cable de SEÑAL del servo` } },
            { h: "Voltajes que usarás" },
            { table: {
                    head: ["Para", "Voltaje típico"],
                    rows: [
                        ["ESP32", "5V por USB (o 3.7V LiPo + regulador)"],
                        ["Servos pequeños (SG90)", "4.8–6V"],
                        ["Motores DC", "3–12V según el motor"],
                    ] } },
            { tip: { icon: "🔋", text: "Para empezar: una batería recargable o un porta-pilas de 4 AA (≈6V) para los servos, y el ESP32 por USB/power bank. Une los GND y listo. Más adelante, baterías LiPo dan más potencia en menos peso." } },
            { h: "¿Y los drivers de motor?" },
            { p: "Los servos traen su 'driver' por dentro, así que se conectan directo (solo cuida la energía). Pero los motores DC y steppers SÍ necesitan un módulo driver (como L298N o DRV8833) entre el ESP32 y el motor: el micro manda la orden y el driver entrega la corriente fuerte. Piensa en el driver como un 'amplificador de músculo'." },
        ],
        practice: [
            {
                title: "Detecta el error de cableado",
                goal: "Un compañero conectó 8 servos al pin 5V del ESP32 y se reinicia solo. ¿Qué está mal y cómo se arregla?",
                steps: ["Piensa en de dónde sale la corriente", "Piensa en el GND común"],
                solution: `PROBLEMA:
Los 8 servos jalan más corriente de la que el
ESP32 puede dar por su pin 5V → la placa se cae
y se reinicia.

SOLUCIÓN:
1. Alimentar los servos con una batería APARTE
   (ej. 6V con buena corriente).
2. Conectar el GND de esa batería al GND del ESP32
   (GND común).
3. Del ESP32 a cada servo va SOLO el cable de señal.` },
        ],
        quiz: [
            { q: "¿De dónde deben sacar energía los servos de tu araña?", opts: ["Del pin del ESP32", "De una batería/fuente aparte dedicada", "Del WiFi", "De un LED"], correct: 1, fb: "Los motores van a una fuente aparte; el ESP32 no aguanta su consumo." },
            { q: "Si usas dos fuentes (ESP32 y servos), ¿qué es obligatorio?", opts: ["Unir sus GND (tierra común)", "Que sean del mismo color", "Usar 127V", "Nada"], correct: 0, fb: "El GND común da una referencia compartida; sin él, nada funciona." },
            { q: "Un módulo driver (L298N) sirve para...", opts: ["Conectarse a internet", "Entregar la corriente fuerte que un motor DC necesita", "Medir distancia", "Leer botones"], correct: 1, fb: "Es el 'amplificador de músculo' entre el micro y el motor." },
        ],
    },

    /* ===================== MÓDULO 5: LA CONEXIÓN IRON MAN ===================== */
    {
        id: "rb_iot", mod: "Conexión Iron Man", icon: Globe, mins: "20 min",
        title: "¿Qué es IoT?",
        intro: "IoT (Internet de las Cosas) es lo que convierte un aparato en un aparato INTELIGENTE y conectado. Es la magia detrás de controlar tu araña desde el celular.",
        theory: [
            { h: "La idea en una frase" },
            { p: "IoT = objetos cotidianos conectados a una red, que pueden enviar y recibir información. Una lámpara normal solo se prende con su switch. Una lámpara IoT la prendes desde el celular, la programas, y te avisa si se fundió. La diferencia es la conexión." },
            { h: "Ejemplos que ya conoces" },
            { list: [
                    "Foco inteligente que controlas con una app.",
                    "Pulsera que cuenta tus pasos y los sube a tu teléfono.",
                    "Cámara de seguridad que ves desde donde sea.",
                    "Tu araña robot, que recibe órdenes de tu celular. 🕷️",
                ] },
            { h: "Las 4 partes de cualquier sistema IoT" },
            { table: {
                    head: ["Parte", "En tu araña"],
                    rows: [
                        ["Dispositivo (el 'thing')", "El ESP32 con sus motores y sensores"],
                        ["Conexión", "WiFi"],
                        ["Servidor / cerebro", "Un servidor web dentro del propio ESP32"],
                        ["Interfaz", "La página/app en tu celular con botones"],
                    ] } },
            { tip: { icon: "🌐", text: "Lo genial del ESP32: puede ser el dispositivo Y el servidor al mismo tiempo. Crea su propia página web a la que te conectas desde el celular. No necesitas internet, solo estar en la misma red WiFi (o que el ESP32 cree su propia red)." } },
        ],
        practice: [
            {
                title: "Identifica las partes IoT",
                goal: "En una cafetera inteligente que se enciende desde una app, ¿cuáles son las 4 partes IoT?",
                steps: ["Dispositivo, conexión, servidor, interfaz"],
                solution: `Dispositivo → la cafetera con su microcontrolador
Conexión    → WiFi
Servidor    → la nube/servidor que recibe la orden
Interfaz    → la app en tu celular con el botón "Encender"

// Tu araña tendrá las mismas 4 partes,
// pero el servidor vivirá DENTRO del ESP32.` },
        ],
        quiz: [
            { q: "IoT significa, en esencia...", opts: ["Un tipo de motor", "Objetos conectados a una red que envían/reciben datos", "Un lenguaje de programación", "Una batería"], correct: 1, fb: "Internet de las Cosas: aparatos conectados e inteligentes." },
            { q: "¿Qué tiene de especial el ESP32 para IoT?", opts: ["Que no necesita código", "Que puede ser el dispositivo Y el servidor web a la vez", "Que es muy grande", "Que usa AC"], correct: 1, fb: "Crea su propia página web de control; te conectas desde el celular." },
        ],
    },
    {
        id: "rb_wifi", mod: "Conexión Iron Man", icon: Wifi, mins: "25 min",
        title: "Conecta el ESP32 al WiFi",
        intro: "El primer paso para el control remoto: que tu ESP32 se conecte a una red WiFi. Son pocas líneas y abre la puerta a todo lo demás.",
        theory: [
            { h: "Dos formas de conectar" },
            { list: [
                    "Modo estación (STA): el ESP32 se une a TU red WiFi de casa. Útil si tu celular está en la misma red.",
                    "Modo punto de acceso (AP): el ESP32 crea SU PROPIA red WiFi y tu celular se conecta a ella. Ideal para un robot que anda por la calle, sin depender de tu router.",
                ] },
            { h: "Código para unirse a tu WiFi (modo STA)" },
            { code: { file: "wifi.ino", code: `#include <WiFi.h>

const char* red = "NOMBRE_DE_TU_WIFI";
const char* clave = "TU_CONTRASEÑA";

void setup() {
  Serial.begin(115200);
  WiFi.begin(red, clave); // intenta conectarse

  // Espera hasta lograr la conexión
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("¡Conectado!");
  Serial.print("IP del ESP32: ");
  Serial.println(WiFi.localIP()); // ← anota esta IP
}

void loop() {
}` } },
            { tip: { icon: "📍", text: "Esa IP que imprime (algo como 192.168.1.50) es la 'dirección' de tu robot en la red. La escribes en el navegador del celular para controlarlo. ¡Apúntala!" } },
            { h: "Código para crear su propia red (modo AP)" },
            { code: { file: "wifi_ap.ino", code: `#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  WiFi.softAP("AranaRobot", "12345678"); // red propia + clave
  Serial.print("IP del robot: ");
  Serial.println(WiFi.softAPIP()); // suele ser 192.168.4.1
}

void loop() {
}` } },
        ],
        practice: [
            {
                title: "Elige el modo correcto",
                goal: "Tu araña va a andar en el patio, lejos del router. ¿Modo STA o AP? ¿Por qué?",
                steps: ["Piensa de qué red dependería cada modo"],
                solution: `Respuesta: MODO AP (punto de acceso).

Por qué: en el patio quizá no llega bien tu WiFi de casa.
En modo AP, el ESP32 crea SU PROPIA red ("AranaRobot")
y tu celular se conecta directo a ella. El robot no
depende de ningún router y funciona en cualquier lado.

// Modo STA sería mejor solo si el robot y tu celular
// están siempre en la misma red de casa.` },
        ],
        quiz: [
            { q: "En modo AP, el ESP32...", opts: ["Se une a tu WiFi de casa", "Crea su propia red WiFi", "No usa WiFi", "Se apaga"], correct: 1, fb: "AP = el robot genera su propia red; tu celular se conecta a ella." },
            { q: "¿Para qué sirve la IP que imprime el ESP32?", opts: ["Es la temperatura", "Es la 'dirección' del robot para controlarlo desde el navegador", "Es la batería", "No sirve"], correct: 1, fb: "Escribes esa IP en el celular para abrir la página de control." },
        ],
    },
    {
        id: "rb_webserver", mod: "Conexión Iron Man", icon: Server, mins: "35 min",
        title: "Controla tu robot desde el celular (servidor web)",
        intro: "El momento Iron Man: tu ESP32 servirá una página web con botones. Abres esa página en el celular, tocas un botón, y el robot obedece. Esto es el corazón del control remoto.",
        theory: [
            { h: "La idea" },
            { p: "El ESP32 actúa como un mini servidor web. Cuando tu celular visita su IP, el ESP32 le envía una página con botones. Cada botón llama a una 'ruta' (ej. /adelante), y el ESP32 reacciona a esa ruta moviendo el robot." },
            { h: "Servidor web mínimo con botones" },
            { code: { file: "servidor.ino", code: `#include <WiFi.h>
#include <WebServer.h>

WebServer server(80); // servidor en el puerto 80

// La página HTML con botones (se la mandamos al celular)
String pagina() {
  return "<html><body style='text-align:center'>"
         "<h1>Control Arana</h1>"
         "<a href='/adelante'><button>ADELANTE</button></a>"
         "<a href='/parar'><button>PARAR</button></a>"
         "</body></html>";
}

void manejarRaiz()     { server.send(200, "text/html", pagina()); }
void manejarAdelante() {
  // AQUÍ moverías los servos para caminar
  Serial.println("Caminando adelante...");
  server.send(200, "text/html", pagina());
}
void manejarParar() {
  Serial.println("Robot detenido.");
  server.send(200, "text/html", pagina());
}

void setup() {
  Serial.begin(115200);
  WiFi.softAP("AranaRobot", "12345678");
  Serial.println(WiFi.softAPIP());

  // Conectamos cada ruta con su función
  server.on("/", manejarRaiz);
  server.on("/adelante", manejarAdelante);
  server.on("/parar", manejarParar);
  server.begin();
}

void loop() {
  server.handleClient(); // atiende las peticiones del celular
}` } },
            { tip: { icon: "📱", text: "Para usarlo: sube el código, conecta tu celular a la red 'AranaRobot' (clave 12345678), abre el navegador y entra a 192.168.4.1. ¡Verás tus botones y al tocarlos el ESP32 responde!" } },
            { tip: { icon: "🔑", text: "Lo importante: server.on(\"/ruta\", función) conecta cada botón con una acción. Dentro de esas funciones es donde, en el proyecto final, moverás los servos de las patas." } },
        ],
        practice: [
            {
                title: "Agrega los botones que faltan",
                goal: "El servidor solo tiene ADELANTE y PARAR. Agrega IZQUIERDA y DERECHA.",
                steps: ["Añade dos botones al HTML con sus rutas /izquierda y /derecha", "Crea sus funciones manejadoras", "Regístralas con server.on(...)"],
                solution: `// 1) En la página, agrega los botones:
"<a href='/izquierda'><button>IZQUIERDA</button></a>"
"<a href='/derecha'><button>DERECHA</button></a>"

// 2) Crea sus funciones:
void manejarIzquierda() {
  Serial.println("Girando izquierda...");
  server.send(200, "text/html", pagina());
}
void manejarDerecha() {
  Serial.println("Girando derecha...");
  server.send(200, "text/html", pagina());
}

// 3) En setup(), regístralas:
server.on("/izquierda", manejarIzquierda);
server.on("/derecha", manejarDerecha);

// (Dentro de cada función moverás los servos
//  para que el robot gire hacia ese lado.)` },
        ],
        quiz: [
            { q: "Cuando tu celular visita la IP del ESP32, este le envía...", opts: ["Una batería", "Una página web con botones", "Un motor", "Nada"], correct: 1, fb: "El ESP32 sirve la página HTML; el celular la muestra con sus botones." },
            { q: "¿Qué hace server.on(\"/adelante\", manejarAdelante)?", opts: ["Apaga el robot", "Conecta la ruta /adelante con la función que mueve el robot", "Carga la batería", "Mide distancia"], correct: 1, fb: "Asocia cada botón/ruta con la acción que debe ejecutar el ESP32." },
            { q: "En loop(), server.handleClient() sirve para...", opts: ["Mover servos al azar", "Atender las peticiones que llegan del celular", "Apagar el WiFi", "Parpadear un LED"], correct: 1, fb: "Mantiene al servidor escuchando y respondiendo a los botones." },
        ],
    },

    /* ===================== MÓDULO 6: CONSTRUYE LA ARAÑA ===================== */
    {
        id: "rb_anatomy", mod: "Construye la araña", icon: Bot, mins: "30 min",
        title: "Anatomía de un robot y cómo camina",
        intro: "Antes del proyecto final, veamos el panorama completo: qué partes tiene todo robot y, lo más mágico, cómo logra caminar coordinando sus patas.",
        theory: [
            { h: "Las 5 partes de cualquier robot" },
            { table: {
                    head: ["Parte", "Qué es", "En tu araña"],
                    rows: [
                        ["Cerebro", "Toma decisiones", "ESP32"],
                        ["Sensores", "Perciben el entorno", "Ultrasónico, IMU"],
                        ["Actuadores", "Mueven el robot", "Servos de las patas"],
                        ["Energía", "Da poder a todo", "Baterías"],
                        ["Chasis", "El cuerpo que lo sostiene", "Estructura impresa en 3D"],
                    ] } },
            { h: "¿Cómo camina una araña robot? (la marcha o 'gait')" },
            { p: "Caminar es coordinar las patas en una secuencia. Una pata hace dos cosas: se LEVANTA y avanza por el aire (fase de vuelo), o está en el suelo empujando el cuerpo (fase de apoyo). El truco es que nunca se levanten tantas patas a la vez que el robot se caiga." },
            { p: "En un cuadrúpedo, la marcha más estable mueve las patas en diagonal: levantas la delantera-izquierda y la trasera-derecha juntas mientras las otras dos sostienen; luego inviertes. Así siempre hay un trípode/diagonal de apoyo." },
            { code: { file: "gait.txt", code: `MARCHA DIAGONAL (cuadrúpedo) — paso a paso:

Patas:  DI = delantera-izq   DD = delantera-der
        TI = trasera-izq     TD = trasera-der

Paso 1: levantar y adelantar  DI + TD
        (mientras DD + TI sostienen y empujan)
Paso 2: bajar DI + TD
Paso 3: levantar y adelantar  DD + TI
        (mientras DI + TD sostienen y empujan)
Paso 4: bajar DD + TI
→ repetir   = el robot avanza, siempre estable.` } },
            { h: "El cerebro del comportamiento: máquina de estados" },
            { p: "Para organizar la lógica, los robots usan una 'máquina de estados': el robot está en UN estado a la vez (PARADO, CAMINANDO, GIRANDO, EVITANDO) y cambia entre ellos según lo que pase. Es ordenado y fácil de programar." },
            { code: { file: "estados.txt", code: `Estados de la araña:

  [PARADO] --(botón adelante)--> [CAMINANDO]
  [CAMINANDO] --(obstáculo cerca)--> [EVITANDO]
  [EVITANDO] --(ya libre)--> [CAMINANDO]
  [cualquiera] --(botón parar)--> [PARADO]` } },
            { tip: { icon: "🖨️", text: "El chasis lo puedes imprimir en 3D (tú ya manejas Blender, ¡ventaja enorme!) o armarlo con piezas y tornillos. Hay miles de diseños gratis de arañas/cuadrúpedos para ESP32 en internet para empezar." } },
        ],
        practice: [
            {
                title: "Diseña la marcha",
                goal: "Explica por qué NO conviene levantar las 4 patas (o las 2 de un mismo lado) al mismo tiempo.",
                steps: ["Piensa en el equilibrio y el centro de gravedad"],
                solution: `Si levantas las 4 patas → nada sostiene al robot
y se cae de panza.

Si levantas las 2 de un mismo lado → el peso se va
hacia ese lado sin apoyo y se voltea.

Por eso se usa la marcha DIAGONAL: levantas patas
cruzadas (una de adelante y la opuesta de atrás),
dejando siempre un apoyo en diagonal que mantiene
el centro de gravedad sobre una base estable.` },
        ],
        quiz: [
            { q: "Los 'actuadores' de un robot son los que...", opts: ["Perciben el entorno", "Mueven el robot (motores/servos)", "Dan energía", "Sostienen el cuerpo"], correct: 1, fb: "Actuadores = músculos. Sensores perciben, actuadores actúan." },
            { q: "En una marcha diagonal de cuadrúpedo, se levantan...", opts: ["Las 4 patas a la vez", "Patas cruzadas (una delantera y la trasera opuesta)", "Solo una pata", "Ninguna"], correct: 1, fb: "Levantar diagonales deja siempre un apoyo estable y evita la caída." },
            { q: "Una 'máquina de estados' sirve para...", opts: ["Cargar la batería", "Organizar el comportamiento: el robot está en un estado a la vez", "Medir voltaje", "Imprimir en 3D"], correct: 1, fb: "PARADO, CAMINANDO, EVITANDO... cambia entre estados según lo que pase." },
        ],
    },
    {
        id: "rb_project", mod: "Construye la araña", icon: Rocket, mins: "45 min",
        title: "Proyecto final: araña robot por WiFi",
        intro: "El gran final. Aquí juntas TODO: ESP32 + servos (patas) + sensor ultrasónico (para no chocar) + servidor web (control desde el celular). Este es tu plano maestro nivel Iron Man.",
        theory: [
            { h: "Lista de materiales (para empezar)" },
            { list: [
                    "1× ESP32 (el cerebro con WiFi).",
                    "8× servos SG90 (cuadrúpedo: 2 por pata × 4 patas).",
                    "1× sensor ultrasónico HC-SR04 (los 'ojos').",
                    "1× batería para servos (ej. porta-pilas 4×AA ≈6V, o LiPo) + power bank/USB para el ESP32.",
                    "Chasis impreso en 3D (lo diseñas en Blender) o kit de cuadrúpedo.",
                    "Cables jumper, protoboard o placa, tornillos.",
                ] },
            { h: "Cómo encaja todo (el sistema completo)" },
            { code: { file: "arquitectura.txt", code: `   CELULAR (navegador)
        │  toca botones (adelante, parar...)
        ▼  WiFi
   ┌─────────────────────────────┐
   │          ESP32              │
   │  ┌─ servidor web (botones)  │
   │  ├─ lógica (máquina estados)│
   │  ├─ lee ultrasónico ────────┼──► ¿obstáculo?
   │  └─ mueve 8 servos ─────────┼──► patas caminan
   └─────────────────────────────┘
        │ señales              │ energía
        ▼                      ▼
   servos (patas)        batería aparte (GND común)` } },
            { h: "El código integrador (estructura)" },
            { p: "No memorices esto: entiende cómo se UNEN las piezas que ya aprendiste. Cada parte viene de una lección anterior." },
            { code: { file: "arana_wifi.ino", code: `#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>

WebServer server(80);
Servo patas[8]; // 8 servos
int pinesServo[8] = {13,12,14,27,26,25,33,32};

int trig = 5, echo = 18;
String estado = "PARADO"; // máquina de estados

// --- página de control para el celular ---
String pagina() {
  return "<html><body style='text-align:center'>"
         "<h1>Arana Stark</h1>"
         "<a href='/adelante'><button>ADELANTE</button></a> "
         "<a href='/parar'><button>PARAR</button></a>"
         "</body></html>";
}

// --- medir distancia (lección del ultrasónico) ---
long distancia() {
  digitalWrite(trig, LOW); delayMicroseconds(2);
  digitalWrite(trig, HIGH); delayMicroseconds(10);
  digitalWrite(trig, LOW);
  return pulseIn(echo, HIGH) / 58;
}

// --- un paso de la marcha diagonal (simplificado) ---
void darPaso() {
  // Mueve patas cruzadas; ajusta los ángulos a tu chasis
  patas[0].write(120); patas[6].write(120); // levanta diagonal
  delay(200);
  patas[0].write(90);  patas[6].write(90);  // baja
  delay(200);
  patas[2].write(120); patas[4].write(120); // otra diagonal
  delay(200);
  patas[2].write(90);  patas[4].write(90);
  delay(200);
}

// --- rutas del servidor (lección del servidor web) ---
void irAdelante() { estado = "CAMINANDO"; server.send(200,"text/html",pagina()); }
void parar()      { estado = "PARADO";    server.send(200,"text/html",pagina()); }

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < 8; i++) patas[i].attach(pinesServo[i]);
  pinMode(trig, OUTPUT); pinMode(echo, INPUT);

  WiFi.softAP("AranaStark", "12345678"); // red propia
  Serial.println(WiFi.softAPIP());

  server.on("/", [](){ server.send(200,"text/html",pagina()); });
  server.on("/adelante", irAdelante);
  server.on("/parar", parar);
  server.begin();
}

void loop() {
  server.handleClient(); // escucha al celular

  // comportamiento según el estado:
  if (estado == "CAMINANDO") {
    if (distancia() < 20) {
      estado = "PARADO"; // ¡obstáculo! se detiene solo
      Serial.println("Obstaculo: me detengo");
    } else {
      darPaso(); // sigue caminando
    }
  }
}` } },
            { tip: { icon: "🚀", text: "Plan realista: (1) arma 1 pata y haz que se mueva. (2) Logra que las 4 patas den un paso. (3) Agrega el control WiFi. (4) Suma el ultrasónico. Un paso a la vez: así llegan los robots de verdad. ¡Ya tienes todo lo necesario para empezar!" } },
        ],
        practice: [
            {
                title: "Tu plan de construcción",
                goal: "Ordena las fases para construir la araña sin frustrarte (de lo más simple a lo completo).",
                steps: ["Piensa qué probar primero para no atascarte"],
                solution: `FASE 1 — Una pata
  Conecta 2 servos y haz que una pata se levante,
  adelante y baje. (Lección de servos.)

FASE 2 — Las 4 patas
  Monta las 8 servos en el chasis y programa un paso
  de marcha diagonal estable. (Lección de anatomía.)

FASE 3 — Control WiFi
  Agrega el servidor web: que camine/pare desde el
  celular. (Lección del servidor.)

FASE 4 — Sentidos
  Suma el ultrasónico: que se detenga solo ante
  obstáculos. (Lección del ultrasónico.)

FASE 5 — Pulido
  Energía estable (batería aparte + GND común),
  ajustar ángulos, y opcional IMU para equilibrio.

// Cada fase funciona sola antes de pasar a la siguiente.
// Así, si algo falla, sabes EXACTAMENTE dónde buscar.` },
        ],
        quiz: [
            { q: "¿Cuál es la mejor estrategia para construir la araña?", opts: ["Armar todo de golpe y probar al final", "Ir por fases: una pata, luego las 4, luego WiFi, luego sensores", "Empezar por el WiFi", "No probar nada"], correct: 1, fb: "Por fases: cada parte funciona antes de sumar la siguiente. Así depuras fácil." },
            { q: "En el código final, cuando el ultrasónico detecta algo a <20 cm, el robot...", opts: ["Acelera", "Cambia su estado a PARADO y se detiene", "Se apaga", "Se conecta a otra red"], correct: 1, fb: "La máquina de estados pasa a PARADO: deja de dar pasos. ¡No choca!" },
            { q: "¿De dónde viene cada pieza del código integrador?", opts: ["Se inventan nuevas", "De las lecciones previas (servos, ultrasónico, servidor web, estados)", "De internet al azar", "No se sabe"], correct: 1, fb: "El proyecto solo UNE lo que ya aprendiste lección por lección." },
        ],
    },
];

const MODS = [
    { name: "Electrónica", sub: "Los cimientos", icon: Zap },
    { name: "El cerebro", sub: "Microcontroladores (ESP32)", icon: Cpu },
    { name: "Los sentidos", sub: "Sensores", icon: Gauge },
    { name: "Los músculos", sub: "Motores y energía", icon: Cog },
    { name: "Conexión Iron Man", sub: "IoT y WiFi", icon: Wifi },
    { name: "Construye la araña", sub: "Robótica aplicada", icon: Bot },
];

const RANKS = [
    { min: 0, name: "Aprendiz de taller" },
    { min: 400, name: "Técnico" },
    { min: 900, name: "Maker" },
    { min: 1400, name: "Ingeniero" },
    { min: 1900, name: "Tony Stark" },
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
                const ci = line.indexOf("//");
                if (ci >= 0) {
                    return <div key={i}><span>{line.slice(0, ci)}</span><span className="cmt">{line.slice(ci)}</span></div>;
                }
                return <div key={i}>{line || "\u00A0"}</div>;
            })}</pre>
        </div>
    );
}

function Theory({ blocks }) {
    return blocks.map((b, i) => {
        if (b.p) return <p key={i} className="rb-p">{b.p}</p>;
        if (b.h) return <h3 key={i} className="rb-h3">{b.h}</h3>;
        if (b.code) return <CodeBlock key={i} {...b.code} />;
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
            {open && <CodeBlock code={ex.solution} file="solucion.txt" />}
        </div>
    );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
.rb{ min-height:100vh; width:100%; font-family:'Inter',system-ui,sans-serif; color:#f3ece6;
  background:radial-gradient(900px 500px at 80% -10%, rgba(255,90,31,.15), transparent 60%),
             radial-gradient(700px 400px at 0% 110%, rgba(255,182,39,.08), transparent 55%), #120d0a; }
.rb *{ box-sizing:border-box; }
.rb-wrap{ max-width:880px; margin:0 auto; padding:38px 22px 90px; }
.rb-head{ text-align:center; margin-bottom:8px; }
.rb-kick{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:4px; color:#9a8576; }
.rb-title{ font-size:42px; font-weight:800; letter-spacing:-1px; margin:6px 0; text-transform:uppercase; }
.rb-title b{ color:#ff5a1f; text-shadow:0 0 26px rgba(255,90,31,.45); }
.rb-sub{ color:#a89a8e; font-size:15px; max-width:580px; margin:0 auto; }
.rb-rank{ display:flex; gap:14px; align-items:center; justify-content:center; margin:22px auto; flex-wrap:wrap; }
.rb-rbox{ display:flex; align-items:center; gap:10px; border:1px solid #2a2018; background:#1a120d; border-radius:12px; padding:10px 15px; }
.rb-rl{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:2px; color:#9a8576; }
.rb-rn{ font-size:16px; font-weight:700; }
.rb-bar{ width:200px; height:8px; border-radius:99px; background:#1a120d; border:1px solid #2a2018; overflow:hidden; }
.rb-bar i{ display:block; height:100%; background:linear-gradient(90deg,#ff5a1f,#ffb627); transition:width .6s; }
.rb-modh{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:#ff5a1f;
  margin:30px 0 12px; display:flex; align-items:center; gap:9px; text-transform:uppercase; }
.rb-modh .ms{ color:#9a8576; letter-spacing:0; text-transform:none; font-size:12px; }
.rb-list-lessons{ display:flex; flex-direction:column; gap:10px; }
.rb-lcard{ display:flex; align-items:center; gap:15px; cursor:pointer; border:1px solid #271c14; border-radius:14px;
  padding:15px 17px; background:linear-gradient(180deg,#1c130d,#150e09); transition:.16s; text-align:left; width:100%; color:inherit; font-family:inherit; }
.rb-lcard:hover{ transform:translateX(4px); border-color:#ff5a1f; }
.rb-lico{ width:42px; height:42px; border-radius:11px; flex:none; display:grid; place-items:center;
  background:rgba(255,90,31,.1); border:1px solid #2a2018; color:#ff5a1f; }
.rb-lcard.done .rb-lico{ background:rgba(92,200,138,.13); border-color:#5cc88a; color:#5cc88a; }
.rb-lm{ flex:1; min-width:0; }
.rb-lt{ font-size:15.5px; font-weight:700; }
.rb-li{ font-size:13px; color:#a89a8e; margin-top:2px; }
.rb-lmeta{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#9a8576; flex:none; }
.rb-back{ display:inline-flex; align-items:center; gap:6px; background:none; border:none; color:#a89a8e;
  font-family:'JetBrains Mono',monospace; font-size:12px; cursor:pointer; padding:6px 0; margin-bottom:6px; }
.rb-back:hover{ color:#ff5a1f; }
.rb-lhead h2{ font-size:30px; font-weight:800; letter-spacing:-.5px; margin:4px 0 8px; }
.rb-badge{ display:inline-block; font-family:'JetBrains Mono',monospace; font-size:11px; color:#ff5a1f;
  background:rgba(255,90,31,.1); border:1px solid #2a2018; padding:3px 10px; border-radius:99px; }
.rb-intro{ background:#1a120d; border-left:4px solid #ff5a1f; border-radius:4px 12px 12px 4px;
  padding:15px 18px; margin:16px 0; color:#d8cabd; font-size:15px; line-height:1.6; }
.rb-secl{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:#9a8576;
  margin:26px 0 10px; display:flex; align-items:center; gap:8px; text-transform:uppercase; }
.rb-p{ font-size:15px; line-height:1.7; color:#d8cabd; margin:12px 0; }
.rb-h3{ font-size:17px; font-weight:700; margin:22px 0 4px; color:#f3ece6; }
.rb-term{ background:#0c0805; border:1px solid #271c14; border-radius:12px; overflow:hidden; margin:14px 0; }
.rb-term-h{ background:rgba(255,255,255,.03); padding:9px 13px; border-bottom:1px solid #271c14; display:flex; gap:7px; align-items:center; }
.rb-term-h .d{ width:11px; height:11px; border-radius:50%; } .d.r{ background:#ff5f56; } .d.y{ background:#ffbd2e; } .d.g{ background:#27c93f; }
.rb-file{ margin-left:8px; font-family:'JetBrains Mono',monospace; font-size:11px; color:#9a8576; }
.rb-term pre{ margin:0; padding:16px; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.6;
  color:#e6dccf; overflow-x:auto; } .rb-term pre .cmt{ color:#9a8576; font-style:italic; }
.rb-tip{ background:rgba(255,182,39,.07); border-left:4px solid #ffb627; border-radius:4px 10px 10px 4px;
  padding:13px 16px; margin:16px 0; display:flex; gap:12px; align-items:flex-start; font-size:14px; line-height:1.55; color:#e0d3c4; }
.rb-tip-i{ font-size:18px; flex:none; }
.rb-list{ margin:12px 0; padding-left:4px; list-style:none; display:flex; flex-direction:column; gap:7px; }
.rb-list li{ font-size:14.5px; color:#d8cabd; padding-left:18px; position:relative; line-height:1.5; }
.rb-list li::before{ content:'▸'; position:absolute; left:0; color:#ff5a1f; }
.rb-tablewrap{ overflow-x:auto; border:1px solid #271c14; border-radius:10px; margin:16px 0; }
.rb-table{ width:100%; border-collapse:collapse; font-size:13.5px; }
.rb-table th{ background:#1a120d; color:#ff5a1f; text-align:left; padding:10px 14px; font-size:11px;
  text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #271c14; }
.rb-table td{ padding:10px 14px; border-bottom:1px solid #1f160f; color:#d8cabd; }
.rb-ex{ background:#1a120d; border:1px solid #271c14; border-radius:14px; padding:18px; margin:12px 0; }
.rb-ex-top{ display:flex; align-items:center; gap:10px; }
.rb-ex-n{ background:#ff5a1f; color:#1a0d05; width:24px; height:24px; border-radius:50%; display:grid;
  place-items:center; font-size:13px; font-weight:800; flex:none; }
.rb-ex-goal{ font-size:14.5px; color:#d8cabd; margin:10px 0; line-height:1.55; }
.rb-steps{ margin:8px 0; padding-left:18px; } .rb-steps li{ font-size:13.5px; color:#b3a597; margin:4px 0; }
.rb-reveal{ display:inline-flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:12px;
  color:#ff5a1f; background:rgba(255,90,31,.08); border:1px solid #2a2018; border-radius:8px; padding:7px 13px; cursor:pointer; margin-top:6px; }
.rb-reveal:hover{ background:rgba(255,90,31,.16); }
.rb-quiz{ border:1px solid #2a2018; border-radius:14px; padding:18px; background:#1a120d; margin:12px 0; }
.rb-q{ font-size:15.5px; font-weight:600; margin-bottom:11px; }
.rb-opt{ display:block; width:100%; text-align:left; background:#150e09; border:1px solid #271c14; color:#f3ece6;
  padding:11px 14px; border-radius:10px; margin:6px 0; font-size:14px; cursor:pointer; transition:.14s; font-family:inherit; }
.rb-opt:hover{ border-color:#ff5a1f; }
.rb-opt.ok{ background:rgba(92,200,138,.13); border-color:#5cc88a; color:#aef0c6; }
.rb-opt.no{ background:rgba(255,95,86,.12); border-color:#ff5f56; color:#ffb3ae; }
.rb-fb{ font-size:13.5px; margin-top:9px; line-height:1.5; }
.rb-nav{ display:flex; justify-content:space-between; gap:10px; margin-top:26px; }
.rb-btn{ font-family:'JetBrains Mono',monospace; font-size:13px; padding:11px 17px; border-radius:10px; cursor:pointer;
  border:1px solid #2a2018; background:#1a120d; color:#f3ece6; display:inline-flex; align-items:center; gap:7px; }
.rb-btn:hover:not(:disabled){ border-color:#ff5a1f; } .rb-btn:disabled{ opacity:.3; cursor:default; }
.rb-btn.main{ background:#ff5a1f; color:#1a0d05; border-color:#ff5a1f; font-weight:700; }
.rb-foot{ text-align:center; margin-top:34px; }
.rb-reset{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#ff7b72; background:transparent;
  border:1px solid rgba(255,123,114,.3); border-radius:8px; padding:8px 14px; cursor:pointer; }
.rb-reset:hover{ background:rgba(255,123,114,.1); }
.rb-done-tag{ display:inline-flex; align-items:center; gap:6px; color:#5cc88a; font-family:'JetBrains Mono',monospace; font-size:12px; }
@media(max-width:560px){ .rb-title{ font-size:30px; } .rb-lhead h2{ font-size:24px; } }
`;

export default function App() {
    const saved = loadSave();
    const [open, setOpen] = useState(null);
    const [read, setRead] = useState(saved.read || {});
    const [quiz, setQuiz] = useState(saved.quiz || {});

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
                if (cur[qi] != null) return prev;
                cur[qi] = oi;
                return { ...prev, [les.id]: cur };
            });
        };
        return (
            <div className="rb">
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
                    <div className="rb-kick">// EVOLUTIVE · STARK LAB</div>
                    <h1 className="rb-title">ROBÓTICA & <b>IoT</b></h1>
                    <p className="rb-sub">De no saber nada de electrónica a construir tu propia araña robot controlada por WiFi. Teoría simple, práctica real.</p>
                </div>

                <div className="rb-rank">
                    <div className="rb-rbox">
                        <Bot size={20} color="#ff5a1f" />
                        <div><div className="rb-rl">RANGO</div><div className="rb-rn">{rank.name}</div></div>
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#9a8576", marginBottom: 5 }}>
                            <span>{xp} XP · {completas}/{L.length} lecciones</span>
                            <span>{next ? `→ ${next.name}` : "MÁX"}</span>
                        </div>
                        <div className="rb-bar"><i style={{ width: pct + "%" }} /></div>
                    </div>
                </div>

                {MODS.map((m) => {
                    const lessons = L.map((l, i) => ({ l, i })).filter(({ l }) => l.mod === m.name);
                    return (
                        <div key={m.name}>
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
                        if (window.confirm("¿Reiniciar el progreso de Robótica & IoT?")) { setRead({}); setQuiz({}); }
                    }}>
                        <RotateCcw size={11} style={{ verticalAlign: "-1px", marginRight: 5 }} /> Reiniciar progreso
                    </button>
                </div>
            </div>
        </div>
    );
}