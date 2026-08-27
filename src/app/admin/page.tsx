'use client';

import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const stats = [
  { label: 'Ventas hoy', value: formatPrice(70000), change: '', up: true, icon: DollarSign, color: 'bg-primary-100 text-primary-700' },
  { label: 'Pedidos', value: '1', change: '', up: true, icon: ShoppingCart, color: 'bg-nature-100 text-nature-700' },
  { label: 'Clientes', value: '2', change: '', up: true, icon: Users, color: 'bg-cream-100 text-cream-700' },
  { label: 'Productos', value: '6', change: '', up: true, icon: Package, color: 'bg-coffee-100 text-coffee-700' },
  { label: 'Stock bajo', value: '0', change: '', up: false, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
];

const recentOrders = [
  { id: 'CDR-DEMO-001', customer: 'Juan Pérez', total: 70000, status: 'Pagado', time: 'Pedido demo' },
];

const statusColors: Record<string, string> = {
  Pendiente: 'bg-cream-100 text-cream-700',
  Pagado: 'bg-primary-100 text-primary-700',
  Preparando: 'bg-nature-100 text-nature-700',
  Enviado: 'bg-blue-50 text-blue-600',
  Entregado: 'bg-green-50 text-green-600',
};

const topProducts = [
  { name: 'Café Especial del Roble', sold: 2, revenue: 70000 },
  { name: 'Café Tradicional Montañero', sold: 0, revenue: 0 },
  { name: 'Reserva Del Roble 2024', sold: 0, revenue: 0 },
  { name: 'Café Especial 500g', sold: 0, revenue: 0 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-coffee-900">Dashboard</h1>
        <p className="mt-1 text-secondary-600">Resumen de tu tienda Café del Roble.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              {stat.change && (
                <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? 'text-nature-600' : 'text-red-500'}`}>
                  {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </span>
              )}
            </div>
            <p className="mt-3 font-serif text-2xl font-bold text-coffee-900">{stat.value}</p>
            <p className="text-sm text-secondary-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-xl border border-cream-200 bg-white shadow-sm">
          <div className="border-b border-cream-200 p-5">
            <h2 className="font-serif text-lg font-bold text-coffee-900">Pedidos recientes</h2>
          </div>
          <div className="divide-y divide-cream-200">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-coffee-900">{order.id}</p>
                  <p className="text-xs text-secondary-500">{order.customer} · {order.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-medium text-coffee-900">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-cream-200 bg-white shadow-sm">
          <div className="border-b border-cream-200 p-5">
            <h2 className="font-serif text-lg font-bold text-coffee-900">Productos más vendidos</h2>
          </div>
          <div className="divide-y divide-cream-200">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium text-coffee-900">{product.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-coffee-900">{formatPrice(product.revenue)}</p>
                  <p className="text-xs text-secondary-500">{product.sold} vendidos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
