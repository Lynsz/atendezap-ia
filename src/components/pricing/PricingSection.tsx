import { createClient } from "@supabase/supabase-js";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/badge";
import { getCheckoutUrl } from "@/config/checkout";
import { cn } from "@/lib/utils";

type PricingPlan = {
  id: "starter" | "pro" | "premium";
  name: string;
  price: string;
  recurringPrice?: string;
  description: string;
  checkoutUrl: string;
  cta: string;
  badge: string;
  recommended?: boolean;
  responseLimit: number;
  features: string[];
};

type PlanRow = {
  name: string;
  price: number | string | null;
  response_limit: number | null;
};

const fallbackPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "R$ 49/mês",
    description: "Para quem está começando ou tem baixo volume de mensagens.",
    checkoutUrl: getCheckoutUrl("starter"),
    cta: "Começar no Starter",
    badge: "Entrada",
    responseLimit: 150,
    features: [
      "Até 150 respostas com IA por mês",
      "Cadastro do negócio, serviço ou atividade",
      "Geração de respostas com IA",
      "Dashboard",
      "Histórico básico",
      "Modelos básicos de respostas"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 29 no primeiro mês",
    recurringPrice: "Depois, R$ 97/mês",
    description: "Para quem usa WhatsApp todos os dias para atender, vender ou responder clientes.",
    checkoutUrl: getCheckoutUrl("pro"),
    cta: "Começar por R$ 29",
    badge: "Mais recomendado",
    recommended: true,
    responseLimit: 600,
    features: [
      "Até 600 respostas com IA por mês",
      "Tudo do Starter",
      "Histórico completo",
      "Organização de clientes",
      "Respostas mais personalizadas",
      "Modelos por tipo de atendimento",
      "Acesso a melhorias futuras",
      "Prioridade nas atualizações"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 197/mês",
    description: "Para quem tem maior volume de atendimento ou quer mais recursos.",
    checkoutUrl: getCheckoutUrl("premium"),
    cta: "Assinar Premium",
    badge: "Alto volume",
    responseLimit: 2000,
    features: [
      "Até 2.000 respostas com IA por mês",
      "Tudo do Pro",
      "Biblioteca premium de respostas",
      "Modelos avançados para vendas, suporte, cobrança e pós-venda",
      "Acesso antecipado a novas funções",
      "Suporte prioritário assíncrono",
      "Bônus de onboarding gravado"
    ]
  }
];

function normalizePlanName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function loadFallbackForRow(plan: PlanRow) {
  const normalized = normalizePlanName(plan.name);
  if (normalized === "inicial") return fallbackPlans[0];
  return fallbackPlans.find((item) => item.id === normalized || normalizePlanName(item.name) === normalized);
}

async function loadPlans(): Promise<PricingPlan[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) return fallbackPlans;

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data, error } = await supabase.from("plans").select("name,price,response_limit").order("price", { ascending: true });
  if (error || !data?.length) return fallbackPlans;

  const mergedPlans = (data as PlanRow[]).reduce<PricingPlan[]>((plans, plan) => {
    const fallback = loadFallbackForRow(plan);
    if (!fallback) return plans;

    plans.push(fallback);

    return plans;
  }, []);

  return mergedPlans.length ? mergedPlans : fallbackPlans;
}

export async function PricingSection() {
  const plans = await loadPlans();

  return (
    <section className="bg-[#090d12] py-16 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-300">Planos mensais</p>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Escolha seu plano</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Planos para pessoas, autônomos e pequenos negócios que querem responder com mais rapidez e organizar melhor o atendimento no WhatsApp.
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
                <p className="mt-3 text-4xl font-black tracking-tight">{plan.price}</p>
                {plan.recurringPrice ? <p className="mt-1 text-base font-black text-emerald-200">{plan.recurringPrice}</p> : null}
                {plan.id === "pro" ? <p className="mt-2 text-xs font-bold text-slate-400">Oferta válida para novos usuários.</p> : null}
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

              {plan.checkoutUrl ? (
                <a
                  href={plan.checkoutUrl}
                  className={cn(
                    "mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-md px-5 text-sm font-black transition",
                    plan.recommended ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300" : "bg-white text-slate-950 hover:bg-slate-100"
                  )}
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-7 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-md border border-white/10 bg-white/5 px-5 text-sm font-black text-slate-500"
                >
                  Checkout em configuração
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
