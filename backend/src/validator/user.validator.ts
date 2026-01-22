import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const userQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
});

export const validateQuery = (schema: typeof userQuerySchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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
    if (search) req.query.search = search;

    next();
  };
};