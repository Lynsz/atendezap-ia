"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Clipboard,
  CreditCard,
  LogOut,
  MessageCircle,
  Plus,
  RefreshCw,
  Save,
  Send,
  Trash2,
  Users
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { businessSchema, customerSchema, customerStatuses, responseTypes } from "@/lib/mvp-validators";
import { getPlanResponseLimit } from "@/lib/plan-limits";
import { isSupabaseBrowserConfigured, supabase as supabaseBrowserClient } from "@/lib/supabase/browser";
import { generateCustomerResponse } from "@/services/ai";
import type { Business, CustomerLead, CustomerStatus, GeneratedResponse, Plan, ResponseType, Subscription } from "@/types/mvp";

type DashboardTab = "assistant" | "business" | "history" | "customers";

type BusinessDraft = {
  business_name: string;
  business_area: string;
  description: string;
  products_services: string;
  prices: string;
  opening_hours: string;
  address: string;
  payment_methods: string;
  booking_or_payment_link: string;
  brand_tone: string;
};

type CustomerDraft = {
  name: string;
  phone: string;
  status: CustomerStatus;
  notes: string;
};

const emptyBusiness: BusinessDraft = {
  business_name: "",
  business_area: "",
  description: "",
  products_services: "",
  prices: "",
  opening_hours: "",
  address: "",
  payment_methods: "",
  booking_or_payment_link: "",
  brand_tone: "profissional, simpatico e objetivo"
};

const emptyCustomer: CustomerDraft = {
  name: "",
  phone: "",
  status: "novo",
  notes: ""
};

const responseTypeLabels: Record<ResponseType, string> = {
  atendimento: "Atendimento",
  venda: "Venda",
  orcamento: "Orçamento",
  cliente_indeciso: "Cliente indeciso",
  pos_venda: "Pos-venda",
  recuperacao: "Recuperação"
};

const customerStatusLabels: Record<CustomerStatus, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  orcamento_enviado: "Orçamento enviado",
  aguardando_resposta: "Aguardando resposta",
  venda_concluida: "Venda concluída",
  perdido: "Perdido"
};

function getCurrentMonthStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

