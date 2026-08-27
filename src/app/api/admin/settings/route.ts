import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;
  return NextResponse.json({ settings: await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } }) });
}

export async function PATCH(request: NextRequest) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || typeof body.key !== 'string' || typeof body.value !== 'string') return NextResponse.json({ error: 'Configuración inválida' }, { status: 400 });
    const setting = await prisma.siteSetting.upsert({ where: { key: body.key }, update: { value: body.value }, create: { key: body.key, value: body.value, type: 'TEXT', group: 'general' } });
    return NextResponse.json({ setting });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'No se pudo guardar la configuración' }, { status: 500 });
  }
}
