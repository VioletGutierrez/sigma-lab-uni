// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import { authService } from '../services/auth.service';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userRepository.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

export const getTechnicians = async (req: Request, res: Response): Promise<void> => {
  try {
    const technicians = await userRepository.findTechnicians();
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tecnicos' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userRepository.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, role, isActive } = req.body;
    const user = await userRepository.update(req.params.id, { fullName, role, isActive });
    const { password, ...userData } = user as any;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await userRepository.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.updateProfile(req.userId, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.updatePassword(req.userId, currentPassword, newPassword);
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Contrasena actual incorrecta') {
      res.status(401).json({ message: error.message });
      return;
    }
    if (error.message === 'Usuario no encontrado') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Error al actualizar la contrasena' });
  }
};