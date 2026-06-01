"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { BarChart3, Megaphone, Pencil, Plus, Save, Target } from "lucide-react";
import {
  campaignChannels,
  campaignDecisionLabel,
  campaignDecisions,
  campaignNiches,
  campaignStatusLabel,
  campaignStatuses,
  type CampaignDecision,
  type CampaignStatus,
  type CampaignWithResults
} from "@/lib/campaigns";
import { supabase } from "@/lib/supabase/browser";

type SummaryRow = {
  label: string;
  campaigns: number;
  leads: number;
  signups: number;
  first_responses: number;
  checkouts: number;
  subscriptions: number;
  spend_amount: number;
  cost_per_lead: number | null;
  cost_per_subscription: number | null;
};

type CampaignsPayload = {
  campaigns: CampaignWithResults[];
  nicheSummary: SummaryRow[];
  channelSummary: SummaryRow[];
  error?: string;
};

type CampaignDiagnosisSummary = {
  bestSignal: string;
  worstSignal: string;
  mainBottleneck: string;
  recommendedDecision: string;
  nextAction: string;
};

type CampaignForm = {
  name: string;
  niche: string;
  channel: string;
  objective: string;
  destination_url: string;
  utm_campaign: string;
  utm_content: string;
  cta: string;
  budget_amount: string;
  currency: string;
  start_date: string;
  end_date: string;
  status: CampaignStatus;
  notes: string;
  decision: "" | CampaignDecision;
};

type ResultForm = {
  visitors: string;
  clicks: string;
  leads: string;
  signups: string;
  onboardings: string;
  first_responses: string;
  saved_responses: string;
  checkouts: string;
  subscriptions: string;
  spend_amount: string;
  recorded_at: string;
  notes: string;
};

const emptyCampaignForm: CampaignForm = {
  name: "",
  niche: "",
  channel: "Meta Ads",
  objective: "",
  destination_url: "",
  utm_campaign: "",
  utm_content: "",
  cta: "",
  budget_amount: "",
  currency: "BRL",
  start_date: "",
  end_date: "",
  status: "planned",
  notes: "",
  decision: ""
};

const emptyResultForm: ResultForm = {
  visitors: "",
  clicks: "",
  leads: "",
  signups: "",
  onboardings: "",
  first_responses: "",
  saved_responses: "",
  checkouts: "",
  subscriptions: "",
  spend_amount: "",
  recorded_at: new Date().toISOString().slice(0, 10),
  notes: ""
};

function notInformed(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "Não informado";
  return value;
}

function money(value: number | null | undefined, currency = "BRL") {
  if (value === null || value === undefined) return "Não informado";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
}

function toPayload(form: CampaignForm) {
  return {
    ...form,
    niche: form.niche || null,
    destination_url: form.destination_url || null,
    utm_campaign: form.utm_campaign || null,
    utm_content: form.utm_content || null,
    cta: form.cta || null,
    budget_amount: form.budget_amount || null,
    start_date: form.start_date || null,
    end_date: form.end_date || null,
    notes: form.notes || null,
    decision: form.decision || null
  };
}

function toResultPayload(form: ResultForm) {
  return {
    visitors: form.visitors || null,
    clicks: form.clicks || null,
    leads: form.leads || null,
    signups: form.signups || null,
    onboardings: form.onboardings || null,
    first_responses: form.first_responses || null,
    saved_responses: form.saved_responses || null,
    checkouts: form.checkouts || null,
    subscriptions: form.subscriptions || null,
    spend_amount: form.spend_amount || null,
    recorded_at: form.recorded_at ? new Date(`${form.recorded_at}T12:00:00.000Z`).toISOString() : null,
    notes: form.notes || null
  };
}

function formFromCampaign(campaign: CampaignWithResults): CampaignForm {
  return {
    name: campaign.name,
    niche: campaign.niche || "",
    channel: campaign.channel,
    objective: campaign.objective,
    destination_url: campaign.destination_url || "",
    utm_campaign: campaign.utm_campaign || "",
    utm_content: campaign.utm_content || "",
    cta: campaign.cta || "",
    budget_amount: campaign.budget_amount === null ? "" : String(campaign.budget_amount),
    currency: campaign.currency,
    start_date: campaign.start_date || "",
    end_date: campaign.end_date || "",
    status: campaign.status,
    notes: campaign.notes || "",
    decision: campaign.decision || ""
  };
}

