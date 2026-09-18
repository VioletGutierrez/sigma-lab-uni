typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { prisma } from '../config/database';

export const assetRepository = {
  findAll: async (where: any = {}) => {
    return prisma.asset.findMany({
      where,
      include: {
        lab: { select: { id: true, name: true } },
        _count: { select: { incidents: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  findById: async (id: string) => {
    return prisma.asset.findUnique({
      where: { id },
      include: {
        lab: { select: { id: true, name: true } },
        _count: { select: { incidents: true } }
      }
    });
  },

  findHistory: async (assetId: string) => {
    return prisma.assetHistory.findMany({
      where: { assetId },
      orderBy: { createdAt: 'desc' }
    });
  },

  create: async (data: any) => {
    return prisma.asset.create({ data });
  },

  update: async (id: string, data: any) => {
    return prisma.asset.update({ where: { id }, data });
  },

  delete: async (id: string) => {
    return prisma.asset.delete({ where: { id } });
  },

  createHistory: async (data: { assetId: string; eventType: string; description: string }) => {
    return prisma.assetHistory.create({ data });
  }
};
