"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import EmbeddedSignupButton from "@/components/whatsapp/embedded-signup-button";
import { supabase } from "@/lib/supabase";

type ConnectionPayload = {
  embeddedSignup: { enabled: boolean };
  connection: null | {
    id: string;
    status: string;
    source: string;
    businessName: string;
    verifiedName: string | null;
    displayPhone: string | null;
    phoneNumberId: string;
    wabaId: string;
    qualityRating: string | null;
    messagingLimitTier: string | null;
    lastHealthcheckAt: string | null;
    lastErrorType: string | null;
    needsReauthorization: boolean;
    updatedAt: string;
  };
};

async function request(path: string, init?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");
  const response = await fetch(path, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...init?.headers }, cache: "no-store" });
  const body = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Não foi possível concluir a solicitação.");
  return body;
}

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "Ainda não verificada";
}

const statusLabels: Record<string, string> = { connected: "Conectada", pending: "Pendente", needs_reauth: "Precisa reautorizar", disconnected: "Desconectada", failed: "Com erro", disabled: "Desabilitada" };

export default function WhatsAppConfigurationPage() {
  const [data, setData] = useState<ConnectionPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setData(await request("/api/whatsapp/connection") as ConnectionPayload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao carregar a integração.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  async function disconnect() {
    if (!window.confirm("Desconectar esta integração? O histórico será preservado e novos envios serão bloqueados.")) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      const body = await request("/api/whatsapp/connection/disconnect", { method: "POST", body: "{}" });
      setSuccess(typeof body.message === "string" ? body.message : "Integração desconectada.");
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao desconectar.");
    } finally { setBusy(false); }
  }

  const connection = data?.connection;
  const connected = connection?.status === "connected";
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#090d12] px-4 py-6 text-slate-100">
        <section className="mx-auto max-w-4xl">
          <header className="mb-5 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#101821] p-5 md:flex-row md:items-center md:justify-between">
            <div><p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Configuração segura</p><h1 className="mt-2 text-2xl font-black">WhatsApp Business</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Conecte sua conta oficial do WhatsApp Business para receber mensagens e enviar respostas aprovadas pelo app.</p></div>
            <div className="flex flex-wrap gap-2"><Link href="/dashboard/whatsapp" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold">Conversas</Link><Link href="/dashboard/whatsapp/templates" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold">Templates</Link></div>
          </header>
          {error ? <div role="alert" className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</div> : null}
          {success ? <div role="status" className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">{success}</div> : null}
          {loading ? <div className="rounded-xl border border-white/10 bg-[#101821] p-5 text-sm text-slate-400">Verificando conexão...</div> : (
            <div className="grid gap-5">
              <section className="rounded-xl border border-white/10 bg-[#101821] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase text-slate-500">Status da conexão</p><h2 className={`mt-1 text-xl font-black ${connected ? "text-emerald-300" : "text-amber-300"}`}>{connection ? statusLabels[connection.status] || connection.status : "Não conectada"}</h2></div>{connected ? <button type="button" disabled={busy} onClick={() => void disconnect()} className="rounded-lg border border-red-300/30 px-4 py-2 text-sm font-bold text-red-200 disabled:opacity-50">Desconectar</button> : null}</div>
                {connection ? <div className="mt-5 grid gap-3 sm:grid-cols-2"><p className="rounded-lg bg-white/[0.04] p-3 text-sm">Negócio: <strong>{connection.verifiedName || connection.businessName}</strong></p><p className="rounded-lg bg-white/[0.04] p-3 text-sm">Telefone: <code className="text-emerald-300">{connection.displayPhone || "não informado"}</code></p><p className="rounded-lg bg-white/[0.04] p-3 text-sm">Phone Number ID: <code className="text-emerald-300">{connection.phoneNumberId}</code></p><p className="rounded-lg bg-white/[0.04] p-3 text-sm">Business Account ID: <code className="text-emerald-300">{connection.wabaId}</code></p><p className="rounded-lg bg-white/[0.04] p-3 text-sm">Última verificação: {formatDate(connection.lastHealthcheckAt)}</p><p className="rounded-lg bg-white/[0.04] p-3 text-sm">Qualidade: {connection.qualityRating || "não informada"}</p></div> : null}
                <div className="mt-5 flex flex-wrap gap-3">
                  {!connection || connection.status === "disconnected" || connection.status === "failed" ? <EmbeddedSignupButton onComplete={() => void load()} /> : null}
                  {connection?.needsReauthorization ? <EmbeddedSignupButton mode="reauthorize" onComplete={() => void load()} /> : null}
                  {connected ? <Link href="/dashboard/whatsapp/templates" className="rounded-lg border border-emerald-400/30 px-5 py-3 text-sm font-black text-emerald-300">Sincronizar templates</Link> : null}
                </div>
              </section>
              {!data?.embeddedSignup.enabled ? <section className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-5"><h2 className="font-black text-amber-200">Embedded Signup desabilitado</h2><p className="mt-2 text-sm leading-6 text-amber-100/80">Configure as variáveis da Meta, a chave de criptografia e a flag do recurso no servidor. A conexão global por ambiente continua disponível apenas como fallback legado controlado.</p><Link href="/dashboard/whatsapp/onboarding" className="mt-3 inline-block text-sm font-bold underline">Ver pré-requisitos</Link></section> : null}
              <section className="rounded-xl border border-white/10 bg-[#101821] p-5"><h2 className="font-black">Uso responsável</h2><p className="mt-3 text-sm leading-6 text-slate-300">O AtendeZap IA não faz disparos automáticos.</p><p className="text-sm leading-6 text-slate-300">Você continua responsável por respeitar opt-in, políticas da Meta e janela de atendimento.</p><p className="mt-2 text-sm text-slate-400">Tokens ficam somente no servidor, criptografados e isolados por usuário. Desconectar preserva o histórico, mas bloqueia novos envios.</p></section>
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
