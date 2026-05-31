"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AlertTriangle, ClipboardList, Lightbulb, MessageSquare, Pencil, Plus, Save } from "lucide-react";
import {
  productInsightImpactAreaLabel,
  productInsightImpactAreas,
  productInsightSeverityLabel,
  productInsightSeverities,
  productInsightStatusLabel,
  productInsightStatuses,
  productInsightTypeLabel,
  productInsightTypes,
  type ProductInsight,
  type ProductInsightImpactArea,
  type ProductInsightSeverity,
  type ProductInsightStatus,
  type ProductInsightSummary,
  type ProductInsightType
} from "@/lib/product-insights";
import { supabase } from "@/lib/supabase/browser";

type SupportInsightSource = {
  id: string;
  category: string;
  subject: string;
  status: string;
};

type FeedbackInsightSource = {
  id: string;
  type: string;
  page: string | null;
  campaign: string | null;
  created_at: string;
};

type ProductInsightsPayload = {
  insights: ProductInsight[];
  summary: ProductInsightSummary;
  diagnostics: string[];
  error?: string;
};

type InsightForm = {
  source: string;
  type: ProductInsightType;
  category: string;
  title: string;
  description: string;
  severity: ProductInsightSeverity;
  status: ProductInsightStatus;
  impact_area: "" | ProductInsightImpactArea;
  user_id: string;
  related_support_request_id: string;
  related_campaign_id: string;
  related_feedback_id: string;
  admin_notes: string;
};

type InsightFilters = {
  type: string;
  severity: string;
  status: string;
  impact_area: string;
};

type QuickInsightSource = {
  key: string;
  label: string;
  form: InsightForm;
};

const emptyFilters: InsightFilters = {
  type: "",
  severity: "",
  status: "",
  impact_area: ""
};

const emptyInsightForm: InsightForm = {
  source: "manual",
  type: "improvement",
  category: "",
  title: "",
  description: "",
  severity: "medium",
  status: "new",
  impact_area: "",
  user_id: "",
  related_support_request_id: "",
  related_campaign_id: "",
  related_feedback_id: "",
  admin_notes: ""
};

function toPayload(form: InsightForm) {
  return {
    source: form.source,
    type: form.type,
    category: form.category,
    title: form.title,
    description: form.description || null,
    severity: form.severity,
    status: form.status,
    impact_area: form.impact_area || null,
    user_id: form.user_id || null,
    related_support_request_id: form.related_support_request_id || null,
    related_campaign_id: form.related_campaign_id || null,
    related_feedback_id: form.related_feedback_id || null,
    admin_notes: form.admin_notes || null
  };
}

