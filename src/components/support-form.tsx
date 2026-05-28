"use client";

import { useState } from "react";
import { Alert } from "@/components/alert";
import { Button } from "@/components/button";
import { Input, Textarea } from "@/components/form-fields";
import { supportCategories } from "@/lib/support";
import { trackEvent } from "@/lib/tracking";

export function SupportForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    const formData = Object.fromEntries(new FormData(event.currentTarget).entries());
    const category = String(formData.category || "Outro");

    try {
      trackEvent("help_contact_click", { source: "public_support", category });
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "public_support" })
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Nao foi possivel enviar a mensagem.");
      event.currentTarget.reset();
      setMessage("Solicitacao enviada. Retornaremos pelo e-mail informado.");
      trackEvent("support_request_created", { source: "public_support", category, status: "pending" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      trackEvent("support_request_failed", { source: "public_support", category, status: "failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      {message ? <Alert tone="success">{message}</Alert> : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      <label className="grid gap-2 text-sm font-bold text-ink">
        E-mail
        <Input name="email" type="email" required placeholder="voce@email.com" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">
        Categoria
        <select name="category" required className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-brand-500">
          {supportCategories.map((categoryOption) => (
            <option value={categoryOption} key={categoryOption}>
              {categoryOption}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">
        Assunto
        <Input name="subject" required maxLength={140} placeholder="Ex.: Problema com login" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">
        Mensagem
        <Textarea name="message" required maxLength={3000} placeholder="Conte em poucas linhas como podemos ajudar. Nao envie senhas, dados de cartao ou informacoes sensiveis." />
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar suporte"}
      </Button>
    </form>
  );
}
