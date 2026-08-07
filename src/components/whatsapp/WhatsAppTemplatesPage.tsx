"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import { suggestedTemplateDrafts } from "@/lib/whatsapp/suggested-template-drafts";
import type { WhatsAppTemplateComponent } from "@/lib/whatsapp/template-validation";

type Template = {
  id: string;
  name: string;
  language: string;
  category: string | null;
  status: string;
  remote_status: string | null;
  local_status: string;
  components: WhatsAppTemplateComponent[];
  variables_count: number;
  quality_score: string | null;
  rejection_reason: string | null;
  last_synced_at: string | null;
  updated_at: string;
};

type Draft = { name: string; language: string; category: "utility" | "service" | "other"; body: string };

const emptyDraft: Draft = { name: "", language: "pt_BR", category: "utility", body: "" };

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
  if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Não foi possível concluir a solicitação.");
  return body;
}

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "Ainda não sincronizado";
}

function templateBody(components: WhatsAppTemplateComponent[]) {
  return components.find((component) => component.type === "BODY")?.text || "Estrutura sem prévia de texto compatível.";
}

export default function WhatsAppTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const loadTemplates = useCallback(async () => {
    setError("");
    try {
      const body = await api("/api/whatsapp/templates");
      setTemplates((body.templates || []) as Template[]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar os templates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(loadTemplates); }, [loadTemplates]);

  const categories = useMemo(() => [...new Set(templates.map((template) => template.category).filter(Boolean) as string[])].sort(), [templates]);
  const languages = useMemo(() => [...new Set(templates.map((template) => template.language))].sort(), [templates]);
  const filtered = useMemo(() => templates.filter((template) => {
    const status = template.remote_status || template.local_status || template.status;
    return (statusFilter === "all" || status === statusFilter) &&
      (categoryFilter === "all" || template.category === categoryFilter) &&
      (languageFilter === "all" || template.language === languageFilter);
  }), [categoryFilter, languageFilter, statusFilter, templates]);

  async function syncTemplates() {
    if (busy) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const body = await api("/api/whatsapp/templates/sync", { method: "POST", body: "{}" });
      setNotice(typeof body.message === "string" ? body.message : "Templates sincronizados com a Meta.");
      await loadTemplates();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível sincronizar os templates agora. Verifique a configuração do WhatsApp.");
    } finally { setBusy(false); }
  }

  async function createDraft() {
    if (busy) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await api("/api/whatsapp/templates", {
        method: "POST",
        body: JSON.stringify({ name: draft.name, language: draft.language, category: draft.category, components: [{ type: "BODY", text: draft.body }] })
      });
      setDraft(emptyDraft);
      setNotice("Rascunho local criado. Ele ainda precisa ser criado e aprovado no WhatsApp Manager.");
      await loadTemplates();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível criar o rascunho.");
    } finally { setBusy(false); }
  }

  async function hideTemplate(templateId: string) {
    if (busy || !window.confirm("Ocultar este template localmente? O histórico será preservado.")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await api(`/api/whatsapp/templates/${templateId}`, { method: "DELETE" });
      setNotice("Template ocultado localmente.");
      await loadTemplates();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível ocultar o template.");
    } finally { setBusy(false); }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#090d12] px-4 py-6 text-slate-100">
        <section className="mx-auto max-w-7xl space-y-5">
          <header className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#101821] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">WhatsApp Cloud API oficial</p>
              <h1 className="mt-2 text-2xl font-black text-white">Templates da Meta</h1>
              <p className="mt-1 text-sm text-slate-400">Templates precisam estar aprovados na Meta antes do envio real.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard/whatsapp" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">Conversas</Link>
              <button type="button" disabled={busy} onClick={() => void syncTemplates()} className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950 disabled:opacity-50">{busy ? "Sincronizando..." : "Sincronizar com a Meta"}</button>
            </div>
          </header>

          <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
            <p>Templates pendentes, rejeitados ou desativados não podem ser enviados.</p>
            <p className="mt-1">O AtendeZap IA não faz disparo em massa nem envio automático de templates.</p>
          </div>
          {error ? <div role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"><p>{error}</p>{/conectada|reautorizada/i.test(error) ? <Link href="/dashboard/whatsapp/onboarding" className="mt-2 inline-block font-black underline">Conectar WhatsApp</Link> : null}</div> : null}
          {notice ? <p role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">{notice}</p> : null}

          <section className="rounded-xl border border-white/10 bg-[#101821] p-5">
            <h2 className="font-black text-white">Governança local</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <select aria-label="Filtrar por status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-white/10 bg-[#090d12] p-2 text-sm"><option value="all">Todos os status</option>{["approved", "pending", "rejected", "paused", "disabled", "draft", "unsupported"].map((status) => <option key={status} value={status}>{status}</option>)}</select>
              <select aria-label="Filtrar por categoria" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-lg border border-white/10 bg-[#090d12] p-2 text-sm"><option value="all">Todas as categorias</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select>
              <select aria-label="Filtrar por idioma" value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)} className="rounded-lg border border-white/10 bg-[#090d12] p-2 text-sm"><option value="all">Todos os idiomas</option>{languages.map((language) => <option key={language} value={language}>{language}</option>)}</select>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#101821] p-5">
            <h2 className="font-black text-white">Criar rascunho local</h2>
            <p className="mt-1 text-xs text-slate-400">A criação local não submete nem aprova o template na Meta.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <input aria-label="Nome do template" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_") }))} maxLength={512} placeholder="nome_do_template" className="rounded-lg border border-white/10 bg-[#090d12] p-2 text-sm" />
              <input aria-label="Idioma" value={draft.language} onChange={(event) => setDraft((current) => ({ ...current, language: event.target.value }))} maxLength={10} placeholder="pt_BR" className="rounded-lg border border-white/10 bg-[#090d12] p-2 text-sm" />
              <select aria-label="Categoria do rascunho" value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value as Draft["category"] }))} className="rounded-lg border border-white/10 bg-[#090d12] p-2 text-sm"><option value="utility">utility</option><option value="service">service</option><option value="other">other</option></select>
            </div>
            <textarea aria-label="Body do template" value={draft.body} onChange={(event) => setDraft((current) => ({ ...current, body: event.target.value.slice(0, 1024) }))} rows={4} placeholder="Olá, {{1}}. Como podemos ajudar com {{2}}?" className="mt-3 w-full rounded-lg border border-white/10 bg-[#090d12] p-3 text-sm" />
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" disabled={busy || !draft.name.trim() || !draft.body.trim()} onClick={() => void createDraft()} className="rounded-lg border border-emerald-400/40 px-4 py-2 text-sm font-bold text-emerald-300 disabled:opacity-40">Salvar rascunho</button>
              <select aria-label="Usar rascunho sugerido" defaultValue="" onChange={(event) => {
                const suggestion = suggestedTemplateDrafts.find((item) => item.id === event.target.value);
                const body = suggestion?.components.find((component) => component.type === "BODY")?.text;
                if (suggestion && body) setDraft({ name: suggestion.name, language: suggestion.language, category: suggestion.category, body });
              }} className="rounded-lg border border-white/10 bg-[#090d12] p-2 text-sm"><option value="">Usar sugestão por nicho</option>{suggestedTemplateDrafts.map((item) => <option key={item.id} value={item.id}>{item.niche} · {item.name}</option>)}</select>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading ? <p className="text-sm text-slate-400">Carregando templates...</p> : filtered.length ? filtered.map((template) => (
              <article key={template.id} className="rounded-xl border border-white/10 bg-[#101821] p-5 [content-visibility:auto]">
                <div className="flex items-start justify-between gap-3"><div><h2 className="font-black text-white">{template.name}</h2><p className="mt-1 text-xs uppercase text-slate-500">{template.category || "sem categoria"} · {template.language}</p></div><span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-black uppercase">{template.remote_status || template.local_status || template.status}</span></div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">{templateBody(template.components)}</p>
                <dl className="mt-4 space-y-1 text-xs text-slate-400"><div className="flex justify-between gap-3"><dt>Status remoto</dt><dd>{template.remote_status || "não sincronizado"}</dd></div><div className="flex justify-between gap-3"><dt>Status local</dt><dd>{template.local_status}</dd></div><div className="flex justify-between gap-3"><dt>Variáveis</dt><dd>{template.variables_count}</dd></div><div className="flex justify-between gap-3"><dt>Qualidade</dt><dd>{template.quality_score || "não disponível"}</dd></div><div className="flex justify-between gap-3"><dt>Última sync</dt><dd>{formatDate(template.last_synced_at)}</dd></div></dl>
                {template.rejection_reason ? <p className="mt-3 rounded-lg border border-red-400/20 bg-red-400/10 p-2 text-xs text-red-200">Motivo resumido: {template.rejection_reason}</p> : null}
                <button type="button" disabled={busy} onClick={() => void hideTemplate(template.id)} className="mt-4 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-40">Ocultar localmente</button>
              </article>
            )) : <div className="rounded-xl border border-dashed border-white/15 p-6 text-sm text-slate-400"><p className="font-bold text-slate-200">Nenhum template encontrado.</p><p className="mt-1">Sincronize com a Meta ou crie um rascunho local controlado.</p></div>}
          </section>
        </section>
      </main>
    </ProtectedRoute>
  );
}
