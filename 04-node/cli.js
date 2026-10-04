import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
// readdir: permite leer carpetas
// stat: proporciona la información de un archivo
// ambas, readdir y stat devuelven una promesa.

// vamos a crear un programa de línea de comandos (CLI)
// en un programa de línea de comandos lo más importante es
// poder acceder a los argumentos en node: process.argv
// process.argv: devuelve un array con dos posiciones
// la 1era posición: devuelve el ejecutable de node js que está utilizando.
// la 2da posición: devuelve el archivo que está ejecutando.

// 1. Recuperar la carpeta a listar
const dir = process.argv[2] || "."; // recupera el directorio de la segunda posición o sino el actual
console.log(dir);

// 2. Formateo simple de los tamaños
const formatBytes = (size) => {
	if (size < 1024) return `${size} B`;
	return `${(size / 1024).toFixed(2)} KB`;
	// toFixed(2): redondea hasta 2
};

// 3. Leer los nombres, sin info de la carpeta
const files = await readdir(dir); // devuelve una promesa

// 4. Recuperar la info de cada archivo (file)
// vamos a tener una lista de promesas
const entries = await Promise.all(
	// mapeamos cada uno de los archivos
	files.map(async (name) => {
		// recupera la ruta completa uniendo el directorio con el nombre del fichero.
		const fullPath = join(dir, name);
		// recuperamos la información del fichero
		const info = await stat(fullPath);

		return {
			name,
			isDir: info.isDirectory(),
			size: formatBytes(info.size),
		};
	}),
);

// 5. Mostramos la información de la promesa
for (const entry of entries) {
	// Renderizar la información
	const icon = entry.isDir ? "📂" : "📄";
	const size = entry.isDir ? "-" : `${entry.size}`;
	console.log(`${icon}   ${entry.name.padEnd(25)} ${size}`);
}

// Ejercicios
// sort
// 1. Que aparezcan primero las carpetas
// 2. Que estén en orden alfabético los ficheros

// filter
// 3. Tener en cuenta flags como --files-only o --dirs-only
