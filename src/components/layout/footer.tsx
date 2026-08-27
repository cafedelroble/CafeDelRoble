import Link from 'next/link';
import { Coffee, MapPin, Phone, Mail, Globe, Users, MessageCircle } from 'lucide-react';

const shopLinks = [
  { href: '/tienda', label: 'Todos los cafés' },
  { href: '/categorias/cafe-especial', label: 'Café Especial' },
  { href: '/categorias/cafe-tradicional', label: 'Café Tradicional' },
  { href: '/categorias/cafe-organico', label: 'Café Orgánico' },
  { href: '/categorias/cafe-de-origen', label: 'Café de Origen' },
];

const infoLinks = [
  { href: '/nosotros', label: 'Nuestra historia' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/seguimiento', label: 'Seguimiento de pedido' },
];

const legalLinks = [
  { href: '/terminos', label: 'Términos y condiciones' },
  { href: '/privacidad', label: 'Política de privacidad' },
  { href: '/envios', label: 'Política de envíos' },
];

export function Footer() {
  return (
    <footer className="border-t border-cream-200 bg-coffee-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
                <Coffee className="h-5 w-5" />
              </div>
              <span className="font-serif text-lg font-bold text-white">
                Café del Roble
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-coffee-300">
              Café seleccionado en Pereira, Risaralda. Tradición, calidad y
              sabor en cada taza. Un viaje desde nuestra tierra hasta tu hogar.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-coffee-800 text-coffee-300 transition-colors hover:bg-primary-700 hover:text-white" aria-label="Instagram">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-coffee-800 text-coffee-300 transition-colors hover:bg-primary-700 hover:text-white" aria-label="Facebook">
                <Users className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-coffee-800 text-coffee-300 transition-colors hover:bg-nature-600 hover:text-white" aria-label="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-cream-400">
              Tienda
            </h3>
            <ul className="mt-4 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-coffee-300 transition-colors hover:text-cream-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-cream-400">
              Información
            </h3>
            <ul className="mt-4 space-y-3">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-coffee-300 transition-colors hover:text-cream-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-cream-400">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2 text-sm text-coffee-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                Pereira, Risaralda, Colombia
              </li>
              <li>
                <a href="mailto:hola@cafedelroble.co" className="flex items-start gap-2 text-sm text-coffee-300 transition-colors hover:text-cream-300">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                  hola@cafedelroble.co
                </a>
              </li>
              <li>
                <a href="#" className="flex items-start gap-2 text-sm text-coffee-300 transition-colors hover:text-cream-300">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                  +57 (6) 000-0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-coffee-800 pt-8 sm:flex-row">
          <p className="text-xs text-coffee-500">
            © {new Date().getFullYear()} Café del Roble. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-coffee-500 transition-colors hover:text-cream-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
