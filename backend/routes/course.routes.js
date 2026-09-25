import { Router } from "express";
import {
  crearCurso,
  misCursos,
  cursoPorCodigo,
} from "../controllers/course.controller.js";
import { crearCursoRules } from "../middlewares/validator/course.validator.js";

// AJUSTAR (4): usá los nombres reales de tu repo para estos tres middlewares.
// - authMiddleware: protege rutas de docente (attach req.user)
// - validarResultado: corta si express-validator encontró errores
// - un rate limiter para la ruta pública (ya hay algo en middlewares/rateLimiters.js)
import authMiddleware from "../middlewares/authMiddleware.js";
import validarResultado from "../middlewares/validator/validarResultado.js";
import { publicLimiter } from "../middlewares/rateLimiters.js";

const router = Router();

// Crear curso (docente)
router.post("/", authMiddleware, crearCursoRules, validarResultado, crearCurso);

// Mis cursos (docente)
router.get("/mine", authMiddleware, misCursos);

// Buscar curso por código (público, con rate-limit por fuerza bruta)
router.get("/code/:code", publicLimiter, cursoPorCodigo);

export default router;