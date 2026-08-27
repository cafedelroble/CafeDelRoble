import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.gfdopehykprtburhkuso:Administrador01@3.139.14.59:6543/postgres?pgbouncer=true"
    }
  }
});

async function seedProducts() {
  console.log('Seeding products...');
  
  try {
    // 1. Get or create category
    let category = await prisma.category.findFirst({ where: { slug: 'cafe-especial' } });
    if (!category) {
      category = await prisma.category.create({
        data: { name: 'Café Especial', slug: 'cafe-especial', description: 'Café especial cultivado en finca La Miranda.' }
      });
    }

    // Define the 4 products from the user's images
    const productsToCreate = [
      {
        name: 'Café del Roble - Tostión Media (500g)',
        slug: 'cafe-del-roble-tostion-media-500g',
        description: 'Café cultivado con dedicación de la semilla a tu taza. Finca La Miranda. 100% café colombiano. Presentación de 500g.',
        shortDescription: 'Tostión media, presentación de libra.',
        price: 35000,
        sku: 'ROBLE-500',
        weight: 500,
        type: 'GRAIN',
        roastLevel: 'MEDIA',
        origin: 'Finca La Miranda, Toro Valle',
        categoryId: category.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Café del Roble - Tostión Media (250g)',
        slug: 'cafe-del-roble-tostion-media-250g',
        description: 'Café cultivado con dedicación. Finca La Miranda. 100% café colombiano. Presentación de 250g.',
        shortDescription: 'Tostión media, media libra.',
        price: 22000,
        sku: 'ROBLE-250',
        weight: 250,
        type: 'GRAIN',
        roastLevel: 'MEDIA',
        origin: 'Finca La Miranda, Toro Valle',
        categoryId: category.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Café del Roble - Institucional (2500g)',
        slug: 'cafe-del-roble-institucional-2500g',
        description: 'Café de origen de altura. Ideal para negocios o consumo familiar. Finca La Miranda. Presentación de 2.500g.',
        shortDescription: 'Presentación grande de 2.5kg.',
        price: 150000,
        sku: 'ROBLE-2500',
        weight: 2500,
        type: 'GRAIN',
        roastLevel: 'MEDIA',
        origin: 'Finca La Miranda, Toro Valle',
        categoryId: category.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Café del Roble - Muestra (120g)',
        slug: 'cafe-del-roble-muestra-120g',
        description: 'Perfecto para probar nuestro café de origen. Finca La Miranda.',
        shortDescription: 'Presentación pequeña de 120g.',
        price: 15000,
        sku: 'ROBLE-120',
        weight: 120,
        type: 'GRAIN',
        roastLevel: 'MEDIA',
        origin: 'Finca La Miranda, Toro Valle',
        categoryId: category.id,
        isActive: true,
        isFeatured: false,
      }
    ];

    for (const p of productsToCreate) {
      // Check if exists
      const exists = await prisma.product.findUnique({ where: { slug: p.slug } });
      if (!exists) {
        const product = await prisma.product.create({
          data: {
            ...p,
            inventory: { create: { stock: 100 } },
            images: {
              create: {
                url: 'https://res.cloudinary.com/saxpoorp/image/upload/v1/cafe-del-roble/products/placeholder', // We will update this later or user can update
                altText: p.name,
                isPrimary: true
              }
            }
          }
        });
        console.log(`Created product: ${product.name}`);
      } else {
        console.log(`Product already exists: ${p.name}`);
      }
    }

    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
