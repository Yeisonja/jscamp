// sistemas de módulos nativos de node js para leer y escribir ficheros en nuestro sistema.
import { readFile } from "node:fs/promises";

const archivo = await readFile("./archivo.txt", "utf-8");
console.log(archivo);
