'use client';

import { motion } from 'framer-motion';
import { MapPin, Leaf, Award, Heart, Coffee, Sun, Droplets, Mountain } from 'lucide-react';

const timeline = [
  {
    icon: MapPin,
    title: 'Nuestro origen',
    description: 'En las montañas de Pereira, Risaralda, donde el clima y la tierra crean las condiciones perfectas para el café.',
  },
  {
    icon: Leaf,
    title: 'Cultivo responsable',
    description: 'Trabajamos con productores locales que comparten nuestra pasión por la calidad y la sostenibilidad.',
  },
  {
    icon: Sun,
    title: 'Tueste artesanal',
    description: 'Cada lote se tuesta de forma artesanal, resaltando las notas únicas de cada origen.',
  },
  {
    icon: Award,
    title: 'Calidad premium',
    description: 'Solo seleccionamos el 5% de los mejores granos colombianos para nuestros cafés.',
  },
];

const values = [
  { icon: Heart, title: 'Pasión', description: 'Amamos lo que hacemos y se nota en cada taza.' },
  { icon: Coffee, title: 'Calidad', description: 'Sin compromisos. Solo lo mejor llega a tu hogar.' },
  { icon: Mountain, title: 'Origen', description: 'Conocemos cada finca, cada productor, cada grano.' },
  { icon: Droplets, title: 'Sostenibilidad', description: 'Cuidamos la tierra que nos da vida.' },
];

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-coffee-950 to-primary-950 py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 top-1/2 h-96 w-96 rounded-full bg-primary-500 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium uppercase tracking-widest text-primary-400">
              Nuestra historia
            </span>
            <h1 className="mt-4 font-serif text-5xl font-bold text-white sm:text-6xl">
              Del árbol a tu taza
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-cream-300">
              Café del Roble nace de la pasión por el café colombiano y el amor por nuestra tierra.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="bg-cream-50 py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {timeline.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                  <item.icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-coffee-900">{item.title}</h3>
                  <p className="mt-2 text-secondary-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-medium uppercase tracking-widest text-primary-600">
              Nuestros valores
            </span>
            <h2 className="mt-3 font-serif text-4xl font-bold text-coffee-900">
              Lo que nos define
            </h2>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center rounded-2xl border border-cream-200 p-8"
              >
                <value.icon className="mx-auto h-10 w-10 text-primary-600" />
                <h3 className="mt-4 font-serif text-xl font-bold text-coffee-900">{value.title}</h3>
                <p className="mt-2 text-sm text-secondary-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-coffee-950 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-white">
            ¿Listo para probar el verdadero café colombiano?
          </h2>
          <p className="mt-4 text-cream-300">
            Descubre nuestra selección de cafés premium directamente de Pereira.
          </p>
          <a
            href="/tienda"
            className="mt-8 inline-flex items-center rounded-lg bg-primary-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Explorar tienda
          </a>
        </div>
      </section>
    </>
  );
}
