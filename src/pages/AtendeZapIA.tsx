"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Bot,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Phone,
  Search,
  Send,
  Sparkles,
  Smartphone,
  UserRound,
  Zap
} from "lucide-react";
import { atendezapMockConversations } from "@/data/atendezapMock";
import type { Conversation, ConversationStatus, Message, Priority } from "@/types/atendezap";
import { calculateConversationUrgency, createAgentMessage, generateConversationSummary, generateSuggestedReply } from "@/utils/atendezapAI";
import { getKnowledgeBaseStats } from "@/utils/knowledgeStorage";
import { getBusinessProfile } from "@/utils/onboardingStorage";
import { getWhatsAppConnection } from "@/utils/whatsappStorage";

const STORAGE_KEY = "atendezap_ia_conversations_v1";

const statusLabels: Record<ConversationStatus, string> = {
  open: "Aberto",
  waiting: "Aguardando",
  resolved: "Resolvido"
};

const priorityLabels: Record<Priority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta"
};

const statusFilters: Array<{ value: "all" | ConversationStatus; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "open", label: "Abertos" },
  { value: "waiting", label: "Aguardando" },
  { value: "resolved", label: "Resolvidos" }
];

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function statusClass(status: ConversationStatus) {
  if (status === "open") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (status === "waiting") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  return "border-slate-500/40 bg-slate-500/15 text-slate-300";
}

function priorityClass(priority: Priority) {
  if (priority === "high") return "bg-red-500/15 text-red-200 ring-red-400/30";
  if (priority === "medium") return "bg-amber-500/15 text-amber-200 ring-amber-400/30";
  return "bg-slate-500/15 text-slate-300 ring-slate-400/30";
}

function lastMessage(conversation: Conversation) {
  return conversation.messages[conversation.messages.length - 1];
}

function loadStoredConversations() {
  if (typeof window === "undefined") return atendezapMockConversations;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return atendezapMockConversations;

  try {
    return JSON.parse(stored) as Conversation[];
  } catch {
    return atendezapMockConversations;
  }
}

