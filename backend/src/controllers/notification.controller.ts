// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await notificationService.getByUser(req.userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar como leida' });
  }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    await notificationService.markAllAsRead(req.userId);
    res.json({ message: 'Todas las notificaciones marcadas como leidas' });
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar todas como leidas' });
  }
};