import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const registerSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(30, { message: 'Username must be at most 30 characters' })
    .regex(/^[a-zA-Z][a-zA-Z0-9]*$/, { message: 'Username must start with a letter and can only contain letters and numbers' })
    .refine((val) => {
      return /[a-zA-Z]/.test(val);
    }, { message: 'Username must contain at least one letter' })
    .refine((val) => {
      return !val.includes('@') && !val.includes('.com') && !val.includes('.in');
    }, { message: 'Username cannot contain email-like patterns' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .refine((val) => !val.includes(' '), { message: 'Password cannot contain spaces' }),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, { message: 'Invalid Indian phone number' })
    .refine((val) => val.length === 10, { message: 'Phone number must be 10 digits' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
};