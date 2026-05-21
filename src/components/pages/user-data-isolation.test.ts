import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

function readSource(relativePath: string) {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
}

describe("isolamento multiusuario nas telas SaaS", () => {
  it("dashboard consulta dados sensiveis filtrando pelo user_id da sessao", () => {
    const source = readSource("./SaasDashboardPage.tsx");

    for (const table of ["businesses", "generated_responses", "customers", "subscriptions"]) {
      expect(source).toContain(`from("${table}")`);
    }
    expect(source.match(/\.eq\("user_id", user\.id\)/g)?.length ?? 0).toBeGreaterThanOrEqual(6);
    expect(source).toContain('.update(payload).eq("id", existingBusiness.id).eq("user_id", user.id)');
    expect(source).toContain('.delete().eq("id", itemId).eq("user_id", user.id)');
    expect(source).toContain('.update(updates).eq("id", item.id).eq("user_id", user.id)');
    expect(source).toContain("user_id: user.id");
  });

  it("assinatura usa a sessao para buscar assinatura do usuario atual", () => {
    const source = readSource("./BillingPage.tsx");

    expect(source).toContain('from("subscriptions")');
    expect(source).toContain('.eq("user_id", user.id)');
    expect(source).not.toContain('user_id: String(formData.get("user_id")');
  });
});
