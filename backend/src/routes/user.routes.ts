import express from 'express';
import { container } from '../container';
import { TYPES } from '../types/tokens';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody, registerSchema, loginSchema } from '../validator/auth.validator';
import { UserController } from '../controllers/user.controller';

const router = express.Router();
const userController = container.get<UserController>(TYPES.UserController);

router.post('/register', validateBody(registerSchema), userController.register);
router.post('/login', validateBody(loginSchema), userController.login);
router.get('/me', authMiddleware, userController.getMe);
router.post('/logout', authMiddleware, userController.logout);

export default router;