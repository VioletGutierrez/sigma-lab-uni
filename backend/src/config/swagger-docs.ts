// Responsable: Edith de los Angeles Munguia Morales - Backend
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerPaths } from './swagger-docs';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIGMA-LAB UNI API',
      version: '1.0.0',
      description: 'API REST para el Sistema de Gestion de Mantenimiento e Incidentes de Laboratorios UNI-RUSB',
      contact: { name: 'Edith Munguia', email: 'edith.munguia@uni.edu.ni' }
    },
    servers: [{ url: 'http://localhost:4000', description: 'Development server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }],
    paths: swaggerPaths
  },
  apis: []
};

export const swaggerSpec = swaggerJsdoc(options);