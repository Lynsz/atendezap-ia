"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  Bot,
  Clock3,
  Edit3,
  Filter,
  History,
  Pause,
  Play,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Sparkles,
  Trash2,
  Workflow,
  X,
  Zap
} from "lucide-react";
import type { Automation, AutomationAction, AutomationLog, AutomationStatus, AutomationTrigger } from "@/types/automation";
import {
  createAutomation,
  deleteAutomation,
  listAutomationLogs,
  listAutomations,
  resetAutomationData,
  saveAutomationLogs,
  saveAutomations,
  simulateAutomationRun,
  toggleAutomation,
  updateAutomation
} from "@/utils/automationEngine";

const triggerLabels: Record<AutomationTrigger, string> = {
  new_lead: "Novo lead",
  customer_no_reply: "Cliente sem resposta",
  message_received: "Mensagem recebida",
  urgent_lead: "Lead urgente",
  proposal_sent: "Proposta enviada",
  stalled_service: "Atendimento parado"
};

const actionLabels: Record<AutomationAction, string> = {
  send_welcome_message: "Enviar mensagem de boas-vindas",
  generate_ai_reply: "Gerar resposta IA",
  create_follow_up_reminder: "Criar lembrete de follow-up",
  mark_as_urgent: "Marcar como urgente",
  move_pipeline_stage: "Mover etapa do funil",
  suggest_next_action: "Sugerir próxima ação"
};

const statusLabels: Record<AutomationStatus, string> = {
  active: "Ativa",
  paused: "Pausada",
  draft: "Rascunho"
};

const triggerOptions = Object.keys(triggerLabels) as AutomationTrigger[];
const actionOptions = Object.keys(actionLabels) as AutomationAction[];
const statusOptions = Object.keys(statusLabels) as AutomationStatus[];

const emptyAutomation: Automation = {
  id: "",
  name: "",
  description: "",
  trigger: "new_lead",
  action: "send_welcome_message",
  status: "draft",
  isActive: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  totalRuns: 0
};

