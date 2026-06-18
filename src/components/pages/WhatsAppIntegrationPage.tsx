"use client";

import { useState } from "react";
import { AlertTriangle, Bot, History, MessageCircle, Plug, Plus, Save, Server, Smartphone, Webhook } from "lucide-react";
import { MessageTemplateCard } from "@/components/integrations/MessageTemplateCard";
import { WhatsAppStatusCard } from "@/components/integrations/WhatsAppStatusCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import type { WhatsAppConnection, WhatsAppSyncLog, WhatsAppTemplate } from "@/types/whatsapp";
import {
  connectDemoWhatsApp,
  createWhatsAppTemplate,
  deleteWhatsAppTemplate,
  disconnectDemoWhatsApp,
  getWhatsAppConnection,
  getWhatsAppSyncLogs,
  getWhatsAppTemplates,
  pauseWhatsAppConnection,
  resumeWhatsAppConnection,
  simulateMessageImport,
  updateWhatsAppTemplate
} from "@/utils/whatsappStorage";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function logStatusClass(status: WhatsAppSyncLog["status"]) {
  if (status === "success") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (status === "warning") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  if (status === "error") return "border-red-400/30 bg-red-500/10 text-red-200";
  return "border-sky-400/30 bg-sky-400/10 text-sky-200";
}

function emptyTemplate(): Omit<WhatsAppTemplate, "id" | "createdAt"> {
  return {
    name: "",
    category: "Atendimento",
    content: "",
    status: "draft"
  };
}

