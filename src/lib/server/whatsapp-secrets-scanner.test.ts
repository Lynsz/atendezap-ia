import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const scanner = require("../../../scripts/check-secrets.js") as {
  isSafePlaceholder(value: string): boolean;
  scanDangerousPublicEnvReference(file: string, line: string, lineNumber: number, findings: unknown[]): void;
  scanEnvAssignment(file: string, line: string, lineNumber: number, findings: unknown[]): void;
  sensitiveEnvNames: string[];
  secretPatterns: Array<{ name: string }>;
  forbiddenFilePatterns: Array<{ name: string }>;
};

describe("WhatsApp secrets scanner", () => {
  it("permite placeholders documentados", () => {
    for (const value of ["", "placeholder", "test-whatsapp-token", "example", "dummy"]) {
      expect(scanner.isSafePlaceholder(value)).toBe(true);
    }
  });

  it("trata access token, app secret e verify token como envs sensíveis", () => {
    expect(scanner.sensitiveEnvNames).toEqual(expect.arrayContaining(["WHATSAPP_ACCESS_TOKEN", "WHATSAPP_APP_SECRET", "WHATSAPP_VERIFY_TOKEN", "WHATSAPP_BUSINESS_ACCOUNT_ID", "INTERNAL_JOB_SECRET", "META_APP_SECRET", "WHATSAPP_TOKEN_ENCRYPTION_KEY"]));
    expect(scanner.secretPatterns.map((item: { name: string }) => item.name)).toEqual(expect.arrayContaining(["Supabase secret key", "Authorization Bearer literal", "WhatsApp temporary media URL"]));
    expect(scanner.forbiddenFilePatterns.map((item: { name: string }) => item.name)).toEqual(expect.arrayContaining(["arquivo HAR", "dump de mídia WhatsApp", "dump ou export real de templates Meta"]));
    const findings: unknown[] = [];
    scanner.scanEnvAssignment("fixture.env", "WHATSAPP_APP_SECRET=valor-real-nao-versionar", 1, findings);
    expect(findings).toHaveLength(1);
    const encryptionFindings: unknown[] = [];
    scanner.scanEnvAssignment("fixture.env", "WHATSAPP_TOKEN_ENCRYPTION_KEY=valor-real-nao-versionar", 1, encryptionFindings);
    expect(encryptionFindings).toHaveLength(1);
  });

  it("detecta secrets genericos e bloqueia secrets publicados no bundle client", () => {
    const databaseFindings: unknown[] = [];
    const databaseFixture = "DATABASE_URL=postgresql://usuario:" + "senha@host/banco";
    scanner.scanEnvAssignment("fixture.env", databaseFixture, 1, databaseFindings);
    expect(databaseFindings).toHaveLength(1);

    const publicAssignmentFindings: unknown[] = [];
    scanner.scanEnvAssignment("fixture.env", "NEXT_PUBLIC_OPENAI_API_KEY=", 1, publicAssignmentFindings);
    expect(publicAssignmentFindings).toHaveLength(1);

    const publicReferenceFindings: unknown[] = [];
    scanner.scanDangerousPublicEnvReference(
      "fixture.ts",
      "const key = process.env.NEXT_PUBLIC_" + "OPENAI_API_KEY;",
      1,
      publicReferenceFindings,
    );
    expect(publicReferenceFindings).toHaveLength(1);
  });
});