function getPlanLimit(subscription: Subscription | null, plan: Plan | null) {
  return plan?.response_limit || getPlanResponseLimit(subscription?.plan_name, subscription?.status);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function toBusinessDraft(business: Business | null): BusinessDraft {
  if (!business) return emptyBusiness;
  return {
    business_name: business.business_name || "",
    business_area: business.business_area || "",
    description: business.description || "",
    products_services: business.products_services || "",
    prices: business.prices || "",
    opening_hours: business.opening_hours || "",
    address: business.address || "",
    payment_methods: business.payment_methods || "",
    booking_or_payment_link: business.booking_or_payment_link || "",
    brand_tone: business.brand_tone || "profissional, simpatico e objetivo"
  };
}

function statusClass(status: CustomerStatus) {
  if (status === "venda_concluida") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (status === "perdido") return "border-red-400/30 bg-red-500/10 text-red-200";
  if (status === "aguardando_resposta") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  return "border-sky-400/30 bg-sky-400/10 text-sky-200";
}

function SaasDashboardContent() {
  const router = useRouter();
  const [tab, setTab] = useState<DashboardTab>("assistant");
  const [loading, setLoading] = useState(true);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("cliente");
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessDraft, setBusinessDraft] = useState<BusinessDraft>(emptyBusiness);
  const [question, setQuestion] = useState("");
  const [responseType, setResponseType] = useState<ResponseType>("atendimento");
  const [generatedAnswer, setGeneratedAnswer] = useState("");
  const [history, setHistory] = useState<GeneratedResponse[]>([]);
  const [customers, setCustomers] = useState<CustomerLead[]>([]);
  const [customerDraft, setCustomerDraft] = useState<CustomerDraft>(emptyCustomer);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [monthlyUsage, setMonthlyUsage] = useState(0);

  const supabase = useMemo(() => (isSupabaseBrowserConfigured() ? supabaseBrowserClient : null), []);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 3000);
  }

  const loadDashboardData = useCallback(async () => {
    if (!supabase) {
      setError("Configuração de conexão incompleta. Revise o ambiente e tente novamente.");
      setLoading(false);
      return;
    }

    setLoading(true);
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    const name = (user.user_metadata?.name as string | undefined) || user.email || "cliente";
    setUserName(name);

    await supabase.from("profiles").upsert({
      id: user.id,
      name,
      email: user.email
    });

    const [
      { data: businessData, error: businessError },
      { data: responseData, error: responseError },
      { data: customerData, error: customerError },
      { data: subscriptionData, error: subscriptionError },
      { data: planData },
      { count: monthlyResponseCount, error: monthlyUsageError }
    ] = await Promise.all([
      supabase.from("businesses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("generated_responses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      supabase.from("customers").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }),
      supabase.from("subscriptions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("plans").select("*").order("price", { ascending: true }),
      supabase.from("generated_responses").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", getCurrentMonthStart())
    ]);

    if (businessError || responseError || customerError || subscriptionError || monthlyUsageError) {
      setError("Não conseguimos carregar todos os dados agora. Atualize a página ou tente novamente em instantes.");
    }

    const subscriptionRow = (subscriptionData as Subscription | null) || null;
    const planRows = (planData as Plan[] | null) || [];
    const matchedPlan = subscriptionRow?.plan_name
      ? planRows.find((plan) => plan.name.toLowerCase() === subscriptionRow.plan_name?.toLowerCase())
      : planRows.find((plan) => plan.name.toLowerCase() === "inicial");

    setBusiness((businessData as Business | null) || null);
    setBusinessDraft(toBusinessDraft((businessData as Business | null) || null));
    setHistory((responseData as GeneratedResponse[] | null) || []);
    setCustomers((customerData as CustomerLead[] | null) || []);
    setSubscription(subscriptionRow);
    setCurrentPlan(matchedPlan || null);
    setMonthlyUsage(monthlyResponseCount || 0);
    setLoading(false);
  }, [router, supabase]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadDashboardData();
    });
  }, [loadDashboardData]);

  async function handleLogout() {
    if (supabase) await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleSaveBusiness(event?: FormEvent) {
    event?.preventDefault();
    setError("");

    if (!supabase) {
      setError("Supabase indisponível. Revise o ambiente e tente novamente.");
      return;
    }

    const parsed = businessSchema.safeParse(businessDraft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Revise os dados do negócio.");
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Sessão não encontrada. Faça login novamente.");
      router.replace("/login");
      return;
    }

    setSavingBusiness(true);
    const payload = { ...parsed.data, user_id: user.id };
    const existingBusiness = business
      ? business
      : (await supabase.from("businesses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle()).data as Business | null;
    const request = existingBusiness
      ? supabase.from("businesses").update(payload).eq("id", existingBusiness.id).eq("user_id", user.id).select("*").single()
      : supabase.from("businesses").insert(payload).select("*").single();
    const { data, error: saveError } = await request;
    setSavingBusiness(false);

    if (saveError) {
      setError("Não conseguimos salvar o negócio agora. Revise os campos e tente novamente.");
      return;
    }

    setBusiness(data as Business);
    setBusinessDraft(toBusinessDraft(data as Business));
    showFeedback("Negócio salvo com sucesso.");
  }

  async function handleGenerateResponse(event: FormEvent) {
    event.preventDefault();
    setError("");
    setGeneratedAnswer("");

    if (!supabase) {
      setError("Supabase indisponível. Revise o ambiente e tente novamente.");
      return;
    }
    if (!business) {
      setError("Cadastre seu negócio antes de gerar respostas.");
      setTab("business");
      return;
    }
    if (!question.trim()) {
      setError("Cole a pergunta do cliente.");
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Sessão não encontrada. Faça login novamente.");
      router.replace("/login");
      return;
    }

    setGenerating(true);
    try {
      const { generatedAnswer: answer, savedResponse, usage } = await generateCustomerResponse({
        customerQuestion: question,
        responseType,
        business: {
          id: business.id,
          ...businessDraft
        }
      });

      setGeneratedAnswer(answer);
      setMonthlyUsage(usage.used);
      if (savedResponse) {
        setHistory((current) => [savedResponse, ...current]);
      }
      showFeedback("Resposta salva no histórico.");
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Não foi possível gerar a resposta agora.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDeleteHistory(itemId: string) {
    if (!supabase) return;
    const { error: deleteError } = await supabase.from("generated_responses").delete().eq("id", itemId);
    if (deleteError) {
      setError("Não conseguimos excluir a resposta.");
      return;
    }
    setHistory((current) => current.filter((item) => item.id !== itemId));
  }

  async function handleDeleteCustomer(itemId: string) {
    if (!supabase) {
      setError("Supabase indisponível. Revise o ambiente e tente novamente.");
      return;
    }
    const { error: deleteError } = await supabase.from("customers").delete().eq("id", itemId);
    if (deleteError) {
      setError("Não conseguimos excluir o cliente.");
      return;
    }
    setCustomers((current) => current.filter((item) => item.id !== itemId));
    showFeedback("Cliente excluído.");
  }

  async function handleCreateCustomer(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!supabase) {
      setError("Supabase indisponível. Revise o ambiente e tente novamente.");
      return;
    }

    const parsed = customerSchema.safeParse(customerDraft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Revise o cliente.");
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Sessão não encontrada. Faça login novamente.");
      router.replace("/login");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("customers")
      .insert({ ...parsed.data, user_id: user.id })
      .select("*")
      .single();

    if (insertError) {
      setError("Não conseguimos salvar o cliente.");
      return;
    }

    setCustomers((current) => [data as CustomerLead, ...current]);
    setCustomerDraft(emptyCustomer);
    showFeedback("Cliente cadastrado.");
  }

  async function updateCustomer(item: CustomerLead, updates: Partial<CustomerLead>) {
    if (!supabase) {
      setError("Supabase indisponível. Revise o ambiente e tente novamente.");
      return;
    }
    const next = { ...item, ...updates, updated_at: new Date().toISOString() };
    setCustomers((current) => current.map((customer) => (customer.id === item.id ? next : customer)));
    const { error: updateError } = await supabase.from("customers").update(updates).eq("id", item.id);
    if (updateError) setError("Não conseguimos atualizar o cliente.");
  }

  function copyText(value: string) {
    void navigator.clipboard?.writeText(value);
    showFeedback("Resposta copiada.");
  }

  const planName = subscription?.plan_name || currentPlan?.name || "Sem assinatura";
  const monthlyLimit = getPlanLimit(subscription, currentPlan);
  const monthlyRemaining = Math.max(monthlyLimit - monthlyUsage, 0);
  const hasReachedMonthlyLimit = monthlyUsage >= monthlyLimit;
  const isFreeOrTrial = !subscription?.plan_name || subscription.plan_name.toLowerCase() === "free" || subscription.status?.toLowerCase() === "trial";
  const responseLimit = monthlyLimit.toLocaleString("pt-BR");
  const overviewCards = [
    {
      label: "Plano atual",
      value: planName,
      detail: subscription?.status ? `Status: ${subscription.status}` : "Assinatura ainda não configurada",
      icon: CreditCard
    },
    {
      label: "Uso mensal",
      value: `${monthlyUsage}/${responseLimit}`,
      detail: "Respostas usadas neste mês",
      icon: Bot
    },
    {
      label: "Negócio cadastrado",
      value: business ? "Sim" : "Pendente",
      detail: business ? business.business_name : "Cadastre para personalizar respostas",
      icon: BriefcaseBusiness
    },
    {
      label: "Clientes",
      value: customers.length.toString(),
      detail: "Clientes e leads cadastrados",
      icon: Users
    },
    {
      label: "Respostas geradas",
      value: history.length.toString(),
      detail: "Histórico salvo da conta",
      icon: Clipboard
    }
  ];

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090d12] px-4 text-slate-100">
        <div className="rounded-lg border border-white/10 bg-[#101821] p-6 text-center shadow-2xl shadow-black/30">
          <RefreshCw className="mx-auto mb-3 h-5 w-5 animate-spin text-emerald-300" />
          <p className="text-sm font-bold text-slate-300">Carregando seu painel...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-6 text-slate-100">
      <section className="mx-auto max-w-7xl">
        <header className="mb-5 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                <MessageCircle className="h-4 w-4" />
                MVP SaaS
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Assistente IA para WhatsApp</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Olá, {userName}. Cadastre seu negócio, cole a pergunta do cliente e gere uma resposta profissional.
              </p>
            </div>
            <button type="button" onClick={handleLogout} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 hover:bg-white/10">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </header>

        {!business ? (
          <div className="mb-5 rounded-lg border border-amber-400/30 bg-amber-400/10 p-5 text-sm font-bold text-amber-100">
            <p className="text-base text-white">Nenhum negócio cadastrado ainda.</p>
            <p className="mt-2 font-medium text-amber-100/90">Cadastre os dados do seu negócio para a IA personalizar as respostas.</p>
            <button type="button" onClick={() => setTab("business")} className="mt-4 rounded-md bg-amber-300 px-4 py-2 text-xs font-black text-slate-950 hover:bg-amber-200">
              Cadastrar negócio
            </button>
          </div>
        ) : null}
        {(feedback || error) ? (
          <div className={`mb-5 rounded-lg border p-4 text-sm font-bold ${error ? "border-red-400/30 bg-red-500/10 text-red-200" : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"}`}>
            {error || feedback}
          </div>
        ) : null}
        {isFreeOrTrial ? (
          <div className="mb-5 flex flex-col gap-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100 md:flex-row md:items-center md:justify-between">
            <p>
              Respostas usadas neste mês: <strong>{monthlyUsage} / {responseLimit}</strong>. Faça upgrade para aumentar seu limite.
            </p>
            <button type="button" onClick={() => router.push("/plans")} className="rounded-md bg-emerald-300 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-200">
              Ver planos
            </button>
          </div>
        ) : null}
        {hasReachedMonthlyLimit ? (
          <div className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm font-bold text-red-200">
            Você atingiu o limite de respostas do seu plano neste mês. Faça upgrade para continuar usando.
          </div>
        ) : null}

        <section className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {overviewCards.map((card) => (
            <article className="rounded-lg border border-white/10 bg-[#101821] p-4 shadow-xl shadow-black/20" key={card.label}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-300">
                <card.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{card.label}</p>
              <p className="mt-2 text-2xl font-black text-white">{card.value}</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">{card.detail}</p>
            </article>
          ))}
        </section>

        <section className="mb-5 grid gap-3 md:grid-cols-4">
          {[
            ["Gerar resposta", "assistant", Bot],
            ["Cadastrar negócio", "business", BriefcaseBusiness],
            ["Clientes", "customers", Users],
            ["Planos", "plans", CreditCard]
          ].map(([label, target, Icon]) => (
            target === "plans" ? (
              <button key={label as string} type="button" onClick={() => router.push("/plans")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 text-sm font-black text-slate-100 hover:bg-white/10">
                <Icon className="h-4 w-4" />
                {label as string}
              </button>
            ) : (
              <button key={label as string} type="button" onClick={() => setTab(target as DashboardTab)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 text-sm font-black text-slate-100 hover:bg-white/10">
                <Icon className="h-4 w-4" />
                {label as string}
              </button>
            )
          ))}
        </section>

        <nav className="mb-5 flex flex-wrap gap-2 rounded-lg border border-white/10 bg-[#101821] p-2">
          {[
            ["assistant", "Gerar resposta", Bot],
            ["business", "Meu negócio", BriefcaseBusiness],
            ["history", "Histórico", Clipboard],
            ["customers", "Clientes", Users]
          ].map(([id, label, Icon]) => (
            <button
              key={id as string}
              type="button"
              onClick={() => {
                setTab(id as DashboardTab);
                setError("");
              }}
              className={`inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-black transition ${
                tab === id ? "bg-emerald-400 text-slate-950" : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label as string}
            </button>
          ))}
        </nav>

        {tab === "assistant" ? (
          <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={handleGenerateResponse} className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
              <h2 className="text-xl font-black text-white">Responder cliente</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Cole a mensagem recebida no WhatsApp e escolha o objetivo da resposta.</p>
              <label className="mt-5 grid gap-2 text-sm font-bold text-slate-300">
                Pergunta do cliente
                <textarea value={question} onChange={(event) => setQuestion(event.target.value)} className="field-input min-h-40 resize-none py-3" placeholder="Ex.: Oi, quanto custa e tem horário hoje?" />
              </label>
              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
                Tipo de resposta
                <select value={responseType} onChange={(event) => setResponseType(event.target.value as ResponseType)} className="field-input">
                  {responseTypes.map((type) => (
                    <option value={type} key={type}>
                      {responseTypeLabels[type]}
                    </option>
                  ))}
                </select>
              </label>
              <p className="mt-4 text-xs font-bold text-slate-400">
                Respostas usadas neste mês: {monthlyUsage} / {responseLimit}. Restam {monthlyRemaining}.
              </p>
              <button type="submit" disabled={generating || !business || hasReachedMonthlyLimit} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60">
                <Send className="h-4 w-4" />
                {hasReachedMonthlyLimit ? "Limite mensal atingido" : generating ? "Gerando resposta..." : "Gerar resposta com IA"}
              </button>
            </form>

            <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-black text-white">Resposta gerada</h2>
                {generatedAnswer ? (
                  <button type="button" onClick={() => copyText(generatedAnswer)} className="rounded-md bg-white px-3 py-2 text-xs font-black text-slate-950 hover:bg-slate-200">
                    Copiar
                  </button>
                ) : null}
              </div>
              {generatedAnswer ? (
                <p className="whitespace-pre-wrap rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm leading-7 text-emerald-50">{generatedAnswer}</p>
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center text-sm leading-6 text-slate-400">
                  <MessageCircle className="mb-4 h-8 w-8 text-slate-500" />
                  <p className="font-bold text-slate-200">A resposta pronta para copiar aparecerá aqui.</p>
                  <p className="mt-2 max-w-sm">Cole uma pergunta real do cliente e escolha o objetivo da mensagem.</p>
                </div>
              )}
            </article>
          </section>
        ) : null}

        {tab === "business" ? (
          <form onSubmit={handleSaveBusiness} className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <h2 className="text-xl font-black text-white">Dados do negócio</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["business_name", "Nome do negócio"],
                ["business_area", "Área de atuação"],
                ["opening_hours", "Horário de atendimento"],
                ["address", "Endereço"],
                ["payment_methods", "Formas de pagamento"],
                ["booking_or_payment_link", "Link de pagamento ou agendamento"],
                ["brand_tone", "Tom de voz da marca"]
              ].map(([key, label]) => (
                <label className="grid gap-2 text-sm font-bold text-slate-300" key={key}>
                  {label}
                  <input value={businessDraft[key as keyof BusinessDraft]} onChange={(event) => setBusinessDraft((current) => ({ ...current, [key]: event.target.value }))} className="field-input" />
                </label>
              ))}
              <label className="grid gap-2 text-sm font-bold text-slate-300 md:col-span-2">
                Descrição do negócio
                <textarea value={businessDraft.description} onChange={(event) => setBusinessDraft((current) => ({ ...current, description: event.target.value }))} className="field-input min-h-24 resize-none py-3" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300 md:col-span-2">
                Produtos ou serviços
                <textarea value={businessDraft.products_services} onChange={(event) => setBusinessDraft((current) => ({ ...current, products_services: event.target.value }))} className="field-input min-h-24 resize-none py-3" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300 md:col-span-2">
                Preços
                <textarea value={businessDraft.prices} onChange={(event) => setBusinessDraft((current) => ({ ...current, prices: event.target.value }))} className="field-input min-h-24 resize-none py-3" />
              </label>
            </div>
            <button type="submit" disabled={savingBusiness} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300 disabled:opacity-60">
              <Save className="h-4 w-4" />
              {savingBusiness ? "Salvando..." : "Salvar negócio"}
            </button>
          </form>
        ) : null}

        {tab === "history" ? (
          <section className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <h2 className="text-xl font-black text-white">Histórico de respostas</h2>
            <div className="mt-5 grid gap-3">
              {history.length ? history.map((item) => (
                <article className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={item.id}>
                  <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <span className="text-xs font-black uppercase tracking-wide text-emerald-300">{item.response_type || "resposta"}</span>
                    <span className="text-xs text-slate-500">{formatDate(item.created_at)}</span>
                  </div>
                  <p className="text-sm font-bold text-white">Cliente: {item.customer_question}</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{item.generated_answer}</p>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => copyText(item.generated_answer)} className="rounded-md bg-white px-3 py-2 text-xs font-black text-slate-950">Copiar</button>
                    <button type="button" onClick={() => handleDeleteHistory(item.id)} className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-black text-red-200">Excluir</button>
                  </div>
                </article>
              )) : (
                <div className="rounded-md border border-dashed border-white/15 bg-white/[0.04] p-8 text-center text-sm text-slate-400">
                  <Clipboard className="mx-auto mb-4 h-8 w-8 text-slate-500" />
                  <p className="font-bold text-slate-200">Nenhuma resposta gerada ainda.</p>
                  <p className="mt-2">Gere sua primeira resposta para ver o histórico salvo aqui.</p>
                  <button type="button" onClick={() => setTab("assistant")} className="mt-4 rounded-md bg-emerald-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-300">
                    Gerar resposta
                  </button>
                </div>
              )}
            </div>
          </section>
        ) : null}

        {tab === "customers" ? (
          <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <form onSubmit={handleCreateCustomer} className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20 lg:self-start">
              <h2 className="text-xl font-black text-white">Novo cliente</h2>
              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
                Nome
                <input value={customerDraft.name} onChange={(event) => setCustomerDraft((current) => ({ ...current, name: event.target.value }))} className="field-input" />
              </label>
              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
                Telefone
                <input value={customerDraft.phone} onChange={(event) => setCustomerDraft((current) => ({ ...current, phone: event.target.value }))} className="field-input" />
              </label>
              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
                Status
                <select value={customerDraft.status} onChange={(event) => setCustomerDraft((current) => ({ ...current, status: event.target.value as CustomerStatus }))} className="field-input">
                  {customerStatuses.map((status) => (
                    <option value={status} key={status}>{customerStatusLabels[status]}</option>
                  ))}
                </select>
              </label>
              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
                Observações
                <textarea value={customerDraft.notes} onChange={(event) => setCustomerDraft((current) => ({ ...current, notes: event.target.value }))} className="field-input min-h-24 resize-none py-3" />
              </label>
              <button type="submit" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300">
                <Plus className="h-4 w-4" />
                Cadastrar cliente
              </button>
            </form>

            <div className="grid gap-3">
              {customers.length ? customers.map((customer) => (
                <article className="rounded-lg border border-white/10 bg-[#101821] p-4 shadow-xl shadow-black/20" key={customer.id}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-black text-white">{customer.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{customer.phone || "Sem telefone"}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(customer.status)}`}>
                      {customerStatusLabels[customer.status]}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-[220px_1fr]">
                    <select value={customer.status} onChange={(event) => updateCustomer(customer, { status: event.target.value as CustomerStatus })} className="field-input">
                      {customerStatuses.map((status) => <option value={status} key={status}>{customerStatusLabels[status]}</option>)}
                    </select>
                    <textarea value={customer.notes || ""} onChange={(event) => updateCustomer(customer, { notes: event.target.value })} className="field-input min-h-20 resize-none py-3" placeholder="Observações do atendimento" />
                  </div>
                  <button type="button" onClick={() => handleDeleteCustomer(customer.id)} className="mt-3 inline-flex items-center gap-2 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-black text-red-200">
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                  </button>
                </article>
              )) : (
                <div className="rounded-lg border border-dashed border-white/15 bg-[#101821] p-8 text-center text-sm text-slate-400">
                  <Users className="mx-auto mb-4 h-8 w-8 text-slate-500" />
                  <p className="font-bold text-slate-200">Nenhum cliente cadastrado ainda.</p>
                  <p className="mt-2">Cadastre clientes e leads para acompanhar status e observações importantes.</p>
                </div>
              )}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

export default function SaasDashboardPage() {
  return (
    <ProtectedRoute>
      <SaasDashboardContent />
    </ProtectedRoute>
  );
}
