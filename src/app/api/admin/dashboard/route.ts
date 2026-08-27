import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;

  const [orders, customers, products, inventory, topItems] = await Promise.all([
    prisma.order.findMany({ select: { id: true, orderNumber: true, total: true, status: true, createdAt: true, user: { select: { name: true, lastName: true } }, guestName: true }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.user.count({ where: { role: 'CLIENTE' } }),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.inventory.aggregate({ _sum: { stock: true }, where: { product: { deletedAt: null } } }),
    prisma.orderItem.groupBy({ by: ['productId'], _sum: { quantity: true, total: true }, orderBy: { _sum: { quantity: 'desc' } }, take: 5 }),
  ]);

  const sales = orders.filter((order) => order.status !== 'CANCELADO').reduce((sum, order) => sum + Number(order.total), 0);
  const topProductIds = topItems.map((item) => item.productId);
  const topProducts = await prisma.product.findMany({ where: { id: { in: topProductIds } }, select: { id: true, name: true } });
  const productNames = new Map(topProducts.map((product) => [product.id, product.name]));

  return NextResponse.json({
    stats: { sales, orders: orders.length, customers, products, stock: inventory._sum.stock || 0 },
    recentOrders: orders.map((order) => ({ id: order.orderNumber, customer: order.user ? `${order.user.name} ${order.user.lastName}` : order.guestName || 'Invitado', total: Number(order.total), status: order.status, date: order.createdAt })),
    topProducts: topItems.map((item) => ({ name: productNames.get(item.productId) || 'Producto eliminado', sold: item._sum.quantity || 0, revenue: Number(item._sum.total || 0) })),
  });
}
