import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.tenantId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const debts = await prisma.debt.findMany({
      where: { client: { tenantId: session.tenantId as string } },
      include: { client: true, items: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: debts });
  } catch (error) {
    console.error('Get debts error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.tenantId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { clientId, items, dueDate, notes } = await request.json();
    if (!clientId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Cliente y productos son requeridos' }, { status: 400 });
    }

    const totalAmount = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0);

    const debt = await prisma.debt.create({
      data: {
        clientId,
        totalAmount,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
        items: {
          create: items.map((item: { productId?: string; productName: string; quantity: number; price: number }) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { client: true, items: true }
    });
    return NextResponse.json({ success: true, data: debt });
  } catch (error) {
    console.error('Create debt error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}