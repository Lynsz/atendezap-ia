"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase/browser";

type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

export const SUPABASE_CONNECTION_ERROR =
  "Não foi possível conectar ao Supabase. Verifique sua internet e as variáveis NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY.";

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
    return SUPABASE_CONNECTION_ERROR;
  }

  if (error instanceof Error && error.message.toLowerCase().includes("failed to fetch")) {
    return SUPABASE_CONNECTION_ERROR;
  }

  return fallback;
}

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

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      })
      .catch(() => {
        setSession(null);
        setUser(null);
      })
      .finally(() => setLoading(false));

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
    try {
      const supabase = getSupabaseBrowserClient();
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (error) {
      throw new Error(getAuthErrorMessage(error, "Nao foi possivel entrar. Confira seus dados."));
    }
  }, []);

  const signUp = useCallback(async ({ name, email, password }: SignUpInput) => {
    try {
      const supabase = getSupabaseBrowserClient();
      return await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
    } catch (error) {
      throw new Error(getAuthErrorMessage(error, "Nao foi possivel criar sua conta. Tente outro e-mail."));
    }
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
