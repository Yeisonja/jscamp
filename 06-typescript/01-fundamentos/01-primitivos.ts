// ================================
// TIPOS PRIMITIVOS EN TYPESCRIPT
// ================================

// si es una constante su valor no va a cambiar.
let nombre = "Jason";

// TypeScript: infiere el tipo de dato, es decir, que cree que el
// tipo de dato es un número
let edad = 48;

let isDeveloper: boolean; // se le asigna el tipo de dato

// 1. strings
const nombre2: string = "Yeison";
const saludo = `Hola, ${nombre2}`; // string inferido
const vacio: string = "";

// 2. números
const edad2 = 30;
const price = 19.49;
const numeroNegativo = -30.83;
const color = 0x09f; // tipo inferido como number (hexadecimal)
let infinito = Infinity; // tipo inferido como number

// 3. booleanos
let isActive: boolean = true;
isActive = false;

// 4. nulos e indefinidos
let nulo: null = null;
let indefinido: undefined = undefined;
// undefined: Significa que una variable ha sido declarada pero
// aún no se le ha asignado ningún valor.
// null: Representa la ausencia intencional de cualquier
// valor o un objeto nulo.

// variables que pueden ser una o más cosas a la vez
let age: number | null = null;
// age está declarado con un tipo unión: puede ser un number o null.
age = 30;
age = null;
age = 20;
// Antes de usarlo como número, debes comprobar que no sea null:
// if (age !== null) {
// 	console.log(age + 1);
// }

// números grandes
const numeroGrande: bigint = 987373730000083n;

// también están los symbol
const id: symbol = Symbol("id");
/**
 * `symbol` es un tipo primitivo de JavaScript que sirve para crear 
 * **identificadores únicos**.
```ts
const id: symbol = Symbol("id");
```
Aquí `Symbol("id")` crea un símbolo nuevo. El texto `"id"` es solo una 
descripción útil para depuración; no hace que dos símbolos sean iguales:
```ejemplo:
Symbol("id") === Symbol("id"); // false
```
Los símbolos se usan, por ejemplo, como claves únicas de propiedades en 
objetos:
```ts
const id = Symbol("id");
const usuario = { [id]: 123 };
console.log(usuario[id]); // 123
```
No se crean con `new`: se llama directamente a `Symbol(...)`.
 */

// diferencia en la inferencia de datos para adivinar el
// tipo para let y const
const ciudad = "Madrid";
// ciudad = "Barcelona"; // no se puede reasignar porque es una constante
// y el tipo es el propio valor.
console.log(typeof ciudad);

let pais = "España";
pais = "México"; // válido
