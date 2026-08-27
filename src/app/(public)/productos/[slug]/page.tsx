'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Heart, GitCompare, ArrowLeft, Star, Minus, Plus, Truck, Shield, Coffee } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { useCompareStore } from '@/stores/compare-store';
import { useWishlistStore } from '@/stores/wishlist-store';

// Static product data (will be replaced with DB query)
const product = {
  id: '1',
  name: 'Café Especial del Roble',
  slug: 'cafe-especial-del-roble',
  description: 'Nuestro café insignia, cultivado en las alturas de Pereira, Risaralda. Cada grano refleja la dedicación de nuestros productores y la riqueza de nuestra tierra. Un café con personalidad, ideal para quienes buscan una experiencia de sabor única.',
  shortDescription: 'Chocolate, caramelo y frutos rojos en una taza perfecta.',
  price: 35000,
  compareAtPrice: 42000,
  category: 'Café Especial',
  type: 'Grano',
  roastLevel: 'Media',
  origin: 'Pereira, Risaralda',
  weight: 500,
  rating: 4.9,
  reviewCount: 127,
  isFeatured: true,
  tastingNotes: ['Chocolate', 'Caramelo', 'Frutos rojos'],
  features: [
    { icon: Coffee, text: '100% Arábica' },
    { icon: Truck, text: 'Envío gratis +$50.000' },
    { icon: Shield, text: 'Garantía de calidad' },
  ],
  variants: [
    { id: 'v1', name: '250 g', price: 20000 },
    { id: 'v2', name: '500 g', price: 35000 },
    { id: 'v3', name: '1 kg', price: 65000 },
  ],
};

export default function ProductoPage() {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[1]);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const addItemCompare = useCompareStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      image: '',
      quantity,
      stock: 50,
    });
  };

  const handleAddToCompare = () => {
    addItemCompare({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: selectedVariant.price,
      image: '',
      presentation: selectedVariant.name,
      type: product.type,
      roastLevel: product.roastLevel,
      origin: product.origin,
      tastingNotes: product.tastingNotes,
      weight: product.weight,
      averageRating: product.rating,
      shortDescription: product.shortDescription,
    });
  };

  return (
    <section className="bg-cream-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/tienda" className="inline-flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-700 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Volver a la tienda
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-coffee-200 to-cream-200">
              <div className="flex h-full items-center justify-center">
                <span className="font-serif text-[120px] text-coffee-400/40">☕</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-coffee-100 to-cream-100 border-2 border-primary-300 cursor-pointer">
                  <div className="flex h-full items-center justify-center">
                    <span className="font-serif text-2xl text-coffee-400/40">☕</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="coffee">{product.category}</Badge>
              {product.isFeatured && <Badge className="bg-primary-700">Destacado</Badge>}
            </div>

            <h1 className="font-serif text-4xl font-bold text-coffee-900">{product.name}</h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-5 w-5 ${star <= Math.round(product.rating) ? 'fill-cream-500 text-cream-500' : 'text-secondary-300'}`} />
                ))}
              </div>
              <span className="text-sm text-secondary-600">{product.rating} ({product.reviewCount} reseñas)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-primary-700">{formatPrice(selectedVariant.price)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-secondary-400 line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>

            <p className="text-secondary-700 leading-relaxed">{product.description}</p>

            <Separator />

            {/* Tasting Notes */}
            <div>
              <h3 className="font-serif font-semibold text-coffee-900">Notas de cata</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.tastingNotes.map((note) => (
                  <Badge key={note} variant="outline">{note}</Badge>
                ))}
              </div>
            </div>

            {/* Variants */}
            <div>
              <h3 className="font-serif font-semibold text-coffee-900">Presentación</h3>
              <div className="mt-2 flex gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                      selectedVariant.id === variant.id
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-cream-300 text-secondary-600 hover:border-primary-300'
                    }`}
                  >
                    {variant.name} — {formatPrice(variant.price)}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-cream-300">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-secondary-600 hover:text-primary-700">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[3rem] text-center font-medium text-coffee-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-secondary-600 hover:text-primary-700">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Agregar al carrito
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="flex-1" onClick={handleAddToCompare}>
                <GitCompare className="mr-2 h-4 w-4" />
                Comparar
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`flex-1 ${isInWishlist ? 'border-red-300 text-red-600' : ''}`}
                onClick={() => toggleWishlist({ productId: product.id, name: product.name, slug: product.slug, price: selectedVariant.price, image: '' })}
              >
                <Heart className={`mr-2 h-4 w-4 ${isInWishlist ? 'fill-red-500' : ''}`} />
                {isInWishlist ? 'En favoritos' : 'Favorito'}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {product.features.map((feat) => (
                <div key={feat.text} className="flex items-center gap-2 text-sm text-secondary-600">
                  <feat.icon className="h-4 w-4 text-primary-600" />
                  {feat.text}
                </div>
              ))}
            </div>

            {/* Product Details Table */}
            <div className="rounded-xl border border-cream-200 bg-white p-6">
              <h3 className="font-serif font-semibold text-coffee-900 mb-4">Detalles del producto</h3>
              <dl className="space-y-3">
                {[
                  ['Origen', product.origin],
                  ['Tipo', product.type],
                  ['Tueste', product.roastLevel],
                  ['Peso', `${product.weight} g`],
                  ['Categoría', product.category],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <dt className="text-secondary-500">{label}</dt>
                    <dd className="font-medium text-coffee-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
