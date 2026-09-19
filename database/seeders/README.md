markdown

\# Seeders de Base de Datos



Este directorio documenta los datos de prueba del sistema SIGMA-LAB UNI.



\## Ubicacion del seeder principal



El seeder esta definido en backend/src/utils/seed.ts.



\## Datos que se cargan



\### Usuarios

\- admin@uni.edu.ni / admin123 (Administrador)

\- tecnico@uni.edu.ni / tech123 (Tecnico)

\- estudiante@uni.edu.ni / student123 (Estudiante)



\### Laboratorios

\- Laboratorio 301 (LAB-301)

\- Laboratorio 302 (LAB-302)



\### Activos

\- PC-001 Dell OptiPlex 7090 (Lab 301)

\- PC-002 Lenovo ThinkCentre M90 (Lab 301)

\- AC-001 Aire Acondicionado Samsung (Lab 302)



\## Como ejecutar el seeder



cd backend

npx prisma db seed



\## Responsable



Edith de los Angeles Munguia Morales - Backend



