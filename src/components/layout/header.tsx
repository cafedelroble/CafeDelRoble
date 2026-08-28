'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Heart, Search, Menu, X, Coffee, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const wishlistItemCount = useWishlistStore((s) => s.getItemCount());

  useEffect(() => {
    setHasMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-coffee-950 text-cream-200">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 font-medium">
            <Truck className="h-3.5 w-3.5 text-primary-400" />
            Envío gratis en compras superiores a $50.000
          </p>
          <p className="hidden items-center gap-1.5 text-cream-400 sm:flex">
            <MapPin className="h-3.5 w-3.5" />
            Pereira · Risaralda, Colombia
          </p>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 transition-shadow',
          'border-cream-200',
          scrolled ? 'shadow-[0_6px_24px_-12px_rgba(49,27,21,0.35)]' : 'shadow-none'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-white shadow-sm transition-transform group-hover:scale-105">
              <Coffee className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold leading-tight text-coffee-900">Café del Roble</span>
              <span className="hidden text-[10px] uppercase tracking-[0.2em] text-secondary-500 sm:block">
                Pereira, Colombia
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative py-1.5 text-sm font-medium transition-colors',
                  isActive(link.href) ? 'text-primary-700' : 'text-secondary-700 hover:text-coffee-900'
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-primary-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-1 md:flex">
            <Button variant="ghost" size="icon" asChild className="hover:bg-cream-100">
              <Link href="/comparar" aria-label="Buscar y comparar productos">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative hover:bg-cream-100">
              <Link href="/cuenta/favoritos" aria-label="Favoritos">
                <Heart className="h-5 w-5" />
                {hasMounted && wishlistItemCount > 0 && (
                  <motion.span
                    key={wishlistItemCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-700 px-1 text-[10px] font-bold text-white"
                  >
                    {wishlistItemCount}
                  </motion.span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative hover:bg-cream-100">
              <Link href="/carrito" aria-label="Carrito de compras">
                <ShoppingBag className="h-5 w-5" />
                {hasMounted && cartItemCount > 0 && (
                  <motion.span
                    key={cartItemCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coffee-800 px-1 text-[10px] font-bold text-white"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </Link>
            </Button>
            <div className="mx-1 h-6 w-px bg-cream-300" />
            <Button variant="ghost" size="icon" asChild className="hover:bg-cream-100">
              <Link href="/cuenta" aria-label="Mi cuenta">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <div className="ml-2">
              <Button size="sm" asChild>
                <Link href="/tienda">Comprar café</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-cream-200 bg-white md:hidden"
            >
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive(link.href)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-secondary-700 hover:bg-cream-100 hover:text-coffee-900'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-cream-200" />
                <Link
                  href="/tienda"
                  className="flex items-center justify-center rounded-lg bg-primary-700 px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Comprar café
                </Link>
                <Link
                  href="/carrito"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-cream-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Carrito
                  {hasMounted && cartItemCount > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary-700 text-[10px] font-bold text-white">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/cuenta"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-cream-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Mi cuenta
                </Link>
                <Link
                  href="/cuenta/favoritos"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-cream-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="h-4 w-4" />
                  Favoritos
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}