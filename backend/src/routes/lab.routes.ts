// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Router } from 'express';
import { getLabs, getLabById, createLab, updateLab, deleteLab } from '../controllers/lab.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createLabSchema, updateLabSchema } from '../validators/lab.validator';

const router = Router();

router.get('/', authMiddleware, getLabs);
router.get('/:id', authMiddleware, getLabById);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validate(createLabSchema),
  createLab
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validate(updateLabSchema),
  updateLab
);

router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteLab);

export default router;