'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Discount = { id: string; code: string; type: string; scope: string; value: number; isActive: boolean; isAutomatic: boolean };

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [form, setForm] = useState({ code: '', type: 'PORCENTAJE', value: '', scope: 'CARRITO' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const response = await fetch('/api/admin/discounts', { cache: 'no-store' });
      const data = await response.json();
      if (response.ok) setDiscounts(data.discounts.map((item: Discount) => ({ ...item, value: Number(item.value) })));
      else {
        setError(data.error || 'No se pudieron cargar los descuentos');
        toast.error(data.error || 'No se pudieron cargar los descuentos');
      }
    } catch {
      toast.error('Error al cargar descuentos');
    }
  };

  useEffect(() => { void load(); }, []);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          code: form.code.toUpperCase(),
          value: Number(form.value),
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 31536000000).toISOString(),
          applicableCategories: [],
          applicableProducts: [],
          isActive: true,
          isAutomatic: false,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'No se pudo crear el descuento');
        toast.error(data.error || 'No se pudo crear el descuento');
      } else {
        toast.success(`Cupón "${form.code.toUpperCase()}" creado exitosamente`);
        setForm({ ...form, code: '', value: '' });
        void load();
      }
    } catch {
      toast.error('Error al crear descuento');
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (discount: Discount) => {
    try {
      const nextState = !discount.isActive;
      const res = await fetch(`/api/admin/discounts/${discount.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextState }),
      });
      if (res.ok) {
        toast.success(nextState ? `Cupón "${discount.code}" activado` : `Cupón "${discount.code}" desactivado`);
        void load();
      } else {
        toast.error('No se pudo actualizar el cupón');
      }
    } catch {
      toast.error('Error de conexión');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold text-coffee-900">Descuentos y Cupones</h1>
      <form onSubmit={create} className="flex flex-wrap gap-3 rounded-xl border border-cream-200 bg-white p-4 shadow-sm">
        <input
          className="rounded-md border border-cream-300 px-3 py-2 text-sm text-coffee-900 uppercase"
          placeholder="Código (ej. PROMO10)"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
        <select
          className="rounded-md border border-cream-300 px-3 py-2 text-sm text-coffee-900"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="PORCENTAJE">Porcentaje (%)</option>
          <option value="VALOR_FIJO">Valor fijo ($)</option>
        </select>
        <input
          className="w-28 rounded-md border border-cream-300 px-3 py-2 text-sm text-coffee-900"
          type="number"
          min="1"
          placeholder="Valor"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          required
        />
        <select
          className="rounded-md border border-cream-300 px-3 py-2 text-sm text-coffee-900"
          value={form.scope}
          onChange={(e) => setForm({ ...form, scope: e.target.value })}
        >
          <option value="CARRITO">Todo el carrito</option>
          <option value="PRODUCTOS">Productos específicos</option>
          <option value="CATEGORIAS">Categorías específicas</option>
        </select>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear descuento'}
        </Button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="rounded-xl border border-cream-200 bg-white p-4 shadow-sm">
        {discounts.length === 0 ? (
          <p className="text-secondary-600 text-sm">No hay descuentos registrados.</p>
        ) : (
          discounts.map((discount) => (
            <div key={discount.id} className="flex items-center justify-between border-b border-cream-200 p-3 last:border-0 hover:bg-cream-50 transition-colors">
              <div>
                <span className="font-semibold text-coffee-900">{discount.code}</span>
                <span className="text-xs text-secondary-500 ml-2">
                  {discount.scope} · {discount.type === 'PORCENTAJE' ? `${discount.value}%` : `$${discount.value.toLocaleString('es-CO')}`}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => void toggle(discount)}>
                {discount.isActive ? 'Desactivar' : 'Activar'}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
