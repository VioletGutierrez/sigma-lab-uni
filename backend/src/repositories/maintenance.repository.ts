typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { prisma } from '../config/database';

export const maintenanceRepository = {
  findAll: async (where: any = {}) => {
    return prisma.maintenance.findMany({
      where,
      include: {
        asset: { select: { id: true, code: true, name: true, lab: { select: { id: true, name: true } } } },
        technician: { select: { id: true, fullName: true } }
      },
      orderBy: { scheduledDate: 'asc' }
    });
  },

  findById: async (id: string) => {
    return prisma.maintenance.findUnique({
      where: { id },
      include: {
        asset: { include: { lab: true } },
        technician: { select: { id: true, fullName: true } },
        incident: true
      }
    });
  },

  count: async () => {
    return prisma.maintenance.count();
  },

  create: async (data: any) => {
    return prisma.maintenance.create({
      data,
      include: {
        asset: { select: { id: true, code: true, name: true } },
        technician: { select: { id: true, fullName: true } }
      }
    });
  },

  update: async (id: string, data: any) => {
    return prisma.maintenance.update({ where: { id }, data });
  },

  delete: async (id: string) => {
    return prisma.maintenance.delete({ where: { id } });
  }
};
