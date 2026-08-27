import { NextRequest, NextResponse } from 'next/server';
import { OrderStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;
  const orders = await prisma.order.findMany({ include: { user: true, payments: true, items: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ orders: orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customer: order.user ? `${order.user.name} ${order.user.lastName}` : order.guestName || 'Invitado',
    email: order.user?.email || order.guestEmail || '',
    date: order.createdAt,
    total: Number(order.total),
    status: order.status,
    payment: order.payments[0]?.status || 'PENDIENTE',
    items: order.items.length,
  })) });
}

export async function PATCH(request: NextRequest) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  try {
    const body = await request.json();
    if (typeof body.id !== 'string' || !Object.values(OrderStatus).includes(body.status)) return NextResponse.json({ error: 'Pedido o estado inválido' }, { status: 400 });
    const order = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({ where: { id: body.id }, data: { status: body.status } });
      await tx.orderStatusHistory.create({ data: { orderId: body.id, status: body.status, note: 'Estado actualizado desde administración' } });
      return updated;
    });
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'No se pudo actualizar el pedido' }, { status: 500 });
  }
}
