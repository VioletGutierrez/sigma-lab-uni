typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { prisma } from '../config/database';

export const notificationRepository = {
  findByUser: async (userId: string) => {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  },

  create: async (data: { userId: string; title: string; message: string; type: string; link?: string }) => {
    return prisma.notification.create({ data });
  },

  markAsRead: async (id: string) => {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  },

  markAllAsRead: async (userId: string) => {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }
};
