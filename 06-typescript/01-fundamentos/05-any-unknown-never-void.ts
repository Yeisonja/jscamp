// ==========================================
// ANY, UNKNOWN, NEVER Y VOID EN TYPESCRIPT
// ==========================================

// ==========================================
// ANY - El tipo que desactiva TYPESCRIPT
// ==========================================
// se debe evitar a toda costa porque se salta
// cualquier verificación de datos
let cualquierCosa: any = "hola";
cualquierCosa = 42;
cualquierCosa = true;

cualquierCosa.saludar();
const result = cualquierCosa + 8; // el resultado también es any.

// Dos veces en las que es bueno utilizar any
// 1. en migraciones de JS a TS
// 2. en librerías de terceros sin tipos

// ==========================================
// UNKNOWN - Alternativa más segura a ANY
// ==========================================
// UNKNOWN también acepta cualquier valor pero no
// se puede usar directamente, por lo que es necesario validar.
// lo validamos con type narrowing

let valorDesconocido: unknown = "hola";
valorDesconocido = 42;
valorDesconocido = true;
valorDesconocido = { nombre: "test" };

// type narrowing
if (typeof valorDesconocido === "number") {
	const resultadoSeguro = valorDesconocido + 10;
	console.log(resultadoSeguro);
} else if (typeof valorDesconocido === "string") {
	console.log(valorDesconocido.toUpperCase());
}

// ejemplo práctico: es para parsear a un json, pero no se sabe
// qué va a ser la sálida.
function parseJSON(jsonString: string): unknown {
	return JSON.parse(jsonString);
}
// no se sabe lo que está devolviendo
const datos2 = parseJSON('{"nombre": "Yeison", "edad": 30}');

// si lo queremos utilizar tenemos que validar
if (typeof datos2 === "object" && datos2 !== null && "nombre" in datos2) {
	console.log((datos2 as { nombre: string }).nombre);
}
// explicación de la sintaxis
// (datos2 as {nombre: string}).nombre: datos2 es un objeto que
// tiene la llave nombre de cadena de texto

// ==========================================
// VOID - Funciones que no retornan nada
// ==========================================

// void: indica que una función no retorna ningún valor
// una función void puede retornar undefined

function saludar(): void {
	console.log("Hola!");
}

function logError(errorMessage: string): void {
	if (errorMessage.length === 0) {
		return undefined;
		// se puede retornar undefined porque es un valor que no
		// es útil, es como un return vacío.
	}

	console.error("Error:", errorMessage);
}

// =================================
// NEVER - El tipo imposible
// =================================
// never: representa un valor que no va a ocurrir nunca,
// nunca va a retornar algo

// ejemplo: un bucle
function bucleInfinito(): never {
	while (true) {
		// ...
	}
}

// lanzar errores
function throwError(message: string): never {
	throw new Error(message);
}

function revisarValor(x: number | string) {
	if (typeof x === "number") {
		console.log("Es un número:", x);
	} else if (typeof x === "string") {
		console.log("Es una cadena:", x);
	} else {
		// console.log(x); // NUNCA DEBERÍA ENTRAR
		// aquí x es de tipo 'never'
		// como typescript solo funciona en tiempo de compilación es
		// buena práctica colocar algo de código aquí, como lanzar un error.
		// en tiempo de ejecución se nos puede escapar algo en la revisión de los tipos.
		throwError("Tipo no soportado");
	}
}

// ================================
// COMPARATIVA
// ================================

/*
┌──────────┬────────────────────────────────────────────────────────┐
│ Tipo     │ Descripción                                            │
├──────────┼────────────────────────────────────────────────────────┤
│ any      │ Acepta todo, permite todo. EVITAR.                     │
│ unknown  │ Acepta todo, pero requiere verificación. PREFERIBLE.   │
│ void     │ Para funciones que no retornan valor útil.             │
│ never    │ Para casos imposibles o funciones que no terminan.     │
└──────────┴────────────────────────────────────────────────────────┘
*/
