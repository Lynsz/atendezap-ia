import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { Alert } from "@/components/alert";
import { Button } from "@/components/button";
import { Card, CardTitle } from "@/components/card";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function stringList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export default async function KitPage({ params }: { params: Promise<{ kitId: string }> }) {
  const { kitId } = await params;
  const supabase = getSupabaseAdmin();
  const { data: kit, error } = await supabase
    .from("kits")
    .select("id, business_name, niche, ai_output, created_at")
    .eq("id", kitId)
    .maybeSingle();

  if (error || !kit) notFound();

  const output = kit.ai_output as Record<string, unknown>;
  const quickReplies = Array.isArray(output.quick_replies) ? output.quick_replies.slice(0, 5) : [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-ink">Kit de atendimento gerado</h1>
          <p className="mt-2 text-slate-600">
            {kit.business_name} â€¢ {new Date(kit.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <Button href={`/api/download/${kit.id}`} className="gap-2">
          <Download className="h-4 w-4" /> Baixar PDF
        </Button>
      </div>

      <Alert tone="info">Copie as mensagens e cadastre como respostas rápidas no WhatsApp Business.</Alert>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardTitle>Mensagem de boas-vindas</CardTitle>
          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">{String(output.welcome_message || "")}</p>
        </Card>
        <Card>
          <CardTitle>Mensagem de ausência</CardTitle>
          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">{String(output.away_message || "")}</p>
        </Card>
      </div>

      <Card className="mt-6">
        <CardTitle>Respostas rápidas</CardTitle>
        <div className="mt-4 grid gap-4">
          {quickReplies.map((reply, index) => {
            const item = reply as { title?: unknown; message?: unknown };
            return (
              <div className="rounded-md bg-slate-50 p-4" key={`${String(item.title)}-${index}`}>
                <p className="font-bold text-ink">{String(item.title || `Resposta ${index + 1}`)}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{String(item.message || "")}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardTitle>Follow-ups</CardTitle>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            {stringList(output.follow_ups).slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle>Fluxo de atendimento</CardTitle>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
            {stringList(output.service_flow).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </Card>
      </div>
    </main>
  );
}
