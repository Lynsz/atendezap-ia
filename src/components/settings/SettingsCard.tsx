import type { ReactNode } from "react";

export function SettingsCard({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
      <div className="mb-5">
        <h2 className="text-xl font-black text-white">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
