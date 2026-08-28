import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

function loadEnvFile(filePath: string, overrideKeys: string[] = []) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...valueParts] = trimmed.split('=');
    if (!key || (process.env[key] && !overrideKeys.includes(key))) continue;
    process.env[key] = valueParts.join('=').replace(/^["']|["']$/g, '');
  }
}

loadEnvFile(path.join(process.cwd(), '.env'));
loadEnvFile(path.join(process.cwd(), '.env.vercel'), ['DATABASE_URL', 'DIRECT_URL']);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const dbUrl = process.env.DATABASE_URL ?? '';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `${dbUrl}${dbUrl.includes('?') ? '&' : '?'}connect_timeout=15&pool_timeout=15`,
    },
  },
});
const generatedBaseDir = 'C:/Users/RECURSOS HUMANOS/.codex/generated_images/01a04538-068f-7191-8939-3cb51e3f5773';

const productGalleries = [
  {
    slug: 'cafe-del-roble-muestra-120g',
    name: 'Café del Roble - Muestra (120g)',
    folder: 'cafe-del-roble/products/cafe-del-roble-muestra-120g',
    mainImage: { id: 'seed-image-cafe-del-roble-muestra-120g', url: '/images/products/roble-120g.jpg', altText: 'Café del Roble - Muestra (120g)' },
    additions: [
      { id: 'seed-image-cafe-del-roble-muestra-120g-additional-1', file: 'call_QzYhH5AR21ZlgxLdApuTEFI6.png', publicId: 'contextual', altText: 'Café del Roble - Muestra (120g) en preparación contextual' },
      { id: 'seed-image-cafe-del-roble-muestra-120g-additional-2', file: 'call_mrXgsqNHBOPXMdyP8bckSEur.png', publicId: 'detalle', altText: 'Detalle de empaque y café molido Café del Roble - Muestra (120g)' },
    ],
  },
  {
    slug: 'cafe-del-roble-tostion-media-250g',
    name: 'Café del Roble - Tostión Media (250g)',
    folder: 'cafe-del-roble/products/cafe-del-roble-tostion-media-250g',
    mainImage: { id: 'seed-image-cafe-del-roble-tostion-media-250g', url: '/images/products/roble-250g.jpg', altText: 'Café del Roble - Tostión Media (250g)' },
    additions: [
      { id: 'seed-image-cafe-del-roble-tostion-media-250g-additional-1', file: 'call_GW0TJFiSiGugtJ9ID3YyJRQu.png', publicId: 'contextual', altText: 'Café del Roble - Tostión Media (250g) en cafetería' },
      { id: 'seed-image-cafe-del-roble-tostion-media-250g-additional-2', file: 'call_h6WPqIVZDiJwmHICTvZHSIsQ.png', publicId: 'detalle', altText: 'Detalle de empaque y granos Café del Roble - Tostión Media (250g)' },
    ],
  },
  {
    slug: 'cafe-del-roble-tostion-media-500g',
    name: 'Café del Roble - Tostión Media (500g)',
    folder: 'cafe-del-roble/products/cafe-del-roble-tostion-media-500g',
    mainImage: { id: 'seed-image-cafe-del-roble-tostion-media-500g', url: '/images/products/roble-500g.jpg', altText: 'Café del Roble - Tostión Media (500g)' },
    additions: [
      { id: 'seed-image-cafe-del-roble-tostion-media-500g-additional-1', file: 'call_6hgMWcyJXrpp7EOVG8vdAaEf.png', publicId: 'contextual', altText: 'Café del Roble - Tostión Media (500g) en barra de café' },
      { id: 'seed-image-cafe-del-roble-tostion-media-500g-additional-2', file: 'call_uPzTmiQVuuTNoPmJXUjs5Q9l.png', publicId: 'detalle', altText: 'Detalle de empaque y granos Café del Roble - Tostión Media (500g)' },
    ],
  },
  {
    slug: 'cafe-del-roble-institucional-2500g',
    name: 'Café del Roble - Institucional (2500g)',
    folder: 'cafe-del-roble/products/cafe-del-roble-institucional-2500g',
    mainImage: { id: 'seed-image-cafe-del-roble-institucional-2500g', url: '/images/products/roble-2500g.jpg', altText: 'Café del Roble - Institucional (2500g)' },
    additions: [
      { id: 'seed-image-cafe-del-roble-institucional-2500g-additional-1', file: 'call_5q5I0Zzw7x0F9xR5YVumDFg1.png', publicId: 'contextual', altText: 'Café del Roble - Institucional (2500g) en finca cafetera' },
      { id: 'seed-image-cafe-del-roble-institucional-2500g-additional-2', file: 'call_4nbgt6y4aDpAb2yDsJNlrEWH.png', publicId: 'detalle', altText: 'Detalle de empaque Café del Roble - Institucional (2500g)' },
    ],
  },
];

