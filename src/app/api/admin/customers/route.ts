import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;
  const customers = await prisma.user.findMany({
    where: { role: 'CLIENTE' },
    include: { _count: { select: { orders: true } }, orders: { select: { total: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ customers: customers.map((customer) => ({
    id: customer.id,
    name: `${customer.name} ${customer.lastName}`,
    email: customer.email,
    phone: customer.phone,
    createdAt: customer.createdAt,
    orders: customer._count.orders,
    totalSpent: customer.orders.reduce((total, order) => total + Number(order.total), 0),
  })) });
}
