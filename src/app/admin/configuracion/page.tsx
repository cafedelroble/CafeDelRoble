'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Setting = { key: string; value: unknown };

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        const loaded = data.settings || [];
        setSettings(loaded);
        setValues(
          Object.fromEntries(
            loaded.map((setting: Setting) => [
              setting.key,
              typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value),
            ])
          )
        );
      })
      .catch(() => toast.error('No se pudo cargar la configuración'));
  }, []);

  const save = async (key: string) => {
    setSavingKey(key);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: values[key] || '' }),
      });
      if (response.ok) {
        toast.success(`Configuración "${key}" guardada`);
      } else {
        toast.error(`Error al guardar "${key}"`);
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold text-coffee-900">Configuración General</h1>
      <div className="max-w-2xl space-y-4 rounded-xl border border-cream-200 bg-white p-6 shadow-sm">
        {settings.map((setting) => (
          <div key={setting.key} className="flex items-end gap-3">
            <label className="flex-1 space-y-1 text-sm font-medium text-coffee-900">
              {setting.key}
              <input
                className="w-full rounded-md border border-cream-300 px-3 py-2 text-sm text-coffee-900"
                value={values[setting.key] || ''}
                onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
              />
            </label>
            <Button onClick={() => void save(setting.key)} disabled={savingKey === setting.key}>
              {savingKey === setting.key ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        ))}
        {settings.length === 0 && <p className="text-secondary-600 text-sm">No hay configuraciones registradas.</p>}
      </div>
    </div>
  );
}
