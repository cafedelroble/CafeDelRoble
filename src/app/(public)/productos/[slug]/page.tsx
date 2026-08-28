import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductDetailClient } from '@/components/products/product-detail-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductoPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      variants: { where: { isActive: true }, orderBy: { weight: 'asc' } },
      inventory: { select: { stock: true, variantId: true } },
    },
  });

  if (!product || !product.isActive || product.deletedAt) notFound();

  const variantStockById = new Map(
    product.inventory
      .filter((item) => item.variantId)
      .map((item) => [item.variantId, item.stock])
  );
  const totalStock = product.inventory.reduce((sum, item) => sum + item.stock, 0);

  return (
    <ProductDetailClient
      product={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        category: product.category,
        type: product.type,
        roastLevel: product.roastLevel,
        origin: product.origin,
        weight: product.weight ? Number(product.weight) : null,
        averageRating: product.averageRating ? Number(product.averageRating) : null,
        reviewCount: product.reviewCount,
        isFeatured: product.isFeatured,
        tastingNotes: product.tastingNotes,
        images: product.images.map((image) => ({
          id: image.id,
          url: image.url,
          altText: image.altText,
          isPrimary: image.isPrimary,
        })),
        variants: product.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          price: Number(variant.price),
          weight: variant.weight ? Number(variant.weight) : null,
          stock: variantStockById.get(variant.id) || variant.stock,
        })),
        stock: totalStock,
      }}
    />
  );
}
