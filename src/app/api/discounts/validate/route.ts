import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type DiscountItem = { productId?: string; quantity?: number };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: DiscountItem[] = Array.isArray(body.items) ? body.items : [];
    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
    if (!items.length) return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });

    const products = await prisma.product.findMany({ where: { id: { in: items.map((item) => item.productId).filter((id): id is string => Boolean(id)) }, isActive: true, deletedAt: null }, select: { id: true, categoryId: true, price: true }, });
    const productMap = new Map(products.map((product) => [product.id, product]));
    const subtotal = items.reduce((total, item) => total + Number(productMap.get(item.productId || '')?.price || 0) * Math.max(1, Number(item.quantity) || 1), 0);
    const discount = await prisma.discount.findFirst({ where: { isActive: true, ...(code ? { code } : { isAutomatic: true }), startDate: { lte: new Date() }, endDate: { gte: new Date() }, ...(code ? {} : { isAutomatic: true }), }, orderBy: { createdAt: 'asc' } });
    if (!discount) return NextResponse.json({ error: 'Código no válido o promoción no disponible' }, { status: 404 });
    if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) return NextResponse.json({ error: 'El descuento alcanzó su límite de usos' }, { status: 400 });
    if (discount.minAmount !== null && subtotal < Number(discount.minAmount)) return NextResponse.json({ error: `Compra mínima de $${Number(discount.minAmount).toLocaleString('es-CO')}` }, { status: 400 });

    const eligibleSubtotal = items.reduce((total, item) => {
      const product = productMap.get(item.productId || '');
      const eligible = discount.scope === 'CARRITO' || (discount.scope === 'PRODUCTOS' && discount.applicableProducts.includes(item.productId || '')) || (discount.scope === 'CATEGORIAS' && product && discount.applicableCategories.includes(product.categoryId));
      return eligible ? total + Number(product?.price || 0) * Math.max(1, Number(item.quantity) || 1) : total;
    }, 0);
    const rawAmount = discount.type === 'PORCENTAJE' ? eligibleSubtotal * Number(discount.value) / 100 : Number(discount.value);
    const amount = Math.min(Math.max(0, rawAmount), eligibleSubtotal);
    return NextResponse.json({ code: discount.code, type: discount.type, scope: discount.scope, amount, subtotal, total: subtotal - amount });
  } catch (error) {
    console.error('Error validating discount:', error);
    return NextResponse.json({ error: 'No se pudo validar el descuento' }, { status: 500 });
  }
}
