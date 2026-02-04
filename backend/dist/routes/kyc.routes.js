"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const container_1 = require("../container");
const tokens_1 = require("../types/tokens");
const auth_middleware_1 = require("../middleware/auth.middleware");
const kyc_validator_1 = require("../validator/kyc.validator");
const routes_constant_1 = require("../constants/routes.constant");
const router = express_1.default.Router();
const kycController = container_1.container.get(tokens_1.TYPES.KycController);
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
});
router.post(routes_constant_1.API_ROUTES.KYC.UPLOAD, auth_middleware_1.authMiddleware, upload.single('file'), (0, kyc_validator_1.validateFile)(kyc_validator_1.kycUploadSchema), kycController.uploadKycFile);
exports.default = router;
