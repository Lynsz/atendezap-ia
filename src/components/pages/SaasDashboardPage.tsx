"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  MessageSquare,
  Plus,
  RefreshCw,
  Save,
  Send,
  Trash2,
  Users
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StripeCheckoutButton } from "@/components/checkout/StripeCheckoutButton";
import { PLAN_IDS, SAAS_PLANS, type PlanId } from "@/config/plans";
import { businessSchema, customerSchema, customerStatuses, responseTypes } from "@/lib/mvp-validators";
import { getPlanResponseLimit } from "@/lib/plan-limits";
import { isSupabaseBrowserConfigured, supabase as supabaseBrowserClient } from "@/lib/supabase/browser";
import { trackEvent } from "@/lib/tracking";
import { generateCustomerResponse } from "@/services/ai";
import type { Business, CustomerLead, CustomerStatus, GeneratedResponse, Plan, ResponseType, Subscription } from "@/types/mvp";

type DashboardTab = "assistant" | "business" | "history" | "customers" | "billing";

type BusinessDraft = {
  business_name: string;
  business_area: string;
  business_type: string;
  location: string;
  description: string;
  products_services: string;
  common_questions: string;
  important_info: string;
  prices: string;
  opening_hours: string;
  main_channel: string;
  response_goal: string;
  address: string;
  payment_methods: string;
  booking_or_payment_link: string;
  brand_tone: string;
  onboarding_completed: boolean;
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
  business_type: "Prestador de serviço",
  location: "",
  description: "",
  products_services: "",
  common_questions: "",
  important_info: "",
  prices: "",
  opening_hours: "",
  main_channel: "WhatsApp",
  response_goal: "Responder em até 15 minutos",
  address: "",
  payment_methods: "",
  booking_or_payment_link: "",
  brand_tone: "profissional, simpático e objetivo",
  onboarding_completed: false
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

const businessTypeOptions = ["Autônomo", "Prestador de serviço", "Loja", "Delivery", "Estética", "Restaurante", "Assistência técnica", "Outro"];

const mainChannelOptions = ["WhatsApp", "Instagram", "Telefone", "Outros"];

const responseGoalOptions = ["Responder em até 5 minutos", "Responder em até 15 minutos", "Responder em até 1 hora", "Responder no mesmo dia"];

const toneOptions = ["Profissional", "Simpático", "Direto", "Vendedor", "Acolhedor"];

const exampleQuestionsByType: Record<string, string[]> = {
  "Autônomo": ["Qual o valor do serviço?", "Você atende hoje?", "Como faço para agendar?"],
  "Prestador de serviço": ["Qual o valor do serviço?", "Vocês fazem orçamento?", "Quais formas de pagamento?"],
  Loja: ["Tem esse produto disponível?", "Quais formas de pagamento?", "Pode me passar mais informações?"],
  Delivery: ["Tem entrega?", "Qual o prazo de entrega?", "Quais formas de pagamento?"],
  Estética: ["Como faço para agendar?", "Qual o valor do procedimento?", "Vocês atendem hoje?"],
  Restaurante: ["Tem entrega?", "Qual o cardápio de hoje?", "Quais formas de pagamento?"],
  "Assistência técnica": ["Vocês fazem orçamento?", "Qual o prazo do conserto?", "Como funciona a garantia?"],
  Outro: ["Qual o valor do serviço?", "Vocês atendem hoje?", "Pode me passar mais informações?"]
};

function getCurrentMonthStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

function getPlanLimit(subscription: Subscription | null, plan: Plan | null) {
  return plan?.response_limit || getPlanResponseLimit(subscription?.plan || subscription?.plan_name, subscription?.status);
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

function formatShortDate(value?: string | null) {
  if (!value) return "Não informado";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

function toBusinessDraft(business: Business | null): BusinessDraft {
  if (!business) return emptyBusiness;
  return {
    business_name: business.business_name || "",
    business_area: business.business_area || "",
    business_type: business.business_type || business.business_area || "Prestador de serviço",
    location: business.location || "",
    description: business.description || "",
    products_services: business.products_services || "",
    common_questions: business.common_questions || "",
    important_info: business.important_info || "",
    prices: business.prices || "",
    opening_hours: business.opening_hours || "",
    main_channel: business.main_channel || "WhatsApp",
    response_goal: business.response_goal || "Responder em até 15 minutos",
    address: business.address || "",
    payment_methods: business.payment_methods || "",
    booking_or_payment_link: business.booking_or_payment_link || "",
    brand_tone: business.brand_tone || "profissional, simpático e objetivo",
    onboarding_completed: Boolean(business.onboarding_completed)
  };
}

function statusClass(status: CustomerStatus) {
  if (status === "venda_concluida") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (status === "perdido") return "border-red-400/30 bg-red-500/10 text-red-200";
  if (status === "aguardando_resposta") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  return "border-sky-400/30 bg-sky-400/10 text-sky-200";
}

function subscriptionStatusLabel(status?: string | null) {
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus === "active") return "Ativa";
  if (normalizedStatus === "trial") return "Teste";
  if (normalizedStatus === "trialing") return "Teste";
  if (normalizedStatus === "pending") return "Pendente";
  if (normalizedStatus === "past_due") return "Pagamento pendente";
  if (normalizedStatus === "canceled") return "Cancelada";
  if (normalizedStatus === "inactive") return "Inativa";
  return "Sem assinatura ativa";
}

function subscriptionStatusClass(status?: string | null) {
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus === "active" || normalizedStatus === "trial" || normalizedStatus === "trialing") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  }
  if (normalizedStatus === "pending") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  if (normalizedStatus === "past_due") return "border-orange-400/30 bg-orange-400/10 text-orange-200";
  return "border-red-400/30 bg-red-500/10 text-red-200";
}

