import { automationLogsMock, automationsMock } from "@/data/automationsMock";
import type { Automation, AutomationLog } from "@/types/automation";

const AUTOMATIONS_STORAGE_KEY = "atendezap_ia_automations_v1";
const AUTOMATION_LOGS_STORAGE_KEY = "atendezap_ia_automation_logs_v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStorage<T>(key: string, fallback: T) {
  if (!canUseStorage()) return fallback;

  const stored = window.localStorage.getItem(key);
  if (!stored) return fallback;

  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export function listAutomations(): Automation[] {
  return readStorage(AUTOMATIONS_STORAGE_KEY, automationsMock);
}

export function saveAutomations(automations: Automation[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(AUTOMATIONS_STORAGE_KEY, JSON.stringify(automations));
}

export function listAutomationLogs(): AutomationLog[] {
  return readStorage(AUTOMATION_LOGS_STORAGE_KEY, automationLogsMock);
}

export function saveAutomationLogs(logs: AutomationLog[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(AUTOMATION_LOGS_STORAGE_KEY, JSON.stringify(logs));
}

export function createAutomation(automation: Automation) {
  const automations = [automation, ...listAutomations()];
  saveAutomations(automations);
  return automations;
}

export function updateAutomation(updatedAutomation: Automation) {
  const automations = listAutomations().map((automation) =>
    automation.id === updatedAutomation.id ? { ...updatedAutomation, updatedAt: new Date().toISOString() } : automation
  );
  saveAutomations(automations);
  return automations;
}

export function deleteAutomation(automationId: string) {
  const automations = listAutomations().filter((automation) => automation.id !== automationId);
  saveAutomations(automations);
  return automations;
}

export function toggleAutomation(automationId: string) {
  const now = new Date().toISOString();
  const automations = listAutomations().map((automation) => {
    if (automation.id !== automationId) return automation;

    const nextActive = !automation.isActive;
    return {
      ...automation,
      isActive: nextActive,
      status: nextActive ? "active" : "paused",
      updatedAt: now
    } satisfies Automation;
  });

  saveAutomations(automations);
  return automations;
}

export function resetAutomationData() {
  saveAutomations(automationsMock);
  saveAutomationLogs(automationLogsMock);
  return {
    automations: automationsMock,
    logs: automationLogsMock
  };
}

function actionResult(automation: Automation) {
  if (!automation.isActive || automation.status !== "active") {
    return {
      status: "skipped" as const,
      result: `Automação "${automation.name}" está pausada ou em rascunho. Nenhuma ação foi executada.`
    };
  }

  const results = {
    send_welcome_message: "Mensagem de boas-vindas simulada e pronta para envio no WhatsApp.",
    generate_ai_reply: "Resposta IA simulada com tom profissional e próximo passo comercial.",
    create_follow_up_reminder: "Lembrete de follow-up criado para retomar a conversa no momento certo.",
    mark_as_urgent: "Lead marcado como urgente para priorização no atendimento.",
    move_pipeline_stage: "Lead movido para a etapa correta do funil comercial.",
    suggest_next_action: "Próxima ação sugerida com base no contexto da conversa."
  };

  return {
    status: "success" as const,
    result: results[automation.action]
  };
}

export function simulateAutomationRun(automation: Automation) {
  const now = new Date().toISOString();
  const simulation = actionResult(automation);
  const log: AutomationLog = {
    id: `log-${Date.now()}`,
    automationId: automation.id,
    automationName: automation.name,
    action: automation.action,
    executedAt: now,
    result: simulation.result,
    status: simulation.status
  };

  const automations = listAutomations().map((item) => {
    if (item.id !== automation.id) return item;
    return {
      ...item,
      totalRuns: item.totalRuns + (simulation.status === "success" ? 1 : 0),
      lastRunAt: now,
      updatedAt: now
    };
  });
  const logs = [log, ...listAutomationLogs()].slice(0, 50);

  saveAutomations(automations);
  saveAutomationLogs(logs);

  return {
    automations,
    logs,
    log,
    message: simulation.result
  };
}
