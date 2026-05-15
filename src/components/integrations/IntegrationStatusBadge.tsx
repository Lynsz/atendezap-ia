import { cn } from "@/lib/utils";

type IntegrationStatus = "simulated" | "pending" | "active" | "error";

const labels: Record<IntegrationStatus, string> = {
  simulated: "Simulado",
  pending: "Pendente",
  active: "Ativo",
  error: "Erro"
};

const classes: Record<IntegrationStatus, string> = {
  simulated: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  pending: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  active: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  error: "border-red-400/30 bg-red-500/10 text-red-200"
};

export function IntegrationStatusBadge({ status, className }: { status: IntegrationStatus; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-black", classes[status], className)}>
      {labels[status]}
    </span>
  );
}