function hasActiveSubscription(status?: string | null) {
  const normalizedStatus = status?.toLowerCase();
  return normalizedStatus === "active" || normalizedStatus === "trial" || normalizedStatus === "trialing";
}

function normalizePlanId(planName?: string | null): PlanId | null {
  if (!planName) return null;
  const normalizedPlanName = planName.toLowerCase();
  return PLAN_IDS.find((planId) => planId === normalizedPlanName || SAAS_PLANS[planId].name.toLowerCase() === normalizedPlanName) ?? null;
}

function getExampleQuestions(businessType: string) {
  return exampleQuestionsByType[businessType] || exampleQuestionsByType.Outro;
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
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [question, setQuestion] = useState("");
  const [responseType, setResponseType] = useState<ResponseType>("atendimento");
  const [generatedAnswer, setGeneratedAnswer] = useState("");
  const [history, setHistory] = useState<GeneratedResponse[]>([]);
  const [customers, setCustomers] = useState<CustomerLead[]>([]);
  const [customerDraft, setCustomerDraft] = useState<CustomerDraft>(emptyCustomer);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [monthlyUsage, setMonthlyUsage] = useState(0);
  const trackedActiveSubscriptionRef = useRef(false);
  const trackedDashboardOnboardingRef = useRef(false);

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
    const activePlanName = subscriptionRow?.plan || subscriptionRow?.plan_name;
    const matchedPlan = activePlanName
      ? planRows.find((plan) => plan.name.toLowerCase() === activePlanName.toLowerCase())
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

  async function handleSaveBusiness(event?: FormEvent, options?: { completeOnboarding?: boolean; successMessage?: string }) {
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
    const payload = {
      ...parsed.data,
      user_id: user.id,
      business_area: parsed.data.business_area || parsed.data.business_type,
      onboarding_completed: options?.completeOnboarding ? true : parsed.data.onboarding_completed
    };
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
    if (options?.completeOnboarding) {
      trackEvent("onboarding_completed", {
        source: "dashboard",
        business_type: payload.business_type
      });
      setTab("assistant");
      setQuestion(getExampleQuestions(payload.business_type)[0] || "Qual o valor do serviço?");
    }
    showFeedback(options?.successMessage || "Negócio salvo com sucesso.");
  }

  function validateOnboardingStep() {
    if (onboardingStep === 1) {
      if (!businessDraft.business_name.trim()) return "Informe o nome do negócio ou nome profissional.";
      if (!businessDraft.business_type.trim()) return "Escolha o tipo de atuação.";
    }
    if (onboardingStep === 2) {
      if (!businessDraft.main_channel.trim()) return "Escolha o principal canal de atendimento.";
      if (!businessDraft.opening_hours.trim()) return "Informe o horário de atendimento.";
      if (!businessDraft.response_goal.trim()) return "Escolha o tempo médio desejado para resposta.";
    }
    if (onboardingStep === 3) {
      if (!businessDraft.products_services.trim()) return "Informe o que você vende ou oferece.";
      if (!businessDraft.common_questions.trim()) return "Informe algumas perguntas comuns dos clientes.";
      if (!businessDraft.important_info.trim()) return "Informe o que a IA precisa saber para responder melhor.";
      if (!businessDraft.brand_tone.trim()) return "Escolha o tom de voz desejado.";
    }
    return "";
  }

  function handleNextOnboardingStep() {
    const validationError = validateOnboardingStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setOnboardingStep((current) => Math.min(4, current + 1));
  }

  function handleBackOnboardingStep() {
    setError("");
    setOnboardingStep((current) => Math.max(1, current - 1));
  }

  async function handleFinishOnboarding() {
    const validationError = validateOnboardingStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    await handleSaveBusiness(undefined, {
      completeOnboarding: true,
      successMessage: "Configuração concluída. Agora a IA já pode gerar respostas mais alinhadas ao seu atendimento."
    });
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
      const isFirstGeneratedResponse = history.length === 0;
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
        if (isFirstGeneratedResponse) {
          trackEvent("first_response_generated", {
            source: "dashboard",
            response_type: responseType
          });
        }
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
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Sessão não encontrada. Faça login novamente.");
      router.replace("/login");
      return;
    }

    const { error: deleteError } = await supabase.from("generated_responses").delete().eq("id", itemId).eq("user_id", user.id);
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
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Sessão não encontrada. Faça login novamente.");
      router.replace("/login");
      return;
    }

    const { error: deleteError } = await supabase.from("customers").delete().eq("id", itemId).eq("user_id", user.id);
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
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Sessão não encontrada. Faça login novamente.");
      router.replace("/login");
      return;
    }

    const next = { ...item, ...updates, updated_at: new Date().toISOString() };
    setCustomers((current) => current.map((customer) => (customer.id === item.id ? next : customer)));
    const { error: updateError } = await supabase.from("customers").update(updates).eq("id", item.id).eq("user_id", user.id);
    if (updateError) setError("Não conseguimos atualizar o cliente.");
  }

  function copyText(value: string) {
    void navigator.clipboard?.writeText(value);
    showFeedback("Resposta copiada.");
  }

  function openGeneratedResponseFeedback() {
    trackEvent("feedback_cta_click", {
      source: "generated_response"
    });
    router.push("/feedback?source=generated_response");
  }

  async function manageStripeSubscription() {
    setError("");
    try {
      const { data } = await supabaseBrowserClient.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        setError(result.error || "Não foi possível abrir o portal da assinatura.");
        return;
      }
      window.location.href = result.url;
    } catch {
      setError("Não foi possível abrir o portal da assinatura agora.");
    }
  }

  const planName = subscription?.plan || subscription?.plan_name || currentPlan?.name || "Sem assinatura";
  const monthlyLimit = getPlanLimit(subscription, currentPlan);
  const monthlyRemaining = Math.max(monthlyLimit - monthlyUsage, 0);
  const hasReachedMonthlyLimit = monthlyUsage >= monthlyLimit;
  const subscriptionPlanName = subscription?.plan || subscription?.plan_name;
  const activeSubscription = hasActiveSubscription(subscription?.status);
  const currentPlanId = normalizePlanId(subscriptionPlanName);
  const usagePercent = monthlyLimit > 0 ? Math.min(100, Math.round((monthlyUsage / monthlyLimit) * 100)) : 0;
  const isNearMonthlyLimit = usagePercent >= 80 && !hasReachedMonthlyLimit;
  const canManageStripeSubscription =
    subscription?.provider === "stripe" && Boolean(subscription.provider_customer_id || subscription.stripe_customer_id);
  const isFreeOrTrial = !subscriptionPlanName || subscriptionPlanName.toLowerCase() === "free" || subscription?.status?.toLowerCase() === "trial";
  const shouldShowOnboarding = !business?.onboarding_completed;
  const exampleQuestions = getExampleQuestions(businessDraft.business_type);
  const responseLimit = monthlyLimit.toLocaleString("pt-BR");
  const renewalDetail = subscription?.current_period_end
    ? `Renova em ${new Intl.DateTimeFormat("pt-BR").format(new Date(subscription.current_period_end))}`
    : subscription?.status
      ? `Status: ${subscription.status}`
      : "Assinatura ainda não configurada";

  useEffect(() => {
    if (!trackedActiveSubscriptionRef.current && hasActiveSubscription(subscription?.status)) {
      trackedActiveSubscriptionRef.current = true;
      trackEvent("subscription_active", {
        plan: subscription?.plan || subscription?.plan_name || "unknown",
        provider: subscription?.provider || "unknown"
      });
    }
  }, [subscription]);

  useEffect(() => {
    if (!loading && shouldShowOnboarding && !trackedDashboardOnboardingRef.current) {
      trackedDashboardOnboardingRef.current = true;
      trackEvent("onboarding_started", {
        source: "dashboard"
      });
    }
  }, [loading, shouldShowOnboarding]);
  const overviewCards = [
    {
      label: "Plano atual",
      value: planName,
      detail: renewalDetail,
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
                Olá, {userName}. Cadastre seu negócio, cole a pergunta do cliente e gere uma resposta profissional. A IA sugere o texto; você copia, ajusta e envia pelo WhatsApp.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  trackEvent("support_cta_click", {
                    source: "dashboard_header",
                    destination: "feedback"
                  });
                  router.push("/feedback");
                }}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 hover:bg-white/10"
              >
                <MessageSquare className="h-4 w-4" />
                Enviar feedback
              </button>
              <button
                type="button"
                onClick={() => {
                  trackEvent("support_cta_click", {
                    source: "dashboard_header",
                    destination: "support"
                  });
                  router.push("/suporte");
                }}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                Suporte
              </button>
              {canManageStripeSubscription ? (
                <button type="button" onClick={manageStripeSubscription} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-emerald-300 px-4 text-sm font-black text-slate-950 hover:bg-emerald-200">
                  <CreditCard className="h-4 w-4" />
                  Gerenciar assinatura
                </button>
              ) : null}
              <button type="button" onClick={handleLogout} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 hover:bg-white/10">
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </header>

        {shouldShowOnboarding ? (
          <section className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
            <div className="mb-6">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Configuração inicial</p>
              <h2 className="text-2xl font-black text-white md:text-4xl">Vamos configurar sua IA em poucos minutos</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Essas informações ajudam o AtendeZap IA a criar respostas melhores para seus clientes. Você poderá editar tudo depois. A IA não envia mensagens automaticamente: ela gera uma sugestão para você copiar, ajustar e enviar no WhatsApp.
              </p>
            </div>

            {(feedback || error) ? (
              <div className={`mb-5 rounded-lg border p-4 text-sm font-bold ${error ? "border-red-400/30 bg-red-500/10 text-red-200" : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"}`}>
                {error || feedback}
              </div>
            ) : null}

            <div className="mb-6">
              <div className="mb-3 grid gap-2 sm:grid-cols-4">
                {[
                  [1, "Sobre seu atendimento"],
                  [2, "Canais"],
                  [3, "Produtos e IA"],
                  [4, "Pronto para usar"]
                ].map(([stepId, label]) => (
                  <div
                    key={stepId}
                    className={`rounded-md border px-3 py-2 text-xs font-black ${
                      onboardingStep >= Number(stepId) ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/5 text-slate-400"
                    }`}
                  >
                    {stepId}. {label}
                  </div>
                ))}
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${(onboardingStep / 4) * 100}%` }} />
              </div>
            </div>

            {onboardingStep === 1 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-slate-300">
                  Nome do negócio ou nome profissional
                  <input value={businessDraft.business_name} onChange={(event) => setBusinessDraft((current) => ({ ...current, business_name: event.target.value }))} className="field-input" placeholder="Ex.: Studio Ana Lima" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-300">
                  Tipo de atuação
                  <select value={businessDraft.business_type} onChange={(event) => setBusinessDraft((current) => ({ ...current, business_type: event.target.value, business_area: event.target.value }))} className="field-input">
                    {businessTypeOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-300 md:col-span-2">
                  Cidade/estado, opcional
                  <input value={businessDraft.location} onChange={(event) => setBusinessDraft((current) => ({ ...current, location: event.target.value }))} className="field-input" placeholder="Ex.: Campinas/SP" />
                </label>
              </div>
            ) : null}

            {onboardingStep === 2 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-slate-300">
                  Principal canal de atendimento
                  <select value={businessDraft.main_channel} onChange={(event) => setBusinessDraft((current) => ({ ...current, main_channel: event.target.value }))} className="field-input">
                    {mainChannelOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-300">
                  Tempo médio desejado para resposta
                  <select value={businessDraft.response_goal} onChange={(event) => setBusinessDraft((current) => ({ ...current, response_goal: event.target.value }))} className="field-input">
                    {responseGoalOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-300 md:col-span-2">
                  Horário de atendimento
                  <input value={businessDraft.opening_hours} onChange={(event) => setBusinessDraft((current) => ({ ...current, opening_hours: event.target.value }))} className="field-input" placeholder="Ex.: segunda a sexta, 9h às 18h" />
                </label>
              </div>
            ) : null}

            {onboardingStep === 3 ? (
              <div className="grid gap-4">
                <label className="grid gap-2 text-sm font-bold text-slate-300">
                  O que você vende ou oferece
                  <textarea value={businessDraft.products_services} onChange={(event) => setBusinessDraft((current) => ({ ...current, products_services: event.target.value }))} className="field-input min-h-24 resize-none py-3" placeholder="Ex.: limpeza de pele, design de sobrancelhas e pacotes mensais" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-300">
                  Perguntas mais comuns dos clientes
                  <textarea value={businessDraft.common_questions} onChange={(event) => setBusinessDraft((current) => ({ ...current, common_questions: event.target.value }))} className="field-input min-h-24 resize-none py-3" placeholder="Ex.: valores, horários disponíveis, formas de pagamento e localização" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-300">
                  Informações importantes que a IA deve saber
                  <textarea value={businessDraft.important_info} onChange={(event) => setBusinessDraft((current) => ({ ...current, important_info: event.target.value }))} className="field-input min-h-24 resize-none py-3" placeholder="Ex.: precisa agendar antes, atendimento com hora marcada, pagamento via Pix" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-300">
                  Tom de voz desejado
                  <select value={businessDraft.brand_tone} onChange={(event) => setBusinessDraft((current) => ({ ...current, brand_tone: event.target.value }))} className="field-input">
                    {toneOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                  </select>
                </label>
              </div>
            ) : null}

            {onboardingStep === 4 ? (
              <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <h3 className="text-lg font-black text-white">Resumo da configuração</h3>
                  <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
                    <p><strong className="text-white">Atendimento:</strong> {businessDraft.business_name} ({businessDraft.business_type})</p>
                    <p><strong className="text-white">Canal:</strong> {businessDraft.main_channel} - {businessDraft.response_goal}</p>
                    <p><strong className="text-white">Horário:</strong> {businessDraft.opening_hours}</p>
                    <p><strong className="text-white">Produtos/serviços:</strong> {businessDraft.products_services}</p>
                    <p><strong className="text-white">Tom:</strong> {businessDraft.brand_tone}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4">
                  <h3 className="text-lg font-black text-white">Perguntas para testar</h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-100">Depois de concluir, clique em uma pergunta ou cole uma pergunta real de cliente.</p>
                  <div className="mt-4 grid gap-2">
                    {exampleQuestions.map((example) => (
                      <button key={example} type="button" onClick={() => setQuestion(example)} className="rounded-md border border-emerald-400/30 bg-[#101821] px-3 py-2 text-left text-sm font-bold text-emerald-100 hover:bg-[#172231]">
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" onClick={handleBackOnboardingStep} disabled={onboardingStep === 1} className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/10 bg-white/5 px-5 text-sm font-bold text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">
                Voltar
              </button>
              {onboardingStep < 4 ? (
                <button type="button" onClick={handleNextOnboardingStep} className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300">
                  Próximo
                </button>
              ) : (
                <button type="button" onClick={handleFinishOnboarding} disabled={savingBusiness} className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300 disabled:opacity-60">
                  {savingBusiness ? "Salvando..." : "Começar a gerar respostas"}
                </button>
              )}
            </div>
          </section>
        ) : (
          <>
        {!business ? (
          <div className="mb-5 rounded-lg border border-amber-400/30 bg-amber-400/10 p-5 text-sm font-bold text-amber-100">
            <p className="text-base text-white">Nenhum negócio cadastrado ainda.</p>
            <p className="mt-2 font-medium text-amber-100/90">Configure seu atendimento para a IA gerar respostas melhores. Você pode editar esses dados depois.</p>
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
                Respostas usadas neste mês: <strong>{monthlyUsage} / {responseLimit}</strong>. Se precisar responder mais clientes, escolha um plano com limite maior.
              </p>
            <button type="button" onClick={() => router.push("/plans")} className="rounded-md bg-emerald-300 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-200">
              Ver planos
            </button>
          </div>
        ) : null}
        {hasReachedMonthlyLimit ? (
          <div className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm font-bold text-red-200">
            Você atingiu o limite de respostas do seu plano neste mês. Escolha um plano maior para continuar gerando respostas.
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

        <section className="mb-5 grid gap-3 md:grid-cols-5">
          {[
            ["Gerar resposta", "assistant", Bot],
            [business ? "Editar configuração da IA" : "Configurar atendimento", "business", BriefcaseBusiness],
            ["Clientes", "customers", Users],
            ["Assinatura", "billing", CreditCard],
            ["Preços", "plans", CreditCard]
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
            ["customers", "Clientes", Users],
            ["billing", "Assinatura", CreditCard]
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

        {tab === "billing" ? (
          <section className="grid gap-5">
            <div className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Plano e assinatura</p>
                  <h2 className="text-2xl font-black text-white">Minha assinatura</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Veja seu plano, limite mensal, uso atual e gerencie a assinatura do AtendeZap IA.
                  </p>
                </div>
                {canManageStripeSubscription ? (
                  <button type="button" onClick={manageStripeSubscription} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300">
                    <CreditCard className="h-4 w-4" />
                    Gerenciar assinatura
                  </button>
                ) : (
                  <button type="button" onClick={() => router.push("/precos")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-slate-950 hover:bg-slate-100">
                    <CreditCard className="h-4 w-4" />
                    Escolher plano
                  </button>
                )}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Plano atual</p>
                  <p className="mt-2 text-2xl font-black text-white">{activeSubscription ? planName : "Sem plano ativo"}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{canManageStripeSubscription ? "Assinatura gerenciada pela Stripe" : "Assine um plano para aumentar seu limite"}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Status</p>
                  <span className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-black ${subscriptionStatusClass(subscription?.status)}`}>
                    {subscriptionStatusLabel(subscription?.status)}
                  </span>
                  <p className="mt-3 text-xs leading-5 text-slate-400">{subscription?.cancel_at_period_end ? "Cancelamento agendado para o fim do periodo." : "Acesso liberado quando a assinatura esta ativa."}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Limite mensal</p>
                  <p className="mt-2 text-2xl font-black text-white">{responseLimit}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">Respostas com IA incluidas neste ciclo.</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Renovacao</p>
                  <p className="mt-2 text-2xl font-black text-white">{formatShortDate(subscription?.current_period_end)}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">Fim do periodo atual, quando enviado pela Stripe.</p>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-black text-white">Uso mensal</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Você usou {monthlyUsage} de {responseLimit} respostas neste mês. Restam {monthlyRemaining}.
                    </p>
                  </div>
                  <span className="text-sm font-black text-emerald-300">{usagePercent}%</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className={`h-full rounded-full ${hasReachedMonthlyLimit ? "bg-red-400" : isNearMonthlyLimit ? "bg-amber-300" : "bg-emerald-400"}`} style={{ width: `${usagePercent}%` }} />
                </div>
                {hasReachedMonthlyLimit ? (
                  <p className="mt-3 text-sm font-bold text-red-200">Você atingiu o limite mensal do seu plano.</p>
                ) : isNearMonthlyLimit ? (
                  <p className="mt-3 text-sm font-bold text-amber-200">Você usou {usagePercent}% do seu limite mensal. Faça upgrade para continuar respondendo clientes sem travar o atendimento.</p>
                ) : null}
                <button type="button" onClick={() => router.push("/suporte")} className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 hover:bg-white/10">
                  Preciso de ajuda com minha assinatura
                </button>
              </div>

              {!activeSubscription ? (
                <div className="mt-5 rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
                  <p className="font-black text-white">Sua assinatura não está ativa no momento.</p>
                  <p className="mt-2 leading-6">Escolha um plano para continuar usando o AtendeZap IA com mais limite e recursos.</p>
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {PLAN_IDS.map((planId) => {
                const plan = SAAS_PLANS[planId];
                const isCurrentActivePlan = currentPlanId === plan.id && activeSubscription;
                const checkoutLabel =
                  plan.id === "pro"
                    ? "Assinar Pro por R$ 29 no primeiro mês"
                    : `Assinar ${plan.name}`;

                return (
                  <article
                    key={plan.id}
                    className={`relative rounded-lg border p-5 shadow-xl shadow-black/20 ${
                      plan.recommended ? "border-emerald-300 bg-emerald-300/10" : "border-white/10 bg-[#101821]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{plan.badge}</p>
                        <h3 className="mt-2 text-2xl font-black text-white">{plan.name}</h3>
                      </div>
                      {isCurrentActivePlan ? (
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">
                          Plano atual
                        </span>
                      ) : plan.recommended ? (
                        <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-slate-950">
                          Mais recomendado
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{plan.description}</p>
                    <div className="mt-4">
                      {plan.id === "pro" ? (
                        <>
                          <p className="text-3xl font-black text-white">Primeiro mês por R$ 29</p>
                          <p className="mt-1 text-sm font-bold text-emerald-200">Primeiro mês por R$ 29 para novos usuários</p>
                          <p className="mt-1 text-xs text-slate-400">{plan.recurringPriceLabel || "Depois, continua no valor mensal normal."}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-3xl font-black text-white">{plan.monthlyPriceLabel}</p>
                          <p className="mt-1 text-xs text-slate-400">Cobrança mensal pela Stripe.</p>
                        </>
                      )}
                    </div>
                    <p className="mt-4 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-slate-200">
                      Até {plan.responseLimit.toLocaleString("pt-BR")} respostas com IA por mês
                    </p>
                    <ul className="mt-4 grid gap-2 text-sm text-slate-300">
                      {plan.features.slice(0, 5).map((feature) => (
                        <li key={feature} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5">
                      {isCurrentActivePlan ? (
                        canManageStripeSubscription ? (
                          <button type="button" onClick={manageStripeSubscription} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-slate-950 hover:bg-slate-100">
                            Gerenciar assinatura
                          </button>
                        ) : (
                          <button type="button" disabled className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-md bg-white/10 px-5 text-sm font-black text-slate-400">
                            Plano atual
                          </button>
                        )
                      ) : (
                        <StripeCheckoutButton planId={plan.id} recommended={plan.recommended} label={checkoutLabel} />
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {tab === "assistant" ? (
          <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={handleGenerateResponse} className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
              <h2 className="text-xl font-black text-white">Responder cliente</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Cole a mensagem recebida no WhatsApp e escolha o objetivo. A IA gera uma sugestão para você revisar, copiar e enviar manualmente.</p>
              <label className="mt-5 grid gap-2 text-sm font-bold text-slate-300">
                Pergunta do cliente
                <textarea value={question} onChange={(event) => setQuestion(event.target.value)} className="field-input min-h-40 resize-none py-3" placeholder="Ex.: Oi, quanto custa e tem horário hoje?" />
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {exampleQuestions.map((example) => (
                  <button key={example} type="button" onClick={() => setQuestion(example)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/10">
                    {example}
                  </button>
                ))}
              </div>
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
                <>
                  <p className="whitespace-pre-wrap rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm leading-7 text-emerald-50">{generatedAnswer}</p>
                  <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-bold leading-6 text-slate-200">
                      A resposta ajudou? Copie, ajuste se precisar e envie manualmente pelo WhatsApp.
                    </p>
                    <button
                      type="button"
                      onClick={openGeneratedResponseFeedback}
                      className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-white/10 px-4 text-xs font-black text-slate-100 hover:bg-white/15"
                    >
                      Dar feedback sobre esta resposta
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center text-sm leading-6 text-slate-400">
                  <MessageCircle className="mb-4 h-8 w-8 text-slate-500" />
                  <p className="font-bold text-slate-200">A resposta pronta para copiar aparecerá aqui.</p>
                  <p className="mt-2 max-w-sm">Cole uma pergunta real do cliente e escolha o objetivo da mensagem. Depois revise, copie e envie pelo WhatsApp.</p>
                </div>
              )}
            </article>
          </section>
        ) : null}

        {tab === "business" ? (
          <form onSubmit={handleSaveBusiness} className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <h2 className="text-xl font-black text-white">Configuração da IA</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Atualize o contexto do seu atendimento. As próximas respostas geradas pela IA vão usar essas informações, e você pode ajustar tudo depois.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {([
                ["business_name", "Nome do negócio ou nome profissional"],
                ["location", "Cidade/estado"],
                ["opening_hours", "Horário de atendimento"],
                ["address", "Endereço"],
                ["payment_methods", "Formas de pagamento"],
                ["booking_or_payment_link", "Link de pagamento ou agendamento"],
                ["response_goal", "Tempo médio desejado para resposta"]
              ] as Array<[Exclude<keyof BusinessDraft, "onboarding_completed">, string]>).map(([key, label]) => (
                <label className="grid gap-2 text-sm font-bold text-slate-300" key={key}>
                  {label}
                  <input value={businessDraft[key]} onChange={(event) => setBusinessDraft((current) => ({ ...current, [key]: event.target.value }))} className="field-input" />
                </label>
              ))}
              <label className="grid gap-2 text-sm font-bold text-slate-300">
                Tipo de atuação
                <select value={businessDraft.business_type} onChange={(event) => setBusinessDraft((current) => ({ ...current, business_type: event.target.value, business_area: event.target.value }))} className="field-input">
                  {businessTypeOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300">
                Principal canal de atendimento
                <select value={businessDraft.main_channel} onChange={(event) => setBusinessDraft((current) => ({ ...current, main_channel: event.target.value }))} className="field-input">
                  {mainChannelOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300">
                Tom de voz desejado
                <select value={businessDraft.brand_tone} onChange={(event) => setBusinessDraft((current) => ({ ...current, brand_tone: event.target.value }))} className="field-input">
                  {toneOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300 md:col-span-2">
                Descrição do negócio
                <textarea value={businessDraft.description} onChange={(event) => setBusinessDraft((current) => ({ ...current, description: event.target.value }))} className="field-input min-h-24 resize-none py-3" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300 md:col-span-2">
                Produtos ou serviços
                <textarea value={businessDraft.products_services} onChange={(event) => setBusinessDraft((current) => ({ ...current, products_services: event.target.value }))} className="field-input min-h-24 resize-none py-3" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300 md:col-span-2">
                Perguntas mais comuns dos clientes
                <textarea value={businessDraft.common_questions} onChange={(event) => setBusinessDraft((current) => ({ ...current, common_questions: event.target.value }))} className="field-input min-h-24 resize-none py-3" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300 md:col-span-2">
                Informações importantes que a IA deve saber
                <textarea value={businessDraft.important_info} onChange={(event) => setBusinessDraft((current) => ({ ...current, important_info: event.target.value }))} className="field-input min-h-24 resize-none py-3" />
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
                  <p className="mt-2">Você ainda não gerou respostas. Comece digitando uma pergunta comum de cliente.</p>
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
          </>
        )}
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
