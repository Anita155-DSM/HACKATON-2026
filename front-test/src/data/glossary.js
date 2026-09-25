// Glosario semilla. El documento pide de 15 a 20 términos CITADOS.
//
// Los términos en wichí quedan vacíos a propósito: no hay traductores automáticos
// confiables y el vocabulario lo crea o elige la comunidad, no el sistema (sección 8).
// Completar cada "wichi" con el término del diccionario indicado en "fuente",
// anotando la variante. Mientras esté vacío, la app lo muestra como "Sin término todavía".

export const GLOSSARY_SOURCES = [
  {
    id: 'lhamtes',
    label: 'Glosario wichí lhämtes: Las palabras de la gente (Néstor Elio Fernández, 2017)',
    note: 'Ediciones SAIJ / INAI. Libre reproducción citando la fuente. Es el libro que usa la guía del traductor',
    href: 'http://www.saij.gob.ar/',
  },
  {
    id: 'diwica',
    label: 'DIWICA, Diccionario castellano-wichí',
    note: 'Autoría colectiva y construcción permanente',
  },
  { id: 'inai', label: 'Glosario wichí lhämtes, INAI' },
  { id: 'lunt', label: 'Diccionario de la lengua wichí, Roberto Lunt' },
  {
    id: 'braunstein',
    label: 'Vocabulario wichí-español, Pueblos Originarios',
    note: 'Basado en trabajos de José Braunstein sobre una variante oriental',
  },
];

const t = (es, tema) => ({ es, wichi: '', variante: '', fuente: '', tema, estado: 'por-completar' });

export const SEED_GLOSSARY = [
  t('agua', 'Naturaleza'),
  t('sol', 'Naturaleza'),
  t('tierra', 'Naturaleza'),
  t('monte', 'Naturaleza'),
  t('árbol', 'Naturaleza'),
  t('hoja', 'Naturaleza'),
  t('raíz', 'Naturaleza'),
  t('lluvia', 'Naturaleza'),
  t('río', 'Naturaleza'),
  t('aire', 'Naturaleza'),
  t('planta', 'Naturaleza'),
  t('animal', 'Naturaleza'),
  t('alimento', 'Vida diaria'),
  t('escuela', 'Escuela'),
  t('maestro', 'Escuela'),
  t('aprender', 'Escuela'),
  t('número', 'Escuela'),
  t('parte', 'Escuela'),
].map((term, i) => ({ id: `semilla-${i + 1}`, lengua: 'wichi', ...term }));
