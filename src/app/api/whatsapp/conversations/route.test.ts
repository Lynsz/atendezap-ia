import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({ requireUser: vi.fn(), getSupabaseAdmin: vi.fn(), trackServerAppEvent: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/server", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin: mocks.getSupabaseAdmin }));
vi.mock("@/lib/analytics/server", () => ({ trackServerAppEvent: mocks.trackServerAppEvent }));

describe("WhatsApp conversation APIs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireUser.mockResolvedValue({ id: "user-a" });
  });

  it("listar conversas exige login", async () => {
    mocks.requireUser.mockRejectedValue(new AppError("Sessão inválida.", 401));
    const { GET } = await import("./route");
    const response = await GET(new Request("https://app.test/api/whatsapp/conversations"));
    expect(response.status).toBe(401);
    expect(mocks.getSupabaseAdmin).not.toHaveBeenCalled();
  });

  it("filtra a lista pelo usuário da sessão", async () => {
    const eq = vi.fn();
    const chain: Record<string, unknown> = {};
    chain.select = vi.fn(() => chain);
    chain.eq = eq.mockImplementation(() => chain);
    chain.order = vi.fn(() => chain);
    chain.limit = vi.fn(() => Promise.resolve({ data: [], error: null }));
    mocks.getSupabaseAdmin.mockReturnValue({ from: vi.fn(() => chain) });

    const { GET } = await import("./route");
    const response = await GET(new Request("https://app.test/api/whatsapp/conversations", { headers: { Authorization: "Bearer test-only" } }));
    expect(response.status).toBe(200);
    expect(eq).toHaveBeenCalledWith("user_id", "user-a");
  });

  it("não retorna mensagens quando a conversa não pertence ao usuário", async () => {
    const eq = vi.fn();
    const chain: Record<string, unknown> = {};
    chain.select = vi.fn(() => chain);
    chain.eq = eq.mockImplementation(() => chain);
    chain.maybeSingle = vi.fn(() => Promise.resolve({ data: null, error: null }));
    mocks.getSupabaseAdmin.mockReturnValue({ from: vi.fn(() => chain) });

    const { GET } = await import("./[id]/messages/route");
    const response = await GET(new Request("https://app.test/api/whatsapp/conversations/11111111-1111-4111-8111-111111111111/messages"), {
      params: Promise.resolve({ id: "11111111-1111-4111-8111-111111111111" })
    });
    expect(response.status).toBe(404);
    expect(eq).toHaveBeenCalledWith("user_id", "user-a");
  });

  it("sugestão exige login e não importa helper de envio", async () => {
    mocks.requireUser.mockRejectedValue(new AppError("Sessão inválida.", 401));
    const { POST } = await import("./[id]/suggest-reply/route");
    const response = await POST(
      new Request("https://app.test/api/whatsapp/conversations/11111111-1111-4111-8111-111111111111/suggest-reply", { method: "POST", body: "{}" }),
      { params: Promise.resolve({ id: "11111111-1111-4111-8111-111111111111" }) }
    );
    expect(response.status).toBe(401);
    const source = readFileSync(resolve(process.cwd(), "src/app/api/whatsapp/conversations/[id]/suggest-reply/route.ts"), "utf8");
    expect(source).not.toContain("sendWhatsAppTextMessage");
  });
});