function WhatsAppIntegrationContent() {
  const [connection, setConnection] = useState<WhatsAppConnection>(() => getWhatsAppConnection());
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(() => getWhatsAppTemplates());
  const [logs, setLogs] = useState<WhatsAppSyncLog[]>(() => getWhatsAppSyncLogs());
  const [templateDraft, setTemplateDraft] = useState<Omit<WhatsAppTemplate, "id" | "createdAt">>(() => emptyTemplate());
  const [editingTemplateId, setEditingTemplateId] = useState("");
  const [feedback, setFeedback] = useState("");

  function refresh() {
    setConnection(getWhatsAppConnection());
    setTemplates(getWhatsAppTemplates());
    setLogs(getWhatsAppSyncLogs());
  }

  function handleConnect() {
    setConnection(connectDemoWhatsApp());
    setFeedback("WhatsApp conectado em modo demo.");
    refresh();
  }

  function handleDisconnect() {
    setConnection(disconnectDemoWhatsApp());
    setFeedback("Conexão demo desconectada.");
    refresh();
  }

  function handlePause() {
    setConnection(pauseWhatsAppConnection());
    setFeedback("Conexão demo pausada.");
    refresh();
  }

  function handleResume() {
    setConnection(resumeWhatsAppConnection());
    setFeedback("Conexão demo retomada.");
    refresh();
  }

  function handleImport() {
    simulateMessageImport();
    setFeedback("Mensagens importadas para o painel de atendimento em modo demo.");
    refresh();
  }

  function handleEdit(template: WhatsAppTemplate) {
    setEditingTemplateId(template.id);
    setTemplateDraft({
      name: template.name,
      category: template.category,
      content: template.content,
      status: template.status
    });
  }

  function handleSaveTemplate() {
    if (!templateDraft.name.trim() || !templateDraft.content.trim()) {
      setFeedback("Informe nome e conteúdo do template.");
      return;
    }

    if (editingTemplateId) {
      setTemplates(updateWhatsAppTemplate(editingTemplateId, templateDraft));
      setFeedback("Template atualizado localmente.");
    } else {
      setTemplates(createWhatsAppTemplate(templateDraft));
      setFeedback("Template criado localmente.");
    }

    setEditingTemplateId("");
    setTemplateDraft(emptyTemplate());
    refresh();
  }

  function handleDeleteTemplate(templateId: string) {
    setTemplates(deleteWhatsAppTemplate(templateId));
    setFeedback("Template removido localmente.");
    refresh();
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-8 text-slate-100">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                <Smartphone className="h-4 w-4" />
                Integrações
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">WhatsApp em modo demo</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Esta tela e apenas uma simulacao interna. A versao atual do AtendeZap IA gera respostas para copiar, ajustar e enviar manualmente, sem conectar ao WhatsApp.
              </p>
            </div>
            <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-black text-sky-200">
              Demo local
            </span>
          </div>
        </header>

        <div className="mb-6 rounded-lg border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
          Esta tela nao faz parte do beta fechado nem do lancamento pequeno. Nenhuma mensagem real sera enviada ou recebida, e nao ha integracao direta com WhatsApp nesta versao.
        </div>

        {feedback ? (
          <div className="mb-6 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-200">
            {feedback}
          </div>
        ) : null}

        <WhatsAppStatusCard
          connection={connection}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onPause={handlePause}
          onResume={handleResume}
          onSimulateImport={handleImport}
        />

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white">
              <Webhook className="h-5 w-5 text-emerald-300" />
              Fora do escopo atual
            </h2>
            <div className="grid gap-3 text-sm leading-6 text-slate-300">
              {[
                ["Sem conexao oficial", "O produto atual nao conecta com WhatsApp Cloud API ou provedores terceirizados."],
                ["Sem webhook de mensagens", "O backend nao recebe conversas reais do WhatsApp nesta versao."],
                ["Sem envio automatico", "A IA apenas gera texto. O usuario revisa, copia e envia manualmente."],
                ["Sem CRM completo", "Esta simulacao nao substitui uma area completa de atendimento ou relacionamento."]
              ].map(([title, description]) => (
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={title}>
                  <p className="font-black text-white">{title}</p>
                  <p className="mt-1 text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white">
              <Plug className="h-5 w-5 text-emerald-300" />
              Preparação técnica
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <Server className="mb-3 h-5 w-5 text-emerald-300" />
                <p className="font-black text-white">Backend</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Tokens, webhooks e auditoria devem ficar fora do navegador.</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <Bot className="mb-3 h-5 w-5 text-emerald-300" />
                <p className="font-black text-white">IA assistida</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">A IA sugere respostas; o atendente aprova antes do envio.</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-4 sm:col-span-2">
                <AlertTriangle className="mb-3 h-5 w-5 text-amber-300" />
                <p className="font-black text-white">Sem envio real nesta versão</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Esta tela prepara o fluxo visual e os contratos locais para uma integração futura.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/25">
          <div className="mb-5 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-emerald-300" />
            <h2 className="text-xl font-black text-white">Templates de mensagem</h2>
          </div>

          <div className="mb-5 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <input
              value={templateDraft.name}
              onChange={(event) => setTemplateDraft((current) => ({ ...current, name: event.target.value }))}
              className="field-input"
              placeholder="Nome do template"
            />
            <input
              value={templateDraft.category}
              onChange={(event) => setTemplateDraft((current) => ({ ...current, category: event.target.value }))}
              className="field-input"
              placeholder="Categoria"
            />
            <select
              value={templateDraft.status}
              onChange={(event) => setTemplateDraft((current) => ({ ...current, status: event.target.value as WhatsAppTemplate["status"] }))}
              className="field-input"
            >
              <option value="draft">Rascunho</option>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select>
            <button
              type="button"
              onClick={handleSaveTemplate}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
            >
              {editingTemplateId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingTemplateId ? "Salvar" : "Criar"}
            </button>
            <textarea
              value={templateDraft.content}
              onChange={(event) => setTemplateDraft((current) => ({ ...current, content: event.target.value }))}
              className="field-input min-h-24 resize-none py-3 md:col-span-4"
              placeholder="Conteúdo do template"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <MessageTemplateCard template={template} onEdit={handleEdit} onDelete={handleDeleteTemplate} key={template.id} />
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/25">
          <div className="mb-5 flex items-center gap-2">
            <History className="h-5 w-5 text-emerald-300" />
            <h2 className="text-xl font-black text-white">Histórico de sincronização</h2>
          </div>
          <div className="grid gap-3">
            {logs.map((log) => (
              <article className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={log.id}>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${logStatusClass(log.status)}`}>{log.status}</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-slate-300">{log.type}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{formatDateTime(log.createdAt)}</span>
                </div>
                <h3 className="mt-3 font-black text-white">{log.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{log.description}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default function WhatsAppIntegrationPage() {
  return (
    <ProtectedRoute>
      <WhatsAppIntegrationContent />
    </ProtectedRoute>
  );
}
