import cors from "cors";

const ACCEPTED_ORIGINS = ["http://localhost:3000", "http://localhost:5173"];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
	// devuelve un objeto
	/**
	 * Valor por defecto de la propiedad (acceptedOrigins = ACCEPTED_ORIGINS):
	Si le pasas un objeto pero no especificas la clave acceptedOrigins (o viene como undefined), 
	la variable tomará automáticamente el valor global de la constante ACCEPTED_ORIGINS.
	 */
	return cors({
		// detectamos el origen
		origin: (origin, callback) => {
			if (!origin || acceptedOrigins.includes(origin)) {
				return callback(null, true);
				// el primer parámetro en los callback, casi siempre es para devolver el error.
			}
			return callback(new Error("Origen no permitido"));
		},
	});
};
