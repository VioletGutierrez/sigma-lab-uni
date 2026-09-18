typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import { labRepository } from '../repositories/lab.repository';

export const labService = {
  getAll: async () => {
    return labRepository.findAll();
  },

  getById: async (id: string) => {
    const lab = await labRepository.findById(id);
    if (!lab) throw new Error('Laboratorio no encontrado');
    return lab;
  },

  create: async (data: any) => {
    return labRepository.create({
      ...data,
      capacity: parseInt(String(data.capacity))
    });
  },

  update: async (id: string, data: any) => {
    return labRepository.update(id, {
      ...data,
      capacity: data.capacity ? parseInt(String(data.capacity)) : undefined
    });
  },

  delete: async (id: string) => {
    return labRepository.delete(id);
  }
};
