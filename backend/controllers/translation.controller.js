import { Translation, Material } from "../models/index.js";

// En multipart todo llega como texto: "true" / "false"
const aBooleano = (valor) => valor === true || valor === "true";

export const crearTraduccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { language, text, author, validated, simulated } = req.body;

    const material = await Material.findByPk(id);
    if (!material) {
      return res.status(404).json({
        exito: false,
        mensaje: "No existe el material.",
        data: null,
      });
    }

    const audioUrl = req.file ? `/uploads/audios/${req.file.filename}` : null;

    const traduccion = await Translation.create({
      materialId: id,
      language,
      text,
      author,
      validated: aBooleano(validated),
      simulated: aBooleano(simulated),
      audioUrl,
    });

    return res.status(201).json({
      exito: true,
      mensaje: "Traducción guardada",
      data: { traduccion },
    });
  } catch (error) {
    console.error("[translations] crearTraduccion:", error);
    return res.status(500).json({
      exito: false,
      mensaje: "Error al guardar la traducción.",
      data: null,
    });
  }
};
