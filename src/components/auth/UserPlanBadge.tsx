import type { UserPlan } from "@/types/auth";
import { cn } from "@/lib/utils";

const planLabels: Record<UserPlan, string> = {
  basic: "Plano Básico",
  starter: "Plano Starter",
  premium: "Plano Premium"
};

const planClasses: Record<UserPlan, string> = {
  basic: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  starter: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  premium: "border-violet-400/30 bg-violet-400/10 text-violet-200"
};

export function UserPlanBadge({ plan, className }: { plan: UserPlan; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-black", planClasses[plan], className)}>
      {planLabels[plan]}
    </span>
  );
}
