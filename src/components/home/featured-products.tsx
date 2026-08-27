'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number;
  image: string;
  rating?: number;
}

const featuredProducts: FeaturedProduct[] = [
  {
    id: '1',
    name: 'Café Especial del Roble',
    slug: 'cafe-especial-del-roble',
    shortDescription: 'Chocolate, caramelo y frutos rojos en una taza perfecta.',
    price: 35000,
    image: '',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Café Orgánico de Nariño',
    slug: 'cafe-organico-de-narino',
    shortDescription: 'Notas cítricas y florales con dulzura natural.',
    price: 45000,
    image: '',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Blend Maestro del Roble',
    slug: 'blend-maestro-del-roble',
    shortDescription: 'El equilibrio perfecto entre cuerpo y suavidad.',
    price: 38000,
    image: '',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Café Reserve Especial',
    slug: 'cafe-reserve-especial',
    shortDescription: 'Edición limitada de las mejores fincas de Risaralda.',
    price: 55000,
    image: '',
    rating: 5.0,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function FeaturedProducts() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary-600">
            Selección premium
          </span>
          <h2 className="mt-3 font-serif text-4xl font-bold text-coffee-900 sm:text-5xl">
            Productos destacados
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-secondary-600">
            Descubre nuestros cafés seleccionados, cada uno con una historia única.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group rounded-2xl border border-cream-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Image placeholder */}
              <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-br from-coffee-200 to-cream-200">
                <div className="flex h-full items-center justify-center">
                  <span className="font-serif text-6xl text-coffee-400/40">☕</span>
                </div>
                {product.rating && (
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium backdrop-blur">
                    <Star className="h-3 w-3 fill-cream-500 text-cream-500" />
                    {product.rating}
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-coffee-900 group-hover:text-primary-700 transition-colors">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-secondary-600 line-clamp-2">
                  {product.shortDescription}
                </p>
                <p className="mt-3 font-serif text-xl font-bold text-primary-700">
                  {formatPrice(product.price)}
                </p>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href={`/productos/${product.slug}`}>
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Ver
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <Link href={`/productos/${product.slug}`}>
                      <ShoppingBag className="mr-1 h-3.5 w-3.5" />
                      Agregar
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/tienda">
              Ver todos los productos
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
