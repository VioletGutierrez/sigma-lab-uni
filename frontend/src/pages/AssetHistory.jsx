// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import axios from 'axios';

export default function AssetHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [historyRes, assetRes] = await Promise.all([
          axios.get(`/api/assets/${id}/history`),
          axios.get(`/api/assets/${id}`)
        ]);
        setHistory(historyRes.data);
        setAsset(assetRes.data);
      } catch (error) {
        console.error('Error al cargar historial:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id]);

  const getEventConfig = (eventType) => {
    const map = {
      INCIDENT_REPORTED: {
        icon: 'report_problem',
        bgClass: 'bg-error-container',
        textClass: 'text-[#93000a]'
      },
      INCIDENT_RESOLVED: {
        icon: 'report_problem',
        bgClass: 'bg-error-container',
        textClass: 'text-[#93000a]'
      },
      MAINTENANCE_COMPLETED: {
        icon: 'build',
        bgClass: 'bg-[#dcfce7]',
        textClass: 'text-[#166534]'
      },
      MAINTENANCE_SCHEDULED: {
        icon: 'event',
        bgClass: 'bg-surface-variant',
        textClass: 'text-primary'
      },
      ACQUISITION: {
        icon: 'inventory',
        bgClass: 'bg-[#e9ddff]',
        textClass: 'text-[#5516be]'
      },
      STATUS_CHANGED: {
        icon: 'sync',
        bgClass: 'bg-surface-variant',
        textClass: 'text-on-surface-variant'
      }
    };
    return map[eventType] || {
      icon: 'history',
      bgClass: 'bg-surface-variant',
      textClass: 'text-on-surface-variant'
    };
  };

  const getStatusChip = (eventType) => {
    if (eventType.includes('RESOLVED') || eventType.includes('COMPLETED')) {
      return { class: 'bg-[#dcfce7] text-[#166534]', label: 'Completado' };
    }
    if (eventType.includes('REPORTED')) {
      return { class: 'bg-[#fce7f3] text-[#be185d]', label: 'Resuelto' };
    }
    return { class: 'bg-surface-variant text-on-surface-variant', label: 'Registrado' };
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getEventTitle = (eventType) => {
    const map = {
      INCIDENT_REPORTED: 'Problema reportado',
      INCIDENT_RESOLVED: 'Problema de encendido',
      MAINTENANCE_COMPLETED: 'Limpieza y revision',
      MAINTENANCE_SCHEDULED: 'Mantenimiento programado',
      ACQUISITION: 'Adquisicion del activo',
      STATUS_CHANGED: 'Cambio de estado'
    };
    return map[eventType] || eventType;
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-on-surface-variant">Cargando historial...</div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <main className="flex-1 flex flex-col w-full min-h-screen">
        <header className="bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center w-full px-lg h-16 sticky top-0 z-50">
          <div className="flex items-center gap-md">
            <button
              onClick={() => navigate('/')}
              className="font-headline-md text-headline-md font-bold text-primary tracking-tight"
            >
              SIGMA-LAB UNI
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-sm font-label-md text-label-md text-on-surface-variant ml-xl mr-auto">
            <button
              onClick={() => navigate('/assets')}
              className="hover:text-primary transition-colors flex items-center gap-xs"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                inventory_2
              </span>
              Activos
            </button>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              chevron_right
            </span>
            <button
              onClick={() => navigate(`/assets/${id}`)}
              className="hover:text-primary transition-colors"
            >
              {asset?.code}
            </button>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              chevron_right
            </span>
            <span className="text-on-surface font-semibold">Historial</span>
          </nav>

          <div className="flex items-center gap-md">
            <button className="p-sm text-primary hover:bg-surface-container transition-colors rounded-full">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-sm text-primary hover:bg-surface-container transition-colors rounded-full">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
              <img
                alt="Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhQCpH-iPCZl1PfVXg4uCEn7JFxme5FdmfWQansrkkIBwiFcF0J36IJqYqdJrCW0mKvF4Q1eW5wfAKLL7BwrAIFZwjQR3FIlQt2GRSDM8F_5--gZIGjc4jDUZpDCobXnwgyunqtfklmwuCPZ-_tF7oHYBXmNkveXHI1r4jbfC0N3Z1qmpiJ8xx84mumW9JNqyPtcAeXqdNcoZpR8udIbXTFwWb2vzgZMFreH4nby-sLddnWEKy1v_YbA"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 px-md md:px-xxl py-xl md:py-xxxl max-w-5xl mx-auto w-full">
          <div className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant pb-lg">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-surface">
                Historial del Activo
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
                Registro cronologico de eventos para{' '}
                <span className="font-bold text-primary">{asset?.code}</span>
              </p>
            </div>
            <div>
              <button
                onClick={() => navigate(`/assets/${id}`)}
                className="inline-flex items-center gap-sm px-md py-sm bg-[#F5F3FF] text-[#4F46E5] font-label-md text-label-md rounded-lg hover:bg-[#e0e7ff] transition-colors border border-outline-variant/20 shadow-sm"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  arrow_back
                </span>
                Volver al Detalle
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-lg md:p-xl shadow-sm border border-outline-variant/30">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-outline text-[48px] mb-sm">
                  history
                </span>
                <p className="text-on-surface-variant">No hay eventos registrados para este activo.</p>
              </div>
            ) : (
              <div className="relative">
                {history.map((event, index) => {
                  const config = getEventConfig(event.eventType);
                  const statusChip = getStatusChip(event.eventType);
                  const isLast = index === history.length - 1;
                  return (
                    <div
                      key={event.id}
                      className={`relative flex gap-lg ${isLast ? '' : 'pb-xl'}`}
                    >
                      {!isLast && (
                        <div
                          className="absolute left-[23px] top-[72px] bottom-[-24px] w-[2px] bg-outline-variant z-0"
                        ></div>
                      )}
                      <div className="relative flex-shrink-0 mt-sm">
                        <div className={`w-12 h-12 rounded-full ${config.bgClass} ${config.textClass} flex items-center justify-center border-4 border-surface-container-lowest z-10 relative shadow-sm`}>
                          <span className="material-symbols-outlined">{config.icon}</span>
                        </div>
                      </div>
                      <div className="flex-1 pt-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-sm gap-sm">
                          <h3 className="font-headline-sm text-headline-sm text-on-surface">
                            {getEventTitle(event.eventType)}
                          </h3>
                          <div className="flex items-center gap-md">
                            <span className={`inline-flex items-center px-sm py-xs ${statusChip.class} font-label-sm text-label-sm rounded-full`}>
                              <span className="material-symbols-outlined mr-xs" style={{ fontSize: '14px' }}>
                                check_circle
                              </span>
                              {statusChip.label}
                            </span>
                            <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-xs">
                              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                calendar_today
                              </span>
                              {formatDate(event.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="bg-surface p-md rounded-lg border border-outline-variant/50">
                          <p className="font-body-md text-body-md text-on-surface-variant mb-sm">
                            <strong>Tipo:</strong> {event.eventType.replace(/_/g, ' ')}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}