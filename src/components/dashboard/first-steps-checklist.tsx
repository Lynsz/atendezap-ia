import { CheckCircle2 } from "lucide-react";

export type FirstStepTarget = "business" | "assistant" | "library" | "templates" | "billing" | "pricing";

export type FirstStepItem = {
  label: string;
  done: boolean;
  target: FirstStepTarget;
  detail: string;
};

type FirstStepsChecklistProps = {
  steps: FirstStepItem[];
  completedCount: number;
  onSelectStep: (target: FirstStepTarget) => void;
};

export function FirstStepsChecklist({ steps, completedCount, onSelectStep }: FirstStepsChecklistProps) {
  return (
    <section className="mb-5 rounded-lg border border-white/10 bg-[#101821] p-5 shadow-xl shadow-black/20">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Primeiros passos</p>
          <h2 className="mt-2 text-xl font-black text-white">Comece por aqui</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Confira os dados do negócio, cole uma mensagem de cliente, gere sua primeira resposta e copie ou salve antes de enviar manualmente.
          </p>
        </div>
        <span className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-black text-slate-200">
          {completedCount}/{steps.length} concluídos
        </span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => (
          <button
            key={step.label}
            type="button"
            onClick={() => onSelectStep(step.target)}
            className={`min-h-32 rounded-lg border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 ${
              step.done
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-50"
                : "border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.07]"
            }`}
          >
            <span className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full ${step.done ? "bg-emerald-300 text-slate-950" : "bg-white/10 text-slate-400"}`}>
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <span className="block text-sm font-black">{step.label}</span>
            <span className="mt-2 block text-xs leading-5 text-slate-400">{step.detail}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
