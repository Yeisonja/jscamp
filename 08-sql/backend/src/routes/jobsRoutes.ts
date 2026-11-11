// ================================
// RUTAS DE JOBS
// ================================

import { Router } from "express";
import { JobController } from "../controllers/jobController.js";

// ================================
// CREAR ROUTER TIPADO
// ================================

export const jobsRouter = Router();

// ================================
// DEFINIR RUTAS
// ================================

// GET /jobs - Listar todos los jobs
jobsRouter.get("/", JobController.getAll);

// GET /jobs/:id - Obtener un objeto por id
jobsRouter.get("/:id", JobController.getById);

// POST /jobs - Crear un job (con validación)
jobsRouter.post("/", JobController.create);

// PATCH /jobs/:id - Actualizar parcialmente un job
jobsRouter.patch("/:id", JobController.update);

// DELETE /jobs/:id - Eliminar un job
jobsRouter.delete("/:id", JobController.delete);
