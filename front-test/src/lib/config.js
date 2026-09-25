// Nombre provisorio: el documento base todavía tiene pendiente "Definir el nombre del proyecto".
// Cambiarlo acá lo cambia en toda la app (también revisar index.html y manifest.webmanifest).
export const APP_NAME = 'Puente';

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

// Origen del backend, para armar URLs de archivos como /uploads/audios/tr-1.webm
export const API_ORIGIN = API_URL.replace(/\/api$/, '');

// true = trabaja siempre con datos de ejemplo, sin intentar usar el backend
export const DEMO_FORCED = import.meta.env.VITE_DEMO === 'true';

// Etiqueta de idioma para el texto en wichí (WCAG 3.1.2).
// ISO 639-3: mzh (wichí lhamtés güisnay), wlv (vejoz), mtp (nocten).
// Confirmar con la comunidad qué variante usan los materiales.
export const WICHI_LANG_TAG = 'mzh';

export const REPO_URL = 'https://github.com/Anita155-DSM/HACKATON-2026';

export const LEVELS = [
  { value: 'primaria', label: 'Primaria', grades: 7 },
  { value: 'secundaria', label: 'Secundaria', grades: 6 },
];

export const SUBJECTS = [
  'Lengua',
  'Matemática',
  'Ciencias Naturales',
  'Ciencias Sociales',
  'Biología',
  'Historia',
  'Geografía',
  'Física',
  'Química',
  'Formación Ética y Ciudadana',
];

export const LANGUAGES = [
  { value: 'wichi', label: 'Wichí', available: true },
  { value: 'qom', label: 'Qom', available: false },
  { value: 'pilaga', label: 'Pilagá', available: false },
];

export const gradeLabel = (level, grade) => {
  if (!grade) return '';
  return level === 'primaria' ? `${grade}.º grado` : `${grade}.º año`;
};

export const levelLabel = (level) => LEVELS.find((l) => l.value === level)?.label || '';
