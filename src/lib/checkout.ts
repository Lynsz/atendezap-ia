export type CheckoutPlan = "basic" | "pro" | "premium";

export const checkoutUrls: Record<CheckoutPlan, string | undefined> = {
  basic: process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_BASIC,
  pro: process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_PRO,
  premium: process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_PREMIUM
};

export function getCheckoutUrl(plan: CheckoutPlan) {
  return checkoutUrls[plan]?.trim() || undefined;
}

export function hasConfiguredCheckout() {
  return Boolean(getCheckoutUrl("basic") || getCheckoutUrl("pro") || getCheckoutUrl("premium"));
}
