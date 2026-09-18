typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { notificationRepository } from '../repositories/notification.repository';

export const notificationService = {
  getByUser: async (userId: string) => {
    return notificationRepository.findByUser(userId);
  },

  markAsRead: async (id: string) => {
    return notificationRepository.markAsRead(id);
  },

  markAllAsRead: async (userId: string) => {
    return notificationRepository.markAllAsRead(userId);
  }
};
