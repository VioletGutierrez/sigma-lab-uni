markdown

\# Diagrama de Modelos - SIGMA-LAB UNI



\## Relaciones entre entidades



\### User

\- Un usuario puede reportar muchos incidentes

\- Un usuario puede atender muchos incidentes (como tecnico)

\- Un usuario puede realizar muchos mantenimientos

\- Un usuario puede recibir muchas notificaciones



\### Lab

\- Un laboratorio contiene muchos activos

\- Un laboratorio presenta muchos incidentes



\### Asset

\- Un activo pertenece a un laboratorio

\- Un activo presenta muchos incidentes

\- Un activo recibe muchos mantenimientos

\- Un activo tiene muchos eventos en su historial



\### Incident

\- Un incidente es reportado por un usuario

\- Un incidente es atendido por un tecnico (opcional)

\- Un incidente pertenece a un activo

\- Un incidente pertenece a un laboratorio



\### Maintenance

\- Un mantenimiento pertenece a un activo

\- Un mantenimiento es realizado por un tecnico

\- Un mantenimiento puede resolver un incidente (opcional)



\### AssetHistory

\- Cada evento pertenece a un activo

\- Registra: INCIDENT\_REPORTED, MAINTENANCE\_SCHEDULED,

&#x20; MAINTENANCE\_COMPLETED, ACQUISITION, STATUS\_CHANGED



\### Notification

\- Cada notificacion pertenece a un usuario



