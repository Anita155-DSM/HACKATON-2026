import { Course, Material } from "../models/index.js";

async function generarCodigoUnico() {
  let code;
  do {
    code = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  } while (await Course.findOne({ where: { code } }));
  return code;
}

export const crearCurso = async (req, res) => {
  try {
    const { name, level, year, subject } = req.body;
    const teacherId = req.user.id;
    const code = await generarCodigoUnico();

    const curso = await Course.create({ name, level, year, subject, code, teacherId });

    return res.status(201).json({
      exito: true,
      mensaje: "Curso creado",
      data: { curso },
    });
  } catch (error) {
    console.error("[courses] crearCurso:", error);
    return res.status(500).json({
      exito: false,
      mensaje: "Error al crear el curso",
      data: null,
    });
  }
};

export const misCursos = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const cursos = await Course.findAll({
      where: { teacherId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      exito: true,
      mensaje: "OK",
      data: { cursos },
    });
  } catch (error) {
    console.error("[courses] misCursos:", error);
    return res.status(500).json({
      exito: false,
      mensaje: "Error al obtener los cursos",
      data: null,
    });
  }
};

export const cursoPorCodigo = async (req, res) => {
  try {
    const { code } = req.params;

    const curso = await Course.findOne({
      where: { code },
      attributes: ["id", "name", "code", "level", "year", "subject"],
      include: [
        {
          model: Material,
          as: "materials",
          // Ruta del archivo en el servidor y quién lo subió no se exponen.
          // Los textos completos se piden con GET /api/materials/:id.
          attributes: { exclude: ["originalFilePath", "createdBy", "accessibleText", "easyReadText"] },
        },
      ],
    });

    if (!curso) {
      return res.status(404).json({
        exito: false,
        mensaje: "No existe un curso con ese código",
        data: null,
      });
    }

    // Los materiales vienen adentro: data.curso.materials
    return res.status(200).json({
      exito: true,
      mensaje: "OK",
      data: { curso },
    });
  } catch (error) {
    console.error("[courses] cursoPorCodigo:", error);
    return res.status(500).json({
      exito: false,
      mensaje: "Error al buscar el curso",
      data: null,
    });
  }
};
