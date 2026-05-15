"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabasePublicDiagnostic, isSupabaseBrowserConfigured, supabase } from "@/lib/supabase/browser";

type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

export const SUPABASE_CONNECTION_ERROR =
  "Não foi possível conectar ao Supabase. Confira NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, internet, navegador e se o projeto Supabase está ativo.";

function withDiagnostic(message: string) {
  const diagnostic = getSupabasePublicDiagnostic();
  return `${message} hasUrl=${diagnostic.hasUrl}; hasAnonKey=${diagnostic.hasAnonKey}; anonKeyLength=${diagnostic.anonKeyLength}.`;
}

function getAuthErrorMessage(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (error instanceof TypeError && message.includes("fetch")) {
    return withDiagnostic(SUPABASE_CONNECTION_ERROR);
  }

  if (message.includes("failed to fetch") || message.includes("network") || message.includes("fetch failed")) {
    return withDiagnostic(SUPABASE_CONNECTION_ERROR);
  }

  return fallback;
}

async function assertSupabaseConnection() {
  try {
    const { data, error } = await supabase.auth.getSession();

    console.info("[Supabase getSession diagnostic]", {
      ok: !error,
      hasSession: Boolean(data.session),
      env: getSupabasePublicDiagnostic(),
      errorMessage: error?.message ?? null
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.info("[Supabase getSession diagnostic]", {
      ok: false,
      env: getSupabasePublicDiagnostic(),
      errorKind: error instanceof TypeError ? "connection" : "env_or_auth",
      errorMessage: error instanceof Error ? error.message : String(error)
    });

    throw new Error(getAuthErrorMessage(error, SUPABASE_CONNECTION_ERROR));
  }
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
      await assertSupabaseConnection();
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (error) {
      throw new Error(getAuthErrorMessage(error, "Nao foi possivel entrar. Confira seus dados."));
    }
  }, []);

  const signUp = useCallback(async ({ name, email, password }: SignUpInput) => {
    try {
      await assertSupabaseConnection();
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
