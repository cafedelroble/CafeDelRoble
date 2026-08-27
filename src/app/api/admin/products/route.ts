import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { productSchema } from '@/lib/validations/auth';

type ProductWithDetails = Prisma.ProductGetPayload<{
  include: {
    category: { select: { id: true; name: true } };
    images: true;
    variants: true;
    inventory: { select: { stock: true } };
  };
}>;

function serializeProduct(product: ProductWithDetails) {
  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    weight: product.weight ? Number(product.weight) : null,
    variants: product.variants.map((variant) => ({ ...variant, price: Number(variant.price), weight: variant.weight ? Number(variant.weight) : null })),
  };
}

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;

  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    include: {
      category: { select: { id: true, name: true } },
      images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      variants: { where: { isActive: true }, orderBy: { weight: 'asc' } },
      inventory: { select: { stock: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ products: products.map(serializeProduct) });
}

export async function POST(request: NextRequest) {
  const access = await requireAdmin();
  if (access.response) return access.response;

  try {
    const body = await request.json();
    const data = productSchema.parse(body);
    const product = await prisma.product.create({
      data: {
        ...data,
        images: body.imageUrl ? { create: { url: body.imageUrl, altText: data.name, isPrimary: true } } : undefined,
      },
      include: { category: { select: { id: true, name: true } }, images: true, variants: true, inventory: true },
    });
    return NextResponse.json({ product: serializeProduct(product) }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return NextResponse.json({ error: 'Datos de producto inválidos' }, { status: 400 });
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'No se pudo crear el producto' }, { status: 500 });
  }
}
