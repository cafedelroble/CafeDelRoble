import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { FeaturedProductsClient } from './featured-products-client';

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, deletedAt: null, isFeatured: true },
      include: {
        category: { select: { name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1 },
        inventory: { select: { stock: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      price: Number(p.price),
      image: p.images[0]?.url || null,
      rating: Number(p.averageRating) || null,
      category: p.category,
      stock: p.inventory.reduce((s, i) => s + i.stock, 0),
    }));
  } catch {
    return [];
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

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

        {products.length === 0 ? (
          <div className="mt-16 text-center text-secondary-500">
            <span className="font-serif text-6xl">☕</span>
            <p className="mt-4">Próximamente nuestros productos destacados.</p>
          </div>
        ) : (
          <FeaturedProductsClient products={products} />
        )}

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/tienda">Ver todos los productos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
