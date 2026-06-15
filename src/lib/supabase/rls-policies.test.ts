import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));

function readRepoFile(relativePath: string) {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

describe("politicas RLS criticas", () => {
  it("mantem historico de respostas isolado por usuario", () => {
    const migration = readRepoFile("supabase/migrations/0001_initial_schema.sql");

    expect(migration).toContain("alter table public.generated_responses enable row level security");
    expect(migration).toContain('create policy "generated_responses_select_own"');
    expect(migration).toContain('create policy "generated_responses_insert_own"');
    expect(migration).toContain("using ((select auth.uid()) = user_id)");
    expect(migration).toContain("with check ((select auth.uid()) = user_id)");
  });

  it("mantem respostas salvas isoladas e vinculadas a historico do mesmo usuario", () => {
    const migration = readRepoFile("supabase/migrations/0012_saved_responses.sql");

    expect(migration).toContain("alter table public.saved_responses enable row level security");
    expect(migration).toContain('create policy "saved_responses_select_own"');
    expect(migration).toContain('create policy "saved_responses_insert_own"');
    expect(migration).toContain('create policy "saved_responses_update_own"');
    expect(migration).toContain('create policy "saved_responses_delete_own"');
    expect(migration).toContain("gr.user_id = (select auth.uid())");
  });

  it("mantem feedbacks de IA isolados e vinculados a resposta do proprio usuario", () => {
    const migration = readRepoFile("supabase/migrations/0011_ai_response_feedback.sql");

    expect(migration).toContain("alter table public.ai_response_feedback enable row level security");
    expect(migration).toContain('create policy "ai_response_feedback_select_own"');
    expect(migration).toContain('create policy "ai_response_feedback_insert_own"');
    expect(migration).toContain('create policy "ai_response_feedback_update_own"');
    expect(migration).toContain("gr.user_id = (select auth.uid())");
  });

  it("mantem assinatura somente leitura para o usuario autenticado", () => {
    const migration = readRepoFile("supabase/migrations/0001_initial_schema.sql");
    const mvpMigration = readRepoFile("supabase/migrations/0021_create_mvp_core_tables.sql");

    expect(migration).toContain("alter table public.subscriptions enable row level security");
    expect(migration).toContain('create policy "subscriptions_select_own"');
    expect(migration).toContain("using ((select auth.uid()) = user_id)");
    expect(migration).toContain("revoke all privileges on public.subscriptions from anon, authenticated");
    expect(migration).toContain("grant select on public.subscriptions to authenticated");
    expect(mvpMigration).toContain('drop policy if exists "subscriptions_insert_own" on public.subscriptions');
    expect(mvpMigration).toContain('drop policy if exists "subscriptions_update_own" on public.subscriptions');
    expect(mvpMigration).toContain('drop policy if exists "subscriptions_delete_own" on public.subscriptions');
    expect(mvpMigration).toContain("revoke all privileges on public.subscriptions from anon, authenticated");
    expect(mvpMigration).toContain("grant select on public.subscriptions to authenticated");
  });

  it("mantem user_profiles isolado por usuario com RLS e user_id unico", () => {
    const migration = readRepoFile("supabase/migrations/0021_create_mvp_core_tables.sql");

    expect(migration).toContain("create table if not exists public.user_profiles");
    expect(migration).toContain("user_id uuid not null references auth.users(id) on delete cascade");
    expect(migration).toContain("create unique index if not exists user_profiles_user_id_unique_idx");
    expect(migration).toContain("alter table public.user_profiles enable row level security");
    expect(migration).toContain('create policy "user_profiles_select_own"');
    expect(migration).toContain('create policy "user_profiles_insert_own"');
    expect(migration).toContain('create policy "user_profiles_update_own"');
    expect(migration).toContain("using ((select auth.uid()) = user_id)");
    expect(migration).toContain("with check ((select auth.uid()) = user_id)");
  });

  it("mantem ai_usage somente leitura para o client e mutacao pelo backend", () => {
    const migration = readRepoFile("supabase/migrations/0021_create_mvp_core_tables.sql");

    expect(migration).toContain("create table if not exists public.ai_usage");
    expect(migration).toContain("create unique index if not exists ai_usage_user_month_unique_idx");
    expect(migration).toContain("alter table public.ai_usage enable row level security");
    expect(migration).toContain('create policy "ai_usage_select_own"');
    expect(migration).toContain('create policy "ai_usage_no_client_insert"');
    expect(migration).toContain('create policy "ai_usage_no_client_update"');
    expect(migration).toContain('create policy "ai_usage_no_client_delete"');
    expect(migration).toContain("with check (false)");
    expect(migration).toContain("using (false)");
    expect(migration).toContain("revoke all on public.ai_usage from anon, authenticated");
    expect(migration).toContain("grant select on public.ai_usage to authenticated");
  });

  it("mantem leads e eventos internos sem acesso direto pelo client", () => {
    const initialMigration = readRepoFile("supabase/migrations/0001_initial_schema.sql");
    const ebookMigration = readRepoFile("supabase/migrations/0002_funnel_pricing_ebook.sql");
    const appEventsMigration = readRepoFile("supabase/migrations/0024_app_events.sql");

    expect(initialMigration).toContain("alter table public.events enable row level security");
    expect(initialMigration).toContain('create policy "events_no_client_access"');
    expect(initialMigration).toContain("revoke all on public.purchasers, public.orders, public.kits, public.support_requests, public.events from anon, authenticated");
    expect(ebookMigration).toContain("alter table public.ebook_leads enable row level security");
    expect(ebookMigration).toContain('create policy "ebook_leads_no_client_access"');
    expect(ebookMigration).toContain("revoke all on public.ebook_leads from anon, authenticated");
    expect(appEventsMigration).toContain("alter table public.app_events enable row level security");
    expect(appEventsMigration).toContain('create policy "app_events_insert_own_or_anonymous"');
    expect(appEventsMigration).toContain('create policy "app_events_no_select_for_clients"');
    expect(appEventsMigration).toContain("revoke all on public.app_events from anon, authenticated");
  });

  it("mantem campanhas e resultados sem acesso direto pelo client", () => {
    const migration = readRepoFile("supabase/migrations/0019_campaign_experiments.sql");
    const campaignsRoute = readRepoFile("src/app/api/admin/campaigns/route.ts");
    const campaignUpdateRoute = readRepoFile("src/app/api/admin/campaigns/[id]/route.ts");
    const campaignResultsRoute = readRepoFile("src/app/api/admin/campaigns/[id]/results/route.ts");

    expect(migration).toContain("alter table public.campaign_experiments enable row level security");
    expect(migration).toContain("alter table public.campaign_results enable row level security");
    expect(migration).toContain('create policy "campaign_experiments_no_client_access"');
    expect(migration).toContain('create policy "campaign_results_no_client_access"');
    expect(migration).toContain("revoke all on public.campaign_experiments from anon, authenticated");
    expect(migration).toContain("revoke all on public.campaign_results from anon, authenticated");
    expect(campaignsRoute).toContain("requireAdmin(request)");
    expect(campaignUpdateRoute).toContain("requireAdmin(request)");
    expect(campaignResultsRoute).toContain("requireAdmin(request)");
  });

  it("mantem insights de produto sem acesso direto pelo client", () => {
    const migration = readRepoFile("supabase/migrations/0020_product_insights.sql");
    const insightsRoute = readRepoFile("src/app/api/admin/product-insights/route.ts");
    const insightUpdateRoute = readRepoFile("src/app/api/admin/product-insights/[id]/route.ts");

    expect(migration).toContain("alter table public.product_insights enable row level security");
    expect(migration).toContain('create policy "product_insights_no_client_access"');
    expect(migration).toContain("revoke all on public.product_insights from anon, authenticated");
    expect(insightsRoute).toContain("requireAdmin(request)");
    expect(insightUpdateRoute).toContain("requireAdmin(request)");
  });

  it("mantem solicitacoes de suporte isoladas por usuario autenticado", () => {
    const migration = readRepoFile("supabase/migrations/0017_support_requests_workflow.sql");

    expect(migration).toContain('create policy "support_requests_select_own"');
    expect(migration).toContain('create policy "support_requests_insert_own"');
    expect(migration).toContain("using ((select auth.uid()) = user_id)");
    expect(migration).toContain("with check ((select auth.uid()) = user_id)");
    expect(migration).toContain("revoke all on public.support_requests from anon, authenticated");
    expect(migration).toContain("grant select, insert on public.support_requests to authenticated");
  });

  it("mantem admin protegido por requireAdmin", () => {
    const admin = readRepoFile("src/lib/admin.ts");
    const overviewRoute = readRepoFile("src/app/api/admin/overview/route.ts");
    const metricsRoute = readRepoFile("src/app/api/admin/metrics/route.ts");
    const campaignRoute = readRepoFile("src/app/api/admin/campaign-report/route.ts");

    expect(admin).toContain('import "server-only";');
    expect(admin).toContain("isAdminEmail(user.email)");
    expect(overviewRoute).toContain("requireAdmin(request)");
    expect(metricsRoute).toContain("requireAdmin(request)");
    expect(campaignRoute).toContain("requireAdmin(request)");
  });

  it("mantem solicitacoes de dados isoladas por usuario", () => {
    const migration = readRepoFile("supabase/migrations/0016_data_requests.sql");

    expect(migration).toContain("alter table public.data_requests enable row level security");
    expect(migration).toContain('create policy "data_requests_select_own"');
    expect(migration).toContain('create policy "data_requests_insert_own"');
    expect(migration).toContain("using ((select auth.uid()) = user_id)");
    expect(migration).toContain("with check ((select auth.uid()) = user_id)");
    expect(migration).toContain("grant select, insert on public.data_requests to authenticated");
  });
});
