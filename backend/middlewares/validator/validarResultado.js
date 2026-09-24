import { validationResult } from 'express-validator';

// Middleware genérico que revisa si express-validator atrapó algún error.
// Se agrega como último elemento de cada array de reglas (ver auth.validator.js y user.validator.js).
export const validarResultado = (req, res, next) => {
  const errores = validationResult(req);
  if (errores.isEmpty()) return next();

  // Un solo mensaje por campo (el primero que falló)
  const vistos = new Set();
  const listaErrores = errores
    .array()
    .filter((e) => {
      const key = e.path || '_';
      if (vistos.has(key)) return false;
      vistos.add(key);
      return true;
    })
    .map((e) => ({ campo: e.path || null, mensaje: e.msg }));

  return res.status(422).json({ exito: false, mensaje: 'Error de validación en los datos enviados.', errores: listaErrores });
};
