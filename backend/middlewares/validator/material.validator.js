import { body, param, query } from 'express-validator';
import { validarResultado } from './validarResultado.js';

const camposOpcionales = [
  body('level').optional({ values: 'falsy' }).isIn(['primaria', 'secundaria']).withMessage('Nivel inválido'),
  body('grade').optional({ values: 'falsy' }).isInt({ min: 1, max: 7 }).withMessage('Grado entre 1 y 7').toInt(),
  body('subject').optional().trim().isLength({ max: 80 }),
  body('license').optional().trim().isLength({ max: 120 }),
  body('source').optional().trim().isLength({ max: 300 }),
  body('author').optional().trim().isLength({ max: 160 }),
  body('visibility').optional().isIn(['curso', 'publico']).withMessage('Visibilidad inválida'),
];

const idValido = param('id').isUUID().withMessage('Id de material inválido');

export const validarCrearMaterial = [
  body('title').trim().notEmpty().withMessage('El título es obligatorio').isLength({ max: 200 }),
  body('courseId').optional({ values: 'falsy' }).isUUID().withMessage('Curso inválido'),
  body('text')
    .optional()
    .isString()
    .isLength({ max: 50000 })
    .withMessage('El texto es demasiado largo (máximo 50.000 caracteres)'),
  body().custom((_, { req }) => {
    if (!req.file && !req.body.text?.trim()) {
      throw new Error('Subí un PDF o pegá el texto del material');
    }
    return true;
  }),
  ...camposOpcionales,
  validarResultado,
];

export const validarIdMaterial = [idValido, validarResultado];

export const validarActualizarMaterial = [
  idValido,
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('easyReadText').optional().isString().isLength({ max: 50000 }),
  ...camposOpcionales,
  validarResultado,
];

export const validarListarPublicos = [
  query('level').optional().isIn(['primaria', 'secundaria']),
  query('grade').optional().isInt({ min: 1, max: 7 }).toInt(),
  query('subject').optional().trim().isLength({ max: 80 }),
  query('q').optional().trim().isLength({ max: 100 }),
  validarResultado,
];
