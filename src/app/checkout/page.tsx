'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, MessageCircle, Shield, Lock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { COLOMBIAN_DEPARTMENTS } from '@/constants';

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const total = getTotal();
  const shipping = total >= 50000 ? 0 : 8000;
  const grandTotal = total + shipping;
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pse' | 'whatsapp'>('card');
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState('');
  const finalTotal = grandTotal - discountAmount;

  const applyDiscount = async () => {
    setDiscountError('');
    const response = await fetch('/api/discounts/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: discountCode, items }) });
    const data = await response.json();
    if (!response.ok) { setDiscountAmount(0); setDiscountError(data.error || 'Código no válido'); return; }
    setDiscountAmount(Number(data.amount));
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Hola, Café del Roble.\n\nQuiero realizar este pedido:\n${items.map((i) => `${i.name} ${i.variantName || ''} x${i.quantity}`).join('\n')}\n\nTotal: ${formatPrice(finalTotal)}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <section className="bg-cream-50 py-24">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h1 className="font-serif text-3xl font-bold text-coffee-900">No hay productos en el carrito</h1>
          <Button size="lg" asChild className="mt-8">
            <Link href="/tienda">Ir a la tienda</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/carrito" className="inline-flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-700 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Volver al carrito
        </Link>

        <h1 className="font-serif text-4xl font-bold text-coffee-900">Finalizar compra</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Personal Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-cream-200 bg-white p-6">
              <h2 className="font-serif text-xl font-bold text-coffee-900">Información personal</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input placeholder="Nombre *" required />
                <Input placeholder="Apellido *" required />
                <Input type="email" placeholder="Correo electrónico *" required className="sm:col-span-2" />
                <Input type="tel" placeholder="Teléfono *" required />
                <Input placeholder="Número de documento" />
              </div>
            </motion.div>

            {/* Shipping Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-cream-200 bg-white p-6">
              <h2 className="font-serif text-xl font-bold text-coffee-900">Dirección de envío</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input placeholder="Dirección completa *" required className="sm:col-span-2" />
                <Input placeholder="Barrio / Urbanización" />
                <Input placeholder="Ciudad *" required />
                <select className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-coffee-900 sm:col-span-2">
                  <option value="">Seleccionar departamento</option>
                  {COLOMBIAN_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <Textarea placeholder="Instrucciones de entrega (opcional)" rows={3} className="sm:col-span-2" />
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-cream-200 bg-white p-6">
              <h2 className="font-serif text-xl font-bold text-coffee-900">Método de pago</h2>
              <div className="mt-6 space-y-3">
                {[
                  { id: 'card' as const, label: 'Tarjeta de crédito/débito', icon: CreditCard },
                  { id: 'pse' as const, label: 'PSE', icon: Shield },
                  { id: 'whatsapp' as const, label: 'Comprar por WhatsApp', icon: MessageCircle },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                      paymentMethod === method.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-cream-200 hover:border-primary-300'
                    }`}
                  >
                    <method.icon className="h-5 w-5 text-primary-700" />
                    <span className="font-medium text-coffee-900">{method.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="rounded-xl border border-cream-200 bg-white p-6">
              <h2 className="font-serif text-xl font-bold text-coffee-900">Código de descuento</h2>
              <div className="mt-4 flex gap-2"><Input value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="Ej. BIENVENIDA10" /><Button type="button" variant="outline" onClick={() => void applyDiscount()}>Aplicar</Button></div>
              {discountError && <p className="mt-2 text-sm text-red-600">{discountError}</p>}
            </div>

            {paymentMethod === 'whatsapp' ? (
              <Button size="xl" className="w-full bg-nature-600 hover:bg-nature-700" onClick={handleWhatsAppOrder}>
                <MessageCircle className="mr-2 h-5 w-5" />
                Comprar por WhatsApp
              </Button>
            ) : (
              <Button size="xl" className="w-full">
                <Lock className="mr-2 h-5 w-5" />
                Pagar {formatPrice(finalTotal)}
              </Button>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-coffee-900">Tu pedido</h2>
              <div className="mt-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-coffee-200 to-cream-200">
                      <div className="flex h-full items-center justify-center">
                        <span className="text-lg text-coffee-400/40">☕</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-coffee-900 truncate">{item.name}</p>
                      {item.variantName && <p className="text-xs text-secondary-500">{item.variantName}</p>}
                      <p className="text-xs text-secondary-500">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-coffee-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                {discountAmount > 0 && <div className="flex justify-between text-sm text-nature-700"><span>Descuento</span><span>-{formatPrice(discountAmount)}</span></div>}
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Subtotal</span>
                  <span className="text-coffee-900">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Envío</span>
                  <span className="text-coffee-900">{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-serif font-semibold text-coffee-900">Total</span>
                  <span className="font-serif text-xl font-bold text-primary-700">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
