import type { ReactNode } from "react";

export function SectionTitle({ title, eyebrow, children }: { title: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow ? <p className="mb-2 text-sm font-bold uppercase tracking-wide text-brand-700">{eyebrow}</p> : null}
      <h2 className="text-3xl font-extrabold tracking-tight text-ink md:text-4xl">{title}</h2>
      {children ? <p className="mt-4 text-base leading-7 text-slate-600">{children}</p> : null}
    </div>
  );
}
