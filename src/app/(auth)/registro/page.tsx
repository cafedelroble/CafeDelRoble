'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coffee, User, Mail, Lock, Phone } from 'lucide-react';

export default function RegistroPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-cream-50 px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 text-white">
              <Coffee className="h-6 w-6" />
            </div>
            <span className="font-serif text-xl font-bold text-coffee-900">Café del Roble</span>
          </Link>
          <h1 className="mt-6 font-serif text-3xl font-bold text-coffee-900">Crear cuenta</h1>
          <p className="mt-2 text-sm text-secondary-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-primary-700 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-coffee-800">Nombre</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                <Input placeholder="Juan" className="pl-10" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-coffee-800">Apellido</label>
              <Input placeholder="García" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-coffee-800">Correo electrónico</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
              <Input type="email" placeholder="tu@email.com" className="pl-10" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-coffee-800">Teléfono</label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
              <Input type="tel" placeholder="+57 300 123 4567" className="pl-10" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-coffee-800">Contraseña</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
              <Input type="password" placeholder="••••••••" className="pl-10" required />
            </div>
            <p className="mt-1 text-xs text-secondary-500">
              Mínimo 8 caracteres con letras y números
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-coffee-800">Confirmar contraseña</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
              <Input type="password" placeholder="••••••••" className="pl-10" required />
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-secondary-600">
            <input type="checkbox" className="mt-0.5 rounded border-cream-300" required />
            <span>
              Acepto los{' '}
              <Link href="/terminos" className="font-medium text-primary-700 hover:underline">
                términos y condiciones
              </Link>{' '}
              y la{' '}
              <Link href="/privacidad" className="font-medium text-primary-700 hover:underline">
                política de privacidad
              </Link>
            </span>
          </label>

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
