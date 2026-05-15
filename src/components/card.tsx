import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-slate-200 bg-white p-6 shadow-sm", className)} {...props} />;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-extrabold text-ink">{children}</h3>;
}
