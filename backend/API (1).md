# API del backend — Contratos y alcance

Documento unificado del backend y fuente de verdad compartida del equipo. Incluye
los endpoints implementados y los contratos que se están desarrollando para cursos,
materiales y traducciones.

**Regla:** si cambia la forma de una respuesta, quien lo programa actualiza este
archivo y avisa en el chat. Un endpoint terminado y probado se marca como `LISTO`;
uno en desarrollo como `EN DESARROLLO`; uno pendiente como `PENDIENTE`.

## Convención de respuesta

Todas las respuestas usan el mismo envelope:

```json
{ "exito": true, "mensaje": "Texto descriptivo", "data": { } }
```

- En error, `exito: false`, `mensaje` con el detalle y `data` normalmente `null`.
- Auth: los endpoints protegidos esperan `Authorization: Bearer <accessToken>`.
- Base URL: `http://localhost:3000/api`

---

## Estado actual del backend

El backend es la base de una API REST desarrollada con JavaScript, Node.js y
Express. Actualmente están implementados los módulos de salud de la API,
autenticación y gestión de usuarios. La conexión de datos utiliza PostgreSQL a
través de Supabase mediante `DATABASE_URL`.

### Salud y autenticación [LISTO]

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Comprueba que la API esté funcionando |
| POST | `/api/auth/register` | No | Registra un usuario y envía verificación por email |
| POST | `/api/auth/login` | No | Inicia sesión y devuelve access/refresh tokens |
| POST | `/api/auth/refresh` | No | Renueva los tokens con un refresh token |
| POST | `/api/auth/logout` | Sí | Invalida las sesiones del usuario |
| GET | `/api/auth/me` | Sí | Devuelve el usuario autenticado |
| POST/GET | `/api/auth/verify-email` | No | Verifica el email por body o query string |
| POST | `/api/auth/resend-verification` | No | Reenvía el email de verificación |
| POST | `/api/auth/forgot-password` | No | Solicita recuperación de contraseña |
| POST | `/api/auth/reset-password` | No | Restablece la contraseña con un token |
| PATCH | `/api/auth/change-password` | Sí | Cambia la contraseña actual |

### Usuarios [LISTO]

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| PATCH | `/api/users/me` | Sí | Actualiza el perfil propio |
| GET | `/api/users?page=1&limit=10&search=juan&role=user` | Admin | Lista usuarios con filtros y paginación |
| GET | `/api/users/:id` | Admin | Obtiene un usuario por id |
| PATCH | `/api/users/:id/role` | Admin | Cambia el rol a `user` o `admin` |
| PATCH | `/api/users/:id/status` | Admin | Activa o desactiva un usuario |
| DELETE | `/api/users/:id` | Admin | Elimina un usuario |

La autenticación usa JWT, las contraseñas se almacenan con `bcryptjs` y el campo
`tokenVersion` permite invalidar tokens anteriores. Las rutas de usuarios requieren
token; las operaciones sobre otros usuarios requieren rol `admin`.

### Cuerpos principales

```json
// POST /api/auth/register
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@mail.com",
  "password": "Clave1234",
  "confirmPassword": "Clave1234"
}
```

```json
// POST /api/auth/login
{ "email": "juan@mail.com", "password": "Clave1234" }
```

```json
// PATCH /api/auth/change-password
{
  "currentPassword": "Clave1234",
  "newPassword": "Otra1234",
  "confirmPassword": "Otra1234"
}
```

```json
// PATCH /api/users/me
{ "firstName": "Juan Carlos", "lastName": "Pérez" }
```

---

## Cursos (Nata)

### POST /api/courses [PENDIENTE]
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

### GET /api/courses/mine [PENDIENTE]
Lista los cursos del docente autenticado.
- **Auth:** docente (Bearer token)
- **200:**
```json
{ "exito": true, "mensaje": "OK", "data": { "cursos": [ { "id": 1, "name": "3ro Biología", "code": "4827", "level": "secundaria", "year": 3, "subject": "Biología" } ] } }
```
- **Errores:** 401 (sin token)

### GET /api/courses/code/:code [PENDIENTE]
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

### POST /api/materials/:id/translations [PENDIENTE]
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

Módulo en desarrollo. La base es `/api/materials` y todas sus respuestas usan el
envelope `{ exito, mensaje, data }`.

| Estado | Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- | --- |
| EN DESARROLLO | POST | `/api/materials` | Docente | Sube PDF o texto, extrae texto y genera lectura fácil |
| EN DESARROLLO | GET | `/api/materials/:id` | No | Devuelve el material con sus traducciones |
| EN DESARROLLO | GET | `/api/materials?level=&grade=&subject=&q=` | No | Biblioteca pública |
| EN DESARROLLO | PATCH | `/api/materials/:id` | Dueño | Edita datos o corrige la lectura fácil |
| EN DESARROLLO | POST | `/api/materials/:id/lectura-facil` | Dueño | Reintenta la lectura fácil con el LLM |
| EN DESARROLLO | POST | `/api/materials/:id/transcribir` | Dueño | Relee el PDF con Claude, incluido el texto de imágenes |
| EN DESARROLLO | DELETE | `/api/materials/:id` | Dueño | Elimina el material |

