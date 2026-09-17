// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import axios from 'axios';

export default function RegisterMaintenance() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [assets, setAssets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    assetId: location.state?.assetId || '',
    type: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    performedBy: user?.role === 'TECHNICIAN' ? user.id : '',
    title: '',
    activities: '',
    observations: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsRes, techsRes] = await Promise.all([
          axios.get('/api/assets'),
          axios.get('/api/users/technicians').catch(() => ({ data: [] }))
        ]);
        setAssets(assetsRes.data);
        setTechnicians(techsRes.data || []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        showToast('Error al cargar los datos', 'error');
      }
    };
    fetchData();
  }, [showToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assetId || !formData.type || !formData.performedBy || !formData.title) {
      showToast('Por favor completa los campos obligatorios', 'warning');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/maintenances', {
        ...formData,
        scheduledDate: new Date(formData.scheduledDate).toISOString()
      });
      showToast('Mantenimiento programado correctamente', 'success');
      setTimeout(() => navigate('/maintenances'), 1000);
    } catch (error) {
      console.error('Error al guardar:', error);
      showToast(error.response?.data?.message || 'Error al guardar el mantenimiento', 'error');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/maintenances');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-lg">
          <button
            onClick={handleCancel}
            className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md mb-md"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver a Mantenimientos
          </button>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Registrar Mantenimiento
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Complete el formulario para documentar una actividad tecnica.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="assetId">
                  Activo *
                </label>
                <div className="relative">
                  <select
                    id="assetId"
                    name="assetId"
                    value={formData.assetId}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-lowest border border-slate-200 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface appearance-none focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
                  >
                    <option value="">Seleccione un activo...</option>
                    {assets.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.code} - {asset.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-outline">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="type">
                  Tipo de mantenimiento *
                </label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-lowest border border-slate-200 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface appearance-none focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
                  >
                    <option value="">Seleccione el tipo...</option>
                    <option value="PREVENTIVE">Preventivo</option>
                    <option value="CORRECTIVE">Correctivo</option>
                    <option value="PREDICTIVE">Predictivo</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-outline">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="scheduledDate">
                  Fecha
                </label>
                <input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-container-lowest border border-slate-200 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="performedBy">
                  Tecnico responsable *
                </label>
                <div className="relative">
                  <select
                    id="performedBy"
                    name="performedBy"
                    value={formData.performedBy}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-lowest border border-slate-200 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface appearance-none focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
                  >
                    <option value="">Asignar tecnico...</option>
                    {technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.fullName}
                      </option>
                    ))}
                    {user?.role === 'TECHNICIAN' && !technicians.find(t => t.id === user.id) && (
                      <option value={user.id}>{user.fullName} (Yo)</option>
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-outline">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-sm">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="title">
                Titulo del mantenimiento *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej. Limpieza y revision general"
                required
                className="w-full bg-surface-container-lowest border border-slate-200 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
              />
            </div>

            <hr className="border-outline-variant opacity-50" />

            <div className="space-y-sm">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="activities">
                Actividades realizadas
              </label>
              <textarea
                id="activities"
                name="activities"
                value={formData.activities}
                onChange={handleChange}
                placeholder="Describa los procedimientos tecnicos ejecutados..."
                rows="4"
                className="w-full bg-surface-container-lowest border border-slate-200 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface resize-none focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-sm">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="observations">
                Observaciones
              </label>
              <textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                placeholder="Notas adicionales o recomendaciones futuras..."
                rows="3"
                className="w-full bg-surface-container-lowest border border-slate-200 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface resize-none focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
              />
            </div>

            <div className="flex justify-end gap-md pt-md">
              <button
                type="button"
                onClick={handleCancel}
                className="px-lg py-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors bg-transparent"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-lg py-sm rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm flex items-center gap-xs disabled:opacity-50"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  save
                </span>
                {loading ? 'Guardando...' : 'Guardar mantenimiento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}