"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFile = exports.kycUploadSchema = void 0;
const zod_1 = require("zod");
const MAX_FILE_SIZE = 50 * 1024 * 1024;
exports.kycUploadSchema = zod_1.z.object({
    file: zod_1.z.custom((val) => {
        if (!val)
            return false;
        const file = val;
        const isImage = file.mimetype.startsWith('image/');
        const isVideo = file.mimetype.startsWith('video/');
        if (!isImage && !isVideo)
            return false;
        if (file.size > MAX_FILE_SIZE)
            return false;
        return true;
    }, 'File must be an image or video under 50MB'),
});
const validateFile = (schema) => {
    return (req, res, next) => {
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
exports.validateFile = validateFile;
