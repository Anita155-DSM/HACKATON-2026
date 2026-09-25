import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Translation = sequelize.define(
  "Translation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    materialId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    audioUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    validated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "translations",
    timestamps: true,
  }
);

export default Translation;