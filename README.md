# Finanzas Personales — API REST

Trabajo práctico final de la materia **Taller de Programación 2**.

Aplicación de gestión de finanzas personales construida como **API REST** con Node.js + Express y MongoDB, siguiendo una arquitectura **MVC por capas** (router → controller → service → model). Permite a cada usuario administrar sus categorías, transacciones (ingresos y gastos) y presupuestos, consultar estadísticas, y recibir reportes por correo. Incluye además un **frontend** servido desde `public/`.

---

## Características

- **Autenticación con JWT** — registro, login y gestión de perfil. Las contraseñas se almacenan con hash (`bcrypt`).
- **Categorías** — CRUD de categorías de gasto/ingreso por usuario.
- **Transacciones** — CRUD de ingresos y gastos, con filtros por tipo, categoría, mes/año y orden.
- **Presupuestos** — límites de gasto por categoría y período (mes/año).
- **Estadísticas** — resumen mensual, gasto por categoría, tendencias y seguimiento de presupuestos.
- **Reportes por email** — envío de reportes financieros vía SMTP (`nodemailer`)
- **Validación de entrada** con `Joi` mediante un middleware reutilizable.
- **Manejo de errores centralizado** y respuesta 404 para rutas inexistentes.
- **Documentación interactiva** con Swagger / OpenAPI.
- **Frontend** en `public/` (HTML/CSS/JS) para interactuar con la API.
- **Tests** con el test runner nativo de Node, `chai` y `sinon`y `mocha`

---

## Stack tecnológico

| Categoría        | Tecnologías                                              |
| ---------------- | ------------------------------------------------------- |
| Runtime          | Node.js (ESM, `"type": "module"`)                       |
| Framework HTTP   | Express 5                                               |
| Base de datos    | MongoDB + Mongoose                                       |
| Autenticación    | JSON Web Tokens (`jsonwebtoken`), `bcrypt`              |
| Validación       | Joi                                                     |
| Email            | Nodemailer                                              |
| Documentación    | swagger-jsdoc + swagger-ui-express                      |
| Testing          | `node --test`, Mocha, Chai, Sinon, Supertest           |
| Utilidades       | dotenv, axios, @faker-js/faker                          |

---

## Requisitos previos

- **Node.js 18 o superior** (probado en Node 22 y 24).
- Una instancia de **MongoDB** (local o Atlas).
- (Opcional) Credenciales SMTP para el envío de reportes, o usar el modo Ethereal de prueba.

---

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd Taller-de-programacion-2-TRABAJO-FINAL

# Instalar dependencias
npm install

# Crear el archivo de variables de entorno a partir del ejemplo
cp .env.example .env   # en Windows PowerShell: Copy-Item .env.example .env
```

---

## Configuración (variables de entorno)

Editá el archivo `.env` en la raíz del proyecto:

```env
PORT=8080                       # puerto del servidor (por defecto 8080)
STRCNX=                         # string de conexión de MongoDB (Atlas o local)
JWT_SECRET=                     # secreto para firmar los tokens JWT
NODE_ENV=development

# Configuración de email (reportes) — opcional
MAIL_HOST=
MAIL_PORT=587
MAIL_USER=
MAIL_PASS=
MAIL_FROM=Finanzas Personales <no-reply@finanzas.com>
MAIL_ETHEREAL=                  # true para usar una cuenta de prueba Ethereal sin SMTP real
```

> **Importante:** `STRCNX` y `JWT_SECRET` son obligatorios para arrancar y autenticar. Sin `STRCNX` válido, la aplicación no podrá conectarse a la base y finalizará.

---

## Ejecución

```bash
# Modo desarrollo (recarga automática con nodemon)
npm run dev

# Modo producción
npm start
```

Si todo está bien, verás en consola:

```
Servidor ApiRestful escuchando en http://localhost:8080
```

- **App / frontend:** http://localhost:8080
- **Documentación Swagger:** http://localhost:8080/docs
- **Especificación OpenAPI (JSON):** http://localhost:8080/docs.json

---

## Estructura del proyecto

```
.
├── index.js                  # Punto de entrada: conecta a la DB y levanta el servidor
├── src/
│   ├── server.js             # Configuración de Express, middlewares y montaje de rutas
│   ├── config/
│   │   ├── index.js          # Carga y centraliza las variables de entorno
│   │   └── database.js       # Conexión a MongoDB con Mongoose
│   ├── router/               # Definición de rutas por recurso
│   ├── controller/           # Controladores (orquestan request/response)
│   ├── service/              # Lógica de negocio y acceso a datos
│   ├── model/                # Esquemas de Mongoose (User, Category, Transaction, Budget)
│   ├── middleware/           # auth (JWT), validación (Joi), errores, 404
│   ├── utils/                # JWT, mailer, http-error, plantilla de reporte
│   ├── docs/openapi.js       # Especificación Swagger/OpenAPI
│   └── test/                 # Tests
├── public/                   # Frontend estático (HTML, CSS, JS)
├── postman/                  # Colección y environment de Postman
└── .env.example              # Plantilla de variables de entorno
```

### Arquitectura por capas

```
Request → Router → [auth middleware] → [validate middleware] → Controller → Service → Model (Mongoose) → MongoDB
                                                                     ↓
                                                      error middleware (centralizado)
