import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middlewares/authMiddleware.js';
import {
  crearMaterial,
  obtenerMaterial,
  listarPublicos,
  actualizarMaterial,
  regenerarLecturaFacil,
  transcribirMaterial,
  sugerenciasGlosario,
  eliminarMaterial,
} from '../controllers/material.controllers.js';
import {
  validarCrearMaterial,
  validarIdMaterial,
  validarActualizarMaterial,
  validarListarPublicos,
} from '../middlewares/validator/material.validator.js';

const router = Router();

const MAX_MB = 10;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_MB * 1024 * 1024, files: 1 },
  fileFilter(_req, file, cb) {
    const ok = ['application/pdf', 'text/plain'].includes(file.mimetype);
    cb(ok ? null : new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname), ok);
  },
});

// Convierte los errores de multer al envelope { exito, mensaje, data }
const subirArchivo = (req, res, next) =>
  upload.single('archivo')(req, res, (err) => {
    if (!err) return next();
    const mensaje =
      err.code === 'LIMIT_FILE_SIZE'
        ? `El archivo supera los ${MAX_MB} MB`
        : 'Solo se acepta un archivo PDF o de texto en el campo "archivo"';
    return res.status(400).json({ exito: false, mensaje, data: null });
  });

// Protege la key del LLM de abusos
const limiteLLM = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skip: () => process.env.DISABLE_RATE_LIMIT === 'true',
  standardHeaders: true,
  legacyHeaders: false,
  message: { exito: false, mensaje: 'Demasiadas solicitudes. Probá en unos minutos.', data: null },
});

// Públicas (el alumno no tiene cuenta)
router.get('/', validarListarPublicos, listarPublicos);
router.get('/:id', validarIdMaterial, obtenerMaterial);

// Docente logueado
router.post('/', authenticate, limiteLLM, subirArchivo, validarCrearMaterial, crearMaterial);
router.patch('/:id', authenticate, validarActualizarMaterial, actualizarMaterial);
router.post('/:id/lectura-facil', authenticate, limiteLLM, validarIdMaterial, regenerarLecturaFacil);
router.post('/:id/transcribir', authenticate, limiteLLM, validarIdMaterial, transcribirMaterial);
router.get('/:id/glosario', authenticate, limiteLLM, validarIdMaterial, sugerenciasGlosario);
router.delete('/:id', authenticate, validarIdMaterial, eliminarMaterial);

export default router;
