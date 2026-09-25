import { pedirAClaude } from './claude.client.js';

// Haiku 4.5 acepta hasta 100 páginas por pedido; para la demo limitamos a menos
// porque cada página se procesa como imagen (más tiempo y más costo).
export const MAX_PAGINAS_TRANSCRIPCION = 20;

const INSTRUCCIONES = `Transcribí el contenido de este documento educativo para convertirlo en texto accesible.
- Copiá todo el texto tal como aparece, en el orden en que se lee. No lo resumas, no lo corrijas y no lo reescribas.
- Incluí el texto que está dentro de imágenes, esquemas, tablas, mapas y gráficos.
- Cuando una imagen tiene información para la clase (un esquema, un mapa, un gráfico, una ilustración con rótulos), agregá en ese lugar una descripción breve y objetiva entre corchetes, empezando con "Imagen:". Por ejemplo: [Imagen: esquema de una planta con flechas que muestran la entrada de agua por la raíz.]
- Ignorá imágenes decorativas, números de página, encabezados y pies de página repetidos.
- Si una parte no se puede leer, escribí [ilegible] en ese lugar. No adivines.
- Títulos en una línea sola. Listas con un guion al inicio de cada línea.
Respondé solo con la transcripción, en texto plano, sin introducción ni comentarios.`;

/**
 * Pide a Claude que lea el PDF completo (texto + cada página como imagen).
 * Lanza error si falla: quien llama decide qué hacer.
 * @param {Buffer} buffer PDF original
 */
export function transcribirPdf(buffer) {
  return pedirAClaude({
    system: INSTRUCCIONES,
    temperature: 0, // transcribir es copiar: queremos el resultado más fiel posible
    content: [
      {
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: buffer.toString('base64') },
      },
      { type: 'text', text: 'Transcribí este documento siguiendo las instrucciones.' },
    ],
  });
}
