import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/mailer';

const TOKEN_LIFETIME_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Correo electrónico inválido' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.password) {
      const token = randomBytes(32).toString('hex');
      await prisma.$transaction([
        prisma.verificationToken.deleteMany({ where: { identifier: email } }),
        prisma.verificationToken.create({
          data: { identifier: email, token, expires: new Date(Date.now() + TOKEN_LIFETIME_MS) },
        }),
      ]);
      const result = await sendPasswordResetEmail({ to: email, name: user.name || email, token });
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          message: 'Si existe una cuenta con este correo, recibirás las instrucciones.',
          devUrl: result.url,
        });
      }
    }

    return NextResponse.json({ message: 'Si existe una cuenta con este correo, recibirás las instrucciones.' });
  } catch (error) {
    console.error('Error en forgot-password:', error);
    return NextResponse.json({ error: 'No se pudo procesar la solicitud' }, { status: 500 });
  }
}