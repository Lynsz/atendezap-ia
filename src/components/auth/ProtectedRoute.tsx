"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { loading, session, isConfigured } = useAuth();

  useEffect(() => {
    if (!loading && (!isConfigured || !session)) {
      router.replace("/login");
    }
  }, [isConfigured, loading, router, session]);

  if (loading || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090d12] px-4 text-slate-100">
        <div className="rounded-lg border border-white/10 bg-[#101821] p-6 text-center shadow-2xl shadow-black/30">
          <p className="text-sm font-bold text-slate-300">Verificando sessao...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
