// Responsable: Edith de los Angeles Munguia Morales - Backend
import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [openIncidents, inProgressIncidents, upcomingMaintenances, highRiskAssets] = await Promise.all([
      prisma.incident.count({ where: { status: { in: ['PENDING', 'ASSIGNED'] } } }),
      prisma.incident.count({ where: { status: { in: ['DIAGNOSING', 'REPAIRING'] } } }),
      prisma.maintenance.count({ where: { status: 'SCHEDULED' } }),
      prisma.asset.count({ where: { riskLevel: { in: ['HIGH', 'CRITICAL'] } } })
    ]);
    res.json({ openIncidents, inProgressIncidents, upcomingMaintenances, highRiskAssets });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadisticas' });
  }
};

export const getRecentIncidents = async (req: Request, res: Response): Promise<void> => {
  try {
    const incidents = await prisma.incident.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        asset: { select: { id: true, code: true, name: true } },
        lab: { select: { id: true, name: true } }
      }
    });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener incidentes recientes' });
  }
};

export const getCriticalAssets = async (req: Request, res: Response): Promise<void> => {
  try {
    const assets = await prisma.asset.findMany({
      where: { riskLevel: { in: ['HIGH', 'CRITICAL'] } },
      take: 5,
      include: {
        lab: { select: { id: true, name: true } },
        _count: { select: { incidents: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener activos criticos' });
  }
};

export const getUpcomingMaintenances = async (req: Request, res: Response): Promise<void> => {
  try {
    const maintenances = await prisma.maintenance.findMany({
      where: { status: 'SCHEDULED' },
      take: 5,
      include: { asset: { select: { id: true, code: true, name: true } } },
      orderBy: { scheduledDate: 'asc' }
    });
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mantenimientos proximos' });
  }
};

export const getIndicators = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentYear = new Date().getFullYear();
    const allIncidents = await prisma.incident.findMany({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`)
        }
      },
      select: { createdAt: true }
    });

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const incidentsByMonth = monthNames.map((month, index) => {
      const count = allIncidents.filter((i) => i.createdAt.getMonth() === index).length;
      return { month, count };
    });

    const labs = await prisma.lab.findMany({
      include: {
        _count: { select: { incidents: true } }
      },
      orderBy: { name: 'asc' }
    });

    const incidentsByLab = labs.map((lab) => ({
      labName: lab.name,
      shortName: lab.name.replace('Laboratorio ', 'Lab ').substring(0, 8),
      count: lab._count.incidents
    }));

    const riskGroups = await prisma.asset.groupBy({
      by: ['riskLevel'],
      _count: { _all: true }
    });

    const totalAssets = await prisma.asset.count();
    const assetsByRisk = {
      optimal: 0,
      predictive: 0,
      critical: 0,
      total: totalAssets
    };

    riskGroups.forEach((group) => {
      if (group.riskLevel === 'LOW') assetsByRisk.optimal += group._count._all;
      else if (group.riskLevel === 'MEDIUM') assetsByRisk.predictive += group._count._all;
      else if (group.riskLevel === 'HIGH' || group.riskLevel === 'CRITICAL') assetsByRisk.critical += group._count._all;
    });

    const riskPercentages = {
      optimal: totalAssets > 0 ? Math.round((assetsByRisk.optimal / totalAssets) * 100) : 0,
      predictive: totalAssets > 0 ? Math.round((assetsByRisk.predictive / totalAssets) * 100) : 0,
      critical: totalAssets > 0 ? Math.round((assetsByRisk.critical / totalAssets) * 100) : 0
    };

    const totalMaintenances = await prisma.maintenance.count();
    const completedMaintenances = await prisma.maintenance.count({ where: { status: 'COMPLETED' } });
    const scheduledMaintenances = await prisma.maintenance.count({ where: { status: 'SCHEDULED' } });
    const inProgressMaintenances = await prisma.maintenance.count({ where: { status: 'IN_PROGRESS' } });

    const maintenanceCompletionPercent = totalMaintenances > 0
      ? Math.round((completedMaintenances / totalMaintenances) * 100)
      : 0;

    const topAssets = await prisma.asset.findMany({
      take: 3,
      include: {
        lab: { select: { id: true, name: true } },
        _count: { select: { incidents: true } }
      },
      orderBy: { incidents: { _count: 'desc' } }
    });

    res.json({
      incidentsByMonth,
      incidentsByLab,
      assetsByRisk: {
        ...assetsByRisk,
        percentages: riskPercentages
      },
      maintenanceStats: {
        total: totalMaintenances,
        completed: completedMaintenances,
        scheduled: scheduledMaintenances,
        inProgress: inProgressMaintenances,
        completionPercent: maintenanceCompletionPercent
      },
      topAssets: topAssets.map((a) => ({
        id: a.id,
        code: a.code,
        name: a.name,
        labName: a.lab?.name || 'Sin lab',
        incidentsCount: a._count.incidents,
        riskLevel: a.riskLevel
      }))
    });
  } catch (error) {
    console.error('Error indicators:', error);
    res.status(500).json({ message: 'Error al obtener indicadores' });
  }
};

// NUEVO: Reporte completo para exportar
export const getFullReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const [incidents, assets, maintenances, labs, users] = await Promise.all([
      prisma.incident.findMany({
        include: {
          asset: { select: { code: true, name: true } },
          lab: { select: { name: true } },
          reporter: { select: { fullName: true } },
          technician: { select: { fullName: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.asset.findMany({
        include: {
          lab: { select: { name: true } },
          _count: { select: { incidents: true, maintenances: true } }
        },
        orderBy: { code: 'asc' }
      }),
      prisma.maintenance.findMany({
        include: {
          asset: { select: { code: true, name: true } },
          technician: { select: { fullName: true } }
        },
        orderBy: { scheduledDate: 'desc' }
      }),
      prisma.lab.findMany({
        include: {
          _count: { select: { assets: true, incidents: true } }
        }
      }),
      prisma.user.findMany({
        select: {
          fullName: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({
      generatedAt: new Date().toISOString(),
      summary: {
        totalIncidents: incidents.length,
        totalAssets: assets.length,
        totalMaintenances: maintenances.length,
        totalLabs: labs.length,
        totalUsers: users.length
      },
      incidents,
      assets,
      maintenances,
      labs,
      users
    });
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({ message: 'Error al generar reporte' });
  }
};