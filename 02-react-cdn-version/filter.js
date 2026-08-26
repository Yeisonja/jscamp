// otros tipos de eventos
// el evento de change es ideal para cambiar opciones de un select.
const filter = document.querySelector("#filter-location");
const mensaje = document.querySelector("#filters-selected-value");

// filtrar la location y agregar evento
filter.addEventListener("change", function () {
	const jobs = document.querySelectorAll(".job-listing-card"); // recuperar la clase de los articules.
	const selectedValue = filter.value;

	if (selectedValue) {
		mensaje.textContent = `Has seleccionado ${selectedValue}`;
	} else {
		mensaje.textContent = "";
	}

	jobs.forEach((job) => {
		// const modalidad = job.dataset.modalidad;

		// otra forma de recuperar los dataset
		const modalidad = job.getAttribute("data-modalidad");

		// con getAttribute también se puede recuperar la clase
		console.log(job.getAttribute("class"));

		// Es la mejor forma de hacerlo, la más recomendada.
		// cuándo mostrar?
		const isShown = selectedValue === "" || selectedValue === modalidad; // cuando ocurre esto muestralo.
		job.classList.toggle("is-hidden", isShown === false); // cuando isShown es false aplica la clase is-hidden.

		// if (selectedValue === "" || selectedValue === modalidad) {
		// 	job.classList.remove("is-hidden");
		// } else {
		// 	job.classList.add("is-hidden"); // ocultarlo
		// }
	});
});
