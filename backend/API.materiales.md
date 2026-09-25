# Materiales (Ana) — pegar en API.md

Base: `/api/materials`. Todas las respuestas: `{ exito, mensaje, data }`.

| Estado | Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- | --- |
| 🟡 | POST | `/api/materials` | Docente | Sube PDF o texto, extrae texto y genera lectura fácil |
| 🟡 | GET | `/api/materials/:id` | No | Material con sus traducciones |
| 🟡 | GET | `/api/materials?level=&grade=&subject=&q=` | No | Biblioteca pública (solo `visibility=publico`) |
| 🟡 | PATCH | `/api/materials/:id` | Dueño | Edita datos o corrige la lectura fácil |
| 🟡 | POST | `/api/materials/:id/lectura-facil` | Dueño | Reintenta la lectura fácil con el LLM |
| 🟡 | DELETE | `/api/materials/:id` | Dueño | Elimina el material |

🟡 = en desarrollo · ✅ = listo para usar desde el front

## POST /api/materials

`multipart/form-data`:

| Campo | Tipo | Obligatorio | Notas |
| --- | --- | --- | --- |
| `title` | string ≤ 200 | Sí |  |
| `archivo` | PDF o .txt ≤ 10 MB | Uno de los dos | PDF con texto (sin OCR) |
| `text` | string ≤ 50.000 | Uno de los dos | Texto pegado |
| `courseId` | UUID | No | Si falta, material sin curso (biblioteca) |
| `level` | `primaria` | `secundaria` | No |  |
| `grade` | 1–7 | No |  |
| `subject`, `license`, `source`, `author` | string | No |  |
| `visibility` | `curso` | `publico` | No | Default `curso` |

Respuesta 201 — `data` es el Material (ver abajo). El `mensaje` dice si la lectura fácil se generó, salió del respaldo o quedó pendiente.

Errores: 400 (validación o archivo), 403 (curso de otro docente), 404 (curso inexistente), 422 (PDF escaneado o ilegible), 429 (rate limit).

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

`easyReadText` viene en texto plano: títulos en una línea sola, listas con `- `al inicio.

## GET /api/materials (biblioteca)

`data` es un array con: `id, title, level, grade, subject, license, source, author, sourceType, easyReadStatus, updatedAt`. Máximo 50. Para el contenido completo, pedir `GET /:id`.

## PATCH /api/materials/:id

JSON con cualquiera de: `title, level, grade, subject, license, source, author, visibility, easyReadText`. Si se manda `easyReadText`, el estado pasa a `manual`.

## POST /api/materials/:id/lectura-facil

Sin body. 200 con el material actualizado, o 503 si el LLM no respondió.

---

# Módulo offline (Ana → Eric)

`import { … } from '@/lib/offline'` (o la ruta relativa). Firmas en el encabezado de `client/src/lib/offline/index.js`. Resumen:

- `configurarOffline({ apiUrl })` e `iniciarSincronizacion()` una vez en `main.jsx`.
- Botón "Guardar para usar sin internet" → `guardarMaterial(material)` con lo que devolvió `GET /:id`.
- Sin señal → `marcarParaDescargar(id)`.
- Vista del material sin señal → `obtenerMaterial(id)`; el audio viene como `audioBlob`.
- Indicador → `estadoMaterial(id)` devuelve `{ estado, mensaje }`; mostrar `mensaje` tal cual.

   ## Modelos y asociaciones
   Todos los ids son UUID (el código de curso de 4 dígitos es un campo aparte, string).
   Asociaciones en `models/index.js` (Nata): Course → materials, Material → translations.
   Archivos: PDFs en `/uploads/materials/`, audios en `/uploads/audios/`.