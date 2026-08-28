import { NextRequest, NextResponse } from 'next/server';
import { PaymentStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;
  const payments = await prisma.payment.findMany({
    include: {
      order: { select: { id: true, orderNumber: true, status: true, user: { select: { name: true, lastName: true } }, guestName: true, guestEmail: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({
    payments: payments.map((payment) => ({
      id: payment.id,
      orderId: payment.orderId,
      orderNumber: payment.order.orderNumber,
      orderStatus: payment.order.status,
      customer: payment.order.user
        ? `${payment.order.user.name} ${payment.order.user.lastName}`
        : payment.order.guestName || payment.order.guestEmail || 'Invitado',
      method: payment.method,
      status: payment.status,
      amount: Number(payment.amount),
      currency: payment.currency,
      transactionId: payment.transactionId,
      date: payment.createdAt,
    })),
  });
}

export async function PATCH(request: NextRequest) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  try {
    const body = await request.json();
    if (typeof body.id !== 'string' || !Object.values(PaymentStatus).includes(body.status)) {
      return NextResponse.json({ error: 'Pago o estado inválido' }, { status: 400 });
    }
    const payment = await prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({ where: { id: body.id }, data: { status: body.status } });
      const order = await tx.order.findUnique({ where: { id: updated.orderId } });
      if (order && body.status === 'APROBADO' && order.status === 'PENDIENTE_PAGO') {
        await tx.order.update({ where: { id: order.id }, data: { status: 'PAGO_RECIBIDO' } });
        await tx.orderStatusHistory.create({
          data: { orderId: order.id, status: 'PAGO_RECIBIDO', note: `Pago aprobado (${updated.method})` },
        });
      }
      return updated;
    });
    return NextResponse.json({ payment });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: 'No se pudo actualizar el pago' }, { status: 500 });
  }
}