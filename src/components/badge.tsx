import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700", className)}>
      {children}
    </span>
  );
}
