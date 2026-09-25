import { GlossaryTerm } from "../models/index.js";

// GET /api/glossary?language=wichi (público)
export const listarGlosario = async (req, res) => {
  try {
    const where = {};
    if (req.query.language) where.language = String(req.query.language);

    const terminos = await GlossaryTerm.findAll({
      where,
      attributes: ["id", "es", "term", "language", "source", "note"],
      order: [["es", "ASC"]],
    });

    return res.status(200).json({
      exito: true,
      mensaje: "OK",
      data: { terminos },
    });
  } catch (error) {
    console.error("[glossary] listarGlosario:", error);
    return res.status(500).json({
      exito: false,
      mensaje: "Error al obtener el glosario",
      data: null,
    });
  }
};
