'use client';

import { motion } from 'framer-motion';
import { Leaf, Flame, Truck, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    icon: Leaf,
    title: 'Origen certificado',
    text: 'Cultivado en la zona cafetera de Pereira y procesado 100% orgánico.',
  },
  {
    icon: Flame,
    title: 'Tostión artesanal',
    text: 'Lotes pequeños tostados al punto exacto para resaltar cada nota.',
  },
  {
    icon: Truck,
    title: 'Envío a todo Colombia',
    text: 'Recibe tu café en la puerta de tu casa, gratis desde $50.000.',
  },
  {
    icon: ShieldCheck,
    title: 'Compra segura',
    text: 'Pagos protegidos y garantía de satisfacción en cada pedido.',
  },
];

export function Benefits() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary-600">
            ¿Por qué elegirnos?
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-coffee-900 sm:text-4xl">
            El café que mereces, con el respaldo que buscas
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-cream-200 bg-cream-50/60 p-7 transition-shadow hover:shadow-lg hover:shadow-coffee-950/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 transition-colors group-hover:bg-primary-700 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-serif text-lg font-semibold text-coffee-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary-600">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}