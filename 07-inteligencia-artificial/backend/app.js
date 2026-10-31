import express from "express";
import { DEFAULTS } from "./config.js";
import { jobsRouter } from "./routes/jobs.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { aiRouter } from "./routes/ai.js";

const PORT = process.env.PORT ?? DEFAULTS.PORT;

const app = express(); // creamos el servidor

// app.set(...): configura opciones globales de Express.
// "trust proxy" indica a Express: “confío en el proxy que está delante de mi servidor”.
// 1 significa: “confío en 1 proxy” (el inmediato anterior a tu app)
// 1 es el número de proxys.
app.set("trust proxy", 1); // si estás detrás de un proxy, como Nginx, Heroku, Vercel o Cloudflare
// esto es importante para que el rate limiter funcione correctamente con la IP del cliente real.
// se hace para que express rate limit lea la ip real del cliente cuando el servidor
// está detrás de un proxy.

app.use(express.json());
// app.use(cors()); // podemos hacer esto pero no es tan buena práctica, porque cede permisos a todo

app.use(corsMiddleware());

// vamos a crear un router que va a tener todas las rutas
app.use("/jobs", jobsRouter);
app.use("/ai", aiRouter);

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
	// escuchamos la aplicación
	app.listen(PORT, () => {
		console.log(`Servidor corriendo en: http://localhost:${PORT}`);
	});
}

// exportamos la app por default para desplegar en vercel
export default app;

// la variable de entorno NODE_ENV: nos indica en qué entorno está corriendo el servidor
// tiene dos valores: el 1ero es development -> desarrollo; el 2do es production -> producción.
