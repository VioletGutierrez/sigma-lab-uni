// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    openIncidents: 0,
    inProgressIncidents: 0,
    upcomingMaintenances: 0,
    highRiskAssets: 0
  });
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [criticalAssets, setCriticalAssets] = useState([]);
  const [myIncidents, setMyIncidents] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, incidentsRes, assetsRes] = await Promise.all([
          axios.get('/api/dashboard/stats'),
          axios.get('/api/dashboard/recent-incidents'),
          axios.get('/api/dashboard/critical-assets')
        ]);
        setStats(statsRes.data);
        setRecentIncidents(incidentsRes.data);
        setCriticalAssets(assetsRes.data);
      } catch (error) {
        console.error('Error al cargar dashboard:', error);
      }
    };

    const fetchMyIncidents = async () => {
      try {
        const response = await axios.get('/api/incidents/my');
        setMyIncidents(response.data);
      } catch (error) {
        console.error('Error al cargar mis incidentes:', error);
      }
    };

    fetchData();
    if (user?.role === 'STUDENT') {
      fetchMyIncidents();
    }
  }, [user?.role]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Buenos dias';
    if (hour >= 12 && hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const handleExport = async (format) => {
    setShowExportMenu(false);
    setExporting(true);
    try {
      const response = await axios.get('/api/dashboard/full-report');
      const report = response.data;
      const fecha = new Date().toISOString().split('T')[0];

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sigma-lab-reporte-${fecha}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Reporte JSON descargado', 'success');
      } else if (format === 'csv') {
        const incidents = report.incidents || [];
        const headers = ['Codigo', 'Titulo', 'Estado', 'Prioridad', 'Equipo', 'Laboratorio', 'Reportado por', 'Tecnico', 'Fecha'];
        const rows = incidents.map((i) => [
          i.code,
          i.title,
          i.status,
          i.priority,
          i.asset?.code || '',
          i.lab?.name || '',
          i.reporter?.fullName || '',
          i.technician?.fullName || 'Sin asignar',
          new Date(i.createdAt).toLocaleDateString('es-ES')
        ]);

        const csvContent = [
          headers.join(','),
          ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sigma-lab-incidentes-${fecha}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Reporte CSV descargado', 'success');
      } else if (format === 'html') {
        const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte SIGMA-LAB UNI - ${new Date().toLocaleDateString('es-ES')}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #0b1c30; }
    h1 { color: #3525cd; border-bottom: 3px solid #3525cd; padding-bottom: 10px; }
    h2 { color: #4f46e5; margin-top: 30px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
    th { background: #e5eeff; padding: 10px; text-align: left; border-bottom: 2px solid #c7c4d8; }
    td { padding: 8px 10px; border-bottom: 1px solid #e5eeff; }
    .summary { display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap; }
    .card { background: #f8f9ff; padding: 20px; border-radius: 8px; flex: 1; min-width: 150px; border: 1px solid #c7c4d8; }
    .card-value { font-size: 32px; font-weight: bold; color: #3525cd; }
    .card-label { font-size: 12px; color: #777587; text-transform: uppercase; }
    .footer { margin-top: 40px; text-align: center; color: #777587; font-size: 11px; }
  </style>
</head>
<body>
  <h1>SIGMA-LAB UNI - Reporte General</h1>
  <p><strong>Generado:</strong> ${new Date().toLocaleString('es-ES')}</p>
  <div class="summary">
    <div class="card"><div class="card-label">Incidentes</div><div class="card-value">${report.summary.totalIncidents}</div></div>
    <div class="card"><div class="card-label">Activos</div><div class="card-value">${report.summary.totalAssets}</div></div>
    <div class="card"><div class="card-label">Mantenimientos</div><div class="card-value">${report.summary.totalMaintenances}</div></div>
    <div class="card"><div class="card-label">Laboratorios</div><div class="card-value">${report.summary.totalLabs}</div></div>
    <div class="card"><div class="card-label">Usuarios</div><div class="card-value">${report.summary.totalUsers}</div></div>
  </div>
  <h2>Incidentes (${report.incidents.length})</h2>
  <table>
    <thead><tr><th>Codigo</th><th>Titulo</th><th>Estado</th><th>Prioridad</th><th>Equipo</th><th>Tecnico</th></tr></thead>
    <tbody>
      ${report.incidents.map((i) => `<tr><td>${i.code}</td><td>${i.title}</td><td>${i.status}</td><td>${i.priority}</td><td>${i.asset?.code || '-'}</td><td>${i.technician?.fullName || 'Sin asignar'}</td></tr>`).join('')}
    </tbody>
  </table>
  <h2>Activos (${report.assets.length})</h2>
  <table>
    <thead><tr><th>Codigo</th><th>Equipo</th><th>Laboratorio</th><th>Estado</th><th>Riesgo</th></tr></thead>
    <tbody>
      ${report.assets.map((a) => `<tr><td>${a.code}</td><td>${a.name}</td><td>${a.lab?.name || '-'}</td><td>${a.status}</td><td>${a.riskLevel}</td></tr>`).join('')}
    </tbody>
  </table>
  <h2>Mantenimientos (${report.maintenances.length})</h2>
  <table>
    <thead><tr><th>Codigo</th><th>Titulo</th><th>Activo</th><th>Tipo</th><th>Estado</th><th>Fecha</th></tr></thead>
    <tbody>
      ${report.maintenances.map((m) => `<tr><td>${m.code}</td><td>${m.title}</td><td>${m.asset?.code || '-'}</td><td>${m.type}</td><td>${m.status}</td><td>${new Date(m.scheduledDate).toLocaleDateString('es-ES')}</td></tr>`).join('')}
    </tbody>
  </table>
  <div class="footer">SIGMA-LAB UNI - Sistema de Gestion de Mantenimiento Predictivo e Incidentes</div>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sigma-lab-reporte-${fecha}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Reporte HTML descargado. Abrilo y usa Ctrl+P para imprimir.', 'success');
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      showToast('Error al generar el reporte', 'error');
    } finally {
      setExporting(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === 'PENDING') return 'status-preventive';
    if (status === 'RESOLVED' || status === 'CLOSED') return 'bg-slate-100 text-slate-600';
    return 'status-predictive';
  };

  const getStatusLabel = (status) => {
    const map = {
      PENDING: 'Abierto',
      ASSIGNED: 'Asignado',
      DIAGNOSING: 'En diagnostico',
      REPAIRING: 'En atencion',
      RESOLVED: 'Resuelto',
      CLOSED: 'Cerrado'
    };
    return map[status] || status;
  };

  const getPriorityLabel = (priority) => {
    const map = {
      LOW: 'Baja',
      MEDIUM: 'Media',
      HIGH: 'Alta',
      CRITICAL: 'Critica'
    };
    return map[priority] || priority;
  };

  const getAssetIcon = (name) => {
    if (name?.toLowerCase().includes('aire') || name?.toLowerCase().includes('ac')) return 'ac_unit';
    return 'computer';
  };

  const firstName = user?.fullName?.split(' ')[0] || 'Usuario';

  const isStudent = user?.role === 'STUDENT';

  return (
    <div className="bg-background text-on-background font-body-md text-body-md min-h-screen">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-72'
        }`}
      >
        <Topbar />

        <main className="flex-1 overflow-y-auto p-lg bg-[#F8FAFC]">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-lg flex justify-between items-end flex-wrap gap-md">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
                  {getGreeting()}, {firstName}
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  {isStudent
                    ? 'Este es el resumen de tus reportes.'
                    : 'Este es el resumen de los laboratorios.'}
                </p>
              </div>

              {!isStudent && (
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={exporting}
                    className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg font-label-md text-label-md hover:bg-secondary hover:text-white transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {exporting ? 'hourglass_top' : 'download'}
                    </span>
                    {exporting ? 'Generando...' : 'Exportar Reporte'}
                    <span className="material-symbols-outlined text-[16px]">
                      {showExportMenu ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {showExportMenu && (
                    <div className="absolute top-full right-0 mt-sm bg-surface-container-lowest rounded-lg shadow-lg border border-outline-variant overflow-hidden z-50 min-w-[220px]">
                      <button
                        onClick={() => handleExport('html')}
                        className="w-full text-left px-md py-sm hover:bg-surface-container-low transition-colors font-body-sm text-body-sm text-on-surface flex items-center gap-sm"
                      >
                        <span className="material-symbols-outlined text-[18px] text-primary">description</span>
                        Descargar HTML
                      </button>
                      <button
                        onClick={() => handleExport('csv')}
                        className="w-full text-left px-md py-sm hover:bg-surface-container-low transition-colors font-body-sm text-body-sm text-on-surface flex items-center gap-sm border-t border-outline-variant"
                      >
                        <span className="material-symbols-outlined text-[18px] text-primary">table_view</span>
                        Descargar CSV
                      </button>
                      <button
                        onClick={() => handleExport('json')}
                        className="w-full text-left px-md py-sm hover:bg-surface-container-low transition-colors font-body-sm text-body-sm text-on-surface flex items-center gap-sm border-t border-outline-variant"
                      >
                        <span className="material-symbols-outlined text-[18px] text-primary">data_object</span>
                        Descargar JSON
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isStudent ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-lg">
                <div className="bg-white rounded-xl p-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-md">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      Mis reportes
                    </span>
                    <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">assignment</span>
                    </div>
                  </div>
                  <div className="font-display-lg text-display-lg text-on-surface">
                    {myIncidents.length}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-md">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      En atencion
                    </span>
                    <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">engineering</span>
                    </div>
                  </div>
                  <div className="font-display-lg text-display-lg text-on-surface">
                    {myIncidents.filter((i) => ['ASSIGNED', 'DIAGNOSING', 'REPAIRING'].includes(i.status)).length}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-md">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      Resueltos
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#166534]">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    </div>
                  </div>
                  <div className="font-display-lg text-display-lg text-on-surface">
                    {myIncidents.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-lg">
                <div className="bg-white rounded-xl p-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-md">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      Incidentes abiertos
                    </span>
                    <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-error">
                      <span className="material-symbols-outlined text-[18px]">assignment_late</span>
                    </div>
                  </div>
                  <div className="font-display-lg text-display-lg text-on-surface">{stats.openIncidents}</div>
                </div>

                <div className="bg-white rounded-xl p-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-md">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      En atencion
                    </span>
                    <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">engineering</span>
                    </div>
                  </div>
                  <div className="font-display-lg text-display-lg text-on-surface">{stats.inProgressIncidents}</div>
                </div>

                <div className="bg-white rounded-xl p-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-md">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      Mantenimientos prox.
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#f5f3ff] flex items-center justify-center text-primary-container">
                      <span className="material-symbols-outlined text-[18px]">build</span>
                    </div>
                  </div>
                  <div className="font-display-lg text-display-lg text-on-surface">{stats.upcomingMaintenances}</div>
                </div>

                <div className="bg-white rounded-xl p-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-md">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      Riesgo Alto
                    </span>
                    <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-error">
                      <span className="material-symbols-outlined text-[18px]">warning</span>
                    </div>
                  </div>
                  <div className="font-display-lg text-display-lg text-error">{stats.highRiskAssets}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className={isStudent ? 'lg:col-span-12' : 'lg:col-span-8'}>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-lg border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      {isStudent ? 'Mis reportes recientes' : 'Incidentes recientes'}
                    </h3>
                    <button
                      onClick={() => navigate(isStudent ? '/my-incidents' : '/incidents')}
                      className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors"
                    >
                      Ver todos
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase font-semibold">ID</th>
                          <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase font-semibold">Equipo</th>
                          <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase font-semibold">Laboratorio</th>
                          <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase font-semibold">Estado</th>
                          <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase font-semibold">Prioridad</th>
                        </tr>
                      </thead>
                      <tbody className="font-body-sm text-body-sm text-on-surface">
                        {(isStudent ? myIncidents.slice(0, 5) : recentIncidents).length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-md py-lg text-center text-on-surface-variant">
                              {isStudent ? 'No has reportado incidentes' : 'No hay incidentes recientes'}
                            </td>
                          </tr>
                        ) : (
                          (isStudent ? myIncidents.slice(0, 5) : recentIncidents).map((incident) => (
                            <tr
                              key={incident.id}
                              className="border-b border-slate-100 hover:bg-[#F5F3FF] transition-colors cursor-pointer"
                              onClick={() => navigate(`/incidents/${incident.id}`)}
                            >
                              <td className="px-md py-md font-medium">{incident.code}</td>
                              <td className="px-md py-md">{incident.asset?.name || 'Sin equipo'}</td>
                              <td className="px-md py-md text-on-surface-variant">{incident.lab?.name || 'Sin lab'}</td>
                              <td className="px-md py-md">
                                <span className={`px-sm py-xs rounded-full font-label-sm text-label-sm ${getStatusClass(incident.status)} inline-flex items-center gap-1`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                  {getStatusLabel(incident.status)}
                                </span>
                              </td>
                              <td className="px-md py-md">
                                <span className={incident.priority === 'HIGH' || incident.priority === 'CRITICAL' ? 'text-error font-medium' : ''}>
                                  {getPriorityLabel(incident.priority)}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {!isStudent && (
                <div className="lg:col-span-4 flex flex-col gap-lg">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">
                    Activos que requieren atencion
                  </h3>
                  {criticalAssets.length === 0 ? (
                    <div className="bg-white rounded-xl p-lg border border-slate-200 shadow-sm">
                      <p className="text-on-surface-variant text-center text-body-sm">
                        Sin activos criticos
                      </p>
                    </div>
                  ) : (
                    criticalAssets.slice(0, 2).map((asset) => (
                      <div
                        key={asset.id}
                        className="bg-white rounded-xl p-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/assets/${asset.id}`)}
                      >
                        <div className="flex justify-between items-start mb-md">
                          <div className="flex items-center gap-sm">
                            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary-container border border-slate-100">
                              <span className="material-symbols-outlined">{getAssetIcon(asset.name)}</span>
                            </div>
                            <div>
                              <h4 className="font-body-lg font-bold text-on-surface leading-tight">{asset.code}</h4>
                              <p className="font-body-sm text-body-sm text-on-surface-variant">{asset.lab?.name || 'Sin lab'}</p>
                            </div>
                          </div>
                          <span className={`px-sm py-xs rounded font-label-sm text-label-sm ${asset.riskLevel === 'HIGH' || asset.riskLevel === 'CRITICAL' ? 'status-critical border border-red-200' : 'status-predictive border border-indigo-200'}`}>
                            {asset.riskLevel === 'CRITICAL' ? 'Riesgo Critico' :
                             asset.riskLevel === 'HIGH' ? 'Riesgo Alto' :
                             asset.riskLevel === 'MEDIUM' ? 'Mantenimiento proximo' : 'Riesgo Bajo'}
                          </span>
                        </div>
                        <div className="flex justify-end mt-md pt-md border-t border-slate-100">
                          <button className="bg-[#F5F3FF] text-primary-container font-label-md text-label-md px-md py-sm rounded hover:bg-primary-container hover:text-white transition-colors">
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}