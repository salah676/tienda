import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Tenant ID requerido' }, { status: 400 });
    }

    const categories = await prisma.category.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenantId, name } = body;

    if (!tenantId || !name) {
      return NextResponse.json({ success: false, error: 'Tenant ID y nombre requeridos' }, { status: 400 });
    }

    const existing = await prisma.category.findFirst({
      where: { tenantId, name },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: 'La categoría ya existe' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { tenantId, name },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
