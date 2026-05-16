'use client';

import { useEffect, useState } from 'react';
import { supabase, supabaseEnv } from '@/lib/supabase';

type TestResult = {
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
};

export default function SupabaseDebugPage() {
  const [tests, setTests] = useState<TestResult[]>([
    {
      name: 'getSession',
      status: 'loading',
      message: 'Testando sessão...',
    },
    {
      name: 'plans select',
      status: 'loading',
      message: 'Testando tabela plans...',
    },
  ]);

  useEffect(() => {
    async function runTests() {
      const results: TestResult[] = [];

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          results.push({
            name: 'getSession',
            status: 'error',
            message: error.message,
          });
        } else {
          results.push({
            name: 'getSession',
            status: 'success',
            message: data.session
              ? `Sessão encontrada para ${data.session.user.email ?? 'usuário logado'}`
              : 'Sem sessão ativa. Isso é normal se você não está logada.',
          });
        }
      } catch (error) {
        results.push({
          name: 'getSession',
          status: 'error',
          message: error instanceof Error ? error.message : 'Erro desconhecido em getSession.',
        });
      }

      try {
        const { data, error } = await supabase.from('plans').select('id, name').limit(1);

        if (error) {
          results.push({
            name: 'plans select',
            status: 'error',
            message: error.message,
          });
        } else {
          results.push({
            name: 'plans select',
            status: 'success',
            message: `Consulta funcionou. Registros retornados: ${data?.length ?? 0}.`,
          });
        }
      } catch (error) {
        results.push({
          name: 'plans select',
          status: 'error',
          message: error instanceof Error ? error.message : 'Erro desconhecido em plans select.',
        });
      }

      setTests(results);
    }

    runTests();
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
            <InfoRow label="Has URL" value={String(supabaseEnv.hasUrl)} />
            <InfoRow label="URL" value={supabaseEnv.url ?? 'Não configurada'} />
            <InfoRow label="Has anon key" value={String(supabaseEnv.hasAnonKey)} />
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
                      test.status === 'success'
                        ? 'text-emerald-300'
                        : test.status === 'error'
                          ? 'text-red-300'
                          : 'text-yellow-300'
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
            <li>
              Se <strong>Has anon key</strong> for false, o arquivo .env.local está errado ou o
              servidor não foi reiniciado.
            </li>
            <li>
              Se <strong>plans select</strong> falhar com tabela inexistente, o SQL ainda não foi
              aplicado no Supabase.
            </li>
            <li>
              Se aparecer <strong>Failed to fetch</strong>, teste a URL do Supabase no navegador e
              confira internet, firewall, extensão e chave anon public.
            </li>
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