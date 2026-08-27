'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';

type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number;
  image: string | null;
  rating: number | null;
  category: { name: string; slug: string };
  stock: number;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function FeaturedProductsClient({ products }: { products: FeaturedProduct[] }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={itemVariants}
          className="group rounded-2xl border border-cream-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-br from-coffee-200 to-cream-200">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-serif text-6xl text-coffee-400/40">☕</span>
              </div>
            )}
            {product.rating !== null && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium backdrop-blur">
                <Star className="h-3 w-3 fill-cream-500 text-cream-500" />
                {product.rating.toFixed(1)}
              </div>
            )}
          </div>

          <div className="p-5">
            <p className="text-xs text-secondary-400 uppercase tracking-wide">{product.category.name}</p>
            <h3 className="mt-1 font-serif text-lg font-semibold text-coffee-900 group-hover:text-primary-700 transition-colors line-clamp-2">
              {product.name}
            </h3>
            <p className="mt-2 text-sm text-secondary-600 line-clamp-2">{product.shortDescription}</p>
            <p className="mt-3 font-serif text-xl font-bold text-primary-700">{formatPrice(product.price)}</p>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" asChild className="flex-1">
                <Link href={`/productos/${product.slug}`}>
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  Ver
                </Link>
              </Button>
              <Button
                size="sm"
                className="flex-1"
                disabled={product.stock === 0}
                onClick={() =>
                  addItem({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image || '',
                    quantity: 1,
                    stock: product.stock,
                  })
                }
              >
                <ShoppingBag className="mr-1 h-3.5 w-3.5" />
                {product.stock === 0 ? 'Agotado' : 'Agregar'}
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
