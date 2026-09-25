import axios from "axios";
import { useAuth } from "../hooks/useAuth.js"; // Importamos tu store de Zustand

const clienteAxios = axios.create({
  // Mantené la URL que ya venías usando para tu backend
  baseURL: import.meta.env.VITE_API_URL
});

// 1. INTERCEPTOR DE PETICIONES (Lo que enviamos al backend)
clienteAxios.interceptors.request.use(
  (config) => {
    // Buscamos el token fresco justo antes de que la petición salga
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Se lo inyectamos a los headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. INTERCEPTOR DE RESPUESTAS (Lo que el backend nos devuelve)
clienteAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el backend rechaza la petición por falta de permisos (401)
    if (error.response?.status === 401) {
      console.warn("Sesión expirada o token inválido detectado por Axios.");

      // ¡La magia de Zustand! Ejecutamos tu función de limpieza global desde afuera de React
      useAuth.getState().logout();

      // Redirigimos al usuario al login si no está ya ahí
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default clienteAxios;