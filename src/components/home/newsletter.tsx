'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coffee } from 'lucide-react';

import { toast } from 'sonner';

export function Newsletter() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('¡Gracias por suscribirte!', {
      description: 'Te enviaremos las mejores noticias y promociones exclusivas.',
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section className="relative overflow-hidden bg-coffee-950 py-20">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -right-40 top-0 h-80 w-80 rounded-full bg-primary-500 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-cream-500 blur-3xl" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Coffee className="mx-auto h-10 w-10 text-primary-400" />
          <h2 className="mt-6 font-serif text-3xl font-bold text-white sm:text-4xl">
            Únete a nuestra comunidad
          </h2>
          <p className="mt-4 text-cream-300">
            Recibe ofertas exclusivas, nuevos productos y la historia detrás de cada grano.
          </p>
          
          <form onSubmit={handleSubscribe} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 border-cream-700 bg-coffee-900 text-white placeholder:text-cream-500"
              required
            />
            <Button type="submit" className="bg-primary-600 text-white hover:bg-primary-700">
              Suscribirme
            </Button>
          </form>
          
          <p className="mt-4 text-xs text-cream-500">
            Puedes cancelar en cualquier momento. Sin spam, prometemos.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
