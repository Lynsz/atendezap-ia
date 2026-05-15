"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Clipboard,
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
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase/browser";
import type { Business, CustomerLead, CustomerStatus, GeneratedResponse, ResponseType } from "@/types/mvp";

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
  orcamento: "Orcamento",
  cliente_indeciso: "Cliente indeciso",
  pos_venda: "Pos-venda",
  recuperacao: "Recuperacao"
};

const customerStatusLabels: Record<CustomerStatus, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  orcamento_enviado: "Orcamento enviado",
  aguardando_resposta: "Aguardando resposta",
  venda_concluida: "Venda concluida",
  perdido: "Perdido"
};

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

  const supabase = useMemo(() => (isSupabaseBrowserConfigured() ? getSupabaseBrowserClient() : null), []);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 3000);
  }

  const loadDashboardData = useCallback(async () => {
    if (!supabase) {
      setError("Supabase nao configurado. Configure as variaveis de ambiente.");
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

    const [{ data: businessData }, { data: responseData }, { data: customerData }] = await Promise.all([
      supabase.from("businesses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("generated_responses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      supabase.from("customers").select("*").eq("user_id", user.id).order("updated_at", { ascending: false })
    ]);

    setBusiness((businessData as Business | null) || null);
    setBusinessDraft(toBusinessDraft((businessData as Business | null) || null));
    setHistory((responseData as GeneratedResponse[] | null) || []);
    setCustomers((customerData as CustomerLead[] | null) || []);
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

    if (!supabase) return;

    const parsed = businessSchema.safeParse(businessDraft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Revise os dados do negocio.");
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return;

    setSavingBusiness(true);
    const payload = { ...parsed.data, user_id: user.id, updated_at: new Date().toISOString() };
    const request = business
      ? supabase.from("businesses").update(payload).eq("id", business.id).eq("user_id", user.id).select("*").single()
      : supabase.from("businesses").insert(payload).select("*").single();
    const { data, error: saveError } = await request;
    setSavingBusiness(false);

    if (saveError) {
      setError("Nao conseguimos salvar o negocio. Confira o schema e as policies no Supabase.");
      return;
    }

    setBusiness(data as Business);
    setBusinessDraft(toBusinessDraft(data as Business));
    showFeedback("Negocio salvo com sucesso.");
  }

  async function handleGenerateResponse(event: FormEvent) {
    event.preventDefault();
    setError("");
    setGeneratedAnswer("");

    if (!supabase) return;
    if (!business) {
      setError("Cadastre seu negocio antes de gerar respostas.");
      setTab("business");
      return;
    }
    if (!question.trim()) {
      setError("Cole a pergunta do cliente.");
      return;
    }

    const {
      data: { session }
    } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/login");
      return;
    }

    setGenerating(true);
    const response = await fetch("/api/generate-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        customerQuestion: question,
        responseType,
        businessId: business.id,
        businessData: {
          id: business.id,
          ...businessDraft
        }
      })
    });
    const json = (await response.json()) as { error?: string; generatedAnswer?: string; saved?: GeneratedResponse };
    setGenerating(false);

    if (!response.ok || !json.generatedAnswer) {
      setError(json.error || "Nao conseguimos gerar a resposta agora.");
      return;
    }

    setGeneratedAnswer(json.generatedAnswer);
    if (json.saved) setHistory((current) => [json.saved as GeneratedResponse, ...current]);
    showFeedback("Resposta gerada e salva no historico.");
  }

  async function handleDeleteHistory(itemId: string) {
    if (!supabase) return;
    await supabase.from("generated_responses").delete().eq("id", itemId);
    setHistory((current) => current.filter((item) => item.id !== itemId));
  }

  async function handleDeleteCustomer(itemId: string) {
    if (!supabase) return;
    await supabase.from("customers").delete().eq("id", itemId);
    setCustomers((current) => current.filter((item) => item.id !== itemId));
    showFeedback("Cliente excluido.");
  }

  async function handleCreateCustomer(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!supabase) return;

    const parsed = customerSchema.safeParse(customerDraft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Revise o cliente.");
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error: insertError } = await supabase
      .from("customers")
      .insert({ ...parsed.data, user_id: user.id })
      .select("*")
      .single();

    if (insertError) {
      setError("Nao conseguimos salvar o cliente.");
      return;
    }

    setCustomers((current) => [data as CustomerLead, ...current]);
    setCustomerDraft(emptyCustomer);
    showFeedback("Cliente cadastrado.");
  }

  async function updateCustomer(item: CustomerLead, updates: Partial<CustomerLead>) {
    if (!supabase) return;
    const next = { ...item, ...updates, updated_at: new Date().toISOString() };
    setCustomers((current) => current.map((customer) => (customer.id === item.id ? next : customer)));
    await supabase.from("customers").update(updates).eq("id", item.id);
  }

  function copyText(value: string) {
    void navigator.clipboard?.writeText(value);
    showFeedback("Texto copiado.");
  }

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
                Ola, {userName}. Cadastre seu negocio, cole a pergunta do cliente e gere uma resposta profissional.
              </p>
            </div>
            <button type="button" onClick={handleLogout} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 hover:bg-white/10">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </header>

        {!business ? (
          <div className="mb-5 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm font-bold text-amber-100">
            Cadastre os dados do seu negocio para a IA personalizar as respostas.
          </div>
        ) : null}
        {(feedback || error) ? (
          <div className={`mb-5 rounded-lg border p-4 text-sm font-bold ${error ? "border-red-400/30 bg-red-500/10 text-red-200" : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"}`}>
            {error || feedback}
          </div>
        ) : null}

        <nav className="mb-5 flex flex-wrap gap-2 rounded-lg border border-white/10 bg-[#101821] p-2">
          {[
            ["assistant", "Gerar resposta", Bot],
            ["business", "Meu negocio", BriefcaseBusiness],
            ["history", "Historico", Clipboard],
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
                <textarea value={question} onChange={(event) => setQuestion(event.target.value)} className="field-input min-h-40 resize-none py-3" placeholder="Ex.: Oi, quanto custa e tem horario hoje?" />
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
              <button type="submit" disabled={generating || !business} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60">
                <Send className="h-4 w-4" />
                {generating ? "Gerando..." : "Gerar resposta com IA"}
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
                <div className="flex min-h-72 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center text-sm leading-6 text-slate-400">
                  A resposta pronta para copiar aparecerá aqui.
                </div>
              )}
            </article>
          </section>
        ) : null}

        {tab === "business" ? (
          <form onSubmit={handleSaveBusiness} className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <h2 className="text-xl font-black text-white">Dados do negocio</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["business_name", "Nome do negocio"],
                ["business_area", "Area de atuacao"],
                ["opening_hours", "Horario de atendimento"],
                ["address", "Endereco"],
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
                Descricao do negocio
                <textarea value={businessDraft.description} onChange={(event) => setBusinessDraft((current) => ({ ...current, description: event.target.value }))} className="field-input min-h-24 resize-none py-3" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300 md:col-span-2">
                Produtos ou servicos
                <textarea value={businessDraft.products_services} onChange={(event) => setBusinessDraft((current) => ({ ...current, products_services: event.target.value }))} className="field-input min-h-24 resize-none py-3" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300 md:col-span-2">
                Precos
                <textarea value={businessDraft.prices} onChange={(event) => setBusinessDraft((current) => ({ ...current, prices: event.target.value }))} className="field-input min-h-24 resize-none py-3" />
              </label>
            </div>
            <button type="submit" disabled={savingBusiness} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300 disabled:opacity-60">
              <Save className="h-4 w-4" />
              {savingBusiness ? "Salvando..." : "Salvar negocio"}
            </button>
          </form>
        ) : null}

        {tab === "history" ? (
          <section className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <h2 className="text-xl font-black text-white">Historico de respostas</h2>
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
                <p className="rounded-md border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-400">Nenhuma resposta gerada ainda.</p>
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
                Observacoes
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
                    <textarea value={customer.notes || ""} onChange={(event) => updateCustomer(customer, { notes: event.target.value })} className="field-input min-h-20 resize-none py-3" placeholder="Observacoes do atendimento" />
                  </div>
                  <button type="button" onClick={() => handleDeleteCustomer(customer.id)} className="mt-3 inline-flex items-center gap-2 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-black text-red-200">
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                  </button>
                </article>
              )) : (
                <p className="rounded-lg border border-white/10 bg-[#101821] p-5 text-sm text-slate-400">Nenhum cliente cadastrado ainda.</p>
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
