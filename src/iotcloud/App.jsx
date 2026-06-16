import React, { useState, useEffect } from "react";
import {
    Cloud, BookOpen, Check, ChevronLeft, ChevronRight, Eye, EyeOff, Award, Star,
    Radio, Database, BarChart3, ShieldCheck, BatteryCharging,
    Network, Cable, RotateCcw, Play, Workflow,
} from "lucide-react";

/* ============================================================
   CLOUD GRID — IoT en la Nube (nivel profesional)
   Continuación de "Robótica & IoT". Asume que ya sabes ESP32,
   sensores y WiFi. Aquí: MQTT, nube, datos, dashboards,
   seguridad y bajo consumo.
   Progreso en localStorage (iotcloud_progress_v1).
   ============================================================ */

const SAVE_KEY = "iotcloud_progress_v1";

const L = [
    /* ============== MÓDULO 1: COMUNICACIÓN PROFESIONAL ============== */
    {
        id: "ic_local", mod: "Comunicación", icon: Network, mins: "20 min",
        title: "El salto: de tu red local a internet",
        intro: "En el mundo anterior controlabas tu robot SOLO si tu celular estaba en la misma red WiFi. El IoT profesional rompe esa barrera: controlas y monitoreas desde cualquier parte del mundo. Veamos por qué eso es difícil y cómo se resuelve.",
        theory: [
            { h: "El problema de tu proyecto local" },
            { p: "Tu servidor web en el ESP32 funcionaba porque tu celular y el robot estaban en la misma red. Pero si sales de casa, tu celular ya no 've' al ESP32. Las redes domésticas están protegidas por el router (NAT/firewall): nadie de afuera puede entrar directo. Eso es bueno para la seguridad, pero estorba para el IoT." },
            { h: "La solución: un intermediario en la nube" },
            { p: "En vez de que tu celular hable DIRECTO con el robot, ambos hablan con un servidor en internet (la nube) que siempre está disponible. El robot le manda sus datos a la nube; tu celular los lee de la nube. Nadie necesita 'entrar' a la red del otro." },
            { code: { file: "modelo.txt", code: "MODELO LOCAL (mundo anterior):\n   Celular --WiFi local--> ESP32\n   (solo funciona en la misma red)\n\nMODELO EN LA NUBE (profesional):\n   ESP32 --internet--> [ NUBE ] <--internet-- Celular\n   (funciona desde cualquier parte del mundo)\n\n// Ambos se conectan HACIA AFUERA, a la nube.\n// Por eso ninguno necesita una IP publica ni abrir\n// puertos en el router. Ese es el truco." } },
            { tip: { icon: "🌍", text: "Esta es LA diferencia entre un proyecto de escuela y un producto IoT real: la nube. Foco inteligente, pulsera fitness, cámara remota... todos usan este modelo." } },
        ],
        practice: [
            {
                title: "Diagnostica el caso",
                goal: "Tienes tu robot en casa y quieres ver su batería desde la escuela. ¿Por qué NO sirve tu servidor web local y qué necesitas?",
                steps: ["Piensa quién puede 'ver' a quién entre redes distintas"],
                solution: "POR QUE NO SIRVE:\nTu robot esta detras del router de tu casa. Desde la\nescuela (otra red), tu celular no puede entrar a la\nred de tu casa: el router lo bloquea por seguridad.\n\nQUE NECESITAS:\nUn intermediario en la nube. El robot publica su\nbateria en la nube; tu la lees desde la nube. Los dos\nse conectan HACIA AFUERA, asi que el router no estorba." },
        ],
        quiz: [
            { q: "¿Por qué tu servidor web local no funciona desde fuera de casa?", opts: ["Porque el ESP32 se apaga", "Porque el router protege la red y no deja entrar de afuera", "Porque el WiFi es lento", "Porque falta batería"], correct: 1, fb: "El router (NAT/firewall) bloquea conexiones entrantes; por eso se usa la nube." },
            { q: "En el modelo de nube, el ESP32 y el celular...", opts: ["Se conectan directo entre ellos", "Ambos se conectan hacia afuera, a un servidor en internet", "No usan internet", "Necesitan estar pegados"], correct: 1, fb: "Los dos hablan con la nube; ninguno necesita entrar a la red del otro." },
        ],
    },
    {
        id: "ic_mqtt", mod: "Comunicación", icon: Radio, mins: "35 min",
        title: "MQTT: el idioma del IoT",
        intro: "MQTT es EL protocolo estrella del IoT. Es ligero (ideal para dispositivos chiquitos), rápido y está diseñado para miles de aparatos hablando a la vez. Si dominas esto, hablas el idioma profesional del IoT.",
        theory: [
            { h: "La idea: publicar y suscribirse (como un periódico)" },
            { p: "MQTT funciona como una revista por secciones. Un dispositivo PUBLICA información en un 'tema' (topic). Otros se SUSCRIBEN a ese tema y reciben todo lo que se publique ahí. No se hablan directo: todo pasa por un intermediario llamado broker." },
            { table: {
                    head: ["Pieza", "Qué es", "Analogía"],
                    rows: [
                        ["Broker", "El servidor central que reparte mensajes", "La oficina de correos"],
                        ["Publisher", "Quien envía datos a un tema", "Quien manda una carta"],
                        ["Subscriber", "Quien recibe los datos de un tema", "Quien recibe la carta"],
                        ["Topic", "La 'dirección' del mensaje", "El buzón / dirección"],
                    ] } },
            { h: "Los topics: como carpetas con /" },
            { code: { file: "topics.txt", code: "Un topic se organiza con barras, como carpetas:\n\n  casa/sala/temperatura\n  casa/cocina/humo\n  robot/arana/bateria\n  robot/arana/comando\n\n// El ESP32 PUBLICA su bateria en:   robot/arana/bateria\n// Tu app se SUSCRIBE a ese topic y recibe el valor.\n// Tu app PUBLICA un comando en:     robot/arana/comando\n// El ESP32 se suscribe y obedece." } },
            { h: "Código: el ESP32 publicando con MQTT" },
            { code: { file: "mqtt_esp32.ino", code: "#include <WiFi.h>\n#include <PubSubClient.h> // libreria MQTT\n\nWiFiClient espClient;\nPubSubClient cliente(espClient);\n\nconst char* broker = \"broker.hivemq.com\"; // broker publico gratis\nconst char* topic  = \"robot/arana/bateria\";\n\nvoid setup() {\n  WiFi.begin(\"MI_WIFI\", \"MI_CLAVE\");\n  while (WiFi.status() != WL_CONNECTED) delay(500);\n\n  cliente.setServer(broker, 1883); // puerto MQTT estandar\n  while (!cliente.connected()) {\n    cliente.connect(\"esp32-arana-01\"); // un ID unico\n  }\n}\n\nvoid loop() {\n  cliente.loop();\n\n  int bateria = 85; // (aqui leerias el valor real)\n  cliente.publish(topic, String(bateria).c_str());\n\n  delay(5000); // publica cada 5 segundos\n}" } },
            { tip: { icon: "📡", text: "broker.hivemq.com es un broker público y gratis, perfecto para aprender y probar. Para un producto real usarías uno privado y con seguridad (lo veremos en el módulo de seguridad)." } },
        ],
        practice: [
            {
                title: "Diseña tus topics",
                goal: "Tu araña debe reportar batería y distancia, y recibir comandos de movimiento. Diseña los 3 topics.",
                steps: ["Usa una estructura tipo carpeta robot/arana/..."],
                solution: "robot/arana/bateria     <- ESP32 PUBLICA (su bateria)\nrobot/arana/distancia   <- ESP32 PUBLICA (ultrasonico)\nrobot/arana/comando     <- App PUBLICA, ESP32 SE SUSCRIBE\n\n// Buen habito: datos que SALEN del robot van en topics\n// de \"estado\"; ordenes que ENTRAN van en topics de\n// \"comando\". Asi nunca te confundes quien publica que." },
            {
                title: "Suscribirse a comandos",
                goal: "Completa: el ESP32 debe SUSCRIBIRSE al topic de comandos para obedecer al celular.",
                steps: ["Usa cliente.subscribe(topic)", "Define una función callback que reaccione al mensaje"],
                solution: "const char* topicComando = \"robot/arana/comando\";\n\n// Esta funcion se ejecuta cuando LLEGA un mensaje\nvoid alRecibir(char* topic, byte* payload, unsigned int len) {\n  String msg = \"\";\n  for (int i = 0; i < len; i++) msg += (char)payload[i];\n\n  if (msg == \"adelante\") { /* mover servos */ }\n  if (msg == \"parar\")    { /* detener */ }\n}\n\nvoid setup() {\n  // ...conexion WiFi y broker...\n  cliente.setCallback(alRecibir);    // registra la funcion\n  cliente.subscribe(topicComando);   // se suscribe\n}" },
        ],
        quiz: [
            { q: "En MQTT, el 'broker' es...", opts: ["El sensor", "El servidor central que reparte los mensajes", "La batería", "El cable"], correct: 1, fb: "El broker es el intermediario: recibe lo publicado y lo entrega a los suscritos." },
            { q: "Publicar/suscribirse en MQTT se parece a...", opts: ["Llamar por teléfono directo", "Suscribirse a secciones de una revista", "Soldar cables", "Cargar una batería"], correct: 1, fb: "Publicas en un topic; quien esté suscrito a ese topic lo recibe." },
            { q: "Un 'topic' como robot/arana/bateria es...", opts: ["Un tipo de batería", "La 'dirección' del mensaje (como una carpeta)", "Un sensor", "Un error"], correct: 1, fb: "El topic organiza los mensajes como carpetas con /." },
        ],
    },
    {
        id: "ic_proto", mod: "Comunicación", icon: Cable, mins: "20 min",
        title: "MQTT vs HTTP (y cuándo usar cada uno)",
        intro: "MQTT no es el único protocolo. HTTP (el de las páginas web) también se usa en IoT. Saber cuándo usar cada uno es lo que distingue a alguien que de verdad entiende el tema.",
        theory: [
            { table: {
                    head: ["", "MQTT", "HTTP"],
                    rows: [
                        ["Estilo", "Publicar/suscribir", "Pedir/responder"],
                        ["Peso", "Súper ligero", "Más pesado"],
                        ["Tiempo real", "Excelente", "Regular"],
                        ["Ideal para", "Sensores constantes", "Pedir un dato puntual"],
                        ["Batería", "Muy eficiente", "Consume más"],
                    ] } },
            { h: "Regla práctica" },
            { list: [
                    "Usa MQTT cuando los datos fluyen seguido y en tiempo real (un sensor que reporta cada segundo, control de un robot).",
                    "Usa HTTP cuando haces peticiones puntuales (consultar el clima una vez, enviar un dato a una API web, subir un archivo).",
                    "Muchos productos reales usan LOS DOS: MQTT para el flujo de sensores, HTTP para configuración y reportes.",
                ] },
            { tip: { icon: "🔌", text: "También existe WebSocket (tiempo real sobre web) y CoAP (ultra ligero). Pero con MQTT + HTTP cubres el 95% de lo que necesitas. No te satures: domina estos dos primero." } },
        ],
        practice: [
            {
                title: "Elige el protocolo",
                goal: "¿MQTT o HTTP para cada caso?",
                steps: ["1) Un sensor de temperatura que reporta cada 2 segundos", "2) Tu app consulta UNA vez el pronóstico del clima", "3) Controlar un robot en tiempo real"],
                solution: "1) Temperatura cada 2s   -> MQTT\n   (flujo constante, tiempo real, ligero)\n\n2) Clima una sola vez    -> HTTP\n   (peticion puntual a una API web)\n\n3) Robot en tiempo real  -> MQTT\n   (respuesta inmediata, comandos frecuentes)" },
        ],
        quiz: [
            { q: "Para un sensor que reporta datos cada segundo, conviene...", opts: ["HTTP", "MQTT", "Ninguno", "Solo cable USB"], correct: 1, fb: "MQTT es ligero y en tiempo real: ideal para flujo constante de sensores." },
            { q: "HTTP es mejor para...", opts: ["Flujo constante de sensores", "Peticiones puntuales (consultar un dato una vez)", "Ahorrar batería al máximo", "Tiempo real estricto"], correct: 1, fb: "HTTP brilla en pedir/responder puntual, como llamar a una API." },
        ],
    },

    /* ============== MÓDULO 2: LA NUBE Y LOS DATOS ============== */
    {
        id: "ic_cloud", mod: "Nube y datos", icon: Cloud, mins: "25 min",
        title: "¿Qué es 'la nube' en IoT?",
        intro: "Todos dicen 'la nube' pero pocos saben qué es. Aquí lo desmitificamos: la nube son computadoras de alguien más, siempre encendidas, que tu dispositivo usa para guardar datos, procesarlos y mostrarlos.",
        theory: [
            { h: "La nube sin misterio" },
            { p: "La nube es simplemente servidores (computadoras potentes) que viven en centros de datos y están disponibles 24/7 por internet. En vez de tener tu propio servidor encendido en casa, rentas un pedacito del de alguien más (Amazon, Google, Microsoft) y solo pagas lo que usas." },
            { h: "Qué hace la nube por tu proyecto IoT" },
            { table: {
                    head: ["Función", "Ejemplo en tu robot"],
                    rows: [
                        ["Recibir datos", "El broker MQTT que recibe la batería"],
                        ["Guardar datos", "Una base de datos con el historial"],
                        ["Procesar", "Calcular promedios, detectar fallas"],
                        ["Mostrar", "Un dashboard con gráficas"],
                        ["Alertar", "Mandarte un correo si la batería baja"],
                    ] } },
            { h: "Plataformas IoT listas para usar" },
            { p: "No tienes que construir todo desde cero. Hay plataformas que ya traen broker, base de datos y dashboards juntos. Para empezar, las más amigables son:" },
            { list: [
                    "ThingSpeak — súper fácil, ideal para aprender y graficar sensores.",
                    "Adafruit IO — amigable, con dashboards bonitos y MQTT.",
                    "Blynk — excelente para apps de celular sin programar la app.",
                    "AWS IoT / Google Cloud — nivel profesional/industrial (más complejos).",
                ] },
            { tip: { icon: "☁️", text: "Empieza con ThingSpeak o Adafruit IO: son gratis para proyectos pequeños y te dan broker + base de datos + gráficas sin instalar nada. Cuando domines el concepto, saltas a AWS si lo necesitas." } },
        ],
        practice: [
            {
                title: "Mapea las funciones de la nube",
                goal: "Tu araña manda su batería cada 5 segundos. Di qué función de la nube se encarga de cada cosa.",
                steps: ["1) Que llegue el dato", "2) Guardar el historial del día", "3) Ver una gráfica de la batería", "4) Avisarte si baja de 20%"],
                solution: "1) Que llegue el dato        -> Recibir (broker MQTT)\n2) Guardar el historial      -> Base de datos\n3) Ver la grafica            -> Dashboard\n4) Avisarte si baja de 20%   -> Alerta (regla + correo)\n\n// Una plataforma como ThingSpeak o Adafruit IO\n// te da TODAS estas funciones juntas, sin montar\n// tu propio servidor." },
        ],
        quiz: [
            { q: "'La nube' es, sin misterio...", opts: ["Vapor de agua", "Servidores de alguien más, encendidos 24/7, que usas por internet", "Un tipo de sensor", "Una batería grande"], correct: 1, fb: "Son computadoras en centros de datos que rentas y usas por internet." },
            { q: "¿Cuál plataforma es ideal para EMPEZAR a graficar sensores?", opts: ["AWS IoT (industrial)", "ThingSpeak o Adafruit IO", "Ninguna existe", "Solo Excel"], correct: 1, fb: "ThingSpeak/Adafruit IO son gratis y fáciles: broker + datos + gráficas listos." },
        ],
    },
    {
        id: "ic_db", mod: "Nube y datos", icon: Database, mins: "25 min",
        title: "Bases de datos: guardar el historial",
        intro: "Un dato que llega y se pierde no sirve de mucho. Guardarlo te deja ver tendencias, detectar fallas y tomar decisiones. Aquí entiendes cómo se almacenan los datos de IoT.",
        theory: [
            { h: "¿Por qué guardar los datos?" },
            { p: "Saber que la batería está en 85% AHORA está bien. Pero ver que bajó de 100% a 20% en 2 horas te dice que algo consume de más. El valor del IoT está en el historial: las tendencias cuentan la historia real." },
            { h: "Datos de series de tiempo (time-series)" },
            { p: "Los datos de IoT casi siempre son 'series de tiempo': un valor + el momento exacto en que se midió. Por eso existen bases de datos especializadas en esto, súper eficientes para guardar millones de lecturas con su fecha/hora." },
            { code: { file: "ejemplo_datos.txt", code: "Asi se ve una tabla de datos IoT (time-series):\n\n  fecha_hora            sensor        valor\n  -----------------------------------------\n  2026-06-15 10:00:01   bateria       100\n  2026-06-15 10:00:06   bateria        98\n  2026-06-15 10:00:11   bateria        95\n  2026-06-15 10:00:16   distancia      42\n  ...\n\n// Cada fila = una medicion con su momento exacto.\n// Con esto puedes graficar la bateria a lo largo\n// del tiempo y ver la tendencia." } },
            { table: {
                    head: ["Tipo de BD", "Para qué", "Ejemplos"],
                    rows: [
                        ["Series de tiempo", "Lecturas de sensores con fecha", "InfluxDB"],
                        ["SQL", "Datos estructurados, relaciones", "MySQL, Postgres"],
                        ["NoSQL", "Datos flexibles, gran escala", "MongoDB, Firebase"],
                    ] } },
            { tip: { icon: "🗄️", text: "Para empezar no necesitas montar una base de datos: ThingSpeak y Adafruit IO ya guardan tu historial automáticamente. Cuando crezcas a algo serio, InfluxDB es el estándar para sensores." } },
        ],
        practice: [
            {
                title: "¿Por qué el historial importa?",
                goal: "Tu robot reinicia solo a veces. ¿Cómo te ayudaría tener guardado el historial de batería a encontrar la causa?",
                steps: ["Piensa qué patrón buscarías en los datos viejos"],
                solution: "Con el historial podrias ver la grafica de bateria\njusto ANTES de cada reinicio.\n\nSi notas que el voltaje cae en picada justo cuando\nlos servos se mueven todos juntos, !ahi esta la causa!:\nla bateria no aguanta el pico de corriente.\n\n// Sin historial, solo adivinas. Con datos guardados,\n// detectas el patron y diagnosticas de verdad.\n// (Justo el problema de energia del mundo anterior.)" },
        ],
        quiz: [
            { q: "Los datos de IoT suelen ser 'series de tiempo' porque...", opts: ["Son aleatorios", "Son un valor + el momento exacto en que se midió", "No tienen fecha", "Son solo texto"], correct: 1, fb: "Cada lectura va con su fecha/hora; eso permite graficar tendencias." },
            { q: "¿Para qué sirve guardar el historial de un sensor?", opts: ["Para nada", "Para ver tendencias, detectar fallas y decidir mejor", "Para gastar batería", "Para que sea más lento"], correct: 1, fb: "El historial revela patrones que un solo dato no muestra." },
        ],
    },
    {
        id: "ic_dash", mod: "Nube y datos", icon: BarChart3, mins: "30 min",
        title: "Dashboards: ver tus datos en vivo",
        intro: "Un dashboard es el tablero de control: gráficas, indicadores y botones que muestran lo que pasa con tus dispositivos en tiempo real. Es la cara visible de tu proyecto IoT y lo que impresiona a quien lo ve.",
        theory: [
            { h: "¿Qué es un dashboard?" },
            { p: "Es una pantalla (web o app) que muestra tus datos de forma visual: la batería como una barra, la temperatura como una gráfica, un botón para mover el robot. En vez de números sueltos en una consola, ves todo de un vistazo, bonito y entendible." },
            { h: "Qué cosas pones en un dashboard" },
            { list: [
                    "Gráficas de línea — para ver un valor a lo largo del tiempo (batería, temperatura).",
                    "Indicadores (gauges) — para el valor actual de un vistazo (velocidad, nivel).",
                    "Tarjetas de número grande — un dato clave destacado.",
                    "Botones e interruptores — para enviar comandos (encender, mover).",
                    "Mapas — si el dispositivo se mueve y tiene GPS.",
                ] },
            { h: "Cómo se conecta con tu ESP32" },
            { code: { file: "flujo_dashboard.txt", code: "   ESP32 --publica MQTT--> [ Plataforma nube ]\n                                   |\n                                   +- guarda en base de datos\n                                   +- alimenta el DASHBOARD\n                                          |\n                                          v\n                              Tu lo ves desde el celular\n                              o cualquier navegador, en vivo.\n\n// En plataformas como Adafruit IO o Blynk, ARRASTRAS\n// los widgets (grafica, boton) y los conectas a tus\n// topics MQTT. Sin programar la interfaz a mano." } },
            { tip: { icon: "📊", text: "Herramientas de dashboards: Adafruit IO y Blynk (arrastrar y soltar, fácil), Grafana (profesional, gráficas hermosas), o uno hecho por ti con React (¡tu especialidad!) leyendo de la nube. Esa última opción se ve increíble en un portafolio." } },
        ],
        practice: [
            {
                title: "Diseña el dashboard de tu araña",
                goal: "Elige qué widget usarías para mostrar cada dato del robot.",
                steps: ["1) Batería actual", "2) Historial de distancia del sensor", "3) Mover el robot", "4) Estado actual (parado/caminando)"],
                solution: "1) Bateria actual          -> Indicador (gauge) o barra\n2) Historial de distancia  -> Grafica de linea\n3) Mover el robot          -> Botones (adelante/parar)\n4) Estado actual           -> Tarjeta de texto grande\n\n// Tip de portafolio: como ya dominas React, podrias\n// construir TU este dashboard leyendo los datos de la\n// nube por MQTT (con MQTT.js) o por HTTP. Eso une tus\n// dos mundos: software y IoT." },
        ],
        quiz: [
            { q: "Un dashboard sirve para...", opts: ["Soldar cables", "Ver tus datos de forma visual y en tiempo real", "Cargar la batería", "Conectarse al WiFi"], correct: 1, fb: "Es el tablero visual: gráficas, indicadores y botones de tus dispositivos." },
            { q: "Para mostrar un valor a lo largo del tiempo (como la batería bajando) usas...", opts: ["Un botón", "Una gráfica de línea", "Un mapa", "Un interruptor"], correct: 1, fb: "La gráfica de línea muestra la evolución del valor en el tiempo." },
        ],
    },

    /* ============== MÓDULO 3: NIVEL PROFESIONAL ============== */
    {
        id: "ic_sec", mod: "Nivel pro", icon: ShieldCheck, mins: "30 min",
        title: "Seguridad IoT (lo que casi nadie hace bien)",
        intro: "Un dispositivo conectado a internet sin seguridad es una puerta abierta. La seguridad IoT es un campo entero (y conecta directo con tu interés en ciberseguridad). Esto es lo que separa un juguete de un producto serio.",
        theory: [
            { h: "Por qué importa tanto" },
            { p: "Si tu robot está en internet sin protección, cualquiera podría tomar control, leer tus datos o usar tu dispositivo para atacar a otros. Han pasado ataques masivos reales usando cámaras y focos IoT inseguros como ejército de bots. La seguridad no es opcional." },
            { h: "Las defensas básicas que SÍ o SÍ debes usar" },
            { table: {
                    head: ["Defensa", "Qué hace"],
                    rows: [
                        ["Cifrado (TLS/SSL)", "Vuelve ilegibles los datos en tránsito"],
                        ["Autenticación", "Solo dispositivos con credenciales entran"],
                        ["Contraseñas únicas", "Nunca dejar la clave de fábrica"],
                        ["Actualizaciones (OTA)", "Parchar fallos sin desarmar el aparato"],
                        ["Mínimos privilegios", "Cada dispositivo solo accede a lo suyo"],
                    ] } },
            { h: "MQTT seguro en la práctica" },
            { code: { file: "mqtt_seguro.txt", code: "MQTT inseguro (solo para aprender):\n   puerto 1883, sin cifrado, sin usuario.\n   -> cualquiera en el broker ve tus mensajes.\n\nMQTT seguro (producto real):\n   puerto 8883 con TLS (cifrado)\n   + usuario y contrasena\n   + (ideal) certificados por dispositivo\n\n// En el ESP32, usas WiFiClientSecure en vez de\n// WiFiClient, y le das el certificado del broker.\n// Cambia 1883 -> 8883." } },
            { tip: { icon: "🛡️", text: "Esto conecta perfecto con tu interés en ciberseguridad: la seguridad IoT (probar dispositivos, encontrar fallos) es una especialidad muy demandada. Tu mundo de CyberLab + este = combinación poderosa para un CV." } },
        ],
        practice: [
            {
                title: "Audita un dispositivo",
                goal: "Un foco IoT usa el puerto 1883 sin cifrado, con la contraseña 'admin' de fábrica. Lista 3 riesgos y sus arreglos.",
                steps: ["Piensa en datos espiados, acceso no autorizado, y la clave"],
                solution: "RIESGO 1: Sin cifrado (1883)\n  -> Cualquiera en la red ve y modifica los mensajes.\n  ARREGLO: usar TLS en el puerto 8883.\n\nRIESGO 2: Contrasena de fabrica 'admin'\n  -> Es la primera que prueba un atacante.\n  ARREGLO: contrasena unica y fuerte por dispositivo.\n\nRIESGO 3: Sin autenticacion real\n  -> Cualquier aparato puede conectarse al broker.\n  ARREGLO: usuario/clave o certificados por dispositivo.\n\n// Estos 3 fallos son los mas comunes en IoT real.\n// Revisarlos es, literalmente, trabajo de ciberseguridad." },
        ],
        quiz: [
            { q: "¿Por qué la seguridad IoT es crítica?", opts: ["No lo es", "Un dispositivo expuesto puede ser controlado o usado para atacar a otros", "Solo gasta batería", "Hace el WiFi más lento"], correct: 1, fb: "Dispositivos inseguros han formado ejércitos de bots en ataques reales." },
            { q: "Para cifrar la comunicación MQTT usas...", opts: ["El puerto 1883 sin más", "TLS en el puerto 8883", "Apagar el WiFi", "Una batería más grande"], correct: 1, fb: "TLS (puerto 8883) cifra los datos; 1883 va en texto plano." },
            { q: "Un error gravísimo de seguridad muy común es...", opts: ["Usar contraseña única", "Dejar la contraseña de fábrica", "Actualizar el firmware", "Cifrar los datos"], correct: 1, fb: "Las claves de fábrica son lo primero que prueba un atacante." },
        ],
    },
    {
        id: "ic_power", mod: "Nivel pro", icon: BatteryCharging, mins: "25 min",
        title: "Bajo consumo: que dure meses con una pila",
        intro: "Un sensor IoT real no puede estar enchufado siempre. Lograr que dure meses (o años) con una pila pequeña es un arte: el 'deep sleep'. Esto es lo que hace viable un producto IoT de verdad.",
        theory: [
            { h: "El problema del consumo" },
            { p: "Tu ESP32 con WiFi encendido todo el tiempo se come una pila en horas. Pero la mayoría de los sensores no necesitan reportar cada segundo: un sensor de humedad de plantas con reportar cada hora basta. La clave es: dormir casi todo el tiempo y despertar solo para trabajar." },
            { h: "Deep Sleep: dormir profundamente" },
            { p: "El ESP32 tiene un modo 'deep sleep' donde apaga casi todo y consume poquísimo (microamperios). Despierta, hace su tarea en segundos, manda el dato, y vuelve a dormir. Así una pila dura meses en vez de horas." },
            { code: { file: "deep_sleep.ino", code: "// Dormir 1 hora = 3600 segundos\n#define SEGUNDOS_DORMIR 3600\n#define uS_POR_SEGUNDO 1000000ULL\n\nvoid setup() {\n  // 1. Despierta y hace su trabajo rapido:\n  //    conectar WiFi, leer sensor, publicar por MQTT.\n  leerYEnviarDato();\n\n  // 2. Programa la proxima despertada y se duerme:\n  esp_sleep_enable_timer_wakeup(SEGUNDOS_DORMIR * uS_POR_SEGUNDO);\n  esp_deep_sleep_start(); // entra en sueno profundo\n}\n\nvoid loop() {\n  // En deep sleep, loop() ni se usa: al despertar,\n  // el ESP32 reinicia y vuelve a ejecutar setup().\n}" } },
            { tip: { icon: "🔋", text: "Trucos extra de ahorro: apagar el WiFi cuando no lo usas, bajar la frecuencia del procesador, y usar componentes de bajo consumo. Un buen diseño puede pasar de durar 8 horas a durar 6 meses con la misma pila." } },
            { h: "El balance: frecuencia vs duración" },
            { list: [
                    "Reportar cada segundo → datos muy frescos, pero la pila dura poco.",
                    "Reportar cada hora → la pila dura meses, suficiente para muchos sensores.",
                    "El arte está en elegir la mínima frecuencia que tu proyecto necesita.",
                ] },
        ],
        practice: [
            {
                title: "Calcula la estrategia",
                goal: "Un sensor de humedad de tierra para plantas. ¿Cada cuánto debería despertar y por qué?",
                steps: ["Piensa qué tan rápido cambia la humedad de la tierra"],
                solution: "La humedad de la tierra cambia MUY lento (horas).\nNo tiene sentido reportar cada segundo.\n\nESTRATEGIA:\nDespertar cada 1-6 horas, leer la humedad, publicarla\npor MQTT, y volver a deep sleep.\n\nRESULTADO:\nEl 99% del tiempo el sensor esta dormido consumiendo\ncasi nada -> una pila puede durar MESES.\n\n// Regla: la frecuencia de reporte debe coincidir con\n// que tan rapido cambia lo que mides. Ni mas, ni menos." },
        ],
        quiz: [
            { q: "¿Qué es el 'deep sleep' del ESP32?", opts: ["Un error", "Un modo donde apaga casi todo y consume poquísimo, para ahorrar batería", "Cuando se descompone", "Un sensor"], correct: 1, fb: "Duerme profundo, despierta solo para trabajar, y la pila dura meses." },
            { q: "¿Cómo eliges cada cuánto debe reportar un sensor?", opts: ["Siempre cada segundo", "Según qué tan rápido cambia lo que mides", "Nunca importa", "Lo más seguido posible siempre"], correct: 1, fb: "Coincide la frecuencia con la velocidad del cambio: ahorras mucha batería." },
        ],
    },
    {
        id: "ic_arch", mod: "Nivel pro", icon: Workflow, mins: "30 min",
        title: "Proyecto final: tu sistema IoT completo en la nube",
        intro: "El gran cierre. Aquí unes TODO en una arquitectura IoT profesional de punta a punta: dispositivo → nube → dashboard, con seguridad y eficiencia. Este es el nivel que puedes mostrar en un CV.",
        theory: [
            { h: "La arquitectura IoT completa (de punta a punta)" },
            { code: { file: "arquitectura_iot.txt", code: "+- DISPOSITIVO ---------------+\n| ESP32 + sensores           |\n| - lee datos                |\n| - deep sleep (ahorra pila) |\n| - publica por MQTT seguro  |\n+-----------+----------------+\n            | MQTT + TLS (cifrado)\n            v\n+- NUBE ---------------------+\n| Broker MQTT                |\n| Base de datos (historial)  |\n| Reglas y alertas           |\n+-----------+----------------+\n            |\n            v\n+- INTERFAZ -----------------+\n| Dashboard (web/app)        |\n| - graficas en vivo         |\n| - botones de control       |\n| - alertas (correo/push)    |\n+----------------------------+\n\n// Estas 3 capas (dispositivo, nube, interfaz) son\n// la base de CUALQUIER producto IoT profesional." } },
            { h: "Ejemplo concreto: monitor de plantas inteligente" },
            { p: "Para que veas cómo se aplica todo, imagina un proyecto sencillo pero completo (perfecto para portafolio):" },
            { list: [
                    "Dispositivo: ESP32 + sensor de humedad, en deep sleep, despierta cada hora.",
                    "Comunicación: publica la humedad por MQTT con TLS a una plataforma en la nube.",
                    "Nube: guarda el historial y tiene una regla 'si humedad < 30%, alerta'.",
                    "Dashboard: una gráfica de la humedad y una tarjeta con el valor actual.",
                    "Alerta: te llega un correo/notificación cuando la planta necesita agua.",
                    "Bonus: un dashboard hecho por TI en React → une tu software con el IoT.",
                ] },
            { h: "Tu checklist de nivel profesional" },
            { code: { file: "checklist.txt", code: "Un proyecto IoT 'nivel CV' tiene:\n\n  [x] Dispositivo que lee sensores reales\n  [x] Comunicacion por MQTT (no solo WiFi local)\n  [x] Datos guardados en la nube (historial)\n  [x] Dashboard que se ve desde cualquier lado\n  [x] Seguridad: TLS + credenciales\n  [x] Eficiencia: deep sleep / bajo consumo\n  [x] Una alerta automatica util\n\n// Si tu proyecto marca estas casillas, ya NO es\n// \"de escuela\": es un sistema IoT de verdad." } },
            { tip: { icon: "🚀", text: "Ruta sugerida: (1) un sensor publicando a ThingSpeak/Adafruit IO. (2) Agrega el dashboard. (3) Mete deep sleep. (4) Pásalo a MQTT con TLS. (5) Construye tu propio dashboard en React. Al terminar, tendrás un proyecto que pocos egresados tienen." } },
        ],
        practice: [
            {
                title: "Diseña tu arquitectura",
                goal: "Diseña un sistema IoT completo para monitorear la temperatura de un cuarto de servidores, con alerta si se calienta.",
                steps: ["Define las 3 capas: dispositivo, nube, interfaz", "Incluye seguridad y la alerta"],
                solution: "DISPOSITIVO:\n  ESP32 + sensor de temperatura (ej. DHT22).\n  Lee cada 1 min (un cuarto de servers SI necesita\n  datos frescos, asi que aqui no usamos deep sleep\n  largo: va enchufado).\n\nCOMUNICACION:\n  Publica por MQTT con TLS (8883) al broker en la nube.\n  Topic: datacenter/sala1/temperatura\n\nNUBE:\n  - Guarda historial en base de datos time-series.\n  - Regla: si temp > 30 C -> disparar alerta.\n\nINTERFAZ:\n  - Dashboard con grafica de temperatura en vivo.\n  - Tarjeta con el valor actual.\n\nALERTA:\n  Correo/notificacion push al encargado si pasa 30 C.\n\n// Marca todas las casillas del checklist profesional." },
        ],
        quiz: [
            { q: "Las 3 capas de una arquitectura IoT profesional son...", opts: ["Cable, pila y LED", "Dispositivo, nube e interfaz", "Solo el ESP32", "WiFi, WiFi y WiFi"], correct: 1, fb: "Dispositivo (lee/envía) → nube (guarda/procesa) → interfaz (muestra/controla)." },
            { q: "¿Qué hace que un proyecto IoT sea 'nivel CV' y no 'de escuela'?", opts: ["Que use muchos cables", "Nube, dashboard, seguridad y eficiencia trabajando juntos", "Que sea local", "Que no tenga sensores"], correct: 1, fb: "La combinación completa de punta a punta con seguridad y eficiencia." },
            { q: "Para tu portafolio, un plus enorme sería...", opts: ["No documentarlo", "Construir tú mismo el dashboard en React leyendo de la nube", "Dejar la clave de fábrica", "No usar la nube"], correct: 1, fb: "Une tu fuerte (software/React) con IoT: muy pocos egresados lo tienen." },
        ],
    },
];

