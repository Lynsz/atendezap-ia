import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  getSupabaseAdmin: vi.fn(() => ({ from: vi.fn() }))
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth/server", () => ({
  requireUser: mocks.requireUser
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseAdmin: mocks.getSupabaseAdmin
}));

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    mocks.requireUser.mockReset();
    mocks.getSupabaseAdmin.mockClear();
  });

  it("retorna 403 para usuario comum", async () => {
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
    mocks.requireUser.mockResolvedValue({ id: "user_1", email: "cliente@example.com" });

    const { requireAdmin } = await import("./admin");

    await expect(requireAdmin(new Request("https://app.example.test/api/admin/overview"))).rejects.toMatchObject({
      status: 403,
      message: "Acesso restrito a administradores."
    });
    expect(mocks.getSupabaseAdmin).not.toHaveBeenCalled();
  });

  it("autoriza admin configurado e entrega client service role apenas no backend", async () => {
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
    mocks.requireUser.mockResolvedValue({ id: "admin_1", email: "Admin@Example.com" });

    const { requireAdmin } = await import("./admin");
    const result = await requireAdmin(new Request("https://app.example.test/api/admin/overview"));

    expect(result.user.email).toBe("Admin@Example.com");
    expect(mocks.getSupabaseAdmin).toHaveBeenCalledTimes(1);
  });
});
