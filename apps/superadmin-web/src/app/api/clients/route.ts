import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.tenantId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const clients = await prisma.client.findMany({
      where: { tenantId: session.tenantId as string },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.tenantId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { name, email, phone, address } = await request.json();
    if (!name || !phone) {
      return NextResponse.json({ error: 'Nombre y telefono son requeridos' }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: { name, email, phone, address, tenantId: session.tenantId as string }
    });
    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}