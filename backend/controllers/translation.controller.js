import { Translation, Material } from "../models/index.js";

export const crearTraduccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { language, text, author, validated } = req.body;

    const material = await Material.findbyPk(id);
    if (!material) {
      return res.status(404).json({
        exito: false,
        mensaje: "No existe el material.",
        data: null,
      });
    }

    const audioUrl = req.file ? `/uploads/audios/${req.file.filename}` : null;

    const validado = validated === "true" || validated === true;

    const traduccion = await Translation.create({
      materialId: id,
      language,
      text,
      author,
      validated: validado,
      audioUrl,
    });

    return res.status(201).json({
      exito: true,
      mensaje: "Traduccion guardada",
      data: { traduccion },
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Error al guardar la traduccion.",
      data: null,
    });
  }
};