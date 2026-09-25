/**
 * Módulo offline — dueña: Ana. Eric usa SOLO estas funciones exportadas:
 *
 *   configurarOffline({ apiUrl })        una vez al iniciar la app
 *   iniciarSincronizacion()              una vez; completa descargas al volver la señal
 *   guardarMaterial(material)            guarda texto ya y audio después
 *   marcarParaDescargar(materialId)      sin señal: se descarga cuando vuelva
 *   obtenerMaterial(materialId)          material + audios (audioBlob) o null
 *   listarMateriales({ courseId })       resumen con estado y mensaje
 *   estadoMaterial(materialId)           { estado, mensaje }
 *   borrarMaterial(materialId)
 *
 * Estados: 'guardado' | 'parcial' | 'pendiente' | 'no-guardado'
 * `mensaje` es el texto listo para el indicador ("Guardado en tu celular", etc.).
 */
import Dexie from 'dexie';

const db = new Dexie('materiales-accesibles');
db.version(1).stores({
  materiales: 'id, courseId, guardadoEn, estadoAudio',
  audios: 'clave, materialId', // clave = `${materialId}:${translationId}`
  pendientes: 'id', // materiales que se pidieron sin señal
});

let apiUrl = '';

const MENSAJES = {
  guardado: 'Guardado en tu celular',
  parcial: 'Texto guardado. El audio se va a descargar cuando haya señal',
  pendiente: 'Se va a descargar cuando haya señal',
  'no-guardado': '',
};

const estadoDesdeRegistro = (reg) => {
  if (!reg) return 'no-guardado';
  return reg.estadoAudio === 'pendiente' ? 'parcial' : 'guardado';
};

const conMensaje = (estado) => ({ estado, mensaje: MENSAJES[estado] });

function urlAbsoluta(url) {
  if (/^https?:\/\//.test(url)) return url;
  const origen = apiUrl.replace(/\/api\/?$/, '');
  return `${origen}${url.startsWith('/') ? '' : '/'}${url}`;
}

async function pedirPersistencia() {
  // Pide al navegador que no borre lo guardado (importante en iPhone).
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
      await navigator.storage.persist();
    }
  } catch {
    /* no es crítico */
  }
}

async function descargarAudios(materialId) {
  const reg = await db.materiales.get(materialId);
  if (!reg) return;

  // AJUSTAR: campo del audio en Translation (acordado con Nata)
  const conAudio = (reg.data.translations || []).filter((t) => t.audioUrl);
  if (conAudio.length === 0) {
    await db.materiales.update(materialId, { estadoAudio: 'sin-audio' });
    return;
  }
  if (!navigator.onLine) return;

  let fallas = 0;
  for (const t of conAudio) {
    const clave = `${materialId}:${t.id}`;
    if (await db.audios.get(clave)) continue;
    try {
      const res = await fetch(urlAbsoluta(t.audioUrl));
      if (!res.ok) throw new Error(res.status);
      const blob = await res.blob();
      await db.audios.put({ clave, materialId, translationId: t.id, blob });
    } catch {
      fallas += 1;
    }
  }
  await db.materiales.update(materialId, { estadoAudio: fallas ? 'pendiente' : 'completo' });
}

async function traerDelServidor(materialId) {
  const res = await fetch(`${apiUrl}/materials/${materialId}`);
  if (!res.ok) throw new Error(res.status);
  const json = await res.json();
  if (!json.exito) throw new Error(json.mensaje);
  return json.data;
}

// ---------------- API pública ----------------

export function configurarOffline({ apiUrl: url }) {
  apiUrl = (url || '').replace(/\/$/, '');
}

export async function guardarMaterial(material) {
  // 1. Primero el texto: es liviano y ya lo tenemos en memoria.
  await db.materiales.put({
    id: material.id,
    courseId: material.courseId ?? null,
    data: material,
    guardadoEn: Date.now(),
    estadoAudio: 'pendiente',
  });
  await db.pendientes.delete(material.id);
  await pedirPersistencia();

  // 2. Después el audio (si falla, queda 'parcial' y se reintenta con señal).
  await descargarAudios(material.id);
  return estadoMaterial(material.id);
}

export async function marcarParaDescargar(materialId) {
  if (await db.materiales.get(materialId)) return estadoMaterial(materialId);
  await db.pendientes.put({ id: materialId, pedidoEn: Date.now() });
  if (navigator.onLine) await completarPendientes();
  return estadoMaterial(materialId);
}

export async function obtenerMaterial(materialId) {
  const reg = await db.materiales.get(materialId);
  if (!reg) return null;
  const audios = await db.audios.where('materialId').equals(materialId).toArray();
  const porTraduccion = new Map(audios.map((a) => [a.translationId, a.blob]));

  return {
    ...reg.data,
    // Cada traducción con audio guardado trae `audioBlob`.
    // Uso: const src = URL.createObjectURL(t.audioBlob) y revocarla al desmontar.
    translations: (reg.data.translations || []).map((t) =>
      porTraduccion.has(t.id) ? { ...t, audioBlob: porTraduccion.get(t.id) } : t,
    ),
    offline: { guardadoEn: reg.guardadoEn, ...conMensaje(estadoDesdeRegistro(reg)) },
  };
}

export async function listarMateriales({ courseId } = {}) {
  const regs = courseId
    ? await db.materiales.where('courseId').equals(courseId).toArray()
    : await db.materiales.toArray();

  const guardados = regs.map((r) => ({
    id: r.id,
    title: r.data.title,
    courseId: r.courseId,
    guardadoEn: r.guardadoEn,
    ...conMensaje(estadoDesdeRegistro(r)),
  }));
  const pendientes = (await db.pendientes.toArray()).map((p) => ({
    id: p.id,
    title: null,
    courseId: null,
    guardadoEn: null,
    ...conMensaje('pendiente'),
  }));
  return [...guardados.sort((a, b) => b.guardadoEn - a.guardadoEn), ...pendientes];
}

export async function estadoMaterial(materialId) {
  const reg = await db.materiales.get(materialId);
  if (reg) return conMensaje(estadoDesdeRegistro(reg));
  if (await db.pendientes.get(materialId)) return conMensaje('pendiente');
  return conMensaje('no-guardado');
}

export async function borrarMaterial(materialId) {
  await db.transaction('rw', db.materiales, db.audios, db.pendientes, async () => {
    await db.materiales.delete(materialId);
    await db.audios.where('materialId').equals(materialId).delete();
    await db.pendientes.delete(materialId);
  });
}

let sincronizando = false;
export async function completarPendientes() {
  if (sincronizando || !navigator.onLine) return;
  sincronizando = true;
  try {
    for (const p of await db.pendientes.toArray()) {
      try {
        await guardarMaterial(await traerDelServidor(p.id));
      } catch {
        /* sigue pendiente */
      }
    }
    const parciales = await db.materiales.where('estadoAudio').equals('pendiente').primaryKeys();
    for (const id of parciales) await descargarAudios(id);
  } finally {
    sincronizando = false;
  }
}

export function iniciarSincronizacion() {
  const alVolverSenal = () => completarPendientes();
  window.addEventListener('online', alVolverSenal);
  completarPendientes();
  return () => window.removeEventListener('online', alVolverSenal);
}
