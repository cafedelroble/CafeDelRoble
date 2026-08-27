# ☕ Café del Roble

Plataforma e-commerce premium de café colombiano de Pereira, Risaralda.

## Tecnologías

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js Route Handlers y transacciones Prisma
- **Base de datos:** PostgreSQL con Prisma ORM
- **Autenticación:** NextAuth.js v5
- **Estado:** Zustand
- **Animaciones:** Framer Motion
- **UI Components:** Radix UI primitives
- **Imágenes:** Cloudinary (preparado)
- **Pagos:** Registro de pago pendiente y WhatsApp; Wompi requiere credenciales y webhook

## Instalación

```bash
npm install
```

## Variables de entorno

Copia `.env.example` a `.env` y configura:

```bash
cp .env.example .env
```

Variables principales:
- `DATABASE_URL` - URL de conexión a PostgreSQL
- `AUTH_SECRET` - Secreto para NextAuth
- `CLOUDINARY_*` - Credenciales de Cloudinary
- `WHATSAPP_NUMBER` - Número de WhatsApp del negocio

No subas `.env` a GitHub. El proyecto excluye `.env*` mediante `.gitignore`.

## Base de datos

```bash
# Generar cliente Prisma
npx prisma generate

# Crear migraciones
npx prisma migrate dev

# Poblar base de datos con datos demo
npx prisma db seed
```

Para desarrollo local, `npx prisma db push` sincroniza el esquema sin crear migraciones. En producción utiliza migraciones revisadas.

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
| admin@cafedelroble.co | password123 | ADMIN |
| cliente@cafedelroble.co | password123 | CLIENTE |

Estas credenciales son únicamente para desarrollo. Cambia o elimina los usuarios demo antes de publicar.

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

Si Cloudinary no está configurado, utiliza las imágenes locales del seed en `public/images/products`. El endpoint de subida valida sesión administrativa, carpeta permitida, tipo de imagen y límite de 5 MB.

## Funcionalidades

### Cliente
- ✅ Navegación pública y catálogo activo desde PostgreSQL
- ✅ Filtros y ordenamiento de productos
- ✅ Carrito temporal con validación server-side de precios y stock
- ✅ Checkout como invitado con creación persistente de pedido y pago pendiente
- ✅ Descuentos por código y promociones automáticas
- ✅ Registro e inicio de sesión
- ⚠️ Historial, seguimiento, direcciones y favoritos requieren completar sus consultas Prisma

### Administración
- ✅ Dashboard con estadísticas consultadas desde PostgreSQL
- ✅ Productos: listado, creación, edición, activación/desactivación e imágenes
- ✅ Categorías, clientes y pedidos consultados desde PostgreSQL
- ✅ Banners: listado, creación y activación/desactivación
- ✅ Configuración persistida en `SiteSetting`
- ✅ Descuentos por código o automáticos, porcentaje o valor fijo, para carrito, productos o categorías
- ✅ Protección server-side para APIs administrativas

### API principal
- `GET/POST /api/admin/products`
- `GET/PATCH/DELETE /api/admin/products/[id]`
- `GET/POST /api/admin/categories`
- `GET/POST /api/admin/banners`
- `PATCH/DELETE /api/admin/banners/[id]`
- `GET/POST /api/admin/discounts`
- `PATCH/DELETE /api/admin/discounts/[id]`
- `GET/PATCH /api/admin/settings`
- `GET /api/admin/dashboard`
- `POST /api/discounts/validate`
- `POST /api/orders`

El endpoint de órdenes recalcula precios y stock en el servidor y crea `Order`, `OrderItem`, `Payment` e historial dentro de una transacción.

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
- ✅ Roles y permisos server-side

## Estado de integraciones externas

- **Cloudinary:** el código está preparado y protegido, pero requiere credenciales reales.
- **Wompi:** el registro de pago está preparado; la integración de producción y webhooks requiere credenciales del comercio.
- **Envíos:** se usan las direcciones y estados de los pedidos; el esquema todavía no tiene transportadora o guía.

## Moneda

Todos los precios están en **COP (Peso colombiano)**.

## Idioma

Todo el sistema está en **Español — Colombia**.

---

Desarrollado con ☕ en Pereira, Risaralda, Colombia.
