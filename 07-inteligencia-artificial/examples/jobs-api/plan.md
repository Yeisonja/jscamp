# Plan de implementación: API de empleos

## Objetivo

Crear una API REST de plataforma de empleos dentro de `07-inteligencia-artificial/jobs-api`, independiente de la API Pokémon existente. Se usará Node.js con ES modules (`type: module`), Express, PostgreSQL y pnpm.

## Fases

### 1. Base del proyecto

- Mantener un `package.json` propio, usar pnpm y ESM.
- Separar `src/app.js` (aplicación exportable) de `src/server.js` (arranque).
- Añadir configuración validada desde entorno, endpoint de salud, manejo uniforme de errores, CORS configurable y Helmet.
- Documentar las variables requeridas en `.env.example` sin incluir secretos.

### 2. PostgreSQL

- Añadir pool de conexión y migraciones SQL versionadas.
- Crear tablas para usuarios, perfiles de empresa, trabajos, postulaciones, favoritos y refresh tokens.
- Definir claves foráneas, índices, timestamps, restricciones únicas y estados permitidos.
- Guardar hashes de contraseña y refresh token, nunca sus valores en claro.

### 3. Autenticación y perfiles

- Rutas: `POST /api/auth/register`, `/login`, `/refresh`, `/logout`; `GET /api/auth/me`; `PATCH /api/users/me`.
- Roles: `candidate`, `employer` y `admin`.
- Usar access JWT de duración breve y refresh token rotatorio/revocable persistido como hash.
- El registro público solo permite crear candidatos o empresas. La creación de administradores se hará mediante un comando de inicialización privado.
- Añadir middlewares de autenticación y autorización por rol, además de límites de intentos en autenticación.

### 4. Trabajos

- `GET /api/jobs`: listar trabajos publicados con búsqueda, filtros, orden y paginación.
- `GET /api/jobs/:id`: consultar detalle publicado.
- `POST /api/jobs`, `PUT/PATCH/DELETE /api/jobs/:id`: CRUD para empresas autenticadas.
- La empresa solo modifica sus propias publicaciones; admin puede moderar.
- Validar cuerpos y parámetros con Zod.

### 5. Postulaciones y favoritos

- Candidatos pueden crear, consultar y retirar sus postulaciones.
- Empresas pueden consultar postulaciones únicamente para sus propios trabajos y actualizar el estado.
- Rechazar postulaciones duplicadas y transiciones de estado inválidas.
- Los candidatos pueden consultar, guardar y quitar trabajos favoritos.

### 6. Administración y entrega

- Rutas administrativas acotadas para moderar publicaciones y gestionar usuarios.
- Documentar endpoints, permisos, esquemas y ejemplos en `openapi.yaml` y `README.md`.
- Añadir pruebas con `node:test`, incluyendo integración contra PostgreSQL para autenticación, permisos, CRUD, filtros, postulaciones, favoritos y revocación de tokens.

## Estructura prevista

```text
jobs-api/
  package.json
  pnpm-lock.yaml
  .env.example
  README.md
  openapi.yaml
  plan.md
  scripts/
    migrate.js
    seed-admin.js
  src/
    app.js
    server.js
    config.js
    db/
      pool.js
      migrations/
        001_initial.sql
    routes/
    controllers/
    services/
    repositories/
    middleware/
    schemas/
  test/
```

## Comprobaciones

1. Instalar dependencias y generar lockfile con pnpm.
2. Aplicar migraciones con PostgreSQL configurado.
3. Ejecutar pruebas automatizadas con una base de datos de prueba aislada.
4. Verificar el health check y los flujos HTTP de login/logout, permisos, publicaciones, postulaciones y favoritos.
5. Arrancar en desarrollo con `pnpm dev`.

## Fuera del alcance inicial

Frontend, verificación y recuperación por correo, pagos, carga de CV/archivos y despliegue. Estos puntos requieren servicios o configuración adicionales.
