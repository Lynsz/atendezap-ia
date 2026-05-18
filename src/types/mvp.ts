export type ResponseType = "atendimento" | "venda" | "orcamento" | "cliente_indeciso" | "pos_venda" | "recuperacao";

export type CustomerStatus = "novo" | "em_atendimento" | "orcamento_enviado" | "aguardando_resposta" | "venda_concluida" | "perdido";

export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
};

export type Business = {
  id: string;
  user_id: string;
  business_name: string;
  business_area: string | null;
  business_type?: string | null;
  location?: string | null;
  description: string | null;
  products_services: string | null;
  common_questions?: string | null;
  important_info?: string | null;
  prices: string | null;
  opening_hours: string | null;
  main_channel?: string | null;
  response_goal?: string | null;
  address: string | null;
  payment_methods: string | null;
  booking_or_payment_link: string | null;
  brand_tone: string | null;
  onboarding_completed?: boolean | null;
  created_at: string;
  updated_at: string;
};

export type GeneratedResponse = {
  id: string;
  user_id: string;
  business_id: string | null;
  customer_question: string;
  generated_answer: string;
  response_type: string | null;
  created_at: string;
};

export type CustomerLead = {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  status: CustomerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan_name: string | null;
  plan: string | null;
  status: string | null;
  provider: string | null;
  provider_customer_id?: string | null;
  provider_subscription_id?: string | null;
  cancel_at_period_end?: boolean | null;
  current_period_start?: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export type Plan = {
  id: string;
  name: string;
  price: number | null;
  response_limit: number | null;
  created_at: string;
};
