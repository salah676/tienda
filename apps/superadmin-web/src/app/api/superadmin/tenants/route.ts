import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const tenants = await prisma.tenant.findMany({
      include: { plan: true, _count: { select: { clients: true } } }
    });
    return NextResponse.json({ success: true, data: tenants });
  } catch (error) {
    console.error('Get tenants error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { name, subdomain, email, password, planId, phone, address } = await request.json();

    if (!name || !subdomain || !email || !password || !planId) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const { hashPassword } = await import('@/lib/auth');
    const hashed = await hashPassword(password);

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const tenant = await prisma.tenant.create({
      data: {
        name,
        subdomain,
        email,
        password: hashed,
        phone,
        address,
        planId,
        expiresAt,
      }
    });

    return NextResponse.json({ success: true, data: tenant });
  } catch (error) {
    console.error('Create tenant error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}