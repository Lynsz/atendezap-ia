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
  description: string | null;
  products_services: string | null;
  prices: string | null;
  opening_hours: string | null;
  address: string | null;
  payment_methods: string | null;
  booking_or_payment_link: string | null;
  brand_tone: string | null;
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
  status: string | null;
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
