"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { HelpCircle, MessageSquare, RefreshCw, Send } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { supportCategories, supportStatusLabel, type SupportCategory } from "@/lib/support";
import { trackEvent } from "@/lib/tracking";
import { createSupportRequest, listSupportRequests, type SupportRequest } from "@/services/support";

const faqItems = [
  { category: "whatsapp_auto", question: "O AtendeZap IA envia mensagens automaticamente pelo WhatsApp?", answer: "Nao. Ele gera respostas para voce copiar, ajustar e enviar." },
  { category: "whatsapp_connection", question: "Preciso conectar meu WhatsApp?", answer: "Nao nesta versao." },
  { category: "ai_review", question: "A IA pode errar?", answer: "Sim. Revise antes de enviar." },
  { category: "monthly_limit", question: "Como funciona o limite mensal?", answer: "Cada plano possui um limite de respostas geradas por mes." },
  { category: "pro_offer", question: "Como funciona o Plano Pro por R$ 29?", answer: "E o primeiro mes do Plano Pro para novos usuarios. Depois segue o valor normal configurado na Stripe." },
  { category: "cancel_subscription", question: "Posso cancelar?", answer: "Sim. A assinatura e gerenciada pelo portal da Stripe." },
  { category: "limit_reached", question: "O que acontece se eu atingir o limite?", answer: "Voce deve aguardar renovacao do ciclo ou mudar de plano, conforme regras do produto." },
  { category: "data_isolation", question: "Meus dados ficam visiveis para outros usuarios?", answer: "Nao. Cada usuario acessa apenas os proprios dados." }
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function statusClass(status: string) {
  if (status === "resolved") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-100";
  if (status === "in_progress") return "border-sky-400/30 bg-sky-400/10 text-sky-100";
  if (status === "rejected") return "border-red-400/30 bg-red-500/10 text-red-100";
  return "border-amber-400/30 bg-amber-400/10 text-amber-100";
}

function HelpDashboardContent() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [category, setCategory] = useState<SupportCategory>("erro ao gerar resposta");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setRequests(await listSupportRequests());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Nao foi possivel carregar suas solicitacoes agora.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    trackEvent("support_page_view", { source: "dashboard_help" });
    queueMicrotask(() => {
      void loadRequests();
    });
  }, [loadRequests]);

  function handleFaqOpen(faqCategory: string) {
    trackEvent("help_faq_view", { source: "dashboard_help", category: faqCategory });
  }

  async function submitSupport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const result = await createSupportRequest({
        category,
        subject,
        message,
        source: "dashboard_help"
      });
      setRequests((current) => [result.supportRequest, ...current]);
      setSubject("");
      setMessage("");
      setSuccess("Solicitacao enviada. Voce pode acompanhar o status nesta pagina.");
      trackEvent("support_request_created", { source: "dashboard_help", category, status: "pending" });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel enviar sua solicitacao agora.");
      trackEvent("support_request_failed", { source: "dashboard_help", category, status: "failed" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-6 text-white">
      <section className="mx-auto max-w-6xl">
        <header className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Ajuda</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight">Central de ajuda</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Encontre respostas rapidas e envie uma solicitacao simples de suporte. Nao envie senhas, dados de cartao ou informacoes sensiveis.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard" className="inline-flex min-h-10 items-center rounded-md border border-white/10 bg-white/10 px-4 text-xs font-black text-slate-100 hover:bg-white/15">
                Voltar ao dashboard
              </Link>
              <button type="button" onClick={() => void loadRequests()} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 text-xs font-black text-slate-100 hover:bg-white/15">
                <RefreshCw className="h-3.5 w-3.5" />
                Atualizar
              </button>
            </div>
          </div>
        </header>

        {error ? <p className="mt-4 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm font-bold text-red-100">{error}</p> : null}
        {success ? <p className="mt-4 rounded-md border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm font-bold text-emerald-100">{success}</p> : null}

        <section className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-emerald-300" />
              <h2 className="text-xl font-black">FAQ rapida</h2>
            </div>
            <div className="grid gap-3">
              {faqItems.map((item) => (
                <details className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={item.category} onToggle={(event) => event.currentTarget.open && handleFaqOpen(item.category)}>
                  <summary className="cursor-pointer text-sm font-black text-white">{item.question}</summary>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <form onSubmit={submitSupport} className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-300" />
              <h2 className="text-xl font-black">Abrir solicitacao</h2>
            </div>
            <label className="grid gap-2 text-sm font-bold text-slate-300">
              Categoria
              <select value={category} onChange={(event) => setCategory(event.target.value as SupportCategory)} className="field-input">
                {supportCategories.map((item) => (
                  <option value={item} key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
              Assunto
              <input value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={140} className="field-input" placeholder="Ex.: Nao consigo gerar resposta" />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
              Mensagem
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={3000} className="field-input min-h-32 resize-none py-3" placeholder="Descreva o problema sem enviar senhas, dados de cartao ou conteudo sensivel." />
            </label>
            <button type="submit" disabled={submitting} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
              <Send className="h-4 w-4" />
              {submitting ? "Enviando..." : "Enviar suporte"}
            </button>
          </form>
        </section>

        <section className="mt-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
          <h2 className="text-2xl font-black">Suas solicitacoes</h2>
          <div className="mt-5 grid gap-3">
            {loading ? (
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-6 text-center text-sm font-bold text-slate-300">Carregando suporte...</div>
            ) : requests.length ? (
              requests.map((item) => (
                <article className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={item.id}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-emerald-300">{item.category}</p>
                      <h3 className="mt-1 font-black text-white">{item.subject}</h3>
                      <p className="mt-2 text-sm text-slate-400">Criada em {formatDate(item.created_at)}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(item.status)}`}>{supportStatusLabel(item.status)}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-white/15 bg-white/[0.04] p-8 text-center text-sm text-slate-400">
                <p className="font-bold text-slate-200">Nenhuma solicitacao enviada ainda.</p>
                <p className="mt-2">Quando voce pedir ajuda, o status aparecera aqui.</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default function HelpDashboardPage() {
  return (
    <ProtectedRoute>
      <HelpDashboardContent />
    </ProtectedRoute>
  );
}
