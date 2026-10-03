// sistemas de módulos nativos de node js para leer y escribir ficheros en nuestro sistema.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, basename, extname } from "node:path"; // es mejor para trabajar con rutas porque coloca las barras invertidas de manera
// que se adapte a cualquier sistema operativo.

// podemos revisar si tenemos los permisos
let archivo;
if (process.permission.has("fs.read", "archivo.txt")) {
	archivo = await readFile("archivo.txt", "utf-8");
	// readFile: devuelve una promesa, por tanto hay que esperar a que se resuelva.
	// utf-8: codifica el archivo
	console.log(archivo);
} else {
	console.log("No tiene permiso para leer el archivo.");
}

// si el proceso tiene permisos de escritura en el directorio output/files/documents
if (process.permission.has("fs.write", "output/files/documents")) {
	// también podemos crear carpetas y de forma recursiva
	// outputDir: es la carpeta de salida
	const outputDir = join("output", "files", "documents");
	await mkdir(outputDir, { recursive: true }); // espera mientras crea las carpetas

	const uppercaseContent = archivo.toUpperCase();
	const outputFilePath = join(outputDir, "archivo-uppercase.txt");

	// basename: permite obtener el nombre del fichero.
	// extname: permite obtener la extensión del fichero.
	console.log("La extensión es: ", extname(outputFilePath));
	console.log("El nombre del archivo es: ", basename(outputFilePath));

	// también podemos escribir en un archivo con writeFile
	// creamos el archivo
	await writeFile(outputFilePath, uppercaseContent); // coloca el archivo uppercase dentro de outputDir
	console.log("Archivo creado con el contenido en mayúsculas");
} else {
	console.log("No tienes permiso para escribir en el directorio especificado.");
}

// hacer esto es muy peligroso porque node da acceso a los archivos de nuestro equipo
// por tanto y demás es necesario proteger nuestros archivos, cosa que se puede
// hacer quitando o cediendo permisos de lectura, escritura para con los archivos.
// los sistemas de permisos se activan ejecutando scripts en la terminal de la siguiente manera:
// node --permission manage-files.js
// node --permission: activa los sistemas de permisos
// manage-files.js: ejecuta ese programa
// --allow-fs-read="*": cede todos los permisos de lectura
// --allow-fs-write="*": permite escribir en todos los archivos
