import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.tenantId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { category: { tenantId: session.tenantId as string } } as object,
      include: { category: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.tenantId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { name, sku, price, stock, categoryId } = await request.json();
    if (!name || !price) {
      return NextResponse.json({ error: 'Nombre y precio son requeridos' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: { name, sku, price, stock: stock || 0, categoryId }
    });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}