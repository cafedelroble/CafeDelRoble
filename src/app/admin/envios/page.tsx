import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ShippingPage() {
  const session = await auth();
  if (session?.user.role !== 'ADMIN' && session?.user.role !== 'SUPER_ADMIN') return <p>No autorizado</p>;
  const orders = await prisma.order.findMany({ select: { id: true, orderNumber: true, guestName: true, guestCity: true, guestAddress: true, status: true }, orderBy: { createdAt: 'desc' } });
  return <div className="space-y-6"><h1 className="font-serif text-3xl font-bold text-coffee-900">Envíos</h1><div className="rounded-xl border border-cream-200 bg-white p-4">{orders.length === 0 ? <p className="text-secondary-600">No hay pedidos para gestionar envíos.</p> : <div className="divide-y divide-cream-200">{orders.map((order) => <div key={order.id} className="p-3"><p className="font-medium">{order.orderNumber} · {order.guestName || 'Cliente registrado'}</p><p className="text-sm text-secondary-600">{order.guestAddress || 'Dirección no registrada'} · {order.guestCity || 'Ciudad no registrada'} · {order.status}</p></div>)}</div>}</div></div>;
}
