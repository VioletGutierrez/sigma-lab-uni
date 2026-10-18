\# Casos de Prueba Detallados - SIGMA-LAB UNI



\## Responsable

Alejandra Dayana Reyes Miranda



\## Pruebas por rol



\### Estudiante/Docente

\- Login exitoso con credenciales validas

\- Reportar incidente con todos los campos

\- Adjuntar imagen al reporte

\- Ver mis incidentes

\- Consultar notificaciones

\- Ver perfil propio

\- Cambiar contrasena



\### Tecnico

\- Login exitoso

\- Ver incidentes asignados

\- Registrar diagnostico tecnico

\- Actualizar estado del incidente

\- Registrar solucion aplicada

\- Cerrar incidente resuelto

\- Programar mantenimiento

\- Ver historial de activos

\- Consultar indicadores



\### Administrador

\- Login exitoso

\- Ver dashboard con metricas globales

\- Gestionar usuarios (crear, editar, activar, desactivar)

\- Gestionar laboratorios (crear, editar, eliminar)

\- Gestionar activos (crear, editar, eliminar)

\- Ver indicadores generales

\- Exportar reportes en HTML, CSV y JSON

\- Ver todas las notificaciones



\## Pruebas de integracion

\- Frontend -> Backend -> Base de Datos: Aprobado

\- Autenticacion JWT en cada peticion: Aprobado

\- Asignacion automatica de tecnicos: Aprobado

\- Notificaciones automaticas por eventos: Aprobado



\## Pruebas de errores

\- Login con credenciales incorrectas: Aprobado

\- Formulario vacio: Aprobado

\- Eliminar sin confirmar: Aprobado

\- Acceder a ruta protegida sin token: Aprobado (bloqueado)



\## Conclusion

Todos los casos de prueba fueron ejecutados exitosamente.

