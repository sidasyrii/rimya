"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/store/useUserStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoaded } = useUserStore();
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      setUser(session?.user || null);
      setLoaded(true);
      if (session?.user) {
        useWishlistStore.getState().syncWithServer(session.user.id);
      }
    });

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user || null);
      setLoaded(true);
      if (session?.user) {
        useWishlistStore.getState().syncWithServer(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoaded, supabase]);

  return <>{children}</>;
}
