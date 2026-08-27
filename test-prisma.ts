import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('Users:', await prisma.user.findMany());
  console.log('Products:', await prisma.product.findMany({ select: { id: true, name: true } }));
}
main().catch(console.error).finally(() => prisma.$disconnect());
