typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { assetRepository } from '../repositories/asset.repository';

export const assetService = {
  getAll: async (filters: any) => {
    const where: any = {};
    if (filters.labId) where.labId = filters.labId;
    if (filters.status) where.status = filters.status;
    if (filters.riskLevel) where.riskLevel = filters.riskLevel;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    return assetRepository.findAll(where);
  },

  getById: async (id: string) => {
    const asset = await assetRepository.findById(id);
    if (!asset) throw new Error('Activo no encontrado');
    return asset;
  },

  getHistory: async (assetId: string) => {
    return assetRepository.findHistory(assetId);
  },

  create: async (data: any) => {
    const asset = await assetRepository.create({
      ...data,
      status: data.status || 'OPERATIONAL',
      riskLevel: data.riskLevel || 'LOW',
      acquisitionDate: data.acquisitionDate ? new Date(data.acquisitionDate) : null
    });

    await assetRepository.createHistory({
      assetId: asset.id,
      eventType: 'ACQUISITION',
      description: `Activo ${asset.code} registrado: ${asset.name}`
    });

    return asset;
  },

  update: async (id: string, data: any) => {
    const asset = await assetRepository.update(id, {
      ...data,
      acquisitionDate: data.acquisitionDate ? new Date(data.acquisitionDate) : null
    });

    await assetRepository.createHistory({
      assetId: asset.id,
      eventType: 'STATUS_CHANGED',
      description: `Activo ${asset.code} actualizado`
    });

    return asset;
  },

  delete: async (id: string) => {
    return assetRepository.delete(id);
  }
};
