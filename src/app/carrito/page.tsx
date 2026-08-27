'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';

const SHIPPING_THRESHOLD = 50000;
const SHIPPING_COST = 8000;

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const total = getTotal();
  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <section className="bg-cream-50 py-24">
        <div className="mx-auto max-w-xl px-4 text-center">
          <Package className="mx-auto h-20 w-20 text-secondary-300" />
          <h1 className="mt-6 font-serif text-3xl font-bold text-coffee-900">Tu carrito está vacío</h1>
          <p className="mt-3 text-secondary-600">
            Parece que aún no has agregado ningún café a tu carrito.
          </p>
          <Button size="lg" asChild className="mt-8">
            <Link href="/tienda">
              <ShoppingBag className="mr-2 h-5 w-5" />
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
          <h1 className="font-serif text-4xl font-bold text-coffee-900">Carrito de compras</h1>
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Vaciar carrito
          </Button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Cart Items */}
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-4 rounded-xl border border-cream-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-coffee-200 to-cream-200">
                    <div className="flex h-full items-center justify-center">
                      <span className="font-serif text-2xl text-coffee-400/40">☕</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif font-semibold text-coffee-900">{item.name}</h3>
                        {item.variantName && (
                          <p className="text-xs text-secondary-500">{item.variantName}</p>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-secondary-400 hover:text-destructive" onClick={() => removeItem(item.productId, item.variantId)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-cream-300">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)} className="px-2 py-1 text-secondary-600 hover:text-primary-700">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-medium text-coffee-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)} className="px-2 py-1 text-secondary-600 hover:text-primary-700">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-serif font-bold text-primary-700">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-coffee-900">Resumen del pedido</h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Subtotal ({items.length} productos)</span>
                  <span className="font-medium text-coffee-900">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Envío</span>
                  <span className="font-medium text-coffee-900">
                    {shipping === 0 ? (
                      <span className="text-nature-600">Gratis</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-nature-600">
                    Envío gratis en compras superiores a {formatPrice(SHIPPING_THRESHOLD)}
                  </p>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="font-serif font-semibold text-coffee-900">Total</span>
                  <span className="font-serif text-xl font-bold text-primary-700">{formatPrice(grandTotal)}</span>
                </div>
              </div>
              <Button size="lg" className="mt-6 w-full" asChild>
                <Link href="/checkout">
                  Finalizar compra
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" className="mt-3 w-full" asChild>
                <Link href="/tienda">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Seguir comprando
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
