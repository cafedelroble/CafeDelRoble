'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Eye, Star, Filter, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';

type Product = { id: string; name: string; slug: string; shortDescription: string | null; price: number; image: string | null; category: { name: string; slug: string }; type: string; roastLevel: string; averageRating: number | null; isFeatured: boolean; stock: number };

/*
  { id: '1', name: 'Café Especial del Roble', slug: 'cafe-especial-del-roble', shortDescription: 'Chocolate, caramelo y frutos rojos.', price: 35000, category: 'cafe-especial', type: 'Grano', roastLevel: 'Media', rating: 4.9, isFeatured: true },
  { id: '2', name: 'Café Tradicional del Valle', slug: 'cafe-tradicional-del-valle', shortDescription: 'Sabor robusto y equilibrado.', price: 25000, category: 'cafe-tradicional', type: 'Molido', roastLevel: 'Media', rating: 4.5 },
  { id: '3', name: 'Café Orgánico de Nariño', slug: 'cafe-organico-de-narino', shortDescription: 'Notas cítricas y florales.', price: 45000, category: 'cafe-organico', type: 'Grano', roastLevel: 'Clara', rating: 4.8, isFeatured: true },
  { id: '4', name: 'Café de Origen Huila', slug: 'cafe-de-origen-huila', shortDescription: 'Cuerpo intenso y notas achocolatadas.', price: 40000, category: 'cafe-de-origen', type: 'Grano', roastLevel: 'Oscura', rating: 4.7 },
  { id: '5', name: 'Blend Maestro del Roble', slug: 'blend-maestro-del-roble', shortDescription: 'Equilibrio perfecto entre cuerpo y suavidad.', price: 38000, category: 'cafe-especial', type: 'Molido', roastLevel: 'Media', rating: 4.7, isFeatured: true },
  { id: '6', name: 'Café Reserve Especial', slug: 'cafe-reserve-especial', shortDescription: 'Edición limitada de Risaralda.', price: 55000, category: 'cafe-especial', type: 'Grano', roastLevel: 'Clara', rating: 5.0 },
  { id: '7', name: 'Café Tueste Artesanal', slug: 'cafe-tueste-artesanal', shortDescription: 'Tueste oscuro intenso y aromático.', price: 28000, category: 'cafe-tradicional', type: 'Molido', roastLevel: 'Oscura', rating: 4.4 },
  { id: '8', name: 'Pack Degustación Premium', slug: 'pack-degustacion-premium', shortDescription: 'Descubre los mejores orígenes colombianos.', price: 75000, category: 'cafe-de-origen', type: 'Grano', roastLevel: 'Media', rating: 4.9 },
]; */

const sortOptions = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'rating', label: 'Mejor valorados' },
];

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/products', { cache: 'no-store' }).then((response) => response.json()).then((data) => setProducts(data.products || [])).finally(() => setLoading(false)); }, []);
  const categories = [{ id: 'all', name: 'Todos', count: products.length }, ...Array.from(new Map(products.map((product) => [product.category.slug, { id: product.category.slug, name: product.category.name, count: products.filter((item) => item.category.slug === product.category.slug).length }])).values())];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const filteredProducts = products
    .filter((p) => selectedCategory === 'all' || p.category.slug === selectedCategory)
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return Number(b.averageRating || 0) - Number(a.averageRating || 0);
      return 0;
    });

  return (
    <>
      <section className="bg-gradient-to-br from-coffee-950 to-primary-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-white">Tienda</h1>
          <p className="mt-4 text-cream-300">Explora nuestra selección de cafés premium</p>
        </div>
      </section>

      <section className="bg-cream-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search & Sort Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
              <Input
                placeholder="Buscar café..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-coffee-900"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
            {/* Filters Sidebar */}
            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-serif font-semibold text-coffee-900">Categorías</h3>
                  <div className="mt-3 space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'text-secondary-600 hover:bg-cream-100'
                        }`}
                      >
                        {cat.name}
                        <span className="text-xs text-secondary-400">{cat.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? <p className="col-span-full text-center text-secondary-600">Cargando productos...</p> : filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group rounded-2xl border border-cream-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-br from-coffee-200 to-cream-200">
                    {product.image ? <Image src={product.image} alt={product.name} fill className="object-cover" /> : <div className="flex h-full items-center justify-center"><span className="font-serif text-6xl text-coffee-400/40">☕</span></div>}
                    {product.isFeatured && (
                      <Badge className="absolute left-3 top-3 bg-primary-700">Destacado</Badge>
                    )}
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium">
                      <Star className="h-3 w-3 fill-cream-500 text-cream-500" />
                      {Number(product.averageRating || 0).toFixed(1)}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">{product.type}</Badge>
                      <Badge variant="outline" className="text-xs">{product.roastLevel}</Badge>
                    </div>
                    <h3 className="mt-3 font-serif text-lg font-semibold text-coffee-900 group-hover:text-primary-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-secondary-600 line-clamp-2">{product.shortDescription}</p>
                    <p className="mt-3 font-serif text-xl font-bold text-primary-700">{formatPrice(product.price)}</p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <Link href={`/productos/${product.slug}`}>
                          <Eye className="mr-1 h-3.5 w-3.5" /> Ver
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
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
                        <ShoppingBag className="mr-1 h-3.5 w-3.5" /> Agregar
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
