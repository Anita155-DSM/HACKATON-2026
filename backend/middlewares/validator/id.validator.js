import { param } from 'express-validator';

// En PostgreSQL los IDs son UUID
export const idParam = (field = 'id') => param(field).isUUID().withMessage('ID inválido');
