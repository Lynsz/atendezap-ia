import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { KiwifyCheckoutButton } from "@/components/checkout/KiwifyCheckoutButton";
import type { CheckoutPlanId } from "@/config/checkout";
import { cn } from "@/lib/utils";

export function PricingCard({
  name,
  price,
  description,
  features,
  highlighted,
  disabled,
  planId,
  ctaLabel
}: {
  name: string;
  price: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  disabled?: boolean;
  planId?: CheckoutPlanId;
  ctaLabel?: string;
}) {
  const available = Boolean(planId) && !disabled;

  return (
    <Card className={cn("relative flex h-full flex-col", highlighted && "border-brand-500 shadow-soft")}>
      {highlighted ? <Badge className="absolute right-4 top-4">Recomendado</Badge> : null}
      <h3 className="text-xl font-extrabold text-ink">{name}</h3>
      <p className="mt-3 text-4xl font-black tracking-tight text-ink">{price}</p>
      {description ? <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p> : null}
      <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-slate-700">
        {features.map((feature) => (
          <li className="flex gap-2" key={feature}>
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {available && planId ? (
        <KiwifyCheckoutButton className="mt-7" fullWidth planId={planId} label={ctaLabel} />
      ) : (
        <Button className="mt-7 w-full" type="button" disabled variant={highlighted ? "primary" : "ghost"}>
          Em breve
        </Button>
      )}
    </Card>
  );
}
