export type BusinessSegment =
  | "beleza"
  | "estética"
  | "alimentação"
  | "moda"
  | "educação"
  | "saúde"
  | "serviços"
  | "tecnologia"
  | "imobiliário"
  | "outro";

export type AITone = "profissional" | "amigável" | "direto" | "consultivo" | "descontraído" | "premium";

export type ServiceChannel = "whatsapp" | "instagram" | "site" | "telefone" | "presencial";

export type OnboardingStep = 1 | 2 | 3 | 4;

export type BusinessProfile = {
  businessName: string;
  ownerName: string;
  segment: BusinessSegment;
  customSegment?: string;
  aiTone: AITone;
  channels: ServiceChannel[];
  openingHours: string;
  welcomeMessage: string;
  mainGoal: string;
  productsOrServices: string;
  targetAudience: string;
  createdAt: string;
  updatedAt: string;
};
