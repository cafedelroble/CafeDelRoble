'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Category = { id: string; name: string; slug: string; description: string | null; isActive: boolean; _count?: { products: number } };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const response = await fetch('/api/admin/categories', { cache: 'no-store' });
    const data = await response.json();
    if (response.ok) setCategories(data.categories);
    else setError(data.error || 'No se pudieron cargar las categorías');
  };

  useEffect(() => { void load(); }, []);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, description }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || 'No se pudo crear la categoría'); return; }
    setName(''); setDescription(''); void load();
  };

  return <div className="space-y-6">
    <h1 className="font-serif text-3xl font-bold text-coffee-900">Categorías</h1>
    <form onSubmit={create} className="flex flex-wrap gap-3 rounded-xl border border-cream-200 bg-white p-4 shadow-sm">
      <input className="rounded-md border border-cream-300 px-3 py-2" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
      <input className="rounded-md border border-cream-300 px-3 py-2" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Button type="submit">Crear categoría</Button>
    </form>
    {error && <p className="text-sm text-red-600">{error}</p>}
    <div className="rounded-xl border border-cream-200 bg-white shadow-sm"><div className="divide-y divide-cream-200">{categories.map((category) => <div key={category.id} className="flex items-center justify-between p-4"><div><p className="font-medium text-coffee-900">{category.name}</p><p className="text-sm text-secondary-500">{category.description || category.slug}</p></div><span className="text-sm text-secondary-500">{category.isActive ? 'Activa' : 'Inactiva'}</span></div>)}</div></div>
  </div>;
}
