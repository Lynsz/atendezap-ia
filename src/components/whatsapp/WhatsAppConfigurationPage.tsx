"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { supabase } from "@/lib/supabase";

type StatusPayload = {
  environment: { enabled: boolean; configured: boolean; signatureValidation: boolean; missing: string[]; phoneNumberIdMasked: string | null; businessAccountIdMasked: string | null };
  connection: { id: string; business_name: string; display_phone_number: string | null; status: string; updated_at: string } | null;
};

async function authenticatedRequest(path: string, init?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.access_token) throw new Error("Sessão expirada. Faça login novamente.");
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}`, ...init?.headers },
    cache: "no-store"
  });
  const body = (await response.json().catch(() => ({}))) as StatusPayload & { error?: string };
  if (!response.ok) throw new Error(body.error || "Não foi possível concluir a configuração.");
  return body;
}

export default function WhatsAppConfigurationPage() {
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const callbackUrl = typeof window === "undefined" ? "/api/whatsapp/webhook" : `${window.location.origin}/api/whatsapp/webhook`;

  const load = useCallback(async () => {
    try {
      const body = await authenticatedRequest("/api/whatsapp/status");
      setStatus(body);
      setBusinessName(body.connection?.business_name || "");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao verificar a integração.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  async function activate(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await authenticatedRequest("/api/whatsapp/status", { method: "POST", body: JSON.stringify({ businessName }) });
      setSuccess("Conexão ativada para esta conta.");
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao ativar a conexão.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#090d12] px-4 py-6 text-slate-100">
        <section className="mx-auto max-w-4xl">
          <header className="mb-5 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#101821] p-5 md:flex-row md:items-center md:justify-between">
            <div><p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Configuração segura</p><h1 className="mt-2 text-2xl font-black">WhatsApp Cloud API</h1><p className="mt-1 text-sm text-slate-400">As credenciais ficam somente no ambiente do servidor e nunca aparecem aqui.</p></div>
            <div className="flex gap-2"><Link href="/dashboard" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold">Dashboard</Link><Link href="/dashboard/whatsapp" className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950">Conversas</Link></div>
          </header>
          {error ? <div role="alert" className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</div> : null}
          {success ? <div role="status" className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">{success}</div> : null}
          {loading ? <div className="rounded-xl border border-white/10 bg-[#101821] p-5 text-sm text-slate-400">Verificando configuração...</div> : status ? <div className="grid gap-5">
            <section className="grid gap-3 sm:grid-cols-3">
              <article className="rounded-xl border border-white/10 bg-[#101821] p-4"><p className="text-xs uppercase text-slate-500">Recurso</p><strong className={status.environment.enabled ? "text-emerald-300" : "text-amber-300"}>{status.environment.enabled ? "Habilitado" : "Desabilitado"}</strong></article>
              <article className="rounded-xl border border-white/10 bg-[#101821] p-4"><p className="text-xs uppercase text-slate-500">Ambiente</p><strong className={status.environment.configured ? "text-emerald-300" : "text-amber-300"}>{status.environment.configured ? "Completo" : "Incompleto"}</strong></article>
              <article className="rounded-xl border border-white/10 bg-[#101821] p-4"><p className="text-xs uppercase text-slate-500">Assinatura HMAC</p><strong className={status.environment.signatureValidation ? "text-emerald-300" : "text-amber-300"}>{status.environment.signatureValidation ? "Ativa" : "Opcional não configurada"}</strong></article>
            </section>
            <section className="rounded-xl border border-white/10 bg-[#101821] p-5"><h2 className="text-lg font-black">Identificadores configurados</h2><div className="mt-3 grid gap-3 sm:grid-cols-2"><p className="rounded-lg bg-white/[0.04] p-3 text-sm text-slate-300">Phone Number ID: <code className="text-emerald-300">{status.environment.phoneNumberIdMasked || "não configurado"}</code></p><p className="rounded-lg bg-white/[0.04] p-3 text-sm text-slate-300">Business Account ID: <code className="text-emerald-300">{status.environment.businessAccountIdMasked || "não configurado"}</code></p></div></section>
            {!status.environment.configured ? <section className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-5"><h2 className="font-black text-amber-200">Configuração do servidor pendente</h2><p className="mt-2 text-sm text-amber-100/80">Adicione as variáveis ausentes na Vercel ou em .env.local, sem versionar valores reais:</p><code className="mt-3 block break-words text-xs text-amber-200">{status.environment.missing.join(", ") || "WHATSAPP_ENABLED"}</code></section> : null}
            <section className="rounded-xl border border-white/10 bg-[#101821] p-5"><h2 className="text-lg font-black">1. Vincular a conexão à conta</h2><p className="mt-1 text-sm text-slate-400">Isto registra apenas os identificadores já configurados no servidor. Nenhum token é retornado ao navegador.</p><form onSubmit={activate} className="mt-4 flex flex-col gap-3 sm:flex-row"><input value={businessName} onChange={(event) => setBusinessName(event.target.value)} minLength={2} maxLength={160} required placeholder="Nome do negócio" className="min-h-11 flex-1 rounded-lg border border-white/10 bg-[#090d12] px-3 text-sm" /><button disabled={saving || !status.environment.configured} className="rounded-lg bg-emerald-400 px-5 py-2 text-sm font-black text-slate-950 disabled:opacity-40">{saving ? "Ativando..." : status.connection ? "Atualizar conexão" : "Ativar conexão"}</button></form>{status.connection ? <p className="mt-3 text-sm text-emerald-300">Status atual: {status.connection.status} {status.connection.display_phone_number ? `· ${status.connection.display_phone_number}` : ""}</p> : null}</section>
            <section className="rounded-xl border border-white/10 bg-[#101821] p-5"><h2 className="text-lg font-black">2. Configurar o webhook na Meta</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300"><li>Use esta URL de callback: <code className="break-all text-emerald-300">{callbackUrl}</code></li><li>Informe na Meta exatamente o mesmo valor de <code>WHATSAPP_VERIFY_TOKEN</code> salvo no servidor.</li><li>Assine o campo <code>messages</code> do WhatsApp Business Account.</li><li>Envie uma mensagem real de teste para o número e confirme que ela aparece na caixa de entrada.</li></ol></section>
            <section className="rounded-xl border border-white/10 bg-[#101821] p-5"><h2 className="text-lg font-black">Limites desta fase</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300"><li>Somente mensagens de texto são respondidas.</li><li>A IA apenas sugere; o atendente revisa e clica em enviar.</li><li>Mensagens livres são bloqueadas fora da janela de atendimento de 24 horas.</li><li>Contatos com opt-out são bloqueados no servidor.</li><li>Não há disparo em massa, automação de vendas nem WhatsApp Web não oficial.</li></ul></section>
          </div> : null}
        </section>
      </main>
    </ProtectedRoute>
  );
}
