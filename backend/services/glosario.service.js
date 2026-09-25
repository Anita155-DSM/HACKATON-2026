// Asistente de glosario para el traductor comunitario.
// Claude NUNCA escribe wichí: solo elige las palabras importantes del texto en castellano
// y las lleva a su forma de diccionario. La búsqueda en el glosario la hace este código,
// así todo lo que se muestra en wichí sale del libro, con su página.
import fs from 'node:fs';
import path from 'node:path';
import { hayKey, pedirAClaude } from './claude.client.js';

const RUTA_GLOSARIO = path.resolve('data/glosario-wichi.json');
const MAX_TEXTO = 6000; // caracteres analizados
const MAX_TERMINOS = 40;

const AVISO =
  'Sugerencias del glosario para apoyar al traductor. No es una traducción: cada término ' +
  'puede tener variantes y su uso depende del contexto. Las palabras que no están en el ' +
  'glosario las crea o elige la comunidad.';

const INSTRUCCIONES = `Analizás un texto educativo en castellano para ayudar a un traductor al wichí.
- Elegí las palabras con contenido (sustantivos, verbos y adjetivos) importantes para entender el texto.
- Ignorá artículos, preposiciones, conectores y palabras muy comunes que no aportan al tema.
- Para cada una, da su forma de diccionario: sustantivos en singular, adjetivos en masculino singular, verbos en infinitivo.
- Como máximo ${MAX_TERMINOS} palabras, sin repetir, en el orden en que aparecen.
- No traduzcas nada ni escribas palabras en otra lengua.
Respondé solo con un array JSON, sin texto antes ni después, con este formato:
[{"palabra":"plantas","lema":"planta"},{"palabra":"fabrican","lema":"fabricar"}]`;

// Palabras que no vale la pena buscar cuando no hay Claude (modo básico)
const COMUNES = new Set(
  ('el la los las un una unos unas de del al a en con por para sin sobre entre hasta desde ' +
    'que y o u e ni pero como mas más muy tambien también ya no si sí se su sus es son fue ' +
    'ser esta este esto estos estas ese esa eso lo le les mi tu nos hay cada otro otra otros ' +
    'otras todo toda todos todas cuando donde porque aunque entonces')
    .split(' '),
);

// Minúsculas y sin tildes ni diéresis, pero conserva la ñ ("año" no es "ano").
export const normalizar = (texto = '') =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0301\u0308]/g, '')
    .normalize('NFC')
    .trim();

// "activo/a" se busca como "activo" y como "activa"
function clavesDe(terminoEs) {
  const base = normalizar(terminoEs);
  const m = base.match(/^(.+)([oa])\/([oa])$/);
  return m ? [m[1] + m[2], m[1] + m[3]] : [base];
}

let glosario = null;
function cargarGlosario() {
  if (glosario) return glosario;
  const datos = JSON.parse(fs.readFileSync(RUTA_GLOSARIO, 'utf8'));
  const indice = new Map();
  for (const entrada of datos.entradas) {
    for (const clave of clavesDe(entrada.es)) {
      if (!indice.has(clave)) indice.set(clave, []);
      indice.get(clave).push(entrada);
    }
  }
  glosario = { fuente: datos.fuente, indice };
  return glosario;
}

// Formas posibles en singular: "luces" → "luz", "plantas" → "planta"
function singulares(palabra) {
  const p = normalizar(palabra);
  const opciones = [p];
  if (p.endsWith('ces')) opciones.push(p.slice(0, -3) + 'z');
  if (p.endsWith('es')) opciones.push(p.slice(0, -2));
  if (p.endsWith('s')) opciones.push(p.slice(0, -1));
  return opciones;
}

function buscar(indice, { palabra, lema }) {
  const candidatos = [...singulares(lema), ...singulares(palabra)];
  for (const c of candidatos) {
    if (indice.has(c)) return indice.get(c);
  }
  return [];
}

const entradaPublica = (e) => ({
  es: e.es,
  wichi: e.original, // tal cual figura en el libro
  formas: e.formas,
  nota: e.nota,
  pagina: e.pagina,
});

async function extraerConClaude(texto) {
  const salida = await pedirAClaude({
    system: INSTRUCCIONES,
    content: texto,
    maxTokens: 2000,
    temperature: 0,
  });
  const inicio = salida.indexOf('[');
  const fin = salida.lastIndexOf(']');
  if (inicio === -1 || fin === -1) throw new Error('Claude no devolvió un array JSON');
  const lista = JSON.parse(salida.slice(inicio, fin + 1));
  return lista
    .filter((t) => t && typeof t.palabra === 'string' && typeof t.lema === 'string')
    .slice(0, MAX_TERMINOS);
}

function extraerBasico(texto) {
  const palabras = texto.match(/\p{L}+/gu) || [];
  const unicas = [...new Set(palabras.map((p) => p.toLowerCase()))].filter(
    (p) => p.length >= 3 && !COMUNES.has(normalizar(p)),
  );
  return unicas.map((p) => ({ palabra: p, lema: p }));
}

/**
 * Busca en el glosario las palabras importantes de un texto en castellano.
 * Nunca lanza por culpa de Claude: sin key o si falla, usa un modo básico.
 */
export async function sugerirTerminos(texto) {
  const { fuente, indice } = cargarGlosario();
  const recorte = (texto || '').slice(0, MAX_TEXTO);

  let terminos = null;
  let metodo = 'basico';
  if (hayKey()) {
    try {
      terminos = await extraerConClaude(recorte);
      metodo = 'claude';
    } catch (err) {
      console.warn('[glosario] falló Claude, uso el modo básico:', err.message);
    }
  }
  if (!terminos) terminos = extraerBasico(recorte);

  const vistos = new Set();
  const sugerencias = [];
  const sinEntrada = [];
  for (const termino of terminos) {
    const entradas = buscar(indice, termino);
    const clave = entradas.length ? entradas[0].es : normalizar(termino.lema);
    if (vistos.has(clave)) continue;
    vistos.add(clave);

    if (entradas.length) {
      sugerencias.push({ palabra: termino.palabra, lema: termino.lema, entradas: entradas.map(entradaPublica) });
    } else if (metodo === 'claude') {
      // En modo básico no se listan: las palabras sin lematizar darían falsos "no está".
      sinEntrada.push({ palabra: termino.palabra, lema: termino.lema });
    }
  }

  return { fuente, metodo, aviso: AVISO, sugerencias, sinEntrada };
}
