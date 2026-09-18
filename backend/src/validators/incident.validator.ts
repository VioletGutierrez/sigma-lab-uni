typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { z } from 'zod';

export const createIncidentSchema = z.object({
  title: z.string().min(3, 'El titulo debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripcion debe tener al menos 10 caracteres'),
  problemType: z.string().min(1, 'El tipo de problema es obligatorio'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('MEDIUM'),
  assetId: z.string().min(1, 'El activo es obligatorio'),
  labId: z.string().min(1, 'El laboratorio es obligatorio'),
  imageUrl: z.string().url('URL invalida').optional().or(z.literal(''))
});

export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'ASSIGNED', 'DIAGNOSING', 'REPAIRING', 'RESOLVED', 'CLOSED']),
  diagnosis: z.string().optional(),
  solution: z.string().optional()
});

export const assignTechnicianSchema = z.object({
  technicianId: z.string().min(1, 'El tecnico es obligatorio')
});

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
