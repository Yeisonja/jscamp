// ==========================
// FUNCIONES EN TYPESCRIPT
// ==========================

// ===========================
// TIPAR PARÁMETROS Y RETORNO
// ===========================

function sumar(a: number, b: number): number {
	return a + b;
}

function sumar2(a: number, b: number) {
	return a + b;
}
// ambas funciones devuelven un número

// arrow functions
const multiplicar = (a: number, b: number): number => {
	return a * b;
};

// en una línea
const dividir = (a: number, b: number): number => a / b;

// ===========================
// PARÁMETROS OPCIONALES
// ===========================

function saludar(nombre: string, apellido?: string): string {
	if (apellido) {
		return `Hola, ${nombre} ${apellido}`;
	}
	return `Hola, ${nombre}`;
}

// ===========================
// PARÁMETROS POR DEFECTO
// ===========================
// si se tiene un parámetro por defecto ya no puede ser opcional.

function crearUsuario(nombre: string, rol: string = "admin") {
	return {
		nombre,
		rol,
	};
}

// ===========================
// REST PARAMETERS
// ===========================

// se agrupan los argumentos de tipo number en la variable numeros.
function sumarNumeros(...numeros: number[]): number {
	return numeros.reduce((acc, curr) => acc + curr, 0);
}

sumarNumeros(1, 2);
sumarNumeros(1, 2, 3, 4, 5);

// =================================
// TIPO DE FUNCIÓN (Function Types)
// =================================

// ya tenemos el contrato de las funciones matemáticas.
// es decir, ya están tipadas correctamente.
type OperacionMatematica = (a: number, b: number) => number;

const division: OperacionMatematica = (a, b) => a / b;
const resta: OperacionMatematica = (a, b) => a - b;
