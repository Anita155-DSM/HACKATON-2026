import { Course, Material } from "./models/index.js";


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
  
  const userId = req.user.id;

  const code = await generarCodigoUnico();

  const curso = await Course.create({ name, level, year, subject, code, userId });

  return res.status(201).json({
    exito: true,
    mensaje: "Curso creado",
    data: { curso },
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Error al crear el curso",
      data: null,
    });
  }
};

export const misCursos = async (req, res) => {
  try {
    const userId = req.user.id;
    const cursos = await Course.findAll({
      where: { userId },
      oder: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      exito: true,
      mensaje: "OK",
      data: { cursos },
    });
  } catch (error) {
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
      include: [{ model: Material, as: "materials" }],
    });

    if (!curso) {
      return res.status(404).json({
        exito: false,
        mensaje: "No existe un curso con ese codigo",
        data: null,
      });
    }

    return res.status(200).json({
      exito: true,
      mensaje: "OK",
      data: { curso, materiales },
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Error al buscar el curso",
      data: null,
    });
  }
};