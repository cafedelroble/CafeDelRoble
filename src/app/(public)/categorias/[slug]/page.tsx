import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, Eye, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
    select: { name: true, description: true },
  });
  if (!category) return { title: 'Categoría no encontrada' };
  return {
    title: `${category.name} — Café del Roble`,
    description: category.description || `Explora nuestra colección de ${category.name}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { isActive: true, deletedAt: null },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          inventory: { select: { stock: true } },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      },
    },
  });

  if (!category) redirect('/tienda');

  const products = category.products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription,
    price: Number(p.price),
    image: p.images[0]?.url || null,
    stock: p.inventory.reduce((s, i) => s + i.stock, 0),
    isFeatured: p.isFeatured,
  }));

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-coffee-950 to-primary-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/tienda" className="inline-flex items-center gap-2 text-cream-300 hover:text-white transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
          <h1 className="font-serif text-5xl font-bold text-white">{category.name}</h1>
          {category.description && (
            <p className="mt-4 max-w-2xl text-cream-300">{category.description}</p>
          )}
          <p className="mt-2 text-cream-500 text-sm">{products.length} producto{products.length !== 1 ? 's' : ''}</p>
        </div>
      </section>

      {/* Products */}
      <section className="bg-cream-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="py-24 text-center">
              <span className="font-serif text-6xl">☕</span>
              <p className="mt-4 text-secondary-500">No hay productos en esta categoría por el momento.</p>
              <Button asChild className="mt-6">
                <Link href="/tienda">Ver todos los productos</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-2xl border border-cream-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
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
                    {product.isFeatured && (
                      <span className="absolute left-3 top-3 rounded-full bg-primary-700 px-2 py-0.5 text-xs font-medium text-white">
                        Destacado
                      </span>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-coffee-900">Agotado</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold text-coffee-900 group-hover:text-primary-700 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-secondary-600 line-clamp-2">{product.shortDescription}</p>
                    <p className="mt-3 font-serif text-xl font-bold text-primary-700">{formatPrice(product.price)}</p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <Link href={`/productos/${product.slug}`}>
                          <Eye className="mr-1 h-3.5 w-3.5" /> Ver
                        </Link>
                      </Button>
                      <Button size="sm" asChild className="flex-1">
                        <Link href={`/productos/${product.slug}`}>
                          <ShoppingBag className="mr-1 h-3.5 w-3.5" /> Agregar
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
