export const APP_NAME = 'Café del Roble';
export const APP_DESCRIPTION = 'Café premium de Pereira, Risaralda, Colombia';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const PRODUCT_TYPES = {
  GRAIN: 'Grano',
  MOLIDO: 'Molido',
} as const;

export const ROAST_LEVELS = {
  CLARA: 'Clara',
  MEDIA: 'Media',
  OSCURA: 'Oscura',
} as const;

export const ORDER_STATUSES = {
  PENDIENTE_PAGO: 'Pendiente de pago',
  PAGO_RECIBIDO: 'Pago recibido',
  PREPARANDO: 'Preparando',
  LISTO_PARA_DESPACHO: 'Listo para despacho',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
} as const;

export const PAYMENT_METHODS = {
  PSE: 'PSE',
  TARJETA: 'Tarjeta',
  NEQUI: 'Nequi',
  WHATSAPP: 'WhatsApp',
  EFECTIVO: 'Efectivo',
} as const;

export const COLOMBIAN_DEPARTMENTS = [
  'Amazonas', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas',
  'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
  'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
  'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo',
  'Quindío', 'Risaralda', 'Santander', 'Sucre', 'Tolima',
  'Valle del Cauca', 'Vaupés', 'Vichada', 'Bogotá D.C.',
] as const;

export const PESOS_COLOMBIANOS = [
  '250 g', '500 g', '1 kg', '2 kg', '5 kg',
] as const;

export const CATEGORIES_DEFAULT = [
  { name: 'Café Especial', slug: 'cafe-especial' },
  { name: 'Café Tradicional', slug: 'cafe-tradicional' },
  { name: 'Café Orgánico', slug: 'cafe-organico' },
  { name: 'Café de Origen', slug: 'cafe-de-origen' },
  { name: 'Accesorios', slug: 'accesorios' },
] as const;
