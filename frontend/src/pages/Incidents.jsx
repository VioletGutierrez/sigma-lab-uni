// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Incidents() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    labId: '',
    dateFrom: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incidentsRes, labsRes] = await Promise.all([
          axios.get('/api/incidents', { params: filters }),
          axios.get('/api/labs')
        ]);
        setIncidents(incidentsRes.data);
        setLabs(labsRes.data);
      } catch (error) {
        console.error('Error al cargar incidentes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const getStatusChip = (status) => {
    const map = {
      PENDING: { class: 'bg-error-container text-on-error-container', label: 'Pendiente' },
      ASSIGNED: { class: 'bg-secondary-fixed text-on-secondary-fixed-variant', label: 'Asignado' },
      DIAGNOSING: { class: 'bg-secondary-fixed text-on-secondary-fixed-variant', label: 'En Progreso' },
      REPAIRING: { class: 'bg-secondary-fixed text-on-secondary-fixed-variant', label: 'En Progreso' },
      RESOLVED: { class: 'bg-surface-variant text-on-surface-variant', label: 'Resuelto' },
      CLOSED: { class: 'bg-surface-variant text-on-surface-variant', label: 'Cerrado' }
    };
    return map[status] || { class: 'bg-surface-variant text-on-surface-variant', label: status };
  };

  const getPriorityColor = (priority) => {
    const map = {
      LOW: { dot: 'bg-outline', label: 'Baja' },
      MEDIUM: { dot: 'bg-secondary', label: 'Media' },
      HIGH: { dot: 'bg-error', label: 'Alta' },
      CRITICAL: { dot: 'bg-error', label: 'Critica' }
    };
    return map[priority] || { dot: 'bg-outline', label: priority };
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const formatDate = (date) => {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant">Cargando incidentes...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-end mb-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-xs">
            Incidentes
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Gestion y seguimiento de problemas en equipos de laboratorio.
          </p>
        </div>
        <button
          onClick={() => navigate('/report')}
          className="bg-primary-container text-on-primary rounded-lg px-md py-sm font-label-md text-label-md flex items-center gap-sm hover:bg-primary transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Nuevo Incidente
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-lg mb-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <div className="flex flex-col">
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-xs">
              Estado
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-sm rounded border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none font-body-sm text-body-sm text-on-surface"
            >
              <option value="">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="DIAGNOSING">En Progreso</option>
              <option value="RESOLVED">Resuelto</option>
              <option value="CLOSED">Cerrado</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-xs">
              Prioridad
            </label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="w-full p-sm rounded border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none font-body-sm text-body-sm text-on-surface"
            >
              <option value="">Todas</option>
              <option value="HIGH">Alta</option>
              <option value="MEDIUM">Media</option>
              <option value="LOW">Baja</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-xs">
              Laboratorio
            </label>
            <select
              name="labId"
              value={filters.labId}
              onChange={handleFilterChange}
              className="w-full p-sm rounded border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none font-body-sm text-body-sm text-on-surface"
            >
              <option value="">Todos los laboratorios</option>
              {labs.map((lab) => (
                <option key={lab.id} value={lab.id}>{lab.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-xs">
              Fecha Desde
            </label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full p-sm rounded border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none font-body-sm text-body-sm text-on-surface"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant whitespace-nowrap">ID</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant">Equipo</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant">Problema</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant">Laboratorio</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant">Prioridad</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant">Estado</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant text-right">Accion</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-background">
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-lg px-md text-center text-on-surface-variant">
                    No hay incidentes registrados
                  </td>
                </tr>
              ) : (
                incidents.map((incident) => {
                  const statusInfo = getStatusChip(incident.status);
                  const priorityInfo = getPriorityColor(incident.priority);
                  return (
                    <tr key={incident.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                      <td className="py-md px-md font-body-md text-body-md font-medium">
                        {incident.code}
                      </td>
                      <td className="py-md px-md">
                        {incident.asset?.name || 'Sin equipo'}
                      </td>
                      <td className="py-md px-md text-on-surface-variant truncate max-w-xs">
                        {incident.title}
                      </td>
                      <td className="py-md px-md">
                        {incident.lab?.name || 'Sin lab'}
                      </td>
                      <td className="py-md px-md">
                        <div className="flex items-center gap-xs">
                          <span className={`w-2 h-2 rounded-full ${priorityInfo.dot}`}></span>
                          {priorityInfo.label}
                        </div>
                      </td>
                      <td className="py-md px-md">
                        <span className={`inline-flex items-center px-sm py-xs rounded-full ${statusInfo.class} font-label-sm text-label-sm`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-md px-md text-right">
                        <button
                          onClick={() => navigate(`/incidents/${incident.id}`)}
                          className="text-primary hover:text-primary-container bg-surface-container hover:bg-surface-variant px-sm py-xs rounded font-label-md text-label-md transition-colors"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-outline-variant p-sm flex items-center justify-between bg-surface-bright">
          <span className="font-body-sm text-body-sm text-on-surface-variant px-sm">
            Mostrando {incidents.length} incidentes
          </span>
          <div className="flex gap-sm">
            <button
              className="px-md py-xs rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low font-label-sm text-label-sm disabled:opacity-50"
              disabled
            >
              Anterior
            </button>
            <button className="px-md py-xs rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low font-label-sm text-label-sm">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}