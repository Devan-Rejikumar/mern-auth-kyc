import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const MAX_FILE_SIZE = 50 * 1024 * 1024; 

export const kycUploadSchema = z.object({
  file: z.custom<Express.Multer.File>((val) => {
    if (!val) return false;
    const file = val as Express.Multer.File;
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');
    if (!isImage && !isVideo) return false;
    if (file.size > MAX_FILE_SIZE) return false;
    return true;
  }, 'File must be an image or video under 50MB'),
});

export const validateFile = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({ file: req.file });
    
    if (!result.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }
    
    next();
  };
};