async function uploadAdditionalImage(fileName: string, folder: string, publicId: string) {
  const filePath = path.join(generatedBaseDir, fileName);
  if (!fs.existsSync(filePath)) throw new Error(`No existe la imagen generada: ${filePath}`);
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
    transformation: { quality: 'auto', fetch_format: 'auto' },
  });
  return { url: result.secure_url, cloudinaryPublicId: result.public_id };
}

async function main() {
  for (const gallery of productGalleries) {
    const product = await prisma.product.findUnique({ where: { slug: gallery.slug } });
    if (!product) throw new Error(`Producto no encontrado: ${gallery.slug}`);
    const expectedImageIds = [gallery.mainImage.id, ...gallery.additions.map((addition) => addition.id)];

    await prisma.productImage.deleteMany({
      where: {
        productId: product.id,
        id: { notIn: expectedImageIds },
      },
    });

    await prisma.productImage.upsert({
      where: { id: gallery.mainImage.id },
      update: { productId: product.id, url: gallery.mainImage.url, altText: gallery.mainImage.altText, sortOrder: 0, isPrimary: true },
      create: { id: gallery.mainImage.id, productId: product.id, url: gallery.mainImage.url, altText: gallery.mainImage.altText, sortOrder: 0, isPrimary: true },
    });

    await prisma.productImage.updateMany({ where: { productId: product.id, id: { not: gallery.mainImage.id } }, data: { isPrimary: false } });

    for (const [index, addition] of gallery.additions.entries()) {
      const uploaded = await uploadAdditionalImage(addition.file, gallery.folder, addition.publicId);
      await prisma.productImage.upsert({
        where: { id: addition.id },
        update: { productId: product.id, url: uploaded.url, altText: addition.altText, sortOrder: index + 1, isPrimary: false, cloudinaryPublicId: uploaded.cloudinaryPublicId },
        create: { id: addition.id, productId: product.id, url: uploaded.url, altText: addition.altText, sortOrder: index + 1, isPrimary: false, cloudinaryPublicId: uploaded.cloudinaryPublicId },
      });
      console.log(`${gallery.name} -> ${addition.publicId}: ${uploaded.url}`);
    }
  }

  const slugs = productGalleries.map((gallery) => gallery.slug);
  const products = await prisma.product.count({ where: { slug: { in: slugs }, deletedAt: null } });
  const images = await prisma.productImage.count({ where: { product: { slug: { in: slugs } } } });
  const primary = await prisma.productImage.count({ where: { isPrimary: true, product: { slug: { in: slugs } } } });
  console.log(JSON.stringify({ products, images, primary, additional: images - primary }, null, 2));
}

async function run() {
  const attempts = 6;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await main();
      return;
    } catch (error: any) {
      const isNetwork = error && (String(error.message || '').includes('Can\'t reach database') || String(error.message || '').includes('connect_timeout') || String(error.message || '').includes('ETIMEDOUT') || String(error.message || '').includes('ECONNREFUSED') || String(error.message || '').includes('pool_timeout'));
      if (attempt === attempts || !isNetwork) throw error;
      console.log(`Intento ${attempt} falló por red/sandbox. Reintentando en ${Math.min(5 * attempt, 30)}s...`);
      await new Promise((resolve) => setTimeout(resolve, Math.min(5 * attempt, 30) * 1000));
    }
  }
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
