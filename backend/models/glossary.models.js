import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const GlossaryTerm = sequelize.define(
  "GlossaryTerm",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    es: {
      type: DataTypes.STRING, // término en castellano
      allowNull: false,
    },
    term: {
      type: DataTypes.STRING, // término en la lengua (ej. la palabra en wichí)
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING, // "wichi", "qom", etc.
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING, // fuente citada
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING, // variante o aclaración (opcional)
      allowNull: true,
    },
  },
  {
    tableName: "glossary_terms",
    timestamps: true,
    // Evita términos duplicados al re-sembrar (mismo término + misma lengua)
    indexes: [{ unique: true, fields: ["es", "language"] }],
  }
);

export default GlossaryTerm;