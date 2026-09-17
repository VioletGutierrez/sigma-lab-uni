// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

export default function Profile() {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const getRoleLabel = (role) => {
    const map = {
      ADMIN: 'Administrador',
      TECHNICIAN: 'Tecnico',
      STUDENT: 'Estudiante/Docente'
    };
    return map[role] || role;
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n.charAt(0).toUpperCase())
      .join('');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await axios.put('/api/users/profile', formData);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setEditMode(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al actualizar' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contrasenas no coinciden' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contrasena debe tener al menos 6 caracteres' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await axios.put('/api/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Contrasena actualizada correctamente' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMode(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al actualizar' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-xl">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Perfil
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Gestiona tu informacion personal y preferencias de la cuenta.
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-lg p-md rounded-lg border ${
              message.type === 'success'
                ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32]'
                : 'bg-error-container border-error text-on-error-container'
            }`}
          >
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined">
                {message.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span className="font-body-md text-body-md">{message.text}</span>
            </div>
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-lg mb-lg">
          <div className="flex items-center gap-lg flex-wrap">
            <div className="w-20 h-20 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-headline-lg text-headline-lg font-bold">
              {getInitials(user?.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {user?.fullName}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">{user?.email}</p>
              <span className="inline-flex items-center px-sm py-xs rounded-full bg-surface-container text-primary font-label-sm text-label-sm mt-xs">
                {getRoleLabel(user?.role)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-lg mb-lg">
          <div className="flex justify-between items-center mb-md">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">person</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Informacion Personal
              </h3>
            </div>
            {!editMode && (
              <button
                onClick={() => { setEditMode(true); setMessage({ type: '', text: '' }); }}
                className="text-primary font-label-md text-label-md hover:text-primary-container transition-colors flex items-center gap-xs"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  edit
                </span>
                Editar
              </button>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleProfileUpdate} className="space-y-md">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="w-full bg-surface-container-lowest border border-slate-200 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
                  Correo institucional
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-surface-container-lowest border border-slate-200 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-sm">
                <button
                  type="button"
                  onClick={() => { setEditMode(false); setMessage({ type: '', text: '' }); }}
                  className="px-lg py-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-lg py-sm rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <p className="font-label-sm text-label-sm text-outline mb-xs">Nombre completo</p>
                <p className="font-body-md text-body-md text-on-surface">{user?.fullName}</p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-outline mb-xs">Correo institucional</p>
                <p className="font-body-md text-body-md text-on-surface">{user?.email}</p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-outline mb-xs">Rol</p>
                <p className="font-body-md text-body-md text-on-surface">{getRoleLabel(user?.role)}</p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-outline mb-xs">Ultimo acceso</p>
                <p className="font-body-md text-body-md text-on-surface">
                  {user?.lastLogin
                    ? new Date(user.lastLogin).toLocaleString('es-ES')
                    : 'No registrado'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-lg mb-lg">
          <div className="flex justify-between items-center mb-md">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">lock</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Seguridad
              </h3>
            </div>
            {!passwordMode && (
              <button
                onClick={() => { setPasswordMode(true); setMessage({ type: '', text: '' }); }}
                className="text-primary font-label-md text-label-md hover:text-primary-container transition-colors"
              >
                Cambiar contrasena
              </button>
            )}
          </div>

          {passwordMode ? (
            <form onSubmit={handlePasswordChange} className="space-y-md">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
                  Contrasena actual
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className="w-full bg-surface-container-lowest border border-slate-200 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
                  Nueva contrasena
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  className="w-full bg-surface-container-lowest border border-slate-200 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface mb-xs">
                  Confirmar nueva contrasena
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  className="w-full bg-surface-container-lowest border border-slate-200 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-sm">
                <button
                  type="button"
                  onClick={() => { setPasswordMode(false); setMessage({ type: '', text: '' }); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                  className="px-lg py-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-lg py-sm rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Actualizando...' : 'Cambiar contrasena'}
                </button>
              </div>
            </form>
          ) : (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Se recomienda cambiar la contrasena periodicamente para mantener la seguridad de la cuenta.
            </p>
          )}
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-lg mb-lg">
          <div className="flex items-center gap-sm mb-md">
            <span className="material-symbols-outlined text-primary">notifications</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Preferencias de Notificaciones
            </h3>
          </div>
          <div className="space-y-sm">
            <label className="flex items-center justify-between cursor-pointer p-sm rounded-lg hover:bg-surface-container transition-colors">
              <div>
                <p className="font-body-md text-body-md text-on-surface">Incidentes asignados</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Recibir notificacion cuando se te asigne un incidente
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between cursor-pointer p-sm rounded-lg hover:bg-surface-container transition-colors">
              <div>
                <p className="font-body-md text-body-md text-on-surface">Mantenimientos proximos</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Alertas de mantenimientos programados
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between cursor-pointer p-sm rounded-lg hover:bg-surface-container transition-colors">
              <div>
                <p className="font-body-md text-body-md text-on-surface">Alertas de riesgo</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Notificaciones sobre activos con riesgo alto
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-error-container shadow-sm p-lg">
          <div className="flex items-center gap-sm mb-md">
            <span className="material-symbols-outlined text-error">logout</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Cerrar Sesion
            </h3>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
            Cerrar tu sesion actual en este dispositivo.
          </p>
          <button
            onClick={handleLogout}
            className="px-lg py-sm rounded-lg font-label-md text-label-md bg-error text-on-error hover:bg-[#991b1b] transition-colors shadow-sm flex items-center gap-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              logout
            </span>
            Cerrar sesion
          </button>
        </div>
      </div>
    </Layout>
  );
}