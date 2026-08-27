'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

type Order = { id: string; orderNumber: string; customer: string; email: string; date: string; total: number; payment: string; status: string };

const statusLabels: Record<string, string> = {
  PENDIENTE_PAGO: 'Pendiente de pago',
  PAGO_RECIBIDO: 'Pago recibido',
  PREPARANDO: 'Preparando',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

const statusColors: Record<string, string> = {
  PENDIENTE_PAGO: 'bg-cream-100 text-cream-700',
  PAGO_RECIBIDO: 'bg-primary-100 text-primary-700',
  PREPARANDO: 'bg-nature-100 text-nature-700',
  ENVIADO: 'bg-blue-50 text-blue-600',
  ENTREGADO: 'bg-green-50 text-green-600',
  CANCELADO: 'bg-red-50 text-red-600',
};

export default function AdminPedidosPage() {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { fetch('/api/admin/orders', { cache: 'no-store' }).then((response) => response.json()).then((data) => setOrders(data.orders || [])); }, []);
  const filtered = orders.filter((order) => `${order.orderNumber} ${order.customer} ${order.email}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-coffee-900">Pedidos</h1>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
          <input
            placeholder="Buscar pedido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-cream-300 bg-white pl-10 pr-3 py-2 text-sm text-coffee-900"
          />
        </div>
        <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" /> Filtros</Button>
      </div>

      <div className="rounded-xl border border-cream-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cream-200">
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase"># Pedido</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Cliente</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Fecha</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Total</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Pago</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Estado</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-cream-50">
                <td className="p-4 text-sm font-medium text-coffee-900">{order.orderNumber}</td>
                <td className="p-4">
                  <p className="text-sm text-coffee-900">{order.customer}</p>
                  <p className="text-xs text-secondary-500">{order.email}</p>
                </td>
                <td className="p-4 text-sm text-secondary-600">{new Date(order.date).toLocaleDateString('es-CO')}</td>
                <td className="p-4 text-sm font-medium text-coffee-900">{formatPrice(order.total)}</td>
                <td className="p-4 text-sm text-secondary-600">{order.payment}</td>
                <td className="p-4">
                  <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                </td>
                <td className="p-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
