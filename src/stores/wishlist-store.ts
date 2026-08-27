'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
}

import { toast } from 'sonner';

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (get().isInWishlist(item.productId)) return;
        set({ items: [...get().items, item] });
        toast.success(`"${item.name}" guardado en favoritos ❤️`);
      },

      removeItem: (productId) => {
        const itemToRemove = get().items.find((i) => i.productId === productId);
        set({ items: get().items.filter((i) => i.productId !== productId) });
        if (itemToRemove) {
          toast.info(`"${itemToRemove.name}" eliminado de favoritos`);
        }
      },

      toggleItem: (item) => {
        if (get().isInWishlist(item.productId)) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      clearWishlist: () => set({ items: [] }),

      getItemCount: () => get().items.length,
    }),
    {
      name: 'cafe-del-roble-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
