import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email y contraseña requeridos' }, { status: 400 });
    }

    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' },
    });

    if (existingSuperAdmin) {
      return NextResponse.json({ success: false, error: 'Ya existe un superadmin' }, { status: 400 });
    }

    const superAdmin = await prisma.user.create({
      data: {
        email,
        password,
        name: name || 'SuperAdmin',
        role: 'SUPERADMIN',
        tenantId: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Superadmin creado exitosamente',
      data: { id: superAdmin.id, email: superAdmin.email },
    });
  } catch (error) {
    console.error('Seed superadmin error:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
