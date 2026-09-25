import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // 1. Estado inicial: intentamos recuperar los datos guardados
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,

  // 2. Acción para iniciar sesión
  login: (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', token);
    set({ user: userData, accessToken: token });
  },

  // 3. Acción para cerrar sesión
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null });
  }
}));