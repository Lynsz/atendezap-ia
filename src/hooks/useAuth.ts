'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseEnv } from '@/lib/supabase';

export const SUPABASE_CONNECTION_ERROR =
  'Não foi possível conectar ao Supabase. Confira NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, internet, navegador e se o projeto Supabase está ativo.';

type AuthResult = {
  error: string | null;
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
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[Supabase getSession error]', error);
        }

        if (!mounted) return;

        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('[Supabase getSession failed]', {
          error,
          env: supabaseEnv,
        });
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
      try {
        const { error } = await supabase.auth.signUp({
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

        return { error: null };
      } catch (error) {
        console.error('[Supabase signUp failed]', {
          error,
          env: supabaseEnv,
        });

        return {
          error: normalizeAuthError(error),
        };
      }
    },
    [normalizeAuthError],
  );

  const signIn = useCallback(
    async ({ email, password }: SignInData): Promise<AuthResult> => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error: error.message };
        }

        return { error: null };
      } catch (error) {
        console.error('[Supabase signIn failed]', {
          error,
          env: supabaseEnv,
        });

        return {
          error: normalizeAuthError(error),
        };
      }
    },
    [normalizeAuthError],
  );

  const signOut = useCallback(async (): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('[Supabase signOut failed]', error);

      return {
        error: normalizeAuthError(error),
      };
    }
  }, [normalizeAuthError]);

  return useMemo(
    () => ({
      session,
      user,
      loading,
      isAuthenticated: Boolean(user),
      signUp,
      signIn,
      signOut,
    }),
    [session, user, loading, signUp, signIn, signOut],
  );
}