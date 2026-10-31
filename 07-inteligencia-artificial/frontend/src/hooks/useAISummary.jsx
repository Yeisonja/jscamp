import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useAISummary(jobId) {
	const [summary, setSummary] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// creamos un método para llamar a la API de la IA que hemos creado
	const generateSummary = async () => {
		setLoading(true);
		setError(null); // reseteamos
		setSummary("");

		try {
			// llamamos a la api de la ia
			const response = await fetch(`${API_URL}/ai/summary/${jobId}`);
			// comprobamos si la respuesta ha ido bien
			if (!response.ok) {
				throw new Error("Error fetching summary");
			}
			// vamos a crea un lector del stream de datos del body.
			const reader = response.body.getReader();
			const decoder = new TextDecoder(); // tenemos que decodificar el stream de datos.

			// y tenemos que hacer un bucle infinito porque no sabemos cuando la petición
			// del stream de datos termina.
			while (true) {
				const { done, value } = await reader.read(); // leemos el strem de datos.
				if (done) break; // si ha terminado rompemos el bucle infinito.

				// aquí tenemos los chunk. cada chunk es un fragmento de texto.
				const chunkText = decoder.decode(value, { stream: true });
				setSummary((prev) => prev + chunkText);
				// se van a ir guardando cada uno de los trozos en el estado.
			}
		} catch {
			// catcheamos el error
			setError("Error al generar el resumen");
		} finally {
			setLoading(false);
		}
	};

	return {
		summary,
		loading,
		error,
		generateSummary,
	};
}
