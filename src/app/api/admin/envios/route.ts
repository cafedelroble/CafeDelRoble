import { NextRequest, NextResponse } from 'next/server';
import { OrderStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

const SHIPPING_STATUSES: OrderStatus[] = [
  'PENDIENTE_PAGO',
  'PAGO_RECIBIDO',
  'PREPARANDO',
  'LISTO_PARA_DESPACHO',
  'ENVIADO',
  'ENTREGADO',
];

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;
  const orders = await prisma.order.findMany({
    where: { status: { in: SHIPPING_STATUSES } },
    include: {
      user: { select: { name: true, lastName: true, phone: true, email: true } },
      items: { select: { productName: true, variantName: true, quantity: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({
    orders: orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      customer: order.user ? `${order.user.name} ${order.user.lastName}` : order.guestName || 'Invitado',
      phone: order.user?.phone || order.guestPhone || '',
      email: order.user?.email || order.guestEmail || '',
      address: order.guestAddress || '',
      city: order.guestCity || '',
      department: order.guestDepartment || '',
      items: order.items.map((item) => ({ name: item.productName, variant: item.variantName || null, quantity: item.quantity })),
      total: Number(order.total),
      date: order.createdAt,
    })),
  });
}

export async function PATCH(request: NextRequest) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  try {
    const body = await request.json();
    if (typeof body.id !== 'string' || !Object.values(OrderStatus).includes(body.status)) {
      return NextResponse.json({ error: 'Envío o estado inválido' }, { status: 400 });
    }
    const order = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({ where: { id: body.id }, data: { status: body.status } });
      const note = typeof body.note === 'string' && body.note.trim() ? body.note.trim() : 'Estado de envío actualizado';
      await tx.orderStatusHistory.create({ data: { orderId: body.id, status: body.status, note } });
      return updated;
    });
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating shipping:', error);
    return NextResponse.json({ error: 'No se pudo actualizar el envío' }, { status: 500 });
  }
}