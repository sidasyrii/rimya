"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/store/useUserStore";

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoaded } = useUserStore();
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoaded(true);
    });

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoaded(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoaded, supabase]);

  return <>{children}</>;
}
