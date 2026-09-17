// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../components/Toast';
import axios from 'axios';

export default function RegisterLab() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    location: '',
    capacity: '',
    responsible: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchLab = async () => {
        try {
          const response = await axios.get(`/api/labs/${id}`);
          const lab = response.data;
          setFormData({
            name: lab.name || '',
            code: lab.code || '',
            description: lab.description || '',
            location: lab.location || '',
            capacity: lab.capacity || '',
            responsible: lab.responsible || ''
          });
        } catch (error) {
          console.error('Error al cargar laboratorio:', error);
          showToast('Error al cargar el laboratorio', 'error');
          navigate('/labs');
        } finally {
          setLoadingData(false);
        }
      };
      fetchLab();
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
        await axios.put(`/api/labs/${id}`, formData);
        showToast('Laboratorio actualizado correctamente', 'success');
      } else {
        await axios.post('/api/labs', formData);
        showToast('Laboratorio creado correctamente', 'success');
      }
      navigate('/labs');
    } catch (error) {
      console.error('Error al guardar:', error);
      showToast(error.response?.data?.message || 'Error al guardar el laboratorio', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant">Cargando laboratorio...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-lg">
          <button
            onClick={() => navigate('/labs')}
            className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md mb-md"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver a Laboratorios
          </button>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            {isEdit ? 'Editar Laboratorio' : 'Nuevo Laboratorio'}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {isEdit
              ? 'Actualiza la informacion del laboratorio.'
              : 'Registra un nuevo espacio de investigacion o docencia.'}
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-sm md:col-span-2">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="name">
                  Nombre del laboratorio *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Laboratorio 301"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>

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
                  placeholder="Ej. LAB-301"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>

              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="capacity">
                  Capacidad
                </label>
                <input
                  id="capacity"
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Ej. 30"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>

              <div className="space-y-sm md:col-span-2">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="description">
                  Descripcion
                </label>
                <input
                  id="description"
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ej. Laboratorio de computacion"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>

              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="location">
                  Ubicacion
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ej. Edificio A, Piso 3"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>

              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="responsible">
                  Responsable
                </label>
                <input
                  id="responsible"
                  type="text"
                  name="responsible"
                  value={formData.responsible}
                  onChange={handleChange}
                  placeholder="Ej. Ing. Maria Lopez"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>
            </div>

            <div className="h-px w-full bg-outline-variant opacity-50"></div>

            <div className="flex justify-end gap-md">
              <button
                type="button"
                onClick={() => navigate('/labs')}
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
                {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear laboratorio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}