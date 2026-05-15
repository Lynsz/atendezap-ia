import { cn } from "@/lib/utils";

export function SettingsToggle({
  checked,
  onChange,
  label,
  description
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.07]"
    >
      <span>
        <span className="block text-sm font-black text-white">{label}</span>
        {description ? <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span> : null}
      </span>
      <span
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full border transition",
          checked ? "border-emerald-400 bg-emerald-400" : "border-white/10 bg-slate-800"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition",
            checked ? "left-6" : "left-1"
          )}
        />
      </span>
    </button>
  );
}
