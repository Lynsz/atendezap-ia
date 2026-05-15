import type { WhatsAppConnection, WhatsAppSyncLog, WhatsAppTemplate } from "@/types/whatsapp";

const now = "2026-05-15T12:00:00.000Z";

export const whatsappDemoDisconnected: WhatsAppConnection = {
  id: "wa-demo-disconnected",
  provider: "manual_demo",
  status: "disconnected",
  phoneNumber: "",
  displayName: "AtendeZap Demo",
  businessName: "AtendeZap IA",
  createdAt: now,
  updatedAt: now
};

export const whatsappDemoConnected: WhatsAppConnection = {
  id: "wa-demo-connected",
  provider: "manual_demo",
  status: "connected",
  phoneNumber: "+55 11 99999-0000",
  displayName: "AtendeZap Atendimento",
  businessName: "AtendeZap IA",
  connectedAt: now,
  lastSyncAt: now,
  createdAt: now,
  updatedAt: now
};

export const whatsappTemplatesMock: WhatsAppTemplate[] = [
  {
    id: "tpl-welcome",
    name: "Boas-vindas",
    category: "Atendimento",
    content: "Olá! Seja bem-vindo(a). Me conte como posso ajudar hoje.",
    status: "approved",
    createdAt: now
  },
  {
    id: "tpl-follow-up",
    name: "Follow-up",
    category: "Vendas",
    content: "Oi! Passando para saber se você conseguiu ver minha última mensagem. Posso te ajudar com o próximo passo?",
    status: "approved",
    createdAt: now
  },
  {
    id: "tpl-quote",
    name: "Orçamento",
    category: "Comercial",
    content: "Para montar seu orçamento certinho, me envie o serviço desejado, quantidade e melhor horário para atendimento.",
    status: "draft",
    createdAt: now
  },
  {
    id: "tpl-hours",
    name: "Horário de atendimento",
    category: "Informativo",
    content: "Nosso horário de atendimento é de segunda a sexta, das 9h às 18h. Assim que possível retornamos sua mensagem.",
    status: "approved",
    createdAt: now
  },
  {
    id: "tpl-no-reply",
    name: "Ausência de resposta",
    category: "Follow-up",
    content: "Oi! Como não tivemos retorno, vou pausar este atendimento por enquanto. Quando quiser continuar, é só responder aqui.",
    status: "pending",
    createdAt: now
  }
];

export const whatsappSyncLogsMock: WhatsAppSyncLog[] = [
  {
    id: "wa-log-connected",
    type: "connection",
    title: "Número conectado",
    description: "Conexão demo criada para simular o canal de atendimento.",
    status: "success",
    createdAt: now
  },
  {
    id: "wa-log-imported",
    type: "message_import",
    title: "Mensagens importadas",
    description: "Conversas mockadas foram adicionadas ao painel de atendimento.",
    status: "success",
    createdAt: now
  },
  {
    id: "wa-log-token-error",
    type: "error",
    title: "Erro de token simulado",
    description: "Exemplo de falha futura caso token de provedor esteja expirado.",
    status: "error",
    createdAt: now
  },
  {
    id: "wa-log-sync",
    type: "sync",
    title: "Sincronização concluída",
    description: "Status local atualizado sem chamada real para WhatsApp.",
    status: "success",
    createdAt: now
  }
];
