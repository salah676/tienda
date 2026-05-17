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

    const { name, email, password, planId, phone, address, logo, banner } = await request.json();

    if (!name || !email || !password || !planId) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const { hashPassword } = await import('@/lib/auth');
    const hashed = await hashPassword(password);

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const tenant = await prisma.tenant.create({
      data: {
        name,
        email,
        logo,
        banner,
        contactPhone: phone,
        contactEmail: email,
        planId,
        subscriptionExpires: expiresAt,
        isActive: true,
      }
    });

    await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name,
        role: 'ADMIN',
        tenantId: tenant.id,
      }
    });

    return NextResponse.json({ success: true, data: tenant });
  } catch (error) {
    console.error('Create tenant error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}