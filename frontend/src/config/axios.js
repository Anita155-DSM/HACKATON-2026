import axios from 'axios';

// 1. Creamos la instancia base
const clienteAxios = axios.create({
  // Vite usa import.meta.env para las variables de entorno. 
  // Si no existe, usamos localhost por defecto.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

// 2. Interceptor de PETICIÓN (Request)
// Se ejecuta siempre ANTES de que la petición salga hacia el backend
clienteAxios.interceptors.request.use(
  (config) => {
    // Buscamos el token en el almacenamiento del navegador
    const token = localStorage.getItem('token');
    
    // Si hay token, se lo inyectamos a los Headers en formato Bearer
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de RESPUESTA (Response)
// Se ejecuta cuando el backend nos contesta, ANTES de que llegue a tus componentes
clienteAxios.interceptors.response.use(
  (response) => {
    // Si todo salió bien (código 200), dejamos pasar la respuesta tal cual
    return response;
  },
  (error) => {
    // Si el backend nos responde con un error 401 (No Autorizado) o 403 (Prohibido)
    // Significa que el token venció o es inválido.
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("Sesión expirada o token inválido.");
      
      // Borramos el token corrupto/vencido
      localStorage.removeItem('token');
      
      // Redirigimos al user al login forzosamente
      // Usamos window.location porque estamos fuera del contexto de react-router-dom
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default clienteAxios;