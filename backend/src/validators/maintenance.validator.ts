typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  type: z.enum(['PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE']),
  title: z.string().min(3, 'El titulo debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  scheduledDate: z.string().min(1, 'La fecha es obligatoria'),
  assetId: z.string().min(1, 'El activo es obligatorio'),
  performedBy: z.string().optional(),
  activities: z.string().optional(),
  observations: z.string().optional(),
  incidentId: z.string().optional()
});

export const completeMaintenanceSchema = z.object({
  activities: z.string().min(5, 'Las actividades son obligatorias'),
  observations: z.string().optional()
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
