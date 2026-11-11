// ================================
// TIPOS PARA LA API EXPRESS
// ================================

// ================================
// ENTIDADES
// ================================

export interface Job {
	id: string;
	title: string;
	company: string;
	location: string;
	description: string;
	data: JobData; // relación 1:1
	content?: JobContent;
}

export interface JobData {
	technology: string[];
	modality: "remote" | "onsite" | "hybrid";
	level: "junior" | "mid" | "senior";
}

export interface JobContent {
	description: string;
	responsibilities: string;
	requirements: string;
	about: string;
}

// ================================
// DTOs
// ================================
// DTO -> (Objeto de Transferencia de Datos).

// Para crear - sin id
export type CreateJobDTO = Omit<Job, "id">;
// Omit: se utiliza para quitar una propiedad existente

// Para actualizar - todo opcional
export type UpdateJobDTO = Partial<CreateJobDTO>;
// Partial<...>: Es una herramienta de TypeScript que toma cualquier
// interfaz o tipo y vuelve opcionales todas sus propiedades
// (añadiendo automáticamente un signo de interrogación ? a cada una).

// ================================
// FILTROS
// ================================

export interface JobFilters {
	tech?: string;
	modality?: JobData["modality"];
	level?: JobData["level"];
}

// ================================
// RESPUESTAS DE API
// ================================

export interface ApiError {
	message: string;
	errors?: unknown[];
}
