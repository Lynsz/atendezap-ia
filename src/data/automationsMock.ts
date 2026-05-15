import type { Automation, AutomationLog } from "@/types/automation";

export const automationsMock: Automation[] = [
  {
    id: "auto-001",
    name: "Boas-vindas para novo lead",
    description: "Quando um novo lead chega pelo WhatsApp, sugere uma mensagem inicial com acolhimento e próximos passos.",
    trigger: "new_lead",
    action: "send_welcome_message",
    status: "active",
    isActive: true,
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-14T10:30:00.000Z",
    totalRuns: 34,
    lastRunAt: "2026-05-15T10:20:00.000Z"
  },
  {
    id: "auto-002",
    name: "Follow-up após 24h sem resposta",
    description: "Cria um lembrete para retomar conversas quando o cliente não responde em até 24 horas.",
    trigger: "customer_no_reply",
    action: "create_follow_up_reminder",
    status: "active",
    isActive: true,
    createdAt: "2026-05-10T09:20:00.000Z",
    updatedAt: "2026-05-13T15:00:00.000Z",
    totalRuns: 18,
    lastRunAt: "2026-05-15T08:45:00.000Z"
  },
  {
    id: "auto-003",
    name: "Marcar urgente ao mencionar preço",
    description: "Marca como urgente conversas com termos de orçamento, preço ou pagamento para priorizar atendimento comercial.",
    trigger: "message_received",
    action: "mark_as_urgent",
    status: "active",
    isActive: true,
    createdAt: "2026-05-11T11:10:00.000Z",
    updatedAt: "2026-05-13T11:40:00.000Z",
    totalRuns: 12,
    lastRunAt: "2026-05-14T16:12:00.000Z"
  },
  {
    id: "auto-004",
    name: "Resposta IA para orçamento",
    description: "Sugere uma resposta clara quando o cliente pede orçamento, com perguntas de qualificação e fechamento suave.",
    trigger: "message_received",
    action: "generate_ai_reply",
    status: "active",
    isActive: true,
    createdAt: "2026-05-12T08:10:00.000Z",
    updatedAt: "2026-05-14T09:30:00.000Z",
    totalRuns: 27,
    lastRunAt: "2026-05-15T09:18:00.000Z"
  },
  {
    id: "auto-005",
    name: "Mover para proposta enviada",
    description: "Quando uma proposta é enviada, move o lead para a etapa correta do funil e mantém o histórico organizado.",
    trigger: "proposal_sent",
    action: "move_pipeline_stage",
    status: "paused",
    isActive: false,
    createdAt: "2026-05-12T14:00:00.000Z",
    updatedAt: "2026-05-14T14:20:00.000Z",
    totalRuns: 8,
    lastRunAt: "2026-05-13T17:05:00.000Z"
  },
  {
    id: "auto-006",
    name: "Reativar cliente frio",
    description: "Sugere uma próxima ação para clientes frios ou parados, sem pressão excessiva.",
    trigger: "stalled_service",
    action: "suggest_next_action",
    status: "draft",
    isActive: false,
    createdAt: "2026-05-13T10:25:00.000Z",
    updatedAt: "2026-05-13T10:25:00.000Z",
    totalRuns: 0
  }
];

export const automationLogsMock: AutomationLog[] = [
  {
    id: "log-001",
    automationId: "auto-004",
    automationName: "Resposta IA para orçamento",
    action: "generate_ai_reply",
    executedAt: "2026-05-15T09:18:00.000Z",
    result: "Sugestão criada para pedido de orçamento com perguntas de qualificação.",
    status: "success"
  },
  {
    id: "log-002",
    automationId: "auto-002",
    automationName: "Follow-up após 24h sem resposta",
    action: "create_follow_up_reminder",
    executedAt: "2026-05-15T08:45:00.000Z",
    result: "Lembrete de retorno criado para conversa parada.",
    status: "success"
  },
  {
    id: "log-003",
    automationId: "auto-001",
    automationName: "Boas-vindas para novo lead",
    action: "send_welcome_message",
    executedAt: "2026-05-15T10:20:00.000Z",
    result: "Mensagem de boas-vindas simulada para novo contato.",
    status: "success"
  }
];
