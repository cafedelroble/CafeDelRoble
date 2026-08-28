'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Coffee, GitCompare, Heart, Minus, Plus, Shield, ShoppingBag, Star, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { useCompareStore } from '@/stores/compare-store';
import { useWishlistStore } from '@/stores/wishlist-store';

type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
};

type ProductVariant = {
  id: string;
  name: string;
  price: number;
  weight: number | null;
  stock: number;
};

type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  category: { name: string; slug: string };
  type: string;
  roastLevel: string;
  origin: string | null;
  weight: number | null;
  averageRating: number | null;
  reviewCount: number;
  isFeatured: boolean;
  tastingNotes: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  stock: number;
};

const typeLabels: Record<string, string> = {
  GRAIN: 'Grano',
  MOLIDO: 'Molido',
};

const roastLabels: Record<string, string> = {
  CLARA: 'Claro',
  MEDIA: 'Medio',
  OSCURA: 'Oscuro',
};

export function ProductDetailClient({ product }: { product: ProductDetail }) {
  const fallbackVariant = {
    id: 'default',
    name: product.weight ? `${product.weight} g` : 'Unidad',
    price: product.price,
    weight: product.weight,
    stock: product.stock,
  };
  const variants = product.variants.length > 0 ? product.variants : [fallbackVariant];
  const primaryImage = product.images.find((image) => image.isPrimary) || product.images[0] || null;

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [selectedImage, setSelectedImage] = useState(primaryImage);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const addItemCompare = useCompareStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const imageUrl = selectedImage?.url || '';
  const rating = product.averageRating || 0;
  const stock = selectedVariant.stock || product.stock;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant.id === 'default' ? undefined : selectedVariant.id,
      name: product.name,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      image: imageUrl,
      quantity,
      stock,
    });
  };

  const handleAddToCompare = () => {
    addItemCompare({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: selectedVariant.price,
      compareAtPrice: product.compareAtPrice || undefined,
      image: imageUrl,
      presentation: selectedVariant.name,
      type: typeLabels[product.type] || product.type,
      roastLevel: roastLabels[product.roastLevel] || product.roastLevel,
      origin: product.origin || undefined,
      tastingNotes: product.tastingNotes,
      weight: selectedVariant.weight || product.weight || undefined,
      averageRating: rating,
      shortDescription: product.shortDescription || undefined,
    });
  };

  return (
    <section className="bg-cream-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/tienda" className="mb-8 inline-flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-700">
          <ArrowLeft className="h-4 w-4" />
          Volver a la tienda
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-coffee-200 to-cream-200">
              {selectedImage ? (
                <Image src={selectedImage.url} alt={selectedImage.altText || product.name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-serif text-[120px] text-coffee-400/40">☕</span>
                </div>
              )}
            </div>

            {product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-cream-100 ${
                      selectedImage?.id === image.id ? 'border-primary-600' : 'border-cream-200'
                    }`}
                  >
                    <Image src={image.url} alt={image.altText || product.name} fill className="object-cover" sizes="120px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="coffee">{product.category.name}</Badge>
              {product.isFeatured && <Badge className="bg-primary-700">Destacado</Badge>}
            </div>

            <h1 className="font-serif text-4xl font-bold text-coffee-900">{product.name}</h1>

            {rating > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-5 w-5 ${star <= Math.round(rating) ? 'fill-cream-500 text-cream-500' : 'text-secondary-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-secondary-600">{rating.toFixed(1)} ({product.reviewCount} reseñas)</span>
              </div>
            )}

            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-primary-700">{formatPrice(selectedVariant.price)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-secondary-400 line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>

            <p className="leading-relaxed text-secondary-700">{product.description || product.shortDescription}</p>

            <Separator />

            {product.tastingNotes.length > 0 && (
              <div>
                <h3 className="font-serif font-semibold text-coffee-900">Notas de cata</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.tastingNotes.map((note) => (
                    <Badge key={note} variant="outline">{note}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-serif font-semibold text-coffee-900">Presentación</h3>
              <div className="mt-2 flex flex-wrap gap-3">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                      selectedVariant.id === variant.id
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-cream-300 text-secondary-600 hover:border-primary-300'
                    }`}
                  >
                    {variant.name} - {formatPrice(variant.price)}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-cream-300">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-secondary-600 hover:text-primary-700">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[3rem] text-center font-medium text-coffee-900">{quantity}</span>
                <button type="button" onClick={() => setQuantity(Math.min(stock, quantity + 1))} className="px-3 py-2 text-secondary-600 hover:text-primary-700">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button size="lg" className="flex-1" disabled={stock === 0} onClick={handleAddToCart}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                {stock === 0 ? 'Agotado' : 'Agregar al carrito'}
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
                onClick={() => toggleWishlist({ productId: product.id, name: product.name, slug: product.slug, price: selectedVariant.price, image: imageUrl })}
              >
                <Heart className={`mr-2 h-4 w-4 ${isInWishlist ? 'fill-red-500' : ''}`} />
                {isInWishlist ? 'En favoritos' : 'Favorito'}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Coffee, text: '100% Arabica' },
                { icon: Truck, text: 'Envio gratis +$50.000' },
                { icon: Shield, text: 'Garantia de calidad' },
              ].map((feature) => (
                <div key={feature.text} className="flex items-center gap-2 text-sm text-secondary-600">
                  <feature.icon className="h-4 w-4 text-primary-600" />
                  {feature.text}
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-cream-200 bg-white p-6">
              <h3 className="mb-4 font-serif font-semibold text-coffee-900">Detalles del producto</h3>
              <dl className="space-y-3">
                {[
                  ['Origen', product.origin || 'Pereira, Risaralda'],
                  ['Tipo', typeLabels[product.type] || product.type],
                  ['Tueste', roastLabels[product.roastLevel] || product.roastLevel],
                  ['Peso', selectedVariant.weight ? `${selectedVariant.weight} g` : product.weight ? `${product.weight} g` : 'Segun presentacion'],
                  ['Categoria', product.category.name],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 text-sm">
                    <dt className="text-secondary-500">{label}</dt>
                    <dd className="text-right font-medium text-coffee-900">{value}</dd>
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
