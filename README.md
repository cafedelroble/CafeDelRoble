# ☕ Café del Roble

Plataforma e-commerce premium de café colombiano de Pereira, Risaralda.

## Tecnologías

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js Route Handlers, Server Actions
- **Base de datos:** PostgreSQL con Prisma ORM
- **Autenticación:** NextAuth.js v5
- **Estado:** Zustand
- **Animaciones:** Framer Motion
- **UI Components:** Radix UI primitives
- **Imágenes:** Cloudinary (preparado)
- **Pagos:** Wompi / WhatsApp (preparado)

## Instalación

```bash
npm install
```

## Variables de entorno

Copia `.env.example` a `.env` y configura:

```bash
cp .env.example .env
```

Variables requeridas:
- `DATABASE_URL` - URL de conexión a PostgreSQL
- `AUTH_SECRET` - Secrete para NextAuth
- `CLOUDINARY_*` - Credenciales de Cloudinary
- `WHATSAPP_NUMBER` - Número de WhatsApp del negocio

## Base de datos

```bash
# Generar cliente Prisma
npx prisma generate

# Crear migraciones
npx prisma migrate dev

# Poblar base de datos con datos demo
npx prisma db seed
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Estructura del proyecto

```
src/
├── app/
│   ├── (public)/        # Páginas públicas
│   ├── (auth)/          # Login, registro
│   ├── cuenta/          # Dashboard del cliente
│   ├── admin/           # Panel de administración
│   ├── carrito/         # Carrito de compras
│   ├── checkout/        # Proceso de pago
│   └── api/             # Route Handlers
├── components/
│   ├── ui/              # Componentes base (Button, Card, Input...)
│   ├── layout/          # Header, Footer, WhatsApp
│   └── home/            # Secciones de la home
├── lib/                 # Utilidades, Prisma, Auth
├── stores/              # Zustand (carrito, comparador, favoritos)
├── types/               # Tipos TypeScript
├── constants/           # Constantes de la app
└── config/              # Configuración del sitio
```

## Usuarios demo

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin@cafedelroble.co | Admin123! | SUPER_ADMIN |
| cliente@email.com | Cliente123! | CLIENTE |

## Despliegue

### Vercel

1. Subir a GitHub
2. Conectar repositorio en Vercel
3. Configurar variables de entorno
4. Deploy automático

### Base de datos

Recomendado: **Neon** o **Supabase** ( PostgreSQL gratuito).

### Cloudinary

1. Crear cuenta en [cloudinary.com](https://cloudinary.com)
2. Obtener credenciales
3. Configurar variables de entorno

## Funcionalidades

### Cliente
- ✅ Navegación pública (Home, Nosotros, Tienda, Contacto)
- ✅ Catálogo de productos con filtros
- ✅ Detalle de producto con galería
- ✅ Carrito de compras (localStorage)
- ✅ Comparador de productos (sin registro)
- ✅ Checkout como invitado
- ✅ Registro e inicio de sesión
- ✅ Dashboard del cliente
- ✅ Historial de pedidos
- ✅ Seguimiento de pedido
- ✅ Gestión de direcciones
- ✅ Lista de favoritos

### Administración
- ✅ Dashboard con estadísticas
- ✅ Gestión de productos
- ✅ Gestión de pedidos
- ✅ Gestión de clientes
- ✅ Panel de configuración

### Técnico
- ✅ Design system con tokens de diseño
- ✅ Paleta de colores premium de café
- ✅ Tipografía serif + sans-serif
- ✅ Animaciones con Framer Motion
- ✅ Responsive (mobile-first)
- ✅ SEO optimizado
- ✅ TypeScript estricto
- ✅ Validación con Zod
- ✅ Protección de rutas
- ✅ Roles y permisos

## Moneda

Todos los precios están en **COP (Peso colombiano)**.

## Idioma

Todo el sistema está en **Español — Colombia**.

---

Desarrollado con ☕ en Pereira, Risaralda, Colombia.
