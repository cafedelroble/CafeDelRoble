'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type Banner = { id: string; title: string; image: string; position: string; isActive: boolean };

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const response = await fetch('/api/admin/banners', { cache: 'no-store' });
      const data = await response.json();
      if (response.ok) setBanners(data.banners);
      else {
        setError(data.error || 'No se pudieron cargar los banners');
        toast.error(data.error || 'No se pudieron cargar los banners');
      }
    } catch {
      toast.error('Error al cargar banners');
    }
  };

  useEffect(() => { void load(); }, []);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, image }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'No se pudo crear el banner');
        toast.error(data.error || 'No se pudo crear el banner');
      } else {
        toast.success(`Banner "${title}" creado exitosamente`);
        setTitle('');
        setImage('');
        void load();
      }
    } catch {
      toast.error('Error al crear el banner');
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (banner: Banner) => {
    try {
      const nextState = !banner.isActive;
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextState }),
      });
      if (res.ok) {
        toast.success(nextState ? `Banner activado` : `Banner desactivado`);
        void load();
      } else {
        toast.error('No se pudo actualizar el estado del banner');
      }
    } catch {
      toast.error('Error de conexión');
    }
  };

  const deactivate = (banner: Banner) => {
    toast(`¿Eliminar banner "${banner.title}"?`, {
      action: {
        label: 'Confirmar',
        onClick: async () => {
          try {
            const res = await fetch(`/api/admin/banners/${banner.id}`, { method: 'DELETE' });
            if (res.ok) {
              toast.success('Banner eliminado correctamente');
              void load();
            } else {
              toast.error('No se pudo eliminar el banner');
            }
          } catch {
            toast.error('Error al eliminar banner');
          }
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {},
      },
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold text-coffee-900">Banners</h1>
      <form onSubmit={create} className="flex flex-wrap gap-3 rounded-xl border border-cream-200 bg-white p-4 shadow-sm">
        <input
          className="rounded-md border border-cream-300 px-3 py-2 text-sm text-coffee-900"
          placeholder="Título del banner"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="min-w-80 flex-1 rounded-md border border-cream-300 px-3 py-2 text-sm text-coffee-900"
          placeholder="URL de imagen local o Cloudinary"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear banner'}
        </Button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="rounded-xl border border-cream-200 bg-white p-4 shadow-sm">
        {banners.length === 0 ? (
          <p className="text-secondary-600 text-sm">No hay banners registrados.</p>
        ) : (
          banners.map((banner) => (
            <div key={banner.id} className="flex items-center justify-between border-b border-cream-200 p-3 last:border-0 hover:bg-cream-50 transition-colors">
              <div>
                <p className="font-medium text-coffee-900">{banner.title}</p>
                <p className="text-xs text-secondary-500">
                  {banner.position} · {banner.isActive ? 'Activo' : 'Inactivo'} · {banner.image}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => void toggle(banner)}>
                  {banner.isActive ? 'Desactivar' : 'Activar'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deactivate(banner)} aria-label="Desactivar banner">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
