typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { z } from 'zod';

export const createAssetSchema = z.object({
  code: z.string().min(2, 'El codigo es obligatorio'),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  acquisitionDate: z.string().optional(),
  status: z.enum(['OPERATIONAL', 'MAINTENANCE', 'REPAIR', 'DISPOSED']).optional().default('OPERATIONAL'),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('LOW'),
  labId: z.string().min(1, 'El laboratorio es obligatorio')
});

export const updateAssetSchema = createAssetSchema.partial();

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
