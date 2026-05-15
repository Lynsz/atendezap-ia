"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase/browser";

type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

export function useAuth() {
  const isConfigured = useMemo(() => isSupabaseBrowserConfigured(), []);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured) {
      return;
    }

    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isConfigured]);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseBrowserClient();
    return supabase.auth.signInWithPassword({ email, password });
  }, []);

  const signUp = useCallback(async ({ name, email, password }: SignUpInput) => {
    const supabase = getSupabaseBrowserClient();
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    return supabase.auth.signOut();
  }, []);

  return {
    user,
    session,
    loading,
    isConfigured,
    signIn,
    signUp,
    signOut
  };
}
