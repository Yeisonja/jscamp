import { createServer } from "node:http";
import { uptime } from "node:process";
import { json } from "node:stream/consumers";
import { randomUUID } from "node:crypto";

// randomUUID(): permite crear identificadores únicos que son útiles como id.
// json de node:stream/consumers: permite consumir los datos stream de un json que vienen como bytes
// al consumir estos datos es necesario volver a transformarlos en json.

// otro modo, el más correcto de obtener el puerto es creando un archivo .env
// y leyendolo
process.loadEnvFile(); // lee automáticamente el archivo .env y pone en el process.env todas las
// variables del archivo .env

// lee la variable de entorno de este proceso y si no está definida
// entonces coloca el puerto 3000 por defecto
const port = process.env.PORT ?? 3000;
// process.env.PORT: se refiere a la variable de entorno
// son variables que están al nivel del sistema operativo o el entorno
// en el que estamos trabajando nuestro proceso

// podemos crear una función
function sendJson(res, statusCode, data) {
	res.statusCode = statusCode; // coloca el statusCode que le pasamos
	res.setHeader("Content-Type", "application/json; charset=utf-8"); // coloca la cabecera
	res.end(JSON.stringify(data)); // termina la respuesta y convierte un objeto js a texto en formato json
}

// emulamos una lista de usuarios
const users = [
	{ id: 1, name: "Yeison" },
	{ id: 2, name: "Lina" },
	{ id: 3, name: "Pedro" },
];

// un servidor necesita una req: petición y una res: respuesta.
const server = createServer(async (req, res) => {
	// esta función se va a ejecutar cada vez que reciba una nueva petición: request
	// vamos a recuperar la url y el método
	const { method, url } = req;

	console.log(url);

	// podemos limitar la url y para ello hay que separar la ruta (pathname) de los queryparams(limit=3)
	const [pathname, querystrings] = url.split("?");

	// vamos a crear los parámetros de búsqueda: searchParams
	const searchParams = new URLSearchParams(querystrings);
	console.log(searchParams.get("limit")); // recupera el limit

	if (method === "GET") {
		// vamos a discriminar las rutas, es decir, hacer que las rutas tengan diferentes respuestas
		if (pathname === "/") {
			// es necesario codificar el contenido en la cabecera.
			res.setHeader("Content-Type", "text/plain; charset=utf-8"); // cabecera
			// muestra el contenido
			return res.end("Hola desde Node! 🔥"); // terminamos la respuesta y devolvemos un saludo
		}

		if (pathname === "/users") {
			// los searchParams son string por tanto es necesario convertir a entero y por eso utilizamos Number()
			const limit = Number(searchParams.get("limit")) || users.length;
			const offset = Number(searchParams.get("offset")) || 0;

			// paginamos los usuarios
			const paginatedUsers = users.slice(offset, offset + limit);

			return sendJson(res, 200, paginatedUsers);
		}

		// las APIs suelen tener una ruta llamada health que sirve para ver si la API está funcionando
		// y si lleva mucha rato funcionando
		if (pathname === "/health") {
			// process.uptime(): brinda el tiempo que tiene el servidor levantado
			return sendJson(res, 200, {
				status: "ok",
				uptime: Math.round(process.uptime()),
			});
		}
	}

	if (method === "POST") {
		if (pathname === "/users") {
			// tomamos la petición y la transformamos
			// utilizamos await porque es asíncrono
			const body = await json(req);
			console.log(body);
			// podemos validar
			if (!body || !body.name) {
				return sendJson(res, 400, { message: "El nombre es requerido" });
			}

			const newUser = {
				name: body.name,
				id: randomUUID(),
			};
			// en una api real el newUser se guardaría en una base de datos.
			users.push(newUser);
			return sendJson(res, 201, { message: "usuario creado" });
		}
	}

	if (method !== "GET") {
		// si el método es diferente de get
		return sendJson(res, 405, { error: "Método no permitido" });
	}

	return sendJson(res, 404, { error: "Not found" });
});

// inicializamos el servidor
server.listen(port, () => {
	// server.address(): trae un servidor disponible
	// const address = server.address();
	// esta función se va a ejecutar cuando este servidor se levante
	console.log(`Servidor escuchando en http://localhost:${port}`);
});
