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
import { validate } from '../middlewares/validate.middleware';
import { createAssetSchema, updateAssetSchema } from '../validators/asset.validator';

const router = Router();

router.get('/', authMiddleware, getAssets);
router.get('/:id', authMiddleware, getAssetById);
router.get('/:id/history', authMiddleware, getAssetHistory);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validate(createAssetSchema),
  createAsset
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validate(updateAssetSchema),
  updateAsset
);

router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteAsset);

export default router;