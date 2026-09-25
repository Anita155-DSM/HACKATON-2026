import { create } from 'zustand';

// 1. Creamos y exportamos el hook global
export const useThemeStore = create((set) => ({
  // Estado inicial (lee de localStorage o usa 'light' por defecto)
  theme: localStorage.getItem('theme') || 'light',
  
  // Función para actualizar el estado global
  setTheme: (newTheme) => {
    localStorage.setItem('theme', newTheme);
    
    // Aplicamos la clase al HTML directamente desde aquí
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Actualizamos el estado de Zustand
    set({ theme: newTheme });
  }
}));