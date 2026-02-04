import express from 'express';
import { container } from '../container';
import { TYPES } from '../types/tokens';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody, registerSchema, loginSchema } from '../validator/auth.validator';
import { UserController } from '../controllers/user.controller';
import { API_ROUTES } from '../constants/routes.constant';

const router = express.Router();
const userController = container.get<UserController>(TYPES.UserController);

router.post(API_ROUTES.AUTH.REGISTER, validateBody(registerSchema), userController.register);
router.post(API_ROUTES.AUTH.LOGIN, validateBody(loginSchema), userController.login);
router.get(API_ROUTES.AUTH.ME, authMiddleware, userController.getMe);
router.post(API_ROUTES.AUTH.LOGOUT, authMiddleware, userController.logout);

export default router;
