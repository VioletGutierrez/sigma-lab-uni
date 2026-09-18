// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Router } from 'express';
import { getLabs, getLabById, createLab, updateLab, deleteLab } from '../controllers/lab.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getLabs);
router.get('/:id', authMiddleware, getLabById);
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), createLab);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), updateLab);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteLab);

export default router;