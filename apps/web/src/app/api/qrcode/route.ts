import { NextResponse } from 'next/server';
import prisma from '@debt-manager/db';
import { v4 as uuidv4 } from 'uuid';

function generateCode(): string {
  return uuidv4().split('-')[0].toUpperCase();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const code = searchParams.get('code');

    if (code) {
      const qrCode = await prisma.qRCode.findUnique({
        where: { code },
        include: { items: true },
      });

      if (!qrCode) {
        return NextResponse.json({ success: false, error: 'Código QR no encontrado' }, { status: 404 });
      }

      const now = new Date();
      const isExpired = now > qrCode.expiresAt;
      
      if (isExpired && qrCode.status === 'PENDIENTE') {
        await prisma.qRCode.update({
          where: { id: qrCode.id },
          data: { status: 'EXPIRADO' },
        });
        qrCode.status = 'EXPIRADO';
      }

      return NextResponse.json({ success: true, data: qrCode });
    }

    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Tenant ID requerido' }, { status: 400 });
    }

    const qrCodes = await prisma.qRCode.findMany({
      where: { tenantId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, data: qrCodes });
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenantId, items, totalAmount, validityMinutes } = body;

    if (!tenantId || !items || !totalAmount) {
      return NextResponse.json({ success: false, error: 'Datos incompletos' }, { status: 400 });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + (validityMinutes || 60) * 60 * 1000);

    const qrCode = await prisma.qRCode.create({
      data: {
        tenantId,
        code,
        totalAmount: parseFloat(totalAmount),
        status: 'PENDIENTE',
        expiresAt,
        items: {
          create: items.map((item: any) => ({
            productName: item.productName,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            totalPrice: parseFloat(item.totalPrice),
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        code: qrCode.code,
        expiresAt: qrCode.expiresAt,
        totalAmount: qrCode.totalAmount,
        items: qrCode.items,
      }
    });
  } catch (error) {
    console.error('Error creating QR code:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { code, validatorId } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Código requerido' }, { status: 400 });
    }

    const qrCode = await prisma.qRCode.findUnique({
      where: { code },
    });

    if (!qrCode) {
      return NextResponse.json({ success: false, error: 'Código QR no encontrado' }, { status: 404 });
    }

    if (qrCode.status !== 'PENDIENTE') {
      return NextResponse.json({ 
        success: false, 
        error: `El código ya ha sido ${qrCode.status.toLowerCase()}` 
      }, { status: 400 });
    }

    const now = new Date();
    if (now > qrCode.expiresAt) {
      await prisma.qRCode.update({
        where: { id: qrCode.id },
        data: { status: 'EXPIRADO' },
      });
      return NextResponse.json({ success: false, error: 'El código QR ha expirado' }, { status: 400 });
    }

    const validated = await prisma.qRCode.update({
      where: { id: qrCode.id },
      data: { 
        status: 'VALIDADO',
        validatedAt: now,
        validatorId: validatorId || null,
      },
      include: { items: true },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Compra validada correctamente',
      data: validated 
    });
  } catch (error) {
    console.error('Error validating QR code:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}