// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [incident, setIncident] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState('');
  const [solution, setSolution] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incidentRes, techsRes] = await Promise.all([
          axios.get(`/api/incidents/${id}`),
          axios.get('/api/users/technicians').catch(() => ({ data: [] }))
        ]);
        setIncident(incidentRes.data);
        setDiagnosis(incidentRes.data.diagnosis || '');
        setSolution(incidentRes.data.solution || '');
        setTechnicians(techsRes.data || []);
      } catch (error) {
        console.error('Error al cargar incidente:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setSaving(true);
    try {
      await axios.patch(`/api/incidents/${id}/status`, {
        status: newStatus,
        diagnosis: diagnosis || undefined,
        solution: solution || undefined
      });
      const refreshed = await axios.get(`/api/incidents/${id}`);
      setIncident(refreshed.data);
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar el incidente');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSolution = async () => {
    if (!solution.trim()) {
      alert('Debes escribir una solucion');
      return;
    }
    setSaving(true);
    try {
      await axios.patch(`/api/incidents/${id}/status`, {
        status: 'RESOLVED',
        diagnosis,
        solution
      });
      const refreshed = await axios.get(`/api/incidents/${id}`);
      setIncident(refreshed.data);
    } catch (error) {
      console.error('Error al guardar solucion:', error);
      alert('Error al guardar la solucion');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseIncident = async () => {
    if (!solution.trim()) {
      alert('Debes registrar una solucion antes de cerrar');
      return;
    }
    setSaving(true);
    try {
      await axios.patch(`/api/incidents/${id}/close`, { solution });
      const refreshed = await axios.get(`/api/incidents/${id}`);
      setIncident(refreshed.data);
    } catch (error) {
      console.error('Error al cerrar:', error);
      alert('Error al cerrar el incidente');
    } finally {
      setSaving(false);
    }
  };

  const getStatusStep = () => {
    const map = {
      PENDING: 1,
      ASSIGNED: 2,
      DIAGNOSING: 3,
      REPAIRING: 4,
      RESOLVED: 5,
      CLOSED: 6
    };
    return map[incident?.status] || 1;
  };

  const formatDate = (date) => {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant">Cargando incidente...</div>
        </div>
      </Layout>
    );
  }

  if (!incident) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-on-surface-variant">Incidente no encontrado</p>
        </div>
      </Layout>
    );
  }

  const currentStep = getStatusStep();
  const isTechnician = user?.role === 'TECHNICIAN' || user?.role === 'ADMIN';

  const steps = [
    { num: 1, label: 'Reportado', icon: 'check' },
    { num: 2, label: 'Asignado', icon: 'check' },
    { num: 3, label: 'En diagnostico', icon: 'search_insights' },
    { num: 4, label: 'Reparado', icon: 'build' },
    { num: 5, label: 'Cerrado', icon: 'lock_outline' }
  ];

  const breadcrumbs = [
    { label: 'Incidentes', path: '/incidents', active: false },
    { label: `Detalle ${incident.code}`, active: true }
  ];

  return (
    <Layout breadcrumbs={breadcrumbs} showSearch={true}>
      <div className="flex justify-between items-end mb-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs flex items-center gap-md flex-wrap">
            {incident.code}: {incident.title}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f5f3ff] text-secondary font-label-sm text-label-sm border border-[#d0bcff]">
              Prioridad {incident.priority === 'HIGH' ? 'Alta' : incident.priority === 'MEDIUM' ? 'Media' : 'Baja'}
            </span>
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Reportado el {formatDate(incident.createdAt)} por {incident.reporter?.fullName || 'Usuario'}
          </p>
        </div>
        <div className="flex gap-md">
          <button className="bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md px-lg py-2 rounded border border-primary-fixed-dim transition-colors shadow-sm flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">print</span>
            Imprimir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-lg">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-lg">
          <div className="bg-white rounded-xl p-lg border border-outline-variant shadow-sm relative overflow-hidden">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
              Estado del Incidente
            </h3>
            <div className="relative pt-md pb-xs">
              <div className="absolute top-[36px] left-0 w-full h-[2px] bg-surface-container z-0"></div>
              <div
                className="absolute top-[36px] left-0 h-[2px] bg-secondary z-0 transition-all"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              ></div>
              <div className="flex justify-between relative z-10">
                {steps.map((step) => {
                  const isDone = currentStep > step.num;
                  const isActive = currentStep === step.num;
                  return (
                    <div key={step.num} className="flex flex-col items-center gap-xs w-1/5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                          isDone
                            ? 'bg-secondary text-white'
                            : isActive
                            ? 'bg-[#f5f3ff] border-2 border-secondary text-secondary ring-4 ring-[#e9ddff]'
                            : 'bg-surface-container border border-outline-variant text-outline'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isDone ? 'check' : step.icon}
                        </span>
                      </div>
                      <span
                        className={`font-label-sm text-label-sm text-center ${
                          isActive ? 'text-secondary font-bold' : isDone ? 'text-on-surface' : 'text-outline'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-lg">
            <div className="col-span-2 bg-white rounded-xl p-lg border border-outline-variant shadow-sm">
              <h4 className="font-label-md text-label-md text-tertiary mb-sm border-b border-outline-variant pb-xs">
                Descripcion del Problema
              </h4>
              <p className="font-body-md text-body-md text-on-surface">
                {incident.description}
              </p>
            </div>

            <div className="col-span-1 bg-white rounded-xl p-lg border border-outline-variant shadow-sm flex flex-col">
              <h4 className="font-label-md text-label-md text-tertiary mb-sm border-b border-outline-variant pb-xs flex justify-between items-center">
                Diagnostico
                <span className="material-symbols-outlined text-[16px] text-primary">edit_note</span>
              </h4>
              <div className="flex-1 relative group">
                <textarea
                  className="w-full h-full min-h-[120px] bg-transparent border border-outline-variant rounded p-sm resize-none font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Escriba aqui los hallazgos preliminares..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  disabled={!isTechnician}
                />
              </div>
            </div>

            <div className="col-span-1 bg-white rounded-xl p-lg border border-outline-variant shadow-sm flex flex-col">
              <h4 className="font-label-md text-label-md text-tertiary mb-sm border-b border-outline-variant pb-xs flex justify-between items-center">
                Solucion Propuesta
                <span className="material-symbols-outlined text-[16px] text-outline">task_alt</span>
              </h4>
              <div className="flex-1 relative group">
                <textarea
                  className="w-full h-full min-h-[120px] bg-transparent border border-outline-variant rounded p-sm resize-none font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Detalle la solucion aplicada..."
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  disabled={!isTechnician}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
          <div className="bg-white rounded-xl p-lg border border-outline-variant shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container opacity-5 rounded-bl-full pointer-events-none"></div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
              Informacion del Activo
            </h3>
            <div className="space-y-md">
              <div className="flex items-start gap-md">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">desktop_windows</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                    Equipo
                  </p>
                  <p className="font-body-lg text-body-lg text-on-surface font-semibold">
                    {incident.asset?.code}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {incident.asset?.name}
                  </p>
                </div>
              </div>
              <div className="h-[1px] bg-outline-variant w-full"></div>
              <div className="flex items-start gap-md">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-tertiary shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                    Ubicacion
                  </p>
                  <p className="font-body-md text-body-md text-on-surface">
                    {incident.lab?.name}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {incident.lab?.location}
                  </p>
                </div>
              </div>
              <div className="h-[1px] bg-outline-variant w-full"></div>
              <button
                onClick={() => navigate(`/assets/${incident.asset?.id}/history`)}
                className="w-full text-left font-label-md text-label-md text-primary hover:text-primary-container transition-colors flex items-center gap-xs"
              >
                Ver historial de mantenimiento completo
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {isTechnician && (
            <div className="bg-surface-bright rounded-xl p-lg border border-primary-fixed shadow-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
                Acciones Tecnicas
              </h3>
              <div className="space-y-sm">
                <button
                  onClick={() => handleUpdateStatus('DIAGNOSING')}
                  disabled={saving}
                  className="w-full bg-[#f5f3ff] hover:bg-surface-container text-secondary font-label-md text-label-md px-lg py-3 rounded-lg transition-colors flex items-center justify-center gap-sm disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">sync</span>
                  Actualizar estado
                </button>
                <button
                  onClick={handleSaveSolution}
                  disabled={saving}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-lg py-3 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-sm disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  {saving ? 'Guardando...' : 'Registrar solucion'}
                </button>
                <div className="pt-sm">
                  <button
                    onClick={handleCloseIncident}
                    disabled={saving}
                    className="w-full bg-transparent hover:bg-[#fff0f1] text-[#ba1a1a] border border-[#ffdad6] font-label-md text-label-md px-lg py-3 rounded-lg transition-colors flex items-center justify-center gap-sm disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    Cerrar incidente
                  </button>
                  <p className="text-center font-label-sm text-label-sm text-outline mt-2">
                    Requiere solucion registrada
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}