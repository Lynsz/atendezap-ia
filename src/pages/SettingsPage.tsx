"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  Bot,
  Building2,
  CheckCircle2,
  LifeBuoy,
  RotateCcw,
  Save,
  Settings,
  ShieldAlert,
  Sparkles,
  Wand2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsToggle } from "@/components/settings/SettingsToggle";
import { cn } from "@/lib/utils";
import type { AITone, BusinessSegment } from "@/types/onboarding";
import type { AISettings, CompanySettings, NotificationSettings, SettingsTab, SupportSettings } from "@/types/settings";
import {
  generateAIBasePrompt,
  generateWelcomeFromSettings,
  getAISettings,
  getCompanySettings,
  getNotificationSettings,
  getSupportSettings,
  persistSettingsToOnboarding,
  resetSettings,
  saveAISettings,
  saveCompanySettings,
  saveNotificationSettings,
  saveSupportSettings,
  syncSettingsFromOnboarding
} from "@/utils/settingsStorage";

const tabs: Array<{ id: SettingsTab; label: string; icon: LucideIcon }> = [
  { id: "company", label: "Empresa", icon: Building2 },
  { id: "ai", label: "IA", icon: Bot },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "support", label: "Suporte", icon: LifeBuoy },
  { id: "advanced", label: "Avançado", icon: ShieldAlert }
];

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

const goals = ["vender mais", "responder mais rápido", "organizar leads", "automatizar atendimento", "melhorar follow-up"];

function inputClass() {
  return "field-input";
}

function textareaClass(extra = "") {
  return cn("field-input min-h-28 resize-none py-3", extra);
}

