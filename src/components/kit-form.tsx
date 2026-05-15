"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/alert";
import { Button } from "@/components/button";
import { Input, Select, Textarea } from "@/components/form-fields";
import { toneOptions } from "@/lib/validators";

type Field = {
  name: string;
  label: string;
  type?: "input" | "textarea" | "select";
  placeholder?: string;
};

const fields: Field[] = [
  { name: "businessName", label: "Nome do negócio", placeholder: "Ex.: Studio Maria Beleza" },
  { name: "niche", label: "Nicho", placeholder: "Ex.: manicure, marmitaria, assistência técnica" },
  { name: "city", label: "Cidade", placeholder: "Ex.: São Paulo - SP" },
  { name: "productsOrServices", label: "Produtos ou serviços vendidos", type: "textarea" },
  { name: "businessHours", label: "Horário de atendimento", placeholder: "Ex.: segunda a sábado, 9h às 18h" },
  { name: "frequentlyAskedQuestions", label: "Perguntas frequentes dos clientes", type: "textarea" },
  { name: "priceRange", label: "Faixa de preço ou observação sobre preços", type: "textarea" },
  { name: "paymentMethods", label: "Formas de pagamento", placeholder: "Ex.: Pix, cartão, dinheiro" },
  { name: "purchaseProcess", label: "Como o cliente agenda ou compra", type: "textarea" },
  { name: "whatsapp", label: "WhatsApp do negócio", placeholder: "Ex.: 11999999999" },
  { name: "instagram", label: "Instagram, opcional", placeholder: "Ex.: @meunegocio" }
];

export function KitForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const formData = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/generate-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, formData })
      });
      const data = (await response.json()) as { kitId?: string; error?: string };
      if (!response.ok || !data.kitId) {
        throw new Error(data.error || "Não foi possível gerar o kit.");
      }
      router.push(`/kit/${data.kitId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado ao gerar o kit.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {fields.map((field) => (
        <label className="grid gap-2 text-sm font-bold text-ink" key={field.name}>
          {field.label}
          {field.type === "textarea" ? (
            <Textarea name={field.name} placeholder={field.placeholder} required={field.name !== "instagram"} />
          ) : (
            <Input name={field.name} placeholder={field.placeholder} required={field.name !== "instagram"} />
          )}
        </label>
      ))}
      <label className="grid gap-2 text-sm font-bold text-ink">
        Tom de voz
        <Select name="toneOfVoice" required defaultValue="simpático">
          {toneOptions.map((tone) => (
            <option value={tone} key={tone}>
              {tone}
            </option>
          ))}
        </Select>
      </label>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Gerando seu kit..." : "Gerar meu kit"}
      </Button>
      <p className="text-center text-xs leading-5 text-slate-500">
        A geração pode levar alguns instantes. O token será marcado como usado após o kit ser criado.
      </p>
    </form>
  );
}
