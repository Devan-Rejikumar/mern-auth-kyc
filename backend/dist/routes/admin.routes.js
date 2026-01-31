"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../container");
const tokens_1 = require("../types/tokens");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_validator_1 = require("../validator/user.validator");
const auth_validator_1 = require("../validator/auth.validator");
const router = express_1.default.Router();
const adminController = container_1.container.get(tokens_1.TYPES.AdminController);
// Public route - no auth required
router.post('/login', (0, auth_validator_1.validateBody)(auth_validator_1.loginSchema), adminController.adminLogin);
// Protected routes - require admin authentication
router.get('/users', auth_middleware_1.adminMiddleware, (0, user_validator_1.validateQuery)(user_validator_1.userQuerySchema), adminController.getAllUsers);
router.get('/users/:userId', auth_middleware_1.adminMiddleware, adminController.getUserById);
exports.default = router;
