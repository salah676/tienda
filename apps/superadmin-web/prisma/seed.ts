import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  const plans = [
    { name: 'Bronce', price: 99, duration: 365, features: '5 usuarios, 100 clientes, Soporte basico' },
    { name: 'Oro', price: 199, duration: 365, features: '15 usuarios, 500 clientes, Soporte prioritario' },
    { name: 'Premium', price: 399, duration: 365, features: 'Usuarios ilimitados, Clientes ilimitados, Soporte 24/7' },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.name.toLowerCase() },
      update: plan,
      create: { id: plan.name.toLowerCase(), ...plan },
    });
  }

  const superadminEmail = 'admin@debtmanager.ma';
  const existingAdmin = await prisma.superAdmin.findUnique({ where: { email: superadminEmail } });

  if (!existingAdmin) {
    const hashed = await bcrypt.hash('password123', 10);
    await prisma.superAdmin.create({
      data: { email: superadminEmail, password: hashed, name: 'SuperAdmin' }
    });
    console.log('SuperAdmin created: admin@debtmanager.ma / password123');
  } else {
    console.log('SuperAdmin already exists');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());