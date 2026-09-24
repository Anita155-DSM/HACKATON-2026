import clienteAxios from '../config/axios';

export const loginService = async (email, password) => {
  const respuesta = await clienteAxios.post('/auth/login', { email, password });
  return respuesta.data;
};

export const validarTokenService = async () => {
  const { data } = await clienteAxios.get('/auth/me');

  // El backend real devuelve: { exito: true, data: { user: { id, nombre, email, rol, ... } } }
  return data.data.user;
};