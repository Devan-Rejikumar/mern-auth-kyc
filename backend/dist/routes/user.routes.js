"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../container");
const tokens_1 = require("../types/tokens");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_validator_1 = require("../validator/auth.validator");
const router = express_1.default.Router();
const userController = container_1.container.get(tokens_1.TYPES.UserController);
router.post('/register', (0, auth_validator_1.validateBody)(auth_validator_1.registerSchema), userController.register);
router.post('/login', (0, auth_validator_1.validateBody)(auth_validator_1.loginSchema), userController.login);
router.get('/me', auth_middleware_1.authMiddleware, userController.getMe);
router.post('/logout', auth_middleware_1.authMiddleware, userController.logout);
exports.default = router;
