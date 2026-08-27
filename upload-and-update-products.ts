import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'saxpoorp',
  api_key: process.env.CLOUDINARY_API_KEY || '245254823312841',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'oPIV16-RbLiPvaQvAYbVU5nmNag',
});

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.gfdopehykprtburhkuso:Administrador01@3.139.14.59:6543/postgres?pgbouncer=true"
    }
  }
});

const productsData = [
  {
    slug: 'cafe-del-roble-tostion-media-500g',
    name: 'Café del Roble - Tostión Media (500g)',
    imageFile: 'public/images/products/roble-500g.jpg',
    localUrl: '/images/products/roble-500g.jpg',
  },
  {
    slug: 'cafe-del-roble-tostion-media-250g',
    name: 'Café del Roble - Tostión Media (250g)',
    imageFile: 'public/images/products/roble-250g.jpg',
    localUrl: '/images/products/roble-250g.jpg',
  },
  {
    slug: 'cafe-del-roble-institucional-2500g',
    name: 'Café del Roble - Institucional (2500g)',
    imageFile: 'public/images/products/roble-2500g.jpg',
    localUrl: '/images/products/roble-2500g.jpg',
  },
  {
    slug: 'cafe-del-roble-muestra-120g',
    name: 'Café del Roble - Muestra (120g)',
    imageFile: 'public/images/products/roble-120g.jpg',
    localUrl: '/images/products/roble-120g.jpg',
  },
];

async function main() {
  console.log('Starting Cloudinary upload and DB sync...');

  for (const item of productsData) {
    let finalUrl = item.localUrl;

    try {
      if (fs.existsSync(item.imageFile)) {
        console.log(`Uploading ${item.imageFile} to Cloudinary...`);
        const result = await cloudinary.uploader.upload(item.imageFile, {
          folder: 'cafe-del-roble/products',
          public_id: item.slug,
          overwrite: true,
        });
        finalUrl = result.secure_url;
        console.log(`Uploaded ${item.name} to Cloudinary: ${finalUrl}`);
      }
    } catch (uploadError) {
      console.warn(`Cloudinary upload failed for ${item.name}, using local fallback: ${item.localUrl}`, uploadError);
      finalUrl = item.localUrl;
    }

    const product = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (product) {
      // Delete old image references
      await prisma.productImage.deleteMany({ where: { productId: product.id } });

      // Create new primary image
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: finalUrl,
          altText: item.name,
          isPrimary: true,
          sortOrder: 0,
        },
      });

      console.log(`Updated product in DB: ${item.name} with URL: ${finalUrl}`);
    }
  }

  console.log('Sync completed successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
