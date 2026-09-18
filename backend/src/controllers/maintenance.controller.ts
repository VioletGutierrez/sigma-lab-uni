// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getMaintenances = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, type, assetId } = req.query;
    const where: any = {};
    if (status) where.status = status as string;
    if (type) where.type = type as string;
    if (assetId) where.assetId = assetId as string;
    const maintenances = await prisma.maintenance.findMany({
      where,
      include: {
        asset: { select: { id: true, code: true, name: true, lab: { select: { id: true, name: true } } } },
        technician: { select: { id: true, fullName: true } }
      },
      orderBy: { scheduledDate: 'asc' }
    });
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mantenimientos' });
  }
};

export const getMaintenanceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        asset: { include: { lab: true } },
        technician: { select: { id: true, fullName: true } },
        incident: true
      }
    });
    if (!maintenance) {
      res.status(404).json({ message: 'Mantenimiento no encontrado' });
      return;
    }
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el mantenimiento' });
  }
};

export const createMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, title, description, scheduledDate, assetId, activities, observations, incidentId, performedBy } = req.body;
    const count = await prisma.maintenance.count();
    const code = `MNT-${String(count + 1).padStart(4, '0')}`;
    const maintenance = await prisma.maintenance.create({
      data: {
        code,
        type,
        title,
        description: description || null,
        scheduledDate: new Date(scheduledDate),
        assetId,
        performedBy: performedBy || req.userId,
        activities: activities || null,
        observations: observations || null,
        incidentId: incidentId || null,
        status: 'SCHEDULED'
      },
      include: {
        asset: { select: { id: true, code: true, name: true } },
        technician: { select: { id: true, fullName: true } }
      }
    });

    await prisma.assetHistory.create({
      data: {
        assetId,
        eventType: 'MAINTENANCE_SCHEDULED',
        description: `Mantenimiento ${code} programado: ${title}`
      }
    });

    // Notificar al tecnico asignado (si no es el mismo que crea)
    if (maintenance.performedBy && maintenance.performedBy !== req.userId) {
      await prisma.notification.create({
        data: {
          userId: maintenance.performedBy,
          title: 'Nuevo mantenimiento asignado',
          message: `Se te ha asignado el mantenimiento ${code}: ${title} para el activo ${maintenance.asset?.code || ''}`,
          type: 'MAINTENANCE_SCHEDULED',
          link: `/maintenances`
        }
      });
    }

    // Notificar a todos los admins
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    for (const admin of admins) {
      if (admin.id !== req.userId) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: 'Nuevo mantenimiento programado',
            message: `Se ha programado el mantenimiento ${code}: ${title}`,
            type: 'MAINTENANCE_SCHEDULED',
            link: `/maintenances`
          }
        });
      }
    }

    res.status(201).json(maintenance);
  } catch (error) {
    console.error('Error al crear mantenimiento:', error);
    res.status(500).json({ message: 'Error al crear el mantenimiento' });
  }
};

export const updateMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type, title, description, scheduledDate, activities, observations } = req.body;
    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: {
        type,
        title,
        description,
        scheduledDate: new Date(scheduledDate),
        activities,
        observations
      }
    });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el mantenimiento' });
  }
};

export const completeMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { activities, observations } = req.body;
    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedDate: new Date(),
        activities,
        observations
      },
      include: {
        asset: { select: { id: true, code: true, name: true } }
      }
    });

    await prisma.assetHistory.create({
      data: {
        assetId: maintenance.assetId,
        eventType: 'MAINTENANCE_COMPLETED',
        description: `Mantenimiento ${maintenance.code} completado`
      }
    });

    if (maintenance.incidentId) {
      await prisma.incident.update({
        where: { id: maintenance.incidentId },
        data: { status: 'RESOLVED' }
      });
    }

    // Notificar a los admins
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    for (const admin of admins) {
      if (admin.id !== req.userId) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: 'Mantenimiento completado',
            message: `El mantenimiento ${maintenance.code} ha sido completado`,
            type: 'MAINTENANCE_REMINDER',
            link: `/maintenances`
          }
        });
      }
    }

    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: 'Error al completar el mantenimiento' });
  }
};

export const deleteMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.maintenance.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el mantenimiento' });
  }
};