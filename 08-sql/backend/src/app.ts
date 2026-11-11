import express, {
	type ErrorRequestHandler,
	type Express,
	type Request,
	type Response,
} from "express";
import { jobsRouter } from "./routes/jobsRoutes.js";

// ================================
// CREAR APP
// ================================

const app: Express = express();

// ================================
// MIDDLEWARES GLOBALES
// ================================

// Parsear JSON en el body
app.use(express.json());

// CORS

// Desactivar header X-Powered-By
app.disable("x-powered-by");

// ================================
// RUTAS
// ================================

// Health check
app.get("/", (req: Request, res: Response) => {
	res.json({
		status: "ok",
		message: "TypeScript Express API",
		timestamp: new Date().toISOString(),
		// toISOString(): genera la fecha y hora actuales en un formato de
		// texto estandarizado universal (ISO 8601).
	});
});

// API de jobs
app.use("/jobs", jobsRouter);

// 404 para rutas no encontradas
app.use((req: Request, res: Response) => {
	res.status(404).json({
		message: `Route not found: ${req.method} ${req.path}`,
	});
});

// ruta para los errores
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
	console.error("Error en la solicitud", {
		method: req.method,
		path: req.path,
		error,
	});

	// res.headersSent: Es una propiedad booleana que indica si Express
	// ya envió las cabeceras HTTP al cliente.
	// Puede tener dos valores: true: las cabeceras ya fueron enviadas.
	// false: todavía no se han enviado.

	// es necesario comprobar si ya se han enviado las cabeceras HTTP Porque
	// una vez que Express ha enviado las cabeceras y comenzado a responder,
	// no podemos iniciar libremente otra respuesta HTTP.
	if (res.headersSent) {
		next(error);
		return;
	}

	res.status(500).json({
		message: "Error interno del servidor",
	});
};

app.use(errorHandler);

// ================================
// INICIAR SERVIDOR
// ================================

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
	console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║   🚀 Express + TypeScript Server           ║
║                                            ║
║   URL: http://localhost:${PORT}            ║
║                                            ║
║   Endpoints:                               ║
║   GET    /jobs                             ║
║   GET    /jobs/:id                         ║
║   POST   /jobs                             ║
║   PATCH  /jobs/:id                         ║
║   DELETE /jobs/:id                         ║
║                                            ║
║   Query params:                            ║
║   ?tech=React                              ║
║   ?modality=remote                         ║
║   ?level=senior                            ║
║                                            ║
╚════════════════════════════════════════════╝
    `);
});

export default app;

// pnpm tsx src/app.ts; // ejecutamos
