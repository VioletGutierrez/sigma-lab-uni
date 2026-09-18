// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, upload.single('image'), (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subio ningun archivo' });
    }
    const fileUrl = `http://localhost:4000/uploads/${req.file.filename}`;
    res.json({
      message: 'Archivo subido correctamente',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir el archivo' });
  }
});

export default router;