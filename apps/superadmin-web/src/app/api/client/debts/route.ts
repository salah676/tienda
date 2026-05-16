import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const debts = await prisma.debt.findMany({
      where: { client: { userId: session.userId } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: debts });
  } catch (error) {
    console.error('Get client debts error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}