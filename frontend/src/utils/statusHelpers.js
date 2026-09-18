// Responsable: Violet Fernanda Gutierrez Reyes - Frontend

// Configuracion de estados de incidentes
export const getIncidentStatusConfig = (status) => {
  const map = {
    PENDING: { class: 'status-preventive', label: 'Abierto' },
    ASSIGNED: { class: 'status-predictive', label: 'Asignado' },
    DIAGNOSING: { class: 'status-predictive', label: 'En diagnostico' },
    REPAIRING: { class: 'status-predictive', label: 'En atencion' },
    RESOLVED: { class: 'bg-slate-100 text-slate-600', label: 'Resuelto' },
    CLOSED: { class: 'bg-slate-100 text-slate-600', label: 'Cerrado' }
  };
  return map[status] || { class: 'bg-slate-100 text-slate-600', label: status };
};

// Configuracion de prioridades
export const getPriorityConfig = (priority) => {
  const map = {
    LOW: { class: '', label: 'Baja', isHigh: false },
    MEDIUM: { class: '', label: 'Media', isHigh: false },
    HIGH: { class: 'text-error font-medium', label: 'Alta', isHigh: true },
    CRITICAL: { class: 'text-error font-medium', label: 'Critica', isHigh: true }
  };
  return map[priority] || { class: '', label: priority, isHigh: false };
};

// Configuracion de niveles de riesgo
export const getRiskConfig = (riskLevel) => {
  const map = {
    LOW: { class: 'bg-[#dcfce7] text-[#166534]', label: 'Bajo' },
    MEDIUM: { class: 'bg-surface-variant text-on-surface-variant', label: 'Medio' },
    HIGH: { class: 'bg-error-container text-on-error-container', label: 'Alto' },
    CRITICAL: { class: 'bg-error text-on-error', label: 'Critico' }
  };
  return map[riskLevel] || { class: 'bg-surface-variant', label: riskLevel };
};

// Configuracion de estados de activos
export const getAssetStatusConfig = (status) => {
  const map = {
    OPERATIONAL: { class: 'bg-[#dcfce7] text-[#166534]', label: 'Operativo' },
    MAINTENANCE: { class: 'bg-surface-variant text-on-surface-variant', label: 'Mantenimiento' },
    REPAIR: { class: 'bg-error-container text-on-error-container', label: 'En reparacion' },
    DISPOSED: { class: 'bg-surface-container text-outline', label: 'Descartado' }
  };
  return map[status] || { class: 'bg-surface-variant', label: status };
};

// Configuracion de tipos de mantenimiento
export const getMaintenanceTypeConfig = (type) => {
  const map = {
    PREVENTIVE: { class: 'bg-[#ecfdf5] text-[#047857]', label: 'Preventivo' },
    CORRECTIVE: { class: 'bg-error-container text-on-error-container', label: 'Correctivo' },
    PREDICTIVE: { class: 'bg-[#f5f3ff] text-[#6b38d4]', label: 'Predictivo' }
  };
  return map[type] || { class: 'bg-surface-variant', label: type };
};

// Configuracion de roles
export const getRoleLabel = (role) => {
  const map = {
    ADMIN: 'Administrador',
    TECHNICIAN: 'Tecnico',
    STUDENT: 'Estudiante/Docente'
  };
  return map[role] || role;
};

// Obtener iniciales de un nombre
export const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join('');
};