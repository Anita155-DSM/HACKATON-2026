import { Router } from 'express';
import * as ctrl from '../controllers/auth.controllers.js';
import * as rules from '../middlewares/validator/auth.validator.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authLimiter, emailLimiter } from '../middlewares/rateLimiters.js';

const router = Router();

// Rutas Públicas (no requieren token)
router.post('/register', authLimiter, rules.register, ctrl.register);
router.post('/login', authLimiter, rules.login, ctrl.login);
router.post('/refresh', rules.refresh, ctrl.refresh);

router.post('/verify-email', rules.verifyEmailBody, ctrl.verifyEmail);
router.get('/verify-email', rules.verifyEmailQuery, ctrl.verifyEmail);
router.post('/resend-verification', emailLimiter, rules.resendVerification, ctrl.resendVerification);

router.post('/forgot-password', emailLimiter, rules.forgotPassword, ctrl.forgotPassword);
router.post('/reset-password', rules.resetPassword, ctrl.resetPassword);

// Rutas Protegidas (sí requieren token)
router.post('/logout', authenticate, ctrl.logout);
router.get('/me', authenticate, ctrl.me);
router.patch('/change-password', authenticate, rules.changePassword, ctrl.changePassword);

export default router;
