import React, { useState, useEffect } from "react";
import {
    Smartphone, BookOpen, Terminal, Lightbulb, Check, ChevronLeft, ChevronRight,
    Eye, EyeOff, Award, Star, Zap, AlertTriangle, Layers, GitBranch, Repeat,
    Hash, Shield, Radio, Box, Code, RotateCcw, Play, Workflow,
} from "lucide-react";

/* ============================================================
   FLUTTER + DART — De cero a app móvil
   Curso autónomo. Progreso en localStorage (flutter_progress_v1).
   40% teoría / 60% práctica. Pensado para principiantes totales.
   Basado en: alilopez37.github.io/dart  y  /provider
   ── En el código Dart, \${...} es interpolación (se ve como ${...}).
   ============================================================ */

const SAVE_KEY = "flutter_progress_v1";

const L = [
    /* ===================== MÓDULO DART ===================== */
    {
        id: "d_intro", mod: "Dart", icon: Terminal, mins: "20 min",
        title: "Tu primer programa en Dart",
        intro: "Dart es el idioma que habla Flutter. Antes de hacer apps bonitas, hay que aprender a 'hablar' con la máquina. Empecemos por lo más básico.",
        theory: [
            { p: "Todo programa de Dart necesita un punto de partida llamado main(). Es como la puerta de entrada de una casa: cuando ejecutas el programa, la computadora entra por ahí." },
            { code: { file: "hola.dart", code: `void main() {
  print('Hola, Flutter!');
}` } },
            { list: [
                    "void main() → la función donde arranca TODO. Siempre va.",
                    "{ } → las llaves encierran el bloque de código que se ejecuta.",
                    "print(...) → muestra algo en la consola (la pantalla de texto).",
                    "; → cada instrucción termina con punto y coma. Como el punto final de una oración.",
                ] },
            { h: "Comentarios (notas para ti, que la máquina ignora)" },
            { code: { file: "comentarios.dart", code: `// Comentario de una línea

/* Comentario
   de varias líneas */

/// Documentación (para explicar funciones)` } },
            { tip: { icon: "💡", text: "Practica en dartpad.dev — es una página web donde escribes Dart y lo corres al instante, sin instalar nada." } },
        ],
        practice: [
            {
                title: "Tu propio Hola Mundo",
                goal: "Modifica el mensaje para que salude con TU nombre.",
                steps: ["Crea void main()", "Dentro, usa print() con tu nombre"],
                solution: `void main() {
  print('Hola, soy Gael y estoy aprendiendo Dart!');
}` },
        ],
        quiz: [
            { q: "¿Qué función es el punto de entrada obligatorio de todo programa Dart?", opts: ["start()", "main()", "init()", "run()"], correct: 1, fb: "main() es por donde la computadora empieza a ejecutar tu programa." },
            { q: "¿Con qué símbolo termina cada instrucción en Dart?", opts: ["Una coma ,", "Dos puntos :", "Punto y coma ;", "Nada"], correct: 2, fb: "El punto y coma ; cierra cada instrucción, como el punto final de una frase." },
        ],
    },
    {
        id: "d_vars", mod: "Dart", icon: Hash, mins: "25 min",
        title: "Variables y tipos de datos",
        intro: "Una variable es una cajita con nombre donde guardas un dato. El 'tipo' es qué clase de dato cabe en esa cajita: un número, un texto, etc.",
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
                        ["bool", "true / false", "Sí o no, prendido o apagado"],
                        ["List", "[1, 2, 3]", "Una lista de cosas"],
                        ["Map", "{'k': v}", "Pares clave→valor"],
                    ] } },
            { h: "var vs final vs const (la duda eterna)" },
            { tip: { icon: "🔑", text: "var puede cambiar después · final se asigna UNA vez y ya · const es un valor fijo conocido desde el inicio (como pi)." } },
            { code: { file: "interpolacion.dart", code: `var nombre = 'Carlos';
var edad = 22;

// Meter variables dentro de un texto con $
print('Soy $nombre');
// Meter una operación con \${ }
print('En 10 años tendré \${edad + 10}');` } },
        ],
        practice: [
            {
                title: "Perfil de usuario",
                goal: "Declara tus datos con tipos explícitos e imprime un resumen.",
                steps: [
                    "Declara nombre (String), edad (int), altura (double), esEstudiante (bool)",
                    "Usa var para la ciudad",
                    "Imprime todo con interpolación ($variable)",
                ],
                solution: `void main() {
  String nombre = 'Gael';
  int edad = 22;
  double altura = 1.75;
  bool esEstudiante = true;
  var ciudad = 'Tuxtla';

  print('$nombre, $edad años, mide $altura m.');
  print('Ciudad: $ciudad. ¿Estudiante? $esEstudiante');
}` },
            {
                title: "Calculadora básica",
                goal: "Practica los operadores con dos números.",
                steps: [
                    "Define double a = 17.5 y double b = 4.0",
                    "Imprime suma, resta, multiplicación, división, módulo (%) y división entera (~/)",
                ],
                solution: `void main() {
  double a = 17.5;
  double b = 4.0;
  print('Suma: \${a + b}');
  print('Resta: \${a - b}');
  print('Multiplicación: \${a * b}');
  print('División: \${a / b}');
  print('Módulo: \${a % b}');
  print('División entera: \${a ~/ b}');
}` },
        ],
        quiz: [
            { q: "¿Qué tipo usarías para guardar un precio como 9.99?", opts: ["int", "double", "String", "bool"], correct: 1, fb: "double guarda números con decimales. int solo guarda enteros." },
            { q: "¿Cuál puede cambiar de valor después de crearse?", opts: ["const", "final", "var", "Ninguna"], correct: 2, fb: "var puede reasignarse; final y const no." },
        ],
    },
    {
        id: "d_null", mod: "Dart", icon: Shield, mins: "20 min",
        title: "Null Safety (adiós a los crashes)",
        intro: "null significa 'vacío, sin valor'. El error más famoso de la programación es usar algo que está vacío y que la app truene. Dart te protege de eso ANTES de que pase.",
        theory: [
            { p: "Null Safety es un sistema que garantiza que una variable normal nunca esté vacía. Si una variable PUEDE estar vacía, tienes que avisarle a Dart poniendo un ? después del tipo." },
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
            { tip: { icon: "🔑", text: "El ! es el más peligroso: le dices a Dart 'seguro que tiene valor'. Si te equivocas, truena. Úsalo solo cuando estés 100% seguro." } },
        ],
        practice: [
            {
                title: "Null Safety en práctica",
                goal: "Juega con una variable que puede estar vacía.",
                steps: [
                    "Declara String? apodo sin valor",
                    "Usa ??= para ponerle 'Sin apodo' si está vacío",
                    "Imprime su longitud de forma segura con ?.",
                ],
                solution: `void main() {
  String? apodo;
  apodo ??= 'Sin apodo';
  print('Apodo: $apodo');
  print('Largo: \${apodo?.length}');
}` },
        ],
        quiz: [
            { q: "¿Qué hace el operador ?? en  'var x = a ?? b'?", opts: ["Suma a y b", "Usa b si a está vacío (null)", "Compara a con b", "Borra a"], correct: 1, fb: "?? da un valor de respaldo cuando el primero es null." },
            { q: "¿Qué significa el ? en  String? nombre;", opts: ["Que es una pregunta", "Que la variable PUEDE ser null", "Que es secreta", "Que es constante"], correct: 1, fb: "El ? marca la variable como nullable: tiene permiso de estar vacía." },
        ],
    },
    {
        id: "d_flow", mod: "Dart", icon: GitBranch, mins: "25 min",
        title: "Decisiones y bucles",
        intro: "Hasta ahora el código corre de arriba a abajo. Ahora le enseñamos a TOMAR DECISIONES (if) y a REPETIR cosas (bucles).",
        theory: [
            { h: "Decisiones: if / else" },
            { code: { file: "decisiones.dart", code: `if (nota >= 90) {
  print('A');
} else if (nota >= 80) {
  print('B');
} else {
  print('Reprobado');
}

// Ternario: un if corto en una línea
var estado = nota >= 70 ? 'Aprobado' : 'Reprobado';` } },
            { h: "switch: cuando hay muchas opciones" },
            { code: { file: "switch.dart", code: `switch (dia) {
  case 'lunes':
    print('Inicio de semana');
    break;
  default:
    print('Otro día');
}` } },
            { h: "Bucles: repetir sin copiar y pegar" },
            { code: { file: "bucles.dart", code: `// for clásico: repite contando
for (var i = 0; i < 5; i++) {
  print(i); // 0,1,2,3,4
}

// for-in: recorre una lista
var frutas = ['manzana', 'pera'];
for (var f in frutas) {
  print(f);
}

// while: repite mientras se cumpla algo
var n = 0;
while (n < 3) {
  print(n);
  n++;
}

// do..while: igual, pero corre AL MENOS una vez
var i = 0;
do {
  print('Intento $i');
  i++;
} while (i < 3);` } },
            { tip: { icon: "⚡", text: "break sale del bucle de golpe. continue se salta a la siguiente vuelta." } },
        ],
        practice: [
            {
                title: "Tabla de multiplicar",
                goal: "Imprime la tabla del 7 con un bucle for.",
                steps: ["Define int tabla = 7", "Con un for del 1 al 12, imprime cada producto"],
                solution: `void main() {
  int tabla = 7;
  for (var i = 1; i <= 12; i++) {
    print('$tabla x $i = \${tabla * i}');
  }
}` },
            {
                title: "Clasificador de notas",
                goal: "Recorre una lista de notas y di si cada una aprueba.",
                steps: ["Lista: [95, 82, 71, 60, 45]", "Con for-in, imprime aprobado/reprobado (>=70)"],
                solution: `void main() {
  var notas = [95, 82, 71, 60, 45];
  for (var nota in notas) {
    var estado = nota >= 70 ? 'Aprobado' : 'Reprobado';
    print('$nota → $estado');
  }
}` },
        ],
        quiz: [
            { q: "¿Qué bucle se ejecuta AL MENOS una vez aunque la condición sea falsa?", opts: ["for", "while", "do..while", "for-in"], correct: 2, fb: "do..while revisa la condición al final, así que siempre corre una vez." },
            { q: "El ternario  'a >= 70 ? \"sí\" : \"no\"'  es una forma corta de...", opts: ["un bucle", "un if/else", "una función", "un switch"], correct: 1, fb: "El ternario es un if/else comprimido en una sola línea." },
        ],
    },
    {
        id: "d_func", mod: "Dart", icon: Code, mins: "25 min",
        title: "Funciones",
        intro: "Una función es una 'receta' con nombre: un bloque de código que haces una vez y reutilizas cuantas veces quieras. Evita copiar y pegar.",
        theory: [
            { code: { file: "funciones.dart", code: `// Función que recibe 2 números y devuelve su suma
int sumar(int a, int b) {
  return a + b;
}

// Arrow function: si es una sola línea, más corta
int multiplicar(int a, int b) => a * b;

// Parámetros nombrados (van entre llaves { })
void saludar(String nombre, {String titulo = 'Sr.'}) {
  print('Hola $titulo $nombre');
}

saludar('García', titulo: 'Dr.'); // Hola Dr. García` } },
            { p: "int sumar(...) significa: la función se llama sumar, recibe dos int, y devuelve (return) un int. El tipo de antes es lo que ENTREGA." },
            { h: "Funciones anónimas (lambdas) y métodos de lista" },
            { code: { file: "lambdas.dart", code: `var numeros = [1, 2, 3, 4, 5];

// where: filtra. Quédate solo con los pares
var pares = numeros.where((n) => n % 2 == 0);
print(pares); // (2, 4)

// map: transforma. Eleva cada uno al cuadrado
var cuadrados = numeros.map((n) => n * n).toList();
print(cuadrados); // [1, 4, 9, 16, 25]` } },
            { tip: { icon: "💡", text: "(n) => n * 2 es una función sin nombre. Se la pasas a where/map para decirles QUÉ hacer con cada elemento." } },
        ],
        practice: [
            {
                title: "FizzBuzz con funciones",
                goal: "El clásico ejercicio, encapsulado en una función.",
                steps: [
                    "Crea función String fizzBuzz(int n)",
                    "Devuelve 'FizzBuzz' si es múltiplo de 3 y 5, 'Fizz' si de 3, 'Buzz' si de 5, o el número",
                    "Recórrela del 1 al 15",
                ],
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
            {
                title: "Filtrar y transformar",
                goal: "Usa where y map juntos.",
                steps: ["Lista de 6 números", "Filtra los pares con where", "Elévalos al cuadrado con map", "Imprime con toList()"],
                solution: `void main() {
  var nums = [1, 2, 3, 4, 5, 6];
  var resultado = nums
      .where((n) => n % 2 == 0)
      .map((n) => n * n)
      .toList();
  print(resultado); // [4, 16, 36]
}` },
        ],
        quiz: [
            { q: "En  'int sumar(int a, int b)', ¿qué significa el primer int?", opts: ["Que recibe un texto", "El tipo de dato que la función DEVUELVE", "Que es privada", "Nada"], correct: 1, fb: "El tipo antes del nombre es lo que la función entrega con return." },
            { q: "¿Qué hace  numeros.where((n) => n > 3)?", opts: ["Suma los mayores a 3", "Se queda solo con los elementos mayores a 3", "Borra el 3", "Ordena la lista"], correct: 1, fb: "where filtra: conserva los elementos que cumplen la condición." },
        ],
    },
    {
        id: "d_coll", mod: "Dart", icon: Layers, mins: "20 min",
        title: "Colecciones: List, Set y Map",
        intro: "Una variable guarda un dato. Las colecciones guardan MUCHOS datos juntos. Son las tres estructuras que más usarás.",
        theory: [
            { h: "List — una lista ordenada (permite repetidos)" },
            { code: { file: "list.dart", code: `List<int> nums = [1, 2, 3];
nums.add(4);        // agregar
print(nums.length); // cuántos hay → 4
print(nums[0]);     // el primero → 1` } },
            { h: "Set — como una lista, pero SIN repetidos" },
            { code: { file: "set.dart", code: `Set<String> colores = {'rojo', 'azul'};
colores.add('rojo'); // se ignora, ya existe
print(colores); // {rojo, azul}` } },
            { h: "Map — pares clave → valor (como un diccionario)" },
            { code: { file: "map.dart", code: `Map<String, dynamic> alumno = {
  'nombre': 'Laura',
  'edad': 20,
  'promedio': 9.2,
};

print(alumno['nombre']); // Laura
alumno['semestre'] = 3;  // agregar par

// Recorrer todos los pares
alumno.forEach((clave, valor) => print('$clave: $valor'));` } },
            { tip: { icon: "✓", text: "List = fila ordenada. Set = bolsa sin duplicados. Map = etiquetas con su valor. El Map es clave para leer datos de internet (JSON)." } },
        ],
        practice: [
            {
                title: "Agenda de contactos",
                goal: "Guarda y consulta contactos con un Map.",
                steps: ["Crea Map<String, String> con 3 nombre→teléfono", "Recórrelo con forEach", "Busca un contacto e imprime su teléfono"],
                solution: `void main() {
  Map<String, String> agenda = {
    'Ana': '555-1111',
    'Luis': '555-2222',
    'Sara': '555-3333',
  };

  agenda.forEach((nombre, tel) => print('$nombre: $tel'));

  var buscar = 'Luis';
  print('Tel de $buscar: \${agenda[buscar] ?? "No encontrado"}');
}` },
        ],
        quiz: [
            { q: "¿Qué colección NO permite elementos repetidos?", opts: ["List", "Set", "Map", "Todas"], correct: 1, fb: "Set descarta duplicados automáticamente." },
            { q: "Para guardar pares como 'nombre': 'Laura', usas un...", opts: ["List", "Set", "Map", "int"], correct: 2, fb: "Map guarda parejas clave→valor." },
        ],
    },
    {
        id: "d_oop", mod: "Dart", icon: Box, mins: "30 min",
        title: "Clases y objetos (Programación Orientada a Objetos)",
        intro: "Una clase es un MOLDE. Un objeto es algo hecho con ese molde. Ejemplo: 'Persona' es el molde; tú y yo somos objetos Persona, cada uno con sus propios datos.",
        theory: [
            { code: { file: "clase.dart", code: `class Persona {
  // Propiedades (los datos de cada objeto)
  String nombre;
  int edad;

  // Constructor: cómo se crea una Persona
  Persona(this.nombre, this.edad);

  // Método: una acción que puede hacer
  void presentarse() {
    print('Soy $nombre, tengo $edad años');
  }

  // Getter: un valor calculado al vuelo
  bool get esMayor => edad >= 18;
}

void main() {
  var p = Persona('Ana', 21); // creamos un objeto
  p.presentarse();            // usamos su método
  print(p.esMayor);           // true
}` } },
            { tip: { icon: "🔑", text: "this.nombre en el constructor es un atajo: toma lo que te pasan y lo guarda en la propiedad nombre automáticamente. Te ahorra escribir nombre = nombre." } },
            { h: "Encapsulación: proteger los datos" },
            { p: "Si pones _ antes del nombre, la propiedad se vuelve privada (nadie de fuera la toca directo). Así obligas a que todo cambio pase por tus métodos, evitando errores." },
            { code: { file: "privado.dart", code: `class Cuenta {
  double _saldo = 0; // privado (lleva _)

  double get saldo => _saldo; // solo lectura

  void depositar(double monto) {
    if (monto > 0) _saldo += monto; // valida antes
  }
}` } },
        ],
        practice: [
            {
                title: "Clase Rectángulo",
                goal: "Diseña una clase con propiedades y métodos.",
                steps: [
                    "class Rectangulo con double ancho y alto",
                    "Métodos area() y perimetro()",
                    "Método esCuadrado() que devuelva bool",
                ],
                solution: `class Rectangulo {
  double ancho;
  double alto;
  Rectangulo(this.ancho, this.alto);

  double area() => ancho * alto;
  double perimetro() => 2 * (ancho + alto);
  bool esCuadrado() => ancho == alto;
}

void main() {
  var r = Rectangulo(4, 4);
  print('Área: \${r.area()}');
  print('¿Cuadrado? \${r.esCuadrado()}');
}` },
        ],
        quiz: [
            { q: "¿Qué es una clase?", opts: ["Un objeto ya creado", "Un molde para crear objetos", "Una variable", "Un bucle"], correct: 1, fb: "La clase es el molde; los objetos se fabrican con ese molde." },
            { q: "¿Para qué sirve el _ antes de una propiedad (ej. _saldo)?", opts: ["La hace pública", "La hace privada (solo accesible dentro de la clase)", "La borra", "La vuelve constante"], correct: 1, fb: "El _ vuelve privada la propiedad: la proteges de cambios externos." },
        ],
    },
    {
        id: "d_ctor", mod: "Dart", icon: Workflow, mins: "25 min",
        title: "Constructores nombrados y factory",
        intro: "El constructor es la función que crea el objeto. Dart te da varias formas de crear objetos según la situación. Esto se ve MUCHO en Flutter.",
        theory: [
            { h: "Constructores nombrados: varias formas de crear lo mismo" },
            { p: "Dart no deja tener dos constructores con el mismo nombre. La solución: ponerles nombre con un punto. Así ofreces varias maneras claras de crear el objeto." },
            { code: { file: "nombrados.dart", code: `class Punto {
  final double x, y;

  Punto(this.x, this.y);          // normal
  Punto.origen() : x = 0, y = 0;  // nombrado: el (0,0)

  @override
  String toString() => '($x, $y)';
}

void main() {
  var p1 = Punto(3, 4);   // (3, 4)
  var p0 = Punto.origen(); // (0, 0)
}` } },
            { tip: { icon: "✓", text: "Flutter usa esto a cada rato: EdgeInsets.all(), BorderRadius.circular(), SizedBox.shrink() son constructores nombrados." } },
            { h: "factory: control total sobre qué objeto devuelves" },
            { p: "Un factory parece un constructor normal, pero por dentro puede decidir qué devolver. Su uso #1: convertir datos de internet (JSON) en objetos." },
            { code: { file: "factory.dart", code: `class Producto {
  final String nombre;
  final double precio;
  Producto(this.nombre, this.precio);

  // Crea un Producto a partir de un Map (JSON)
  factory Producto.fromJson(Map<String, dynamic> json) {
    return Producto(
      json['nombre'],
      (json['precio'] as num).toDouble(),
    );
  }
}` } },
        ],
        practice: [
            {
                title: "Rectángulo y cuadrado",
                goal: "Usa un constructor nombrado que redirige a otro.",
                steps: [
                    "class Rectangulo(ancho, alto)",
                    "Constructor nombrado .cuadrado(lado) que reutilice el principal con : this(lado, lado)",
                ],
                solution: `class Rectangulo {
  final double ancho, alto;
  Rectangulo(this.ancho, this.alto);

  // Reutiliza el constructor principal
  Rectangulo.cuadrado(double lado) : this(lado, lado);
}

void main() {
  var c = Rectangulo.cuadrado(5);
  print('\${c.ancho} x \${c.alto}'); // 5.0 x 5.0
}` },
        ],
        quiz: [
            { q: "¿Por qué existen los constructores nombrados (ej. Punto.origen())?", opts: ["Porque Dart no permite dos constructores con el mismo nombre", "Para hacer el código más lento", "Porque son obligatorios", "Para borrar objetos"], correct: 0, fb: "Permiten varias formas de crear un objeto, ya que no se puede repetir el nombre." },
            { q: "¿Cuál es el uso más común de un factory en Flutter?", opts: ["Hacer bucles", "Convertir JSON (datos de internet) en objetos", "Pintar la pantalla", "Sumar números"], correct: 1, fb: "factory Producto.fromJson(...) transforma datos de una API en un objeto." },
        ],
    },
    {
        id: "d_inherit", mod: "Dart", icon: GitBranch, mins: "25 min",
        title: "Herencia, clases abstractas y mixins",
        intro: "La herencia te deja crear una clase a partir de otra para no repetir código. 'Un Perro ES UN Animal' → Perro hereda de Animal.",
        theory: [
            { h: "extends: heredar de otra clase" },
            { code: { file: "herencia.dart", code: `class Animal {
  String nombre;
  Animal(this.nombre);
  void hablar() => print('...');
}

class Perro extends Animal {
  Perro(String nombre) : super(nombre); // pasa el dato al padre

  @override // reemplazamos el método del padre
  void hablar() => print('¡Guau!');
}` } },
            { h: "Clases abstractas: un molde incompleto" },
            { p: "Una clase abstracta define QUÉ debe existir, pero no cómo. No se puede crear directamente; obliga a sus hijas a completar los métodos." },
            { code: { file: "abstract.dart", code: `abstract class Figura {
  double area(); // sin cuerpo: las hijas lo definen
}

class Circulo extends Figura {
  double radio;
  Circulo(this.radio);
  @override
  double area() => 3.14159 * radio * radio;
}` } },
            { h: "extends vs implements vs mixins" },
            { table: {
                    head: ["Palabra", "Significa", "Cuántas"],
                    rows: [
                        ["extends", "Heredo código de... (es un)", "Solo 1"],
                        ["implements", "Cumplo el contrato de... (reescribo todo)", "Varias"],
                        ["with (mixin)", "Inyecto habilidades extra", "Varias"],
                    ] } },
            { code: { file: "mixin.dart", code: `mixin Nadador {
  void nadar() => print('Nadando...');
}
mixin Caminante {
  void caminar() => print('Caminando...');
}

class Pato extends Animal with Caminante, Nadador {
  Pato(String n) : super(n);
}` } },
            { tip: { icon: "✓", text: "En Flutter verás mixins seguido, por ejemplo SingleTickerProviderStateMixin para animaciones." } },
        ],
        practice: [
            {
                title: "Jerarquía de figuras",
                goal: "Usa una clase abstracta y herencia con una lista.",
                steps: [
                    "abstract class Figura con area()",
                    "Circulo y Cuadrado que extiendan Figura",
                    "List<Figura> con ambas y recórrela imprimiendo el área",
                ],
                solution: `abstract class Figura {
  double area();
}

class Circulo extends Figura {
  double radio;
  Circulo(this.radio);
  @override
  double area() => 3.14159 * radio * radio;
}

class Cuadrado extends Figura {
  double lado;
  Cuadrado(this.lado);
  @override
  double area() => lado * lado;
}

void main() {
  List<Figura> figuras = [Circulo(2), Cuadrado(3)];
  for (var f in figuras) {
    print('Área: \${f.area().toStringAsFixed(2)}');
  }
}` },
        ],
        quiz: [
            { q: "'Un Perro ES UN Animal'. ¿Qué palabra usas?", opts: ["implements", "extends", "with", "factory"], correct: 1, fb: "extends crea la relación 'es un' y hereda el código del padre." },
            { q: "¿Qué tiene de especial una clase abstracta?", opts: ["Es más rápida", "No se puede crear directamente; obliga a las hijas a completarla", "No tiene métodos", "Es privada"], correct: 1, fb: "Define el molde pero no se instancia sola; las subclases la completan." },
        ],
    },
    {
        id: "d_async", mod: "Dart", icon: Zap, mins: "35 min",
        title: "Programación asíncrona (Future, async/await y Streams)",
        intro: "Este es EL tema más importante. Tu app hace una sola cosa a la vez. Si pides datos a internet y esperas parado, la pantalla se congela. La asincronía resuelve esto: 'sigue trabajando mientras llega la respuesta'.",
        theory: [
            { h: "El problema: un solo hilo" },
            { p: "Flutter dibuja la pantalla 60 veces por segundo (un cuadro cada 16.6 ms). Si una tarea pesada bloquea ese hilo, la app se traba (lo llaman 'UI jank'). La solución es no esperar bloqueando." },
            { tip: { icon: "💡", text: "Regla de oro: si la tarea es ESPERAR (red, internet) → usa Future. Si la tarea es ESFUERZO de CPU (procesar algo enorme) → usa Isolate." } },
            { h: "Future: un valor que llegará 'en el futuro'" },
            { p: "Un Future es una promesa: 'te entregaré un resultado pronto'. Con async/await escribes código asíncrono que se LEE como si fuera normal, de arriba a abajo." },
            { code: { file: "future.dart", code: `// async marca que la función espera cosas
Future<String> obtenerDatos() async {
  // await = "espera aquí sin congelar la app"
  await Future.delayed(Duration(seconds: 2));
  return 'Datos listos';
}

void main() async {
  print('Pidiendo...');
  final res = await obtenerDatos(); // espera 2s
  print(res); // se imprime después
}` } },
            { tip: { icon: "⚠️", text: "Error típico de principiante: usar await sin poner async en la función. Si usas await, la función DEBE ser async." } },
            { h: "Stream: muchos valores a lo largo del tiempo" },
            { p: "Un Future entrega UN valor y termina. Un Stream es un canal que va entregando valores poco a poco (como un GPS mandando tu ubicación cada segundo)." },
            { code: { file: "stream.dart", code: `// async* + yield = generador de un stream
Stream<int> contador(int hasta) async* {
  for (var i = 1; i <= hasta; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i; // suelta un valor al canal
  }
}

void main() async {
  // await for = escucha cada valor que llega
  await for (final n in contador(3)) {
    print('Recibí: $n');
  }
}` } },
        ],
        practice: [
            {
                title: "Tu primer Future",
                goal: "Crea y consume un Future con async/await.",
                steps: [
                    "Future<String> obtenerMensaje() con delay de 2 seg",
                    "En main() (async), espéralo con await e imprímelo",
                    "Bonus: pon un print ANTES del await. ¿Cuál sale primero?",
                ],
                solution: `Future<String> obtenerMensaje() async {
  await Future.delayed(Duration(seconds: 2));
  return '¡Hola desde el futuro!';
}

void main() async {
  print('Esperando...');        // sale primero
  final msg = await obtenerMensaje();
  print(msg);                    // sale 2s después
}` },
            {
                title: "Stream contador",
                goal: "Emite números con pausas usando un Stream.",
                steps: ["Stream<int> contador(int hasta) con async*", "Cada valor con delay de 1s usando yield", "Consúmelo con await for"],
                solution: `Stream<int> contador(int hasta) async* {
  for (var i = 1; i <= hasta; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}

void main() async {
  await for (final n in contador(5)) {
    print('Número: $n');
  }
}` },
        ],
        quiz: [
            { q: "¿Qué palabra acompaña SIEMPRE a await?", opts: ["yield", "async", "return", "void"], correct: 1, fb: "Si una función usa await, debe estar marcada como async." },
            { q: "Para una tarea que entrega MUCHOS valores con el tiempo (ej. GPS), usas...", opts: ["Future", "Stream", "int", "bool"], correct: 1, fb: "Stream es un canal que emite varios valores; Future entrega solo uno." },
        ],
    },
    {
        id: "d_err", mod: "Dart", icon: AlertTriangle, mins: "20 min",
        title: "Manejo de errores",
        intro: "Los errores van a pasar (internet falla, datos vacíos...). En vez de que la app truene, los ATRAPAS y decides qué hacer. Eso es try/catch.",
        theory: [
            { code: { file: "trycatch.dart", code: `try {
  // código que PODRÍA fallar
  var resultado = 10 ~/ 0; // división entre cero
} catch (e) {
  // si falla, caemos aquí
  print('Algo salió mal: $e');
} finally {
  // esto SIEMPRE corre, falle o no
  print('Listo');
}` } },
            { h: "Excepciones personalizadas (tus propios errores)" },
            { code: { file: "excepcion.dart", code: `class SaldoInsuficiente implements Exception {
  final String mensaje;
  SaldoInsuficiente(this.mensaje);
  @override
  String toString() => mensaje;
}

void retirar(double saldo, double monto) {
  if (monto > saldo) {
    throw SaldoInsuficiente('No tienes fondos');
  }
}` } },
            { tip: { icon: "⚠️", text: "throw lanza el error. catch lo atrapa. No confundas throw (lanzar error) con return (devolver un valor normal)." } },
        ],
        practice: [
            {
                title: "Excepción personalizada",
                goal: "Crea y atrapa tu propio error de validación.",
                steps: [
                    "class ValidacionException implements Exception con mensaje",
                    "validarEdad(int edad) que lance la excepción si edad < 18",
                    "Atrápala en main() con try/catch e imprime el mensaje",
                ],
                solution: `class ValidacionException implements Exception {
  final String mensaje;
  ValidacionException(this.mensaje);
  @override
  String toString() => mensaje;
}

void validarEdad(int edad) {
  if (edad < 18) {
    throw ValidacionException('Debes ser mayor de edad');
  }
  print('Acceso permitido');
}

void main() {
  try {
    validarEdad(15);
  } catch (e) {
    print('Error: $e');
  } finally {
    print('Validación terminada');
  }
}` },
        ],
        quiz: [
            { q: "¿Qué bloque se ejecuta SIEMPRE, haya error o no?", opts: ["try", "catch", "finally", "throw"], correct: 2, fb: "finally corre pase lo que pase: ideal para limpiar o cerrar cosas." },
            { q: "¿Cuál palabra LANZA un error?", opts: ["catch", "throw", "return", "finally"], correct: 1, fb: "throw lanza la excepción; catch la atrapa." },
        ],
    },

    /* ===================== MÓDULO FLUTTER / PROVIDER ===================== */
    {
        id: "p_problema", mod: "Flutter + Provider", icon: AlertTriangle, mins: "20 min",
        title: "El problema: ¿por qué Provider?",
        intro: "Ya sabes Dart. Ahora, en una app real, muchas pantallas necesitan compartir el mismo dato (el usuario, el carrito...). Pasarlo a mano por todos lados es un dolor. Provider lo resuelve.",
        theory: [
            { h: "Prop drilling: el dolor de pasar datos a mano" },
            { p: "Imagina que el nombre del usuario está arriba del todo y lo necesitas en un botón 10 niveles más abajo. Sin Provider, tendrías que pasarlo por el constructor de cada widget intermedio, aunque esos widgets ni lo usen. Eso se llama 'prop drilling' y vuelve el código rígido." },
            { tip: { icon: "⚠️", text: "También setState() tiene límites: si dos widgets hermanos en ramas separadas necesitan el mismo dato, te toca 'subir el estado' al padre común y se redibuja de más." } },
            { p: "Provider es la solución: un 'depósito de datos' que vive aparte del árbol de widgets, y al que cualquier pantalla puede asomarse sin cadenas de constructores." },
        ],
        practice: [
            {
                title: "Identifica el problema",
                goal: "Razona (sin código): tienes Pantalla A con un TextField del nombre y Pantalla B con un AppBar que debe mostrar ese nombre. Piensa por qué pasarlo por constructores sería complicado, y qué pieza necesitarías para compartirlo.",
                steps: ["Piensa el flujo del dato", "Anota dónde se 'rompería' al pasarlo a mano"],
                solution: `// No hay código aún: es conceptual.
// Conclusión: necesitas un estado COMPARTIDO y central
// (un ChangeNotifier expuesto con Provider) para que
// ambas pantallas lean el mismo nombre sin pasarlo
// por cada constructor intermedio.` },
        ],
        quiz: [
            { q: "¿Qué es 'prop drilling'?", opts: ["Un tipo de bucle", "Pasar datos por muchos widgets que no los usan solo para llegar a uno lejano", "Un error de compilación", "Una animación"], correct: 1, fb: "Es la molestia de encadenar datos por constructores intermedios innecesarios." },
            { q: "Provider funciona como un...", opts: ["bucle infinito", "depósito de datos central al que las pantallas se asoman", "tipo de variable", "color"], correct: 1, fb: "Vive fuera del árbol normal y cualquier widget puede leerlo." },
        ],
    },
    {
        id: "p_filosofia", mod: "Flutter + Provider", icon: Radio, mins: "20 min",
        title: "La filosofía de Provider (Radio, Antena, Oyente)",
        intro: "Provider tiene 3 piezas. La mejor forma de entenderlas es con una analogía de radio: alguien transmite, una antena reparte la señal, y los oyentes escuchan.",
        theory: [
            { table: {
                    head: ["Pieza", "Analogía", "Qué hace"],
                    rows: [
                        ["ChangeNotifier", "La Radio 📻", "Guarda los datos y avisa cuando cambian"],
                        ["ChangeNotifierProvider", "La Antena 📡", "Mete la radio en la app para que todos la capten"],
                        ["Consumer / watch", "El Oyente 👂", "Los widgets que escuchan y se redibujan al cambiar"],
                    ] } },
            { p: "El ChangeNotifier es una clase normal que 'mezcla' (with) la habilidad de notificar. Cuando cambias un dato y llamas notifyListeners(), todos los oyentes se enteran y se actualizan solos." },
            { code: { file: "modelo.dart", code: `class CartProvider with ChangeNotifier {
  final List<String> _items = []; // privado
  List<String> get items => _items; // solo lectura

  void addItem(String item) {
    _items.add(item);
    notifyListeners(); // ¡avisa a todos los oyentes!
  }
}` } },
            { tip: { icon: "🔑", text: "La clave es notifyListeners(). Sin esa línea, cambias el dato pero la pantalla NO se entera y no se actualiza." } },
        ],
        practice: [
            {
                title: "Tu propio ChangeNotifier (contador)",
                goal: "Crea un modelo de estado con un contador.",
                steps: [
                    "class ContadorProvider with ChangeNotifier",
                    "Un int privado _cuenta y su getter",
                    "Método incrementar() que sume 1 y llame notifyListeners()",
                ],
                solution: `class ContadorProvider with ChangeNotifier {
  int _cuenta = 0;
  int get cuenta => _cuenta;

  void incrementar() {
    _cuenta++;
    notifyListeners(); // sin esto, la UI no se actualiza
  }
}` },
        ],
        quiz: [
            { q: "¿Qué pieza es 'La Radio' que guarda los datos y avisa de cambios?", opts: ["ChangeNotifierProvider", "Consumer", "ChangeNotifier", "BuildContext"], correct: 2, fb: "ChangeNotifier guarda el estado y emite las señales." },
            { q: "¿Qué línea avisa a la UI que un dato cambió?", opts: ["return", "notifyListeners()", "setState()", "print()"], correct: 1, fb: "notifyListeners() despierta a todos los oyentes para que se redibujen." },
        ],
    },
    {
        id: "p_impl", mod: "Flutter + Provider", icon: Layers, mins: "30 min",
        title: "Implementación paso a paso",
        intro: "Ya tienes el modelo (la radio). Ahora hay que (1) inyectarlo en la app con la 'antena' y (2) consumirlo en las pantallas. Tres pasos y listo.",
        theory: [
            { h: "Paso 1 — Inyectar el Provider en la raíz" },
            { code: { file: "main.dart", code: `void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => CartProvider(),
      child: const MyApp(),
    ),
  );
}` } },
            { h: "Paso 2 — Varios providers a la vez: MultiProvider" },
            { code: { file: "multi.dart", code: `void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: const MyApp(),
    ),
  );
}` } },
            { h: "Paso 3 — Consumir el dato (3 herramientas)" },
            { list: [
                    "context.watch<T>() → cuando el widget DEBE redibujarse al cambiar el dato.",
                    "context.read<T>() → para llamar métodos (ej. un botón) SIN redibujar.",
                    "Consumer<T> → envuelve solo la parte pequeña del árbol que cambia.",
                ] },
            { code: { file: "consumir.dart", code: `// watch: se actualiza cuando cambia el carrito
final items = context.watch<CartProvider>().items;

// read: solo dispara una acción, no escucha
onPressed: () => context.read<CartProvider>().addItem('Pan'),` } },
            { tip: { icon: "💡", text: "Regla simple: watch para MOSTRAR datos, read para EJECUTAR acciones (botones)." } },
        ],
        practice: [
            {
                title: "Conecta el contador a un botón",
                goal: "Usa watch para mostrar y read para incrementar.",
                steps: [
                    "Muestra la cuenta con context.watch<ContadorProvider>().cuenta",
                    "Un botón que llame context.read<ContadorProvider>().incrementar()",
                ],
                solution: `@override
Widget build(BuildContext context) {
  // watch: mostrar el valor (se redibuja al cambiar)
  final cuenta = context.watch<ContadorProvider>().cuenta;

  return Column(
    children: [
      Text('Cuenta: $cuenta'),
      ElevatedButton(
        // read: solo dispara la acción
        onPressed: () =>
            context.read<ContadorProvider>().incrementar(),
        child: const Text('Sumar'),
      ),
    ],
  );
}` },
        ],
        quiz: [
            { q: "Para que un botón ejecute una acción sin redibujarse, usas...", opts: ["watch", "read", "Consumer", "notifyListeners"], correct: 1, fb: "read accede al método sin suscribir el widget a cambios." },
            { q: "¿Para qué sirve MultiProvider?", opts: ["Para hacer bucles", "Para inyectar varios providers de forma limpia, sin anidar", "Para borrar el estado", "Para pintar colores"], correct: 1, fb: "Agrupa varios providers (auth, carrito, tema...) sin un anidamiento feo." },
        ],
    },
    {
        id: "p_buenas", mod: "Flutter + Provider", icon: Star, mins: "25 min",
        title: "Buenas prácticas (nivel pro)",
        intro: "Estos detalles separan el código de principiante del código profesional. No son difíciles; son hábitos.",
        theory: [
            { h: "1. Encapsulación: nunca expongas la lista mutable" },
            { p: "Si dejas tu lista pública, alguien podría hacer cart.items.add(x) desde un botón y olvidar notifyListeners(), rompiendo todo. Exponla como solo lectura." },
            { code: { file: "encapsular.dart", code: `final List<Product> _products = [];
// Copia de solo lectura: nadie la modifica por fuera
List<Product> get products => List.unmodifiable(_products);

void addProduct(Product p) {
  _products.add(p);
  notifyListeners(); // único camino para cambiar
}` } },
            { h: "2. Flujo unidireccional (UFD)" },
            { p: "Los datos van en UNA dirección: el estado baja hacia la UI (UI = f(State)), y la UI solo dispara eventos hacia arriba. La UI nunca cambia datos directamente; solo avisa 'pasó esto'." },
            { h: "3. View-State con enum: estados de pantalla limpios" },
            { p: "En vez de mil booleanos (isLoading, isError...), usa un enum con los estados posibles. Más claro y sin combinaciones imposibles." },
            { code: { file: "viewstate.dart", code: `enum HomeState { initial, loading, loaded, error }

// En la UI, un switch cubre todos los casos:
return switch (provider.state) {
  HomeState.loading => LoadingWidget(),
  HomeState.error   => ErrorWidget(),
  HomeState.loaded  => DataList(),
  _ => const SizedBox(),
};` } },
            { h: "4. Smart vs Dumb widgets" },
            { table: {
                    head: ["Tipo", "Responsabilidad", "Sabe de Provider?"],
                    rows: [
                        ["Smart (páginas)", "Conectar datos y acciones", "Sí (watch/read)"],
                        ["Dumb (piezas UI)", "Solo pintar y avisar eventos", "No (recibe por parámetros)"],
                    ] } },
            { tip: { icon: "⚡", text: "Regla #1 de rendimiento: NUNCA uses watch dentro de un onPressed. Usa read. El botón no necesita 'suscribirse' a cambios." } },
        ],
        practice: [
            {
                title: "Encapsula bien tu provider",
                goal: "Reescribe un provider para que la lista sea solo lectura.",
                steps: [
                    "Lista privada _items",
                    "Getter que devuelva List.unmodifiable(_items)",
                    "Método addItem que modifique y notifique",
                ],
                solution: `class CartProvider with ChangeNotifier {
  final List<String> _items = [];

  // Solo lectura: nadie la altera desde fuera
  List<String> get items => List.unmodifiable(_items);

  void addItem(String item) {
    _items.add(item);
    notifyListeners();
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }
}` },
        ],
        quiz: [
            { q: "¿Por qué exponer la lista como List.unmodifiable(_items)?", opts: ["Para que sea más rápida", "Para que nadie la modifique por fuera saltándose notifyListeners()", "Para borrarla", "Para colorearla"], correct: 1, fb: "Obliga a que todo cambio pase por tus métodos, manteniendo el control." },
            { q: "En 'UI = f(State)', ¿quién manda sobre lo que se ve?", opts: ["La UI cambia el estado directo", "El estado define la UI; la UI solo dispara eventos", "Nadie", "El botón"], correct: 1, fb: "Flujo unidireccional: el estado baja a la UI; la UI solo emite eventos hacia arriba." },
        ],
    },
];

const MODS = [
    { name: "Dart", sub: "El lenguaje base", icon: Code },
    { name: "Flutter + Provider", sub: "Manejo de estado", icon: Smartphone },
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

function Theory({ blocks }) {
    return blocks.map((b, i) => {
        if (b.p) return <p key={i} className="fl-p">{b.p}</p>;
        if (b.h) return <h3 key={i} className="fl-h3">{b.h}</h3>;
        if (b.code) return <CodeBlock key={i} {...b.code} />;
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
                    <p className="fl-sub">De cero a tu primera app móvil. Cada tema: teoría con palabras simples, práctica con soluciones y un quiz.</p>
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