import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

interface RecentlyViewedState {
  items: ProductSummary[];
  addItem: (product: ProductSummary) => void;
  clearItems: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          // Remove if it already exists to put it at the front
          const filtered = state.items.filter((item) => item.id !== product.id);
          const newItems = [product, ...filtered].slice(0, 10); // Keep max 10
          return { items: newItems };
        });
      },
      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'Anubandha-recent-views',
    }
  )
);
