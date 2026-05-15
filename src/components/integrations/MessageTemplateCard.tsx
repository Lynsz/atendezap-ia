import { Edit3, Trash2 } from "lucide-react";
import type { WhatsAppTemplate } from "@/types/whatsapp";

export function MessageTemplateCard({
  template,
  onEdit,
  onDelete
}: {
  template: WhatsAppTemplate;
  onEdit: (template: WhatsAppTemplate) => void;
  onDelete: (templateId: string) => void;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-white">{template.name}</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">{template.category}</p>
        </div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-black text-emerald-200">
          {template.status}
        </span>
      </div>
      <p className="min-h-20 whitespace-pre-wrap text-sm leading-6 text-slate-300">{template.content}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(template)}
          className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 text-xs font-black text-slate-200 transition hover:bg-white/10"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Editar
        </button>
        <button
          type="button"
          onClick={() => onDelete(template.id)}
          className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-md border border-red-400/30 bg-red-500/10 text-xs font-black text-red-200 transition hover:bg-red-500/15"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Excluir
        </button>
      </div>
    </article>
  );
}
