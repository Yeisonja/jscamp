// ================================
// INTERFACES EN TYPESCRIPT
// ================================
// las interfaces son una forma de crear tipos.
// Las interfaces definen la "forma" de un objeto.
// Son contratos que especifican qué propiedades y métodos debe tener.

// las interfaces funcionan igual que los types, pero con la diferencia
// que no se puede utilizar las union types con las interfaces.
// ejemplo: interface User = string | number
// las interfaces son más interesantes en lo que respecta a objetos.

// Types
export type UserType = {
	readonly name: string;
	readonly age: number;
	email?: string;
	role: "admin" | "user" | "editor";
};

// Interfaces
interface Persona {
	readonly name: string;
	readonly age: number;
}

interface Identificable {
	id: `user-${number}`;
}

interface User extends Persona, Identificable {
	email?: string;
	role: "admin" | "user" | "editor";
	saludar: () => string;
	login(): boolean;
}

interface Admin extends User {
	adminLevel: number;
	accessAllAreas: boolean;
	rootAdmin(): void;
}

const user: User = {
	id: "user-123567",
	name: "Yeison",
	age: 30,
	email: "yeisonjorgealcantara@gmail.com",
	role: "admin",
	saludar: () => "Hola!",
	login() {
		return true;
	},
};

// si en un fichero se declara la misma interfaz múltiples veces se fusionan.
interface Hero {
	nombre: string;
}

interface Hero {
	poder: string;
}

const hero: Hero = {
	nombre: "Spiderman",
	poder: "La Punzada",
};

// también se pueden utilizar interfaces para tipar funciones.

interface Calculadora {
	(a: number, b: number): number;
}

const calcular: Calculadora = (x, y) => x + y;

// ================================
// INTERFACES PARA CLASES
// ================================

interface MediaPlayer {
	play(): void;
	pause(): void;
	stop(): void;
}

interface AudioPlayer {
	volumen: number;
}

class Reproductor implements MediaPlayer, AudioPlayer {
	// volumen: number = 50;
	volumen = 50;
	play(): void {
		console.log("Reproduciendo...");
	}
	pause(): void {
		console.log("Pausado");
	}
	stop(): void {
		console.log("Detenido");
	}
}
