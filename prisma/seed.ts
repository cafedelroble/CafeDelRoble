import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PRODUCT_IMAGE_DIR = "/images/products";

type ProductSeed = {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  categoryId: string;
  isFeatured?: boolean;
  sku: string;
  origin: string;
  tastingNotes: string[];
  weight: number;
  imageFile: string;
};

async function main() {
  console.log("🌱 Sembrando datos de prueba...");

  const password = await bcrypt.hash("password123", 12);

  // Users
  await prisma.user.upsert({
    where: { email: "admin@cafedelroble.co" },
    update: {},
    create: {
      email: "admin@cafedelroble.co",
      name: "Administrador",
      lastName: "Del Roble",
      password,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "cliente@cafedelroble.co" },
    update: {},
    create: {
      email: "cliente@cafedelroble.co",
      name: "Juan",
      lastName: "Pérez",
      phone: "3001234567",
      password,
      role: "CLIENTE",
      emailVerified: new Date(),
    },
  });

  // Categories
  const catEspecial = await prisma.category.upsert({
    where: { slug: "cafe-especial" },
    update: {},
    create: { name: "Café Especial", slug: "cafe-especial", description: "Cafés de alta calidad con notas únicas", sortOrder: 1 },
  });

  const catTradicional = await prisma.category.upsert({
    where: { slug: "cafe-tradicional" },
    update: {},
    create: { name: "Café Tradicional", slug: "cafe-tradicional", description: "El sabor clásico colombiano", sortOrder: 2 },
  });

  const catReserva = await prisma.category.upsert({
    where: { slug: "reserva-especial" },
    update: {},
    create: { name: "Reserva Especial", slug: "reserva-especial", description: "Lotes limitados de alta gama", sortOrder: 3 },
  });

  // Products
  const productsData: ProductSeed[] = [
    { name: "Café Especial del Roble", slug: "cafe-especial-del-roble", description: "Nuestro café insignia, cultivado en las montañas de Pereira a 1,400 m.s.n.m. Notas de chocolate oscuro, caramelo y un toque cítrico.", shortDescription: "Notas de chocolate, caramelo y cítricos", price: 35000, categoryId: catEspecial.id, isFeatured: true, sku: "CDR-ESPECIAL-001", origin: "Pereira, Risaralda", tastingNotes: ["Chocolate oscuro", "Caramelo", "Cítricos"], weight: 250, imageFile: "cafe-especial-del-roble.svg" },
    { name: "Café Tradicional Montañero", slug: "cafe-tradicional-montanero", description: "El café que representa la tradición cafetera colombiana. Sabor robusto, cuerpo medio y el aroma característico.", shortDescription: "Sabor clásico colombiano, cuerpo medio", price: 28000, categoryId: catTradicional.id, isFeatured: true, sku: "CDR-TRAD-001", origin: "Pereira, Risaralda", tastingNotes: ["Chocolate", "Nuez", "Panela"], weight: 250, imageFile: "cafe-tradicional-montanero.svg" },
    { name: "Reserva Del Roble 2024", slug: "reserva-del-roble-2024", description: "Edición limitada. Selección manual procesada con método honey. Notas de frutas tropicales, miel y chocolate blanco.", shortDescription: "Edición limitada, procesado honey", price: 55000, categoryId: catReserva.id, isFeatured: true, sku: "CDR-RESERVA-001", origin: "Pereira — Finca El Roble", tastingNotes: ["Frutas tropicales", "Miel", "Chocolate blanco"], weight: 250, imageFile: "reserva-del-roble-2024.svg" },
    { name: "Café Especial 500g", slug: "cafe-especial-500g", description: "Presentación familiar del café insignia. Las mismas notas de chocolate oscuro, caramelo y cítricos en 500g.", shortDescription: "Presentación familiar del café insignia", price: 62000, categoryId: catEspecial.id, isFeatured: true, sku: "CDR-ESPECIAL-002", origin: "Pereira, Risaralda", tastingNotes: ["Chocolate oscuro", "Caramelo", "Cítricos"], weight: 500, imageFile: "cafe-especial-500g.svg" },
    { name: "Café Tradicional 500g", slug: "cafe-tradicional-500g", description: "El sabor clásico colombiano en presentación de 500g.", shortDescription: "Presentación familiar del tradicional", price: 48000, categoryId: catTradicional.id, sku: "CDR-TRAD-002", origin: "Pereira, Risaralda", tastingNotes: ["Chocolate", "Nuez", "Panela"], weight: 500, imageFile: "cafe-tradicional-500g.svg" },
    { name: "Micro-Lote Volcánico", slug: "micro-lote-volcanico", description: "Café exclusivo de un solo lote, cultivado en suelos volcánicos. Procesado lavado para una limpieza exquisita.", shortDescription: "Suelos volcánicos, procesado lavado", price: 68000, categoryId: catReserva.id, isFeatured: true, sku: "CDR-MICRO-001", origin: "Pereira — Suelos Volcánicos", tastingNotes: ["Florales", "Frutas rojas", "Final elegante"], weight: 250, imageFile: "micro-lote-volcanico.svg" },
  ];

  const products = [];
  for (const data of productsData) {
    const { imageFile, ...productData } = data;
    const product = await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...productData, isActive: true },
    });

    await prisma.productVariant.upsert({
      where: { sku: `${data.sku}-250` },
      update: {},
      create: { productId: product.id, name: "250g", sku: `${data.sku}-250`, price: Math.round(data.price * 0.6), stock: 50, weight: 250 },
    });

    await prisma.productVariant.upsert({
      where: { sku: `${data.sku}-500` },
      update: {},
      create: { productId: product.id, name: "500g", sku: `${data.sku}-500`, price: data.price, stock: 80, weight: 500 },
    });

    const existingImage = await prisma.productImage.findUnique({ where: { id: `seed-image-${data.slug}` }, select: { url: true, cloudinaryPublicId: true } });
    const localImageUrl = `${PRODUCT_IMAGE_DIR}/${imageFile}`;
    await prisma.productImage.upsert({
      where: { id: `seed-image-${data.slug}` },
      update: {
        url: existingImage?.cloudinaryPublicId ? existingImage.url : localImageUrl,
        altText: data.name,
        sortOrder: 0,
        isPrimary: true,
      },
      create: {
        id: `seed-image-${data.slug}`,
        productId: product.id,
        url: localImageUrl,
        altText: data.name,
        sortOrder: 0,
        isPrimary: true,
      },
    });

    products.push(product);
  }

  // Real products - Café del Roble cataloge fijo (referencias reproducibles Cloudinary)
  const realProducts = [
    {
      name: "Café del Roble - Muestra (120g)",
      slug: "cafe-del-roble-muestra-120g",
      description: "Perfecto para probar nuestro café de origen. Finca La Miranda.",
      shortDescription: "Presentación pequeña de 120g.",
      price: 15000,
      sku: "ROBLE-120",
      weight: 120,
      origin: "Finca La Miranda, Toro Valle",
      tastingNotes: [],
      isFeatured: false,
      stock: 100,
      mainImage: { id: "seed-image-cafe-del-roble-muestra-120g", url: "/images/products/roble-120g.jpg", altText: "Café del Roble - Muestra (120g)" },
      additions: [
        { id: "seed-image-cafe-del-roble-muestra-120g-additional-1", url: "https://res.cloudinary.com/saxpoorp/image/upload/cafe-del-roble/products/cafe-del-roble-muestra-120g/contextual.jpg", publicId: "cafe-del-roble/products/cafe-del-roble-muestra-120g/contextual", altText: "Café del Roble - Muestra (120g) en preparación contextual" },
        { id: "seed-image-cafe-del-roble-muestra-120g-additional-2", url: "https://res.cloudinary.com/saxpoorp/image/upload/cafe-del-roble/products/cafe-del-roble-muestra-120g/detalle.jpg", publicId: "cafe-del-roble/products/cafe-del-roble-muestra-120g/detalle", altText: "Detalle de empaque y café molido Café del Roble - Muestra (120g)" },
      ],
    },
    {
      name: "Café del Roble - Tostión Media (250g)",
      slug: "cafe-del-roble-tostion-media-250g",
      description: "Café cultivado con dedicación. Finca La Miranda. 100% café colombiano. Presentación de 250g.",
      shortDescription: "Tostión media, media libra.",
      price: 22000,
      sku: "ROBLE-250",
      weight: 250,
      origin: "Finca La Miranda, Toro Valle",
      tastingNotes: [],
      isFeatured: true,
      stock: 100,
      mainImage: { id: "seed-image-cafe-del-roble-tostion-media-250g", url: "/images/products/roble-250g.jpg", altText: "Café del Roble - Tostión Media (250g)" },
      additions: [
        { id: "seed-image-cafe-del-roble-tostion-media-250g-additional-1", url: "https://res.cloudinary.com/saxpoorp/image/upload/cafe-del-roble/products/cafe-del-roble-tostion-media-250g/contextual.jpg", publicId: "cafe-del-roble/products/cafe-del-roble-tostion-media-250g/contextual", altText: "Café del Roble - Tostión Media (250g) en cafetería" },
        { id: "seed-image-cafe-del-roble-tostion-media-250g-additional-2", url: "https://res.cloudinary.com/saxpoorp/image/upload/cafe-del-roble/products/cafe-del-roble-tostion-media-250g/detalle.jpg", publicId: "cafe-del-roble/products/cafe-del-roble-tostion-media-250g/detalle", altText: "Detalle de empaque y granos Café del Roble - Tostión Media (250g)" },
      ],
    },
    {
      name: "Café del Roble - Tostión Media (500g)",
      slug: "cafe-del-roble-tostion-media-500g",
      description: "Café cultivado con dedicación de la semilla a tu taza. Finca La Miranda. 100% café colombiano. Presentación de 500g.",
      shortDescription: "Tostión media, presentación de libra.",
      price: 35000,
      sku: "ROBLE-500",
      weight: 500,
      origin: "Finca La Miranda, Toro Valle",
      tastingNotes: [],
      isFeatured: true,
      stock: 100,
      mainImage: { id: "seed-image-cafe-del-roble-tostion-media-500g", url: "/images/products/roble-500g.jpg", altText: "Café del Roble - Tostión Media (500g)" },
      additions: [
        { id: "seed-image-cafe-del-roble-tostion-media-500g-additional-1", url: "https://res.cloudinary.com/saxpoorp/image/upload/cafe-del-roble/products/cafe-del-roble-tostion-media-500g/contextual.jpg", publicId: "cafe-del-roble/products/cafe-del-roble-tostion-media-500g/contextual", altText: "Café del Roble - Tostión Media (500g) en barra de café" },
        { id: "seed-image-cafe-del-roble-tostion-media-500g-additional-2", url: "https://res.cloudinary.com/saxpoorp/image/upload/cafe-del-roble/products/cafe-del-roble-tostion-media-500g/detalle.jpg", publicId: "cafe-del-roble/products/cafe-del-roble-tostion-media-500g/detalle", altText: "Detalle de empaque y granos Café del Roble - Tostión Media (500g)" },
      ],
    },
    {
      name: "Café del Roble - Institucional (2500g)",
      slug: "cafe-del-roble-institucional-2500g",
      description: "Café de origen de altura. Ideal para negocios o consumo familiar. Finca La Miranda. Presentación de 2.500g.",
      shortDescription: "Presentación grande de 2.5kg.",
      price: 150000,
      sku: "ROBLE-2500",
      weight: 2500,
      origin: "Finca La Miranda, Toro Valle",
      tastingNotes: [],
      isFeatured: true,
      stock: 100,
      mainImage: { id: "seed-image-cafe-del-roble-institucional-2500g", url: "/images/products/roble-2500g.jpg", altText: "Café del Roble - Institucional (2500g)" },
      additions: [
        { id: "seed-image-cafe-del-roble-institucional-2500g-additional-1", url: "https://res.cloudinary.com/saxpoorp/image/upload/cafe-del-roble/products/cafe-del-roble-institucional-2500g/contextual.jpg", publicId: "cafe-del-roble/products/cafe-del-roble-institucional-2500g/contextual", altText: "Café del Roble - Institucional (2500g) en finca cafetera" },
        { id: "seed-image-cafe-del-roble-institucional-2500g-additional-2", url: "https://res.cloudinary.com/saxpoorp/image/upload/cafe-del-roble/products/cafe-del-roble-institucional-2500g/detalle.jpg", publicId: "cafe-del-roble/products/cafe-del-roble-institucional-2500g/detalle", altText: "Detalle de empaque Café del Roble - Institucional (2500g)" },
      ],
    },
  ];

  for (const data of realProducts) {
    const product = await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        categoryId: catEspecial.id,
        price: data.price,
        sku: data.sku,
        weight: data.weight,
        origin: data.origin,
        tastingNotes: data.tastingNotes,
        isFeatured: data.isFeatured,
        isActive: true,
      },
    });

    const existingInventory = await prisma.inventory.findFirst({ where: { productId: product.id, variantId: null } });
    if (existingInventory) {
      await prisma.inventory.update({ where: { id: existingInventory.id }, data: { stock: data.stock } });
    } else {
      await prisma.inventory.create({ data: { productId: product.id, variantId: null, stock: data.stock } });
    }

    const existingMain = await prisma.productImage.findUnique({ where: { id: data.mainImage.id }, select: { url: true } });
    await prisma.productImage.upsert({
      where: { id: data.mainImage.id },
      update: { productId: product.id, url: existingMain?.url ?? data.mainImage.url, altText: data.mainImage.altText, sortOrder: 0, isPrimary: true },
      create: { id: data.mainImage.id, productId: product.id, url: data.mainImage.url, altText: data.mainImage.altText, sortOrder: 0, isPrimary: true },
    });

    await prisma.productImage.updateMany({ where: { productId: product.id, id: { not: data.mainImage.id } }, data: { isPrimary: false } });

    for (const [index, image] of data.additions.entries()) {
      const existing = await prisma.productImage.findUnique({ where: { id: image.id }, select: { url: true, cloudinaryPublicId: true } });
      await prisma.productImage.upsert({
        where: { id: image.id },
        update: { productId: product.id, url: existing?.cloudinaryPublicId ? existing.url : image.url, altText: image.altText, sortOrder: index + 1, isPrimary: false, cloudinaryPublicId: existing?.cloudinaryPublicId ?? image.publicId },
        create: { id: image.id, productId: product.id, url: image.url, altText: image.altText, sortOrder: index + 1, isPrimary: false, cloudinaryPublicId: image.publicId },
      });
    }
  }

  // Demo order
  const order = await prisma.order.upsert({
    where: { orderNumber: "CDR-DEMO-001" },
    update: {},
    create: {
      orderNumber: "CDR-DEMO-001",
      userId: customer.id,
      guestName: "Juan Pérez",
      guestEmail: "cliente@cafedelroble.co",
      guestPhone: "3001234567",
      guestAddress: "Calle 45 #12-34",
      guestCity: "Pereira",
      guestDepartment: "Risaralda",
      subtotal: 70000,
      total: 70000,
      status: "PAGO_RECIBIDO",
    },
  });

  await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
  await prisma.orderStatusHistory.deleteMany({ where: { orderId: order.id } });

  await prisma.orderItem.create({
    data: { orderId: order.id, productId: products[0].id, productName: products[0].name, quantity: 2, unitPrice: 35000, total: 70000 },
  });

  await prisma.orderStatusHistory.createMany({
    data: [
      { orderId: order.id, status: "PENDIENTE_PAGO", note: "Pedido creado" },
      { orderId: order.id, status: "PAGO_RECIBIDO", note: "Pago confirmado por WhatsApp" },
    ],
  });

  // Banners
  await prisma.banner.upsert({
    where: { id: "hero-banner" },
    update: {},
    create: { id: "hero-banner", title: "Café del Roble", subtitle: "El sabor de nuestra tierra", image: "/images/hero.jpg", position: "HERO", sortOrder: 1, isActive: true },
  });

  // Discounts: examples of automatic and code-based promotions.
  const promotionStart = new Date("2026-01-01T00:00:00.000Z");
  const promotionEnd = new Date("2027-12-31T23:59:59.000Z");
  await prisma.discount.upsert({
    where: { code: "BIENVENIDA10" },
    update: { type: "PORCENTAJE", scope: "CARRITO", value: 10, isAutomatic: false, isActive: true, startDate: promotionStart, endDate: promotionEnd },
    create: { code: "BIENVENIDA10", type: "PORCENTAJE", scope: "CARRITO", value: 10, isAutomatic: false, isActive: true, startDate: promotionStart, endDate: promotionEnd, applicableCategories: [], applicableProducts: [] },
  });
  await prisma.discount.upsert({
    where: { code: "ROBLE5000" },
    update: { type: "VALOR_FIJO", scope: "PRODUCTOS", value: 5000, applicableProducts: [products[0].id], isAutomatic: true, isActive: true, startDate: promotionStart, endDate: promotionEnd },
    create: { code: "ROBLE5000", type: "VALOR_FIJO", scope: "PRODUCTOS", value: 5000, applicableProducts: [products[0].id], applicableCategories: [], isAutomatic: true, isActive: true, startDate: promotionStart, endDate: promotionEnd },
  });
  await prisma.discount.upsert({
    where: { code: "ESPECIAL15" },
    update: { type: "PORCENTAJE", scope: "CATEGORIAS", value: 15, applicableCategories: [catEspecial.id], isAutomatic: true, isActive: true, startDate: promotionStart, endDate: promotionEnd },
    create: { code: "ESPECIAL15", type: "PORCENTAJE", scope: "CATEGORIAS", value: 15, applicableCategories: [catEspecial.id], applicableProducts: [], isAutomatic: true, isActive: true, startDate: promotionStart, endDate: promotionEnd },
  });

  // Settings
  const settings = [
    { key: "site_name", value: "Café del Roble", type: "TEXT" as const, group: "general" },
    { key: "whatsapp_number", value: "", type: "TEXT" as const, group: "contact" },
    { key: "email", value: "info@cafedelroble.co", type: "TEXT" as const, group: "contact" },
    { key: "phone", value: "+57 XXX XXX XXXX", type: "TEXT" as const, group: "contact" },
    { key: "address", value: "Pereira, Risaralda, Colombia", type: "TEXT" as const, group: "contact" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  // Page content
  await prisma.pageContent.upsert({
    where: { slug: "nosotros" },
    update: {},
    create: { slug: "nosotros", title: "Nuestra Historia", content: { hero: "De las montañas a tu taza", story: "Café del Roble nace de la pasión por el café colombiano." }, isActive: true },
  });

  console.log("✅ Datos de prueba creados!");
  console.log("   Admin: admin@cafedelroble.co / password123");
  console.log("   Cliente: cliente@cafedelroble.co / password123");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
