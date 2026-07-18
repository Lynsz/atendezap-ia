"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { supabase } from "@/lib/supabase";

type Contact = { id: string; display_name: string | null; phone_number: string; opt_in_status: string };
type Conversation = { id: string; status: string; customer_service_window_until: string | null; updated_at: string; contact: Contact | null };
type Message = { id: string; direction: "inbound" | "outbound"; message_type: string; text: string | null; status: string; created_at: string };
type Suggestion = { id: string; suggested_text: string; status: string; created_at: string };
type WhatsAppTemplate = { id: string; name: string; language: string; category: string | null; status: string; variables_count: number };

class WhatsAppApiError extends Error {
  constructor(message: string, public retryable = false, public errorType: string | null = null) {
    super(message);
    this.name = "WhatsAppApiError";
  }
}

async function api(path: string, init?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...init?.headers },
    cache: "no-store"
  });
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    throw new WhatsAppApiError(
      typeof body.error === "string" ? body.error : "Não foi possível concluir a solicitação.",
      body.retryable === true,
      typeof body.error_type === "string" ? body.error_type : null
    );
  }
  return body;
}

function formatDate(value: string | null | undefined) {
  return value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "—";
}

export default function WhatsAppDashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [windowUntil, setWindowUntil] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState<string | undefined>();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [templateVariables, setTemplateVariables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [canRetry, setCanRetry] = useState(false);
  const [retryKind, setRetryKind] = useState<"text" | "template" | null>(null);
  const [integrationStatus, setIntegrationStatus] = useState("verificando");
  const [currentTime, setCurrentTime] = useState(0);
  const windowOpen = Boolean(windowUntil && currentTime > 0 && new Date(windowUntil).getTime() > currentTime);

  const reportError = useCallback((requestError: unknown, fallback: string, kind: "text" | "template" | null = null) => {
    setError(requestError instanceof Error ? requestError.message : fallback);
    setCanRetry(requestError instanceof WhatsAppApiError && requestError.retryable);
    setRetryKind(requestError instanceof WhatsAppApiError && requestError.retryable ? kind : null);
  }, []);

  const loadConversations = useCallback(async () => {
    setError("");
    try {
      const [body, statusBody, templatesBody] = await Promise.all([
        api("/api/whatsapp/conversations"),
        api("/api/whatsapp/status"),
        api("/api/whatsapp/templates").catch(() => ({ templates: [] }))
      ]);
      const items = (body.conversations || []) as Conversation[];
      const status = statusBody as { environment?: { enabled?: boolean; configured?: boolean }; connection?: { status?: string } | null };
      setIntegrationStatus(status.environment?.enabled && status.environment?.configured && status.connection?.status === "active" ? "ativa" : "não configurada");
      setConversations(items);
      setTemplates((templatesBody.templates || []) as WhatsAppTemplate[]);
      setSelectedId((current) => current || items[0]?.id || null);
    } catch (requestError) {
      reportError(requestError, "Falha ao carregar conversas.");
    } finally {
      setLoading(false);
    }
  }, [reportError]);

  const loadConversation = useCallback(async (id: string) => {
    setError("");
    try {
      const body = await api(`/api/whatsapp/conversations/${id}/messages`);
      const conversation = body.conversation as { customer_service_window_until: string | null };
      setMessages((body.messages || []) as Message[]);
      setSuggestions((body.suggestions || []) as Suggestion[]);
      setContact((body.contact || null) as Contact | null);
      setWindowUntil(conversation.customer_service_window_until);
      setCurrentTime(Date.now());
    } catch (requestError) {
      reportError(requestError, "Falha ao carregar mensagens.");
    }
  }, [reportError]);

  useEffect(() => { void Promise.resolve().then(loadConversations); }, [loadConversations]);
  useEffect(() => { if (selectedId) void Promise.resolve().then(() => loadConversation(selectedId)); }, [loadConversation, selectedId]);
  const latestSuggestion = useMemo(() => suggestions.find((item) => item.status === "draft" || item.status === "approved"), [suggestions]);

  async function suggestReply() {
    if (!selectedId) return;
    setBusy(true); setError(""); setCanRetry(false);
    try {
      const body = await api(`/api/whatsapp/conversations/${selectedId}/suggest-reply`, { method: "POST", body: "{}" });
      const suggestion = body.suggestion as Suggestion;
      setSuggestions((items) => [suggestion, ...items]); setDraft(suggestion.suggested_text); setActiveSuggestion(suggestion.id);
    } catch (requestError) { reportError(requestError, "Falha ao gerar sugestão."); } finally { setBusy(false); }
  }

  async function sendReply() {
    if (!selectedId || !draft.trim() || busy) return;
    if (!window.confirm("Confirmar o envio desta mensagem pelo WhatsApp?")) return;
    setBusy(true); setError(""); setCanRetry(false);
    try {
      await api(`/api/whatsapp/conversations/${selectedId}/send`, {
        method: "POST",
        body: JSON.stringify({ text: draft.trim(), confirmSend: true, clientRequestId: crypto.randomUUID(), suggestedReplyId: activeSuggestion })
      });
      setDraft(""); setActiveSuggestion(undefined);
      await Promise.all([loadConversation(selectedId), loadConversations()]);
    } catch (requestError) { reportError(requestError, "Falha ao enviar resposta.", "text"); } finally { setBusy(false); }
  }

  function selectTemplate(templateId: string) {
    setSelectedTemplateId(templateId);
    const template = templates.find((item) => item.id === templateId);
    setTemplateVariables(Array.from({ length: template?.variables_count || 0 }, () => ""));
  }

  async function sendTemplate() {
    if (!selectedId || !selectedTemplateId || busy || templateVariables.some((value) => !value.trim())) return;
    if (!window.confirm("Confirmar o envio deste template aprovado pelo WhatsApp?")) return;
    setBusy(true); setError(""); setCanRetry(false);
    try {
      await api(`/api/whatsapp/conversations/${selectedId}/send-template`, {
        method: "POST",
        body: JSON.stringify({ templateId: selectedTemplateId, variables: templateVariables.map((value) => value.trim()), confirmSend: true, clientRequestId: crypto.randomUUID() })
      });
      setSelectedTemplateId(""); setTemplateVariables([]);
      await Promise.all([loadConversation(selectedId), loadConversations()]);
    } catch (requestError) { reportError(requestError, "Falha ao enviar template.", "template"); } finally { setBusy(false); }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#090d12] px-4 py-6 text-slate-100">
        <section className="mx-auto max-w-7xl">
          <header className="mb-5 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#101821] p-5 md:flex-row md:items-center md:justify-between">
            <div><p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">WhatsApp Cloud API oficial</p><h1 className="mt-2 text-2xl font-black text-white">Caixa de entrada</h1><p className="mt-1 text-sm text-slate-400">Nenhuma mensagem é enviada sem seu clique e confirmação.</p><p className={`mt-2 text-xs font-bold ${integrationStatus === "ativa" ? "text-emerald-300" : "text-amber-300"}`}>Integração: {integrationStatus}</p></div>
            <div className="flex gap-2"><Link href="/dashboard" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">Dashboard</Link><Link href="/dashboard/whatsapp/configuracao" className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950">Configurar</Link></div>
          </header>
          {error ? <div role="alert" className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"><p>{error}</p>{canRetry && retryKind ? <button disabled={busy} onClick={() => void (retryKind === "template" ? sendTemplate() : sendReply())} className="mt-2 rounded border border-red-300/30 px-3 py-1 text-xs font-bold disabled:opacity-50">Tentar novamente</button> : null}</div> : null}
          <div className="grid min-h-[650px] gap-4 lg:grid-cols-[340px_1fr]">
            <aside className="rounded-xl border border-white/10 bg-[#101821] p-3">
              <div className="mb-3 flex items-center justify-between px-2"><h2 className="font-black">Conversas</h2><button onClick={() => void loadConversations()} className="text-xs font-bold text-emerald-300">Atualizar</button></div>
              {loading ? <p className="p-3 text-sm text-slate-400">Carregando...</p> : conversations.length ? conversations.map((item) => <button key={item.id} onClick={() => setSelectedId(item.id)} className={`mb-2 w-full rounded-lg border p-3 text-left ${selectedId === item.id ? "border-emerald-400/50 bg-emerald-400/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}><div className="flex items-center justify-between gap-2"><strong className="truncate text-sm">{item.contact?.display_name || "Contato"}</strong><span className="text-[10px] uppercase text-slate-500">{item.status}</span></div><p className="mt-1 text-xs text-slate-400">Última atividade: {formatDate(item.updated_at)}</p></button>) : <p className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-slate-400">Nenhuma mensagem recebida ainda.</p>}
            </aside>
            <section className="flex min-h-[650px] flex-col rounded-xl border border-white/10 bg-[#101821]">
              {selectedId ? <>
                <div className="border-b border-white/10 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-black">{contact?.display_name || "Contato"}</h2><p className="text-xs text-slate-500">{contact?.phone_number || ""}</p><p className={`mt-1 text-xs font-bold ${contact?.opt_in_status === "opted_out" ? "text-red-300" : "text-slate-400"}`}>Opt-in: {contact?.opt_in_status || "desconhecido"}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${windowOpen ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"}`}>{windowOpen ? `Janela aberta até ${formatDate(windowUntil)}` : "Janela de 24h fechada"}</span></div></div>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">{messages.map((message) => <article key={message.id} className={`max-w-[82%] rounded-xl p-3 text-sm leading-6 ${message.direction === "outbound" ? "ml-auto bg-emerald-400 text-slate-950" : "bg-white/10 text-slate-100"}`}><p>{message.text || `[${message.message_type}]`}</p><p className={`mt-1 text-[10px] ${message.direction === "outbound" ? "text-slate-700" : "text-slate-500"}`}>{formatDate(message.created_at)} · {message.status}</p></article>)}</div>
                <div className="border-t border-white/10 p-4">
                  <div className="mb-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-black">Templates oficiais</p><p className="text-xs text-slate-500">Somente aprovados, com opt-in e confirmação manual.</p></div><span className="text-xs text-slate-400">{templates.filter((item) => item.status === "approved").length} aprovados</span></div>
                    <select value={selectedTemplateId} onChange={(event) => selectTemplate(event.target.value)} className="mt-3 w-full rounded-lg border border-white/10 bg-[#090d12] p-2 text-sm"><option value="">Selecione um template</option>{templates.map((template) => <option key={template.id} value={template.id} disabled={template.status !== "approved"}>{template.name} · {template.language} · {template.status}</option>)}</select>
                    {templateVariables.map((value, index) => <input key={index} value={value} maxLength={200} onChange={(event) => setTemplateVariables((items) => items.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder={`Variável ${index + 1}`} className="mt-2 w-full rounded-lg border border-white/10 bg-[#090d12] p-2 text-sm" />)}
                    {selectedTemplateId ? <button disabled={busy || contact?.opt_in_status !== "opted_in" || templateVariables.some((value) => !value.trim())} onClick={() => void sendTemplate()} className="mt-3 rounded-lg border border-emerald-400/40 px-4 py-2 text-sm font-bold text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40">Enviar template aprovado</button> : null}
                    {selectedTemplateId && contact?.opt_in_status !== "opted_in" ? <p className="mt-2 text-xs text-amber-300">O envio iniciado pela empresa exige opt-in confirmado.</p> : null}
                  </div>
                  {latestSuggestion && !draft ? <button onClick={() => { setDraft(latestSuggestion.suggested_text); setActiveSuggestion(latestSuggestion.id); }} className="mb-3 text-xs font-bold text-emerald-300">Usar última sugestão</button> : null}
                  <textarea value={draft} onChange={(event) => setDraft(event.target.value.slice(0, 4096))} rows={4} placeholder="Escreva ou gere uma sugestão para revisar..." className="w-full rounded-lg border border-white/10 bg-[#090d12] p-3 text-sm outline-none focus:border-emerald-400/60" />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-500">{draft.length}/4096 · envio somente após seu clique e confirmação</p><div className="flex gap-2"><button disabled={busy} onClick={() => void suggestReply()} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold disabled:opacity-50">{busy ? "Aguarde..." : "Sugerir com IA"}</button><button disabled={busy || !draft.trim() || !windowOpen || contact?.opt_in_status === "opted_out"} onClick={() => void sendReply()} className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">Enviar pelo WhatsApp</button></div></div>
                </div>
              </> : <div className="m-auto text-center text-sm text-slate-400">Selecione uma conversa.</div>}
            </section>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
