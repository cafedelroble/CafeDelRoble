import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function WhatsAppPage() {
  const session = await auth();
  if (session?.user.role !== 'ADMIN' && session?.user.role !== 'SUPER_ADMIN') return <p>No autorizado</p>;
  const setting = await prisma.siteSetting.findUnique({ where: { key: 'whatsapp_number' } });
  return <div className="space-y-6"><h1 className="font-serif text-3xl font-bold text-coffee-900">WhatsApp</h1><div className="rounded-xl border border-cream-200 bg-white p-6"><p className="text-sm text-secondary-500">Número configurado</p><p className="mt-2 text-lg font-medium text-coffee-900">{typeof setting?.value === 'string' && setting.value ? setting.value : 'No configurado en la base de datos'}</p><p className="mt-4 text-sm text-secondary-600">La variable de entorno WHATSAPP_NUMBER sigue siendo la configuración pública de respaldo.</p></div></div>;
}
