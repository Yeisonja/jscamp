// function double(n) {
// 	return n * 2;
// }

// // llamamos la función
// double('4'); // 8

// JavaScript es:
// tipado dinámico y débil

function double2(n: number) {
	return n * 2;
}

const input = "2";
let parsedInput: number;

// validamos
if (typeof input === "string") {
	parsedInput = Number(input);
} else if (typeof input === "number") {
	parsedInput = input;
} else {
	parsedInput = 0;
}

// llamamos la función
const result = double2(parsedInput); // 4

console.log(result);

// TypeScript es:
// de tipado estático y fuerte
// El compilador puede analizar el código antes de ejecutarlo
// TypeScript no funciona en tiempo de ejecución, por tanto y
// demás, aunque se queje de que es incorrecto el tipo de dato
// lo va a ejecutar, por esto es necesario validar los datos
