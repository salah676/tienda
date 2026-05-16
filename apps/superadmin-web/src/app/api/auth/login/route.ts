import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createToken, hashPassword, comparePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = 'superadmin' } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y password son requeridos' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.superAdmin.findUnique({ where: { email } });
    if (existingUser && !name) {
      const isValid = await comparePassword(password, existingUser.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Credenciales invalidas' }, { status: 401 });
      }
      const token = await createToken({
        userId: existingUser.id,
        email: existingUser.email,
        role: 'superadmin'
      });
      return NextResponse.json({ success: true, token, user: { id: existingUser.id, email: existingUser.email, name: existingUser.name } });
    }

    if (name) {
      const hashed = await hashPassword(password);
      const user = await prisma.superAdmin.create({
        data: { email, password: hashed, name }
      });
      const token = await createToken({ userId: user.id, email: user.email, role: 'superadmin' });
      return NextResponse.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name } });
    }

    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}