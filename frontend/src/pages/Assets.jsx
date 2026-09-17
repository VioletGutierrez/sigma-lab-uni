// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Assets() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    riskLevel: '',
    labId: '',
    search: ''
  });

  const canManage = user?.role === 'ADMIN';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetsRes, labsRes] = await Promise.all([
        axios.get('/api/assets'),
        axios.get('/api/labs')
      ]);
      setAssets(assetsRes.data);
      setLabs(labsRes.data);
    } catch (error) {
      console.error('Error al cargar activos:', error);
      showToast('Error al cargar activos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (asset) => {
    if (!confirm(`Estas seguro de eliminar "${asset.name}"?`)) return;
    try {
      await axios.delete(`/api/assets/${asset.id}`);
      showToast('Activo eliminado correctamente', 'success');
      fetchData();
    } catch (error) {
      console.error('Error al eliminar:', error);
      showToast('Error al eliminar el activo', 'error');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getRiskChip = (risk) => {
    const map = {
      LOW: { class: 'bg-[#dcfce7] text-[#166534]', label: 'Bajo' },
      MEDIUM: { class: 'bg-surface-variant text-on-surface-variant', label: 'Medio' },
      HIGH: { class: 'bg-error-container text-on-error-container', label: 'Alto' },
      CRITICAL: { class: 'bg-error text-on-error', label: 'Critico' }
    };
    return map[risk] || { class: 'bg-surface-variant', label: risk };
  };

  const getStatusChip = (status) => {
    const map = {
      OPERATIONAL: { class: 'bg-[#dcfce7] text-[#166534]', label: 'Operativo' },
      MAINTENANCE: { class: 'bg-surface-variant text-on-surface-variant', label: 'Mantenimiento' },
      REPAIR: { class: 'bg-error-container text-on-error-container', label: 'En reparacion' },
      DISPOSED: { class: 'bg-surface-container text-outline', label: 'Descartado' }
    };
    return map[status] || { class: 'bg-surface-variant', label: status };
  };

  const getAssetIcon = (name) => {
    const lower = name?.toLowerCase() || '';
    if (lower.includes('aire') || lower.includes('ac')) return 'ac_unit';
    if (lower.includes('proyector')) return 'videocam';
    if (lower.includes('impresora')) return 'print';
    if (lower.includes('router') || lower.includes('switch')) return 'router';
    return 'computer';
  };

  const filteredAssets = assets.filter((asset) => {
    if (filters.status && asset.status !== filters.status) return false;
    if (filters.riskLevel && asset.riskLevel !== filters.riskLevel) return false;
    if (filters.labId && asset.labId !== filters.labId) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        asset.name?.toLowerCase().includes(search) ||
        asset.code?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant">Cargando activos...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSearch={false}>
      <div className="flex justify-between items-end mb-lg flex-wrap gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-xs">
            Activos
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Inventario y gestion de equipos de laboratorio.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => navigate('/assets/register')}
            className="bg-primary-container text-on-primary rounded-lg px-md py-sm font-label-md text-label-md flex items-center gap-sm hover:bg-primary transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Nuevo Activo
          </button>
        )}
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-lg mb-xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-md">
          <div className="flex flex-col">
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Buscar</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Codigo o nombre..."
              className="w-full p-sm rounded border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none font-body-sm text-body-sm text-on-surface"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Estado</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-sm rounded border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none font-body-sm text-body-sm text-on-surface"
            >
              <option value="">Todos</option>
              <option value="OPERATIONAL">Operativo</option>
              <option value="MAINTENANCE">Mantenimiento</option>
              <option value="REPAIR">Reparacion</option>
              <option value="DISPOSED">Descartado</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Riesgo</label>
            <select
              name="riskLevel"
              value={filters.riskLevel}
              onChange={handleFilterChange}
              className="w-full p-sm rounded border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none font-body-sm text-body-sm text-on-surface"
            >
              <option value="">Todos</option>
              <option value="LOW">Bajo</option>
              <option value="MEDIUM">Medio</option>
              <option value="HIGH">Alto</option>
              <option value="CRITICAL">Critico</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Laboratorio</label>
            <select
              name="labId"
              value={filters.labId}
              onChange={handleFilterChange}
              className="w-full p-sm rounded border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none font-body-sm text-body-sm text-on-surface"
            >
              <option value="">Todos</option>
              {labs.map((lab) => (
                <option key={lab.id} value={lab.id}>{lab.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => setFilters({ status: '', riskLevel: '', labId: '', search: '' })}
              className="w-full p-sm rounded border border-outline-variant bg-surface-container hover:bg-surface-variant font-label-sm text-label-sm text-on-surface-variant transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Codigo</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant">Equipo</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant">Laboratorio</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant">Estado</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant">Riesgo</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-background">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-lg px-md text-center text-on-surface-variant">
                    No hay activos que coincidan con los filtros
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const riskInfo = getRiskChip(asset.riskLevel);
                  const statusInfo = getStatusChip(asset.status);
                  return (
                    <tr key={asset.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                      <td className="py-md px-md font-body-md text-body-md font-medium">{asset.code}</td>
                      <td className="py-md px-md">
                        <div className="flex items-center gap-sm">
                          <span className="material-symbols-outlined text-primary text-[20px]">
                            {getAssetIcon(asset.name)}
                          </span>
                          <span>{asset.name}</span>
                        </div>
                      </td>
                      <td className="py-md px-md text-on-surface-variant">{asset.lab?.name || 'Sin lab'}</td>
                      <td className="py-md px-md">
                        <span className={`inline-flex items-center px-sm py-xs rounded-full ${statusInfo.class} font-label-sm text-label-sm`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-md px-md">
                        <span className={`inline-flex items-center px-sm py-xs rounded-full ${riskInfo.class} font-label-sm text-label-sm`}>
                          {riskInfo.label}
                        </span>
                      </td>
                      <td className="py-md px-md text-right whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/assets/${asset.id}`)}
                          className="text-primary hover:text-primary-container bg-surface-container hover:bg-surface-variant px-sm py-xs rounded font-label-md text-label-md transition-colors mr-xs"
                          title="Ver detalle"
                        >
                          Ver
                        </button>
                        {canManage && (
                          <>
                            <button
                              onClick={() => navigate(`/assets/edit/${asset.id}`)}
                              className="text-primary hover:text-primary-container p-xs rounded hover:bg-surface-variant transition-colors"
                              title="Editar"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(asset)}
                              className="text-error hover:text-on-error-container p-xs rounded hover:bg-error-container transition-colors"
                              title="Eliminar"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </>
                        )}
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
            Mostrando {filteredAssets.length} de {assets.length} activos
          </span>
        </div>
      </div>
    </Layout>
  );
}