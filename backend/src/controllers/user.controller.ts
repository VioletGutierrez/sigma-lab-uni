// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

export const getTechnicians = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'TECHNICIAN', isActive: true },
      select: { id: true, fullName: true, email: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tecnicos' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true
      }
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, role, isActive } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { fullName, role, isActive },
      select: { id: true, email: true, fullName: true, role: true, isActive: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { fullName, email },
      select: { id: true, email: true, fullName: true, role: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      res.status(401).json({ message: 'Contrasena actual incorrecta' });
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword }
    });
    res.json({ message: 'Contrasena actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la contrasena' });
  }
};