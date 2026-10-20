// ================================
// TUPLAS EN TYPESCRIPT
// ================================

// las tuplas se suelen utilizar mucho en React
// en lo que respecta al useState.
// useState(): devuelve una tupla de dos posiciones.
const persona: [string, number] = ["Yeison", 30];
const [nombre, edad] = persona;

// 1. Coordenadas
type Coordenadas = [latitude: number, longitude: number];
const [lat, lon]: Coordenadas = [40.764, -3.7647];

// 2. Colores RGB
type RGB = [number, number, number];
const rojo: RGB = [255, 0, 0];
const verde: RGB = [0, 255, 0];
const azul: RGB = [0, 0, 255];

// 3. Rango de valores
type Rango = [min: number, max: number];
const rangoEdad: Rango = [18, 65];

// 4. Tipo useState de React
type EstadoContador = [
	value: number,
	updateFunction: (nuevoValor: number) => void,
];

// Tuplas con REST elements
// la primera posición es una cadena de texto
// y el resto es un número.
type StringYMuchosNumeros = [string, ...number[]];
const datos: StringYMuchosNumeros = ["texto", 1, 3, 3, 2, 4, 6];

// también se pueden obtener:
const [texto, firstNumber, ...restOfNumbers]: StringYMuchosNumeros = [
	"texto",
	1,
	3,
	3,
	2,
	4,
	6,
	7,
	11,
	13,
];

// las tuplas también se pueden hacer readonly
type Config = readonly [server: string, port: number, useSSL: boolean];
const dbConfig: Config = ["localhost", 5432, true];
// dbConfig[0] = "remoteHost"; // Error: no se puede modificar una Tupla readonly
