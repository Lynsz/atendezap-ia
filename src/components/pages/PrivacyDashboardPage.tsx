"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, Download, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getDataRequestStatusLabel, getDataRequestTypeLabel, type DataRequestType } from "@/lib/data-requests";
import { createDataRequest, listDataRequests, type DataRequest } from "@/services/data-requests";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function statusClass(status: string) {
  if (status === "completed") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-100";
  if (status === "processing") return "border-sky-400/30 bg-sky-400/10 text-sky-100";
  if (status === "rejected") return "border-red-400/30 bg-red-500/10 text-red-100";
  return "border-amber-400/30 bg-amber-400/10 text-amber-100";
}

function PrivacyDashboardContent() {
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingType, setSubmittingType] = useState<DataRequestType | "">("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await listDataRequests();
      setRequests(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Nao foi possivel carregar suas solicitacoes agora.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadRequests();
    });
  }, [loadRequests]);

  async function requestData(type: DataRequestType) {
    setSubmittingType(type);
    setError("");
    setSuccess("");

    try {
      const result = await createDataRequest(type);
      setRequests((current) => {
        const withoutDuplicate = current.filter((item) => item.id !== result.dataRequest.id);
        return [result.dataRequest, ...withoutDuplicate].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      });
      setSuccess(
        result.alreadyPending
          ? "Ja existe uma solicitacao pendente ou em processamento para esse tipo."
          : "Solicitacao criada. O atendimento inicial sera manual e seguro."
      );
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel criar sua solicitacao agora.");
    } finally {
      setSubmittingType("");
    }
  }

  return (
    <main className="min-h-screen bg-[#090d12] px-4 py-6 text-white">
      <section className="mx-auto max-w-6xl">
        <header className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Privacidade</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight">Seus dados no AtendeZap IA</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Veja um resumo dos dados armazenados e solicite exportacao ou exclusao da sua conta. Nesta fase, as solicitacoes sao analisadas manualmente para evitar apagar dados de assinatura por engano.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard" className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 bg-white/10 px-4 text-xs font-black text-slate-100 hover:bg-white/15">
                Voltar ao dashboard
              </Link>
              <button type="button" onClick={() => void loadRequests()} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 text-xs font-black text-slate-100 hover:bg-white/15">
                <RefreshCw className="h-3.5 w-3.5" />
                Atualizar
              </button>
            </div>
          </div>
        </header>

        {error ? <p className="mt-4 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm font-bold text-red-100">{error}</p> : null}
        {success ? <p className="mt-4 rounded-md border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm font-bold text-emerald-100">{success}</p> : null}

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <ShieldCheck className="mb-4 h-8 w-8 text-emerald-300" />
            <h2 className="text-lg font-black">Dados armazenados</h2>
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-300">
              <li>Conta, e-mail e identificador interno.</li>
              <li>Perfil, onboarding e informacoes do negocio.</li>
              <li>Historico de respostas, respostas salvas e feedbacks.</li>
              <li>Assinatura local sincronizada com Stripe.</li>
              <li>Eventos internos e metadados seguros de operacao.</li>
            </ul>
          </article>

          <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <h2 className="text-lg font-black">Documentos</h2>
            <div className="mt-4 grid gap-2 text-sm font-bold">
              <Link className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-slate-200 hover:bg-white/10" href="/privacidade">
                Politica de privacidade
              </Link>
              <Link className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-slate-200 hover:bg-white/10" href="/termos">
                Termos de uso
              </Link>
              <a className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-slate-200 hover:bg-white/10" href="mailto:suporte@atendezapia.com.br">
                Contato de suporte
              </a>
            </div>
          </article>

          <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
            <h2 className="text-lg font-black">Solicitar controle dos dados</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">A exportacao e a exclusao ainda sao tratadas manualmente para preservar seguranca, assinatura e registros obrigatorios.</p>
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={() => void requestData("export")}
                disabled={Boolean(submittingType)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-black text-slate-950 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className="h-4 w-4" />
                {submittingType === "export" ? "Solicitando..." : "Solicitar exportacao dos meus dados"}
              </button>
              <button
                type="button"
                onClick={() => void requestData("deletion")}
                disabled={Boolean(submittingType)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-red-400/30 bg-red-500/10 px-4 text-sm font-black text-red-100 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {submittingType === "deletion" ? "Solicitando..." : "Solicitar exclusao da minha conta e dados"}
              </button>
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Historico</p>
              <h2 className="mt-2 text-2xl font-black">Solicitacoes anteriores</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {loading ? (
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-6 text-center text-sm font-bold text-slate-300">
                Carregando solicitacoes...
              </div>
            ) : requests.length ? (
              requests.map((item) => (
                <article className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={item.id}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-black text-white">{getDataRequestTypeLabel(item.type)}</h3>
                      <p className="mt-2 text-sm text-slate-400">Criada em {formatDate(item.created_at)}. Atualizada em {formatDate(item.updated_at)}.</p>
                      {item.notes ? <p className="mt-2 rounded-md bg-[#0b1118] p-3 text-sm leading-6 text-slate-300">Nota: {item.notes}</p> : null}
                    </div>
                    <span className={`inline-flex min-h-8 items-center gap-2 rounded-full border px-3 text-xs font-black ${statusClass(item.status)}`}>
                      <Clock3 className="h-3.5 w-3.5" />
                      {getDataRequestStatusLabel(item.status)}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-white/15 bg-white/[0.04] p-8 text-center text-sm text-slate-400">
                <CheckCircle2 className="mx-auto mb-4 h-8 w-8 text-slate-500" />
                <p className="font-bold text-slate-200">Nenhuma solicitacao criada ainda.</p>
                <p className="mt-2">Quando voce pedir exportacao ou exclusao, o acompanhamento aparecera aqui.</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default function PrivacyDashboardPage() {
  return (
    <ProtectedRoute>
      <PrivacyDashboardContent />
    </ProtectedRoute>
  );
}
