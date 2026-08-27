import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;
  return NextResponse.json({ banners: await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } }) });
}

export async function POST(request: NextRequest) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  try {
    const body = await request.json();
    if (typeof body.title !== 'string' || !body.title.trim() || typeof body.image !== 'string' || !body.image.trim()) return NextResponse.json({ error: 'Título e imagen son obligatorios' }, { status: 400 });
    const banner = await prisma.banner.create({ data: { title: body.title.trim(), subtitle: body.subtitle || null, image: body.image.trim(), link: body.link || null, buttonText: body.buttonText || null, position: body.position || 'HERO', sortOrder: Number(body.sortOrder) || 0, isActive: body.isActive !== false } });
    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'No se pudo crear el banner' }, { status: 500 });
  }
}
