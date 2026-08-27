import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default async function AdminNotFound() {
  const session = await auth();
  const isAdmin = session?.user.role === 'ADMIN' || session?.user.role === 'SUPER_ADMIN';

  return <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    <p className="text-sm font-medium uppercase tracking-widest text-primary-700">404</p>
    <h1 className="font-serif text-3xl font-bold text-coffee-900">Ruta administrativa no encontrada</h1>
    <p className="max-w-md text-secondary-600">La sección que buscas no existe dentro del panel.</p>
    <Button asChild><Link href={isAdmin ? '/admin' : '/login'}>{isAdmin ? 'Volver al dashboard' : 'Iniciar sesión'}</Link></Button>
  </div>;
}
