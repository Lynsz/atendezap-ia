import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/add_whatsapp_phase_5_template_sync.sql"), "utf8");

describe("WhatsApp Phase 5 template RLS", () => {
  it("ativa RLS no histórico e limita leitura ao proprietário", () => {
    expect(migration).toContain("alter table public.whatsapp_template_status_history enable row level security");
    expect(migration).toContain("for select to authenticated using ((select auth.uid()) = user_id)");
    expect(migration).toContain("grant select on public.whatsapp_template_status_history to authenticated");
    expect(migration).not.toMatch(/grant\s+(insert|update|delete)\s+on\s+public\.whatsapp_template_status_history/i);
  });

  it("não cria coluna para payload bruto ou valores reais de variáveis", () => {
    expect(migration).not.toMatch(/raw_payload|webhook_payload|variable_values|access_token/i);
    expect(migration).toContain("variables_schema");
    expect(migration).toContain("components");
  });
});
