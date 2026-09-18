// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Router } from 'express';
import {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  assignTechnician,
  autoAssignIncident,
  updateStatus,
  closeIncident,
  getMyIncidents,
  getTechnicianWorkload
} from '../controllers/incident.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createIncidentSchema,
  updateStatusSchema,
  assignTechnicianSchema
} from '../validators/incident.validator';

const router = Router();

router.get('/', authMiddleware, getIncidents);
router.get('/my', authMiddleware, getMyIncidents);
router.get('/workload', authMiddleware, roleMiddleware(['ADMIN']), getTechnicianWorkload);
router.get('/:id', authMiddleware, getIncidentById);

router.post('/', authMiddleware, validate(createIncidentSchema), createIncident);

router.put('/:id', authMiddleware, updateIncident);

router.patch(
  '/:id/assign',
  authMiddleware,
  roleMiddleware(['ADMIN', 'TECHNICIAN']),
  validate(assignTechnicianSchema),
  assignTechnician
);

router.patch('/:id/auto-assign', authMiddleware, roleMiddleware(['ADMIN']), autoAssignIncident);

router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware(['ADMIN', 'TECHNICIAN']),
  validate(updateStatusSchema),
  updateStatus
);

router.patch('/:id/close', authMiddleware, roleMiddleware(['ADMIN', 'TECHNICIAN']), closeIncident);

export default router;