import { Router } from 'express';
import * as ctrl from '../controllers/user.controllers.js';
import * as rules from '../middlewares/validator/user.validator.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(authenticate);

// user logueado
router.patch('/me', rules.updateMe, ctrl.updateMe);

// Solo admin
router.get('/', authorize('admin'), rules.list, ctrl.list);
router.get('/:id', authorize('admin'), rules.getById, ctrl.getById);
router.patch('/:id/role', authorize('admin'), rules.updateRole, ctrl.updateRole);
router.patch('/:id/status', authorize('admin'), rules.updateStatus, ctrl.updateStatus);
router.delete('/:id', authorize('admin'), rules.remove, ctrl.remove);

export default router;
