import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

const KEYS = ['whatsapp_number', 'whatsapp_message_template', 'whatsapp_auto_message'] as const;

async function readSettings() {
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: [...KEYS] } } });
  const map = new Map(rows.map((row) => [row.key, row.value]));
  const text = (key: string) => (typeof map.get(key) === 'string' ? String(map.get(key)) : '');
  const auto = map.get('whatsapp_auto_message');
  return {
    number: text('whatsapp_number') || process.env.WHATSAPP_NUMBER || '',
    messageTemplate:
      text('whatsapp_message_template') || 'Hola Café del Roble 👋, quiero hacer un pedido. Mi carrito:\n',
    autoMessage: auto === true || auto === 'true' || auto === '1',
  };
}

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;
  return NextResponse.json({ settings: await readSettings() });
}

export async function PATCH(request: NextRequest) {
  const access = await requireAdmin();
  if (access.response) return access.response;
  try {
    const body = await request.json();
    const updates: { key: string; value: string }[] = [];
    if (typeof body.number === 'string') updates.push({ key: 'whatsapp_number', value: body.number.trim() });
    if (typeof body.messageTemplate === 'string') updates.push({ key: 'whatsapp_message_template', value: body.messageTemplate });
    if (typeof body.autoMessage === 'boolean') updates.push({ key: 'whatsapp_auto_message', value: String(body.autoMessage) });
    if (updates.length === 0) return NextResponse.json({ error: 'No hay cambios para guardar' }, { status: 400 });

    await prisma.$transaction(
      updates.map((update) =>
        prisma.siteSetting.upsert({
          where: { key: update.key },
          update: { value: update.value },
          create: { key: update.key, value: update.value, type: 'TEXT', group: 'whatsapp' },
        })
      )
    );
    return NextResponse.json({ settings: await readSettings() });
  } catch (error) {
    console.error('Error saving whatsapp settings:', error);
    return NextResponse.json({ error: 'No se pudieron guardar los ajustes de WhatsApp' }, { status: 500 });
  }
}