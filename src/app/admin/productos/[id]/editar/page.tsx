'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductImagesField, type ProductImageInput } from '@/components/admin/product-images-field';
import { toast } from 'sonner';

type Product = {
  name: string;
  slug: string;
  sku: string;
  price: number;
  shortDescription: string | null;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImageInput[];
};

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`, { cache: 'no-store' }).then(async (response) => {
      const data = await response.json();
      if (response.ok) setProduct(data.product);
      else {
        const msg = data.error || 'No se pudo cargar el producto';
        setError(msg);
        toast.error(msg);
      }
    }).catch(() => {
      setError('No se pudo cargar el producto');
      toast.error('No se pudo cargar el producto');
    });
  }, [params.id]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!product) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (!response.ok) {
        const msg = data.error || 'No se pudo actualizar el producto';
        setError(msg);
        toast.error(msg);
      } else {
        toast.success(`Producto "${product.name}" actualizado correctamente`);
        router.push('/admin/productos');
        router.refresh();
      }
    } catch {
      toast.error('Error al intentar guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!product) return <p className="text-secondary-500">Cargando producto...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-coffee-900">Editar producto</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/productos">Cancelar</Link>
        </Button>
      </div>

      <form onSubmit={save} className="space-y-4 rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
        <label className="block space-y-1 text-sm font-medium">
          Nombre
          <Input value={product.name} onChange={(event) => setProduct({ ...product, name: event.target.value })} required />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          Slug
          <Input value={product.slug} onChange={(event) => setProduct({ ...product, slug: event.target.value })} required />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          SKU
          <Input value={product.sku} onChange={(event) => setProduct({ ...product, sku: event.target.value })} required />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          Precio
          <Input type="number" min="1" value={product.price} onChange={(event) => setProduct({ ...product, price: Number(event.target.value) })} required />
        </label>
        <label className="block space-y-1 text-sm font-medium">
          Descripción corta
          <Input value={product.shortDescription || ''} onChange={(event) => setProduct({ ...product, shortDescription: event.target.value })} />
        </label>
        <label className="flex gap-2 text-sm">
          <input type="checkbox" checked={product.isActive} onChange={(event) => setProduct({ ...product, isActive: event.target.checked })} /> Activo
        </label>

        <ProductImagesField value={product.images || []} onChange={(images) => setProduct({ ...product, images })} disabled={saving} />

        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</Button>
      </form>
    </div>
  );
}
