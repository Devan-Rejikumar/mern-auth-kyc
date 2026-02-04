import express from 'express';
import { container } from '../container';
import { TYPES } from '../types/tokens';
import { adminMiddleware } from '../middleware/auth.middleware';
import { validateQuery, userQuerySchema } from '../validator/user.validator';
import { validateBody, loginSchema } from '../validator/auth.validator';
import { AdminController } from '../controllers/admin.controller';
import { API_ROUTES } from '../constants/routes.constant';

const router = express.Router();
const adminController = container.get<AdminController>(TYPES.AdminController);

// Public route - no auth required
router.post(API_ROUTES.ADMIN.LOGIN, validateBody(loginSchema), adminController.adminLogin);

// Protected routes - require admin authentication
router.get(API_ROUTES.ADMIN.USERS, adminMiddleware, validateQuery(userQuerySchema), adminController.getAllUsers);
router.get(API_ROUTES.ADMIN.USER_BY_ID, adminMiddleware, adminController.getUserById);

export default router;

