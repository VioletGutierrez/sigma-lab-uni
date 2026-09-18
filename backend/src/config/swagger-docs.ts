// Responsable: Edith de los Angeles Munguia Morales - Backend
export const swaggerPaths = {
  '/api/auth/login': {
    post: {
      tags: ['Autenticacion'],
      summary: 'Iniciar sesion',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', example: 'admin@uni.edu.ni' },
                password: { type: 'string', example: 'admin123' }
              }
            }
          }
        }
      },
      responses: {
        '200': { description: 'Login exitoso' },
        '401': { description: 'Credenciales invalidas' }
      }
    }
  },
  '/api/auth/register': {
    post: {
      tags: ['Autenticacion'],
      summary: 'Registrar usuario',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                password: { type: 'string' },
                fullName: { type: 'string' },
                role: { type: 'string', enum: ['STUDENT', 'TECHNICIAN', 'ADMIN'] }
              }
            }
          }
        }
      },
      responses: { '201': { description: 'Usuario creado' } }
    }
  },
  '/api/auth/me': {
    get: {
      tags: ['Autenticacion'],
      summary: 'Obtener usuario actual',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Datos del usuario' } }
    }
  },
  '/api/incidents': {
    get: {
      tags: ['Incidentes'],
      summary: 'Listar incidentes',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Lista de incidentes' } }
    },
    post: {
      tags: ['Incidentes'],
      summary: 'Crear incidente',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                problemType: { type: 'string' },
                priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
                assetId: { type: 'string' },
                labId: { type: 'string' }
              }
            }
          }
        }
      },
      responses: { '201': { description: 'Incidente creado' } }
    }
  },
  '/api/incidents/my': {
    get: {
      tags: ['Incidentes'],
      summary: 'Mis incidentes',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Lista de mis incidentes' } }
    }
  },
  '/api/incidents/workload': {
    get: {
      tags: ['Incidentes'],
      summary: 'Carga de trabajo de tecnicos',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Carga por tecnico' } }
    }
  },
  '/api/incidents/{id}': {
    get: {
      tags: ['Incidentes'],
      summary: 'Detalle de incidente',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Detalle del incidente' } }
    },
    put: {
      tags: ['Incidentes'],
      summary: 'Actualizar incidente',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Incidente actualizado' } }
    }
  },
  '/api/incidents/{id}/assign': {
    patch: {
      tags: ['Incidentes'],
      summary: 'Asignar tecnico',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Tecnico asignado' } }
    }
  },
  '/api/incidents/{id}/auto-assign': {
    patch: {
      tags: ['Incidentes'],
      summary: 'Asignacion automatica al tecnico con menos carga',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Tecnico asignado' } }
    }
  },
  '/api/incidents/{id}/status': {
    patch: {
      tags: ['Incidentes'],
      summary: 'Actualizar estado',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Estado actualizado' } }
    }
  },
  '/api/incidents/{id}/close': {
    patch: {
      tags: ['Incidentes'],
      summary: 'Cerrar incidente',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Incidente cerrado' } }
    }
  },
  '/api/assets': {
    get: {
      tags: ['Activos'],
      summary: 'Listar activos',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Lista de activos' } }
    },
    post: {
      tags: ['Activos'],
      summary: 'Crear activo',
      security: [{ bearerAuth: [] }],
      responses: { '201': { description: 'Activo creado' } }
    }
  },
  '/api/assets/{id}': {
    get: {
      tags: ['Activos'],
      summary: 'Detalle de activo',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Detalle del activo' } }
    },
    put: {
      tags: ['Activos'],
      summary: 'Actualizar activo',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Activo actualizado' } }
    },
    delete: {
      tags: ['Activos'],
      summary: 'Eliminar activo',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '204': { description: 'Activo eliminado' } }
    }
  },
  '/api/assets/{id}/history': {
    get: {
      tags: ['Activos'],
      summary: 'Historial del activo',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Historial del activo' } }
    }
  },
  '/api/maintenances': {
    get: {
      tags: ['Mantenimientos'],
      summary: 'Listar mantenimientos',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Lista de mantenimientos' } }
    },
    post: {
      tags: ['Mantenimientos'],
      summary: 'Crear mantenimiento',
      security: [{ bearerAuth: [] }],
      responses: { '201': { description: 'Mantenimiento creado' } }
    }
  },
  '/api/maintenances/{id}': {
    get: {
      tags: ['Mantenimientos'],
      summary: 'Detalle de mantenimiento',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Detalle del mantenimiento' } }
    },
    put: {
      tags: ['Mantenimientos'],
      summary: 'Actualizar mantenimiento',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Mantenimiento actualizado' } }
    },
    delete: {
      tags: ['Mantenimientos'],
      summary: 'Eliminar mantenimiento',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '204': { description: 'Mantenimiento eliminado' } }
    }
  },
  '/api/maintenances/{id}/complete': {
    patch: {
      tags: ['Mantenimientos'],
      summary: 'Completar mantenimiento',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Mantenimiento completado' } }
    }
  },
  '/api/labs': {
    get: {
      tags: ['Laboratorios'],
      summary: 'Listar laboratorios',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Lista de laboratorios' } }
    },
    post: {
      tags: ['Laboratorios'],
      summary: 'Crear laboratorio',
      security: [{ bearerAuth: [] }],
      responses: { '201': { description: 'Laboratorio creado' } }
    }
  },
  '/api/labs/{id}': {
    get: {
      tags: ['Laboratorios'],
      summary: 'Detalle de laboratorio',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Detalle del laboratorio' } }
    },
    put: {
      tags: ['Laboratorios'],
      summary: 'Actualizar laboratorio',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Laboratorio actualizado' } }
    },
    delete: {
      tags: ['Laboratorios'],
      summary: 'Eliminar laboratorio',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '204': { description: 'Laboratorio eliminado' } }
    }
  },
  '/api/users': {
    get: {
      tags: ['Usuarios'],
      summary: 'Listar usuarios',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Lista de usuarios' } }
    }
  },
  '/api/users/technicians': {
    get: {
      tags: ['Usuarios'],
      summary: 'Listar tecnicos',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Lista de tecnicos' } }
    }
  },
  '/api/users/{id}': {
    get: {
      tags: ['Usuarios'],
      summary: 'Detalle de usuario',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Detalle del usuario' } }
    },
    put: {
      tags: ['Usuarios'],
      summary: 'Actualizar usuario',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Usuario actualizado' } }
    },
    delete: {
      tags: ['Usuarios'],
      summary: 'Eliminar usuario',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '204': { description: 'Usuario eliminado' } }
    }
  },
  '/api/users/profile': {
    put: {
      tags: ['Usuarios'],
      summary: 'Actualizar perfil propio',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Perfil actualizado' } }
    }
  },
  '/api/users/password': {
    put: {
      tags: ['Usuarios'],
      summary: 'Cambiar contrasena',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Contrasena actualizada' } }
    }
  },
  '/api/notifications': {
    get: {
      tags: ['Notificaciones'],
      summary: 'Listar notificaciones',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Lista de notificaciones' } }
    }
  },
  '/api/notifications/{id}/read': {
    patch: {
      tags: ['Notificaciones'],
      summary: 'Marcar notificacion como leida',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: { '200': { description: 'Notificacion marcada como leida' } }
    }
  },
  '/api/notifications/read-all': {
    patch: {
      tags: ['Notificaciones'],
      summary: 'Marcar todas como leidas',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Todas marcadas como leidas' } }
    }
  },
  '/api/dashboard/stats': {
    get: {
      tags: ['Dashboard'],
      summary: 'Estadisticas generales',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Estadisticas' } }
    }
  },
  '/api/dashboard/recent-incidents': {
    get: {
      tags: ['Dashboard'],
      summary: 'Incidentes recientes',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Incidentes recientes' } }
    }
  },
  '/api/dashboard/critical-assets': {
    get: {
      tags: ['Dashboard'],
      summary: 'Activos criticos',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Activos criticos' } }
    }
  },
  '/api/dashboard/upcoming-maintenances': {
    get: {
      tags: ['Dashboard'],
      summary: 'Mantenimientos proximos',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Mantenimientos proximos' } }
    }
  },
  '/api/dashboard/indicators': {
    get: {
      tags: ['Dashboard'],
      summary: 'Indicadores del sistema',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Indicadores' } }
    }
  },
  '/api/dashboard/full-report': {
    get: {
      tags: ['Dashboard'],
      summary: 'Reporte completo del sistema',
      security: [{ bearerAuth: [] }],
      responses: { '200': { description: 'Reporte completo' } }
    }
  },
  '/api/upload': {
    post: {
      tags: ['Upload'],
      summary: 'Subir imagen',
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: { image: { type: 'string', format: 'binary' } }
            }
          }
        }
      },
      responses: { '200': { description: 'Imagen subida' } }
    }
  }
};