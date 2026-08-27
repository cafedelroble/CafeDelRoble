'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/stores/wishlist-store';
import { Heart, X, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function FavoritosPage() {
  const { items, removeItem } = useWishlistStore();

  return (
    <section className="bg-cream-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-coffee-900">Favoritos</h1>
        <p className="mt-1 text-secondary-600">Tus productos guardados.</p>

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <Heart className="mx-auto h-12 w-12 text-secondary-300" />
            <h2 className="mt-4 font-serif text-xl font-bold text-coffee-900">No tienes favoritos</h2>
            <p className="mt-2 text-secondary-600">Guarda productos que te gusten desde la tienda.</p>
            <Button asChild className="mt-6">
              <Link href="/tienda">Ir a la tienda</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 rounded-xl border border-cream-200 bg-white p-4 shadow-sm">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-coffee-200 to-cream-200">
                  <div className="flex h-full items-center justify-center">
                    <span className="text-2xl text-coffee-400/40">☕</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-semibold text-coffee-900">
                      <Link href={`/productos/${item.slug}`} className="hover:text-primary-700">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-sm font-bold text-primary-700">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <Link href={`/productos/${item.slug}`}>
                        <ShoppingBag className="mr-1 h-3 w-3" /> Agregar
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeItem(item.productId)} className="text-destructive hover:text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
