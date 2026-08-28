'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MessageCircle, Save, ExternalLink } from 'lucide-react';

type WhatsAppSettings = {
  number: string;
  messageTemplate: string;
  autoMessage: boolean;
};

export default function AdminWhatsAppPage() {
  const [settings, setSettings] = useState<WhatsAppSettings>({ number: '', messageTemplate: '', autoMessage: false });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/whatsapp', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => toast.error('No se pudieron cargar los ajustes de WhatsApp'))
      .finally(() => setLoaded(true));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/whatsapp', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (response.ok) {
        setSettings(data.settings);
        toast.success('Ajustes de WhatsApp guardados');
      } else {
        toast.error(data.error || 'No se pudieron guardar los ajustes');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const cleanNumber = settings.number.replace(/\D/g, '').replace(/^0+/, '');
  const previewLink = cleanNumber ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(settings.messageTemplate)}` : '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-coffee-900">WhatsApp</h1>
        <p className="mt-1 text-sm text-secondary-600">
          Configura el número de WhatsApp para pedidos y el mensaje de bienvenida.
        </p>
      </div>

      <div className="max-w-2xl space-y-6 rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
        <div>
          <label className="text-sm font-medium text-coffee-900">Número de WhatsApp</label>
          <p className="mb-1 text-xs text-secondary-500">Formato internacional, ej. 573001234567</p>
          <input
            className="w-full rounded-md border border-cream-300 px-3 py-2 text-sm text-coffee-900"
            placeholder="573001234567"
            value={settings.number}
            onChange={(e) => setSettings({ ...settings, number: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-coffee-900">Mensaje de pedido</label>
          <p className="mb-1 text-xs text-secondary-500">
            Texto que llega pre-escrito al abrir el chat de pedidos.
          </p>
          <textarea
            className="w-full min-h-[100px] rounded-md border border-cream-300 px-3 py-2 text-sm text-coffee-900"
            value={settings.messageTemplate}
            onChange={(e) => setSettings({ ...settings, messageTemplate: e.target.value })}
          />
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-cream-200 bg-cream-50 p-4">
          <input
            type="checkbox"
            checked={settings.autoMessage}
            onChange={(e) => setSettings({ ...settings, autoMessage: e.target.checked })}
            className="h-4 w-4 rounded border-cream-300"
          />
          <span>
            <span className="block text-sm font-medium text-coffee-900">Enviar mensaje automático</span>
            <span className="block text-xs text-secondary-500">
              Saluda automáticamente a los clientes que inician chat desde la tienda.
            </span>
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => void save()} disabled={saving || !loaded}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Guardando...' : 'Guardar ajustes'}
          </Button>
          {previewLink && (
            <Button variant="outline" asChild>
              <a href={previewLink} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Probar mensaje
              </a>
            </Button>
          )}
        </div>

        {!loaded && <p className="text-sm text-secondary-500">Cargando ajustes...</p>}
      </div>

      <div className="max-w-2xl rounded-xl border border-cream-200 bg-coffee-950 p-6 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-emerald-400" />
          <h2 className="font-serif text-lg font-bold">Vista previa del chat</h2>
        </div>
        <div className="mt-4 max-w-sm rounded-lg rounded-tl-none bg-coffee-800 p-4">
          <p className="text-sm text-coffee-100">{settings.messageTemplate || 'Hola Café del Roble 👋, quiero hacer un pedido.'}</p>
          <p className="mt-2 text-xs text-coffee-400">
            {loaded ? (cleanNumber ? `Enviado a +${cleanNumber}` : 'Número aún no configurado') : 'Cargando...'}
          </p>
        </div>
      </div>
    </div>
  );
}