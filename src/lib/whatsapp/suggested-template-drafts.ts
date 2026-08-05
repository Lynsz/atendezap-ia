import type { WhatsAppTemplateComponent } from "@/lib/whatsapp/template-validation";

export type SuggestedTemplateDraft = {
  id: string;
  niche: "delivery" | "estetica" | "assistencia_tecnica" | "loja" | "restaurante" | "prestador_de_servico" | "autonomo" | "geral";
  name: string;
  language: "pt_BR";
  category: "utility" | "service" | "other";
  localStatus: "draft";
  components: WhatsAppTemplateComponent[];
};

export const suggestedTemplateDrafts: SuggestedTemplateDraft[] = [
  { id: "delivery-retorno", niche: "delivery", name: "retorno_pedido_delivery", language: "pt_BR", category: "utility", localStatus: "draft", components: [{ type: "BODY", text: "Olá, {{1}}. Recebemos seu pedido de atendimento e precisamos confirmar {{2}} antes de continuar." }] },
  { id: "estetica-interesse", niche: "estetica", name: "confirmacao_interesse_estetica", language: "pt_BR", category: "service", localStatus: "draft", components: [{ type: "BODY", text: "Olá, {{1}}. Podemos continuar seu atendimento sobre {{2}}? Responda quando for conveniente." }] },
  { id: "assistencia-orcamento", niche: "assistencia_tecnica", name: "orcamento_disponivel_assistencia", language: "pt_BR", category: "utility", localStatus: "draft", components: [{ type: "BODY", text: "Olá, {{1}}. O orçamento referente a {{2}} está disponível para sua revisão. Fale conosco para confirmar os detalhes." }] },
  { id: "loja-informacao", niche: "loja", name: "informacao_faltante_loja", language: "pt_BR", category: "service", localStatus: "draft", components: [{ type: "BODY", text: "Olá, {{1}}. Para continuar seu atendimento, precisamos confirmar: {{2}}." }] },
  { id: "restaurante-horario", niche: "restaurante", name: "horario_atendimento_restaurante", language: "pt_BR", category: "other", localStatus: "draft", components: [{ type: "BODY", text: "Olá, {{1}}. Nosso horário de atendimento para {{2}} é {{3}}. Confirme conosco antes de se deslocar." }] },
  { id: "prestador-acompanhamento", niche: "prestador_de_servico", name: "acompanhamento_servico", language: "pt_BR", category: "service", localStatus: "draft", components: [{ type: "BODY", text: "Olá, {{1}}. Gostaríamos de saber se ainda precisa de ajuda com {{2}}." }] },
  { id: "autonomo-retorno", niche: "autonomo", name: "retorno_atendimento_autonomo", language: "pt_BR", category: "service", localStatus: "draft", components: [{ type: "BODY", text: "Olá, {{1}}. Estou retornando sobre seu pedido de atendimento relacionado a {{2}}." }] },
  { id: "geral-pos", niche: "geral", name: "acompanhamento_pos_atendimento", language: "pt_BR", category: "other", localStatus: "draft", components: [{ type: "BODY", text: "Olá, {{1}}. Seu atendimento sobre {{2}} foi concluído? Se ainda precisar de ajuda, responda a esta mensagem." }] }
];
