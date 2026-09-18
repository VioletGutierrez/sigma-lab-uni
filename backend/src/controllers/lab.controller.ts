// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { labService } from '../services/lab.service';

export const getLabs = async (req: Request, res: Response): Promise<void> => {
  try {
    const labs = await labService.getAll();
    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener laboratorios' });
  }
};

export const getLabById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lab = await labService.getById(req.params.id);
    res.json(lab);
  } catch (error: any) {
    if (error.message === 'Laboratorio no encontrado') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Error al obtener el laboratorio' });
  }
};

export const createLab = async (req: Request, res: Response): Promise<void> => {
  try {
    const lab = await labService.create(req.body);
    res.status(201).json(lab);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el laboratorio' });
  }
};

export const updateLab = async (req: Request, res: Response): Promise<void> => {
  try {
    const lab = await labService.update(req.params.id, req.body);
    res.json(lab);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el laboratorio' });
  }
};

export const deleteLab = async (req: Request, res: Response): Promise<void> => {
  try {
    await labService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el laboratorio' });
  }
};