function formFromInsight(insight: ProductInsight): InsightForm {
  return {
    source: insight.source,
    type: insight.type,
    category: insight.category,
    title: insight.title,
    description: insight.description || "",
    severity: insight.severity,
    status: insight.status,
    impact_area: insight.impact_area || "",
    user_id: insight.user_id || "",
    related_support_request_id: insight.related_support_request_id || "",
    related_campaign_id: insight.related_campaign_id || "",
    related_feedback_id: insight.related_feedback_id || "",
    admin_notes: insight.admin_notes || ""
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

export default function ProductInsightsSection({
  supportRequests = [],
  feedback = [],
  aiNegativeCount = 0,
  churnFeedbackCount = 0
}: {
  supportRequests?: SupportInsightSource[];
  feedback?: FeedbackInsightSource[];
  aiNegativeCount?: number;
  churnFeedbackCount?: number;
}) {
  const [payload, setPayload] = useState<ProductInsightsPayload | null>(null);
  const [form, setForm] = useState<InsightForm>(emptyInsightForm);
  const [filters, setFilters] = useState<InsightFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<InsightFilters>(emptyFilters);
  const [editingInsightId, setEditingInsightId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadInsights = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setError("Faça login com um e-mail administrador para carregar insights.");
        return;
      }

      const params = new URLSearchParams();
      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const response = await fetch(`/api/admin/product-insights?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = (await response.json().catch(() => ({}))) as ProductInsightsPayload;

      if (!response.ok) {
        setError(data.error || "Não foi possível carregar insights.");
        return;
      }

      setPayload(data);
    } catch {
      setError("Não foi possível carregar insights agora.");
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadInsights();
    });
  }, [loadInsights]);

  const summary = payload?.summary || {
    totalNew: 0,
    criticalBugs: 0,
    onboardingIssues: 0,
    aiIssues: 0,
    featureRequests: 0,
    billingIssues: 0,
    churnReasons: 0,
    campaignLearnings: 0
  };

  const quickSources = useMemo(() => {
    const supportItems: QuickInsightSource[] = supportRequests.slice(0, 3).map((item) => ({
      key: `support-${item.id}`,
      label: `Suporte: ${item.subject}`,
      form: {
        ...emptyInsightForm,
        source: "support",
        type: item.category.toLowerCase().includes("bug") ? "bug" : "question",
        category: item.category || "Suporte",
        title: item.subject || "Solicitação de suporte",
        description: "Insight criado a partir de solicitação de suporte. Consultar o admin para detalhes, sem copiar mensagem completa.",
        severity: item.category.toLowerCase().includes("bug") ? "high" : "medium",
        impact_area: "support",
        related_support_request_id: item.id
      } satisfies InsightForm
    }));
    const feedbackItems: QuickInsightSource[] = feedback.slice(0, 3).map((item) => ({
      key: `feedback-${item.id}`,
      label: `Feedback: ${item.type}`,
      form: {
        ...emptyInsightForm,
        source: "feedback",
        type: item.type === "bug" ? "bug" : item.type === "dificuldade_uso" ? "complaint" : "improvement",
        category: item.type || "Feedback",
        title: `Feedback ${item.type} em ${formatDate(item.created_at)}`,
        description: "Insight criado a partir de feedback de usuário. Não copiar conteúdo completo para o backlog.",
        severity: item.type === "bug" ? "high" : "medium",
        impact_area: item.type === "dificuldade_uso" ? "usability" : "support",
        related_feedback_id: item.id
      } satisfies InsightForm
    }));
    const aggregateItems = [
      aiNegativeCount > 0
        ? {
            key: "ai-quality",
            label: "Feedback negativo de IA",
            form: {
              ...emptyInsightForm,
              source: "ai_feedback",
              type: "ai_quality",
              category: "Qualidade da IA",
              title: "Feedbacks negativos de IA para revisar",
              description: "Insight criado a partir de feedbacks negativos agregados de IA.",
              severity: "high",
              impact_area: "ai_quality"
            } satisfies InsightForm
          }
        : null,
      churnFeedbackCount > 0
        ? {
            key: "churn",
            label: "Motivos de churn",
            form: {
              ...emptyInsightForm,
              source: "cancellation_feedback",
              type: "churn_reason",
              category: "Cancelamento",
              title: "Motivos de cancelamento para revisar",
              description: "Insight criado a partir de motivos de cancelamento agregados.",
              severity: "high",
              impact_area: "retention"
            } satisfies InsightForm
          }
        : null
    ].filter(Boolean) as QuickInsightSource[];

    return [...supportItems, ...feedbackItems, ...aggregateItems];
  }, [aiNegativeCount, churnFeedbackCount, feedback, supportRequests]);

  function applyQuickSource(nextForm: InsightForm) {
    setEditingInsightId("");
    setForm(nextForm);
    setMessage("Revise o insight sugerido e salve quando fizer sentido.");
  }

  async function submitInsight(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setError("Faça login com um e-mail administrador para salvar insights.");
        return;
      }

      const response = await fetch(editingInsightId ? `/api/admin/product-insights/${editingInsightId}` : "/api/admin/product-insights", {
        method: editingInsightId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(toPayload(form))
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(result.error || "Não foi possível salvar o insight.");
        return;
      }

      setMessage(editingInsightId ? "Insight atualizado." : "Insight criado.");
      setForm(emptyInsightForm);
      setEditingInsightId("");
      await loadInsights();
    } catch {
      setError("Não foi possível salvar o insight agora.");
    } finally {
      setSaving(false);
    }
  }

  function startEditing(insight: ProductInsight) {
    setEditingInsightId(insight.id);
    setForm(formFromInsight(insight));
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedFilters(filters);
  }

  return (
    <section className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Insights</p>
          <h2 className="mt-2 text-2xl font-black text-white">Insights de Produto</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Triagem simples para transformar feedbacks, suporte, churn e aprendizados de campanha em prioridades reais, sem CRM e sem dados sensíveis.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadInsights()}
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-slate-950 hover:bg-slate-100 disabled:opacity-60"
        >
          <ClipboardList className="h-4 w-4" />
          Atualizar insights
        </button>
      </div>

      {error ? <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm font-bold text-red-200">{error}</div> : null}
      {message ? <div className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-100">{message}</div> : null}

      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard label="Novos" value={summary.totalNew} />
        <InsightCard label="Bugs críticos" value={summary.criticalBugs} />
        <InsightCard label="Onboarding" value={summary.onboardingIssues} />
        <InsightCard label="Problemas de IA" value={summary.aiIssues} />
        <InsightCard label="Pedidos de funcionalidade" value={summary.featureRequests} />
        <InsightCard label="Cobrança" value={summary.billingIssues} />
        <InsightCard label="Motivos de churn" value={summary.churnReasons} />
        <InsightCard label="Aprendizados de campanha" value={summary.campaignLearnings} />
      </div>

      <div className="mb-5 rounded-lg border border-amber-400/20 bg-amber-400/10 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-amber-100">Diagnóstico simples</p>
        <ul className="mt-2 grid gap-1 text-sm font-bold leading-6 text-amber-50/90">
          {(payload?.diagnostics || ["Sem padrão recorrente suficiente para prioridade automática."]).map((diagnostic) => (
            <li key={diagnostic}>{diagnostic}</li>
          ))}
        </ul>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-4">
          <form onSubmit={submitInsight} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Cadastro</p>
                <h3 className="text-lg font-black text-white">{editingInsightId ? "Editar insight" : "Novo insight"}</h3>
              </div>
              {editingInsightId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingInsightId("");
                    setForm(emptyInsightForm);
                  }}
                  className="rounded-md border border-white/10 px-3 py-2 text-xs font-black text-slate-200 hover:bg-white/10"
                >
                  Cancelar edição
                </button>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <TextInput label="Título" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} required />
              <TextInput label="Categoria" value={form.category} onChange={(value) => setForm((current) => ({ ...current, category: value }))} required />
              <TextInput label="Fonte" value={form.source} onChange={(value) => setForm((current) => ({ ...current, source: value }))} required />
              <SelectInput label="Tipo" value={form.type} onChange={(value) => setForm((current) => ({ ...current, type: value as ProductInsightType }))} options={productInsightTypes} formatter={productInsightTypeLabel} />
              <SelectInput label="Severidade" value={form.severity} onChange={(value) => setForm((current) => ({ ...current, severity: value as ProductInsightSeverity }))} options={productInsightSeverities} formatter={productInsightSeverityLabel} />
              <SelectInput label="Status" value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value as ProductInsightStatus }))} options={productInsightStatuses} formatter={productInsightStatusLabel} />
              <SelectInput label="Área de impacto" value={form.impact_area} onChange={(value) => setForm((current) => ({ ...current, impact_area: value as InsightForm["impact_area"] }))} options={productInsightImpactAreas} formatter={productInsightImpactAreaLabel} emptyLabel="Não informado" />
            </div>

            <label className="mt-3 grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
              Descrição
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="field-input min-h-20 resize-none py-3 normal-case"
                maxLength={1800}
                placeholder="Resumo do aprendizado. Não cole conversa completa, resposta completa, e-mail, pagamento ou secrets."
              />
            </label>
            <label className="mt-3 grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
              Notas internas
              <textarea
                value={form.admin_notes}
                onChange={(event) => setForm((current) => ({ ...current, admin_notes: event.target.value }))}
                className="field-input min-h-20 resize-none py-3 normal-case"
                maxLength={1800}
                placeholder="Próxima ação, decisão ou contexto operacional sem dados sensíveis."
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300 disabled:opacity-60"
            >
              {editingInsightId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {saving ? "Salvando..." : editingInsightId ? "Salvar insight" : "Criar insight"}
            </button>
          </form>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Criar a partir de fonte existente</p>
            <div className="mt-3 grid gap-2">
              {quickSources.length ? (
                quickSources.map((item) => (
                  <button
                    type="button"
                    onClick={() => applyQuickSource(item.form)}
                    className="inline-flex min-h-10 items-center justify-start gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-left text-xs font-black text-slate-100 hover:bg-white/10"
                    key={item.key}
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-emerald-200" />
                    {item.label}
                  </button>
                ))
              ) : (
                <p className="rounded-md border border-dashed border-white/15 bg-[#0b1118] p-4 text-sm font-bold text-slate-400">
                  Sem fontes recentes para sugerir insight. Use o formulário manual.
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={applyFilters} className="mb-4 grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 md:grid-cols-2 xl:grid-cols-4">
            <SelectInput label="Tipo" value={filters.type} onChange={(value) => setFilters((current) => ({ ...current, type: value }))} options={productInsightTypes} formatter={productInsightTypeLabel} emptyLabel="Todos" />
            <SelectInput label="Severidade" value={filters.severity} onChange={(value) => setFilters((current) => ({ ...current, severity: value }))} options={productInsightSeverities} formatter={productInsightSeverityLabel} emptyLabel="Todas" />
            <SelectInput label="Status" value={filters.status} onChange={(value) => setFilters((current) => ({ ...current, status: value }))} options={productInsightStatuses} formatter={productInsightStatusLabel} emptyLabel="Todos" />
            <SelectInput label="Impacto" value={filters.impact_area} onChange={(value) => setFilters((current) => ({ ...current, impact_area: value }))} options={productInsightImpactAreas} formatter={productInsightImpactAreaLabel} emptyLabel="Todos" />
            <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-slate-950 hover:bg-slate-100 md:col-span-2 xl:col-span-4">
              Filtrar insights
            </button>
          </form>

          <div className="grid gap-3">
            {loading ? (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center text-sm font-bold text-slate-300">Carregando insights...</div>
            ) : payload?.insights.length ? (
              payload.insights.map((insight) => (
                <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={insight.id}>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">{productInsightTypeLabel(insight.type)}</span>
                        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black text-slate-200">{productInsightSeverityLabel(insight.severity)}</span>
                        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black text-slate-200">{productInsightStatusLabel(insight.status)}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-black text-white">{insight.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{insight.category} · {productInsightImpactAreaLabel(insight.impact_area)} · fonte: {insight.source}</p>
                      {insight.description ? <p className="mt-3 text-sm leading-6 text-slate-300">{insight.description}</p> : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => startEditing(insight)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-xs font-black text-slate-100 hover:bg-white/10"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center text-sm text-slate-400">
                <MessageSquare className="mx-auto mb-4 h-8 w-8 text-slate-500" />
                <p className="font-bold text-slate-200">Nenhum insight encontrado.</p>
                <p className="mt-2">Registre aprendizados de suporte, feedback, churn ou campanhas quando houver sinal recorrente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-400 text-slate-950">
        {value > 0 ? <AlertTriangle className="h-4 w-4" /> : <ClipboardList className="h-4 w-4" />}
      </div>
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </article>
  );
}

function TextInput({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} required={required} className="field-input" />
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  emptyLabel,
  formatter
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  emptyLabel?: string;
  formatter?: (value: string) => string;
}) {
  return (
    <label className="grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="field-input">
        {emptyLabel ? <option value="">{emptyLabel}</option> : null}
        {options.map((option) => (
          <option value={option} key={option}>
            {formatter ? formatter(option) : option}
          </option>
        ))}
      </select>
    </label>
  );
}
