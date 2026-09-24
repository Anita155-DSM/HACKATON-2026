import MockAdapter from 'axios-mock-adapter';
import clienteAxios from '../config/axios';

// Retraso de 1.5 segundos para simular latencia de red
const mock = new MockAdapter(clienteAxios, { delayResponse: 500 });

// 1. Mock para Login (POST a /auth/login)
mock.onPost('/auth/login').reply((config) => {
  const { email, password } = JSON.parse(config.data);

  if (email === "eri@mail.com" && password === "123456") {
    return [200, {
      token: "mock-jwt-token-123456789",
      user: { id: 1, nombre: "Eri", rol: "admin", email: "eri@mail.com" }
    }];
  }

  return [401, { mensaje: "Credenciales incorrectas" }];
});

// 2. Mock para validar sesión/token (GET a /auth/me)
mock.onGet('/auth/me').reply((config) => {
  // Axios suele pasar las cabeceras a minúsculas internamente
  const tokenHeader = config.headers?.Authorization || config.headers?.authorization;

  if (tokenHeader === "Bearer mock-jwt-token-123456789") {
    return [200, { id: 1, nombre: "Eri", rol: "admin", email: "eri@mail.com" }];
  }

  // Si no hay token o es incorrecto, cerramos la sesión
  return [401, { mensaje: "Token inválido o expirado" }];
});

// 3. Mocks de Usuarios
mock.onGet('/users').reply(200, [
  { id: 1, nombre: "Juan Pérez", email: "juan@mail.com", rol: "Administrador" },
  { id: 2, nombre: "Ana Gómez", email: "ana@mail.com", rol: "Usuario" }
]);

mock.onPost('/users').reply(200, { mensaje: "Usuario creado con éxito" });
// Mock para simular la actualización de un usuario (PUT a /users/:id)
mock.onPut(/\/users\/\d+/).reply(200, { mensaje: "Usuario actualizado con éxito" });
// Mock para simular la eliminación de un usuario (DELETE a /users/:id)
mock.onDelete(/\/users\/\d+/).reply(200, { mensaje: "Usuario eliminado con éxito" });

export default mock;