'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Check, Clock, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const steps = [
  { label: 'Pedido recibido', icon: Package, completed: true },
  { label: 'Pago confirmado', icon: Check, completed: true },
  { label: 'Preparando pedido', icon: Clock, completed: false, current: true },
  { label: 'Enviado', icon: Truck, completed: false },
  { label: 'Entregado', icon: MapPin, completed: false },
];

export default function SeguimientoPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <>
      <section className="bg-gradient-to-br from-coffee-950 to-primary-950 py-24 sm:py-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-sm font-medium uppercase tracking-widest text-primary-400">Seguimiento</span>
            <h1 className="mt-4 font-serif text-5xl font-bold text-white sm:text-6xl">Rastrea tu pedido</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-cream-300">
              Consulta el estado de tu pedido sin necesidad de crear cuenta.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-cream-50 py-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="rounded-2xl border border-cream-200 bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-coffee-900">Consultar pedido</h2>
            <p className="mt-2 text-sm text-secondary-600">
              Ingresa tu número de pedido y correo electrónico.
            </p>
            <div className="mt-6 space-y-4">
              <Input
                placeholder="Número de pedido (ej: CDR-000001)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full" size="lg">
                <Search className="mr-2 h-4 w-4" />
                Consultar pedido
              </Button>
            </div>
          </form>

          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-2xl border border-cream-200 bg-white p-8"
            >
              <h3 className="font-serif text-xl font-bold text-coffee-900">Estado del pedido</h3>
              <div className="mt-6 space-y-4">
                {steps.map((step) => (
                  <div key={step.label} className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        step.completed
                          ? 'bg-nature-100 text-nature-700'
                          : step.current
                          ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-300'
                          : 'bg-secondary-100 text-secondary-400'
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          step.completed
                            ? 'text-nature-700'
                            : step.current
                            ? 'text-primary-700'
                            : 'text-secondary-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.current && (
                        <p className="text-xs text-primary-500">En progreso</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
