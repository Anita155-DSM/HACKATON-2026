# Materiales (Ana) — pegar en API.md

Base: `/api/materials`. Todas las respuestas: `{ exito, mensaje, data }`.

| Estado | Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- | --- |
| 🟡 | POST | `/api/materials` | Docente | Sube PDF o texto, extrae texto y genera lectura fácil |
| 🟡 | GET | `/api/materials/:id` | No | Material con sus traducciones |
| 🟡 | GET | `/api/materials?level=&grade=&subject=&q=` | No | Biblioteca pública (solo `visibility=publico`) |
| 🟡 | PATCH | `/api/materials/:id` | Dueño | Edita datos o corrige la lectura fácil |
| 🟡 | POST | `/api/materials/:id/lectura-facil` | Dueño | Reintenta la lectura fácil con el LLM |
| 🟡 | POST | `/api/materials/:id/transcribir` | Dueño | Relee el PDF con Claude, incluido el texto de imágenes |
| 🟡 | DELETE | `/api/materials/:id` | Dueño | Elimina el material |

🟡 = en desarrollo · ✅ = listo para usar desde el front

## POST /api/materials

`multipart/form-data`:

| Campo | Tipo | Obligatorio | Notas |
| --- | --- | --- | --- |
| `title` | string ≤ 200 | Sí | |
| `archivo` | PDF o .txt ≤ 10 MB | Uno de los dos | Si el PDF es escaneado, se transcribe con Claude (hasta 20 páginas) |
| `text` | string ≤ 50.000 | Uno de los dos | Texto pegado |
| `courseId` | UUID | No | Si falta, material sin curso (biblioteca) |
| `level` | `primaria` \| `secundaria` | No | |
| `grade` | 1–7 | No | |
| `subject`, `license`, `source`, `author` | string | No | |
| `visibility` | `curso` \| `publico` | No | Default `curso` |

Respuesta 201 — `data` es el Material (ver abajo). El `mensaje` dice si la lectura fácil se generó,
salió del respaldo o quedó pendiente, y avisa si el texto se leyó de imágenes.

**Para el front:** este pedido puede tardar hasta 1 minuto (2 si el PDF es escaneado).
Mostrar un mensaje de espera, por ejemplo "Estamos preparando las versiones accesibles".

Errores: 400 (archivo muy pesado o de otro tipo), 403 (curso de otro docente),
404 (curso inexistente), 422 (datos inválidos, PDF ilegible o escaneado sin poder transcribirse),
429 (rate limit), 503 (no se pudo leer el texto de las imágenes en ese momento).

Los errores de validación traen además la lista por campo (formato de `validarResultado`):

```json
{
  "exito": false,
  "mensaje": "Error de validación en los datos enviados.",
  "errores": [{ "campo": "title", "mensaje": "El título es obligatorio" }]
}
```

## GET /api/materials/:id

```json
{
  "exito": true,
  "mensaje": "Material obtenido",
  "data": {
    "id": "uuid",
    "courseId": "uuid | null",
    "title": "La fotosíntesis",
    "sourceType": "pdf | texto",
    "originalFileName": "fotosintesis.pdf",
    "accessibleText": "Texto limpio…",
    "textSource": "extraido | pegado | transcrito",
    "easyReadText": "Texto en lectura fácil… | null",
    "easyReadStatus": "generado | respaldo | manual | pendiente",
    "easyReadModel": "string | null",
    "level": "primaria | secundaria | null",
    "grade": 3,
    "subject": "Ciencias Naturales",
    "license": "CC BY-SA 4.0",
    "source": "…",
    "author": "…",
    "visibility": "curso | publico",
    "createdAt": "…",
    "updatedAt": "…",
    "translations": [ "…formato definido por Nata…" ]
  }
}
```

`easyReadText` viene en texto plano: títulos en una línea sola, listas con `- ` al inicio.

`textSource: "transcrito"` significa que Claude leyó el texto de imágenes. La vista del docente
debería mostrar un aviso para que lo revise. En el texto transcrito, las imágenes con información
aparecen descritas entre corchetes: `[Imagen: …]`.

## GET /api/materials (biblioteca)

`data` es un array con: `id, title, level, grade, subject, license, source, author, sourceType,
easyReadStatus, updatedAt`. Máximo 50. Para el contenido completo, pedir `GET /:id`.

## PATCH /api/materials/:id

JSON con cualquiera de: `title, level, grade, subject, license, source, author, visibility,
accessibleText, easyReadText`. Si se manda `easyReadText`, el estado pasa a `manual`.
`accessibleText` sirve para que el docente corrija una transcripción.

## POST /api/materials/:id/lectura-facil

Sin body. 200 con el material actualizado, o 503 si el LLM no respondió.

## POST /api/materials/:id/transcribir

Sin body. Para PDFs con texto que además tienen información en imágenes (esquemas, mapas,
infografías): botón "Leer también las imágenes". Relee el PDF original, reemplaza `accessibleText`,
marca `textSource: "transcrito"` y regenera la lectura fácil (si falla, conserva la anterior).

Errores: 400 (el material no es un PDF), 410 (no está el PDF original), 422 (sin key o más de
20 páginas), 503 (Claude no respondió). Puede tardar hasta 2 minutos.

## Modelos y asociaciones

Todos los ids son UUID (el código de curso de 4 dígitos es un campo aparte, string).
Asociaciones en `models/index.js` (Nata): Course → materials, Material → translations.
Archivos: PDFs en `/uploads/materials/`, audios en `/uploads/audios/`.

---

# Módulo offline (Ana → Eric)

`import { … } from '@/lib/offline'` (o la ruta relativa). Firmas en el encabezado de
`client/src/lib/offline/index.js`. Resumen:

- `configurarOffline({ apiUrl })` e `iniciarSincronizacion()` una vez en `main.jsx`.
- Botón "Guardar para usar sin internet" → `guardarMaterial(material)` con lo que devolvió `GET /:id`.
- Sin señal → `marcarParaDescargar(id)`.
- Vista del material sin señal → `obtenerMaterial(id)`; el audio viene como `audioBlob`.
- Indicador → `estadoMaterial(id)` devuelve `{ estado, mensaje }`; mostrar `mensaje` tal cual.
