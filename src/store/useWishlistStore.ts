import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/utils/supabase/client';

interface WishlistState {
  items: string[]; // store product IDs
  addItem: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  hasItem: (id: string) => boolean;
  syncWithServer: (userId: string) => Promise<void>;
  loadFromServer: (userId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: async (id) => {
        set((state) => ({
          items: state.items.includes(id) ? state.items : [...state.items, id],
        }));
        try {
          const supabase = createClient();
          const { data } = await supabase.auth.getUser();
          if (data.user) {
            await supabase.from('user_wishlists').upsert(
              { user_id: data.user.id, product_id: id },
              { onConflict: 'user_id, product_id', ignoreDuplicates: true }
            );
          }
        } catch(e) { console.error(e) }
      },
      removeItem: async (id) => {
        set((state) => ({
          items: state.items.filter((itemId) => itemId !== id),
        }));
        try {
          const supabase = createClient();
          const { data } = await supabase.auth.getUser();
          if (data.user) {
            await supabase.from('user_wishlists').delete().match({ user_id: data.user.id, product_id: id });
          }
        } catch(e) { console.error(e) }
      },
      hasItem: (id) => get().items.includes(id),
      syncWithServer: async (userId: string) => {
        try {
          const supabase = createClient();
          const { items } = get();
          if (items.length > 0) {
            const payload = items.map(id => ({ user_id: userId, product_id: id }));
            await supabase.from('user_wishlists').upsert(payload, { onConflict: 'user_id, product_id', ignoreDuplicates: true });
          }
          const { data } = await supabase.from('user_wishlists').select('product_id').eq('user_id', userId);
          if (data) {
            set({ items: Array.from(new Set([...items, ...data.map((d: any) => d.product_id)])) });
          }
        } catch(e) { console.error(e) }
      },
      loadFromServer: async (userId: string) => {
        try {
          const supabase = createClient();
          const { data } = await supabase.from('user_wishlists').select('product_id').eq('user_id', userId);
          if (data) {
            set({ items: data.map((d: any) => d.product_id) });
          }
        } catch(e) { console.error(e) }
      },
    }),
    {
      name: 'Anubandha-wishlist',
    }
  )
);
