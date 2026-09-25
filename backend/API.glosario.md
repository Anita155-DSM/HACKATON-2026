## GET /api/materials/:id/glosario 

Asistente para el traductor comunitario. **No traduce**: muestra las palabras del material que están en el *Glosario wichí lhämtes* (con la página del libro) y las que no están, para que la comunidad las cree o elija. Claude solo elige las palabras importantes del texto en castellano; lo que aparece en wichí sale siempre del libro.

Auth: docente logueado. Analiza la lectura fácil (o el texto accesible si no hay). Tarda unos segundos. Sin key o si Claude falla, responde igual en modo básico.

```json
{
  "exito": true,
  "mensaje": "Sugerencias del glosario",
  "data": {
    "materialId": "uuid",
    "textoAnalizado": "lectura-facil | accesible",
    "metodo": "claude | basico",
    "aviso": "Sugerencias del glosario para apoyar al traductor. No es una traducción…",
    "fuente": {
      "titulo": "Glosario wichí lhämtes: Las palabras de la gente",
      "autor": "Néstor Elio Fernández",
      "anio": 2017,
      "licencia": "Libre reproducción en todo o en parte, citando la fuente…",
      "disponible_en": "www.saij.gob.ar"
    },
    "sugerencias": [
      {
        "palabra": "plantas",
        "lema": "planta",
        "entradas": [{ "es": "planta", "wichi": "käs", "formas": [["käs"]], "nota": null, "pagina": 74 }]
      }
    ],
    "sinEntrada": [{ "palabra": "oxígeno", "lema": "oxígeno" }]
  }
}
```

**Para el front (vista del traductor):**

- Mostrar `aviso` siempre visible, arriba del panel.
- Cada sugerencia: palabra → `wichi` y la cita "(p. N)".
- `sinEntrada`: bajo un título como "Palabras para que la comunidad cree o elija".
- Pie: "Fuente: *Glosario wichí lhämtes*, Néstor Elio Fernández (2017). Descarga gratuita en www.saij.gob.ar".
- En modo `basico`, `sinEntrada` viene vacío (sin Claude no se puede saber con certeza qué falta).