// forma más correcta de obtener todos los botones.
// añadir un solo evento al contenedor padre de los botones.
const jobsListingSection = document.querySelector(".jobs-listing");

// le podemos colocar un optional chainning por si el elemento es null.
jobsListingSection?.addEventListener("click", function (event) {
	// console.log(event.target); // podemos ver cual es el elemento que ha recibido el click.
	const element = event.target;
	if (element.classList.contains("button-apply-job")) {
		element.textContent = "¡Aplicado!";
		element.classList.add("is-applied");
		element.disabled = true;
	}
});

// - comentarios con otros eventos interesantes
// querySelectorAll devuelve una lista y por ende, se puede iterar.
// const botones = document.querySelectorAll(".button-apply-job");

// const boton = document.querySelector(".button-apply-job");
// recupera solo el primer boton que encuentre

// verificar si el boton existe
// if (boton !== null) {
// 	boton.addEventListener("click", () => {
// 		boton.textContent = "¡Aplicado!";
// 		boton.classList.add("is-applied");
// 		boton.disabled = true;
// 	});
// }

// iterar los botones. es una forma de obtener todos los valores de los botones.
// botones.forEach((boton) => {
// 	boton.addEventListener("click", () => {
// 		boton.textContent = "¡Aplicado!";
// 		boton.classList.add("is-applied");
// 		// boton.style.backgroundColor = "green";
// 		// boton.style.cursor = "not-allowed";
// 		boton.disabled = true;
// 	});
// });

// ejemplo de eventos
// const searchInput = document.querySelector("#empleos-search-input");

// searchInput.addEventListener("input", () => {
// 	console.log(searchInput.value);
// });

// // el evento de blur se dispara cuando el evento pierde el foco.
// searchInput.addEventListener("blur", () => {
// 	console.log("Se dispara cuando el campo pierde el foco");
// });

// const searchForm = document.querySelector("#empleos-search-form");

// searchForm.addEventListener("submit", (event) => {
// 	event.preventDefault;

// 	console.log("submit");
// });

// document.addEventListener("keydown", (event) => {
// 	console.log("Tecla presionada: ", event.key);
// 	console.log("¿Está pulsada la tecla shift?", event.shiftKey);
// 	console.log("¿Está pulsada la tecla ctrl?", event.ctrlKey);
// 	console.log("¿Está pulsada la tecla alt?", event.altKey);
// });
