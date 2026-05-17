import { CheckCircle2 } from "lucide-react";
import { AsaasSubscriptionButton } from "@/components/checkout/AsaasSubscriptionButton";
import { Badge } from "@/components/badge";
import { PLAN_IDS, SAAS_PLANS } from "@/config/plans";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const plans = PLAN_IDS.map((planId) => SAAS_PLANS[planId]);

  return (
    <section className="bg-[#090d12] py-16 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-300">Planos mensais</p>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Escolha seu plano</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Para quem atende, vende ou responde clientes pelo WhatsApp. Comece pelo material gratuito e ative o AtendeZap IA quando quiser.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              className={cn(
                "relative flex h-full flex-col rounded-lg border bg-[#101821] p-6 shadow-2xl shadow-black/25",
                plan.recommended ? "scale-[1.01] border-emerald-300 shadow-emerald-950/30" : "border-white/10"
              )}
              key={plan.id}
            >
              <div className="mb-5">
                <Badge className={plan.recommended ? "bg-emerald-300 text-slate-950" : "bg-white text-slate-950"}>
                  {plan.badge}
                </Badge>
                <h3 className="mt-4 text-2xl font-black text-white">{plan.name}</h3>
                <p className="mt-3 text-4xl font-black tracking-tight">
                  {plan.firstMonthPriceLabel || plan.monthlyPriceLabel}
                </p>
                {plan.recurringPriceLabel ? <p className="mt-1 text-base font-black text-emerald-200">{plan.recurringPriceLabel}</p> : null}
                {plan.id === "pro" ? (
                  <p className="mt-2 text-xs font-bold text-slate-400">
                    Primeiro mês do Plano Pro por R$ 29 para novos usuários. Depois, continue no plano mensal normalmente.
                  </p>
                ) : null}
                <p className="mt-3 min-h-16 text-sm leading-6 text-slate-300">{plan.description}</p>
              </div>

              <ul className="flex flex-1 flex-col gap-3 text-sm text-slate-200">
                {plan.features.map((feature) => (
                  <li className="flex gap-2" key={feature}>
                    <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", plan.recommended ? "text-emerald-300" : "text-slate-300")} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <AsaasSubscriptionButton planId={plan.id} className="mt-7" recommended={plan.recommended} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
