"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.userQuerySchema = void 0;
const zod_1 = require("zod");
exports.userQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
});
const validateQuery = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            res.status(400).json({
                message: 'Validation failed',
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        const { page: pageStr, limit: limitStr, search } = result.data;
        const page = Number(pageStr ?? 1);
        const limit = Number(limitStr ?? 10);
        if (!Number.isInteger(page) || page < 1) {
            res.status(400).json({ message: 'Page must be a positive integer' });
            return;
        }
        if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
            res.status(400).json({ message: 'Limit must be between 1 and 100' });
            return;
        }
        req.query.page = page.toString();
        req.query.limit = limit.toString();
        if (search)
            req.query.search = search;
        next();
    };
};
exports.validateQuery = validateQuery;
