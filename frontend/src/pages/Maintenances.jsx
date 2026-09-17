// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import axios from 'axios';

export default function Maintenances() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [maintenances, setMaintenances] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    labId: ''
  });
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [maintenancesRes, labsRes] = await Promise.all([
        axios.get('/api/maintenances'),
        axios.get('/api/labs')
      ]);
      setMaintenances(maintenancesRes.data);
      setLabs(labsRes.data);
    } catch (error) {
      console.error('Error al cargar mantenimientos:', error);
      showToast('Error al cargar mantenimientos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (maintenance) => {
    setOpenMenuId(null);
    if (!confirm(`Marcar como completado el mantenimiento ${maintenance.code}?`)) return;
    try {
      await axios.patch(`/api/maintenances/${maintenance.id}/complete`, {
        activities: maintenance.activities || 'Completado desde el panel',
        observations: maintenance.observations || ''
      });
      showToast(`Mantenimiento ${maintenance.code} completado correctamente`, 'success');
      fetchData();
    } catch (error) {
      console.error('Error al completar:', error);
      showToast('Error al completar el mantenimiento', 'error');
    }
  };

  const handleDelete = async (maintenance) => {
    setOpenMenuId(null);
    if (!confirm(`Eliminar el mantenimiento ${maintenance.code}?`)) return;
    try {
      await axios.delete(`/api/maintenances/${maintenance.id}`);
      showToast(`Mantenimiento ${maintenance.code} eliminado correctamente`, 'success');
      fetchData();
    } catch (error) {
      console.error('Error al eliminar:', error);
      showToast('Error al eliminar el mantenimiento', 'error');
    }
  };

  const handleViewDetail = (maintenance) => {
    setOpenMenuId(null);
    showToast(`Mantenimiento ${maintenance.code} - ${maintenance.title}`, 'info');
  };

  const getTypeChip = (type) => {
    const map = {
      PREVENTIVE: { class: 'bg-[#ecfdf5] text-[#047857]', label: 'Preventivo' },
      CORRECTIVE: { class: 'bg-error-container text-on-error-container', label: 'Correctivo' },
      PREDICTIVE: { class: 'bg-[#f5f3ff] text-[#6b38d4]', label: 'Predictivo' }
    };
    return map[type] || { class: 'bg-surface-variant text-on-surface-variant', label: type };
  };

  const getStatusChip = (status) => {
    const map = {
      SCHEDULED: { class: 'bg-[#dbeafe] text-[#1e40af]', label: 'Programado' },
      IN_PROGRESS: { class: 'bg-[#fef3c7] text-[#92400e]', label: 'En progreso' },
      COMPLETED: { class: 'bg-[#dcfce7] text-[#166534]', label: 'Completado' },
      CANCELLED: { class: 'bg-surface-variant text-on-surface-variant', label: 'Cancelado' }
    };
    return map[status] || { class: 'bg-surface-variant text-on-surface-variant', label: status };
  };

  const formatDate = (date) => {
    if (!date) return 'No programada';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleDateString('es-ES', { month: 'short' });
    const monthCap = month.charAt(0).toUpperCase() + month.slice(1, 3);
    const year = d.getFullYear();
    return `${day} ${monthCap} ${year}`;
  };

  const filteredMaintenances = maintenances.filter((m) => {
    if (filters.search && !m.asset?.code?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.type && m.type !== filters.type) return false;
    if (filters.labId && m.asset?.lab?.id !== filters.labId) return false;
    return true;
  });

  const scheduledCount = maintenances.filter(m => m.status === 'SCHEDULED').length;
  const completedCount = maintenances.filter(m => m.status === 'COMPLETED').length;
  const inProgressCount = maintenances.filter(m => m.status === 'IN_PROGRESS').length;

  // Calendario del mes actual
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const currentMonthCap = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const today = currentDate.getDate();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant">Cargando mantenimientos...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSearch={false}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mb-xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Mantenimientos</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            Gestion y programacion de intervenciones.
          </p>
        </div>
        <button
          onClick={() => navigate('/maintenances/register')}
          className="bg-primary text-on-primary font-label-md text-label-md py-sm px-md rounded-lg flex items-center justify-center gap-sm shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <span className="material-symbols-outlined">add</span>
          Programar mantenimiento
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg">
        <div className="xl:col-span-8 flex flex-col gap-lg">
          <div className="bg-white p-lg rounded-xl shadow-sm border border-outline-variant">
            <div className="flex flex-wrap gap-md items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">
                  Buscar activo
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-xl pr-sm py-sm bg-white border border-slate-200 rounded-lg font-body-sm text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-shadow"
                    placeholder="Ej. AC-012"
                  />
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">
                  Tipo
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full sm:w-auto px-md py-sm bg-white border border-slate-200 rounded-lg font-body-sm text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-shadow"
                >
                  <option value="">Todos los tipos</option>
                  <option value="PREVENTIVE">Preventivo</option>
                  <option value="CORRECTIVE">Correctivo</option>
                  <option value="PREDICTIVE">Predictivo</option>
                </select>
              </div>

              <div className="w-full sm:w-auto">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">
                  Laboratorio
                </label>
                <select
                  value={filters.labId}
                  onChange={(e) => setFilters({ ...filters, labId: e.target.value })}
                  className="w-full sm:w-auto px-md py-sm bg-white border border-slate-200 rounded-lg font-body-sm text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-shadow"
                >
                  <option value="">Todos</option>
                  {labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>{lab.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-visible flex-1">
            <div className="p-lg border-b border-slate-100">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Proximos mantenimientos
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-md font-label-md text-label-md text-on-surface-variant font-semibold">Activo</th>
                    <th className="p-md font-label-md text-label-md text-on-surface-variant font-semibold">Ubicacion</th>
                    <th className="p-md font-label-md text-label-md text-on-surface-variant font-semibold">Fecha</th>
                    <th className="p-md font-label-md text-label-md text-on-surface-variant font-semibold">Tipo</th>
                    <th className="p-md font-label-md text-label-md text-on-surface-variant font-semibold">Estado</th>
                    <th className="p-md font-label-md text-label-md text-on-surface-variant font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaintenances.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-lg text-center text-on-surface-variant">
                        No hay mantenimientos programados
                      </td>
                    </tr>
                  ) : (
                    filteredMaintenances.map((m) => {
                      const typeInfo = getTypeChip(m.type);
                      const statusInfo = getStatusChip(m.status);
                      return (
                        <tr key={m.id} className="border-b border-slate-100 hover:bg-[#F5F3FF] transition-colors">
                          <td className="p-md">
                            <div className="font-body-sm text-body-sm font-medium text-on-surface">
                              {m.asset?.code || 'Sin activo'}
                            </div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">
                              {m.asset?.name || '-'}
                            </div>
                          </td>
                          <td className="p-md font-body-sm text-body-sm text-on-surface-variant">
                            {m.asset?.lab?.name || 'Sin lab'}
                          </td>
                          <td className="p-md">
                            <div className="font-body-sm text-body-sm text-on-surface">
                              {formatDate(m.scheduledDate)}
                            </div>
                          </td>
                          <td className="p-md">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full ${typeInfo.class} font-label-sm text-label-sm`}>
                              {typeInfo.label}
                            </span>
                          </td>
                          <td className="p-md">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full ${statusInfo.class} font-label-sm text-label-sm`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="p-md relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === m.id ? null : m.id)}
                              className="text-secondary hover:text-primary transition-colors p-xs rounded hover:bg-surface-variant"
                            >
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>

                            {openMenuId === m.id && (
                              <div className="absolute right-md top-full mt-xs bg-surface-container-lowest rounded-lg shadow-lg border border-outline-variant overflow-hidden z-50 min-w-[180px]">
                                <button
                                  onClick={() => handleViewDetail(m)}
                                  className="w-full text-left px-md py-sm hover:bg-surface-container-low transition-colors font-body-sm text-body-sm text-on-surface flex items-center gap-sm"
                                >
                                  <span className="material-symbols-outlined text-[18px] text-primary">visibility</span>
                                  Ver detalle
                                </button>
                                {m.status !== 'COMPLETED' && (
                                  <button
                                    onClick={() => handleComplete(m)}
                                    className="w-full text-left px-md py-sm hover:bg-surface-container-low transition-colors font-body-sm text-body-sm text-on-surface flex items-center gap-sm border-t border-outline-variant"
                                  >
                                    <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                                    Marcar completado
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(m)}
                                  className="w-full text-left px-md py-sm hover:bg-error-container transition-colors font-body-sm text-body-sm text-error flex items-center gap-sm border-t border-outline-variant"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                  Eliminar
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-lg">
          <div className="bg-white p-lg rounded-xl shadow-sm border border-outline-variant">
            <div className="flex justify-between items-center mb-md border-b border-slate-100 pb-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                {currentMonthCap}
              </h3>
              <div className="flex gap-xs">
                <button className="p-xs text-on-surface-variant hover:bg-slate-50 rounded">
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button className="p-xs text-on-surface-variant hover:bg-slate-50 rounded">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-xs text-center mb-sm">
              <div className="font-label-sm text-label-sm text-on-surface-variant">L</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">M</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">X</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">J</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">V</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">S</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">D</div>
            </div>
            <div className="grid grid-cols-7 gap-xs text-center font-body-sm text-body-sm">
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="p-xs text-slate-300"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isToday = day === today;
                return (
                  <div
                    key={day}
                    className={`p-xs ${isToday ? 'bg-primary-container text-on-primary rounded-full font-medium' : ''}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant">
            <h4 className="font-label-md text-label-md text-on-surface-variant mb-md uppercase tracking-wider">
              Resumen
            </h4>
            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm text-on-surface">Programados</span>
                <span className="font-headline-sm text-headline-sm text-primary font-semibold">
                  {scheduledCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm text-on-surface">Completados</span>
                <span className="font-headline-sm text-headline-sm text-emerald-600 font-semibold">
                  {completedCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm text-on-surface">En progreso</span>
                <span className="font-headline-sm text-headline-sm text-amber-600 font-semibold">
                  {inProgressCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}