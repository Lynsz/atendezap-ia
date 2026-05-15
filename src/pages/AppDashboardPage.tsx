"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, Building2, CreditCard, LayoutDashboard, LogOut, MessageCircle, Settings, Users } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserPlanBadge } from "@/components/auth/UserPlanBadge";
import { clearSession, getCurrentSession } from "@/utils/authStorage";
import { getCurrentSubscription } from "@/utils/billingStorage";
import { getBusinessProfile } from "@/utils/onboardingStorage";

const dashboardLinks = [
  {
    href: "/atendezap",
    title: "Painel de atendimento",
    description: "Acompanhe conversas, status e sugestões de resposta.",
    icon: MessageCircle
  },
  {
    href: "/leads",
    title: "Clientes & Leads",
    description: "Organize oportunidades, origem, prioridade e funil.",
    icon: Users
  },
  {
    href: "/automacoes",
    title: "Automações IA",
    description: "Simule follow-ups, respostas e ações inteligentes.",
    icon: Bot
  },
  {
    href: "/assinatura",
    title: "Minha Assinatura",
    description: "Veja plano atual, cobrança mensal e upgrades.",
    icon: CreditCard
  },
  {
    href: "/onboarding",
    title: "Empresa",
    description: "Atualize dados da empresa, tom da IA e mensagem inicial.",
    icon: Settings
  }
];

function DashboardContent() {
  const router = useRouter();
  const session = getCurrentSession();
  const subscription = getCurrentSubscription();
  const businessProfile = getBusinessProfile();

  function handleLogout() {
    clearSession();
    router.push("/acesso");
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-8 text-slate-100">
      <section className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                <LayoutDashboard className="h-4 w-4" />
                Área do cliente
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white">Painel AtendeZap IA</h1>
              <p className="mt-2 text-sm text-slate-400">
                Olá, {session?.user.name || "cliente"}. Escolha um módulo para continuar.
              </p>
              {businessProfile ? (
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-200">
                    <Building2 className="h-3.5 w-3.5 text-emerald-300" />
                    {businessProfile.businessName}
                  </span>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-emerald-200">
                    Tom IA: {businessProfile.aiTone}
                  </span>
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {subscription ? <UserPlanBadge plan={subscription.planId} /> : session ? <UserPlanBadge plan={session.user.plan} /> : null}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 transition hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {dashboardLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                href={item.href}
                className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20 transition hover:border-emerald-400/50 hover:bg-emerald-400/10"
                key={item.href}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-black text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default function AppDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
