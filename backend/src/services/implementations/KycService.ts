import { inject, injectable } from 'inversify';
import { IKycService } from '../interfaces/IKycService';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { ICloudinaryService } from '../interfaces/ICloudinaryService';
import { TYPES } from '../../types/tokens';

@injectable()
export class KycService implements IKycService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.CloudinaryService) private _cloudinaryService: ICloudinaryService
  ) {}

  async uploadFileToCloudinary(file: Express.Multer.File, userId?: string): Promise<string> {
    const isImage = file.mimetype.startsWith('image/');
    const folder = isImage ? 'kyc-images' : 'kyc-videos';
    const resourceType = isImage ? 'image' : 'video';

    const fileUrl = await this._cloudinaryService.upload(file, folder, resourceType);

    if (userId) {
      await this._userRepository.updateKYC(
        userId,
        isImage ? { kycImage: fileUrl } : { kycVideo: fileUrl }
      );
    }

    return fileUrl;
  }
}