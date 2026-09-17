// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleGuard } from './components/RoleGuard';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import IncidentDetail from './pages/IncidentDetail';
import ReportIncident from './pages/ReportIncident';
import MyIncidents from './pages/MyIncidents';
import Assets from './pages/Assets';
import RegisterAsset from './pages/RegisterAsset';
import AssetDetail from './pages/AssetDetail';
import AssetHistory from './pages/AssetHistory';
import Maintenances from './pages/Maintenances';
import RegisterMaintenance from './pages/RegisterMaintenance';
import Indicators from './pages/Indicators';
import Labs from './pages/Labs';
import RegisterLab from './pages/RegisterLab';
import Users from './pages/Users';
import RegisterUser from './pages/RegisterUser';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><ReportIncident /></ProtectedRoute>} />

            {/* Activos */}
            <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
            <Route
              path="/assets/register"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <RegisterAsset />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assets/edit/:id"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <RegisterAsset />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route path="/assets/:id" element={<ProtectedRoute><AssetDetail /></ProtectedRoute>} />
            <Route path="/assets/:id/history" element={<ProtectedRoute><AssetHistory /></ProtectedRoute>} />

            {/* Laboratorios */}
            <Route path="/labs" element={<ProtectedRoute><Labs /></ProtectedRoute>} />
            <Route
              path="/labs/register"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <RegisterLab />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/labs/edit/:id"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <RegisterLab />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />

            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Mis Incidentes */}
            <Route
              path="/my-incidents"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['STUDENT', 'ADMIN']}>
                    <MyIncidents />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />

            {/* Incidentes */}
            <Route
              path="/incidents"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN', 'TECHNICIAN']}>
                    <Incidents />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/incidents/:id"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN', 'TECHNICIAN', 'STUDENT']}>
                    <IncidentDetail />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />

            {/* Mantenimientos */}
            <Route
              path="/maintenances"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN', 'TECHNICIAN']}>
                    <Maintenances />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintenances/register"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN', 'TECHNICIAN']}>
                    <RegisterMaintenance />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />

            {/* Indicadores */}
            <Route
              path="/indicators"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN', 'TECHNICIAN']}>
                    <Indicators />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />

            {/* Usuarios */}
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <Users />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/register"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <RegisterUser />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/edit/:id"
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <RegisterUser />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;