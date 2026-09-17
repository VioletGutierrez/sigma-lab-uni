// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Users() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      showToast('Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await axios.put(`/api/users/${user.id}`, {
        fullName: user.fullName,
        role: user.role,
        isActive: !user.isActive
      });
      showToast(
        `Usuario ${!user.isActive ? 'activado' : 'desactivado'} correctamente`,
        'success'
      );
      fetchUsers();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showToast('Error al cambiar el estado del usuario', 'error');
    }
  };

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

  const filteredUsers = users.filter((user) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matches =
        user.fullName?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search);
      if (!matches) return false;
    }
    if (filterRole && user.role !== filterRole) return false;
    if (filterStatus === 'active' && !user.isActive) return false;
    if (filterStatus === 'inactive' && user.isActive) return false;
    return true;
  });

  const totalUsers = users.length;
  const inactiveUsers = users.filter((u) => !u.isActive).length;
  const roleCount = new Set(users.map((u) => u.role)).size;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant">Cargando usuarios...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSearch={false}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-xl gap-md">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">
            Gestion de Usuarios
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Administra los accesos y roles del personal y estudiantes en la plataforma.
          </p>
        </div>
        <button
          onClick={() => navigate('/users/register')}
          className="bg-primary-container text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-sm shadow-sm"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Agregar usuario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
        <div className="bg-surface-container-lowest p-lg rounded-xl flex items-center gap-md border border-outline-variant shadow-sm">
          <div className="p-md rounded-lg bg-surface-container-high text-primary">
            <span className="material-symbols-outlined">group</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-outline">Total Usuarios</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl flex items-center gap-md border border-outline-variant shadow-sm">
          <div className="p-md rounded-lg bg-error-container text-on-error-container">
            <span className="material-symbols-outlined">person_off</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-outline">Inactivos</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">{inactiveUsers}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-xl flex items-center gap-md border border-outline-variant shadow-sm">
          <div className="p-md rounded-lg bg-secondary-container text-on-secondary-container">
            <span className="material-symbols-outlined">admin_panel_settings</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-outline">Roles Activos</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">{roleCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant shadow-sm">
        <div className="px-lg py-md border-b border-outline-variant flex flex-wrap gap-md justify-between items-center bg-surface-bright">
          <div className="flex gap-sm flex-wrap">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o correo..."
              className="px-md py-xs rounded border border-outline-variant bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:border-primary focus:outline-none min-w-[200px]"
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-md py-xs rounded border border-outline-variant bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:border-primary focus:outline-none"
            >
              <option value="">Todos los Roles</option>
              <option value="STUDENT">Estudiante/Docente</option>
              <option value="TECHNICIAN">Tecnico</option>
              <option value="ADMIN">Administrador</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-md py-xs rounded border border-outline-variant bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:border-primary focus:outline-none"
            >
              <option value="">Todos los Estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low font-label-md text-label-md text-on-surface-variant border-b border-outline-variant">
                <th className="px-lg py-sm font-semibold">Nombre</th>
                <th className="px-lg py-sm font-semibold">Correo</th>
                <th className="px-lg py-sm font-semibold">Rol</th>
                <th className="px-lg py-sm font-semibold">Estado</th>
                <th className="px-lg py-sm font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-lg py-xl text-center text-on-surface-variant">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-outline-variant hover:bg-[#F5F3FF] transition-colors">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-surface-variant text-primary flex items-center justify-center font-label-md">
                          {getInitials(user.fullName)}
                        </div>
                        <span className="font-medium">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md text-on-surface-variant">{user.email}</td>
                    <td className="px-lg py-md">{getRoleLabel(user.role)}</td>
                    <td className="px-lg py-md">
                      <span
                        className={`inline-flex items-center px-sm py-xs rounded-full font-label-sm text-label-sm ${
                          user.isActive
                            ? 'bg-[#E8F5E9] text-[#2E7D32]'
                            : 'bg-[#FCE4EC] text-[#C2185B]'
                        }`}
                      >
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-lg py-md text-right">
                      <button
                        onClick={() => navigate(`/users/edit/${user.id}`)}
                        className="text-outline hover:text-primary transition-colors p-xs rounded hover:bg-surface-variant"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`ml-xs p-xs rounded transition-colors ${
                          user.isActive
                            ? 'text-outline hover:text-error hover:bg-error-container'
                            : 'text-outline hover:text-primary hover:bg-surface-variant'
                        }`}
                        title={user.isActive ? 'Desactivar' : 'Activar'}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                          {user.isActive ? 'block' : 'check_circle'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-lg py-md border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest flex-wrap gap-sm">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Mostrando {filteredUsers.length} de {totalUsers} usuarios
          </span>
        </div>
      </div>
    </Layout>
  );
}