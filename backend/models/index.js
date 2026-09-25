import { sequelize } from "../config/database.js";

import { User } from "./user.models.js";
import Course from "./course.models.js";
import Material from "./material.models.js";
import Translation from "./translation.models.js";

// Docente dueño del curso
User.hasMany(Course, { foreignKey: "teacherId", as: "courses" });
Course.belongsTo(User, { foreignKey: "teacherId", as: "teacher" });

// Curso -> Materiales
Course.hasMany(Material, { foreignKey: "courseId", as: "materials" });
Material.belongsTo(Course, { foreignKey: "courseId", as: "course" });

// Material -> Traducciones
Material.hasMany(Translation, { foreignKey: "materialId", as: "translations" });
Translation.belongsTo(Material, { foreignKey: "materialId", as: "material" });

export { sequelize, User, Course, Material, Translation };