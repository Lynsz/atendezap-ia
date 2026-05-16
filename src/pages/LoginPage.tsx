'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, MessageCircle, UserPlus } from 'lucide-react';
import { SUPABASE_CONNECTION_ERROR, useAuth } from '@/hooks/useAuth';

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, loading } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isSignup = mode === 'signup';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    if (!normalizedEmail) {
      setErrorMessage('Informe seu e-mail.');
      return;
    }

    if (!password) {
      setErrorMessage('Informe sua senha.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (isSignup && !normalizedName) {
      setErrorMessage('Informe seu nome para criar a conta.');
      return;
    }

    setSubmitting(true);

    try {
      if (isSignup) {
        const { error } = await signUp({
          name: normalizedName,
          email: normalizedEmail,
          password,
        });

        if (error) {
          setErrorMessage(error || SUPABASE_CONNECTION_ERROR);
          return;
        }

        setSuccessMessage(
          'Conta criada. Se a confirmação por e-mail estiver ativada no Supabase, confirme seu e-mail antes de entrar.',
        );

        setMode('login');
        setPassword('');
        return;
      }

      const { error } = await signIn({
        email: normalizedEmail,
        password,
      });

      if (error) {
        setErrorMessage(error || SUPABASE_CONNECTION_ERROR);
        return;
      }

      router.replace('/app');
    } finally {
      setSubmitting(false);
    }
  }

  function toggleMode() {
    setMode((current) => (current === 'login' ? 'signup' : 'login'));
    setErrorMessage('');
    setSuccessMessage('');
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-2">
          <section className="relative hidden bg-gradient-to-br from-emerald-500/20 via-slate-950 to-slate-950 p-10 lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.2),transparent_30%)]" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-300">
                      AtendeZap IA
                    </p>
                    <h1 className="text-2xl font-bold">Assistente para WhatsApp</h1>
                  </div>
                </div>

                <div className="mt-16">
                  <h2 className="max-w-md text-4xl font-bold leading-tight">
                    Atenda melhor no WhatsApp com respostas criadas por IA.
                  </h2>
                  <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                    Cadastre seu negócio, cole a pergunta do cliente e receba uma
                    resposta profissional pronta para copiar e enviar.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Respostas profissionais em segundos.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Histórico salvo e clientes organizados.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Pensado para pequenos negócios brasileiros.
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-300">
                      AtendeZap IA
                    </p>
                    <h1 className="text-xl font-bold">Assistente para WhatsApp</h1>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-emerald-300">
                  {isSignup ? 'Criar acesso' : 'Entrar no painel'}
                </p>
                <h2 className="mt-2 text-3xl font-bold">
                  {isSignup ? 'Crie sua conta' : 'Acesse sua conta'}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {isSignup
                    ? 'Comece cadastrando seu acesso para usar o AtendeZap IA.'
                    : 'Entre para gerar respostas, salvar histórico e organizar clientes.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                {isSignup && (
                  <label className="block">
                    <span className="text-sm font-medium text-slate-300">Nome</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Seu nome"
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                      autoComplete="name"
                    />
                  </label>
                )}

                <label className="block">
                  <span className="text-sm font-medium text-slate-300">E-mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@email.com"
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                    autoComplete="email"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-300">Senha</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                  />
                </label>

                {errorMessage && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSignup ? (
                    <UserPlus className="h-4 w-4" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}

                  {submitting
                    ? 'Processando...'
                    : isSignup
                      ? 'Criar conta'
                      : 'Entrar'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-400">
                {isSignup ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-semibold text-emerald-300 hover:text-emerald-200"
                >
                  {isSignup ? 'Entrar' : 'Criar conta'}
                </button>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-400">
                <strong className="text-slate-200">Dica:</strong> se aparecer erro de
                conexão, abra <span className="font-mono">/debug/supabase</span> e
                confira se as variáveis do Supabase estão sendo lidas.
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}