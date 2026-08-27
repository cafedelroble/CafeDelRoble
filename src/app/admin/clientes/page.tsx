'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatPrice, formatDateShort } from '@/lib/utils';

type Customer = { id: string; name: string; email: string; phone: string | null; createdAt: string; orders: number; totalSpent: number };

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  useEffect(() => { fetch('/api/admin/customers', { cache: 'no-store' }).then((response) => response.json()).then((data) => setCustomers(data.customers || [])); }, []);
  const filtered = customers.filter((customer) => `${customer.name} ${customer.email}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold text-coffee-900">Clientes</h1>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
        <input
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-cream-300 bg-white pl-10 pr-3 py-2 text-sm text-coffee-900"
        />
      </div>

      <div className="rounded-xl border border-cream-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cream-200">
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Cliente</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Teléfono</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Registro</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Pedidos</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Total comprado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {filtered.map((customer) => (
              <tr key={customer.id} className="hover:bg-cream-50">
                <td className="p-4">
                  <p className="font-medium text-coffee-900">{customer.name}</p>
                  <p className="text-xs text-secondary-500">{customer.email}</p>
                </td>
                <td className="p-4 text-sm text-secondary-600">{customer.phone || 'No registrado'}</td>
                <td className="p-4 text-sm text-secondary-600">{formatDateShort(customer.createdAt)}</td>
                <td className="p-4 text-sm font-medium text-coffee-900">{customer.orders}</td>
                <td className="p-4 text-sm font-medium text-coffee-900">{formatPrice(customer.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
