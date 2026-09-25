import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { Op } from 'sequelize';
import { Material } from '../models/material.models.js';
import Course from '../models/course.models.js'; // de Nata (export default), solo lectura
import {
  ErrorHttp,
  contarPaginas,
  extraerTextoDeArchivo,
  limpiarTexto,
  transcribirConClaude,
} from '../services/extraerTexto.service.js';
import { generarLecturaFacil } from '../services/lecturaFacil.service.js';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/materials';
const CAMPO_DOCENTE_CURSO = 'teacherId';
const CAMPOS_EDITABLES = ['title', 'level', 'grade', 'subject', 'license', 'source', 'author', 'visibility'];
const ATRIBUTOS_PRIVADOS = ['originalFilePath', 'createdBy'];

const responder = (res, status, exito, mensaje, data = null) =>
  res.status(status).json({ exito, mensaje, data });

// Envuelve cada handler: errores conocidos → su status; el resto → 500 con el envelope.
const manejar = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    if (err instanceof ErrorHttp) return responder(res, err.status, false, err.message);
    console.error('[materials]', err);
    return responder(res, 500, false, 'Error interno al procesar el material');
  }
};

const esDueno = (material, user) =>
  user?.role === 'admin' || String(material.createdBy) === String(user?.id);

async function verificarCurso(courseId, user) {
  if (!courseId) return;
  const curso = await Course.findByPk(courseId);
  if (!curso) throw new ErrorHttp(404, 'El curso no existe');
  const docenteId = curso[CAMPO_DOCENTE_CURSO];
  if (user.role !== 'admin' && docenteId && String(docenteId) !== String(user.id)) {
    throw new ErrorHttp(403, 'Solo el docente del curso puede subir materiales');
  }
}

async function buscarPropio(req) {
  const material = await Material.findByPk(req.params.id);
  if (!material) throw new ErrorHttp(404, 'Material no encontrado');
  if (!esDueno(material, req.user)) throw new ErrorHttp(403, 'No podés modificar este material');
  return material;
}

function vistaPublica(material) {
  const json = material.toJSON();
  ATRIBUTOS_PRIVADOS.forEach((k) => delete json[k]);
  return json;
}

const MENSAJE_LECTURA_FACIL = {
  generado: 'con versión en lectura fácil',
  respaldo: 'con la lectura fácil del texto de respaldo',
  pendiente: 'pero la lectura fácil quedó pendiente; podés reintentar o escribirla',
};
const AVISO_TRANSCRITO = ' El texto se leyó de imágenes: revisalo antes de compartirlo.';

const mensajeResultado = (accion, estadoLF, origen) =>
  `${accion} ${MENSAJE_LECTURA_FACIL[estadoLF]}.${origen === 'transcrito' ? AVISO_TRANSCRITO : ''}`;

// POST /api/materials  (multipart: archivo | text)
export const crearMaterial = manejar(async (req, res) => {
  const { title, courseId, text } = req.body;
  await verificarCurso(courseId, req.user);

  let accessibleText;
  let textSource = 'pegado';
  let sourceType = 'texto';
  let originalFileName = null;
  let originalFilePath = null;

  if (req.file) {
    ({ texto: accessibleText, origen: textSource } = await extraerTextoDeArchivo(req.file));
    if (req.file.mimetype === 'application/pdf') {
      sourceType = 'pdf';
      originalFileName = req.file.originalname;
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      originalFilePath = path.join(UPLOAD_DIR, `${crypto.randomUUID()}.pdf`);
      await fs.writeFile(originalFilePath, req.file.buffer);
    }
  } else {
    accessibleText = limpiarTexto(text);
  }

  if (!accessibleText) throw new ErrorHttp(422, 'El material no tiene texto');

  const lf = await generarLecturaFacil(accessibleText, { titulo: title });

  const extras = Object.fromEntries(
    CAMPOS_EDITABLES.filter((k) => k !== 'title' && req.body[k] !== undefined).map((k) => [k, req.body[k]]),
  );

  const material = await Material.create({
    ...extras,
    title,
    courseId: courseId || null,
    createdBy: String(req.user.id),
    sourceType,
    textSource,
    originalFileName,
    originalFilePath,
    accessibleText,
    easyReadText: lf.texto,
    easyReadStatus: lf.estado,
    easyReadModel: lf.modelo,
  });

  return responder(res, 201, true, mensajeResultado('Material creado', lf.estado, textSource), vistaPublica(material));
});

