"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, CheckCircle2, MessageSquare, Send } from "lucide-react";
import { isSupabaseBrowserConfigured, supabase as supabaseBrowserClient } from "@/lib/supabase/browser";
import { trackEvent } from "@/lib/tracking";

type FeedbackType = "bug" | "duvida" | "sugestao" | "elogio" | "dificuldade_uso";
type FeedbackContext = "cadastro_login" | "onboarding" | "gerar_resposta" | "assinatura_pagamento" | "demo" | "ebook" | "dashboard" | "outro";

const feedbackTypeOptions: Array<{ value: FeedbackType; label: string }> = [
  { value: "bug", label: "Bug" },
  { value: "duvida", label: "Dúvida" },
  { value: "sugestao", label: "Sugestão" },
  { value: "elogio", label: "Elogio" },
  { value: "dificuldade_uso", label: "Dificuldade de uso" }
];

const feedbackContextOptions: Array<{ value: FeedbackContext; label: string }> = [
  { value: "cadastro_login", label: "Cadastro/login" },
  { value: "onboarding", label: "Onboarding" },
  { value: "gerar_resposta", label: "Gerar resposta" },
  { value: "assinatura_pagamento", label: "Assinatura/pagamento" },
  { value: "demo", label: "Demo" },
  { value: "ebook", label: "Ebook" },
  { value: "dashboard", label: "Dashboard" },
  { value: "outro", label: "Outro" }
];

export function FeedbackForm() {
  const supabase = useMemo(() => (isSupabaseBrowserConfigured() ? supabaseBrowserClient : null), []);
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [type, setType] = useState<FeedbackType>("dificuldade_uso");
  const [context, setContext] = useState<FeedbackContext>("dashboard");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(() => (typeof window !== "undefined" && window.location.pathname !== "/feedback" ? window.location.pathname : ""));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    trackEvent("feedback_page_view", {
      source: "feedback_page"
    });

    async function loadUser() {
      if (!supabase) {
        setLoadingUser(false);
        return;
      }

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        const metadataName = typeof user.user_metadata?.name === "string" ? user.user_metadata.name : "";
        setUserEmail(user.email || "");
        setUserName(metadataName || user.email || "");
      }

      setLoadingUser(false);
    }

    void loadUser();
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    trackEvent("feedback_submit", {
      feedback_type: type,
      feedback_context: context,
      authenticated: Boolean(userEmail)
    });

    try {
      const session = supabase ? (await supabase.auth.getSession()).data.session : null;
      const campaign = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_campaign") || "" : "";
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          name: userEmail ? userName : name,
          email: userEmail || email,
          type,
          message,
          page,
          source: "feedback_page",
          context,
          campaign
        })
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string; error?: string };

      if (!response.ok) {
        setError(result.error || "Não foi possível enviar seu feedback agora. Tente novamente em instantes.");
        trackEvent("feedback_error", {
          feedback_type: type,
          feedback_context: context,
          reason: "api_error"
        });
        return;
      }

      setSuccess(result.message || "Feedback enviado. Obrigado por ajudar a melhorar o AtendeZap IA.");
      setMessage("");
      setPage("");
      trackEvent("beta_feedback_submitted", {
        source: "feedback_page",
        page: page || "/feedback",
        category: type
      });
      trackEvent("small_launch_feedback_submitted", {
        source: "feedback_page",
        page: page || "/feedback",
        category: type
      });
      trackEvent("feedback_success", {
        feedback_type: type,
        feedback_context: context,
        authenticated: Boolean(userEmail)
      });
    } catch {
      setError("Não foi possível enviar seu feedback agora. Verifique sua conexão e tente novamente.");
      trackEvent("feedback_error", {
        feedback_type: type,
        feedback_context: context,
        reason: "network_error"
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-400 text-slate-950">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Enviar feedback</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Conte rapidamente o que aconteceu. Use este canal para bug, dúvida, sugestão ou algo que ficou confuso.
          </p>
        </div>
      </div>

      {success ? (
        <div className="mb-4 flex gap-3 rounded-md border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm font-bold text-emerald-100">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 flex gap-3 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm font-bold text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {userEmail ? (
        <div className="mb-4 rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
          Enviando como <strong className="text-white">{userEmail}</strong>.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-300">
            Nome
            <input value={name} onChange={(event) => setName(event.target.value)} className="field-input" maxLength={120} placeholder="Seu nome" autoComplete="name" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-300">
            E-mail
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" type="email" required maxLength={180} placeholder="voce@email.com" autoComplete="email" />
          </label>
        </div>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Tipo de feedback
          <select value={type} onChange={(event) => setType(event.target.value as FeedbackType)} className="field-input" required>
            {feedbackTypeOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Onde você teve dificuldade?
          <select value={context} onChange={(event) => setContext(event.target.value as FeedbackContext)} className="field-input" required>
            {feedbackContextOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
        Página ou área, opcional
        <input value={page} onChange={(event) => setPage(event.target.value)} className="field-input" maxLength={180} placeholder="Ex.: dashboard, assinatura, demo" />
      </label>

      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
        Mensagem
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="field-input min-h-40 resize-none py-3"
          required
          maxLength={2000}
          placeholder="Descreva o que aconteceu, o que ficou confuso ou o que você esperava encontrar."
        />
      </label>

      <div className="mt-2 flex justify-end text-xs font-bold text-slate-500">{message.length}/2000</div>

      <button
        type="submit"
        disabled={submitting || loadingUser}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Enviando..." : "Enviar feedback"}
      </button>
    </form>
  );
}
