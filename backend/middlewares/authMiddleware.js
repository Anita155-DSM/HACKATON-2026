import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret_cambiar';

// Campos que nunca deben salir en una respuesta
const SENSITIVE_FIELDS = [
  'password',
  'emailVerificationToken',
  'emailVerificationExpires',
  'passwordResetToken',
  'passwordResetExpires',
  'tokenVersion',
];

// Requiere header: Authorization: Bearer <accessToken>
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ exito: false, mensaje: 'Token de acceso no provisto' });
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (error) {
    return res.status(401).json({
      exito: false,
      mensaje: error.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido',
    });
  }

  try {
    const user = await User.findByPk(payload.sub);
    if (!user) return res.status(401).json({ exito: false, mensaje: 'Usuario no encontrado' });
    if (!user.isActive) return res.status(403).json({ exito: false, mensaje: 'La cuenta está desactivada' });
    if (user.tokenVersion !== payload.tv) {
      return res.status(401).json({ exito: false, mensaje: 'Sesión expirada, iniciá sesión nuevamente' });
    }

    const datosUsuario = user.get({ plain: true });
    SENSITIVE_FIELDS.forEach((campo) => delete datosUsuario[campo]);
    req.user = datosUsuario;
    next();
  } catch (error) {
    console.error('Error en authenticate:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno al verificar la sesión' });
  }
};

// Exige email verificado para rutas puntuales
export const requireVerifiedEmail = (req, res, next) => {
  if (!req.user?.isEmailVerified) {
    return res.status(403).json({ exito: false, mensaje: 'Debés verificar tu email' });
  }
  next();
};