function getCampaignSignalScore(campaign: CampaignWithResults) {
  const totals = campaign.totals;

  return (
    totals.subscriptions * 100 +
    totals.checkouts * 40 +
    totals.first_responses * 20 +
    totals.onboardings * 12 +
    totals.signups * 8 +
    totals.leads * 3 +
    totals.clicks
  );
}

function hasCampaignData(campaign: CampaignWithResults) {
  const totals = campaign.totals;
  return Boolean(
    totals.visitors ||
      totals.clicks ||
      totals.leads ||
      totals.signups ||
      totals.onboardings ||
      totals.first_responses ||
      totals.saved_responses ||
      totals.checkouts ||
      totals.subscriptions ||
      totals.spend_amount
  );
}

function getCampaignBottleneck(campaign: CampaignWithResults) {
  const totals = campaign.totals;

  if (!hasCampaignData(campaign)) return "Sem dados suficientes para recomendacao.";
  if (totals.visitors >= 50 && totals.clicks < Math.max(5, Math.ceil(totals.visitors * 0.08))) return "Visitantes nao clicam no CTA.";
  if (totals.clicks >= 20 && totals.leads < Math.max(3, Math.ceil(totals.clicks * 0.15))) return "Cliques nao viram leads.";
  if (totals.leads >= 10 && totals.signups < Math.max(2, Math.ceil(totals.leads * 0.2))) return "Leads nao viram cadastros.";
  if (totals.signups >= 5 && totals.onboardings < Math.max(1, Math.ceil(totals.signups * 0.4))) return "Cadastros nao concluem onboarding.";
  if (totals.onboardings >= 5 && totals.first_responses < Math.max(1, Math.ceil(totals.onboardings * 0.5))) return "Onboarding nao leva a primeira resposta.";
  if (totals.first_responses >= 5 && totals.checkouts < Math.max(1, Math.ceil(totals.first_responses * 0.2))) return "Uso nao vira checkout.";
  if (totals.checkouts >= 3 && totals.subscriptions < Math.max(1, Math.ceil(totals.checkouts * 0.3))) return "Checkout nao vira assinatura.";

  return "Sem gargalo claro com os dados agregados atuais.";
}

function getCampaignDiagnosisSummary(campaigns: CampaignWithResults[]): CampaignDiagnosisSummary {
  const campaignsWithData = campaigns.filter(hasCampaignData);

  if (!campaignsWithData.length) {
    return {
      bestSignal: "Sem dados suficientes para recomendacao.",
      worstSignal: "Sem dados suficientes para recomendacao.",
      mainBottleneck: "Sem dados suficientes para recomendacao.",
      recommendedDecision: "Inconclusivo: manter baixo orcamento ou pausar ate preencher resultados agregados.",
      nextAction: "Registrar visitantes, cliques, leads, cadastros, onboarding, primeiras respostas, checkouts e assinaturas."
    };
  }

  const ranked = [...campaignsWithData].sort((a, b) => getCampaignSignalScore(b) - getCampaignSignalScore(a));
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];
  const bottleneck = getCampaignBottleneck(best);

  if (best.totals.subscriptions > 0 && best.totals.first_responses > 0) {
    return {
      bestSignal: best.name,
      worstSignal: worst.name,
      mainBottleneck: bottleneck,
      recommendedDecision: "Manter campanha pequena e considerar escala cautelosa somente com tracking, checkout e suporte estaveis.",
      nextAction: "Repetir a melhor variacao com baixo aumento e criterio de pausa ativo."
    };
  }

  if (best.totals.first_responses > 0 || best.totals.checkouts > 0) {
    return {
      bestSignal: best.name,
      worstSignal: worst.name,
      mainBottleneck: bottleneck,
      recommendedDecision: "Ajustar antes de escalar.",
      nextAction: "Melhorar a etapa do maior gargalo e repetir uma variacao pequena."
    };
  }

  return {
    bestSignal: best.name,
    worstSignal: worst.name,
    mainBottleneck: bottleneck,
    recommendedDecision: "Nao escalar: sinal ainda fraco ou incompleto.",
    nextAction: "Ajustar copy, destino ou onboarding conforme o gargalo e manter baixo orcamento."
  };
}

