'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Heart, Search, Menu, X, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const wishlistItemCount = useWishlistStore((s) => s.getItemCount());

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cream-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-white transition-colors group-hover:bg-primary-800">
            <Coffee className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold leading-tight text-coffee-900">
              Café del Roble
            </span>
            <span className="hidden text-[10px] uppercase tracking-widest text-secondary-500 sm:block">
              Pereira, Colombia
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-secondary-700 transition-colors hover:text-primary-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/comparar" aria-label="Comparar productos">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cuenta/favoritos" aria-label="Favoritos">
              <Heart className="h-5 w-5" />
              {hasMounted && wishlistItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-700 text-[10px] font-bold text-white">
                  {wishlistItemCount}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/carrito" aria-label="Carrito de compras">
              <ShoppingBag className="h-5 w-5" />
              {hasMounted && cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-700 text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </Button>
          <div className="h-6 w-px bg-cream-300" />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cuenta" aria-label="Mi cuenta">
              <User className="h-5 w-5" />
            </Link>
          </Button>
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
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-cream-100 hover:text-primary-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-cream-200" />
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
  );
}
