import { CheckCircle2 } from "lucide-react";
import { Alert } from "@/components/alert";
import { Button } from "@/components/button";
import { Card } from "@/components/card";

export default function ObrigadoPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <Card className="text-center">
        <CheckCircle2 className="mx-auto mb-5 h-12 w-12 text-brand-600" />
        <h1 className="text-3xl font-black text-ink">Obrigado pela compra</h1>
        <p className="mt-4 text-slate-600">
          Assim que a Kiwify confirmar o pagamento, enviaremos seu link mágico por e-mail para gerar o kit.
        </p>
        <Alert tone="info">
          Confira sua caixa de entrada e também a pasta de spam. O link é único e permite gerar um kit no MVP.
        </Alert>
        <div className="mt-6 flex justify-center">
          <Button href="/suporte" variant="ghost">
            Preciso de ajuda
          </Button>
        </div>
      </Card>
    </main>
  );
}
