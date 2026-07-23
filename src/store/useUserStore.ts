import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoaded: boolean;
  setLoaded: (loaded: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoaded: false,
  setLoaded: (isLoaded) => set({ isLoaded }),
}));
