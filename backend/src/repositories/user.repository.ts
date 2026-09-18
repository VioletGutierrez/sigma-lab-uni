typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { prisma } from '../config/database';

export const userRepository = {
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true
      }
    });
  },

  create: async (data: { email: string; password: string; fullName: string; role: string }) => {
    return prisma.user.create({ data: data as any });
  },

  update: async (id: string, data: any) => {
    return prisma.user.update({ where: { id }, data });
  },

  updateLastLogin: async (id: string) => {
    return prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() }
    });
  },

  findAll: async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  findTechnicians: async () => {
    return prisma.user.findMany({
      where: { role: 'TECHNICIAN', isActive: true },
      select: { id: true, fullName: true, email: true }
    });
  },

  delete: async (id: string) => {
    return prisma.user.delete({ where: { id } });
  }
};
