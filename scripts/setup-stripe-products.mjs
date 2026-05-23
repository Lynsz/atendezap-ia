import Stripe from "stripe";

const DEFAULTS = {
  currency: "brl",
  starterAmountCents: 4900,
  proAmountCents: 9700,
  premiumAmountCents: 19700,
  proFirstMonthAmountCents: 2900
};

const plans = [
  {
    id: "starter",
    productName: "AtendeZap IA Starter",
    priceEnv: "STRIPE_PRICE_STARTER",
    amountEnv: "STRIPE_STARTER_AMOUNT_CENTS",
    defaultAmountCents: DEFAULTS.starterAmountCents
  },
  {
    id: "pro",
    productName: "AtendeZap IA Pro",
    priceEnv: "STRIPE_PRICE_PRO",
    amountEnv: "STRIPE_PRO_AMOUNT_CENTS",
    defaultAmountCents: DEFAULTS.proAmountCents
  },
  {
    id: "premium",
    productName: "AtendeZap IA Premium",
    priceEnv: "STRIPE_PRICE_PREMIUM",
    amountEnv: "STRIPE_PREMIUM_AMOUNT_CENTS",
    defaultAmountCents: DEFAULTS.premiumAmountCents
  }
];

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} nao configurada.`);
  }
  return value;
}

function moneyEnv(name, fallback) {
  const rawValue = process.env[name]?.trim();
  if (!rawValue) return fallback;

  const value = Number.parseInt(rawValue, 10);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} deve ser um valor inteiro positivo em centavos.`);
  }

  return value;
}

function currencyEnv() {
  const value = process.env.STRIPE_CURRENCY?.trim().toLowerCase() || DEFAULTS.currency;
  if (!/^[a-z]{3}$/.test(value)) {
    throw new Error("STRIPE_CURRENCY deve usar codigo ISO de 3 letras, por exemplo brl.");
  }
  return value;
}

async function findOrCreateProduct(stripe, plan) {
  const products = await stripe.products.list({ active: true, limit: 100 });
  const existing = products.data.find(
    (product) => product.metadata?.atendezap_plan === plan.id || product.name === plan.productName
  );

  if (existing) return existing;

  return stripe.products.create({
    name: plan.productName,
    metadata: {
      app: "atendezap-ia",
      atendezap_plan: plan.id
    }
  });
}

async function findOrCreateMonthlyPrice(stripe, product, plan, amountCents, currency) {
  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 });
  const existing = prices.data.find(
    (price) =>
      price.currency === currency &&
      price.unit_amount === amountCents &&
      price.recurring?.interval === "month" &&
      price.metadata?.atendezap_plan === plan.id
  );

  if (existing) return existing;

  return stripe.prices.create({
    product: product.id,
    unit_amount: amountCents,
    currency,
    recurring: { interval: "month" },
    metadata: {
      app: "atendezap-ia",
      atendezap_plan: plan.id
    }
  });
}

async function findOrCreateProFirstMonthCoupon(stripe, proAmountCents, firstMonthAmountCents, currency) {
  const configuredCouponId = process.env.STRIPE_PRO_FIRST_MONTH_COUPON_ID?.trim();
  if (configuredCouponId) {
    return stripe.coupons.retrieve(configuredCouponId);
  }

  const discountAmountCents = proAmountCents - firstMonthAmountCents;
  if (discountAmountCents <= 0) {
    throw new Error("STRIPE_PRO_FIRST_MONTH_AMOUNT_CENTS deve ser menor que STRIPE_PRO_AMOUNT_CENTS para criar o cupom.");
  }

  const coupons = await stripe.coupons.list({ limit: 100 });
  const existing = coupons.data.find(
    (coupon) =>
      coupon.metadata?.app === "atendezap-ia" &&
      coupon.metadata?.atendezap_plan === "pro" &&
      coupon.metadata?.offer === "first_month_29" &&
      coupon.amount_off === discountAmountCents &&
      coupon.currency === currency &&
      coupon.duration === "once" &&
      coupon.valid
  );

  if (existing) return existing;

  return stripe.coupons.create({
    name: "AtendeZap IA Pro - primeiro mes por R$ 29",
    amount_off: discountAmountCents,
    currency,
    duration: "once",
    metadata: {
      app: "atendezap-ia",
      atendezap_plan: "pro",
      offer: "first_month_29",
      target_first_month_amount_cents: String(firstMonthAmountCents)
    }
  });
}

async function main() {
  const stripe = new Stripe(requiredEnv("STRIPE_SECRET_KEY"), {
    typescript: true
  });
  const currency = currencyEnv();
  const priceIds = {};

  for (const plan of plans) {
    const amountCents = moneyEnv(plan.amountEnv, plan.defaultAmountCents);
    const product = await findOrCreateProduct(stripe, plan);
    const price = await findOrCreateMonthlyPrice(stripe, product, plan, amountCents, currency);
    priceIds[plan.priceEnv] = price.id;
  }

  const proAmountCents = moneyEnv("STRIPE_PRO_AMOUNT_CENTS", DEFAULTS.proAmountCents);
  const firstMonthAmountCents = moneyEnv("STRIPE_PRO_FIRST_MONTH_AMOUNT_CENTS", DEFAULTS.proFirstMonthAmountCents);
  const coupon = await findOrCreateProFirstMonthCoupon(stripe, proAmountCents, firstMonthAmountCents, currency);

  console.log("\nProdutos, prices e cupom Stripe prontos. Copie para .env.local e Vercel:\n");
  for (const envName of ["STRIPE_PRICE_STARTER", "STRIPE_PRICE_PRO", "STRIPE_PRICE_PREMIUM"]) {
    console.log(`${envName}=${priceIds[envName]}`);
  }
  console.log(`STRIPE_PRO_FIRST_MONTH_COUPON_ID=${coupon.id}`);
  console.log("\nSTRIPE_SECRET_KEY nao foi impresso. Rode primeiro em Stripe test mode.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
