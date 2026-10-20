// exportamos el type alias
export type Company = {
	name: string;
	address: string;
	phone?: string;
};

// también están los interceptions type
// un interceptions type: quiere decir que tiene que cumplir más de uno a la vez.
type UserId = {
	readonly id: string | number;
};

type UserWidthBirthdate = {
	birthdate: Date;
};

export type User = {
	readonly name: string;
	readonly age: number;
	email?: string; // podemos colocar propiedades opcionales
	// también podemos tener objetos anidados
	company?: Company;
	// también podemos asignar roles
	rol: "admin" | "user" | "editor"; // union types o literal types
};

// userEntity es un interception type, por ende tiene que cumplir
// con las dos opciones.
export type UserEntity = User & UserId & UserWidthBirthdate;

// readonly: quiere decir, solo lectura. como su nombre indica,
// las propiedades que tengan readonly no pueden ser modificadas.
// para que las propiedades sean de solo lectura también está Object.freeze().
// Object.freeze(): trabaja en tiempo de ejecución
const user: User = Object.freeze({
	name: "Yeison",
	age: 30,
	email: "yeisonjorgealcantara@gmail.com",
	rol: "editor",
});

// readonly ayuda en tiempo de compilación

// a modo de ejemplo
export type Configuration = {
	readonly apiKey: string;
	readonly theme: "dark" | "light";
};

// otros ejemplos de literal types:
type Answer = "si" | "no" | true | false | 1 | 0;

type Level = 1 | 2 | 3 | 4 | 5;

type Direction = "up" | "down" | "left" | "right"; // para videojuegos
