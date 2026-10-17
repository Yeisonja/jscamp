import * as z from "zod";

// importamos todos los módulos de zod

// creamos el esquema del trabajo
const jobSchema = z.object({
	titulo: z
		.string({
			error: "El título es obligatorio",
		})
		.min(3, "El título debe tener al menos 3 carctares")
		.max(100, "El título no puede exceder los 100 caracteres"),
	empresa: z.string(),
	ubicacion: z.string(),
	descripcion: z.string().optional(),
	data: z.object({
		technology: z.array(z.string()),
		modalidad: z.string(),
		nivel: z.string(),
	}),
});

// creamos las validaciones y las usaremos en las rutas.
export function validateJob(input) {
	return jobSchema.safeParse(input);
}

export function validateParcialJob(input) {
	return jobSchema.partial().safeParse(input);
}
// safeParse: nos permite, es que parseamos un input que intenta
// cumplir con este esquema y si falla devuelve la respuesta.
// con partial(): se parsea de manera parcial solo una parte, es útil
// si queremos actualizar, por ejemplo: el titulo.
// zod: es una biblioteca minimalista que se utiliza para validar
// los tipos.
// zod y typescript
// TypeScript: se ejecuta en BUILD TIME (tiempo de construcción)
// Zod: se ejecuta en RUN TIME (tiempo de ejecución)
// esto quiere decir que TypeScript no va a revisar los datos una vez levantada
// la api mientras que zod si lo hace, valida datos que vienen del exterior.