export default function AtendeZapIA() {
  const [conversations, setConversations] = useState<Conversation[]>(() => loadStoredConversations());
  const [selectedId, setSelectedId] = useState(() => loadStoredConversations()[0]?.id || "");
  const [businessProfile] = useState(() => getBusinessProfile());
  const [whatsAppConnection] = useState(() => getWhatsAppConnection());
  const [knowledgeStats] = useState(() => getKnowledgeBaseStats());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ConversationStatus>("all");
  const [draft, setDraft] = useState("");
  const [suggestedReply, setSuggestedReply] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    const search = query.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesStatus = statusFilter === "all" || conversation.status === statusFilter;
      const searchableText = [
        conversation.customer.name,
        conversation.customer.phone,
        conversation.intent,
        ...conversation.customer.tags,
        ...conversation.messages.map((message) => message.content)
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!search || searchableText.includes(search));
    });
  }, [conversations, query, statusFilter]);

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) || filteredConversations[0];
  const aiSummary = selectedConversation ? generateConversationSummary(selectedConversation) : null;
  const openCount = conversations.filter((conversation) => conversation.status === "open").length;
  const waitingCount = conversations.filter((conversation) => conversation.status === "waiting").length;
  const resolvedCount = conversations.filter((conversation) => conversation.status === "resolved").length;

  function updateConversation(conversationId: string, updater: (conversation: Conversation) => Conversation) {
    setConversations((current) =>
      current.map((conversation) => (conversation.id === conversationId ? updater(conversation) : conversation))
    );
  }

  function handleGenerateReply() {
    if (!selectedConversation) return;
    const baseReply = generateSuggestedReply(selectedConversation);

    if (businessProfile?.welcomeMessage) {
      setSuggestedReply(`${businessProfile.welcomeMessage}\n\n${baseReply}\n\nTom sugerido: ${businessProfile.aiTone}.`);
      return;
    }

    setSuggestedReply(baseReply);
  }

  function handleUseSuggestedReply() {
    if (!suggestedReply) return;
    setDraft(suggestedReply);
  }

  function handleSendMessage() {
    if (!selectedConversation || !draft.trim()) return;

    const message: Message = createAgentMessage(draft.trim());
    updateConversation(selectedConversation.id, (conversation) => ({
      ...conversation,
      status: "waiting",
      updatedAt: message.createdAt,
      messages: [...conversation.messages, message]
    }));
    setDraft("");
    setSuggestedReply("");
  }

  function handleResolve() {
    if (!selectedConversation) return;

    updateConversation(selectedConversation.id, (conversation) => ({
      ...conversation,
      status: "resolved",
      priority: "low",
      updatedAt: new Date().toISOString()
    }));
  }

  function handleReset() {
    setConversations(atendezapMockConversations);
    setSelectedId(atendezapMockConversations[0]?.id || "");
    setDraft("");
    setSuggestedReply("");
  }

  return (
    <main className="min-h-screen bg-[#090d12] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 lg:px-6">
        <header className="mb-5 flex flex-col gap-4 rounded-lg border border-white/10 bg-[#101821] p-4 shadow-2xl shadow-black/30 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">AtendeZap IA</p>
                <h1 className="text-2xl font-black tracking-tight text-white">Painel de atendimento</h1>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Módulo local para organizar conversas, acompanhar status e simular sugestões de resposta por IA sem backend.
            </p>
            {businessProfile ? (
              <p className="mt-2 text-xs font-bold text-emerald-200">
                Empresa: {businessProfile.businessName} • Tom da IA: {businessProfile.aiTone}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xl font-black text-white">{openCount}</p>
              <p className="text-xs text-slate-400">Abertos</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xl font-black text-white">{waitingCount}</p>
              <p className="text-xs text-slate-400">Aguardando</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xl font-black text-white">{resolvedCount}</p>
              <p className="text-xs text-slate-400">Resolvidos</p>
            </div>
          </div>
        </header>

        <div className="mb-5 rounded-lg border border-sky-400/20 bg-sky-400/10 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-sky-400/15 text-sky-200">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-white">WhatsApp em modo demo</p>
                <p className="mt-1 text-sm leading-6 text-sky-100">
                  Status da conexao:{" "}
                  <span className="font-bold">
                    {whatsAppConnection?.status === "connected"
                      ? `conectado em ${whatsAppConnection.phoneNumber || "numero demo"}`
                      : whatsAppConnection?.status === "paused"
                        ? "pausado"
                        : "desconectado"}
                  </span>
                  . Nenhuma mensagem real sera enviada ou recebida.
                </p>
              </div>
            </div>
            {whatsAppConnection?.status !== "connected" ? (
              <Link
                href="/integracoes/whatsapp"
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-sky-300 px-4 text-sm font-black text-slate-950 transition hover:bg-sky-200"
              >
                Conectar WhatsApp
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mb-5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-200">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-white">Base de conhecimento ativa</p>
                <p className="mt-1 text-sm leading-6 text-emerald-100">
                  {knowledgeStats.total} itens cadastrados para apoiar sugestoes da IA, incluindo {knowledgeStats.activeFaqs} FAQs ativas.
                </p>
              </div>
            </div>
            <Link
              href="/base-conhecimento"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-emerald-300 px-4 text-sm font-black text-slate-950 transition hover:bg-emerald-200"
            >
              Gerenciar Base da IA
            </Link>
          </div>
        </div>

        <section className="grid min-h-[calc(100vh-150px)] gap-4 lg:grid-cols-[340px_minmax(0,1fr)_320px]">
          <aside className="flex min-h-[520px] flex-col rounded-lg border border-white/10 bg-[#101821]">
            <div className="border-b border-white/10 p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar cliente ou mensagem"
                  className="h-11 w-full rounded-md border border-white/10 bg-[#0b1118] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setStatusFilter(filter.value)}
                    className={`rounded-md border px-3 py-2 text-xs font-bold transition ${
                      statusFilter === filter.value
                        ? "border-emerald-400 bg-emerald-400 text-slate-950"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {filteredConversations.map((conversation) => {
                const active = conversation.id === selectedConversation?.id;
                const latest = lastMessage(conversation);
                const urgency = calculateConversationUrgency(conversation);

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(conversation.id);
                      setSuggestedReply("");
                    }}
                    className={`mb-2 w-full rounded-lg border p-3 text-left transition ${
                      active
                        ? "border-emerald-400 bg-emerald-400/10"
                        : "border-transparent bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-slate-800 text-sm font-black text-emerald-200">
                        {conversation.customer.avatarInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-bold text-white">{conversation.customer.name}</p>
                          <span className="text-[11px] text-slate-500">{formatTime(conversation.updatedAt)}</span>
                        </div>
                        <p className="mt-1 truncate text-xs text-slate-400">{latest?.content}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${statusClass(conversation.status)}`}>
                            {statusLabels[conversation.status]}
                          </span>
                          <span className={`rounded-full px-2 py-1 text-[11px] font-bold ring-1 ${priorityClass(urgency)}`}>
                            {priorityLabels[urgency]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/10 p-3">
              <button
                type="button"
                onClick={handleReset}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10"
              >
                Restaurar dados mockados
              </button>
            </div>
          </aside>

          <section className="flex min-h-[620px] flex-col rounded-lg border border-white/10 bg-[#0d141c]">
            {selectedConversation ? (
              <>
                <div className="flex flex-col gap-4 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-400 text-lg font-black text-slate-950">
                      {selectedConversation.customer.avatarInitials}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white">{selectedConversation.customer.name}</h2>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {selectedConversation.customer.phone}
                        </span>
                        <span>{selectedConversation.customer.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${statusClass(selectedConversation.status)}`}>
                      {statusLabels[selectedConversation.status]}
                    </span>
                    <button
                      type="button"
                      onClick={handleResolve}
                      disabled={selectedConversation.status === "resolved"}
                      className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Marcar como resolvido
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-5">
                  <div className="mx-auto flex max-w-3xl flex-col gap-4">
                    {selectedConversation.messages.map((message) => {
                      const fromCustomer = message.sender === "customer";

                      return (
                        <div className={`flex ${fromCustomer ? "justify-start" : "justify-end"}`} key={message.id}>
                          <div
                            className={`max-w-[82%] rounded-lg border px-4 py-3 shadow-lg ${
                              fromCustomer
                                ? "border-white/10 bg-[#151f2b] text-slate-100"
                                : "border-emerald-400/30 bg-emerald-400/15 text-emerald-50"
                            }`}
                          >
                            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-400">
                              {fromCustomer ? <UserRound className="h-3.5 w-3.5" /> : <MessageCircle className="h-3.5 w-3.5" />}
                              {fromCustomer ? selectedConversation.customer.name : "Atendente"}
                              <span className="font-medium text-slate-500">{formatTime(message.createdAt)}</span>
                            </div>
                            <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-white/10 p-4">
                  {suggestedReply ? (
                    <div className="mb-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-200">
                          <Sparkles className="h-4 w-4" />
                          Sugestão IA
                        </p>
                        {suggestedReply.includes("Base de conhecimento usada") ? (
                          <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-black text-emerald-100">
                            Usou Base da IA
                          </span>
                        ) : null}
                        <button
                          type="button"
                          onClick={handleUseSuggestedReply}
                          className="rounded-md bg-emerald-400 px-3 py-1.5 text-xs font-black text-slate-950 transition hover:bg-emerald-300"
                        >
                          Usar resposta
                        </button>
                      </div>
                      <p className="text-sm leading-6 text-emerald-50">{suggestedReply}</p>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 md:flex-row">
                    <textarea
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Digite uma resposta manual..."
                      className="min-h-24 flex-1 resize-none rounded-md border border-white/10 bg-[#080d13] px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                    />
                    <div className="flex gap-2 md:w-48 md:flex-col">
                      <button
                        type="button"
                        onClick={handleGenerateReply}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-sm font-black text-emerald-200 transition hover:bg-emerald-400/20"
                      >
                        <Bot className="h-4 w-4" />
                        Gerar resposta IA
                      </button>
                      <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={!draft.trim()}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-400 px-3 py-2 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-center text-slate-400">
                Nenhuma conversa encontrada.
              </div>
            )}
          </section>

          <aside className="flex min-h-[520px] flex-col gap-4 rounded-lg border border-white/10 bg-[#101821] p-4">
            {selectedConversation && aiSummary ? (
              <>
                <div>
                  <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-300">
                    <Sparkles className="h-4 w-4" />
                    Resumo IA
                  </p>
                  <h3 className="text-xl font-black text-white">{aiSummary.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{aiSummary.summary}</p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-black text-white">
                    <Zap className="h-4 w-4 text-emerald-300" />
                    Urgência calculada
                  </p>
                  <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ring-1 ${priorityClass(aiSummary.urgency)}`}>
                    {priorityLabels[aiSummary.urgency]}
                  </span>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-black text-white">
                    <Clock3 className="h-4 w-4 text-emerald-300" />
                    Próximo passo
                  </p>
                  <p className="text-sm leading-6 text-slate-400">{aiSummary.nextStep}</p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="mb-3 text-sm font-black text-white">Dados do cliente</p>
                  <div className="space-y-3 text-sm text-slate-400">
                    <p>{selectedConversation.customer.phone}</p>
                    <p>{selectedConversation.customer.city}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedConversation.customer.tags.map((tag) => (
                        <span className="rounded-full bg-slate-700 px-2 py-1 text-xs font-bold text-slate-200" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto rounded-lg border border-white/10 bg-[#0b1118] p-4 text-xs leading-5 text-slate-500">
                  Alterações são salvas no localStorage deste navegador. Este módulo ainda não usa backend nem API externa.
                  Última atualização: {formatDate(selectedConversation.updatedAt)}.
                </div>
              </>
            ) : null}
          </aside>
        </section>
      </div>
    </main>
  );
}
