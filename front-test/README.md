# front-test

Frontend completo de la plataforma de accesibilidad educativa de Formosa, armado según el
documento base y los contratos de `backend/API.md` y `backend/API.materiales.md`.

"Puente" es un nombre provisorio (el documento tiene pendiente definirlo). Se cambia en
`src/lib/config.js`, `index.html` y `public/manifest.webmanifest`.

## Cómo usarlo

```bash
npm install
npm run dev                      # desarrollo en http://localhost:5173
npm run build && npm run preview # producción en http://localhost:4173 (con service worker y modo sin internet)
```

Variables (copiar `.env.example` a `.env`):

- `VITE_API_URL`: URL del backend. Por defecto `http://localhost:3000/api`.
- `VITE_DEMO=true`: trabaja siempre con datos de ejemplo, sin tocar el backend.

**Modo demostración automático:** si el servidor no responde o una ruta todavía no está montada
(`Ruta no encontrada`), la app usa datos de ejemplo guardados en el dispositivo y lo avisa arriba.
Así la demo funciona aunque el backend esté a medio terminar.

Para probar: código de curso **4827**; cualquier email y contraseña en "Docentes" cuando el servidor
no está.

## Qué incluye

| Pantalla | Ruta |
| --- | --- |
| Landing (las 8 secciones del documento, se lee sin JavaScript) | `/` (con curso guardado, va directo a Mis materiales; el logo lleva a `/?inicio=1`) |
| Alumno: código de 4 números con teclado grande y dictado por voz | `/alumno` |
| Alumno: lengua y preferencias la primera vez | `/alumno/bienvenida` |
| Mis materiales (se descargan solos al abrir con señal) | `/mis-materiales` |
| Material: texto, lectura fácil, escuchar, wichí, guardar sin internet | `/material/:id` |
| Biblioteca pública: nivel, grado y materia en tres toques, búsqueda por voz | `/biblioteca` |
| Docente: ingresar o crear cuenta, cursos, código grande | `/docente`, `/docente/cursos`, `/docente/cursos/:code` |
| Subir material (PDF, .txt o texto pegado, "Hacer público") | `/docente/subir` |
| Revisar material: lectura fácil, texto, leer imágenes, datos, traducciones | `/docente/material/:id` |
| Emails del backend | `/verify-email`, `/reset-password`, `/recuperar-clave` |
| Traductor: texto con sugerencias del glosario, traducción y grabación de audio | `/traducir`, `/traducir/:id` |
| Glosario wichí (fuente y variante por término, descarga en JSON) | `/glosario` |
| Declaración de accesibilidad | `/accesibilidad` |

**Preferencias** (botón con tuerca en el header, se guardan solo en el dispositivo):
tamaño de todo el sistema, claro / oscuro / como el celular, alto contraste, letra más fácil de leer,
guía de voz (y su velocidad), sonidos del sistema, modo concentración, menos movimiento,
lengua de los materiales y "Descargar solo con wifi".

## Estructura

```
src/
  lib/api.js            cliente de la API + fallback al modo demostración
  lib/demoStore.js      backend simulado con los mismos contratos
  lib/offline/          IndexedDB: guardarMaterial, obtenerMaterial, estadoMaterial... (firmas de API.materiales.md)
  lib/speech.js         voz del navegador: leer, guía de voz y dictado
  lib/glossary.js       glosario local (el backend todavía no tiene /api/glossary)
  data/                 materiales de ejemplo y glosario semilla
  context/              preferencias, avisos (visual + sonido + voz) y sesión
  styles/index.css      tokens de color por modo (Tailwind v4)
public/sw.js            service worker offline-first
```

## Pendiente para el equipo

- **Glosario semilla:** los 18 términos tienen la columna wichí vacía a propósito. Hay que completarlos
  desde los diccionarios citados (`src/data/glossary.js`), con fuente y variante.
- **Interfaz en wichí:** `src/lib/i18n.js` tiene la columna `wichi` vacía. Mientras tanto, la app avisa
  que la página sigue en castellano.
- **Etiqueta de idioma:** confirmar la variante del wichí para `WICHI_LANG_TAG` en `src/lib/config.js`.
