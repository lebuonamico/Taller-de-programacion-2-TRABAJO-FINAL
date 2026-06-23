# Testeo con Postman — Categorías

Archivos en esta carpeta:

- `Categorias.postman_collection.json` — colección con todos los requests.
- `Local.postman_environment.json` — environment opcional (`baseUrl`, `token`, `categoryId`).

## Cómo importar

1. En Postman: **Import** → arrastrá `Categorias.postman_collection.json`.
2. (Opcional) Importá también `Local.postman_environment.json` y seleccionalo arriba a la derecha.
   - No es obligatorio: la colección ya trae sus propias variables (`baseUrl`, `token`, `categoryId`).

## Antes de empezar

El servidor tiene que estar corriendo y conectado a MongoDB:

1. Configurá el `.env` (en la raíz del proyecto) con:
   ```
   MODO_PERSISTENCIA=MONGODB
   STRCNX=<tu string de conexión de Mongo Atlas o local>
   BASE=<nombre de la base>
   JWT_SECRET=<un secreto cualquiera>
   ```
2. Arrancá el servidor:
   ```
   npm run dev
   ```
   Debería decir: `Servidor ApiRestful escuchando en http://localhost:8080`.

Si tu `PORT` es distinto a 8080, cambiá la variable `baseUrl`.

## Orden de ejecución

1. **Auth → Register** — crea el usuario (si ya existe, da 400; no pasa nada).
2. **Auth → Login** — guarda el `token` automáticamente (lo ves en la consola de Postman).
3. **Categorías → Create Category** — crea una categoría y guarda su `_id` en `categoryId`.
4. **Categorías → Get Categories** — lista tus categorías.
5. **Categorías → Update Category** — usa el `categoryId` guardado.
6. **Categorías → Delete Category** — borra esa categoría.

> Tip: podés correr toda la colección de una con el **Collection Runner**, respeta este orden.

## Casos de error incluidos

- **Get Categories sin token** → 401.
- **Create Category sin name** → 400 (validación de Joi).

Todos los requests de categorías mandan el header `Authorization: Bearer {{token}}` automáticamente.
