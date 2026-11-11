// ================================
// CONTROLADOR DE JOBS
// ================================

import type { Request, Response, NextFunction } from "express";
import type { JobFilters } from "../types.js";
import { JobModel } from "../models/jobModel.js";

// ================================
// TIPAR REQUEST Y RESPONSE
// ================================

// Express tiene tipos genéricos para Request y Response:
// Request<Params, ResBody, ReqBody, Query>
// Response<ResBody>

// En Express con TypeScript, el objeto Request es genérico (usa diamantes < >) y
// acepta hasta 4 huecos o posiciones para definir el tipo de datos exacto que vas
// a recibir. El orden siempre es el mismo:
// Sabiendo esto, mira cómo está escrito tu código:Request<{}, {}, {}, JobFilters>

// 1º params ({}): Parámetros de la URL (como /jobs/:id). Como está vacío {},
// significa que esta ruta no recibe IDs en la URL.

// 2º resBody ({}): El cuerpo de la respuesta.

// 3º reqBody ({}): El cuerpo de la petición (req.body). Como es una petición GET
// (que busca datos, no los crea ni los edita), no lleva cuerpo (body), por eso está vacío.

// 4º query (JobFilters): Los parámetros de consulta o query params (los que van después
// del signo ? en la URL, por ejemplo: /jobs?tech=react&modality=remote). Aquí se le dice
// a TypeScript: "Los filtros que el usuario escriba en la URL deben cumplir estrictamente
// con la interfaz JobFilters".

// ================================
// CONTROLADOR COMO CLASE
// ================================

export class JobController {
	// GET /jobs
	// Query params tipados
	static async getAll(
		req: Request<{}, {}, {}, JobFilters>,
		res: Response,
	): Promise<void> {
		const { tech, modality, level } = req.query;
		const jobs = await JobModel.getAll({ tech, modality, level });
		res.json(jobs);
	}

	// GET /job/:id
	// Params tipados
	static async getById(
		req: Request<{ id: string }>,
		res: Response,
	): Promise<void> {
		const { id } = req.params;
		const job = await JobModel.getById(id);

		if (!job) {
			res.status(404).json({ message: "Job Not Found!" });
			return;
		}

		res.json(job);
	}

	// POST /jobs
	// El body ya viene validado por el middleware
	static async create(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const newJob = await JobModel.create(req.body);
			res.status(201).json(newJob);
		} catch (error) {
			next(error);
			// next(error): transfiere el control al siguiente manejador o middleware de errores.
		}
	}

	// PATCH /jobs/:id
	static async update(
		req: Request<{ id: string }>,
		res: Response,
	): Promise<void> {
		const { id } = req.params;
		const updateJob = await JobModel.update(id, req.body);

		if (!updateJob) {
			res.status(404).json({ message: "Job Not Found!" });
			return;
		}
		res.json(updateJob);
	}

	// DELETE /jobs/:id
	static async delete(
		req: Request<{ id: string }>,
		res: Response,
	): Promise<void> {
		const { id } = req.params;
		const deleted = await JobModel.delete(id);

		if (!deleted) {
			res.status(404).json({ message: "Job Not Found" });
			return;
		}

		res.status(204).send();
	}
}
