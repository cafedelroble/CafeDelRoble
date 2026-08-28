'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';
import { Check, X, RotateCcw, Search } from 'lucide-react';

type Payment = {
  id: string;
  orderNumber: string;
  orderStatus: string;
  customer: string;
  method: string;
  status: string;
  amount: number;
  currency: string;
  transactionId: string | null;
  date: string;
};

const methodLabels: Record<string, string> = {
  PSE: 'PSE',
  TARJETA: 'Tarjeta',
  NEQUI: 'Nequi',
  WHATSAPP: 'WhatsApp',
  EFECTIVO: 'Efectivo',
};

const statusStyles: Record<string, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-700',
  APROBADO: 'bg-emerald-100 text-emerald-700',
  RECHAZADO: 'bg-red-100 text-red-700',
  REEMBOLSADO: 'bg-coffee-100 text-coffee-500',
};

const statusLabels: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
  REEMBOLSADO: 'Reembolsado',
};

export default function AdminPagosPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const load = () => {
    fetch('/api/admin/payments', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setPayments(data.payments || []))
      .catch(() => toast.error('No se pudieron cargar los pagos'));
  };

  useEffect(load, []);

  const updateStatus = async (payment: Payment, status: string) => {
    setLoadingId(payment.id);
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: payment.id, status }),
      });
      if (response.ok) {
        toast.success(`Pago ${statusLabels[status] || status}: ${payment.orderNumber}`);
        load();
      } else {
        toast.error('No se pudo actualizar el pago');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = payments.filter((payment) =>
    `${payment.orderNumber} ${payment.customer}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-coffee-900">Pagos</h1>
          <p className="mt-1 text-sm text-secondary-600">Gestiona los pagos de los pedidos y su estado.</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
          <input
            placeholder="Buscar por pedido o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-cream-300 bg-white pl-10 pr-3 py-2 text-sm text-coffee-900"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-cream-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cream-200">
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Pago</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Pedido</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Cliente</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Método</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Monto</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Estado</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {filtered.map((payment) => (
              <tr key={payment.id} className="hover:bg-cream-50">
                <td className="p-4">
                  <p className="text-sm text-secondary-600">{new Date(payment.date).toLocaleDateString('es-CO')}</p>
                  {payment.transactionId && <p className="text-xs text-secondary-400">Ref: {payment.transactionId}</p>}
                </td>
                <td className="p-4 text-sm font-medium text-coffee-900">{payment.orderNumber}</td>
                <td className="p-4 text-sm text-coffee-900">{payment.customer}</td>
                <td className="p-4 text-sm text-secondary-600">{methodLabels[payment.method] || payment.method}</td>
                <td className="p-4 text-sm font-semibold text-coffee-900">
                  {formatPrice(payment.amount)}
                  {payment.currency && payment.currency !== 'COP' && (
                    <span className="ml-1 text-xs font-normal text-secondary-400">{payment.currency}</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[payment.status] || 'bg-coffee-100 text-coffee-500'}`}>
                    {statusLabels[payment.status] || payment.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {payment.status !== 'APROBADO' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                        disabled={loadingId === payment.id}
                        onClick={() => void updateStatus(payment, 'APROBADO')}
                      >
                        <Check className="mr-1 h-3.5 w-3.5" /> Aprobar
                      </Button>
                    )}
                    {payment.status === 'PENDIENTE' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={loadingId === payment.id}
                        onClick={() => void updateStatus(payment, 'RECHAZADO')}
                      >
                        <X className="mr-1 h-3.5 w-3.5" /> Rechazar
                      </Button>
                    )}
                    {payment.status === 'APROBADO' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={loadingId === payment.id}
                        onClick={() => void updateStatus(payment, 'REEMBOLSADO')}
                      >
                        <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reembolsar
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-6 text-sm text-secondary-600">No hay pagos registrados.</p>
        )}
      </div>
    </div>
  );
}