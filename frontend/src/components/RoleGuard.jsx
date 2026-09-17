// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RoleGuard({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-on-surface-variant">Verificando permisos...</div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}