'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X, Plus, GitCompare } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCompareStore } from '@/stores/compare-store';

export default function CompararPage() {
  const { items, removeItem, clearCompare } = useCompareStore();

  const specs = [
    { label: 'Precio', key: 'price', format: (v: number) => formatPrice(v) },
    { label: 'Presentación', key: 'presentation' },
    { label: 'Tipo', key: 'type' },
    { label: 'Tueste', key: 'roastLevel' },
    { label: 'Origen', key: 'origin' },
    { label: 'Notas de cata', key: 'tastingNotes', format: (v: string[]) => v?.join(', ') || '—' },
    { label: 'Calificación', key: 'averageRating', format: (v: number) => v ? `${v} ★` : '—' },
    { label: 'Descripción', key: 'shortDescription' },
  ];

  if (items.length === 0) {
    return (
      <section className="bg-cream-50 py-24">
        <div className="mx-auto max-w-xl px-4 text-center">
          <GitCompare className="mx-auto h-20 w-20 text-secondary-300" />
          <h1 className="mt-6 font-serif text-3xl font-bold text-coffee-900">No hay productos para comparar</h1>
          <p className="mt-3 text-secondary-600">
            Agrega productos desde la tienda para compararlos.
          </p>
          <Button size="lg" asChild className="mt-8">
            <Link href="/tienda">
              Explorar la tienda
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-4xl font-bold text-coffee-900">Comparar productos</h1>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={clearCompare} className="text-destructive">
              Limpiar todo
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/tienda">
                <Plus className="mr-2 h-4 w-4" />
                Agregar más
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="w-40 p-4 text-left text-sm font-medium text-secondary-500">Característica</th>
                {items.map((item) => (
                  <th key={item.productId} className="p-4 text-center">
                    <div className="relative">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-100 text-secondary-500 hover:bg-destructive hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="mx-auto h-24 w-24 overflow-hidden rounded-xl bg-gradient-to-br from-coffee-200 to-cream-200">
                        <div className="flex h-full items-center justify-center">
                          <span className="font-serif text-3xl text-coffee-400/40">☕</span>
                        </div>
                      </div>
                      <h3 className="mt-3 font-serif text-sm font-semibold text-coffee-900">{item.name}</h3>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, index) => (
                <tr key={spec.label} className={index % 2 === 0 ? 'bg-white' : 'bg-cream-50'}>
                  <td className="p-4 text-sm font-medium text-secondary-700">{spec.label}</td>
                  {items.map((item) => {
                    const value = (item as unknown as Record<string, unknown>)[spec.key];
                    const display = spec.format
                      ? spec.format(value as never)
                      : value || '—';
                    return (
                      <td key={item.productId} className="p-4 text-center text-sm text-coffee-900">
                        {display as string}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="bg-white">
                <td className="p-4"></td>
                {items.map((item) => (
                  <td key={item.productId} className="p-4 text-center">
                    <Button size="sm" asChild>
                      <Link href={`/productos/${item.slug}`}>
                        Ver producto
                      </Link>
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
