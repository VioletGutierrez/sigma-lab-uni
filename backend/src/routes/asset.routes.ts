// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Router } from 'express';
import {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetHistory
} from '../controllers/asset.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getAssets);
router.get('/:id', authMiddleware, getAssetById);
router.get('/:id/history', authMiddleware, getAssetHistory);
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), createAsset);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), updateAsset);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteAsset);

export default router;