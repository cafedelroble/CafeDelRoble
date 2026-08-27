import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  try {
    const body = await request.json();
    const banner = await prisma.banner.update({ where: { id: (await params).id }, data: { title: typeof body.title === 'string' ? body.title.trim() : undefined, image: typeof body.image === 'string' ? body.image.trim() : undefined, isActive: typeof body.isActive === 'boolean' ? body.isActive : undefined } });
    return NextResponse.json({ banner });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: 'No se pudo actualizar el banner' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  try {
    const banner = await prisma.banner.update({ where: { id: (await params).id }, data: { isActive: false } });
    return NextResponse.json({ banner });
  } catch (error) {
    console.error('Error deactivating banner:', error);
    return NextResponse.json({ error: 'No se pudo desactivar el banner' }, { status: 500 });
  }
}
