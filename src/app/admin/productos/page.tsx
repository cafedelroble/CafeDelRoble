'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  isActive: boolean;
  category: { name: string };
  images: { url: string; altText: string | null }[];
  inventory: { stock: number }[];
};

export default function AdminProductosPage() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/admin/products', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudieron cargar los productos');
      setProducts(data.products);
    } catch (loadError) {
      const msg = loadError instanceof Error ? loadError.message : 'No se pudieron cargar los productos';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadProducts(); }, []);

  const toggleProduct = async (product: Product) => {
    const nextState = !product.isActive;
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextState }),
      });
      if (response.ok) {
        toast.success(nextState ? `"${product.name}" activado` : `"${product.name}" desactivado`);
        void loadProducts();
      } else {
        toast.error('No se pudo cambiar el estado del producto');
      }
    } catch {
      toast.error('Error de conexión al actualizar el producto');
    }
  };

  const deleteProduct = (product: Product) => {
    toast(`¿Desactivar "${product.name}"?`, {
      description: 'El producto dejará de ser visible en la tienda.',
      action: {
        label: 'Confirmar',
        onClick: async () => {
          try {
            const response = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
            if (response.ok) {
              toast.success(`"${product.name}" eliminado correctamente`);
              void loadProducts();
            } else {
              toast.error('No se pudo eliminar el producto');
            }
          } catch {
            toast.error('Error al intentar eliminar el producto');
          }
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {},
      },
    });
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-coffee-900">Productos</h1>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
        <input
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-cream-300 bg-white pl-10 pr-3 py-2 text-sm text-coffee-900"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="rounded-xl border border-cream-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cream-200">
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Producto</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">SKU</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Precio</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Stock</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Estado</th>
              <th className="p-4 text-left text-xs font-medium text-secondary-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-secondary-500">Cargando productos...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-secondary-500">No se encontraron productos</td></tr>
            ) : filtered.map((product) => (
              <tr key={product.id} className="hover:bg-cream-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].altText || product.name}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <p className="font-medium text-coffee-900">{product.name}</p>
                  </div>
                  <p className="text-xs text-secondary-500">{product.category.name}</p>
                </td>
                <td className="p-4 text-sm text-secondary-600">{product.sku}</td>
                <td className="p-4 text-sm font-medium text-coffee-900">{formatPrice(product.price)}</td>
                <td className="p-4">
                  <span className={`text-sm font-medium ${product.inventory.reduce((stock, item) => stock + item.stock, 0) === 0 ? 'text-red-500' : product.inventory.reduce((stock, item) => stock + item.stock, 0) < 10 ? 'text-cream-600' : 'text-coffee-900'}`}>
                    {product.inventory.reduce((stock, item) => stock + item.stock, 0)}
                  </span>
                </td>
                <td className="p-4">
                  <Badge variant={product.isActive ? 'success' : 'secondary'}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/admin/productos/${product.id}/editar`} aria-label="Editar producto">
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => void toggleProduct(product)}
                      aria-label={product.isActive ? 'Desactivar producto' : 'Activar producto'}
                    >
                      <span className="text-xs font-semibold">{product.isActive ? 'ON' : 'OFF'}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-red-700"
                      onClick={() => deleteProduct(product)}
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
