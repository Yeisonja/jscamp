// ================================
// ARRAYS EN TYPESCRIPT
// ================================

// hay 2 sintaxis en typescript para hacer arrays
// Sintaxis 1:
// inferencia de tipos
// const numeros = [1, 2, 3, 4, 5]; // pueder ser así
const numeros: number[] = [1, 2, 3, 4, 5]; // o pueder ser así
numeros.push(6);

// tuplas, que son para indicar unos números en concreto
const frutas: [string, string, string, number] = ["🍎", "🍐", "🍓", 10]; // Tupla

// Sintaxis 2:
const numerosAlt: Array<number> = [10, 20, 30]; // Genericos
numerosAlt.push(40);

// tipo de dato especial: any
// si creamos un array y no le damos la pista del tipo de dato
// aparece el any.
let empty = [];
empty.push(1);

// si queremos hacer un array de string vacío es mejor:
let strings: string[] = []; // mejor práctica

// se puede desactivar el any pero es mala práctica
// let a: any = "hola";
// a = 123;
// a = true;

// también se pueden tener tipos mixtos en los arrays
const mixto: (string | number)[] = [1, "dos", 3, "cuatro"]; // mixto de string o number
const arrayToFilter: (string | undefined)[] = ["uno", undefined, "tres"]; // mixto de string o undefined
