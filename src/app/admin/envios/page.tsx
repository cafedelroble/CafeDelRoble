'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import { Truck, Search, MapPin } from 'lucide-react';

type ShippingOrder = {
  id: string;
  orderNumber: string;
  status: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  department: string;
  items: { name: string; variant: string | null; quantity: number }[];
  total: number;
  date: string;
};

const statusLabels: Record<string, string> = {
  PENDIENTE_PAGO: 'Pendiente de pago',
  PAGO_RECIBIDO: 'Pago recibido',
  PREPARANDO: 'Preparando',
  LISTO_PARA_DESPACHO: 'Listo para despacho',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
};

export default function AdminEnviosPage() {
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    fetch('/api/admin/envios', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => toast.error('No se pudieron cargar los envíos'));
  };

  useEffect(load, []);

  const updateStatus = async (order: ShippingOrder, status: string) => {
    if (status === order.status) return;
    setUpdatingId(order.id);
    try {
      const response = await fetch('/api/admin/envios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, status }),
      });
      if (response.ok) {
        toast.success(`${order.orderNumber} → ${statusLabels[status] || status}`);
        load();
      } else {
        toast.error('No se pudo actualizar el envío');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((order) =>
    `${order.orderNumber} ${order.customer} ${order.city}`.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge: Record<string, string> = {
    PENDIENTE_PAGO: 'bg-amber-100 text-amber-700',
    PAGO_RECIBIDO: 'bg-sky-100 text-sky-700',
    PREPARANDO: 'bg-violet-100 text-violet-700',
    LISTO_PARA_DESPACHO: 'bg-indigo-100 text-indigo-700',
    ENVIADO: 'bg-primary-100 text-primary-700',
    ENTREGADO: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-coffee-900">Envíos</h1>
          <p className="mt-1 text-sm text-secondary-600">Gestiona el despacho y entrega de los pedidos.</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
          <input
            placeholder="Buscar pedido, cliente o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-cream-300 bg-white pl-10 pr-3 py-2 text-sm text-coffee-900"
          />
        </div>
      </div>

      {filtered.length === 0 && orders.length > 0 && (
        <p className="text-sm text-secondary-600">No hay envíos que coincidan con la búsqueda.</p>
      )}

      <div className="space-y-4">
        {filtered.map((order) => (
          <div key={order.id} className="rounded-xl border border-cream-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-coffee-900">{order.orderNumber}</span>
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[order.status] || 'bg-coffee-100 text-coffee-500'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-secondary-600">{order.customer}</p>
                {(order.phone || order.email) && (
                  <p className="text-xs text-secondary-500">
                    {order.phone}
                    {order.phone && order.email ? ' · ' : ''}
                    {order.email}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-coffee-900">{formatPrice(order.total)}</p>
                <p className="text-xs text-secondary-500">{new Date(order.date).toLocaleDateString('es-CO')}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-cream-50 p-3">
                <p className="flex items-center gap-1.5 text-xs font-medium text-secondary-500">
                  <MapPin className="h-3.5 w-3.5" /> Destino
                </p>
                {order.address ? (
                  <>
                    <p className="mt-1 text-sm text-coffee-900">{order.address}</p>
                    <p className="text-xs text-secondary-600">
                      {[order.city, order.department].filter(Boolean).join(', ')}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-secondary-500">Sin dirección registrada</p>
                )}
              </div>
              <div className="rounded-lg bg-cream-50 p-3">
                <p className="flex items-center gap-1.5 text-xs font-medium text-secondary-500">
                  <Truck className="h-3.5 w-3.5" /> Productos
                </p>
                <ul className="mt-1 space-y-0.5 text-sm text-coffee-900">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity} × {item.name}
                      {item.variant ? ` (${item.variant})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-secondary-600">
                Estado del envío
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(event) => void updateStatus(order, event.target.value)}
                  className="rounded-md border border-cream-300 bg-white px-2 py-1.5 text-xs text-coffee-900"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              {updatingId === order.id && <span className="text-xs text-secondary-500">Guardando...</span>}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="rounded-xl border border-cream-200 bg-white p-10 text-center shadow-sm">
          <Truck className="mx-auto h-10 w-10 text-secondary-300" />
          <p className="mt-3 text-sm text-secondary-600">No hay pedidos para gestionar envíos.</p>
        </div>
      )}
    </div>
  );
}