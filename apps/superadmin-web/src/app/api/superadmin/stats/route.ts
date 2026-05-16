import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const [tenants, clients, debts, payments] = await Promise.all([
      prisma.tenant.findMany(),
      prisma.client.findMany(),
      prisma.debt.findMany(),
      prisma.payment.findMany(),
    ]);

    const totalTenants = tenants.length;
    const activeTenants = tenants.filter(t => new Date(t.expiresAt) > new Date() && t.isActive).length;
    const expiredTenants = totalTenants - activeTenants;
    const totalClients = clients.length;
    const totalDebts = debts.length;
    const totalAmount = debts.reduce((sum, d) => sum + d.totalAmount, 0);
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      success: true,
      data: {
        total_tenants: totalTenants,
        active_tenants: activeTenants,
        expired_tenants: expiredTenants,
        total_clients: totalClients,
        total_debts: totalDebts,
        total_amount: totalAmount,
        total_collected: totalCollected,
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}