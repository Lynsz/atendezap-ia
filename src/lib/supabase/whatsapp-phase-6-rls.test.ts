import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/add_whatsapp_phase_6_embedded_signup.sql"), "utf8");

describe("WhatsApp Phase 6 multitenant migration", () => {
  it("keeps connection and event reads isolated by auth.uid", () => {
    expect(migration).toContain("alter table public.whatsapp_connections enable row level security");
    expect(migration).toContain("create policy \"whatsapp_connection_events_select_own\"");
    expect(migration).toMatch(/\(select auth\.uid\(\)\) = user_id/);
  });

  it("never grants the encrypted token column to authenticated users", () => {
    expect(migration).toContain("revoke all on public.whatsapp_connections from anon, authenticated");
    const grant = migration.match(/grant select \(([\s\S]*?)\) on public\.whatsapp_connections to authenticated;/i)?.[1] || "";
    expect(grant).not.toContain("access_token_encrypted");
    expect(grant).toContain("phone_number_id");
  });

  it("adds connection indexes to all Phase 6 dependent tables", () => {
    for (const table of ["whatsapp_messages", "whatsapp_media", "whatsapp_templates", "whatsapp_suggested_replies", "whatsapp_audit_log", "whatsapp_webhook_events", "whatsapp_send_attempts"]) {
      expect(migration).toMatch(new RegExp(`${table}\\(connection_id`));
    }
  });
});
