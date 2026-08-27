import { NextRequest, NextResponse } from "next/server";
import { uploadImage, CLOUDINARY_FOLDERS } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const access = await requireAdmin();
    if (access.response) return access.response;

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder =
      (formData.get("folder") as string) || CLOUDINARY_FOLDERS.PRODUCTS;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó archivo" },
        { status: 400 }
      );
    }

    const allowedFolders = Object.values(CLOUDINARY_FOLDERS);
    if (!allowedFolders.includes(folder as (typeof allowedFolders)[number])) {
      return NextResponse.json({ error: "Carpeta de destino no permitida" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen no puede superar 5 MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await uploadImage(base64, folder);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Error al subir imagen" },
      { status: 500 }
    );
  }
}
