typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalido').min(1, 'El email es obligatorio'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres')
});

export const registerSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  role: z.enum(['STUDENT', 'TECHNICIAN', 'ADMIN']).optional().default('STUDENT')
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
