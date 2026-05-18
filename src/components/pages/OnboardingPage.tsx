"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/tracking";
import type { AITone, BusinessProfile, BusinessSegment, OnboardingStep, ServiceChannel } from "@/types/onboarding";
import { generateAISystemPrompt, generateDefaultWelcomeMessage, getBusinessProfile, saveBusinessProfile } from "@/utils/onboardingStorage";

const segments: Array<{ value: BusinessSegment; label: string }> = [
  { value: "beleza", label: "Beleza" },
  { value: "estética", label: "Estética" },
  { value: "alimentação", label: "Alimentação" },
  { value: "moda", label: "Moda" },
  { value: "educação", label: "Educação" },
  { value: "saúde", label: "Saúde" },
  { value: "serviços", label: "Serviços" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "imobiliário", label: "Imobiliário" },
  { value: "outro", label: "Outro" }
];

const tones: Array<{ value: AITone; label: string }> = [
  { value: "profissional", label: "Profissional" },
  { value: "amigável", label: "Amigável" },
  { value: "direto", label: "Direto" },
  { value: "consultivo", label: "Consultivo" },
  { value: "descontraído", label: "Descontraído" },
  { value: "premium", label: "Premium" }
];

const channels: Array<{ value: ServiceChannel; label: string }> = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "site", label: "Site" },
  { value: "telefone", label: "Telefone" },
  { value: "presencial", label: "Presencial" }
];

const goals = ["vender mais", "responder mais rápido", "organizar leads", "automatizar atendimento", "melhorar follow-up"];

const steps: Array<{ value: OnboardingStep; title: string }> = [
  { value: 1, title: "Empresa" },
  { value: 2, title: "Atendimento" },
  { value: 3, title: "IA" },
  { value: 4, title: "Revisão" }
];

