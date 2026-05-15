import { redirect } from "next/navigation";
import { Alert } from "@/components/alert";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { KitForm } from "@/components/kit-form";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function GeneratePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = getSupabaseAdmin();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, customer_id, access_token_used, customers(name, email)")
    .eq("access_token", token)
    .maybeSingle();

  if (error || !order) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <Alert tone="error">Link inválido ou expirado. Entre em contato com o suporte para verificar seu acesso.</Alert>
        <div className="mt-6">
          <Button href="/suporte" variant="ghost">
            Ir para suporte
          </Button>
        </div>
      </main>
    );
  }

  if (order.access_token_used) {
    const { data: kit } = await supabase.from("kits").select("id").eq("order_id", order.id).maybeSingle();
    if (kit?.id) redirect(`/kit/${kit.id}`);

    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <Alert tone="error">
          Este link já foi usado, mas não encontramos o kit gerado. Fale com o suporte para recuperarmos seu acesso.
        </Alert>
        <div className="mt-6">
          <Button href="/suporte" variant="ghost">
            Ir para suporte
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-ink">Gere seu kit de atendimento</h1>
        <p className="mt-3 leading-7 text-slate-600">
          Preencha os dados do negócio com detalhes. Quanto mais contexto, melhor a personalização do material.
        </p>
      </div>
      <Card>
        <KitForm token={token} />
      </Card>
    </main>
  );
}
