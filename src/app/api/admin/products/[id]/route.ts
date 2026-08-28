import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { productSchema } from '@/lib/validations/auth';

type ProductImageInput = {
  url?: unknown;
  altText?: unknown;
  isPrimary?: unknown;
  sortOrder?: unknown;
  cloudinaryPublicId?: unknown;
};

function parseProductImages(images: unknown, fallbackName: string) {
  if (!Array.isArray(images)) return null;

  const validImages = images
    .map((image: ProductImageInput, index) => ({
      url: typeof image.url === 'string' ? image.url.trim() : '',
      altText: typeof image.altText === 'string' ? image.altText : fallbackName,
      isPrimary: image.isPrimary === true,
      sortOrder: typeof image.sortOrder === 'number' ? image.sortOrder : index,
      cloudinaryPublicId: typeof image.cloudinaryPublicId === 'string' ? image.cloudinaryPublicId : null,
    }))
    .filter((image) => image.url.length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const primaryIndex = validImages.findIndex((image) => image.isPrimary);
  return validImages.map((image, index) => ({
    ...image,
    sortOrder: index,
    isPrimary: primaryIndex === -1 ? index === 0 : index === primaryIndex,
  }));
}

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
    const nextImages = parseProductImages(body.images, typeof body.name === 'string' ? body.name : 'Imagen de producto');
    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data,
        include: { category: true, images: true, variants: true, inventory: true },
      });
      if (nextImages) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (nextImages.length > 0) {
          await tx.productImage.createMany({
            data: nextImages.map((image) => ({
              ...image,
              altText: image.altText || updated.name,
              productId: id,
            })),
          });
        }
      } else if (typeof body.imageUrl === 'string') {
        const primary = updated.images.find((image) => image.isPrimary);
        if (body.imageUrl) {
          if (primary) await tx.productImage.update({ where: { id: primary.id }, data: { url: body.imageUrl, altText: updated.name, isPrimary: true } });
          else await tx.productImage.create({ data: { productId: id, url: body.imageUrl, altText: updated.name, isPrimary: true } });
        } else if (primary) {
          await tx.productImage.delete({ where: { id: primary.id } });
        }
      }
      return tx.product.findUnique({ where: { id }, include: { category: true, images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] }, variants: true, inventory: true } });
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
