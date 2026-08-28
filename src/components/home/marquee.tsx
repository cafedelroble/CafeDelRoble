'use client';

import { motion } from 'framer-motion';
import { Bean, Flame, Truck, Leaf, Shield, Star } from 'lucide-react';

const items = [
  { icon: Bean, label: '100% Arábica colombiano' },
  { icon: Flame, label: 'Tostión artesanal en lotes' },
  { icon: Truck, label: 'Envío gratis desde $50.000' },
  { icon: Leaf, label: 'Cultivado en los Andes' },
  { icon: Shield, label: 'Compra segura garantizada' },
  { icon: Star, label: '4,9 de valoración de clientes' },
];

function Segment() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map(({ icon: Icon, label }) => (
        <span key={label} className="flex items-center gap-2.5 px-6 text-sm font-medium text-cream-200/90 sm:px-8">
          <Icon className="h-4 w-4 text-primary-400" />
          {label}
          <span className="ml-6 h-1.5 w-1.5 rounded-full bg-primary-500/70 sm:ml-8" />
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-coffee-800/60 bg-coffee-950 py-4">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex w-max whitespace-nowrap"
      >
        <Segment />
        <Segment />
      </motion.div>
    </div>
  );
}