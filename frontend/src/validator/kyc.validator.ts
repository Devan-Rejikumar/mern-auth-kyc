import { z } from 'zod';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB - match backend

export const kycFileSizeSchema = z.object({
  size: z.number().max(MAX_FILE_SIZE_BYTES, 'File must be under 50MB'),
});

export function validateKycFileSize(size: number) {
  return kycFileSizeSchema.safeParse({ size });
}
