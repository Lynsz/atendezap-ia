import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Alert({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "error" | "success" }) {
  return (
    <div
      className={cn("rounded-md border px-4 py-3 text-sm", {
        "border-sky-200 bg-sky-50 text-sky-900": tone === "info",
        "border-red-200 bg-red-50 text-red-900": tone === "error",
        "border-brand-100 bg-brand-50 text-brand-900": tone === "success"
      })}
    >
      {children}
    </div>
  );
}
