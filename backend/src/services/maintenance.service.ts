typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { maintenanceRepository } from '../repositories/maintenance.repository';
import { assetRepository } from '../repositories/asset.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { userRepository } from '../repositories/user.repository';

export const maintenanceService = {
  getAll: async (filters: any) => {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.assetId) where.assetId = filters.assetId;
    return maintenanceRepository.findAll(where);
  },

  getById: async (id: string) => {
    const maintenance = await maintenanceRepository.findById(id);
    if (!maintenance) throw new Error('Mantenimiento no encontrado');
    return maintenance;
  },

  create: async (data: any, userId: string) => {
    const count = await maintenanceRepository.count();
    const code = `MNT-${String(count + 1).padStart(4, '0')}`;

    const maintenance = await maintenanceRepository.create({
      code,
      type: data.type,
      title: data.title,
      description: data.description || null,
      scheduledDate: new Date(data.scheduledDate),
      assetId: data.assetId,
      performedBy: data.performedBy || userId,
      activities: data.activities || null,
      observations: data.observations || null,
      incidentId: data.incidentId || null,
      status: 'SCHEDULED'
    });

    await assetRepository.createHistory({
      assetId: data.assetId,
      eventType: 'MAINTENANCE_SCHEDULED',
      description: `Mantenimiento ${code} programado: ${data.title}`
    });

    if (maintenance.performedBy && maintenance.performedBy !== userId) {
      await notificationRepository.create({
        userId: maintenance.performedBy,
        title: 'Nuevo mantenimiento asignado',
        message: `Se te ha asignado el mantenimiento ${code}: ${data.title}`,
        type: 'MAINTENANCE_SCHEDULED',
        link: '/maintenances'
      });
    }

    const admins = await userRepository.findAll();
    for (const admin of admins.filter((u) => u.role === 'ADMIN')) {
      if (admin.id !== userId) {
        await notificationRepository.create({
          userId: admin.id,
          title: 'Nuevo mantenimiento programado',
          message: `Se ha programado el mantenimiento ${code}: ${data.title}`,
          type: 'MAINTENANCE_SCHEDULED',
          link: '/maintenances'
        });
      }
    }

    return maintenance;
  },

  update: async (id: string, data: any) => {
    return maintenanceRepository.update(id, {
      ...data,
      scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined
    });
  },

  complete: async (id: string, activities: string, observations?: string) => {
    const maintenance = await maintenanceRepository.update(id, {
      status: 'COMPLETED',
      completedDate: new Date(),
      activities,
      observations
    });

    await assetRepository.createHistory({
      assetId: maintenance.assetId,
      eventType: 'MAINTENANCE_COMPLETED',
      description: `Mantenimiento ${maintenance.code} completado`
    });

    return maintenance;
  },

  delete: async (id: string) => {
    return maintenanceRepository.delete(id);
  }
};
