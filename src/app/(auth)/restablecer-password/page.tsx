'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coffee, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, KeyRound } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [state, setState] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateToken = useCallback(async () => {
    if (!token) {
      setState('invalid');
      setError('Falta el token de recuperación. Revisa el enlace de tu correo.');
      return;
    }
    try {
      const response = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`);
      const data = await response.json();
      if (data.valid) {
        setState('valid');
      } else {
        setState('invalid');
        setError(data.error || 'El enlace no es válido o ya fue utilizado.');
      }
    } catch {
      setState('invalid');
      setError('No se pudo validar el enlace. Intenta nuevamente.');
    }
  }, [token]);

  useEffect(() => {
    void validateToken();
  }, [validateToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Contraseña actualizada. Ya puedes iniciar sesión.');
        router.push('/login');
        router.refresh();
      } else {
        setError(data.error || 'No se pudo restablecer la contraseña');
      }
    } catch {
      setError('Error de conexión. Intenta nuevamente.');
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
          <h1 className="mt-6 font-serif text-3xl font-bold text-coffee-900">Restablecer contraseña</h1>
          <p className="mt-2 text-sm text-secondary-600">
            {state === 'valid' ? 'Ingresa tu nueva contraseña.' : 'Valida tu enlace de recuperación.'}
          </p>
        </div>

        {state === 'loading' && (
          <div className="mt-8 flex flex-col items-center gap-3 text-secondary-500">
            <KeyRound className="h-8 w-8 animate-pulse" />
            <p className="text-sm">Validando enlace...</p>
          </div>
        )}

        {state === 'invalid' && (
          <div className="mt-8 space-y-4 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
            <Button asChild variant="outline">
              <Link href="/recuperar-password">Solicitar un nuevo enlace</Link>
            </Button>
          </div>
        )}

        {state === 'valid' && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-coffee-800">Nueva contraseña</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  className="pl-10 pr-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
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

            <div>
              <label className="text-sm font-medium text-coffee-800">Confirmar contraseña</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  className="pl-10"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  required
                  minLength={8}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Restablecer contraseña'}
            </Button>

            <Button variant="ghost" className="w-full" asChild>
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesión
              </Link>
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function RestablecerPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center bg-cream-50">Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}