// Todo lo que se puede hacer en la plataforma, en un solo lugar.
// Lo usan el menú del navbar, la sección "Entrar a la plataforma" y el pie de la portada,
// así los tres siempre muestran lo mismo.
import { Books, BookOpenText, ChalkboardTeacher, Student, Translate, Wheelchair } from '@phosphor-icons/react';

export const PLATFORM_LINKS = [
  {
    to: '/alumno',
    icon: Student,
    label: 'Soy alumno',
    desc: 'Entrá con el código de tu curso y abrí tus materiales.',
  },
  {
    to: '/docente',
    icon: ChalkboardTeacher,
    label: 'Soy profe o maestro',
    desc: 'Creá un curso, subí un material y se arman las versiones accesibles.',
  },
  {
    to: '/biblioteca',
    icon: Books,
    label: 'Biblioteca pública',
    desc: 'Materiales de primaria y secundaria, abiertos y sin código.',
  },
  {
    to: '/traducir',
    icon: Translate,
    label: 'Quiero traducir',
    desc: 'Traducí al wichí, grabá el audio y sumá términos al glosario.',
  },
  {
    to: '/glosario',
    icon: BookOpenText,
    label: 'Glosario wichí',
    desc: 'Los términos que la comunidad propone y revisa, con su fuente.',
  },
  {
    to: '/accesibilidad',
    icon: Wheelchair,
    label: 'Accesibilidad',
    desc: 'Qué cumple la plataforma y cómo avisarnos si algo no se puede usar.',
  },
];

// Anclas de la portada, para el navbar
export const SECTION_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#problematica', label: 'La problemática' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#accesibilidad', label: 'Para quién' },
  { href: '#plataforma', label: 'La plataforma' },
  { href: '#preguntas', label: 'Preguntas' },
];
