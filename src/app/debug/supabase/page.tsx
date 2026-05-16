"use client";

import { useEffect, useState } from "react";
import { supabase, supabaseEnv } from "@/lib/supabase";

type TestStatus = "loading" | "success" | "error" | "skipped";

type TestResult = {
  name: string;
  status: TestStatus;
  message: string;
};

const protectedTables = [
  { name: "profiles", columns: "id", filterColumn: "id" },
  { name: "businesses", columns: "id", filterColumn: "user_id" },
  { name: "subscriptions", columns: "id, plan_name, status", filterColumn: "user_id" },
  { name: "generated_responses", columns: "id", filterColumn: "user_id" },
  { name: "customers", columns: "id", filterColumn: "user_id" }
];

function initialTests(): TestResult[] {
  return [
    "getSession",
    "plans select",
    "profiles select",
    "businesses select",
    "subscriptions select",
    "generated_responses select",
    "customers select"
  ].map((name) => ({
    name,
    status: "loading",
    message: "Aguardando teste..."
  }));
}

export default function SupabaseDebugPage() {
  const [tests, setTests] = useState<TestResult[]>(initialTests);

  useEffect(() => {
    async function runTests() {
      const results: TestResult[] = [];

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          results.push({
            name: "getSession",
            status: "error",
            message: error.message
          });
        } else {
          const session = data.session;
          results.push({
            name: "getSession",
            status: "success",
            message: session
              ? `Sessão encontrada para ${session.user.email ?? "usuário logado"}.`
              : "Sem sessão ativa. Isso é normal antes de fazer login."
          });

          const { data: plansData, error: plansError } = await supabase.from("plans").select("id, name").limit(1);
          results.push({
            name: "plans select",
            status: plansError ? "error" : "success",
            message: plansError ? plansError.message : `Consulta funcionou. Registros retornados: ${plansData?.length ?? 0}.`
          });

          if (!session?.user) {
            protectedTables.forEach((table) => {
              results.push({
                name: `${table.name} select`,
                status: "skipped",
                message: "Faça login para testar esta tabela protegida por RLS."
              });
            });
            setTests(results);
            return;
          }

          for (const table of protectedTables) {
            const { data: tableData, error: tableError } = await supabase
              .from(table.name)
              .select(table.columns)
              .eq(table.filterColumn, session.user.id)
              .limit(1);

            results.push({
              name: `${table.name} select`,
              status: tableError ? "error" : "success",
              message: tableError ? tableError.message : `Consulta funcionou. Registros retornados: ${tableData?.length ?? 0}.`
            });
          }
        }
      } catch (error) {
        results.push({
          name: "debug geral",
          status: "error",
          message: error instanceof Error ? error.message : "Erro desconhecido ao testar Supabase."
        });
      }

      setTests(results);
    }

    void runTests();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-medium text-emerald-300">AtendeZap IA</p>
          <h1 className="mt-2 text-3xl font-bold">Debug Supabase</h1>
          <p className="mt-2 text-slate-300">
            Esta página serve apenas para diagnóstico. Ela não mostra tokens nem chaves completas.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Variáveis de ambiente</h2>

          <div className="mt-4 grid gap-3 text-sm">
            <InfoRow label="Env URL existe" value={String(supabaseEnv.hasUrl)} />
            <InfoRow label="URL" value={supabaseEnv.url ? "Configurada" : "Não configurada"} />
            <InfoRow label="Env anon key existe" value={String(supabaseEnv.hasAnonKey)} />
            <InfoRow label="Anon key length" value={String(supabaseEnv.anonKeyLength)} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Testes</h2>

          <div className="mt-4 space-y-3">
            {tests.map((test) => (
              <div
                key={test.name}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium">{test.name}</h3>
                  <span
                    className={
                      test.status === "success"
                        ? "text-emerald-300"
                        : test.status === "error"
                          ? "text-red-300"
                          : test.status === "skipped"
                            ? "text-slate-400"
                            : "text-yellow-300"
                    }
                  >
                    {test.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{test.message}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-sm text-yellow-100">
          <h2 className="font-semibold">Como interpretar</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Se a anon key estiver ausente, revise `.env.local` e reinicie o servidor.</li>
            <li>Se `plans select` falhar com tabela inexistente, aplique `supabase/schema.sql`.</li>
            <li>Se uma tabela protegida falhar após login, revise RLS e policies no Supabase.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950 p-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="break-all font-mono text-slate-100">{value}</span>
    </div>
  );
}
