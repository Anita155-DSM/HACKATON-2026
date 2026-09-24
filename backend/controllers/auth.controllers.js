import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { User } from '../models/user.models.js';
import {
  enviarMailVerificacion,
  enviarMailRecuperacion,
  enviarMailPasswordCambiada,
  enviarMailBienvenida,
} from '../config/mailer.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_cambiar';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_cambiar';
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
const REQUIRE_EMAIL_VERIFICATION = process.env.REQUIRE_EMAIL_VERIFICATION === 'true';
const EMAIL_VERIFICATION_HOURS = parseInt(process.env.EMAIL_VERIFICATION_HOURS, 10) || 24;
const PASSWORD_RESET_MINUTES = parseInt(process.env.PASSWORD_RESET_MINUTES, 10) || 30;

// Hash dummy para que el login tarde lo mismo exista o no el user
const DUMMY_HASH = bcrypt.hashSync('dummy-password', 10);
const MENSAJE_EMAIL_GENERICO = 'Si el email está registrado, vas a recibir un correo con las instrucciones';

// Solo los campos que puede ver el propio dueño de la cuenta (o un admin)
const datosPublicosUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  isEmailVerified: user.isEmailVerified,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
});

const generarAccessToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role, tv: user.tokenVersion }, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });

const generarRefreshToken = (user) =>
  jwt.sign({ sub: user.id, tv: user.tokenVersion }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

const generarTokensAuth = (user) => ({
  accessToken: generarAccessToken(user),
  refreshToken: generarRefreshToken(user),
  tokenType: 'Bearer',
  expiresIn: JWT_ACCESS_EXPIRES_IN,
});

const hashearToken = (token) => crypto.createHash('sha256').update(String(token)).digest('hex');

const generarTokenAleatorio = () => {
  const raw = crypto.randomBytes(32).toString('hex');
  return { raw, hashed: hashearToken(raw) };
};

const enviarVerificacionEmail = async (user) => {
  const { raw, hashed } = generarTokenAleatorio();
  user.emailVerificationToken = hashed;
  user.emailVerificationExpires = new Date(Date.now() + EMAIL_VERIFICATION_HOURS * 60 * 60 * 1000);
  await user.save();
  enviarMailVerificacion(user.email, user.firstName || 'user/a', raw, EMAIL_VERIFICATION_HOURS); // sin await: no bloquea la respuesta
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existente = await User.findOne({ where: { email: String(email).toLowerCase().trim() } });
    if (existente) {
      return res.status(409).json({ exito: false, mensaje: 'El email ya está registrado' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, BCRYPT_ROUNDS),
    });
    await enviarVerificacionEmail(user);

    if (REQUIRE_EMAIL_VERIFICATION) {
      return res.status(201).json({
        exito: true,
        mensaje: 'Registro exitoso. Revisá tu email para verificar la cuenta',
        data: { user: datosPublicosUser(user) },
      });
    }

    return res.status(201).json({
      exito: true,
      mensaje: 'Registro exitoso',
      data: { user: datosPublicosUser(user), ...generarTokensAuth(user) },
    });
  } catch (error) {
    console.error('Error al registrar user:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: String(email).toLowerCase().trim() } });
    const esValida = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

    if (!user || !esValida) {
      return res.status(401).json({ exito: false, mensaje: 'Email o contraseña incorrectos' });
    }
    if (!user.isActive) {
      return res.status(403).json({ exito: false, mensaje: 'La cuenta está desactivada' });
    }
    if (REQUIRE_EMAIL_VERIFICATION && !user.isEmailVerified) {
      return res.status(403).json({ exito: false, mensaje: 'Debés verificar tu email antes de iniciar sesión' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    return res.status(200).json({
      exito: true,
      mensaje: 'Inicio de sesión exitoso',
      data: { user: datosPublicosUser(user), ...generarTokensAuth(user) },
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/auth/refresh  { refreshToken }
export const refresh = async (req, res) => {
  try {
    let payload;
    try {
      payload = jwt.verify(req.body.refreshToken, JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ exito: false, mensaje: 'Refresh token inválido o expirado' });
    }

    const user = await User.findByPk(payload.sub);
    if (!user || !user.isActive || user.tokenVersion !== payload.tv) {
      return res.status(401).json({ exito: false, mensaje: 'Refresh token inválido o expirado' });
    }

    return res.status(200).json({ exito: true, mensaje: 'Token renovado', data: generarTokensAuth(user) });
  } catch (error) {
    console.error('Error al renovar token:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/auth/logout  (invalida los tokens en todos los dispositivos)
export const logout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    user.tokenVersion += 1;
    await user.save();
    res.status(200).json({ exito: true, mensaje: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error en logout:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/auth/me
export const me = async (req, res) => {
  res.status(200).json({ exito: true, data: { user: req.user } });
};

// POST /api/auth/verify-email { token }  |  GET /api/auth/verify-email?token=...
export const verifyEmail = async (req, res) => {
  try {
    const token = req.body?.token || req.query.token;
    const user = await User.findOne({
      where: { emailVerificationToken: hashearToken(token), emailVerificationExpires: { [Op.gt]: new Date() } },
    });
    if (!user) {
      return res.status(400).json({ exito: false, mensaje: 'El link de verificación es inválido o expiró' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    enviarMailBienvenida(user.email, user.firstName || 'user/a');
    res.status(200).json({ exito: true, mensaje: 'Email verificado correctamente' });
  } catch (error) {
    console.error('Error al verificar email:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/auth/resend-verification  { email }
export const resendVerification = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: String(req.body.email).toLowerCase().trim() } });
    if (user && user.isActive && !user.isEmailVerified) await enviarVerificacionEmail(user);
    res.status(200).json({ exito: true, mensaje: MENSAJE_EMAIL_GENERICO });
  } catch (error) {
    console.error('Error al reenviar verificación:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/auth/forgot-password  { email }
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: String(req.body.email).toLowerCase().trim() } });

    if (user && user.isActive) {
      const { raw, hashed } = generarTokenAleatorio();
      user.passwordResetToken = hashed;
      user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_MINUTES * 60 * 1000);
      await user.save();
      enviarMailRecuperacion(user.email, user.firstName || 'user/a', raw, PASSWORD_RESET_MINUTES);
    }
    // Siempre la misma respuesta: no revelamos qué emails existen
    res.status(200).json({ exito: true, mensaje: MENSAJE_EMAIL_GENERICO });
  } catch (error) {
    console.error('Error al solicitar recuperación:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/auth/reset-password  { token, password, confirmPassword }
export const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { passwordResetToken: hashearToken(req.body.token), passwordResetExpires: { [Op.gt]: new Date() } },
    });
    if (!user) {
      return res.status(400).json({ exito: false, mensaje: 'El link de recuperación es inválido o expiró' });
    }

    user.password = await bcrypt.hash(req.body.password, BCRYPT_ROUNDS);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.isEmailVerified = true; // si pudo abrir el link, el email es suyo
    user.tokenVersion += 1; // cierra todas las sesiones
    await user.save();

    enviarMailPasswordCambiada(user.email, user.firstName || 'user/a');
    res.status(200).json({ exito: true, mensaje: 'Contraseña restablecida. Ya podés iniciar sesión' });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// PATCH /api/auth/change-password  { currentPassword, newPassword, confirmPassword }
export const changePassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
      return res.status(400).json({ exito: false, mensaje: 'La contraseña actual es incorrecta' });
    }

    user.password = await bcrypt.hash(req.body.newPassword, BCRYPT_ROUNDS);
    user.tokenVersion += 1;
    await user.save();

    enviarMailPasswordCambiada(user.email, user.firstName || 'user/a');
    // Devolvemos tokens nuevos para que esta sesión siga activa
    res.status(200).json({
      exito: true,
      mensaje: 'Contraseña actualizada',
      data: { user: datosPublicosUser(user), ...generarTokensAuth(user) },
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};
