export interface IKycService {
  uploadFileToCloudinary(file: Express.Multer.File, userId?: string): Promise<string>;
}