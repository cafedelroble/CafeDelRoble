'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Package } from 'lucide-react';
import { formatPrice, formatDateShort } from '@/lib/utils';

const orders = [
  { id: 'CDR-000123', date: '2026-08-20', total: 70000, status: 'Enviado', items: [{ name: 'Café Especial del Roble', qty: 2 }] },
  { id: 'CDR-000118', date: '2026-08-15', total: 45000, status: 'Entregado', items: [{ name: 'Café Orgánico de Nariño', qty: 1 }] },
  { id: 'CDR-000110', date: '2026-08-01', total: 43000, status: 'Entregado', items: [{ name: 'Blend Maestro del Roble', qty: 1 }, { name: 'Café Tradicional del Valle', qty: 1 }] },
];

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'secondary'> = {
  Enviado: 'default',
  Entregado: 'success',
  Pendiente: 'warning',
};

export default function PedidosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-coffee-900">Mis pedidos</h1>
        <p className="mt-1 text-secondary-600">Historial de tus compras.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <Package className="h-6 w-6 text-primary-700" />
                </div>
                <div>
                  <p className="font-medium text-coffee-900">{order.id}</p>
                  <p className="text-sm text-secondary-500">{formatDateShort(order.date)} · {order.items.length} producto(s)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={statusVariant[order.status] || 'secondary'}>{order.status}</Badge>
                <span className="font-serif font-bold text-coffee-900">{formatPrice(order.total)}</span>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/cuenta/pedidos/${order.id}`}>
                    Ver detalle <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
