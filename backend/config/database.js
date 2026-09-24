import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const logging = process.env.DB_LOGGING === 'true' ? console.log : false;
const ssl = process.env.DB_SSL === 'true' ? { ssl: { require: true, rejectUnauthorized: false } } : {};

// Si existe DATABASE_URL (Neon, Supabase, Render, Railway...) se usa esa.
// Si no, se arma con las variables DB_*.
export const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, { logging, dialectOptions: ssl })
  : new Sequelize(
      process.env.DB_NAME || 'hackathon_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        dialect: 'postgres',
        logging,
        dialectOptions: ssl,
      }
    );
