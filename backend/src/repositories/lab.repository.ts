typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { prisma } from '../config/database';

export const labRepository = {
  findAll: async () => {
    return prisma.lab.findMany({
      include: {
        _count: {
          select: {
            assets: true,
            incidents: {
              where: {
                status: { in: ['PENDING', 'ASSIGNED', 'DIAGNOSING', 'REPAIRING'] }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  },

  findById: async (id: string) => {
    return prisma.lab.findUnique({
      where: { id },
      include: {
        assets: true,
        incidents: {
          where: { status: { not: 'CLOSED' } },
          include: { asset: true }
        }
      }
    });
  },

  create: async (data: any) => {
    return prisma.lab.create({ data });
  },

  update: async (id: string, data: any) => {
    return prisma.lab.update({ where: { id }, data });
  },

  delete: async (id: string) => {
    return prisma.lab.delete({ where: { id } });
  }
};
