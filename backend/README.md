# Hackathon Backend — Materiales educativos accesibles

## Descripción

API REST del proyecto de la hackatón. Permite que un **docente** suba materiales
de clase (PDF o texto) y que el backend genere versiones accesibles:

- **Texto accesible**: texto limpio extraído del PDF, legible por lectores de pantalla.
  Si el PDF está escaneado (el texto está en imágenes), se transcribe con Claude.
- **Lectura fácil**: reescritura del texto con frases cortas y vocabulario simple,
  generada con Claude. Si el LLM no está disponible, se usa un texto de respaldo
  precargado o queda pendiente para que el docente la escriba.
- **Traducciones a lenguas originarias** (por ejemplo, wichí), con texto y audio.
- **Glosario** castellano ↔ lengua originaria.

Los materiales se organizan en **cursos**. Cada curso tiene un **código de 4 dígitos**
con el que el alumno accede a sus materiales **sin crear una cuenta**. Además, los
materiales marcados como públicos forman una **biblioteca pública** con filtros.

La base incluye autenticación con JWT, verificación de email, recuperación de
contraseña, roles (`user` / `admin`), validaciones, rate limiting y envío de emails.

## Stack

- **JavaScript** con **ES Modules** sobre **Node.js 18+** (usa `fetch` nativo).
- **Express 4**: servidor HTTP y rutas REST.
- **PostgreSQL + Sequelize 6**: base de datos y ORM (en el equipo se usa Supabase).
- **jsonwebtoken**: access tokens y refresh tokens.
- **bcryptjs**: hash de contraseñas.
- **Nodemailer**: emails de verificación, recuperación y avisos.
- **express-validator**: validación de body, params y query.
- **multer**: subida de PDFs/textos (en memoria) y audios (en disco).
- **pdf-parse**: extracción de texto de PDFs.
- **API de Claude (Anthropic)**: lectura fácil y transcripción de PDFs escaneados.
- **Helmet**, **CORS**, **express-rate-limit**, **Morgan**, **dotenv**.
- **Nodemon** en desarrollo.

## Instalación y ejecución

```bash
npm install
cp .env.example .env   # completar las variables (ver abajo)
npm run dev            # desarrollo, con nodemon
# o
npm start              # producción
```

La API queda en `http://localhost:3000/api`. Al arrancar, el servidor:

1. Sincroniza las tablas según `DB_SYNC` (por defecto `alter`).
2. Crea el usuario admin inicial si `ADMIN_EMAIL` y `ADMIN_PASSWORD` están definidos y no existe.
3. Verifica la conexión SMTP (si hay SMTP configurado).

### Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Levanta el servidor con nodemon |
| `npm start` | Levanta el servidor con node |
| `npm run seed` | Carga los datos de la demo (ver [Datos de la demo](#datos-de-la-demo-seed)) |
| `npm run db:up` / `db:down` | Ejecutan `docker compose`, pero **no hay `docker-compose.yml`** en el repo. Solo sirven si agregás uno para una base local |

Para probar la extracción de texto y la lectura fácil sin base de datos ni servidor:

```bash
node scripts/probar-lectura-facil.js                         # texto de ejemplo
node scripts/probar-lectura-facil.js archivo.pdf             # extrae el PDF (si es escaneado, lo transcribe)
node scripts/probar-lectura-facil.js archivo.pdf --imagenes  # fuerza la lectura con Claude (texto + imágenes)
```

## Variables de entorno

Plantilla en `.env.example`. Todas tienen valor por defecto salvo las de la base de datos.

```env
# App
NODE_ENV=development
PORT=3000
APP_NAME=Hackathon API
CLIENT_URL=http://localhost:5173          # se usa para armar los links de los emails
CORS_ORIGINS=http://localhost:5173        # separados por coma; "*" = todos (default)

# PostgreSQL — Opción A: URL completa (tiene prioridad)
DATABASE_URL=postgresql://postgres:<PASSWORD>@<HOST>:5432/postgres
DB_SSL=true
# Opción B: variables sueltas
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=hackathon_db
# DB_USER=postgres
# DB_PASSWORD=postgres
DB_SYNC=alter                             # alter | force (BORRA y recrea) | none (solo autentica)
DB_LOGGING=false

# JWT
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=10

# Verificación y recuperación
REQUIRE_EMAIL_VERIFICATION=true           # true = no se puede loguear sin verificar el email
EMAIL_VERIFICATION_HOURS=24
PASSWORD_RESET_MINUTES=30
# EMAIL_VERIFY_URL=http://localhost:5173/verify-email      (default: CLIENT_URL/verify-email)
# RESET_PASSWORD_URL=http://localhost:5173/reset-password  (default: CLIENT_URL/reset-password)

# SMTP (si SMTP_HOST está vacío, los emails se imprimen en consola)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=Hackathon API <no-reply@hackathon.dev>

# Admin inicial (se crea al arrancar si no existe)
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=Sistema

# Rate limit
DISABLE_RATE_LIMIT=false                  # true = desactiva todos los límites (útil para pruebas)

# LLM (Claude) — no están en .env.example, agregarlas a mano
LLM_API_KEY=                              # sin key: la lectura fácil usa el respaldo y no se transcriben PDFs escaneados
LLM_MODEL=claude-haiku-4-5-20251001       # default
LLM_TIMEOUT_MS=90000                      # default

# Archivos
UPLOAD_DIR=uploads/materials              # default; dónde se guardan los PDFs originales
```

Notas:

- Si no se definen `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`, se usan secretos de
  desarrollo inseguros. En producción hay que definirlos siempre. Para generarlos:
  `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
- Con Gmail: `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true` y una
  contraseña de aplicación en `SMTP_PASS`.

## Estructura del proyecto

```text
backend/
├─ app.js                        # servidor Express, registro de rutas, admin inicial, arranque
├─ seed.js                       # datos de la demo
├─ config/
│  ├─ database.js                # conexión Sequelize (DATABASE_URL o DB_*)
│  └─ mailer.js                  # Nodemailer + plantillas de emails
├─ models/
│  ├─ index.js                   # registra modelos y asociaciones
│  ├─ user.models.js
│  ├─ course.models.js
│  ├─ material.models.js
│  ├─ translation.models.js
│  └─ glossary.models.js
├─ controllers/
│  ├─ auth.controllers.js
│  ├─ user.controllers.js
│  ├─ course.controller.js
│  ├─ material.controllers.js
│  ├─ translation.controller.js
│  └─ glossary.controller.js
├─ routes/                       # auth, user, course, material, translation, glossary
├─ middlewares/
│  ├─ authMiddleware.js          # authenticate, requireVerifiedEmail
│  ├─ roleMiddleware.js          # authorize(...roles)
│  ├─ rateLimiters.js            # apiLimiter, authLimiter, emailLimiter
│  ├─ uploadAudio.js             # multer para audios de traducciones
│  └─ validator/                 # reglas de express-validator por módulo + validarResultado
├─ services/
│  ├─ claude.client.js           # cliente mínimo de la API de Claude
│  ├─ extraerTexto.service.js    # PDF/TXT → texto limpio; detecta PDFs escaneados
│  ├─ transcribir.service.js     # transcripción de PDFs con Claude (texto + imágenes)
│  └─ lecturaFacil.service.js    # generación de lectura fácil con respaldo
├─ data/
│  └─ lectura-facil-respaldo.json  # textos de lectura fácil precargados (clave = slug del título)
├─ scripts/
│  └─ probar-lectura-facil.js
├─ uploads/                      # archivos subidos (ignorado por git)
│  ├─ materials/                 # PDFs originales
│  └─ audios/                    # audios de traducciones
├─ requests.http                 # pruebas de auth y usuarios (REST Client)
├─ requests.materiales.http      # pruebas de materiales, cursos, traducciones y flujo de la demo
├─ API.md, API (1).md, API.materiales.md   # contratos de endpoints (ver nota abajo)
└─ .env.example
```

## Modelos

Todos los ids son **UUID**. Todas las tablas tienen `createdAt` y `updatedAt`.

### User (`users`)

`firstName`, `lastName`, `email` (único, se guarda en minúsculas), `password` (hash),
`role` (`user` | `admin`), `isActive`, `isEmailVerified`, `emailVerificationToken`,
`emailVerificationExpires`, `passwordResetToken`, `passwordResetExpires`,
`tokenVersion`, `lastLoginAt`.

Los tokens de verificación y recuperación se guardan hasheados (SHA-256). El docente
es un usuario con rol `user`; no hay un rol específico de docente.

### Course (`courses`)

| Campo | Tipo | Notas |
| --- | --- | --- |
| `name` | string | Obligatorio |
| `code` | string, único | 4 dígitos generados al azar (puede empezar con 0, ej. `"0427"`) |
| `level` | string | `primaria` o `secundaria` (validado en la ruta) |
| `year` | integer | 1–7, opcional |
| `subject` | string | Opcional |
| `teacherId` | UUID | Usuario que creó el curso |

### Material (`materials`)

| Campo | Tipo | Notas |
| --- | --- | --- |
| `courseId` | UUID, nullable | `null` = material sin curso |
| `createdBy` | string | Id del usuario que lo subió (privado) |
| `title` | string ≤ 200 | |
| `sourceType` | `pdf` \| `texto` | |
| `originalFileName` | string | Nombre del PDF subido |
| `originalFilePath` | string | Ruta del PDF en el servidor (privado) |
| `accessibleText` | text | Texto limpio para lectores de pantalla |
| `textSource` | `extraido` \| `pegado` \| `transcrito` | `transcrito` = Claude lo leyó de imágenes; conviene que el docente lo revise |
| `easyReadText` | text, nullable | Texto en lectura fácil |
| `easyReadStatus` | `generado` \| `respaldo` \| `manual` \| `pendiente` | Origen de la lectura fácil |
| `easyReadModel` | string, nullable | Modelo que la generó |
| `level` | `primaria` \| `secundaria` | Biblioteca |
| `grade` | 1–7 | Biblioteca |
| `subject`, `license`, `source`, `author` | string | Metadatos de biblioteca |
| `visibility` | `curso` \| `publico` | Default `curso`. Solo los públicos aparecen en la biblioteca |

`createdBy` y `originalFilePath` no se devuelven nunca en las respuestas.

### Translation (`translations`)

`materialId`, `language` (ej. `wichi`), `text`, `audioUrl` (ej. `/uploads/audios/tr-....mp3`),
`validated` (validada por la comunidad), `simulated` (traducción de ejemplo, no real), `author`.

### GlossaryTerm (`glossary_terms`)

`es` (término en castellano), `term` (término en la lengua), `language`, `source`, `note`.
Índice único sobre (`es`, `language`).

### Asociaciones (`models/index.js`)

- `User` 1—N `Course` (`teacherId`, alias `courses` / `teacher`)
- `Course` 1—N `Material` (`courseId`, alias `materials` / `course`)
- `Material` 1—N `Translation` (`materialId`, alias `translations` / `material`)

## Convenciones de la API

Base URL: `http://localhost:3000/api`

Envelope de respuesta:

```json
{ "exito": true, "mensaje": "Texto descriptivo", "data": {} }
```

En error, `exito: false` y `mensaje` con el detalle. Los errores de validación
responden **422** con la lista de campos:

```json
{
  "exito": false,
  "mensaje": "Error de validación en los datos enviados.",
  "errores": [{ "campo": "title", "mensaje": "El título es obligatorio" }]
}
```

Otros casos generales: `404` si la ruta no existe, `400` si el body no es JSON válido,
`500` ante errores no controlados.

Autenticación: `Authorization: Bearer <accessToken>` en los endpoints protegidos.

## Endpoints

### Salud

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Estado de la API (`env`, `uptime`). No tiene rate limit |

### Autenticación — `/api/auth`

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/register` | No | Registro. Envía email de verificación. Si `REQUIRE_EMAIL_VERIFICATION=false`, devuelve tokens |
| POST | `/login` | No | Devuelve `user`, `accessToken`, `refreshToken`, `tokenType`, `expiresIn` |
| POST | `/refresh` | No | Body `{ refreshToken }`. Devuelve tokens nuevos |
| POST | `/logout` | Sí | Invalida todas las sesiones del usuario (incrementa `tokenVersion`) |
| GET | `/me` | Sí | Datos del usuario autenticado |
| POST | `/verify-email` | No | Body `{ token }` |
| GET | `/verify-email?token=` | No | Igual, por query (útil para el link del email) |
| POST | `/resend-verification` | No | Body `{ email }`. Respuesta genérica |
| POST | `/forgot-password` | No | Body `{ email }`. Respuesta genérica |
| POST | `/reset-password` | No | Body `{ token, password, confirmPassword }`. Cierra todas las sesiones |
| PATCH | `/change-password` | Sí | Body `{ currentPassword, newPassword, confirmPassword }`. Devuelve tokens nuevos |

Reglas de contraseña: 8–64 caracteres, al menos una minúscula, una mayúscula y un
número, sin espacios. Nombres: 2–60 caracteres, solo letras.

### Usuarios — `/api/users` (todas requieren token)

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| PATCH | `/me` | Sí | Actualiza `firstName` y/o `lastName` |
| GET | `/?page=1&limit=10&search=juan&role=user` | Admin | Lista paginada (`limit` máx. 100) |
| GET | `/:id` | Admin | Usuario por id |
| PATCH | `/:id/role` | Admin | Body `{ role: "user" \| "admin" }` |
| PATCH | `/:id/status` | Admin | Body `{ isActive }`. Desactivar cierra sus sesiones |
| DELETE | `/:id` | Admin | Elimina un usuario |

Un admin no puede cambiar su propio rol, estado ni eliminarse.

### Cursos — `/api/courses`

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/` | Sí | Crea un curso y genera el código de 4 dígitos |
| GET | `/mine` | Sí | Cursos del usuario autenticado (más nuevos primero) |
| GET | `/code/:code` | No | Curso y sus materiales por código (lo usa el alumno). Límite: 30 pedidos cada 15 min |

`POST /api/courses`

```json
{ "name": "1° Año - Ciencias Naturales", "level": "secundaria", "year": 1, "subject": "Ciencias Naturales" }
```

Respuestas: `data.curso` (crear), `data.cursos` (mine). `GET /code/:code` devuelve
`data.curso` con `id`, `name`, `code`, `level`, `year`, `subject` y
`materials[]`. Cada material trae sus metadatos (sin `accessibleText`,
`easyReadText`, `originalFilePath` ni `createdBy`) y `translations[]` con
`id`, `language`, `validated` y `simulated`. El contenido completo se pide con
`GET /api/materials/:id`.

### Materiales — `/api/materials`

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/?level=&grade=&subject=&q=` | No | Biblioteca pública (solo `visibility=publico`, máx. 50, orden por título) |
| GET | `/:id` | No | Material completo con sus traducciones |
| POST | `/` | Sí | Sube PDF o texto, extrae el texto y genera la lectura fácil |
| PATCH | `/:id` | Dueño o admin | Edita datos, corrige el texto accesible o la lectura fácil |
| POST | `/:id/lectura-facil` | Dueño o admin | Regenera la lectura fácil con Claude |
| POST | `/:id/transcribir` | Dueño o admin | Relee el PDF original con Claude, incluido el texto de imágenes |
| DELETE | `/:id` | Dueño o admin | Elimina el material y su PDF |

`POST`, `/lectura-facil` y `/transcribir` tienen un límite de 20 pedidos cada 15 minutos
para proteger la key del LLM.

#### POST /api/materials

`multipart/form-data`:

| Campo | Tipo | Obligatorio | Notas |
| --- | --- | --- | --- |
| `title` | string ≤ 200 | Sí | |
| `archivo` | PDF o `.txt` ≤ 10 MB | Uno de los dos | Si el PDF es escaneado, se transcribe con Claude (hasta 20 páginas) |
| `text` | string ≤ 50.000 | Uno de los dos | Texto pegado |
| `courseId` | UUID | No | El curso debe ser del usuario (o ser admin) |
| `level` | `primaria` \| `secundaria` | No | |
| `grade` | 1–7 | No | |
| `subject`, `license`, `source`, `author` | string | No | |
| `visibility` | `curso` \| `publico` | No | Default `curso` |

Responde `201` con el material en `data` (directamente, sin envolver en otra clave).
El `mensaje` indica si la lectura fácil se generó, salió del respaldo o quedó
pendiente, y avisa si el texto se leyó de imágenes. Puede tardar hasta 1 minuto
(2 si el PDF es escaneado).

Errores: `400` (archivo muy pesado o de otro tipo), `403` (curso de otro docente),
`404` (curso inexistente), `422` (validación, PDF ilegible o escaneado sin key /
con más de 20 páginas), `429` (rate limit), `503` (Claude no pudo leer las imágenes).

#### PATCH /api/materials/:id

JSON con cualquiera de: `title`, `level`, `grade`, `subject`, `license`, `source`,
`author`, `visibility`, `accessibleText`, `easyReadText`. Si se envía `easyReadText`,
`easyReadStatus` pasa a `manual`.

#### POST /api/materials/:id/lectura-facil

Sin body. `200` con el material actualizado o `503` si no se pudo generar.

#### POST /api/materials/:id/transcribir

Sin body. Reemplaza `accessibleText`, marca `textSource: "transcrito"` y regenera
la lectura fácil (si falla, conserva la anterior). Errores: `400` (no es PDF),
`410` (no está el PDF original), `422` (sin key o más de 20 páginas), `503`.

### Traducciones

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| POST | `/api/materials/:id/translations` | Sí | Guarda una traducción de un material, con audio opcional |

`multipart/form-data`: `language` (obligatorio), `text`, `author` (≤ 120),
`validated` (`true`/`false`), `simulated` (`true`/`false`) y `audio` (archivo
`webm`, `mp4`, `ogg` o `mp3`, hasta 15 MB). Responde `201` con `data.traduccion`.
El audio queda accesible en la URL de `audioUrl` (ej.
`http://localhost:3000/uploads/audios/tr-....mp3`). Las traducciones se leen con
`GET /api/materials/:id`.

### Glosario

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/api/glossary?language=wichi` | No | Términos ordenados por `es`. Sin `language` devuelve todas las lenguas |

Responde `data.terminos[]` con `id`, `es`, `term`, `language`, `source`, `note`.
No hay endpoint para crear términos; se cargan con el seed.

### Archivos estáticos

`/uploads/*` sirve los archivos subidos (audios y PDFs) con caché de 7 días. Helmet
está configurado con `crossOriginResourcePolicy: cross-origin` para que el frontend
pueda reproducirlos desde otro origen.

## Procesamiento de materiales

1. **Extracción** (`extraerTexto.service.js`): los `.txt` se leen tal cual; los PDFs
   con `pdf-parse`. El texto se limpia: une palabras cortadas y líneas partidas,
   convierte viñetas en guiones y quita espacios sobrantes.
2. **PDF escaneado**: si hay menos de 40 caracteres por página, se considera escaneado
   y se envía el PDF completo a Claude para transcribirlo (`textSource: "transcrito"`).
   Las imágenes con información se describen entre corchetes: `[Imagen: …]`.
3. **Lectura fácil** (`lecturaFacil.service.js`): se envían a Claude hasta 15.000
   caracteres con pautas de lectura fácil. Si no hay key o Claude falla, se busca un
   texto de respaldo en `data/lectura-facil-respaldo.json` por el slug del título
   (hoy incluye `la-fotosintesis`). Si tampoco hay respaldo, queda `pendiente`.
   Este servicio nunca lanza error, así que crear un material no falla por el LLM.
4. **Cliente de Claude** (`claude.client.js`): llama a `https://api.anthropic.com/v1/messages`
   con `fetch`, con timeout configurable, y rechaza respuestas cortadas por `max_tokens`.

## Seguridad

- Contraseñas hasheadas con `bcryptjs`. El login compara contra un hash dummy si el
  email no existe, para que el tiempo de respuesta no revele qué emails están registrados.
- JWT con access y refresh token. El campo `tokenVersion` invalida las sesiones al
  hacer logout, cambiar o restablecer la contraseña, o desactivar la cuenta.
- Tokens de email aleatorios (32 bytes) guardados hasheados, con vencimiento.
- Respuestas genéricas en recuperación de contraseña y reenvío de verificación.
- Campos sensibles eliminados de `req.user` y de las respuestas.
- Rate limiting (ventanas de 15 min):

  | Límite | Aplica a | Pedidos |
  | --- | --- | --- |
  | `apiLimiter` | Todo `/api` (salvo `/api/health`) | 500 |
  | `authLimiter` | `register`, `login` | 20 |
  | `emailLimiter` | `resend-verification`, `forgot-password` | 5 |
  | `limiteCodigo` | `GET /api/courses/code/:code` | 30 |
  | `limiteLLM` | Crear material, lectura fácil, transcribir | 20 |

  Todos se desactivan con `DISABLE_RATE_LIMIT=true`.
- Helmet, CORS con lista blanca y body JSON limitado a 1 MB.
- `authorize('admin')` restringe rutas por rol; `requireVerifiedEmail` está disponible
  para rutas que exijan email verificado (hoy no se usa en ninguna).

## Emails

Por SMTP, o impresos en consola si `SMTP_HOST` está vacío. Un fallo al enviar no
rompe el flujo. Plantillas en `config/mailer.js`:

- verificación de email
- recuperación de contraseña
- aviso de contraseña modificada
- bienvenida al verificar la cuenta

## Datos de la demo (seed)

```bash
npm run seed
```

Crea las tablas que falten (sin borrar nada) y carga, si no existen:

- Docente: `docente@demo.com` / `demo1234` (email verificado)
- Curso con código `4827`: "1° Año - Ciencias Naturales"
- Material público "La fotosíntesis" con lectura fácil (`respaldo`)
- Traducción al wichí **simulada** (texto de ejemplo, sin audio), pendiente de reemplazar por la real
- Glosario wichí de 15 términos (fuente: Glosario wichí lhämtes, INAI, 2017)

## Pruebas manuales

Con la extensión REST Client de VS Code (también sirven de referencia para Postman):

- `requests.http`: autenticación y usuarios.
- `requests.materiales.http`: materiales, errores esperados y el flujo completo de la
  demo (crear curso → subir material → cargar traducción con y sin audio → el alumno
  entra por código). Los PDFs de prueba van en `pdf-pruebas/` (ignorado por git).

## Documentación de contratos

- `API (1).md`: documento unificado más completo.
- `API.md` y `API.materiales.md`: versiones anteriores por módulo.

Estos archivos quedaron desactualizados en algunos puntos. Ante una diferencia, vale
el código y este README. Por ejemplo: los ids son UUID (no enteros), los errores de
validación son `422` (no `400`), `GET /api/courses/code/:code` devuelve los materiales
en `data.curso.materials` (no en `data.materiales`), y cursos, traducciones y
glosario ya están implementados aunque figuren como pendientes.

## Problemas conocidos

- **`GET /api/users` responde 500 siempre**: en `controllers/user.controllers.js`
  se llama a `datosPublicosuser` (con `u` minúscula) en lugar de `datosPublicosUser`.
- **`npm run db:up` / `db:down` no funcionan**: no existe `docker-compose.yml`.
- **Traducciones**:
  - Un audio de tipo no permitido o de más de 15 MB responde `500` en lugar de `400`.
  - El `:id` no se valida como UUID, así que un id mal formado responde `500` en lugar de `422`.
  - Cualquier usuario autenticado puede cargar traducciones en cualquier material.
- **Borrar un material** no borra los archivos de audio de sus traducciones.
- `GET /api/materials/:id` es público para cualquier material, también los de
  `visibility: "curso"`, siempre que se conozca el id.
- `LLM_API_KEY`, `LLM_MODEL`, `LLM_TIMEOUT_MS` y `UPLOAD_DIR` no están en `.env.example`.

## Deploy

- Definir secretos reales para JWT.
- Configurar `DATABASE_URL` con `DB_SSL=true` para conexiones externas (Supabase, Neon, Render…).
- Definir `CLIENT_URL` y `CORS_ORIGINS` con el dominio real del frontend.
- Usar un SMTP real o un proveedor de emails.
- Configurar `LLM_API_KEY` para la lectura fácil y la transcripción.
- `uploads/` es almacenamiento local: en plataformas con disco efímero, los PDFs y
  audios se pierden al reiniciar. Para producción conviene un almacenamiento externo.
- `app.set('trust proxy', 1)` ya está activo para que el rate limit funcione detrás
  de un proxy.
