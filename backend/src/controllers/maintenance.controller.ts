// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { maintenanceService } from '../services/maintenance.service';

export const getMaintenances = async (req: Request, res: Response): Promise<void> => {
  try {
    const maintenances = await maintenanceService.getAll(req.query);
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mantenimientos' });
  }
};

export const getMaintenanceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const maintenance = await maintenanceService.getById(req.params.id);
    res.json(maintenance);
  } catch (error: any) {
    if (error.message === 'Mantenimiento no encontrado') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Error al obtener el mantenimiento' });
  }
};

export const createMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const maintenance = await maintenanceService.create(req.body, req.userId);
    res.status(201).json(maintenance);
  } catch (error) {
    console.error('Error al crear mantenimiento:', error);
    res.status(500).json({ message: 'Error al crear el mantenimiento' });
  }
};

export const updateMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const maintenance = await maintenanceService.update(req.params.id, req.body);
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el mantenimiento' });
  }
};

export const completeMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { activities, observations } = req.body;
    const maintenance = await maintenanceService.complete(req.params.id, activities, observations);
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: 'Error al completar el mantenimiento' });
  }
};

export const deleteMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    await maintenanceService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el mantenimiento' });
  }
};