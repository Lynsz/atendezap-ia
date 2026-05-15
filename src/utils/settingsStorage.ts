import type { AISettings, CompanySettings, NotificationSettings, SupportSettings } from "@/types/settings";
import { generateDefaultWelcomeMessage, getBusinessProfile, saveBusinessProfile } from "@/utils/onboardingStorage";

const COMPANY_SETTINGS_KEY = "atendezap_ia_company_settings_v1";
const AI_SETTINGS_KEY = "atendezap_ia_ai_settings_v1";
const NOTIFICATION_SETTINGS_KEY = "atendezap_ia_notification_settings_v1";
const SUPPORT_SETTINGS_KEY = "atendezap_ia_support_settings_v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStorage<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  const stored = window.localStorage.getItem(key);
  if (!stored) return fallback;

  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("atendezap-settings-change"));
}

function segmentLabel(settings: Pick<CompanySettings, "segment" | "customSegment">) {
  return settings.segment === "outro" ? settings.customSegment || "negócio" : settings.segment;
}

export function getDefaultCompanySettings(): CompanySettings {
  const onboarding = getBusinessProfile();

  return {
    businessName: onboarding?.businessName || "",
    ownerName: onboarding?.ownerName || "",
    document: "",
    email: "",
    phone: "",
    segment: onboarding?.segment || "serviços",
    customSegment: onboarding?.customSegment || "",
    website: "",
    instagram: "",
    openingHours: onboarding?.openingHours || "",
    timezone: "America/Sao_Paulo"
  };
}

export function generateDefaultAISettings(): AISettings {
  const onboarding = getBusinessProfile();
  const baseCompany = getDefaultCompanySettings();
  const welcomeMessage = onboarding?.welcomeMessage || generateDefaultWelcomeMessage({
    businessName: baseCompany.businessName || "sua empresa",
    segment: baseCompany.segment,
    customSegment: baseCompany.customSegment,
    aiTone: onboarding?.aiTone || "profissional"
  });

  return {
    aiName: "AtendeZap IA",
    aiTone: onboarding?.aiTone || "profissional",
    welcomeMessage,
    fallbackMessage: "Não tenho certeza da melhor resposta agora, mas vou registrar sua mensagem para retornarmos com segurança.",
    mainGoal: onboarding?.mainGoal || "organizar leads",
    productsOrServices: onboarding?.productsOrServices || "",
    targetAudience: onboarding?.targetAudience || "",
    blockedWords: [],
    autoSuggestReplies: true,
    autoSummarizeConversations: true,
    autoClassifyLeads: true
  };
}

export function getDefaultNotificationSettings(): NotificationSettings {
  return {
    notifyNewLead: true,
    notifyUrgentLead: true,
    notifyUnansweredConversation: true,
    notifyNewSubscription: true,
    emailNotifications: false
  };
}

export function getDefaultSupportSettings(): SupportSettings {
  return {
    supportEmail: "suporte@atendezapia.com",
    supportWhatsapp: "",
    helpText: "Descreva sua dúvida com o máximo de contexto possível. O suporte responderá conforme disponibilidade."
  };
}

export function getCompanySettings(): CompanySettings {
  return readStorage(COMPANY_SETTINGS_KEY, getDefaultCompanySettings());
}

export function saveCompanySettings(settings: CompanySettings) {
  writeStorage(COMPANY_SETTINGS_KEY, settings);
}

export function getAISettings(): AISettings {
  return readStorage(AI_SETTINGS_KEY, generateDefaultAISettings());
}

export function saveAISettings(settings: AISettings) {
  writeStorage(AI_SETTINGS_KEY, settings);
}

export function getNotificationSettings(): NotificationSettings {
  return readStorage(NOTIFICATION_SETTINGS_KEY, getDefaultNotificationSettings());
}

export function saveNotificationSettings(settings: NotificationSettings) {
  writeStorage(NOTIFICATION_SETTINGS_KEY, settings);
}

export function getSupportSettings(): SupportSettings {
  return readStorage(SUPPORT_SETTINGS_KEY, getDefaultSupportSettings());
}

