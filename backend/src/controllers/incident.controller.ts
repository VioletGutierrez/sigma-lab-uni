// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { incidentService } from '../services/incident.service';
import { userRepository } from '../repositories/user.repository';
import { incidentRepository } from '../repositories/incident.repository';

export const getIncidents = async (req: Request, res: Response): Promise<void> => {
  try {
    const incidents = await incidentService.getAll(req.query);
    res.json(incidents);
  } catch (error) {
    console.error('Error al obtener incidentes:', error);
    res.status(500).json({ message: 'Error al obtener incidentes' });
  }
};

export const getIncidentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const incident = await incidentService.getById(req.params.id);
    res.json(incident);
  } catch (error: any) {
    if (error.message === 'Incidente no encontrado') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Error al obtener el incidente' });
  }
};

export const createIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const incident = await incidentService.create(req.body, req.userId);
    res.status(201).json(incident);
  } catch (error) {
    console.error('Error al crear incidente:', error);
    res.status(500).json({ message: 'Error al crear el incidente' });
  }
};

export const updateIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const incident = await incidentService.update(id, req.body);
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el incidente' });
  }
};

export const assignTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { technicianId } = req.body;
    const incident = await incidentService.assignTechnician(id, technicianId);
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar tecnico' });
  }
};

export const autoAssignIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const technicianId = await incidentService.findLeastBusyTechnician();
    if (!technicianId) {
      res.status(400).json({ message: 'No hay tecnicos disponibles' });
      return;
    }
    const incident = await incidentService.assignTechnician(id, technicianId);
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar automaticamente' });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, diagnosis, solution } = req.body;
    const incident = await incidentService.updateStatus(id, status, diagnosis, solution);
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
};

export const closeIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { solution } = req.body;
    const incident = await incidentService.closeIncident(id, solution);
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar incidente' });
  }
};

export const getMyIncidents = async (req: Request, res: Response): Promise<void> => {
  try {
    const incidents = await incidentService.getMyIncidents(req.userId);
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tus incidentes' });
  }
};

export const getTechnicianWorkload = async (req: Request, res: Response): Promise<void> => {
  try {
    const technicians = await userRepository.findTechnicians();
    const workloads = await Promise.all(
      technicians.map(async (tech) => {
        const activeCount = await incidentRepository.countActiveByTechnician(tech.id);
        return { ...tech, activeCount };
      })
    );
    workloads.sort((a, b) => a.activeCount - b.activeCount);
    res.json(workloads);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener carga de trabajo' });
  }
};