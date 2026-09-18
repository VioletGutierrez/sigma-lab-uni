typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { prisma } from '../config/database';

export const incidentRepository = {
  findAll: async (where: any = {}) => {
    return prisma.incident.findMany({
      where,
      include: {
        reporter: { select: { id: true, fullName: true, email: true } },
        technician: { select: { id: true, fullName: true, email: true } },
        asset: { select: { id: true, code: true, name: true } },
        lab: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  findById: async (id: string) => {
    return prisma.incident.findUnique({
      where: { id },
      include: {
        reporter: { select: { id: true, fullName: true, email: true } },
        technician: { select: { id: true, fullName: true, email: true } },
        asset: { include: { lab: true } },
        lab: true,
        maintenance: true
      }
    });
  },

  findByReporter: async (userId: string) => {
    return prisma.incident.findMany({
      where: { reportedBy: userId },
      include: {
        asset: { select: { id: true, code: true, name: true } },
        lab: { select: { id: true, name: true } },
        technician: { select: { id: true, fullName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  count: async () => {
    return prisma.incident.count();
  },

  create: async (data: any) => {
    return prisma.incident.create({
      data,
      include: {
        reporter: { select: { id: true, fullName: true } },
        technician: { select: { id: true, fullName: true } },
        asset: { select: { id: true, code: true, name: true } },
        lab: { select: { id: true, name: true } }
      }
    });
  },

  update: async (id: string, data: any) => {
    return prisma.incident.update({ where: { id }, data });
  },

  countActiveByTechnician: async (technicianId: string) => {
    return prisma.incident.count({
      where: {
        assignedTo: technicianId,
        status: { in: ['ASSIGNED', 'DIAGNOSING', 'REPAIRING'] }
      }
    });
  }
};
