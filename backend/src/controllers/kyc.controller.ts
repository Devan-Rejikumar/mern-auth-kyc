import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { TYPES } from '../types/tokens';
import { IKycService } from '../services/interfaces/IKycService';
import { AuthRequest } from '../middleware/auth.middleware';

@injectable()
export class KycController {
  constructor(@inject(TYPES.KycService) private _kycService: IKycService) {}

  uploadKycFile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file provided' });
        return;
      }

      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const fileUrl = await this._kycService.uploadFileToCloudinary(req.file, req.user.userId);
      
      res.json({
        message: 'File uploaded successfully',
        filePath: fileUrl,
        type: req.file.mimetype.startsWith('image/') ? 'image' : 'video',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error uploading file';
      console.error('File upload error:', error);
      res.status(500).json({ message });
    }
  };
}