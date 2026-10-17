// cargamos las variables de entorno
process.loadEnvFile();

// importamos
import { test } from "node:test";
import { Stagehand } from "@browserbasehq/stagehand";
import assert from "node:assert";

test("Un usuario puede entra a la JSconf y hacer click en la charla 'Node.js por dentro'", async () => {
	// inicializamos el Stagehand
	const stagehand = new Stagehand({
		env: "LOCAL",
		modelName: "gemini-2.5-flash",
	});

	await stagehand.initialize();

	// le decimos que vaya a ejecutar la página
	// va a crear una página
	const page = stagehand.page; // creamos un contexto de las páginas.

	// vamos a la página
	await page.goto("https://www.jsconf.es");

	await stagehand.act("Haz click en la charla 'Node.js por dentro'");

	// extraemos la información
	const { information } = await stagehand.extract(
		"Extrae el título de la charla",
	);
	console.log("Título de la charla: ", information);

	assert.strictEqual(
		information,
		"Node.js por dentro: entendiendo el runtime en producción",
	);

	await stagehand.close();
});

// console.log(process.env.GEMINI_API_KEY);

// loadEnvFile(): lee la variable de entorno
// vamos a crear las pruebas end to end con stagehand
// Stagehand.dev es un framework de automatización de
// navegadores con IA que permite a los desarrolladores
// crear flujos de trabajo donde parte de la lógica
// permanece en código y parte puede expresarse en
// lenguaje natural. Stagehand v4, lanzado en 2026, es
// una reescritura completa que ejecuta su lógica
// dentro de una extensión nativa del navegador,
// prometiendo el doble de velocidad que Playwright y
// un ahorro del 80% en tokens.
