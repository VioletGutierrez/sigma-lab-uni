// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import axios from 'axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (error) {
      console.error('Error al marcar como leida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch('/api/notifications/read-all');
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error al marcar todas:', error);
    }
  };

  const getNotificationConfig = (type) => {
    const map = {
      INCIDENT_ASSIGNED: {
        icon: 'assignment_late',
        bgClass: 'bg-error-container',
        textClass: 'text-error',
        badgeClass: 'bg-error-container text-on-error-container',
        badgeLabel: 'Critico'
      },
      MAINTENANCE_REMINDER: {
        icon: 'build',
        bgClass: 'bg-surface-container',
        textClass: 'text-primary',
        badgeClass: 'bg-[#DCFCE7] text-[#166534]',
        badgeLabel: 'Preventivo'
      },
      MAINTENANCE_SCHEDULED: {
        icon: 'event',
        bgClass: 'bg-surface-container',
        textClass: 'text-primary',
        badgeClass: 'bg-[#DCFCE7] text-[#166534]',
        badgeLabel: 'Preventivo'
      },
      RISK_ALERT: {
        icon: 'warning',
        bgClass: 'bg-secondary-fixed',
        textClass: 'text-secondary',
        badgeClass: 'bg-secondary-fixed text-secondary',
        badgeLabel: 'Predictivo'
      },
      INCIDENT_UPDATED: {
        icon: 'assignment_late',
        bgClass: 'bg-error-container',
        textClass: 'text-error',
        badgeClass: 'bg-error-container text-on-error-container',
        badgeLabel: 'Actualizado'
      }
    };
    return map[type] || {
      icon: 'notifications',
      bgClass: 'bg-surface-container',
      textClass: 'text-primary',
      badgeClass: 'bg-surface-variant text-on-surface-variant',
      badgeLabel: 'Info'
    };
  };

  const formatRelativeTime = (date) => {
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant">Cargando notificaciones...</div>
        </div>
      </Layout>
    );
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'READ') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Layout showSearch={false}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-lg flex-wrap gap-md">
          <div>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
              Bandeja de Entrada
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              {unreadCount > 0
                ? `Tienes ${unreadCount} ${unreadCount === 1 ? 'notificacion no leida' : 'notificaciones no leidas'}.`
                : 'No tienes notificaciones pendientes.'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="font-label-md text-label-md text-primary bg-[#F5F3FF] px-md py-sm rounded-lg hover:bg-surface-container-high transition-colors"
            >
              Marcar todas como leidas
            </button>
          )}
        </div>

        <div className="flex gap-sm mb-lg flex-wrap">
          {[
            { key: 'ALL', label: 'Todas' },
            { key: 'UNREAD', label: 'No leidas' },
            { key: 'READ', label: 'Leidas' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-md py-sm rounded-lg font-label-md text-label-md transition-colors ${
                filter === tab.key
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-surface rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-xl text-center">
              <span className="material-symbols-outlined text-outline text-[48px] mb-sm">
                notifications_off
              </span>
              <p className="text-on-surface-variant">
                {filter === 'UNREAD'
                  ? 'No tienes notificaciones sin leer'
                  : filter === 'READ'
                  ? 'No tienes notificaciones leidas'
                  : 'No tienes notificaciones'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const config = getNotificationConfig(notification.type);
              const isLast = index === filteredNotifications.length - 1;
              return (
                <div
                  key={notification.id}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                  className={`p-lg ${!isLast ? 'border-b border-slate-100' : ''} hover:bg-[#F5F3FF] transition-colors cursor-pointer group flex items-start gap-lg relative ${
                    !notification.isRead ? 'bg-[#F5F3FF]/30' : ''
                  }`}
                >
                  {!notification.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"></div>
                  )}

                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bgClass} flex items-center justify-center ${config.textClass}`}>
                    <span className="material-symbols-outlined">{config.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-xs gap-sm flex-wrap">
                      <h4 className={`font-body-md text-body-md ${!notification.isRead ? 'font-semibold' : ''} text-on-surface group-hover:text-primary transition-colors`}>
                        {notification.title}
                      </h4>
                      <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {notification.message}
                    </p>
                    <div className="mt-sm flex gap-sm">
                      <span className={`inline-flex items-center px-sm py-xs rounded-md ${config.badgeClass} font-label-sm text-label-sm`}>
                        {config.badgeLabel}
                      </span>
                    </div>
                  </div>

                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-primary">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {filteredNotifications.length > 0 && (
          <div className="flex justify-center mt-lg">
            <button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs">
              Cargar mas notificaciones
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}