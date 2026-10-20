// ================================
// OBJETOS EN TYPESCRIPT
// ================================

// importamos el type alias
import type { User, UserEntity } from "./00-types.ts";

// inferencia de tipos de datos
// const user = {
// 	name: "Yeison",
// 	age: 30,
// };

// forma recomendada es usar los type alias
// los type alias también se pueden exportar
// type User = {
// 	name: string;
// 	age: number;
// };
// ya que tenemos nuestros tipos los podemos utilizar donde queramos.

// forma no recomendada de tipar objetos
// const user: { name: string; age: number } = {
// 	name: "Yeison",
// 	age: 30,
// };

// forma recomendada heredando de los type alias
const user: User = {
	name: "Yeison",
	age: 30,
	email: "yeisonjorgealcantara@gmail.com",
	rol: "admin",
	company: {
		name: "mi empresa",
		address: "los cacaitos, calle la toma",
	},
};

// user.name = "Jason";

const otroUser: User = {
	name: "Ricardo",
	age: 32,
	email: "ricardo@gmai.com",
	rol: "user",
};

const anotherUser: User = {
	name: "Ana",
	age: 24,
	rol: "editor",
};

// entity tiene que cumplir con todos los contratos
// se está creando una intercepción, es como combinar los tipos.
const entity: UserEntity = {
	id: 123,
	name: "Yeison",
	age: 30,
	email: "yeisonjorgealcantara@gmail.com",
	rol: "admin",
	birthdate: new Date("1996-04-03"),
};

// index signatures
// cuando no conoces las claves de antemano
// imaginemos que tenemos un diccionario
// se debe tipar de la manera siguiente
// es ideal para tipar objetos dinámicos y cuando se desconozcan las claves
type Dictionary = {
	[key: string]: string;
};

const dictionary: Dictionary = {
	apple: "A fruit that is usually red, green, or yellow.",
	banana: "A long yellow fruit.",
	cherry: "A small red fruit.",
};

type Translations = {
	[key: string]: string; // index signature
	// la llave y el valor son string
	// si se le pasa un entero como llave la transforma en un string.
};

const translations: Translations = {
	hello: "hola",
	goodbye: "adiós",
};
