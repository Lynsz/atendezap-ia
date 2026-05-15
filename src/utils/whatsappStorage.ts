import { atendezapMockConversations } from "@/data/atendezapMock";
import { whatsappDemoConnected, whatsappDemoDisconnected, whatsappSyncLogsMock, whatsappTemplatesMock } from "@/data/whatsappMock";
import type { Conversation } from "@/types/atendezap";
import type { WhatsAppConnection, WhatsAppSyncLog, WhatsAppTemplate } from "@/types/whatsapp";

const WHATSAPP_CONNECTION_KEY = "atendezap_ia_whatsapp_connection_v1";
const WHATSAPP_TEMPLATES_KEY = "atendezap_ia_whatsapp_templates_v1";
const WHATSAPP_SYNC_LOGS_KEY = "atendezap_ia_whatsapp_sync_logs_v1";
const CONVERSATIONS_STORAGE_KEY = "atendezap_ia_conversations_v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readStorage<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  const stored = window.localStorage.getItem(key);
  if (!stored) return fallback;

  try {
    return JSON.parse(stored) as T;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("atendezap-whatsapp-change"));
}

export function getWhatsAppConnection(): WhatsAppConnection {
  return readStorage(WHATSAPP_CONNECTION_KEY, whatsappDemoDisconnected);
}

export function saveWhatsAppConnection(connection: WhatsAppConnection) {
  writeStorage(WHATSAPP_CONNECTION_KEY, connection);
}

export function clearWhatsAppConnection() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(WHATSAPP_CONNECTION_KEY);
  window.dispatchEvent(new Event("atendezap-whatsapp-change"));
}

export function connectDemoWhatsApp() {
  const now = new Date().toISOString();
  const current = getWhatsAppConnection();
  const connection: WhatsAppConnection = {
    ...whatsappDemoConnected,
    id: current.id || createId("wa"),
    connectedAt: now,
    lastSyncAt: now,
    createdAt: current.createdAt || now,
    updatedAt: now
  };

  saveWhatsAppConnection(connection);
  addWhatsAppSyncLog({
    type: "connection",
    title: "WhatsApp demo conectado",
    description: "Número local conectado em modo demo. Nenhuma mensagem real será enviada.",
    status: "success"
  });

  return connection;
}

export function disconnectDemoWhatsApp() {
  const current = getWhatsAppConnection();
  const connection: WhatsAppConnection = {
    ...current,
    status: "disconnected",
    lastSyncAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  saveWhatsAppConnection(connection);
  addWhatsAppSyncLog({
    type: "connection",
    title: "WhatsApp demo desconectado",
    description: "A conexão local foi marcada como desconectada.",
    status: "warning"
  });

  return connection;
}

export function pauseWhatsAppConnection() {
  const current = getWhatsAppConnection();
  const connection: WhatsAppConnection = {
    ...current,
    status: "paused",
    updatedAt: new Date().toISOString()
  };

  saveWhatsAppConnection(connection);
  addWhatsAppSyncLog({
    type: "connection",
    title: "Conexão pausada",
    description: "A simulação do canal foi pausada localmente.",
    status: "info"
  });

  return connection;
}

export function resumeWhatsAppConnection() {
  const current = getWhatsAppConnection();
  const connection: WhatsAppConnection = {
    ...current,
    status: "connected",
    lastSyncAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  saveWhatsAppConnection(connection);
  addWhatsAppSyncLog({
    type: "connection",
    title: "Conexão retomada",
    description: "A simulação do canal voltou ao status conectado.",
    status: "success"
  });

  return connection;
}

export function getWhatsAppTemplates(): WhatsAppTemplate[] {
  return readStorage(WHATSAPP_TEMPLATES_KEY, whatsappTemplatesMock);
}

export function saveWhatsAppTemplates(templates: WhatsAppTemplate[]) {
  writeStorage(WHATSAPP_TEMPLATES_KEY, templates);
}

export function createWhatsAppTemplate(template: Omit<WhatsAppTemplate, "id" | "createdAt">) {
  const nextTemplate: WhatsAppTemplate = {
    ...template,
    id: createId("tpl"),
    createdAt: new Date().toISOString()
  };
  const templates = [nextTemplate, ...getWhatsAppTemplates()];
  saveWhatsAppTemplates(templates);
  addWhatsAppSyncLog({
    type: "template",
    title: "Template criado",
    description: `Template "${nextTemplate.name}" criado em modo local.`,
    status: "success"
  });
  return templates;
}

export function updateWhatsAppTemplate(templateId: string, updates: Partial<WhatsAppTemplate>) {
  const templates = getWhatsAppTemplates().map((template) => (template.id === templateId ? { ...template, ...updates } : template));
  saveWhatsAppTemplates(templates);
  addWhatsAppSyncLog({
    type: "template",
    title: "Template atualizado",
    description: "Template de mensagem atualizado localmente.",
    status: "info"
  });
  return templates;
}

export function deleteWhatsAppTemplate(templateId: string) {
  const templates = getWhatsAppTemplates().filter((template) => template.id !== templateId);
  saveWhatsAppTemplates(templates);
  addWhatsAppSyncLog({
    type: "template",
    title: "Template excluído",
    description: "Template removido da simulação local.",
    status: "warning"
  });
  return templates;
}

export function getWhatsAppSyncLogs(): WhatsAppSyncLog[] {
  return readStorage(WHATSAPP_SYNC_LOGS_KEY, whatsappSyncLogsMock);
}

export function addWhatsAppSyncLog(log: Omit<WhatsAppSyncLog, "id" | "createdAt"> | WhatsAppSyncLog) {
  const nextLog: WhatsAppSyncLog =
    "id" in log && "createdAt" in log
      ? log
      : {
          ...log,
          id: createId("wa-log"),
          createdAt: new Date().toISOString()
        };
  const logs = [nextLog, ...getWhatsAppSyncLogs()].slice(0, 50);
  writeStorage(WHATSAPP_SYNC_LOGS_KEY, logs);
  return logs;
}

function getStoredConversations() {
  return readStorage<Conversation[]>(CONVERSATIONS_STORAGE_KEY, atendezapMockConversations);
}

export function simulateMessageImport() {
  const now = new Date().toISOString();
  const importedConversation: Conversation = {
    id: createId("conv-wa"),
    status: "open",
    priority: "high",
    intent: "Mensagem importada do WhatsApp demo",
    updatedAt: now,
    customer: {
      id: createId("cust-wa"),
      name: "Cliente WhatsApp Demo",
      phone: "+55 11 98888-0000",
      avatarInitials: "CW",
      city: "São Paulo, SP",
      tags: ["whatsapp", "demo"]
    },
    messages: [
      {
        id: createId("msg-wa"),
        sender: "customer",
        content: "Olá! Vim pelo WhatsApp e queria saber como funciona o atendimento com IA.",
        createdAt: now
      }
    ]
  };
  const conversations = [importedConversation, ...getStoredConversations()];
  const current = getWhatsAppConnection();

  writeStorage(CONVERSATIONS_STORAGE_KEY, conversations);
  saveWhatsAppConnection({
    ...current,
    status: current.status === "disconnected" ? "connected" : current.status,
    lastSyncAt: now,
    updatedAt: now
  });
  addWhatsAppSyncLog({
    type: "message_import",
    title: "Mensagens importadas",
    description: "Uma conversa demo foi adicionada ao painel de atendimento.",
    status: "success"
  });

  return conversations;
}
