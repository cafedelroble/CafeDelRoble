'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'group toast rounded-xl border border-cream-200 shadow-lg font-sans',
          title: 'text-sm font-semibold',
          description: 'text-xs text-secondary-600',
          actionButton: 'bg-primary-700 text-white text-xs font-medium px-3 py-1 rounded-md',
          cancelButton: 'bg-cream-100 text-coffee-800 text-xs font-medium px-3 py-1 rounded-md',
        },
      }}
    />
  );
}
