typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message
        }));
        res.status(400).json({
          message: 'Datos invalidos',
          errors
        });
        return;
      }
      res.status(400).json({ message: 'Error de validacion' });
    }
  };
};
