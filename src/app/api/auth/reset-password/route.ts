import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || '';
  if (!token) return NextResponse.json({ valid: false, error: 'Falta el token de recuperación' }, { status: 400 });
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record) return NextResponse.json({ valid: false, error: 'El enlace no es válido o ya fue utilizado' }, { status: 400 });
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.json({ valid: false, error: 'El enlace ha expirado. Solicita uno nuevo.' }, { status: 400 });
  }
  return NextResponse.json({ valid: true });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body.token === 'string' ? body.token : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!token) return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });

    const record = await prisma.verificationToken.findUnique({ where: { token } });
    if (!record) return NextResponse.json({ error: 'El enlace no es válido o ya fue utilizado' }, { status: 400 });
    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json({ error: 'El enlace ha expirado. Solicita uno nuevo.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: record.identifier } });
    if (!user) return NextResponse.json({ error: 'No existe una cuenta asociada a este enlace' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } }),
      prisma.verificationToken.delete({ where: { token } }),
    ]);

    return NextResponse.json({ success: true, message: 'Contraseña actualizada. Ya puedes iniciar sesión.' });
  } catch (error) {
    console.error('Error en reset-password:', error);
    return NextResponse.json({ error: 'No se pudo restablecer la contraseña' }, { status: 500 });
  }
}