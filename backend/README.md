# Hackathon Backend PostgreSQL

## Descripción

Este repositorio contiene la **base del backend** para el proyecto de la hackatón.
Es una estructura inicial y reutilizable sobre la que se pueden añadir las
funcionalidades específicas del producto. Actualmente incluye la base de una API
REST con autenticación, gestión de usuarios, roles, validaciones, seguridad y
envío de emails.

La base actual permite registrar e iniciar sesión, renovar y cerrar sesiones,
verificar emails, recuperar y cambiar contraseñas, consultar el perfil propio y
gestionar usuarios desde una cuenta administradora. También deja preparada la
conexión con PostgreSQL mediante Supabase y el control de variables de entorno.

## Lenguaje y tecnologías

### Lenguaje del backend

- **JavaScript** moderno con **ES Modules** (`import` / `export`).
- **Node.js 18 o superior** como entorno de ejecución.

### Tecnologías principales

- **Express**: servidor HTTP y definición de rutas REST.
- **PostgreSQL**: base de datos relacional.
- **Sequelize**: ORM para conectar y trabajar con PostgreSQL.
- **JWT** (`jsonwebtoken`): access tokens y refresh tokens.
- **bcryptjs**: hash seguro de contraseñas.
- **Nodemailer**: envío de emails de verificación y recuperación.
- **express-validator**: validación de cuerpos, parámetros y consultas.
- **Helmet**: cabeceras de seguridad HTTP.
- **CORS**: control de los orígenes permitidos.
- **express-rate-limit**: limitación de solicitudes en la API y autenticación.
- **Morgan**: registro de solicitudes HTTP durante el desarrollo.
- **dotenv**: configuración mediante variables de entorno.
- **Nodemon**: reinicio automático del servidor en desarrollo.

## Stack

- JavaScript + Node.js
- Express
- PostgreSQL + Sequelize
- JWT para autenticación
- bcryptjs para contraseñas
- Nodemailer para emails
- express-validator
- Helmet + CORS
- express-rate-limit + Morgan
- Supabase como servicio PostgreSQL

## Requisitos

- Node.js 18 o superior
- Una cuenta y un proyecto de Supabase con una base de datos PostgreSQL
- Variables de entorno configuradas en un archivo `.env`

## Instalación

```bash
npm install
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

# PostgreSQL / Supabase
DATABASE_URL=postgresql://postgres:<PASSWORD>@<SUPABASE_HOST>:5432/postgres
DB_SSL=true
# Como alternativa, se pueden usar variables PostgreSQL separadas:
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
- Si `ADMIN_EMAIL` y `ADMIN_PASSWORD` están definidos, se crea un user admin al iniciar la app.
- `DB_SYNC` puede ser:
  - `alter` (por defecto): ajusta esquema automáticamente
  - `force`: borra y recrea tablas
  - `none`: solo autentica la conexión

## Estructura del proyecto

```text
.
├─ app.js
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
| POST | `/api/auth/register` | No | Registro de user y envío de mail de verificación |
| POST | `/api/auth/login` | No | Login, devuelve `accessToken` y `refreshToken` |
| POST | `/api/auth/refresh` | No | Renueva tokens con `refreshToken` |
| POST | `/api/auth/logout` | Sí | Invalida sesión actual y todos los tokens del user |
| GET | `/api/auth/me` | Sí | Devuelve los datos del user autenticado |
| POST | `/api/auth/verify-email` | No | Verifica email por body `{ token }` |
| GET | `/api/auth/verify-email` | No | Verifica email por query `?token=` |
| POST | `/api/auth/resend-verification` | No | Reenvía email de verificación |
| POST | `/api/auth/forgot-password` | No | Solicita restauración de contraseña |
| POST | `/api/auth/reset-password` | No | Restaura contraseña con token |
| PATCH | `/api/auth/change-password` | Sí | Cambia contraseña pidiendo la actual |

### users

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| PATCH | `/api/users/me` | Sí | Actualiza nombre y apellido del perfil propio |
| GET | `/api/users?page=1&limit=10&search=juan&role=user` | Admin | Lista paginada de users |
| GET | `/api/users/:id` | Admin | Obtiene un user por id |
| PATCH | `/api/users/:id/role` | Admin | Cambia el rol (`user` / `admin`) |
| PATCH | `/api/users/:id/status` | Admin | Activa o desactiva un user |
| DELETE | `/api/users/:id` | Admin | Elimina un user |

### Autorización

- `Authorization: Bearer <accessToken>` en endpoints protegidos.
- El middleware `authorize('admin')` restringe rutas a users con rol admin.
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

El backend utiliza Supabase como PostgreSQL. Configura la cadena de conexión de
Supabase en `DATABASE_URL` y activa `DB_SSL=true` para la conexión segura. La
aplicación utiliza `DATABASE_URL` antes que las variables `DB_*` separadas.

## Archivo de pruebas HTTP

El proyecto incluye un archivo `requests.http` con ejemplos para probar los endpoints desde VS Code con la extensión REST Client.

## Deploy

Para producción con Supabase:

- usar variables reales para JWT
- configurar la cadena de conexión de Supabase en `DATABASE_URL`
- mantener `DB_SSL=true` para la conexión externa
- definir `CLIENT_URL` y `CORS_ORIGINS` con el frontend real
- usar un SMTP real o un proveedor externo para emails

## Personalización

Si se quiere continuar este backend para una funcionalidad específica, la estructura ya está lista para agregar nuevos modelos, validaciones y rutas en:

- `models/`
- `controllers/`
- `middlewares/validator/`
- `routes/`

