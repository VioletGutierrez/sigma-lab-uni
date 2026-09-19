\# Modelos de Base de Datos



Este directorio contiene la documentacion de los modelos de datos del sistema SIGMA-LAB UNI.



\## Modelos definidos



Los modelos estan definidos en backend/prisma/schema.prisma:



\- User (Usuarios)

\- Lab (Laboratorios)

\- Asset (Activos)

\- Incident (Incidentes)

\- Maintenance (Mantenimientos)

\- AssetHistory (Historial de activos)

\- Notification (Notificaciones)



\## Enumeraciones



\- Role (STUDENT, TECHNICIAN, ADMIN)

\- AssetStatus (OPERATIONAL, MAINTENANCE, REPAIR, DISPOSED)

\- RiskLevel (LOW, MEDIUM, HIGH, CRITICAL)

\- Priority (LOW, MEDIUM, HIGH, CRITICAL)

\- IncidentStatus (PENDING, ASSIGNED, DIAGNOSING, REPAIRING, RESOLVED, CLOSED)

\- MaintenanceType (PREVENTIVE, CORRECTIVE, PREDICTIVE)

\- MaintenanceStatus (SCHEDULED, IN\_PROGRESS, COMPLETED, CANCELLED)



\## Responsable



Edith de los Angeles Munguia Morales - Backend

