import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { productSchema } from '@/lib/validations/auth';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] }, variants: true, inventory: true },
  });
  if (!product || product.deletedAt) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  const { id } = await params;

  try {
    const body = await request.json();
    const data = productSchema.partial().parse(body);
    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data,
        include: { category: true, images: true, variants: true, inventory: true },
      });
      if (typeof body.imageUrl === 'string') {
        const primary = updated.images.find((image) => image.isPrimary);
        if (body.imageUrl) {
          if (primary) await tx.productImage.update({ where: { id: primary.id }, data: { url: body.imageUrl, altText: updated.name, isPrimary: true } });
          else await tx.productImage.create({ data: { productId: id, url: body.imageUrl, altText: updated.name, isPrimary: true } });
        } else if (primary) {
          await tx.productImage.delete({ where: { id: primary.id } });
        }
      }
      return tx.product.findUnique({ where: { id }, include: { category: true, images: true, variants: true, inventory: true } });
    });
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return NextResponse.json({ error: 'Datos de producto inválidos' }, { status: 400 });
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'No se pudo actualizar el producto' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  const { id } = await params;

  try {
    const product = await prisma.product.update({ where: { id }, data: { isActive: false, deletedAt: new Date() } });
    return NextResponse.json({ product, message: 'Producto desactivado correctamente' });
  } catch (error) {
    console.error('Error deactivating product:', error);
    return NextResponse.json({ error: 'No se pudo desactivar el producto' }, { status: 500 });
  }
}
