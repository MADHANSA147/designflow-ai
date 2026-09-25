import { Router } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import * as authController from '../controllers/auth.controller';
import * as authSchema from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(authSchema.registerSchema), authController.register);
router.post('/login', validate(authSchema.loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Protected routes
router.use(requireAuth);
router.get('/me', authController.getMe);
router.patch('/me', validate(authSchema.updateProfileSchema), authController.updateMe);
router.post('/change-password', validate(authSchema.changePasswordSchema), authController.changePassword);

export default router;
