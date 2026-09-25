/* Cliente de la API. Envelope de todas las respuestas: { exito, mensaje, data }.
 * Errores de validación (422) traen además: errores: [{ campo, mensaje }].
 *
 * Modo demostración: si el servidor no responde o la ruta todavía no está montada
 * en app.js ("Ruta no encontrada"), se usa src/lib/demoStore.js y la app lo avisa.
 * Los materiales de ejemplo (data/seedMaterials.js) siempre se resuelven en local. */

import { SEED_IDS } from '../data/seedMaterials.js';
import { API_ORIGIN, API_URL, DEMO_FORCED } from './config.js';
import * as demo from './demoStore.js';
import { load, save } from './storage.js';

export class ApiError extends Error {
  constructor(status, message, { errores = null, network = false } = {}) {
    super(message);
    this.status = status;
    this.errores = errores;
    this.network = network;
  }
  // { campo: mensaje } para mostrar cada error debajo de su campo
  get porCampo() {
    return Object.fromEntries((this.errores || []).map((e) => [e.campo, e.mensaje]));
  }
}

/* ---------- Estado del modo (real / demo), observable desde la UI ---------- */

let mode = DEMO_FORCED ? 'demo' : 'real';
const modeListeners = new Set();
export const getMode = () => mode;
export function onModeChange(fn) {
  modeListeners.add(fn);
  return () => modeListeners.delete(fn);
}
function setMode(m) {
  if (mode === m) return;
  mode = m;
  modeListeners.forEach((fn) => fn(m));
}

/* ---------- Sesión ---------- */

export const getSession = () => load('auth', null);
export const setSession = (s) => save('auth', s);

let refreshing = null;
async function refreshTokens() {
  const session = getSession();
  if (!session?.refreshToken || session.refreshToken === 'demo') return false;
  refreshing =
    refreshing ||
    fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.exito) return false;
        setSession({ ...session, accessToken: json.data.accessToken, refreshToken: json.data.refreshToken });
        return true;
      })
      .catch(() => false)
      .finally(() => {
        setTimeout(() => (refreshing = null), 0);
      });
  return refreshing;
}

/* ---------- Request base ---------- */

async function request(path, { method = 'GET', body, form, auth = false, retry = true, signal } = {}) {
  const headers = {};
  const session = getSession();
  if (auth && session?.accessToken) headers.Authorization = `Bearer ${session.accessToken}`;
  let payload;
  if (form) payload = form;
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: payload, signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError(0, navigator.onLine ? 'No pudimos conectar con el servidor' : 'Estás sin conexión', { network: true });
  }

  const json = await res.json().catch(() => null);

  if (res.status === 401 && auth && retry && (await refreshTokens())) {
    return request(path, { method, body, form, auth, retry: false, signal });
  }
  if (!res.ok || json?.exito === false) {
    const fallback = {
      400: 'Revisá los datos enviados',
      401: 'Tu sesión terminó. Volvé a ingresar',
      403: 'No tenés permiso para hacer esto',
      404: 'No lo encontramos',
      410: 'El archivo ya no está disponible',
      422: 'Revisá los datos enviados',
      429: 'Hubo muchos intentos seguidos. Esperá unos minutos y probá de nuevo',
      503: 'El servicio no respondió. Probá de nuevo en un rato',
    };
    throw new ApiError(res.status, json?.mensaje || fallback[res.status] || 'Algo salió mal en el servidor', {
      errores: json?.errores,
    });
  }
  setMode(DEMO_FORCED ? 'demo' : 'real');
  return json || { exito: true, mensaje: '', data: null };
}

// ¿Conviene resolver con el modo demostración?
const debeUsarDemo = (err) =>
  err instanceof ApiError && (err.network || (err.status === 404 && /^Ruta no encontrada/i.test(err.message)));

// Intenta el servidor; si no está (o la ruta no existe todavía), resuelve en local.
// `tambienSi` permite probar en local ante otros errores (por ejemplo, el curso de ejemplo 4827).
async function conDemo(real, local, { tambienSi = () => false } = {}) {
  if (DEMO_FORCED) {
    setMode('demo');
    return adaptDemo(local);
  }
  try {
    return await real();
  } catch (err) {
    if (!debeUsarDemo(err) && !tambienSi(err)) throw err;
    try {
      const r = await adaptDemo(local);
      // El aviso "el servidor no respondió" va solo si de verdad no respondió o falló.
      // Si respondió 404 y el dato estaba en el dispositivo (un curso o material de ejemplo), el servidor anda bien.
      if (debeUsarDemo(err) || err.status >= 500) setMode('demo');
      return r;
    } catch (localErr) {
      // Si tampoco está en local, el error que importa es el original (por ejemplo, "sin conexión")
      if (localErr.status === 404 && (err.network || tambienSi(err))) throw err;
      throw localErr;
    }
  }
}

