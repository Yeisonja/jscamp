// Fetch
// Método más importante para obtener datos: fetch
// recuperamos el div donde vamos a guardar las cards.
const container = document.querySelector(".jobs-listing");

// hacemos la petición para recuperar los datos del json
fetch("./data.json") /* fetch es asincrono */
	.then((response) => {
		return response.json(); // aquí está la respuesta, la trasformamos en json.
	})
	.then((jobs) => {
		// y aquí tenemos los datos trasformados en un objeto de javaScript.
		// hay que hacer una iteración
		jobs.forEach((job) => {
			// vamos a crear un aticle
			const article = document.createElement("article");

			// y el article va a tener la clase job-listing-card
			article.className = "job-listing-card";

			// se agregan los datasets extraídos del json.
			article.dataset.modalidad = job.data.modalidad;
			article.dataset.nivel = job.data.nivel;
			article.dataset.technology = job.data.technology;

			// ahora es necesario crear el interior, con todo
			// innerHTML no es buena práctica, te pueden hacer una injección html.
			// es necesario corregir esto con librerías.
			article.innerHTML = `
				<div>
					<h3>${job.titulo}</h3>
					<small>${job.empresa} | ${job.ubicacion}</small>
					<p>${job.descripcion}</p>
				</div>
				<button class="button-apply-job">Aplicar</button>
			`;

			// le añadimos el article como un hijo del div (container)
			container.appendChild(article);
		});
	});