function formatDate(value?: string) {
  if (!value) return "Nunca";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function statusClass(status: AutomationStatus) {
  if (status === "active") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (status === "paused") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  return "border-slate-500/40 bg-slate-500/15 text-slate-300";
}

function logStatusClass(status: AutomationLog["status"]) {
  if (status === "success") return "bg-emerald-400/10 text-emerald-200 ring-emerald-400/30";
  if (status === "skipped") return "bg-amber-400/10 text-amber-200 ring-amber-400/30";
  return "bg-red-400/10 text-red-200 ring-red-400/30";
}

function createBlankAutomation() {
  const now = new Date().toISOString();
  return {
    ...emptyAutomation,
    id: `auto-${Date.now()}`,
    createdAt: now,
    updatedAt: now
  };
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>(() => listAutomations());
  const [logs, setLogs] = useState<AutomationLog[]>(() => listAutomationLogs());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AutomationStatus>("all");
  const [triggerFilter, setTriggerFilter] = useState<"all" | AutomationTrigger>("all");
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState("");

  useEffect(() => {
    saveAutomations(automations);
  }, [automations]);

  useEffect(() => {
    saveAutomationLogs(logs);
  }, [logs]);

  const filteredAutomations = useMemo(() => {
    const search = query.trim().toLowerCase();

    return automations.filter((automation) => {
      const matchesStatus = statusFilter === "all" || automation.status === statusFilter;
      const matchesTrigger = triggerFilter === "all" || automation.trigger === triggerFilter;
      const searchableText = [
        automation.name,
        automation.description,
        triggerLabels[automation.trigger],
        actionLabels[automation.action],
        statusLabels[automation.status]
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && matchesTrigger && (!search || searchableText.includes(search));
    });
  }, [automations, query, statusFilter, triggerFilter]);

  const metrics = useMemo(() => {
    return {
      total: automations.length,
      active: automations.filter((automation) => automation.isActive && automation.status === "active").length,
      totalRuns: automations.reduce((sum, automation) => sum + automation.totalRuns, 0),
      lastRunAt: logs[0]?.executedAt
    };
  }, [automations, logs]);

  function handleCreateAutomation() {
    setIsCreating(true);
    setEditingAutomation(createBlankAutomation());
  }

  function handleSaveAutomation() {
    if (!editingAutomation || !editingAutomation.name.trim() || !editingAutomation.description.trim()) return;

    const normalizedAutomation: Automation = {
      ...editingAutomation,
      name: editingAutomation.name.trim(),
      description: editingAutomation.description.trim(),
      isActive: editingAutomation.status === "active" ? editingAutomation.isActive : false,
      updatedAt: new Date().toISOString()
    };

    const nextAutomations = isCreating ? createAutomation(normalizedAutomation) : updateAutomation(normalizedAutomation);
    setAutomations(nextAutomations);
    setEditingAutomation(null);
    setIsCreating(false);
  }

  function handleDeleteAutomation(automationId: string) {
    if (!window.confirm("Excluir esta automação?")) return;
    setAutomations(deleteAutomation(automationId));
    if (editingAutomation?.id === automationId) {
      setEditingAutomation(null);
      setIsCreating(false);
    }
  }

  function handleToggleAutomation(automationId: string) {
    setAutomations(toggleAutomation(automationId));
  }

  function handleSimulateAutomation(automation: Automation) {
    const result = simulateAutomationRun(automation);
    setAutomations(result.automations);
    setLogs(result.logs);
    setSimulationMessage(result.message);
  }

  function handleResetData() {
    const reset = resetAutomationData();
    setAutomations(reset.automations);
    setLogs(reset.logs);
    setEditingAutomation(null);
    setIsCreating(false);
    setSimulationMessage("");
  }

  return (
    <main className="min-h-screen bg-[#090d12] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 lg:px-6">
        <header className="mb-5 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
                <Bot className="h-4 w-4" />
                Fluxos inteligentes
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white">Automações IA</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Simule rascunhos e lembretes locais sem usar backend. A versao atual nao envia WhatsApp automaticamente e nao e um CRM completo.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleResetData}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
              >
                <RefreshCcw className="h-4 w-4" />
                Restaurar mocks
              </button>
              <button
                type="button"
                onClick={handleCreateAutomation}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
              >
                <Plus className="h-4 w-4" />
                Nova automação
              </button>
            </div>
          </div>
        </header>

        <section className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={<Workflow className="h-5 w-5" />} label="Automações totais" value={String(metrics.total)} />
          <MetricCard icon={<Activity className="h-5 w-5" />} label="Automações ativas" value={String(metrics.active)} />
          <MetricCard icon={<Zap className="h-5 w-5" />} label="Execuções totais" value={String(metrics.totalRuns)} />
          <MetricCard icon={<Clock3 className="h-5 w-5" />} label="Última execução" value={formatDate(metrics.lastRunAt)} />
        </section>

        {simulationMessage ? (
          <div className="mb-5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-100">
            {simulationMessage}
          </div>
        ) : null}

        <section className="mb-5 rounded-lg border border-white/10 bg-[#101821] p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_240px]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nome ou descrição"
                className="h-11 w-full rounded-md border border-white/10 bg-[#0b1118] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
              />
            </label>
            <FilterSelect label="Status" value={statusFilter} onChange={(value) => setStatusFilter(value as "all" | AutomationStatus)}>
              <option value="all">Todos status</option>
              {statusOptions.map((status) => (
                <option value={status} key={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Gatilho" value={triggerFilter} onChange={(value) => setTriggerFilter(value as "all" | AutomationTrigger)}>
              <option value="all">Todos gatilhos</option>
              {triggerOptions.map((trigger) => (
                <option value={trigger} key={trigger}>
                  {triggerLabels[trigger]}
                </option>
              ))}
            </FilterSelect>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid content-start gap-4 md:grid-cols-2">
            {filteredAutomations.map((automation) => (
              <AutomationCard
                automation={automation}
                key={automation.id}
                onDelete={handleDeleteAutomation}
                onEdit={setEditingAutomation}
                onSimulate={handleSimulateAutomation}
                onToggle={handleToggleAutomation}
              />
            ))}
            {!filteredAutomations.length ? (
              <div className="rounded-lg border border-white/10 bg-[#101821] p-8 text-center text-sm text-slate-400 md:col-span-2">
                Nenhuma automação encontrada.
              </div>
            ) : null}
          </div>

          <ExecutionLogs logs={logs} />
        </section>
      </div>

      {editingAutomation ? (
        <AutomationEditor
          automation={editingAutomation}
          isCreating={isCreating}
          onChange={setEditingAutomation}
          onClose={() => {
            setEditingAutomation(null);
            setIsCreating(false);
          }}
          onSave={handleSaveAutomation}
        />
      ) : null}
    </main>
  );
}

function MetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#101821] p-4 shadow-xl shadow-black/20">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-300">
        {icon}
      </div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border border-white/10 bg-[#0b1118] px-3 text-sm text-white outline-none transition focus:border-emerald-400"
      >
        {children}
      </select>
    </label>
  );
}

function AutomationCard({
  automation,
  onDelete,
  onEdit,
  onSimulate,
  onToggle
}: {
  automation: Automation;
  onDelete: (automationId: string) => void;
  onEdit: (automation: Automation) => void;
  onSimulate: (automation: Automation) => void;
  onToggle: (automationId: string) => void;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#101821] p-4 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white">{automation.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{automation.description}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(automation.status)}`}>
          {statusLabels[automation.status]}
        </span>
      </div>

      <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm">
        <InfoRow label="Gatilho" value={triggerLabels[automation.trigger]} />
        <InfoRow label="Ação" value={actionLabels[automation.action]} />
        <InfoRow label="Execuções" value={String(automation.totalRuns)} />
        <InfoRow label="Última execução" value={formatDate(automation.lastRunAt)} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-black ring-1 ${
            automation.isActive ? "bg-emerald-400/10 text-emerald-200 ring-emerald-400/30" : "bg-slate-500/15 text-slate-300 ring-slate-400/30"
          }`}
        >
          {automation.isActive ? "Ligada" : "Pausada"}
        </span>
        <div className="flex flex-wrap gap-2">
          <IconButton label={automation.isActive ? "Pausar" : "Ativar"} onClick={() => onToggle(automation.id)}>
            {automation.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </IconButton>
          <IconButton label="Simular" onClick={() => onSimulate(automation)}>
            <Sparkles className="h-4 w-4" />
          </IconButton>
          <IconButton label="Editar" onClick={() => onEdit(automation)}>
            <Edit3 className="h-4 w-4" />
          </IconButton>
          <IconButton label="Excluir" danger onClick={() => onDelete(automation.id)}>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-bold text-slate-200">{value}</span>
    </div>
  );
}

function IconButton({
  children,
  danger,
  label,
  onClick
}: {
  children: ReactNode;
  danger?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-xs font-black transition ${
        danger
          ? "border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
          : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
      }`}
      aria-label={label}
      title={label}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ExecutionLogs({ logs }: { logs: AutomationLog[] }) {
  return (
    <aside className="rounded-lg border border-white/10 bg-[#101821] p-4 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-300">
            <History className="h-4 w-4" />
            Histórico
          </p>
          <h2 className="mt-2 text-xl font-black text-white">Histórico de execuções</h2>
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">{logs.length}</span>
      </div>

      <div className="max-h-[760px] space-y-3 overflow-y-auto pr-1">
        {logs.map((log) => (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3" key={log.id}>
            <div className="mb-2 flex items-start justify-between gap-3">
              <p className="font-black text-white">{log.automationName}</p>
              <span className={`rounded-full px-2 py-1 text-[11px] font-black ring-1 ${logStatusClass(log.status)}`}>
                {log.status === "success" ? "Sucesso" : log.status === "skipped" ? "Ignorada" : "Falha"}
              </span>
            </div>
            <p className="text-xs font-bold text-emerald-200">{actionLabels[log.action]}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{log.result}</p>
            <p className="mt-3 text-xs text-slate-500">{formatDate(log.executedAt)}</p>
          </div>
        ))}
        {!logs.length ? <p className="py-8 text-center text-sm text-slate-400">Nenhuma execução registrada.</p> : null}
      </div>
    </aside>
  );
}

function AutomationEditor({
  automation,
  isCreating,
  onChange,
  onClose,
  onSave
}: {
  automation: Automation;
  isCreating: boolean;
  onChange: (automation: Automation) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70">
      <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#0d141c] p-5 shadow-2xl shadow-black">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
              {isCreating ? "Novo fluxo" : "Editar fluxo"}
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">{isCreating ? "Criar automação" : automation.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
            aria-label="Fechar edição"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4">
          <EditorField label="Nome">
            <input
              value={automation.name}
              onChange={(event) => onChange({ ...automation, name: event.target.value })}
              className="field-input"
              placeholder="Nome da automação"
            />
          </EditorField>
          <EditorField label="Descrição">
            <textarea
              value={automation.description}
              onChange={(event) => onChange({ ...automation, description: event.target.value })}
              className="field-input min-h-28 resize-none py-3"
              placeholder="Explique quando e por que esse fluxo deve rodar."
            />
          </EditorField>
          <div className="grid gap-4 md:grid-cols-2">
            <EditorField label="Gatilho">
              <select
                value={automation.trigger}
                onChange={(event) => onChange({ ...automation, trigger: event.target.value as AutomationTrigger })}
                className="field-input"
              >
                {triggerOptions.map((trigger) => (
                  <option value={trigger} key={trigger}>
                    {triggerLabels[trigger]}
                  </option>
                ))}
              </select>
            </EditorField>
            <EditorField label="Ação">
              <select
                value={automation.action}
                onChange={(event) => onChange({ ...automation, action: event.target.value as AutomationAction })}
                className="field-input"
              >
                {actionOptions.map((action) => (
                  <option value={action} key={action}>
                    {actionLabels[action]}
                  </option>
                ))}
              </select>
            </EditorField>
          </div>
          <EditorField label="Status">
            <select
              value={automation.status}
              onChange={(event) => {
                const status = event.target.value as AutomationStatus;
                onChange({ ...automation, status, isActive: status === "active" ? automation.isActive : false });
              }}
              className="field-input"
            >
              {statusOptions.map((status) => (
                <option value={status} key={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </EditorField>
          <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <span>
              <span className="block font-black text-white">Automação ativa</span>
              <span className="mt-1 block text-sm text-slate-400">Fluxos em rascunho ou pausados não executam ações.</span>
            </span>
            <input
              checked={automation.isActive}
              disabled={automation.status !== "active"}
              onChange={(event) => onChange({ ...automation, isActive: event.target.checked })}
              type="checkbox"
              className="h-5 w-5 accent-emerald-400 disabled:opacity-40"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onSave}
            disabled={!automation.name.trim() || !automation.description.trim()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Salvar automação
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/10"
          >
            Cancelar
          </button>
        </div>
      </aside>
    </div>
  );
}

function EditorField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-200">
      <span className="inline-flex items-center gap-2">
        <Filter className="h-4 w-4 text-emerald-300" />
        {label}
      </span>
      {children}
    </label>
  );
}
