import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/utils/supabase/client';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  giftMessage?: string;
}

interface CartState {
  items: CartItem[];
  isGiftWrapped: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  setIsGiftWrapped: (val: boolean) => void;
  couponCode: string | null;
  setCouponCode: (code: string | null) => void;
  revalidateCart: () => Promise<boolean>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isGiftWrapped: false,
      setIsGiftWrapped: (val) => set({ isGiftWrapped: val }),
      couponCode: null,
      setCouponCode: (code) => set({ couponCode: code }),
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [], isGiftWrapped: false, couponCode: null }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      revalidateCart: async () => {
        const { items } = get();
        if (items.length === 0) return false;
        let hasChanges = false;
        try {
          const supabase = createClient();
          const productIds = items.map(i => i.id);
          const { data: products } = await supabase
            .from('products')
            .select('id, price, in_stock, stock_quantity')
            .in('id', productIds);
          
          if (!products) return false;
          
          const productMap = new Map<string, any>(products.map((p: any) => [p.id, p]));
          
          const newItems = items.map(item => {
            const dbProduct = productMap.get(item.id);
            if (!dbProduct || !dbProduct.in_stock || dbProduct.stock_quantity < 1) {
              hasChanges = true;
              return null;
            }
            if (dbProduct.price !== item.price) {
              hasChanges = true;
              return { ...item, price: dbProduct.price };
            }
            return item;
          }).filter(Boolean) as CartItem[];
          
          if (hasChanges) {
            set({ items: newItems });
          }
        } catch (e) {
          console.error(e);
        }
        return hasChanges;
      }
    }),
    {
      name: 'Anubandha-cart',
    }
  )
);
