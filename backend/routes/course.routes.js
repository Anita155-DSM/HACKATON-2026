import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  crearCurso,
  misCursos,
  cursoPorCodigo,
} from "../controllers/course.controller.js";
import { crearCursoRules } from "../middlewares/validator/course.validator.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { validarResultado } from "../middlewares/validator/validarResultado.js";

const router = Router();

// Frena a quien pruebe códigos de 4 dígitos al azar (10.000 combinaciones)
const limiteCodigo = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  skip: () => process.env.DISABLE_RATE_LIMIT === "true",
  standardHeaders: true,
  legacyHeaders: false,
  message: { exito: false, mensaje: "Demasiados intentos. Probá en unos minutos.", data: null },
});

// Crear curso (docente)
router.post("/", authenticate, crearCursoRules, validarResultado, crearCurso);

// Mis cursos (docente)
router.get("/mine", authenticate, misCursos);

// Buscar curso por código (público, con límite contra fuerza bruta)
router.get("/code/:code", limiteCodigo, cursoPorCodigo);

export default router;
