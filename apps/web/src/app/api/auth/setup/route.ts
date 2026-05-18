import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();
    
    if (secret !== 'setup123') {
      return NextResponse.json({ success: false, error: 'Secret inválido' }, { status: 401 });
    }

    let superAdmin = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' },
    });

    if (!superAdmin) {
      superAdmin = await prisma.user.create({
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
          { name: 'Gratis', price: 0, duration: 30, features: 'Hasta 10 clientes, productos basicos, 1 usuario' },
          { name: 'Basico', price: 99, duration: 365, features: 'Hasta 100 clientes, productos ilimitados' },
          { name: 'Pro', price: 199, duration: 365, features: 'Clientes ilimitados, reportes avanzados' },
          { name: 'Premium', price: 399, duration: 365, features: 'Todo incluido, soporte prioritario' },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Setup completado',
      superAdmin: superAdmin.email,
      plansCount: plans.length || 4,
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
