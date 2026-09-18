// Responsable: Violet Fernanda Gutierrez Reyes - Frontend

// Formatea una fecha al estilo "15 Mar 2026"
export const formatDate = (date) => {
  if (!date) return 'No especificada';
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleDateString('es-ES', { month: 'short' });
  const monthCap = month.charAt(0).toUpperCase() + month.slice(1, 3);
  const year = d.getFullYear();
  return `${day} ${monthCap} ${year}`;
};

// Formatea una fecha con hora
export const formatDateTime = (date) => {
  if (!date) return 'No especificada';
  return new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Retorna el tiempo relativo: "Hace 5 min", "Ayer", etc.
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const created = new Date(date);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} dias`;
  return created.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
};