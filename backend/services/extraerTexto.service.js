// pdf-parse v1: se importa desde lib/ para evitar el bug del modo debug
// (el index.js intenta leer un PDF de prueba cuando se usa con ES Modules).
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { hayKey } from './claude.client.js';
import { MAX_PAGINAS_TRANSCRIPCION, transcribirPdf } from './transcribir.service.js';

export class ErrorHttp extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const MIN_CARACTERES_POR_PAGINA = 40;

export function limpiarTexto(texto = '') {
  return texto
    .replace(/\r\n?/g, '\n')
    .replace(/\u00AD/g, '') // guiones blandos
    .replace(/^[ \t]*[●•▪◦■·][ \t]*/gm, '- ') // viñetas → guion (los lectores de pantalla no leen "círculo negro")
    .replace(/(\p{L})-\n(\p{Ll})/gu, '$1$2') // palabras cortadas al final de línea
    .replace(/[ \t]+\n/g, '\n')
    .replace(/([^\n.:;!?])\n(?=[\p{Ll}(])/gu, '$1 ') // une líneas partidas en medio de una frase
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function leerPdf(buffer) {
  try {
    return await pdfParse(buffer);
  } catch {
    throw new ErrorHttp(422, 'No pudimos leer el PDF. Probá con otro archivo o pegá el texto.');
  }
}

/**
 * Transcribe el PDF con Claude (lee también el texto de las imágenes).
 * @returns {Promise<string>}
 */
export async function transcribirConClaude(buffer, paginas) {
  if (!hayKey()) {
    throw new ErrorHttp(422, 'Este PDF tiene el texto dentro de imágenes y no se puede leer automáticamente. Pegá el texto del material.');
  }
  if (paginas > MAX_PAGINAS_TRANSCRIPCION) {
    throw new ErrorHttp(
      422,
      `Para leer las imágenes, el PDF puede tener hasta ${MAX_PAGINAS_TRANSCRIPCION} páginas. Dividilo en partes o pegá el texto.`,
    );
  }
  try {
    return limpiarTexto(await transcribirPdf(buffer));
  } catch (err) {
    console.warn('[transcripción] falló Claude:', err.message);
    throw new ErrorHttp(
      503,
      'No pudimos leer el texto de las imágenes en este momento. Probá de nuevo en un rato o pegá el texto.',
    );
  }
}

export async function contarPaginas(buffer) {
  const { numpages } = await leerPdf(buffer);
  return Math.max(numpages || 1, 1);
}

/**
 * @returns {Promise<{ texto: string, origen: 'extraido' | 'transcrito' }>}
 */
export async function extraerTextoDePdf(buffer) {
  const resultado = await leerPdf(buffer);
  const texto = limpiarTexto(resultado.text);
  const paginas = Math.max(resultado.numpages || 1, 1);

  // Casi sin texto: es un PDF escaneado (imágenes). Se lo pasamos a Claude.
  if (texto.length < MIN_CARACTERES_POR_PAGINA * paginas) {
    return { texto: await transcribirConClaude(buffer, paginas), origen: 'transcrito' };
  }
  return { texto, origen: 'extraido' };
}

/**
 * @returns {Promise<{ texto: string, origen: 'extraido' | 'transcrito' | 'pegado' }>}
 */
export async function extraerTextoDeArchivo(file) {
  if (file.mimetype === 'application/pdf') return extraerTextoDePdf(file.buffer);
  if (file.mimetype === 'text/plain') {
    return { texto: limpiarTexto(file.buffer.toString('utf8')), origen: 'pegado' };
  }
  throw new ErrorHttp(415, 'Solo se aceptan archivos PDF o de texto.');
}
