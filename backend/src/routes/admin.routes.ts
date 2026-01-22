import express from 'express';
import { container } from '../container';
import { TYPES } from '../types/tokens';
import { adminMiddleware } from '../middleware/auth.middleware';
import { validateQuery, userQuerySchema } from '../validator/user.validator';
import { AdminController } from '../controllers/admin.controller';

const router = express.Router();
const adminController = container.get<AdminController>(TYPES.AdminController);

router.get('/users', adminMiddleware, validateQuery(userQuerySchema), adminController.getAllUsers);
router.get('/users/:userId', adminMiddleware, adminController.getUserById);

export default router;

