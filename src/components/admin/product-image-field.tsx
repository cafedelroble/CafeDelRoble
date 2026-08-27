'use client';

import { useEffect, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ProductImageFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ProductImageField({ value, onChange, disabled = false }: ProductImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value);

  useEffect(() => { setPreview(value); }, [value]);

  const selectFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Selecciona un archivo de imagen'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('La imagen no puede superar 5 MB'); return; }
    setError('');
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'cafe-del-roble/products');
      const response = await fetch('/api/cloudinary/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo subir la imagen');
      onChange(data.url);
      setPreview(data.url);
    } catch (uploadError) {
      setPreview(value);
      setError(uploadError instanceof Error ? uploadError.message : 'No se pudo subir la imagen');
    } finally { setUploading(false); }
  };

  return <div className="space-y-3"><div className="flex items-center gap-4"><div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border border-dashed border-cream-300 bg-cream-50">{preview ? <img src={preview} alt="Vista previa del producto" className="h-full w-full object-cover" /> : <ImagePlus className="h-8 w-8 text-secondary-400" />}</div><div className="space-y-2"><label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-800"><ImagePlus className="h-4 w-4" />{uploading ? <><Loader2 className="h-4 w-4 animate-spin" />Subiendo...</> : 'Subir imagen'}<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" disabled={disabled || uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void selectFile(file); event.currentTarget.value = ''; }} /></label>{value && <button type="button" className="flex items-center gap-1 text-sm text-red-600" disabled={disabled || uploading} onClick={() => { onChange(''); setPreview(''); }}><X className="h-4 w-4" />Quitar imagen</button>}<p className="text-xs text-secondary-500">PNG, JPG, WEBP o SVG. Máximo 5 MB.</p></div></div><label className="block space-y-1 text-sm font-medium">URL de imagen local o Cloudinary<Input value={value} disabled={disabled || uploading} placeholder="/images/products/cafe.svg" onChange={(event) => { onChange(event.target.value); setPreview(event.target.value); }} /></label>{error && <p className="text-sm text-red-600">{error}</p>}</div>;
}
