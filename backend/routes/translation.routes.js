// routes/translation.routes.js
// Se monta en app.js como app.use('/api/materials', translationRoutes)
// → POST /api/materials/:id/translations
import { Router } from "express";
import { crearTraduccion } from "../controllers/translation.controller.js";
import { crearTraduccionRules } from "../middlewares/validator/translation.validator.js";
import { uploadAudio } from "../middlewares/uploadAudio.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { validarResultado } from "../middlewares/validator/validarResultado.js";

const router = Router();

// ORDEN IMPORTANTE: multer (uploadAudio) va ANTES del validador, porque parsea el
// multipart y llena req.body y req.file. Si el validador corre antes, req.body viene vacío.
router.post(
  "/:id/translations",
  authenticate,
  uploadAudio.single("audio"),
  crearTraduccionRules,
  validarResultado,
  crearTraduccion
);

export default router;
