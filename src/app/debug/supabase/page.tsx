"use client";

import { useEffect, useState } from "react";
import { getSupabasePublicDiagnostic, supabase } from "@/lib/supabase/browser";

type CheckState = {
  getSessionStatus: "pending" | "success" | "error";
  authStatus: "pending" | "success" | "error";
  hasSession: boolean;
  errorMessage: string;
  authMessage: string;
};

const initialState: CheckState = {
  getSessionStatus: "pending",
  authStatus: "pending",
  hasSession: false,
  errorMessage: "",
  authMessage: ""
};

export default function SupabaseDebugPage() {
  const diagnostic = getSupabasePublicDiagnostic();
  const [check, setCheck] = useState<CheckState>(initialState);

  useEffect(() => {
    let cancelled = false;

    async function runDiagnostics() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (cancelled) return;

        setCheck((current) => ({
          ...current,
          getSessionStatus: error ? "error" : "success",
          hasSession: Boolean(data.session),
          errorMessage: error?.message ?? ""
        }));
      } catch (error) {
        if (cancelled) return;

        setCheck((current) => ({
          ...current,
          getSessionStatus: "error",
          errorMessage: error instanceof Error ? error.message : String(error)
        }));
      }

      try {
        const { data, error } = await supabase.auth.getUser();

        if (cancelled) return;

        setCheck((current) => ({
          ...current,
          authStatus: error ? "error" : "success",
          authMessage: error?.message ?? (data.user ? "Usuario autenticado." : "Sem usuario autenticado.")
        }));
      } catch (error) {
        if (cancelled) return;

        setCheck((current) => ({
          ...current,
          authStatus: "error",
          authMessage: error instanceof Error ? error.message : String(error)
        }));
      }
    }

    void runDiagnostics();

    return () => {
      cancelled = true;
    };
  }, []);

  const rows = [
    ["Supabase URL", diagnostic.url || "Nao configurada"],
    ["Has URL", String(diagnostic.hasUrl)],
    ["Has anon key", String(diagnostic.hasAnonKey)],
    ["Anon key length", String(diagnostic.anonKeyLength)],
    ["getSession status", check.getSessionStatus],
    ["Has session", String(check.hasSession)],
    ["Auth check status", check.authStatus],
    ["Mensagem de erro", check.errorMessage || check.authMessage || "Sem erro"]
  ];

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-10 text-slate-100">
      <section className="mx-auto max-w-3xl rounded-lg border border-white/10 bg-[#101821] p-6 shadow-2xl shadow-black/30">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Debug temporario</p>
        <h1 className="mt-2 text-3xl font-black text-white">Diagnostico Supabase</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Esta pagina mostra apenas metadados seguros das variaveis publicas e o resultado das chamadas de Auth.
        </p>

        <dl className="mt-6 divide-y divide-white/10 rounded-lg border border-white/10">
          {rows.map(([label, value]) => (
            <div className="grid gap-2 p-4 md:grid-cols-[220px_1fr]" key={label}>
              <dt className="text-sm font-black text-slate-300">{label}</dt>
              <dd className="break-words font-mono text-sm text-white">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