### POST /api/materials

Usa `multipart/form-data`:

| Campo | Tipo | Obligatorio | Notas |
| --- | --- | --- | --- |
| `title` | string ≤ 200 | Sí | Título del material |
| `archivo` | PDF o `.txt` ≤ 10 MB | Uno de los dos | El PDF escaneado puede transcribirse con Claude |
| `text` | string ≤ 50.000 | Uno de los dos | Texto pegado directamente |
| `courseId` | UUID | No | Si falta, el material queda sin curso |
| `level` | `primaria` \| `secundaria` | No | Nivel educativo |
| `grade` | 1–7 | No | Grado |
| `subject`, `license`, `source`, `author` | string | No | Metadatos opcionales |
| `visibility` | `curso` \| `publico` | No | Por defecto `curso` |

La respuesta `201` devuelve el material en `data`. El pedido puede tardar hasta un
minuto, o hasta dos si el PDF es escaneado.

Errores previstos: `400` (archivo inválido), `403` (curso de otro docente), `404`
(curso inexistente), `422` (datos inválidos o PDF ilegible), `429` (rate limit) y
`503` (no se pudo procesar el texto de imágenes).

### GET /api/materials/:id

```json
{
  "exito": true,
  "mensaje": "Material obtenido",
  "data": {
    "id": "uuid",
    "courseId": "uuid | null",
    "title": "La fotosíntesis",
    "sourceType": "pdf | texto",
    "originalFileName": "fotosintesis.pdf",
    "accessibleText": "Texto limpio…",
    "textSource": "extraido | pegado | transcrito",
    "easyReadText": "Texto en lectura fácil… | null",
    "easyReadStatus": "generado | respaldo | manual | pendiente",
    "easyReadModel": "string | null",
    "level": "primaria | secundaria | null",
    "grade": 3,
    "subject": "Ciencias Naturales",
    "license": "CC BY-SA 4.0",
    "source": "…",
    "author": "…",
    "visibility": "curso | publico",
    "createdAt": "…",
    "updatedAt": "…",
    "translations": ["… formato definido en la sección de traducciones …"]
  }
}
```

`easyReadText` llega como texto plano. `textSource: "transcrito"` indica que
Claude leyó información de imágenes; la interfaz docente debe mostrar un aviso
para revisarlo. Las imágenes informativas se describen entre corchetes:
`[Imagen: …]`.

### GET /api/materials (biblioteca)

`data` devuelve un array con `id`, `title`, `level`, `grade`, `subject`, `license`,
`source`, `author`, `sourceType`, `easyReadStatus` y `updatedAt`. El máximo es de
50 elementos. Para el contenido completo se utiliza `GET /api/materials/:id`.

### PATCH /api/materials/:id

Acepta `title`, `level`, `grade`, `subject`, `license`, `source`, `author`,
`visibility`, `accessibleText` y `easyReadText`. Si se envía `easyReadText`, el
estado pasa a `manual`. `accessibleText` permite corregir una transcripción.

### POST /api/materials/:id/lectura-facil

Sin body. Devuelve `200` con el material actualizado o `503` si el LLM no responde.

### POST /api/materials/:id/transcribir

Sin body. Relee el PDF original, reemplaza `accessibleText`, marca
`textSource: "transcrito"` y regenera la lectura fácil. Puede tardar hasta dos
minutos.

Errores previstos: `400` (el material no es PDF), `410` (no está el PDF original),
`422` (falta la key o supera 20 páginas) y `503` (Claude no responde).

### Modelos y asociaciones

Todos los ids son UUID; el código de curso de cuatro dígitos es un campo `string`
independiente. Las asociaciones previstas son `Course -> materials` y
`Material -> translations`. Los archivos se guardan en `/uploads/materials/` y
`/uploads/audios/`.

---

## Glosario (Nata, opcional)

> Pendiente si sobra tiempo: `GET/POST /api/glossary`.

---

## Integración offline (Ana → Eric)

La integración offline pertenece al cliente y consume la respuesta completa de
`GET /api/materials/:id`.

- `configurarOffline({ apiUrl })` e `iniciarSincronizacion()` una vez en `main.jsx`.
- El botón "Guardar para usar sin internet" llama a `guardarMaterial(material)`.
- Sin señal, se usa `marcarParaDescargar(id)`.
- La vista sin conexión obtiene el material con `obtenerMaterial(id)`; el audio llega como `audioBlob`.
- El indicador `estadoMaterial(id)` devuelve `{ estado, mensaje }`; la interfaz muestra `mensaje` tal cual.
