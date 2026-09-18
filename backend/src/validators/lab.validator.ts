typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { z } from 'zod';

export const createLabSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  code: z.string().min(2, 'El codigo es obligatorio'),
  description: z.string().optional(),
  location: z.string().min(3, 'La ubicacion es obligatoria'),
  capacity: z.union([z.string(), z.number()]).transform((val) => parseInt(String(val))),
  responsible: z.string().optional()
});

export const updateLabSchema = createLabSchema.partial();

export type CreateLabInput = z.infer<typeof createLabSchema>;
