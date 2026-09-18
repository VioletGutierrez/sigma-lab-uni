// Responsable: Edith de los Angeles Munguia Morales - Backend
import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Iniciando seed de la base de datos...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const techPassword = await bcrypt.hash('tech123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@uni.edu.ni' },
    update: {},
    create: {
      email: 'admin@uni.edu.ni',
      password: adminPassword,
      fullName: 'Administrador UNI',
      role: 'ADMIN',
      isActive: true
    }
  });

  const tech = await prisma.user.upsert({
    where: { email: 'tecnico@uni.edu.ni' },
    update: {},
    create: {
      email: 'tecnico@uni.edu.ni',
      password: techPassword,
      fullName: 'Tecnico Laboratorio',
      role: 'TECHNICIAN',
      isActive: true
    }
  });

  const student = await prisma.user.upsert({
    where: { email: 'estudiante@uni.edu.ni' },
    update: {},
    create: {
      email: 'estudiante@uni.edu.ni',
      password: studentPassword,
      fullName: 'Estudiante UNI',
      role: 'STUDENT',
      isActive: true
    }
  });

  const lab1 = await prisma.lab.upsert({
    where: { code: 'LAB-301' },
    update: {},
    create: {
      name: 'Laboratorio 301',
      code: 'LAB-301',
      description: 'Laboratorio de computacion',
      location: 'Edificio A, Piso 3',
      capacity: 30,
      responsible: 'Ing. Maria Lopez'
    }
  });

  const lab2 = await prisma.lab.upsert({
    where: { code: 'LAB-302' },
    update: {},
    create: {
      name: 'Laboratorio 302',
      code: 'LAB-302',
      description: 'Laboratorio de computacion',
      location: 'Edificio A, Piso 3',
      capacity: 25,
      responsible: 'Ing. Juan Perez'
    }
  });

  const asset1 = await prisma.asset.upsert({
    where: { code: 'PC-001' },
    update: {},
    create: {
      code: 'PC-001',
      name: 'Dell OptiPlex 7090',
      brand: 'Dell',
      model: 'OptiPlex 7090',
      serialNumber: 'SN-DELL-001',
      acquisitionDate: new Date('2024-01-15'),
      status: 'OPERATIONAL',
      riskLevel: 'LOW',
      labId: lab1.id
    }
  });

  const asset2 = await prisma.asset.upsert({
    where: { code: 'PC-002' },
    update: {},
    create: {
      code: 'PC-002',
      name: 'Lenovo ThinkCentre M90',
      brand: 'Lenovo',
      model: 'ThinkCentre M90',
      serialNumber: 'SN-LEN-002',
      acquisitionDate: new Date('2024-02-20'),
      status: 'OPERATIONAL',
      riskLevel: 'LOW',
      labId: lab1.id
    }
  });

  const asset3 = await prisma.asset.upsert({
    where: { code: 'AC-001' },
    update: {},
    create: {
      code: 'AC-001',
      name: 'Aire Acondicionado Samsung',
      brand: 'Samsung',
      model: 'AC-24K',
      serialNumber: 'SN-SAM-003',
      acquisitionDate: new Date('2023-06-10'),
      status: 'OPERATIONAL',
      riskLevel: 'LOW',
      labId: lab2.id
    }
  });

  console.log('Seed completado exitosamente');
  console.log(`Usuario admin: admin@uni.edu.ni / admin123`);
  console.log(`Usuario tecnico: tecnico@uni.edu.ni / tech123`);
  console.log(`Usuario estudiante: estudiante@uni.edu.ni / student123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });