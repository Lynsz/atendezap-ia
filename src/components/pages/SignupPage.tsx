"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, MessageCircle } from "lucide-react";
import { SUPABASE_CONNECTION_ERROR, useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase/browser";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const auth = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFeedback("");

    if (!name.trim() || !email.trim() || password.length < 6) {
      setError("Informe nome, e-mail e uma senha com pelo menos 6 caracteres.");
      return;
    }

    if (!auth.isConfigured) {
      setError(SUPABASE_CONNECTION_ERROR);
      return;
    }

    setLoading(true);
    const { data = { user: null, session: null }, error: signUpError } = await auth.signUp({ name, email, password }).catch((authError: unknown) => ({
      data: { user: null, session: null },
      error: authError instanceof Error ? authError : new Error("Não foi possível criar sua conta. Tente outro e-mail.")
    }));

    if (signUpError) {
      setLoading(false);
      setError(signUpError instanceof Error ? signUpError.message : signUpError || "Não foi possível criar sua conta. Tente outro e-mail.");
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        name,
        email
      });
    }

    setLoading(false);

    if (data.session) {
      router.push("/dashboard");
      return;
    }

    setFeedback("Cadastro criado. Se o Supabase exigir confirmacao, confira seu e-mail antes de entrar.");
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
              <h1 className="text-2xl font-black text-white">Criar conta</h1>
            </div>
          </div>

          {error ? <div className="mb-4 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm font-bold text-red-200">{error}</div> : null}
          {feedback ? <div className="mb-4 rounded-md border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm font-bold text-emerald-200">{feedback}</div> : null}

          <label className="mb-3 grid gap-2 text-sm font-bold text-slate-300">
            Nome
            <input value={name} onChange={(event) => setName(event.target.value)} className="field-input" autoComplete="name" />
          </label>
          <label className="mb-3 grid gap-2 text-sm font-bold text-slate-300">
            E-mail
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" type="email" autoComplete="email" />
          </label>
          <label className="mb-5 grid gap-2 text-sm font-bold text-slate-300">
            Senha
            <input value={password} onChange={(event) => setPassword(event.target.value)} className="field-input" type="password" autoComplete="new-password" />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" />
            {loading ? "Criando..." : "Criar conta"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-400">
            Ja tem conta?{" "}
            <Link href="/login" className="font-black text-emerald-300">
              Entrar
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
