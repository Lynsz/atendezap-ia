import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/badge";
import { KiwifyCheckoutButton } from "@/components/checkout/KiwifyCheckoutButton";
import { getCheckoutPlan } from "@/config/checkout";
import type { CheckoutPlanId } from "@/config/checkout";
import { cn } from "@/lib/utils";

const plans: Array<{
  id: CheckoutPlanId;
  description: string;
  features: string[];
  badge: string;
  recommended?: boolean;
  cta: string;
}> = [
  {
    id: "basic",
    badge: "Mais acessível",
    cta: "Começar por R$29",
    description: "Para começar com o essencial do AtendeZap IA.",
    features: [
      "Painel de atendimento",
      "Clientes e leads",
      "Histórico local no navegador",
      "Interface moderna estilo SaaS",
      "Organização básica dos atendimentos"
    ]
  },
  {
    id: "starter",
    badge: "Mais indicado",
    cta: "Começar por R$49",
    recommended: true,
    description: "Para quem quer organizar atendimentos e usar automações com IA.",
    features: [
      "Tudo do Plano Básico",
      "Automações básicas com IA",
      "Sugestões de resposta",
      "Funil simples de vendas",
      "Melhor organização dos leads"
    ]
  },
  {
    id: "premium",
    badge: "Mais completo",
    cta: "Assinar Premium",
    description: "Para quem quer uma experiência mais completa de atendimento, vendas e automações.",
    features: [
      "Tudo do Plano Starter",
      "Automações IA avançadas",
      "Dashboard comercial",
      "Funil de vendas completo",
      "Sugestões inteligentes de resposta",
      "Organização avançada de leads"
    ]
  }
];

export function PricingSection() {
  return (
    <section className="bg-[#090d12] py-16 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-300">Planos</p>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Escolha como começar</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Três opções para organizar atendimento, leads e automações com IA.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((planConfig) => {
            const plan = getCheckoutPlan(planConfig.id);

            return (
              <article
                className={cn(
                  "relative flex h-full flex-col rounded-lg border bg-[#101821] p-6 shadow-2xl shadow-black/25",
                  planConfig.recommended ? "border-emerald-300 shadow-emerald-950/30" : "border-white/10"
                )}
                key={plan.id}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <Badge className={planConfig.recommended ? "bg-emerald-300 text-slate-950" : "bg-white text-slate-950"}>
                      {planConfig.badge}
                    </Badge>
                    <h3 className="mt-4 text-2xl font-black text-white">{plan.name}</h3>
                    <p className="mt-3 text-4xl font-black tracking-tight">{plan.price}</p>
                  </div>
                  {planConfig.recommended ? (
                    <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200">
                      Recomendado
                    </span>
                  ) : null}
                </div>

                <p className="text-sm leading-6 text-slate-300">{planConfig.description}</p>

                <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-slate-200">
                  {planConfig.features.map((feature) => (
                    <li className="flex gap-2" key={feature}>
                      <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", planConfig.recommended ? "text-emerald-300" : "text-slate-300")} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <KiwifyCheckoutButton className="mt-7" fullWidth planId={plan.id} label={planConfig.cta} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
