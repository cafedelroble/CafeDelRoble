import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const publicRoutes = [
  '/',
  '/nosotros',
  '/tienda',
  '/productos',
  '/categorias',
  '/comparar',
  '/contacto',
  '/seguimiento',
  '/carrito',
  '/checkout',
];

const authRoutes = ['/login', '/iniciar-sesion', '/registro', '/recuperar-password', '/restablecer-password'];
const adminRoutes = ['/admin'];
const accountRoutes = ['/cuenta'];

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith('/productos/') || pathname.startsWith('/categorias/'))) {
    return NextResponse.next();
  }

  // Allow auth routes (redirect to dashboard if logged in)
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (session) {
      return NextResponse.redirect(new URL('/cuenta', req.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    const userRole = (session.user as { role?: string })?.role;
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/cuenta', req.url));
    }
    return NextResponse.next();
  }

  // Protect account routes
  if (accountRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
