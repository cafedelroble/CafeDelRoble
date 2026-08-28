'use client';

import Image from 'next/image';
import { ImagePlus, Loader2, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type ProductImageInput = {
  id?: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
  cloudinaryPublicId?: string | null;
};

type ProductImagesFieldProps = {
  value: ProductImageInput[];
  onChange: (images: ProductImageInput[]) => void;
  disabled?: boolean;
};

function normalizeImages(images: ProductImageInput[]) {
  const next = images.map((image, index) => ({ ...image, sortOrder: index }));
  if (next.length > 0 && !next.some((image) => image.isPrimary)) {
    next[0] = { ...next[0], isPrimary: true };
  }
  return next.map((image, index) => ({ ...image, isPrimary: image.isPrimary && index === next.findIndex((item) => item.isPrimary) }));
}

export function ProductImagesField({ value, onChange, disabled = false }: ProductImagesFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [error, setError] = useState('');

  const updateImages = (images: ProductImageInput[]) => onChange(normalizeImages(images));

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError('');
    try {
      const uploaded: ProductImageInput[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'cafe-del-roble/products');
        const response = await fetch('/api/cloudinary/upload', { method: 'POST', body: formData });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'No se pudo subir la imagen');
        uploaded.push({
          url: data.url,
          cloudinaryPublicId: data.publicId,
          altText: file.name,
          isPrimary: value.length === 0 && uploaded.length === 0,
          sortOrder: value.length + uploaded.length,
        });
      }
      updateImages([...value, ...uploaded]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'No se pudo subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const addManualUrl = () => {
    const url = manualUrl.trim();
    if (!url) return;
    updateImages([
      ...value,
      {
        url,
        altText: 'Imagen de producto',
        isPrimary: value.length === 0,
        sortOrder: value.length,
      },
    ]);
    setManualUrl('');
  };

  const setPrimary = (index: number) => {
    updateImages(value.map((image, imageIndex) => ({ ...image, isPrimary: imageIndex === index })));
  };

  const removeImage = (index: number) => {
    updateImages(value.filter((_, imageIndex) => imageIndex !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-800">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {uploading ? 'Subiendo...' : 'Subir imágenes'}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            multiple
            className="sr-only"
            disabled={disabled || uploading}
            onChange={(event) => {
              void uploadFiles(event.target.files);
              event.currentTarget.value = '';
            }}
          />
        </label>
        <p className="text-xs text-secondary-500">Puedes seleccionar varias imágenes. PNG, JPG, WEBP o SVG, máximo 5 MB cada una.</p>
      </div>

      <div className="flex gap-2">
        <Input
          value={manualUrl}
          disabled={disabled || uploading}
          placeholder="URL local o Cloudinary"
          onChange={(event) => setManualUrl(event.target.value)}
        />
        <Button type="button" variant="outline" disabled={disabled || uploading || !manualUrl.trim()} onClick={addManualUrl}>
          Agregar
        </Button>
      </div>

      {value.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((image, index) => (
            <div key={`${image.url}-${index}`} className="overflow-hidden rounded-lg border border-cream-200 bg-white">
              <div className="relative aspect-square bg-cream-50">
                <Image src={image.url} alt={image.altText || 'Imagen de producto'} fill className="object-cover" sizes="(max-width: 640px) 50vw, 220px" />
                {image.isPrimary && (
                  <span className="absolute left-2 top-2 rounded-md bg-primary-700 px-2 py-1 text-xs font-medium text-white">
                    Principal
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 p-2">
                <Button type="button" size="sm" variant={image.isPrimary ? 'default' : 'outline'} className="flex-1" onClick={() => setPrimary(index)}>
                  <Star className="mr-1 h-3.5 w-3.5" />
                  Principal
                </Button>
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeImage(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
