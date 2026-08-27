import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const CLOUDINARY_FOLDERS = {
  PRODUCTS: "cafe-del-roble/products",
  BANNERS: "cafe-del-roble/banners",
  AVATARS: "cafe-del-roble/avatars",
  CMS: "cafe-del-roble/cms",
} as const;

export async function uploadImage(
  file: string,
  folder: string,
  options?: { public_id?: string; transformation?: string }
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    public_id: options?.public_id,
    transformation: options?.transformation
      ? undefined
      : { quality: "auto", fetch_format: "auto" },
    resource_type: "auto",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export async function renameImage(
  publicId: string,
  newPublicId: string
): Promise<void> {
  await cloudinary.uploader.rename(publicId, newPublicId);
}

export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    crop?: string;
  }
): string {
  const transformation: Record<string, unknown>[] = [];

  if (options?.width || options?.height) {
    transformation.push({
      width: options.width,
      height: options.height,
      crop: options.crop || "fill",
    });
  }

  if (options?.quality) {
    transformation.push({ quality: options.quality });
  }

  if (options?.format) {
    transformation.push({ fetch_format: options.format });
  }

  return cloudinary.url(publicId, {
    transformation: transformation.length > 0 ? transformation : undefined,
    secure: true,
  });
}

export default cloudinary;
