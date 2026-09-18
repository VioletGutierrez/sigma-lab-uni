// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Router } from 'express';
import {
  getMaintenances,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  completeMaintenance
} from '../controllers/maintenance.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createMaintenanceSchema,
  completeMaintenanceSchema
} from '../validators/maintenance.validator';

const router = Router();

router.get('/', authMiddleware, getMaintenances);
router.get('/:id', authMiddleware, getMaintenanceById);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN', 'TECHNICIAN']),
  validate(createMaintenanceSchema),
  createMaintenance
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'TECHNICIAN']),
  updateMaintenance
);

router.patch(
  '/:id/complete',
  authMiddleware,
  roleMiddleware(['ADMIN', 'TECHNICIAN']),
  validate(completeMaintenanceSchema),
  completeMaintenance
);

router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteMaintenance);

export default router;