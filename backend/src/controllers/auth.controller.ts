// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { generateToken } from '../utils/jwt';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciales invalidas' });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Credenciales invalidas' });
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
    const { password: _, ...userData } = user;
    res.json({ token, user: userData });
  } catch (error) {
    console.error("---> ERROR EN LOGIN:", error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, role } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'El correo ya esta registrado' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, fullName, role }
    });
    const { password: _, ...userData } = user;
    res.status(201).json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, fullName: true, role: true, isActive: true, lastLogin: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });
    const newToken = generateToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Token invalido' });
  }
};