// ================================
// MODELO DE JOB
// ================================

import crypto from "node:crypto";
import { db } from "../db/database.js";
import type { Job, CreateJobDTO, UpdateJobDTO, JobFilters } from "../types.js";

// Base de datos en memoria (en producción sería una BD real)
// no lo vamos a usar
const jobs: Job[] = [];

// ================================
// CLASE DEL MODELO
// ================================

export class JobModel {
	// Obtener todos los jobs con filtros opcionales
	static async getAll(filters?: JobFilters): Promise<Job[]> {
		// creamos la petición
		let query = `
			SELECT j.*, GROUP_CONCAT(jt.technology) AS technologies
			FROM jobs j
			JOIN job_technologies jt ON j.id = jt.job_id
		`;

		// creamos dos arrays vacíos
		const conditions: string[] = [];
		const params: unknown[] = [];

		// filtramos
		if (filters?.tech) {
			// conditions.push(`jt.technology = ?`);

			// o podemos agregar una sub-consulta
			conditions.push(`j.id IN (
				SELECT job_id FROM job_technologies WHERE technology = ?
				)`);
			params.push(filters.tech);
		}

		if (filters?.modality) {
			conditions.push(`j.modality = ?`);
			params.push(filters.modality);
		}

		if (filters?.level) {
			conditions.push(`j.level = ?`);
			params.push(filters.level);
		}

		if (conditions.length > 0) {
			query += "WHERE " + conditions.join(" AND ");
		}

		// 4. Agrupamiento obligatorio por el GROUP_CONCAT
		query += " GROUP BY j.id";

		// 5. Ejecución con tipado seguro (ej. usando better-sqlite3)
		const rows = db.prepare(query).all(...params) as Array<{
			id: number | string;
			title: string;
			company: string;
			location: string;
			description: string;
			modality: "remote" | "onsite" | "hybrid";
			level: "junior" | "mid" | "senior";
			technologies: string | null;
		}>;

		// 6. Mapeo a la entidad de dominio
		return rows.map(
			(row): Job => ({
				id: String(row.id),
				title: row.title,
				company: row.company,
				location: row.location,
				description: row.description,
				data: {
					// Aseguramos que si technologies es null/undefined no rompa el split
					technology: row.technologies
						? row.technologies.split(",").map((t) => t.trim())
						: [],
					modality: row.modality,
					level: row.level,
				},
			}),
		);
	}

	// Obtener un job por id
	static async getById(id: string): Promise<Job | undefined> {
		// return jobs.find((job) => job.id === id);
		// GROUP_CONCAT(): Agrupa los valores de una columna y los convierte en una cadena de texto.
		// AS technologies: Le asignamos un nombre a esa columna resultante.
		// LEFT JOIN: relaciona dos tablas
		// ¿Por qué LEFT JOIN? Porque queremos obtener el trabajo incluso cuando no tenga tecnologías registradas.
		// El LEFT JOIN conserva los trabajos de la tabla izquierda aunque no tengan coincidencias en la tabla derecha.
		// GROUP BY j.id: Agrupa los resultados por identificador del trabajo.

		const row = db
			.prepare(
				`
			SELECT 
					j.*, 
					GROUP_CONCAT(jt.technology) AS technologies,
					jc.description AS content_description,
					jc.responsibilities AS content_responsibilities,
					jc.requirements AS content_requirements,
					jc.about AS content_about
			FROM jobs j
			LEFT JOIN job_technologies jt ON j.id = jt.job_id
			LEFT JOIN job_content jc ON j.id = jc.job_id
			WHERE j.id = ?
			GROUP BY j.id	
		`,
			)
			.get(id) as  // realizamos una aserción de tipos.
			| {
					id: number | string;
					title: string;
					company: string;
					location: string;
					description: string;
					modality: Job["data"]["modality"];
					level: Job["data"]["level"];
					technologies: string | null;
					content_desctiption: string | null;
					content_responsibilities: string | null;
					content_requirements: string | null;
					content_about: string | null;
			  }
			| undefined;

		if (!row) return undefined;

		const job: Job = {
			id: String(row.id),
			title: row.title,
			company: row.company,
			location: row.location,
			description: row.description,
			data: {
				technology: row.technologies ? row.technologies.split(",") : [],
				modality: row.modality,
				level: row.level,
			},
		};

		if (
			row.content_desctiption !== null &&
			row.content_responsibilities !== null &&
			row.content_requirements !== null &&
			row.content_about !== null
		) {
			job.content = {
				description: row.content_desctiption,
				responsibilities: row.content_responsibilities,
				requirements: row.content_requirements,
				about: row.content_about,
			};
		}

		return job;
	}

	// Crear un nuevo job
	static async create(input: CreateJobDTO): Promise<Job> {
		const id = crypto.randomUUID();

		// .run() ejecuta una consulta que modifica la base de datos.
		// En cambio, .get() se utiliza para obtener un único registro.

		const createJob = db.transaction(() => {
			db.prepare(
				`
				INSERT INTO jobs (id, title, company, location, description, modality, level) 
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`,
			).run(
				id,
				input.title,
				input.company,
				input.location,
				input.description,
				input.data.modality,
				input.data.level,
			);

			// ¿Por qué guardamos la consulta en insertTechnology?
			// Porque vamos a utilizar la misma consulta varias veces.
			const insertTechnology = db.prepare(`
				INSERT INTO job_technologies (job_id, technology) 
				VALUES (?, ?)	
			`);

			// hacemos un bucle for of: Significa: "Por cada elemento que exista dentro
			// del array input.data.technology, guarda ese elemento temporalmente en una
			// variable llamada technology".

			for (const technology of input.data.technology) {
				insertTechnology.run(id, technology);
			}

			if (input.content) {
				db.prepare(
					`
					INSERT INTO job_content (
					job_id, description, responsibilities, requirements, about) 
					VALUES (?, ?, ?, ?, ?)	
				`,
				).run(
					id,
					input.content.description,
					input.content.responsibilities,
					input.content.requirements,
					input.content.about,
				);
			}

			// copiamos las propiedades del objeto y la devolvemos
			return { ...input, id };
		});

		return createJob(); // Ejecutamos la transacción y devolvemos el resultado de la función.
	}

	// Actualizar un job
	static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {}

	// Eliminar un job
	static async delete(id: string): Promise<boolean> {}
}