async function adaptDemo(local) {
  try {
    return await local();
  } catch (err) {
    if (err instanceof demo.DemoError) throw new ApiError(err.status, err.message, { errores: err.errores });
    throw err;
  }
}

const envelope = (data, mensaje = 'OK') => ({ exito: true, mensaje, data });

/* ---------- Health ---------- */

export async function health() {
  try {
    await request('/health');
    return true;
  } catch {
    return false;
  }
}

/* ---------- Auth ---------- */

export const auth = {
  login: (email, password) =>
    conDemo(
      () => request('/auth/login', { method: 'POST', body: { email, password } }),
      async () => envelope(await demo.login({ email, password }), 'Inicio de sesión en modo demostración'),
    ),
  register: (body) =>
    conDemo(
      () => request('/auth/register', { method: 'POST', body }),
      async () => envelope(await demo.register(body), 'Cuenta creada en modo demostración'),
    ),
  logout: () => request('/auth/logout', { method: 'POST', auth: true }).catch(() => null),
  me: () => request('/auth/me', { auth: true }),
  verifyEmail: (token) => request('/auth/verify-email', { method: 'POST', body: { token } }),
  resendVerification: (email) => request('/auth/resend-verification', { method: 'POST', body: { email } }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (body) => request('/auth/reset-password', { method: 'POST', body }),
  changePassword: (body) => request('/auth/change-password', { method: 'PATCH', body, auth: true }),
  updateMe: (body) => request('/users/me', { method: 'PATCH', body, auth: true }),
};

const sessionUser = () => getSession()?.user;

/* ---------- Cursos ---------- */

// GET /courses/code/:code puede devolver los materiales en data.materiales (contrato)
// o dentro de data.curso.materials (include de Sequelize). Aceptamos las dos formas.
function normalizarCurso(data) {
  const curso = data?.curso || {};
  const lista = data?.materiales || curso.materials || [];
  const { materials, ...resto } = curso;
  return {
    curso: resto,
    materiales: lista.map((m) => ({
      ...m,
      versiones: m.versiones || versionesDe(m),
    })),
  };
}

export function versionesDe(m) {
  if (m.versiones) return m.versiones;
  const v = ['texto', 'audio'];
  if (m.easyReadText || (m.easyReadStatus && m.easyReadStatus !== 'pendiente')) v.push('lectura_facil');
  if ((m.translations || []).some((t) => t.language === 'wichi')) v.push('wichi');
  return v;
}

export const courses = {
  create: (body) =>
    conDemo(
      () => request('/courses', { method: 'POST', body, auth: true }),
      async () => envelope(await demo.crearCurso(body, sessionUser()), 'Curso creado'),
    ).then((r) => r.data.curso),
  mine: () =>
    conDemo(
      () => request('/courses/mine', { auth: true }),
      async () => envelope(await demo.misCursos(sessionUser())),
    ).then((r) => r.data.cursos || []),
  // El curso de ejemplo 4827 siempre existe en local, para poder mostrar la demo
  // aunque el servidor diga 404 o falle.
  byCode: async (code) => {
    const r = await conDemo(
      () => request(`/courses/code/${encodeURIComponent(code)}`),
      async () => envelope(await demo.cursoPorCodigo(code)),
      { tambienSi: (err) => err.status === 404 || err.status >= 500 },
    );
    return normalizarCurso(r.data);
  },
};

/* ---------- Materiales ---------- */

const esEjemplo = (id) => SEED_IDS.has(id);

function formData(fields, file) {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') fd.append(k, v);
  });
  if (file) fd.append('archivo', file);
  return fd;
}

