'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

type Banner = { id: string; title: string; image: string; position: string; isActive: boolean };

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const load = async () => { const response = await fetch('/api/admin/banners', { cache: 'no-store' }); const data = await response.json(); if (response.ok) setBanners(data.banners); else setError(data.error || 'No se pudieron cargar los banners'); };
  useEffect(() => { void load(); }, []);
  const create = async (event: React.FormEvent) => { event.preventDefault(); const response = await fetch('/api/admin/banners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, image }) }); const data = await response.json(); if (!response.ok) setError(data.error || 'No se pudo crear el banner'); else { setTitle(''); setImage(''); void load(); } };
  const toggle = async (banner: Banner) => { await fetch(`/api/admin/banners/${banner.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !banner.isActive }) }); void load(); };
  const deactivate = async (banner: Banner) => { await fetch(`/api/admin/banners/${banner.id}`, { method: 'DELETE' }); void load(); };
  return <div className="space-y-6"><h1 className="font-serif text-3xl font-bold text-coffee-900">Banners</h1><form onSubmit={create} className="flex flex-wrap gap-3 rounded-xl border border-cream-200 bg-white p-4"><input className="rounded-md border border-cream-300 px-3 py-2" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required /><input className="min-w-80 rounded-md border border-cream-300 px-3 py-2" placeholder="URL de imagen local o Cloudinary" value={image} onChange={(e) => setImage(e.target.value)} required /><Button type="submit">Crear banner</Button></form>{error && <p className="text-sm text-red-600">{error}</p>}<div className="rounded-xl border border-cream-200 bg-white p-4">{banners.length === 0 ? <p className="text-secondary-600">No hay banners registrados.</p> : banners.map((banner) => <div key={banner.id} className="flex items-center justify-between border-b border-cream-200 p-3"><div><p className="font-medium">{banner.title}</p><p className="text-sm text-secondary-600">{banner.position} · {banner.isActive ? 'Activo' : 'Inactivo'} · {banner.image}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => void toggle(banner)}>{banner.isActive ? 'Desactivar' : 'Activar'}</Button><Button variant="ghost" size="icon" onClick={() => void deactivate(banner)} aria-label="Desactivar banner"><Trash2 className="h-4 w-4" /></Button></div></div>)}</div></div>;
}
