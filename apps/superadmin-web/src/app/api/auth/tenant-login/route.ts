import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createToken, hashPassword, comparePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, tenantId } = await request.json();

    if (!email || !password || !tenantId) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 });
    }

    if (new Date(tenant.expiresAt) < new Date() || !tenant.isActive) {
      return NextResponse.json({ error: 'Tienda expirada o inactiva' }, { status: 403 });
    }

    const user = await prisma.user.findFirst({ where: { email, tenantId } });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales invalidas' }, { status: 401 });
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId
    });

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Tenant login error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}