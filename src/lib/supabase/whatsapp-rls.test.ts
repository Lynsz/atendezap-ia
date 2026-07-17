import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/create_whatsapp_integration_tables.sql"), "utf8");

describe("WhatsApp RLS migration", () => {
  const tables = ["whatsapp_connections", "whatsapp_contacts", "whatsapp_conversations", "whatsapp_messages", "whatsapp_suggested_replies"];

  it("ativa RLS e limita leitura ao auth.uid em todas as tabelas", () => {
    for (const table of tables) {
      expect(migration).toContain(`alter table public.${table} enable row level security`);
      expect(migration).toContain(`create policy \"${table}_select_own\"`);
    }
    expect(migration.match(/\(select auth\.uid\(\)\) = user_id/g)).toHaveLength(5);
  });

  it("concede ao client somente SELECT, impedindo forjar inbound/outbound", () => {
    expect(migration).not.toMatch(/grant\s+(insert|update|delete)\s+on\s+public\.whatsapp_/i);
    expect(migration.match(/grant select on public\.whatsapp_/g)).toHaveLength(5);
  });

  it("mantém service role fora dos componentes client", () => {
    const dashboard = readFileSync(resolve(process.cwd(), "src/components/whatsapp/WhatsAppDashboardPage.tsx"), "utf8");
    const configuration = readFileSync(resolve(process.cwd(), "src/components/whatsapp/WhatsAppConfigurationPage.tsx"), "utf8");
    expect(`${dashboard}\n${configuration}`).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(`${dashboard}\n${configuration}`).not.toContain("@/lib/supabase/server");
  });
});
