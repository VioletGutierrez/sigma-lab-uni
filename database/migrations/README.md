markdown

\# Migraciones de Base de Datos



Este directorio documenta las migraciones del sistema SIGMA-LAB UNI.



\## Ubicacion real de las migraciones



Las migraciones estan en backend/prisma/migrations/.



\## Como ejecutar migraciones



cd backend

npx prisma migrate dev --name nombre\_migracion



\## Como resetear la base de datos



cd backend

npx prisma migrate reset



\## Como aplicar migraciones en produccion



cd backend

npx prisma migrate deploy



\## Estructura de la base de datos



Tablas: User, Lab, Asset, Incident, Maintenance, AssetHistory, Notification

Enums: Role, AssetStatus, RiskLevel, Priority, IncidentStatus,

MaintenanceType, MaintenanceStatus



\## Responsable



Edith de los Angeles Munguia Morales - Backend



