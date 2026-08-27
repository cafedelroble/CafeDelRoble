'use client';

import Link from 'next/link';
import { ArrowLeft, Check, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';

const steps = [
  { label: 'Pedido recibido', done: true },
  { label: 'Pago confirmado', done: true },
  { label: 'Preparando', done: false, current: true },
  { label: 'Enviado', done: false },
  { label: 'Entregado', done: false },
];

export default function PedidoDetallePage() {
  return (
    <div className="space-y-8">
      <Link href="/cuenta/pedidos" className="inline-flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" />
        Volver a pedidos
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-coffee-900">Pedido CDR-000123</h1>
          <p className="mt-1 text-secondary-600">Realizado el 20 de agosto de 2026</p>
        </div>
        <Badge>Enviado</Badge>
      </div>

      {/* Status Timeline */}
      <div className="rounded-xl border border-cream-200 bg-white p-6">
        <h2 className="font-serif text-lg font-bold text-coffee-900">Estado del pedido</h2>
        <div className="mt-6 space-y-4">
          {steps.map((step) => (
            <div key={step.label} className="flex items-center gap-4">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                step.done ? 'bg-nature-100 text-nature-700' : step.current ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-300' : 'bg-secondary-100 text-secondary-400'
              }`}>
                {step.done ? <Check className="h-4 w-4" /> : step.current ? <Clock className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-current" />}
              </div>
              <span className={`text-sm font-medium ${step.done ? 'text-nature-700' : step.current ? 'text-primary-700' : 'text-secondary-400'}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="rounded-xl border border-cream-200 bg-white p-6">
        <h2 className="font-serif text-lg font-bold text-coffee-900">Productos</h2>
        <div className="mt-4 space-y-4">
          {[
            { name: 'Café Especial del Roble', variant: '500 g', qty: 2, price: 35000 },
            { name: 'Café Tradicional del Valle', variant: '250 g', qty: 1, price: 20000 },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-coffee-200 to-cream-200">
                <div className="flex h-full items-center justify-center"><span className="text-lg text-coffee-400/40">☕</span></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-coffee-900">{item.name}</p>
                <p className="text-xs text-secondary-500">{item.variant} · x{item.qty}</p>
              </div>
              <p className="font-medium text-coffee-900">{formatPrice(item.price * item.qty)}</p>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <span className="font-serif font-semibold text-coffee-900">Total</span>
          <span className="font-serif text-xl font-bold text-primary-700">{formatPrice(90000)}</span>
        </div>
      </div>
    </div>
  );
}
