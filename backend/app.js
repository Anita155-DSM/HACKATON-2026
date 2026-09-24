import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import { sequelize } from './config/database.js';
import { verificarConexionSMTP } from './config/mailer.js';

// IMPORTAMOS MODELOS
import './models/user.models.js';
import { User } from './models/user.models.js';

// IMPORTAMOS RUTAS
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { apiLimiter } from './middlewares/rateLimiters.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';
const appName = process.env.APP_NAME || 'Hackathon API';

app.set('trust proxy', 1); // necesario detrás de Render/Railway/etc. para el rate limit

// CORS: define quién puede consumir la API (lista blanca)
const dominiosPermitidos = (process.env.CORS_ORIGINS || '*').split(',').map((o) => o.trim());

app.use(helmet());
app.use(
  cors({
    origin: dominiosPermitidos.includes('*') ? true : dominiosPermitidos,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
if (nodeEnv !== 'test') app.use(morgan('dev'));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ exito: true, mensaje: `${appName} funcionando`, data: { env: nodeEnv, uptime: process.uptime() } });
});

// REGISTRO DE RUTAS API
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ exito: false, mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejador de errores no controlados
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('💥', err);
  const status = err.type === 'entity.parse.failed' ? 400 : 500;
  res.status(status).json({ exito: false, mensaje: status === 400 ? 'El body no es un JSON válido' : 'Error interno del servidor' });
});

// Crea un admin al arrancar si ADMIN_EMAIL y ADMIN_PASSWORD están definidos
const crearAdminInicial = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;

  const email = ADMIN_EMAIL.toLowerCase().trim();
  const existente = await User.findOne({ where: { email } });
  if (existente) return;

  await User.create({
    firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
    lastName: process.env.ADMIN_LAST_NAME || 'Sistema',
    email,
    password: await bcrypt.hash(ADMIN_PASSWORD, parseInt(process.env.BCRYPT_ROUNDS, 10) || 10),
    role: 'admin',
    isEmailVerified: true,
  });
  console.log(`user admin creado: ${email}`);
};

// Función para conectar a la base de datos, sincronizar tablas y levantar el servidor
const startServer = async () => {
  try {
    // DB_SYNC: "alter" (default, ajusta tablas), "force" (BORRA y recrea), "none"
    const modoSync = process.env.DB_SYNC || 'alter';
    if (modoSync === 'force') await sequelize.sync({ force: true });
    else if (modoSync === 'alter') await sequelize.sync({ alter: true });
    else await sequelize.authenticate();
    console.log(`Conexión exitosa a PostgreSQL y tablas sincronizadas (sync: ${modoSync})`);

    await crearAdminInicial();
    verificarConexionSMTP();

    app.listen(port, () => {
      console.log(`${appName} escuchando en http://localhost:${port}/api`);
    });
  } catch (error) {
    console.error('Error crítico: no se pudo iniciar el servidor', error.message);
    process.exit(1);
  }
};

startServer();
