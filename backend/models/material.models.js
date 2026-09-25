import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Material = sequelize.define(
  'Material',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // FK a Course (asociación acordada con Nata). null = material de la biblioteca pública sin curso.
    // Debe tener el MISMO tipo que Course.id.
    courseId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    // Quién lo subió. STRING para no depender de si User.id es UUID o INTEGER.
    createdBy: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    sourceType: {
      type: DataTypes.ENUM('pdf', 'texto'),
      allowNull: false,
    },
    originalFileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    originalFilePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    // Texto real, limpio, legible por lectores de pantalla.
    accessibleText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // extraido = texto real del PDF · pegado = texto que escribió el docente
    // transcrito = Claude lo leyó de imágenes (conviene que el docente lo revise)
    textSource: {
      type: DataTypes.ENUM('extraido', 'pegado', 'transcrito'),
      allowNull: false,
      defaultValue: 'extraido',
    },
    easyReadText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // generado = LLM · respaldo = texto precargado · manual = editado por el docente · pendiente = no hay
    easyReadStatus: {
      type: DataTypes.ENUM('generado', 'respaldo', 'manual', 'pendiente'),
      allowNull: false,
      defaultValue: 'pendiente',
    },
    easyReadModel: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },

    // Biblioteca pública (sección 9 del documento base)
    level: {
      type: DataTypes.ENUM('primaria', 'secundaria'),
      allowNull: true,
    },
    grade: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      validate: { min: 1, max: 7 },
    },
    subject: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    license: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING(160),
      allowNull: true,
    },
    visibility: {
      type: DataTypes.ENUM('curso', 'publico'),
      allowNull: false,
      defaultValue: 'curso',
    },
  },
  {
    tableName: 'materials',
    timestamps: true,
    indexes: [
      { fields: ['courseId'] },
      { fields: ['visibility', 'level', 'grade', 'subject'] },
    ],
  },
);

export default Material;
