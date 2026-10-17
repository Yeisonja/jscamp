// @ts-check
import { test, expect } from "@playwright/test";
import { spec } from "node:test/reporters";

// prioridad a la hora de buscar elementos en la página web:
// 1. lo más recomendable es usar roles, aria label
// 2. etiquetas de texto, placeholders, nombres
// 3. data-testid
// 4. y por último, selectores de css.
// creamos nuestros tests
test("buscar empleos y aplicar a una oferta", async ({ page }) => {
	// vamos a la página
	await page.goto("http://localhost:5173");

	// utilizamos el buscador y recuperamos el rol del input
	const searchInput = page.getByRole("searchbox");
	await searchInput.fill("React"); // rellenamos el input con la palabra "React"

	// recuperamos el botón con el nombre "Buscar" y le hacemos click
	await page.getByRole("button", { name: "Buscar" }).click();

	// localizamos el job-listing-card
	// locator(): localiza por clases html
	const jobCards = page.locator(".job-listing-card");

	// podemos mirar si el primer elemento está visible
	await expect(jobCards.first()).toBeVisible();

	// si está visible el primer elemento vamos a recuperar el título
	// const firstJobTitle = jobCards.first().getByRole("heading", { level: 3 });
	const firstJobTitle = jobCards.first().locator("h3");

	// esperamos a que el título contenga React
	// await expect(firstJobTitle).toHaveText(/React Developer/i); // se puede colocar Regex
	await expect(firstJobTitle).toHaveText("Desarrollador de Software Senior"); // se puede colocar Regex

	// también podemos decir que inicie sesión
	await page.getByRole("button", { name: "Iniciar Sesión" }).click();

	// podemos añadir un favorito aplicando al primer botón
	const applyJob = page.getByRole("button", { name: "Aplicar" }).first();
	await applyJob.click(); // esperamos a que haga click

	// verificamos si ha cambiado el nombre del botón
	page.getByRole("button", { name: "Aplicado" }).first();
});

// para ejecutar los tests y verlos en los navegadores
// pnpm exec playwright test --ui

// Playwright es una herramienta de automatización de pruebas de código
// abierto desarrollada por Microsoft. Permite controlar navegadores web
// utilizando código, simulando la interacción del usuario, como hacer clic,
// completar formularios y navegar entre páginas. Es compatible con varios
// navegadores modernos como Chromium, Firefox y WebKit, y se utiliza
// principalmente para realizar pruebas end-to-end en aplicaciones web,
// así como para pruebas de regresión y auditorías de accesibilidad.
