import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDateShort } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const statusLabels: Record<string, string> = {
  PENDIENTE_PAGO: 'Pendiente de pago',
  PAGO_RECIBIDO: 'Pago recibido',
  PREPARANDO: 'Preparando',
  LISTO_PARA_DESPACHO: 'Listo para despacho',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

const methodLabels: Record<string, string> = {
  PSE: 'PSE',
  TARJETA: 'Tarjeta',
  NEQUI: 'Nequi',
  WHATSAPP: 'WhatsApp',
  EFECTIVO: 'Efectivo',
};

export default async function AdminReportesPage() {
  const session = await auth();
  if (session?.user.role !== 'ADMIN' && session?.user.role !== 'SUPER_ADMIN') return <p>No autorizado</p>;

  const [orders, customerCount, productCount, payments, topItems] = await Promise.all([
    prisma.order.findMany({ select: { id: true, total: true, status: true, createdAt: true } }),
    prisma.user.count({ where: { role: 'CLIENTE' } }),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.payment.findMany({ select: { method: true, status: true, amount: true } }),
    prisma.orderItem.groupBy({ by: ['productName'], _sum: { quantity: true, total: true }, orderBy: { _sum: { total: 'desc' } }, take: 6 }),
  ]);

  const completed = orders.filter((order) => order.status !== 'CANCELADO');
  const sales = completed.reduce((sum, order) => sum + Number(order.total), 0);
  const averageTicket = completed.length ? sales / completed.length : 0;

  const months: { label: string; total: number; orders: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    start.setMonth(start.getMonth() - i);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    const monthOrders = completed.filter((order) => order.createdAt >= start && order.createdAt < end);
    months.push({
      label: start.toLocaleDateString('es-CO', { month: 'short' }),
      total: monthOrders.reduce((sum, order) => sum + Number(order.total), 0),
      orders: monthOrders.length,
    });
  }
  const maxMonth = Math.max(1, ...months.map((month) => month.total));

  const byStatus = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const approvedAmount = payments
    .filter((payment) => payment.status === 'APROBADO')
    .reduce<Record<string, number>>((acc, payment) => {
      acc[payment.method] = (acc[payment.method] || 0) + Number(payment.amount);
      return acc;
    }, {});
  const totalApproved = Object.values(approvedAmount).reduce((sum, value) => sum + value, 0);

  const kpis = [
    { label: 'Ventas registradas', value: formatPrice(sales), sub: `${completed.length} pedidos` },
    { label: 'Ticket promedio', value: formatPrice(averageTicket), sub: 'por pedido completado' },
    { label: 'Pagos aprobados', value: formatPrice(totalApproved), sub: `${payments.filter((p) => p.status === 'APROBADO').length} transacciones` },
    { label: 'Clientes', value: String(customerCount), sub: 'cuentas de clientes' },
    { label: 'Productos activos', value: String(productCount), sub: 'sin eliminar' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-coffee-900">Reportes</h1>
        <p className="mt-1 text-sm text-secondary-600">Resumen general del negocio.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-secondary-500">{kpi.label}</p>
            <p className="mt-2 text-xl font-bold text-coffee-900">{kpi.value}</p>
            <p className="mt-1 text-xs text-secondary-500">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-coffee-900">Ventas por mes</h2>
          <p className="mb-4 text-xs text-secondary-500">Últimos 6 meses · pedidos no cancelados</p>
          {months.some((month) => month.total > 0) ? (
            <div className="space-y-3">
              {months.map((month) => (
                <div key={month.label} className="flex items-center gap-3">
                  <span className="w-12 shrink-0 text-xs font-medium text-secondary-600">{month.label}</span>
                  <div className="h-6 flex-1 overflow-hidden rounded-md bg-cream-100">
                    <div
                      className="flex h-full items-center rounded-md bg-primary-600"
                      style={{ width: `${Math.max(4, (month.total / maxMonth) * 100)}%` }}
                    >
                      <span className="truncate px-2 text-[11px] font-semibold text-white">
                        {month.total > 0 ? formatPrice(month.total) : ''}
                      </span>
                    </div>
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs text-secondary-500">{month.orders} pedidos</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-secondary-600">No hay ventas registradas en los últimos meses.</p>
          )}
        </div>

        <div className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-coffee-900">Pedidos por estado</h2>
          <p className="mb-4 text-xs text-secondary-500">Distribución actual de todos los pedidos</p>
          <div className="space-y-3">
            {Object.entries(statusLabels).map(([status, label]) => {
              const count = byStatus[status] || 0;
              const totalOrders = orders.length || 1;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 text-sm text-secondary-600">{label}</span>
                  <div className="h-5 flex-1 overflow-hidden rounded-full bg-cream-100">
                    <div className="h-full rounded-full bg-coffee-500" style={{ width: `${(count / totalOrders) * 100}%` }} />
                  </div>
                  <span className="w-10 shrink-0 text-right text-sm font-medium text-coffee-900">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-coffee-900">Productos más vendidos</h2>
          <p className="mb-4 text-xs text-secondary-500">Por ingresos generados</p>
          {topItems.length === 0 ? (
            <p className="text-sm text-secondary-600">Aún no hay ventas de productos.</p>
          ) : (
            <div className="space-y-2">
              {topItems.map((item, index) => (
                <div key={item.productName} className="flex items-center justify-between gap-3 border-b border-cream-100 pb-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coffee-100 text-xs font-bold text-coffee-700">
                      {index + 1}
                    </span>
                    <span className="text-sm text-coffee-900">{item.productName}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-coffee-900">{formatPrice(Number(item._sum.total || 0))}</p>
                    <p className="text-xs text-secondary-500">{item._sum.quantity || 0} unidades</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-coffee-900">Recaudo por método de pago</h2>
          <p className="mb-4 text-xs text-secondary-500">Montos aprobados por canal</p>
          {totalApproved === 0 ? (
            <p className="text-sm text-secondary-600">Aún no hay pagos aprobados.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(methodLabels).map(([method, label]) => {
                const amount = approvedAmount[method] || 0;
                const pct = (amount / Math.max(1, totalApproved)) * 100;
                return (
                  <div key={method} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-sm text-secondary-600">{label}</span>
                    <div className="h-5 flex-1 overflow-hidden rounded-full bg-cream-100">
                      <div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.max(4, pct)}%` }} />
                    </div>
                    <span className="w-24 shrink-0 text-right text-sm font-medium text-coffee-900">{formatPrice(amount)}</span>
                  </div>
                );
              })}
            </div>
          )}

          {orders.length === 0 && (
            <p className="mt-6 text-sm text-secondary-600">
              No hay datos suficientes para generar reportes. Crea pedidos de prueba para ver el análisis.
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-secondary-500">Generado el {formatDateShort(new Date())}.</p>
    </div>
  );
}