export default function CampaignAdminSection() {
  const [payload, setPayload] = useState<CampaignsPayload | null>(null);
  const [campaignForm, setCampaignForm] = useState<CampaignForm>(emptyCampaignForm);
  const [resultForm, setResultForm] = useState<ResultForm>(emptyResultForm);
  const [editingCampaignId, setEditingCampaignId] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingCampaign, setSavingCampaign] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setError("Faça login com um e-mail administrador para carregar campanhas.");
        return;
      }

      const response = await fetch("/api/admin/campaigns", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = (await response.json().catch(() => ({}))) as CampaignsPayload;

      if (!response.ok) {
        setError(data.error || "Não foi possível carregar campanhas.");
        return;
      }

      setPayload(data);
      setSelectedCampaignId((current) => current || data.campaigns[0]?.id || "");
    } catch {
      setError("Não foi possível carregar campanhas agora.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadCampaigns();
    });
  }, [loadCampaigns]);

  const selectedCampaign = useMemo(
    () => payload?.campaigns.find((campaign) => campaign.id === selectedCampaignId) || null,
    [payload, selectedCampaignId]
  );

  const campaignDiagnosis = useMemo(
    () => getCampaignDiagnosisSummary(payload?.campaigns || []),
    [payload]
  );

  async function submitCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingCampaign(true);
    setError("");
    setMessage("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setError("Faça login com um e-mail administrador para salvar campanhas.");
        return;
      }

      const response = await fetch(editingCampaignId ? `/api/admin/campaigns/${editingCampaignId}` : "/api/admin/campaigns", {
        method: editingCampaignId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(toPayload(campaignForm))
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(result.error || "Não foi possível salvar a campanha.");
        return;
      }

      setMessage(editingCampaignId ? "Campanha atualizada." : "Campanha criada.");
      setCampaignForm(emptyCampaignForm);
      setEditingCampaignId("");
      await loadCampaigns();
    } catch {
      setError("Não foi possível salvar a campanha agora.");
    } finally {
      setSavingCampaign(false);
    }
  }

  async function submitResult(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCampaignId) {
      setError("Selecione uma campanha para registrar resultado.");
      return;
    }

    setSavingResult(true);
    setError("");
    setMessage("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setError("Faça login com um e-mail administrador para salvar resultados.");
        return;
      }

      const response = await fetch(`/api/admin/campaigns/${selectedCampaignId}/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(toResultPayload(resultForm))
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(result.error || "Não foi possível registrar o resultado.");
        return;
      }

      setMessage("Resultado registrado.");
      setResultForm(emptyResultForm);
      await loadCampaigns();
    } catch {
      setError("Não foi possível registrar o resultado agora.");
    } finally {
      setSavingResult(false);
    }
  }

  function startEditing(campaign: CampaignWithResults) {
    setEditingCampaignId(campaign.id);
    setSelectedCampaignId(campaign.id);
    setCampaignForm(formFromCampaign(campaign));
  }

  return (
    <section className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Campanhas</p>
          <h2 className="mt-2 text-2xl font-black text-white">Registro interno de campanhas</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Controle manual de campanhas, criativos, UTMs e resultados agregados. Não integra com plataformas de anúncio e não armazena dados pessoais.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadCampaigns()}
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-slate-950 hover:bg-slate-100 disabled:opacity-60"
        >
          <BarChart3 className="h-4 w-4" />
          Atualizar campanhas
        </button>
      </div>

      {error ? <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm font-bold text-red-200">{error}</div> : null}
      {message ? <div className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-100">{message}</div> : null}

      <div className="mb-5 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-100">Diagnostico da campanha</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <Info label="Melhor sinal" value={campaignDiagnosis.bestSignal} />
          <Info label="Pior sinal" value={campaignDiagnosis.worstSignal} />
          <Info label="Maior gargalo" value={campaignDiagnosis.mainBottleneck} />
          <Info label="Decisao recomendada" value={campaignDiagnosis.recommendedDecision} />
          <Info label="Proxima acao" value={campaignDiagnosis.nextAction} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={submitCampaign} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Cadastro</p>
              <h3 className="text-lg font-black text-white">{editingCampaignId ? "Editar campanha" : "Nova campanha"}</h3>
            </div>
            {editingCampaignId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingCampaignId("");
                  setCampaignForm(emptyCampaignForm);
                }}
                className="rounded-md border border-white/10 px-3 py-2 text-xs font-black text-slate-200 hover:bg-white/10"
              >
                Cancelar edição
              </button>
            ) : null}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <TextInput label="Nome" value={campaignForm.name} onChange={(value) => setCampaignForm((current) => ({ ...current, name: value }))} required />
            <SelectInput label="Nicho" value={campaignForm.niche} onChange={(value) => setCampaignForm((current) => ({ ...current, niche: value }))} options={campaignNiches} emptyLabel="Não informado" />
            <SelectInput label="Canal" value={campaignForm.channel} onChange={(value) => setCampaignForm((current) => ({ ...current, channel: value }))} options={campaignChannels} />
            <TextInput label="Objetivo" value={campaignForm.objective} onChange={(value) => setCampaignForm((current) => ({ ...current, objective: value }))} required />
            <TextInput label="URL de destino" value={campaignForm.destination_url} onChange={(value) => setCampaignForm((current) => ({ ...current, destination_url: value }))} />
            <TextInput label="utm_campaign" value={campaignForm.utm_campaign} onChange={(value) => setCampaignForm((current) => ({ ...current, utm_campaign: value }))} />
            <TextInput label="utm_content" value={campaignForm.utm_content} onChange={(value) => setCampaignForm((current) => ({ ...current, utm_content: value }))} />
            <TextInput label="CTA" value={campaignForm.cta} onChange={(value) => setCampaignForm((current) => ({ ...current, cta: value }))} />
            <TextInput label="Orçamento" type="number" value={campaignForm.budget_amount} onChange={(value) => setCampaignForm((current) => ({ ...current, budget_amount: value }))} />
            <TextInput label="Moeda" value={campaignForm.currency} onChange={(value) => setCampaignForm((current) => ({ ...current, currency: value.toUpperCase().slice(0, 3) }))} />
            <TextInput label="Data inicial" type="date" value={campaignForm.start_date} onChange={(value) => setCampaignForm((current) => ({ ...current, start_date: value }))} />
            <TextInput label="Data final" type="date" value={campaignForm.end_date} onChange={(value) => setCampaignForm((current) => ({ ...current, end_date: value }))} />
            <SelectInput label="Status" value={campaignForm.status} onChange={(value) => setCampaignForm((current) => ({ ...current, status: value as CampaignStatus }))} options={campaignStatuses} formatter={campaignStatusLabel} />
            <SelectInput label="Decisão final" value={campaignForm.decision} onChange={(value) => setCampaignForm((current) => ({ ...current, decision: value as CampaignForm["decision"] }))} options={campaignDecisions} formatter={campaignDecisionLabel} emptyLabel="Não informado" />
          </div>

          <label className="mt-3 grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
            Notas
            <textarea
              value={campaignForm.notes}
              onChange={(event) => setCampaignForm((current) => ({ ...current, notes: event.target.value }))}
              className="field-input min-h-24 resize-none py-3 normal-case"
              maxLength={1500}
              placeholder="Notas agregadas: hipotese validada, principal gargalo e proxima acao. Nao registre dados pessoais, pagamento, secrets ou respostas completas."
            />
          </label>

          <button
            type="submit"
            disabled={savingCampaign}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300 disabled:opacity-60"
          >
            {editingCampaignId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {savingCampaign ? "Salvando..." : editingCampaignId ? "Salvar campanha" : "Criar campanha"}
          </button>
        </form>

        <div className="grid gap-4">
          {loading ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center text-sm font-bold text-slate-300">Carregando campanhas...</div>
          ) : payload?.campaigns.length ? (
            payload.campaigns.map((campaign) => (
              <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={campaign.id}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">{campaignStatusLabel(campaign.status)}</span>
                      <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black text-slate-200">{campaignDecisionLabel(campaign.decision)}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-black text-white">{campaign.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{campaign.channel} · {notInformed(campaign.niche)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(campaign)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-xs font-black text-slate-100 hover:bg-white/10"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCampaignId(campaign.id)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-white px-3 text-xs font-black text-slate-950 hover:bg-slate-100"
                    >
                      <Target className="h-3.5 w-3.5" />
                      Registrar resultado
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
                  <Info label="Orçamento" value={money(campaign.budget_amount, campaign.currency)} />
                  <Info label="Visitantes" value={campaign.totals.visitors || "Não informado"} />
                  <Info label="Leads" value={campaign.totals.leads || "Não informado"} />
                  <Info label="Cadastros" value={campaign.totals.signups || "Não informado"} />
                  <Info label="Primeiras respostas" value={campaign.totals.first_responses || "Não informado"} />
                  <Info label="Checkouts" value={campaign.totals.checkouts || "Não informado"} />
                  <Info label="Assinaturas" value={campaign.totals.subscriptions || "Não informado"} />
                  <Info label="Custo por lead" value={money(campaign.totals.cost_per_lead, campaign.currency)} />
                  <Info label="Custo por cadastro" value={money(campaign.totals.cost_per_signup, campaign.currency)} />
                  <Info label="Custo por assinatura" value={money(campaign.totals.cost_per_subscription, campaign.currency)} />
                  <Info label="utm_campaign" value={notInformed(campaign.utm_campaign)} />
                  <Info label="utm_content" value={notInformed(campaign.utm_content)} />
                </div>

                <div className="mt-4 rounded-md border border-amber-400/20 bg-amber-400/10 p-3">
                  <p className="text-xs font-black uppercase tracking-wide text-amber-100">Diagnóstico simples</p>
                  <ul className="mt-2 grid gap-1 text-sm font-bold leading-6 text-amber-50/90">
                    {campaign.diagnostics.map((diagnostic) => (
                      <li key={diagnostic}>{diagnostic}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] p-8 text-center text-sm text-slate-400">
              <Megaphone className="mx-auto mb-4 h-8 w-8 text-slate-500" />
              <p className="font-bold text-slate-200">Nenhuma campanha registrada.</p>
              <p className="mt-2">Crie a primeira campanha para acompanhar UTMs, criativos e resultados manuais.</p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={submitResult} className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Resultados manuais</p>
          <h3 className="text-lg font-black text-white">Registrar resultado {selectedCampaign ? `- ${selectedCampaign.name}` : ""}</h3>
        </div>
        <label className="mb-3 grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
          Campanha
          <select value={selectedCampaignId} onChange={(event) => setSelectedCampaignId(event.target.value)} className="field-input">
            <option value="">Selecione</option>
            {(payload?.campaigns || []).map((campaign) => (
              <option value={campaign.id} key={campaign.id}>{campaign.name}</option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <TextInput label="Visitantes" type="number" value={resultForm.visitors} onChange={(value) => setResultForm((current) => ({ ...current, visitors: value }))} />
          <TextInput label="Cliques" type="number" value={resultForm.clicks} onChange={(value) => setResultForm((current) => ({ ...current, clicks: value }))} />
          <TextInput label="Leads" type="number" value={resultForm.leads} onChange={(value) => setResultForm((current) => ({ ...current, leads: value }))} />
          <TextInput label="Cadastros" type="number" value={resultForm.signups} onChange={(value) => setResultForm((current) => ({ ...current, signups: value }))} />
          <TextInput label="Onboardings" type="number" value={resultForm.onboardings} onChange={(value) => setResultForm((current) => ({ ...current, onboardings: value }))} />
          <TextInput label="Primeiras respostas" type="number" value={resultForm.first_responses} onChange={(value) => setResultForm((current) => ({ ...current, first_responses: value }))} />
          <TextInput label="Respostas salvas" type="number" value={resultForm.saved_responses} onChange={(value) => setResultForm((current) => ({ ...current, saved_responses: value }))} />
          <TextInput label="Checkouts" type="number" value={resultForm.checkouts} onChange={(value) => setResultForm((current) => ({ ...current, checkouts: value }))} />
          <TextInput label="Assinaturas" type="number" value={resultForm.subscriptions} onChange={(value) => setResultForm((current) => ({ ...current, subscriptions: value }))} />
          <TextInput label="Gasto" type="number" value={resultForm.spend_amount} onChange={(value) => setResultForm((current) => ({ ...current, spend_amount: value }))} />
          <TextInput label="Registrado em" type="date" value={resultForm.recorded_at} onChange={(value) => setResultForm((current) => ({ ...current, recorded_at: value }))} />
        </div>
        <label className="mt-3 grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
          Observações
          <textarea
            value={resultForm.notes}
            onChange={(event) => setResultForm((current) => ({ ...current, notes: event.target.value }))}
            className="field-input min-h-20 resize-none py-3 normal-case"
            maxLength={1500}
            placeholder="Observações agregadas. Não registre dados pessoais ou sensíveis."
          />
        </label>
        <button
          type="submit"
          disabled={savingResult || !selectedCampaignId}
          className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 hover:bg-emerald-300 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {savingResult ? "Registrando..." : "Registrar resultado"}
        </button>
      </form>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <SummaryTable title="Resultados por nicho" empty="Sem dados suficientes para comparar nichos." rows={payload?.nicheSummary || []} />
        <SummaryTable title="Resultados por canal" empty="Sem dados suficientes para comparar canais." rows={payload?.channelSummary || []} />
      </div>
    </section>
  );
}

function TextInput({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} type={type} min={type === "number" ? 0 : undefined} step={type === "number" ? "0.01" : undefined} required={required} className="field-input" />
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

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-[#0b1118] p-3">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words font-bold text-slate-200">{value}</p>
    </div>
  );
}

function SummaryTable({ title, rows, empty }: { title: string; rows: SummaryRow[]; empty: string }) {
  const hasData = rows.some((row) => row.leads || row.signups || row.subscriptions || row.spend_amount);

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <h3 className="text-lg font-black text-white">{title}</h3>
      {hasData ? (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[760px] w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {["Nome", "Campanhas", "Leads", "Cadastros", "Primeiras respostas", "Checkouts", "Assinaturas", "Gasto", "CPL", "CPA"].map((header) => (
                  <th className="border-b border-white/10 px-3 py-3 font-black" key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="border-b border-white/10 px-3 py-3 font-black text-white">{row.label}</td>
                  <td className="border-b border-white/10 px-3 py-3 text-slate-300">{row.campaigns}</td>
                  <td className="border-b border-white/10 px-3 py-3 text-slate-300">{row.leads}</td>
                  <td className="border-b border-white/10 px-3 py-3 text-slate-300">{row.signups}</td>
                  <td className="border-b border-white/10 px-3 py-3 text-slate-300">{row.first_responses}</td>
                  <td className="border-b border-white/10 px-3 py-3 text-slate-300">{row.checkouts}</td>
                  <td className="border-b border-white/10 px-3 py-3 text-slate-300">{row.subscriptions}</td>
                  <td className="border-b border-white/10 px-3 py-3 text-slate-300">{money(row.spend_amount)}</td>
                  <td className="border-b border-white/10 px-3 py-3 text-slate-300">{money(row.cost_per_lead)}</td>
                  <td className="border-b border-white/10 px-3 py-3 text-slate-300">{money(row.cost_per_subscription)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 rounded-md border border-dashed border-white/15 bg-[#0b1118] p-5 text-sm font-bold text-slate-400">{empty}</p>
      )}
    </div>
  );
}
