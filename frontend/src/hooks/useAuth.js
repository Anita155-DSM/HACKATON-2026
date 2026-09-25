import { create } from 'zustand';

// ¡Acá está la magia! Solo renombramos "useAuthStore" a "useAuth"
export const useAuth = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,

  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,

  login: (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', token);

    set({
      user: userData,
      accessToken: token,
      isAuthenticated: true
    });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false
    });
  }
}));