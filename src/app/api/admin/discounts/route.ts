import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { discountSchema } from '@/lib/validations/auth';

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;
  const discounts = await prisma.discount.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ discounts });
}

export async function POST(request: NextRequest) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  try {
    const data = discountSchema.parse(await request.json());
    const discount = await prisma.discount.create({ data });
    return NextResponse.json({ discount }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') return NextResponse.json({ error: 'Datos de descuento inválidos' }, { status: 400 });
    console.error('Error creating discount:', error);
    return NextResponse.json({ error: 'No se pudo crear el descuento' }, { status: 500 });
  }
}
