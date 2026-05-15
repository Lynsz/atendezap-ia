import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const statusClasses = {
  ok: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  warning: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  error: "border-red-400/25 bg-red-500/10 text-red-200",
  info: "border-sky-400/25 bg-sky-400/10 text-sky-200"
};

export function SystemStatusCard({
  title,
  value,
  description,
  status,
  icon: Icon
}: {
  title: string;
  value: string;
  description: ReactNode;
  status: "ok" | "warning" | "error" | "info";
  icon?: LucideIcon;
}) {
  return (
    <article className={cn("rounded-lg border p-5 shadow-xl shadow-black/20", statusClasses[status])}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-black text-white">{value}</p>
        </div>
        {Icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white/10 text-current">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      <div className="text-sm leading-6 text-slate-300">{description}</div>
    </article>
  );
}
