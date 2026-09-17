// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../components/Toast';
import axios from 'axios';

export default function RegisterAsset() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    brand: '',
    model: '',
    serialNumber: '',
    acquisitionDate: '',
    status: 'OPERATIONAL',
    riskLevel: 'LOW',
    labId: ''
  });
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await axios.get('/api/labs');
        setLabs(response.data);
      } catch (error) {
        console.error('Error al cargar laboratorios:', error);
        showToast('Error al cargar laboratorios', 'error');
      }
    };
    fetchLabs();
  }, [showToast]);

  useEffect(() => {
    if (isEdit) {
      const fetchAsset = async () => {
        try {
          const response = await axios.get(`/api/assets/${id}`);
          const asset = response.data;
          setFormData({
            code: asset.code || '',
            name: asset.name || '',
            brand: asset.brand || '',
            model: asset.model || '',
            serialNumber: asset.serialNumber || '',
            acquisitionDate: asset.acquisitionDate ? asset.acquisitionDate.split('T')[0] : '',
            status: asset.status || 'OPERATIONAL',
            riskLevel: asset.riskLevel || 'LOW',
            labId: asset.labId || ''
          });
        } catch (error) {
          console.error('Error al cargar activo:', error);
          showToast('Error al cargar el activo', 'error');
          navigate('/assets');
        } finally {
          setLoadingData(false);
        }
      };
      fetchAsset();
    }
  }, [id, isEdit, navigate, showToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/api/assets/${id}`, formData);
        showToast('Activo actualizado correctamente', 'success');
      } else {
        await axios.post('/api/assets', formData);
        showToast('Activo creado correctamente', 'success');
      }
      navigate('/assets');
    } catch (error) {
      console.error('Error al guardar:', error);
      showToast(error.response?.data?.message || 'Error al guardar el activo', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant">Cargando activo...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-lg">
          <button
            onClick={() => navigate('/assets')}
            className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md mb-md"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver a Activos
          </button>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            {isEdit ? 'Editar Activo' : 'Nuevo Activo'}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {isEdit
              ? 'Actualiza la informacion del equipo.'
              : 'Registra un nuevo equipo en el inventario de laboratorios.'}
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="code">
                  Codigo *
                </label>
                <input
                  id="code"
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  disabled={isEdit}
                  placeholder="Ej. PC-031"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="name">
                  Nombre del equipo *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Dell OptiPlex 7090"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>

              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="brand">
                  Marca
                </label>
                <input
                  id="brand"
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Ej. Dell"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>

              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="model">
                  Modelo
                </label>
                <input
                  id="model"
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Ej. OptiPlex 7090"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>

              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="serialNumber">
                  Numero de serie
                </label>
                <input
                  id="serialNumber"
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Ej. SN-XXXX"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>

              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="acquisitionDate">
                  Fecha de adquisicion
                </label>
                <input
                  id="acquisitionDate"
                  type="date"
                  name="acquisitionDate"
                  value={formData.acquisitionDate}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>

              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="labId">
                  Laboratorio *
                </label>
                <div className="relative">
                  <select
                    id="labId"
                    name="labId"
                    value={formData.labId}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                  >
                    <option value="">Selecciona un laboratorio</option>
                    {labs.map((lab) => (
                      <option key={lab.id} value={lab.id}>{lab.name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="status">
                  Estado
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                  >
                    <option value="OPERATIONAL">Operativo</option>
                    <option value="MAINTENANCE">En mantenimiento</option>
                    <option value="REPAIR">En reparacion</option>
                    <option value="DISPOSED">Descartado</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              <div className="space-y-sm md:col-span-2">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="riskLevel">
                  Nivel de riesgo
                </label>
                <div className="relative">
                  <select
                    id="riskLevel"
                    name="riskLevel"
                    value={formData.riskLevel}
                    onChange={handleChange}
                    className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                  >
                    <option value="LOW">Bajo</option>
                    <option value="MEDIUM">Medio</option>
                    <option value="HIGH">Alto</option>
                    <option value="CRITICAL">Critico</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-outline-variant opacity-50"></div>

            <div className="flex justify-end gap-md">
              <button
                type="button"
                onClick={() => navigate('/assets')}
                className="px-lg py-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-lg py-sm rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 flex items-center gap-sm"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear activo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}