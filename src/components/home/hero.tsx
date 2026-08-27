'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Coffee } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-coffee-950 via-coffee-900 to-primary-950">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary-500 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-cream-500 blur-3xl" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Coffee className="h-5 w-5 text-primary-400" />
              <span className="text-sm font-medium uppercase tracking-widest text-primary-400">
                Pereira, Risaralda
              </span>
            </div>
            
            <h1 className="font-serif text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Café del{' '}
              <span className="text-primary-400">Roble</span>
            </h1>
            
            <p className="mt-6 max-w-xl text-xl text-cream-200">
              El sabor de nuestra tierra.
            </p>
            
            <p className="mt-4 max-w-lg text-base text-cream-300/80">
              Café seleccionado en Pereira, Risaralda. Creado para disfrutar cada momento.
            </p>
            
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-primary-600 text-white hover:bg-primary-700">
                <Link href="/tienda">
                  COMPRAR CAFÉ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-cream-400 text-cream-200 hover:bg-cream-100/10">
                <Link href="/nosotros">
                  CONOCER NUESTRA HISTORIA
                </Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative h-80 w-80 rounded-full bg-gradient-to-br from-primary-500/20 to-cream-500/20 p-8">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-coffee-800/50">
                <Coffee className="h-32 w-32 text-primary-400/60" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L48 52C96 44 192 28 288 22C384 16 480 20 576 28C672 36 768 48 864 50C960 52 1056 44 1152 36C1248 28 1344 20 1392 16L1440 12V60H0Z" fill="#fefcf7" />
        </svg>
      </div>
    </section>
  );
}
