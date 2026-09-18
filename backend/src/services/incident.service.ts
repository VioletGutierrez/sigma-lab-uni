typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { incidentRepository } from '../repositories/incident.repository';
import { userRepository } from '../repositories/user.repository';
import { assetRepository } from '../repositories/asset.repository';
import { notificationRepository } from '../repositories/notification.repository';

const findLeastBusyTechnician = async (): Promise<string | null> => {
  const technicians = await userRepository.findTechnicians();
  if (technicians.length === 0) return null;

  const workloads = await Promise.all(
    technicians.map(async (tech) => {
      const count = await incidentRepository.countActiveByTechnician(tech.id);
      return { id: tech.id, count };
    })
  );

  workloads.sort((a, b) => a.count - b.count);
  return workloads[0].id;
};

const notifyAdmins = async (title: string, message: string, type: string, link?: string) => {
  const admins = await userRepository.findAll();
  const adminUsers = admins.filter((u) => u.role === 'ADMIN');

  for (const admin of adminUsers) {
    await notificationRepository.create({
      userId: admin.id,
      title,
      message,
      type,
      link
    });
  }
};

export const incidentService = {
  getAll: async (filters: any) => {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.labId) where.labId = filters.labId;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    return incidentRepository.findAll(where);
  },

  getById: async (id: string) => {
    const incident = await incidentRepository.findById(id);
    if (!incident) throw new Error('Incidente no encontrado');
    return incident;
  },

  getMyIncidents: async (userId: string) => {
    return incidentRepository.findByReporter(userId);
  },

  create: async (data: any, userId: string) => {
    const count = await incidentRepository.count();
    const code = `INC-${String(count + 1).padStart(4, '0')}`;

    const technicianId = await findLeastBusyTechnician();

    const incident = await incidentRepository.create({
      code,
      title: data.title,
      description: data.description,
      problemType: data.problemType,
      priority: data.priority || 'MEDIUM',
      imageUrl: data.imageUrl || null,
      reportedBy: userId,
      assetId: data.assetId,
      labId: data.labId,
      status: technicianId ? 'ASSIGNED' : 'PENDING',
      assignedTo: technicianId
    });

    await assetRepository.createHistory({
      assetId: data.assetId,
      eventType: 'INCIDENT_REPORTED',
      description: `Incidente ${code} reportado: ${data.title}`
    });

    if (technicianId) {
      await notificationRepository.create({
        userId: technicianId,
        title: 'Nuevo incidente asignado',
        message: `Se te ha asignado el incidente ${code}: ${data.title}`,
        type: 'INCIDENT_ASSIGNED',
        link: `/incidents/${incident.id}`
      });
    }

    await notifyAdmins(
      'Nuevo incidente reportado',
      `Se ha reportado el incidente ${code}: ${data.title}`,
      'INCIDENT_UPDATED',
      `/incidents/${incident.id}`
    );

    return incident;
  },

  assignTechnician: async (incidentId: string, technicianId: string) => {
    const incident = await incidentRepository.update(incidentId, {
      assignedTo: technicianId,
      status: 'ASSIGNED'
    });

    await notificationRepository.create({
      userId: technicianId,
      title: 'Nuevo incidente asignado',
      message: `Se te ha asignado el incidente ${incident.code}`,
      type: 'INCIDENT_ASSIGNED',
      link: `/incidents/${incident.id}`
    });

    return incident;
  },

  updateStatus: async (id: string, status: string, diagnosis?: string, solution?: string) => {
    const data: any = { status };
    if (diagnosis) data.diagnosis = diagnosis;
    if (solution) data.solution = solution;
    if (status === 'RESOLVED') data.resolvedAt = new Date();

    const incident = await incidentRepository.update(id, data);

    await notificationRepository.create({
      userId: incident.reportedBy,
      title: `Actualizacion del incidente ${incident.code}`,
      message: `El estado del incidente cambio a: ${status}`,
      type: 'INCIDENT_UPDATED',
      link: `/incidents/${incident.id}`
    });

    return incident;
  },

  closeIncident: async (id: string, solution: string) => {
    const incident = await incidentRepository.update(id, {
      status: 'CLOSED',
      solution,
      resolvedAt: new Date()
    });

    await notificationRepository.create({
      userId: incident.reportedBy,
      title: `Incidente ${incident.code} cerrado`,
      message: 'Tu incidente ha sido cerrado. Revisa la solucion aplicada.',
      type: 'INCIDENT_UPDATED',
      link: `/incidents/${incident.id}`
    });

    return incident;
  }
};
