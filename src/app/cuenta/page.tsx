'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Truck, Heart, DollarSign, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useSession } from 'next-auth/react';

const stats = [
  { label: 'Pedidos', value: '1', icon: Package, color: 'bg-primary-100 text-primary-700' },
  { label: 'En camino', value: '0', icon: Truck, color: 'bg-nature-100 text-nature-700' },
  { label: 'Favoritos', value: '0', icon: Heart, color: 'bg-red-50 text-red-600' },
  { label: 'Total comprado', value: '$70.000', icon: DollarSign, color: 'bg-cream-100 text-cream-700' },
];

const recentOrders = [
  { id: 'CDR-DEMO-001', date: '2026-08-27', total: 70000, status: 'Pagado', items: 2 },
];

const statusColors: Record<string, string> = {
  Enviado: 'bg-nature-100 text-nature-700',
  Entregado: 'bg-cream-100 text-cream-700',
  Pendiente: 'bg-primary-100 text-primary-700',
  Pagado: 'bg-primary-100 text-primary-700',
};

export default function CuentaDashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user.name?.split(' ')[0] || 'cliente';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-coffee-900">Mi Café del Roble</h1>
        <p className="mt-1 text-secondary-600">Hola, {userName}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 font-serif text-2xl font-bold text-coffee-900">{stat.value}</p>
            <p className="text-sm text-secondary-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-cream-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-cream-200 p-6">
          <h2 className="font-serif text-xl font-bold text-coffee-900">Pedidos recientes</h2>
          <Link href="/cuenta/pedidos" className="flex items-center gap-1 text-sm font-medium text-primary-700 hover:underline">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-cream-200">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-6">
              <div>
                <p className="font-medium text-coffee-900">{order.id}</p>
                <p className="text-sm text-secondary-500">{order.date} · {order.items} productos</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status] || 'bg-secondary-100 text-secondary-700'}`}>
                  {order.status}
                </span>
                <span className="font-serif font-bold text-coffee-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
