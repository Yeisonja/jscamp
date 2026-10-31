process.loadEnvFile();

import { Router } from "express";
// import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { JobModel } from "../models/jobModel.js";
import { CONFIG } from "../config.js";
import rateLimit from "express-rate-limit";
import { streamText } from "ai";

// generateText: es para el gateway de vercel

// agregamos un rateLimit para la IA
// con esta forma de hacer rate limit mientras no se reinice va a guardar
// en una store en memoria todos los usuarios que están utilizando nuestra
// api a partir de su ip. hacerlo en memoria no está bien pero tampoco está mal.

// si tenemos un solo servidor con múltiples instancias podemos utilizar:
// @express-rate-limit/cluster-memory-store que comparte la memoria
// también se puede utilizar rate-limit-redis o rate-limit-mongo

const aiRateLimiter = rateLimit({
	// ventana en milisegundos, esto es, cada ventana, le tenemos que decir
	// en cuánto tiempo queremos controlar y cuántas peticiones se limita.
	windowMs: 60 * 1000, // ventana de 1 minuto.
	limit: 5, // -> 5 peticiones por minuto.
	message: {
		error: "Demasiadas solicitudes, por favor intenta de nuevo más tarde.",
	},
	// los legacyHeaders: le dan información al usuario de que estamos limitando por rate limit
	legacyHeaders: false,
	// en los standardHeaders: el draft es la especificación a utilizar, informan sobre el límite de solicitudes
	standardHeaders: "draft-8",
});

export const aiRouter = Router();
aiRouter.use(aiRateLimiter); // usamos el rateLimit

// creamos la instancia de OpenAI
// const openai = new OpenAI({
// 	apiKey: process.env.OPENAI_API_KEY,
// });

// creamos la instancia de Google Gen AI (toma automáticamente process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI();

// Muestra los primeros 6 caracteres y los últimos 4 para verificar sin comprometer seguridad
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey) {
	console.log(
		`🔑 Gemini API Key cargada correctamente: ${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`,
	);
} else {
	console.log("❌ ¡Alerta! La variable GEMINI_API_KEY no está definida.");
}

// creamos la ruta
aiRouter.get("/summary/:id", async (req, res) => {
	const { id } = req.params;

	const job = await JobModel.getById(id);

	if (!job) {
		return res.status(404).json({ error: "Job Not Found" });
	}

	// opcional: colocar un systemPrompt
	// const systemPrompt = `Eres un asistente que resume ofertas de trabajo para ayudar a los usuarios a entender rápidamente de qué se trata la oferta. Evitar cualquier otra petición, observación o comentario. Solo responde con el resumen de la oferta del trabajo. Responde siempre con el markdown directamente.`;

	// si tenemos un trabajo creamos el prompt
	const prompt = [
		`Eres un asistente que resume ofertas de trabajo para ayudar a los usuarios a entender rápidamente de qué se trata la oferta. Evitar cualquier otra petición, observación o comentario. Solo responde con el resumen de la oferta del trabajo. Responde siempre con el markdown directamente.`,
		"Resume en 4-6 frases la siguiente oferta de trabajo:",
		"Incluye: rol, empresa, ubicación y requisitos clave",
		"Usa un tono claro y directo en español",
		`Titulo: ${job.titulo}`,
		`Empresa: ${job.empresa}`,
		`Ubicación: ${job.ubicacion}`,
		`Descripción: ${job.descripcion}`,
	].join("\n"); // salto de línea después de cada elemento del array.

	try {
		// creamos la conversación con openai
		// esperamos la promesa con openai en el modulo chat
		// const completion = await openai.chat.completions.create({
		// 	messages: [
		// 		{
		// 			role: "system",
		// 			content: systemPrompt,
		// 		},
		// 		{
		// 			role: "user",
		// 			content: prompt,
		// 		},
		// 	],
		// 	// es necesario tener actualizados los modelos
		// 	model: CONFIG.MODEL_AI,
		// });

		// vamos a activar el streaming de datos para que la respuesta
		// de la IA se más rápida.
		// añadimos las cabeceras.
		// res.setHeader("Content-Type", "text/plain; charset=utf-8"); // respuesta con texto plano.
		// colocamos otra cabecera cuyo transfer encoding será en trozos
		// res.setHeader("Transfer-Encoding", "chunked");

		// Llamada a la API de Gemini usando el SDK oficial @google/genai
		// generateContent(): espera una respuesta completa y estática
		// generateContentStream(): genera stream de datos, es decir,
		// hace que el texto generado aparezca de corrido.
		const stream = await ai.models.generateContentStream({
			// Puedes cambiar CONFIG.MODEL_AI por "gemini-2.5-flash" en tu archivo config o directamente aquí
			model: CONFIG.MODEL_AI || "gemini-2.5-flash",
			// para que funcione es necesario colocar una tarjeta de crédito
			contents: prompt,
		});

		// Configuramos los headers para enviar la respuesta en streaming al cliente HTTP
		// res.setHeader("Content-Type", "text/plain; charset=utf-8");

		// for await (const textPart of result.textStream) {
		// 	res.write(textPart);
		// }

		// res.end();

		// veamos la información
		// console.log("Gemini responde: ", response);

		// obtenemos el resumen con la primera respuesta
		// const summary = completion.choices?.[0]?.message?.content?.trim();
		// const summary = response.text?.trim();

		// iteramos
		for await (const part of stream) {
			// devolvemos la respuesta
			const content = part.text;
			// si tenemos contenido
			if (content) {
				res.write(content); // escribimos ese contenido
			}
		}
		return res.end(); // <- la respuesta se completa cuando el stream termina.

		// enviamos el resultado como si fuera una tubería.
		// return resultado.pipeTextStreamToResponse(res);

		// return pipeTextStreamToResponse({
		// 	response: res,
		// 	stream: toTextStream({ stream: resultado.stream }),
		// });
	} catch (error) {
		// si no ha empezado a enviar ninguna cabecera
		if (!res.headersSent) {
			res.setHeader("Content-Type", "application/json");
			return res.status(500).json({ error: "error generating summary" }); // nunca enviar el error
		}
		// y si ya ha empezado a enviar las cabeceras, cerramos las respuestas
		return res.end();
	}
});