export function saveSupportSettings(settings: SupportSettings) {
  writeStorage(SUPPORT_SETTINGS_KEY, settings);
}

export function syncSettingsFromOnboarding() {
  const onboarding = getBusinessProfile();
  const currentCompany = getCompanySettings();
  const currentAI = getAISettings();

  if (!onboarding) {
    const defaultCompany = getDefaultCompanySettings();
    const defaultAI = generateDefaultAISettings();
    saveCompanySettings(defaultCompany);
    saveAISettings(defaultAI);
    return { company: defaultCompany, ai: defaultAI };
  }

  const company: CompanySettings = {
    ...currentCompany,
    businessName: onboarding.businessName,
    ownerName: onboarding.ownerName,
    segment: onboarding.segment,
    customSegment: onboarding.customSegment || "",
    openingHours: onboarding.openingHours
  };
  const ai: AISettings = {
    ...currentAI,
    aiTone: onboarding.aiTone,
    welcomeMessage: onboarding.welcomeMessage,
    mainGoal: onboarding.mainGoal,
    productsOrServices: onboarding.productsOrServices,
    targetAudience: onboarding.targetAudience
  };

  saveCompanySettings(company);
  saveAISettings(ai);
  return { company, ai };
}

export function resetSettings() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(COMPANY_SETTINGS_KEY);
  window.localStorage.removeItem(AI_SETTINGS_KEY);
  window.localStorage.removeItem(NOTIFICATION_SETTINGS_KEY);
  window.localStorage.removeItem(SUPPORT_SETTINGS_KEY);
  window.dispatchEvent(new Event("atendezap-settings-change"));
}

export function generateWelcomeFromSettings(company: CompanySettings, ai: AISettings) {
  const businessName = company.businessName || "sua empresa";
  const segment = segmentLabel(company);
  const toneOpeners: Record<AISettings["aiTone"], string> = {
    profissional: "Olá! Seja bem-vindo(a)",
    amigável: "Oi! Que bom receber você",
    direto: "Olá! Vamos te ajudar",
    consultivo: "Olá! Conte com a gente para entender sua necessidade",
    descontraído: "Oi! Bora te ajudar por aqui",
    premium: "Olá, é um prazer receber você"
  };

  return `${toneOpeners[ai.aiTone]} na ${businessName}. Somos especialistas em ${segment} e vamos te responder com atenção. Para agilizar, envie sua dúvida, produto ou serviço de interesse.`;
}

export function generateAIBasePrompt(company: CompanySettings, ai: AISettings) {
  const segment = segmentLabel(company);

  return `Você é ${ai.aiName}, a IA de atendimento da empresa ${company.businessName || "AtendeZap IA"}.

Responsável: ${company.ownerName || "não informado"}
Segmento: ${segment}
Tom de voz: ${ai.aiTone}
Objetivo principal: ${ai.mainGoal}
Horário de atendimento: ${company.openingHours || "não informado"}
Produtos ou serviços: ${ai.productsOrServices || "não informado"}
Público-alvo: ${ai.targetAudience || "não informado"}

Regras:
- Responda em português do Brasil.
- Use linguagem natural, clara e comercial.
- Não prometa resultado financeiro garantido.
- Não use palavras bloqueadas: ${ai.blockedWords.length ? ai.blockedWords.join(", ") : "nenhuma"}.
- Quando não houver contexto suficiente, use a mensagem de fallback: "${ai.fallbackMessage}".
- Mensagem de boas-vindas de referência: "${ai.welcomeMessage}".`;
}

export function persistSettingsToOnboarding(company: CompanySettings, ai: AISettings) {
  const current = getBusinessProfile();
  const now = new Date().toISOString();

  saveBusinessProfile({
    businessName: company.businessName,
    ownerName: company.ownerName,
    segment: company.segment,
    customSegment: company.customSegment,
    aiTone: ai.aiTone,
    channels: ["whatsapp"],
    openingHours: company.openingHours,
    welcomeMessage: ai.welcomeMessage,
    mainGoal: ai.mainGoal,
    productsOrServices: ai.productsOrServices,
    targetAudience: ai.targetAudience,
    createdAt: current?.createdAt || now,
    updatedAt: now
  });
}
