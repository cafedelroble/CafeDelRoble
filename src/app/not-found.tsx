import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Coffee } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Coffee className="h-20 w-20 text-primary-300" />
      <h1 className="mt-8 font-serif text-6xl font-bold text-coffee-900">404</h1>
      <p className="mt-4 text-xl text-secondary-600">
        Parece que este café tomó otro camino.
      </p>
      <p className="mt-2 text-sm text-secondary-500">
        La página que buscas no existe o fue movida.
      </p>
      <Button size="lg" asChild className="mt-8">
        <Link href="/tienda">Volver a la tienda</Link>
      </Button>
    </div>
  );
}
