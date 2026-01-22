import { injectable } from 'inversify';
import { cloudinary } from '../../config/cloudinary';
import { ICloudinaryService } from '../interfaces/ICloudinaryService';

@injectable()
export class CloudinaryService implements ICloudinaryService {
  async upload(file: Express.Multer.File, folder: string, resourceType: 'image' | 'video'): Promise<string> {
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      {
        folder,
        resource_type: resourceType,
      }
    );
    return result.secure_url;
  }
}