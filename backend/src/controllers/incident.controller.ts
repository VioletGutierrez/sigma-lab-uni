// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { prisma } from '../config/database';

// Notificar a todos los admins
const notifyAdmins = async (title: string, message: string, type: string, link?: string) => {
  try {
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    for (const admin of admins) {
      await prisma.notification.create({
        data: { userId: admin.id, title, message, type, link }
      });
    }
  } catch (error) {
    console.error('Error al notificar admins:', error);
  }
};

// Encontrar al tecnico con menos carga de trabajo
const findLeastBusyTechnician = async (): Promise<string | null> => {
  try {
    const technicians = await prisma.user.findMany({
      where: { role: 'TECHNICIAN', isActive: true },
      select: { id: true, fullName: true }
    });

    if (technicians.length === 0) return null;

    // Contar incidentes activos (no cerrados/resueltos) por tecnico
    const workloads = await Promise.all(
      technicians.map(async (tech) => {
        const count = await prisma.incident.count({
          where: {
            assignedTo: tech.id,
            status: { in: ['ASSIGNED', 'DIAGNOSING', 'REPAIRING'] }
          }
        });
        return { id: tech.id, fullName: tech.fullName, count };
      })
    );

    // Ordenar por menor carga
    workloads.sort((a, b) => a.count - b.count);
    return workloads[0].id;
  } catch (error) {
    console.error('Error al buscar tecnico:', error);
    return null;
  }
};

export const getIncidents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, priority, labId, search } = req.query;
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (labId) where.labId = labId;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { code: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    const incidents = await prisma.incident.findMany({
      where,
      include: {
        reporter: { select: { id: true, fullName: true, email: true } },
        technician: { select: { id: true, fullName: true, email: true } },
        asset: { select: { id: true, code: true, name: true } },
        lab: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener incidentes' });
  }
};

export const getIncidentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        reporter: { select: { id: true, fullName: true, email: true } },
        technician: { select: { id: true, fullName: true, email: true } },
        asset: { include: { lab: true } },
        lab: true,
        maintenance: true
      }
    });
    if (!incident) {
      res.status(404).json({ message: 'Incidente no encontrado' });
      return;
    }
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el incidente' });
  }
};

export const createIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, problemType, priority, assetId, labId, imageUrl } = req.body;
    const count = await prisma.incident.count();
    const code = `INC-${String(count + 1).padStart(4, '0')}`;

    // ASIGNACION AUTOMATICA: buscar al tecnico con menos carga
    const technicianId = await findLeastBusyTechnician();

    const incident = await prisma.incident.create({
      data: {
        code,
        title,
        description,
        problemType,
        priority: priority || 'MEDIUM',
        imageUrl,
        reportedBy: req.userId,
        assetId,
        labId,
        status: technicianId ? 'ASSIGNED' : 'PENDING',
        assignedTo: technicianId
      },
      include: {
        reporter: { select: { id: true, fullName: true } },
        technician: { select: { id: true, fullName: true } },
        asset: { select: { id: true, code: true, name: true } },
        lab: { select: { id: true, name: true } }
      }
    });

    await prisma.assetHistory.create({
      data: {
        assetId,
        eventType: 'INCIDENT_REPORTED',
        description: `Incidente ${code} reportado: ${title}`
      }
    });

    // Notificar al tecnico asignado
    if (technicianId) {
      await prisma.notification.create({
        data: {
          userId: technicianId,
          title: 'Nuevo incidente asignado',
          message: `Se te ha asignado el incidente ${code}: ${title}`,
          type: 'INCIDENT_ASSIGNED',
          link: `/incidents/${incident.id}`
        }
      });
    }

    // Notificar a los admins
    await notifyAdmins(
      'Nuevo incidente reportado',
      `Se ha reportado el incidente ${code}: ${title}`,
      'INCIDENT_UPDATED',
      `/incidents/${incident.id}`
    );

    res.status(201).json(incident);
  } catch (error) {
    console.error('Error al crear incidente:', error);
    res.status(500).json({ message: 'Error al crear el incidente' });
  }
};

