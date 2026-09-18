// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getLabs = async (req: Request, res: Response): Promise<void> => {
  try {
    const labs = await prisma.lab.findMany({
      include: {
        _count: {
          select: {
            assets: true,
            incidents: {
              where: {
                status: { in: ['PENDING', 'ASSIGNED', 'DIAGNOSING', 'REPAIRING'] }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener laboratorios' });
  }
};

export const getLabById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lab = await prisma.lab.findUnique({
      where: { id },
      include: {
        assets: true,
        incidents: {
          where: { status: { not: 'CLOSED' } },
          include: { asset: true }
        }
      }
    });
    if (!lab) {
      res.status(404).json({ message: 'Laboratorio no encontrado' });
      return;
    }
    res.json(lab);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el laboratorio' });
  }
};

export const createLab = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, description, location, capacity, responsible } = req.body;
    const lab = await prisma.lab.create({
      data: {
        name,
        code,
        description,
        location,
        capacity: parseInt(capacity),
        responsible
      }
    });
    res.status(201).json(lab);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el laboratorio' });
  }
};

export const updateLab = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, code, description, location, capacity, responsible, isActive } = req.body;
    const lab = await prisma.lab.update({
      where: { id },
      data: {
        name,
        code,
        description,
        location,
        capacity: parseInt(capacity),
        responsible,
        isActive
      }
    });
    res.json(lab);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el laboratorio' });
  }
};

export const deleteLab = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.lab.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el laboratorio' });
  }
};