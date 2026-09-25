# HACKATON-2026

Plataforma educativa accesible orientada a reducir barreras sensoriales, tecnológicas y cognitivas en el acceso a contenidos digitales.

---

## 🗂️ Estructura del Proyecto

```
HACKATON-2026/
│
├── backend/
│   ├── config/
│   │   ├── database.js               # Conexión Sequelize → PostgreSQL
│   │   └── mailer.js                 # Configuración SMTP (Nodemailer)
│   │
│   ├── controllers/
│   │   ├── auth.controllers.js       # Lógica de register, login, me, logout, etc.
│   │   └── user.controllers.js       # Lógica CRUD de usuarios (admin)
│   │
│   ├── middlewares/
│   │   ├── validator/
│   │   │   ├── auth.validator.js     # Reglas de validación para rutas de auth
│   │   │   └── user.validator.js     # Reglas de validación para rutas de users
│   │   ├── authMiddleware.js         # Verifica JWT (authenticate)
│   │   ├── rateLimiters.js           # Límites de peticiones (apiLimiter, authLimiter, emailLimiter)
│   │   └── roleMiddleware.js         # Verifica rol (authorize)
│   │
│   ├── models/
│   │   └── user.models.js            # Modelo User (UUID, roles, tokens, flags)
│   │
│   ├── routes/
│   │   ├── auth.routes.js            # /api/auth/* (register, login, verify-email, etc.)
│   │   └── user.routes.js            # /api/users/* (CRUD protegido por rol admin)
│   │
│   ├── .env                          # Variables de entorno (no subir a git)
│   ├── .env.example                  # Plantilla de variables requeridas
│   ├── .gitignore
│   ├── app.js                        # Punto de entrada: Express + middlewares + arranque
│   ├── docker-compose.yml            # PostgreSQL en Docker para desarrollo local
│   ├── package.json
│   ├── README.md
│   └── requests.http                 # Colección de peticiones de prueba (REST Client)
│
└── frontend/
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    │
    ├── src/
    │   ├── assets/
    │   │   ├── css/
    │   │   │   └── animations.css    # Keyframes: fadeIn, pop
    │   │   ├── hero.png
    │   │   ├── index.css             # Estilos globales + Tailwind base
    │   │   ├── react.svg
    │   │   └── vite.svg
    │   │
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Footer.jsx        # Pie de página con año dinámico + dark mode
    │   │   │   ├── Loading.jsx       # Spinner de carga global
    │   │   │   ├── Navbar.jsx        # Barra superior: usuario, logout
    │   │   │   ├── Sidebar.jsx       # Menú lateral: Dashboard, Users, Ajustes
    │   │   │   └── index.js          # Re-exportaciones del layout
    │   │   │
    │   │   └── ui/
    │   │       ├── modals/
    │   │       │   ├── ConfirmModal.jsx   # Modal de confirmación para acciones destructivas
    │   │       │   ├── Modal.jsx          # Modal genérico con bloqueo de scroll
    │   │       │   └── index.js           # Re-exportaciones de modales
    │   │       │
    │   │       ├── Button.jsx         # Botón reutilizable (variantes: primary, danger, outline)
    │   │       ├── Card.jsx           # Tarjeta con soporte dark mode
    │   │       ├── Input.jsx          # Input con label, error inline y show/hide password
    │   │       ├── ToggleSwitch.jsx   # Switch accesible (role="switch", aria-checked)
    │   │       └── index.js           # Re-exportaciones de UI
    │   │
    │   ├── config/
    │   │   └── axios.js              # Instancia Axios + interceptor JWT + auto-logout 401
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx       # Contexto global de sesión (valida token al montar)
    │   │
    │   ├── features/
    │   │   └── auth/
    │   │       └── pages/
    │   │           ├── Login.jsx     # Formulario de inicio de sesión + feedback sonoro
    │   │           ├── Register.jsx  # Formulario de registro con validación
    │   │           └── index.js      # Re-exportaciones
    │   │
    │   ├── helpers/
    │   │   └── sounds/
    │   │       └── audio.js          # Web Audio API: sonidos success/error accesibles
    │   │
    │   ├── hooks/
    │   │   ├── useAuth.js            # Consume AuthContext
    │   │   └── useSettings.js        # Toda la lógica de accesibilidad (TTS, contraste, sonidos, etc.)
    │   │
    │   ├── layouts/
    │   │   ├── AuthLayout.jsx        # Layout centrado para login y registro
    │   │   └── MainLayout.jsx        # Layout principal: Sidebar + Navbar + Modo Foco
    │   │
    │   ├── lib/
    │   │   └── offline/
    │   │       └── index.js          # Motor offline: IndexedDB (Dexie) + sincronización automática
    │   │
    │   ├── mocks/
    │   │   └── mockBackend.js        # Intercepta Axios para desarrollo sin backend real
    │   │
    │   ├── pages/
    │   │   ├── home/
    │   │   │   └── Home.jsx          # Dashboard: métricas y actividad reciente
    │   │   │
    │   │   ├── profile/
    │   │   │   └── Profile.jsx       # Perfil del usuario logueado
    │   │   │
    │   │   ├── settings/
    │   │   │   └── Settings.jsx      # Panel de accesibilidad: tema, contraste, TTS, audio
    │   │   │
    │   │   └── users/
    │   │       └── Users.jsx         # Gestión de usuarios: tabla + crear + eliminar
    │   │
    │   ├── routes/
    │   │   ├── AppRouter.jsx         # Árbol de rutas: públicas (/login, /register) y privadas (/)
    │   │   └── ProtectedRoute.jsx    # Guarda de rutas: redirige si no hay sesión
    │   │
    │   ├── services/
    │   │   ├── adminService.js       # Llamadas a la API para operaciones de admin
    │   │   ├── authService.js        # loginService, validarTokenService
    │   │   └── userService.js        # Llamadas a la API para datos del usuario
    │   │
    │   ├── store/
    │   │   ├── authStore.js          # Zustand: user + accessToken (persiste en localStorage)
    │   │   └── themeStore.js         # Zustand: tema dark/light (persiste en localStorage)
    │   │
    │   ├── App.jsx                   # Raíz: AuthProvider + Toaster + AppRoutes
    │   └── main.jsx                  # ReactDOM.createRoot + BrowserRouter
    │
    ├── .env                          # Variables de entorno del frontend (VITE_API_URL)
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html                    # HTML base (punto de montaje de React)
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚙️ Variables de Entorno

### Backend (`backend/.env`)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/hackaton_db
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=1h
BCRYPT_ROUNDS=10
ADMIN_EMAIL=admin@mail.com
ADMIN_PASSWORD=Admin123!
CORS_ORIGINS=http://localhost:5173
SMTP_HOST=smtp.ejemplo.com
SMTP_PORT=587
SMTP_USER=tu@mail.com
SMTP_PASS=tu_contraseña
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🚀 Cómo levantar el proyecto

### 1. Base de datos (Docker)
```bash
cd backend
npm run db:up
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## ♿ Funciones de Accesibilidad

| Feature | Descripción |
|---|---|
| 🔊 Lectura en voz alta | Web Speech API en español, voz Google si disponible |
| 🎵 Sonidos accesibles | Web Audio API con ondas perceptibles para pérdida auditiva |
| 🌗 Alto contraste | Clase `.high-contrast` global, persistida |
| 🌙 Modo oscuro | Tailwind `dark:` + Zustand + localStorage |
| 🎯 Modo foco | Oculta distracciones visuales (Sidebar, Navbar, Footer) |
| 📶 Modo offline | IndexedDB (Dexie) + sincronización automática al reconectar |

