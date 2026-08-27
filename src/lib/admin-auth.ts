import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;

  if (!session) {
    return { session: null, response: NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 }) };
  }

  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    return { session, response: NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 }) };
  }

  return { session, response: null };
}
