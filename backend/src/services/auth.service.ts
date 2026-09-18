typescript
// Responsable: Edith de los Angeles Munguia Morales - Backend
import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository';
import { generateToken } from '../utils/jwt';

export const authService = {
  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Credenciales invalidas');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Credenciales invalidas');

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    await userRepository.updateLastLogin(user.id);

    const { password: _, ...userData } = user;
    return { token, user: userData };
  },

  register: async (data: { email: string; password: string; fullName: string; role?: string }) => {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) throw new Error('El correo ya esta registrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      role: data.role || 'STUDENT'
    });

    const { password: _, ...userData } = user;
    return userData;
  },

  getMe: async (userId: string) => {
    return userRepository.findById(userId);
  },

  updateProfile: async (userId: string, data: { fullName?: string; email?: string }) => {
    return userRepository.update(userId, data);
  },

  updatePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const fullUser = await userRepository.findByEmail(user.email);
    if (!fullUser) throw new Error('Usuario no encontrado');

    const isValid = await bcrypt.compare(currentPassword, fullUser.password);
    if (!isValid) throw new Error('Contrasena actual incorrecta');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.update(userId, { password: hashedPassword });

    return { message: 'Contrasena actualizada correctamente' };
  }
};
