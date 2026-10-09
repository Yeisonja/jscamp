import jobs from "../jobs.json" with { type: "json" };

export class JobModel {
	static async getAll({
		text,
		title,
		level,
		location,
		limit = 10,
		technology,
		offset = 0,
	}) {
		// vamos a filtrar
		let filteredJobs = jobs; // recomendable usar let para filtrar
		if (text) {
			const searchTerm = text.toLowerCase(); // convertimos a minúsculas
			// filtramos el texto por titulo o por descripción
			filteredJobs = filteredJobs.filter(
				(job) =>
					job.titulo.toLowerCase().includes(searchTerm) ||
					job.descripcion.toLowerCase().includes(searchTerm),
			);
		}

		// las paginaciones, los limites y filtros más adelante lo haremos en la base de datos.
		// filtramos por tecnología
		if (technology) {
			filteredJobs = filteredJobs.filter((job) =>
				job.data.technology.includes(technology),
			);
		}

		// filtramos por nivel
		if (level) {
			filteredJobs = filteredJobs.filter((job) =>
				job.data.nivel.includes(level),
			);
		}

		// filtramos por ubicación
		if (location) {
			filteredJobs = filteredJobs.filter((job) =>
				job.ubicacion.includes(location),
			);
		}

		// paginación
		const limitNumber = Number(limit);
		const offsetNumber = Number(offset);

		let paginatedJobs = filteredJobs.slice(
			offsetNumber,
			offsetNumber + limitNumber,
		);
		// offset: el número de elementos a saltar
		// limit: el número de elemetos a traer
		// en esta paginación, offset es 0 y limit es 10
		// quiere decir: por cada página trae los primeros 10

		return paginatedJobs;
	}

	static async getById(id) {
		const job = jobs.find((job) => String(job.id) === String(id));
		return job;
	}

	static async create({ titulo, empresa, ubicacion, data }) {
		// creamos el nuevo trabajo
		const newJob = {
			id: crypto.randomUUID(),
			titulo,
			empresa,
			ubicacion,
			data,
		};

		jobs.push(newJob); // esto lo haremos en una base de datos.

		return newJob;
	}

	static async update({ id, input }) {
		const jobIndex = jobs.findIndex((job) => String(job.id) === String(id));

		// el método findIndex(): devuelve -1 si no existe
		// si no existe retornamos false o null
		if (jobIndex === -1) return false;

		// actualizamos manteniendo el ID original
		const updateJob = {
			...jobs[jobIndex], // conserva valores previos por si algún campo no viene
			...input, // sobrescribe los nuevos valores, solo las propiedades que venían en input.
			id: jobs[jobIndex].id, // asegura que el ID no se modifique
		};

		jobs[jobIndex] = updateJob; // reemplazamos en el array

		return updateJob;
	}

	static async partialUpdate({ id, input }) {
		const jobIndex = jobs.findIndex((job) => String(job.id) === String(id));

		// si el trabajo no existe
		if (jobIndex === -1) return false;

		// creamos el objeto actualizado
		const updateJob = {
			...jobs[jobIndex],
			...input,
			id: jobs[jobIndex].id,
		};

		jobs[jobIndex] = updateJob;
		return updateJob;
	}

	static async deleteById(id) {
		const jobIndex = jobs.findIndex((job) => String(job.id) === String(id));

		if (jobIndex === -1) return false;

		// eliminamos el elemento en la base de datos o el array.
		jobs.splice(jobIndex, 1);

		return true;
	}
}
// el modelo es el responsable de saber de dónde obtener los datos,
// cómo crear los datos, cómo actualizarlos, cómo eliminarlos,
// en resumen, va a saber como manipular los datos.
