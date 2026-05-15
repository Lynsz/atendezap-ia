import { CheckCircle2, PauseCircle, PlayCircle, RefreshCw, Smartphone, Unplug } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WhatsAppConnection, WhatsAppConnectionStatus } from "@/types/whatsapp";

const statusLabels: Record<WhatsAppConnectionStatus, string> = {
  disconnected: "Desconectado",
  connecting: "Conectando",
  connected: "Conectado",
  error: "Erro",
  paused: "Pausado"
};

const statusClasses: Record<WhatsAppConnectionStatus, string> = {
  disconnected: "border-slate-400/30 bg-slate-400/10 text-slate-200",
  connecting: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  connected: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  error: "border-red-400/30 bg-red-500/10 text-red-200",
  paused: "border-amber-400/30 bg-amber-400/10 text-amber-200"
};

function formatDateTime(value?: string) {
  if (!value) return "Nunca";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function WhatsAppStatusBadge({ status }: { status: WhatsAppConnectionStatus }) {
  return (
    <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-black", statusClasses[status])}>
      {statusLabels[status]}
    </span>
  );
}

export function WhatsAppStatusCard({
  connection,
  onConnect,
  onDisconnect,
  onPause,
  onResume,
  onSimulateImport
}: {
  connection: WhatsAppConnection;
  onConnect: () => void;
  onDisconnect: () => void;
  onPause: () => void;
  onResume: () => void;
  onSimulateImport: () => void;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
            <Smartphone className="h-4 w-4" />
            Canal de atendimento
          </p>
          <h2 className="text-2xl font-black text-white">{connection.displayName || "WhatsApp Demo"}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Provider: {connection.provider}. Nenhuma mensagem real será enviada ou recebida.
          </p>
        </div>
        <WhatsAppStatusBadge status={connection.status} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Número</p>
          <p className="mt-2 font-black text-white">{connection.phoneNumber || "Não conectado"}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Nome exibido</p>
          <p className="mt-2 font-black text-white">{connection.displayName || "Não definido"}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Empresa</p>
          <p className="mt-2 font-black text-white">{connection.businessName || "Não definida"}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Última sincronização</p>
          <p className="mt-2 font-black text-white">{formatDateTime(connection.lastSyncAt)}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={onConnect}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4" />
          Conectar modo demo
        </button>
        <button
          type="button"
          onClick={onDisconnect}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-bold text-slate-200 transition hover:bg-white/10"
        >
          <Unplug className="h-4 w-4" />
          Desconectar
        </button>
        <button
          type="button"
          onClick={onPause}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-amber-400/30 bg-amber-400/10 px-4 text-sm font-bold text-amber-200 transition hover:bg-amber-400/20"
        >
          <PauseCircle className="h-4 w-4" />
          Pausar conexão
        </button>
        <button
          type="button"
          onClick={onResume}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-sky-400/30 bg-sky-400/10 px-4 text-sm font-bold text-sky-200 transition hover:bg-sky-400/20"
        >
          <PlayCircle className="h-4 w-4" />
          Retomar conexão
        </button>
        <button
          type="button"
          onClick={onSimulateImport}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-4 text-sm font-bold text-emerald-200 transition hover:bg-emerald-400/20"
        >
          <RefreshCw className="h-4 w-4" />
          Simular importação de mensagens
        </button>
      </div>
    </article>
  );
}
