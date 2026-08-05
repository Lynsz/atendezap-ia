import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/add_whatsapp_phase_4_media.sql"), "utf8");

describe("WhatsApp media migration", () => {
  it("ativa RLS e restringe leitura ao proprietário", () => {
    expect(migration).toContain("alter table public.whatsapp_media enable row level security");
    expect(migration).toContain('create policy "whatsapp_media_select_own"');
    expect(migration).toContain("(select auth.uid()) = user_id");
    expect(migration).not.toMatch(/grant\s+(insert|update|delete)\s+on\s+public\.whatsapp_media/i);
  });

  it("mantém bucket privado e não guarda URL temporária ou arquivo no banco", () => {
    expect(migration).toMatch(/'whatsapp-media'[\s\S]*false/);
    expect(migration).not.toMatch(/temporary_url|provider_url|file_bytes|bytea/i);
    expect(migration).toContain("Raw webhook payloads, temporary provider URLs and file bytes");
  });
});
