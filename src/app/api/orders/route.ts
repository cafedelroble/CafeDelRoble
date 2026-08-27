import { NextRequest, NextResponse } from 'next/server';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

function asText(value: unknown) { return typeof value === 'string' ? value.trim() : ''; }

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const rawItems = Array.isArray(body.items) ? body.items : [];
    const items = rawItems.map((item: { productId?: unknown; variantId?: unknown; quantity?: unknown }) => ({ productId: asText(item.productId), variantId: asText(item.variantId) || null, quantity: Math.floor(Number(item.quantity)) })).filter((item: { productId: string; quantity: number }) => item.productId && item.quantity > 0);
    if (!items.length) return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });

    const productIds: string[] = Array.from(new Set(items.map((item: { productId: string }) => item.productId)));
    const products = await prisma.product.findMany({ where: { id: { in: productIds }, isActive: true, deletedAt: null }, include: { variants: { where: { isActive: true } }, category: true } });
    const productMap = new Map(products.map((product) => [product.id, product]));
    if (products.length !== productIds.length) return NextResponse.json({ error: 'Uno o más productos ya no están disponibles' }, { status: 400 });

    type ProductRecord = (typeof products)[number];
    type VariantRecord = ProductRecord['variants'][number];
    type OrderLine = { item: { productId: string; variantId: string | null; quantity: number }; product: ProductRecord; variant: VariantRecord; price: number; total: number };
    const lines: OrderLine[] = items.map((item: { productId: string; variantId: string | null; quantity: number }) => {
      const product = productMap.get(item.productId);
      const variant = item.variantId ? product?.variants.find((entry) => entry.id === item.variantId) : product?.variants[0];
      if (!product || !variant) throw new Error('VARIANT_NOT_FOUND');
      if (variant.stock < item.quantity) throw new Error(`STOCK:${product.name}`);
      return { item, product, variant, price: Number(variant.price), total: Number(variant.price) * item.quantity };
    });
    const subtotal = lines.reduce((sum: number, line: OrderLine) => sum + line.total, 0);
    const code = asText(body.discountCode).toUpperCase();
    let discountAmount = 0;
    let discountId: string | null = null;
    if (code) {
      const discount = await prisma.discount.findFirst({ where: { code, isActive: true, startDate: { lte: new Date() }, endDate: { gte: new Date() } } });
      if (!discount) return NextResponse.json({ error: 'El código de descuento no es válido' }, { status: 400 });
      if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) return NextResponse.json({ error: 'El descuento alcanzó su límite de usos' }, { status: 400 });
      if (discount.minAmount !== null && subtotal < Number(discount.minAmount)) return NextResponse.json({ error: 'No se alcanza el monto mínimo del descuento' }, { status: 400 });
      const eligible = lines.filter((line: OrderLine) => discount.scope === 'CARRITO' || (discount.scope === 'PRODUCTOS' && discount.applicableProducts.includes(line.product.id)) || (discount.scope === 'CATEGORIAS' && discount.applicableCategories.includes(line.product.categoryId))).reduce((sum: number, line: OrderLine) => sum + line.total, 0);
      discountAmount = Math.min(eligible, discount.type === 'PORCENTAJE' ? eligible * Number(discount.value) / 100 : Number(discount.value));
      discountId = discount.id;
    }
    const shippingCost = subtotal - discountAmount >= 50000 ? 0 : 8000;
    const total = subtotal - discountAmount + shippingCost;
    const method = Object.values(PaymentMethod).includes(body.paymentMethod) ? body.paymentMethod : 'WHATSAPP';
    const order = await prisma.$transaction(async (tx) => {
      for (const line of lines) {
        const updated = await tx.productVariant.updateMany({ where: { id: line.variant.id, stock: { gte: line.item.quantity } }, data: { stock: { decrement: line.item.quantity } } });
        if (updated.count !== 1) throw new Error(`STOCK:${line.product.name}`);
      }
      const created = await tx.order.create({ data: { orderNumber: `CDR-${Date.now()}`, userId: session?.user.id, guestName: asText(body.name) || session?.user.name, guestEmail: asText(body.email) || session?.user.email, guestPhone: asText(body.phone), guestAddress: asText(body.address), guestCity: asText(body.city), guestDepartment: asText(body.department), subtotal, shippingCost, discountAmount, total, status: 'PENDIENTE_PAGO', items: { create: lines.map((line: OrderLine) => ({ productId: line.product.id, variantId: line.variant.id, productName: line.product.name, variantName: line.variant.name, quantity: line.item.quantity, unitPrice: line.price, total: line.total })) }, payments: { create: { method, amount: total, status: 'PENDIENTE' } }, statusHistory: { create: { status: OrderStatus.PENDIENTE_PAGO, note: 'Pedido creado desde checkout' } } }, include: { items: true } });
      if (discountId) await tx.discount.update({ where: { id: discountId }, data: { usedCount: { increment: 1 } } });
      return created;
    });
    return NextResponse.json({ order: { id: order.id, orderNumber: order.orderNumber, total: Number(order.total) } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'VARIANT_NOT_FOUND') return NextResponse.json({ error: 'Una variante del carrito ya no está disponible' }, { status: 400 });
    if (error instanceof Error && error.message.startsWith('STOCK:')) return NextResponse.json({ error: `Stock insuficiente: ${error.message.slice(6)}` }, { status: 409 });
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'No se pudo crear el pedido' }, { status: 500 });
  }
}
