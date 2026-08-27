'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Plus, Edit, Trash2, Star } from 'lucide-react';

const addresses = [
  { id: '1', name: 'Casa', recipient: 'Juan García', address: 'Cra 15 #10-25', city: 'Pereira', department: 'Risaralda', phone: '+57 300 123 4567', isDefault: true },
  { id: '2', name: 'Oficina', recipient: 'Juan García', address: 'Cra 7 #4-80 Of 301', city: 'Pereira', department: 'Risaralda', phone: '+57 300 123 4567', isDefault: false },
];

export default function DireccionesPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-coffee-900">Direcciones</h1>
          <p className="mt-1 text-secondary-600">Gestiona tus direcciones de envío.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva dirección
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-coffee-900">Nueva dirección</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 max-w-2xl">
            <Input placeholder="Nombre de la dirección" />
            <Input placeholder="Nombre del destinatario" />
            <Input placeholder="Dirección completa" className="sm:col-span-2" />
            <Input placeholder="Ciudad" />
            <Input placeholder="Departamento" />
            <Input placeholder="Teléfono" />
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-cream-300" />
              <span className="text-sm text-secondary-600">Establecer como principal</span>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button>Guardar</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <div key={addr.id} className={`rounded-xl border bg-white p-5 shadow-sm ${addr.isDefault ? 'border-primary-300' : 'border-cream-200'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                <span className="font-serif font-semibold text-coffee-900">{addr.name}</span>
                {addr.isDefault && (
                  <span className="flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                    <Star className="h-3 w-3" /> Principal
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-secondary-600">{addr.recipient}</p>
            <p className="text-sm text-secondary-600">{addr.address}</p>
            <p className="text-sm text-secondary-600">{addr.city}, {addr.department}</p>
            <p className="text-sm text-secondary-600">{addr.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
