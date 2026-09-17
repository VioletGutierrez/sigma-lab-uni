// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 5000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getConfig = (type) => {
    const map = {
      success: {
        icon: 'check_circle',
        bg: 'bg-[#E8F5E9]',
        border: 'border-[#A5D6A7]',
        text: 'text-[#1B5E20]'
      },
      error: {
        icon: 'error',
        bg: 'bg-error-container',
        border: 'border-error',
        text: 'text-on-error-container'
      },
      info: {
        icon: 'info',
        bg: 'bg-[#E3F2FD]',
        border: 'border-[#90CAF9]',
        text: 'text-[#0D47A1]'
      },
      warning: {
        icon: 'warning',
        bg: 'bg-[#FFF8E1]',
        border: 'border-[#FFE082]',
        text: 'text-[#F57F17]'
      }
    };
    return map[type] || map.info;
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-lg right-lg z-[9999] flex flex-col gap-sm max-w-md">
        {toasts.map((toast) => {
          const config = getConfig(toast.type);
          return (
            <div
              key={toast.id}
              className={`${config.bg} ${config.border} ${config.text} border rounded-lg p-md shadow-lg flex items-start gap-sm min-w-[300px]`}
              style={{ animation: 'slideIn 0.3s ease-out' }}
            >
              <span className="material-symbols-outlined text-[22px] flex-shrink-0">
                {config.icon}
              </span>
              <p className="font-body-sm text-body-sm flex-1 pt-[2px]">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-current opacity-60 hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
}