// GET /api/materials/:id  (público: el alumno no tiene cuenta)
export const obtenerMaterial = manejar(async (req, res) => {
  const material = await Material.findByPk(req.params.id, {
    attributes: { exclude: ATRIBUTOS_PRIVADOS },
    include: [{ association: 'translations' }],
  });
  if (!material) throw new ErrorHttp(404, 'Material no encontrado');
  return responder(res, 200, true, 'Material obtenido', material);
});

// GET /api/materials?level=&grade=&subject=&q=  (biblioteca pública)
export const listarPublicos = manejar(async (req, res) => {
  const { level, grade, subject, q } = req.query;
  const where = { visibility: 'publico' };
  if (level) where.level = level;
  if (grade) where.grade = grade;
  if (subject) where.subject = { [Op.iLike]: subject };
  if (q) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { accessibleText: { [Op.iLike]: `%${q}%` } },
    ];
  }

  const materiales = await Material.findAll({
    where,
    attributes: [
      'id', 'title', 'level', 'grade', 'subject', 'license', 'source', 'author',
      'sourceType', 'easyReadStatus', 'updatedAt',
    ],
    order: [['title', 'ASC']],
    limit: 50,
  });
  return responder(res, 200, true, 'Materiales públicos', materiales);
});

// PATCH /api/materials/:id  (datos y/o lectura fácil corregida a mano)
export const actualizarMaterial = manejar(async (req, res) => {
  const material = await buscarPropio(req);
  CAMPOS_EDITABLES.forEach((k) => {
    if (req.body[k] !== undefined) material[k] = req.body[k];
  });
  if (req.body.accessibleText !== undefined) {
    // El docente revisó o corrigió el texto (por ejemplo, una transcripción).
    material.accessibleText = limpiarTexto(req.body.accessibleText);
  }
  if (req.body.easyReadText !== undefined) {
    material.easyReadText = req.body.easyReadText;
    material.easyReadStatus = 'manual';
    material.easyReadModel = null;
  }
  await material.save();
  return responder(res, 200, true, 'Material actualizado', vistaPublica(material));
});

// POST /api/materials/:id/lectura-facil  (reintentar con el LLM)
export const regenerarLecturaFacil = manejar(async (req, res) => {
  const material = await buscarPropio(req);
  const lf = await generarLecturaFacil(material.accessibleText, { titulo: material.title });
  if (lf.estado === 'pendiente') {
    return responder(res, 503, false, 'No se pudo generar la lectura fácil. Probá de nuevo en un rato.');
  }
  Object.assign(material, { easyReadText: lf.texto, easyReadStatus: lf.estado, easyReadModel: lf.modelo });
  await material.save();
  return responder(res, 200, true, 'Lectura fácil actualizada', vistaPublica(material));
});

// POST /api/materials/:id/transcribir
// Relee el PDF original con Claude, incluido el texto de imágenes y esquemas,
// y regenera la lectura fácil a partir del texto nuevo.
export const transcribirMaterial = manejar(async (req, res) => {
  const material = await buscarPropio(req);
  if (material.sourceType !== 'pdf' || !material.originalFilePath) {
    throw new ErrorHttp(400, 'Este material no tiene un PDF original para leer');
  }

  let buffer;
  try {
    buffer = await fs.readFile(material.originalFilePath);
  } catch {
    throw new ErrorHttp(410, 'No encontramos el PDF original. Volvé a subir el material.');
  }

  const texto = await transcribirConClaude(buffer, await contarPaginas(buffer));
  const lf = await generarLecturaFacil(texto, { titulo: material.title });

  Object.assign(material, {
    accessibleText: texto,
    textSource: 'transcrito',
    // Si la lectura fácil nueva falló, se conserva la anterior en vez de borrarla.
    ...(lf.estado !== 'pendiente' && {
      easyReadText: lf.texto,
      easyReadStatus: lf.estado,
      easyReadModel: lf.modelo,
    }),
  });
  await material.save();

  return responder(res, 200, true, mensajeResultado('Material releído', lf.estado, 'transcrito'), vistaPublica(material));
});

// DELETE /api/materials/:id
export const eliminarMaterial = manejar(async (req, res) => {
  const material = await buscarPropio(req);
  const archivo = material.originalFilePath;
  await material.destroy();
  if (archivo) await fs.unlink(archivo).catch(() => {});
  return responder(res, 200, true, 'Material eliminado');
});
