// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useToast } from '../components/Toast';
import axios from 'axios';

export default function Indicators() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const response = await axios.get('/api/dashboard/indicators');
        setData(response.data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.response?.data?.message || err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchIndicators();
  }, []);

  const handleExport = async (format) => {
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant">Cargando indicadores...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-error-container p-lg rounded-xl border border-error">
          <h2 className="font-headline-md text-on-error-container mb-sm">Error</h2>
          <p className="font-body-md text-on-error-container">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!data) return null;

  const monthData = data.incidentsByMonth || [];
  const maxIncidents = Math.max(...monthData.map((m) => m.count), 5);
  const chartWidth = 800;
  const chartHeight = 250;
  const paddingLeft = 40;
  const paddingRight = 20;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - 40;

  const generatePath = () => {
    if (monthData.length === 0) return '';
    const stepX = plotWidth / (monthData.length - 1);
    let path = '';
    monthData.forEach((m, i) => {
      const x = paddingLeft + i * stepX;
      const y = 20 + plotHeight - (m.count / maxIncidents) * plotHeight;
      path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });
    return path;
  };

  const labData = data.incidentsByLab || [];
  const maxLabIncidents = Math.max(...labData.map((l) => l.count), 1);
  const labColors = ['bg-primary-container', 'bg-secondary opacity-80', 'bg-[#8B5CF6]', 'bg-surface-tint opacity-60', 'bg-primary-fixed-dim'];

  const riskPercentages = data.assetsByRisk?.percentages || { optimal: 0, predictive: 0, critical: 0 };
  const pieGradient = `conic-gradient(#10B981 0% ${riskPercentages.optimal}%, #8B5CF6 ${riskPercentages.optimal}% ${riskPercentages.optimal + riskPercentages.predictive}%, #EF4444 ${riskPercentages.optimal + riskPercentages.predictive}% 100%)`;

  const maintenanceStats = data.maintenanceStats || { total: 0, completed: 0, completionPercent: 0 };
  const circumference = 2 * Math.PI * 50;
  const donutOffset = circumference - (maintenanceStats.completionPercent / 100) * circumference;
  const topAssets = data.topAssets || [];

  return (
    <Layout showSearch={true} searchPlaceholder="Buscar indicadores...">
      <div className="mb-lg flex justify-between items-end flex-wrap gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Panel Analitico
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Vision general del estado de activos y laboratorios.
          </p>
        </div>
        <div className="flex gap-sm flex-wrap">
          <button
            onClick={() => handleExport('html')}
            disabled={exporting}
            className="px-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-lowest transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            Descargar HTML
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="px-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-lowest transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">table_view</span>
            Descargar CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            disabled={exporting}
            className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg font-label-md text-label-md hover:bg-secondary hover:text-white transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            {exporting ? 'Generando...' : 'Descargar JSON'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-xl">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Evolucion de Incidentes</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Comparativa mensual del ano en curso</p>
            </div>
            <span className="material-symbols-outlined text-outline">trending_down</span>
          </div>
          <div className="flex-1 relative min-h-[250px] w-full">
            <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              <line stroke="#c7c4d8" strokeWidth="0.5" strokeDasharray="4" x1={paddingLeft} x2={chartWidth - paddingRight} y1="20" y2="20" />
              <line stroke="#c7c4d8" strokeWidth="0.5" strokeDasharray="4" x1={paddingLeft} x2={chartWidth - paddingRight} y1="70" y2="70" />
              <line stroke="#c7c4d8" strokeWidth="0.5" strokeDasharray="4" x1={paddingLeft} x2={chartWidth - paddingRight} y1="120" y2="120" />
              <line stroke="#c7c4d8" strokeWidth="0.5" strokeDasharray="4" x1={paddingLeft} x2={chartWidth - paddingRight} y1="170" y2="170" />
              <line stroke="#c7c4d8" strokeWidth="1" x1={paddingLeft} x2={chartWidth - paddingRight} y1={20 + plotHeight} y2={20 + plotHeight} />

              <text fill="#777587" fontFamily="Hanken Grotesk" fontSize="12" textAnchor="end" x="30" y="25">{maxIncidents}</text>
              <text fill="#777587" fontFamily="Hanken Grotesk" fontSize="12" textAnchor="end" x="30" y="75">{Math.round(maxIncidents * 0.75)}</text>
              <text fill="#777587" fontFamily="Hanken Grotesk" fontSize="12" textAnchor="end" x="30" y="125">{Math.round(maxIncidents * 0.5)}</text>
              <text fill="#777587" fontFamily="Hanken Grotesk" fontSize="12" textAnchor="end" x="30" y="175">{Math.round(maxIncidents * 0.25)}</text>
              <text fill="#777587" fontFamily="Hanken Grotesk" fontSize="12" textAnchor="end" x="30" y="245">0</text>

              <g fill="#777587" fontFamily="Hanken Grotesk" fontSize="12" textAnchor="middle" transform="translate(0, 260)">
                {monthData.map((m, i) => {
                  const stepX = plotWidth / (monthData.length - 1 || 1);
                  const x = paddingLeft + i * stepX;
                  return <text key={m.month} x={x}>{m.month}</text>;
                })}
              </g>

              <path d={generatePath()} fill="none" stroke="url(#lineGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />

              {monthData.map((m, i) => {
                const stepX = plotWidth / (monthData.length - 1 || 1);
                const x = paddingLeft + i * stepX;
                const y = 20 + plotHeight - (m.count / maxIncidents) * plotHeight;
                return <circle key={m.month} cx={x} cy={y} fill="#ffffff" r="4" stroke="#4F46E5" strokeWidth="2" />;
              })}

              <defs>
                <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#8455ef" />
                  <stop offset="100%" stopColor="#3525cd" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Activos Criticos</h3>
            <span className="material-symbols-outlined text-error">warning</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">Mayor numero de incidencias reportadas.</p>
          <div className="flex flex-col gap-md flex-1 justify-center">
            {topAssets.length === 0 ? (
              <p className="text-center text-on-surface-variant font-body-sm">Sin datos</p>
            ) : (
              topAssets.map((asset) => {
                const isCritical = asset.riskLevel === 'HIGH' || asset.riskLevel === 'CRITICAL';
                return (
                  <div key={asset.id} className={`flex items-center p-md rounded-lg ${isCritical ? 'bg-error-container/20 border border-error-container/50' : 'border border-outline-variant'}`}>
                    <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-sm shrink-0 mr-md">
                      <span className={`material-symbols-outlined ${isCritical ? 'text-error' : 'text-primary'}`}>science</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-label-md text-label-md text-on-surface truncate">{asset.name}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{asset.labName}</p>
                    </div>
                    <div className="text-right ml-sm">
                      <span className={`font-headline-sm text-headline-sm font-bold ${isCritical ? 'text-error' : 'text-on-surface'}`}>{asset.incidentsCount}</span>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">fallos</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm flex flex-col h-[320px]">
          <div className="mb-lg">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Por Laboratorio</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Distribucion de incidencias</p>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 mt-auto">
            {labData.length === 0 ? (
              <p className="text-center text-on-surface-variant font-body-sm w-full">Sin datos</p>
            ) : (
              labData.slice(0, 5).map((lab, index) => {
                const heightPercent = maxLabIncidents > 0 ? (lab.count / maxLabIncidents) * 100 : 0;
                return (
                  <div key={lab.labName} className="flex flex-col items-center w-full group">
                    <span className="font-label-sm text-label-sm text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity mb-1">{lab.count}</span>
                    <div className={`w-full ${labColors[index % labColors.length]} rounded-t-md transition-all`} style={{ height: `${Math.max(heightPercent, 5)}%`, minHeight: '20px' }}></div>
                    <span className="font-label-sm text-label-sm text-on-surface mt-2 truncate max-w-full" title={lab.labName}>{lab.shortName}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm flex flex-col h-[320px]">
          <div className="mb-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Nivel de Riesgo</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Estado actual del inventario</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-32 h-32 rounded-full shadow-inner relative" style={{ background: pieGradient }}>
              <div className="absolute inset-0 rounded-full border border-white/20"></div>
            </div>
          </div>
          <div className="mt-auto grid grid-cols-2 gap-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
              <span className="font-label-sm text-label-sm text-on-surface">Optimo ({riskPercentages.optimal}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>
              <span className="font-label-sm text-label-sm text-on-surface">Predictivo ({riskPercentages.predictive}%)</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
              <span className="font-label-sm text-label-sm text-on-surface">Critico ({riskPercentages.critical}%)</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm flex flex-col h-[320px]">
          <div className="mb-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Mantenimientos</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Cumplimiento del plan anual</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <svg className="-rotate-90" height="140" viewBox="0 0 140 140" width="140">
              <circle cx="70" cy="70" fill="transparent" r="50" stroke="#eff4ff" strokeWidth="20" />
              <circle cx="70" cy="70" fill="transparent" r="50" stroke="#3525cd" strokeDasharray={circumference} strokeDashoffset={donutOffset} strokeLinecap="round" strokeWidth="20" style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline-lg text-headline-lg text-primary font-bold">{maintenanceStats.completionPercent}%</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Completado</span>
            </div>
          </div>
          <div className="mt-auto flex justify-between items-center px-sm pt-sm border-t border-outline-variant">
            <div className="text-center">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Programados</p>
              <p className="font-headline-sm text-headline-sm text-on-surface">{maintenanceStats.total}</p>
            </div>
            <div className="w-px h-8 bg-outline-variant"></div>
            <div className="text-center">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Realizados</p>
              <p className="font-headline-sm text-headline-sm text-primary">{maintenanceStats.completed}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}