"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/authStorage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("atendezap-auth-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("atendezap-auth-change", callback);
  };
}

function getSnapshot() {
  return isAuthenticated();
}

function getServerSnapshot() {
  return false;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authenticated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!authenticated) {
      router.replace("/acesso");
    }
  }, [authenticated, router]);

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090d12] px-4 text-slate-100">
        <div className="rounded-lg border border-white/10 bg-[#101821] p-6 text-center shadow-2xl shadow-black/30">
          <p className="text-sm font-bold text-slate-300">Verificando acesso...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
