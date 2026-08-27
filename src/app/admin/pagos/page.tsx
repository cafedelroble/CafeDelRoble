import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function PaymentsPage() {
  const session = await auth();
  if (session?.user.role !== 'ADMIN' && session?.user.role !== 'SUPER_ADMIN') return <p>No autorizado</p>;
  const payments = await prisma.payment.findMany({ include: { order: { select: { orderNumber: true } } }, orderBy: { createdAt: 'desc' } });
  return <div className="space-y-6"><h1 className="font-serif text-3xl font-bold text-coffee-900">Pagos</h1><div className="rounded-xl border border-cream-200 bg-white p-4">{payments.length === 0 ? <p className="text-secondary-600">No hay pagos registrados.</p> : <div className="divide-y divide-cream-200">{payments.map((payment) => <div key={payment.id} className="flex justify-between p-3"><span>{payment.order.orderNumber} · {payment.method}</span><span>{payment.status} · ${Number(payment.amount).toLocaleString('es-CO')}</span></div>)}</div>}</div></div>;
}
