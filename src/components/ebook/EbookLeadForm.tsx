"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Download } from "lucide-react";

const businessTypeOptions = ["Autônomo", "Prestador de serviço", "Loja", "Delivery", "Estética", "Restaurante", "Assistência técnica", "Outro"];

type UtmState = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
};

const emptyUtmState: UtmState = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: ""
};

export function EbookLeadForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  function readUtms() {
    if (typeof window === "undefined") return emptyUtmState;
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || ""
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      whatsapp: String(formData.get("whatsapp") || ""),
      business_type: String(formData.get("business_type") || "Autônomo"),
      source: "ebook_page",
      ...readUtms()
    };

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
        setError(result.error || result.message || "Nao foi possivel liberar o guia agora. Revise os dados e tente novamente.");
        return;
      }

      window.location.href = result.redirectTo || "/ebook/obrigado";
    } catch {
      setError("Nao foi possivel enviar seus dados agora. Tente novamente em instantes.");
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
