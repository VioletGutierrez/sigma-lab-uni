// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { verifyToken, generateToken } from '../utils/jwt';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Credenciales invalidas') {
      res.status(401).json({ message: error.message });
      return;
    }
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = await authService.register(req.body);
    res.status(201).json(userData);
  } catch (error: any) {
    if (error.message === 'El correo ya esta registrado') {
      res.status(400).json({ message: error.message });
      return;
    }
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.getMe(req.userId);
    res.json(user);
  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    const decoded = verifyToken(token);
    const user = await authService.getMe(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'Usuario no encontrado' });
      return;
    }
    const newToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Token invalido' });
  }
};