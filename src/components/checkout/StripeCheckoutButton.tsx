"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { type PlanId, SAAS_PLANS } from "@/config/plans";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/browser";

type StripeCheckoutButtonProps = {
  planId: PlanId;
  className?: string;
  recommended?: boolean;
  disabled?: boolean;
  label?: string;
};

type CreateCheckoutResponse = {
  url?: string;
  error?: string;
};

export function StripeCheckoutButton({ planId, className, recommended, disabled, label }: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const plan = SAAS_PLANS[planId];

  async function handleClick() {
    setFeedback("");
    if (disabled) return;
    setLoading(true);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        window.location.href = `/cadastro?plan=${planId}`;
        return;
      }

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });

      const result = (await response.json()) as CreateCheckoutResponse;

      if (!response.ok || !result.url) {
        setFeedback(result.error || "Nao foi possivel iniciar o checkout agora.");
        return;
      }

      window.location.href = result.url;
    } catch {
      setFeedback("Nao foi possivel iniciar o pagamento. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || disabled}
        className={cn(
          "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60",
          recommended ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300" : "bg-white text-slate-950 hover:bg-slate-100"
        )}
      >
        {loading ? "Iniciando..." : label || (plan.id === "pro" ? "Comecar por R$ 29" : `Assinar ${plan.name}`)}
        <ArrowRight className="h-4 w-4" />
      </button>
      {feedback ? <p className="mt-3 text-xs font-bold leading-5 text-amber-200">{feedback}</p> : null}
    </div>
  );
}
