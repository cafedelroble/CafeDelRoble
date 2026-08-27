import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ReportsPage() {
  const session = await auth();
  if (session?.user.role !== 'ADMIN' && session?.user.role !== 'SUPER_ADMIN') return <p>No autorizado</p>;
  const [orders, products, customers] = await Promise.all([
    prisma.order.findMany({ select: { total: true, status: true } }),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { role: 'CLIENTE' } }),
  ]);
  const sales = orders.filter((order) => order.status !== 'CANCELADO').reduce((total, order) => total + Number(order.total), 0);
  return <div className="space-y-6"><h1 className="font-serif text-3xl font-bold text-coffee-900">Reportes</h1><div className="grid gap-4 sm:grid-cols-3">{[['Ventas registradas', `$${sales.toLocaleString('es-CO')}`], ['Pedidos', String(orders.length)], ['Clientes', String(customers)], ['Productos', String(products)]].map(([label, value]) => <div key={label} className="rounded-xl border border-cream-200 bg-white p-5"><p className="text-sm text-secondary-500">{label}</p><p className="mt-2 text-2xl font-bold text-coffee-900">{value}</p></div>)}</div>{orders.length === 0 && <p className="text-secondary-600">No hay datos suficientes para generar reportes.</p>}</div>;
}
