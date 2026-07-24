import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[]; // store product IDs
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) => {
        set((state) => ({
          items: state.items.includes(id) ? state.items : [...state.items, id],
        }));
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((itemId) => itemId !== id),
        }));
      },
      hasItem: (id) => get().items.includes(id),
    }),
    {
      name: 'Anubandha-wishlist',
    }
  )
);
