import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const DEFAULT_PLANS = [
  { name: 'Gratis', price: 0, duration: 30, features: 'Hasta 10 clientes, productos basicos, 1 usuario' },
  { name: 'Basico', price: 99, duration: 365, features: 'Hasta 100 clientes, productos ilimitados, reportes basicos' },
  { name: 'Pro', price: 199, duration: 365, features: 'Clientes ilimitados, productos ilimitados, reportes avanzados, multiples usuarios' },
  { name: 'Premium', price: 399, duration: 365, features: 'Todo incluido, soporte prioritario, API access, integraciones' },
];

export async function GET() {
  try {
    let plans = await prisma.plan.findMany({ orderBy: { price: 'asc' } });
    
    if (plans.length === 0) {
      for (const plan of DEFAULT_PLANS) {
        await prisma.plan.create({ data: plan });
      }
      plans = await prisma.plan.findMany({ orderBy: { price: 'asc' } });
    }
    
    return NextResponse.json({ success: true, data: plans });
  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { name, price, duration, features } = await request.json();

    if (!name || !price || !duration || !features) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const plan = await prisma.plan.create({
      data: { name, price, duration, features }
    });

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error('Create plan error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}