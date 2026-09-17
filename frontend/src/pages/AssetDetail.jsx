// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  // Solo ADMIN y TECHNICIAN pueden editar o ejecutar acciones tecnicas
  const canEdit = user?.role === 'ADMIN' || user?.role === 'TECHNICIAN';

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await axios.get(`/api/assets/${id}`);
        setAsset(response.data);
      } catch (error) {
        console.error('Error al cargar activo:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [id]);

  const getRiskInfo = (riskLevel) => {
    const map = {
      LOW: {
        label: 'BAJO',
        bgClass: 'bg-[#dcfce7]',
        borderClass: 'border-[#86efac]',
        textClass: 'text-[#166534]',
        iconColor: 'text-[#166534]'
      },
      MEDIUM: {
        label: 'MEDIO',
        bgClass: 'bg-surface-variant',
        borderClass: 'border-outline-variant',
        textClass: 'text-on-surface-variant',
        iconColor: 'text-on-surface-variant'
      },
      HIGH: {
        label: 'ALTO',
        bgClass: 'bg-error-container',
        borderClass: 'border-error/20',
        textClass: 'text-on-error-container',
        iconColor: 'text-on-error-container'
      },
      CRITICAL: {
        label: 'CRITICO',
        bgClass: 'bg-error',
        borderClass: 'border-error',
        textClass: 'text-on-error',
        iconColor: 'text-on-error'
      }
    };
    return map[riskLevel] || map.LOW;
  };

  const getStatusColor = (status) => {
    const map = {
      OPERATIONAL: 'bg-[#22c55e]',
      MAINTENANCE: 'bg-[#f59e0b]',
      REPAIR: 'bg-error',
      DISPOSED: 'bg-outline'
    };
    return map[status] || 'bg-outline';
  };

  const getStatusLabel = (status) => {
    const map = {
      OPERATIONAL: 'Operativo',
      MAINTENANCE: 'En mantenimiento',
      REPAIR: 'En reparacion',
      DISPOSED: 'Descartado'
    };
    return map[status] || status;
  };

  const formatDate = (date) => {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant">Cargando activo...</div>
        </div>
      </Layout>
    );
  }

  if (!asset) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-on-surface-variant">Activo no encontrado</p>
        </div>
      </Layout>
    );
  }

  const riskInfo = getRiskInfo(asset.riskLevel);
  const breadcrumbs = [
    { label: 'Activos', path: '/assets', active: false },
    { label: 'Detalle', active: true }
  ];

  return (
    <Layout breadcrumbs={breadcrumbs} showSearch={true}>
      <div className="mb-xl">
        <div className="flex justify-between items-end flex-wrap gap-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {asset.code} - {asset.name}
            </h2>
            <div className="flex items-center gap-md mt-sm flex-wrap">
              <span className="font-label-md text-label-md bg-surface-container-low text-primary px-sm py-xs rounded inline-flex items-center gap-xs border border-outline-variant">
                <span className="material-symbols-outlined text-[16px]">computer</span>
                Equipo de Computo
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {asset.lab?.name} ({asset.lab?.location})
              </span>
            </div>
          </div>

          {/* Boton Editar - Solo ADMIN y TECHNICIAN */}
          {canEdit && (
            <div className="flex gap-md">
              <button className="px-md py-sm rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-sm">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Editar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        <div className="md:col-span-8 flex flex-col gap-lg">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
            <div className="flex items-center gap-sm mb-lg border-b border-outline-variant pb-sm">
              <span className="material-symbols-outlined text-primary">info</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Informacion Basica
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-y-lg gap-x-md">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Marca</p>
                <p className="font-body-md text-body-md text-on-surface font-medium">
                  {asset.brand || 'No especificada'}
                </p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Modelo</p>
                <p className="font-body-md text-body-md text-on-surface font-medium">
                  {asset.model || 'No especificado'}
                </p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Laboratorio</p>
                <p className="font-body-md text-body-md text-on-surface font-medium">
                  {asset.lab?.name || 'Sin laboratorio'}
                </p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Fecha adquisicion</p>
                <p className="font-body-md text-body-md text-on-surface font-medium">
                  {formatDate(asset.acquisitionDate)}
                </p>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Numero de serie</p>
                <p className="font-body-md text-body-md text-on-surface font-medium">
                  {asset.serialNumber || 'No especificado'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Estado Actual</p>
                <div className="inline-flex items-center gap-sm mt-xs">
                  <span className={`h-2 w-2 rounded-full ${getStatusColor(asset.status)}`}></span>
                  <p className="font-body-md text-body-md text-on-surface">
                    {getStatusLabel(asset.status)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm flex-grow">
            <div className="flex items-center gap-sm mb-lg border-b border-outline-variant pb-sm">
              <span className="material-symbols-outlined text-primary">memory</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Especificaciones
              </h3>
            </div>
            <div className="space-y-md">
              <div className="flex justify-between border-b border-surface-variant pb-xs">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Tipo de equipo</span>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">
                  {asset.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-surface-variant pb-xs">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Codigo interno</span>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">
                  {asset.code}
                </span>
              </div>
              <div className="flex justify-between border-b border-surface-variant pb-xs">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Incidentes registrados</span>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">
                  {asset._count?.incidents || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Riesgo</span>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">
                  {riskInfo.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-lg">
          <div className={`${riskInfo.bgClass} rounded-xl border ${riskInfo.borderClass} p-lg shadow-sm relative overflow-hidden group`}>
            <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <span
                className={`material-symbols-outlined text-[120px] ${riskInfo.iconColor}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-sm">
                <h3 className={`font-label-md text-label-md ${riskInfo.textClass} uppercase tracking-widest`}>
                  Nivel de riesgo predictivo
                </h3>
                <span
                  className={`material-symbols-outlined ${riskInfo.iconColor}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  warning
                </span>
              </div>
              <div className="mb-lg">
                <span className={`font-display-lg text-display-lg font-bold ${riskInfo.textClass} block leading-none`}>
                  {riskInfo.label}
                </span>
              </div>
              <p className={`font-body-sm text-body-sm ${riskInfo.textClass} mb-md font-medium leading-relaxed`}>
                {asset.riskLevel === 'HIGH' || asset.riskLevel === 'CRITICAL'
                  ? `El activo presenta ${asset._count?.incidents || 0} incidencias registradas. Requiere atencion inmediata.`
                  : 'El activo se encuentra en buen estado.'}
              </p>
              {(asset.riskLevel === 'HIGH' || asset.riskLevel === 'CRITICAL') && (
                <div className="bg-surface-container-lowest/40 rounded-lg p-md mb-lg border border-on-error-container/10">
                  <h4 className={`font-label-sm text-label-sm ${riskInfo.textClass} mb-xs font-bold`}>
                    Recomendacion del Sistema:
                  </h4>
                  <p className={`font-body-sm text-body-sm ${riskInfo.textClass}`}>
                    Programar mantenimiento preventivo exhaustivo o evaluar reemplazo de componentes de hardware.
                  </p>
                </div>
              )}
              <button
                onClick={() => navigate(`/assets/${asset.id}/history`)}
                className={`w-full ${asset.riskLevel === 'HIGH' || asset.riskLevel === 'CRITICAL' ? 'bg-on-error-container text-surface-container-lowest hover:bg-error' : 'bg-primary text-on-primary hover:bg-primary-container'} font-label-md text-label-md py-sm px-md rounded-lg transition-colors flex items-center justify-center gap-sm`}
              >
                <span className="material-symbols-outlined text-[18px]">history</span>
                Ver historial de incidentes
              </button>
            </div>
          </div>

          {/* Acciones Rapidas - Solo ADMIN y TECHNICIAN */}
          {canEdit && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
              <h3 className="font-label-md text-label-md text-on-surface mb-md">
                Acciones Rapidas
              </h3>
              <div className="space-y-sm">
                <button
                  onClick={() => navigate('/report', { state: { assetId: asset.id } })}
                  className="w-full text-left px-md py-sm rounded border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-colors font-body-sm text-body-sm text-on-surface flex items-center justify-between"
                >
                  Registrar nuevo incidente
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">add_circle</span>
                </button>
                <button
                  onClick={() => navigate('/maintenances/register', { state: { assetId: asset.id } })}
                  className="w-full text-left px-md py-sm rounded border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-colors font-body-sm text-body-sm text-on-surface flex items-center justify-between"
                >
                  Programar mantenimiento
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">build_circle</span>
                </button>
              </div>
            </div>
          )}

          {/* Info para estudiantes */}
          {!canEdit && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
              <div className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">info</span>
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface mb-xs">
                    Informacion
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Si detectas un problema con este equipo, puedes reportarlo desde la seccion de Reportar Incidente.
                  </p>
                  <button
                    onClick={() => navigate('/report', { state: { assetId: asset.id } })}
                    className="mt-md w-full text-left px-md py-sm rounded border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-colors font-body-sm text-body-sm text-primary flex items-center justify-between"
                  >
                    Reportar incidente en este equipo
                    <span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}