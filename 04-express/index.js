import express from "express";
import { DEFAULTS } from "./config.js";
import cors from "cors";
import jobs from "./jobs.json" with { type: "json" };
// se puede importar pero de un modo diferente en node js

const PORT = process.env.PORT ?? DEFAULTS.PORT;

const app = express(); // creamos el servidor

// creamos el middleware que va a parsear el body a json de las peticiones POST.
// este middleware parsea automáticamente las peticiones POST, detecta si tiene la
// cabecera application/json y pasa ese objeto a request.body.
app.use(express.json());
// app.use(cors()); // podemos hacer esto pero no es tan buena práctica, porque cede permisos a todo

const ACCEPTED_ORIGINS = ["http://localhost:3000", "http://localhost:5173"];

app.use(
	cors({
		// detectamos el origen
		origin: (origin, callback) => {
			if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
				return callback(null, true);
				// el primer parámetro en los callback, casi siempre es para devolver el error.
			}
			return callback(new Error("Origen no permitido"));
		},
	}),
);

// leemos el archivo json con los empleos y lo parseamos, no es la forma correcta de hacerlo.
// const jobs = JSON.parse(readFileSync("./jobs.json", "utf-8"));

// podemos agregar middlewares: que es algo que es una función que se ejecuta antes
// de que llegue a una ruta, tiene acceso a los objetos request (petición) y
// response (respuesta), y también una función next() que permite pasar a la siguiente ruta.
// imaginemos que antes de pasar por todas las rutas que tenemos queremos loguearnos

// creamos el middleware
app.use((request, response, next) => {
	// esta función se va a ejecutar antes que todas las demás
	const timeString = new Date().toLocaleTimeString();
	console.log(`[${timeString}] ${request.method} ${request.url}`);
	next();
});

// también podemos crear una función, porque un middleware no deja de ser una función
// const previousHomeMiddleware = (request, response, next) => {
// 	console.log(`Ejecutando el middleware previo a la ruta /`);
// 	next();
// };

// creamos nuestra primera ruta
app.get("/", (request, response) => {
	response.send("<h1>Hello World! 🎈</h1>");
	// res.send(): termina la respuesta, ideal si solo se quiere renderizar un texto en pantalla
});

// podemos hacer el health check
app.get("/health", (request, response) => {
	return response.json({
		status: "ok",
		uptime: Math.round(process.uptime()),
	});
});

// vamos a hacer una Rest API
// en una Rest API cada url representa un recurso y lo que se hace con ese recurso
// dependa del método HTTP: (GET, POST, PUT o PATCH, DELETE). Ejemplo: app.get("/jobs")
// en una Rest API los recursos son independientes, uno no depende del otro

// otro concepto a tener en cuenta a la hora de hacer APIs Rest es la idempotencia.
// idempotencia: una operación idempotente es aquella que, al repetirse varias veces, no
// cambia el resultado más allá de su primera ejecución.
// los métodos (GET, PUT y DELETE) tienen que ser idempotentes

// vamos a crear el CRUD: Create, Read, Update y Delete

// esto es un recurso para recuperar todos los trabajos.
app.get("/jobs", (req, res) => {
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
	console.log({ limit, technology });
	console.log(req.query);
	// req.query: es la parte querystrings, es lo que va después de la
	// interrogante en la url

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
		filteredJobs = filteredJobs.filter((job) => job.data.nivel.includes(level));
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

	return res.json({
		data: paginatedJobs,
		total: filteredJobs.length,
		limit: limitNumber,
		offset: offsetNumber,
	});
});

// también podemos tener una ruta con parámetro dinámic
// recurso para recuperar un trabajo por su id
app.get("/jobs/:id", (req, res) => {
	// recuperamos el id
	const { id } = req.params;
	// los parámetros (params): siempre son cadenas de texto
	// const idNumber = Number(id); // es necesario validar que sea un número

	const job = jobs.find((job) => String(job.id) === String(id));

	if (!job) {
		return res.status(404).json({ error: "Job not found" });
	}

	return res.json(job);
});

// statusCode: 200 --> "ok"; 201 --> "Created"; 204 -> "No Content";
// 400 --> "Bad Request"; 401 --> "Unauthorized"; 402 --> "Payment Required";
// 403 --> "Forbidden"; 404 --> "Not Found"; 405 --> "Method Not Allowed"
// 407 --> "Proxy Authentication Required"; 408 --> "Request Timeout"

// recurso para crear un trabajo
app.post("/jobs", (req, res) => {
	// TODO:
	// 1ero: hay que sacar todos los campos del cuerpo de la respuesta
	const { titulo, empresa, ubicacion, data } = req.body;
	// es necesario añadir un middleware al body para transformar la respuesta

	// creamos el nuevo trabajo
	const newJob = {
		id: crypto.randomUUID(),
		titulo,
		empresa,
		ubicacion,
		data,
	};

	jobs.push(newJob); // esto lo haremos en una base de datos.
	return res.status(201).json(newJob);
});

// recurso para actualizar reemplazando un trabajo
app.put("/jobs/:id", (req, res) => {
	// TODO:
	const { id } = req.params;
	const { titulo, empresa, ubicacion, data } = req.body;

	const jobIndex = jobs.findIndex((job) => String(job.id) === String(id)); // encontramos el trabajo por su id
	// findIndex(): devuelve -1 si el elemento no existe en el array

	if (jobIndex === -1) {
		return res.status(404).json({ error: "Job Not Found" });
	}

	// accedemos al id y lo guardamos.
	const originalId = jobs[jobIndex].id;

	const updateJob = {
		id: originalId,
		titulo,
		empresa,
		ubicacion,
		data,
	};

	// reemplazamos el trabajo
	jobs[jobIndex] = updateJob; // En producción esto se hará con una query a la Base de Dato

	return res.status(200).json(updateJob);
});

// recurso actualizar un trabajo parcialmente
app.patch("/jobs/:id", (req, res) => {
	// TODO:
});

// recurso para borrar un trabajo
app.delete("/jobs/:id", (req, res) => {
	// TODO:
	const { id } = req.params;

	const jobIndex = jobs.findIndex((job) => String(job.id) === String(id));

	if (jobIndex === -1) {
		res.status(404).json({ error: "Job Not Found" });
	}

	// eliminamos un elemento con la posición encontrada
	jobs.splice(jobIndex, 1);
	// .splice(): cambia el contenido de un array eliminando elementos existentes
	// y/o agregando nuevos elementos.
	// la 1era posición, en este caso: jobIndex, indica donde se va a cambiar el array
	// la 2da posición, en este caso: 1, indica el número de elementos a eliminar.

	return res.status(200).json({ message: "Job deleted successfully" });
});

// escuchamos la aplicación
app.listen(PORT, () => {
	console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
