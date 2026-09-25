// Prueba los servicios sin base de datos ni servidor.
// Uso:
//   node scripts/probar-lectura-facil.js                  → usa un texto de ejemplo
//   node scripts/probar-lectura-facil.js ruta/archivo.pdf → extrae el PDF y lo simplifica
import 'dotenv/config';
import fs from 'node:fs/promises';
import { extraerTextoDePdf, limpiarTexto } from '../services/extraerTexto.service.js';
import { generarLecturaFacil } from '../services/lecturaFacil.service.js';

const EJEMPLO = `La fotosíntesis es el proceso mediante el cual los organismos autótrofos,
como las plantas, sintetizan compuestos orgánicos a partir de dióxido de carbono y agua,
utilizando la energía lumínica captada por la clorofila. Como resultado, liberan oxígeno.`;

const ruta = process.argv[2];
const texto = ruta ? await extraerTextoDePdf(await fs.readFile(ruta)) : limpiarTexto(EJEMPLO);

console.log('── Texto extraído ──\n' + texto.slice(0, 1500) + '\n');
console.log(`Key configurada: ${process.env.LLM_API_KEY ? 'sí' : 'no'}\n`);

const inicio = Date.now();
const lf = await generarLecturaFacil(texto, { titulo: 'La fotosíntesis' });
console.log(`── Lectura fácil (${lf.estado}, ${Date.now() - inicio} ms) ──\n${lf.texto ?? '(vacía)'}`);
