'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CompareItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  presentation?: string;
  type?: string;
  roastLevel?: string;
  origin?: string;
  tastingNotes?: string[];
  weight?: number;
  averageRating?: number;
  shortDescription?: string;
}

interface CompareStore {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  canAdd: () => boolean;
  MAX_ITEMS: number;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      MAX_ITEMS: 4,

      addItem: (item) => {
        if (!get().canAdd()) return;
        if (get().isInCompare(item.productId)) return;
        set({ items: [...get().items, item] });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      clearCompare: () => set({ items: [] }),

      isInCompare: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      canAdd: () => {
        return get().items.length < get().MAX_ITEMS;
      },
    }),
    {
      name: 'cafe-del-roble-compare',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
