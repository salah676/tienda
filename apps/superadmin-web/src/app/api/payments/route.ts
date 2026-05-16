import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.tenantId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const payments = await prisma.payment.findMany({
      where: { debt: { client: { tenantId: session.tenantId as string } } },
      include: { debt: { include: { client: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.tenantId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { debtId, amount, method, reference } = await request.json();
    if (!debtId || !amount || !method) {
      return NextResponse.json({ error: 'Campos requeridos' }, { status: 400 });
    }

    const debt = await prisma.debt.findUnique({ where: { id: debtId } });
    if (!debt) {
      return NextResponse.json({ error: 'Deuda no encontrada' }, { status: 404 });
    }

    const newPaidAmount = debt.paidAmount + amount;
    const newStatus = newPaidAmount >= debt.totalAmount ? 'paid' : 'partial';

    const [payment] = await prisma.$transaction([
      prisma.payment.create({ data: { debtId, amount, method, reference } }),
      prisma.debt.update({ where: { id: debtId }, data: { paidAmount: newPaidAmount, status: newStatus } })
    ]);

    return NextResponse.json({ success: true, data: payment });
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}