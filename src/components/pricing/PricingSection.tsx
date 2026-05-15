import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/badge";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Plano Inicial",
    price: "R$ 19,90/mês",
    description: "Para começar a responder clientes com IA de forma profissional.",
    checkoutUrl: process.env.NEXT_PUBLIC_KIWI_INITIAL_CHECKOUT_URL || process.env.VITE_KIWI_INITIAL_CHECKOUT_URL || "",
    cta: "Começar no Inicial",
    badge: "Essencial",
    features: ["Gerador de respostas com IA", "Cadastro do negócio", "Scripts prontos", "Histórico básico", "Organização básica de clientes"]
  },
  {
    name: "Plano Pro",
    price: "R$ 39,90/mês",
    description: "Para negócios que querem mais modelos e organização comercial.",
    checkoutUrl: process.env.NEXT_PUBLIC_KIWI_PRO_CHECKOUT_URL || process.env.VITE_KIWI_PRO_CHECKOUT_URL || "",
    cta: "Assinar Pro",
    badge: "Mais vendido",
    recommended: true,
    features: ["Tudo do Inicial", "Mais respostas por mês", "Mais modelos de mensagem", "Funil de atendimento", "Personalização por nicho"]
  },
  {
    name: "Plano Premium",
    price: "Em breve",
    description: "Para a próxima fase com WhatsApp conectado e relatórios.",
    checkoutUrl: "",
    cta: "Em breve",
    badge: "Futuro",
    features: ["WhatsApp conectado", "Atendimento automático", "Relatórios", "IA treinada com dados do negócio"]
  }
];

export function PricingSection() {
  return (
    <section className="bg-[#090d12] py-16 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-300">Planos mensais</p>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Escolha seu plano</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Comece com um assistente de respostas para WhatsApp e evolua conforme seu atendimento crescer.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              className={cn(
                "relative flex h-full flex-col rounded-lg border bg-[#101821] p-6 shadow-2xl shadow-black/25",
                plan.recommended ? "border-emerald-300 shadow-emerald-950/30" : "border-white/10"
              )}
              key={plan.name}
            >
              <div className="mb-5">
                <Badge className={plan.recommended ? "bg-emerald-300 text-slate-950" : "bg-white text-slate-950"}>{plan.badge}</Badge>
                <h3 className="mt-4 text-2xl font-black text-white">{plan.name}</h3>
                <p className="mt-3 text-4xl font-black tracking-tight">{plan.price}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{plan.description}</p>
              </div>

              <ul className="flex flex-1 flex-col gap-3 text-sm text-slate-200">
                {plan.features.map((feature) => (
                  <li className="flex gap-2" key={feature}>
                    <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0", plan.recommended ? "text-emerald-300" : "text-slate-300")} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.checkoutUrl ? (
                <a
                  href={plan.checkoutUrl}
                  className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-7 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-md border border-white/10 bg-white/5 px-5 text-sm font-black text-slate-500"
                >
                  {plan.cta}
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
