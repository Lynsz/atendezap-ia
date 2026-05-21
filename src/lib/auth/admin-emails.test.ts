import { describe, expect, it } from "vitest";
import { getAdminEmailsFromEnv, isAdminEmailAllowed } from "./admin-emails";

describe("admin email helpers", () => {
  it("aceita e-mail admin unico", () => {
    expect(isAdminEmailAllowed("admin@example.com", getAdminEmailsFromEnv("admin@example.com"))).toBe(true);
  });

  it("aceita multiplos e-mails separados por virgula", () => {
    const admins = getAdminEmailsFromEnv("admin@example.com,owner@example.com");

    expect(isAdminEmailAllowed("owner@example.com", admins)).toBe(true);
  });

  it("ignora espacos e caixa alta/baixa", () => {
    const admins = getAdminEmailsFromEnv(" Admin@Example.com , Owner@Example.com ");

    expect(isAdminEmailAllowed("admin@example.com", admins)).toBe(true);
    expect(isAdminEmailAllowed(" OWNER@example.com ", admins)).toBe(true);
  });

  it("nao libera usuario comum", () => {
    const admins = getAdminEmailsFromEnv("admin@example.com");

    expect(isAdminEmailAllowed("cliente@example.com", admins)).toBe(false);
  });

  it("nao libera e-mail vazio", () => {
    expect(getAdminEmailsFromEnv("")).toEqual([]);
    expect(isAdminEmailAllowed("", [])).toBe(false);
    expect(isAdminEmailAllowed(null, ["admin@example.com"])).toBe(false);
  });
});