export const updateIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, problemType, priority, diagnosis, solution } = req.body;
    const incident = await prisma.incident.update({
      where: { id },
      data: { title, description, problemType, priority, diagnosis, solution },
      include: {
        reporter: { select: { id: true, fullName: true } },
        technician: { select: { id: true, fullName: true } },
        asset: { select: { id: true, code: true, name: true } }
      }
    });
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el incidente' });
  }
};

export const assignTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { technicianId } = req.body;
    const incident = await prisma.incident.update({
      where: { id },
      data: { assignedTo: technicianId, status: 'ASSIGNED' },
      include: {
        reporter: { select: { id: true, fullName: true } },
        technician: { select: { id: true, fullName: true } },
        asset: { select: { id: true, code: true, name: true } }
      }
    });

    await prisma.notification.create({
      data: {
        userId: technicianId,
        title: 'Nuevo incidente asignado',
        message: `Se te ha asignado el incidente ${incident.code}`,
        type: 'INCIDENT_ASSIGNED',
        link: `/incidents/${incident.id}`
      }
    });

    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar tecnico' });
  }
};

export const autoAssignIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const technicianId = await findLeastBusyTechnician();

    if (!technicianId) {
      res.status(400).json({ message: 'No hay tecnicos disponibles' });
      return;
    }

    const incident = await prisma.incident.update({
      where: { id },
      data: { assignedTo: technicianId, status: 'ASSIGNED' },
      include: {
        technician: { select: { id: true, fullName: true } }
      }
    });

    await prisma.notification.create({
      data: {
        userId: technicianId,
        title: 'Nuevo incidente asignado',
        message: `Se te ha asignado el incidente ${incident.code}`,
        type: 'INCIDENT_ASSIGNED',
        link: `/incidents/${incident.id}`
      }
    });

    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar automaticamente' });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, diagnosis, solution } = req.body;
    const data: any = { status };
    if (diagnosis) data.diagnosis = diagnosis;
    if (solution) data.solution = solution;
    if (status === 'RESOLVED') data.resolvedAt = new Date();
    const incident = await prisma.incident.update({ where: { id }, data });

    // Notificar al reportero
    await prisma.notification.create({
      data: {
        userId: incident.reportedBy,
        title: `Actualizacion del incidente ${incident.code}`,
        message: `El estado del incidente cambio a: ${status}`,
        type: 'INCIDENT_UPDATED',
        link: `/incidents/${incident.id}`
      }
    });

    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
};

export const closeIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { solution } = req.body;
    const incident = await prisma.incident.update({
      where: { id },
      data: { status: 'CLOSED', solution, resolvedAt: new Date() }
    });

    await prisma.notification.create({
      data: {
        userId: incident.reportedBy,
        title: `Incidente ${incident.code} cerrado`,
        message: 'Tu incidente ha sido cerrado. Revisa la solucion aplicada.',
        type: 'INCIDENT_UPDATED',
        link: `/incidents/${incident.id}`
      }
    });

    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar incidente' });
  }
};

export const getMyIncidents = async (req: Request, res: Response): Promise<void> => {
  try {
    const incidents = await prisma.incident.findMany({
      where: { reportedBy: req.userId },
      include: {
        asset: { select: { id: true, code: true, name: true } },
        lab: { select: { id: true, name: true } },
        technician: { select: { id: true, fullName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tus incidentes' });
  }
};

export const getTechnicianWorkload = async (req: Request, res: Response): Promise<void> => {
  try {
    const technicians = await prisma.user.findMany({
      where: { role: 'TECHNICIAN', isActive: true },
      select: { id: true, fullName: true, email: true }
    });

    const workloads = await Promise.all(
      technicians.map(async (tech) => {
        const activeCount = await prisma.incident.count({
          where: {
            assignedTo: tech.id,
            status: { in: ['ASSIGNED', 'DIAGNOSING', 'REPAIRING'] }
          }
        });
        const totalCount = await prisma.incident.count({
          where: { assignedTo: tech.id }
        });
        return { ...tech, activeCount, totalCount };
      })
    );

    workloads.sort((a, b) => a.activeCount - b.activeCount);
    res.json(workloads);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener carga de trabajo' });
  }
};