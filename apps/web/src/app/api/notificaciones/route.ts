import { NextResponse } from 'next/server';
import prisma from '@debt-manager/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID requerido' }, { status: 400 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, read: false },
    });

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { notificationId, action } = await request.json();

    if (action === 'markRead') {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
    }

    if (action === 'markAllRead') {
      await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}