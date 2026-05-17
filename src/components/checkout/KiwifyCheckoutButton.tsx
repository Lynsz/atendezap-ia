"use client";

import { ArrowRight } from "lucide-react";
import { getCheckoutUrl } from "@/config/checkout";
import type { CheckoutPlanId } from "@/config/checkout";
import { cn } from "@/lib/utils";

type KiwifyCheckoutButtonProps = {
  planId: CheckoutPlanId;
  label?: string;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  onBeforeRedirect?: () => void;
};

export function KiwifyCheckoutButton({
  planId,
  label,
  className,
  fullWidth,
  disabled,
  onBeforeRedirect
}: KiwifyCheckoutButtonProps) {
  const defaultLabels: Record<CheckoutPlanId, string> = {
    starter: "Começar no Starter",
    pro: "Começar por R$ 29",
    premium: "Assinar Premium"
  };
  const checkoutUrl = getCheckoutUrl(planId);
  const isDisabled = disabled || !checkoutUrl;

  function handleCheckout() {
    if (isDisabled) return;
    onBeforeRedirect?.();
    window.location.href = checkoutUrl;
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isDisabled}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-black shadow-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50",
        planId === "premium"
          ? "bg-violet-400 text-slate-950 shadow-violet-950/20 hover:bg-violet-300 focus:ring-violet-300"
          : "bg-emerald-400 text-slate-950 shadow-emerald-950/20 hover:bg-emerald-300 focus:ring-emerald-300",
        fullWidth && "w-full",
        className
      )}
    >
      {label || (checkoutUrl ? defaultLabels[planId] : "Checkout em configuração")}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
