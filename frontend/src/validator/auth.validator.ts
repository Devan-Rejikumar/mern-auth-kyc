import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  username: z
    .string()
    .trim()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z][a-zA-Z0-9]*$/, 'Username must start with a letter and contain only letters and numbers')
    .refine((val) => /[a-zA-Z]/.test(val), 'Username must contain at least one letter')
    .refine((val) => !val.includes('@') && !val.includes('.com') && !val.includes('.in'), 'Username cannot contain email-like patterns'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => !val.includes(' '), 'Password cannot contain spaces'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number (starting with 6-9)')
    .refine((val) => val.length === 10, 'Phone number must be 10 digits'),
});

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

/** Validate a single field and return error message or null. Use for live validation. */
export function validateAuthField(
  field: 'email' | 'username' | 'phone' | 'password',
  value: string,
  isLogin: boolean
): string | null {
  if (isLogin && (field === 'username' || field === 'phone')) return null;
  let result: { success: true } | { success: false; error: { issues: Array<{ message: string }> } };
  if (isLogin) {
    if (field === 'email') result = loginSchema.pick({ email: true }).safeParse({ email: value.trim() });
    else result = loginSchema.pick({ password: true }).safeParse({ password: value });
  } else {
    if (field === 'email') result = registerSchema.pick({ email: true }).safeParse({ email: value.trim() });
    else if (field === 'username') result = registerSchema.pick({ username: true }).safeParse({ username: value.trim() });
    else if (field === 'phone') result = registerSchema.pick({ phone: true }).safeParse({ phone: value });
    else result = registerSchema.pick({ password: true }).safeParse({ password: value });
  }
  if (result.success) return null;
  return result.error.issues[0]?.message ?? null;
}
