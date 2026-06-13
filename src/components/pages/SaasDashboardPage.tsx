"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Clipboard,
  Copy,
  CreditCard,
  Edit3,
  LogOut,
  MessageCircle,
  MessageSquare,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  ShieldCheck,
  Star,
  Trash2,
  Users
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StripeCheckoutButton } from "@/components/checkout/StripeCheckoutButton";
import { PLAN_IDS, SAAS_PLANS, type PlanId } from "@/config/plans";
import { businessTypeOptions, getBusinessExamples, getBusinessTemplate, getBusinessTypeLabel } from "@/lib/ai/business-templates";
import { copyResponseText } from "@/lib/clipboard";
import { businessSchema, customerSchema, customerStatuses, responseTypes } from "@/lib/mvp-validators";
import {
  filterSavedResponses,
  sortSavedResponses,
  getSavedResponseSource,
  getSavedResponseSourceLabel,
  type SavedResponseFavoriteFilter,
  type SavedResponseSortOrder,
  type SavedResponseSourceFilter
} from "@/lib/saved-response-library";
import { savedResponseCategories } from "@/lib/saved-responses";
import { isSupabaseBrowserConfigured, supabase as supabaseBrowserClient } from "@/lib/supabase/browser";
import {
  filterWhatsAppTemplates,
  getRecommendedWhatsAppTemplates,
  whatsappTemplateCategories,
  type WhatsAppTemplate
} from "@/lib/templates/whatsapp-templates";
import { trackEvent } from "@/lib/tracking";
import { getUsageLimit } from "@/lib/usage-limits";
import { generateCustomerResponse } from "@/services/ai";
import {
  deleteSavedResponse,
  duplicateSavedResponse,
  listSavedResponses,
  recordSavedResponseCopy,
  saveResponseToLibrary,
  updateSavedResponse,
  updateSavedResponseFavorite
} from "@/services/saved-responses";
import type { AiUsage, Business, CustomerLead, CustomerStatus, GeneratedResponse, Plan, ResponseType, SavedResponse, Subscription, UserProfile } from "@/types/mvp";

type DashboardTab = "assistant" | "business" | "history" | "library" | "templates" | "customers" | "billing";

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

type SavedResponseDraft = {
  title: string;
  category: string;
  content: string;
};

