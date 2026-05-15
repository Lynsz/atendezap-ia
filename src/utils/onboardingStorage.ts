import type { BusinessProfile } from "@/types/onboarding";

const BUSINESS_PROFILE_KEY = "atendezap_ia_business_profile_v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getBusinessProfile(): BusinessProfile | null {
  if (!canUseStorage()) return null;

  const stored = window.localStorage.getItem(BUSINESS_PROFILE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as BusinessProfile;
  } catch {
    return null;
  }
}

export function saveBusinessProfile(profile: BusinessProfile) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(BUSINESS_PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event("atendezap-onboarding-change"));
}

export function clearBusinessProfile() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(BUSINESS_PROFILE_KEY);
  window.dispatchEvent(new Event("atendezap-onboarding-change"));
}

export function hasCompletedOnboarding() {
  return Boolean(getBusinessProfile());
}

function segmentLabel(profile: Pick<BusinessProfile, "segment" | "customSegment">) {
  return profile.segment === "outro" ? profile.customSegment || "negócio" : profile.segment;
}

export function generateDefaultWelcomeMessage(profile: Pick<BusinessProfile, "businessName" | "segment" | "customSegment" | "aiTone">) {
  const businessName = profile.businessName || "nossa empresa";
  const segment = segmentLabel(profile);

  const toneOpeners: Record<BusinessProfile["aiTone"], string> = {
    profissional: "Olá! Seja bem-vindo(a)",
    amigável: "Oi! Que bom receber você",
    direto: "Olá! Vamos te ajudar",
    consultivo: "Olá! Conte com a gente para entender sua necessidade",
    descontraído: "Oi! Bora te ajudar por aqui",
    premium: "Olá, é um prazer receber você"
  };

  return `${toneOpeners[profile.aiTone]} na ${businessName}. Somos especialistas em ${segment} e vamos te responder o mais rápido possível. Para agilizar, envie sua dúvida ou o serviço/produto que você procura.`;
}

export function generateAISystemPrompt(profile: BusinessProfile) {
  const segment = segmentLabel(profile);
  const channels = profile.channels.join(", ");

  return `Você é a IA de atendimento da empresa ${profile.businessName}.

Responsável: ${profile.ownerName}
Segmento: ${segment}
Tom de voz: ${profile.aiTone}
Canais de atendimento: ${channels}
Horário de atendimento: ${profile.openingHours}
Objetivo principal: ${profile.mainGoal}
Produtos ou serviços: ${profile.productsOrServices}
Público-alvo: ${profile.targetAudience}

Regras:
- Responda em português do Brasil.
- Mantenha o tom de voz definido.
- Seja claro, útil e respeitoso.
- Não prometa resultado financeiro garantido.
- Ajude a qualificar o cliente e conduzir para o próximo passo.
- Use a mensagem de boas-vindas como referência inicial: "${profile.welcomeMessage}".`;
}
