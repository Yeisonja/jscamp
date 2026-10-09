import { DEFAULTS } from "../config.js";
import { JobModel } from "../models/jobModel.js";

export class JobController {
	static async getAll(req, res) {
		// es necesario agregar una cabecera para con los CORS
		// res.header("Access-Control-Allow-Origin", "http://localhost:5173");
		// la petición a la base de datos la haremos aquí

		// es necesario filtrar, así que hay que pasar los parámetros
		// express tiene sus propios parámetros: queryParams
		// cada vez que se haga una petición tendremos en req.query un
		// objeto con todos los query.params
		const {
			text,
			title,
			level,
			location,
			limit = DEFAULTS.LIMIT_PAGINATION,
			technology,
			offset = DEFAULTS.LIMIT_OFFSET,
		} = req.query;
		// req.query: es la parte querystrings, es lo que va después de la
		// interrogante en la url

		// llamamos al modelo
		const paginatedJobs = await JobModel.getAll({
			text,
			title,
			level,
			location,
			limit,
			technology,
			offset,
		});

		const limitNumber = Number(limit);
		const offsetNumber = Number(offset);

		return res.json({
			data: paginatedJobs,
			total: paginatedJobs.length,
			limit: limitNumber,
			offset: offsetNumber,
		});
	}

	// static: lo hacemos para que no sea necesario instanciar la clase
	// async: los métodos es recomendable hacerlos asincronos porque
	// podemos llamar a un modelo que lo requiera más adelante.
	static async getId(req, res) {
		// recuperamos el id
		const { id } = req.params;
		// los parámetros (params): siempre son cadenas de texto
		// const idNumber = Number(id); // es necesario validar que sea un número

		// llamamos al modelo
		const job = await JobModel.getById(id);

		if (!job) {
			return res.status(404).json({ error: "Job not found" });
		}

		return res.json(job);
	}

	static async create(req, res) {
		// 1ero: hay que sacar todos los campos del cuerpo de la respuesta
		const { titulo, empresa, ubicacion, data } = req.body;
		// es necesario añadir un middleware al body para transformar la respuesta

		// llamamos al modelo
		const newJob = await JobModel.create({ titulo, empresa, ubicacion, data });

		return res.status(201).json(newJob);
	}

	static async update(req, res) {
		const { id } = req.params;
		const { titulo, empresa, ubicacion, data } = req.body;

		// llamamos al modelo pasando el id y los datos recibidos
		const updateJob = await JobModel.update({
			id,
			input: { titulo, empresa, ubicacion, data },
		});

		if (updateJob === false) {
			return res.status(404).json({ error: "Job Not Found" });
		}

		return res.status(200).json(updateJob);
	}

	static async partialUpdate(req, res) {
		const { id } = req.params;
		const input = req.body;

		const updateJob = await JobModel.partialUpdate({
			id,
			input,
		});

		if (updateJob === false) {
			return res.status(404).json({ error: "Job Not Found" });
		}

		return res.status(200).json(updateJob);
	}

	static async delete(req, res) {
		const { id } = req.params;

		const deleted = await JobModel.deleteById(id);

		if (!deleted) {
			return res.status(404).json({ error: "Job Not Found" });
		}

		// eliminamos un elemento con la posición encontrada
		// jobs.splice(jobIndex, 1);
		// .splice(): cambia el contenido de un array eliminando elementos existentes
		// y/o agregando nuevos elementos.
		// la 1era posición, en este caso: jobIndex, indica donde se va a cambiar el array
		// la 2da posición, en este caso: 1, indica el número de elementos a eliminar.

		return res.status(200).json({ message: "Job deleted successfully" });
	}
}
