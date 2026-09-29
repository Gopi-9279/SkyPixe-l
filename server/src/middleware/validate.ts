import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: fieldErrors,
        });
        return;
      }
      res.status(400).json({ success: false, message: 'Invalid request payload' });
    }
  };
};
