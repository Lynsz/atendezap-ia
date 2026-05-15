"use client";

import { useState } from "react";
import { Alert } from "@/components/alert";
import { Button } from "@/components/button";
import { Input, Textarea } from "@/components/form-fields";

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

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Não foi possível enviar a mensagem.");
      event.currentTarget.reset();
      setMessage("Solicitação enviada. Retornaremos pelo e-mail informado.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
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
        Mensagem
        <Textarea name="message" required placeholder="Conte em poucas linhas como podemos ajudar." />
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar suporte"}
      </Button>
    </form>
  );
}
