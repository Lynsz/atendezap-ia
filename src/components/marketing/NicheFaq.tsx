"use client";

import { ChevronDown } from "lucide-react";
import type { NicheFaq as NicheFaqItem, NicheSlug } from "@/config/niches";
import { trackEvent } from "@/lib/tracking";

type NicheFaqProps = {
  niche: NicheSlug;
  items: NicheFaqItem[];
};

export function NicheFaq({ niche, items }: NicheFaqProps) {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      {items.map((item, index) => (
        <details
          className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm open:border-emerald-200 open:bg-emerald-50/50"
          key={item.question}
          onToggle={(event) => {
            if (event.currentTarget.open) {
              trackEvent("niche_faq_opened", {
                niche,
                source: "niche_landing",
                faq_index: index
              });
            }
          }}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-black text-ink">
            <span>{item.question}</span>
            <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180" />
          </summary>
          <p className="mt-4 text-sm leading-6 text-slate-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
