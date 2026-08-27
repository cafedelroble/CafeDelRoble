'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, MapPin, Heart, Shield, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';

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
  const { data: session } = useSession();
  const userName = session?.user.name || 'Cliente';
  const userEmail = session?.user.email || '';
  const initials = userName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-cream-50 min-h-[80vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-xl border border-cream-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-cream-200 pb-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-serif font-bold text-lg">
                  {initials}
                </div>
                <div>
                  <p className="font-serif font-semibold text-coffee-900">{userName}</p>
                  <p className="text-xs text-secondary-500">{userEmail}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
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
                <div className="border-t border-cream-200 pt-4 mt-4">
                  <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-600 hover:bg-cream-100 hover:text-destructive transition-colors">
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
