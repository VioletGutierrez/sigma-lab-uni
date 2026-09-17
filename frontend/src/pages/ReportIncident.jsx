// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../components/Toast';
import axios from 'axios';

export default function ReportIncident() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problemType: '',
    priority: 'MEDIUM',
    assetId: '',
    labId: '',
    imageUrl: ''
  });
  const [labs, setLabs] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [labsRes, assetsRes] = await Promise.all([
          axios.get('/api/labs'),
          axios.get('/api/assets')
        ]);
        setLabs(labsRes.data);
        setAssets(assetsRes.data);

        if (location.state?.assetId) {
          const asset = assetsRes.data.find((a) => a.id === location.state.assetId);
          if (asset) {
            setFormData((prev) => ({
              ...prev,
              assetId: asset.id,
              labId: asset.labId || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        showToast('Error al cargar laboratorios y equipos', 'error');
      }
    };
    fetchData();
  }, [location.state, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/incidents', formData);
      showToast(
        `Incidente ${response.data.code} registrado correctamente. Se le ha asignado un tecnico automaticamente.`,
        'success'
      );
      setTimeout(() => {
        navigate(`/incidents/${response.data.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error al reportar incidente:', error);
      showToast(error.response?.data?.message || 'Error al reportar el incidente', 'error');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Solo se permiten imagenes JPG, PNG, GIF o WEBP', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('La imagen no puede superar los 10MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await axios.post('/api/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData((prev) => ({ ...prev, imageUrl: response.data.url }));
      showToast('Imagen subida correctamente', 'success');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      showToast('Error al subir la imagen. Intenta de nuevo.', 'error');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast('Imagen eliminada', 'info');
  };

  const filteredAssets = formData.labId
    ? assets.filter((a) => a.labId === formData.labId)
    : assets;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-lg">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md mb-md"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver a Incidentes
          </button>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-xs">
            Reportar un incidente
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Cuentanos que esta pasando con el equipo.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="flex flex-col gap-sm">
                <label className="font-label-sm text-label-sm text-on-surface" htmlFor="labId">
                  Laboratorio *
                </label>
                <div className="relative">
                  <select
                    id="labId"
                    name="labId"
                    value={formData.labId}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-shadow"
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

              <div className="flex flex-col gap-sm">
                <label className="font-label-sm text-label-sm text-on-surface" htmlFor="assetId">
                  Equipo *
                </label>
                <div className="relative">
                  <select
                    id="assetId"
                    name="assetId"
                    value={formData.assetId}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-shadow"
                  >
                    <option value="">Selecciona un equipo</option>
                    {filteredAssets.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.code} - {asset.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-sm">
              <label className="font-label-sm text-label-sm text-on-surface" htmlFor="problemType">
                Tipo de problema *
              </label>
              <div className="relative w-full md:w-1/2 pr-0 md:pr-sm">
                <select
                  id="problemType"
                  name="problemType"
                  value={formData.problemType}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-shadow"
                >
                  <option value="">Cual es la falla principal?</option>
                  <option value="hardware">Falla de Hardware</option>
                  <option value="software">Falla de Software</option>
                  <option value="red">Problema de Red</option>
                  <option value="fisico">Dano Fisico</option>
                  <option value="climatizacion">Climatizacion</option>
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-sm">
              <label className="font-label-sm text-label-sm text-on-surface" htmlFor="title">
                Titulo *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Breve descripcion del problema"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-shadow"
              />
            </div>

            <div className="flex flex-col gap-sm">
              <label className="font-label-sm text-label-sm text-on-surface" htmlFor="description">
                Descripcion detallada *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe los sintomas, mensajes de error o cualquier detalle relevante..."
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-shadow resize-y"
              />
            </div>

            <div className="flex flex-col gap-sm">
              <label className="font-label-sm text-label-sm text-on-surface" htmlFor="priority">
                Prioridad
              </label>
              <div className="relative w-full md:w-1/2 pr-0 md:pr-sm">
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-shadow"
                >
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="CRITICAL">Critica</option>
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-sm mt-sm">
              <label className="font-label-sm text-label-sm text-on-surface">
                Adjuntar imagen
              </label>

              {imagePreview ? (
                <div className="relative w-full border border-outline-variant rounded-xl overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-contain bg-surface"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-sm right-sm bg-error text-on-error w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#991b1b] transition-colors shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center bg-surface-bright hover:bg-surface-container-low transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-primary mb-md group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">
                      {uploading ? 'hourglass_top' : 'add_a_photo'}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-primary font-bold">
                    {uploading ? 'Subiendo imagen...' : 'Haz clic para subir o arrastra una imagen'}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
                    PNG, JPG, GIF hasta 10MB
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Puedes adjuntar una fotografia para ayudarnos a identificar el problema mas rapido.
              </p>
            </div>

            <div className="h-px w-full bg-outline-variant opacity-50 my-sm"></div>

            <div className="flex justify-end gap-md flex-wrap">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-lg py-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors bg-transparent"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="bg-primary text-on-primary font-label-md text-label-md px-xl py-sm rounded-lg hover:bg-primary-container transition-colors flex items-center gap-sm shadow-sm disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                {loading ? 'Enviando...' : 'Enviar reporte'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}