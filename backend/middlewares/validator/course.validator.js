import { body } from "express-validator";

export const crearCursoRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre del curso es obligatorio")
    .isLength({ max: 120 })
    .withMessage("El nombre es demasiado largo"),
  body("level")
    .optional()
    .trim()
    .isIn(["primaria", "secundaria"])
    .withMessage("El nivel debe ser 'primaria' o 'secundaria'"),
  body("year")
    .optional()
    .isInt({ min: 1, max: 7 })
    .withMessage("El año debe ser un número entre 1 y 7"),
  body("subject")
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage("La materia es demasiado larga"),
];