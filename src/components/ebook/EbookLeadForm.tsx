"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Download } from "lucide-react";
import { captureUtmsFromLocation, getAttribution, trackEvent } from "@/lib/tracking";

const businessTypeOptions = ["Autônomo", "Prestador de serviço", "Loja", "Delivery", "Estética", "Restaurante", "Assistência técnica", "Outro"];

export function EbookLeadForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    captureUtmsFromLocation({ source: "ebook_page", funnel: "ebook" });
  }, []);

  function readUtms() {
    const attribution = getAttribution();
    return {
      utm_source: attribution.utm_source || "",
      utm_medium: attribution.utm_medium || "",
      utm_campaign: attribution.utm_campaign || "",
      utm_content: attribution.utm_content || "",
      utm_term: attribution.utm_term || ""
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const attribution = getAttribution();
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      whatsapp: String(formData.get("whatsapp") || ""),
      business_type: String(formData.get("business_type") || "Autônomo"),
      source: attribution.source || "ebook_page",
      ...readUtms()
    };

    trackEvent("lead_submit", {
      source: payload.source,
      funnel: attribution.funnel || "ebook",
      business_type: payload.business_type
    });

    try {
      const response = await fetch("/api/ebook-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = (await response.json().catch(() => ({}))) as { redirectTo?: string; error?: string; message?: string };

      if (!response.ok) {
        setError(result.error || result.message || "Não foi possível liberar o guia agora. Revise os dados e tente novamente.");
        trackEvent("lead_error", {
          source: payload.source,
          funnel: attribution.funnel || "ebook",
          business_type: payload.business_type,
          reason: "api_error"
        });
        return;
      }

      trackEvent("lead_success", {
        source: payload.source,
        funnel: attribution.funnel || "ebook",
        business_type: payload.business_type
      });
      window.location.href = result.redirectTo || "/ebook/obrigado";
    } catch {
      setError("Não foi possível enviar seus dados agora. Tente novamente em instantes.");
      trackEvent("lead_error", {
        source: payload.source,
        funnel: attribution.funnel || "ebook",
        business_type: payload.business_type,
        reason: "network_error"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
      {error ? <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}

      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Nome
        <input name="name" required className="field-input" placeholder="Seu nome" autoComplete="name" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-slate-700">
        E-mail
        <input name="email" type="email" required className="field-input" placeholder="voce@email.com" autoComplete="email" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-slate-700">
        WhatsApp, opcional
        <input name="whatsapp" className="field-input" placeholder="(11) 99999-9999" autoComplete="tel" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Tipo de atuação
        <select name="business_type" required className="field-input" defaultValue="Autônomo">
          {businessTypeOptions.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Liberando guia..." : "Baixar guia gratuito"}
        <Download className="h-4 w-4" />
      </button>

      <p className="text-xs leading-5 text-slate-500">
        Ao enviar, você concorda em receber conteúdos e comunicações sobre o AtendeZap IA. Você pode sair da lista quando quiser.
      </p>
    </form>
  );
}
