"use client";

import { ChevronDown } from "lucide-react";
import { trackEvent } from "@/lib/tracking";

export type FaqItem = {
  question: string;
  answer: string;
};

type ConversionFaqProps = {
  items: FaqItem[];
};

export function ConversionFaq({ items }: ConversionFaqProps) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <details
          className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm open:border-emerald-200 open:bg-emerald-50/40"
          key={item.question}
          onToggle={(event) => {
            if (event.currentTarget.open) {
              trackEvent("faq_open", {
                question: item.question
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