function createInitialProfile(): BusinessProfile {
  const stored = typeof window !== "undefined" ? getBusinessProfile() : null;
  if (stored) return stored;

  const now = new Date().toISOString();
  return {
    businessName: "",
    ownerName: "",
    segment: "serviços",
    customSegment: "",
    aiTone: "profissional",
    channels: ["whatsapp"],
    openingHours: "",
    welcomeMessage: "",
    mainGoal: "organizar leads",
    productsOrServices: "",
    targetAudience: "",
    createdAt: now,
    updatedAt: now
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [profile, setProfile] = useState<BusinessProfile>(() => createInitialProfile());
  const [error, setError] = useState("");
  const prompt = useMemo(() => generateAISystemPrompt(profile), [profile]);
  const progress = `${(step / steps.length) * 100}%`;

  useEffect(() => {
    trackEvent("onboarding_started", { page: "onboarding" });
  }, []);

  function updateProfile(update: Partial<BusinessProfile>) {
    setProfile((current) => ({ ...current, ...update, updatedAt: new Date().toISOString() }));
  }

  function toggleChannel(channel: ServiceChannel) {
    const nextChannels = profile.channels.includes(channel)
      ? profile.channels.filter((item) => item !== channel)
      : [...profile.channels, channel];
    updateProfile({ channels: nextChannels.length ? nextChannels : ["whatsapp"] });
  }

  function validateCurrentStep() {
    if (step === 1) {
      if (!profile.businessName.trim()) return "Informe o nome da empresa.";
      if (!profile.ownerName.trim()) return "Informe o nome da pessoa responsável.";
      if (profile.segment === "outro" && !profile.customSegment?.trim()) return "Informe o segmento personalizado.";
    }

    if (step === 2) {
      if (!profile.channels.length) return "Escolha pelo menos um canal de atendimento.";
      if (!profile.openingHours.trim()) return "Informe o horário de atendimento.";
    }

    if (step === 3) {
      if (!profile.productsOrServices.trim()) return "Informe os produtos ou serviços vendidos.";
      if (!profile.targetAudience.trim()) return "Informe o público-alvo.";
      if (!profile.welcomeMessage.trim()) return "Informe ou gere uma mensagem de boas-vindas.";
    }

    return "";
  }

  function handleNext() {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setStep((current) => Math.min(4, current + 1) as OnboardingStep);
  }

  function handleBack() {
    setError("");
    setStep((current) => Math.max(1, current - 1) as OnboardingStep);
  }

  function handleGenerateWelcomeMessage() {
    updateProfile({ welcomeMessage: generateDefaultWelcomeMessage(profile) });
  }

  function handleFinish() {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    saveBusinessProfile({
      ...profile,
      updatedAt: new Date().toISOString(),
      createdAt: profile.createdAt || new Date().toISOString()
    });
    trackEvent("onboarding_completed", {
      segment: profile.segment,
      channel_count: profile.channels.length
    });
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-8 text-slate-100">
      <section className="mx-auto max-w-5xl">
        <header className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Configuração inicial</p>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Configure sua IA de atendimento</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Defina os dados básicos da empresa, canais, tom da IA e mensagem de boas-vindas para personalizar a experiência do AtendeZap IA.
          </p>
        </header>

        <div className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="mb-6">
            <div className="mb-3 flex flex-wrap gap-2">
              {steps.map((item) => (
                <div
                  className={`rounded-full border px-3 py-1.5 text-xs font-black ${
                    step >= item.value
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                      : "border-white/10 bg-white/5 text-slate-400"
                  }`}
                  key={item.value}
                >
                  {item.value}. {item.title}
                </div>
              ))}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: progress }} />
            </div>
          </div>

          {error ? <p className="mb-5 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm font-bold text-red-200">{error}</p> : null}

          {step === 1 ? (
            <div className="grid gap-4">
              <FormField label="Nome da empresa">
                <input value={profile.businessName} onChange={(event) => updateProfile({ businessName: event.target.value })} className="field-input" />
              </FormField>
              <FormField label="Nome da pessoa responsável">
                <input value={profile.ownerName} onChange={(event) => updateProfile({ ownerName: event.target.value })} className="field-input" />
              </FormField>
              <FormField label="Segmento">
                <select value={profile.segment} onChange={(event) => updateProfile({ segment: event.target.value as BusinessSegment })} className="field-input">
                  {segments.map((segment) => (
                    <option value={segment.value} key={segment.value}>
                      {segment.label}
                    </option>
                  ))}
                </select>
              </FormField>
              {profile.segment === "outro" ? (
                <FormField label="Segmento personalizado">
                  <input value={profile.customSegment || ""} onChange={(event) => updateProfile({ customSegment: event.target.value })} className="field-input" />
                </FormField>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-5">
              <FormField label="Canais de atendimento">
                <div className="flex flex-wrap gap-2">
                  {channels.map((channel) => {
                    const active = profile.channels.includes(channel.value);
                    return (
                      <button
                        type="button"
                        onClick={() => toggleChannel(channel.value)}
                        className={`rounded-full border px-3 py-2 text-xs font-black transition ${
                          active ? "border-emerald-400 bg-emerald-400 text-slate-950" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                        key={channel.value}
                      >
                        {channel.label}
                      </button>
                    );
                  })}
                </div>
              </FormField>
              <FormField label="Horário de atendimento">
                <input
                  value={profile.openingHours}
                  onChange={(event) => updateProfile({ openingHours: event.target.value })}
                  className="field-input"
                  placeholder="Ex.: segunda a sexta, 9h às 18h"
                />
              </FormField>
              <FormField label="Principal objetivo">
                <select value={profile.mainGoal} onChange={(event) => updateProfile({ mainGoal: event.target.value })} className="field-input">
                  {goals.map((goal) => (
                    <option value={goal} key={goal}>
                      {goal}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-4">
              <FormField label="Tom da IA">
                <select value={profile.aiTone} onChange={(event) => updateProfile({ aiTone: event.target.value as AITone })} className="field-input">
                  {tones.map((tone) => (
                    <option value={tone.value} key={tone.value}>
                      {tone.label}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Produtos ou serviços vendidos">
                <textarea
                  value={profile.productsOrServices}
                  onChange={(event) => updateProfile({ productsOrServices: event.target.value })}
                  className="field-input min-h-24 resize-none py-3"
                />
              </FormField>
              <FormField label="Público-alvo">
                <textarea
                  value={profile.targetAudience}
                  onChange={(event) => updateProfile({ targetAudience: event.target.value })}
                  className="field-input min-h-24 resize-none py-3"
                />
              </FormField>
              <FormField label="Mensagem de boas-vindas">
                <div className="grid gap-3">
                  <textarea
                    value={profile.welcomeMessage}
                    onChange={(event) => updateProfile({ welcomeMessage: event.target.value })}
                    className="field-input min-h-28 resize-none py-3"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateWelcomeMessage}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-4 text-sm font-black text-emerald-200 transition hover:bg-emerald-400/20"
                  >
                    <Wand2 className="h-4 w-4" />
                    Gerar mensagem automática
                  </button>
                </div>
              </FormField>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <ReviewCard title="Empresa" items={[profile.businessName, profile.ownerName, profile.segment === "outro" ? profile.customSegment || "Outro" : profile.segment]} />
              <ReviewCard title="Atendimento" items={[profile.channels.join(", "), profile.openingHours, profile.mainGoal]} />
              <ReviewCard title="IA" items={[profile.aiTone, profile.productsOrServices, profile.targetAudience, profile.welcomeMessage]} />
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 lg:col-span-2">
                <p className="mb-3 flex items-center gap-2 text-sm font-black text-white">
                  <Sparkles className="h-4 w-4 text-emerald-300" />
                  Prompt base da IA
                </p>
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-[#0b1118] p-4 text-xs leading-5 text-slate-300">{prompt}</pre>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-5 text-sm font-bold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
              >
                Próximo
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
              >
                <CheckCircle2 className="h-4 w-4" />
                Finalizar configuração
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-200">
      {label}
      {children}
    </label>
  );
}

function ReviewCard({ title, items }: { title: string; items: Array<string | undefined> }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <p className="mb-3 text-sm font-black text-white">{title}</p>
      <div className="grid gap-2 text-sm leading-6 text-slate-300">
        {items.filter(Boolean).map((item) => (
          <p className="rounded-md bg-[#0b1118] p-3" key={item}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
