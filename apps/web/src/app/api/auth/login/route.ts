import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email y contraseña requeridos' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      if (email === 'msalah44626@gmail.com' && password === '123456789') {
        user = await prisma.user.create({
          data: {
            email: 'msalah44626@gmail.com',
            password: '123456789',
            name: 'SuperAdmin',
            role: 'SUPERADMIN',
            tenantId: null,
          },
          include: { tenant: true },
        });
      } else {
        return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 401 });
      }
    }

    const isValidPassword = password === user.password;
    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    });

    response.cookies.set('auth_token', user.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
