"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Valid email is required' }),
    username: zod_1.z
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
    password: zod_1.z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .refine((val) => !val.includes(' '), { message: 'Password cannot contain spaces' }),
    phone: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, { message: 'Invalid Indian phone number' })
        .refine((val) => val.length === 10, { message: 'Phone number must be 10 digits' }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Valid email is required' }),
    password: zod_1.z.string().min(8, { message: 'Password must be at least 8 characters' }),
});
const validateBody = (schema) => {
    return (req, res, next) => {
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
exports.validateBody = validateBody;
