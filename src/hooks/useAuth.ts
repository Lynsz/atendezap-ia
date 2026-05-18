'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseEnv } from '@/lib/supabase';

export const SUPABASE_CONNECTION_ERROR =
  'Não foi possível conectar ao Supabase. Confira NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, internet, navegador e se o projeto Supabase está ativo.';

type AuthResult = {
  error: string | null;
  data?: {
    user: User | null;
    session: Session | null;
  };
};

type SignUpData = {
  name?: string;
  email: string;
  password: string;
};

type SignInData = {
  email: string;
  password: string;
};

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isConfigured = supabaseEnv.hasUrl && supabaseEnv.hasAnonKey;

  const normalizeAuthError = useCallback((error: unknown) => {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return [
        SUPABASE_CONNECTION_ERROR,
        `Diagnóstico: hasUrl=${supabaseEnv.hasUrl}, hasAnonKey=${supabaseEnv.hasAnonKey}, anonKeyLength=${supabaseEnv.anonKeyLength}.`,
      ].join(' ');
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Erro inesperado de autenticação.';
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        if (!supabaseEnv.hasUrl || !supabaseEnv.hasAnonKey) {
          if (mounted) {
            setLoading(false);
          }

          return;
        }

        const { data } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      } catch {
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(
    async ({ name, email, password }: SignUpData): Promise<AuthResult> => {
      if (!isConfigured) {
        return { error: SUPABASE_CONNECTION_ERROR };
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name ?? '',
            },
          },
        });

        if (error) {
          return { error: error.message };
        }

        return { error: null, data };
      } catch (error) {
        return {
          error: normalizeAuthError(error),
          data: {
            user: null,
            session: null,
          },
        };
      }
    },
    [isConfigured, normalizeAuthError],
  );

  const signIn = useCallback(
    async ({ email, password }: SignInData): Promise<AuthResult> => {
      if (!isConfigured) {
        return { error: SUPABASE_CONNECTION_ERROR };
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error: error.message };
        }

        return { error: null, data };
      } catch (error) {
        return {
          error: normalizeAuthError(error),
          data: {
            user: null,
            session: null,
          },
        };
      }
    },
    [isConfigured, normalizeAuthError],
  );

  const signOut = useCallback(async (): Promise<AuthResult> => {
    if (!isConfigured) {
      return { error: SUPABASE_CONNECTION_ERROR };
    }

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return {
        error: normalizeAuthError(error),
      };
    }
  }, [isConfigured, normalizeAuthError]);

  return useMemo(
    () => ({
      session,
      user,
      loading,
      isConfigured,
      isAuthenticated: Boolean(user),
      signUp,
      signIn,
      signOut,
    }),
    [session, user, loading, isConfigured, signUp, signIn, signOut],
  );
}
