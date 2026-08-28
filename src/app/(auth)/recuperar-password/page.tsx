'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coffee, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const IS_DEV = process.env.NODE_ENV === 'development';

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [devUrl, setDevUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setSent(true);
        if (data.devUrl) setDevUrl(data.devUrl);
      } else {
        setError(data.error || 'No se pudo procesar la solicitud');
        toast.error(data.error || 'No se pudo procesar la solicitud');
      }
    } catch {
      const msg = 'Error de conexión. Intenta nuevamente.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="mt-6 font-serif text-3xl font-bold text-coffee-900">
            {sent ? 'Correo enviado' : 'Recuperar contraseña'}
          </h1>
          <p className="mt-2 text-sm text-secondary-600">
            {sent
              ? 'Revisa tu correo electrónico para restablecer tu contraseña.'
              : 'Ingresa tu correo y te enviaremos las instrucciones.'}
          </p>
        </div>

        {sent ? (
          <div className="mt-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-nature-500" />
            <p className="mt-4 text-secondary-600">
              Si existe una cuenta con <strong>{email}</strong>, recibirás un correo con las instrucciones.
            </p>
            {IS_DEV && devUrl && (
              <p className="mt-4 rounded-lg border border-cream-200 bg-white p-3 text-xs text-secondary-600">
                Enlace de desarrollo: <a href={devUrl} className="font-medium text-primary-700 hover:underline">{devUrl}</a>
              </p>
            )}
            <Button asChild className="mt-8">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesión
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-coffee-800">Correo electrónico</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
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