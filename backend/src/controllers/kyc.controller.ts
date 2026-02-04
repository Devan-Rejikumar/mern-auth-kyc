import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { TYPES } from '../types/tokens';
import { IKycService } from '../services/interfaces/IKycService';
import { AuthRequest } from '../middleware/auth.middleware';
import { HttpStatus } from '../constants/http-status.enum';
import { KYC_MESSAGES, AUTH_MESSAGES } from '../constants/messages.constant';

@injectable()
export class KycController {
  constructor(@inject(TYPES.KycService) private _kycService: IKycService) {}

  uploadKycFile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: KYC_MESSAGES.NO_FILE });
        return;
      }

      if (!req.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: AUTH_MESSAGES.UNAUTHORIZED });
        return;
      }

      const fileUrl = await this._kycService.uploadFileToCloudinary(req.file, req.user.userId);
      
      res.status(HttpStatus.OK).json({
        message: KYC_MESSAGES.UPLOAD_SUCCESS,
        filePath: fileUrl,
        type: req.file.mimetype.startsWith('image/') ? 'image' : 'video',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : KYC_MESSAGES.UPLOAD_ERROR;
      console.error('File upload error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  };
}
