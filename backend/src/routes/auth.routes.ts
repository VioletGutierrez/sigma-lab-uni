// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Router } from 'express';
import { login, register, getMe, refreshToken } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

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
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: Credenciales invalidas
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Autenticacion]
 *     summary: Registrar un nuevo usuario
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Datos invalidos
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Autenticacion]
 *     summary: Renovar token JWT
 *     responses:
 *       200:
 *         description: Token renovado
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
 *         description: Datos del usuario
 */
router.get('/me', authMiddleware, getMe);

export default router;