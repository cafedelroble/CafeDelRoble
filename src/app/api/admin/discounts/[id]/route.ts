import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { discountSchema } from '@/lib/validations/auth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  try {
    const data = discountSchema.partial().parse(await request.json());
    const discount = await prisma.discount.update({ where: { id: (await params).id }, data });
    return NextResponse.json({ discount });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return NextResponse.json({ error: 'Datos de descuento inválidos' }, { status: 400 });
    console.error('Error updating discount:', error);
    return NextResponse.json({ error: 'No se pudo actualizar el descuento' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  try {
    const discount = await prisma.discount.update({ where: { id: (await params).id }, data: { isActive: false } });
    return NextResponse.json({ discount });
  } catch (error) {
    console.error('Error deactivating discount:', error);
    return NextResponse.json({ error: 'No se pudo desactivar el descuento' }, { status: 500 });
  }
}
