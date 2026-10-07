import express from "express";
import { DEFAULTS } from "./config.js";
import jobs from "./jobs.json" with { type: "json" };
// se puede importar pero de un modo diferente en node js

const PORT = process.env.PORT ?? DEFAULTS.PORT;

const app = express(); // creamos el servidor

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

// esto es un recurso para recuperar todos los trabajos.
app.get("/jobs", (req, res) => {
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

	return res.json(paginatedJobs);
});

// también podemos tener una ruta con parámetro dinámic
// recurso para recuperar un trabajo por su id
app.get("/jobs/:id", (req, res) => {
	// recuperamos el id
	const { id } = req.params;
	// los parámetros (params): siempre son cadenas de texto
	const idNumber = Number(id); // es necesario validar que sea un número

	return res.json({
		job: { id: idNumber, title: `Job with id ${id}` },
	});
});

// recurso para crear un trabajo
app.post("/jobs", (req, res) => {
	// TODO:
});

// recurso para actualizar reemplazando un trabajo
app.put("/jobs/:id", (req, res) => {
	// TODO:
});

// recurso actualizar un trabajo parcialmente
app.patch("/jobs/:id", (req, res) => {
	// TODO:
});

// recurso para borrar un trabajo
app.delete("/jobs/:id", (req, res) => {
	// TODO:
});

// también podemos hacer rutas con partes opcionales
app.get("/a{b}cd", (req, res) => {
	// en este ejemplo la b es la opcional
	return res.send("abcd o acd");
});

// también está la ruta con comodín
app.get("/ab*cd", (req, res) => {
	// el asterisco es el comodín, es ideal para rutas largas que no se sabe como terminan
	return res.send("Después de la b y antes de la c puede ir cualquier cosa");
});

// para la rutas largas
app.get("/file/*filename", (req, res) => {
	return res.send("file/*");
});

// también se pueden utilizar rutas con regex
app.get(/.*fly$/, (req, res) => {
	return res.send("Terminando con fly");
});

// escuchamos la aplicación
app.listen(PORT, () => {
	console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
