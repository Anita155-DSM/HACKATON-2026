// Glosario comunitario. Se arma con tres cosas:
//   1. la semilla de data/glossary.js (los términos que el documento pide citar),
//   2. lo que se propone o completa en este dispositivo (localStorage),
//   3. los términos que ya están en el servidor (GET /api/glossary), que se mezclan
//      con mergeRemote: completan un término vacío o se suman como nuevos.
// Guardar sigue siendo local: el backend todavía no tiene POST /api/glossary.
import { SEED_GLOSSARY } from '../data/glossary.js';
import { load, save } from './storage.js';

const KEY = 'glosario';

export function getGlossary(lengua = 'wichi') {
  const local = load(KEY, {});
  const merged = SEED_GLOSSARY.map((t) => ({ ...t, ...local[t.id] }));
  const extra = Object.values(local).filter((t) => !t.id.startsWith('semilla-'));
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

// Un término del servidor con la forma que usan las pantallas.
// Estado "citado": sale de un diccionario con fuente, no de una revisión de la comunidad.
export const mapRemote = (t) => ({
  id: `api-${t.id}`,
  es: t.es,
  wichi: t.term || '',
  variante: t.note || '',
  fuente: t.source || 'Glosario del servidor',
  tema: 'Del servidor',
  lengua: t.language || 'wichi',
  estado: 'citado',
});

// Mezcla lo del servidor con lo del dispositivo. Lo local manda: si alguien ya completó
// un término acá, no se pisa; si estaba vacío, se completa con el del servidor.
export function mergeRemote(locales, remotos = []) {
  const clave = (t) => t.es.trim().toLowerCase();
  const porClave = new Map(locales.map((t) => [clave(t), t]));
  const extra = [];
  for (const r of remotos.map(mapRemote)) {
    const local = porClave.get(clave(r));
    if (!local) {
      extra.push(r);
      continue;
    }
    if (!local.wichi) {
      porClave.set(clave(r), { ...local, wichi: r.wichi, variante: local.variante || r.variante, fuente: local.fuente || r.fuente, estado: 'citado' });
    }
  }
  return [...porClave.values(), ...extra].sort((a, b) => a.es.localeCompare(b.es));
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
