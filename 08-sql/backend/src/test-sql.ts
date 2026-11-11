import Database from "better-sqlite3";

// Base de datos con memoria (se pierde al cerrar el proceso)
// const db = new Database(":memory:");
const db = new Database("job.db");

// creamos una tabla
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    modality TEXT NOT NULL
  )  
`);

// insertamos datos con prepared statement (previene SQL inyection)
const insert = db.prepare(
	"INSERT INTO jobs (id, title, company, modality) VALUES (?, ?, ?, ?)",
	// prepare(): prepara las consultas
);

insert.run("10", "Frontend Developer", "TechCorp", "remote");
insert.run("11", "Backend Developer", "StartupX", "hybrid");

// consultar todos los datos
const allJobs = db.prepare("SELECT * FROM jobs").all();
console.log("Todos los jobs: ", allJobs);

// consultar los datos con filtros
const remoteJobs = db
	.prepare("SELECT * FROM jobs WHERE modality = ?")
	.all("remote");
console.log("Jobs remotos: ", remoteJobs);

// consultar un trabajo por id
const job = db.prepare("SELECT * FROM jobs WHERE id = ?").get("1");
console.log("Job 1: ", job);

// actualizar
db.prepare("UPDATE jobs SET modality = ? WHERE id = ?").run("onsite", "1");

// eliminar
const result = db.prepare("DELETE FROM jobs WHERE id = ?").run("2");
console.log("Filas eliminadas: ", result.changes);

db.close();

// pnpm tsx src/test-sql.ts; // ejecutamos la base de datos
