import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return NextResponse.json({ error: "Ya existe una cuenta con este correo" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    await prisma.user.create({
      data: {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: "CLIENTE",
      },
    });

    return NextResponse.json({ success: true, message: "Cuenta creada correctamente" });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Error al crear la cuenta" }, { status: 500 });
  }
}
