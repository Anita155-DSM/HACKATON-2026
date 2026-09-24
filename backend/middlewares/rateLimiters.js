import rateLimit from 'express-rate-limit';

const build = (windowMinutes, limit, mensaje) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test' || process.env.DISABLE_RATE_LIMIT === 'true',
    message: { exito: false, mensaje },
  });

// General para toda la API
export const apiLimiter = build(15, 500, 'Demasiadas solicitudes, intentá más tarde');
// Login / register
export const authLimiter = build(15, 20, 'Demasiados intentos, esperá unos minutos');
// Envío de emails (recuperación, reenvío de verificación)
export const emailLimiter = build(15, 5, 'Demasiadas solicitudes de email, esperá unos minutos');
