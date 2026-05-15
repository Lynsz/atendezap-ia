"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Informe e-mail e senha.");
      return;
    }

    if (!auth.isConfigured) {
      setError("Supabase nao configurado. Confira as variaveis de ambiente.");
      return;
    }

    setLoading(true);
    const { error: signInError } = await auth.signIn(email, password);
    setLoading(false);

    if (signInError) {
      setError("Nao foi possivel entrar. Confira seus dados.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-10 text-slate-100">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center">
        <form onSubmit={handleSubmit} className="w-full rounded-lg border border-white/10 bg-[#101821] p-6 shadow-2xl shadow-black/30">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-400 text-slate-950">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">AtendeZap IA</p>
              <h1 className="text-2xl font-black text-white">Entrar</h1>
            </div>
          </div>

          {error ? <div className="mb-4 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm font-bold text-red-200">{error}</div> : null}

          <label className="mb-3 grid gap-2 text-sm font-bold text-slate-300">
            E-mail
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" type="email" autoComplete="email" />
          </label>
          <label className="mb-5 grid gap-2 text-sm font-bold text-slate-300">
            Senha
            <input value={password} onChange={(event) => setPassword(event.target.value)} className="field-input" type="password" autoComplete="current-password" />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Entrando..." : "Entrar no painel"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-400">
            Ainda nao tem conta?{" "}
            <Link href="/cadastro" className="font-black text-emerald-300">
              Criar cadastro
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
