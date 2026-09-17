# SIGMA-LAB UNI

**Sistema Integral de Gestion de Mantenimiento e Incidentes de Laboratorios**

Proyecto academico desarrollado para la asignatura **Diseno de Sistemas en Internet**
de la Universidad Nacional de Ingenieria (UNI) - Recinto Universitario Simon Bolivar.

## Stack Tecnologico

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Base de Datos:** PostgreSQL + Prisma ORM
- **Seguridad:** JWT + bcryptjs + Helmet + CORS

## Equipo de Desarrollo

- **Violet Fernanda Gutierrez Reyes** - Frontend
- **Edith de los Angeles Munguia Morales** - Backend
- **Alejandra Dayana Reyes Miranda** - Analisis y QA

**Docente:** Lic. Walter Quintero Acevedo

## Credenciales de Prueba

| Rol | Email | Contrasena |
|-----|-------|-----------|
| Administrador | admin@uni.edu.ni | admin123 |
| Tecnico | tecnico@uni.edu.ni | tech123 |
| Estudiante | estudiante@uni.edu.ni | student123 |

## Instalacion

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev