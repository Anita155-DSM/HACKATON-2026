// Backend simulado para la demo. Se usa cuando el servidor no responde o una ruta
// todavía no está montada. Guarda todo en este dispositivo (localStorage + IndexedDB para audio).
// Respeta los mismos contratos que API.md y API.materiales.md.

import { DEMO_COURSE, SEED_IDS, SEED_MATERIALS } from '../data/seedMaterials.js';
import { simpleEasyRead } from './easyRead.js';
import { guardarAudio } from './offline/index.js';
import { load, save } from './storage.js';

export class DemoError extends Error {
  constructor(status, message, errores = null) {
    super(message);
    this.status = status;
    this.errores = errores;
  }
}

const uuid = () =>
  crypto.randomUUID?.() ||
  'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () => ((Math.random() * 16) | 0).toString(16));

const now = () => new Date().toISOString();

function state() {
  const s = load('demo', null) || {};
  return {
    courses: s.courses || [DEMO_COURSE],
    materials: s.materials || [],
    translations: s.translations || [],
    overrides: s.overrides || {},
    deleted: s.deleted || [],
    users: s.users || [],
  };
}
const persist = (s) => save('demo', s);

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

function allMaterials(s = state()) {
  const seeds = SEED_MATERIALS.filter((m) => !s.deleted.includes(m.id)).map((m) => ({ ...m, ...s.overrides[m.id] }));
  return [...seeds, ...s.materials];
}

function withTranslations(material, s = state()) {
  const extra = s.translations.filter((t) => t.materialId === material.id);
  return { ...material, translations: [...(material.translations || []), ...extra] };
}

const versionesDe = (m) => {
  const v = ['texto', 'audio'];
  if (m.easyReadText) v.push('lectura_facil');
  if ((m.translations || []).some((t) => t.language === 'wichi')) v.push('wichi');
  return v;
};

/* ---------------- Auth ---------------- */

export async function login({ email, password }) {
  await delay();
  if (!email || !password) throw new DemoError(422, 'Completá email y contraseña');
  const s = state();
  const found = s.users.find((u) => u.email === email.toLowerCase().trim());
  const user = found || {
    id: `demo-${email.toLowerCase().trim()}`,
    firstName: email.split('@')[0],
    lastName: '',
    email: email.toLowerCase().trim(),
    role: 'user',
  };
  return { user, accessToken: 'demo', refreshToken: 'demo' };
}

export async function register({ firstName, lastName, email }) {
  await delay();
  const s = state();
  const user = { id: `demo-${email.toLowerCase().trim()}`, firstName, lastName, email: email.toLowerCase().trim(), role: 'user' };
  s.users = [...s.users.filter((u) => u.email !== user.email), user];
  persist(s);
  return { user, accessToken: 'demo', refreshToken: 'demo' };
}

/* ---------------- Cursos ---------------- */

export async function crearCurso(body, user) {
  await delay();
  const s = state();
  let code;
  do code = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  while (s.courses.some((c) => c.code === code));
  const curso = { id: uuid(), code, teacherId: user?.id || 'demo', ...body, createdAt: now() };
  s.courses.push(curso);
  persist(s);
  return { curso };
}

export async function misCursos(user) {
  await delay(200);
  const s = state();
  return { cursos: s.courses.filter((c) => c.teacherId === 'demo' || c.teacherId === user?.id) };
}

export async function cursoPorCodigo(code) {
  await delay();
  const s = state();
  const curso = s.courses.find((c) => c.code === code);
  if (!curso) throw new DemoError(404, 'No existe un curso con ese código');
  const materiales = allMaterials(s)
    .filter((m) => m.courseId === curso.id)
    .map((m) => withTranslations(m, s))
    .map((m) => ({ id: m.id, title: m.title, subject: m.subject, level: m.level, grade: m.grade, versiones: versionesDe(m) }));
  return { curso, materiales };
}

/* ---------------- Materiales ---------------- */

