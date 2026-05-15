"use client";

import { useEffect, useState } from "react";
import { getSupabasePublicDiagnostic, supabase } from "@/lib/supabase/browser";

type Status = "pending" | "success" | "error" | "skipped";

type Check = {
  label: string;
  status: Status;
  message: string;
};

const protectedTables = ["profiles", "businesses", "generated_responses", "customers", "subscriptions"] as const;

function statusClass(status: Status) {
  if (status === "success") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-100";
  if (status === "error") return "border-red-400/30 bg-red-500/10 text-red-100";
  if (status === "skipped") return "border-amber-400/30 bg-amber-400/10 text-amber-100";
  return "border-white/10 bg-white/[0.04] text-slate-200";
}

function messageFromError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export default function SupabaseDebugPage() {
  const diagnostic = getSupabasePublicDiagnostic();
  const [checks, setChecks] = useState<Check[]>([
    { label: "supabase.auth.getSession()", status: "pending", message: "Aguardando..." },
    { label: "plans select limit 1", status: "pending", message: "Aguardando..." },
    ...protectedTables.map((table) => ({ label: `${table} select limit 1`, status: "pending" as Status, message: "Aguardando..." }))
  ]);

  useEffect(() => {
    let cancelled = false;

    function update(label: string, status: Status, message: string) {
      if (cancelled) return;
      setChecks((current) => current.map((check) => (check.label === label ? { ...check, status, message } : check)));
    }

    async function runDiagnostics() {
      let userId = "";

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          update("supabase.auth.getSession()", "error", error.message);
        } else {
          userId = data.session?.user.id ?? "";
          update("supabase.auth.getSession()", "success", data.session ? "Sessao ativa." : "Sem sessao ativa.");
        }
      } catch (error) {
        update("supabase.auth.getSession()", "error", messageFromError(error));
      }

      try {
        const { error } = await supabase.from("plans").select("id,name").limit(1);
        update("plans select limit 1", error ? "error" : "success", error?.message ?? "Tabela plans respondeu.");
      } catch (error) {
        update("plans select limit 1", "error", messageFromError(error));
      }

      for (const table of protectedTables) {
        const label = `${table} select limit 1`;

        if (!userId) {
          update(label, "skipped", "Requer usuario logado para testar com RLS autenticada.");
          continue;
        }

        try {
          const query = table === "profiles"
            ? supabase.from(table).select("id").eq("id", userId).limit(1)
            : supabase.from(table).select("id").eq("user_id", userId).limit(1);
          const { error } = await query;
          update(label, error ? "error" : "success", error?.message ?? `Tabela ${table} respondeu para o usuario logado.`);
        } catch (error) {
          update(label, "error", messageFromError(error));
        }
      }
    }

    void runDiagnostics();

    return () => {
      cancelled = true;
    };
  }, []);

  const envRows = [
    ["Supabase URL", diagnostic.url || "Nao configurada"],
    ["Has URL", String(diagnostic.hasUrl)],
    ["Has anon key", String(diagnostic.hasAnonKey)],
    ["Anon key length", String(diagnostic.anonKeyLength)]
  ];

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-10 text-slate-100">
      <section className="mx-auto max-w-4xl rounded-lg border border-white/10 bg-[#101821] p-6 shadow-2xl shadow-black/30">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Pagina de diagnostico</p>
        <h1 className="mt-2 text-3xl font-black text-white">Diagnostico Supabase</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Esta pagina nao mostra secrets, anon key completa, tokens de sessao ou dados sensiveis. Use apenas para validar ambiente e RLS.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {envRows.map(([label, value]) => (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={label}>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-2 break-words font-mono text-sm text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3">
          {checks.map((check) => (
            <article className={`rounded-lg border p-4 ${statusClass(check.status)}`} key={check.label}>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h2 className="font-black text-white">{check.label}</h2>
                <span className="rounded-full border border-current px-3 py-1 text-xs font-black uppercase">{check.status}</span>
              </div>
              <p className="mt-2 break-words font-mono text-sm">{check.message}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
