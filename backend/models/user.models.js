import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    firstName: { type: DataTypes.STRING(60), allowNull: false },
    lastName: { type: DataTypes.STRING(60), allowNull: false },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      set(value) {
        this.setDataValue('email', String(value).toLowerCase().trim());
      },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    // 'user' = socio normal | 'admin' = administración
    role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    isEmailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    emailVerificationToken: { type: DataTypes.STRING, allowNull: true },
    emailVerificationExpires: { type: DataTypes.DATE, allowNull: true },
    passwordResetToken: { type: DataTypes.STRING, allowNull: true },
    passwordResetExpires: { type: DataTypes.DATE, allowNull: true },
    // Incrementar tokenVersion invalida todas las sesiones (logout, cambio de contraseña, desactivación)
    tokenVersion: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    lastLoginAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'users',
    timestamps: true,
  },
  User.hasMany(Course, { foreignKey: "teacherId" }),
  Course.belongsTo(User, { foreignKey: "teacherId" })
);
