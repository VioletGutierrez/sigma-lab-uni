// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Sidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const { user } = useAuth();

  const allItems = [
    { path: '/', label: 'Inicio', icon: 'home', roles: ['ADMIN', 'TECHNICIAN', 'STUDENT'] },
    { path: '/incidents', label: 'Incidentes', icon: 'assignment_late', roles: ['ADMIN', 'TECHNICIAN'] },
    { path: '/my-incidents', label: 'Mis Incidentes', icon: 'assignment', roles: ['STUDENT'] },
    { path: '/report', label: 'Reportar', icon: 'add_circle', roles: ['ADMIN', 'TECHNICIAN', 'STUDENT'] },
    { path: '/assets', label: 'Activos', icon: 'inventory_2', roles: ['ADMIN', 'TECHNICIAN', 'STUDENT'] },
    { path: '/maintenances', label: 'Mantenimientos', icon: 'build', roles: ['ADMIN', 'TECHNICIAN'] },
    { path: '/labs', label: 'Laboratorios', icon: 'biotech', roles: ['ADMIN', 'TECHNICIAN', 'STUDENT'] },
    { path: '/indicators', label: 'Indicadores', icon: 'query_stats', roles: ['ADMIN', 'TECHNICIAN'] },
    { path: '/notifications', label: 'Notificaciones', icon: 'notifications', roles: ['ADMIN', 'TECHNICIAN', 'STUDENT'] },
    { path: '/users', label: 'Usuarios', icon: 'manage_accounts', roles: ['ADMIN'] }
  ];

  const menuItems = allItems.filter((item) => item.roles.includes(user?.role));

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';

  return (
    <nav
      className={`bg-surface h-screen ${sidebarWidth} fixed left-0 top-0 border-r border-outline-variant flex flex-col py-lg z-50 transition-all duration-300 ${
        isCollapsed ? 'px-xs' : 'px-md'
      }`}
    >
      {/* Header con logo y toggle */}
      <div className={`flex items-center mb-xl ${isCollapsed ? 'flex-col gap-md' : 'justify-between'} px-sm`}>
        {isCollapsed ? (
          <>
            <Link to="/" className="flex items-center justify-center" title="SIGMA-LAB UNI">
              <span
                className="material-symbols-outlined text-primary text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                science
              </span>
            </Link>
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-xs rounded hover:bg-surface-container transition-colors text-on-surface-variant"
              title="Expandir menu"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="flex items-center gap-sm min-w-0 flex-1">
              <span
                className="material-symbols-outlined text-primary flex-shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                science
              </span>
              <div className="min-w-0">
                <h2 className="font-headline-sm text-headline-sm font-bold text-primary truncate">
                  SIGMA-LAB UNI
                </h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                  Predictive Management
                </p>
              </div>
            </Link>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-xs rounded hover:bg-surface-container transition-colors text-on-surface-variant flex-shrink-0"
              title="Contraer menu"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
          </>
        )}
      </div>

      {/* Menu items */}
      <div className="flex-1 flex flex-col gap-xs overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : ''}
              className={`flex items-center rounded transition-colors duration-200 cursor-pointer active:scale-95 font-body-md text-body-md ${
                isCollapsed ? 'justify-center py-sm mx-xs' : 'gap-md px-md py-sm'
              } ${
                isActive
                  ? 'text-primary font-bold bg-surface-container'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
              }`}
              style={isActive ? { borderLeft: isCollapsed ? 'none' : '4px solid #3525cd' } : { borderLeft: isCollapsed ? 'none' : '4px solid transparent' }}
            >
              <span
                className="material-symbols-outlined flex-shrink-0"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Perfil */}
      <div className="border-t border-outline-variant pt-sm mt-auto">
        <Link
          to="/profile"
          title={isCollapsed ? 'Perfil' : ''}
          className={`flex items-center rounded transition-colors duration-200 cursor-pointer active:scale-95 font-body-md text-body-md ${
            isCollapsed ? 'justify-center py-sm mx-xs' : 'gap-md px-md py-sm'
          } ${
            location.pathname === '/profile'
              ? 'text-primary font-bold bg-surface-container'
              : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
          }`}
          style={location.pathname === '/profile' ? { borderLeft: isCollapsed ? 'none' : '4px solid #3525cd' } : { borderLeft: isCollapsed ? 'none' : '4px solid transparent' }}
        >
          <span
            className="material-symbols-outlined flex-shrink-0"
            style={location.pathname === '/profile' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            account_circle
          </span>
          {!isCollapsed && <span>Perfil</span>}
        </Link>
      </div>
    </nav>
  );
}