export const materials = {
  // Biblioteca: lo del servidor + los materiales de ejemplo (marcados como "Ejemplo").
  listPublic: async (filters = {}) => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''));
    const qs = params.toString() ? `?${params}` : '';
    const ejemplos = await demo.listarPublicos(filters);
    const r = await conDemo(
      () => request(`/materials${qs}`),
      async () => envelope([]),
    ).catch(() => envelope([]));
    const reales = (r.data || []).filter((m) => !esEjemplo(m.id));
    // Si el servidor ya tiene un material con el mismo título (por ejemplo, el del seed), se muestra ese y no el de ejemplo
    const titulos = new Set(reales.map((m) => m.title.trim().toLowerCase()));
    return [...reales, ...ejemplos.filter((m) => !titulos.has(m.title.trim().toLowerCase()))];
  },
  // Si el servidor no lo tiene, puede ser un material creado en modo demostración
  get: (id) => {
    if (esEjemplo(id)) return adaptDemo(() => demo.obtenerMaterial(id));
    return conDemo(
      () => request(`/materials/${id}`).then((r) => r.data),
      () => demo.obtenerMaterial(id),
      { tambienSi: (err) => err.status === 404 },
    );
  },
  create: (fields, file) =>
    conDemo(
      () => request('/materials', { method: 'POST', form: formData(fields, file), auth: true }),
      async () => {
        const r = await demo.crearMaterial({ ...fields, userId: sessionUser()?.id }, file);
        return envelope(r.data, r.mensaje);
      },
    ),
  update: (id, body) =>
    esEjemplo(id)
      ? adaptDemo(async () => envelope(await demo.actualizarMaterial(id, body), 'Material actualizado'))
      : conDemo(
          () => request(`/materials/${id}`, { method: 'PATCH', body, auth: true }),
          async () => envelope(await demo.actualizarMaterial(id, body), 'Material actualizado'),
        ),
  regenerateEasyRead: (id) =>
    esEjemplo(id)
      ? adaptDemo(async () => envelope(await demo.regenerarLecturaFacil(id), 'Lectura fácil actualizada'))
      : conDemo(
          () => request(`/materials/${id}/lectura-facil`, { method: 'POST', auth: true }),
          async () => envelope(await demo.regenerarLecturaFacil(id), 'Lectura fácil actualizada'),
        ),
  transcribe: (id) =>
    esEjemplo(id)
      ? adaptDemo(() => demo.transcribir(id))
      : conDemo(
          () => request(`/materials/${id}/transcribir`, { method: 'POST', auth: true }),
          () => demo.transcribir(id),
        ),
  remove: (id) =>
    esEjemplo(id)
      ? adaptDemo(async () => envelope(await demo.eliminarMaterial(id), 'Material eliminado'))
      : conDemo(
          () => request(`/materials/${id}`, { method: 'DELETE', auth: true }),
          async () => envelope(await demo.eliminarMaterial(id), 'Material eliminado'),
        ),
};

/* ---------- Traducciones ---------- */

export const translations = {
  // POST /materials/:id/translations (multipart: language, text, author, validated, simulated, audio)
  create: (materialId, fields, audio) => {
    const local = async () => envelope(await demo.crearTraduccion(materialId, fields, audio), 'Traducción guardada');
    if (esEjemplo(materialId)) return adaptDemo(local);
    const fd = new FormData();
    fd.append('language', fields.language);
    if (fields.text) fd.append('text', fields.text);
    if (fields.author) fd.append('author', fields.author);
    fd.append('validated', String(Boolean(fields.validated)));
    fd.append('simulated', String(Boolean(fields.simulated)));
    if (audio) fd.append('audio', audio, `traduccion.${extensionAudio(audio.type)}`);
    return conDemo(() => request(`/materials/${materialId}/translations`, { method: 'POST', form: fd, auth: true }), local);
  },
};

/* ---------- Glosario ---------- */

export const glossary = {
  // GET /glossary?language=wichi → data.terminos: [{ id, es, term, language, source, note }]
  list: (language) =>
    request(`/glossary?language=${encodeURIComponent(language)}`).then((r) => r.data?.terminos || []),
};

function extensionAudio(type = '') {
  if (type.includes('mp4')) return 'mp4';
  if (type.includes('ogg')) return 'ogg';
  if (type.includes('mpeg')) return 'mp3';
  return 'webm';
}

export const audioSrc = (audioUrl) => {
  if (!audioUrl || audioUrl.startsWith('demo-audio:')) return null;
  if (/^(https?:|blob:|data:)/.test(audioUrl)) return audioUrl;
  return `${API_ORIGIN}${audioUrl.startsWith('/') ? '' : '/'}${audioUrl}`;
};
