// pdf-parse v1: se importa desde lib/ para evitar el bug del modo debug
// (el index.js intenta leer un PDF de prueba cuando se usa con ES Modules).
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

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

export async function extraerTextoDePdf(buffer) {
  let resultado;
  try {
    resultado = await pdfParse(buffer);
  } catch {
    throw new ErrorHttp(422, 'No pudimos leer el PDF. Probá con otro archivo o pegá el texto.');
  }

  const texto = limpiarTexto(resultado.text);
  const paginas = Math.max(resultado.numpages || 1, 1);

  // Sin OCR: si casi no hay texto, es un PDF escaneado (imágenes).
  if (texto.length < MIN_CARACTERES_POR_PAGINA * paginas) {
    throw new ErrorHttp(
      422,
      'Este PDF parece escaneado (es una imagen) y no tiene texto para leer. Pegá el texto del material.',
    );
  }
  return texto;
}

export function extraerTextoDeArchivo(file) {
  if (file.mimetype === 'application/pdf') return extraerTextoDePdf(file.buffer);
  if (file.mimetype === 'text/plain') return Promise.resolve(limpiarTexto(file.buffer.toString('utf8')));
  throw new ErrorHttp(415, 'Solo se aceptan archivos PDF o de texto.');
}
