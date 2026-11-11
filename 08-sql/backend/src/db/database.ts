import Database from "better-sqlite3";

const db = new Database("jobs.db");

// mejoramos la base de datos
db.pragma("journal_mode = WAL"); // mejora el rendimiento en concurrencia
// WAL: bloquea la base de datos cuando alguien escribe

db.pragma("foreign_keys = ON"); // habilita claves foránea
// las claves foráneas están desactivadas por defecto, por ende, es necesario activarlas.

export { db };
