"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Building2,
  DollarSign,
  Edit3,
  Filter,
  LayoutGrid,
  List,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Tags,
  Trash2,
  Users,
  X
} from "lucide-react";
import type { Lead, LeadPriority, LeadSource, LeadStatus, LeadTag, PipelineStage } from "@/types/atendezap";
import { createLead, listLeads, removeLead, resetLeads, saveLeads, updateLead } from "@/utils/leadsStorage";

const statusLabels: Record<LeadStatus, string> = {
  new: "Novo",
  in_service: "Em atendimento",
  qualified: "Qualificado",
  proposal_sent: "Proposta enviada",
  closed: "Fechado",
  lost: "Perdido"
};

const sourceLabels: Record<LeadSource, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  website: "Site",
  referral: "Indicação",
  ad: "Anúncio"
};

const priorityLabels: Record<LeadPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta"
};

const tagLabels: Record<LeadTag, string> = {
  urgent: "Urgente",
  high_value: "Alto valor",
  interested: "Interessado",
  needs_follow_up: "Precisa retorno",
  cold_customer: "Cliente frio"
};

const stageLabels: Record<PipelineStage, string> = {
  new_lead: "Novo lead",
  contacted: "Contato feito",
  qualified: "Qualificado",
  proposal: "Proposta",
  negotiation: "Negociação",
  won: "Fechado",
  lost: "Perdido"
};

const statusOptions = Object.keys(statusLabels) as LeadStatus[];
const sourceOptions = Object.keys(sourceLabels) as LeadSource[];
const priorityOptions = Object.keys(priorityLabels) as LeadPriority[];
const tagOptions = Object.keys(tagLabels) as LeadTag[];
const pipelineStages = Object.keys(stageLabels) as PipelineStage[];

