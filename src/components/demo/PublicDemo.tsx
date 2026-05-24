"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Clipboard, MessageCircle, Send, Sparkles } from "lucide-react";
import { captureUtmsFromLocation, trackEvent } from "@/lib/tracking";

const exampleQuestions = [
  "Qual o valor do serviço?",
  "Vocês atendem hoje?",
  "Tem entrega?",
  "Quais formas de pagamento?",
  "Como faço para agendar?",
  "Pode me passar mais informações?"
];

const businessTypes = ["Autônomo", "Prestador de serviço", "Loja", "Delivery", "Estética", "Restaurante", "Assistência técnica", "Outro"];
const toneOptions = ["Profissional", "Simpático", "Direto", "Vendedor", "Acolhedor"];

type DemoResponse = {
  answer?: string;
  mode?: string;
  error?: string;
};

export function PublicDemo() {
  const [question, setQuestion] = useState(exampleQuestions[0]);
  const [businessType, setBusinessType] = useState("Prestador de serviço");
  const [tone, setTone] = useState("Simpático");
  const [answer, setAnswer] = useState("");
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const remainingChars = useMemo(() => 280 - question.length, [question]);

  useEffect(() => {
    captureUtmsFromLocation({ source: "demo_page", funnel: "demo" });
    trackEvent("demo_view", { page: "demo" });
  }, []);

  function chooseExample(example: string) {
    setQuestion(example);
    setError("");
    trackEvent("demo_example_click", {
      business_type: businessType,
      tone
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setAnswer("");

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      setError("Digite uma pergunta de cliente para testar.");
      return;
    }

    trackEvent("demo_generate_click", {
      business_type: businessType,
      tone
    });
    setLoading(true);

    try {
      const response = await fetch("/api/demo/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          businessType,
          tone
        })
      });
      const result = (await response.json().catch(() => ({}))) as DemoResponse;

      if (!response.ok || !result.answer) {
        const message = result.error || "Não foi possível gerar a resposta agora. Tente novamente em instantes.";
        setError(message);
        trackEvent("demo_response_error", {
          business_type: businessType,
          tone,
          reason: response.status === 429 ? "rate_limit" : "api_error"
        });
        return;
      }

      setAnswer(result.answer);
      setMode(result.mode || "");
      trackEvent("demo_response_success", {
        business_type: businessType,
        tone,
        mode: result.mode || "unknown"
      });
    } catch {
      setError("Não foi possível conectar agora. Tente novamente em instantes.");
      trackEvent("demo_response_error", {
        business_type: businessType,
        tone,
        reason: "network_error"
      });
    } finally {
      setLoading(false);
    }
  }

  function trackSignupCta() {
    trackEvent("demo_signup_cta_click", { cta: "demo_signup" });
  }

  function trackPricingCta() {
    trackEvent("demo_pricing_cta_click", { cta: "demo_pricing" });
  }

  function trackEbookCta() {
    trackEvent("demo_ebook_cta_click", { cta: "demo_ebook", source: "demo" });
  }

  return (
    <section className="bg-[#090d12] py-16 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
            Demonstração gratuita
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
            Teste como o AtendeZap IA responderia seus clientes no WhatsApp
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            Digite uma pergunta comum que você recebe e veja uma resposta pronta em poucos segundos. A demo mostra apenas uma prévia. Com sua conta, você pode configurar seu atendimento e salvar seu histórico.
          </p>
          <div className="mt-6 grid gap-3 text-sm font-bold text-slate-200">
            {[
              "Use a IA para criar respostas mais rápidas e claras para seus clientes.",
              "Ideal para autônomos, prestadores de serviço e pequenos negócios.",
              "Sem conectar WhatsApp: gere, revise, copie e envie."
            ].map((item) => (
              <div className="flex items-start gap-2" key={item}>
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Pergunta do cliente
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value.slice(0, 280))}
                  className="field-input min-h-32 resize-none py-3"
                  placeholder="Ex.: Qual o valor do serviço e vocês atendem hoje?"
                  maxLength={280}
                />
              </label>
              <p className={`mt-2 text-xs font-bold ${remainingChars < 30 ? "text-amber-200" : "text-slate-500"}`}>{remainingChars} caracteres restantes</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((example) => (
                <button
                  type="button"
                  onClick={() => chooseExample(example)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/[0.08]"
                  key={example}
                >
                  {example}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Tipo de atuação
                <select value={businessType} onChange={(event) => setBusinessType(event.target.value)} className="field-input">
                  {businessTypes.map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Tom de voz
                <select value={tone} onChange={(event) => setTone(event.target.value)} className="field-input">
                  {toneOptions.map((option) => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {error ? <p className="rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm font-bold text-red-100">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {loading ? "Gerando resposta..." : "Gerar resposta de exemplo"}
            </button>
          </form>

          <article className="mt-6 rounded-lg border border-white/10 bg-[#090d12] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Resposta gerada</p>
                <h2 className="mt-1 text-xl font-black text-white">Pronta para revisar e enviar</h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-400 text-slate-950">
                <MessageCircle className="h-5 w-5" />
              </div>
            </div>
            {answer ? (
              <>
                <p className="whitespace-pre-wrap rounded-md border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-7 text-emerald-50">{answer}</p>
                {mode.includes("fallback") ? <p className="mt-3 text-xs font-bold text-slate-500">Modo local de demonstração: OpenAI não configurada neste ambiente.</p> : null}
                <div className="mt-5 rounded-md border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-bold leading-6 text-slate-200">
                    Essa foi só uma prévia. Com sua conta, você pode configurar seu atendimento, salvar histórico e gerar respostas mais alinhadas ao seu negócio.
                  </p>
                  <p className="mt-2 text-xs font-bold leading-5 text-slate-400">
                    A IA gera uma sugestao. Voce revisa, copia e envia manualmente pelo WhatsApp.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/cadastro"
                      onClick={trackSignupCta}
                      className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                    >
                      Criar minha conta
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                      href="/precos"
                      onClick={trackPricingCta}
                      className="inline-flex min-h-11 items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    >
                      Ver planos
                    </Link>
                    <Link
                      href="/ebook"
                      onClick={trackEbookCta}
                      className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                    >
                      Baixar guia gratuito
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-52 flex-col items-center justify-center rounded-md border border-dashed border-white/15 bg-white/[0.03] p-6 text-center text-sm leading-6 text-slate-400">
                <Clipboard className="mb-4 h-7 w-7 text-slate-500" />
                <p className="font-bold text-slate-200">A resposta de exemplo aparecerá aqui.</p>
                <p className="mt-2 max-w-sm">Escolha uma pergunta pronta ou digite uma dúvida real que você recebe no WhatsApp.</p>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
