// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../components/Toast';
import axios from 'axios';

export default function RegisterUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'STUDENT',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`/api/users/${id}`);
          const user = response.data;
          setFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            password: '',
            role: user.role || 'STUDENT',
            isActive: user.isActive !== undefined ? user.isActive : true
          });
        } catch (error) {
          console.error('Error al cargar usuario:', error);
          showToast('Error al cargar el usuario', 'error');
          navigate('/users');
        } finally {
          setLoadingData(false);
        }
      };
      fetchUser();
    }
  }, [id, isEdit, navigate, showToast]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/api/users/${id}`, {
          fullName: formData.fullName,
          role: formData.role,
          isActive: formData.isActive
        });
        showToast('Usuario actualizado correctamente', 'success');
      } else {
        await axios.post('/api/auth/register', {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        showToast('Usuario creado correctamente', 'success');
      }
      navigate('/users');
    } catch (error) {
      console.error('Error al guardar:', error);
      showToast(error.response?.data?.message || 'Error al guardar el usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant">Cargando usuario...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-lg">
          <button
            onClick={() => navigate('/users')}
            className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md mb-md"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver a Usuarios
          </button>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            {isEdit ? 'Editar Usuario' : 'Agregar Usuario'}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {isEdit
              ? 'Actualiza la informacion del usuario.'
              : 'Registra un nuevo usuario en la plataforma.'}
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-lg">
            <div className="space-y-sm">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="fullName">
                Nombre completo *
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Ej. Juan Perez Lopez"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
              />
            </div>

            <div className="space-y-sm">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="email">
                Correo institucional *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isEdit}
                placeholder="usuario@uni.edu.ni"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {isEdit && (
                <p className="font-label-sm text-label-sm text-outline mt-1">
                  El correo institucional no puede ser modificado.
                </p>
              )}
            </div>

            {!isEdit && (
              <div className="space-y-sm">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                  Contraseña *
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Minimo 6 caracteres"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>
            )}

            <div className="space-y-sm">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="role">
                Rol *
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                >
                  <option value="STUDENT">Estudiante/Docente</option>
                  <option value="TECHNICIAN">Tecnico</option>
                  <option value="ADMIN">Administrador</option>
                </select>
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>

            {isEdit && (
              <div className="space-y-sm">
                <label className="flex items-center gap-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="font-body-md text-body-md text-on-surface">
                    Usuario activo
                  </span>
                </label>
                <p className="font-label-sm text-label-sm text-outline ml-7">
                  Los usuarios inactivos no pueden iniciar sesion.
                </p>
              </div>
            )}

            <div className="h-px w-full bg-outline-variant opacity-50"></div>

            <div className="flex justify-end gap-md">
              <button
                type="button"
                onClick={() => navigate('/users')}
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
                {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}