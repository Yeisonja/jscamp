// ========================================
// TYPE NARROWING (Estrechamiento de tipos)
// ========================================

// type narrowing es la técnica de reducir un tipo más amplio
// a uno más específico mediante comprobaciones.

function procesar(valor: number | string) {
	// <-- el "valor" es de tipo "number | string"
	console.log(valor);

	if (typeof valor === "number") {
		// el "valor" es de tipo "number"
		console.log("El valor es un número:", valor.toFixed(2));
	} else {
		// el "valor" es de tipo "string"
		console.log("El valor es una cadena:", valor.toUpperCase());
	}
}

// type narrowing también se puede utilizar para ver
// si existe o no existe algo.

function imprimirMensaje(mensaje: string | null | undefined) {
	// <-- el "mensaje" es de tipo "string | null | undefined"
	// lo primero a comprobar es verificar que el mensaje sea truthy
	// ya que null y undefined son falsy
	if (mensaje) {
		console.log(mensaje.toLowerCase());
	}
}

// OPERATOR NARROWING

type Pez = {
	nadar: () => void;
	nombre: string;
};

type Pajaro = {
	volar: () => void;
	nombre: string;
};

type Perro = {
	ladrar: () => void;
	nombre: string;
};

type Animal = Pez | Pajaro | Perro;

function moverAnimal(animal: Animal) {
	// hacemos el operator narrowing en lugar de typeof
	if ("nadar" in animal) {
		console.log("El pez está nadando");
		animal.nadar();
	} else if ("volar" in animal) {
		console.log("El pájaro está volando");
		animal.volar();
	} else {
		console.log("El perro está ladrando");
		animal.ladrar();
	}
}

// instanceof narrowing

function formatDate(value: Date | string): string {
	// si el valor es una instancia de la fecha
	if (value instanceof Date) {
		return value.toUTCString(); // devuelve la fecha
		// toUTCString(): toma la fecha y la convierte en una cadena de texto
		// (string) utilizando el estándar de tiempo universal
	}

	return new Date(value).toUTCString();
	// new Date(value): transforma en un objeto de fecha válido
}