```

---

## Modelos de datos

| Modelo          | Campos principales                                                        |
| --------------- | ------------------------------------------------------------------------- |
| **User**        | `name`, `email` (único), `password` (hash)                                 |
| **Category**    | `name`, `description`, `user`                                              |
| **Transaction** | `tipo` (`ingreso`/`gasto`), `monto`, `descripcion`, `categoria`, `fecha`, `user` |
| **Budget**      | `categoria`, `limite`, `mes` (1-12), `anio`, `user`                        |

Todos los recursos (excepto `User`) están asociados a un usuario y se filtran por él en cada operación.

---

## Endpoints de la API

Base URL: `http://localhost:8080/api`

Todas las rutas, salvo `register` y `login`, requieren el header:

```
Authorization: Bearer <token>
```

### Autenticación / Usuarios — `/api/users`

| Método | Ruta         | Auth | Descripción                              |
| ------ | ------------ | :--: | ---------------------------------------- |
| POST   | `/register`  |  —   | Registra un nuevo usuario                |
| POST   | `/login`     |  —   | Inicia sesión y devuelve un JWT          |
| GET    | `/profile`   |  ✓   | Obtiene el perfil del usuario actual     |
| PUT    | `/profile`   |  ✓   | Actualiza nombre, email o contraseña     |
| DELETE | `/profile`   |  ✓   | Elimina la cuenta y todos sus datos      |

### Categorías — `/api/categories`

| Método | Ruta    | Auth | Descripción                |
| ------ | ------- | :--: | -------------------------- |
| GET    | `/`     |  ✓   | Lista las categorías       |
| POST   | `/`     |  ✓   | Crea una categoría         |
| PUT    | `/:id`  |  ✓   | Actualiza una categoría    |
| DELETE | `/:id`  |  ✓   | Elimina una categoría      |

### Transacciones — `/api/transactions`

| Método | Ruta    | Auth | Descripción                                              |
| ------ | ------- | :--: | ------------------------------------------------------- |
| GET    | `/`     |  ✓   | Lista transacciones (filtros: `tipo`, `categoria`, `mes`, `anio`, `orden`) |
| GET    | `/:id`  |  ✓   | Obtiene una transacción                                 |
| POST   | `/`     |  ✓   | Crea una transacción                                    |
| PUT    | `/:id`  |  ✓   | Actualiza una transacción                               |
| DELETE | `/:id`  |  ✓   | Elimina una transacción                                 |

### Presupuestos — `/api/budgets`

| Método | Ruta    | Auth | Descripción                                       |
| ------ | ------- | :--: | ------------------------------------------------- |
| GET    | `/`     |  ✓   | Lista presupuestos (filtros: `categoria`, `mes`, `anio`) |
| POST   | `/`     |  ✓   | Crea un presupuesto                               |
| PUT    | `/:id`  |  ✓   | Actualiza un presupuesto                          |
| DELETE | `/:id`  |  ✓   | Elimina un presupuesto                            |

### Estadísticas — `/api/stats`

| Método | Ruta          | Auth | Descripción                                            |
| ------ | ------------- | :--: | ------------------------------------------------------ |
| GET    | `/monthly`    |  ✓   | Resumen mensual (params opcionales `mes`, `anio`)      |
| GET    | `/categories` |  ✓   | Gasto agrupado por categoría con porcentajes           |
| GET    | `/trends`     |  ✓   | Tendencias de los últimos N meses (`meses`, 1-24)      |
| GET    | `/budgets`    |  ✓   | Comparación de gasto vs. presupuesto (`mes`, `anio` requeridos) |

### Reportes — `/api/reports`

| Método | Ruta     | Auth | Descripción                                          |
| ------ | -------- | :--: | ---------------------------------------------------- |
| POST   | `/send`  |  ✓   | Envía un reporte financiero por email (`email`, `mes`, `anio` opcionales) |

---

## Ejemplo de uso rápido

```bash
# 1. Registrarse
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com","password":"password123"}'

# 2. Login → devuelve { "token": "..." }
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"password123"}'

# 3. Crear una categoría (usando el token)
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"name":"Comida","description":"Gastos en alimentos"}'
```

---

## Testing

```bash
# Ejecuta todos los tests con el runner nativo de Node
npm test

# Ejecuta el test unitario de estadísticas con Mocha
npm run test-unitario
```

El test de estadísticas usa `sinon` para *stubbear* `Transaction.aggregate`, de modo que **no requiere una conexión real a MongoDB**.

---

## Documentación con Postman

En la carpeta [`postman/`](postman/) hay una colección y un environment listos para importar. Ver [postman/README.md](postman/README.md) para el detalle de uso y el orden de ejecución sugerido.

---

## Frontend

El servidor sirve archivos estáticos desde `public/`. Las pantallas disponibles incluyen registro, login, perfil, categorías, transacciones, presupuestos, estadísticas y reportes. Se accede simplemente abriendo http://localhost:8080 con el servidor corriendo.

---

## Scripts de npm

| Script                 | Acción                                              |
| ---------------------- | --------------------------------------------------- |
| `npm start`            | Inicia el servidor (`node index.js`)                |
| `npm run dev`          | Inicia con recarga automática (`nodemon`)           |
| `npm test`             | Ejecuta los tests con `node --test`                 |
| `npm run test-unitario`| Ejecuta el test de estadísticas con Mocha           |

---

## Licencia

ISC — proyecto académico con fines educativos.