const emptyBusiness: BusinessDraft = {
  business_name: "",
  business_area: "",
  business_type: "Prestador de servico",
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

const mainChannelOptions = ["WhatsApp", "Instagram", "Telefone", "Outros"];

const responseGoalOptions = ["Responder em até 5 minutos", "Responder em até 15 minutos", "Responder em até 1 hora", "Responder no mesmo dia"];

const toneOptions = ["Profissional", "Simpático", "Direto", "Vendedor", "Acolhedor"];

const firstResponseExampleQuestions = [
  "Qual o valor?",
  "Vocês atendem hoje?",
  "Tem entrega?",
  "Quais formas de pagamento?",
  "Como faço para agendar?"
];

const emptySavedResponseDraft: SavedResponseDraft = {
  title: "",
  category: "",
  content: ""
};

function getCurrentUsageMonth() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function getPlanLimit(subscription: Subscription | null) {
  return getUsageLimit(subscription);
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

function getResponseLengthRange(text: string) {
  const length = text.length;
  if (length < 300) return "short";
  if (length < 900) return "medium";
  return "long";
}

function toBusinessDraft(business: Business | null): BusinessDraft {
  if (!business) return emptyBusiness;
  const businessType = getBusinessTemplate(business.business_type || business.business_area || "Prestador de servico").type;
  return {
    business_name: business.business_name || "",
    business_area: business.business_area || "",
    business_type: businessType,
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

function SaasDashboardContent({ initialTab = "assistant" }: { initialTab?: DashboardTab }) {
  const router = useRouter();
  const [tab, setTab] = useState<DashboardTab>(initialTab);
  const [loading, setLoading] = useState(true);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("cliente");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessDraft, setBusinessDraft] = useState<BusinessDraft>(emptyBusiness);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [question, setQuestion] = useState("");
  const [responseType, setResponseType] = useState<ResponseType>("atendimento");
  const [generatedAnswer, setGeneratedAnswer] = useState("");
  const [generatedResponseId, setGeneratedResponseId] = useState<string | null>(null);
  const [qualityComment, setQualityComment] = useState("");
  const [qualitySubmitting, setQualitySubmitting] = useState(false);
  const [qualitySubmittedRating, setQualitySubmittedRating] = useState<"positive" | "negative" | null>(null);
  const [history, setHistory] = useState<GeneratedResponse[]>([]);
  const [savedResponses, setSavedResponses] = useState<SavedResponse[]>([]);
  const [savedResponsesLoaded, setSavedResponsesLoaded] = useState(false);
  const [loadingSavedResponses, setLoadingSavedResponses] = useState(false);
  const [savingResponseId, setSavingResponseId] = useState<string | null>(null);
  const [editingSavedResponseId, setEditingSavedResponseId] = useState<string | null>(null);
  const [savedResponseDraft, setSavedResponseDraft] = useState<SavedResponseDraft>(emptySavedResponseDraft);
  const [manualSavedResponseDraft, setManualSavedResponseDraft] = useState<SavedResponseDraft>(emptySavedResponseDraft);
  const [showManualSavedResponseForm, setShowManualSavedResponseForm] = useState(false);
  const [creatingManualSavedResponse, setCreatingManualSavedResponse] = useState(false);
  const [duplicatingSavedResponseId, setDuplicatingSavedResponseId] = useState<string | null>(null);
  const [favoriteLoadingSavedResponseId, setFavoriteLoadingSavedResponseId] = useState<string | null>(null);
  const [savedResponseSearch, setSavedResponseSearch] = useState("");
  const [savedResponseCategoryFilter, setSavedResponseCategoryFilter] = useState("Todas");
  const [savedResponseSourceFilter, setSavedResponseSourceFilter] = useState<SavedResponseSourceFilter>("all");
  const [savedResponseFavoriteFilter, setSavedResponseFavoriteFilter] = useState<SavedResponseFavoriteFilter>("all");
  const [savedResponseSortOrder, setSavedResponseSortOrder] = useState<SavedResponseSortOrder>("recent");
  const [templateBusinessTypeFilter, setTemplateBusinessTypeFilter] = useState("Todos");
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState("Todas");
  const [templateSearch, setTemplateSearch] = useState("");
  const [customers, setCustomers] = useState<CustomerLead[]>([]);
  const [customerDraft, setCustomerDraft] = useState<CustomerDraft>(emptyCustomer);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [monthlyUsage, setMonthlyUsage] = useState(0);
  const [hasCopiedResponseThisSession, setHasCopiedResponseThisSession] = useState(false);
  const [hasOpenedLibraryThisSession, setHasOpenedLibraryThisSession] = useState(false);
  const [hasViewedTemplatesThisSession, setHasViewedTemplatesThisSession] = useState(false);
  const [hasViewedPricingThisSession, setHasViewedPricingThisSession] = useState(false);
  const trackedActiveSubscriptionRef = useRef(false);
  const trackedDashboardViewedRef = useRef(false);
  const trackedDashboardOnboardingRef = useRef(false);
  const trackedUsageWarningRef = useRef(false);
  const trackedUsageReachedRef = useRef(false);

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
      { data: userProfileData, error: userProfileError },
      { data: businessData, error: businessError },
      { data: responseData, error: responseError },
      { data: customerData, error: customerError },
      { data: subscriptionData, error: subscriptionError },
      { data: planData },
      { data: monthlyUsageData, error: monthlyUsageError }
    ] = await Promise.all([
      supabase.from("user_profiles").select("*").eq("user_id", user.id).limit(1).maybeSingle(),
      supabase.from("businesses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("generated_responses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      supabase.from("customers").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }),
      supabase.from("subscriptions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("plans").select("*").order("price", { ascending: true }),
      supabase.from("ai_usage").select("*").eq("user_id", user.id).eq("month", getCurrentUsageMonth()).maybeSingle()
    ]);

    if (userProfileError || businessError || responseError || customerError || subscriptionError || monthlyUsageError) {
      setError("Não conseguimos carregar todos os dados agora. Atualize a página ou tente novamente em instantes.");
    }

    const subscriptionRow = (subscriptionData as Subscription | null) || null;
    const planRows = (planData as Plan[] | null) || [];
    const activePlanName = subscriptionRow?.plan || subscriptionRow?.plan_name;
    const matchedPlan = activePlanName
      ? planRows.find((plan) => plan.name.toLowerCase() === activePlanName.toLowerCase())
      : planRows.find((plan) => plan.name.toLowerCase() === "inicial");

    const responses = (responseData as GeneratedResponse[] | null) || [];
    const responseIds = responses.map((response) => response.id);
    let responsesWithFeedback = responses;
    if (responseIds.length) {
      const { data: aiFeedbackData } = await supabase
        .from("ai_response_feedback")
        .select("response_id, rating, comment, created_at")
        .eq("user_id", user.id)
        .in("response_id", responseIds)
        .order("created_at", { ascending: false });
      const feedbackByResponseId = new Map<string, { rating: string | null; comment: string | null; created_at: string | null }>();
      ((aiFeedbackData as Array<{ response_id: string; rating: string | null; comment: string | null; created_at: string | null }> | null) || []).forEach((item) => {
        if (!feedbackByResponseId.has(item.response_id)) feedbackByResponseId.set(item.response_id, item);
      });
      responsesWithFeedback = responses.map((response) => {
        const responseFeedback = feedbackByResponseId.get(response.id);
        return responseFeedback
          ? {
              ...response,
              quality_feedback_rating: responseFeedback.rating,
              quality_feedback_comment: responseFeedback.comment,
              quality_feedback_created_at: responseFeedback.created_at
            }
          : response;
      });
    }

    const profileRow = (userProfileData as UserProfile | null) || null;
    const businessRow = (businessData as Business | null) || null;
    const profileBusinessFallback = profileRow
      ? ({
          id: profileRow.id,
          user_id: profileRow.user_id,
          business_name: profileRow.business_name || "",
          business_area: profileRow.business_type,
          business_type: profileRow.business_type,
          location: null,
          description: profileRow.description,
          products_services: profileRow.description,
          common_questions: null,
          important_info: null,
          prices: null,
          opening_hours: null,
          main_channel: "WhatsApp",
          response_goal: "Responder em até 15 minutos",
          address: null,
          payment_methods: null,
          booking_or_payment_link: null,
          brand_tone: profileRow.tone,
          onboarding_completed: Boolean(profileRow.business_name),
          created_at: profileRow.created_at,
          updated_at: profileRow.updated_at
        } satisfies Business)
      : null;
    const effectiveBusiness = businessRow || profileBusinessFallback;
    if (initialTab !== "business" && !effectiveBusiness?.onboarding_completed) {
      setLoading(false);
      router.replace("/onboarding");
      return;
    }
    if (initialTab === "business" && effectiveBusiness?.onboarding_completed) {
      setLoading(false);
      router.replace("/dashboard");
      return;
    }

    setUserProfile(profileRow);
    setBusiness(effectiveBusiness);
    setBusinessDraft(toBusinessDraft(effectiveBusiness));
    setHistory(responsesWithFeedback);
    setCustomers((customerData as CustomerLead[] | null) || []);
    setSubscription(subscriptionRow);
    setCurrentPlan(matchedPlan || null);
    setMonthlyUsage(((monthlyUsageData as AiUsage | null)?.count) || 0);
    setLoading(false);
  }, [initialTab, router, supabase]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadDashboardData();
    });
  }, [loadDashboardData]);

  async function handleLogout() {
    if (supabase) await supabase.auth.signOut();
    router.replace("/");
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
    const existingBusiness = (await supabase.from("businesses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle()).data as Business | null;
    const request = existingBusiness
      ? supabase.from("businesses").update(payload).eq("id", existingBusiness.id).eq("user_id", user.id).select("*").single()
      : supabase.from("businesses").insert(payload).select("*").single();
    const { data, error: saveError } = await request;

    if (saveError) {
      setSavingBusiness(false);
      setError("Não conseguimos salvar o negócio agora. Revise os campos e tente novamente.");
      return;
    }

    const { data: savedUserProfile, error: userProfileSaveError } = await supabase
      .from("user_profiles")
      .upsert(
        {
          user_id: user.id,
          business_name: payload.business_name,
          business_type: payload.business_type || payload.business_area || null,
          tone: payload.brand_tone || null,
          description: payload.description || payload.products_services || null
        },
        { onConflict: "user_id" }
      )
      .select("*")
      .single();

    if (userProfileSaveError) {
      setError("Negócio salvo, mas não conseguimos atualizar o perfil principal. Tente salvar novamente.");
      setSavingBusiness(false);
      return;
    }

    setUserProfile(savedUserProfile as UserProfile);
    setBusiness(data as Business);
    setBusinessDraft(toBusinessDraft(data as Business));
    setSavingBusiness(false);
    if (options?.completeOnboarding) {
      trackEvent("onboarding_completed", {
        source: "dashboard",
        business_type: payload.business_type
      });
      trackEvent("activation_onboarding_completed", {
        source: "dashboard",
        businessType: payload.business_type,
        step: "onboarding"
      });
      setTab("assistant");
      setQuestion(getBusinessExamples(payload.business_type)[0] || "Qual o valor do servico?");
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
    setGeneratedResponseId(null);
    setQualityComment("");
    setQualitySubmittedRating(null);

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
        customerMessage: question,
        responseType
      });

      setGeneratedAnswer(answer);
      setGeneratedResponseId(savedResponse?.id || null);
      setMonthlyUsage(usage.used);
      if (savedResponse) {
        setHistory((current) => [savedResponse, ...current]);
        if (isFirstGeneratedResponse) {
          trackEvent("first_response_generated", {
            source: "dashboard",
            category: responseType,
            business_type: businessDraft.business_type,
            plan: subscription?.plan || subscription?.plan_name || "sem_plano",
            response_length_range: getResponseLengthRange(answer),
            usage_count: usage.used,
            usage_limit: usage.limit
          });
          trackEvent("activation_first_response_generated", {
            source: "dashboard",
            businessType: businessDraft.business_type,
            category: responseType,
            plan: subscription?.plan || subscription?.plan_name || "sem_plano",
            step: "first_response"
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

  const loadSavedResponses = useCallback(async (options?: { force?: boolean }) => {
    if (savedResponsesLoaded && !options?.force) return;
    setLoadingSavedResponses(true);
    setError("");

    try {
      const items = await listSavedResponses();
      setSavedResponses(items);
      setSavedResponsesLoaded(true);
      trackEvent("saved_responses_view", {
        source: "dashboard",
        count: items.length
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar sua biblioteca agora.");
    } finally {
      setLoadingSavedResponses(false);
    }
  }, [savedResponsesLoaded]);

  async function handleSaveGeneratedResponse(input: { responseId?: string | null; sourceTemplateId?: string | null; content: string; title?: string | null; category?: string | null; source?: "ai" | "template" | "manual" }) {
    setError("");

    if (!input.responseId && !input.content.trim()) {
      setError("Gere uma resposta antes de salvar.");
      return;
    }

    setSavingResponseId(input.sourceTemplateId || input.responseId || "generated");
    try {
      const result = await saveResponseToLibrary({
        response_id: input.responseId || undefined,
        source_template_id: input.sourceTemplateId || undefined,
        source: input.source || (input.sourceTemplateId ? "template" : input.responseId ? "ai" : "manual"),
        title: input.title || undefined,
        content: input.content,
        category: input.category || undefined
      });
      setSavedResponses((current) => {
        const withoutDuplicate = current.filter((item) => item.id !== result.savedResponse.id);
        return [result.savedResponse, ...withoutDuplicate];
      });
      setSavedResponsesLoaded(true);
      if (input.sourceTemplateId) {
        trackEvent("template_save", {
          templateId: input.sourceTemplateId,
          category: result.savedResponse.category || "sem_categoria"
        });
        trackEvent("activation_template_saved", {
          source: "dashboard",
          category: result.savedResponse.category || "sem_categoria",
          businessType: businessDraft.business_type,
          step: "template_saved"
        });
      } else {
        trackEvent("saved_response_create", {
          source: input.responseId ? "ai" : "manual",
          category: result.savedResponse.category || "sem_categoria",
          action: "create"
        });
        trackEvent("activation_response_saved", {
          source: input.responseId ? "ai" : "manual",
          category: result.savedResponse.category || "sem_categoria",
          businessType: businessDraft.business_type,
          step: "response_saved"
        });
      }
      showFeedback(result.alreadySaved ? "Resposta já estava salva." : "Resposta salva na biblioteca.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível salvar a resposta agora.");
    } finally {
      setSavingResponseId(null);
    }
  }

  function startEditingSavedResponse(item: SavedResponse) {
    setEditingSavedResponseId(item.id);
    setSavedResponseDraft({
      title: item.title || "",
      category: item.category || "",
      content: item.content
    });
  }

  async function handleUpdateSavedResponse(item: SavedResponse) {
    setError("");
    const title = savedResponseDraft.title.trim();
    const content = savedResponseDraft.content.trim();
    if (!title) {
      setError("Informe o titulo da resposta salva.");
      return;
    }
    if (!content) {
      setError("Informe o conteudo da resposta salva.");
      return;
    }
    try {
      const updated = await updateSavedResponse(item.id, {
        title,
        category: savedResponseDraft.category || null,
        content
      });
      setSavedResponses((current) => current.map((savedResponse) => (savedResponse.id === updated.id ? updated : savedResponse)));
      setEditingSavedResponseId(null);
      setSavedResponseDraft(emptySavedResponseDraft);
      trackEvent("saved_response_edit", {
        category: updated.category || "sem_categoria",
        source: getSavedResponseSource(updated),
        action: "edit"
      });
      showFeedback("Resposta salva atualizada.");
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Não foi possível atualizar a resposta salva agora.");
    }
  }

  async function handleDeleteSavedResponse(item: SavedResponse) {
    setError("");
    if (!window.confirm("Tem certeza que deseja excluir esta resposta?")) return;
    try {
      await deleteSavedResponse(item.id);
      setSavedResponses((current) => current.filter((savedResponse) => savedResponse.id !== item.id));
      trackEvent("saved_response_delete", {
        category: item.category || "sem_categoria",
        source: getSavedResponseSource(item),
        action: "delete"
      });
      showFeedback("Resposta excluida da biblioteca.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Não foi possível remover a resposta salva agora.");
    }
  }

  async function handleCreateManualSavedResponse() {
    setError("");
    const content = manualSavedResponseDraft.content.trim();
    if (!content) {
      setError("Informe o conteudo da resposta salva.");
      return;
    }

    setCreatingManualSavedResponse(true);
    try {
      const result = await saveResponseToLibrary({
        source: "manual",
        title: manualSavedResponseDraft.title.trim() || undefined,
        content,
        category: manualSavedResponseDraft.category || undefined
      });
      setSavedResponses((current) => [result.savedResponse, ...current.filter((item) => item.id !== result.savedResponse.id)]);
      setSavedResponsesLoaded(true);
      setManualSavedResponseDraft(emptySavedResponseDraft);
      setShowManualSavedResponseForm(false);
      trackEvent("saved_response_create_manual", {
        category: result.savedResponse.category || "sem_categoria",
        source: "manual",
        action: "create_manual"
      });
      showFeedback("Resposta manual criada na biblioteca.");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Não foi possível criar a resposta salva agora.");
    } finally {
      setCreatingManualSavedResponse(false);
    }
  }

  async function handleDuplicateSavedResponse(item: SavedResponse) {
    setError("");
    setDuplicatingSavedResponseId(item.id);
    try {
      const duplicated = await duplicateSavedResponse(item.id);
      setSavedResponses((current) => [duplicated, ...current]);
      trackEvent("saved_response_duplicate", {
        category: item.category || "sem_categoria",
        source: getSavedResponseSource(item),
        action: "duplicate"
      });
      showFeedback("Resposta duplicada.");
    } catch (duplicateError) {
      setError(duplicateError instanceof Error ? duplicateError.message : "Não foi possível duplicar a resposta salva agora.");
    } finally {
      setDuplicatingSavedResponseId(null);
    }
  }

  async function handleToggleSavedResponseFavorite(item: SavedResponse) {
    setError("");
    const nextFavorite = !item.is_favorite;
    setFavoriteLoadingSavedResponseId(item.id);
    try {
      const updated = await updateSavedResponseFavorite(item.id, nextFavorite);
      setSavedResponses((current) => current.map((savedResponse) => (savedResponse.id === updated.id ? updated : savedResponse)));
      trackEvent(nextFavorite ? "saved_response_favorite" : "saved_response_unfavorite", {
        category: updated.category || "sem_categoria",
        source: getSavedResponseSource(updated),
        isFavorite: Boolean(updated.is_favorite),
        action: nextFavorite ? "favorite" : "unfavorite"
      });
      if (nextFavorite) {
        trackEvent("activation_favorite_created", {
          category: updated.category || "sem_categoria",
          source: getSavedResponseSource(updated),
          step: "favorite_created"
        });
      }
      showFeedback(nextFavorite ? "Resposta marcada como favorita." : "Resposta removida dos favoritos.");
    } catch (favoriteError) {
      setError(favoriteError instanceof Error ? favoriteError.message : "Não foi possível atualizar o favorito agora.");
    } finally {
      setFavoriteLoadingSavedResponseId(null);
    }
  }

  async function handleSaveTemplate(template: WhatsAppTemplate) {
    await handleSaveGeneratedResponse({
      sourceTemplateId: template.id,
      source: "template",
      title: template.title,
      content: template.content,
      category: template.category
    });
  }

  function handleTemplateBusinessTypeFilter(value: string) {
    setTemplateBusinessTypeFilter(value);
    trackEvent("template_filter_change", {
      filter: "businessType",
      businessType: value
    });
  }

  function handleTemplateCategoryFilter(value: string) {
    setTemplateCategoryFilter(value);
    trackEvent("template_filter_change", {
      filter: "category",
      category: value
    });
  }

  function handleSavedResponseSearch(value: string) {
    setSavedResponseSearch(value);
    if (value.trim().length >= 2 || value.length === 0) {
      trackEvent("saved_response_search", {
        action: "search",
        source: savedResponseSourceFilter,
        category: savedResponseCategoryFilter
      });
    }
  }

  function handleSavedResponseCategoryFilter(value: string) {
    setSavedResponseCategoryFilter(value);
    trackEvent("saved_response_filter", {
      action: "filter_category",
      category: value,
      source: savedResponseSourceFilter
    });
  }

  function handleSavedResponseSourceFilter(value: SavedResponseSourceFilter) {
    setSavedResponseSourceFilter(value);
    trackEvent("saved_response_filter", {
      action: "filter_source",
      source: value,
      category: savedResponseCategoryFilter
    });
  }

  function handleSavedResponseFavoriteFilter(value: SavedResponseFavoriteFilter) {
    setSavedResponseFavoriteFilter(value);
    trackEvent(value === "favorites" ? "saved_response_filter_favorites" : "saved_response_filter", {
      action: value === "favorites" ? "filter_favorites" : "filter_all",
      isFavorite: value === "favorites",
      category: savedResponseCategoryFilter,
      source: savedResponseSourceFilter
    });
  }

  function handleSavedResponseSortOrder(value: SavedResponseSortOrder) {
    setSavedResponseSortOrder(value);
    trackEvent("saved_response_sort_change", {
      action: "sort",
      sort: value,
      isFavorite: savedResponseFavoriteFilter === "favorites"
    });
  }

  function handleTemplateSearch(value: string) {
    setTemplateSearch(value);
    if (value.trim().length >= 3 || value.trim().length === 0) {
      trackEvent("template_search", {
        hasSearch: Boolean(value.trim())
      });
    }
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

  async function copyText(value: string, source: "generated" | "history" | "library" | "template" = "generated", template?: WhatsAppTemplate, savedResponse?: SavedResponse) {
    try {
      await copyResponseText(value);
      setHasCopiedResponseThisSession(true);
      trackEvent("activation_response_copied", {
        source,
        category: savedResponse?.category || template?.category || responseType,
        businessType: template?.businessType || businessDraft.business_type,
        step: "response_copied"
      });
      if (source === "library") {
        if (savedResponse) {
          void recordSavedResponseCopy(savedResponse.id)
            .then((updated) => {
              setSavedResponses((current) => current.map((item) => (item.id === updated.id ? updated : item)));
            })
            .catch(() => {
              setSavedResponses((current) =>
                current.map((item) =>
                  item.id === savedResponse.id
                    ? { ...item, copy_count: (item.copy_count || 0) + 1, last_copied_at: new Date().toISOString() }
                    : item
                )
              );
            });
        }
        trackEvent("saved_response_copy", {
          category: savedResponse?.category || "sem_categoria",
          source: savedResponse ? getSavedResponseSource(savedResponse) : "library",
          isFavorite: Boolean(savedResponse?.is_favorite),
          action: "copy"
        });
      }
      if (source === "template" && template) {
        trackEvent("template_copy", {
          templateId: template.id,
          businessType: template.businessType,
          category: template.category
        });
      }
      showFeedback("Copiado!");
    } catch {
      setError("Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.");
    }
  }

  function openGeneratedResponseFeedback() {
    trackEvent("feedback_cta_click", {
      source: "generated_response"
    });
    router.push("/feedback?source=generated_response");
  }

  function handleViewPricing(destination = "/plans") {
    setHasViewedPricingThisSession(true);
    trackEvent("activation_pricing_viewed", {
      source: "dashboard",
      plan: subscription?.plan || subscription?.plan_name || "sem_plano",
      businessType: businessDraft.business_type,
      step: "pricing_viewed"
    });
    router.push(destination);
  }

  function handleFirstResponsePricingClick() {
    trackEvent("first_response_to_pricing_click", {
      source: "dashboard",
      cta: "post_first_response",
      page: "dashboard",
      plan: subscription?.plan || subscription?.plan_name || "sem_plano"
    });
    handleViewPricing("/precos");
  }

  function navigateActivationStep(target: DashboardTab | "pricing") {
    if (target === "pricing") {
      handleViewPricing("/plans");
      return;
    }
    if (target === "templates") {
      setHasViewedTemplatesThisSession(true);
    }
    if (target === "library") {
      setHasOpenedLibraryThisSession(true);
    }
    setTab(target);
    setError("");
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
      trackEvent("stripe_portal_opened", {
        source: "dashboard",
        page: "dashboard",
        plan: subscription?.plan || subscription?.plan_name || "sem_plano"
      });
      window.location.href = result.url;
    } catch {
      setError("Não foi possível abrir o portal da assinatura agora.");
    }
  }

  async function handleQualityFeedback(rating: "positive" | "negative") {
    setError("");

    if (!supabase || !generatedResponseId) {
      setError("Gere uma resposta antes de avaliar.");
      return;
    }

    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setError("Sessão não encontrada. Faça login novamente.");
      router.replace("/login");
      return;
    }

    setQualitySubmitting(true);
    try {
      const response = await fetch("/api/ai/response-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          responseId: generatedResponseId,
          rating,
          comment: qualityComment.trim() || undefined
        })
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Não foi possível salvar a avaliação agora.");
      }

      setQualitySubmittedRating(rating);
      setHistory((current) =>
        current.map((item) =>
          item.id === generatedResponseId
            ? {
                ...item,
                quality_feedback_rating: rating,
                quality_feedback_comment: qualityComment.trim() || null,
                quality_feedback_created_at: new Date().toISOString()
              }
            : item
        )
      );
      showFeedback("Avaliação salva. Obrigado pelo feedback.");
    } catch (qualityError) {
      setError(qualityError instanceof Error ? qualityError.message : "Não foi possível salvar a avaliação agora.");
    } finally {
      setQualitySubmitting(false);
    }
  }

  const planName = subscription?.plan || subscription?.plan_name || currentPlan?.name || "Sem assinatura";
  const monthlyLimit = getPlanLimit(subscription);
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
  const shouldShowOnboarding = !(business?.onboarding_completed || userProfile?.business_name);
  const exampleQuestions = getBusinessExamples(businessDraft.business_type);
  const responseLimit = monthlyLimit.toLocaleString("pt-BR");
  const renewalDetail = subscription?.current_period_end
    ? `Renova em ${new Intl.DateTimeFormat("pt-BR").format(new Date(subscription.current_period_end))}`
    : subscription?.status
      ? `Status: ${subscription.status}`
      : "Assinatura ainda não configurada";

  useEffect(() => {
    if (!loading && !shouldShowOnboarding && !trackedDashboardViewedRef.current) {
      trackedDashboardViewedRef.current = true;
      trackEvent("dashboard_viewed", {
        source: "dashboard",
        page: "/dashboard",
        plan: currentPlanId || subscription?.plan || subscription?.plan_name || "sem_plano",
        business_type: businessDraft.business_type
      });
    }
  }, [businessDraft.business_type, currentPlanId, loading, shouldShowOnboarding, subscription?.plan, subscription?.plan_name]);

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
    if (loading) return;
    if (hasReachedMonthlyLimit && !trackedUsageReachedRef.current) {
      trackedUsageReachedRef.current = true;
      trackEvent("usage_limit_reached", {
        source: "dashboard",
        plan: currentPlanId || "none",
        usage_count: monthlyUsage,
        usage_limit: monthlyLimit
      });
      return;
    }
    if (isNearMonthlyLimit && !trackedUsageWarningRef.current) {
      trackedUsageWarningRef.current = true;
      trackEvent("usage_limit_warning_viewed", {
        source: "dashboard",
        plan: currentPlanId || "none",
        usage_percent: usagePercent
      });
    }
  }, [currentPlanId, hasReachedMonthlyLimit, isNearMonthlyLimit, loading, monthlyLimit, monthlyUsage, usagePercent]);

  useEffect(() => {
    if (!loading && shouldShowOnboarding && !trackedDashboardOnboardingRef.current) {
      trackedDashboardOnboardingRef.current = true;
      trackEvent("onboarding_started", {
        source: "dashboard"
      });
    }
  }, [loading, shouldShowOnboarding]);

  useEffect(() => {
    if (tab === "library") {
      queueMicrotask(() => {
        void loadSavedResponses();
      });
    }
  }, [loadSavedResponses, tab]);

  useEffect(() => {
    if (!loading && !shouldShowOnboarding && !savedResponsesLoaded) {
      queueMicrotask(() => {
        void loadSavedResponses();
      });
    }
  }, [loadSavedResponses, loading, savedResponsesLoaded, shouldShowOnboarding]);

  useEffect(() => {
    if (tab === "templates") {
      trackEvent("templates_view", {
        source: "dashboard"
      });
      trackEvent("activation_template_viewed", {
        source: "dashboard",
        businessType: businessDraft.business_type,
        step: "templates_viewed"
      });
    }
  }, [businessDraft.business_type, tab]);

  const filteredSavedResponses = filterSavedResponses(savedResponses, {
    search: savedResponseSearch,
    category: savedResponseCategoryFilter,
    source: savedResponseSourceFilter,
    favorite: savedResponseFavoriteFilter,
    sort: savedResponseSortOrder
  });
  const favoriteSavedResponses = sortSavedResponses(savedResponses.filter((item) => item.is_favorite), "updated");
  const quickFavoriteSavedResponses = favoriteSavedResponses.slice(0, 3);
  const libraryFavoritePreview = favoriteSavedResponses.slice(0, 5);
  const savedResponseCategoryOptions = Array.from(
    new Set([...savedResponseCategories, ...savedResponses.map((item) => item.category).filter(Boolean)])
  ) as string[];

  const savedGeneratedResponseIds = new Set(savedResponses.map((item) => item.response_id).filter(Boolean) as string[]);
  const savedTemplateIds = new Set(savedResponses.map((item) => item.source_template_id).filter(Boolean) as string[]);
  const filteredTemplates = filterWhatsAppTemplates({
    businessType: templateBusinessTypeFilter,
    category: templateCategoryFilter,
    search: templateSearch
  });
  const recommendedTemplates = getRecommendedWhatsAppTemplates(business?.business_type || business?.business_area || businessDraft.business_type, 4);
  const generatedResponseCategory = business?.business_type || userProfile?.business_type || businessDraft.business_type || "geral";
  const generatedResponseTitle = question.trim().slice(0, 120) || generatedAnswer.trim().slice(0, 120) || "Resposta salva";
  const shouldShowTemplateRecommendations = tab === "assistant" && (!history.length || monthlyUsage <= 2);
  const hasFirstResponse = history.length > 0;
  const assistantExampleQuestions = hasFirstResponse ? exampleQuestions : firstResponseExampleQuestions;
  const hasSavedResponse = savedResponses.length > 0;
  const hasCopiedResponse = hasCopiedResponseThisSession || savedResponses.some((item) => (item.copy_count || 0) > 0);
  const hasTestedTemplate = hasViewedTemplatesThisSession || savedTemplateIds.size > 0 || tab === "templates";
  const hasOpenedLibrary = hasOpenedLibraryThisSession || tab === "library";
  const hasViewedPricing = hasViewedPricingThisSession || activeSubscription || tab === "billing";
  const activationStepCount = [
    Boolean(business?.onboarding_completed),
    hasFirstResponse,
    hasCopiedResponse,
    hasSavedResponse,
    hasTestedTemplate,
    hasOpenedLibrary,
    hasViewedPricing
  ].filter(Boolean).length;
  const activationSteps: Array<{ label: string; done: boolean; target: "business" | "assistant" | "library" | "templates" | "billing" | "pricing"; detail: string }> = [
    {
      label: "Concluir onboarding",
      done: Boolean(business?.onboarding_completed),
      target: "business",
      detail: "Configure o contexto para respostas melhores."
    },
    {
      label: "Gerar primeira resposta",
      done: hasFirstResponse,
      target: "assistant",
      detail: "Cole uma pergunta real do cliente."
    },
    {
      label: "Copiar uma resposta",
      done: hasCopiedResponse,
      target: "assistant",
      detail: "Revise e copie para enviar manualmente."
    },
    {
      label: "Salvar uma resposta útil",
      done: hasSavedResponse,
      target: "assistant",
      detail: "Guarde mensagens boas na biblioteca."
    },
    {
      label: "Testar um template",
      done: hasTestedTemplate,
      target: "templates",
      detail: "Use modelos por nicho para começar rápido."
    },
    {
      label: "Abrir biblioteca",
      done: hasOpenedLibrary,
      target: "library",
      detail: "Confira respostas salvas e favoritas."
    },
    {
      label: "Ver planos",
      done: hasViewedPricing,
      target: "pricing",
      detail: "Veja limites mensais antes de escalar o uso."
    }
  ];
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
    },
    {
      label: "Biblioteca",
      value: savedResponses.length.toString(),
      detail: "Respostas salvas para reutilizar",
      icon: Star
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
                    destination: "dashboard_help"
                  });
                  router.push("/dashboard/ajuda");
                }}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                Ajuda
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard/privacidade")}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 hover:bg-white/10"
              >
                <ShieldCheck className="h-4 w-4" />
                Privacidade
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

        <div className="mb-5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-bold leading-6 text-emerald-50">
          Você está usando uma versão inicial do AtendeZap IA. Alguns ajustes ainda podem ser feitos com base nos feedbacks dos usuários.
        </div>

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
                  Nome do seu negócio ou atendimento
                  <input value={businessDraft.business_name} onChange={(event) => setBusinessDraft((current) => ({ ...current, business_name: event.target.value }))} className="field-input" placeholder="Ex.: Studio Ana Lima, Dr. Carlos, Oficina Boa Vista" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-300">
                  Tipo de atendimento
                  <select value={businessDraft.business_type} onChange={(event) => setBusinessDraft((current) => ({ ...current, business_type: event.target.value, business_area: event.target.value }))} className="field-input">
                    {businessTypeOptions.map((option) => <option value={option} key={option}>{getBusinessTypeLabel(option)}</option>)}
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
                  Explique rapidamente o que você vende, atende ou oferece
                  <textarea value={businessDraft.products_services} onChange={(event) => setBusinessDraft((current) => ({ ...current, products_services: event.target.value }))} className="field-input min-h-24 resize-none py-3" placeholder="Ex.: limpeza de pele, design de sobrancelhas, conserto de celular ou marmitas no bairro" />
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
                  Tom das respostas
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
            <button type="button" onClick={() => handleViewPricing("/plans")} className="rounded-md bg-emerald-300 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-200">
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

        <section className="mb-5 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Primeiros passos</p>
              <h2 className="mt-2 text-xl font-black text-white">Ative seu atendimento com IA</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Complete os passos essenciais para gerar valor rápido: configurar o contexto, criar a primeira resposta, copiar ou salvar uma mensagem e conhecer templates.
              </p>
            </div>
            <span className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-black text-slate-200">
              {activationStepCount}/{activationSteps.length} concluídos
            </span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
            {activationSteps.map((step) => (
              <button
                key={step.label}
                type="button"
                onClick={() => navigateActivationStep(step.target)}
                className={`min-h-32 rounded-lg border p-3 text-left transition ${
                  step.done
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-50"
                    : "border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.07]"
                }`}
              >
                <span className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full ${step.done ? "bg-emerald-300 text-slate-950" : "bg-white/10 text-slate-400"}`}>
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span className="block text-sm font-black">{step.label}</span>
                <span className="mt-2 block text-xs leading-5 text-slate-400">{step.detail}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-5 rounded-lg border border-white/10 bg-[#101821] p-4 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Respostas favoritas</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">Acesso rápido às mensagens mais usadas da sua biblioteca.</p>
            </div>
            <button type="button" onClick={() => setTab("library")} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 text-xs font-black text-slate-100 hover:bg-white/15">
              <Star className="h-3.5 w-3.5" />
              Abrir biblioteca
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {quickFavoriteSavedResponses.length ? (
              quickFavoriteSavedResponses.map((item) => (
                <article className="rounded-md border border-amber-300/20 bg-amber-300/5 p-3" key={item.id}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-black text-white">{item.title || "Resposta salva"}</h3>
                    <Star className="h-4 w-4 flex-none fill-amber-300 text-amber-300" />
                  </div>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-300">{item.content}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-bold text-slate-500">{item.category || "Sem categoria"}</span>
                    <button type="button" onClick={() => copyText(item.content, "library", undefined, item)} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-white px-3 text-xs font-black text-slate-950">
                      <Copy className="h-3.5 w-3.5" />
                      Copiar
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-white/15 bg-white/[0.04] p-4 text-sm text-slate-400 md:col-span-3">
                Favorite respostas importantes para acessar mais rápido aqui.
              </div>
            )}
          </div>
        </section>

        <section className="mb-5 grid gap-3 md:grid-cols-3 xl:grid-cols-7">
          {[
            ["Gerar resposta", "assistant", Bot],
            [business ? "Editar configuração da IA" : "Configurar atendimento", "business", BriefcaseBusiness],
            ["Biblioteca", "library", Star],
            ["Templates prontos", "templates", Clipboard],
            ["Clientes", "customers", Users],
            ["Assinatura", "billing", CreditCard],
            ["Preços", "plans", CreditCard]
          ].map(([label, target, Icon]) => (
            target === "plans" ? (
              <button key={label as string} type="button" onClick={() => handleViewPricing("/plans")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 text-sm font-black text-slate-100 hover:bg-white/10">
                <Icon className="h-4 w-4" />
                {label as string}
              </button>
            ) : (
              <button key={label as string} type="button" onClick={() => navigateActivationStep(target as DashboardTab)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 text-sm font-black text-slate-100 hover:bg-white/10">
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
            ["library", "Biblioteca", Star],
            ["templates", "Templates", Clipboard],
            ["customers", "Clientes", Users],
            ["billing", "Assinatura", CreditCard]
          ].map(([id, label, Icon]) => (
            <button
              key={id as string}
              type="button"
              onClick={() => {
                if (id === "templates") setHasViewedTemplatesThisSession(true);
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
                  <button type="button" onClick={() => handleViewPricing("/precos")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-slate-950 hover:bg-slate-100">
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

        {shouldShowTemplateRecommendations ? (
          <section className="mb-5 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Comece com templates prontos</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">Use exemplos do seu tipo de atendimento para copiar, adaptar ou salvar na biblioteca.</p>
              </div>
              <button type="button" onClick={() => setTab("templates")} className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-white/10 px-4 text-xs font-black text-slate-100 hover:bg-white/15">
                Ver todos
              </button>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {recommendedTemplates.map((template) => (
                <article key={`recommended-${template.id}`} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-emerald-300">{template.businessType} · {template.category}</p>
                      <h3 className="mt-1 font-black text-white">{template.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{template.content}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => copyText(template.content, "template", template)} className="rounded-md bg-white px-3 py-2 text-xs font-black text-slate-950">Copiar</button>
                    <button
                      type="button"
                      onClick={() => handleSaveTemplate(template)}
                      disabled={savingResponseId === template.id || savedTemplateIds.has(template.id)}
                      className="inline-flex min-h-9 items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 text-xs font-black text-emerald-100 disabled:opacity-60"
                    >
                      <Star className="h-3.5 w-3.5" />
                      {savedTemplateIds.has(template.id) ? "Salvo" : savingResponseId === template.id ? "Salvando..." : "Salvar na biblioteca"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {tab === "assistant" ? (
          <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={handleGenerateResponse} className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
              <h2 className="text-xl font-black text-white">{hasFirstResponse ? "Responder cliente" : "Gere sua primeira resposta"}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {hasFirstResponse
                  ? "Cole aqui uma mensagem que um cliente mandaria no WhatsApp. Escolha o objetivo e revise a sugestão antes de copiar e enviar manualmente."
                  : "Cole aqui uma mensagem que um cliente mandaria no WhatsApp. A IA vai sugerir uma resposta curta para você copiar, ajustar e enviar."}
              </p>
              <label className="mt-5 grid gap-2 text-sm font-bold text-slate-300">
                Pergunta do cliente
                <textarea value={question} onChange={(event) => setQuestion(event.target.value)} className="field-input min-h-40 resize-none py-3" placeholder="Ex.: Oi, quanto custa e tem horário hoje?" />
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {assistantExampleQuestions.map((example) => (
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
                {hasReachedMonthlyLimit ? "Limite mensal atingido" : generating ? "Gerando resposta..." : "Gerar resposta"}
              </button>
            </form>

            <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-black text-white">Resposta gerada</h2>
                {generatedAnswer ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveGeneratedResponse({ responseId: generatedResponseId, content: generatedAnswer, title: generatedResponseTitle, category: generatedResponseCategory })}
                      disabled={savingResponseId === (generatedResponseId || "generated") || Boolean(generatedResponseId && savedGeneratedResponseIds.has(generatedResponseId))}
                      className="inline-flex min-h-9 items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 text-xs font-black text-emerald-100 hover:bg-emerald-400/20 disabled:opacity-60"
                    >
                      <Star className="h-3.5 w-3.5" />
                      {generatedResponseId && savedGeneratedResponseIds.has(generatedResponseId) ? "Resposta salva" : savingResponseId === (generatedResponseId || "generated") ? "Salvando..." : "Salvar resposta"}
                    </button>
                    <button type="button" onClick={() => copyText(generatedAnswer, "generated")} className="rounded-md bg-white px-3 py-2 text-xs font-black text-slate-950 hover:bg-slate-200">
                      Copiar
                    </button>
                  </div>
                ) : null}
              </div>
              {generatedAnswer ? (
                <>
                  <p className="whitespace-pre-wrap rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm leading-7 text-emerald-50">{generatedAnswer}</p>
                  <div className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4">
                    <h3 className="text-sm font-black text-emerald-50">Próximos passos</h3>
                    <p className="mt-2 text-sm leading-6 text-emerald-100">
                      Boa. Agora você pode copiar essa resposta para usar no atendimento ou salvar na biblioteca para reutilizar depois.
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6 text-emerald-50">
                      Revise a resposta antes de enviar ao cliente. A IA pode errar informações específicas como preço, prazo, estoque ou agenda.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => copyText(generatedAnswer, "generated")} className="inline-flex min-h-9 items-center justify-center rounded-md bg-white px-3 text-xs font-black text-slate-950">
                        Copiar resposta
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveGeneratedResponse({ responseId: generatedResponseId, content: generatedAnswer, title: generatedResponseTitle, category: generatedResponseCategory })}
                        disabled={savingResponseId === (generatedResponseId || "generated") || Boolean(generatedResponseId && savedGeneratedResponseIds.has(generatedResponseId))}
                        className="inline-flex min-h-9 items-center justify-center rounded-md border border-emerald-400/30 bg-[#101821] px-3 text-xs font-black text-emerald-100 disabled:opacity-60"
                      >
                        {generatedResponseId && savedGeneratedResponseIds.has(generatedResponseId) ? "Resposta salva" : "Salvar na biblioteca"}
                      </button>
                      <button type="button" onClick={() => setQuestion(assistantExampleQuestions[1] || firstResponseExampleQuestions[1])} className="inline-flex min-h-9 items-center justify-center rounded-md border border-white/10 bg-white/10 px-3 text-xs font-black text-slate-100">
                        Testar outro exemplo
                      </button>
                      <button type="button" onClick={() => navigateActivationStep("templates")} className="inline-flex min-h-9 items-center justify-center rounded-md border border-white/10 bg-white/10 px-3 text-xs font-black text-slate-100">
                        Ver templates prontos
                      </button>
                      <button type="button" onClick={() => navigateActivationStep("library")} className="inline-flex min-h-9 items-center justify-center rounded-md border border-white/10 bg-white/10 px-3 text-xs font-black text-slate-100">
                        Marcar favorita
                      </button>
                      <button type="button" onClick={() => navigateActivationStep("pricing")} className="inline-flex min-h-9 items-center justify-center rounded-md border border-white/10 bg-white/10 px-3 text-xs font-black text-slate-100">
                        Conhecer planos
                      </button>
                    </div>
                  </div>
                  {!activeSubscription ? (
                    <div className="mt-4 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4">
                      <p className="text-sm font-bold leading-6 text-amber-50">
                        Gostou da resposta? Veja os planos para continuar usando com mais limite e recursos.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" onClick={handleFirstResponsePricingClick} className="inline-flex min-h-9 items-center justify-center rounded-md bg-amber-300 px-3 text-xs font-black text-slate-950 hover:bg-amber-200">
                          Ver planos
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveGeneratedResponse({ responseId: generatedResponseId, content: generatedAnswer, title: generatedResponseTitle, category: generatedResponseCategory })}
                          disabled={savingResponseId === (generatedResponseId || "generated") || Boolean(generatedResponseId && savedGeneratedResponseIds.has(generatedResponseId))}
                          className="inline-flex min-h-9 items-center justify-center rounded-md border border-amber-300/30 bg-[#101821] px-3 text-xs font-black text-amber-100 disabled:opacity-60"
                        >
                          Salvar resposta
                        </button>
                        <button type="button" onClick={() => navigateActivationStep("templates")} className="inline-flex min-h-9 items-center justify-center rounded-md border border-white/10 bg-white/10 px-3 text-xs font-black text-slate-100">
                          Ver templates prontos
                        </button>
                      </div>
                    </div>
                  ) : null}
                  <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-black leading-6 text-slate-100">Essa resposta foi útil?</p>
                    <p className="mt-1 text-sm font-bold leading-6 text-slate-300">Copie, ajuste se precisar e envie manualmente pelo WhatsApp.</p>
                    <label className="mt-3 grid gap-2 text-xs font-bold text-slate-300">
                      O que poderia melhorar? (opcional)
                      <textarea
                        value={qualityComment}
                        onChange={(event) => setQualityComment(event.target.value.slice(0, 500))}
                        disabled={Boolean(qualitySubmittedRating)}
                        className="field-input min-h-20 resize-none py-3 text-sm"
                        placeholder="Ex.: ficou longa, faltou objetividade, tom formal demais..."
                      />
                    </label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleQualityFeedback("positive")}
                        disabled={qualitySubmitting || Boolean(qualitySubmittedRating) || !generatedResponseId}
                        className="inline-flex min-h-10 items-center justify-center rounded-md bg-emerald-400 px-4 text-xs font-black text-slate-950 hover:bg-emerald-300 disabled:opacity-60"
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQualityFeedback("negative")}
                        disabled={qualitySubmitting || Boolean(qualitySubmittedRating) || !generatedResponseId}
                        className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-white/10 px-4 text-xs font-black text-slate-100 hover:bg-white/15 disabled:opacity-60"
                      >
                        Não
                      </button>
                      <button
                        type="button"
                        onClick={openGeneratedResponseFeedback}
                        className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-transparent px-4 text-xs font-black text-slate-300 hover:bg-white/10"
                      >
                        Feedback detalhado
                      </button>
                    </div>
                    {qualitySubmittedRating ? (
                      <p className="mt-2 text-xs font-bold text-emerald-200">
                        Avaliação salva como {qualitySubmittedRating === "positive" ? "útil" : "não útil"}.
                      </p>
                    ) : null}
                  </div>
                </>
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center text-sm leading-6 text-slate-400">
                  <MessageCircle className="mb-4 h-8 w-8 text-slate-500" />
                  <p className="font-bold text-slate-200">A resposta pronta para copiar aparecerá aqui.</p>
                  <p className="mt-2 max-w-sm">Digite uma pergunta comum de cliente. Depois revise, copie, salve se for útil e envie manualmente pelo WhatsApp.</p>
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
                ["business_name", "Nome do seu negócio ou atendimento"],
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
                Tipo de atendimento
                <select value={businessDraft.business_type} onChange={(event) => setBusinessDraft((current) => ({ ...current, business_type: event.target.value, business_area: event.target.value }))} className="field-input">
                    {businessTypeOptions.map((option) => <option value={option} key={option}>{getBusinessTypeLabel(option)}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300">
                Principal canal de atendimento
                <select value={businessDraft.main_channel} onChange={(event) => setBusinessDraft((current) => ({ ...current, main_channel: event.target.value }))} className="field-input">
                  {mainChannelOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300">
                Tom das respostas
                <select value={businessDraft.brand_tone} onChange={(event) => setBusinessDraft((current) => ({ ...current, brand_tone: event.target.value }))} className="field-input">
                  {toneOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300 md:col-span-2">
                Explique rapidamente o que você vende, atende ou oferece
                <textarea value={businessDraft.description} onChange={(event) => setBusinessDraft((current) => ({ ...current, description: event.target.value }))} className="field-input min-h-24 resize-none py-3" placeholder="Ex.: faço manutenção de celulares, vendo bolos por encomenda ou atendo clientes com horário marcado." />
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
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-400">
                    <span>Tipo: {getBusinessTypeLabel(item.business_type || businessDraft.business_type) || "Não informado"}</span>
                    <span>Tom: {item.brand_tone || businessDraft.brand_tone || "Não informado"}</span>
                    {item.quality_feedback_rating ? (
                      <span className={item.quality_feedback_rating === "positive" ? "text-emerald-200" : "text-amber-200"}>
                        Avaliação: {item.quality_feedback_rating === "positive" ? "útil" : "não útil"}
                      </span>
                    ) : (
                      <span>Avaliação: pendente</span>
                    )}
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{item.generated_answer}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveGeneratedResponse({ responseId: item.id, content: item.generated_answer, title: item.customer_question, category: item.business_type || item.response_type || "geral" })}
                      disabled={savingResponseId === item.id || savedGeneratedResponseIds.has(item.id)}
                      className="inline-flex min-h-9 items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 text-xs font-black text-emerald-100 disabled:opacity-60"
                    >
                      <Star className="h-3.5 w-3.5" />
                      {savedGeneratedResponseIds.has(item.id) ? "Resposta salva" : savingResponseId === item.id ? "Salvando..." : "Salvar resposta"}
                    </button>
                    <button type="button" onClick={() => copyText(item.generated_answer, "history")} className="rounded-md bg-white px-3 py-2 text-xs font-black text-slate-950">Copiar</button>
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

        {tab === "library" ? (
          <section className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Biblioteca de respostas</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Salve respostas úteis, organize por categoria simples e copie rapidamente quando a pergunta voltar.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setTab("assistant")} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 text-xs font-black text-slate-100 hover:bg-white/15">
                  Voltar ao dashboard
                </button>
                <button type="button" onClick={() => setShowManualSavedResponseForm((current) => !current)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-xs font-black text-slate-950 hover:bg-emerald-300">
                  <Plus className="h-3.5 w-3.5" />
                  Nova resposta
                </button>
                <button type="button" onClick={() => loadSavedResponses({ force: true })} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 text-xs font-black text-slate-100 hover:bg-white/15">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Atualizar
                </button>
              </div>
            </div>

            {showManualSavedResponseForm ? (
              <div className="mt-5 grid gap-3 rounded-md border border-emerald-400/20 bg-emerald-400/5 p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-slate-300">
                    Título
                    <input value={manualSavedResponseDraft.title} maxLength={120} onChange={(event) => setManualSavedResponseDraft((current) => ({ ...current, title: event.target.value }))} className="field-input" placeholder="Ex.: Resposta sobre orçamento" />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-300">
                    Categoria
                    <select value={manualSavedResponseDraft.category} onChange={(event) => setManualSavedResponseDraft((current) => ({ ...current, category: event.target.value }))} className="field-input">
                      <option value="">Sem categoria</option>
                      {savedResponseCategoryOptions.map((category) => (
                        <option value={category} key={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-bold text-slate-300">
                  Conteúdo
                  <textarea value={manualSavedResponseDraft.content} maxLength={5000} onChange={(event) => setManualSavedResponseDraft((current) => ({ ...current, content: event.target.value }))} className="field-input min-h-32 resize-none py-3" placeholder="Cole ou escreva a mensagem que você já usa no WhatsApp." />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={handleCreateManualSavedResponse} disabled={creatingManualSavedResponse} className="rounded-md bg-emerald-400 px-3 py-2 text-xs font-black text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
                    {creatingManualSavedResponse ? "Criando..." : "Criar resposta salva"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowManualSavedResponseForm(false);
                      setManualSavedResponseDraft(emptySavedResponseDraft);
                    }}
                    className="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-black text-slate-200 hover:bg-white/15"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : null}

            {libraryFavoritePreview.length ? (
              <div className="mt-5 rounded-md border border-amber-300/20 bg-amber-300/5 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="inline-flex items-center gap-2 text-sm font-black text-white">
                    <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                    Favoritas
                  </h3>
                  <button type="button" onClick={() => handleSavedResponseFavoriteFilter("favorites")} className="rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs font-black text-amber-100">
                    Ver favoritas
                  </button>
                </div>
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
                  {libraryFavoritePreview.map((item) => (
                    <button key={item.id} type="button" onClick={() => copyText(item.content, "library", undefined, item)} className="min-h-24 rounded-md border border-white/10 bg-[#101821] p-3 text-left hover:bg-[#172231]">
                      <span className="line-clamp-2 text-xs font-black text-white">{item.title || "Resposta salva"}</span>
                      <span className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{item.content}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-5 grid gap-3 xl:grid-cols-[1fr_180px_220px_180px_220px]">
              <label className="flex min-h-11 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-300">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  value={savedResponseSearch}
                  onChange={(event) => handleSavedResponseSearch(event.target.value)}
                  className="w-full bg-transparent outline-none placeholder:text-slate-500"
                  placeholder="Buscar por título, categoria ou conteúdo"
                />
              </label>
              <div className="grid grid-cols-2 overflow-hidden rounded-md border border-white/10 bg-white/[0.04] p-1">
                <button type="button" onClick={() => handleSavedResponseFavoriteFilter("all")} className={`rounded px-3 text-xs font-black ${savedResponseFavoriteFilter === "all" ? "bg-white text-slate-950" : "text-slate-300"}`}>
                  Todos
                </button>
                <button type="button" onClick={() => handleSavedResponseFavoriteFilter("favorites")} className={`rounded px-3 text-xs font-black ${savedResponseFavoriteFilter === "favorites" ? "bg-amber-300 text-slate-950" : "text-slate-300"}`}>
                  Favoritos
                </button>
              </div>
              <select value={savedResponseCategoryFilter} onChange={(event) => handleSavedResponseCategoryFilter(event.target.value)} className="field-input">
                <option value="Todas">Todas as categorias</option>
                {savedResponseCategoryOptions.map((category) => (
                  <option value={category} key={category}>{category}</option>
                ))}
              </select>
              <select value={savedResponseSourceFilter} onChange={(event) => handleSavedResponseSourceFilter(event.target.value as SavedResponseSourceFilter)} className="field-input">
                <option value="all">Todas as origens</option>
                <option value="ai">IA</option>
                <option value="template">Template</option>
                <option value="manual">Manual</option>
              </select>
              <select value={savedResponseSortOrder} onChange={(event) => handleSavedResponseSortOrder(event.target.value as SavedResponseSortOrder)} className="field-input">
                <option value="recent">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
                <option value="updated">Atualizados recentemente</option>
                <option value="favorites">Favoritos primeiro</option>
                <option value="category">Categoria</option>
              </select>
            </div>

            <div className="mt-5 grid gap-3">
              {loadingSavedResponses ? (
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-6 text-center text-sm font-bold text-slate-300" role="status" aria-live="polite">
                  Carregando respostas salvas...
                </div>
              ) : filteredSavedResponses.length ? (
                filteredSavedResponses.map((item) => {
                  const isEditing = editingSavedResponseId === item.id;
                  const itemSource = getSavedResponseSource(item);
                  return (
                    <article className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={item.id}>
                      {isEditing ? (
                        <div className="grid gap-3">
                          <label className="grid gap-2 text-sm font-bold text-slate-300">
                            Título
                            <input value={savedResponseDraft.title} maxLength={120} onChange={(event) => setSavedResponseDraft((current) => ({ ...current, title: event.target.value }))} className="field-input" />
                          </label>
                          <label className="grid gap-2 text-sm font-bold text-slate-300">
                            Categoria
                            <select value={savedResponseDraft.category} onChange={(event) => setSavedResponseDraft((current) => ({ ...current, category: event.target.value }))} className="field-input">
                              <option value="">Sem categoria</option>
                              {savedResponseCategoryOptions.map((category) => (
                                <option value={category} key={category}>{category}</option>
                              ))}
                            </select>
                          </label>
                          <label className="grid gap-2 text-sm font-bold text-slate-300">
                            Resposta
                            <textarea value={savedResponseDraft.content} maxLength={5000} onChange={(event) => setSavedResponseDraft((current) => ({ ...current, content: event.target.value }))} className="field-input min-h-36 resize-none py-3" />
                          </label>
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => handleUpdateSavedResponse(item)} className="rounded-md bg-emerald-400 px-3 py-2 text-xs font-black text-slate-950 hover:bg-emerald-300">
                              Salvar edição
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSavedResponseId(null);
                                setSavedResponseDraft(emptySavedResponseDraft);
                              }}
                              className="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-black text-slate-200 hover:bg-white/15"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div>
                              <h3 className="font-black text-white">{item.title || "Resposta salva"}</h3>
                              <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-400">
                                <span className="rounded-full bg-white/10 px-2 py-1">{item.category || "Sem categoria"}</span>
                                <span className="rounded-full bg-white/10 px-2 py-1">{getSavedResponseSourceLabel(itemSource)}</span>
                                {item.is_favorite ? <span className="rounded-full bg-amber-300/15 px-2 py-1 text-amber-100">Favorita</span> : null}
                                <span className="rounded-full bg-white/10 px-2 py-1">{formatDate(item.updated_at || item.created_at)}</span>
                                <span className="rounded-full bg-white/10 px-2 py-1">{item.copy_count || 0} copias</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleSavedResponseFavorite(item)}
                              disabled={favoriteLoadingSavedResponseId === item.id}
                              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 text-xs font-black disabled:cursor-not-allowed disabled:opacity-60 ${
                                item.is_favorite
                                  ? "border-amber-300/40 bg-amber-300/15 text-amber-100"
                                  : "border-white/10 bg-white/10 text-slate-200"
                              }`}
                            >
                              <Star className={`h-3.5 w-3.5 ${item.is_favorite ? "fill-amber-300 text-amber-300" : ""}`} />
                              {favoriteLoadingSavedResponseId === item.id ? "Atualizando..." : item.is_favorite ? "Remover dos favoritos" : "Favoritar"}
                            </button>
                          </div>
                          <p className="mt-3 line-clamp-5 whitespace-pre-wrap text-sm leading-6 text-slate-300">{item.content}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button type="button" onClick={() => copyText(item.content, "library", undefined, item)} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-white px-3 text-xs font-black text-slate-950">
                              <Copy className="h-3.5 w-3.5" />
                              Copiar
                            </button>
                            <button type="button" onClick={() => startEditingSavedResponse(item)} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-black text-slate-200">
                              <Edit3 className="h-3.5 w-3.5" />
                              Editar
                            </button>
                            <button type="button" onClick={() => handleDuplicateSavedResponse(item)} disabled={duplicatingSavedResponseId === item.id} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-black text-slate-200 disabled:cursor-not-allowed disabled:opacity-60">
                              <Copy className="h-3.5 w-3.5" />
                              {duplicatingSavedResponseId === item.id ? "Duplicando..." : "Duplicar"}
                            </button>
                            <button type="button" onClick={() => handleDeleteSavedResponse(item)} className="inline-flex items-center gap-2 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-black text-red-200">
                              <Trash2 className="h-3.5 w-3.5" />
                              Excluir
                            </button>
                          </div>
                        </>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className="rounded-md border border-dashed border-white/15 bg-white/[0.04] p-8 text-center text-sm text-slate-400" data-testid="saved-responses-empty-state">
                  <Star className="mx-auto mb-4 h-8 w-8 text-slate-500" />
                  <p className="font-bold text-slate-200">Você ainda não salvou respostas.</p>
                  <p className="mt-2">Gere uma resposta no dashboard e salve para reutilizar depois.</p>
                  <button type="button" onClick={() => setTab("assistant")} className="mt-4 rounded-md bg-emerald-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-300">
                    Gerar resposta
                  </button>
                </div>
              )}
            </div>
          </section>
        ) : null}

        {tab === "templates" ? (
          <section className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Templates prontos para WhatsApp</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Mensagens prontas por tipo de atuação para copiar, adaptar e salvar na sua biblioteca.</p>
              </div>
              <button type="button" onClick={() => setTab("library")} className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-white/10 px-4 text-xs font-black text-slate-100 hover:bg-white/15">
                Minha biblioteca
              </button>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_1.4fr]">
              <label className="grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                Nicho
                <select value={templateBusinessTypeFilter} onChange={(event) => handleTemplateBusinessTypeFilter(event.target.value)} className="field-input">
                  <option value="Todos">Todos</option>
                  {businessTypeOptions.map((option) => (
                    <option value={option} key={option}>{getBusinessTypeLabel(option)}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                Categoria
                <select value={templateCategoryFilter} onChange={(event) => handleTemplateCategoryFilter(event.target.value)} className="field-input">
                  <option value="Todas">Todas</option>
                  {whatsappTemplateCategories.map((category) => (
                    <option value={category} key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                Buscar
                <span className="flex min-h-11 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-300">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input
                    value={templateSearch}
                    onChange={(event) => handleTemplateSearch(event.target.value)}
                    className="w-full bg-transparent normal-case outline-none placeholder:text-slate-500"
                    placeholder="Buscar por titulo, categoria ou texto"
                  />
                </span>
              </label>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {filteredTemplates.length ? (
                filteredTemplates.map((template) => (
                  <article className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={template.id}>
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-emerald-300">{getBusinessTypeLabel(template.businessType)} · {template.category}</p>
                        <h3 className="mt-1 font-black text-white">{template.title}</h3>
                        {template.description ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{template.description}</p> : null}
                      </div>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{template.content}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => copyText(template.content, "template", template)} className="rounded-md bg-white px-3 py-2 text-xs font-black text-slate-950">Copiar</button>
                      <button
                        type="button"
                        onClick={() => handleSaveTemplate(template)}
                        disabled={savingResponseId === template.id || savedTemplateIds.has(template.id)}
                        className="inline-flex min-h-9 items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 text-xs font-black text-emerald-100 disabled:opacity-60"
                      >
                        <Star className="h-3.5 w-3.5" />
                        {savedTemplateIds.has(template.id) ? "Salvo" : savingResponseId === template.id ? "Salvando..." : "Salvar na minha biblioteca"}
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-white/15 bg-white/[0.04] p-8 text-center text-sm text-slate-400 lg:col-span-2">
                  <Clipboard className="mx-auto mb-4 h-8 w-8 text-slate-500" />
                  <p className="font-bold text-slate-200">Nenhum template encontrado.</p>
                  <p className="mt-2">Ajuste os filtros ou limpe a busca para ver mais mensagens prontas.</p>
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

export default function SaasDashboardPage({ initialTab }: { initialTab?: DashboardTab }) {
  return (
    <ProtectedRoute>
      <SaasDashboardContent initialTab={initialTab} />
    </ProtectedRoute>
  );
}
