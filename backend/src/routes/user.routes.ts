// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getTechnicians,
  updateProfile,
  updatePassword
} from '../controllers/user.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, roleMiddleware(['ADMIN']), getUsers);
router.get('/technicians', authMiddleware, getTechnicians);
router.get('/:id', authMiddleware, roleMiddleware(['ADMIN']), getUserById);
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, updatePassword);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteUser);

export default router;