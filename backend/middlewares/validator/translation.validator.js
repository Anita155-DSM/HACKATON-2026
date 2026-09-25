import { body } from "express-validator";

export const crearTraduccionRules = [
  body("language")
    .trim()
    .notEmpty()
    .withMessage("La lengua es obligatoria"),
  body("text")
    .optional()
    .trim(),
  body("author")
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage("El autor es demasiado largo"),
  body("validated")
    .optional()
    .isBoolean()
    .withMessage("validated debe ser true o false"),
];