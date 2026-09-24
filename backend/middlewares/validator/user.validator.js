import { body, query } from 'express-validator';
import { nameRule } from './common.rules.js';
import { idParam } from './id.validator.js';
import { validarResultado } from './validarResultado.js';

export const updateMe = [
  body().custom((value) => ['firstName', 'lastName'].some((k) => value?.[k] !== undefined))
    .withMessage('Enviá al menos un campo para actualizar (firstName, lastName)'),
  nameRule('firstName', 'El nombre', { optional: true }),
  nameRule('lastName', 'El apellido', { optional: true }),
  validarResultado,
];

export const list = [
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser un entero >= 1').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100').toInt(),
  query('search').optional().isString().trim().isLength({ max: 100 }).withMessage('search es demasiado largo'),
  query('role').optional().isIn(['user', 'admin']).withMessage('role debe ser: user, admin'),
  validarResultado,
];

export const getById = [idParam(), validarResultado];

export const updateRole = [
  idParam(),
  body('role').exists().withMessage('El rol es obligatorio').bail()
    .isIn(['user', 'admin']).withMessage('El rol debe ser: user, admin'),
  validarResultado,
];

export const updateStatus = [
  idParam(),
  body('isActive').exists().withMessage('isActive es obligatorio').bail()
    .isBoolean().withMessage('isActive debe ser true o false').toBoolean(),
  validarResultado,
];

export const remove = getById;
