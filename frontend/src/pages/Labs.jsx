// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Labs() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const canManage = user?.role === 'ADMIN';

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const response = await axios.get('/api/labs');
      setLabs(response.data);
    } catch (error) {
      console.error('Error al cargar laboratorios:', error);
      showToast('Error al cargar laboratorios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lab) => {
    if (!confirm(`Estas seguro de eliminar "${lab.name}"?`)) return;
    try {
      await axios.delete(`/api/labs/${lab.id}`);
      showToast('Laboratorio eliminado correctamente', 'success');
      fetchLabs();
    } catch (error) {
      console.error('Error al eliminar:', error);
      showToast('Error al eliminar el laboratorio', 'error');
    }
  };

  const getLabIcon = (name) => {
    const lower = name?.toLowerCase() || '';
    if (lower.includes('red') || lower.includes('network')) return 'router';
    if (lower.includes('quimic') || lower.includes('chemistry')) return 'science';
    if (lower.includes('comput') || lower.includes('sistema')) return 'computer';
    return 'biotech';
  };

  const filteredLabs = labs.filter((lab) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      lab.name?.toLowerCase().includes(search) ||
      lab.description?.toLowerCase().includes(search) ||
      lab.code?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant">Cargando laboratorios...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSearch={false}>
      <div className="flex justify-between items-end mb-xl flex-wrap gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
            Gestion de Laboratorios
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">
            Vista general de espacios de investigacion y docencia.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => navigate('/labs/register')}
            className="bg-primary-container text-on-primary hover:opacity-90 transition-opacity px-lg py-sm rounded-lg font-label-md text-label-md flex items-center gap-xs shadow-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Agregar Laboratorio
          </button>
        )}
      </div>

      <div className="mb-lg max-w-md">
        <div className="relative flex items-center w-full h-10 rounded-lg focus-within:shadow-lg bg-surface-container overflow-hidden border border-outline-variant">
          <div className="grid place-items-center h-full w-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">search</span>
          </div>
          <input
            className="peer h-full w-full outline-none text-sm text-on-surface bg-transparent pr-2"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar laboratorios, activos..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {filteredLabs.length === 0 ? (
          <div className="col-span-full bg-surface-container-lowest border border-outline-variant rounded-xl p-lg text-center">
            <span className="material-symbols-outlined text-outline text-[48px] mb-sm">biotech</span>
            <p className="text-on-surface-variant">
              {searchTerm ? 'No se encontraron laboratorios' : 'No hay laboratorios registrados'}
            </p>
          </div>
        ) : (
          filteredLabs.map((lab) => {
            const incidentCount = lab._count?.incidents || 0;
            const assetCount = lab._count?.assets || 0;
            const hasIncidents = incidentCount > 0;
            return (
              <div
                key={lab.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm hover:shadow-md transition-shadow relative group"
              >
                {canManage && (
                  <div className="absolute top-md right-md opacity-0 group-hover:opacity-100 transition-opacity flex gap-xs">
                    <button
                      onClick={() => navigate(`/labs/edit/${lab.id}`)}
                      className="p-xs rounded bg-surface-container hover:bg-surface-variant text-primary transition-colors"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(lab)}
                      className="p-xs rounded bg-surface-container hover:bg-error-container text-error transition-colors"
                      title="Eliminar"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-start mb-md">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      {lab.name}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {lab.description || 'Sin descripcion'}
                    </p>
                  </div>
                  <div className="bg-surface-container-low text-primary p-xs rounded">
                    <span className="material-symbols-outlined">{getLabIcon(lab.name)}</span>
                  </div>
                </div>

                <div className="mt-auto pt-md border-t border-outline-variant grid grid-cols-2 gap-sm">
                  <div className="bg-surface-bright p-sm rounded-lg border border-outline-variant/50">
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">
                      Activos Registrados
                    </p>
                    <p className="font-headline-sm text-headline-sm text-primary font-bold">
                      {assetCount}
                    </p>
                  </div>

                  {hasIncidents ? (
                    <div className="bg-error-container/20 p-sm rounded-lg border border-error-container">
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">
                        Incidentes Abiertos
                      </p>
                      <div className="flex items-center gap-xs text-error font-bold font-headline-sm text-headline-sm">
                        <span>{incidentCount}</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontSize: '16px' }}>warning</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-surface-bright p-sm rounded-lg border border-outline-variant/50">
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">
                        Incidentes Abiertos
                      </p>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {incidentCount}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}