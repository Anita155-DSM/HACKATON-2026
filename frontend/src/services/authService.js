import clienteAxios from '../config/axios';

export const loginService = async (email, password) => {
  const respuesta = await clienteAxios.post('/auth/login', { email, password });
  return respuesta.data;
};

export const validarTokenService = async () => {
  // Axios inyectará el token automáticamente gracias al interceptor
  const respuesta = await clienteAxios.get('/auth/me');
  return respuesta.data;
};