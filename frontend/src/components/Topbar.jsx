// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

export function Topbar({ breadcrumbs, showSearch = false, searchPlaceholder = 'Buscar...', onSearch }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const response = await axios.get('/api/notifications');
        const unread = response.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        // Silencioso
      }
    };
    if (user) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleNotifications = () => {
    navigate('/notifications');
  };

  const handleHelp = () => {
    alert(
      'SIGMA-LAB UNI\n\n' +
      'Sistema Integral de Gestion de Mantenimiento\n' +
      'e Incidentes de Laboratorios\n\n' +
      'Universidad Nacional de Ingenieria (UNI)\n' +
      'Recinto Universitario Simon Bolivar\n\n' +
      'Para soporte contacte al administrador del sistema.'
    );
  };

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleChange = (e) => {
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="bg-surface sticky top-0 w-full z-40 border-b border-outline-variant flex justify-between items-center px-xxl py-md">
      <div className="flex items-center text-on-surface-variant font-label-md text-label-md gap-sm flex-1">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-sm">
              {index > 0 && (
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              )}
              {crumb.active ? (
                <span className="font-bold text-primary">{crumb.label}</span>
              ) : (
                <a href={crumb.path} className="hover:text-primary transition-colors">
                  {crumb.label}
                </a>
              )}
            </div>
          ))
        ) : showSearch ? (
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              onChange={handleChange}
              className="w-full pl-xl pr-sm py-sm rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none font-body-sm text-body-sm text-on-surface transition-all"
              placeholder={searchPlaceholder}
              type="text"
            />
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-md">
        {/* Notificaciones */}
        <button
          onClick={handleNotifications}
          className="p-sm rounded-full text-on-surface-variant hover:bg-surface-variant transition-all duration-300 ease-in-out relative"
          title="Notificaciones"
        >
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-error text-on-error text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Ayuda */}
        <button
          onClick={handleHelp}
          className="p-sm rounded-full text-on-surface-variant hover:bg-surface-variant transition-all duration-300 ease-in-out"
          title="Ayuda"
        >
          <span className="material-symbols-outlined">help</span>
        </button>

        {/* Modo oscuro */}
        <button
          onClick={handleDarkMode}
          className="p-sm rounded-full text-on-surface-variant hover:bg-surface-variant transition-all duration-300 ease-in-out"
          title="Modo oscuro"
        >
          <span className="material-symbols-outlined">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Avatar */}
        <button
          onClick={handleProfile}
          className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant hover:border-primary transition-all duration-300 ease-in-out flex-shrink-0"
          title="Ir a mi perfil"
        >
          <img
            alt="User Avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK8ewuEskQ1X8VW_Mfwkyiqrrge13peezfpT4mBrmZ15XOiB3SMWmeY4-UHINqHvz_FA8oWZPL0h0iNFwGKLZSCBrL6yBw3Xcfg_hgHrPJk0lBghT2mpmPdeMA_fKEKyHtruEcG_pbPF8Fmj85AUgJLQsQ3PPjQb9aEVjOsnEnfZJ8NlTq6kFJSsZKPVoOdLYSSvKfDCLk0iOkFEYZsr0tv09OJGxuOlKK9ZlSS08Pzm4eVa-aW07gMA"
          />
        </button>
      </div>
    </header>
  );
}