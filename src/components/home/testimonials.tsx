'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'María Fernanda',
    city: 'Manizales',
    text: 'El aroma al abrir la bolsa es inigualable. Se nota que es un café recién tostado y de verdadero origen. Ya es mi café de todas las mañanas.',
    rating: 5,
  },
  {
    name: 'Andrés Camilo',
    city: 'Bogotá',
    text: 'Pedí el tostión media de 500g y llegó en dos días, súper bien empacado. Rinde muchísimo y el sabor es suave, con notas dulces. ¡Muy recomendado!',
    rating: 5,
  },
  {
    name: 'Luisa Fernanda',
    city: 'Medellín',
    text: 'Compré la reserva especial como regalo para mi mamá y quedó encantada. La atención de la tienda fue excelente y el café, espectacular.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="bg-cream-100/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary-600">
            Testimonios
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-coffee-900 sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="relative flex flex-col gap-4 rounded-2xl border border-cream-200 bg-white p-7 shadow-sm"
            >
              <Quote className="h-8 w-8 rotate-180 text-primary-200" />
              <blockquote className="text-sm leading-relaxed text-secondary-700">
                {t.text}
              </blockquote>
              <div className="mt-auto flex items-center gap-3 border-t border-cream-100 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coffee-800 font-serif text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <figcaption className="text-sm font-semibold text-coffee-900">{t.name}</figcaption>
                  <p className="text-xs text-secondary-500">{t.city}</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-primary-500 text-primary-500" />
                  ))}
                </div>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}