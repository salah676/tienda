import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const payments = await prisma.payment.findMany({
      where: { debt: { client: { userId: session.userId } } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    console.error('Get client payments error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}