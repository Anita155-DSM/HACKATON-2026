// Glosario comunitario: semilla local + términos del servidor (GET /api/glossary) + los propuestos
// o revisados en este dispositivo. El backend todavía no tiene POST /api/glossary, así que lo que se
// guarda acá queda solo en el dispositivo.
import { SEED_GLOSSARY } from '../data/glossary.js';
import { glossary as glossaryApi } from './api.js';
import { load, save } from './storage.js';

const KEY = 'glosario';
// Última copia del glosario del servidor, por lengua, para usarlo sin conexión
const SERVER_KEY = 'glosario-servidor';

const mismoTermino = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

const desdeServidor = (t) => ({
  id: `servidor-${t.id}`,
  es: t.es,
  wichi: t.term,
  variante: t.note || '',
  fuente: t.source || '',
  estado: 'propuesto',
  lengua: t.language,
});

// Trae el glosario del servidor y lo guarda. Sin servidor, sigue con la última copia guardada.
export async function syncGlossary(lengua = 'wichi') {
  try {
    const terminos = await glossaryApi.list(lengua);
    save(SERVER_KEY, { ...load(SERVER_KEY, {}), [lengua]: terminos });
  } catch {
    /* sin conexión o sin servidor */
  }
  return getGlossary(lengua);
}

export function getGlossary(lengua = 'wichi') {
  const local = load(KEY, {});
  const servidor = (load(SERVER_KEY, {})[lengua] || []).map(desdeServidor);
  // El servidor completa los términos de la semilla (mismo término en castellano) y suma los que faltan
  const base = SEED_GLOSSARY.map((t) => {
    const s = servidor.find((x) => mismoTermino(x.es, t.es));
    return s ? { ...t, ...s, id: t.id, tema: t.tema } : t;
  });
  servidor.filter((s) => !SEED_GLOSSARY.some((t) => mismoTermino(t.es, s.es))).forEach((s) => base.push(s));
  const ids = new Set(base.map((t) => t.id));
  const merged = base.map((t) => ({ ...t, ...local[t.id] }));
  const extra = Object.values(local).filter((t) => !ids.has(t.id));
  return [...merged, ...extra].filter((t) => t.lengua === lengua).sort((a, b) => a.es.localeCompare(b.es));
}

export function saveTerm(term) {
  const local = load(KEY, {});
  const id = term.id || `local-${Date.now()}`;
  const existing = getGlossary(term.lengua || 'wichi').find(
    (t) => t.id !== id && t.es.toLowerCase() === term.es.trim().toLowerCase() && !t.wichi,
  );
  // Si el término en castellano ya estaba vacío en el glosario, lo completamos en vez de duplicarlo
  const targetId = existing ? existing.id : id;
  local[targetId] = { ...(local[targetId] || {}), ...term, id: targetId, es: term.es.trim(), lengua: term.lengua || 'wichi' };
  save(KEY, local);
  return local[targetId];
}

// Encuentra los términos del glosario que aparecen en un texto
export function termsInText(text, glossary) {
  const lower = text.toLowerCase();
  return glossary.filter((t) => new RegExp(`(^|[^\\p{L}])${escape(t.es.toLowerCase())}(s|es)?([^\\p{L}]|$)`, 'u').test(lower));
}

function escape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Marca los términos del glosario dentro del texto: devuelve piezas { text, term? }
export function markTerms(text, terms) {
  if (!terms.length) return [{ text }];
  const pattern = new RegExp(
    `(${terms
      .map((t) => escape(t.es))
      .sort((a, b) => b.length - a.length)
      .join('|')})(s|es)?(?![\\p{L}])`,
    'giu',
  );
  const pieces = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const before = text[match.index - 1];
    if (before && /\p{L}/u.test(before)) continue;
    if (match.index > last) pieces.push({ text: text.slice(last, match.index) });
    const term = terms.find((t) => t.es.toLowerCase() === match[1].toLowerCase());
    pieces.push({ text: match[0], term });
    last = match.index + match[0].length;
  }
  if (last < text.length) pieces.push({ text: text.slice(last) });
  return pieces;
}

export function exportGlossary() {
  const data = JSON.stringify(getGlossary('wichi'), null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  a.download = 'glosario-wichi.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
