import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("retorna status simples sem dados sensiveis", async () => {
    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      status: "ok",
      app: "AtendeZap IA",
      services: {
        supabase: expect.any(Boolean),
        openai: expect.any(Boolean),
        stripe: expect.any(Boolean),
        resend: expect.any(Boolean)
      }
    });
    expect(Object.keys(body).sort()).toEqual(["app", "services", "status"]);
    expect(JSON.stringify(body)).not.toMatch(/sk_|pk_|whsec|secret|token|key|email|user|service_role/i);
  });
});
