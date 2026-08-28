'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { User, Package, MapPin, Heart, Shield, LogOut, LayoutDashboard, Menu, X, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';

const sidebarLinks = [
  { href: '/cuenta', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cuenta/perfil', label: 'Perfil', icon: User },
  { href: '/cuenta/pedidos', label: 'Mis pedidos', icon: Package },
  { href: '/cuenta/direcciones', label: 'Direcciones', icon: MapPin },
  { href: '/cuenta/favoritos', label: 'Favoritos', icon: Heart },
  { href: '/cuenta/seguridad', label: 'Seguridad', icon: Shield },
];

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const userName = session?.user.name || 'Cliente';
  const userEmail = session?.user.email || '';
  const initials = userName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  const handleSignOut = () => {
    toast.success('Sesión cerrada correctamente');
    void signOut({ callbackUrl: '/login' });
  };

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 border-b border-cream-200 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-serif font-bold text-lg">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-serif font-semibold text-coffee-900">{userName}</p>
          <p className="truncate text-xs text-secondary-500">{userEmail}</p>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden" aria-label="Cerrar menú">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-secondary-600 hover:bg-cream-100 hover:text-coffee-900'
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
        <div className="space-y-1 border-t border-cream-200 pt-3 mt-3">
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-600 transition-colors hover:bg-cream-100 hover:text-primary-700"
          >
            <Store className="h-4 w-4" />
            Volver a la tienda
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-600 transition-colors hover:bg-cream-100 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </nav>
    </>
  );

  return (
    <div className="min-h-[85vh] bg-cream-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-cream-200 bg-white transition-transform lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-10">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 -mx-4 mb-4 flex h-14 items-center gap-3 border-b border-cream-200 bg-white/95 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Abrir menú" className="text-coffee-900">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="font-serif text-base font-bold text-coffee-900">Mi cuenta</h2>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {initials}
            </div>
            <button
              onClick={handleSignOut}
              aria-label="Cerrar sesión"
              className="rounded-lg p-1.5 text-secondary-500 transition-colors hover:bg-cream-100 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden h-fit lg:sticky lg:top-6 lg:block">
            <div className="overflow-hidden rounded-xl border border-cream-200 bg-white shadow-sm">{sidebarContent}</div>
          </aside>

          {/* Content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}