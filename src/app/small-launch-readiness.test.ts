import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

function readRepoFile(relativePath: string) {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

describe("prontidao para lancamento pequeno", () => {
  it("cria documentos operacionais do lancamento pequeno", () => {
    const plan = readRepoFile("docs/small-launch-plan.md");
    const checklist = readRepoFile("docs/small-launch-checklist.md");
    const invite = readRepoFile("docs/small-launch-invite-copy.md");
    const dailyReport = readRepoFile("docs/small-launch-daily-report.md");
    const pauseCriteria = readRepoFile("docs/small-launch-pause-criteria.md");
    const analysisTemplate = readRepoFile("docs/small-launch-analysis-template.md");
    const analysis = readRepoFile("docs/small-launch-analysis.md");
    const diagnosis = readRepoFile("docs/small-launch-funnel-diagnosis.md");
    const fixPlan = readRepoFile("docs/small-launch-fix-plan.md");
    const decision = readRepoFile("docs/small-launch-decision.md");
    const nextRound = readRepoFile("docs/next-small-launch-plan.md");
    const campaignPlan = readRepoFile("docs/first-small-campaign-plan.md");

    expect(plan).toContain("Metricas obrigatorias");
    expect(plan).toContain("checkout iniciado");
    expect(checklist).toContain("eventos sem dados sensiveis");
    expect(invite).toContain("Ela nao envia mensagens automaticamente no WhatsApp.");
    expect(dailyReport).toContain("Decisao do dia");
    expect(pauseCriteria).toContain("usuario comum acessar admin");
    expect(analysisTemplate).toContain("Principal gargalo");
    expect(analysis).toContain("Sem dados suficientes");
    expect(diagnosis).toContain("Gargalo principal");
    expect(fixPlan).toContain("Nenhum P0 confirmado");
    expect(decision).toContain("Repetir rodada pequena");
    expect(nextRound).toContain("Validar as correcoes feitas apos o lancamento pequeno.");
    expect(campaignPlan).toContain("bloqueado ate correcoes e dados da proxima rodada pequena");
  });

  it("mantem landing com aviso obrigatorio e CTAs principais", () => {
    const landing = readRepoFile("src/app/page.tsx");

    expect(landing).toContain("O AtendeZap IA gera respostas para você copiar, ajustar e enviar. Ele não envia mensagens automaticamente no WhatsApp.");
    expect(landing).toContain('href="/cadastro"');
    expect(landing).toContain('href="/demo"');
    expect(landing).toContain('href="/precos"');
    expect(landing).not.toMatch(/resultado garantido|vagas acabando|ultimas vagas/i);
  });

  it("mantem pricing e assinatura com Pro R$ 29, Stripe e cancelamento claro", () => {
    const plans = readRepoFile("src/config/plans.ts");
    const pricing = readRepoFile("src/components/pricing/PricingPageContent.tsx");
    const billing = readRepoFile("src/components/pages/BillingPage.tsx");
    const checkout = readRepoFile("src/components/checkout/StripeCheckoutButton.tsx");
    const checkoutRoute = readRepoFile("src/app/api/stripe/create-checkout-session/route.ts");

    expect(plans).toContain("R$ 29 no primeiro mês");
    expect(pricing).toContain("Primeiro mês por R$ 29 para novos usuários");
    expect(billing).toContain("Primeiro mês por R$ 29 para novos usuários");
    expect(billing).toContain("Cancelamento, troca de cartão e alteração de cobrança real devem ser feitos pelo portal da Stripe.");
    expect(checkout).toContain("Não foi possível iniciar o checkout agora. Verifique a configuração do Stripe.");
    expect(checkoutRoute).toContain("authenticateRequest(request)");
    expect(checkoutRoute).toContain("login para iniciar a assinatura");
  });

  it("prepara admin para acompanhar lancamento pequeno sem conteudo sensivel", () => {
    const admin = readRepoFile("src/components/admin/AdminDashboardPage.tsx");

    expect(admin).toContain("Lancamento pequeno");
    expect(admin).toContain("Acompanhamento do lancamento pequeno");
    expect(admin).toContain("Usuarios convidados");
    expect(admin).toContain("Sem dados suficientes");
    expect(admin).toContain("Visitantes");
    expect(admin).toContain("Cadastros");
    expect(admin).toContain("Onboardings");
    expect(admin).toContain("Primeiras respostas");
    expect(admin).toContain("Respostas copiadas");
    expect(admin).toContain("Respostas salvas");
    expect(admin).toContain("Templates usados");
    expect(admin).toContain("Feedbacks positivos");
    expect(admin).toContain("Feedbacks negativos");
    expect(admin).toContain("Suporte aberto");
    expect(admin).toContain("Limites atingidos");
    expect(admin).toContain("Checkouts");
    expect(admin).toContain("Assinaturas concluidas");
    expect(admin).toContain("Revisar onboarding");
    expect(admin).toContain("Revisar dashboard");
    expect(admin).toContain("Revisar qualidade da IA e CTAs");
    expect(admin).toContain("Revisar prompt/templates");
    expect(admin).toContain("Revisar Stripe/pricing/confianca");
    expect(admin).not.toContain("customer_question");
    expect(admin).not.toContain("generated_answer");
    expect(admin).not.toContain("payment_method");
  });

  it("mantem onboarding sem promessa de automacao de WhatsApp", () => {
    const onboarding = readRepoFile("src/components/pages/OnboardingPage.tsx");
    const settings = readRepoFile("src/components/pages/SettingsPage.tsx");

    expect(onboarding).toContain("Gerar sugestão de mensagem");
    expect(onboarding).toContain("organizar atendimentos");
    expect(onboarding).not.toContain("automatizar atendimento");
    expect(onboarding).not.toContain("Gerar mensagem automática");
    expect(settings).toContain("manter respostas consistentes");
    expect(settings).not.toContain("automatizar atendimento");
  });
});
