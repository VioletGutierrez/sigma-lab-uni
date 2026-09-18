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

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Incidentes
 *   description: Gestion de incidentes en laboratorios
 */

/**
 * @swagger
 * /api/incidents:
 *   get:
 *     tags: [Incidentes]
 *     summary: Listar todos los incidentes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de incidentes
 *   post:
 *     tags: [Incidentes]
 *     summary: Crear un nuevo incidente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, problemType, assetId, labId]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               problemType:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *               assetId:
 *                 type: string
 *               labId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Incidente creado
 */
router.get('/', authMiddleware, getIncidents);
router.post('/', authMiddleware, createIncident);

/**
 * @swagger
 * /api/incidents/my:
 *   get:
 *     tags: [Incidentes]
 *     summary: Obtener mis incidentes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mis incidentes
 */
router.get('/my', authMiddleware, getMyIncidents);

/**
 * @swagger
 * /api/incidents/workload:
 *   get:
 *     tags: [Incidentes]
 *     summary: Carga de trabajo de tecnicos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tecnicos con su carga
 */
router.get('/workload', authMiddleware, roleMiddleware(['ADMIN']), getTechnicianWorkload);

/**
 * @swagger
 * /api/incidents/{id}:
 *   get:
 *     tags: [Incidentes]
 *     summary: Obtener detalle de un incidente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del incidente
 *   put:
 *     tags: [Incidentes]
 *     summary: Actualizar un incidente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Incidente actualizado
 */
router.get('/:id', authMiddleware, getIncidentById);
router.put('/:id', authMiddleware, updateIncident);

/**
 * @swagger
 * /api/incidents/{id}/assign:
 *   patch:
 *     tags: [Incidentes]
 *     summary: Asignar tecnico a un incidente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tecnico asignado
 */
router.patch('/:id/assign', authMiddleware, roleMiddleware(['ADMIN', 'TECHNICIAN']), assignTechnician);

/**
 * @swagger
 * /api/incidents/{id}/auto-assign:
 *   patch:
 *     tags: [Incidentes]
 *     summary: Asignar automaticamente al tecnico con menos carga
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tecnico asignado automaticamente
 */
router.patch('/:id/auto-assign', authMiddleware, roleMiddleware(['ADMIN']), autoAssignIncident);

/**
 * @swagger
 * /api/incidents/{id}/status:
 *   patch:
 *     tags: [Incidentes]
 *     summary: Actualizar el estado del incidente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch('/:id/status', authMiddleware, roleMiddleware(['ADMIN', 'TECHNICIAN']), updateStatus);

/**
 * @swagger
 * /api/incidents/{id}/close:
 *   patch:
 *     tags: [Incidentes]
 *     summary: Cerrar un incidente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Incidente cerrado
 */
router.patch('/:id/close', authMiddleware, roleMiddleware(['ADMIN', 'TECHNICIAN']), closeIncident);

export default router;