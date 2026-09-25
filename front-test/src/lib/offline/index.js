/* Módulo offline. Mismas firmas que acordaron Ana y Eric en API.materiales.md:
 *
 *   configurarOffline({ apiUrl, fetchMaterial })   una vez, en main.jsx
 *   iniciarSincronizacion()                        una vez, en main.jsx
 *   guardarMaterial(material)                      botón "Guardar para usar sin internet"
 *   marcarParaDescargar(id)                        sin señal: se baja cuando vuelva
 *   obtenerMaterial(id)                            vista sin señal; el audio viene como audioBlob
 *   estadoMaterial(id)  -> { estado, mensaje }     mostrar `mensaje` tal cual
 *
 * Extras: listarGuardados(), eliminarGuardado(id), suscribirse(fn), guardarAudio(key, blob).
 *
 * Orden de descarga (sección 6.1): primero lo liviano (texto y lectura fácil), después el audio. */

import { idbAll, idbDelete, idbGet, idbKeys, idbPut, STORES } from './idb.js';

let config = { apiUrl: '', apiOrigin: '', fetchMaterial: null, soloWifi: () => false };
const listeners = new Set();
let sincronizando = false;

const avisar = () => listeners.forEach((fn) => fn());

export function suscribirse(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function configurarOffline({ apiUrl, fetchMaterial, soloWifi }) {
  config = {
    ...config,
    apiUrl,
    apiOrigin: apiUrl.replace(/\/api\/?$/, ''),
    fetchMaterial,
    soloWifi: soloWifi || config.soloWifi,
  };
}

const esDatosMoviles = () => {
  const c = navigator.connection;
  return Boolean(c && (c.type === 'cellular' || c.saveData));
};

const puedeDescargar = () => navigator.onLine && !(config.soloWifi() && esDatosMoviles());

function urlAbsoluta(audioUrl) {
  if (!audioUrl) return null;
  if (/^(https?:|blob:|data:)/.test(audioUrl)) return audioUrl;
  return `${config.apiOrigin}${audioUrl.startsWith('/') ? '' : '/'}${audioUrl}`;
}

export async function guardarAudio(key, blob) {
  await idbPut(STORES.audios, blob, key);
}

export async function leerAudio(key) {
  return (await idbGet(STORES.audios, key)) || null;
}

export async function guardarMaterial(material) {
  // 1) Lo liviano primero: el material entero sin audio ya sirve para leer y escuchar con voz del celular.
  const copia = { ...material, guardadoEn: new Date().toISOString() };
  await idbPut(STORES.materials, copia);
  await idbDelete(STORES.pending, material.id);
  avisar();

  // 2) Después, el audio de las traducciones.
  for (const tr of material.translations || []) {
    if (!tr.audioUrl || tr.audioUrl.startsWith('demo-audio:')) continue;
    const key = `tr:${tr.id}`;
    if (await leerAudio(key)) continue;
    try {
      const res = await fetch(urlAbsoluta(tr.audioUrl));
      if (res.ok) await guardarAudio(key, await res.blob());
    } catch {
      // Sin audio no se rompe nada: queda el texto.
    }
  }
  avisar();
  return copia;
}

export async function marcarParaDescargar(id) {
  await idbPut(STORES.pending, { id, desde: new Date().toISOString() }, id);
  avisar();
}

export async function obtenerMaterial(id) {
  const material = await idbGet(STORES.materials, id);
  if (!material) return null;
  const translations = await Promise.all(
    (material.translations || []).map(async (tr) => {
      const key = tr.audioUrl?.startsWith('demo-audio:') ? tr.audioUrl : `tr:${tr.id}`;
      return { ...tr, audioBlob: await leerAudio(key) };
    }),
  );
  return { ...material, translations };
}

export async function estadoMaterial(id) {
  try {
    if (await idbGet(STORES.materials, id)) {
      return { estado: 'guardado', mensaje: 'Guardado en tu celular' };
    }
    if (await idbGet(STORES.pending, id)) {
      return { estado: 'pendiente', mensaje: 'Se va a descargar cuando haya señal' };
    }
  } catch {
    return { estado: 'no-disponible', mensaje: 'Este navegador no permite guardar materiales' };
  }
  return { estado: 'no-guardado', mensaje: 'Todavía no está guardado en tu celular' };
}

export const listarGuardados = () => idbAll(STORES.materials).catch(() => []);

export async function eliminarGuardado(id) {
  const material = await idbGet(STORES.materials, id);
  for (const tr of material?.translations || []) await idbDelete(STORES.audios, `tr:${tr.id}`);
  await idbDelete(STORES.materials, id);
  avisar();
}

async function sincronizar() {
  if (sincronizando || !puedeDescargar() || !config.fetchMaterial) return;
  sincronizando = true;
  try {
    const pendientes = await idbKeys(STORES.pending);
    for (const id of pendientes) {
      try {
        const material = await config.fetchMaterial(id);
        if (material) await guardarMaterial(material);
      } catch {
        // Queda pendiente para el próximo intento.
      }
    }
  } finally {
    sincronizando = false;
  }
}

export function iniciarSincronizacion() {
  window.addEventListener('online', sincronizar);
  navigator.connection?.addEventListener?.('change', sincronizar);
  // Al abrir la app con conexión (por ejemplo, con el wifi de la escuela)
  sincronizar();
  return sincronizar;
}
