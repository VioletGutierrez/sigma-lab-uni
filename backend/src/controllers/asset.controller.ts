// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { assetService } from '../services/asset.service';

export const getAssets = async (req: Request, res: Response): Promise<void> => {
  try {
    const assets = await assetService.getAll(req.query);
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener activos' });
  }
};

export const getAssetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const asset = await assetService.getById(req.params.id);
    res.json(asset);
  } catch (error: any) {
    if (error.message === 'Activo no encontrado') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Error al obtener el activo' });
  }
};

export const createAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const asset = await assetService.create(req.body);
    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el activo' });
  }
};

export const updateAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const asset = await assetService.update(req.params.id, req.body);
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el activo' });
  }
};

export const deleteAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    await assetService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el activo' });
  }
};

export const getAssetHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const history = await assetService.getHistory(req.params.id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial' });
  }
};