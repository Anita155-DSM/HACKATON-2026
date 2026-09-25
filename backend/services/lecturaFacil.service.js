import fs from 'node:fs';
import path from 'node:path';

const API_URL = 'https://api.anthropic.com/v1/messages';
const modelo = () => process.env.LLM_MODEL || 'claude-haiku-4-5-20251001';
const MAX_ENTRADA = 15000; // caracteres; para la demo alcanza
const timeoutMs = () => Number(process.env.LLM_TIMEOUT_MS || 90000);
const RUTA_RESPALDO = path.resolve('data/lectura-facil-respaldo.json');

const INSTRUCCIONES = `Sos especialista en lectura fácil en español de Argentina.
Reescribí el texto educativo que te paso siguiendo estas pautas:
- Frases cortas, de 15 palabras como máximo. Una idea por frase.
- Voz activa y palabras de uso común.
- Mantené todos los términos técnicos del texto original, porque el alumno los necesita para la clase. Explicá cada uno en una frase simple.
- Podés explicar qué significa una palabra, pero no agregues datos nuevos sobre el tema.
- No uses palabras difíciles que no estén en el texto original. Si un verbo es técnico (como "sintetizar"), explicalo igual que los sustantivos.
- Sin metáforas, ironías ni dobles sentidos.
- Reemplazá las metáforas y expresiones figuradas del original por palabras literales, también en los títulos (por ejemplo, "en el corazón de" pasa a ser "en el centro de").
- Números escritos en cifras.
- Si el texto es largo, dividilo en partes con títulos cortos, cada título en una línea sola.
- Para enumeraciones, usá una lista con un guion al inicio de cada línea.
- Cada elemento de una lista es una sola acción o idea del mismo tipo. Las explicaciones de palabras van en una frase aparte, antes o después de la lista, nunca dentro.
- No saques conceptos importantes.
Respondé solo con el texto reescrito, en texto plano, sin introducción ni comentarios.`;

let respaldoCache = null;

function slug(texto = '') {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buscarRespaldo(titulo) {
  if (respaldoCache === null) {
    try {
      respaldoCache = JSON.parse(fs.readFileSync(RUTA_RESPALDO, 'utf8'));
    } catch {
      respaldoCache = {};
    }
  }
  return respaldoCache[slug(titulo)] || null;
}

async function llamarLLM(texto) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.LLM_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: modelo(),
        max_tokens: 8000,
        temperature: 0.3,
        system: INSTRUCCIONES,
        messages: [{ role: 'user', content: texto.slice(0, MAX_ENTRADA) }],
      }),
    });
    if (!res.ok) throw new Error(`LLM respondió ${res.status}: ${await res.text()}`);
    const data = await res.json();
    // Si se cortó por largo, no guardamos un texto incompleto: se trata como falla.
    if (data.stop_reason === 'max_tokens') {
      throw new Error('La lectura fácil se cortó por largo (max_tokens)');
    }
    const salida = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    return salida || null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Nunca lanza: si el LLM falla, devuelve el respaldo precargado o 'pendiente'.
 * @returns {{ texto: string|null, estado: 'generado'|'respaldo'|'pendiente', modelo: string|null }}
 */
export async function generarLecturaFacil(texto, { titulo = '' } = {}) {
  if (process.env.LLM_API_KEY) {
    try {
      const salida = await llamarLLM(texto);
      if (salida) return { texto: salida, estado: 'generado', modelo: modelo() };
    } catch (err) {
      console.warn('[lectura fácil] falló el LLM, uso respaldo:', err.message);
    }
  }
  const respaldo = buscarRespaldo(titulo);
  if (respaldo) return { texto: respaldo, estado: 'respaldo', modelo: null };
  return { texto: null, estado: 'pendiente', modelo: null };
}
