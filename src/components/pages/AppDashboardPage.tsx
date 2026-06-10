'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Building2,
  Crown,
  History,
  MessageCircle,
  Users,
  Wand2,
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

type Business = {
  id: string;
  business_name: string;
  business_area: string | null;
  business_type?: string | null;
  tone?: string | null;
  description?: string | null;
};

type Subscription = {
  id: string;
  plan_name: string;
  status: string;
  current_period_end: string | null;
};

type DashboardStats = {
  customersCount: number;
  responsesCount: number;
  monthlyResponsesCount: number;
};

const PLAN_LIMITS: Record<string, number> = {
  free: 30,
  trial: 30,
  Inicial: 150,
  Starter: 150,
  starter: 150,
  Pro: 600,
  pro: 600,
  Premium: 2000,
  premium: 2000,
};

export default function AppDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, signOut } = useAuth();

  const [business, setBusiness] = useState<Business | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    customersCount: 0,
    responsesCount: 0,
    monthlyResponsesCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const planName = subscription?.plan_name ?? 'free';
  const planLimit = PLAN_LIMITS[planName] ?? PLAN_LIMITS.free;

  const usagePercent = Math.min(
    Math.round((stats.monthlyResponsesCount / planLimit) * 100),
    100,
  );

  const usageLabel = useMemo(() => {
    return `${stats.monthlyResponsesCount} / ${planLimit}`;
  }, [stats.monthlyResponsesCount, planLimit]);

  function getCurrentUsageMonth() {
    const now = new Date();
    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  }

  useEffect(() => {
    if (!user) return;

    const currentUser = user;

    async function loadDashboard() {
      setLoading(true);
      setErrorMessage('');

      try {
        const [
          businessResult,
          profileResult,
          subscriptionResult,
          customersResult,
          responsesResult,
          monthlyUsageResult,
        ] = await Promise.all([
          supabase
            .from('businesses')
            .select('id, business_name, business_area, business_type')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),

          supabase
            .from('user_profiles')
            .select('id, business_name, business_type, tone, description')
            .eq('user_id', currentUser.id)
            .limit(1)
            .maybeSingle(),

          supabase
            .from('subscriptions')
            .select('id, plan_name, status, current_period_end')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),

          supabase
            .from('customers')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', currentUser.id),

          supabase
            .from('generated_responses')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', currentUser.id),

          supabase
            .from('ai_usage')
            .select('count')
            .eq('user_id', currentUser.id)
            .eq('month', getCurrentUsageMonth())
            .maybeSingle(),
        ]);

        if (businessResult.error) throw businessResult.error;
        if (profileResult.error) throw profileResult.error;
        if (subscriptionResult.error) throw subscriptionResult.error;
        if (customersResult.error) throw customersResult.error;
        if (responsesResult.error) throw responsesResult.error;
        if (monthlyUsageResult.error) throw monthlyUsageResult.error;

        setBusiness(
          businessResult.data ??
            (profileResult.data
              ? {
                  id: profileResult.data.id,
                  business_name: profileResult.data.business_name || 'Negócio sem nome',
                  business_area: profileResult.data.business_type,
                  business_type: profileResult.data.business_type,
                  tone: profileResult.data.tone,
                  description: profileResult.data.description,
                }
              : null),
        );

        setSubscription(subscriptionResult.data ?? {
          id: 'initial-trigger-pending',
          plan_name: 'free',
          status: 'trial',
          current_period_end: null,
        });

        setStats({
          customersCount: customersResult.count ?? 0,
          responsesCount: responsesResult.count ?? 0,
          monthlyResponsesCount: Number((monthlyUsageResult.data as { count?: number } | null)?.count || 0),
        });
      } catch (error) {
        console.error('[Dashboard load failed]', error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o dashboard.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user]);

  async function handleLogout() {
    await signOut();
    window.location.href = '/login';
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-950/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
              <MessageCircle className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-300">AtendeZap IA</p>
              <h1 className="text-base font-bold">Painel</h1>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="/dashboard" className="hover:text-white">
              Meu negócio
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              Gerar resposta
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              Clientes
            </Link>
            <Link href="/plans" className="hover:text-white">
              Planos
            </Link>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-400 hover:text-red-300"
          >
            Sair
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-emerald-300">
              {user?.email ?? 'Usuário'}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Visão geral do seu atendimento
            </h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              Gere respostas com IA, organize clientes e acompanhe o uso mensal do
              AtendeZap IA.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
          >
            <Wand2 className="h-4 w-4" />
            Gerar resposta
          </Link>
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-3xl border border-slate-800 bg-slate-900"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<Crown className="h-5 w-5" />}
                label="Plano atual"
                value={planName}
                description={`Status: ${subscription?.status ?? 'trial'}`}
              />

              <StatCard
                icon={<BarChart3 className="h-5 w-5" />}
                label="Uso mensal"
                value={usageLabel}
                description={`${usagePercent}% do limite usado`}
              />

              <StatCard
                icon={<Users className="h-5 w-5" />}
                label="Clientes"
                value={String(stats.customersCount)}
                description="Leads cadastrados no painel"
              />

              <StatCard
                icon={<History className="h-5 w-5" />}
                label="Respostas"
                value={String(stats.responsesCount)}
                description="Histórico total gerado"
              />
            </div>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Próximos passos</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      Siga essa ordem para deixar seu atendimento pronto.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  <ActionItem
                    done={Boolean(business)}
                    title="Cadastrar seu negócio"
                    description={
                      business
                        ? `${business.business_name} cadastrado.`
                        : 'Informe serviços, preços, horários e tom de voz.'
                    }
                    href="/dashboard"
                    buttonText={business ? 'Editar' : 'Cadastrar'}
                  />

                  <ActionItem
                    done={stats.monthlyResponsesCount > 0}
                    title="Gerar primeira resposta"
                    description="Cole uma pergunta real de cliente e gere uma resposta profissional."
                    href="/dashboard"
                    buttonText="Gerar"
                  />

                  <ActionItem
                    done={stats.customersCount > 0}
                    title="Cadastrar clientes"
                    description="Organize leads por status: novo, orçamento enviado ou venda concluída."
                    href="/dashboard"
                    buttonText="Clientes"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">Meu negócio</h3>
                      <p className="text-sm text-slate-400">
                        {business
                          ? business.business_name
                          : 'Nenhum negócio cadastrado.'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300"
                  >
                    {business ? 'Editar negócio' : 'Cadastrar negócio'}
                  </Link>
                </div>

                <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                  <h3 className="font-bold text-emerald-100">Upgrade</h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-100/80">
                    Aumente seu limite mensal e use o AtendeZap IA em mais
                    atendimentos.
                  </p>

                  <Link
                    href="/plans"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                  >
                    Ver planos
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-emerald-300">
        {icon}
      </div>

      <p className="mt-5 text-sm text-slate-400">{label}</p>
      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function ActionItem({
  done,
  title,
  description,
  href,
  buttonText,
}: {
  done: boolean;
  title: string;
  description: string;
  href: string;
  buttonText: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span
            className={
              done
                ? 'h-2.5 w-2.5 rounded-full bg-emerald-400'
                : 'h-2.5 w-2.5 rounded-full bg-yellow-400'
            }
          />
          <h4 className="font-semibold">{title}</h4>
        </div>

        <p className="mt-2 text-sm text-slate-400">{description}</p>
      </div>

      <Link
        href={href}
        className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300"
      >
        {buttonText}
      </Link>
    </div>
  );
}
