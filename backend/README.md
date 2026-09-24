# Hackathon Backend PostgreSQL

API base para proyectos de hackatón y aplicaciones con autenticación, usuarios, roles, validaciones y envío de emails. Esta versión ya está adaptada al código actual del proyecto y refleja la estructura real que existe en el repositorio.

## Stack

- Node.js
- Express
- PostgreSQL + Sequelize
- JWT para autenticación
- bcryptjs para contraseñas
- Nodemailer para emails
- express-validator
- Helmet + CORS
- express-rate-limit
- Docker Compose para la base de datos

## Requisitos

- Node.js 18 o superior
- PostgreSQL corriendo localmente o en Docker
- Variables de entorno configuradas en un archivo `.env`

## Instalación

```bash
npm install
```

### Levantar base de datos con Docker

```bash
npm run db:up
```

### Ejecutar en modo desarrollo

```bash
npm run dev
```

La API corre normalmente en:

```text
http://localhost:3000/api
```

## Variables de entorno

Crea un archivo `.env` con las siguientes variables:

```env
APP_NAME=Hackathon API
PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173

# PostgreSQL
DATABASE_URL=postgres://postgres:postgres@localhost:5432/hackathon_db
# O bien:
# DB_NAME=hackathon_db
# DB_USER=postgres
# DB_PASSWORD=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_SSL=false
# DB_LOGGING=false
# DB_SYNC=alter

# JWT
JWT_ACCESS_SECRET=tu_access_secret
JWT_REFRESH_SECRET=tu_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Seguridad
BCRYPT_ROUNDS=10
REQUIRE_EMAIL_VERIFICATION=true
EMAIL_VERIFICATION_HOURS=24
PASSWORD_RESET_MINUTES=30
DISABLE_RATE_LIMIT=false

# Frontend / Emails
CLIENT_URL=http://localhost:5173
EMAIL_VERIFY_URL=http://localhost:5173/verify-email
RESET_PASSWORD_URL=http://localhost:5173/reset-password

# SMTP (opcional)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=Hackathon API <no-reply@hackathon.dev>

# Admin inicial
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=Sistema
```

### Notas importantes

- Si `DATABASE_URL` existe, se usa primero.
- Si no hay SMTP configurado, los emails se imprimen en consola en modo desarrollo.
- Si `ADMIN_EMAIL` y `ADMIN_PASSWORD` están definidos, se crea un usuario admin al iniciar la app.
- `DB_SYNC` puede ser:
  - `alter` (por defecto): ajusta esquema automáticamente
  - `force`: borra y recrea tablas
  - `none`: solo autentica la conexión

## Estructura del proyecto

```text
.
├─ app.js
├─ docker-compose.yml
├─ package.json
├─ README.md
├─ requests.http
├─ config/
│  ├─ database.js
│  └─ mailer.js
├─ controllers/
│  ├─ auth.controllers.js
│  └─ user.controllers.js
├─ middlewares/
│  ├─ authMiddleware.js
│  ├─ rateLimiters.js
│  ├─ roleMiddleware.js
│  └─ validator/
│     ├─ auth.validator.js
│     ├─ common.rules.js
│     ├─ id.validator.js
│     ├─ user.validator.js
│     └─ validarResultado.js
├─ models/
│  └─ user.models.js
├─ routes/
│  ├─ auth.routes.js
│  └─ user.routes.js
└─ node_modules/
```

## Modelo principal

El proyecto actualmente cuenta con el modelo `User` en `models/user.models.js` con los siguientes campos:

- id
- firstName
- lastName
- email
- password
- role: `user` o `admin`
- isActive
- isEmailVerified
- emailVerificationToken
- emailVerificationExpires
- passwordResetToken
- passwordResetExpires
- tokenVersion
- lastLoginAt
- timestamps (`createdAt`, `updatedAt`)

## Endpoints disponibles

Todas las respuestas siguen el formato:

```json
{
  "exito": true,
  "mensaje": "Texto descriptivo",
  "data": {}
}
```

### Autenticación

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Verifica que la API esté funcionando |
| POST | `/api/auth/register` | No | Registro de usuario y envío de mail de verificación |
| POST | `/api/auth/login` | No | Login, devuelve `accessToken` y `refreshToken` |
| POST | `/api/auth/refresh` | No | Renueva tokens con `refreshToken` |
| POST | `/api/auth/logout` | Sí | Invalida sesión actual y todos los tokens del usuario |
| GET | `/api/auth/me` | Sí | Devuelve los datos del usuario autenticado |
| POST | `/api/auth/verify-email` | No | Verifica email por body `{ token }` |
| GET | `/api/auth/verify-email` | No | Verifica email por query `?token=` |
| POST | `/api/auth/resend-verification` | No | Reenvía email de verificación |
| POST | `/api/auth/forgot-password` | No | Solicita restauración de contraseña |
| POST | `/api/auth/reset-password` | No | Restaura contraseña con token |
| PATCH | `/api/auth/change-password` | Sí | Cambia contraseña pidiendo la actual |

### Usuarios

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| PATCH | `/api/users/me` | Sí | Actualiza nombre y apellido del perfil propio |
| GET | `/api/users?page=1&limit=10&search=juan&role=user` | Admin | Lista paginada de usuarios |
| GET | `/api/users/:id` | Admin | Obtiene un usuario por id |
| PATCH | `/api/users/:id/role` | Admin | Cambia el rol (`user` / `admin`) |
| PATCH | `/api/users/:id/status` | Admin | Activa o desactiva un usuario |
| DELETE | `/api/users/:id` | Admin | Elimina un usuario |

### Autorización

- `Authorization: Bearer <accessToken>` en endpoints protegidos.
- El middleware `authorize('admin')` restringe rutas a usuarios con rol admin.
- El middleware `requireVerifiedEmail` puede usarse para rutas que exigen email verificado.

## Seguridad implementada

- Contraseñas hasheadas con `bcryptjs`.
- JWT con `accessToken` y `refreshToken`.
- `tokenVersion` para invalidar sesiones anteriores cuando se hace logout, cambia la contraseña o se desactiva la cuenta.
- Rate limiting para login/registro y envío de emails.
- Email de verificación obligatorio si `REQUIRE_EMAIL_VERIFICATION=true`.
- Respuestas genéricas en recuperación de contraseña y reenvío de verificación para no filtrar emails existentes.

## Email y flujo de autenticación

Los emails pueden ser enviados por SMTP o quedar en modo dev, donde se imprimen en consola con el enlace generado. El proyecto incluye:

- verificación de email
- recuperación de contraseña
- alerta de contraseña modificada
- bienvenida al verificar la cuenta

## Ejecutar localmente

```bash
npm install
npm run db:up
npm run dev
```

Si prefieres usar PostgreSQL local sin Docker, asegúrate de tener una base llamada `hackathon_db` o configurar `DATABASE_URL` correctamente.

## Archivo de pruebas HTTP

El proyecto incluye un archivo `requests.http` con ejemplos para probar los endpoints desde VS Code con la extensión REST Client.

## Deploy

Para producción:

- usar variables reales para JWT
- configurar `DATABASE_URL` o variables DB en el servicio host
- activar SSL si la base es externa
- definir `CLIENT_URL` y `CORS_ORIGINS` con el frontend real
- usar un SMTP real o un proveedor externo para emails

## Personalización

Si se quiere continuar este backend para una funcionalidad específica, la estructura ya está lista para agregar nuevos modelos, validaciones y rutas en:

- `models/`
- `controllers/`
- `middlewares/validator/`
- `routes/`

