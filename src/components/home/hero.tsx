'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, MapPin, Truck, Bean, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
};

function FormatPrice({ value }: { value: number }) {
  return (
    <span>
      {value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      })}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-coffee-950">
      {/* Imagen de fondo: cafetales */}
      <motion.div
        initial={{ scale: 1.18, opacity: 0.35 }}
        animate={{ scale: 1.05, opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <Image
          src="/images/cafetales-hero.jpg"
          alt="Cafetales verdes en las montañas de la zona cafetera colombiana"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-coffee-950/95 via-coffee-950/70 to-coffee-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-coffee-950 via-transparent to-coffee-950/45" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-20 sm:px-6 lg:px-8 lg:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Texto */}
          <div>
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-cream-100 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-400" />
              </span>
              Café de origen · Zona cafetera colombiana
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-balance text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
            >
              Del cafetal a tu taza,
              <span className="relative mt-1 block text-primary-300">
                con amor y tradición.
                <svg
                  className="absolute -bottom-2 left-0 w-28 text-primary-500/60 sm:w-36"
                  viewBox="0 0 200 12"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2 9C50 3 150 3 198 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-7 max-w-xl text-base leading-relaxed text-cream-100/85 sm:text-lg"
            >
              Cultivamos a más de 1.600 metros de altura y tostamos en lotes pequeños para
              que cada taza conserve el aroma, cuerpo y dulzura de los Andes colombianos.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.44 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button size="lg" asChild className="group">
                <Link href="/tienda">
                  Comprar café
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/nosotros">Nuestra historia</Link>
              </Button>
            </motion.div>

            {/* Confianza */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.56 }}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-cream-100/80"
            >
              <span className="flex items-center gap-1.5">
                <span className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary-400 text-primary-400" />
                  ))}
                </span>
                <strong className="font-semibold text-white">4,9</strong> / 5
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-cream-100/40 sm:block" />
              <span>+1.200 clientes felices</span>
              <span className="hidden h-1 w-1 rounded-full bg-cream-100/40 sm:block" />
              <span className="flex items-center gap-1.5">
                <Bean className="h-4 w-4 text-primary-400" />
                100% arábica colombiano
              </span>
            </motion.div>
          </div>

          {/* Tarjeta flotante de producto */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="hidden justify-center lg:flex"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-3 shadow-2xl shadow-coffee-950/60 backdrop-blur-xl"
            >
              <div className="relative h-64 overflow-hidden rounded-2xl">
                <Image
                  src="/images/products/roble-250g.jpg"
                  alt="Café del Roble Tostión Media 250g"
                  fill
                  sizes="(max-width: 1024px) 0px, 400px"
                  className="object-cover"
                />
              </div>
              <div className="flex items-start justify-between gap-3 p-4 pb-2">
                <div>
                  <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-cream-300">
                    <Sparkles className="h-3.5 w-3.5 text-primary-400" />
                    Tostión media · 250g
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-white">
                    Café del Roble
                  </h3>
                  <p className="flex items-center gap-1 text-sm text-cream-200/80">
                    <Star className="h-3.5 w-3.5 fill-primary-400 text-primary-400" />
                    4,9 <span className="text-cream-300">(214 reseñas)</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl font-bold text-primary-300">
                    <FormatPrice value={22000} />
                  </p>
                  <Link
                    href="/productos/cafe-del-roble-tostion-media-250g"
                    className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-500"
                  >
                    Ver detalle <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Barras de stats */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.68 }}
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 sm:grid-cols-3"
        >
          <div className="flex items-center gap-3 bg-coffee-950/40 px-6 py-4">
            <MapPin className="h-5 w-5 shrink-0 text-primary-400" />
            <div>
              <p className="text-sm font-semibold text-white">1.600 – 1.800 msnm</p>
              <p className="text-xs text-cream-200/70">Altura de cultivo</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-coffee-950/40 px-6 py-4">
            <Bean className="h-5 w-5 shrink-0 text-primary-400" />
            <div>
              <p className="text-sm font-semibold text-white">Lotes pequeños</p>
              <p className="text-xs text-cream-200/70">Tostión artesanal</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-coffee-950/40 px-6 py-4">
            <Truck className="h-5 w-5 shrink-0 text-primary-400" />
            <div>
              <p className="text-sm font-semibold text-white">Envío a toda Colombia</p>
              <p className="text-xs text-cream-200/70">Pedidos superiores a $50.000</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}