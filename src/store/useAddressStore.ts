import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  fetchAddresses: (userId: string) => Promise<void>;
  addAddress: (userId: string, address: Omit<Address, 'id' | 'user_id' | 'is_default'>, isDefault?: boolean) => Promise<void>;
  updateAddress: (id: string, updates: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (userId: string, id: string) => Promise<void>;
  clearAddresses: () => void;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ addresses: data as Address[] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addAddress: async (userId: string, address, isDefault = false) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      
      // If setting as default, we need to unset previous defaults if any exist
      if (isDefault) {
        const { addresses } = get();
        if (addresses.some(a => a.is_default)) {
            await supabase
              .from('user_addresses')
              .update({ is_default: false })
              .eq('user_id', userId)
              .eq('is_default', true);
        }
      } else {
         // if this is the first address, make it default
         const { addresses } = get();
         if (addresses.length === 0) {
             isDefault = true;
         }
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .insert([{ ...address, user_id: userId, is_default: isDefault }])
        .select()
        .single();

      if (error) throw error;
      
      // refetch to ensure correct ordering
      get().fetchAddresses(userId);
    } catch (error: any) {
      set({ error: error.message });
      set({ isLoading: false });
    }
  },

  updateAddress: async (id: string, updates) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('user_addresses')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        addresses: state.addresses.map(a => a.id === id ? { ...a, ...updates } : a),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message });
      set({ isLoading: false });
    }
  },

  deleteAddress: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      const { addresses } = get();
      const deletedWasDefault = addresses.find(a => a.id === id)?.is_default;
      
      const newAddresses = addresses.filter(a => a.id !== id);
      
      // if we deleted the default, set a new default if one exists
      if (deletedWasDefault && newAddresses.length > 0) {
          await get().setDefaultAddress(newAddresses[0].user_id, newAddresses[0].id);
      } else {
          set({ addresses: newAddresses, isLoading: false });
      }

    } catch (error: any) {
      set({ error: error.message });
      set({ isLoading: false });
    }
  },

  setDefaultAddress: async (userId: string, id: string) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      
      // Start a transaction-like approach: set all to false, then target to true
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
        .eq('is_default', true);

      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      
      // refetch to ensure correct ordering
      get().fetchAddresses(userId);
    } catch (error: any) {
      set({ error: error.message });
      set({ isLoading: false });
    }
  },

  clearAddresses: () => {
      set({ addresses: [], error: null, isLoading: false });
  }
}));
