import { body, query } from 'express-validator';
import { emailRule, passwordRule, confirmPasswordRule, nameRule, tokenRule } from './common.rules.js';
import { validarResultado } from './validarResultado.js';

export const register = [
  nameRule('firstName', 'El nombre'),
  nameRule('lastName', 'El apellido'),
  emailRule(),
  passwordRule(),
  confirmPasswordRule(),
  validarResultado,
];

export const login = [
  emailRule(),
  body('password').exists({ values: 'falsy' }).withMessage('La contraseña es obligatoria').bail()
    .isString().withMessage('La contraseña debe ser texto'),
  validarResultado,
];

export const refresh = [
  body('refreshToken').exists({ values: 'falsy' }).withMessage('El refreshToken es obligatorio').bail()
    .isJWT().withMessage('refreshToken inválido'),
  validarResultado,
];

export const verifyEmailBody = [tokenRule(body), validarResultado]; // POST { token }
export const verifyEmailQuery = [tokenRule(query), validarResultado]; // GET ?token=...

export const emailOnly = [emailRule(), validarResultado];

export const resetPassword = [tokenRule(body), passwordRule(), confirmPasswordRule(), validarResultado];

export const changePassword = [
  body('currentPassword').exists({ values: 'falsy' }).withMessage('La contraseña actual es obligatoria'),
  passwordRule('newPassword', 'La nueva contraseña'),
  body('newPassword').custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('La nueva contraseña debe ser distinta a la actual'),
  confirmPasswordRule('confirmPassword', 'newPassword'),
  validarResultado,
];

export const resendVerification = emailOnly;
export const forgotPassword = emailOnly;
