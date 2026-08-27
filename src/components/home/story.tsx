'use client';

import { motion } from 'framer-motion';
import { MapPin, Leaf, Award, Heart } from 'lucide-react';

const stats = [
  { icon: MapPin, value: 'Pereira', label: 'Origen' },
  { icon: Leaf, value: '100%', label: 'Colombiano' },
  { icon: Award, value: '4.9', label: 'Calificación' },
  { icon: Heart, value: '1000+', label: 'Clientes felices' },
];

export function Story() {
  return (
    <section className="bg-cream-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm font-medium uppercase tracking-widest text-primary-600">
              Nuestra historia
            </span>
            <h2 className="mt-3 font-serif text-4xl font-bold text-coffee-900 sm:text-5xl">
              Un viaje desde nuestra{' '}
              <span className="text-primary-700">tierra</span> hasta tu taza
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-secondary-700">
              En las montañas de Pereira, Risaralda, nace un café con historia. 
              Cada grano cuenta la historia de nuestra tierra, del amor por lo que 
              hacemos y de la tradición que nos define.
            </p>
            <p className="mt-4 text-base text-secondary-600">
              Seleccionamos los mejores granos, los tostamos con dedicación artesanal 
              y te los entregamos para que disfrutes el verdadero sabor del café colombiano.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="rounded-2xl bg-white p-6 shadow-sm border border-cream-200"
              >
                <stat.icon className="h-8 w-8 text-primary-600" />
                <p className="mt-3 font-serif text-3xl font-bold text-coffee-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-secondary-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
