'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone } from 'lucide-react';

export default function PerfilPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-coffee-900">Mi perfil</h1>
        <p className="mt-1 text-secondary-600">Actualiza tu información personal.</p>
      </div>

      <div className="rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
        <form className="space-y-5 max-w-2xl">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-coffee-800">Nombre</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                <Input defaultValue="Juan" className="pl-10" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-coffee-800">Apellido</label>
              <Input defaultValue="García" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-coffee-800">Correo electrónico</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
              <Input type="email" defaultValue="juan@email.com" className="pl-10" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-coffee-800">Teléfono</label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
              <Input type="tel" defaultValue="+57 300 123 4567" className="pl-10" />
            </div>
          </div>
          <Button type="submit" size="lg">Guardar cambios</Button>
        </form>
      </div>
    </div>
  );
}
