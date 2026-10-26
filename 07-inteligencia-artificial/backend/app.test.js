import { test, describe, before, after } from "node:test";
import assert from "node:assert";
import app from "./app.js";

// test: recibe una descripción de lo que se va a testear y un callback.
// describe: describe los tests, como su nombre indica.
// before: permite ejecutar código antes de ejecutar los tests.
// assert: permite hacer comparaciones.
// node js cuenta con unos módulos nativos que permiten hacer tests.

let server;
// es necesario hacer el test de nuestro servidor en un puerto diferente.
const PORT = 3456;
const BASE_URL = `http:localhost:${PORT}`;

// se ejecuta una vez para levantar el servidor, y es antes de hacer los tests.
before(async () => {
	// devolvemos una promesa
	return new Promise((resolve, reject) => {
		server = app.listen(PORT, () => resolve());
		server.on("error", reject); // captura un error al intentar abrir el puerto
	});
});

// despúes de todos los tests se ejecuta una vez para cerrar el servidor.
after(async () => {
	return new Promise((resolve, reject) => {
		server.close((err) => {
			if (err) return reject(err); // se rechaza la promesa si ocurre algún error al cerrar el servidor.
			// si el servidor se cierra de manera correcta llama a resolve(): para notificar al ejecutor de
			// tests que el proceso ha finalizado de manera limpia.
			resolve();
		});
	});
});

// hacemos los tests de la api
describe("GET /jobs", () => {
	test("debe responder con 200 y un array de trabajos", async () => {
		const response = await fetch(`${BASE_URL}/jobs`);

		// verificamos que realmente el statusCode sea un 200
		assert.strictEqual(response.status, 200);
		const json = await response.json();
		assert.ok(Array.isArray(json.data), "la respuesta debe ser un array");
	});

	test("debe filtrar trabajos por tecnología", async () => {
		const tech = "react";
		const response = await fetch(`${BASE_URL}/jobs?technology=${tech}`);

		assert.strictEqual(response.status, 200);
		const json = await response.json();
		assert.ok(
			json.data.every((job) => job.data.technology.includes(tech)),
			`Todos los trabajos deben incluir la tecnología ${tech}`,
		);
	});
});

describe("POST /jobs", () => {
	test("debe crear un trabajo mediante POST", async () => {
		// traemos el objeto con los datos
		const newJob = {
			id: crypto.randomUUID(),
			titulo: "Ricardo el de Tecnología",
			empresa: "ricardo Corp",
			ubicacion: "Remoto",
			descripcion: "Ingeniero electrico y técnico de refrigeración",
			data: {
				technology: ["node", "express"],
				modalidad: "remoto",
				nivel: "senior",
			},
		};

		// hacemos el fetch indicando el método y el header
		const response = await fetch(`${BASE_URL}/jobs`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newJob), // parseamos el objeto
		});
		// validar la respuesta
		assert.strictEqual(response.status, 201);
		// parsear el json y validar que contenga el id
		const json = await response.json();
		assert.ok(json.id, "El trabajo creado debe tener un id");
		// comprobamos que el título devuelto por el servidor sea exactamente
		// el mismo que se envió.
		assert.strictEqual(json.titulo, newJob.titulo);
	});
});

describe("PUT /jobs", () => {
	test("debe actualizar por el id mediante PUT", async () => {
		// 1ero: creamos un objeto
		const newJob = {
			titulo: "Ricardo el de Tecnología",
			empresa: "ricardo Corp",
			ubicacion: "Remoto",
			descripcion: "Ingeniero electrico y técnico de refrigeración",
			data: {
				technology: ["node", "express"],
				modalidad: "remoto",
				nivel: "senior",
			},
		};

		const createResponse = await fetch(`${BASE_URL}/jobs`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newJob),
		});

		const createJob = await createResponse.json();
		const id = createJob.id; // Obtenemos el ID real generado por el servidor

		//objeto con los datos a actualizar
		const updateJob = {
			titulo: "Ricardo el de Tecnología",
			empresa: "ricardo Corp",
			ubicacion: "Remoto",
			descripcion: "Ingeniero electrico y técnico de refrigeración",
			data: {
				technology: ["node", "express"],
				modalidad: "remoto",
				nivel: "senior",
			},
		};

		// hacemos el fetch indicando el método y el header
		const response = await fetch(`${BASE_URL}/jobs/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updateJob),
		});

		// const json = await response.json();

		if (updateJob) {
			return assert.strictEqual(response.status, 200);
		}
		return assert.strictEqual(response.status, 404);
	});
});

describe("DELETE /jobs", () => {
	test("debe eliminar por id con DELETE", async () => {
		// creamos el nuevo trabajo
		const newJob = {
			titulo: "Ricardo el de Tecnología",
			empresa: "ricardo Corp",
			ubicacion: "Remoto",
			descripcion: "Ingeniero electrico y técnico de refrigeración",
			data: {
				technology: ["node", "express"],
				modalidad: "remoto",
				nivel: "senior",
			},
		};

		// hacemos el fetch con la cabecera y el método
		const createResponse = await fetch(`${BASE_URL}/jobs`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newJob),
		});

		const createJob = await createResponse.json();
		const id = createJob.id;

		// hacemos el fetch con la cabecera y el método para eliminar
		const response = await fetch(`${BASE_URL}/jobs/${id}`, {
			method: "DELETE",
		});

		assert.strictEqual(response.status, 200);
	});
});
// para ejecutar los tests: NODE_ENV=test node --test seguido del archivo
// donde se encuentran los tests, en este caso (app.test.js).
