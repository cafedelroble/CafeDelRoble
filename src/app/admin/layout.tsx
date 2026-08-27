'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Tag, ShoppingCart, Users, Image, Settings, BarChart3, MessageCircle, CreditCard, Truck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Coffee } from 'lucide-react';
import { useSession } from 'next-auth/react';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: Tag },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/descuentos', label: 'Descuentos', icon: CreditCard },
  { href: '/admin/whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { href: '/admin/pagos', label: 'Pagos', icon: CreditCard },
  { href: '/admin/envios', label: 'Envíos', icon: Truck },
  { href: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userName = session?.user.name || 'Administrador';
  const initials = userName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-coffee-950 text-white transition-transform lg:translate-x-0 lg:static lg:z-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center gap-2 border-b border-coffee-800 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <Coffee className="h-5 w-5" />
          </div>
          <div>
            <p className="font-serif text-sm font-bold">Café del Roble</p>
            <p className="text-[10px] text-coffee-400">Administración</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-60px)]">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary-700 text-white' : 'text-coffee-300 hover:bg-coffee-800 hover:text-white'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-cream-200 bg-white px-4 sm:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="font-serif text-lg font-bold text-coffee-900">Panel de administración</h2>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/" className="text-sm text-secondary-600 hover:text-primary-700">Ver tienda</Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-bold">{initials}</div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