const emptyLead: Lead = {
  id: "",
  name: "",
  phone: "",
  email: "",
  company: "",
  source: "whatsapp",
  status: "new",
  priority: "medium",
  tags: ["interested"],
  stage: "new_lead",
  value: 0,
  notes: "",
  lastContactAt: new Date().toISOString(),
  createdAt: new Date().toISOString()
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function statusClass(status: LeadStatus) {
  if (status === "new") return "border-sky-400/30 bg-sky-400/10 text-sky-200";
  if (status === "in_service") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (status === "qualified") return "border-violet-400/30 bg-violet-400/10 text-violet-200";
  if (status === "proposal_sent") return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  if (status === "closed") return "border-teal-400/30 bg-teal-400/10 text-teal-200";
  return "border-slate-500/40 bg-slate-500/15 text-slate-300";
}

function priorityClass(priority: LeadPriority) {
  if (priority === "high") return "bg-red-500/15 text-red-200 ring-red-400/30";
  if (priority === "medium") return "bg-amber-500/15 text-amber-200 ring-amber-400/30";
  return "bg-slate-500/15 text-slate-300 ring-slate-400/30";
}

function createBlankLead() {
  const now = new Date().toISOString();
  return {
    ...emptyLead,
    id: `lead-${Date.now()}`,
    lastContactAt: now,
    createdAt: now
  };
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(() => listLeads());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | LeadSource>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | LeadPriority>("all");
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  useEffect(() => {
    saveLeads(leads);
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const search = query.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
      const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;
      const searchableText = [
        lead.name,
        lead.phone,
        lead.email || "",
        lead.company || "",
        sourceLabels[lead.source],
        statusLabels[lead.status],
        ...lead.tags.map((tag) => tagLabels[tag])
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && matchesSource && matchesPriority && (!search || searchableText.includes(search));
    });
  }, [leads, priorityFilter, query, sourceFilter, statusFilter]);

  const metrics = useMemo(() => {
    return {
      total: leads.length,
      newLeads: leads.filter((lead) => lead.status === "new").length,
      proposals: leads.filter((lead) => lead.status === "proposal_sent").length,
      totalValue: leads.reduce((sum, lead) => sum + lead.value, 0)
    };
  }, [leads]);

  function handleCreateLead() {
    setIsCreating(true);
    setEditingLead(createBlankLead());
  }

  function handleSaveLead() {
    if (!editingLead || !editingLead.name.trim() || !editingLead.phone.trim()) return;

    const normalizedLead: Lead = {
      ...editingLead,
      name: editingLead.name.trim(),
      phone: editingLead.phone.trim(),
      email: editingLead.email?.trim() || undefined,
      company: editingLead.company?.trim() || undefined,
      notes: editingLead.notes.trim(),
      value: Number.isFinite(editingLead.value) ? editingLead.value : 0,
      tags: editingLead.tags.length ? editingLead.tags : ["interested"],
      lastContactAt: new Date().toISOString()
    };

    const nextLeads = isCreating ? createLead(normalizedLead) : updateLead(normalizedLead);
    setLeads(nextLeads);
    setEditingLead(null);
    setIsCreating(false);
  }

  function handleRemoveLead(leadId: string) {
    if (!window.confirm("Excluir este lead?")) return;
    setLeads(removeLead(leadId));
    if (editingLead?.id === leadId) {
      setEditingLead(null);
      setIsCreating(false);
    }
  }

  function handleResetLeads() {
    setLeads(resetLeads());
    setEditingLead(null);
    setIsCreating(false);
  }

  function toggleTag(tag: LeadTag) {
    if (!editingLead) return;
    setEditingLead({
      ...editingLead,
      tags: editingLead.tags.includes(tag) ? editingLead.tags.filter((currentTag) => currentTag !== tag) : [...editingLead.tags, tag]
    });
  }

  return (
    <main className="min-h-screen bg-[#090d12] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 lg:px-6">
        <header className="mb-5 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Mini CRM AtendeZap IA</p>
              <h1 className="text-3xl font-black tracking-tight text-white">Clientes & Leads</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Organize oportunidades vindas do WhatsApp, Instagram, site e indicações com funil comercial local.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleResetLeads}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
              >
                <RefreshCcw className="h-4 w-4" />
                Restaurar mocks
              </button>
              <button
                type="button"
                onClick={handleCreateLead}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
              >
                <Plus className="h-4 w-4" />
                Novo lead
              </button>
            </div>
          </div>
        </header>

        <section className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={<Users className="h-5 w-5" />} label="Total de leads" value={String(metrics.total)} />
          <MetricCard icon={<Plus className="h-5 w-5" />} label="Leads novos" value={String(metrics.newLeads)} />
          <MetricCard icon={<Tags className="h-5 w-5" />} label="Propostas enviadas" value={String(metrics.proposals)} />
          <MetricCard icon={<DollarSign className="h-5 w-5" />} label="Valor potencial total" value={formatCurrency(metrics.totalValue)} />
        </section>

        <section className="mb-5 rounded-lg border border-white/10 bg-[#101821] p-4">
          <div className="grid gap-3 xl:grid-cols-[1fr_180px_180px_180px_170px]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nome, telefone, empresa ou tag"
                className="h-11 w-full rounded-md border border-white/10 bg-[#0b1118] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
              />
            </label>
            <FilterSelect label="Status" value={statusFilter} onChange={(value) => setStatusFilter(value as "all" | LeadStatus)}>
              <option value="all">Todos status</option>
              {statusOptions.map((status) => (
                <option value={status} key={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Origem" value={sourceFilter} onChange={(value) => setSourceFilter(value as "all" | LeadSource)}>
              <option value="all">Todas origens</option>
              {sourceOptions.map((source) => (
                <option value={source} key={source}>
                  {sourceLabels[source]}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Prioridade" value={priorityFilter} onChange={(value) => setPriorityFilter(value as "all" | LeadPriority)}>
              <option value="all">Todas prioridades</option>
              {priorityOptions.map((priority) => (
                <option value={priority} key={priority}>
                  {priorityLabels[priority]}
                </option>
              ))}
            </FilterSelect>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-black transition ${
                  viewMode === "table" ? "border-emerald-400 bg-emerald-400 text-slate-950" : "border-white/10 bg-white/5 text-slate-300"
                }`}
              >
                <List className="h-4 w-4" />
                Lista
              </button>
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-black transition ${
                  viewMode === "kanban" ? "border-emerald-400 bg-emerald-400 text-slate-950" : "border-white/10 bg-white/5 text-slate-300"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </button>
            </div>
          </div>
        </section>

        {viewMode === "table" ? (
          <LeadsTable leads={filteredLeads} onEdit={setEditingLead} onRemove={handleRemoveLead} />
        ) : (
          <LeadsKanban leads={filteredLeads} onEdit={setEditingLead} />
        )}
      </div>

      {editingLead ? (
        <LeadEditor
          lead={editingLead}
          isCreating={isCreating}
          onChange={setEditingLead}
          onClose={() => {
            setEditingLead(null);
            setIsCreating(false);
          }}
          onSave={handleSaveLead}
          onToggleTag={toggleTag}
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

function LeadsTable({
  leads,
  onEdit,
  onRemove
}: {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onRemove: (leadId: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#101821] shadow-2xl shadow-black/25">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Origem</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Prioridade</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Última interação</th>
              <th className="px-4 py-3">Funil</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr className="border-b border-white/10 last:border-0 hover:bg-white/[0.03]" key={lead.id}>
                <td className="px-4 py-4">
                  <div>
                    <p className="font-black text-white">{lead.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{lead.phone}</p>
                    <p className="mt-1 text-xs text-slate-500">{lead.company || "Sem empresa"}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-300">{sourceLabels[lead.source]}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(lead.status)}`}>
                    {statusLabels[lead.status]}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${priorityClass(lead.priority)}`}>
                    {priorityLabels[lead.priority]}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex max-w-[220px] flex-wrap gap-1.5">
                    {lead.tags.map((tag) => (
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] font-bold text-slate-300" key={tag}>
                        {tagLabels[tag]}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 font-bold text-emerald-200">{formatCurrency(lead.value)}</td>
                <td className="px-4 py-4 text-slate-400">{formatDate(lead.lastContactAt)}</td>
                <td className="px-4 py-4 text-slate-300">{stageLabels[lead.stage]}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(lead)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                      aria-label={`Editar ${lead.name}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(lead.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-400/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/20"
                      aria-label={`Excluir ${lead.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!leads.length ? <p className="p-8 text-center text-sm text-slate-400">Nenhum lead encontrado.</p> : null}
    </section>
  );
}

function LeadsKanban({ leads, onEdit }: { leads: Lead[]; onEdit: (lead: Lead) => void }) {
  return (
    <section className="grid gap-4 overflow-x-auto pb-4 xl:grid-cols-7">
      {pipelineStages.map((stage) => {
        const stageLeads = leads.filter((lead) => lead.stage === stage);
        const stageValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);

        return (
          <div className="min-w-[250px] rounded-lg border border-white/10 bg-[#101821] p-3" key={stage}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black text-white">{stageLabels[stage]}</h3>
                <p className="mt-1 text-xs text-slate-500">{stageLeads.length} leads</p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[11px] font-bold text-emerald-200">
                {formatCurrency(stageValue)}
              </span>
            </div>
            <div className="space-y-3">
              {stageLeads.map((lead) => (
                <button
                  type="button"
                  onClick={() => onEdit(lead)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-left transition hover:border-emerald-400/40 hover:bg-emerald-400/10"
                  key={lead.id}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <p className="font-black text-white">{lead.name}</p>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-bold ring-1 ${priorityClass(lead.priority)}`}>
                      {priorityLabels[lead.priority]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{lead.company || lead.phone}</p>
                  <p className="mt-3 font-bold text-emerald-200">{formatCurrency(lead.value)}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {lead.tags.slice(0, 2).map((tag) => (
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] font-bold text-slate-300" key={tag}>
                        {tagLabels[tag]}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function LeadEditor({
  lead,
  isCreating,
  onChange,
  onClose,
  onSave,
  onToggleTag
}: {
  lead: Lead;
  isCreating: boolean;
  onChange: (lead: Lead) => void;
  onClose: () => void;
  onSave: () => void;
  onToggleTag: (tag: LeadTag) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70">
      <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#0d141c] p-5 shadow-2xl shadow-black">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
              {isCreating ? "Novo registro" : "Editar lead"}
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">{isCreating ? "Criar lead" : lead.name}</h2>
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
              value={lead.name}
              onChange={(event) => onChange({ ...lead, name: event.target.value })}
              className="field-input"
              placeholder="Nome do lead"
            />
          </EditorField>
          <EditorField label="Telefone">
            <input
              value={lead.phone}
              onChange={(event) => onChange({ ...lead, phone: event.target.value })}
              className="field-input"
              placeholder="WhatsApp ou telefone"
            />
          </EditorField>
          <div className="grid gap-4 md:grid-cols-2">
            <EditorField label="E-mail">
              <input
                value={lead.email || ""}
                onChange={(event) => onChange({ ...lead, email: event.target.value })}
                className="field-input"
                placeholder="email@empresa.com"
              />
            </EditorField>
            <EditorField label="Empresa">
              <input
                value={lead.company || ""}
                onChange={(event) => onChange({ ...lead, company: event.target.value })}
                className="field-input"
                placeholder="Empresa ou negócio"
              />
            </EditorField>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <EditorField label="Origem">
              <select value={lead.source} onChange={(event) => onChange({ ...lead, source: event.target.value as LeadSource })} className="field-input">
                {sourceOptions.map((source) => (
                  <option value={source} key={source}>
                    {sourceLabels[source]}
                  </option>
                ))}
              </select>
            </EditorField>
            <EditorField label="Status">
              <select value={lead.status} onChange={(event) => onChange({ ...lead, status: event.target.value as LeadStatus })} className="field-input">
                {statusOptions.map((status) => (
                  <option value={status} key={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </EditorField>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <EditorField label="Prioridade">
              <select
                value={lead.priority}
                onChange={(event) => onChange({ ...lead, priority: event.target.value as LeadPriority })}
                className="field-input"
              >
                {priorityOptions.map((priority) => (
                  <option value={priority} key={priority}>
                    {priorityLabels[priority]}
                  </option>
                ))}
              </select>
            </EditorField>
            <EditorField label="Etapa do funil">
              <select value={lead.stage} onChange={(event) => onChange({ ...lead, stage: event.target.value as PipelineStage })} className="field-input">
                {pipelineStages.map((stage) => (
                  <option value={stage} key={stage}>
                    {stageLabels[stage]}
                  </option>
                ))}
              </select>
            </EditorField>
          </div>
          <EditorField label="Valor potencial">
            <input
              value={lead.value}
              onChange={(event) => onChange({ ...lead, value: Number(event.target.value) })}
              className="field-input"
              type="number"
              min="0"
              step="10"
            />
          </EditorField>
          <EditorField label="Tags">
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => {
                const active = lead.tags.includes(tag);
                return (
                  <button
                    type="button"
                    onClick={() => onToggleTag(tag)}
                    className={`rounded-full border px-3 py-2 text-xs font-black transition ${
                      active
                        ? "border-emerald-400 bg-emerald-400 text-slate-950"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                    key={tag}
                  >
                    {tagLabels[tag]}
                  </button>
                );
              })}
            </div>
          </EditorField>
          <EditorField label="Observações">
            <textarea
              value={lead.notes}
              onChange={(event) => onChange({ ...lead, notes: event.target.value })}
              className="field-input min-h-28 resize-none py-3"
              placeholder="Contexto do atendimento, objeções, próximos passos..."
            />
          </EditorField>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onSave}
            disabled={!lead.name.trim() || !lead.phone.trim()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Salvar lead
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
        <Building2 className="h-4 w-4 text-emerald-300" />
        {label}
      </span>
      {children}
    </label>
  );
}
