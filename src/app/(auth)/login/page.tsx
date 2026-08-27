'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, Coffee, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Correo o contraseña incorrectos');
        return;
      }

      const session = await getSession();
      const callbackUrl = searchParams.get('callbackUrl');
      const destination = callbackUrl || (session?.user.role === 'ADMIN' || session?.user.role === 'SUPER_ADMIN' ? '/admin' : '/cuenta');
      router.push(destination);
      router.refresh();
    } catch {
      setError('No fue posible iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-cream-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 text-white">
              <Coffee className="h-6 w-6" />
            </div>
            <span className="font-serif text-xl font-bold text-coffee-900">Café del Roble</span>
          </Link>
          <h1 className="mt-6 font-serif text-3xl font-bold text-coffee-900">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-secondary-600">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="font-medium text-primary-700 hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-coffee-800">Correo electrónico</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
              <Input
                type="email"
                placeholder="tu@email.com"
                className="pl-10"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-coffee-800">Contraseña</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-secondary-600">
              <input type="checkbox" className="rounded border-cream-300" />
              Recordarme
            </label>
            <Link href="/recuperar-password" className="text-sm font-medium text-primary-700 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-cream-50 px-3 text-xs text-secondary-500">
              o continua con
            </span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button variant="outline" size="lg">
              Google
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/checkout?guest=1">
                Comprar como invitado
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center bg-cream-50">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
