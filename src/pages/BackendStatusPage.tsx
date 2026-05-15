"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  KeyRound,
  Plug,
  RefreshCw,
  Server,
  ShieldCheck,
  Smartphone,
  Wand2
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SystemStatusCard } from "@/components/system/SystemStatusCard";
import { getBackendStatus, resetBackendStatus } from "@/services/backendStatus";
import { explainCurrentDataMode, isUsingLocalStorage, isUsingSupabase, setDataProvider } from "@/services/dataAdapter";
import type { BackendStatus, DatabaseProvider } from "@/types/database";

const nextSteps = [
  "Criar projeto Supabase",
  "Criar tabelas e migrations",
  "Configurar autenticação",
  "Conectar webhook Kiwify",
  "Criar webhook de mensagens do WhatsApp",
  "Migrar dados locais"
];

const architectureItems = [
  { title: "Front-end React", description: "Interface atual em Next.js/React com fallback local.", icon: Code2 },
  { title: "Supabase Auth", description: "Autenticação futura por usuário e tenant.", icon: KeyRound },
  { title: "Supabase Database", description: "Banco relacional para leads, conversas, mensagens e assinaturas.", icon: Database },
  { title: "Webhook Kiwify", description: "Entrada segura para eventos de pagamento e assinatura.", icon: Plug },
  { title: "WhatsApp Provider", description: "Camada futura para integração real com atendimento WhatsApp.", icon: Smartphone },
  { title: "IA Provider", description: "Serviço de IA para respostas, classificação e resumos.", icon: Wand2 }
];

const plannedTables = [
  "tenants",
  "profiles",
  "organizations",
  "leads",
  "conversations",
  "messages",
  "automations",
  "subscriptions",
  "webhook_events",
  "audit_logs"
];

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function providerLabel(provider: DatabaseProvider) {
  return provider === "supabase" ? "Supabase" : "localStorage";
}

function BackendStatusContent() {
  const [status, setStatus] = useState<BackendStatus>(() => getBackendStatus());
  const dataModeExplanation = explainCurrentDataMode();

  function refresh() {
    setStatus(getBackendStatus());
  }

  function chooseProvider(provider: DatabaseProvider) {
    setDataProvider(provider);
    refresh();
  }

  function handleReset() {
    resetBackendStatus();
    refresh();
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-8 text-slate-100">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                <Server className="h-4 w-4" />
                Sistema
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Status do Backend</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Acompanhe a estrutura de dados e preparação para Supabase.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => chooseProvider("localStorage")}
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-emerald-400 px-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
              >
                Usar localStorage
              </button>
              <button
                type="button"
                onClick={() => chooseProvider("supabase")}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 transition hover:bg-white/10"
              >
                Simular Supabase
              </button>
            </div>
          </div>
        </header>

        <div className="mb-6 rounded-lg border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
          Esta tela é apenas preparatória. Nenhuma conexão real com Supabase foi feita ainda.
        </div>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SystemStatusCard
            title="Provider atual"
            value={providerLabel(status.provider)}
            status={isUsingLocalStorage() ? "info" : "warning"}
            icon={Database}
            description={dataModeExplanation}
          />
          <SystemStatusCard
            title="Modo"
            value={status.mode}
            status={status.mode === "production" ? "warning" : "info"}
            icon={Cloud}
            description="Modo de operação planejado para o adaptador de dados."
          />
          <SystemStatusCard
            title="Conectado"
            value={status.isConnected ? "Sim" : "Não"}
            status={status.isConnected ? "ok" : "warning"}
            icon={status.isConnected ? CheckCircle2 : AlertTriangle}
            description={status.message}
          />
          <SystemStatusCard
            title="Última verificação"
            value={formatDateTime(status.lastCheckedAt)}
            status="info"
            icon={RefreshCw}
            description="Atualizado localmente quando o modo de dados é alterado."
          />
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              Próxima etapa técnica
            </h2>
            <ol className="grid gap-3 text-sm leading-6 text-slate-300">
              {nextSteps.map((step, index) => (
                <li className="rounded-md border border-white/10 bg-white/[0.04] p-3" key={step}>
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white">
              <Server className="h-5 w-5 text-emerald-300" />
              Arquitetura futura
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {architectureItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={item.title}>
                    <Icon className="mb-3 h-5 w-5 text-emerald-300" />
                    <h3 className="font-black text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/25">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-black text-white">
                <Database className="h-5 w-5 text-emerald-300" />
                Tabelas planejadas
              </h2>
              <p className="mt-2 text-sm text-slate-500">Modelo futuro multi-tenant para sair do localStorage.</p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 transition hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              Resetar status
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {plannedTables.map((table) => (
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={table}>
                <p className="font-mono text-sm font-black text-emerald-200">{table}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-sky-400/20 bg-sky-400/10 p-4 text-sm leading-6 text-sky-100">
            Supabase está apenas planejado. O app atual continua usando localStorage como fallback para módulos de atendimento,
            leads, automações, assinatura, configurações e integrações simuladas.
          </div>

          <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-300">
            Modo atual detectado: {isUsingSupabase() ? "Supabase simulado, sem conexão real." : "localStorage demo."}
          </div>
        </section>
      </section>
    </main>
  );
}

export default function BackendStatusPage() {
  return (
    <ProtectedRoute>
      <BackendStatusContent />
    </ProtectedRoute>
  );
}