export async function listarPublicos({ level, grade, subject, q } = {}) {
  await delay(250);
  const s = state();
  const needle = q?.trim().toLowerCase();
  return allMaterials(s)
    .filter((m) => m.visibility === 'publico')
    .filter((m) => !level || m.level === level)
    .filter((m) => !grade || Number(m.grade) === Number(grade))
    .filter((m) => !subject || m.subject?.toLowerCase() === subject.toLowerCase())
    .filter((m) => !needle || m.title.toLowerCase().includes(needle) || m.accessibleText.toLowerCase().includes(needle))
    .map((m) => withTranslations(m, s))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function obtenerMaterial(id) {
  await delay(150);
  const s = state();
  const m = allMaterials(s).find((x) => x.id === id);
  if (!m) throw new DemoError(404, 'Material no encontrado');
  return withTranslations(m, s);
}

export async function crearMaterial(fields, file) {
  await delay(1400);
  let accessibleText = fields.text?.trim();
  let sourceType = 'texto';
  if (file) {
    if (file.type === 'application/pdf') {
      throw new DemoError(
        422,
        'En modo demostración no se pueden leer PDF. Pegá el texto o subí un archivo .txt. Con el servidor funcionando, el PDF se procesa solo.',
      );
    }
    accessibleText = (await file.text()).trim();
  }
  if (!accessibleText) throw new DemoError(422, 'Subí un PDF o pegá el texto del material');
  const s = state();
  const material = {
    id: uuid(),
    courseId: fields.courseId || null,
    title: fields.title,
    sourceType,
    originalFileName: file?.name || null,
    accessibleText,
    textSource: file ? 'extraido' : 'pegado',
    easyReadText: simpleEasyRead(accessibleText),
    easyReadStatus: 'respaldo',
    easyReadModel: 'demo-local',
    level: fields.level || null,
    grade: fields.grade ? Number(fields.grade) : null,
    subject: fields.subject || null,
    license: fields.license || null,
    source: fields.source || null,
    author: fields.author || null,
    visibility: fields.visibility || 'curso',
    createdBy: fields.userId,
    createdAt: now(),
    updatedAt: now(),
    translations: [],
  };
  s.materials.push(material);
  persist(s);
  return {
    mensaje:
      'Material creado en modo demostración. La lectura fácil es una versión simple armada en este dispositivo: revisala antes de compartirla.',
    data: material,
  };
}

function patchMaterial(id, patch) {
  const s = state();
  if (SEED_IDS.has(id)) {
    s.overrides[id] = { ...s.overrides[id], ...patch, updatedAt: now() };
  } else {
    const i = s.materials.findIndex((m) => m.id === id);
    if (i < 0) throw new DemoError(404, 'Material no encontrado');
    s.materials[i] = { ...s.materials[i], ...patch, updatedAt: now() };
  }
  persist(s);
  return withTranslations(allMaterials(s).find((m) => m.id === id), s);
}

export async function actualizarMaterial(id, body) {
  await delay();
  const patch = { ...body };
  if (body.easyReadText !== undefined) Object.assign(patch, { easyReadStatus: 'manual', easyReadModel: null });
  return patchMaterial(id, patch);
}

export async function regenerarLecturaFacil(id) {
  await delay(1200);
  const m = await obtenerMaterial(id);
  return patchMaterial(id, { easyReadText: simpleEasyRead(m.accessibleText), easyReadStatus: 'respaldo', easyReadModel: 'demo-local' });
}

export async function transcribir() {
  await delay(600);
  throw new DemoError(422, 'En modo demostración no se pueden leer las imágenes del PDF. Hace falta el servidor con la clave de IA.');
}

export async function eliminarMaterial(id) {
  await delay();
  const s = state();
  if (SEED_IDS.has(id)) s.deleted.push(id);
  else s.materials = s.materials.filter((m) => m.id !== id);
  s.translations = s.translations.filter((t) => t.materialId !== id);
  persist(s);
}

/* ---------------- Traducciones ---------------- */

export async function crearTraduccion(materialId, { language, text, author, validated, simulated }, audio) {
  await delay(700);
  await obtenerMaterial(materialId);
  const id = uuid();
  let audioUrl = null;
  if (audio) {
    audioUrl = `demo-audio:${id}`;
    await guardarAudio(audioUrl, audio);
  }
  const traduccion = {
    id,
    materialId,
    language,
    text,
    author,
    validated: Boolean(validated),
    simulated: Boolean(simulated),
    audioUrl,
    createdAt: now(),
  };
  const s = state();
  s.translations.push(traduccion);
  persist(s);
  return { traduccion };
}
