import { usePreferences } from '../context/PreferencesContext.jsx';

// Textos de la interfaz. La columna "wichi" está vacía a propósito:
// la traducción la tiene que hacer o validar una persona de la comunidad (sección 8).
// Mientras un texto no tenga traducción, se muestra en castellano y la app lo avisa.
// Para agregar una: completar el valor en `wichi` con la clave correspondiente.

const es = {
  'nav.biblioteca': 'Biblioteca',
  'nav.traducir': 'Quiero traducir',
  'nav.docentes': 'Soy profe o maestro',
  'nav.misMateriales': 'Mis materiales',
  'header.escuchar': 'Escuchar esta página',
  'header.detener': 'Dejar de escuchar',
  'header.preferencias': 'Preferencias',
  'hero.titulo': 'Materiales escolares para que todos puedan aprender, en su forma y en su lengua',
  'hero.bajada': 'Texto claro, audio, lectura fácil y wichí. En el celular y también sin internet.',
  'hero.alumno': 'Soy alumno',
  'hero.docente': 'Soy profe o maestro',
  'hero.explorar': 'Explorar materiales',
};

const wichi = {
  // 'hero.titulo': '',
};

export const DICTS = { es, wichi };

export function useT() {
  const { prefs } = usePreferences();
  const lang = prefs.uiLang;
  const t = (key) => (lang === 'wichi' && wichi[key]) || es[key] || key;
  const missing = lang === 'wichi' && Object.keys(es).some((k) => !wichi[k]);
  return { t, lang, missing };
}
