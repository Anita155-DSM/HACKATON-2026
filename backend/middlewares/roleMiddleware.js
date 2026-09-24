// Uso: router.get('/ruta', authenticate, authorize('admin'), controlador)
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ exito: false, mensaje: 'No autorizado' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ exito: false, mensaje: 'No tenés permisos para realizar esta acción' });
  }
  next();
};
