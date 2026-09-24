import { body } from 'express-validator';

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/;

export const emailRule = (field = 'email') =>
  body(field)
    .exists({ values: 'falsy' }).withMessage('El email es obligatorio').bail()
    .isString().withMessage('El email debe ser texto').bail()
    .trim()
    .isEmail().withMessage('El email no es válido').bail()
    .isLength({ max: 120 }).withMessage('El email no puede superar los 120 caracteres')
    .toLowerCase();

export const passwordRule = (field = 'password', label = 'La contraseña') =>
  body(field)
    .exists({ values: 'falsy' }).withMessage(`${label} es obligatoria`).bail()
    .isString().withMessage(`${label} debe ser texto`).bail()
    .isLength({ min: 8, max: 64 }).withMessage(`${label} debe tener entre 8 y 64 caracteres`).bail()
    .matches(/[a-z]/).withMessage(`${label} debe tener al menos una minúscula`).bail()
    .matches(/[A-Z]/).withMessage(`${label} debe tener al menos una mayúscula`).bail()
    .matches(/\d/).withMessage(`${label} debe tener al menos un número`).bail()
    .not().matches(/\s/).withMessage(`${label} no puede contener espacios`);

export const confirmPasswordRule = (field = 'confirmPassword', target = 'password') =>
  body(field)
    .exists({ values: 'falsy' }).withMessage('Debés confirmar la contraseña').bail()
    .custom((value, { req }) => value === req.body[target]).withMessage('Las contraseñas no coinciden');

export const nameRule = (field, label, { optional = false } = {}) => {
  let chain = body(field);
  if (optional) chain = chain.optional();
  return chain
    .exists({ values: 'falsy' }).withMessage(`${label} es obligatorio`).bail()
    .isString().withMessage(`${label} debe ser texto`).bail()
    .trim()
    .isLength({ min: 2, max: 60 }).withMessage(`${label} debe tener entre 2 y 60 caracteres`).bail()
    .matches(NAME_REGEX).withMessage(`${label} solo puede contener letras`);
};

// Tokens de email: 64 caracteres hexadecimales
export const tokenRule = (location, field = 'token') =>
  location(field)
    .exists({ values: 'falsy' }).withMessage('El token es obligatorio').bail()
    .isString().trim()
    .isHexadecimal().withMessage('Token inválido').bail()
    .isLength({ min: 64, max: 64 }).withMessage('Token inválido');
