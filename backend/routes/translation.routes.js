// routes/translation.routes.js
import { Router } from "express";
import { crearTraduccion } from "../controllers/translation.controllers.js";
import { crearTraduccionRules } from "../middlewares/validator/translation.validator.js";
import { uploadAudio } from "../middlewares/uploadAudio.js";

// AJUSTAR (4): nombres reales de tu repo
import authMiddleware from "../middlewares/authMiddleware.js";
import validarResultado from "../middlewares/validator/validarResultado.js";

const router = Router();

// POST /api/materials/:id/translations
// ORDEN IMPORTANTE: multer (uploadAudio) va ANTES del validador, porque parsea el
// multipart y llena req.body y req.file. Si el validador corre antes, req.body viene vacío.
router.post(
  "/:id/translations",
  authMiddleware,
  uploadAudio.single("audio"),
  crearTraduccionRules,
  validarResultado,
  crearTraduccion
);

export default router;