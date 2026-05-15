"use client";

import { FormEvent, useState } from "react";
import { LogIn, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import type { UserPlan } from "@/types/auth";
import { saveSession } from "@/utils/authStorage";
import { hasCompletedOnboarding } from "@/utils/onboardingStorage";

const planOptions: Array<{ value: UserPlan; label: string }> = [
  { value: "basic", label: "Plano Básico" },
  { value: "starter", label: "Plano Starter" },
  { value: "premium", label: "Plano Premium" }
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AccessPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<UserPlan>("starter");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Informe seu nome para acessar o painel.");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("Informe um e-mail válido para acessar o painel.");
      return;
    }

    const now = new Date().toISOString();
    saveSession({
      user: {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        plan,
        createdAt: now,
        lastLoginAt: now
      },
      isAuthenticated: true,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
    });

    router.push(hasCompletedOnboarding() ? "/app" : "/onboarding");
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-16 text-slate-100">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Acesso local</p>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Entrar no painel AtendeZap IA</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            Este acesso simula o pós-compra usando localStorage. O backend real de autenticação pode ser conectado em uma
            próxima etapa sem mudar a experiência principal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-[#101821] p-6 shadow-2xl shadow-black/30">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
            <UserRound className="h-6 w-6" />
          </div>
          <div className="grid gap-4">
            {error ? <p className="rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm font-bold text-red-200">{error}</p> : null}
            <label className="grid gap-2 text-sm font-bold text-slate-200">
              Nome
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="field-input"
                placeholder="Seu nome"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-200">
              E-mail
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="field-input"
                placeholder="voce@email.com"
                type="email"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-200">
              Plano
              <select value={plan} onChange={(event) => setPlan(event.target.value as UserPlan)} className="field-input">
                {planOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
          >
            <LogIn className="h-4 w-4" />
            Entrar no painel
          </button>
        </form>
      </section>
    </main>
  );
}
