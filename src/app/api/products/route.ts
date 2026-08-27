import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true, deletedAt: null },
    include: { category: { select: { id: true, name: true, slug: true } }, images: { where: { isPrimary: true }, take: 1 }, variants: { where: { isActive: true }, orderBy: { weight: 'asc' } }, inventory: { select: { stock: true } } },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json({ products: products.map((product) => ({ ...product, price: Number(product.price), weight: product.weight ? Number(product.weight) : null, variants: product.variants.map((variant) => ({ ...variant, price: Number(variant.price), weight: variant.weight ? Number(variant.weight) : null })), stock: product.inventory.reduce((sum, item) => sum + item.stock, 0), image: product.images[0]?.url || null })) });
}