function splitBlockedWords(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateSettings(company: CompanySettings, ai: AISettings, tab: SettingsTab) {
  if (tab === "company") {
    if (!company.businessName.trim()) return "Informe o nome da empresa.";
    if (!company.ownerName.trim()) return "Informe o nome do responsável.";
    if (!company.email.trim()) return "Informe o e-mail da empresa.";
    if (!company.phone.trim()) return "Informe o WhatsApp da empresa.";
    if (!company.openingHours.trim()) return "Informe o horário de atendimento.";
  }

  if (tab === "ai") {
    if (!ai.aiName.trim()) return "Informe o nome da IA.";
    if (!ai.welcomeMessage.trim()) return "Informe a mensagem de boas-vindas.";
    if (!ai.fallbackMessage.trim()) return "Informe a mensagem de fallback.";
    if (!ai.productsOrServices.trim()) return "Informe os produtos ou serviços.";
    if (!ai.targetAudience.trim()) return "Informe o público-alvo.";
  }

  return "";
}

function SettingsContent() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("company");
  const [company, setCompany] = useState<CompanySettings>(() => getCompanySettings());
  const [ai, setAI] = useState<AISettings>(() => getAISettings());
  const [notifications, setNotifications] = useState<NotificationSettings>(() => getNotificationSettings());
  const [support, setSupport] = useState<SupportSettings>(() => getSupportSettings());
  const [blockedWordsDraft, setBlockedWordsDraft] = useState(() => getAISettings().blockedWords.join(", "));
  const [promptPreview, setPromptPreview] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const activeTabLabel = useMemo(() => tabs.find((tab) => tab.id === activeTab)?.label || "Configurações", [activeTab]);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 3000);
  }

  function updateCompany(update: Partial<CompanySettings>) {
    setCompany((current) => ({ ...current, ...update }));
  }

  function updateAI(update: Partial<AISettings>) {
    setAI((current) => ({ ...current, ...update }));
  }

  function updateNotifications(update: Partial<NotificationSettings>) {
    setNotifications((current) => ({ ...current, ...update }));
  }

  function updateSupport(update: Partial<SupportSettings>) {
    setSupport((current) => ({ ...current, ...update }));
  }

  function handleSave() {
    const nextAI = {
      ...ai,
      blockedWords: splitBlockedWords(blockedWordsDraft)
    };
    const validationError = validateSettings(company, nextAI, activeTab);

    if (validationError) {
      setError(validationError);
      setFeedback("");
      return;
    }

    setError("");
    saveCompanySettings(company);
    saveAISettings(nextAI);
    saveNotificationSettings(notifications);
    saveSupportSettings(support);
    persistSettingsToOnboarding(company, nextAI);
    setAI(nextAI);
    showFeedback("Configurações salvas localmente.");
  }

  function handleGenerateWelcome() {
    updateAI({ welcomeMessage: generateWelcomeFromSettings(company, ai) });
    showFeedback("Mensagem de boas-vindas gerada.");
  }

  function handleGeneratePrompt() {
    const nextAI = {
      ...ai,
      blockedWords: splitBlockedWords(blockedWordsDraft)
    };
    setPromptPreview(generateAIBasePrompt(company, nextAI));
    showFeedback("Prompt base atualizado.");
  }

  function handleSyncOnboarding() {
    const synced = syncSettingsFromOnboarding();
    setCompany(synced.company);
    setAI(synced.ai);
    setBlockedWordsDraft(synced.ai.blockedWords.join(", "));
    showFeedback("Configurações sincronizadas com o onboarding.");
  }

  function handleReset() {
    resetSettings();
    const nextCompany = getCompanySettings();
    const nextAI = getAISettings();
    setCompany(nextCompany);
    setAI(nextAI);
    setNotifications(getNotificationSettings());
    setSupport(getSupportSettings());
    setBlockedWordsDraft(nextAI.blockedWords.join(", "));
    setPromptPreview("");
    showFeedback("Configurações resetadas para o padrão local.");
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-8 text-slate-100">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                <Settings className="h-4 w-4" />
                Configurações do produto
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Configurações</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Gerencie os dados da empresa, preferências da IA e notificações.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Salvo localmente
            </span>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-white/10 bg-[#101821] p-3 shadow-xl shadow-black/20 lg:sticky lg:top-6 lg:self-start">
            <div className="grid gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setError("");
                    }}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-black transition",
                      active ? "bg-emerald-400 text-slate-950" : "text-slate-300 hover:bg-white/10"
                    )}
                    key={tab.id}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="grid gap-5">
            {(feedback || error) ? (
              <div
                className={cn(
                  "rounded-lg border p-4 text-sm font-bold",
                  error ? "border-red-400/30 bg-red-500/10 text-red-200" : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                )}
              >
                {error || feedback}
              </div>
            ) : null}

            {activeTab === "company" ? (
              <SettingsCard title="Empresa" description="Dados básicos usados no atendimento, dashboard e sugestões da IA.">
                <div className="grid gap-4 md:grid-cols-2">
                  <SettingsField label="Nome da empresa">
                    <input value={company.businessName} onChange={(event) => updateCompany({ businessName: event.target.value })} className={inputClass()} />
                  </SettingsField>
                  <SettingsField label="Nome do responsável">
                    <input value={company.ownerName} onChange={(event) => updateCompany({ ownerName: event.target.value })} className={inputClass()} />
                  </SettingsField>
                  <SettingsField label="Documento" description="Opcional. Use apenas se fizer sentido para sua operação.">
                    <input value={company.document || ""} onChange={(event) => updateCompany({ document: event.target.value })} className={inputClass()} />
                  </SettingsField>
                  <SettingsField label="E-mail">
                    <input value={company.email} onChange={(event) => updateCompany({ email: event.target.value })} className={inputClass()} type="email" />
                  </SettingsField>
                  <SettingsField label="WhatsApp">
                    <input value={company.phone} onChange={(event) => updateCompany({ phone: event.target.value })} className={inputClass()} />
                  </SettingsField>
                  <SettingsField label="Segmento">
                    <select value={company.segment} onChange={(event) => updateCompany({ segment: event.target.value as BusinessSegment })} className={inputClass()}>
                      {segments.map((segment) => (
                        <option value={segment.value} key={segment.value}>
                          {segment.label}
                        </option>
                      ))}
                    </select>
                  </SettingsField>
                  <SettingsField label="Segmento personalizado">
                    <input
                      value={company.customSegment || ""}
                      onChange={(event) => updateCompany({ customSegment: event.target.value })}
                      className={inputClass()}
                      disabled={company.segment !== "outro"}
                    />
                  </SettingsField>
                  <SettingsField label="Site">
                    <input value={company.website || ""} onChange={(event) => updateCompany({ website: event.target.value })} className={inputClass()} />
                  </SettingsField>
                  <SettingsField label="Instagram">
                    <input value={company.instagram || ""} onChange={(event) => updateCompany({ instagram: event.target.value })} className={inputClass()} />
                  </SettingsField>
                  <SettingsField label="Horário de atendimento">
                    <input value={company.openingHours} onChange={(event) => updateCompany({ openingHours: event.target.value })} className={inputClass()} />
                  </SettingsField>
                  <SettingsField label="Fuso horário">
                    <input value={company.timezone} onChange={(event) => updateCompany({ timezone: event.target.value })} className={inputClass()} />
                  </SettingsField>
                </div>
              </SettingsCard>
            ) : null}

            {activeTab === "ai" ? (
              <SettingsCard title="IA" description="Personalize o comportamento local das sugestões de atendimento.">
                <div className="grid gap-4 md:grid-cols-2">
                  <SettingsField label="Nome da IA">
                    <input value={ai.aiName} onChange={(event) => updateAI({ aiName: event.target.value })} className={inputClass()} />
                  </SettingsField>
                  <SettingsField label="Tom da IA">
                    <select value={ai.aiTone} onChange={(event) => updateAI({ aiTone: event.target.value as AITone })} className={inputClass()}>
                      {tones.map((tone) => (
                        <option value={tone.value} key={tone.value}>
                          {tone.label}
                        </option>
                      ))}
                    </select>
                  </SettingsField>
                  <SettingsField label="Objetivo principal">
                    <select value={ai.mainGoal} onChange={(event) => updateAI({ mainGoal: event.target.value })} className={inputClass()}>
                      {goals.map((goal) => (
                        <option value={goal} key={goal}>
                          {goal}
                        </option>
                      ))}
                    </select>
                  </SettingsField>
                  <SettingsField label="Palavras bloqueadas" description="Separe por vírgula. Ex.: garantia, grátis, urgente.">
                    <input value={blockedWordsDraft} onChange={(event) => setBlockedWordsDraft(event.target.value)} className={inputClass()} />
                  </SettingsField>
                  <SettingsField label="Produtos ou serviços">
                    <textarea value={ai.productsOrServices} onChange={(event) => updateAI({ productsOrServices: event.target.value })} className={textareaClass()} />
                  </SettingsField>
                  <SettingsField label="Público-alvo">
                    <textarea value={ai.targetAudience} onChange={(event) => updateAI({ targetAudience: event.target.value })} className={textareaClass()} />
                  </SettingsField>
                  <SettingsField label="Mensagem de boas-vindas">
                    <textarea value={ai.welcomeMessage} onChange={(event) => updateAI({ welcomeMessage: event.target.value })} className={textareaClass()} />
                  </SettingsField>
                  <SettingsField label="Mensagem de fallback">
                    <textarea value={ai.fallbackMessage} onChange={(event) => updateAI({ fallbackMessage: event.target.value })} className={textareaClass()} />
                  </SettingsField>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <SettingsToggle
                    checked={ai.autoSuggestReplies}
                    onChange={(checked) => updateAI({ autoSuggestReplies: checked })}
                    label="Sugerir respostas automaticamente"
                  />
                  <SettingsToggle
                    checked={ai.autoSummarizeConversations}
                    onChange={(checked) => updateAI({ autoSummarizeConversations: checked })}
                    label="Resumir conversas automaticamente"
                  />
                  <SettingsToggle
                    checked={ai.autoClassifyLeads}
                    onChange={(checked) => updateAI({ autoClassifyLeads: checked })}
                    label="Classificar leads automaticamente"
                  />
                </div>

                <div className="mt-5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <BookOpen className="mt-1 h-5 w-5 text-emerald-300" />
                      <div>
                        <p className="font-black text-white">Gerenciar Base de Conhecimento</p>
                        <p className="mt-1 text-sm leading-6 text-emerald-100">
                          Cadastre FAQs, produtos, politicas e objecoes para melhorar as respostas sugeridas pela IA.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/base-conhecimento"
                      className="inline-flex min-h-10 items-center justify-center rounded-md bg-emerald-300 px-4 text-sm font-black text-slate-950 transition hover:bg-emerald-200"
                    >
                      Abrir Base da IA
                    </Link>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleGenerateWelcome}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-5 text-sm font-black text-emerald-200 transition hover:bg-emerald-400/20"
                  >
                    <Wand2 className="h-4 w-4" />
                    Gerar mensagem de boas-vindas
                  </button>
                  <button
                    type="button"
                    onClick={handleGeneratePrompt}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-sky-400/30 bg-sky-400/10 px-5 text-sm font-black text-sky-200 transition hover:bg-sky-400/20"
                  >
                    <Sparkles className="h-4 w-4" />
                    Gerar prompt base da IA
                  </button>
                </div>

                {promptPreview ? (
                  <div className="mt-5 rounded-lg border border-white/10 bg-[#0b1118] p-4">
                    <p className="mb-3 text-sm font-black text-white">Preview do prompt base</p>
                    <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-xs leading-5 text-slate-300">{promptPreview}</pre>
                  </div>
                ) : null}
              </SettingsCard>
            ) : null}

            {activeTab === "notifications" ? (
              <SettingsCard title="Notificações" description="Preferências locais para alertas do painel.">
                <div className="grid gap-3 md:grid-cols-2">
                  <SettingsToggle checked={notifications.notifyNewLead} onChange={(checked) => updateNotifications({ notifyNewLead: checked })} label="Novo lead" />
                  <SettingsToggle checked={notifications.notifyUrgentLead} onChange={(checked) => updateNotifications({ notifyUrgentLead: checked })} label="Lead urgente" />
                  <SettingsToggle
                    checked={notifications.notifyUnansweredConversation}
                    onChange={(checked) => updateNotifications({ notifyUnansweredConversation: checked })}
                    label="Conversa sem resposta"
                  />
                  <SettingsToggle
                    checked={notifications.notifyNewSubscription}
                    onChange={(checked) => updateNotifications({ notifyNewSubscription: checked })}
                    label="Nova assinatura"
                  />
                  <SettingsToggle
                    checked={notifications.emailNotifications}
                    onChange={(checked) => updateNotifications({ emailNotifications: checked })}
                    label="Notificações por e-mail"
                    description="Simulado localmente até existir backend."
                  />
                </div>
              </SettingsCard>
            ) : null}

            {activeTab === "support" ? (
              <SettingsCard title="Suporte" description="Dados exibidos para orientar clientes e equipe.">
                <div className="grid gap-4 md:grid-cols-2">
                  <SettingsField label="E-mail de suporte">
                    <input value={support.supportEmail} onChange={(event) => updateSupport({ supportEmail: event.target.value })} className={inputClass()} type="email" />
                  </SettingsField>
                  <SettingsField label="WhatsApp de suporte">
                    <input value={support.supportWhatsapp} onChange={(event) => updateSupport({ supportWhatsapp: event.target.value })} className={inputClass()} />
                  </SettingsField>
                  <div className="md:col-span-2">
                    <SettingsField label="Texto de ajuda">
                      <textarea value={support.helpText} onChange={(event) => updateSupport({ helpText: event.target.value })} className={textareaClass("min-h-36")} />
                    </SettingsField>
                  </div>
                </div>
              </SettingsCard>
            ) : null}

            {activeTab === "advanced" ? (
              <SettingsCard title="Avançado" description="Ferramentas locais para manutenção do MVP.">
                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleSyncOnboarding}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-5 text-sm font-black text-emerald-200 transition hover:bg-emerald-400/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Sincronizar com onboarding
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-red-400/30 bg-red-500/10 px-5 text-sm font-black text-red-200 transition hover:bg-red-500/15"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Resetar configurações
                  </button>
                </div>
                <div className="mt-5 rounded-lg border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
                  Os dados são salvos localmente neste navegador enquanto não houver backend. Ao limpar o navegador, as
                  configurações locais podem ser perdidas.
                </div>
              </SettingsCard>
            ) : null}

            <footer className="sticky bottom-4 z-10 rounded-lg border border-white/10 bg-[#101821] p-4 shadow-2xl shadow-black/30">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-slate-400">Aba atual: {activeTabLabel}. Alterações ficam neste navegador.</p>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                >
                  <Save className="h-4 w-4" />
                  Salvar alterações
                </button>
              </div>
            </footer>
          </section>
        </div>
      </section>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
