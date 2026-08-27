import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().optional(),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const addressSchema = z.object({
  recipientName: z.string().min(2, 'El nombre del destinatario es requerido'),
  address: z.string().min(5, 'La dirección es requerida'),
  complement: z.string().optional(),
  city: z.string().min(2, 'La ciudad es requerida'),
  department: z.string().min(2, 'El departamento es requerido'),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  categoryId: z.string(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  sku: z.string().min(2),
  weight: z.number().positive().optional(),
  presentation: z.string().optional(),
  type: z.enum(['GRAIN', 'MOLIDO']),
  roastLevel: z.enum(['CLARA', 'MEDIA', 'OSCURA']),
  origin: z.string().optional(),
  tastingNotes: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const discountSchema = z.object({
  code: z.string().min(3).max(40).regex(/^[A-Z0-9_-]+$/),
  type: z.enum(['PORCENTAJE', 'VALOR_FIJO']),
  scope: z.enum(['CARRITO', 'PRODUCTOS', 'CATEGORIAS']).default('CARRITO'),
  value: z.number().positive(),
  minAmount: z.number().nonnegative().optional(),
  maxUses: z.number().int().positive().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isActive: z.boolean().default(true),
  isAutomatic: z.boolean().default(false),
  applicableCategories: z.array(z.string()).default([]),
  applicableProducts: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
  if (data.endDate <= data.startDate) ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'La fecha final debe ser posterior a la inicial' });
  if (data.type === 'PORCENTAJE' && data.value > 100) ctx.addIssue({ code: 'custom', path: ['value'], message: 'El porcentaje no puede superar 100' });
  if (data.scope === 'PRODUCTOS' && data.applicableProducts.length === 0) ctx.addIssue({ code: 'custom', path: ['applicableProducts'], message: 'Selecciona al menos un producto' });
  if (data.scope === 'CATEGORIAS' && data.applicableCategories.length === 0) ctx.addIssue({ code: 'custom', path: ['applicableCategories'], message: 'Selecciona al menos una categoría' });
});
