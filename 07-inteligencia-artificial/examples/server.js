const express = require("express");
const { getPokemon } = require("./index.js");
const { rateLimitMiddleware } = require("./middlewares/rateLimit.js");

const app = express();

app.use(rateLimitMiddleware);

app.get("/", (req, res) => {
	res.json({
		message: "API de Pokémon",
		endpoints: ["GET /api/pokemon/:name"],
	});
});

app.get("/api/pokemon/:name", async (req, res) => {
	try {
		const pokemon = await getPokemon(req.params.name);
		res.json(pokemon);
	} catch (error) {
		res.status(error.status ?? 502).json({ error: error.message });
	}
});

app.use((req, res) => {
	res.status(404).json({ error: "Ruta no encontrada" });
});

if (require.main === module) {
	const port = process.env.PORT ?? 3000;
	app.listen(port, () => {
		console.log(`API disponible en http://localhost:${port}`);
	});
}

module.exports = app;
