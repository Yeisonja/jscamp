process.loadEnvFile();
import { GoogleGenAI } from "@google/genai";

// instanciamos
const ai = new GoogleGenAI();

async function listModels() {
	try {
		const response = await ai.models.list();
		console.log("Modelos disponibles para tu API Key: ");
		for await (const model of response) {
			console.log(`- ${model.name} (${model.displayName})`);
		}
	} catch (error) {
		console.error("Error al listar modelos: ", error);
	}
}

listModels();
