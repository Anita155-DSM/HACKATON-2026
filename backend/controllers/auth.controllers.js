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

// Hash dummy para que el login tarde lo mismo exista o no el usuario
const DUMMY_HASH = bcrypt.hashSync('dummy-password', 10);
const MENSAJE_EMAIL_GENERICO = 'Si el email está registrado, vas a recibir un correo con las instrucciones';

// Solo los campos que puede ver el propio dueño de la cuenta (o un admin)
const datosPublicosUsuario = (usuario) => ({
  id: usuario.id,
  firstName: usuario.firstName,
  lastName: usuario.lastName,
  email: usuario.email,
  role: usuario.role,
  isActive: usuario.isActive,
  isEmailVerified: usuario.isEmailVerified,
  lastLoginAt: usuario.lastLoginAt,
  createdAt: usuario.createdAt,
});

const generarAccessToken = (usuario) =>
  jwt.sign({ sub: usuario.id, role: usuario.role, tv: usuario.tokenVersion }, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });

const generarRefreshToken = (usuario) =>
  jwt.sign({ sub: usuario.id, tv: usuario.tokenVersion }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

const generarTokensAuth = (usuario) => ({
  accessToken: generarAccessToken(usuario),
  refreshToken: generarRefreshToken(usuario),
  tokenType: 'Bearer',
  expiresIn: JWT_ACCESS_EXPIRES_IN,
});

const hashearToken = (token) => crypto.createHash('sha256').update(String(token)).digest('hex');

const generarTokenAleatorio = () => {
  const raw = crypto.randomBytes(32).toString('hex');
  return { raw, hashed: hashearToken(raw) };
};

const enviarVerificacionEmail = async (usuario) => {
  const { raw, hashed } = generarTokenAleatorio();
  usuario.emailVerificationToken = hashed;
  usuario.emailVerificationExpires = new Date(Date.now() + EMAIL_VERIFICATION_HOURS * 60 * 60 * 1000);
  await usuario.save();
  enviarMailVerificacion(usuario.email, usuario.firstName || 'usuario/a', raw, EMAIL_VERIFICATION_HOURS); // sin await: no bloquea la respuesta
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existente = await User.findOne({ where: { email: String(email).toLowerCase().trim() } });
    if (existente) {
      return res.status(409).json({ exito: false, mensaje: 'El email ya está registrado' });
    }

    const usuario = await User.create({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, BCRYPT_ROUNDS),
    });
    await enviarVerificacionEmail(usuario);

    if (REQUIRE_EMAIL_VERIFICATION) {
      return res.status(201).json({
        exito: true,
        mensaje: 'Registro exitoso. Revisá tu email para verificar la cuenta',
        data: { usuario: datosPublicosUsuario(usuario) },
      });
    }

    return res.status(201).json({
      exito: true,
      mensaje: 'Registro exitoso',
      data: { usuario: datosPublicosUsuario(usuario), ...generarTokensAuth(usuario) },
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await User.findOne({ where: { email: String(email).toLowerCase().trim() } });
    const esValida = await bcrypt.compare(password, usuario ? usuario.password : DUMMY_HASH);

    if (!usuario || !esValida) {
      return res.status(401).json({ exito: false, mensaje: 'Email o contraseña incorrectos' });
    }
    if (!usuario.isActive) {
      return res.status(403).json({ exito: false, mensaje: 'La cuenta está desactivada' });
    }
    if (REQUIRE_EMAIL_VERIFICATION && !usuario.isEmailVerified) {
      return res.status(403).json({ exito: false, mensaje: 'Debés verificar tu email antes de iniciar sesión' });
    }

    usuario.lastLoginAt = new Date();
    await usuario.save();

    return res.status(200).json({
      exito: true,
      mensaje: 'Inicio de sesión exitoso',
      data: { usuario: datosPublicosUsuario(usuario), ...generarTokensAuth(usuario) },
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

    const usuario = await User.findByPk(payload.sub);
    if (!usuario || !usuario.isActive || usuario.tokenVersion !== payload.tv) {
      return res.status(401).json({ exito: false, mensaje: 'Refresh token inválido o expirado' });
    }

    return res.status(200).json({ exito: true, mensaje: 'Token renovado', data: generarTokensAuth(usuario) });
  } catch (error) {
    console.error('Error al renovar token:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/auth/logout  (invalida los tokens en todos los dispositivos)
export const logout = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.user.id);
    usuario.tokenVersion += 1;
    await usuario.save();
    res.status(200).json({ exito: true, mensaje: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error en logout:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/auth/me
export const me = async (req, res) => {
  res.status(200).json({ exito: true, data: { usuario: req.user } });
};

// POST /api/auth/verify-email { token }  |  GET /api/auth/verify-email?token=...
export const verifyEmail = async (req, res) => {
  try {
    const token = req.body?.token || req.query.token;
    const usuario = await User.findOne({
      where: { emailVerificationToken: hashearToken(token), emailVerificationExpires: { [Op.gt]: new Date() } },
    });
    if (!usuario) {
      return res.status(400).json({ exito: false, mensaje: 'El link de verificación es inválido o expiró' });
    }

    usuario.isEmailVerified = true;
    usuario.emailVerificationToken = null;
    usuario.emailVerificationExpires = null;
    await usuario.save();

    enviarMailBienvenida(usuario.email, usuario.firstName || 'usuario/a');
    res.status(200).json({ exito: true, mensaje: 'Email verificado correctamente' });
  } catch (error) {
    console.error('Error al verificar email:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/auth/resend-verification  { email }
export const resendVerification = async (req, res) => {
  try {
    const usuario = await User.findOne({ where: { email: String(req.body.email).toLowerCase().trim() } });
    if (usuario && usuario.isActive && !usuario.isEmailVerified) await enviarVerificacionEmail(usuario);
    res.status(200).json({ exito: true, mensaje: MENSAJE_EMAIL_GENERICO });
  } catch (error) {
    console.error('Error al reenviar verificación:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/auth/forgot-password  { email }
export const forgotPassword = async (req, res) => {
  try {
    const usuario = await User.findOne({ where: { email: String(req.body.email).toLowerCase().trim() } });

    if (usuario && usuario.isActive) {
      const { raw, hashed } = generarTokenAleatorio();
      usuario.passwordResetToken = hashed;
      usuario.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_MINUTES * 60 * 1000);
      await usuario.save();
      enviarMailRecuperacion(usuario.email, usuario.firstName || 'usuario/a', raw, PASSWORD_RESET_MINUTES);
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
    const usuario = await User.findOne({
      where: { passwordResetToken: hashearToken(req.body.token), passwordResetExpires: { [Op.gt]: new Date() } },
    });
    if (!usuario) {
      return res.status(400).json({ exito: false, mensaje: 'El link de recuperación es inválido o expiró' });
    }

    usuario.password = await bcrypt.hash(req.body.password, BCRYPT_ROUNDS);
    usuario.passwordResetToken = null;
    usuario.passwordResetExpires = null;
    usuario.isEmailVerified = true; // si pudo abrir el link, el email es suyo
    usuario.tokenVersion += 1; // cierra todas las sesiones
    await usuario.save();

    enviarMailPasswordCambiada(usuario.email, usuario.firstName || 'usuario/a');
    res.status(200).json({ exito: true, mensaje: 'Contraseña restablecida. Ya podés iniciar sesión' });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// PATCH /api/auth/change-password  { currentPassword, newPassword, confirmPassword }
export const changePassword = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.user.id);
    if (!(await bcrypt.compare(req.body.currentPassword, usuario.password))) {
      return res.status(400).json({ exito: false, mensaje: 'La contraseña actual es incorrecta' });
    }

    usuario.password = await bcrypt.hash(req.body.newPassword, BCRYPT_ROUNDS);
    usuario.tokenVersion += 1;
    await usuario.save();

    enviarMailPasswordCambiada(usuario.email, usuario.firstName || 'usuario/a');
    // Devolvemos tokens nuevos para que esta sesión siga activa
    res.status(200).json({
      exito: true,
      mensaje: 'Contraseña actualizada',
      data: { usuario: datosPublicosUsuario(usuario), ...generarTokensAuth(usuario) },
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};
