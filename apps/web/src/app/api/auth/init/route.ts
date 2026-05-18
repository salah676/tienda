import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$connect();
    
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' }
    });

    if (!existingSuperAdmin) {
      await prisma.user.create({
        data: {
          email: 'msalah44626@gmail.com',
          password: '123456789',
          name: 'SuperAdmin',
          role: 'SUPERADMIN',
          tenantId: null,
        },
      });
    }

    const plans = await prisma.plan.findMany();
    if (plans.length === 0) {
      await prisma.plan.createMany({
        data: [
          { name: 'Gratis', price: 0, duration: 30, features: 'Hasta 10 clientes' },
          { name: 'Basico', price: 99, duration: 365, features: 'Hasta 100 clientes' },
          { name: 'Pro', price: 199, duration: 365, features: 'Clientes ilimitados' },
          { name: 'Premium', price: 399, duration: 365, features: 'Todo incluido' },
        ],
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Sistema inicializado correctamente',
      superAdminCreated: !existingSuperAdmin
    });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
