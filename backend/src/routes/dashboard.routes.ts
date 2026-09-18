// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Router } from 'express';
import {
  getDashboardStats,
  getRecentIncidents,
  getCriticalAssets,
  getUpcomingMaintenances,
  getIndicators,
  getFullReport
} from '../controllers/dashboard.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/stats', authMiddleware, getDashboardStats);
router.get('/recent-incidents', authMiddleware, getRecentIncidents);
router.get('/critical-assets', authMiddleware, getCriticalAssets);
router.get('/upcoming-maintenances', authMiddleware, getUpcomingMaintenances);
router.get('/indicators', authMiddleware, getIndicators);
router.get('/full-report', authMiddleware, roleMiddleware(['ADMIN', 'TECHNICIAN']), getFullReport);

export default router;