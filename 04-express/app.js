import express from "express";
import { DEFAULTS } from "./config.js";
import { jobsRouter } from "./routes/jobs.js";
import { corsMiddleware } from "./middlewares/cors.js";

const PORT = process.env.PORT ?? DEFAULTS.PORT;

const app = express(); // creamos el servidor

app.use(express.json());
// app.use(cors()); // podemos hacer esto pero no es tan buena práctica, porque cede permisos a todo

app.use(corsMiddleware());

// vamos a crear un router que va a tener todas las rutas
app.use("/jobs", jobsRouter);

if (process.env.NODE_ENV !== "production") {
	// escuchamos la aplicación
	app.listen(PORT, () => {
		console.log(`Servidor corriendo en: http://localhost:${PORT}`);
	});
}

// exportamos la app por default para desplegar en vercel
export default app;

// la variable de entorno NODE_ENV: nos indica en qué entorno está corriendo el servidor
// tiene dos valores: el 1ero es development -> desarrollo; el 2do es production -> producción.
