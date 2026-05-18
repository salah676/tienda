import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, subdomain, logo, banner } = await request.json();

    if (!name || !email || !password || !subdomain) {
      return NextResponse.json({ success: false, error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'El correo ya está registrado' }, { status: 400 });
    }

    const existingTenant = await prisma.tenant.findFirst({
      where: { subdomain },
    });
    if (existingTenant) {
      return NextResponse.json({ success: false, error: 'El subdominio ya está en uso' }, { status: 400 });
    }

    let freePlan = await prisma.plan.findFirst({
      where: { price: 0 },
    });

    if (!freePlan) {
      await prisma.plan.createMany({
        data: [
          { name: 'Gratis', price: 0, duration: 30, features: 'Hasta 10 clientes' },
          { name: 'Basico', price: 99, duration: 365, features: 'Hasta 100 clientes' },
          { name: 'Pro', price: 199, duration: 365, features: 'Clientes ilimitados' },
          { name: 'Premium', price: 399, duration: 365, features: 'Todo incluido' },
        ],
      });
      freePlan = await prisma.plan.findFirst({ where: { price: 0 } });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const tenant = await prisma.tenant.create({
      data: {
        name,
        subdomain,
        logo: logo || null,
        banner: banner || null,
        isActive: true,
        status: 'ACTIVO',
        planId: freePlan.id,
        subscriptionStart: new Date(),
        subscriptionExpires: expiresAt,
      },
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        phone: phone || null,
        role: 'ADMIN',
        tenantId: tenant.id,
      },
    });

    await prisma.category.create({
      data: {
        name: 'General',
        tenantId: tenant.id,
      },
    });

    const superAdmin = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' },
    });

    if (superAdmin) {
      await prisma.notification.create({
        data: {
          userId: superAdmin.id,
          title: 'Nueva Tienda Registrada',
          message: `La tienda "${name}" (${subdomain}) se ha registrado exitosamente.`,
          type: 'TIENDA_NUEVA',
          data: {
            tenantId: tenant.id,
            tenantName: name,
            subdomain: subdomain,
            email: email,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Tienda creada exitosamente',
      data: { tenantId: tenant.id, userId: user.id },
    });
  } catch (error) {
    console.error('Registro tienda error:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
