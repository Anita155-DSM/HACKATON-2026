# API — Contratos de endpoints

Fuente de verdad compartida del equipo. Cada endpoint se documenta acá **antes** de
programarlo, para que el frontend pueda mockear con la forma correcta sin esperar al backend.

**Regla:** si cambia la forma de un response, quien lo programó actualiza este archivo y avisa
en el chat. Un endpoint terminado y probado se marca con ✅.

## Convención de respuesta

Todas las respuestas usan el mismo envelope:

```json
{ "exito": true, "mensaje": "Texto descriptivo", "data": { } }
```

- En error, `exito: false`, `mensaje` con el detalle y `data` normalmente `null`.
- Auth: los endpoints protegidos esperan `Authorization: Bearer <accessToken>`.
- Base URL: `http://localhost:3000/api`

---

## Cursos (Nata)

### POST /api/courses  ⬜
Crea un curso y le genera un código único de 4 dígitos.
- **Auth:** docente (Bearer token)
- **Body:**
```json
{ "name": "3ro Biología", "level": "secundaria", "year": 3, "subject": "Biología" }
```
- **201:**
```json
{ "exito": true, "mensaje": "Curso creado", "data": { "curso": { "id": 1, "name": "3ro Biología", "code": "4827", "level": "secundaria", "year": 3, "subject": "Biología" } } }
```
- **Errores:** 400 (datos inválidos), 401 (sin token)
- **Nota:** `code` es string de 4 dígitos (puede tener ceros a la izquierda, ej. "0427").

### GET /api/courses/mine  ⬜
Lista los cursos del docente autenticado.
- **Auth:** docente (Bearer token)
- **200:**
```json
{ "exito": true, "mensaje": "OK", "data": { "cursos": [ { "id": 1, "name": "3ro Biología", "code": "4827", "level": "secundaria", "year": 3, "subject": "Biología" } ] } }
```
- **Errores:** 401 (sin token)

### GET /api/courses/code/:code  ⬜
Devuelve un curso y sus materiales a partir del código. **Público** (sin login), con
`express-rate-limit` para evitar que prueben todos los códigos por fuerza bruta.
- **Auth:** no
- **Params:** `code` (string de 4 dígitos)
- **200:**
```json
{ "exito": true, "mensaje": "OK", "data": { "curso": { "id": 1, "name": "3ro Biología", "code": "4827" }, "materiales": [ { "id": 10, "title": "Fotosíntesis", "versiones": ["texto", "lectura_facil", "wichi"] } ] } }
```
- **Errores:** 404 (código inexistente), 429 (demasiados intentos)

---

## Traducciones (Nata)

### POST /api/materials/:id/translations  ⬜
Guarda una traducción de un material y su archivo de audio.
- **Auth:** docente / traductor (Bearer token)
- **Content-Type:** `multipart/form-data` (por el audio, vía multer)
- **Params:** `id` = id del material
- **Body (form-data):**
  - `language` (string, ej. "wichi")
  - `text` (string)
  - `author` (string)
  - `validated` (boolean; `false` si es simulada)
  - `audio` (archivo de audio)
- **201:**
```json
{ "exito": true, "mensaje": "Traducción guardada", "data": { "traduccion": { "id": 5, "materialId": 10, "language": "wichi", "text": "...", "audioUrl": "/uploads/tr-5.mp3", "validated": false, "author": "..." } } }
```
- **Errores:** 400 (datos inválidos), 401 (sin token), 404 (material inexistente)

---

## Materiales (Ana)

> Pendiente: Ana completa acá los contratos de `POST /api/materials` y
> `GET /api/materials/:id` (este último incluye las traducciones).

---

## Glosario (Nata, opcional)

> Pendiente si sobra tiempo: `GET/POST /api/glossary`.
