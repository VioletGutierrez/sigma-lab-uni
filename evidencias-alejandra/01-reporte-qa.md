\# Reporte de Pruebas QA - SIGMA-LAB UNI



\## Responsable

Alejandra Dayana Reyes Miranda



\## Fecha

Septiembre 2026



\## Descripcion

Reporte de las pruebas funcionales realizadas al sistema SIGMA-LAB UNI para verificar el correcto funcionamiento de cada modulo.



\## Casos de prueba ejecutados



| # | Modulo | Caso de prueba | Resultado |

|---|--------|----------------|-----------|

| 1 | Autenticacion | Login con administrador | Aprobado |

| 2 | Autenticacion | Login con tecnico | Aprobado |

| 3 | Autenticacion | Login con estudiante | Aprobado |

| 4 | Autenticacion | Login con credenciales invalidas | Aprobado (rechazado) |

| 5 | Incidentes | Reportar incidente | Aprobado |

| 6 | Incidentes | Ver mis incidentes | Aprobado |

| 7 | Incidentes | Ver detalle de incidente | Aprobado |

| 8 | Incidentes | Actualizar estado del incidente | Aprobado |

| 9 | Incidentes | Registrar solucion | Aprobado |

| 10 | Incidentes | Cerrar incidente | Aprobado |

| 11 | Dashboard | Ver metricas del dashboard | Aprobado |

| 12 | Activos | Listar activos | Aprobado |

| 13 | Activos | Ver detalle de activo | Aprobado |

| 14 | Activos | Ver historial de activo | Aprobado |

| 15 | Mantenimientos | Listar mantenimientos | Aprobado |

| 16 | Mantenimientos | Programar mantenimiento | Aprobado |

| 17 | Indicadores | Ver panel analitico | Aprobado |

| 18 | Notificaciones | Ver notificaciones | Aprobado |

| 19 | Perfil | Ver y editar perfil | Aprobado |

| 20 | Usuarios | Gestionar usuarios | Aprobado |



\## Pruebas de navegacion

\- Menu lateral adaptable por rol: Aprobado

\- Sidebar desplegable: Aprobado

\- Modo oscuro: Aprobado

\- Notificaciones con contador: Aprobado

\- Rutas protegidas por rol: Aprobado



\## Pruebas de seguridad basicas

\- Endpoint protegido rechaza peticiones sin token: Aprobado

\- Roles no pueden acceder a rutas no autorizadas: Aprobado



\## Conclusion

El sistema cumple con todos los casos de uso definidos en la fase de requisitos. Todas las pruebas fueron exitosas.

