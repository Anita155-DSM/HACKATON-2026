import { Op } from 'sequelize';
import { User } from '../models/user.models.js';

const datosPublicosUsuario = (usuario) => ({
  id: usuario.id,
  firstName: usuario.firstName,
  lastName: usuario.lastName,
  email: usuario.email,
  role: usuario.role,
  isActive: usuario.isActive,
  isEmailVerified: usuario.isEmailVerified,
  lastLoginAt: usuario.lastLoginAt,
  createdAt: usuario.createdAt,
});

const ensureNotSelf = (req, res) => {
  if (String(req.params.id) === String(req.user.id)) {
    res.status(400).json({ exito: false, mensaje: 'No podés realizar esta acción sobre tu propia cuenta' });
    return true;
  }
  return false;
};

// PATCH /api/users/me
export const updateMe = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.user.id);
    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });

    ['firstName', 'lastName'].forEach((campo) => {
      if (req.body[campo] !== undefined) usuario[campo] = req.body[campo];
    });
    await usuario.save();

    res.status(200).json({ exito: true, mensaje: 'Perfil actualizado', data: { usuario: datosPublicosUsuario(usuario) } });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/users?page=1&limit=10&search=juan&role=user   (admin)
export const list = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const { search, role } = req.query;

    const where = {};
    if (role) where.role = role;
    if (search) {
      const like = { [Op.iLike]: `%${search}%` };
      where[Op.or] = [{ firstName: like }, { lastName: like }, { email: like }];
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit,
    });

    res.status(200).json({
      exito: true,
      data: {
        items: rows.map(datosPublicosUsuario),
        pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
      },
    });
  } catch (error) {
    console.error('Error al listar usuarios:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/users/:id   (admin)
export const getById = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
    res.status(200).json({ exito: true, data: { usuario: datosPublicosUsuario(usuario) } });
  } catch (error) {
    console.error('Error al obtener usuario:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// PATCH /api/users/:id/role   (admin)
export const updateRole = async (req, res) => {
  try {
    if (ensureNotSelf(req, res)) return;

    const usuario = await User.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });

    usuario.role = req.body.role;
    await usuario.save();

    res.status(200).json({ exito: true, mensaje: 'Rol actualizado', data: { usuario: datosPublicosUsuario(usuario) } });
  } catch (error) {
    console.error('Error al actualizar rol:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// PATCH /api/users/:id/status   (admin)
export const updateStatus = async (req, res) => {
  try {
    if (ensureNotSelf(req, res)) return;

    const usuario = await User.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });

    usuario.isActive = req.body.isActive;
    if (!req.body.isActive) usuario.tokenVersion += 1; // lo desloguea
    await usuario.save();

    res.status(200).json({
      exito: true,
      mensaje: req.body.isActive ? 'Usuario activado' : 'Usuario desactivado',
      data: { usuario: datosPublicosUsuario(usuario) },
    });
  } catch (error) {
    console.error('Error al actualizar estado del usuario:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};

// DELETE /api/users/:id   (admin)
export const remove = async (req, res) => {
  try {
    if (ensureNotSelf(req, res)) return;

    const eliminado = await User.destroy({ where: { id: req.params.id } });
    if (!eliminado) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });

    res.status(200).json({ exito: true, mensaje: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
};
