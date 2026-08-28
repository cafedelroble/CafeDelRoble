'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Award, Heart, Leaf, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const highlights = [
  'Selección manual de granos arábica de alta calidad',
  'Tostión artesanal en lotes pequeños y frescos',
  'Relación directa con la finca: sin intermediarios',
];

const stats = [
  { icon: MapPin, value: 'Pereira', label: 'Origen' },
  { icon: Award, value: '4,9', label: 'Calificación' },
  { icon: Heart, value: '+1.200', label: 'Clientes felices' },
];

export function Story() {
  return (
    <section className="bg-cream-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Collage de imágenes */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[420px] overflow-hidden rounded-3xl shadow-xl shadow-coffee-950/15 sm:h-[500px]">
              <Image
                src="/images/cafetales-hero.jpg"
                alt="Cafetales en las montañas de Colombia"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_30%] transition-transform duration-700 hover:scale-105"
              />
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-8 -right-2 w-48 overflow-hidden rounded-2xl border-4 border-cream-50 shadow-2xl shadow-coffee-950/25 sm:right-6 sm:w-56"
            >
              <div className="relative h-40 sm:h-44">
                <Image
                  src="/images/products/roble-250g.jpg"
                  alt="Empaque de Café del Roble Tostión Media 250g"
                  fill
                  sizes="(max-width: 1024px) 192px, 224px"
                  className="object-cover"
                />
              </div>
              <div className="bg-white px-4 py-2.5">
                <p className="text-xs font-semibold text-coffee-900">Del cafetal a tu mesa</p>
                <p className="text-[11px] text-secondary-500">Empaques de 250g, 500g y 2500g</p>
              </div>
            </motion.div>

            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-coffee-900 shadow-sm backdrop-blur-sm sm:left-6 sm:top-6">
              <Leaf className="mr-1.5 inline h-3.5 w-3.5 text-nature-600" />
              100% orgánico de origen
            </div>
          </motion.div>

          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <span className="text-sm font-medium uppercase tracking-widest text-primary-600">
              Nuestra historia
            </span>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-coffee-900 sm:text-5xl">
              Un viaje desde nuestra{' '}
              <span className="text-primary-700">tierra</span> hasta tu taza
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-secondary-700">
              En las montañas de Pereira, Risaralda, nace un café con historia. Cada grano
              cuenta la historia de nuestra tierra, del amor por lo que hacemos y de la
              tradición que nos define.
            </p>
            <p className="mt-4 text-base leading-relaxed text-secondary-600">
              Seleccionamos los mejores granos, los tostamos con dedicación artesanal y te los
              entregamos para que disfrutes el verdadero sabor del café colombiano.
            </p>

            <ul className="mt-7 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-secondary-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-nature-600" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button variant="outline" asChild className="border-coffee-200 bg-white text-coffee-900 hover:bg-coffee-100">
                <Link href="/nosotros">
                  Conocer nuestra historia
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-cream-200 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <stat.icon className="h-5 w-5 text-primary-600" />
                  <p className="mt-2 font-serif text-lg font-bold text-coffee-900 sm:text-xl">
                    {stat.value}
                  </p>
                  <p className="text-xs text-secondary-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}