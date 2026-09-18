// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Router } from 'express';
import { login, register, getMe, refreshToken } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticacion
 *   description: Endpoints de autenticacion de usuarios
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Autenticacion]
 *     summary: Iniciar sesion
 *     description: Autentica un usuario y devuelve un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@uni.edu.ni
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales invalidas
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Autenticacion]
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, fullName, role]
 *             properties:
 *               email:
 *                 type: string
 *                 example: nuevo@uni.edu.ni
 *               password:
 *                 type: string
 *                 example: pass123
 *               fullName:
 *                 type: string
 *                 example: Juan Perez
 *               role:
 *                 type: string
 *                 enum: [STUDENT, TECHNICIAN, ADMIN]
 *                 example: STUDENT
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: El correo ya esta registrado
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Autenticacion]
 *     summary: Renovar token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renovado
 *       401:
 *         description: Token invalido
 */
router.post('/refresh', refreshToken);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Autenticacion]
 *     summary: Obtener el usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario actual
 *       401:
 *         description: Token no proporcionado o invalido
 */
router.get('/me', authMiddleware, getMe);

export default router;