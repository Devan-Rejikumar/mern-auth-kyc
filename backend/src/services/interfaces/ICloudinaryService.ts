export interface ICloudinaryService {
  upload(file: Express.Multer.File, folder: string, resourceType: 'image' | 'video'): Promise<string>;
}