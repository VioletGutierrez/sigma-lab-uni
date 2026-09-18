// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getAssets = async (req: Request, res: Response) => {
  try {
    const { labId, status, riskLevel, search } = req.query;
    const where: any = {};
    if (labId) where.labId = labId;
    if (status) where.status = status;
    if (riskLevel) where.riskLevel = riskLevel;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }
    const assets = await prisma.asset.findMany({
      where,
      include: {
        lab: { select: { id: true, name: true } },
        _count: { select: { incidents: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener activos' });
  }
};

export const getAssetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        lab: { select: { id: true, name: true } },
        _count: { select: { incidents: true } }
      }
    });
    if (!asset) return res.status(404).json({ message: 'Activo no encontrado' });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el activo' });
  }
};

export const createAsset = async (req: Request, res: Response) => {
  try {
    const { name, brand, model, serialNumber, acquisitionDate, labId } = req.body;
    const count = await prisma.asset.count();
    const code = `PC-${String(count + 1).padStart(3, '0')}`;
    const asset = await prisma.asset.create({
      data: {
        code,
        name,
        brand,
        model,
        serialNumber,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
        labId,
        status: 'OPERATIONAL',
        riskLevel: 'LOW'
      }
    });
    await prisma.assetHistory.create({
      data: {
        assetId: asset.id,
        eventType: 'ACQUISITION',
        description: `Activo ${asset.code} registrado: ${asset.name}`
      }
    });
    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el activo' });
  }
};

export const updateAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, brand, model, serialNumber, acquisitionDate, labId, status, riskLevel } = req.body;
    const asset = await prisma.asset.update({
      where: { id },
      data: { name, brand, model, serialNumber, acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null, labId, status, riskLevel }
    });
    await prisma.assetHistory.create({
      data: {
        assetId: asset.id,
        eventType: 'STATUS_CHANGED',
        description: `Activo ${asset.code} actualizado`
      }
    });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el activo' });
  }
};

export const deleteAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.asset.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el activo' });
  }
};

export const getAssetHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const history = await prisma.assetHistory.findMany({
      where: { assetId: id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial' });
  }
};