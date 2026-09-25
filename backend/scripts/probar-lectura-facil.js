// Prueba los servicios sin base de datos ni servidor.
// Uso:
//   node scripts/probar-lectura-facil.js                        → texto de ejemplo
//   node scripts/probar-lectura-facil.js archivo.pdf            → extrae el PDF (si es escaneado, lo transcribe)
//   node scripts/probar-lectura-facil.js archivo.pdf --imagenes → fuerza la lectura con Claude (texto + imágenes)
import 'dotenv/config';
import fs from 'node:fs/promises';
import {
  contarPaginas,
  extraerTextoDePdf,
  limpiarTexto,
  transcribirConClaude,
} from '../services/extraerTexto.service.js';
import { generarLecturaFacil } from '../services/lecturaFacil.service.js';

const EJEMPLO = `La fotosíntesis es el proceso mediante el cual los organismos autótrofos,
como las plantas, sintetizan compuestos orgánicos a partir de dióxido de carbono y agua,
utilizando la energía lumínica captada por la clorofila. Como resultado, liberan oxígeno.`;

const ruta = process.argv[2];
const forzarImagenes = process.argv.includes('--imagenes');

console.log(`Key configurada: ${process.env.LLM_API_KEY ? 'sí' : 'no'}\n`);

let texto;
let origen;
let inicio = Date.now();
if (!ruta) {
  ({ texto, origen } = { texto: limpiarTexto(EJEMPLO), origen: 'pegado' });
} else {
  const buffer = await fs.readFile(ruta);
  ({ texto, origen } = forzarImagenes
    ? { texto: await transcribirConClaude(buffer, await contarPaginas(buffer)), origen: 'transcrito' }
    : await extraerTextoDePdf(buffer));
}
console.log(`── Texto (${origen}, ${Date.now() - inicio} ms) ──\n${texto.slice(0, 3000)}\n`);

inicio = Date.now();
const lf = await generarLecturaFacil(texto, { titulo: 'La fotosíntesis' });
console.log(`── Lectura fácil (${lf.estado}, ${Date.now() - inicio} ms) ──\n${lf.texto ?? '(vacía)'}`);
