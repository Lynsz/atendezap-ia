import type { ReactNode } from "react";

export function SettingsField({
  label,
  description,
  children
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-200">
      <span>{label}</span>
      {description ? <span className="text-xs font-medium leading-5 text-slate-500">{description}</span> : null}
      {children}
    </label>
  );
}
