// Responsable: Violet Fernanda Gutierrez Reyes - Frontend

// Informacion del sistema
export const APP_INFO = {
  name: 'SIGMA-LAB UNI',
  fullName: 'Sistema Integral de Gestion de Mantenimiento e Incidentes de Laboratorios',
  subtitle: 'Plataforma Web para la Gestion Preventiva y Predictiva',
  version: '1.0.0',
  organization: 'Universidad Nacional de Ingenieria (UNI)',
  campus: 'Recinto Universitario Simon Bolivar',
  year: 2026
};

// Roles del sistema
export const ROLES = {
  STUDENT: 'STUDENT',
  TECHNICIAN: 'TECHNICIAN',
  ADMIN: 'ADMIN'
};

// Estados de incidentes
export const INCIDENT_STATUS = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  DIAGNOSING: 'DIAGNOSING',
  REPAIRING: 'REPAIRING',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
};

// Prioridades
export const PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

// Niveles de riesgo
export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

// Tipos de mantenimiento
export const MAINTENANCE_TYPES = {
  PREVENTIVE: 'PREVENTIVE',
  CORRECTIVE: 'CORRECTIVE',
  PREDICTIVE: 'PREDICTIVE'
};

// Estados de mantenimiento
export const MAINTENANCE_STATUS = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// Estados de activos
export const ASSET_STATUS = {
  OPERATIONAL: 'OPERATIONAL',
  MAINTENANCE: 'MAINTENANCE',
  REPAIR: 'REPAIR',
  DISPOSED: 'DISPOSED'
};