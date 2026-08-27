import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  try {
    const body = await request.json();
    if (typeof body.name !== 'string' || body.name.trim().length < 2) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    const slug = typeof body.slug === 'string' && body.slug.trim() ? body.slug.trim() : body.name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const category = await prisma.category.create({ data: { name: body.name.trim(), slug, description: body.description || null } });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'No se pudo crear la categoría' }, { status: 500 });
  }
}
