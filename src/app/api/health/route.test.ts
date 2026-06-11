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
      version: expect.any(String),
      environment: expect.any(String),
      timestamp: expect.any(String)
    });
    expect(JSON.stringify(body)).not.toMatch(/secret|token|key|email|user|supabase|stripe|openai/i);
  });
});
