// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar como leida' });
  }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.userId, isRead: false },
      data: { isRead: true }
    });
    res.json({ message: 'Todas las notificaciones marcadas como leidas' });
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar todas como leidas' });
  }
};