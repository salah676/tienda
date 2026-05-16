import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({ orderBy: { price: 'asc' } });
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