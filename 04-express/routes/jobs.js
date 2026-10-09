import { Router } from "express";
import { JobController } from "../controllers/jobsController.js";

export const jobsRouter = Router();

jobsRouter.get("/", JobController.getAll);

// también podemos tener una ruta con parámetro dinámic
// recurso para recuperar un trabajo por su id
jobsRouter.get("/:id", JobController.getId);

// statusCode: 200 --> "ok"; 201 --> "Created"; 204 -> "No Content";
// 400 --> "Bad Request"; 401 --> "Unauthorized"; 402 --> "Payment Required";
// 403 --> "Forbidden"; 404 --> "Not Found"; 405 --> "Method Not Allowed"
// 407 --> "Proxy Authentication Required"; 408 --> "Request Timeout"

// recurso para crear un trabajo
jobsRouter.post("/", JobController.create);

// recurso para actualizar reemplazando un trabajo
jobsRouter.put("/:id", JobController.update);

// recurso actualizar un trabajo parcialmente
jobsRouter.patch("/:id", JobController.partialUpdate);

// recurso para borrar un trabajo
jobsRouter.delete("/:id", JobController.delete);
