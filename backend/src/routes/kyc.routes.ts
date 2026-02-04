import express from 'express';
import multer from 'multer';
import { container } from '../container';
import { TYPES } from '../types/tokens';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateFile, kycUploadSchema } from '../validator/kyc.validator';
import { KycController } from '../controllers/kyc.controller';
import { API_ROUTES } from '../constants/routes.constant';

const router = express.Router();
const kycController = container.get<KycController>(TYPES.KycController);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.post(API_ROUTES.KYC.UPLOAD, authMiddleware, upload.single('file'), validateFile(kycUploadSchema), kycController.uploadKycFile);

export default router;
