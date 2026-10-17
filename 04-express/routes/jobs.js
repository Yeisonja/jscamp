import { Router } from "express";
import { JobController } from "../controllers/jobsController.js";
import { validateJob, validateParcialJob } from "../schemas/jobSchema.js";

export const jobsRouter = Router();

// creamos el middlware para validar los tipos
function validateCreate(req, res, next) {
	const result = validateJob(req.body); // enviamos el cuerpo de la request
	// el safeParse(): nos permite saber si ha ido bien o no
	if (result.success) {
		req.body = result.data; // vamos a tener los datos validados
		return next(); // nos vamos a la siguiente ruta
	}
	// si ha ido mal
	return res
		.status(400)
		.json({ error: "Invalid Request", details: result.error.errors }); // dice el tipo de errores
}

// hacemos el middleware de validación parcial
function validateUpdate(req, res, next) {
	const result = validateParcialJob(req.body);
	if (!result.success) {
		return res.status(400).json({ error: JSON.parse(result.error.message) });
	}
	req.body = result.data;
	next();
}

jobsRouter.get("/", JobController.getAll);

// también podemos tener una ruta con parámetro dinámic
// recurso para recuperar un trabajo por su id
jobsRouter.get("/:id", JobController.getId);

// statusCode: 200 --> "ok"; 201 --> "Created"; 204 -> "No Content";
// 400 --> "Bad Request"; 401 --> "Unauthorized"; 402 --> "Payment Required";
// 403 --> "Forbidden"; 404 --> "Not Found"; 405 --> "Method Not Allowed"
// 407 --> "Proxy Authentication Required"; 408 --> "Request Timeout"

// recurso para crear un trabajo
jobsRouter.post("/", validateCreate, JobController.create);

// recurso para actualizar reemplazando un trabajo
jobsRouter.put("/:id", JobController.update);

// recurso actualizar un trabajo parcialmente
jobsRouter.patch("/:id", validateUpdate, JobController.partialUpdate);

// recurso para borrar un trabajo
jobsRouter.delete("/:id", JobController.delete);