const MODS = [
    { name: "Comunicación", sub: "MQTT y protocolos", icon: Radio },
    { name: "Nube y datos", sub: "Almacenar y visualizar", icon: Cloud },
    { name: "Nivel pro", sub: "Seguridad, energía y arquitectura", icon: ShieldCheck },
];

const RANKS = [
    { min: 0, name: "Conectado" },
    { min: 300, name: "Integrador" },
    { min: 600, name: "Arquitecto IoT" },
    { min: 900, name: "Cloud Engineer" },
    { min: 1100, name: "IoT Pro" },
];
const rankFor = (xp) => RANKS.filter((r) => xp >= r.min).pop();
const loadSave = () => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } };

/* ---------- componentes de UI ---------- */
function CodeBlock({ code, file }) {
    return (
        <div className="cg-term">
            <div className="cg-term-h">
                <span className="d r" /><span className="d y" /><span className="d g" />
                {file && <span className="cg-file">{file}</span>}
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
        if (b.p) return <p key={i} className="cg-p">{b.p}</p>;
        if (b.h) return <h3 key={i} className="cg-h3">{b.h}</h3>;
        if (b.code) return <CodeBlock key={i} {...b.code} />;
        if (b.tip) return (
            <div key={i} className="cg-tip"><span className="cg-tip-i">{b.tip.icon}</span><span>{b.tip.text}</span></div>
        );
        if (b.list) return (
            <ul key={i} className="cg-list">{b.list.map((x, j) => <li key={j}>{x}</li>)}</ul>
        );
        if (b.table) return (
            <div key={i} className="cg-tablewrap"><table className="cg-table">
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
        <div className="cg-ex">
            <div className="cg-ex-top"><span className="cg-ex-n">{n}</span><strong>{ex.title}</strong></div>
            <p className="cg-ex-goal">{ex.goal}</p>
            {ex.steps && <ul className="cg-steps">{ex.steps.map((s, i) => <li key={i}>{s}</li>)}</ul>}
            <button className="cg-reveal" onClick={() => setOpen((o) => !o)}>
                {open ? <EyeOff size={13} /> : <Eye size={13} />} {open ? "Ocultar solución" : "Ver solución"}
            </button>
            {open && <CodeBlock code={ex.solution} file="solucion.txt" />}
        </div>
    );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
.cg{ min-height:100vh; width:100%; font-family:'Inter',system-ui,sans-serif; color:#e6f0f4;
  background:radial-gradient(900px 500px at 80% -10%, rgba(34,211,238,.13), transparent 60%),
             radial-gradient(700px 400px at 0% 110%, rgba(129,140,248,.10), transparent 55%), #0a0f14; }
.cg *{ box-sizing:border-box; }
.cg-wrap{ max-width:880px; margin:0 auto; padding:38px 22px 90px; }
.cg-head{ text-align:center; margin-bottom:8px; }
.cg-kick{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:4px; color:#6b8290; }
.cg-title{ font-size:42px; font-weight:800; letter-spacing:-1px; margin:6px 0; text-transform:uppercase; }
.cg-title b{ color:#22d3ee; text-shadow:0 0 26px rgba(34,211,238,.4); }
.cg-sub{ color:#8ba0ad; font-size:15px; max-width:580px; margin:0 auto; }
.cg-rank{ display:flex; gap:14px; align-items:center; justify-content:center; margin:22px auto; flex-wrap:wrap; }
.cg-rbox{ display:flex; align-items:center; gap:10px; border:1px solid #1b2a33; background:#0f1820; border-radius:12px; padding:10px 15px; }
.cg-rl{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:2px; color:#6b8290; }
.cg-rn{ font-size:16px; font-weight:700; }
.cg-bar{ width:200px; height:8px; border-radius:99px; background:#0f1820; border:1px solid #1b2a33; overflow:hidden; }
.cg-bar i{ display:block; height:100%; background:linear-gradient(90deg,#22d3ee,#818cf8); transition:width .6s; }
.cg-modh{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:#22d3ee;
  margin:30px 0 12px; display:flex; align-items:center; gap:9px; text-transform:uppercase; }
.cg-modh .ms{ color:#6b8290; letter-spacing:0; text-transform:none; font-size:12px; }
.cg-list-lessons{ display:flex; flex-direction:column; gap:10px; }
.cg-lcard{ display:flex; align-items:center; gap:15px; cursor:pointer; border:1px solid #182630; border-radius:14px;
  padding:15px 17px; background:linear-gradient(180deg,#101a22,#0c141b); transition:.16s; text-align:left; width:100%; color:inherit; font-family:inherit; }
.cg-lcard:hover{ transform:translateX(4px); border-color:#22d3ee; }
.cg-lico{ width:42px; height:42px; border-radius:11px; flex:none; display:grid; place-items:center;
  background:rgba(34,211,238,.1); border:1px solid #1b2a33; color:#22d3ee; }
.cg-lcard.done .cg-lico{ background:rgba(92,200,138,.13); border-color:#5cc88a; color:#5cc88a; }
.cg-lm{ flex:1; min-width:0; }
.cg-lt{ font-size:15.5px; font-weight:700; }
.cg-li{ font-size:13px; color:#8ba0ad; margin-top:2px; }
.cg-lmeta{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#6b8290; flex:none; }
.cg-back{ display:inline-flex; align-items:center; gap:6px; background:none; border:none; color:#8ba0ad;
  font-family:'JetBrains Mono',monospace; font-size:12px; cursor:pointer; padding:6px 0; margin-bottom:6px; }
.cg-back:hover{ color:#22d3ee; }
.cg-lhead h2{ font-size:30px; font-weight:800; letter-spacing:-.5px; margin:4px 0 8px; }
.cg-badge{ display:inline-block; font-family:'JetBrains Mono',monospace; font-size:11px; color:#22d3ee;
  background:rgba(34,211,238,.1); border:1px solid #1b2a33; padding:3px 10px; border-radius:99px; }
.cg-intro{ background:#0f1820; border-left:4px solid #22d3ee; border-radius:4px 12px 12px 4px;
  padding:15px 18px; margin:16px 0; color:#c4d4dc; font-size:15px; line-height:1.6; }
.cg-secl{ font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:2px; color:#6b8290;
  margin:26px 0 10px; display:flex; align-items:center; gap:8px; text-transform:uppercase; }
.cg-p{ font-size:15px; line-height:1.7; color:#c4d4dc; margin:12px 0; }
.cg-h3{ font-size:17px; font-weight:700; margin:22px 0 4px; color:#e6f0f4; }
.cg-term{ background:#070c11; border:1px solid #182630; border-radius:12px; overflow:hidden; margin:14px 0; }
.cg-term-h{ background:rgba(255,255,255,.03); padding:9px 13px; border-bottom:1px solid #182630; display:flex; gap:7px; align-items:center; }
.cg-term-h .d{ width:11px; height:11px; border-radius:50%; } .d.r{ background:#ff5f56; } .d.y{ background:#ffbd2e; } .d.g{ background:#27c93f; }
.cg-file{ margin-left:8px; font-family:'JetBrains Mono',monospace; font-size:11px; color:#6b8290; }
.cg-term pre{ margin:0; padding:16px; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.6;
  color:#d4e2ea; overflow-x:auto; } .cg-term pre .cmt{ color:#6b8290; font-style:italic; }
.cg-tip{ background:rgba(129,140,248,.08); border-left:4px solid #818cf8; border-radius:4px 10px 10px 4px;
  padding:13px 16px; margin:16px 0; display:flex; gap:12px; align-items:flex-start; font-size:14px; line-height:1.55; color:#d2dae8; }
.cg-tip-i{ font-size:18px; flex:none; }
.cg-list{ margin:12px 0; padding-left:4px; list-style:none; display:flex; flex-direction:column; gap:7px; }
.cg-list li{ font-size:14.5px; color:#c4d4dc; padding-left:18px; position:relative; line-height:1.5; }
.cg-list li::before{ content:'▸'; position:absolute; left:0; color:#22d3ee; }
.cg-tablewrap{ overflow-x:auto; border:1px solid #182630; border-radius:10px; margin:16px 0; }
.cg-table{ width:100%; border-collapse:collapse; font-size:13.5px; }
.cg-table th{ background:#0f1820; color:#22d3ee; text-align:left; padding:10px 14px; font-size:11px;
  text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #182630; }
.cg-table td{ padding:10px 14px; border-bottom:1px solid #121d25; color:#c4d4dc; }
.cg-ex{ background:#0f1820; border:1px solid #182630; border-radius:14px; padding:18px; margin:12px 0; }
.cg-ex-top{ display:flex; align-items:center; gap:10px; }
.cg-ex-n{ background:#22d3ee; color:#06222a; width:24px; height:24px; border-radius:50%; display:grid;
  place-items:center; font-size:13px; font-weight:800; flex:none; }
.cg-ex-goal{ font-size:14.5px; color:#c4d4dc; margin:10px 0; line-height:1.55; }
.cg-steps{ margin:8px 0; padding-left:18px; } .cg-steps li{ font-size:13.5px; color:#9ab0bd; margin:4px 0; }
.cg-reveal{ display:inline-flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:12px;
  color:#22d3ee; background:rgba(34,211,238,.08); border:1px solid #1b2a33; border-radius:8px; padding:7px 13px; cursor:pointer; margin-top:6px; }
.cg-reveal:hover{ background:rgba(34,211,238,.16); }
.cg-quiz{ border:1px solid #1b2a33; border-radius:14px; padding:18px; background:#0f1820; margin:12px 0; }
.cg-q{ font-size:15.5px; font-weight:600; margin-bottom:11px; }
.cg-opt{ display:block; width:100%; text-align:left; background:#0c141b; border:1px solid #182630; color:#e6f0f4;
  padding:11px 14px; border-radius:10px; margin:6px 0; font-size:14px; cursor:pointer; transition:.14s; font-family:inherit; }
.cg-opt:hover{ border-color:#22d3ee; }
.cg-opt.ok{ background:rgba(92,200,138,.13); border-color:#5cc88a; color:#aef0c6; }
.cg-opt.no{ background:rgba(255,95,86,.12); border-color:#ff5f56; color:#ffb3ae; }
.cg-fb{ font-size:13.5px; margin-top:9px; line-height:1.5; }
.cg-nav{ display:flex; justify-content:space-between; gap:10px; margin-top:26px; }
.cg-btn{ font-family:'JetBrains Mono',monospace; font-size:13px; padding:11px 17px; border-radius:10px; cursor:pointer;
  border:1px solid #1b2a33; background:#0f1820; color:#e6f0f4; display:inline-flex; align-items:center; gap:7px; }
.cg-btn:hover:not(:disabled){ border-color:#22d3ee; } .cg-btn:disabled{ opacity:.3; cursor:default; }
.cg-btn.main{ background:#22d3ee; color:#06222a; border-color:#22d3ee; font-weight:700; }
.cg-foot{ text-align:center; margin-top:34px; }
.cg-reset{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#ff7b72; background:transparent;
  border:1px solid rgba(255,123,114,.3); border-radius:8px; padding:8px 14px; cursor:pointer; }
.cg-reset:hover{ background:rgba(255,123,114,.1); }
.cg-done-tag{ display:inline-flex; align-items:center; gap:6px; color:#5cc88a; font-family:'JetBrains Mono',monospace; font-size:12px; }
@media(max-width:560px){ .cg-title{ font-size:30px; } .cg-lhead h2{ font-size:24px; } }
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
            <div className="cg">
                <style>{CSS}</style>
                <div className="cg-wrap">
                    <button className="cg-back" onClick={() => setOpen(null)}><ChevronLeft size={15} /> TODAS LAS LECCIONES</button>
                    <div className="cg-lhead">
                        <span className="cg-badge">{les.mod} · {les.mins}</span>
                        <h2>{les.title}</h2>
                    </div>
                    <div className="cg-intro">{les.intro}</div>

                    <div className="cg-secl"><BookOpen size={13} /> TEORÍA</div>
                    <Theory blocks={les.theory} />

                    <div className="cg-secl"><Play size={13} /> PRÁCTICA</div>
                    {les.practice.map((ex, i) => <Exercise key={i} ex={ex} n={i + 1} />)}

                    <div className="cg-secl"><Award size={13} /> QUIZ</div>
                    {les.quiz.map((q, qi) => {
                        const picked = answers[qi];
                        const done = picked != null;
                        return (
                            <div className="cg-quiz" key={qi}>
                                <div className="cg-q">{q.q}</div>
                                {q.opts.map((o, oi) => {
                                    let cls = "cg-opt";
                                    if (done) { if (oi === q.correct) cls += " ok"; else if (oi === picked) cls += " no"; }
                                    return <button key={oi} className={cls} onClick={() => answer(qi, oi)}>{o}</button>;
                                })}
                                {done && (
                                    <div className="cg-fb" style={{ color: picked === q.correct ? "#5cc88a" : "#ff7b72" }}>
                                        {picked === q.correct ? "✓ " : "✗ "}{q.fb}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {isDone(les) && (
                        <div style={{ textAlign: "center", marginTop: 18 }}>
                            <span className="cg-done-tag"><Check size={15} /> ¡Lección completada! +100 XP</span>
                        </div>
                    )}

                    <div className="cg-nav">
                        <button className="cg-btn" disabled={open === 0} onClick={() => openLesson(open - 1)}>
                            <ChevronLeft size={15} /> Anterior
                        </button>
                        <button className="cg-btn main" disabled={open === L.length - 1} onClick={() => openLesson(open + 1)}>
                            Siguiente <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cg">
            <style>{CSS}</style>
            <div className="cg-wrap">
                <div className="cg-head">
                    <div className="cg-kick">// EVOLUTIVE · CLOUD GRID</div>
                    <h1 className="cg-title">IoT en la <b>Nube</b></h1>
                    <p className="cg-sub">El salto a nivel profesional: MQTT, nube, datos, dashboards, seguridad y bajo consumo. De proyectos locales a sistemas que van en un CV.</p>
                </div>

                <div className="cg-rank">
                    <div className="cg-rbox">
                        <Cloud size={20} color="#22d3ee" />
                        <div><div className="cg-rl">RANGO</div><div className="cg-rn">{rank.name}</div></div>
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#6b8290", marginBottom: 5 }}>
                            <span>{xp} XP · {completas}/{L.length} lecciones</span>
                            <span>{next ? `→ ${next.name}` : "MÁX"}</span>
                        </div>
                        <div className="cg-bar"><i style={{ width: pct + "%" }} /></div>
                    </div>
                </div>

                {MODS.map((m) => {
                    const lessons = L.map((l, i) => ({ l, i })).filter(({ l }) => l.mod === m.name);
                    return (
                        <div key={m.name}>
                            <div className="cg-modh"><m.icon size={14} /> {m.name} <span className="ms">— {m.sub}</span></div>
                            <div className="cg-list-lessons">
                                {lessons.map(({ l, i }) => {
                                    const done = isDone(l);
                                    const Ico = l.icon;
                                    return (
                                        <button key={l.id} className={`cg-lcard ${done ? "done" : ""}`} onClick={() => openLesson(i)}>
                                            <div className="cg-lico">{done ? <Check size={20} /> : <Ico size={20} />}</div>
                                            <div className="cg-lm">
                                                <div className="cg-lt">{l.title}</div>
                                                <div className="cg-li">{l.intro.slice(0, 72)}…</div>
                                            </div>
                                            <div className="cg-lmeta">{l.mins}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                <div className="cg-foot">
                    <button className="cg-reset" onClick={() => {
                        if (window.confirm("¿Reiniciar el progreso de IoT en la Nube?")) { setRead({}); setQuiz({}); }
                    }}>
                        <RotateCcw size={11} style={{ verticalAlign: "-1px", marginRight: 5 }} /> Reiniciar progreso
                    </button>
                </div>
            </div>
        </div>
    );
}