'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { productSchema } from '@/lib/validations/auth';
import { ProductImagesField, type ProductImageInput } from '@/components/admin/product-images-field';

import { toast } from 'sonner';

type Category = { id: string; name: string };

const initialForm = {
  name: '', slug: '', description: '', shortDescription: '', categoryId: '', price: '', sku: '', weight: '',
  presentation: '', type: 'GRAIN', roastLevel: 'MEDIA', origin: '', tastingNotes: '', isActive: true, isFeatured: false,
  images: [] as ProductImageInput[],
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/categories').then(async (response) => {
      const data = await response.json();
      if (response.ok) setCategories(data.categories);
      else {
        const msg = data.error || 'No se pudieron cargar las categorías';
        setError(msg);
        toast.error(msg);
      }
    }).catch(() => {
      setError('No se pudieron cargar las categorías');
      toast.error('No se pudieron cargar las categorías');
    });
  }, []);

  const update = (key: keyof typeof initialForm, value: string | boolean | ProductImageInput[]) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      weight: form.weight ? Number(form.weight) : undefined,
      tastingNotes: form.tastingNotes.split(',').map((note) => note.trim()).filter(Boolean),
    };
    const parsed = productSchema.safeParse(payload);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Revisa los datos del producto';
      setError(msg);
      toast.error(msg);
      setSaving(false);
      return;
    }
    try {
      const response = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...parsed.data, images: form.images }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo crear el producto');
      toast.success(`Producto "${form.name}" creado exitosamente`);
      router.push('/admin/productos');
      router.refresh();
    } catch (saveError) {
      const msg = saveError instanceof Error ? saveError.message : 'No se pudo crear el producto';
      setError(msg);
      toast.error(msg);
      setSaving(false);
    }
  };

  return <div className="mx-auto max-w-3xl space-y-6">
    <div className="flex items-center justify-between"><h1 className="font-serif text-3xl font-bold text-coffee-900">Nuevo producto</h1><Button variant="outline" asChild><Link href="/admin/productos">Cancelar</Link></Button></div>
    <form onSubmit={submit} className="space-y-5 rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium">Nombre<Input value={form.name} onChange={(e) => update('name', e.target.value)} required /></label>
        <label className="space-y-1 text-sm font-medium">Slug<Input value={form.slug} onChange={(e) => update('slug', e.target.value)} required /></label>
        <label className="space-y-1 text-sm font-medium">SKU<Input value={form.sku} onChange={(e) => update('sku', e.target.value)} required /></label>
        <label className="space-y-1 text-sm font-medium">Precio<Input type="number" min="1" value={form.price} onChange={(e) => update('price', e.target.value)} required /></label>
        <label className="space-y-1 text-sm font-medium">Categoría<select className="h-10 w-full rounded-md border border-cream-300 px-3" value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)} required><option value="">Selecciona una categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className="space-y-1 text-sm font-medium">Peso (g)<Input type="number" min="1" value={form.weight} onChange={(e) => update('weight', e.target.value)} /></label>
        <label className="space-y-1 text-sm font-medium">Tipo<select className="h-10 w-full rounded-md border border-cream-300 px-3" value={form.type} onChange={(e) => update('type', e.target.value)}><option value="GRAIN">Grano</option><option value="MOLIDO">Molido</option></select></label>
        <label className="space-y-1 text-sm font-medium">Tueste<select className="h-10 w-full rounded-md border border-cream-300 px-3" value={form.roastLevel} onChange={(e) => update('roastLevel', e.target.value)}><option value="CLARA">Claro</option><option value="MEDIA">Medio</option><option value="OSCURA">Oscuro</option></select></label>
      </div>
      <label className="block space-y-1 text-sm font-medium">Descripción corta<Input value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} /></label>
      <label className="block space-y-1 text-sm font-medium">Descripción<textarea className="min-h-28 w-full rounded-md border border-cream-300 p-3" value={form.description} onChange={(e) => update('description', e.target.value)} /></label>
      <label className="block space-y-1 text-sm font-medium">Origen<Input value={form.origin} onChange={(e) => update('origin', e.target.value)} /></label>
      <label className="block space-y-1 text-sm font-medium">Notas de cata <span className="font-normal text-secondary-500">(separadas por coma)</span><Input value={form.tastingNotes} onChange={(e) => update('tastingNotes', e.target.value)} /></label>
      <ProductImagesField value={form.images} onChange={(images) => update('images', images)} disabled={saving} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3"><Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Crear producto'}</Button></div>
    </form>
  </div>;
}
